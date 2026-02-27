import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
import { BANDS, BAND_ORDER, type Band } from '@/app/lib/lyrics-config'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

// ── Source config ─────────────────────────────────────────────────────────────
// Each source maps child pages of a Notion parent to a band
const CHILD_SOURCES: {
  parentId: string
  band: Band
  skipTitlePatterns: RegExp[]
}[] = [
  {
    // "Lyrics & Songs" parent — jazz standards / covers
    parentId: '925f7b39e66042c7ac8e5a5a37716778',
    band: 'Covers',
    skipTitlePatterns: [
      /^set list/i,
      /^master song list/i,
      /tidal wave/i,   // cover of Tom Misch song — could change to Covers later
    ],
  },
  {
    // "Kyle's Lyrics" parent — personal originals
    parentId: '7558f0d737694d20bf9a587cbe5bf23f',
    band: 'Personal',
    skipTitlePatterns: [],
  },
  {
    // StronGnome Songs/Notes — StronGnome originals
    parentId: '7d441e88bac44371aca9a5851b0bfbc3',
    band: 'StronGnome',
    skipTitlePatterns: [
      /^song template$/i,
      /^chords$/i,
      /^$/, // empty title
    ],
  },
]

// Individual songs that don't live under a standard parent
const INDIVIDUAL_SONGS: { id: string; title: string; band: Band }[] = [
  { id: '90456ab2-5509-4a06-89f0-087c92160389', title: 'The Christmas Song', band: 'Covers' },
  // "There Will Never Be Another You" already exists in Lyrics & Songs child pages — skip the individual entry
]

// Tu Lengua is a text-list format — songs parsed directly from page content
const TU_LENGUA_PAGE_ID = 'ce6c6396e72f4ec199df3ddbf76a3388'

// ── Helpers ───────────────────────────────────────────────────────────────────
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
    if (type === 'numbered_list_item') return `${text}`
    if (type === 'quote') return `> ${text}`
    return text
  }
  if (type === 'divider') return '---'
  return ''
}

// Normalize title for dedup: lowercase, trim, collapse spaces
function normalizeTitle(t: string) {
  return t.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[^a-z0-9 ]/g, '')
}

// Title-case a song name (ALL CAPS → Title Case)
function normalizeDisplay(title: string): string {
  // If already mixed case, leave it
  if (title !== title.toUpperCase()) return title.trim()
  // ALL CAPS → Title Case
  const minorWords = new Set(['a','an','the','and','but','or','for','nor','on','at','to','by','of','in','is'])
  return title
    .toLowerCase()
    .trim()
    .split(' ')
    .map((w, i) => (i === 0 || !minorWords.has(w)) ? w.charAt(0).toUpperCase() + w.slice(1) : w)
    .join(' ')
}

// ── GET /api/lyrics ───────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pageId = searchParams.get('id')

    // ── Fetch content for a specific song page ────────────────────────────────
    if (pageId) {
      const blocks = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 100,
      })
      const lines = blocks.results.map(blockToText).filter(Boolean)
      return NextResponse.json({ content: lines.join('\n') })
    }

    // ── List all songs ────────────────────────────────────────────────────────
    const seen = new Set<string>()  // dedup by normalized title
    const allSongs: { id: string; title: string; band: Band }[] = []

    const addSong = (id: string, rawTitle: string, band: Band) => {
      const title = normalizeDisplay(rawTitle)
      const key = normalizeTitle(title)
      if (!key || seen.has(key)) return
      seen.add(key)
      allSongs.push({ id, title, band })
    }

    // 1. Child-page sources
    for (const source of CHILD_SOURCES) {
      try {
        const resp = await notion.blocks.children.list({
          block_id: source.parentId,
          page_size: 100,
        })

        for (const block of resp.results) {
          const b = block as any
          if (b.type !== 'child_page') continue
          const rawTitle = b.child_page?.title || ''
          if (!rawTitle.trim()) continue
          if (source.skipTitlePatterns.some(p => p.test(rawTitle))) continue
          addSong(b.id.replace(/-/g, ''), rawTitle, source.band)
        }
      } catch (err) {
        console.error(`Failed to fetch children for ${source.parentId}:`, err)
      }
    }

    // 2. Individual songs
    for (const song of INDIVIDUAL_SONGS) {
      addSong(song.id.replace(/-/g, ''), song.title, song.band)
    }

    // 3. Tu Lengua — parse the set list text from the page content
    try {
      const tuResp = await notion.blocks.children.list({
        block_id: TU_LENGUA_PAGE_ID,
        page_size: 100,
      })
      for (const block of tuResp.results) {
        const b = block as any
        const type = b.type
        if (!['paragraph', 'bulleted_list_item', 'numbered_list_item'].includes(type)) continue
        const rawText = (b[type]?.rich_text || []).map((t: any) => t.plain_text).join('').trim()
        if (!rawText) continue

        // Multi-song blocks (separated by newlines) — split them
        const lines = rawText.split('\n')
        for (const line of lines) {
          const cleaned = line
            .replace(/- Kyle.*$/i, '') // strip " - Kyle free jam" etc.
            .replace(/^SET LIST.*/i, '') // skip set list header
            .replace(/BLOODLUST/i, '')
            .trim()
          if (!cleaned || cleaned.length < 2) continue
          // Skip lines that are clearly headers
          if (/^set\s+list/i.test(cleaned)) continue
          addSong(`tu-lengua-${normalizeTitle(cleaned).replace(/ /g,'-')}`, cleaned, 'Tu Lengua')
        }
      }
    } catch (err) {
      console.error('Failed to fetch Tu Lengua:', err)
    }

    // Sort alphabetically within each band, then order by band
    allSongs.sort((a, b) => {
      const bo = BAND_ORDER[a.band] - BAND_ORDER[b.band]
      if (bo !== 0) return bo
      return a.title.localeCompare(b.title)
    })

    return NextResponse.json({ results: allSongs, bands: BANDS })
  } catch (error: any) {
    console.error('Notion API error:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch lyrics' }, { status: 500 })
  }
}
