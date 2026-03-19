import { NextResponse } from 'next/server'

const AGENTMAIL_API_KEY = process.env.AGENTMAIL_API_KEY
const INBOX_ID = 'jasperthedog@agentmail.to'
const AGENTMAIL_BASE = 'https://api.agentmail.to/v0'

export async function GET() {
  if (!AGENTMAIL_API_KEY) {
    return NextResponse.json({ unread: 0, topMessages: [], error: 'No API key' })
  }
  try {
    const res = await fetch(`${AGENTMAIL_BASE}/inboxes/${INBOX_ID}/messages?limit=20`, {
      headers: { Authorization: `Bearer ${AGENTMAIL_API_KEY}` },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`AgentMail API error: ${res.status}`)
    const data = await res.json()

    const messages: Array<{
      message_id: string
      subject: string
      from: string
      preview: string
      timestamp: string
      labels: string[]
    }> = data.messages || []

    const unread = messages.filter((m) => m.labels?.includes('unread'))

    const topMessages = unread.slice(0, 3).map((m) => ({
      subject: m.subject || '(no subject)',
      from: m.from?.replace(/<[^>]*>/g, '').trim() || 'Unknown',
      preview: m.preview?.slice(0, 80) || '',
      timestamp: m.timestamp,
    }))

    return NextResponse.json({ unread: unread.length, topMessages, total: messages.length })
  } catch (err) {
    console.error('[agentmail-digest]', err)
    return NextResponse.json({ unread: 0, topMessages: [], error: String(err) })
  }
}
