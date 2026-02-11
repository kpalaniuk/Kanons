import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { readFileSync } from 'fs'

const ALLOWED_EMAILS = (process.env.FAMILY_ALLOWED_EMAILS || 'kpalaniuk@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase())

async function verifyAllowedUser(userId: string): Promise<boolean> {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase()
    return !!email && ALLOWED_EMAILS.includes(email)
  } catch {
    return false
  }
}

const ARTIFACT_FILES: Record<string, string> = {
  'lo-buddy-briefing': '/data/.openclaw/workspace/memory/lo-buddy-briefing.md',
}

function generateLocalSummary(content: string, title: string): string {
  const lines = content.split('\n')
  const headers: string[] = []
  let totalWords = 0
  const sections: { header: string; wordCount: number; preview: string }[] = []

  let currentHeader = 'Introduction'
  let currentWords = 0
  let currentPreview = ''

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,3})\s+(.+)/)
    if (headerMatch) {
      if (currentHeader) {
        sections.push({ header: currentHeader, wordCount: currentWords, preview: currentPreview.trim().slice(0, 150) })
      }
      currentHeader = headerMatch[2]
      headers.push(headerMatch[2])
      currentWords = 0
      currentPreview = ''
    } else {
      const words = line.trim().split(/\s+/).filter(Boolean).length
      currentWords += words
      totalWords += words
      if (currentPreview.length < 150 && line.trim()) {
        currentPreview += ' ' + line.trim()
      }
    }
  }
  // Push last section
  if (currentHeader) {
    sections.push({ header: currentHeader, wordCount: currentWords, preview: currentPreview.trim().slice(0, 150) })
  }

  const topSections = sections
    .filter(s => s.wordCount > 20)
    .sort((a, b) => b.wordCount - a.wordCount)
    .slice(0, 8)

  const readTime = Math.ceil(totalWords / 200)

  let summary = `# 📋 Summary: ${title}\n\n`
  summary += `**${totalWords.toLocaleString()} words** · **~${readTime} min read** · **${headers.length} sections**\n\n`
  summary += `---\n\n`
  summary += `## Key Sections\n\n`

  for (const section of topSections) {
    summary += `### ${section.header}\n`
    if (section.preview) {
      summary += `${section.preview}...\n\n`
    }
  }

  // Extract any bullet points that look like key takeaways
  const keyPoints = lines
    .filter(l => l.match(/^[-*]\s+\*\*.+\*\*/))
    .slice(0, 10)

  if (keyPoints.length > 0) {
    summary += `---\n\n## Key Points\n\n`
    for (const point of keyPoints) {
      summary += `${point}\n`
    }
  }

  return summary
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!(await verifyAllowedUser(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { slug } = await params
  const filePath = ARTIFACT_FILES[slug]

  if (!filePath) {
    return NextResponse.json({ error: 'Artifact not found' }, { status: 404 })
  }

  try {
    const content = readFileSync(filePath, 'utf-8')
    // Get the title from the artifact registry or first heading
    const titleMatch = content.match(/^#\s+(.+)/m)
    const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ')

    const summary = generateLocalSummary(content, title)
    return NextResponse.json({ slug, summary })
  } catch (error) {
    console.error(`Error generating summary for ${slug}:`, error)
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}
