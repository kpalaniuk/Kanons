import { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

export async function GET(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const kbPath = join(process.cwd(), 'public', 'knowledge-base')
    const files = await readdir(kbPath)
    
    // Filter for .md files and get their stats
    const mdFiles = files.filter(f => f.endsWith('.md'))
    
    const filesWithSize = await Promise.all(
      mdFiles.map(async (filename) => {
        const filePath = join(kbPath, filename)
        const stats = await stat(filePath)
        return {
          filename,
          size: stats.size,
        }
      })
    )

    return new Response(JSON.stringify(filesWithSize), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Failed to list knowledge base files:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to list knowledge base files' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
