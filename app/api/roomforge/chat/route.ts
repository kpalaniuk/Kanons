import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const BASE_SYSTEM = `You are RoomForge, an expert custom cabinetry and interior design assistant. You help interior designers and homeowners plan and visualize custom built-in cabinetry.

When updating the room model, always output:
1. A brief natural language response
2. A JSON code block with the COMPLETE updated roomSpec (when room changes occur)
3. A second JSON code block with the COMPLETE updated cabinets array (when cabinet changes occur)

Always output COMPLETE JSON (not diffs). Use inches for all measurements. 1 foot = 12 inches.

RoomSpec JSON shape:
\`\`\`json
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
\`\`\`

Cabinet JSON shape:
\`\`\`json
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
]
\`\`\``

const PHASE_PROMPTS: Record<number, string> = {
  1: `You are analyzing room photos. Comment on photo quality, identify walls, note any fixtures or features visible (appliances, existing shelving, windows, doors, outlets). Be encouraging and specific. Keep responses to 2-3 sentences max.`,

  2: `You are collecting room dimensions conversationally. Ask ONE question at a time. Start with the widest wall. Confirm each measurement before moving on. Use a friendly, encouraging tone. 

When you receive a dimension, acknowledge it clearly like "Got it — 13'4\" for the back wall."

When you have collected all of these:
- All 4 wall widths
- Ceiling height (and any vault or slope info)
- Door and window positions (approximate is fine)

Output DIMENSIONS_COMPLETE in your message and update the roomSpec JSON with the confirmed dimensions.

Dimension tracking tips:
- Convert feet+inches to total inches (13'4" = 160")
- Store in roomSpec.walls
- Store openings for doors/windows in roomSpec.openings`,

  3: `You are an enthusiastic design consultant for custom cabinetry. Your job is to discover the client's vision through friendly conversation.

Collect this information across the conversation (not all at once):
- Cabinet style: shaker, flat-panel, euro/frameless, inset, beadboard
- Finish: natural birch, painted white, navy, sage green, custom color
- Hardware: minimal bar pulls, traditional cup pulls, industrial black, hidden push-to-open
- Cabinet types needed: base cabinets, uppers, tall pantry, desk, murphy bed, wardrobe, entertainment center
- Colors: ask for palette preferences, translate to specific hex values

If they say "surprise me" — pick a cohesive, sophisticated concept and describe it enthusiastically.

When you have enough information to define the concept, output a JSON block with the concept:
\`\`\`json
{
  "style": "shaker",
  "finish": "natural birch",
  "hardware": "minimal bar pulls",
  "colors": ["#C4975A", "#F5F0E8", "#2C2C2C"],
  "notes": "Warm, natural aesthetic with clean lines. Birch grain featured prominently."
}
\`\`\``,

  4: `You are translating a design concept into specific cabinet placements in a 3D room model. 

For every message that involves adding, moving, or removing cabinets:
1. Acknowledge the change in natural language
2. Output the COMPLETE updated roomSpec JSON
3. Output the COMPLETE updated cabinets array JSON

Cabinet placement rules (David's constraints):
- Minimum drawer width: 9 inches
- Maximum shelf span without support: 36 inches
- Standard base cabinet height: 34.5 inches (+ 1.5" countertop = 36" total)
- Standard upper cabinet depth: 12-13 inches
- Standard base cabinet depth: 24 inches
- Murphy bed min width: 42 inches (twin), 54 inches (full), 60 inches (queen)
- Leave 3" from wall edges for corner clearance

When you place cabinets, be specific about:
- Which wall
- Exact offset from left
- Width, height, depth
- Label each cabinet clearly`,

  5: `You are helping the user evaluate and refine their photorealistic render. Be enthusiastic about what's working. Offer specific, actionable adjustments if anything looks off. Keep responses brief and visual.`,

  6: `Celebrate the completed design! Be warm and congratulatory. Help the user understand their next steps: saving the project, exporting the cut list, or sharing with their client. Keep it brief and upbeat.`,
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { messages, roomSpec, cabinets, phase = 4, photos = [] } = body

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'OPENROUTER_API_KEY not set' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const phasePrompt = PHASE_PROMPTS[phase] || PHASE_PROMPTS[4]
  const systemPrompt = `${BASE_SYSTEM}\n\n## Current Phase: ${phase}\n${phasePrompt}`

  // Build messages for the API
  interface ApiMessage {
    role: 'user' | 'assistant' | 'system'
    content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>
  }

  const apiMessages: ApiMessage[] = []

  // Add context message (current state)
  if (phase >= 2 && roomSpec) {
    apiMessages.push({
      role: 'user',
      content: `Current room spec:\n\`\`\`json\n${JSON.stringify(roomSpec, null, 2)}\n\`\`\`\n\nCurrent cabinets:\n\`\`\`json\n${JSON.stringify(cabinets || [], null, 2)}\n\`\`\``,
    })
    apiMessages.push({
      role: 'assistant',
      content: 'Understood, I have the current room and cabinet state. How can I help?',
    })
  }

  // For phase 1, include photos as vision content
  if (phase === 1 && photos.length > 0) {
    const lastUserMsg = [...messages].reverse().find((m: { role: string; content: string }) => m.role === 'user')
    const otherMsgs = messages.slice(0, -1)

    // Add prior messages
    for (const msg of otherMsgs) {
      apiMessages.push({ role: msg.role, content: msg.content })
    }

    // Build vision message for the last user turn
    const visionContent: Array<{ type: string; text?: string; image_url?: { url: string } }> = []
    if (lastUserMsg?.content) {
      visionContent.push({ type: 'text', text: lastUserMsg.content })
    }
    for (const photo of photos.slice(0, 4)) {
      // Limit to 4 photos max
      if (photo.dataUrl) {
        visionContent.push({
          type: 'image_url',
          image_url: { url: photo.dataUrl },
        })
      }
    }
    if (visionContent.length > 0) {
      apiMessages.push({ role: 'user', content: visionContent })
    }
  } else {
    // Add all messages as text
    for (const msg of messages) {
      apiMessages.push({ role: msg.role, content: msg.content })
    }
  }

  const modelForPhase = phase === 1 && photos.length > 0
    ? 'anthropic/claude-sonnet-4-6' // Vision-capable
    : 'anthropic/claude-sonnet-4-6'

  const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://kanon.hotclaw.ai',
      'X-Title': 'RoomForge',
    },
    body: JSON.stringify({
      model: modelForPhase,
      stream: true,
      system: systemPrompt,
      messages: apiMessages,
    }),
  })

  if (!orResponse.ok) {
    const err = await orResponse.text()
    return new Response(JSON.stringify({ error: err }), {
      status: orResponse.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = orResponse.body?.getReader()
      if (!reader) { controller.close(); return }
      const decoder = new TextDecoder()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content
              if (content) controller.enqueue(new TextEncoder().encode(content))
            } catch { /* ignore */ }
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
