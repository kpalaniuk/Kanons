import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ALLOWED_EMAILS = (process.env.FAMILY_ALLOWED_EMAILS || 'kpalaniuk@gmail.com')
  .split(',').map(e => e.trim().toLowerCase())

async function verifyUser(): Promise<{ ok: boolean; error: NextResponse | null }> {
  const { userId } = auth()
  if (!userId) return { ok: false, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase()
    if (!email || !ALLOWED_EMAILS.includes(email)) return { ok: false, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
    return { ok: true, error: null }
  } catch { return { ok: false, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) } }
}

// GET /api/pph/clients/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await verifyUser()
  if (error) return error

  const { data, error: dbErr } = await supabaseAdmin
    .from('pph_clients')
    .select('*')
    .eq('id', params.id)
    .single()

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: dbErr.code === 'PGRST116' ? 404 : 500 })
  return NextResponse.json(data)
}
