'use client'

import { useState, useEffect } from 'react'
import { Music, Search, ChevronDown, ChevronRight, Loader2, Tag } from 'lucide-react'

interface Song {
  id: string
  title: string
  source: string
  sourceId: string
}

export default function LyricsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSong, setExpandedSong] = useState<string | null>(null)
  const [songContent, setSongContent] = useState<Record<string, string>>({})
  const [loadingContent, setLoadingContent] = useState<string | null>(null)
  const [sourceFilter, setSourceFilter] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/lyrics')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch lyrics')
        return res.json()
      })
      .then(data => setSongs(data.results || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const toggleSong = async (songId: string) => {
    if (expandedSong === songId) {
      setExpandedSong(null)
      return
    }
    setExpandedSong(songId)

    if (!songContent[songId]) {
      setLoadingContent(songId)
      try {
        const res = await fetch(`/api/lyrics?id=${songId}`)
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        setSongContent(prev => ({ ...prev, [songId]: data.content || '(No content found)' }))
      } catch {
        setSongContent(prev => ({ ...prev, [songId]: '(Error loading lyrics)' }))
      } finally {
        setLoadingContent(null)
      }
    }
  }

  const sources = Array.from(new Set(songs.map(s => s.source)))

  const filtered = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSource = !sourceFilter || song.source === sourceFilter
    return matchesSearch && matchesSource
  })

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Music className="w-8 h-8 text-terracotta" />
          <h1 className="font-display text-4xl text-midnight">Lyrics</h1>
        </div>
        <p className="text-midnight/60">{songs.length} songs across {sources.length} collections</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight/40" />
        <input
          type="text"
          placeholder="Search songs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-cream border border-midnight/10 rounded-lg focus:outline-none focus:border-terracotta text-midnight"
        />
      </div>

      {/* Source Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSourceFilter(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !sourceFilter ? 'bg-midnight text-cream' : 'bg-sand text-midnight/60 hover:bg-midnight/10'
          }`}
        >
          All
        </button>
        {sources.map(source => (
          <button
            key={source}
            onClick={() => setSourceFilter(sourceFilter === source ? null : source)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              sourceFilter === source ? 'bg-midnight text-cream' : 'bg-sand text-midnight/60 hover:bg-midnight/10'
            }`}
          >
            <Tag className="w-3 h-3" />
            {source}
          </button>
        ))}
      </div>

      {/* Song List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-terracotta/10 border border-terracotta/30 rounded-lg p-6 text-center">
          <p className="text-midnight/70">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-sand rounded-lg p-8 text-center">
          <Music className="w-12 h-12 text-midnight/20 mx-auto mb-3" />
          <p className="text-midnight/60">
            {searchQuery ? 'No songs match your search' : 'No lyrics found'}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map(song => {
            const isExpanded = expandedSong === song.id
            const isLoading = loadingContent === song.id
            const content = songContent[song.id]

            return (
              <div key={song.id} className="bg-cream border border-midnight/5 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSong(song.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-sand transition-colors"
                >
                  {isExpanded
                    ? <ChevronDown className="w-4 h-4 text-terracotta flex-shrink-0" />
                    : <ChevronRight className="w-4 h-4 text-midnight/40 flex-shrink-0" />
                  }
                  <span className="font-medium text-midnight flex-1">{song.title}</span>
                  <span className="text-xs text-midnight/40 bg-sand px-2 py-0.5 rounded-full">{song.source}</span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-midnight/5">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 text-terracotta animate-spin" />
                      </div>
                    ) : (
                      <pre className="mt-4 p-4 bg-sand rounded-lg text-sm text-midnight/80 whitespace-pre-wrap font-sans leading-relaxed overflow-x-auto">
                        {content}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
