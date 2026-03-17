/**
 * GET /api/pph/lob-contacts?q=name
 * Search LO Buddy contacts. Returns unified shape matching pph_clients search.
 *
 * POST /api/pph/lob-contacts
 * Create a contact + initial opportunity in LO Buddy, then create a mirrored
 * pph_clients record linked via lob_contact_id.
 */
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { searchLOBContacts, createLOBContact } from '@/lib/supabase-lob'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// LO user UUID to use when creating contacts (Kyle's LO Buddy user)
// TODO: make this dynamic per logged-in user once LO Buddy auth is bridged
const DEFAULT_LOB_USER_ID = process.env.LOB_DEFAULT_USER_ID || ''

export async function GET(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const q = (request.nextUrl.searchParams.get('q') || '').trim()
  if (q.length < 2) return NextResponse.json([])

  try {
    const contacts = await searchLOBContacts(q)
    return NextResponse.json(
      contacts.map(c => ({
        id: `lob:${c.id}`,       // prefix to distinguish source
        lobId: c.id,
        name: `${c.first_name} ${c.last_name}`.trim(),
        phone: c.phone,
        stage: 'LOB Contact',
        source: 'lo-buddy',
      }))
    )
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, phone, email } = body
  if (!name?.trim()) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const parts = name.trim().split(' ')
  const firstName = parts[0]
  const lastName = parts.slice(1).join(' ') || ''

  try {
    // 1. Create in LO Buddy (if we have a user ID)
    let lobContactId: string | null = null
    if (DEFAULT_LOB_USER_ID) {
      const { contact } = await createLOBContact({
        firstName,
        lastName,
        phone,
        email,
        assignedTo: DEFAULT_LOB_USER_ID,
      })
      lobContactId = contact.id
    }

    // 2. Create mirrored record in pph_clients
    const { data, error } = await supabase
      .from('pph_clients')
      .insert({
        name: name.trim(),
        phone: phone || null,
        stage: 'New Lead',
        priority: 'medium',
        next_action: '',
        notes: '',
        referral_source: '',
        liabilities: '[]',
        reo: '[]',
        // Store LOB contact ID for future sync (column may not exist yet — graceful)
      })
      .select('id, name, stage, phone')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ...data, lobContactId })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create contact'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
