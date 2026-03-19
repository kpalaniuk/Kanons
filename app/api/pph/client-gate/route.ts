/**
 * POST /api/pph/client-gate
 * Public endpoint — no auth required.
 * 
 * Called when a client fills in their name/email/phone on the public calculator.
 * 1. Search pph_clients by email or phone
 * 2. If found — return existing client (linked)
 * 3. If not found — create new New Lead client with provided info
 * 4. Log an activity event noting calculator usage
 */
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

  const normalizePhone = (p: string) => p?.replace(/\D/g, '').slice(-10) || ''
  const normPhone = normalizePhone(phone || '')
  const normEmail = (email || '').toLowerCase().trim()

  // 1. Search by email first, then phone
  let existing = null

  if (normEmail) {
    // Search by email in notes/referral_source isn't ideal — check name match too
    const { data } = await supabase
      .from('pph_clients')
      .select('id, name, stage, phone, notes')
      .ilike('name', `%${name.trim().split(' ')[0]}%`)
      .limit(10)

    // Try to match on email in notes or exact name
    if (data?.length) {
      // Check if any have matching email stored in notes
      existing = data.find(c =>
        c.notes?.toLowerCase().includes(normEmail) ||
        c.name.toLowerCase() === name.trim().toLowerCase()
      ) || null
    }
  }

  if (!existing && normPhone) {
    const { data } = await supabase
      .from('pph_clients')
      .select('id, name, stage, phone, notes')
      .ilike('phone', `%${normPhone.slice(-7)}%`)
      .limit(5)

    existing = data?.[0] || null
  }

  // 2. Found existing — log activity and return
  if (existing) {
    await supabase.from('pph_call_logs').insert({
      client_id: existing.id,
      client_name: existing.name,
      logged_by_email: 'system@pph',
      call_type: 'Note',
      notes: `[Calculator] ${name} (${email || 'no email'}, ${phone || 'no phone'}) used the public purchase calculator.`,
    })

    return NextResponse.json({
      clientId: existing.id,
      clientName: existing.name,
      isNew: false,
      matched: 'existing',
    })
  }

  // 3. Create new client
  const nameParts = name.trim().split(' ')
  const notes = [
    email ? `Email: ${email}` : '',
    phone ? `Phone: ${phone}` : '',
    `Source: ${source || 'Public Calculator'}`,
  ].filter(Boolean).join('\n')

  const { data: created, error } = await supabase
    .from('pph_clients')
    .insert({
      name: name.trim(),
      phone: phone?.trim() || null,
      stage: 'New Lead',
      priority: 'medium',
      next_action: `Follow up with ${nameParts[0]} — came in through the public purchase calculator`,
      notes,
      referral_source: source || 'Public Calculator',
      liabilities: '[]',
      reo: '[]',
    })
    .select('id, name')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log activity
  await supabase.from('pph_call_logs').insert({
    client_id: created!.id,
    client_name: created!.name,
    logged_by_email: 'system@pph',
    call_type: 'Note',
    notes: `[Calculator] New lead created. ${name} (${email || 'no email'}, ${phone || 'no phone'}) used the public purchase calculator.`,
  })

  return NextResponse.json({
    clientId: created!.id,
    clientName: created!.name,
    isNew: true,
    matched: 'created',
  })
}
