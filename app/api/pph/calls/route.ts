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

// GET /api/pph/calls?clientId=<notionId>
export async function GET(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const email = await getCallerEmail(userId)
  if (!email || !ALLOWED_EMAILS.includes(email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const clientId = request.nextUrl.searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('pph_call_logs')
    .select('*')
    .eq('notion_client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/pph/calls
export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const email = await getCallerEmail(userId)
  if (!email || !ALLOWED_EMAILS.includes(email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const { notionClientId, clientName, callType, notes } = body
  if (!notionClientId || !clientName) return NextResponse.json({ error: 'notionClientId and clientName required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('pph_call_logs')
    .insert({
      notion_client_id: notionClientId,
      client_name: clientName,
      logged_by_email: email,
      call_type: callType || 'Note',
      notes: notes || '',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
