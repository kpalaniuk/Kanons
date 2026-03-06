import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { description, type } = await req.json()
  if (!description || !type) return NextResponse.json({ error: 'Missing description or type' }, { status: 400 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'No AI key configured' }, { status: 500 })

  const purchasePrompt = `You are a mortgage scenario parser. Extract structured data from this client description and return ONLY valid JSON with these exact fields (use null for anything not mentioned):

{
  "clientName": string | null,
  "ficoScore": number | null,
  "monthlyIncome": number | null,
  "monthlyDebts": number | null,
  "availableAssets": number | null,
  "priceMin": number | null,
  "priceMax": number | null,
  "interestRate": number | null,
  "loanProgram": "Conventional" | "FHA" | "VA" | null,
  "propertyType": "Single Family" | "Condo" | "2-Unit" | "3-4 Unit" | null,
  "highCostArea": boolean | null,
  "notes": string | null
}

Description: ${description}`

  const refiPrompt = `You are a mortgage scenario parser. Extract structured data from this client description and return ONLY valid JSON with these exact fields (use null for anything not mentioned):

{
  "clientName": string | null,
  "currentBalance": number | null,
  "currentRate": number | null,
  "currentPayment": number | null,
  "currentTermRemaining": number | null,
  "propertyValue": number | null,
  "newRate": number | null,
  "cashOut": number | null,
  "closingCosts": number | null,
  "notes": string | null
}

Description: ${description}`

  const prompt = type === 'purchase' ? purchasePrompt : refiPrompt

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text ?? ''

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'Could not parse response' }, { status: 500 })

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json({ parsed })
  } catch (e: unknown) {
    console.error('Parse error:', e)
    return NextResponse.json({ error: 'AI parsing failed' }, { status: 500 })
  }
}
