import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const { name, email, phone, source } = await request.json()

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }
  if (!email?.trim() && !phone?.trim()) {
    return NextResponse.json({ error: 'Please provide at least an email or phone number' }, { status: 400 })
  }

  const normalizePhone = (p: string) => p?.replace(/\D/g, '').slice(-10) || ''
  const normPhone = normalizePhone(phone || '')
  const normEmail = (email || '').toLowerCase().trim()

  // 1. Search by email first
  let existing = null

  if (normEmail) {
    const { data } = await supabase
      .from('pph_clients')
      .select('id, name, stage, phone, email')
      .ilike('email', normEmail)
      .limit(1)
    existing = data?.[0] || null
  }

  // 2. Search by phone if no email match
  if (!existing && normPhone) {
    const { data } = await supabase
      .from('pph_clients')
      .select('id, name, stage, phone, email')
      .ilike('phone', `%${normPhone.slice(-7)}%`)
      .limit(1)
    existing = data?.[0] || null
  }

  // 3. Found existing — log activity and return
  if (existing) {
    await supabase.from('pph_call_logs').insert({
      client_id: existing.id,
      client_name: existing.name,
      logged_by_email: 'system@pph',
      call_type: 'Note',
      notes: `[Calculator] ${name} used the public purchase calculator.`,
    })
    return NextResponse.json({ clientId: existing.id, clientName: existing.name, isNew: false, matched: 'existing' })
  }

  // 4. Create new client
  const nameParts = name.trim().split(' ')
  const { data: created, error } = await supabase
    .from('pph_clients')
    .insert({
      name: name.trim(),
      email: normEmail || null,
      phone: phone?.trim() || null,
      stage: 'New Lead',
      priority: 'medium',
      next_action: `Follow up with ${nameParts[0]} — came in through the public purchase calculator`,
      notes: source ? `Source: ${source}` : '',
      referral_source: source || 'Public Calculator',
      liabilities: '[]',
      reo: '[]',
    })
    .select('id, name')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('pph_call_logs').insert({
    client_id: created!.id,
    client_name: created!.name,
    logged_by_email: 'system@pph',
    call_type: 'Note',
    notes: `[Calculator] New lead. Used the public purchase calculator. Email: ${normEmail || 'none'}, Phone: ${phone || 'none'}`,
  })

  return NextResponse.json({ clientId: created!.id, clientName: created!.name, isNew: true, matched: 'created' })
}
