import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ALLOWED_EMAILS = (process.env.FAMILY_ALLOWED_EMAILS || 'kpalaniuk@gmail.com')
  .split(',').map(e => e.trim().toLowerCase())

async function getCallerEmail(userId: string): Promise<string | null> {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    return user.emailAddresses?.[0]?.emailAddress?.toLowerCase() || null
  } catch { return null }
}

async function verifyUser(): Promise<{ email: string | null; error: NextResponse | null }> {
  const { userId } = auth()
  if (!userId) return { email: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const email = await getCallerEmail(userId)
  if (!email || !ALLOWED_EMAILS.includes(email)) return { email: null, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  return { email, error: null }
}

// GET /api/pph/clients — list all clients
export async function GET() {
  const { error } = await verifyUser()
  if (error) return error

  const { data, error: dbErr } = await supabaseAdmin
    .from('pph_clients')
    .select('*')
    .order('priority', { ascending: true })
    .order('follow_up_date', { ascending: true, nullsFirst: false })

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json(data || [])
}

// POST /api/pph/clients — create new client
export async function POST(request: NextRequest) {
  const { error } = await verifyUser()
  if (error) return error

  const body = await request.json()
  const { name, stage, priority, loanType, loanAmount, nextAction, notes, referralSource, primaryLo, primaryContact, phone, followUpDate } = body

  if (!name?.trim()) return NextResponse.json({ error: 'name is required' }, { status: 400 })

  const { data, error: dbErr } = await supabaseAdmin
    .from('pph_clients')
    .insert({
      name: name.trim(),
      stage: stage || 'New Lead',
      priority: priority || 'Active',
      loan_type: loanType || null,
      loan_amount: loanAmount || null,
      next_action: nextAction || '',
      notes: notes || '',
      referral_source: referralSource || '',
      primary_lo: primaryLo || null,
      primary_contact: primaryContact || null,
      phone: phone || null,
      follow_up_date: followUpDate || null,
    })
    .select()
    .single()

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH /api/pph/clients — update a client
export async function PATCH(request: NextRequest) {
  const { error } = await verifyUser()
  if (error) return error

  const body = await request.json()
  const { id, ...fields } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Map camelCase → snake_case for any fields sent
  const mapped: Record<string, unknown> = {}
  const fieldMap: Record<string, string> = {
    loanType: 'loan_type', loanAmount: 'loan_amount', nextAction: 'next_action',
    followUpDate: 'follow_up_date', lastTouched: 'last_touched',
    referralSource: 'referral_source', primaryLo: 'primary_lo',
    primaryContact: 'primary_contact',
  }
  for (const [key, val] of Object.entries(fields)) {
    const col = fieldMap[key] || key
    mapped[col] = val
  }

  const { data, error: dbErr } = await supabaseAdmin
    .from('pph_clients')
    .update(mapped)
    .eq('id', id)
    .select()
    .single()

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json(data)
}
