import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

export async function POST(request: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: 'OpenRouter API key not configured' },
      { status: 500 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const mimeType = file.type || 'image/png'
    const dataUrl = `data:${mimeType};base64,${base64}`

    // Send to OpenRouter with vision model
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://kyle.palaniuk.net',
        'X-Title': 'Kanons DSCR Rate Sheet Parser',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4-5',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: dataUrl,
                },
              },
              {
                type: 'text',
                text: `Extract the DSCR rate sheet from this image and convert it to JSON format.

**Required JSON structure:**
\`\`\`json
{
  "rates": [
    {
      "ltv_min": 0,
      "ltv_max": 70,
      "fico_min": 720,
      "fico_max": 739,
      "standard_rate": 7.125,
      "io_adjustment": 0.125
    }
  ]
}
\`\`\`

**Instructions:**
1. Find the rate table in the image
2. Extract all LTV ranges, FICO ranges, rates, and interest-only adjustments
3. Convert to the JSON format above
4. Return ONLY the JSON, no explanation or markdown formatting
5. If you can't find a rate table, respond with: {"error": "No rate table found in image"}

Parse the image now:`,
              },
            ],
          },
        ],
        temperature: 0,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenRouter API error:', error)
      return NextResponse.json(
        { error: 'Failed to parse rate sheet' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || '{}'

    // Try to parse the response as JSON
    try {
      // Strip markdown code blocks if present
      let jsonStr = content.trim()
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/\n?```/g, '')
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n?/g, '').replace(/\n?```/g, '')
      }

      const parsed = JSON.parse(jsonStr)

      if (parsed.error) {
        return NextResponse.json({ error: parsed.error }, { status: 400 })
      }

      return NextResponse.json(parsed)
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      return NextResponse.json(
        { error: 'AI returned invalid JSON format', raw: content },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Rate sheet parsing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
