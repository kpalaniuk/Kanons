'use client'

import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { BookOpen, Mic, Cpu, FileText, ExternalLink, Users, Brain, MessageSquare, Inbox, BookMarked, ClipboardCheck, Search, X, Music2, Rocket, Trophy, Globe, Lock, Copy, Check } from 'lucide-react'
import { articles } from '@/lib/articles'
import type { Article } from '@/lib/articles'
import type { LucideIcon } from 'lucide-react'

// Slugs that have a public /view/[slug] component registered
const SHAREABLE_SLUGS = new Set(['lo-buddy-brief', 'fc-balboa', 'airstep-setup'])

function getSlug(href: string): string | null {
  if (!href.startsWith('/workshop/')) return null
  const slug = href.split('/').pop() || null
  return slug && SHAREABLE_SLUGS.has(slug) ? slug : null
}

const iconMap: Record<string, LucideIcon> = {
  '/workshop/personal/fc-balboa': Trophy,
  '/workshop/personal/lo-buddy-brief': Rocket,
  '/underwriting': Cpu,
  '/artifacts/lo-buddy-meeting-prep.md': MessageSquare,
  '/artifacts/trumpet-mic-comparison.html': Mic,
  '/artifacts/lo-buddy-openclaw-architecture.html': Cpu,
  '/artifacts/paige-daniel-summary': Users,
  '/artifacts/multi-agent-research': Brain,
  '/artifacts/lo-buddy-chad-meeting': MessageSquare,
  '/artifacts/Designer-Contractor_Partnership_Guide.md': FileText,
  '/artifacts/lo-buddy-testing-guide.html': ClipboardCheck,
  '/artifacts/lo-buddy-git-release-guide.html': BookMarked,
  '/artifacts/lo-buddy-phase2-report.html': Cpu,
  '/workshop/personal/airstep-setup': Music2,
}

const categoryColors: Record<string, string> = {
  'LO Buddy': 'bg-ocean/10 text-ocean',
  'Music & Gear': 'bg-terracotta/10 text-terracotta',
  'GH Design': 'bg-sunset/10 text-amber-600',
  'Technology': 'bg-ocean/10 text-ocean',
  'Business': 'bg-sunset/10 text-amber-600',
  'project': 'bg-cyan-500/10 text-cyan-600',
  'Personal': 'bg-cyan-500/10 text-cyan-600',
  'FC Balboa': 'bg-green-100 text-green-700',
  'Work': 'bg-ocean/10 text-ocean',
}

const tagColors: Record<string, string> = {
  'LO Buddy': 'bg-ocean/10 text-ocean',
  'Personal': 'bg-cyan-500/10 text-cyan-600',
  'FC Balboa': 'bg-green-100 text-green-700',
  'Music': 'bg-terracotta/10 text-terracotta',
}

const typeLabels: Record<string, { label: string; color: string }> = {
  'report': { label: 'Report', color: 'bg-cyan-500 text-white' },
  'guide': { label: 'Guide', color: 'bg-ocean/80 text-white' },
  'article': { label: 'Article', color: 'bg-midnight/10 text-midnight/60' },
}

const ALL_CATEGORIES = [
  'All',
  'Work',
  'Personal',
  ...Array.from(new Set([
    ...articles.map(a => a.category),
    ...articles.flatMap(a => a.tags || []),
  ])).filter(c => c !== 'Work' && c !== 'Personal'),
]

function isInternal(href: string) {
  return href.startsWith('/workshop/') || href.startsWith('/family/')
}

interface ArticleCardProps {
  item: Article
  isPublic?: boolean
  isCopied?: boolean
  onToggle?: (slug: string, enabled: boolean) => void
  onCopy?: (slug: string) => void
}

