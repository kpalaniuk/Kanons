/**
 * POST /api/pph/agent-scenario
 * 
 * Called by PPH-Claw (or any trusted agent) to deploy a scenario directly
 * to the Kanons site — no GitHub, no Vercel CLI, no SSH needed.
 * 
 * Auth: Bearer token via AGENT_API_TOKEN env var
 * 
 * Body:
 * {
 *   clientName: string        — used to find/match pph_client
 *   clientId?: string         — pph_clients UUID (preferred if known)
 *   slug?: string             — URL slug (auto-generated from clientName + timestamp if omitted)
 *   label?: string            — display label (e.g. "Joseph Henseler — Cash-Out Refi")
 *   type: string              — "purchase-grid" | "refi" | "dscr" | "interactive" | "html"
 *   html?: string             — raw HTML content (for html type — stored in Supabase storage)
 *   data?: object             — structured scenario data (for non-html types)
 *   interactiveUrl?: string   — if linking to an existing interactive page
 *   loanOfficer?: string      — LO name
 *   notes?: string            — internal notes
 * }
 * 
 * Returns: { slug, publicUrl, clientId, isNew }
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return false
  const token = authHeader.slice(7)
  const agentToken = process.env.AGENT_API_TOKEN || 'pph-agent-kanons-2026'
  return token === agentToken
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized — missing or invalid agent token' }, { status: 401 })
  }

  const body = await request.json()
  const { clientName, clientId, slug: providedSlug, label, type, html, data, interactiveUrl, loanOfficer, notes } = body

  if (!clientName && !clientId) {
    return NextResponse.json({ error: 'clientName or clientId required' }, { status: 400 })
  }
  if (!type) {
    return NextResponse.json({ error: 'type required (purchase-grid | refi | dscr | interactive | html)' }, { status: 400 })
  }

  // 1. Resolve client
  let resolvedClientId: string | null = clientId || null

  if (!resolvedClientId && clientName) {
    const { data: clients } = await supabase
      .from('pph_clients')
      .select('id, name')
      .ilike('name', `%${clientName.split(' ')[0]}%`)
      .limit(5)

    const match = clients?.find(c =>
      c.name.toLowerCase().includes(clientName.toLowerCase().split(' ')[0].toLowerCase())
    )
    resolvedClientId = match?.id || null
  }

  // 2. Build slug
  const slug = providedSlug || `${(clientName || 'scenario').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`

  // 3. Handle HTML type — store content in Supabase storage, save reference
  let scenarioData: Record<string, unknown> = data || {}
  let htmlStoragePath: string | null = null

  if (type === 'html' && html) {
    // Store HTML in Supabase storage bucket 'scenario-html'
    const fileName = `${slug}.html`
    const { error: uploadError } = await supabase.storage
      .from('scenario-html')
      .upload(fileName, html, { contentType: 'text/html', upsert: true })

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('scenario-html').getPublicUrl(fileName)
      htmlStoragePath = urlData.publicUrl
      scenarioData = { ...scenarioData, htmlStoragePath, htmlFileName: fileName }
    }
  }

  // 4. Save scenario to purchase_scenarios table
  const scenarioPayload = {
    slug,
    data: {
      ...scenarioData,
      type,
      label: label || `${clientName} — ${type}`,
      loanOfficer: loanOfficer || null,
      notes: notes || null,
      interactive_url: interactiveUrl || null,
      htmlStoragePath: htmlStoragePath || null,
      createdByAgent: true,
      clientName,
    },
    pph_client_id: resolvedClientId || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { error: saveError } = await supabase
    .from('purchase_scenarios')
    .upsert(scenarioPayload, { onConflict: 'slug' })

  if (saveError) {
    return NextResponse.json({ error: saveError.message }, { status: 500 })
  }

  // 5. Log activity if client found
  if (resolvedClientId) {
    await supabase.from('pph_call_logs').insert({
      client_id: resolvedClientId,
      client_name: clientName,
      logged_by_email: 'pph-claw@agent',
      call_type: 'Note',
      notes: `[Agent] Deployed scenario: "${label || slug}" (${type})`,
    })
  }

  const publicUrl = type === 'interactive' && interactiveUrl
    ? interactiveUrl
    : `https://kyle.palaniuk.net/clients/purchase/${slug}`

  return NextResponse.json({
    slug,
    publicUrl,
    clientId: resolvedClientId,
    htmlStoragePath,
    isNew: !clientId,
    message: `Scenario deployed. ${resolvedClientId ? 'Linked to client.' : 'No client match — appears in Recent Scenarios.'} View at ${publicUrl}`,
  })
}

// GET — let agents check what scenarios exist for a client
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const clientName = request.nextUrl.searchParams.get('clientName')
  const clientId = request.nextUrl.searchParams.get('clientId')

  if (!clientName && !clientId) {
    return NextResponse.json({ error: 'clientName or clientId required' }, { status: 400 })
  }

  let query = supabase.from('purchase_scenarios').select('slug, data, created_at, pph_client_id').order('created_at', { ascending: false }).limit(10)

  if (clientId) {
    query = query.eq('pph_client_id', clientId)
  } else if (clientName) {
    // Match by clientName in data jsonb
    query = query.ilike('data->>clientName', `%${clientName}%`)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ scenarios: data || [] })
}
