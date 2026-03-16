import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { clientId } = await request.json()
  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 })

  const [{ data: client }, { data: calls }, { data: chatMsgs }] = await Promise.all([
    supabase.from('pph_clients').select('*').eq('id', clientId).single(),
    supabase.from('pph_call_logs').select('*').eq('client_id', clientId).order('created_at', { ascending: false }).limit(10),
    supabase.from('pph_chat_messages').select('*').eq('client_id', clientId).order('created_at', { ascending: false }).limit(20),
  ])

  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  const clientData = {
    name: client.name, stage: client.stage, loanType: client.loan_type,
    loanAmount: client.loan_amount, priority: client.priority, married: client.married,
    b1Name: client.b1_name, b1IncomeType: client.b1_income_type, b1MonthlyIncome: client.b1_monthly_income,
    b2Name: client.b2_name, b2IncomeType: client.b2_income_type, b2MonthlyIncome: client.b2_monthly_income,
    b1Assets: client.b1_assets, b1AssetsNotes: client.b1_assets_notes,
    b2Assets: client.b2_assets, b2AssetsNotes: client.b2_assets_notes,
    ficoScore: client.fico_score, targetPurchasePrice: client.target_purchase_price,
    targetArea: client.target_area, notes: client.notes, nextAction: client.next_action,
    followUpDate: client.follow_up_date, referralSource: client.referral_source,
    primaryLo: client.primary_lo, reo: client.reo,
    recentCalls: (calls || []).slice(0, 5).map((c: Record<string, unknown>) => ({ type: c.call_type, notes: c.notes, date: c.created_at })),
    recentChat: (chatMsgs || []).reverse().slice(-10).map((m: Record<string, unknown>) => ({ role: m.role, content: String(m.content).slice(0, 200) })),
  }

  const prompt = `You are a smart mortgage CRM assistant. Analyze this client and return a JSON object.

Client data:
${JSON.stringify(clientData, null, 2)}

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "tldr": "1-2 sentence plain-English summary for quick reference",
  "summary": "3-5 paragraph plain-text summary covering who they are, what they want, financial picture (income/assets/credit), deal status, and key risks. No markdown.",
  "extractedFields": {
    "ficoScore": null or number if found in notes/chat,
    "targetPurchasePrice": null or number if found,
    "b1MonthlyIncome": null or number if confirmed qualifying income found,
    "b2MonthlyIncome": null or number if confirmed,
    "b1Assets": null or number if found,
    "stage": null or one of [New Lead, Pre-Approved, In Process, Waiting, App Sent, Processing, Closing, Funded, Closed, Lost] if status clearly changed,
    "loanType": null or one of [Purchase, Refi, DSCR, HE] if clear
  }
}

Only populate extractedFields values when you have high confidence from the data. Null means "don't change". Never invent numbers.`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-haiku-4-5',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 900,
    }),
  })

  if (!res.ok) return NextResponse.json({ error: 'AI request failed' }, { status: 500 })

  const aiJson = await res.json()
  const raw = aiJson.choices?.[0]?.message?.content?.trim() || ''

  let tldr = ''
  let summary = ''
  let extractedFields: Record<string, unknown> = {}

  try {
    const parsed = JSON.parse(raw)
    tldr = parsed.tldr || ''
    summary = parsed.summary || ''
    extractedFields = parsed.extractedFields || {}
  } catch {
    // Fallback: treat as plain summary
    summary = raw
  }

  // Build DB update — only apply non-null extracted fields
  const dbUpdate: Record<string, unknown> = {
    ai_summary: summary,
    ai_tldr: tldr,
    ai_summary_updated_at: new Date().toISOString(),
  }
  const fieldMap: Record<string, string> = {
    ficoScore: 'fico_score',
    targetPurchasePrice: 'target_purchase_price',
    b1MonthlyIncome: 'b1_monthly_income',
    b2MonthlyIncome: 'b2_monthly_income',
    b1Assets: 'b1_assets',
    stage: 'stage',
    loanType: 'loan_type',
  }
  for (const [k, col] of Object.entries(fieldMap)) {
    if (extractedFields[k] !== null && extractedFields[k] !== undefined) {
      dbUpdate[col] = extractedFields[k]
    }
  }

  await supabase.from('pph_clients').update(dbUpdate).eq('id', clientId)

  return NextResponse.json({ tldr, summary, extractedFields })
}
