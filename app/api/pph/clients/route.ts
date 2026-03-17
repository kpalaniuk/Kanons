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
    referralName: 'referral_name', referralDate: 'referral_date', referralType: 'referral_type',
    b1Name: 'b1_name', b1IncomeType: 'b1_income_type', b1MonthlyIncome: 'b1_monthly_income',
    b1IncomeDetails: 'b1_income_details',
    b2Name: 'b2_name', b2IncomeType: 'b2_income_type', b2MonthlyIncome: 'b2_monthly_income',
    b2IncomeDetails: 'b2_income_details',
    b1Assets: 'b1_assets', b1AssetsNotes: 'b1_assets_notes',
    b2Assets: 'b2_assets', b2AssetsNotes: 'b2_assets_notes',
    targetPurchasePrice: 'target_purchase_price',
    ficoScore: 'fico_score',
    targetArea: 'target_area',
    liabilities: 'liabilities',
  }
  for (const [key, val] of Object.entries(fields)) {
    const col = fieldMap[key] || key
    mapped[col] = val
  }

  // Auto-stamp stage_updated_at when stage changes
  if (mapped['stage']) {
    mapped['stage_updated_at'] = new Date().toISOString()
  }

  const { data, error: dbErr } = await supabaseAdmin
    .from('pph_clients')
    .update(mapped)
    .eq('id', id)
    .select()
    .single()

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

  // Notify Kyle when follow-up date is set or changed
  if (mapped['follow_up_date'] && process.env.DISCORD_JASPER_BOT_TOKEN && process.env.DISCORD_JASPER_CHANNEL_ID) {
    const clientName = (data?.name || 'client') as string
    const dateStr = mapped['follow_up_date'] as string
    const formatted = new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    const nextAction = (mapped['next_action'] || data?.next_action || '') as string
    const msg = `📅 Follow-up set for **${clientName}** — **${formatted}**${nextAction ? `\n→ ${nextAction}` : ''}`
    fetch(`https://discord.com/api/v10/channels/${process.env.DISCORD_JASPER_CHANNEL_ID}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bot ${process.env.DISCORD_JASPER_BOT_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: msg }),
    }).catch(() => {})
  }

  return NextResponse.json(data)
}
