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

async function extractPdfText(base64Data: string): Promise<string> {
  try {
    const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist')
    // Disable worker in Node.js environment
    GlobalWorkerOptions.workerSrc = ''
    const buffer = Buffer.from(base64Data, 'base64')
    const uint8 = new Uint8Array(buffer)
    const pdf = await getDocument({ data: uint8, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true }).promise
    const textParts: string[] = []
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => item.str ?? '')
        .join(' ')
      textParts.push(`--- Page ${i} ---\n${pageText}`)
    }
    return textParts.join('\n\n')
  } catch (err) {
    console.error('PDF extraction error:', err)
    return '[PDF text extraction failed — ask user to paste the text or screenshot the pages]'
  }
}

const SYSTEM_PROMPT = `You are PPH-Claw, AI assistant for Plan Prepare Home (Kyle Palaniuk NMLS 984138, Jim Sakrison NMLS 244905, Anthony Cafiso NMLS 2104568).

TONE — CRITICAL:
- Talk like a sharp colleague texting, not a report writer. No markdown tables. No ## headers. No bold everywhere.
- Short and direct. 2-4 sentences for simple answers. Bullets only when listing 3+ items.
- When you analyze a document or image: pull the key numbers, flag the risks, give a recommendation. No preamble, no "here's what I found", just lead with the insight.
- When analyzing bank statements or financial PDFs: extract deposits by month, flag large/irregular deposits, calculate average monthly deposits (excluding outliers), and apply SE/bank-statement income guidelines.
- Max response length: fit on a phone screen. If it's longer than that, you're over-explaining.

CORE UW:
FHA: 3.5% down (580+), DTI 43% (57% AUS), MIP 0.55%/yr + 1.75% UFMIP
Conv: 3-5% down, DTI 45% (50% DU/LP), PMI by LTV/FICO
VA: 0% down, residual income test, VA funding fee
DSCR: NOI/PITIA ≥ 1.0 (prefer 1.25), no personal income, 20-25% down
Jumbo: 43% DTI, 10-20% down, 12mo reserves
Income: W2 = Box1/12. SE = 2yr avg net + depreciation + depletion. OT/bonus = 2yr avg. Rental = 75% gross minus PITIA or 75% net. YTD paystub = YTD ÷ months worked.
Bank statement income: 12-month avg deposits (personal 50% expense factor, business 25-50%). Flag NSF, large deposits, transfers.
ARM qualifying rate: note rate +2% or fully indexed, whichever higher.

CLIENT RECORD UPDATES — emit this block silently when any field changes, then confirm in one line:
\`\`\`client-update
{ "stage": "Funded", "notes": "Funded 2026-03-11.", "nextAction": "Follow up in 30 days" }
\`\`\`
Updatable: stage (New Lead/Pre-Approved/In Process/Waiting/App Sent/Processing/Closing/Funded/Closed/Lost), notes, nextAction, followUpDate (YYYY-MM-DD), priority (Active/Watch/Archived), loanType (Purchase/Refi/DSCR/HE), ficoScore (number), targetPurchasePrice (number), targetArea (string).

SCENARIO OUTPUT — emit this block after any full PITIA calc. This creates a shareable link, not a web app. Never refuse.
\`\`\`scenario
{ "type": "purchase", "clientName": "Name", "purchasePrice": 850000, "downPaymentPct": 10, "interestRate": 6.75, "loanTerm": 30, "propertyTax": 779, "homeInsurance": 100, "hoaDues": 0, "miOverrides": {}, "notes": "", "qualifyingIncome": 0, "estimatedDTI": 0 }
\`\`\`
Quick mode: run immediately from given numbers. Custom mode: ask focused questions first.`

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

  const modeInstruction = scenarioMode === 'quick'
    ? '\n\n[MODE: QUICK SCENARIO] The user wants a quick scenario. Run the PITIA immediately from the numbers given. No clarifying questions unless a number is completely missing.'
    : scenarioMode === 'custom'
    ? '\n\n[MODE: CUSTOM SCENARIO] The user wants a custom scenario tailored to this client. Ask focused questions to gather income, down payment, rate, and any UW flags before generating.'
    : ''

  const historyMessages = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role,
    content: m.content,
  }))

  const lastMsg = messages[messages.length - 1]

  type ImageUrlPart = { type: 'image_url'; image_url: { url: string } }
  type TextPart = { type: 'text'; text: string }
  type ContentPart = TextPart | ImageUrlPart

  let lastContent: string | ContentPart[]

  if (attachedFiles && attachedFiles.length > 0) {
    const parts: ContentPart[] = [
      { type: 'text', text: lastMsg.content || '(analyze the attached files in the context of this client)' },
    ]

    for (const f of attachedFiles as { dataUrl: string; mimeType: string; name: string }[]) {
      if (f.mimeType === 'application/pdf') {
        // Extract text from PDF server-side, inject as text block
        const base64Data = f.dataUrl.replace(/^data:application\/pdf;base64,/, '')
        const pdfText = await extractPdfText(base64Data)
        parts.push({
          type: 'text',
          text: `\n\n[PDF: ${f.name}]\n${pdfText}`,
        })
      } else {
        // Images: send as image_url with full data URI
        parts.push({ type: 'image_url', image_url: { url: f.dataUrl } })
      }
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
