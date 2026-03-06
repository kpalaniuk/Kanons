import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const SYSTEM_PROMPT = `You are RoomForge, a parametric room and cabinet design assistant. You help users design custom built-in cabinetry by:
1. Parsing natural language room descriptions into a structured RoomSpec JSON
2. Adding cabinet placements to the design based on descriptions
3. Answering questions about cabinet sizing, layout, and design

When the user describes a room or makes changes, respond with:
1. A brief acknowledgment of what you're updating
2. A JSON code block with the COMPLETE updated roomSpec
3. If they're adding cabinets, a second JSON code block with the COMPLETE updated cabinets array

Always output complete JSON (not diffs). Use inches for all measurements. 1 foot = 12 inches.

Example room (pre-load this as the default):
- Left wall: 17' (204")  
- Back wall: 13'4" (160")
- Right wall: 17' (204") 
- Front wall: 13'4" (160")
- Ceiling: shed vault, 9' (108") on left rising to 15' (180") on right
- Front wall: tri-fold door, 8" from left wall, 9' wide
- Right wall: open space first 10' (120"), then 7' (84") wall on right with sink + washer/dryer area

Output roomSpec and cabinets JSON when updating.

RoomSpec JSON shape:
{
  "walls": {
    "left": { "length": 204 },
    "back": { "length": 160 },
    "right": { "length": 204 },
    "front": { "length": 160 }
  },
  "ceiling": {
    "type": "shed-vault",
    "height": 108,
    "peakHeight": 180
  },
  "openings": [
    {
      "wall": "front",
      "type": "trifold",
      "offsetFromLeft": 8,
      "width": 108,
      "height": 96
    }
  ]
}

Cabinet JSON shape:
[
  {
    "id": "unique-id",
    "wall": "left",
    "offsetFromLeft": 0,
    "offsetFromFloor": 0,
    "width": 24,
    "depth": 24,
    "height": 34.5,
    "type": "base",
    "color": "#C4975A",
    "label": "Base cabinet"
  }
]`

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { messages, roomSpec, cabinets } = body

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'OPENROUTER_API_KEY not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const contextMsg = {
    role: 'user' as const,
    content: `Current room spec:\n\`\`\`json\n${JSON.stringify(roomSpec, null, 2)}\n\`\`\`\n\nCurrent cabinets:\n\`\`\`json\n${JSON.stringify(cabinets, null, 2)}\n\`\`\``,
  }

  const allMessages = [
    contextMsg,
    ...messages,
  ]

  const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://kanon.hotclaw.ai',
      'X-Title': 'RoomForge',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4-6',
      stream: true,
      system: SYSTEM_PROMPT,
      messages: allMessages,
    }),
  })

  if (!orResponse.ok) {
    const err = await orResponse.text()
    return new Response(JSON.stringify({ error: err }), {
      status: orResponse.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Stream the response back
  const stream = new ReadableStream({
    async start(controller) {
      const reader = orResponse.body?.getReader()
      if (!reader) {
        controller.close()
        return
      }
      const decoder = new TextDecoder()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          // Parse SSE lines and forward content
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content
              if (content) {
                controller.enqueue(new TextEncoder().encode(content))
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      } finally {
        reader.releaseLock()
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  })
}
