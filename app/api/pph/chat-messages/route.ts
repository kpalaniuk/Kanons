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

// GET /api/pph/chat-messages?clientId=uuid
export async function GET(request: NextRequest) {
  const { error } = await verifyUser()
  if (error) return error

  const clientId = request.nextUrl.searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 })

  const { data, error: dbErr } = await supabaseAdmin
    .from('pph_chat_messages')
    .select('id, role, content, has_image, created_at')
    .eq('client_id', clientId)
    .order('created_at', { ascending: true })
    .limit(200)

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json(data || [])
}

// POST /api/pph/chat-messages — save one or many messages
export async function POST(request: NextRequest) {
  const { error } = await verifyUser()
  if (error) return error

  const body = await request.json()
  const { clientId, messages } = body
  if (!clientId || !messages?.length) return NextResponse.json({ error: 'clientId and messages required' }, { status: 400 })

  const rows = messages.map((m: { role: string; content: string; hasImage?: boolean }) => ({
    client_id: clientId,
    role: m.role,
    content: m.content,
    has_image: m.hasImage || false,
  }))

  const { data, error: dbErr } = await supabaseAdmin
    .from('pph_chat_messages')
    .insert(rows)
    .select()

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/pph/chat-messages?clientId=uuid — clear chat history
export async function DELETE(request: NextRequest) {
  const { error } = await verifyUser()
  if (error) return error

  const clientId = request.nextUrl.searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 })

  const { error: dbErr } = await supabaseAdmin
    .from('pph_chat_messages')
    .delete()
    .eq('client_id', clientId)

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
