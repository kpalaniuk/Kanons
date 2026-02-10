import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

const NOTION_API_KEY = process.env.NOTION_API_KEY
const TASK_QUEUE_DB = '579dc054ab6247bba8d64771b13a190b'

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

interface NotionPage {
  id: string
  properties: {
    Task: NotionTitleProperty
    Status: NotionSelectProperty
    Priority: NotionSelectProperty
    Category: NotionSelectProperty
    'Due Date': NotionDateProperty
    'Assigned By': NotionSelectProperty
    Notes: NotionRichTextProperty
  }
  created_time: string
  last_edited_time: string
}

function extractTask(page: NotionPage) {
  const p = page.properties
  return {
    id: page.id,
    title: p.Task?.title?.[0]?.plain_text || 'Untitled',
    status: p.Status?.select?.name || 'Not Started',
    priority: p.Priority?.select?.name || 'Medium',
    category: p.Category?.select?.name || 'Other',
    dueDate: p['Due Date']?.date?.start || null,
    assignedBy: p['Assigned By']?.select?.name || 'Kyle',
    notes: p.Notes?.rich_text?.[0]?.plain_text || '',
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
  }
}

// GET /api/tasks — fetch tasks from Notion
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

  const { searchParams } = new URL(request.url)
  const showDone = searchParams.get('showDone') === 'true'
  const category = searchParams.get('category')
  const priority = searchParams.get('priority')

  // Build filter
  const filters: Array<Record<string, unknown>> = []

  if (!showDone) {
    filters.push({
      property: 'Status',
      select: { does_not_equal: 'Done' },
    })
    filters.push({
      property: 'Status',
      select: { does_not_equal: 'Cancelled' },
    })
  }

  if (category && category !== 'all') {
    filters.push({
      property: 'Category',
      select: { equals: category },
    })
  }

  if (priority && priority !== 'all') {
    filters.push({
      property: 'Priority',
      select: { equals: priority },
    })
  }

  const filter = filters.length > 1
    ? { and: filters }
    : filters.length === 1
      ? filters[0]
      : undefined

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${TASK_QUEUE_DB}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter,
        sorts: [
          { property: 'Priority', direction: 'ascending' },
          { property: 'Due Date', direction: 'ascending' },
        ],
        page_size: 100,
      }),
      // Revalidate every 30 seconds
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Notion API error:', err)
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
    }

    const data = await response.json()
    const tasks = data.results.map((page: NotionPage) => extractTask(page))

    return NextResponse.json({ tasks, hasMore: data.has_more })
  } catch (error) {
    console.error('Tasks API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/tasks — create a new task in Notion
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
    const { title, priority = 'Medium', category = 'Other', dueDate, notes = '' } = body

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const properties: Record<string, unknown> = {
      Task: {
        title: [{ text: { content: title.trim() } }],
      },
      Status: {
        select: { name: 'Not Started' },
      },
      Priority: {
        select: { name: priority },
      },
      Category: {
        select: { name: category },
      },
      'Assigned By': {
        select: { name: 'Kyle' },
      },
    }

    if (dueDate) {
      properties['Due Date'] = {
        date: { start: dueDate },
      }
    }

    if (notes.trim()) {
      properties.Notes = {
        rich_text: [{ text: { content: notes.trim() } }],
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
        parent: { database_id: TASK_QUEUE_DB },
        properties,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Notion create error:', err)
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ success: true, taskId: data.id })
  } catch (error) {
    console.error('Tasks POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/tasks — update a task's status in Notion
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
    const { taskId, status } = body

    if (!taskId || !status) {
      return NextResponse.json({ error: 'taskId and status are required' }, { status: 400 })
    }

    const validStatuses = ['Not Started', 'In Progress', 'Waiting on Kyle', 'Done', 'Cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const response = await fetch(`https://api.notion.com/v1/pages/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          Status: {
            select: { name: status },
          },
        },
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Notion update error:', err)
      return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Tasks PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
