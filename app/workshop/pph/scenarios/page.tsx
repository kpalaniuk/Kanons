'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw, ExternalLink, Copy, Check } from 'lucide-react'

interface RecentScenario {
  slug: string
  label: string
  clientName: string
  clientId: string | null
  clientStage: string | null
  type: string
  isInteractive: boolean
  publicUrl: string
  createdAt: string
  lo: string | null
}

const STAGE_COLORS: Record<string, string> = {
  'New Lead': 'bg-slate-100 text-slate-600',
  'Pre-Approved': 'bg-blue-100 text-blue-700',
  'In Process': 'bg-amber-100 text-amber-700',
  'Funded': 'bg-emerald-100 text-emerald-700',
}

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState<RecentScenario[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/pph/recent-scenarios?limit=30')
      .then(r => r.ok ? r.json() : [])
      .then(d => setScenarios(d))
      .finally(() => setLoading(false))
  }, [])

  function copyLink(s: RecentScenario) {
    navigator.clipboard.writeText(`https://kyle.palaniuk.net${s.publicUrl}`)
    setCopiedSlug(s.slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Build new */}
      <div>
        <h1 className="font-display text-2xl text-midnight mb-1">Scenarios</h1>
        <p className="text-sm text-midnight/50 mb-5">Build and share interactive mortgage scenarios with clients.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/workshop/pph/purchase-builder', icon: '🏠', title: 'Purchase Builder', desc: 'Down payment comparison, payment grid, share link' },
            { href: '/workshop/pph/refi-builder', icon: '🏦', title: 'Refi Builder', desc: 'Cash-out, rate comparison, break-even calc' },
            { href: '/workshop/pph/dscr-calculator', icon: '📊', title: 'DSCR Calculator', desc: 'Investment property debt-service coverage' },
          ].map(tool => (
            <Link key={tool.href} href={tool.href}
              className="flex items-start gap-3 bg-cream rounded-xl p-4 border border-midnight/5 hover:border-ocean/30 hover:bg-ocean/2 transition-colors group">
              <span className="text-2xl">{tool.icon}</span>
              <div>
                <p className="text-sm font-semibold text-midnight group-hover:text-ocean transition-colors">{tool.title}</p>
                <p className="text-xs text-midnight/40 mt-0.5">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent scenarios — team-wide */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-midnight">Recent Scenarios — All Team</h2>
          <button onClick={() => { setLoading(true); fetch('/api/pph/recent-scenarios?limit=30').then(r => r.json()).then(setScenarios).finally(() => setLoading(false)) }}
            className="flex items-center gap-1.5 text-xs text-midnight/40 hover:text-midnight transition-colors">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-5 h-5 text-ocean animate-spin" />
          </div>
        )}

        {!loading && scenarios.length === 0 && (
          <div className="text-center py-12 text-midnight/30 text-sm italic">
            No scenarios yet — build one above.
          </div>
        )}

        <div className="space-y-2">
          {scenarios.map(s => (
            <div key={s.slug} className={`bg-white rounded-xl border flex items-center gap-4 px-4 py-3 ${s.isInteractive ? 'border-ocean/20' : 'border-midnight/8'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-midnight truncate">{s.label}</p>
                  {s.isInteractive && <span className="text-[10px] font-bold text-ocean uppercase tracking-wider">Live</span>}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-midnight/40 flex-wrap">
                  {s.clientId
                    ? <Link href={`/workshop/pph/clients/${s.clientId}`} className="font-medium text-midnight/60 hover:text-ocean transition-colors">{s.clientName} ↗</Link>
                    : <span className="text-midnight/40">{s.clientName}</span>
                  }
                  {s.clientStage && <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${STAGE_COLORS[s.clientStage] || 'bg-gray-100 text-gray-500'}`}>{s.clientStage}</span>}
                  {s.lo && <span>· {s.lo}</span>}
                  <span>· {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => copyLink(s)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-midnight/50 hover:bg-midnight/5 transition-colors">
                  {copiedSlug === s.slug ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a href={s.publicUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-midnight/5 text-midnight/60 hover:bg-midnight/10 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> View
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
