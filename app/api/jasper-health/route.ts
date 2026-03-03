import { NextResponse } from 'next/server'

// Cache stats for 45s at the CDN edge — avoids hammering the VPS endpoint
export const revalidate = 45

export async function GET() {
  const statsUrl = process.env.JASPER_STATS_URL

  if (!statsUrl) {
    // Not yet configured — return a clear "pending setup" payload
    return NextResponse.json({
      status: 'pending_setup',
      message: 'JASPER_STATS_URL not set in Vercel env vars. See /data/projects/jasper-health/README.md for setup instructions.',
      generated_at: new Date().toISOString(),
    }, { status: 200 })
  }

  try {
    const res = await fetch(statsUrl, {
      next: { revalidate: 45 },
      signal: AbortSignal.timeout(5000),  // 5s timeout
    })

    if (!res.ok) {
      return NextResponse.json({
        status: 'error',
        message: `Stats server returned ${res.status}`,
        generated_at: new Date().toISOString(),
      }, { status: 200 })
    }

    const data = await res.json()

    // Return as-is — the stats server already sanitizes everything
    return NextResponse.json({ status: 'ok', ...data }, {
      headers: { 'Cache-Control': 'public, s-maxage=45, stale-while-revalidate=60' }
    })

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({
      status: 'unreachable',
      message: `Could not reach stats server: ${message}`,
      generated_at: new Date().toISOString(),
    }, { status: 200 })  // Always 200 so dashboard can render gracefully
  }
}
