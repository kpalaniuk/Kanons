import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { readFileSync } from 'fs'
import { join } from 'path'

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
  'lo-buddy-meeting-prep': 'lo-buddy-meeting-prep.md',
  'lo-buddy-briefing': 'lo-buddy-briefing.md',
}

function generateLocalSummary(content: string, title: string): string {
  const lines = content.split('\n')
  const sections: { header: string; level: number; wordCount: number; bullets: string[] }[] = []
  let totalWords = 0

  let currentHeader = 'Introduction'
  let currentLevel = 1
  let currentWords = 0
  let currentBullets: string[] = []

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,3})\s+(.+)/)
    if (headerMatch) {
      if (currentHeader && (currentWords > 10 || currentBullets.length > 0)) {
        sections.push({ header: currentHeader, level: currentLevel, wordCount: currentWords, bullets: currentBullets })
      }
      currentHeader = headerMatch[2]
      currentLevel = headerMatch[1].length
      currentWords = 0
      currentBullets = []
    } else if (line.match(/^[-*]\s+/)) {
      const bullet = line.replace(/^[-*]\s+/, '').trim()
      if (bullet.length > 0 && bullet.length < 200) {
        currentBullets.push(bullet)
      }
      currentWords += bullet.split(/\s+/).filter(Boolean).length
      totalWords += bullet.split(/\s+/).filter(Boolean).length
    } else {
      const words = line.trim().split(/\s+/).filter(Boolean).length
      currentWords += words
      totalWords += words
    }
  }
  if (currentHeader && (currentWords > 10 || currentBullets.length > 0)) {
    sections.push({ header: currentHeader, level: currentLevel, wordCount: currentWords, bullets: currentBullets })
  }

  const readTime = Math.ceil(totalWords / 200)

  let summary = `# 📋 ${title}\n\n`
  summary += `**${totalWords.toLocaleString()} words** · **~${readTime} min read** · **${sections.length} sections**\n\n`
  summary += `---\n\n`

  // Show top-level sections as table of contents with key bullets
  for (const section of sections) {
    if (section.level <= 2) {
      const prefix = section.level === 1 ? '##' : '###'
      summary += `${prefix} ${section.header}\n`
      // Show top 3 bullets per section
      const topBullets = section.bullets.slice(0, 3)
      for (const bullet of topBullets) {
        summary += `- ${bullet}\n`
      }
      if (section.bullets.length > 3) {
        summary += `- *...and ${section.bullets.length - 3} more points*\n`
      }
      summary += '\n'
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
  const fileName = ARTIFACT_FILES[slug]

  if (!fileName) {
    return NextResponse.json({ error: 'Artifact not found' }, { status: 404 })
  }

  try {
    const filePath = join(process.cwd(), 'public', 'artifacts', fileName)
    const content = readFileSync(filePath, 'utf-8')
    const titleMatch = content.match(/^#\s+(.+)/m)
    const title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ')
    const summary = generateLocalSummary(content, title)
    return NextResponse.json({ slug, summary })
  } catch (error) {
    console.error(`Error generating summary for ${slug}:`, error)
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}
