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

  // Fetch client + recent calls
  const [{ data: client }, { data: calls }] = await Promise.all([
    supabase.from('pph_clients').select('*').eq('id', clientId).single(),
    supabase.from('pph_call_logs').select('*').eq('client_id', clientId).order('created_at', { ascending: false }).limit(10),
  ])

  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  const prompt = `You are a mortgage CRM assistant. Write a 3–5 paragraph plain-text summary of this client for the loan officer. No markdown, no headers, no bullets, no tables. Just clean paragraphs a LO would read before a call.

Cover: who they are, what they're trying to do, their financial picture (income, assets, credit), current deal status, and any risks or flags worth watching. Be specific with numbers when available. Write like a smart colleague briefing you, not a form.

Client data:
${JSON.stringify({
  name: client.name,
  stage: client.stage,
  loanType: client.loan_type,
  loanAmount: client.loan_amount,
  priority: client.priority,
  married: client.married,
  b1Name: client.b1_name,
  b1IncomeType: client.b1_income_type,
  b1MonthlyIncome: client.b1_monthly_income,
  b2Name: client.b2_name,
  b2IncomeType: client.b2_income_type,
  b2MonthlyIncome: client.b2_monthly_income,
  b1Assets: client.b1_assets,
  b1AssetsNotes: client.b1_assets_notes,
  b2Assets: client.b2_assets,
  b2AssetsNotes: client.b2_assets_notes,
  ficoScore: client.fico_score,
  targetPurchasePrice: client.target_purchase_price,
  targetArea: client.target_area,
  notes: client.notes,
  nextAction: client.next_action,
  followUpDate: client.follow_up_date,
  referralSource: client.referral_source,
  primaryLo: client.primary_lo,
  reo: client.reo,
  recentActivity: (calls || []).slice(0, 5).map((c: Record<string, unknown>) => ({ type: c.call_type, notes: c.notes, date: c.created_at })),
}, null, 2)}`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-haiku-4-5',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
    }),
  })

  if (!res.ok) return NextResponse.json({ error: 'AI request failed' }, { status: 500 })

  const json = await res.json()
  const summary = json.choices?.[0]?.message?.content?.trim() || ''

  // Save to DB
  await supabase.from('pph_clients').update({
    ai_summary: summary,
    ai_summary_updated_at: new Date().toISOString(),
  }).eq('id', clientId)

  return NextResponse.json({ summary })
}
