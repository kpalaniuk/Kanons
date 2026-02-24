import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

// Default model for Focus Chat — Claude Sonnet 4.5: better conversational depth + artifact quality
const DEFAULT_MODEL = 'anthropic/claude-sonnet-4-5'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface FocusRequest {
  messages: Message[]
  systemPrompt: string
  model?: string
  generateArtifact?: boolean
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: 'OpenRouter API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const body: FocusRequest = await request.json()
  const { messages, systemPrompt, model = DEFAULT_MODEL, generateArtifact = false } = body

  // Build final system prompt — add artifact instructions if generating
  const finalSystemPrompt = generateArtifact
    ? `${systemPrompt}\n\n---\nThe user has clicked "Generate Artifact". Based on everything discussed so far, produce a single clean, well-structured document as your response. Use markdown formatting with clear sections, headers, and lists. This is the final output — make it thorough, polished, and ready to use.`
    : systemPrompt

  const apiMessages = [
    { role: 'system', content: finalSystemPrompt },
    ...messages,
  ]

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://kyle.palaniuk.net',
      'X-Title': 'Kanons Workshop Focus Chat',
    },
    body: JSON.stringify({
      model,
      messages: apiMessages,
      stream: true,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('OpenRouter error:', error)
    return new Response(JSON.stringify({ error: 'AI request failed' }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader()
      if (!reader) { controller.close(); return }
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) { controller.close(); break }
          controller.enqueue(value)
        }
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
