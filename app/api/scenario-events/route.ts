import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST — log a view or snapshot
export async function POST(request: NextRequest) {
  try {
    const { pageKey, type, data, note } = await request.json()
    if (!pageKey || !type) return NextResponse.json({ error: 'pageKey and type required' }, { status: 400 })

    const { data: row, error } = await supabase
      .from('scenario_events')
      .insert({ page_key: pageKey, type, data: data || {}, note: note || '' })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(row)
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// GET — fetch events for a page key
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pageKey = searchParams.get('pageKey')
  if (!pageKey) return NextResponse.json({ error: 'pageKey required' }, { status: 400 })

  const { data: events, error } = await supabase
    .from('scenario_events')
    .select('*')
    .eq('page_key', pageKey)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const views = events.filter(e => e.type === 'view')
  const snapshots = events.filter(e => e.type === 'snapshot')

  return NextResponse.json({
    viewCount: views.length,
    lastViewed: views[0]?.created_at || null,
    views: views.map(v => ({ at: v.created_at })),
    snapshots: snapshots.map(s => ({
      id: s.id,
      data: s.data,
      note: s.note,
      at: s.created_at,
    })),
  })
}
