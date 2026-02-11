'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
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

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Briefings: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Calculators: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Research: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Prototypes: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Other: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
}

const CONTEXTS = ['All', 'LO Buddy', 'Granada House', 'Music', 'Finance', 'StronGnome', 'Neo Somatic', 'Life Org', 'Other']
const TYPES = ['All', 'Briefings', 'Calculators', 'Research', 'Prototypes', 'Other']

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

type ViewMode = 'closed' | 'summary' | 'full'

// ─── Markdown Viewer Component ──────────────────────────────
function MarkdownViewer({ content, maxHeight }: { content: string; maxHeight?: string }) {
  return (
    <div
      className={`bg-white rounded-xl border border-midnight/10 overflow-y-auto shadow-inner ${maxHeight || 'max-h-[70vh]'}`}
    >
      <div className="p-6 md:p-8">
        <div
          className="prose prose-sm md:prose-base max-w-none
            prose-headings:font-display prose-headings:text-midnight
            prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-8 prose-h1:pb-3 prose-h1:border-b prose-h1:border-midnight/10 first:prose-h1:mt-0
            prose-h2:text-xl prose-h2:font-bold prose-h2:mb-3 prose-h2:mt-6 prose-h2:text-ocean
            prose-h3:text-base prose-h3:font-semibold prose-h3:mb-2 prose-h3:mt-4 prose-h3:text-midnight/80
            prose-p:text-midnight/75 prose-p:leading-relaxed prose-p:mb-3
            prose-li:text-midnight/75 prose-li:leading-relaxed
            prose-ul:my-2 prose-ol:my-2
            prose-strong:text-midnight prose-strong:font-semibold
            prose-em:text-midnight/60
            prose-code:text-ocean prose-code:bg-ocean/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-midnight/[0.03] prose-pre:rounded-xl prose-pre:border prose-pre:border-midnight/10 prose-pre:shadow-sm
            prose-a:text-ocean prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-ocean/40 prose-blockquote:bg-ocean/[0.03] prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic
            prose-hr:border-midnight/10 prose-hr:my-6
            prose-table:text-sm prose-table:border-collapse prose-table:w-full
            prose-thead:bg-midnight/[0.03]
            prose-th:px-4 prose-th:py-2.5 prose-th:text-left prose-th:font-semibold prose-th:text-midnight prose-th:border prose-th:border-midnight/10
            prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-midnight/10 prose-td:text-midnight/70
            prose-tr:even:bg-midnight/[0.02]
            prose-img:rounded-xl prose-img:shadow-md
          "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────
export default function ToolsPage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>('All')
  const [filterContext, setFilterContext] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [viewModes, setViewModes] = useState<Record<string, ViewMode>>({})
  const [fullContent, setFullContent] = useState<Record<string, string>>({})
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
    } catch (err) {
      setError('Could not load artifacts.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchFull = useCallback(async (slug: string) => {
    if (fullContent[slug]) return
    setLoadingState(prev => ({ ...prev, [slug]: true }))
    try {
      const res = await fetch(`/api/artifacts/${slug}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setFullContent(prev => ({ ...prev, [slug]: data.content }))
    } catch (err) {
      console.error(err)
      setFullContent(prev => ({ ...prev, [slug]: '⚠️ Failed to load document. Please try again.' }))
    } finally {
      setLoadingState(prev => ({ ...prev, [slug]: false }))
    }
  }, [fullContent])

  const fetchSummary = useCallback(async (slug: string) => {
    if (summaryContent[slug]) return
    setLoadingState(prev => ({ ...prev, [slug]: true }))
    try {
      const res = await fetch(`/api/artifacts/${slug}/summary`)
      if (!res.ok) throw new Error('Failed to fetch summary')
      const data = await res.json()
      setSummaryContent(prev => ({ ...prev, [slug]: data.summary }))
    } catch (err) {
      console.error(err)
      setSummaryContent(prev => ({ ...prev, [slug]: '⚠️ Failed to generate summary.' }))
    } finally {
      setLoadingState(prev => ({ ...prev, [slug]: false }))
    }
  }, [summaryContent])

  const handleDownload = async (artifact: Artifact) => {
    try {
      const res = await fetch(`/api/artifacts/${artifact.slug}`)
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      const blob = new Blob([data.content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${artifact.slug}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      alert('Download failed')
    }
  }

  const toggleView = (slug: string, mode: ViewMode) => {
    const current = viewModes[slug] || 'closed'
    if (current === mode) {
      setViewModes(prev => ({ ...prev, [slug]: 'closed' }))
    } else {
      setViewModes(prev => ({ ...prev, [slug]: mode }))
      if (mode === 'full') fetchFull(slug)
      if (mode === 'summary') fetchSummary(slug)
    }
  }

  const filteredArtifacts = useMemo(() => {
    let result = artifacts
    if (filterType !== 'All') result = result.filter(a => a.type === filterType)
    if (filterContext !== 'All') result = result.filter(a => a.context === filterContext)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
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

      {/* ═══ ARTIFACTS ═══ */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-ocean/10 rounded-xl flex items-center justify-center">
            <span className="text-2xl">📁</span>
          </div>
          <div>
            <h2 className="font-display text-xl text-midnight">Artifact Library</h2>
            <p className="text-sm text-midnight/50">Briefings, research, and files — tap to read inline</p>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {TYPES.map(type => {
              const count = type === 'All' ? artifacts.length : artifacts.filter(a => a.type === type).length
              const tc = type !== 'All' ? TYPE_COLORS[type] : null
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    filterType === type
                      ? tc ? `${tc.bg} ${tc.text} ring-1 ring-current/20` : 'bg-ocean text-white'
                      : 'bg-cream text-midnight/50 hover:bg-midnight/5 border border-midnight/10'
                  }`}
                >
                  {type !== 'All' && <span>{TYPE_ICONS[type]}</span>}
                  {type}
                  <span className={`text-[10px] px-1 py-0.5 rounded-full ${filterType === type ? 'bg-white/30' : 'bg-midnight/10'}`}>{count}</span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[10px] text-midnight/40 font-medium uppercase tracking-wider mr-1">Context:</span>
            {CONTEXTS.map(ctx => {
              const count = ctx === 'All' ? artifacts.length : artifacts.filter(a => a.context === ctx).length
              if (count === 0 && ctx !== 'All') return null
              return (
                <button
                  key={ctx}
                  onClick={() => setFilterContext(ctx)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                    filterContext === ctx ? 'bg-midnight text-cream' : 'bg-cream text-midnight/50 hover:bg-midnight/5 border border-midnight/10'
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
              placeholder="Search artifacts..."
              className="w-full bg-cream border border-midnight/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
            />
            <svg className="w-4 h-4 text-midnight/30 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-midnight/40">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading...
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
            <span className="text-4xl mb-4 block">📂</span>
            <h2 className="font-display text-xl text-midnight mb-2">No artifacts found</h2>
            <p className="text-midnight/50 text-sm">Try adjusting your filters</p>
          </div>
        )}

        {/* Artifact Cards */}
        {!loading && !error && filteredArtifacts.length > 0 && (
          <div className="space-y-4">
            {filteredArtifacts.map(artifact => {
              const tc = TYPE_COLORS[artifact.type]
              const mode = viewModes[artifact.slug] || 'closed'
              const isLoading = loadingState[artifact.slug] || false
              const isOpen = mode !== 'closed'

              return (
                <div
                  key={artifact.slug}
                  className={`bg-cream rounded-2xl border-2 transition-all duration-200 ${
                    isOpen ? 'border-ocean/20 shadow-lg shadow-ocean/5' : 'border-midnight/5 hover:border-midnight/10 hover:shadow-md'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tc.bg}`}>
                        <span className="text-lg">{TYPE_ICONS[artifact.type]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base font-bold text-midnight leading-tight mb-1">
                          {artifact.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap text-[10px] text-midnight/40">
                          <span className={`inline-flex px-1.5 py-0.5 rounded ${tc.bg} ${tc.text} font-medium`}>{artifact.type}</span>
                          <span>{artifact.context}</span>
                          <span>•</span>
                          <span>{artifact.size}</span>
                          <span>•</span>
                          <span>{formatDate(artifact.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-midnight/60 leading-relaxed mb-3">{artifact.description}</p>

                    {artifact.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mb-4">
                        {artifact.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-midnight/5 rounded text-[10px] text-midnight/50 font-medium">{tag}</span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-midnight/5">
                      <button
                        onClick={() => toggleView(artifact.slug, 'summary')}
                        className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                          mode === 'summary'
                            ? 'bg-amber-400 text-midnight shadow-sm'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                        }`}
                      >
                        📋 {mode === 'summary' ? 'Hide Summary' : 'Summarize'}
                      </button>
                      <button
                        onClick={() => toggleView(artifact.slug, 'full')}
                        className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                          mode === 'full'
                            ? 'bg-ocean text-white shadow-sm'
                            : 'bg-ocean/5 text-ocean hover:bg-ocean/10 border border-ocean/20'
                        }`}
                      >
                        📖 {mode === 'full' ? 'Hide Document' : 'Read Full'}
                      </button>
                      <button
                        onClick={() => handleDownload(artifact)}
                        className="px-4 py-2.5 bg-midnight text-cream rounded-xl text-xs font-semibold hover:bg-midnight/80 transition-all flex items-center justify-center gap-1.5"
                      >
                        ⬇️ .md
                      </button>
                    </div>
                  </div>

                  {/* ─── Expanded Content ─── */}
                  {isOpen && (
                    <div className="border-t-2 border-midnight/5 bg-midnight/[0.02]">
                      {/* View Mode Tab */}
                      <div className="flex items-center justify-between px-5 pt-4 pb-2">
                        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                          mode === 'summary' ? 'bg-amber-100 text-amber-800' : 'bg-ocean/10 text-ocean'
                        }`}>
                          {mode === 'summary' ? '📋 Summary View' : '📖 Full Document'}
                        </div>
                        {mode === 'full' && (
                          <span className="text-[10px] text-midnight/30">Scroll to read • Formatted markdown</span>
                        )}
                      </div>

                      <div className="px-5 pb-5">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-16">
                            <div className="flex flex-col items-center gap-3 text-midnight/40">
                              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              <span className="text-sm">{mode === 'summary' ? 'Generating summary...' : 'Loading document...'}</span>
                            </div>
                          </div>
                        ) : (
                          <MarkdownViewer
                            content={
                              mode === 'summary'
                                ? (summaryContent[artifact.slug] || '')
                                : (fullContent[artifact.slug] || '')
                            }
                            maxHeight={mode === 'summary' ? 'max-h-[500px]' : 'max-h-[75vh]'}
                          />
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

      {/* ═══ TOOLS ═══ */}
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
              <p className="text-sm text-midnight/60 leading-relaxed">Calculate Debt Service Coverage Ratio for investment property loans</p>
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
              <p className="text-sm text-midnight/60 leading-relaxed">Compare refinance options with break-even analysis and lifetime savings</p>
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
              <p className="text-sm text-midnight/60 leading-relaxed">Multi-scenario purchase calculator — price points, down payments, PMI, DTI qualification</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
