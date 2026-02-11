'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Artifact {
  slug: string
  title: string
  type: 'Briefings' | 'Calculators' | 'Research' | 'Prototypes' | 'Other'
  context: string
  description: string
  createdAt: string
  size: string
  tags: string[]
}

const TYPE_ICONS: Record<string, string> = {
  Briefings: '📄',
  Calculators: '🧮',
  Research: '🔬',
  Prototypes: '🧪',
  Other: '📦',
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Briefings: { bg: 'bg-blue-50', text: 'text-blue-700' },
  Calculators: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Research: { bg: 'bg-purple-50', text: 'text-purple-700' },
  Prototypes: { bg: 'bg-amber-50', text: 'text-amber-700' },
  Other: { bg: 'bg-slate-50', text: 'text-slate-600' },
}

const CONTEXTS = ['All', 'LO Buddy', 'Granada House', 'Music', 'Finance', 'StronGnome', 'Neo Somatic', 'Life Org', 'Other']
const TYPES = ['All', 'Briefings', 'Calculators', 'Research', 'Prototypes', 'Other']

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

type ViewMode = 'closed' | 'summary' | 'preview'

export default function ToolsPage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>('All')
  const [filterContext, setFilterContext] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Per-artifact view state
  const [viewModes, setViewModes] = useState<Record<string, ViewMode>>({})
  const [previewContent, setPreviewContent] = useState<Record<string, string>>({})
  const [summaryContent, setSummaryContent] = useState<Record<string, string>>({})
  const [loadingState, setLoadingState] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchArtifacts()
  }, [])

  const fetchArtifacts = async () => {
    try {
      const res = await fetch('/api/artifacts')
      if (!res.ok) throw new Error('Failed to fetch artifacts')
      const data = await res.json()
      setArtifacts(data.artifacts)
      setError(null)
    } catch (err) {
      setError('Could not load artifacts. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPreview = async (slug: string) => {
    if (previewContent[slug]) return
    setLoadingState(prev => ({ ...prev, [slug]: true }))
    try {
      const res = await fetch(`/api/artifacts/${slug}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setPreviewContent(prev => ({ ...prev, [slug]: data.content }))
    } catch (err) {
      console.error('Failed to load preview:', err)
      setPreviewContent(prev => ({ ...prev, [slug]: '⚠️ Failed to load preview' }))
    } finally {
      setLoadingState(prev => ({ ...prev, [slug]: false }))
    }
  }

  const fetchSummary = async (slug: string) => {
    if (summaryContent[slug]) return
    setLoadingState(prev => ({ ...prev, [slug]: true }))
    try {
      const res = await fetch(`/api/artifacts/${slug}/summary`)
      if (!res.ok) throw new Error('Failed to fetch summary')
      const data = await res.json()
      setSummaryContent(prev => ({ ...prev, [slug]: data.summary }))
    } catch (err) {
      console.error('Failed to load summary:', err)
      setSummaryContent(prev => ({ ...prev, [slug]: '⚠️ Failed to generate summary' }))
    } finally {
      setLoadingState(prev => ({ ...prev, [slug]: false }))
    }
  }

  const handleDownload = async (artifact: Artifact) => {
    try {
      const res = await fetch(`/api/artifacts/${artifact.slug}`)
      if (!res.ok) throw new Error('Failed to fetch artifact')
      const data = await res.json()
      const blob = new Blob([data.content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${artifact.slug}-${artifact.createdAt}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
      alert('Failed to download artifact')
    }
  }

  const setViewMode = (slug: string, mode: ViewMode) => {
    const current = viewModes[slug] || 'closed'
    if (current === mode) {
      // Toggle off
      setViewModes(prev => ({ ...prev, [slug]: 'closed' }))
    } else {
      setViewModes(prev => ({ ...prev, [slug]: mode }))
      if (mode === 'preview' && !previewContent[slug]) {
        fetchPreview(slug)
      }
      if (mode === 'summary' && !summaryContent[slug]) {
        fetchSummary(slug)
      }
    }
  }

  const filteredArtifacts = useMemo(() => {
    let result = artifacts
    if (filterType !== 'All') result = result.filter(a => a.type === filterType)
    if (filterContext !== 'All') result = result.filter(a => a.context === filterContext)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.tags.some(t => t.toLowerCase().includes(query))
      )
    }
    return result
  }, [artifacts, filterType, filterContext, searchQuery])

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-midnight mb-2">Tools & Artifacts</h1>
        <p className="text-midnight/60">Documents, calculators, and utilities built by Jasper</p>
      </div>

      {/* === SECTION A: ARTIFACTS === */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-ocean/10 rounded-xl flex items-center justify-center">
            <span className="text-2xl">📁</span>
          </div>
          <div>
            <h2 className="font-display text-xl text-midnight">Artifact Library</h2>
            <p className="text-sm text-midnight/50">Briefings, research, and files created for you</p>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {TYPES.map(type => {
              const count = type === 'All' ? artifacts.length : artifacts.filter(a => a.type === type).length
              const typeColor = type !== 'All' ? TYPE_COLORS[type] : null
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filterType === type
                      ? typeColor ? `${typeColor.bg} ${typeColor.text} ring-1 ring-current/20` : 'bg-ocean text-white'
                      : 'bg-cream text-midnight/60 hover:bg-midnight/5 border border-midnight/10'
                  }`}
                >
                  {type !== 'All' && <span>{TYPE_ICONS[type]}</span>}
                  {type}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${filterType === type ? 'bg-white/20' : 'bg-midnight/10'}`}>{count}</span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs text-midnight/40 font-medium uppercase tracking-wider whitespace-nowrap mr-1">Context:</span>
            {CONTEXTS.map(ctx => {
              const count = ctx === 'All' ? artifacts.length : artifacts.filter(a => a.context === ctx).length
              if (count === 0 && ctx !== 'All') return null
              return (
                <button
                  key={ctx}
                  onClick={() => setFilterContext(ctx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    filterContext === ctx ? 'bg-midnight text-cream' : 'bg-cream text-midnight/60 hover:bg-midnight/5 border border-midnight/10'
                  }`}
                >
                  {ctx} ({count})
                </button>
              )
            })}
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or tags..."
              className="w-full bg-cream border border-midnight/10 rounded-xl px-4 py-3 pl-11 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
            />
            <svg className="w-5 h-5 text-midnight/30 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-midnight/40">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading artifacts...
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && filteredArtifacts.length === 0 && (
          <div className="bg-cream rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📂</span>
            </div>
            <h2 className="font-display text-xl text-midnight mb-2">No artifacts found</h2>
            <p className="text-midnight/50 text-sm">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Artifact Cards */}
        {!loading && !error && filteredArtifacts.length > 0 && (
          <div className="space-y-4">
            {filteredArtifacts.map(artifact => {
              const typeColor = TYPE_COLORS[artifact.type]
              const mode = viewModes[artifact.slug] || 'closed'
              const isLoading = loadingState[artifact.slug] || false
              const isOpen = mode !== 'closed'

              return (
                <div
                  key={artifact.slug}
                  className={`bg-cream rounded-xl border-2 transition-all ${
                    isOpen ? 'border-ocean/30 shadow-lg' : 'border-midnight/5 hover:border-midnight/10'
                  }`}
                >
                  <div className="p-5">
                    {/* Header Row */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColor.bg}`}>
                        <span className="text-xl">{TYPE_ICONS[artifact.type]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base font-bold text-midnight leading-tight mb-1">
                          {artifact.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${typeColor.bg} ${typeColor.text}`}>
                            {artifact.type}
                          </span>
                          <span className="text-[10px] text-midnight/40">{artifact.context}</span>
                          <span className="text-[10px] text-midnight/40">•</span>
                          <span className="text-[10px] text-midnight/40">{artifact.size}</span>
                          <span className="text-[10px] text-midnight/40">•</span>
                          <span className="text-[10px] text-midnight/40">{formatDate(artifact.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-midnight/70 leading-relaxed mb-3">{artifact.description}</p>

                    {artifact.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mb-4">
                        {artifact.tags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-2 py-0.5 bg-midnight/5 rounded text-[10px] text-midnight/60">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-midnight/5">
                      <button
                        onClick={() => setViewMode(artifact.slug, 'summary')}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                          mode === 'summary'
                            ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        {mode === 'summary' ? 'Hide Summary' : 'Summarize'}
                      </button>
                      <button
                        onClick={() => setViewMode(artifact.slug, 'preview')}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                          mode === 'preview'
                            ? 'bg-ocean/20 text-ocean ring-1 ring-ocean/30'
                            : 'bg-midnight/5 text-midnight hover:bg-midnight/10'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {mode === 'preview' ? 'Hide Full Doc' : 'Read Full'}
                      </button>
                      <button
                        onClick={() => handleDownload(artifact)}
                        className="px-3 py-2 bg-ocean text-white rounded-lg text-xs font-medium hover:bg-ocean/90 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content Panel */}
                  {isOpen && (
                    <div className="border-t-2 border-midnight/5">
                      {/* Tab indicator */}
                      <div className="flex items-center gap-2 px-5 pt-3 pb-0">
                        <div className={`text-xs font-medium px-2 py-1 rounded ${
                          mode === 'summary' ? 'bg-amber-100 text-amber-800' : 'bg-ocean/10 text-ocean'
                        }`}>
                          {mode === 'summary' ? '📋 Summary' : '📖 Full Document'}
                        </div>
                        {mode === 'preview' && (
                          <div className="text-[10px] text-midnight/40 ml-auto">
                            Scroll to read • Rendered markdown
                          </div>
                        )}
                      </div>

                      <div className="p-5 pt-3">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-2 text-midnight/40 text-sm">
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              {mode === 'summary' ? 'Generating summary...' : 'Loading document...'}
                            </div>
                          </div>
                        ) : (
                          <div className={`bg-white rounded-lg overflow-y-auto ${
                            mode === 'summary' ? 'max-h-[500px] p-5' : 'max-h-[70vh] p-6'
                          }`}>
                            <div className="prose prose-sm max-w-none
                              prose-headings:font-display prose-headings:text-midnight
                              prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-6 prose-h1:border-b prose-h1:border-midnight/10 prose-h1:pb-3
                              prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-5
                              prose-h3:text-base prose-h3:mb-2 prose-h3:mt-4
                              prose-p:text-midnight/80 prose-p:leading-relaxed
                              prose-li:text-midnight/80
                              prose-strong:text-midnight prose-strong:font-semibold
                              prose-code:text-ocean prose-code:bg-ocean/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none
                              prose-pre:bg-midnight/5 prose-pre:rounded-lg prose-pre:border prose-pre:border-midnight/10
                              prose-a:text-ocean prose-a:no-underline hover:prose-a:underline
                              prose-blockquote:border-ocean/30 prose-blockquote:bg-ocean/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1
                              prose-hr:border-midnight/10
                              prose-table:text-sm
                              prose-th:bg-midnight/5 prose-th:px-3 prose-th:py-2
                              prose-td:px-3 prose-td:py-2 prose-td:border-midnight/10
                            ">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {mode === 'summary'
                                  ? (summaryContent[artifact.slug] || '')
                                  : (previewContent[artifact.slug] || '')
                                }
                              </ReactMarkdown>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* === SECTION B: TOOLS === */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🛠️</span>
          </div>
          <div>
            <h2 className="font-display text-xl text-midnight">Utilities & Calculators</h2>
            <p className="text-sm text-midnight/50">Interactive tools built for specific tasks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/family/tools/dscr-calculator">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 hover:border-emerald-300 rounded-xl p-6 relative overflow-hidden cursor-pointer group transition-all hover:shadow-lg hover:scale-[1.02]">
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="inline-flex items-center px-2 py-1 bg-emerald-500 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">Open →</span>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🧮</span>
              </div>
              <h3 className="font-display text-lg font-bold text-midnight mb-2">DSCR Calculator</h3>
              <p className="text-sm text-midnight/60 leading-relaxed">Calculate Debt Service Coverage Ratio for investment property loans with rental income estimates</p>
            </div>
          </Link>

          <Link href="/family/tools/refi-builder">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl p-6 relative overflow-hidden cursor-pointer group transition-all hover:shadow-lg hover:scale-[1.02]">
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="inline-flex items-center px-2 py-1 bg-blue-500 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">Open →</span>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-display text-lg font-bold text-midnight mb-2">Refi Scenario Builder</h3>
              <p className="text-sm text-midnight/60 leading-relaxed">Compare refinance options side-by-side with break-even analysis and lifetime savings projections</p>
            </div>
          </Link>

          <Link href="/family/tools/purchase-builder">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-300 rounded-xl p-6 relative overflow-hidden cursor-pointer group transition-all hover:shadow-lg hover:scale-[1.02]">
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2 py-1 bg-purple-500 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">🔥 NEW</span>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🏘️</span>
              </div>
              <h3 className="font-display text-lg font-bold text-midnight mb-2">Purchase Scenario Builder</h3>
              <p className="text-sm text-midnight/60 leading-relaxed">Multi-scenario purchase calculator comparing price points and down payment options — the killer feature for LO client consultations</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
