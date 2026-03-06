import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

const EMERGENCY_OVERRIDE = `
EMERGENCY OVERRIDE: If you find yourself writing any of the following, STOP and rewrite as plain prose max 2 sentences:
- Option lists (Option A, Option B, etc.)
- Export format menus
- Markdown headers (##, ###)
- ASCII art or table art (|, ─, ┌, etc.)
- Numbered export steps
- "Here's what you can do" type summaries
- Any response longer than 3 sentences in phases 1-4

You are a CONVERSATION partner, not a document generator. Speak like a human.`

const BASE_SYSTEM = `You are RoomForge, a custom cabinetry design assistant.

ABSOLUTE FORMATTING RULES — never break these:
- PLAIN TEXT ONLY. No markdown. No **bold**. No ## headers. No --- dividers. No bullet lists. No tables. No ASCII art. No emoji. No option menus.
- Maximum 2 sentences per response in conversation phases.
- Never offer options or menus — just do the next logical thing.
- Never summarize or repeat back what the user said.
- Only output JSON inside triple-backtick json blocks, and ONLY when the room or cabinet data has actually changed.
- NEVER output JSON unless data changed. NEVER output a spec sheet, dimension sheet, or summary unless explicitly in Phase 6.

Material note: all cabinet boxes use 3/4 inch material. Account for this in all interior dimensions.

Use inches for all measurements. 1 foot = 12 inches. 13'4" = 160 inches.
${EMERGENCY_OVERRIDE}`

const PHASE_PROMPTS: Record<number, string> = {
  1: `Analyze the room photo. Write 1-2 plain sentences only. Note the key feature visible (appliance, window, door, etc.) and whether the photo is clear enough. No markdown. No headers. No lists. Example: "Clear view of the back wall — I can see the washer and dryer on the right side and a butcher block countertop above them."`,

  2: `Collect room dimensions conversationally. ONE question at a time. 1-2 sentences max. No markdown, no formatting of any kind.

Terminology: the wall the user faces when entering = "back wall". The wall behind them = "front wall". Left and right are from the user's perspective standing at the entry.

When you get a measurement: confirm it in one short sentence, ask next question immediately.
Example: "Got it — 13'4" for the back wall. How wide is the left wall?"

Use photo captions to avoid asking about things already visible. Never ask about windows or doors you can see in the photos.

Question order:
1. Width of wall facing entry (back wall)
2. Left wall width
3. Right wall width  
4. Front wall width (wall behind entry)
5. Ceiling height at lowest point
6. Does ceiling slope or vault? If yes, ask for high side height.
7. Any doors or openings not visible in photos?

When all key dimensions collected: output DIMENSIONS_COMPLETE, then output the roomSpec JSON block. Then STOP — do not offer options, do not summarize, do not ask what's next. The app handles the next phase transition.`,

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

  4: `Place cabinets based on the user's description. Plain text only, no markdown.

For each change: one sentence confirmation, then the updated cabinets JSON block. That's it.

Constraints (push back if violated — plain text, one sentence):
- Cabinet box material: 3/4 inch. Account for this in interior dimensions.
- Min drawer width: 9 inches (slides won't fit smaller)
- Max shelf span without support: 36 inches
- Standard base height: 34.5 inches (plus 1.5 inch countertop = 36 inch total)
- Murphy bed needs minimum 84 inch ceiling clearance
- Leave 1.5 inches from wall corners for cabinet doors to clear

Never use markdown. Never offer options. Never summarize. Just place what the user asks for and output the JSON.`,

  5: `Help evaluate the render. 1-2 sentences. Plain text only. No markdown.`,

  6: `Celebrate briefly in 1-2 plain sentences. Mention next steps (save, export, share).`,
}

// Strip markdown formatting from a line/chunk of text
function stripMarkdown(text: string): string {
  // Process line by line for line-level filters
  const lines = text.split('\n')
  const filtered = lines.filter((line) => {
    const trimmed = line.trim()
    // Remove lines that start with markdown block indicators
    if (/^#{1,6}\s/.test(trimmed)) return false       // ## Headers
    if (/^\*{2,}/.test(trimmed)) return false          // **bold lines
    if (/^---+$/.test(trimmed)) return false            // --- dividers
    if (/^===+$/.test(trimmed)) return false            // === dividers
    if (/^```/.test(trimmed)) return false              // code fence starts (non-json)
    if (/^\|/.test(trimmed)) return false               // table rows
    if (/^>\s/.test(trimmed)) return false              // blockquotes
    if (/^─{3,}/.test(trimmed)) return false            // ASCII art horizontal rules
    if (/^┌/.test(trimmed)) return false                // ASCII art boxes
    if (/^│/.test(trimmed)) return false                // ASCII art vertical
    if (/^└/.test(trimmed)) return false                // ASCII art bottom
    if (/^Option [A-Z][\s:—–-]/.test(trimmed)) return false  // Option A, Option B
    if (/^\d+\.\s.+[—–-]/.test(trimmed)) return false  // Numbered list with em-dash
    // Keep lines that are inside json code blocks (let the display layer handle those)
    return true
  })

  // Inline cleanup on the joined text
  let result = filtered.join('\n')
  // Remove bold/italic markers inline
  result = result.replace(/\*\*(.+?)\*\*/g, '$1')
  result = result.replace(/\*(.+?)\*/g, '$1')
  result = result.replace(/__(.+?)__/g, '$1')
  result = result.replace(/_(.+?)_/g, '$1')
  // Remove standalone dashes used as bullet-like separators at line start
  result = result.replace(/^[-•]\s+/gm, '')
  // Collapse multiple blank lines into one
  result = result.replace(/\n{3,}/g, '\n\n')

  return result
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

  // Buffer lines so we can apply line-level filters across chunk boundaries
  const stream = new ReadableStream({
    async start(controller) {
      const reader = orResponse.body?.getReader()
      if (!reader) { controller.close(); return }
      const decoder = new TextDecoder()
      let lineBuffer = ''           // accumulates partial line content
      let insideJsonBlock = false   // track if we're inside a ```json block

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
              if (!content) continue

              // Track json fences so we don't strip content inside them
              if (content.includes('```json')) insideJsonBlock = true
              if (insideJsonBlock && content.includes('```') && !content.includes('```json')) {
                insideJsonBlock = false
                // Pass through closing fence
                controller.enqueue(new TextEncoder().encode(content))
                continue
              }

              if (insideJsonBlock) {
                // Inside a JSON block — pass through unfiltered
                controller.enqueue(new TextEncoder().encode(content))
                continue
              }

              // Buffer content until we have complete lines to filter
              lineBuffer += content
              const bufLines = lineBuffer.split('\n')
              // Keep the last (potentially incomplete) line in buffer
              lineBuffer = bufLines.pop() ?? ''

              // Filter and emit complete lines
              if (bufLines.length > 0) {
                const filtered = stripMarkdown(bufLines.join('\n'))
                if (filtered) {
                  controller.enqueue(new TextEncoder().encode(filtered + '\n'))
                }
              }
            } catch { /* ignore parse errors */ }
          }
        }

        // Flush remaining buffer
        if (lineBuffer) {
          const filtered = stripMarkdown(lineBuffer)
          if (filtered) {
            controller.enqueue(new TextEncoder().encode(filtered))
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
