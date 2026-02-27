'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Music, Search, ChevronDown, ChevronRight, Loader2,
  FileText, Edit3, Check, X
} from 'lucide-react'
import { BANDS, type Band } from '@/app/lib/lyrics-config'

interface Song {
  id: string
  title: string
  band: string
}

interface SongMeta {
  band?: string
  key?: string
  feel?: string
  type?: string
  status?: string
  bpm?: string
  timeSig?: string
}

const BAND_COLORS: Record<Band, string> = {
  'Neo-Somatic':   'bg-cyan/10 text-cyan border-cyan/30',
  'StronGnome':    'bg-amber-100 text-amber-700 border-amber-200',
  'Personal':      'bg-terracotta/10 text-terracotta border-terracotta/30',
  'Well Well Well':'bg-purple-100 text-purple-600 border-purple-200',
  'Tu Lengua':     'bg-green-100 text-green-700 border-green-200',
  'Covers':        'bg-midnight/5 text-midnight/50 border-midnight/10',
}

// ── Chord line detection ──────────────────────────────────────────────────────
const CHORD_RE = /^[A-G][#b]?(maj|min|m|M|dim|aug|sus|add|dom)?[0-9]*(\/[A-G][#b]?)?$/
function isChordToken(t: string) { return CHORD_RE.test(t.trim()) }
function isChordLine(line: string) {
  const tokens = line.trim().split(/\s+/)
  return tokens.length >= 1 && tokens.length <= 8 && tokens.every(isChordToken)
}

// Section header detection — only lines starting with # OR lines like "CHORUS", "VERSE 1", "BRIDGE"
// NOT every all-caps line (lyric lines in all-caps should NOT be treated as headers)
const SECTION_LABELS = /^(verse|chorus|bridge|pre-chorus|hook|intro|outro|interlude|breakdown|solo|refrain|tag|coda|turn|vamp|groove|feel|section)\b/i
function isSectionHeader(line: string): boolean {
  const t = line.trim()
  if (t.startsWith('#')) return true
  // Explicit section label patterns only — must be short and match known section words
  if (t.length < 40 && SECTION_LABELS.test(t)) return true
  // Bracketed labels [VERSE], [CHORUS] etc.
  if (/^\[.{1,30}\]$/.test(t)) return true
  return false
}

// ── Inline [Chord]word parser ─────────────────────────────────────────────────
type Segment = { chord: string | null; lyric: string }
function parseInlineChords(line: string): Segment[] {
  const segs: Segment[] = []
  const re = /\[([A-G][#b]?(?:maj|min|m|M|dim|aug|sus|add|dom)?[0-9]*(?:\/[A-G][#b]?)?)\]([^\[]*)/g
  let last = 0; let m: RegExpExecArray | null
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) segs.push({ chord: null, lyric: line.slice(last, m.index) })
    segs.push({ chord: m[1], lyric: m[2] })
    last = m.index + m[0].length
  }
  if (last < line.length) segs.push({ chord: null, lyric: line.slice(last) })
  return segs
}
function hasInlineChords(line: string) { return /\[[A-G]/.test(line) }

// ── Render a single lyrics block ──────────────────────────────────────────────
function LyricsBlock({ text }: { text: string }) {
  const lines = text.split('\n')
  let i = 0
  const rendered: React.ReactNode[] = []

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Inline chord format [G]word [Em]here
    if (hasInlineChords(trimmed)) {
      const segs = parseInlineChords(trimmed)
      rendered.push(
        <div key={i} className="flex flex-wrap leading-none mb-4">
          {segs.map((seg, j) => (
            <span key={j} className="inline-flex flex-col mr-0.5">
              {seg.chord && (
                <span className="text-ocean font-bold text-xs font-mono leading-tight">{seg.chord}</span>
              )}
              <span className="text-sm text-midnight/80 whitespace-pre">{seg.lyric || (seg.chord ? '\u00a0\u00a0' : '')}</span>
            </span>
          ))}
        </div>
      )
      i++
      continue
    }

    // Chord-only line followed by lyric line
    if (isChordLine(trimmed) && i + 1 < lines.length && !isChordLine(lines[i + 1].trim()) && lines[i + 1].trim() && !isSectionHeader(lines[i + 1])) {
      const lyricLine = lines[i + 1]
      rendered.push(
        <div key={i} className="mb-4">
          <div className="font-mono text-xs text-ocean font-bold tracking-wider whitespace-pre">{trimmed}</div>
          <div className="text-sm text-midnight/80 whitespace-pre-wrap">{lyricLine}</div>
        </div>
      )
      i += 2
      continue
    }

    // Chord-only line (no lyric pair)
    if (isChordLine(trimmed) && trimmed) {
      rendered.push(
        <div key={i} className="font-mono text-xs text-ocean font-bold tracking-wider whitespace-pre mb-1">{trimmed}</div>
      )
      i++
      continue
    }

    // Section header (explicit only — not every all-caps line)
    if (isSectionHeader(trimmed)) {
      const label = trimmed.replace(/^#+\s*/, '').replace(/^\[|\]$/g, '')
      rendered.push(
        <div key={i} className="mt-6 mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta border-b border-terracotta/30 pb-0.5">{label}</span>
        </div>
      )
      i++
      continue
    }

    // Empty line → stanza break
    if (!trimmed) {
      rendered.push(<div key={i} className="mb-3" />)
      i++
      continue
    }

    // Normal lyric line (including all-caps lines — they're just lyrics)
    rendered.push(
      <div key={i} className="text-sm text-midnight/80 whitespace-pre-wrap leading-relaxed mb-1">{trimmed}</div>
    )
    i++
  }

  return <div className="font-sans">{rendered}</div>
}

// ── Extract metadata from content ─────────────────────────────────────────────
function extractMeta(content: string): { meta: SongMeta; body: string } {
  const meta: SongMeta = {}
  const lines = content.split('\n')
  const bodyLines: string[] = []

  for (const line of lines) {
    const m = line.match(/^(band|key|feel|type|status|bpm|time|timesig)\s*:\s*(.+)$/i)
    if (m) {
      const k = m[1].toLowerCase()
      const v = m[2].trim()
      if (k === 'time' || k === 'timesig') meta.timeSig = v
      else if (k === 'band')   meta.band   = v
      else if (k === 'key')    meta.key    = v
      else if (k === 'feel')   meta.feel   = v
      else if (k === 'type')   meta.type   = v
      else if (k === 'status') meta.status = v
      else if (k === 'bpm')    meta.bpm    = v
    } else {
      bodyLines.push(line)
    }
  }
  return { meta, body: bodyLines.join('\n').trim() }
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status?: string }) {
  if (!status) return null
  const styles: Record<string, string> = {
    'Active Setlist': 'bg-cyan/10 text-cyan border-cyan/30',
    'Know It':        'bg-green-100 text-green-700 border-green-200',
    'Learning':       'bg-amber-100 text-amber-700 border-amber-200',
    'Shelved':        'bg-midnight/5 text-midnight/40 border-midnight/10',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${styles[status] ?? 'bg-sand text-midnight/50 border-midnight/10'}`}>
      {status}
    </span>
  )
}

// ── Editable notes ────────────────────────────────────────────────────────────
function EditableNotes({ label, songId, field }: { label: string; songId: string; field: string }) {
  const key = `song-notes-${songId}-${field}`
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { setValue(localStorage.getItem(key) ?? '') }, [key])
  useEffect(() => { if (editing) ref.current?.focus() }, [editing])

  const save = () => { localStorage.setItem(key, value); setEditing(false) }
  const cancel = () => { setValue(localStorage.getItem(key) ?? ''); setEditing(false) }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-midnight/40">{label}</span>
        {!editing
          ? <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs text-midnight/40 hover:text-ocean transition-colors">
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          : <div className="flex items-center gap-2">
              <button onClick={save} className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700"><Check className="w-3 h-3" /> Save</button>
              <button onClick={cancel} className="flex items-center gap-1 text-xs text-midnight/40 hover:text-red-500"><X className="w-3 h-3" /> Cancel</button>
            </div>
        }
      </div>
      {editing
        ? <textarea
            ref={ref}
            value={value}
            onChange={e => setValue(e.target.value)}
            rows={4}
            className="w-full text-sm p-3 bg-sand border border-midnight/10 rounded-lg resize-y focus:outline-none focus:border-ocean text-midnight/80"
            placeholder={`Add ${label.toLowerCase()}...`}
          />
        : <div
            onClick={() => setEditing(true)}
            className="text-sm text-midnight/60 p-3 bg-sand/50 rounded-lg min-h-[3rem] whitespace-pre-wrap cursor-text hover:bg-sand transition-colors"
          >
            {value || <span className="text-midnight/30 italic">Click to add {label.toLowerCase()}…</span>}
          </div>
      }
    </div>
  )
}

// ── Tu Lengua inline notice ───────────────────────────────────────────────────
function TuLenguaNotice({ title }: { title: string }) {
  return (
    <div className="border-t border-midnight/6 px-5 py-6">
      <p className="text-sm text-midnight/50 italic">
        "{title}" is tracked in the Tu Lengua set list. Lyrics not yet in Notion — add them to the page to see them here.
      </p>
      <div className="mt-4 grid sm:grid-cols-2 gap-6">
        <EditableNotes label="Performance Notes" songId={title} field="performance" />
        <EditableNotes label="Arrangement Notes" songId={title} field="arrangement" />
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LyricsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSong, setExpandedSong] = useState<string | null>(null)
  const [songContent, setSongContent] = useState<Record<string, string>>({})
  const [loadingContent, setLoadingContent] = useState<string | null>(null)
  const [bandFilter, setBandFilter] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/lyrics')
      .then(res => { if (!res.ok) throw new Error('Failed to fetch'); return res.json() })
      .then(data => setSongs(data.results || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const toggleSong = async (songId: string) => {
    if (expandedSong === songId) { setExpandedSong(null); return }
    setExpandedSong(songId)
    // Tu Lengua songs have synthetic IDs — no Notion page to fetch
    if (songId.startsWith('tu-lengua-')) return
    if (!songContent[songId]) {
      setLoadingContent(songId)
      try {
        const res = await fetch(`/api/lyrics?id=${songId}`)
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        setSongContent(prev => ({ ...prev, [songId]: data.content || '(No content found)' }))
      } catch {
        setSongContent(prev => ({ ...prev, [songId]: '(Error loading lyrics)' }))
      } finally { setLoadingContent(null) }
    }
  }

  // Band counts
  const bandCounts = BANDS.reduce((acc, b) => {
    acc[b] = songs.filter(s => s.band === b).length
    return acc
  }, {} as Record<Band, number>)

  const filtered = songs.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!bandFilter || s.band === bandFilter)
  )

  // Group by band for display when no filter
  const grouped = bandFilter
    ? { [bandFilter]: filtered }
    : BANDS.reduce((acc, b) => {
        const inBand = filtered.filter(s => s.band === b)
        if (inBand.length > 0) acc[b] = inBand
        return acc
      }, {} as Record<string, Song[]>)

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Music className="w-7 h-7 text-terracotta" />
          <h1 className="font-display text-3xl text-midnight">Song Library</h1>
        </div>
        <p className="text-midnight/50 text-sm">{songs.length} songs · chords, lyrics, arrangements</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight/30" />
        <input
          type="text"
          placeholder="Search by title…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-cream border border-midnight/10 rounded-xl focus:outline-none focus:border-ocean text-midnight text-sm"
        />
      </div>

      {/* Band filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setBandFilter(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${!bandFilter ? 'bg-midnight text-cream' : 'bg-sand text-midnight/50 hover:bg-midnight/10'}`}
        >
          All Bands
        </button>
        {BANDS.map(band => (
          <button
            key={band}
            onClick={() => setBandFilter(bandFilter === band ? null : band)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              bandFilter === band
                ? BAND_COLORS[band as Band] + ' ring-2 ring-offset-1 ring-ocean/30'
                : BAND_COLORS[band as Band] + ' opacity-60 hover:opacity-100'
            }`}
          >
            {band}
            {bandCounts[band as Band] > 0 && (
              <span className="ml-1.5 opacity-60">({bandCounts[band as Band]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-terracotta animate-spin" /></div>
      ) : error ? (
        <div className="bg-terracotta/10 border border-terracotta/20 rounded-xl p-6 text-center">
          <p className="text-sm text-midnight/60">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-sand rounded-xl p-12 text-center">
          <Music className="w-10 h-10 text-midnight/20 mx-auto mb-3" />
          <p className="text-midnight/50 text-sm">{searchQuery ? 'No matches found' : 'No songs yet'}</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([band, bandSongs]) => (
            <div key={band}>
              {/* Band section header */}
              {!bandFilter && (
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${BAND_COLORS[band as Band] ?? ''}`}>{band}</span>
                  <span className="text-xs text-midnight/30">{bandSongs.length} songs</span>
                </div>
              )}

              <div className="space-y-2">
                {bandSongs.map(song => {
                  const isOpen = expandedSong === song.id
                  const isLoadingThis = loadingContent === song.id
                  const raw = songContent[song.id] ?? ''
                  const { meta, body } = isOpen && raw ? extractMeta(raw) : { meta: {}, body: raw }
                  const isTuLengua = song.id.startsWith('tu-lengua-')

                  return (
                    <div key={song.id} className="bg-cream border border-midnight/8 rounded-xl overflow-hidden">
                      {/* Song row */}
                      <button
                        onClick={() => toggleSong(song.id)}
                        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-sand/60 transition-colors"
                      >
                        {isOpen
                          ? <ChevronDown className="w-4 h-4 text-terracotta flex-shrink-0" />
                          : <ChevronRight className="w-4 h-4 text-midnight/30 flex-shrink-0" />
                        }
                        <span className="font-semibold text-midnight flex-1 text-sm">{song.title}</span>
                        {meta.key && (
                          <span className="text-xs font-mono bg-midnight/5 text-midnight/50 px-2 py-0.5 rounded font-bold">{meta.key}</span>
                        )}
                        {meta.feel && (
                          <span className="text-xs text-midnight/40 hidden sm:inline">{meta.feel}</span>
                        )}
                        <StatusBadge status={meta.status} />
                        {bandFilter && (
                          <span className={`text-xs px-2 py-0.5 rounded-full border ml-1 ${BAND_COLORS[band as Band] ?? ''}`}>{song.band}</span>
                        )}
                      </button>

                      {/* Expanded song detail */}
                      {isOpen && (
                        isTuLengua ? (
                          <TuLenguaNotice title={song.title} />
                        ) : (
                          <div className="border-t border-midnight/6 px-5 pb-6">
                            {isLoadingThis ? (
                              <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 text-terracotta animate-spin" /></div>
                            ) : (
                              <>
                                {/* Metadata strip */}
                                {(meta.band || meta.key || meta.feel || meta.type || meta.bpm || meta.timeSig) && (
                                  <div className="flex flex-wrap gap-3 pt-4 pb-4 border-b border-midnight/6 text-xs">
                                    {meta.band    && <span className="flex items-center gap-1 text-midnight/60"><Music className="w-3 h-3" />{meta.band}</span>}
                                    {meta.key     && <span className="flex items-center gap-1 text-ocean font-bold">Key of {meta.key}</span>}
                                    {meta.feel    && <span className="text-midnight/50">{meta.feel}</span>}
                                    {meta.type    && <span className="text-midnight/40">{meta.type}</span>}
                                    {meta.bpm     && <span className="text-midnight/40">{meta.bpm} BPM</span>}
                                    {meta.timeSig && <span className="font-mono text-midnight/40">{meta.timeSig}</span>}
                                  </div>
                                )}
                                {/* Lyrics/Chords body */}
                                <div className="mt-5">
                                  <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-3.5 h-3.5 text-midnight/30" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-midnight/30">Lyrics & Chords</span>
                                  </div>
                                  {body ? (
                                    <div className="bg-sand/60 rounded-lg p-4">
                                      <LyricsBlock text={body} />
                                    </div>
                                  ) : (
                                    <p className="text-sm text-midnight/30 italic">No lyrics content yet</p>
                                  )}
                                </div>
                                {/* Editable notes */}
                                <div className="mt-6 pt-5 border-t border-midnight/6 grid sm:grid-cols-2 gap-6">
                                  <EditableNotes label="Band Notes" songId={song.id} field="band" />
                                  <EditableNotes label="Arrangement Notes" songId={song.id} field="arrangement" />
                                </div>
                              </>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Empty bands notice */}
          {!bandFilter && (
            <div className="text-xs text-midnight/30 text-center py-2">
              Well Well Well · Neo-Somatic songs will appear here once added to Notion
            </div>
          )}
        </div>
      )}
    </div>
  )
}
