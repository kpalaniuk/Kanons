import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/pph/recent-scenarios?limit=20
export async function GET(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')

  const { data: scenarios } = await supabase
    .from('purchase_scenarios')
    .select('slug, data, created_at, updated_at, pph_client_id')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (!scenarios) return NextResponse.json([])

  // Fetch client names for linked clients
  const clientIds = [...new Set(scenarios.map(s => s.pph_client_id).filter(Boolean))]
  const { data: clients } = clientIds.length
    ? await supabase.from('pph_clients').select('id, name, stage').in('id', clientIds)
    : { data: [] }

  const clientMap = Object.fromEntries((clients || []).map(c => [c.id, c]))

  const result = scenarios.map(row => {
    const d = (row.data || {}) as Record<string, unknown>
    const price = Number(d.purchasePrice || d.priceMin || 0)
    const downPct = Number(d.downPaymentPct || d.downPercent || 0)
    const type = String(d.type || 'purchase-grid')
    const isInteractive = type === 'interactive' || !!d.interactive_url

    let label = d.label as string | undefined
    if (!label) {
      const parts: string[] = []
      if (price) parts.push('$' + (price >= 1e6 ? (price/1e6).toFixed(1) + 'M' : Math.round(price/1000) + 'k'))
      if (downPct) parts.push(downPct + '% down')
      parts.push(type === 'purchase-grid' ? 'Purchase' : type === 'refi' ? 'Refi' : type)
      label = parts.join(' · ')
    }

    const client = row.pph_client_id ? clientMap[row.pph_client_id] : null
    const clientName = (d.clientName as string) || client?.name || 'Unknown'

    return {
      slug: row.slug,
      label,
      clientName,
      clientId: row.pph_client_id || null,
      clientStage: client?.stage || null,
      type,
      isInteractive,
      publicUrl: isInteractive && d.interactive_url ? d.interactive_url : `/clients/purchase/${row.slug}`,
      createdAt: row.created_at,
      lo: (d.loanOfficer as string) || null,
    }
  })

  return NextResponse.json(result)
}
