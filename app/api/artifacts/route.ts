import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { readFileSync } from 'fs'
import { join } from 'path'

// Allowed email addresses
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

export interface Artifact {
  slug: string
  title: string
  type: 'Briefings' | 'Calculators' | 'Research' | 'Prototypes' | 'Other'
  context: string
  description: string
  createdAt: string
  size: string
  tags: string[]
}

// Hardcoded artifact list
const ARTIFACTS: Artifact[] = [
  {
    slug: 'lo-buddy-briefing',
    title: 'LO Buddy — Architecture & Meeting Briefing',
    type: 'Briefings',
    context: 'LO Buddy',
    description: 'Comprehensive analysis of LO Buddy codebase, OpenClaw architecture patterns, integration strategy, and talking points for Brad/Chad meeting.',
    createdAt: '2026-02-10',
    size: '39KB',
    tags: ['LO Buddy', 'OpenClaw', 'Architecture', 'AI Agents'],
  },
]

// GET /api/artifacts — returns list of available artifacts with metadata
export async function GET(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!(await verifyAllowedUser(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const context = searchParams.get('context')
  const search = searchParams.get('search')?.toLowerCase()

  let filtered = [...ARTIFACTS]

  // Filter by type
  if (type && type !== 'All') {
    filtered = filtered.filter((a) => a.type === type)
  }

  // Filter by context
  if (context && context !== 'All') {
    filtered = filtered.filter((a) => a.context === context)
  }

  // Filter by search
  if (search) {
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search) ||
        a.tags.some((t) => t.toLowerCase().includes(search))
    )
  }

  return NextResponse.json({ artifacts: filtered })
}
