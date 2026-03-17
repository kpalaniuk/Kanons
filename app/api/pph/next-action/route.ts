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

  const [{ data: client }, { data: calls }] = await Promise.all([
    supabase.from('pph_clients').select('*').eq('id', clientId).single(),
    supabase.from('pph_call_logs').select('*').eq('client_id', clientId).order('created_at', { ascending: false }).limit(5),
  ])

  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const prompt = `You are a mortgage CRM assistant. Based on this client's status, suggest the single most important next action as a brief, specific instruction (max 12 words). Be direct and actionable.

Client: ${client.name}
Stage: ${client.stage}
FICO: ${client.fico_score || 'unknown'}
Target price: ${client.target_purchase_price ? '$' + client.target_purchase_price : 'unknown'}
Loan type: ${client.loan_type || 'unknown'}
Notes: ${client.notes || 'none'}
Recent activity: ${(calls || []).slice(0,3).map((c: Record<string, unknown>) => `${c.call_type}: ${String(c.notes).slice(0,80)}`).join(' | ') || 'none'}

Reply with ONLY the next action text — no explanation, no quotes, no punctuation at end.`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'anthropic/claude-haiku-4-5',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 60,
    }),
  })

  if (!res.ok) return NextResponse.json({ error: 'AI failed' }, { status: 500 })
  const data = await res.json()
  const nextAction = data.choices?.[0]?.message?.content?.trim() || 'Follow up with client'

  // Save to DB with AI flag
  await supabase.from('pph_clients').update({
    next_action: nextAction,
    next_action_ai_generated: true,
    next_action_updated_at: new Date().toISOString(),
  }).eq('id', clientId)

  return NextResponse.json({ nextAction, aiGenerated: true })
}
