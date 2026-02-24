import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { setPagePublic, getPublicPages } from '@/lib/public-pages'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const pages = await getPublicPages()
  // Return as a map: slug → enabled
  const map: Record<string, boolean> = {}
  for (const p of pages) map[p.slug] = p.enabled
  return NextResponse.json(map)
}

export async function POST(req: NextRequest) {
  // Require signed-in Clerk user
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { slug, title, href, enabled } = body

  if (!slug || !title || !href || typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'Missing fields: slug, title, href, enabled' }, { status: 400 })
  }

  const result = await setPagePublic(slug, title, href, enabled)

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://kyle.palaniuk.net'}/view/${slug}`
  return NextResponse.json({ success: true, publicUrl, enabled })
}
