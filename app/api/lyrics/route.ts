import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const LYRICS_DATABASE_ID = '925f7b39e66042c7ac8e5a5a37716778'

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

    // Otherwise, list all pages in the lyrics database
    const response = await notion.databases.query({
      database_id: LYRICS_DATABASE_ID,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending',
        },
      ],
    })

    return NextResponse.json({
      results: response.results,
    })
  } catch (error: any) {
    console.error('Notion API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch lyrics' },
      { status: 500 }
    )
  }
}