function ArticleCard({ item, isPublic, isCopied, onToggle, onCopy }: ArticleCardProps) {
  const Icon = iconMap[item.href] || FileText
  const typeInfo = typeLabels[item.type || 'article']
  const internal = isInternal(item.href)
  const slug = getSlug(item.href)
  const canShare = !!slug && !!onToggle

  const inner = (
    <div className="group bg-cream rounded-xl p-6 border border-midnight/5 hover:border-cyan-500/30 transition-all hover:shadow-lg h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Icon className="w-5 h-5 text-cyan-500" />
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[item.category] || 'bg-midnight/5 text-midnight/60'}`}>
            {item.category}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
        </div>
        <ExternalLink className="w-4 h-4 text-midnight/30 group-hover:text-cyan-500 transition-colors flex-shrink-0" />
      </div>
      <div className="mb-2">
        <span className="text-sm font-semibold text-cyan-600">{item.date}</span>
      </div>
      <h3 className="font-display text-lg text-midnight mb-2 group-hover:text-cyan-500 transition-colors">
        {item.title}
      </h3>
      <p className="text-sm text-midnight/60">{item.description}</p>
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-midnight/5">
          {item.tags.map(tag => (
            <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[tag] || 'bg-midnight/5 text-midnight/40'}`}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Share toggle — only shown for pages with a registered /view/[slug] */}
      {canShare && (
        <div className="mt-3 pt-3 border-t border-midnight/5 flex items-center gap-2" onClick={e => e.preventDefault()}>
          <button
            onClick={() => onToggle!(slug!, !isPublic)}
            title={isPublic ? 'Make private' : 'Make public'}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
              isPublic
                ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600'
                : 'bg-midnight/5 text-midnight/40 hover:bg-green-100 hover:text-green-700'
            }`}
          >
            {isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {isPublic ? 'Public' : 'Private'}
          </button>
          {isPublic && (
            <button
              onClick={() => onCopy?.(slug!)}
              title="Copy shareable link"
              className="flex items-center gap-1 text-xs text-midnight/40 hover:text-cyan-500 transition-colors"
            >
              {isCopied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
              {isCopied ? 'Copied!' : 'Copy link'}
            </button>
          )}
        </div>
      )}
    </div>
  )

  if (internal) {
    return <Link href={item.href} className="block h-full">{inner}</Link>
  }

  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {inner}
    </a>
  )
}

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://kyle.palaniuk.net'

export default function KnowledgeBasePage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(() => searchParams?.get('cat') || 'All')
  const [publicPages, setPublicPages] = useState<Record<string, boolean>>({})
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  // Sync when URL param changes (e.g. clicking KB Work vs KB Personal in nav)
  useEffect(() => {
    const cat = searchParams?.get('cat')
    if (cat) setActiveCategory(cat)
  }, [searchParams])

  // Load public pages state on mount
  useEffect(() => {
    fetch('/api/admin/publish')
      .then(r => r.ok ? r.json() : {})
      .then(map => setPublicPages(map))
      .catch(() => {})
  }, [])

  async function handleToggle(slug: string, enabled: boolean) {
    if (toggling) return
    const article = articles.find(a => getSlug(a.href) === slug)
    if (!article) return

    setToggling(slug)
    try {
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title: article.title, href: article.href, enabled }),
      })
      if (res.ok) {
        setPublicPages(prev => ({ ...prev, [slug]: enabled }))
        if (enabled) {
          // Auto-copy the link on publish
          await navigator.clipboard.writeText(`${BASE_URL}/view/${slug}`)
          setCopiedSlug(slug)
          setTimeout(() => setCopiedSlug(null), 3000)
        }
      }
    } finally {
      setToggling(null)
    }
  }

  async function handleCopy(slug: string) {
    await navigator.clipboard.writeText(`${BASE_URL}/view/${slug}`)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 3000)
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return articles.filter(a => {
      const matchesCategory =
        activeCategory === 'All' ||
        (activeCategory === 'Work' && a.section === 'work') ||
        (activeCategory === 'Personal' && a.section === 'personal') ||
        a.category === activeCategory ||
        (a.tags || []).includes(activeCategory)
      const matchesQuery = !q ||
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.tags || []).some(t => t.toLowerCase().includes(q))
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory])

  const isSearching = query.trim().length > 0 || activeCategory !== 'All'
  const reports = filtered.filter(a => a.type === 'report')
  const guides = filtered.filter(a => a.type === 'guide')
  const regularArticles = filtered.filter(a => a.type !== 'report' && a.type !== 'guide')

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-cyan-500" />
          <h1 className="font-display text-4xl text-midnight">Knowledge Base</h1>
        </div>
        <p className="text-midnight/60">Research, reports, guides, and reference materials.</p>
      </div>

      {/* Search + Filter */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight/30" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search articles, guides, reports..."
            className="w-full pl-12 pr-10 py-3 bg-white border border-midnight/10 rounded-xl text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-midnight/30 hover:text-midnight transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap">
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-white'
                  : 'bg-midnight/5 text-midnight/60 hover:bg-midnight/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Result count when searching */}
        {isSearching && (
          <p className="text-sm text-midnight/50">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            {query ? ` for "${query}"` : ''}
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
          </p>
        )}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-midnight/40">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No results found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      )}

      {/* Reports */}
      {reports.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-cyan-500 rounded-full" />
            <Inbox className="w-6 h-6 text-cyan-500" />
            <h2 className="font-display text-2xl text-midnight">From Jasper</h2>
          </div>
          <p className="text-midnight/50 text-sm mb-6">Reports and deliverables — read these first.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {reports.map(item => {
              const slug = getSlug(item.href)
              return <ArticleCard key={item.href} item={item} isPublic={slug ? publicPages[slug] : undefined} isCopied={slug === copiedSlug} onToggle={handleToggle} onCopy={handleCopy} />
            })}
          </div>
        </section>
      )}

      {/* Guides */}
      {guides.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-ocean rounded-full" />
            <BookMarked className="w-6 h-6 text-ocean" />
            <h2 className="font-display text-2xl text-midnight">Guides</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {guides.map(item => {
              const slug = getSlug(item.href)
              return <ArticleCard key={item.href} item={item} isPublic={slug ? publicPages[slug] : undefined} isCopied={slug === copiedSlug} onToggle={handleToggle} onCopy={handleCopy} />
            })}
          </div>
        </section>
      )}

      {/* Articles */}
      {regularArticles.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-terracotta rounded-full" />
            <FileText className="w-6 h-6 text-terracotta" />
            <h2 className="font-display text-2xl text-midnight">Articles</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {regularArticles.map(item => {
              const slug = getSlug(item.href)
              return <ArticleCard key={item.href} item={item} isPublic={slug ? publicPages[slug] : undefined} isCopied={slug === copiedSlug} onToggle={handleToggle} onCopy={handleCopy} />
            })}
          </div>
        </section>
      )}
    </div>
  )
}
