import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { clerkClient } from '@clerk/nextjs/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getCallerEmail(userId: string): Promise<string | null> {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    return user.emailAddresses?.[0]?.emailAddress?.toLowerCase() || null
  } catch { return null }
}

export async function GET(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 })

  const { data, error } = await supabase
    .from('income_qualifier_runs')
    .select('id, label, created_at, calculated_income, loan_program, income_inputs, income_analysis, notes, is_saved')
    .eq('pph_client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ runs: data || [] })
}

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const email = await getCallerEmail(userId)

  const body = await request.json()
  const { pphClientId, label, incomeInputs, incomeAnalysis, calculatedIncome, loanProgram, notes, files, isSaved } = body

  if (!pphClientId) return NextResponse.json({ error: 'pphClientId required' }, { status: 400 })

  const { data, error } = await supabase
    .from('income_qualifier_runs')
    .insert({
      pph_client_id: pphClientId,
      label: label || `Run ${new Date().toLocaleDateString()}`,
      created_by_email: email || null,
      income_inputs: incomeInputs || null,
      income_analysis: incomeAnalysis || null,
      calculated_income: calculatedIncome || null,
      loan_program: loanProgram || null,
      notes: notes || null,
      files: files || null,
      is_saved: isSaved ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ run: data })
}
