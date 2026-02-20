import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const DEFAULT_MODEL = 'anthropic/claude-sonnet-4-5'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>
}

interface ChatRequest {
  messages: Message[]
  model?: string
  enabledKnowledgeBase?: string[]
}

async function loadKnowledgeBase(enabledFiles?: string[]): Promise<string> {
  try {
    const kbPath = join(process.cwd(), 'public', 'knowledge-base')
    
    // Always load INSTRUCTIONS.md as base
    const instructionsPath = join(kbPath, 'INSTRUCTIONS.md')
    const instructions = await readFile(instructionsPath, 'utf-8')
    
    if (!enabledFiles || enabledFiles.length === 0) {
      return instructions
    }
    
    // Load enabled knowledge base files
    const kbContents = await Promise.all(
      enabledFiles
        .filter(file => file !== 'INSTRUCTIONS.md')
        .map(async (file) => {
          try {
            const filePath = join(kbPath, file)
            const content = await readFile(filePath, 'utf-8')
            return `\n\n---\n# Knowledge Base: ${file}\n${content}`
          } catch (err) {
            console.error(`Failed to load ${file}:`, err)
            return ''
          }
        })
    )
    
    return instructions + kbContents.join('')
  } catch (error) {
    console.error('Failed to load knowledge base:', error)
    return 'You are a mortgage underwriting consultant assistant.'
  }
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
    return new Response(
      JSON.stringify({ error: 'OpenRouter API key not configured' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    const body: ChatRequest = await request.json()
    const { messages, model = DEFAULT_MODEL, enabledKnowledgeBase } = body

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Load system prompt with knowledge base
    const systemPrompt = await loadKnowledgeBase(enabledKnowledgeBase)

    // Prepare messages for OpenRouter
    const apiMessages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ]

    // Call OpenRouter API with streaming
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://kyle.palaniuk.net',
        'X-Title': 'Kanons Underwriting Assistant',
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenRouter API error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to get response from AI model' }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Stream the response back to the client
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            
            if (done) {
              controller.close()
              break
            }

            // Forward the chunk to the client
            controller.enqueue(value)
          }
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
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
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
