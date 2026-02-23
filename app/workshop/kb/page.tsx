'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { BookOpen, Mic, Cpu, FileText, ExternalLink, Users, Brain, MessageSquare, Inbox, BookMarked, ClipboardCheck, Search, X, Music2 } from 'lucide-react'
import { articles } from '@/lib/articles'
import type { Article } from '@/lib/articles'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
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
}

const typeLabels: Record<string, { label: string; color: string }> = {
  'report': { label: 'Report', color: 'bg-cyan-500 text-white' },
  'guide': { label: 'Guide', color: 'bg-ocean/80 text-white' },
  'article': { label: 'Article', color: 'bg-midnight/10 text-midnight/60' },
}

const ALL_CATEGORIES = ['All', ...Array.from(new Set(articles.map(a => a.category)))]

function isInternal(href: string) {
  return href.startsWith('/workshop/') || href.startsWith('/family/')
}

function ArticleCard({ item }: { item: Article }) {
  const Icon = iconMap[item.href] || FileText
  const typeInfo = typeLabels[item.type || 'article']
  const internal = isInternal(item.href)

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

export default function KnowledgeBasePage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return articles.filter(a => {
      const matchesCategory = activeCategory === 'All' || a.category === activeCategory
      const matchesQuery = !q ||
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
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
            {reports.map(item => <ArticleCard key={item.href} item={item} />)}
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
            {guides.map(item => <ArticleCard key={item.href} item={item} />)}
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
            {regularArticles.map(item => <ArticleCard key={item.href} item={item} />)}
          </div>
        </section>
      )}
    </div>
  )
}
