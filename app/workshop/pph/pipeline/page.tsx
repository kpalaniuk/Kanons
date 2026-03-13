'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { PPHNav } from '../_components/PPHNav'
import { RefreshCw, User, Calendar, DollarSign } from 'lucide-react'

interface Client {
  id: string
  name: string
  stage: string
  priority: string
  loanType: string | null
  loanAmount: number | null
  targetPurchasePrice: number | null
  followUpDate: string | null
  lastTouched: string | null
  nextAction: string
  primaryLo: string | null
  ficoScore: number | null
}

const KANBAN_STAGES = [
  'New Lead',
  'Pre-Approved',
  'App Sent',
  'Processing',
  'Closing',
]

const STAGE_STYLES: Record<string, { header: string; dot: string }> = {
  'New Lead':    { header: 'bg-slate-100 text-slate-700',   dot: 'bg-slate-400' },
  'Pre-Approved':{ header: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500' },
  'App Sent':    { header: 'bg-cyan-100 text-cyan-700',     dot: 'bg-cyan-500' },
  'Processing':  { header: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
  'Closing':     { header: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
}

const PRIORITY_DOT: Record<string, string> = {
  Hot: 'bg-red-500',
  Active: 'bg-orange-400',
  Warm: 'bg-amber-400',
  Monitoring: 'bg-emerald-400',
}

const PRIORITY_ORDER: Record<string, number> = { Hot: 0, Active: 1, Warm: 2, Monitoring: 3 }

function relativeDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const today = new Date(); today.setHours(0,0,0,0)
  date.setHours(0,0,0,0)
  const diff = Math.floor((date.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr); d.setHours(0,0,0,0)
  const t = new Date(); t.setHours(0,0,0,0)
  return d < t
}

function mapClient(row: Record<string, unknown>): Client {
  return {
    id: row.id as string,
    name: row.name as string,
    stage: (row.stage as string) || 'New Lead',
    priority: (row.priority as string) || 'Active',
    loanType: (row.loan_type as string) || null,
    loanAmount: (row.loan_amount as number) || null,
    targetPurchasePrice: (row.target_purchase_price as number) || null,
    followUpDate: (row.follow_up_date as string) || null,
    lastTouched: (row.last_touched as string) || null,
    nextAction: (row.next_action as string) || '',
    primaryLo: (row.primary_lo as string) || null,
    ficoScore: (row.fico_score as number) || null,
  }
}

export default function PipelineKanbanPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchClients() }, [])

  async function fetchClients() {
    setLoading(true)
    try {
      const res = await fetch('/api/pph/clients')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setClients((data as Record<string, unknown>[]).map(mapClient))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const byStage = useMemo(() => {
    const active = clients.filter(c => c.stage !== 'Closed' && c.stage !== 'Lost')
    const map: Record<string, Client[]> = {}
    for (const stage of KANBAN_STAGES) {
      map[stage] = active
        .filter(c => c.stage === stage)
        .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9))
    }
    return map
  }, [clients])

  const closedCount = useMemo(() => clients.filter(c => c.stage === 'Closed').length, [clients])
  const totalVolume = useMemo(() =>
    clients
      .filter(c => c.stage !== 'Closed' && c.stage !== 'Lost')
      .reduce((sum, c) => sum + (c.loanAmount || c.targetPurchasePrice || 0), 0),
    [clients]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-6 h-6 text-ocean animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-full">
      <PPHNav />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-midnight">Pipeline</h1>
          <p className="text-midnight/50 text-sm mt-1">
            {clients.filter(c => c.stage !== 'Closed' && c.stage !== 'Lost').length} active ·{' '}
            {closedCount} closed
            {totalVolume > 0 && (
              <span className="ml-2 text-emerald-600 font-medium">
                ${(totalVolume / 1_000_000).toFixed(1)}M in play
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/workshop/pph/opportunities"
            className="px-3 py-1.5 text-xs font-medium text-midnight/60 border border-midnight/10 rounded-lg hover:border-midnight/30 transition-colors"
          >
            List view
          </Link>
          <button onClick={fetchClients} className="p-2 hover:bg-midnight/5 rounded-lg transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4 text-midnight/40" />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {KANBAN_STAGES.map(stage => {
            const cards = byStage[stage] || []
            const style = STAGE_STYLES[stage]
            const stageVolume = cards.reduce((s, c) => s + (c.loanAmount || c.targetPurchasePrice || 0), 0)
            return (
              <div key={stage} className="w-64 flex-shrink-0 flex flex-col gap-3">
                {/* Column header */}
                <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${style.header}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <span className="text-xs font-semibold">{stage}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {stageVolume > 0 && (
                      <span className="text-[10px] opacity-60">${(stageVolume/1000).toFixed(0)}k</span>
                    )}
                    <span className="text-xs font-bold opacity-60">{cards.length}</span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2">
                  {cards.map(client => {
                    const overdue = isOverdue(client.followUpDate)
                    const fuLabel = relativeDate(client.followUpDate)
                    return (
                      <Link
                        key={client.id}
                        href={`/workshop/pph/clients/${client.id}`}
                        className={`block bg-cream rounded-xl p-3 border transition-all hover:shadow-md hover:border-midnight/20 group ${
                          overdue ? 'border-red-200 bg-red-50/40' : 'border-midnight/5'
                        }`}
                      >
                        {/* Name + priority */}
                        <div className="flex items-start gap-2 mb-2">
                          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${PRIORITY_DOT[client.priority] || 'bg-gray-400'}`} />
                          <span className="text-sm font-semibold text-midnight group-hover:text-ocean transition-colors leading-snug">
                            {client.name}
                          </span>
                        </div>

                        {/* Meta */}
                        <div className="space-y-1 ml-4">
                          {client.loanType && (
                            <p className="text-[11px] text-midnight/50">{client.loanType}</p>
                          )}
                          {(client.loanAmount || client.targetPurchasePrice) ? (
                            <p className="text-[11px] text-midnight/70 font-medium flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {((client.loanAmount || client.targetPurchasePrice || 0) / 1000).toFixed(0)}k
                            </p>
                          ) : null}
                          {client.ficoScore && (
                            <p className={`text-[11px] font-medium ${
                              client.ficoScore >= 740 ? 'text-emerald-600' :
                              client.ficoScore >= 680 ? 'text-amber-600' : 'text-red-500'
                            }`}>
                              FICO {client.ficoScore}
                            </p>
                          )}
                          {client.primaryLo && (
                            <p className="text-[11px] text-midnight/40 flex items-center gap-1">
                              <User className="w-3 h-3" />{client.primaryLo}
                            </p>
                          )}
                          {fuLabel && (
                            <p className={`text-[11px] flex items-center gap-1 font-medium ${
                              overdue ? 'text-red-600' : 'text-midnight/50'
                            }`}>
                              <Calendar className="w-3 h-3" />
                              {fuLabel}
                            </p>
                          )}
                          {client.nextAction && (
                            <p className="text-[11px] text-midnight/40 truncate leading-snug mt-1">
                              → {client.nextAction}
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}

                  {cards.length === 0 && (
                    <div className="border-2 border-dashed border-midnight/8 rounded-xl p-4 text-center">
                      <p className="text-xs text-midnight/25">Empty</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Closed / Lost summary */}
      {(closedCount > 0 || clients.filter(c => c.stage === 'Lost').length > 0) && (
        <div className="flex gap-4 pt-2 border-t border-midnight/5">
          {closedCount > 0 && (
            <div className="text-sm text-midnight/40">
              <span className="font-semibold text-emerald-600">{closedCount}</span> closed
            </div>
          )}
          {clients.filter(c => c.stage === 'Lost').length > 0 && (
            <div className="text-sm text-midnight/40">
              <span className="font-semibold text-red-400">{clients.filter(c => c.stage === 'Lost').length}</span> lost
            </div>
          )}
          <Link href="/workshop/pph/opportunities" className="text-sm text-ocean hover:underline ml-auto">
            View all in list →
          </Link>
        </div>
      )}
    </div>
  )
}
