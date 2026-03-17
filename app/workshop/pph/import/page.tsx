'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, CheckCircle, ArrowRight, RefreshCw, Lock, Users, Database } from 'lucide-react'

interface PreviewRow {
  pphId: string
  name: string
  stage: string
  lobStatus: string
  phone: string | null
  primaryLo: string | null
  assignedToLobUserId: string
  loanType: string | null
  ficoScore: number | null
  targetPrice: number | null
  possibleDuplicate: boolean
  action: 'create' | 'skip'
  notes: string | null
}

interface PreviewData {
  preview: PreviewRow[]
  summary: {
    total: number
    toCreate: number
    toSkip: number
    ghGroupTeamId: string
    targetDb: string
  }
}

const STAGE_COLORS: Record<string, string> = {
  'New Lead': 'text-slate-500',
  'Pre-Approved': 'text-blue-600',
  'In Process': 'text-amber-600',
  'Funded': 'text-emerald-600',
  'Closed': 'text-gray-400',
}

const LOB_STATUS_COLORS: Record<string, string> = {
  'NEW_LEAD': 'bg-slate-100 text-slate-600',
  'PRE_APPROVED': 'bg-blue-100 text-blue-700',
  'IN_PROCESS': 'bg-amber-100 text-amber-700',
  'FUNDED': 'bg-emerald-100 text-emerald-700',
  'CLOSED': 'bg-gray-100 text-gray-500',
}

export default function ImportWizardPage() {
  const [data, setData] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [overrides, setOverrides] = useState<Record<string, 'create' | 'skip'>>({})

  function loadPreview() {
    setLoading(true)
    fetch('/api/pph/import-preview')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d) })
      .finally(() => setLoading(false))
  }

  function toggleAction(id: string, current: 'create' | 'skip') {
    setOverrides(prev => ({ ...prev, [id]: current === 'create' ? 'skip' : 'create' }))
  }

  const rows = (data?.preview || []).map(r => ({
    ...r,
    action: overrides[r.pphId] ?? r.action,
  }))
  const willCreate = rows.filter(r => r.action === 'create').length
  const willSkip = rows.filter(r => r.action === 'skip').length

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link href="/workshop/pph/opportunities" className="text-sm text-midnight/40 hover:text-midnight mb-3 inline-flex items-center gap-1">
          ← Pipeline
        </Link>
        <h1 className="font-display text-2xl text-midnight">Import Wizard</h1>
        <p className="text-sm text-midnight/50 mt-1">
          Migrate PPH clients → LO Buddy <span className="font-medium text-violet-700">GH Group</span>. Preview first — no changes made until you confirm.
        </p>
      </div>

      {/* Target info */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex items-start gap-3">
        <Database className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-violet-800">Target: LO Buddy — GH Group</p>
          <p className="text-xs text-violet-600 mt-0.5">
            All imported clients will be created under team <code className="bg-violet-100 px-1 rounded">gh-group</code> and assigned to their respective LO in LO Buddy.
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-violet-700">
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Kyle · Jim · Anthony · Chad</span>
            <span>·</span>
            <span>GHL/LO Ninja: 2,602 contacts live ✓</span>
          </div>
        </div>
      </div>

      {/* Prerequisites checklist */}
      <div className="bg-cream rounded-xl border border-midnight/5 p-5">
        <h2 className="text-sm font-semibold text-midnight mb-4">Before running the import</h2>
        <div className="space-y-2.5">
          {[
            { done: true,  label: 'LO Buddy GH Group exists with correct team ID' },
            { done: true,  label: 'Kyle, Jim, Anthony, Chad accounts live in GH Group (created Feb 24)' },
            { done: true,  label: 'GHL / LO Ninja connection alive (2,602 contacts)' },
            { done: true,  label: 'Supabase bridge connected (read + write scoped to GH Group)' },
            { done: false, label: 'Jim + Anthony need to reset passwords and log into LO Buddy (kyle@planpreparehome.com etc.)' },
            { done: false, label: 'Review and confirm import preview below — mark skips for test contacts' },
            { done: false, label: 'Decide: import PPH clients first, or let GHL sync bring them in via import wizard?' },
            { done: false, label: 'Run import (confirm button will appear below once preview is reviewed)' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              {item.done
                ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                : <div className="w-4 h-4 rounded-full border-2 border-midnight/20 flex-shrink-0 mt-0.5" />
              }
              <p className={`text-sm ${item.done ? 'text-midnight/60 line-through' : 'text-midnight'}`}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Load preview */}
      {!data && (
        <div className="text-center py-8">
          <button onClick={loadPreview} disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ocean text-white rounded-xl font-medium hover:bg-ocean/90 transition-colors disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading preview...' : 'Load Import Preview'}
          </button>
          <p className="text-xs text-midnight/40 mt-2">Read-only — no changes made</p>
        </div>
      )}

      {/* Preview table */}
      {data && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-midnight/60">{data.summary.total} clients total</span>
              <span className="text-emerald-600 font-medium">→ {willCreate} to create</span>
              <span className="text-slate-400">{willSkip} to skip</span>
            </div>
            <button onClick={loadPreview} className="text-xs text-midnight/40 hover:text-midnight flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          <div className="space-y-2">
            {rows.map(row => (
              <div key={row.pphId} className={`rounded-xl border px-4 py-3 flex items-center gap-4 transition-opacity ${
                row.action === 'skip' ? 'opacity-40 bg-white border-midnight/8' : 'bg-cream border-midnight/8'
              }`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-midnight">{row.name}</p>
                    {row.possibleDuplicate && (
                      <span className="flex items-center gap-0.5 text-[10px] text-amber-600 font-medium">
                        <AlertTriangle className="w-3 h-3" /> possible duplicate
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-midnight/40 flex-wrap">
                    <span className={STAGE_COLORS[row.stage] || 'text-midnight/40'}>{row.stage}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${LOB_STATUS_COLORS[row.lobStatus] || 'bg-gray-100 text-gray-500'}`}>{row.lobStatus}</span>
                    {row.phone && <span>{row.phone}</span>}
                    {row.primaryLo && <span>· {row.primaryLo}</span>}
                    {row.ficoScore && <span>· FICO {row.ficoScore}</span>}
                    {row.targetPrice && <span>· ${Math.round(row.targetPrice/1000)}k</span>}
                  </div>
                </div>
                <button onClick={() => toggleAction(row.pphId, row.action)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    row.action === 'create'
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}>
                  {row.action === 'create' ? '✓ Create' : '— Skip'}
                </button>
              </div>
            ))}
          </div>

          {/* Locked run button */}
          <div className="flex items-center gap-3 pt-4 border-t border-midnight/8">
            <div className="flex items-center gap-2 px-5 py-3 bg-midnight/5 text-midnight/30 rounded-xl cursor-not-allowed select-none">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Run Import ({willCreate} clients)</span>
            </div>
            <p className="text-xs text-midnight/40">
              Not ready yet — complete the prerequisites above first, then this will unlock.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
