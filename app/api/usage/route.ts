import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { readFile } from 'fs/promises'
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

export async function GET(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!(await verifyAllowedUser(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const dataPath = join(process.cwd(), 'public', 'data', 'usage.json')
    const fileContent = await readFile(dataPath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Usage API error:', error)
    return NextResponse.json(
      { error: 'Failed to load usage data' },
      { status: 500 }
    )
  }
}
