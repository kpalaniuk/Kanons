import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

const NOTION_API_KEY = process.env.NOTION_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

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

// POST /api/tasks/update — Kyle provides context, AI suggests next steps + follow-up date
export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!(await verifyAllowedUser(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { taskId, taskTitle, taskNotes, taskCategory, taskPriority, taskDueDate, context } = await request.json()

    if (!taskId || !context) {
      return NextResponse.json({ error: 'taskId and context are required' }, { status: 400 })
    }

    // Get AI suggestion for next steps and follow-up date
    const today = new Date()
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })
    
    const aiPrompt = `You are a smart personal assistant helping Kyle manage his tasks. He just provided an update on a task.

Task: ${taskTitle}
Category: ${taskCategory || 'Unknown'}
Priority: ${taskPriority || 'Medium'}
Current due date: ${taskDueDate || 'None set'}
Previous notes: ${taskNotes || 'None'}

Kyle's update: "${context}"

Today is ${dayName}, ${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.

Kyle's weekly constraints:
- Monday: Pickleball, only 9am-2pm for work
- Tuesday: Date night with Paige (evening)
- Wednesday: Pick up Bodhi at 3:30pm for soccer
- Thursday: Coach FC Balboa soccer, home by 3:30pm
- Friday-Sunday: More flexible

Based on his update, suggest:
1. A brief next action step (1 sentence, actionable)
2. Any sub-tasks if the update implies them (max 2, each 1 sentence)
3. A suggested follow-up date (YYYY-MM-DD format) considering his schedule and task urgency
4. Brief reasoning for the date (1 sentence)

Respond in JSON format only:
{
  "nextAction": "string",
  "subTasks": ["string"] or [],
  "followUpDate": "YYYY-MM-DD",
  "dateReason": "string"
}`

    let suggestion = null

    if (OPENAI_API_KEY) {
      const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: aiPrompt }],
          temperature: 0.7,
          max_tokens: 500,
          response_format: { type: 'json_object' },
        }),
      })

      if (aiRes.ok) {
        const aiData = await aiRes.json()
        const content = aiData.choices?.[0]?.message?.content
        if (content) {
          try {
            suggestion = JSON.parse(content)
          } catch {
            // If JSON parse fails, use raw content
            suggestion = { nextAction: content, subTasks: [], followUpDate: null, dateReason: '' }
          }
        }
      }
    }

    // If no AI available, generate a simple suggestion
    if (!suggestion) {
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 3)
      suggestion = {
        nextAction: 'Follow up on this task based on your update.',
        subTasks: [],
        followUpDate: nextWeek.toISOString().split('T')[0],
        dateReason: 'Default 3-day follow-up.',
      }
    }

    // Update the task in Notion with the new context appended to notes
    const timestamp = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const updatedNotes = [
      taskNotes || '',
      `\n--- Update ${timestamp} ---`,
      context,
      suggestion.nextAction ? `→ Next: ${suggestion.nextAction}` : '',
      ...(suggestion.subTasks || []).map((st: string) => `  • ${st}`),
    ].filter(Boolean).join('\n').trim()

    // Build Notion update payload
    const notionUpdate: Record<string, unknown> = {
      properties: {
        Notes: {
          rich_text: [{ text: { content: updatedNotes.slice(0, 2000) } }],
        },
      },
    }

    // Update due date if suggestion has one and user accepts
    if (suggestion.followUpDate) {
      notionUpdate.properties = {
        ...(notionUpdate.properties as Record<string, unknown>),
        'Due Date': {
          date: { start: suggestion.followUpDate },
        },
      }
    }

    // Set status to In Progress if it was Not Started
    // (Kyle is actively working on it now)

    const notionRes = await fetch(`https://api.notion.com/v1/pages/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notionUpdate),
    })

    if (!notionRes.ok) {
      const err = await notionRes.json()
      console.error('Notion update error:', err)
      return NextResponse.json({ error: 'Failed to update task in Notion' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      suggestion,
      updatedNotes: updatedNotes.slice(0, 500),
    })
  } catch (error) {
    console.error('Task update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
