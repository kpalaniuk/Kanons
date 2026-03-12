import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { getSupabase } from '@/lib/supabase'

// SQL to run in Supabase dashboard (mqxmvwbzghbzqmeamqtu):
//
// CREATE TABLE IF NOT EXISTS pipeline_activity_logs (
//   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//   notion_client_id text NOT NULL,
//   client_name text NOT NULL DEFAULT '',
//   text text NOT NULL DEFAULT '',
//   ts timestamptz DEFAULT now()
// );
// ALTER TABLE pipeline_activity_logs ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Service role full access" ON pipeline_activity_logs
//   FOR ALL USING (auth.role() = 'service_role');
// CREATE INDEX idx_pipeline_activity_client
//   ON pipeline_activity_logs (notion_client_id, ts DESC);

const ALLOWED_EMAILS = (process.env.FAMILY_ALLOWED_EMAILS || 'kpalaniuk@gmail.com')
  .split(',').map(e => e.trim().toLowerCase())

async function verifyAllowedUser(userId: string): Promise<boolean> {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase()
    return !!email && ALLOWED_EMAILS.includes(email)
  } catch { return false }
}

// GET /api/pipeline/activity?clientId=xxx  (or no param = all)
export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId || !(await verifyAllowedUser(userId))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const clientId = req.nextUrl.searchParams.get('clientId')
  const supabase = getSupabase()

  let query = supabase
    .from('pipeline_activity_logs')
    .select('id, notion_client_id, client_name, text, ts')
    .order('ts', { ascending: false })
    .limit(500)

  if (clientId) query = query.eq('notion_client_id', clientId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Group by client id
  const grouped: Record<string, { id: string; ts: string; text: string }[]> = {}
  for (const row of data ?? []) {
    if (!grouped[row.notion_client_id]) grouped[row.notion_client_id] = []
    grouped[row.notion_client_id].push({ id: row.id, ts: row.ts, text: row.text })
  }

  return NextResponse.json({ logs: grouped })
}

// POST /api/pipeline/activity  { clientId, clientName, text }
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId || !(await verifyAllowedUser(userId))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { clientId, clientName, text } = body
  if (!clientId || !text) {
    return NextResponse.json({ error: 'clientId and text required' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('pipeline_activity_logs')
    .insert({ notion_client_id: clientId, client_name: clientName || '', text })
    .select('id, ts')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id, ts: data.ts })
}

// DELETE /api/pipeline/activity  { id }
export async function DELETE(req: NextRequest) {
  const { userId } = await auth()
  if (!userId || !(await verifyAllowedUser(userId))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { id } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const supabase = getSupabase()
  const { error } = await supabase
    .from('pipeline_activity_logs')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
