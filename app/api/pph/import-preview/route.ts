/**
 * GET /api/pph/import-preview
 * Dry-run preview of what would happen if you ran the import wizard.
 * Fetches pph_clients, checks each against LO Buddy GH Group, returns a diff.
 * READ ONLY — no writes.
 */
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { getLOBSupabase, GH_GROUP_TEAM_ID, GH_GROUP_MEMBERS } from '@/lib/supabase-lob'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const STAGE_MAP: Record<string, string> = {
  'New Lead':    'NEW_LEAD',
  'Pre-Approved':'PRE_APPROVED',
  'In Process':  'IN_PROCESS',
  'Waiting':     'IN_PROCESS',
  'Funded':      'FUNDED',
  'Closed':      'CLOSED',
  'Dead':        'DEAD',
}

const LO_MAP: Record<string, string> = {
  'Kyle':    GH_GROUP_MEMBERS.kyle,
  'Jim':     GH_GROUP_MEMBERS.jim,
  'Anthony': GH_GROUP_MEMBERS.anthony,
}

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch all pph_clients
  const { data: clients, error } = await supabase
    .from('pph_clients')
    .select('id,name,stage,phone,primary_lo,primary_contact,loan_type,loan_amount,fico_score,target_purchase_price,next_action,follow_up_date,notes')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Fetch existing GH Group contacts from LO Buddy for duplicate detection
  const lob = getLOBSupabase()
  const memberIds = Object.values(GH_GROUP_MEMBERS)
  const { data: lobContacts } = await lob
    .from('contacts')
    .select('id,first_name,last_name,phone,email,team_id,assigned_to')
    .or(`team_id.eq.${GH_GROUP_TEAM_ID},assigned_to.in.(${memberIds.join(',')})`)

  const lobNames = new Set(
    (lobContacts || []).map(c => `${c.first_name} ${c.last_name}`.toLowerCase().trim())
  )

  // Build preview rows
  const preview = (clients || []).map(client => {
    const nameParts = client.name.trim().split(' ')
    const firstName = nameParts[0] || client.name
    const lastName = nameParts.slice(1).join(' ') || ''
    const fullNameLower = client.name.toLowerCase().trim()

    const possibleDuplicate = lobNames.has(fullNameLower)
    const lobStatus = STAGE_MAP[client.stage] || 'NEW_LEAD'
    const assignedTo = LO_MAP[client.primary_lo] || GH_GROUP_MEMBERS.kyle

    return {
      pphId: client.id,
      name: client.name,
      firstName,
      lastName,
      stage: client.stage,
      lobStatus,
      phone: client.phone,
      primaryLo: client.primary_lo,
      assignedToLobUserId: assignedTo,
      loanType: client.loan_type,
      loanAmount: client.loan_amount,
      ficoScore: client.fico_score,
      targetPrice: client.target_purchase_price,
      possibleDuplicate,
      action: possibleDuplicate ? 'skip' : 'create',
      notes: client.notes,
    }
  })

  // Summary
  const toCreate = preview.filter(p => p.action === 'create').length
  const toSkip = preview.filter(p => p.action === 'skip').length

  return NextResponse.json({
    preview,
    summary: {
      total: preview.length,
      toCreate,
      toSkip,
      ghGroupTeamId: GH_GROUP_TEAM_ID,
      targetDb: 'LO Buddy — GH Group',
    }
  })
}
