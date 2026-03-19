import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ALLOWED_EMAILS = (process.env.FAMILY_ALLOWED_EMAILS || 'kpalaniuk@gmail.com')
  .split(',').map(e => e.trim().toLowerCase())

async function verifyUser(): Promise<{ email: string | null; error: NextResponse | null }> {
  const { userId } = auth()
  if (!userId) return { email: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase() || null
    if (!email || !ALLOWED_EMAILS.includes(email)) {
      return { email: null, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
    }
    return { email, error: null }
  } catch {
    return { email: null, error: NextResponse.json({ error: 'Auth error' }, { status: 500 }) }
  }
}

// GET /api/pph/activity?clientId=xxx — fetch activity for a client
export async function GET(request: NextRequest) {
  const { error } = await verifyUser()
  if (error) return error

  const clientId = request.nextUrl.searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 })

  const { data, error: dbErr } = await supabaseAdmin
    .from('pph_activity')
    .select('*')
    .eq('client_id', clientId)
    .order('ts', { ascending: false })
    .limit(50)

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json(data || [])
}

// POST /api/pph/activity — log an activity entry
export async function POST(request: NextRequest) {
  const { email, error } = await verifyUser()
  if (error) return error

  const body = await request.json()
  const { clientId, clientName, field, oldValue, newValue } = body
  if (!clientId || !field) return NextResponse.json({ error: 'clientId and field required' }, { status: 400 })

  const { data, error: dbErr } = await supabaseAdmin
    .from('pph_activity')
    .insert({
      client_id: clientId,
      client_name: clientName || '',
      field,
      old_value: oldValue != null ? String(oldValue) : null,
      new_value: newValue != null ? String(newValue) : null,
      changed_by: email || 'system',
    })
    .select()
    .single()

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json(data)
}
