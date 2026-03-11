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

CRITICAL — SCENARIO OUTPUT:
When you calculate ANY full payment scenario, you MUST output a \`\`\`scenario JSON block. This is NOT a request to build an interactive tool. The JSON block generates a shareable scenario page at kyle.palaniuk.net that can be sent to the client immediately. NEVER say you "can't build a calculator" — that's not what's being asked. Just output the JSON and it gets saved and shared automatically.

SCENARIO GENERATION — TWO MODES:

**QUICK (cookie-cutter):** If the user gives you a purchase price, down %, and rate directly (e.g. "$850k, 10% down, 6.75%"), run it immediately without asking questions. Use default property tax (1.1%/yr) and insurance ($1,200/yr) unless told otherwise. Generate the PITIA breakdown and the JSON block right away.

**CUSTOM (client-specific):** If the user says "build a scenario for [client]" or the situation involves non-standard income, ARM vs fixed comparison, or specific UW considerations — gather what's missing through conversation. Ask one focused question at a time. Once you have enough, generate the scenario with client-specific notes.

For BOTH modes, once you have enough data, output the human-readable PITIA summary first, then this exact block:

\`\`\`scenario
{
  "type": "purchase",
  "clientName": "Name",
  "purchasePrice": 850000,
  "downPaymentPct": 10,
  "interestRate": 6.75,
  "loanTerm": 30,
  "propertyTax": 779,
  "homeInsurance": 100,
  "hoaDues": 0,
  "miOverrides": {},
  "notes": "Optional: qualifying income used, assumptions, UW flags",
  "qualifyingIncome": 0,
  "estimatedDTI": 0
}
\`\`\`

Supported types: "purchase", "refi". The system detects this block and offers to save it to the client's profile. omit qualifyingIncome/estimatedDTI if not known.

Be direct and precise. These are professionals. Give clear answers with assumptions noted.`

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const email = await getCallerEmail(userId)
  if (!email || !ALLOWED_EMAILS.includes(email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { messages, clientContext, attachedFiles, scenarioMode } = await request.json()
  if (!messages || !Array.isArray(messages)) return NextResponse.json({ error: 'messages required' }, { status: 400 })

  const contextBlock = clientContext
    ? `\n\nCurrent client context:\n${JSON.stringify(clientContext, null, 2)}`
    : ''

  // Inject scenario mode instruction if set
  const modeInstruction = scenarioMode === 'quick'
    ? '\n\n[MODE: QUICK SCENARIO] The user wants a quick scenario. Run the PITIA immediately from the numbers given. No clarifying questions unless a number is completely missing.'
    : scenarioMode === 'custom'
    ? '\n\n[MODE: CUSTOM SCENARIO] The user wants a custom scenario tailored to this client. Ask focused questions to gather income, down payment, rate, and any UW flags before generating.'
    : ''

  // Build the last user message — with files as vision content if present
  const historyMessages = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role,
    content: m.content,
  }))

  const lastMsg = messages[messages.length - 1]
  type ContentPart = { type: string; text?: string; image_url?: { url: string } }
  let lastContent: string | ContentPart[]

  if (attachedFiles && attachedFiles.length > 0) {
    const parts: ContentPart[] = [
      { type: 'text', text: lastMsg.content || '(analyze the attached files in the context of this client)' },
    ]
    for (const f of attachedFiles as { dataUrl: string; mimeType: string; name: string }[]) {
      // Claude supports image/* and application/pdf via image_url with data URI
      parts.push({ type: 'image_url', image_url: { url: f.dataUrl } })
    }
    lastContent = parts
  } else {
    lastContent = lastMsg.content
  }

  const apiMessages = [
    { role: 'system', content: SYSTEM_PROMPT + contextBlock + modeInstruction },
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
