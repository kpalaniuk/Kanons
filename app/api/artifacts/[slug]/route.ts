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

// Map slugs to files in public/artifacts/ (deployed with the app)
const ARTIFACT_FILES: Record<string, string> = {
  'lo-buddy-meeting-prep': 'lo-buddy-meeting-prep.md',
  'lo-buddy-briefing': 'lo-buddy-briefing.md',
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
    // Read from public/artifacts/ which is bundled with the deployment
    const filePath = join(process.cwd(), 'public', 'artifacts', fileName)
    const content = readFileSync(filePath, 'utf-8')
    return NextResponse.json({ slug, content })
  } catch (error) {
    console.error(`Error reading artifact ${slug}:`, error)
    return NextResponse.json({ error: 'Failed to read artifact' }, { status: 500 })
  }
}
