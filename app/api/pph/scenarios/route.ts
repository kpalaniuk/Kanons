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

// GET /api/pph/scenarios?clientId=<uuid>
export async function GET(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const email = await getCallerEmail(userId)
  if (!email || !ALLOWED_EMAILS.includes(email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const clientId = request.nextUrl.searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 })

  // Try both pph_client_id (UUID) and notion_client_id (legacy) 
  const { data: byPph } = await supabaseAdmin
    .from('purchase_scenarios')
    .select('slug, data, created_at, updated_at, pph_client_id, notion_client_id')
    .eq('pph_client_id', clientId)
    .order('created_at', { ascending: false })

  const { data: byNotion } = await supabaseAdmin
    .from('purchase_scenarios')
    .select('slug, data, created_at, updated_at, pph_client_id, notion_client_id')
    .eq('notion_client_id', clientId)
    .order('created_at', { ascending: false })

  // Merge + dedupe by slug
  const all = [...(byPph || []), ...(byNotion || [])]
  const seen = new Set<string>()
  const unique = all.filter(r => { if (seen.has(r.slug)) return false; seen.add(r.slug); return true })

  const scenarios = unique.map(row => {
    const d = (row.data || {}) as Record<string, unknown>
    const price = Number(d.purchasePrice || d.priceMin || 0)
    const downPct = Number(d.downPaymentPct || d.downPercent || 0)
    const type = String(d.type || 'purchase-grid')
    const isInteractive = type === 'interactive' || !!d.interactive_url
    const isHtml = type === 'html'
    const interactiveUrl = d.interactive_url as string | undefined
    const htmlStoragePath = d.htmlStoragePath as string | undefined

    // Auto-label
    let label = d.label as string | undefined
    if (!label) {
      const parts: string[] = []
      if (price) parts.push('$' + (price >= 1e6 ? (price/1e6).toFixed(1) + 'M' : Math.round(price/1000) + 'k'))
      if (downPct) parts.push(downPct + '% down')
      const loanType = d.loanProgram || d.loanType || 'Purchase'
      parts.push(String(loanType))
      const date = new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      parts.push(date)
      label = parts.join(' · ')
    }

    return {
      slug: row.slug,
      clientName: String(d.clientName || 'Client'),
      type,
      isInteractive,
      interactiveUrl: interactiveUrl || null,
      label,
      description: (d.description as string) || null,
      data: d,
      createdAt: row.created_at,
      publicUrl: isInteractive && interactiveUrl ? interactiveUrl : isHtml && htmlStoragePath ? htmlStoragePath : `/clients/purchase/${row.slug}`,
    }
  })

  return NextResponse.json(scenarios)
}
