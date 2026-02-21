import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('dscr_client_configs')
      .select('*')
      .eq('client_slug', params.slug)
      .eq('active', true)
      .single()
    
    if (error || !data) {
      return NextResponse.json(
        { error: 'Client configuration not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching DSCR client config:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
