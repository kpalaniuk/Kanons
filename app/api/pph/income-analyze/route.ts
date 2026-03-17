import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orKey = process.env.OPENROUTER_API_KEY
  if (!orKey) return NextResponse.json({ error: 'OpenRouter not configured' }, { status: 500 })

  const body = await request.json()
  const { files, context, loanProgram } = body as {
    files: { name: string; base64: string; mimeType: string }[]
    context: string
    loanProgram: string
  }

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 })
  }

  const prompt = `You are a mortgage underwriting assistant analyzing income documents.

Loan Program: ${loanProgram || 'Conventional'}
Borrower Context: ${context || 'No additional context provided.'}

Analyze the attached income documents and return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "incomeType": "W2" | "Self-Employed" | "1099" | "Rental" | "Social Security" | "Pension" | "Other",
  "grossMonthlyIncome": <number — the qualifying monthly income figure>,
  "basis": "detailed explanation of how the income was calculated (e.g. 'W2 Box 1 ÷ 12', '2yr avg net income + depreciation ÷ 24', etc.)",
  "employer": "<employer or source name if visible>",
  "frequency": "monthly" | "bi-weekly" | "weekly" | "annual" | "variable",
  "warnings": ["list any red flags, gaps, or things an underwriter would flag"],
  "explanation": "1-2 sentence plain-English summary of the income picture for this borrower"
}

Mortgage income rules:
- W2: use Box 1 ÷ 12 (or annualize YTD if more current)
- Self-employed: 2-year average of (net income + depreciation + depletion + amortization) ÷ 24
- Rental: 75% of gross rents (or net per Schedule E) minus PITIA
- Bonus/OT: 2-year average only if likely to continue
- 1099/contract: treat as self-employed if consistent 2yr history

Only return the JSON object. No markdown fences.`

  type ContentPart =
    | { type: 'text'; text: string }
    | { type: 'image_url'; image_url: { url: string } }

  const parts: ContentPart[] = [{ type: 'text', text: prompt }]

  for (const file of files) {
    // Claude via OpenRouter supports image/* and PDF via base64 data URI
    const mimeType = file.mimeType === 'application/pdf' ? 'image/jpeg' : file.mimeType
    parts.push({
      type: 'image_url',
      image_url: { url: `data:${mimeType};base64,${file.base64}` },
    })
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${orKey}`,
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4-6',
      messages: [{ role: 'user', content: parts }],
      max_tokens: 1200,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    return NextResponse.json({ error: `OpenRouter error: ${err}` }, { status: 502 })
  }

  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content?.trim() || ''

  let analysis: Record<string, unknown> = {}
  let qualifyingIncome = 0
  let explanation = ''

  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
    analysis = JSON.parse(cleaned)
    qualifyingIncome = typeof analysis.grossMonthlyIncome === 'number' ? analysis.grossMonthlyIncome : 0
    explanation = typeof analysis.explanation === 'string' ? analysis.explanation : ''
  } catch {
    explanation = raw
  }

  return NextResponse.json({ analysis, qualifyingIncome, explanation })
}
