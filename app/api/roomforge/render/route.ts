import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY

interface ConceptState {
  style?: string
  finish?: string
  hardware?: string
  colors?: string[]
  notes?: string
}

interface RoomSpec {
  walls?: {
    left?: { length: number }
    back?: { length: number }
    right?: { length: number }
    front?: { length: number }
  }
  ceiling?: {
    type?: string
    height?: number
    peakHeight?: number
  }
}

function buildStylePrompt(concept: ConceptState): string {
  const parts: string[] = [
    'photorealistic interior design render',
    'custom built-in cabinetry',
  ]

  if (concept.style) {
    const styleMap: Record<string, string> = {
      shaker: 'Shaker-style cabinet doors with clean lines',
      'flat-panel': 'modern flat-panel euro-style cabinets',
      euro: 'frameless European-style cabinetry',
      inset: 'traditional inset cabinet doors',
      beadboard: 'beadboard cabinet panels',
    }
    parts.push(styleMap[concept.style.toLowerCase()] || `${concept.style} style cabinets`)
  }

  if (concept.finish) {
    const finishMap: Record<string, string> = {
      'natural birch': 'natural birch wood finish, warm wood grain',
      white: 'crisp white painted cabinets',
      navy: 'deep navy blue painted cabinets',
      'sage green': 'soft sage green painted cabinets',
    }
    parts.push(finishMap[concept.finish.toLowerCase()] || `${concept.finish} finish`)
  }

  if (concept.hardware) {
    const hardwareMap: Record<string, string> = {
      minimal: 'minimal brushed brass bar pulls',
      traditional: 'traditional cup pulls in antique brass',
      industrial: 'matte black industrial hardware',
      hidden: 'push-to-open hidden hardware',
    }
    parts.push(hardwareMap[concept.hardware.toLowerCase()] || `${concept.hardware} hardware`)
  }

  parts.push(
    'professional photography',
    'warm ambient lighting',
    'high-end interior design',
    '8k resolution',
    'architectural visualization',
  )

  return parts.join(', ')
}

async function waitForReplicate(predictionId: string, maxWaitMs = 90000): Promise<string> {
  const start = Date.now()
  while (Date.now() - start < maxWaitMs) {
    await new Promise((r) => setTimeout(r, 2000))

    const res = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        Authorization: `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) throw new Error(`Replicate poll error: ${res.status}`)
    const data = await res.json()

    if (data.status === 'succeeded') {
      const output = data.output
      if (Array.isArray(output)) return output[0] as string
      if (typeof output === 'string') return output
      throw new Error('Unexpected output format')
    }

    if (data.status === 'failed' || data.status === 'canceled') {
      throw new Error(`Render ${data.status}: ${data.error || 'unknown error'}`)
    }
  }
  throw new Error('Render timed out after 90 seconds')
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { canvasImageBase64, concept = {}, roomSpec } = body as {
    canvasImageBase64?: string
    concept?: ConceptState
    roomSpec?: RoomSpec
  }

  if (!REPLICATE_API_KEY) {
    // If no Replicate key, return a placeholder render for development
    return NextResponse.json({
      imageUrl: `https://placehold.co/1024x768/1a1a2e/f59e0b?text=Render+Preview+%0A(No+Replicate+key)`,
      placeholder: true,
    })
  }

  try {
    const stylePrompt = buildStylePrompt(concept)

    // Prefer img2img with canvas image if available
    const useImg2Img = !!canvasImageBase64 && canvasImageBase64.length > 100

    let predictionPayload: Record<string, unknown>

    if (useImg2Img) {
      // Use adirik/interior-design for img2img with ControlNet
      predictionPayload = {
        version: 'adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8f9d3d5f5e7e5e4b06e1e2e7b',
        input: {
          image: canvasImageBase64,
          prompt: stylePrompt,
          negative_prompt: 'cartoon, illustration, drawing, low quality, blurry, distorted',
          num_inference_steps: 30,
          guidance_scale: 7.5,
          strength: 0.7,
        },
      }
    } else {
      // Text-to-image with SDXL
      predictionPayload = {
        version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        input: {
          prompt: stylePrompt,
          negative_prompt: 'cartoon, sketch, low quality, watermark, blurry, deformed',
          width: 1024,
          height: 768,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          scheduler: 'DPMSolverMultistep',
        },
      }
    }

    // Start the prediction
    const startRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(predictionPayload),
    })

    if (!startRes.ok) {
      const err = await startRes.text()
      throw new Error(`Failed to start render: ${err}`)
    }

    const prediction = await startRes.json()
    const imageUrl = await waitForReplicate(prediction.id)

    return NextResponse.json({ imageUrl })
  } catch (err) {
    console.error('[RoomForge Render Error]', err)
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Render failed',
        imageUrl: `https://placehold.co/1024x768/1a1a2e/f59e0b?text=Render+Failed`,
      },
      { status: 500 }
    )
  }
}
