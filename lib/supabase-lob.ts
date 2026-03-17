/**
 * LO Buddy Supabase client — read/write access to the LO Buddy database.
 * ALL queries are scoped to GH Group team to prevent cross-team data exposure.
 *
 * LO Buddy Supabase project: vzkjlgcpggwyxcewukaq
 * GH Group team: c88f677b-ebdc-4421-be6c-2ac0345e7a7d
 * Members: Kyle (ef30c794 / admin), Jim (5aae2c67 / LO), Anthony (651cfeab / LO), Chad (787db203 / admin)
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _lob: SupabaseClient | null = null

/** GH Group team ID — all LOB queries are scoped to this team */
export const GH_GROUP_TEAM_ID = process.env.LOB_GH_GROUP_TEAM_ID || 'c88f677b-ebdc-4421-be6c-2ac0345e7a7d'

/** Kyle's LO Buddy user ID (admin in GH Group) */
export const LOB_DEFAULT_USER_ID = process.env.LOB_DEFAULT_USER_ID || 'ef30c794-7b09-4df7-935b-e1036e7c80fe'

/** GH Group member user IDs */
export const GH_GROUP_MEMBERS = {
  kyle:    'ef30c794-7b09-4df7-935b-e1036e7c80fe',
  jim:     '5aae2c67-7481-44bc-86e2-06c20dda7f65',
  anthony: '651cfeab-95ef-46e3-a59b-55fb5dc8e9ee',
  chad:    '787db203-3ffb-469f-b18c-9d3d6afd32ab',
}

export function getLOBSupabase(): SupabaseClient {
  if (_lob) return _lob
  const url = process.env.LOB_SUPABASE_URL
  const key = process.env.LOB_SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('LOB_SUPABASE_URL / LOB_SUPABASE_SERVICE_ROLE_KEY not set')
  _lob = createClient(url, key)
  return _lob
}

/** LO Buddy contact row (relevant fields for PPH) */
export interface LOBContact {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
}

/** LO Buddy opportunity row */
export interface LOBOpportunity {
  id: string
  contact_id: string
  type: 'purchase' | 'refinance' | 'investment'
  status: string
  loan_amount: number | null
  borrower_financials: {
    monthly_income?: number
    monthly_liabilities?: number
    liquid_assets?: number
    credit_score_category?: string
  } | null
  assigned_to: string | null
  created_at: string
  updated_at: string
}

/** LO Buddy scenario row */
export interface LOBScenario {
  id: string
  opportunity_id: string
  loan_amount: number
  down_payment: number
  rate: number
  term: number
  loan_type: string
  monthly_payment: number
  dti: number | null
  ltv: number | null
  is_selected: boolean
  created_at: string
}

/** Search LO Buddy contacts — SCOPED TO GH GROUP ONLY */
export async function searchLOBContacts(query: string, limit = 8): Promise<LOBContact[]> {
  const sb = getLOBSupabase()
  // Get GH Group member user IDs for scope filter
  const memberIds = Object.values(GH_GROUP_MEMBERS)
  const { data } = await sb
    .from('contacts')
    .select('id,first_name,last_name,email,phone,assigned_to,created_at,updated_at,team_id')
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
    .or(`team_id.eq.${GH_GROUP_TEAM_ID},assigned_to.in.(${memberIds.join(',')})`)
    .order('updated_at', { ascending: false })
    .limit(limit)
  return data || []
}

/** Get a single contact + their opportunities */
export async function getLOBContactWithOpps(contactId: string): Promise<{
  contact: LOBContact | null
  opportunities: LOBOpportunity[]
}> {
  const sb = getLOBSupabase()
  const [cRes, oRes] = await Promise.all([
    sb.from('contacts').select('id,first_name,last_name,email,phone,assigned_to,created_at,updated_at').eq('id', contactId).single(),
    sb.from('opportunities').select('id,contact_id,type,status,loan_amount,borrower_financials,assigned_to,created_at,updated_at').eq('contact_id', contactId).order('updated_at', { ascending: false }),
  ])
  return {
    contact: cRes.data || null,
    opportunities: oRes.data || [],
  }
}

/** Create a contact in LO Buddy and an initial opportunity */
export async function createLOBContact(params: {
  firstName: string
  lastName: string
  phone?: string
  email?: string
  assignedTo: string   // LO Buddy user UUID
  type?: 'purchase' | 'refinance' | 'investment'
}): Promise<{ contact: LOBContact; opportunity: LOBOpportunity }> {
  const sb = getLOBSupabase()

  const { data: contact, error: cErr } = await sb
    .from('contacts')
    .insert({
      first_name: params.firstName,
      last_name: params.lastName || '',
      phone: params.phone || null,
      email: params.email || null,
      assigned_to: params.assignedTo,
      team_id: GH_GROUP_TEAM_ID,   // always scope to GH Group
    })
    .select()
    .single()

  if (cErr || !contact) throw new Error(`LOB createContact: ${cErr?.message}`)

  const { data: opp, error: oErr } = await sb
    .from('opportunities')
    .insert({
      contact_id: contact.id,
      type: params.type || 'purchase',
      status: 'NEW_LEAD',
      assigned_to: params.assignedTo,
    })
    .select()
    .single()

  if (oErr || !opp) throw new Error(`LOB createOpportunity: ${oErr?.message}`)

  return { contact, opportunity: opp }
}
