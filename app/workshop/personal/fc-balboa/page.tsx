'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Globe, Lock, Copy, Check, ExternalLink, Trophy, Users, Calendar, ClipboardList } from 'lucide-react'
import { articles } from '@/lib/articles'
import type { Article } from '@/lib/articles'

// ── Helpers ──────────────────────────────────────────────────────────────────

function getSlug(href: string) {
  return href.replace(/^\/+|\/+$/g, '').replace(/\//g, '-')
}

const typeLabels: Record<string, { label: string; color: string }> = {
  'report': { label: 'Report', color: 'bg-cyan-500 text-white' },
  'guide':  { label: 'Guide',  color: 'bg-ocean/80 text-white' },
  'article':{ label: 'Article',color: 'bg-midnight/10 text-midnight/60' },
}

// ── Article Card (matches KB page style) ─────────────────────────────────────

interface ArticleCardProps {
  item: Article
  isPublic?: boolean
  isCopied?: boolean
  onToggle: (slug: string, enabled: boolean) => void
  onCopy: (slug: string) => void
}

function ArticleCard({ item, isPublic, isCopied, onToggle, onCopy }: ArticleCardProps) {
  const typeInfo = typeLabels[item.type || 'article']
  const slug = getSlug(item.href)

  return (
    <div className="relative">
      <Link href={item.href} className="block">
        <div className="group bg-cream rounded-xl p-6 border border-midnight/5 hover:border-cyan-500/30 transition-all hover:shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <FileText className="w-5 h-5 text-cyan-500" />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
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
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-700">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share toggle */}
          <div className="mt-3 pt-3 border-t border-midnight/5 flex items-center gap-2" onClick={e => e.preventDefault()}>
            <button
              onClick={() => onToggle(slug, !isPublic)}
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
                onClick={() => onCopy(slug)}
                title="Copy shareable link"
                className="flex items-center gap-1 text-xs text-midnight/40 hover:text-cyan-500 transition-colors"
              >
                {isCopied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                {isCopied ? 'Copied!' : 'Copy link'}
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

const fcArticles = articles.filter(a => (a.tags || []).includes('FC Balboa'))

export default function FCBalboaPage() {
  const [publicPages, setPublicPages] = useState<Record<string, boolean>>({})
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/publish')
      .then(r => r.json())
      .then((data: Array<{ slug: string; enabled: boolean }>) => {
        const map: Record<string, boolean> = {}
        data.forEach(p => { map[p.slug] = p.enabled })
        setPublicPages(map)
      })
      .catch(() => {})
  }, [])

  const handleToggle = async (slug: string, enabled: boolean) => {
    const article = fcArticles.find(a => getSlug(a.href) === slug)
    if (!article) return
    setPublicPages(prev => ({ ...prev, [slug]: enabled }))
    await fetch('/api/admin/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, title: article.title, href: article.href, enabled }),
    })
  }

  const handleCopy = (slug: string) => {
    const url = `${window.location.origin}/view/${slug}`
    navigator.clipboard.writeText(url).catch(() => {})
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10">

      <Link href="/workshop/kb" className="inline-flex items-center gap-2 text-sm text-midnight/40 hover:text-cyan-500 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Knowledge Base
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">FC Balboa · Personal</span>
        </div>
        <h1 className="font-display text-4xl text-midnight mb-2">FC Balboa</h1>
        <p className="text-midnight/60">U10 coaching hub — documents, season notes, roster, practice plans.</p>
      </div>

      {/* Documents */}
      <section className="space-y-4">
        <h2 className="font-display text-xl text-midnight">Documents</h2>
        {fcArticles.length === 0 ? (
          <p className="text-sm text-midnight/40 italic">No documents yet.</p>
        ) : (
          <div className="space-y-4">
            {fcArticles.map(item => {
              const slug = getSlug(item.href)
              return (
                <ArticleCard
                  key={item.href}
                  item={item}
                  isPublic={publicPages[slug]}
                  isCopied={copiedSlug === slug}
                  onToggle={handleToggle}
                  onCopy={handleCopy}
                />
              )
            })}
          </div>
        )}
      </section>

      {/* Season Overview */}
      <section className="bg-cream rounded-xl p-6 border border-midnight/5">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-5 h-5 text-green-600" />
          <h2 className="font-display text-xl text-midnight">Season Overview</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-midnight/40 text-xs mb-1">Team</div>
            <div className="font-medium text-midnight">FC Balboa U10</div>
          </div>
          <div>
            <div className="text-midnight/40 text-xs mb-1">Head Coach</div>
            <div className="font-medium text-midnight">Kyle Palaniuk + Andy Laub</div>
          </div>
          <div>
            <div className="text-midnight/40 text-xs mb-1">Birth Year Window</div>
            <div className="font-medium text-midnight">Aug 2016 – Jul 2017</div>
          </div>
          <div>
            <div className="text-midnight/40 text-xs mb-1">Practice</div>
            <div className="font-medium text-midnight">Wed/Thu · Jefferson Elementary</div>
          </div>
        </div>
      </section>

      {/* Roster */}
      <section className="bg-cream rounded-xl p-6 border border-midnight/5">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-green-600" />
          <h2 className="font-display text-xl text-midnight">Roster</h2>
        </div>
        <p className="text-sm text-midnight/40 italic">Add players here as the season progresses.</p>
      </section>

      {/* Practice Plans */}
      <section className="bg-cream rounded-xl p-6 border border-midnight/5">
        <div className="flex items-center gap-3 mb-4">
          <ClipboardList className="w-5 h-5 text-green-600" />
          <h2 className="font-display text-xl text-midnight">Practice Plans</h2>
        </div>
        <p className="text-sm text-midnight/40 italic">Session plans, drills, and focus areas go here.</p>
      </section>

      {/* Game Log */}
      <section className="bg-cream rounded-xl p-6 border border-midnight/5">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-green-600" />
          <h2 className="font-display text-xl text-midnight">Game Log</h2>
        </div>
        <p className="text-sm text-midnight/40 italic">Results and notes by game date.</p>
      </section>

    </div>
  )
}
