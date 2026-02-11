'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

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

export default function ToolsPage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>('All')
  const [filterContext, setFilterContext] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [expandedArtifact, setExpandedArtifact] = useState<string | null>(null)
  const [previewContent, setPreviewContent] = useState<Record<string, string>>({})
  const [loadingPreview, setLoadingPreview] = useState<string | null>(null)

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
    if (previewContent[slug]) return // Already loaded

    setLoadingPreview(slug)
    try {
      const res = await fetch(`/api/artifacts/${slug}`)
      if (!res.ok) throw new Error('Failed to fetch artifact content')
      const data = await res.json()
      setPreviewContent((prev) => ({ ...prev, [slug]: data.content }))
    } catch (err) {
      console.error('Failed to load preview:', err)
      setPreviewContent((prev) => ({ ...prev, [slug]: '⚠️ Failed to load preview' }))
    } finally {
      setLoadingPreview(null)
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

  const handlePreviewToggle = (slug: string) => {
    if (expandedArtifact === slug) {
      setExpandedArtifact(null)
    } else {
      setExpandedArtifact(slug)
      if (!previewContent[slug]) {
        fetchPreview(slug)
      }
    }
  }

  const filteredArtifacts = useMemo(() => {
    let result = artifacts

    if (filterType !== 'All') {
      result = result.filter((a) => a.type === filterType)
    }

    if (filterContext !== 'All') {
      result = result.filter((a) => a.context === filterContext)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.tags.some((t) => t.toLowerCase().includes(query))
      )
    }

    return result
  }, [artifacts, filterType, filterContext, searchQuery])

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl text-midnight mb-2">Tools & Artifacts</h1>
        <p className="text-midnight/60">
          Documents, calculators, and utilities built by Jasper
        </p>
      </motion.div>

      {/* === SECTION A: ARTIFACTS / FILE FOLDER === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-12"
      >
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
          {/* Type Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {TYPES.map((type) => {
              const count = type === 'All' ? artifacts.length : artifacts.filter((a) => a.type === type).length
              const typeColor = type !== 'All' ? TYPE_COLORS[type] : null
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    filterType === type
                      ? typeColor
                        ? `${typeColor.bg} ${typeColor.text} ring-1 ring-current/20`
                        : 'bg-ocean text-white'
                      : 'bg-cream text-midnight/60 hover:bg-midnight/5 border border-midnight/10'
                  }`}
                >
                  {type !== 'All' && <span>{TYPE_ICONS[type]}</span>}
                  {type}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${filterType === type ? 'bg-white/20' : 'bg-midnight/10'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Context Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs text-midnight/40 font-medium uppercase tracking-wider whitespace-nowrap mr-1">Context:</span>
            {CONTEXTS.map((ctx) => {
              const count = ctx === 'All' ? artifacts.length : artifacts.filter((a) => a.context === ctx).length
              if (count === 0 && ctx !== 'All') return null
              return (
                <button
                  key={ctx}
                  onClick={() => setFilterContext(ctx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    filterContext === ctx
                      ? 'bg-midnight text-cream'
                      : 'bg-cream text-midnight/60 hover:bg-midnight/5 border border-midnight/10'
                  }`}
                >
                  {ctx} ({count})
                </button>
              )
            })}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredArtifacts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-cream rounded-2xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📂</span>
            </div>
            <h2 className="font-display text-xl text-midnight mb-2">No artifacts found</h2>
            <p className="text-midnight/50 text-sm">Try adjusting your filters or search query</p>
          </motion.div>
        )}

        {/* Artifact Grid */}
        {!loading && !error && filteredArtifacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredArtifacts.map((artifact, idx) => {
              const typeColor = TYPE_COLORS[artifact.type]
              const isExpanded = expandedArtifact === artifact.slug
              const preview = previewContent[artifact.slug]
              const isLoadingPreview = loadingPreview === artifact.slug

              return (
                <motion.div
                  key={artifact.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`bg-cream rounded-xl border-2 border-midnight/5 hover:border-midnight/10 transition-all ${
                    isExpanded ? 'md:col-span-2 lg:col-span-3' : ''
                  }`}
                >
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColor.bg}`}>
                        <span className="text-xl">{TYPE_ICONS[artifact.type]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base font-bold text-midnight leading-tight mb-1 line-clamp-2">
                          {artifact.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${typeColor.bg} ${typeColor.text}`}>
                            {artifact.type}
                          </span>
                          <span className="text-[10px] text-midnight/40">{artifact.context}</span>
                          <span className="text-[10px] text-midnight/40">•</span>
                          <span className="text-[10px] text-midnight/40">{artifact.size}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-midnight/70 leading-relaxed mb-3 line-clamp-2">
                      {artifact.description}
                    </p>

                    {/* Tags */}
                    {artifact.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mb-4">
                        {artifact.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 bg-midnight/5 rounded text-[10px] text-midnight/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-2 pt-3 border-t border-midnight/5">
                      <button
                        onClick={() => handleDownload(artifact)}
                        className="flex-1 px-3 py-2 bg-ocean text-white rounded-lg text-xs font-medium hover:bg-ocean/90 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                      <button
                        onClick={() => handlePreviewToggle(artifact.slug)}
                        className="flex-1 px-3 py-2 bg-midnight/5 text-midnight rounded-lg text-xs font-medium hover:bg-midnight/10 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {isExpanded ? 'Hide' : 'Preview'}
                      </button>
                      <span className="text-[10px] text-midnight/30 ml-2">{formatDate(artifact.createdAt)}</span>
                    </div>
                  </div>

                  {/* Preview */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t-2 border-midnight/5"
                      >
                        <div className="p-5 bg-midnight/5">
                          {isLoadingPreview ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="flex items-center gap-2 text-midnight/40 text-sm">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Loading preview...
                              </div>
                            </div>
                          ) : preview ? (
                            <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
                              <pre className="text-xs text-midnight/80 whitespace-pre-wrap font-mono leading-relaxed">
                                {preview}
                              </pre>
                            </div>
                          ) : (
                            <div className="text-sm text-midnight/50 text-center py-4">
                              Preview unavailable
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </motion.div>

      {/* === SECTION B: TOOLS & UTILITIES === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
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
          {/* DSCR Calculator */}
          <Link href="/family/tools/dscr-calculator">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 hover:border-emerald-300 rounded-xl p-6 relative overflow-hidden cursor-pointer group transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="inline-flex items-center px-2 py-1 bg-emerald-500 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Open →
                </span>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🧮</span>
              </div>
              <h3 className="font-display text-lg font-bold text-midnight mb-2">DSCR Calculator</h3>
              <p className="text-sm text-midnight/60 leading-relaxed">
                Calculate Debt Service Coverage Ratio for investment property loans with rental income estimates
              </p>
            </motion.div>
          </Link>

          {/* Refi Scenario Builder */}
          <Link href="/family/tools/refi-builder">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl p-6 relative overflow-hidden cursor-pointer group transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="inline-flex items-center px-2 py-1 bg-blue-500 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Open →
                </span>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="font-display text-lg font-bold text-midnight mb-2">Refi Scenario Builder</h3>
              <p className="text-sm text-midnight/60 leading-relaxed">
                Compare refinance options side-by-side with break-even analysis and lifetime savings projections
              </p>
            </motion.div>
          </Link>

          {/* Purchase Scenario Builder */}
          <Link href="/family/tools/purchase-builder">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-300 rounded-xl p-6 relative overflow-hidden cursor-pointer group transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2 py-1 bg-purple-500 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">
                  🔥 NEW
                </span>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🏘️</span>
              </div>
              <h3 className="font-display text-lg font-bold text-midnight mb-2">Purchase Scenario Builder</h3>
              <p className="text-sm text-midnight/60 leading-relaxed">
                Multi-scenario purchase calculator comparing price points and down payment options — the killer feature for LO client consultations
              </p>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
