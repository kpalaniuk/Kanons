'use client'

import { useState, useEffect } from 'react'
import { Music, Search, FileText, ExternalLink, Loader2 } from 'lucide-react'

interface NotionPage {
  id: string
  properties: {
    Name?: {
      title: Array<{ plain_text: string }>
    }
    [key: string]: any
  }
  url: string
}

interface LyricsData {
  results: NotionPage[]
}

const knownDatabases = [
  {
    name: 'Lyrics & Songs',
    id: '925f7b39e66042c7ac8e5a5a37716778',
    description: 'Main lyrics collection'
  },
  {
    name: "Kyle's Lyrics",
    id: '7558f0d737694d20bf9a587cbe5bf23f',
    description: 'Personal compositions'
  },
  {
    name: 'Tu Lengua Set List',
    id: 'ce6c6396e72f4ec199df3ddbf76a3388',
    description: 'Band set list and lyrics'
  },
]

export default function LyricsPage() {
  const [lyrics, setLyrics] = useState<NotionPage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSong, setSelectedSong] = useState<string | null>(null)

  useEffect(() => {
    fetchLyrics()
  }, [])

  const fetchLyrics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/lyrics')
      
      if (!response.ok) {
        throw new Error('Failed to fetch lyrics')
      }
      
      const data: LyricsData = await response.json()
      setLyrics(data.results)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredLyrics = lyrics.filter((song) => {
    const title = song.properties.Name?.title?.[0]?.plain_text || ''
    return title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Music className="w-8 h-8 text-terracotta" />
          <h1 className="font-display text-4xl text-midnight">Lyrics Hub</h1>
        </div>
        <p className="text-midnight/60">Search and browse song lyrics from Notion</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight/40" />
        <input
          type="text"
          placeholder="Search lyrics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-cream border border-midnight/10 rounded-lg focus:outline-none focus:border-terracotta transition-colors text-midnight"
        />
      </div>

      {/* Known Databases */}
      <section>
        <h2 className="font-display text-2xl text-midnight mb-4">Song Databases</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {knownDatabases.map((db) => (
            <a
              key={db.id}
              href={`https://notion.so/${db.id.replace(/-/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 bg-sand rounded-lg hover:bg-terracotta/10 transition-colors group"
            >
              <FileText className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-midnight group-hover:text-terracotta transition-colors">
                  {db.name}
                </h3>
                <p className="text-sm text-midnight/60">{db.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-midnight/40 group-hover:text-terracotta transition-colors flex-shrink-0" />
            </a>
          ))}
        </div>
      </section>

      {/* Lyrics List */}
      <section>
        <h2 className="font-display text-2xl text-midnight mb-4">
          All Songs {searchQuery && `(${filteredLyrics.length})`}
        </h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-terracotta/10 border border-terracotta/30 rounded-lg p-6 text-center">
            <p className="text-midnight/70">
              <strong>Error:</strong> {error}
            </p>
            <p className="text-sm text-midnight/60 mt-2">
              Make sure NOTION_API_KEY is configured in your environment variables.
            </p>
          </div>
        ) : filteredLyrics.length === 0 ? (
          <div className="bg-sand rounded-lg p-8 text-center">
            <Music className="w-12 h-12 text-midnight/20 mx-auto mb-3" />
            <p className="text-midnight/60">
              {searchQuery ? 'No songs found matching your search' : 'No lyrics found'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLyrics.map((song) => {
              const title = song.properties.Name?.title?.[0]?.plain_text || 'Untitled'
              const isExpanded = selectedSong === song.id

              return (
                <div
                  key={song.id}
                  className="bg-cream border border-midnight/5 rounded-lg overflow-hidden hover:border-terracotta/30 transition-all"
                >
                  <button
                    onClick={() => setSelectedSong(isExpanded ? null : song.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-sand transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Music className="w-5 h-5 text-terracotta" />
                      <span className="font-medium text-midnight">{title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={song.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 hover:bg-terracotta/10 rounded-lg transition-colors"
                        title="Open in Notion"
                      >
                        <ExternalLink className="w-4 h-4 text-midnight/40 hover:text-terracotta transition-colors" />
                      </a>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-midnight/5">
                      <div className="mt-4 p-4 bg-sand rounded-lg">
                        <p className="text-sm text-midnight/60 italic">
                          Lyrics preview coming soon. 
                          <a 
                            href={song.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-terracotta hover:underline ml-1"
                          >
                            View in Notion
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
