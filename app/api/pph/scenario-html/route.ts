/**
 * GET /api/pph/scenario-html?slug=joseph-henseler-...
 * Proxies HTML scenario content from Supabase storage with correct headers.
 * This avoids iframe sandbox issues and Content-Type problems.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  if (!slug) return new NextResponse('Missing slug', { status: 400 })

  // Fetch scenario data to get the html file name
  const { data: rows } = await supabase
    .from('purchase_scenarios')
    .select('data')
    .eq('slug', slug)
    .single()

  if (!rows?.data) return new NextResponse('Not found', { status: 404 })

  const d = rows.data as Record<string, unknown>
  const htmlFileName = d.htmlFileName as string | undefined
  if (!htmlFileName) return new NextResponse('Not an HTML scenario', { status: 400 })

  // Download from Supabase storage
  const { data: fileData, error } = await supabase.storage
    .from('scenario-html')
    .download(htmlFileName)

  if (error || !fileData) return new NextResponse('File not found', { status: 404 })

  const html = await fileData.text()

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      // No X-Frame-Options — allow iframe embedding from our own domain
    },
  })
}
