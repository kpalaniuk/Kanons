import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { pdfBase64, fileName } = await request.json()
  if (!pdfBase64) return NextResponse.json({ error: 'pdfBase64 required' }, { status: 400 })

  try {
    // node-canvas exports the DOM globals pdfjs needs in a Node environment
    const canvasModule = await import('canvas')
    const { DOMMatrix, DOMPoint, ImageData, createCanvas } = canvasModule

    // Polyfill browser globals pdfjs expects
    if (!global.DOMMatrix) (global as Record<string, unknown>).DOMMatrix = DOMMatrix
    if (!global.DOMPoint)  (global as Record<string, unknown>).DOMPoint  = DOMPoint
    if (!global.ImageData) (global as Record<string, unknown>).ImageData = ImageData

    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs' as string)
    pdfjsLib.GlobalWorkerOptions.workerSrc = ''

    const pdfBuffer = Buffer.from(pdfBase64, 'base64')
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) }).promise

    const baseName = (fileName as string || 'page').replace(/\.pdf$/i, '')
    const maxPages = Math.min(pdf.numPages, 20)
    const images: { name: string; dataUrl: string; mimeType: string }[] = []

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const scale = 1.5
      const viewport = page.getViewport({ scale })

      const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height))
      const ctx = canvas.getContext('2d')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await page.render({ canvasContext: ctx as any, viewport }).promise

      const jpegBuffer = canvas.toBuffer('image/jpeg', { quality: 0.82 })
      const dataUrl = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`
      images.push({ name: `${baseName}-p${pageNum}.jpg`, dataUrl, mimeType: 'image/jpeg' })
    }

    return NextResponse.json({ images, pageCount: pdf.numPages })
  } catch (err) {
    console.error('PDF render error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
