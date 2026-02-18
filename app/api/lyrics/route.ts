import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// These are pages (not databases) — use blocks.children.list
const LYRICS_PAGE_IDS = [
  '925f7b39e66042c7ac8e5a5a37716778', // Lyrics & Songs
  '7558f0d737694d20bf9a587cbe5bf23f', // Kyle's Lyrics
  'ce6c6396e72f4ec199df3ddbf76a3388', // Tu Lengua
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pageId = searchParams.get('id')

    // If pageId is provided, fetch specific page content
    if (pageId) {
      const blocks = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 100,
      })

      const page = await notion.pages.retrieve({ page_id: pageId })

      return NextResponse.json({
        page,
        blocks: blocks.results,
      })
    }

    // Otherwise, list child pages from all lyrics sources
    const allPages: any[] = []

    for (const parentId of LYRICS_PAGE_IDS) {
      try {
        const response = await notion.blocks.children.list({
          block_id: parentId,
          page_size: 100,
        })

        // Get the parent page title
        const parentPage = await notion.pages.retrieve({ page_id: parentId })
        const parentTitle = (parentPage as any).properties?.title?.title?.[0]?.plain_text
          || (parentPage as any).properties?.Name?.title?.[0]?.plain_text
          || 'Untitled'

        // Filter for child_page blocks
        const childPages = response.results
          .filter((block: any) => block.type === 'child_page')
          .map((block: any) => ({
            id: block.id,
            title: block.child_page?.title || 'Untitled',
            source: parentTitle,
            sourceId: parentId,
            createdTime: block.created_time,
          }))

        allPages.push(...childPages)
      } catch (err) {
        console.error(`Error fetching children for ${parentId}:`, err)
      }
    }

    // Sort alphabetically
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
