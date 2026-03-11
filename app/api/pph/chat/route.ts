import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

const ALLOWED_EMAILS = (process.env.FAMILY_ALLOWED_EMAILS || 'kpalaniuk@gmail.com')
  .split(',').map(e => e.trim().toLowerCase())

async function getCallerEmail(userId: string): Promise<string | null> {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    return user.emailAddresses?.[0]?.emailAddress?.toLowerCase() || null
  } catch { return null }
}

const SYSTEM_PROMPT = `You are PPH-Claw, the internal AI assistant for the Plan Prepare Home mortgage team: Kyle Palaniuk (NMLS 984138), Jim Sakrison (NMLS 244905), and Anthony Cafiso (NMLS 2104568).

Your job: answer underwriting questions, run income calculations, check FHA/Conv/VA/DSCR qualification, and help create scenarios — all in the context of the specific client whose profile you have access to.

When an image is shared, analyze it thoroughly. If it's a tax document (W2, 1040, 1099, paystub, etc.), extract all relevant income figures and calculate qualifying income using standard UW guidelines.

Core UW knowledge:
- FHA: 3.5% down (580+ FICO), DTI up to 43% (57% with AUS approve), MIP 0.55% annual + 1.75% UFMIP
- Conventional: 3-5% down, 45% DTI (50% with DU/LP), PMI varies by LTV/FICO
- VA: 0% down, no DTI limit (guideline), residual income test, VA funding fee
- DSCR: NOI/PITIA >= 1.0 (prefer 1.25), no personal income used, typically 20-25% down
- Jumbo: varies by lender, typically 43% DTI, 10-20% down, 12mo reserves
- Income: base (current), OT/bonus (2yr avg), rental (75% gross - PITIA or 75% net), SE (Sched C net / K-1)
- W2: use box 1 wages / 12 for monthly. Self-employed: 2yr avg of net + depreciation + depletion + amortization (Schedule C) or K-1.
- Paystubs: YTD ÷ months worked = monthly gross. Compare to prior year W2.
- Qualifying rate for ARMs: use note rate + 2% or fully indexed rate, whichever is higher

Whenever you calculate a FULL payment scenario (purchase price, rate, term, and payment breakdown known), ALWAYS include a JSON block in this exact format — even if not explicitly asked to "create" one:

\`\`\`scenario
{
  "type": "purchase",
  "clientName": "Name",
  "purchasePrice": 650000,
  "downPaymentPct": 10,
  "interestRate": 6.75,
  "loanTerm": 30,
  "propertyTax": 650,
  "homeInsurance": 150,
  "hoaDues": 0,
  "miOverrides": {}
}
\`\`\`

Supported types: "purchase", "refi". Include only fields you have data for. The system will detect this block and offer to save it.

Be direct and precise. These are professionals. Give clear answers with assumptions noted. Short for quick questions, detailed for full analysis.`

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const email = await getCallerEmail(userId)
  if (!email || !ALLOWED_EMAILS.includes(email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { messages, clientContext, imageBase64 } = await request.json()
  if (!messages || !Array.isArray(messages)) return NextResponse.json({ error: 'messages required' }, { status: 400 })

  const contextBlock = clientContext
    ? `\n\nCurrent client context:\n${JSON.stringify(clientContext, null, 2)}`
    : ''

  // Build the last user message — if image attached, use vision format
  const historyMessages = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role,
    content: m.content,
  }))

  const lastMsg = messages[messages.length - 1]
  let lastContent: string | { type: string; text?: string; image_url?: { url: string } }[]

  if (imageBase64) {
    lastContent = [
      { type: 'text', text: lastMsg.content || '(analyze this image in the context of the client above)' },
      { type: 'image_url', image_url: { url: imageBase64 } },
    ]
  } else {
    lastContent = lastMsg.content
  }

  const apiMessages = [
    { role: 'system', content: SYSTEM_PROMPT + contextBlock },
    ...historyMessages,
    { role: lastMsg.role, content: lastContent },
  ]

  const orKey = process.env.OPENROUTER_API_KEY
  if (!orKey) return NextResponse.json({ error: 'OpenRouter not configured' }, { status: 500 })

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${orKey}`,
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4-6',
      messages: apiMessages,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    return NextResponse.json({ error: `OpenRouter error: ${err}` }, { status: 502 })
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || 'No response'
  return NextResponse.json({ content })
}
