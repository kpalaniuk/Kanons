import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const BASE_SYSTEM = `You are RoomForge, a custom cabinetry design assistant. You help designers plan built-in cabinetry through natural conversation.

CRITICAL FORMATTING RULES — follow these exactly:
- NO markdown formatting in conversational responses (no **bold**, no ## headers, no --- dividers)
- Keep responses SHORT — maximum 3 sentences for conversational messages
- Only use JSON code blocks when updating the room model
- Never use bullet points in conversational responses — write in plain prose
- Never repeat what the user just said back to them

When updating the room model output:
1. One short plain-text confirmation sentence
2. A JSON code block with the complete updated roomSpec (only when room dimensions/openings change)
3. A second JSON code block with the complete updated cabinets array (only when cabinets change)

Use inches for all measurements. 1 foot = 12 inches. 1'4" = 16 inches. 13'4" = 160 inches.`

const PHASE_PROMPTS: Record<number, string> = {
  1: `Analyze the room photo. Write 1-2 plain sentences only. Note the key feature visible (appliance, window, door, etc.) and whether the photo is clear enough. No markdown. No headers. No lists. Example: "Clear view of the back wall — I can see the washer and dryer on the right side and a butcher block countertop above them."`,

  2: `Collect room dimensions through natural conversation. ONE question per message. Keep each message to 1-2 sentences max. No markdown, no bold, no headers.

When you receive a measurement, confirm it in one short sentence and ask the next question.
Example: "Got it, 13 feet 4 inches for the back wall. How wide is the left wall?"

IMPORTANT: You have access to photos of this room. DO NOT ask about things clearly visible in the photos (like whether there are windows or doors). Only ask about dimensions you cannot determine from photos.

Order of questions:
1. Width of the main wall (entry view)
2. Width of the left wall  
3. Width of the back wall
4. Width of the right wall
5. Ceiling height at the lowest point
6. If ceiling slopes or vaults, ask for the high side height
7. Front wall (behind entry) width
8. Only ask about door/window positions if NOT visible in photos

When you have all key dimensions, say "DIMENSIONS_COMPLETE" and output the roomSpec JSON.`,

  3: `You are a design consultant. Friendly, concise, no markdown. 2-3 sentences per message max.

Collect across conversation (one topic at a time):
- Cabinet style (shaker / flat-panel / euro frameless / inset)
- Finish (natural birch / painted: what color? / stained)
- Hardware (minimal pulls / cup pulls / hidden push-open)
- What they want in the space (desk, storage, murphy bed, pantry, etc.)

If they say "surprise me" — pick something cohesive and describe it in 2 sentences.

When concept is defined, output a JSON block:
\`\`\`json
{"style":"shaker","finish":"natural birch","hardware":"minimal bar pulls","colors":["#C4975A","#F5F0E8"],"notes":"Warm natural aesthetic"}
\`\`\``,

  4: `Translate design concept into cabinet placements. For each cabinet change:
1. One plain sentence confirming what you placed
2. Complete updated roomSpec JSON (if room changed)
3. Complete updated cabinets JSON

David's constraints (push back if violated):
- Min drawer width: 9 inches
- Max shelf span without support: 36 inches  
- Standard base height: 34.5 inches
- Murphy bed min ceiling: 84 inches
- Leave 3 inches from wall corners

Never use markdown in conversational text.`,

  5: `Help evaluate the render. 1-2 sentences. Plain text only. No markdown.`,

  6: `Celebrate briefly in 1-2 plain sentences. Mention next steps (save, export, share).`,
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

  interface ApiMessage {
    role: 'user' | 'assistant' | 'system'
    content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>
  }

  const apiMessages: ApiMessage[] = []

  // Add room state context for phases 2+
  if (phase >= 2 && roomSpec) {
    apiMessages.push({
      role: 'user',
      content: `Current room spec: ${JSON.stringify(roomSpec)}`,
    })
    apiMessages.push({
      role: 'assistant',
      content: 'Got it.',
    })
  }

  // Phase 1: vision with photos
  if (phase === 1 && photos.length > 0) {
    const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
    const otherMsgs = messages.slice(0, -1)

    for (const msg of otherMsgs) {
      apiMessages.push({ role: msg.role, content: msg.content })
    }

    const visionContent: Array<{ type: string; text?: string; image_url?: { url: string } }> = []
    if (lastUserMsg?.content) {
      visionContent.push({ type: 'text', text: lastUserMsg.content })
    }
    for (const photo of photos.slice(0, 3)) {
      if (photo.dataUrl) {
        visionContent.push({ type: 'image_url', image_url: { url: photo.dataUrl } })
      }
    }
    if (visionContent.length > 0) {
      apiMessages.push({ role: 'user', content: visionContent })
    }
  } else {
    // Phase 2: include photo captions as context so AI doesn't ask about visible things
    if (phase === 2 && photos.length > 0) {
      const captions = photos
        .filter((p: { aiCaption?: string; slot: string }) => p.aiCaption)
        .map((p: { slot: string; aiCaption: string }) => `${p.slot}: ${p.aiCaption}`)
        .join('\n')
      if (captions) {
        apiMessages.push({
          role: 'user',
          content: `Photo analysis (already done — use this to avoid asking about visible things):\n${captions}`,
        })
        apiMessages.push({ role: 'assistant', content: 'Noted.' })
      }
    }

    for (const msg of messages) {
      apiMessages.push({ role: msg.role, content: msg.content })
    }
  }

  const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://kyle.palaniuk.net',
      'X-Title': 'RoomForge',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4-6',
      stream: true,
      system: systemPrompt,
      messages: apiMessages,
      max_tokens: 800,
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
