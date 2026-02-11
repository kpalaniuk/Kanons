import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

const NOTION_API_KEY = process.env.NOTION_API_KEY
const PIPELINE_DB = 'bbd9b5301c0c42269f2bc3c0c925e43a'

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

interface NotionSelectProperty {
  select: { name: string } | null
}

interface NotionTitleProperty {
  title: Array<{ plain_text: string }>
}

interface NotionRichTextProperty {
  rich_text: Array<{ plain_text: string }>
}

interface NotionDateProperty {
  date: { start: string } | null
}

interface NotionNumberProperty {
  number: number | null
}

interface NotionPage {
  id: string
  properties: {
    'Client Name': NotionTitleProperty
    'Stage': NotionSelectProperty
    'Priority': NotionSelectProperty
    'Loan Type': NotionSelectProperty
    'Loan Amount': NotionNumberProperty
    'Next Action': NotionRichTextProperty
    'Follow Up Date': NotionDateProperty
    'Last Touched': NotionDateProperty
    'Notes': NotionRichTextProperty
    'Referral Source': NotionRichTextProperty
  }
  created_time: string
  last_edited_time: string
}

export interface PipelineClient {
  id: string
  name: string
  stage: string
  priority: string
  loanType: string | null
  loanAmount: number | null
  nextAction: string
  followUpDate: string | null
  lastTouched: string | null
  notes: string
  referralSource: string
}

function extractClient(page: NotionPage): PipelineClient {
  const p = page.properties
  return {
    id: page.id,
    name: p['Client Name']?.title?.[0]?.plain_text || 'Untitled',
    stage: p['Stage']?.select?.name || 'New Lead',
    priority: p['Priority']?.select?.name || 'Active',
    loanType: p['Loan Type']?.select?.name || null,
    loanAmount: p['Loan Amount']?.number || null,
    nextAction: p['Next Action']?.rich_text?.[0]?.plain_text || '',
    followUpDate: p['Follow Up Date']?.date?.start || null,
    lastTouched: p['Last Touched']?.date?.start || null,
    notes: p['Notes']?.rich_text?.[0]?.plain_text || '',
    referralSource: p['Referral Source']?.rich_text?.[0]?.plain_text || '',
  }
}

// GET /api/pipeline — fetch all clients from Notion
export async function GET(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!(await verifyAllowedUser(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!NOTION_API_KEY) {
    return NextResponse.json({ error: 'Notion API key not configured' }, { status: 500 })
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${PIPELINE_DB}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sorts: [
          { property: 'Priority', direction: 'ascending' },
          { property: 'Follow Up Date', direction: 'ascending' },
        ],
        page_size: 100,
      }),
      // No caching for real-time updates
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Notion API error:', err)
      return NextResponse.json({ error: 'Failed to fetch pipeline' }, { status: 500 })
    }

    const data = await response.json()
    const clients = data.results.map((page: NotionPage) => extractClient(page))

    return NextResponse.json({ clients, hasMore: data.has_more })
  } catch (error) {
    console.error('Pipeline GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/pipeline — update a client in Notion
export async function PATCH(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!(await verifyAllowedUser(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!NOTION_API_KEY) {
    return NextResponse.json({ error: 'Notion API key not configured' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { id, stage, priority, nextAction, notes, followUpDate, lastTouched } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const properties: Record<string, unknown> = {}

    if (stage !== undefined) {
      properties['Stage'] = {
        select: { name: stage },
      }
    }

    if (priority !== undefined) {
      properties['Priority'] = {
        select: { name: priority },
      }
    }

    if (nextAction !== undefined) {
      properties['Next Action'] = {
        rich_text: [{ text: { content: nextAction } }],
      }
    }

    if (notes !== undefined) {
      properties['Notes'] = {
        rich_text: [{ text: { content: notes } }],
      }
    }

    if (followUpDate !== undefined) {
      if (followUpDate === null) {
        properties['Follow Up Date'] = { date: null }
      } else {
        properties['Follow Up Date'] = {
          date: { start: followUpDate },
        }
      }
    }

    if (lastTouched !== undefined) {
      if (lastTouched === null) {
        properties['Last Touched'] = { date: null }
      } else {
        properties['Last Touched'] = {
          date: { start: lastTouched },
        }
      }
    }

    const response = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties }),
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Notion update error:', err)
      return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Pipeline PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/pipeline — create a new client in Notion
export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!(await verifyAllowedUser(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!NOTION_API_KEY) {
    return NextResponse.json({ error: 'Notion API key not configured' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const {
      name,
      stage = 'New Lead',
      priority = 'Active',
      loanType,
      loanAmount,
      nextAction = '',
      followUpDate,
      lastTouched,
      notes = '',
      referralSource = '',
    } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const properties: Record<string, unknown> = {
      'Client Name': {
        title: [{ text: { content: name.trim() } }],
      },
      'Stage': {
        select: { name: stage },
      },
      'Priority': {
        select: { name: priority },
      },
      'Next Action': {
        rich_text: [{ text: { content: nextAction } }],
      },
      'Notes': {
        rich_text: [{ text: { content: notes } }],
      },
    }

    if (loanType) {
      properties['Loan Type'] = {
        select: { name: loanType },
      }
    }

    if (loanAmount !== undefined && loanAmount !== null) {
      properties['Loan Amount'] = {
        number: loanAmount,
      }
    }

    if (followUpDate) {
      properties['Follow Up Date'] = {
        date: { start: followUpDate },
      }
    }

    if (lastTouched) {
      properties['Last Touched'] = {
        date: { start: lastTouched },
      }
    }

    if (referralSource.trim()) {
      properties['Referral Source'] = {
        rich_text: [{ text: { content: referralSource.trim() } }],
      }
    }

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: PIPELINE_DB },
        properties,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Notion create error:', err)
      return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ success: true, clientId: data.id })
  } catch (error) {
    console.error('Pipeline POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
