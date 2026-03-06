import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Save to Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      await fetch(`${supabaseUrl}/rest/v1/roomforge_cabinet_maker_specs`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          submitted_at: new Date().toISOString(),
          specs: data,
        }),
      }).catch(() => {}) // silent fail if table doesn't exist yet
    }

    // Notify Kyle via Discord webhook
    const discordWebhook = process.env.DISCORD_WEBHOOK_URL
    if (discordWebhook) {
      const summary = [
        `🪵 **RoomForge — David's Cabinet Maker Specs Submitted**`,
        ``,
        `**Min drawer width:** ${data.minDrawerWidth || 'not set'}`,
        `**Min cabinet width:** ${data.minCabinetWidth || 'not set'}`,
        `**Standard base depth:** ${data.standardBaseDepth || 'not set'}`,
        `**Max shelf span:** ${data.maxSpanWithoutSupport || 'not set'}`,
        `**CNC:** ${data.hasCNC || 'not set'}`,
        `**Contact:** ${data.preferredContact || 'not set'}`,
        ``,
        `Full response saved. Check Supabase or Kyle's email.`,
      ].join('\n')

      await fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: summary }),
      }).catch(() => {})
    }

    // Also log to console for easy access
    console.log('[roomforge-onboard] David submission:', JSON.stringify(data, null, 2))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[roomforge-onboard] error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
