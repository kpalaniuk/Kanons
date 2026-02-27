import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const LYRICS_PAGE_IDS = [
  '925f7b39e66042c7ac8e5a5a37716778', // Lyrics & Songs (setlist)
  '7558f0d737694d20bf9a587cbe5bf23f', // Kyle's Lyrics
  'ce6c6396e72f4ec199df3ddbf76a3388', // Tu Lengua
]

// Individual song pages (fetched as direct entries, not children)
const INDIVIDUAL_SONG_IDS = [
  { id: '234b8111-a67d-4d62-a8da-bf56fe26d495', title: 'There Will Never Be Another You', source: 'Jazz Standards' },
  { id: '90456ab2-5509-4a06-89f0-087c92160389', title: 'The Christmas Song',               source: 'Covers' },
]

function blockToText(block: any): string {
  const type = block.type
  const content = block[type]
  if (!content) return ''
  if (content.rich_text) {
    const text = content.rich_text.map((t: any) => t.plain_text).join('')
    if (type === 'heading_1') return `# ${text}`
    if (type === 'heading_2') return `## ${text}`
    if (type === 'heading_3') return `### ${text}`
    if (type === 'bulleted_list_item') return `• ${text}`
    if (type === 'numbered_list_item') return `1. ${text}`
    if (type === 'quote') return `> ${text}`
    return text
  }
  if (type === 'divider') return '---'
  return ''
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pageId = searchParams.get('id')

    // Fetch content for a specific song
    if (pageId) {
      const blocks = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 100,
      })
      const lines = blocks.results.map(blockToText).filter(Boolean)
      return NextResponse.json({ content: lines.join('\n') })
    }

    // List all songs from all lyrics sources
    const allPages: any[] = []

    for (const parentId of LYRICS_PAGE_IDS) {
      try {
        const response = await notion.blocks.children.list({
          block_id: parentId,
          page_size: 100,
        })

        const parentPage = await notion.pages.retrieve({ page_id: parentId })
        const parentTitle = (parentPage as any).properties?.title?.title?.[0]?.plain_text
          || (parentPage as any).properties?.Name?.title?.[0]?.plain_text
          || 'Untitled'

        const childPages = response.results
          .filter((block: any) => block.type === 'child_page')
          .map((block: any) => ({
            id: block.id,
            title: block.child_page?.title || 'Untitled',
            source: parentTitle,
            sourceId: parentId,
          }))

        allPages.push(...childPages)
      } catch (err) {
        console.error(`Error fetching children for ${parentId}:`, err)
      }
    }

    // Add individual song pages
    allPages.push(...INDIVIDUAL_SONG_IDS.map(s => ({
      id: s.id.replace(/-/g, ''),
      title: s.title,
      source: s.source,
      sourceId: s.id,
    })))

    allPages.sort((a, b) => a.title.localeCompare(b.title))
    return NextResponse.json({ results: allPages })
  } catch (error: any) {
    console.error('Notion API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch lyrics' },
      { status: 500 }
    )
  }
}
