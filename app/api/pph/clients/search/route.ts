import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/pph/clients/search?q=name
export async function GET(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const q = (request.nextUrl.searchParams.get('q') || '').trim()
  if (!q) return NextResponse.json([])

  const { data } = await supabase
    .from('pph_clients')
    .select('id, name, stage, phone, email, primary_lo, fico_score, target_purchase_price')
    .or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`)
    .order('updated_at', { ascending: false })
    .limit(8)

  return NextResponse.json(data || [])
}

// POST /api/pph/clients/search — create minimal client
export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, phone, stage } = await request.json()
  if (!name?.trim()) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const { data, error } = await supabase
    .from('pph_clients')
    .insert({
      name: name.trim(),
      phone: phone || null,
      stage: stage || 'New Lead',
      priority: 'medium',
      next_action: '',
      notes: '',
      referral_source: '',
      liabilities: '[]',
      reo: '[]',
    })
    .select('id, name, stage, phone')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
