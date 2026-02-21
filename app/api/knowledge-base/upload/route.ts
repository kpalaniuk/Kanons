import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { writeFile, readdir, stat } from 'fs/promises'
import { join } from 'path'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Validate file type
    if (!file.name.endsWith('.md')) {
      return new Response(
        JSON.stringify({ error: 'Only .md files are allowed' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File size exceeds 5MB limit' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Read file content
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Save to knowledge base directory
    const kbPath = join(process.cwd(), 'public', 'knowledge-base')
    const filePath = join(kbPath, file.name)
    
    await writeFile(filePath, buffer)

    // Return updated file list
    const files = await readdir(kbPath)
    const mdFiles = files.filter(f => f.endsWith('.md'))
    
    const filesWithSize = await Promise.all(
      mdFiles.map(async (filename) => {
        const fp = join(kbPath, filename)
        const stats = await stat(fp)
        return {
          filename,
          size: stats.size,
        }
      })
    )

    return new Response(
      JSON.stringify({
        success: true,
        filename: file.name,
        files: filesWithSize,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Failed to upload file:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to upload file' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
