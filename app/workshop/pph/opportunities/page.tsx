'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import FollowUpCalendarStrip from './FollowUpCalendarStrip'
import {
  AlertTriangle, Clock, Phone, MessageSquare, FileText,
  ChevronDown, ChevronUp, Plus, Search, User, Calendar,
  Filter, RefreshCw, StickyNote
} from 'lucide-react'

interface Client {
  id: string
  name: string
  stage: string
  priority: string
  loanType: string | null
  loanAmount: number | null
  nextAction: string
  followUpDate: string | null
  lastTouched: string | null
  notes: string
  referralSource: string
  referralName: string | null
  referralType: string | null
  primaryLo: string | null
  primaryContact: string | null
  phone: string | null
  ficoScore: number | null
  targetPurchasePrice: number | null
  targetArea: string | null
  stageUpdatedAt: string | null
}

const STAGES = ['New Lead', 'Pre-Approved', 'In Process', 'Waiting', 'App Sent', 'Processing', 'Closing', 'Closed', 'Lost']
const ACTIVE_STAGES = ['New Lead', 'Pre-Approved', 'In Process', 'Waiting', 'App Sent', 'Processing', 'Closing']

function StageTimeline({ stage, stageUpdatedAt }: { stage: string; stageUpdatedAt: string | null }) {
  const idx = ACTIVE_STAGES.indexOf(stage)
  if (idx === -1) return null // Closed/Lost handled separately
  const daysSince = stageUpdatedAt
    ? Math.floor((Date.now() - new Date(stageUpdatedAt).getTime()) / (1000 * 60 * 60 * 24))
    : null
  const stale = daysSince !== null && daysSince > 14
  return (
    <div className="mt-2 flex items-center gap-0.5" title={stageUpdatedAt ? `In ${stage} for ${daysSince}d` : ''}>
      {ACTIVE_STAGES.map((s, i) => (
        <div key={s} className="flex items-center gap-0.5">
          <div className={`h-1.5 rounded-full transition-all ${
            i < idx ? 'w-4 bg-ocean/40' :
            i === idx ? `w-5 ${stale ? 'bg-amber-400' : 'bg-ocean'}` :
            'w-3 bg-midnight/10'
          }`} title={s} />
        </div>
      ))}
      {daysSince !== null && (
        <span className={`ml-1.5 text-[10px] font-medium ${stale ? 'text-amber-500' : 'text-midnight/30'}`}>
          {daysSince}d
        </span>
      )}
    </div>
  )
}
const PRIORITIES = ['Hot', 'Active', 'Warm', 'Monitoring']
const LO_OPTIONS = ['Kyle', 'Jim', 'Anthony']

const STAGE_COLORS: Record<string, string> = {
  'New Lead': 'bg-slate-100 text-slate-700',
  'Pre-Approved': 'bg-blue-100 text-blue-700',
  'In Process': 'bg-purple-100 text-purple-700',
  'Waiting': 'bg-amber-100 text-amber-700',
  'App Sent': 'bg-cyan-100 text-cyan-700',
  'Processing': 'bg-indigo-100 text-indigo-700',
  'Closing': 'bg-emerald-100 text-emerald-700',
  'Closed': 'bg-green-100 text-green-700',
  'Lost': 'bg-red-100 text-red-400',
}

const PRIORITY_DOT: Record<string, string> = {
  Hot: 'bg-red-500',
  Active: 'bg-orange-500',
  Warm: 'bg-amber-500',
  Monitoring: 'bg-emerald-500',
}

function getFollowUpStatus(dateStr: string | null): 'overdue' | 'today' | 'upcoming' | 'none' {
  if (!dateStr) return 'none'
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  const diff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 'overdue'
  if (diff === 0) return 'today'
  return 'upcoming'
}

function relativeDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff === -1) return 'Tomorrow'
  if (diff < 0) return `In ${Math.abs(diff)}d`
  if (diff < 7) return `${diff}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}


function getLoanTypeBadge(loanType: string) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    'Conventional': { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
    'Conv':         { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
    'FHA':          { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'VA':           { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200' },
    'DSCR':         { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
    'Jumbo':        { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200' },
    'Non-QM':       { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200' },
    'Bridge':       { bg: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-200' },
  }
  const style = map[loanType] ?? { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' }
  return style
}

export default function OpportunitiesPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState('all')
  const [filterLo, setFilterLo] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterReferral, setFilterReferral] = useState('all')
  const [filterLoanType, setFilterLoanType] = useState('all')
  const [filterCalendarDay, setFilterCalendarDay] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [logCallClient, setLogCallClient] = useState<Client | null>(null)
  const [logCallType, setLogCallType] = useState('Call')
  const [logCallNotes, setLogCallNotes] = useState('')
  const [submittingLog, setSubmittingLog] = useState(false)
  const [editingFollowUp, setEditingFollowUp] = useState<string | null>(null)
  const [followUpDraft, setFollowUpDraft] = useState('')
  const [savingFollowUp, setSavingFollowUp] = useState(false)
  const [editingStage, setEditingStage] = useState<string | null>(null)
  const [savingStage, setSavingStage] = useState(false)
  const [savingPriority, setSavingPriority] = useState<string | null>(null)
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())

  // New client form state
  const [newName, setNewName] = useState('')
  const [newLoanType, setNewLoanType] = useState('')
  const [newPriority, setNewPriority] = useState('Active')
  const [newLo, setNewLo] = useState('Kyle')
  const [newPhone, setNewPhone] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [submittingNew, setSubmittingNew] = useState(false)

  function toggleNotes(id: string) {
    setExpandedNotes(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  useEffect(() => { fetchClients() }, [])

  function mapClient(row: Record<string, unknown>): Client {
    return {
      id: row.id as string,
      name: row.name as string,
      stage: (row.stage as string) || 'New Lead',
      priority: (row.priority as string) || 'Active',
      loanType: (row.loan_type as string) || null,
      loanAmount: (row.loan_amount as number) || null,
      nextAction: (row.next_action as string) || '',
      followUpDate: (row.follow_up_date as string) || null,
      lastTouched: (row.last_touched as string) || null,
      notes: (row.notes as string) || '',
      referralSource: (row.referral_source as string) || '',
      referralName: (row.referral_name as string) || null,
      referralType: (row.referral_type as string) || null,
      primaryLo: (row.primary_lo as string) || null,
      primaryContact: (row.primary_contact as string) || null,
      phone: (row.phone as string) || null,
      ficoScore: (row.fico_score as number) || null,
      targetPurchasePrice: (row.target_purchase_price as number) || null,
      targetArea: (row.target_area as string) || null,
      stageUpdatedAt: (row.stage_updated_at as string) || null,
    }
  }

  async function fetchClients() {
    try {
      setLoading(true)
      const res = await fetch('/api/pph/clients')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setClients((data as Record<string, unknown>[]).map(mapClient))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function addClient() {
    if (!newName.trim()) return
    setSubmittingNew(true)
    try {
      const res = await fetch('/api/pph/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          loanType: newLoanType || undefined,
          priority: newPriority,
          primaryLo: newLo,
          phone: newPhone || undefined,
          notes: newNotes || undefined,
        }),
      })
      if (res.ok) {
        setShowAddForm(false)
        setNewName(''); setNewLoanType(''); setNewPriority('Active'); setNewLo('Kyle'); setNewPhone(''); setNewNotes('')
        fetchClients()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmittingNew(false)
    }
  }

  async function logCall() {
    if (!logCallClient) return
    setSubmittingLog(true)
    try {
      await fetch('/api/pph/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: logCallClient.id,
          clientName: logCallClient.name,
          callType: logCallType,
          notes: logCallNotes,
        }),
      })
      // Update lastTouched in Supabase
      await fetch('/api/pph/clients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: logCallClient.id,
          lastTouched: new Date().toISOString().split('T')[0],
        }),
      })
      setLogCallClient(null)
      setLogCallType('Call')
      setLogCallNotes('')
      fetchClients()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmittingLog(false)
    }
  }

  async function saveFollowUp(clientId: string, date: string) {
    if (savingFollowUp) return
    setSavingFollowUp(true)
    try {
      await fetch('/api/pph/clients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: clientId, followUpDate: date || null }),
      })
      setClients(prev => prev.map(c => c.id === clientId ? { ...c, followUpDate: date || null } : c))
    } catch (err) {
      console.error(err)
    } finally {
      setSavingFollowUp(false)
      setEditingFollowUp(null)
    }
  }

  function openFollowUpPicker(client: Client) {
    setFollowUpDraft(client.followUpDate || '')
    setEditingFollowUp(client.id)
  }

  async function saveStage(clientId: string, stage: string) {
    if (savingStage) return
    setSavingStage(true)
    try {
      await fetch('/api/pph/clients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: clientId, stage }),
      })
      setClients(prev => prev.map(c => c.id === clientId ? { ...c, stage } : c))
    } catch (err) {
      console.error(err)
    } finally {
      setSavingStage(false)
      setEditingStage(null)
    }
  }

  async function cyclePriority(clientId: string, currentPriority: string) {
    if (savingPriority === clientId) return
    const idx = PRIORITIES.indexOf(currentPriority)
    const next = PRIORITIES[(idx + 1) % PRIORITIES.length]
    setSavingPriority(clientId)
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, priority: next } : c))
    try {
      await fetch('/api/pph/clients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: clientId, priority: next }),
      })
    } catch (err) {
      console.error(err)
      setClients(prev => prev.map(c => c.id === clientId ? { ...c, priority: currentPriority } : c))
    } finally {
      setSavingPriority(null)
    }
  }

  // Alerts: overdue + due today
  const overdueClients = useMemo(() =>
    clients.filter(c => getFollowUpStatus(c.followUpDate) === 'overdue' && c.stage !== 'Closed' && c.stage !== 'Lost'),
    [clients]
  )
  const todayClients = useMemo(() =>
    clients.filter(c => getFollowUpStatus(c.followUpDate) === 'today' && c.stage !== 'Closed' && c.stage !== 'Lost'),
    [clients]
  )

  // Referral type counts (active clients only)
  const referralCounts = useMemo(() => {
    const active = clients.filter(c => c.stage !== 'Closed' && c.stage !== 'Lost')
    const counts: Record<string, number> = {}
    active.forEach(c => {
      const t = c.referralType || 'Unknown'
      counts[t] = (counts[t] || 0) + 1
    })
    return counts
  }, [clients])

  const referralTypes = useMemo(() => Object.keys(referralCounts).sort(), [referralCounts])

  // Loan type counts (active clients only)
  const loanTypeCounts = useMemo(() => {
    const active = clients.filter(c => c.stage !== 'Closed' && c.stage !== 'Lost')
    const counts: Record<string, number> = {}
    active.forEach(c => {
      if (c.loanType) counts[c.loanType] = (counts[c.loanType] || 0) + 1
    })
    return counts
  }, [clients])
  const loanTypes = useMemo(() => Object.keys(loanTypeCounts).sort(), [loanTypeCounts])

  // Filtered + searched
  const filtered = useMemo(() => {
    let list = clients.filter(c => c.stage !== 'Closed' && c.stage !== 'Lost')
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.notes?.toLowerCase().includes(q))
    }
    if (filterStage !== 'all') list = list.filter(c => c.stage === filterStage)
    if (filterLo !== 'all') list = list.filter(c => c.primaryLo === filterLo)
    if (filterPriority !== 'all') list = list.filter(c => c.priority === filterPriority)
    if (filterReferral !== 'all') list = list.filter(c => (c.referralType || 'Unknown') === filterReferral)
    if (filterLoanType !== 'all') list = list.filter(c => c.loanType === filterLoanType)
    if (filterCalendarDay) list = list.filter(c => c.followUpDate && c.followUpDate.slice(0, 10) === filterCalendarDay)
    // Sort: Hot first, then by follow-up date (overdue first)
    const priorityOrder: Record<string, number> = { Hot: 0, Active: 1, Warm: 2, Monitoring: 3 }
    list.sort((a, b) => {
      const pa = priorityOrder[a.priority] ?? 9
      const pb = priorityOrder[b.priority] ?? 9
      if (pa !== pb) return pa - pb
      const fa = a.followUpDate ? new Date(a.followUpDate).getTime() : Infinity
      const fb = b.followUpDate ? new Date(b.followUpDate).getTime() : Infinity
      return fa - fb
    })
    return list
  }, [clients, search, filterStage, filterLo, filterPriority, filterReferral, filterLoanType, filterCalendarDay])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-6 h-6 text-ocean animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-midnight">Opportunities</h1>
          <p className="text-midnight/50 text-sm mt-1">{clients.filter(c => c.stage !== 'Closed' && c.stage !== 'Lost').length} active deals</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Client
        </button>
      </div>

      {/* Alert Banners */}
      {overdueClients.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-700">
              {overdueClients.length} overdue follow-up{overdueClients.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {overdueClients.map(c => (
              <Link
                key={c.id}
                href={`/workshop/pph/clients/${c.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
              >
                {c.name} · {relativeDate(c.followUpDate)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {todayClients.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">
              {todayClients.length} follow-up{todayClients.length > 1 ? 's' : ''} due today
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {todayClients.map(c => (
              <Link
                key={c.id}
                href={`/workshop/pph/clients/${c.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium hover:bg-amber-200 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Follow-Up Calendar Strip */}
      <FollowUpCalendarStrip
        clients={clients}
        activeDay={filterCalendarDay}
        onDayClick={setFilterCalendarDay}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight/30" />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-cream border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50"
          />
        </div>
        <select value={filterStage} onChange={e => setFilterStage(e.target.value)} className="px-3 py-2 bg-cream border border-midnight/10 rounded-lg text-sm">
          <option value="all">All Stages</option>
          {STAGES.filter(s => s !== 'Closed' && s !== 'Lost').map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterLo} onChange={e => setFilterLo(e.target.value)} className="px-3 py-2 bg-cream border border-midnight/10 rounded-lg text-sm">
          <option value="all">All LOs</option>
          {LO_OPTIONS.map(lo => <option key={lo} value={lo}>{lo}</option>)}
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="px-3 py-2 bg-cream border border-midnight/10 rounded-lg text-sm">
          <option value="all">All Priorities</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <button onClick={fetchClients} className="p-2 hover:bg-midnight/5 rounded-lg transition-colors" title="Refresh">
          <RefreshCw className="w-4 h-4 text-midnight/40" />
        </button>
      </div>

      {/* Referral Source Filter Chips */}
      {referralTypes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-midnight/40 font-medium uppercase tracking-wide">Source:</span>
          <button
            onClick={() => setFilterReferral('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filterReferral === 'all'
                ? 'bg-midnight text-cream'
                : 'bg-midnight/8 text-midnight/60 hover:bg-midnight/15'
            }`}
          >
            All
          </button>
          {referralTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterReferral(filterReferral === type ? 'all' : type)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterReferral === type
                  ? 'bg-ocean text-white'
                  : 'bg-ocean/10 text-ocean hover:bg-ocean/20'
              }`}
            >
              {type} <span className="opacity-60">·{referralCounts[type]}</span>
            </button>
          ))}
        </div>
      )}

      {loanTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={() => setFilterLoanType('all')}
            className={"px-3 py-1 rounded-full text-xs font-medium border transition-colors " + (
              filterLoanType === 'all'
                ? 'bg-ocean text-white border-ocean'
                : 'bg-cream text-midnight/60 border-midnight/10 hover:border-ocean/30'
            )}
          >
            All Types
          </button>
          {loanTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterLoanType(filterLoanType === type ? 'all' : type)}
              className={"px-3 py-1 rounded-full text-xs font-medium border transition-colors " + (
                filterLoanType === type
                  ? 'bg-ocean text-white border-ocean'
                  : 'bg-cream text-midnight/60 border-midnight/10 hover:border-ocean/30'
              )}
            >
              {type} ({loanTypeCounts[type]})
            </button>
          ))}
        </div>
      )}


      {/* Client Cards */}
      <div className="grid gap-3">
        {filtered.map(client => {
          const followUp = getFollowUpStatus(client.followUpDate)
          const notesExpanded = expandedNotes.has(client.id)
          const hasNotes = !!client.notes?.trim()
          return (
            <div
              key={client.id}
              className={`bg-cream rounded-xl p-4 border transition-all hover:shadow-md ${
                followUp === 'overdue' ? 'border-red-300 bg-red-50/30' :
                followUp === 'today' ? 'border-amber-300 bg-amber-50/30' :
                'border-midnight/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <button
                      onClick={e => { e.preventDefault(); e.stopPropagation(); cyclePriority(client.id, client.priority) }}
                      className={`w-3 h-3 rounded-full flex-shrink-0 transition-transform hover:scale-125 ${savingPriority === client.id ? 'opacity-50' : 'cursor-pointer'} ${PRIORITY_DOT[client.priority] || 'bg-gray-400'}`}
                      title={`${client.priority} — click to cycle`}
                    />
                    <Link
                      href={`/workshop/pph/clients/${client.id}`}
                      className="font-display text-lg text-midnight hover:text-ocean transition-colors truncate"
                    >
                      {client.name}
                    </Link>
                    {editingStage === client.id ? (
                      <select
                        value={client.stage}
                        onChange={e => saveStage(client.id, e.target.value)}
                        onBlur={() => setEditingStage(null)}
                        onKeyDown={e => { if (e.key === 'Escape') setEditingStage(null) }}
                        autoFocus
                        className="text-xs border border-ocean/40 rounded-full px-2 py-0.5 focus:outline-none focus:border-ocean bg-white"
                        onClick={e => e.stopPropagation()}
                      >
                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <button
                        onClick={e => { e.preventDefault(); setEditingStage(client.id) }}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-opacity hover:opacity-70 ${STAGE_COLORS[client.stage] || 'bg-gray-100 text-gray-600'}`}
                        title="Click to change stage"
                      >
                        {client.stage}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-midnight/50">
                    {client.loanType && <span className={"px-2 py-0.5 rounded-full text-xs font-semibold border " + getLoanTypeBadge(client.loanType!)}>{client.loanType}</span>}
                    {client.targetPurchasePrice && <span className="font-medium text-midnight/70">${(client.targetPurchasePrice/1000).toFixed(0)}k</span>}
                    {client.loanAmount && !client.targetPurchasePrice && <span>${(client.loanAmount / 1000).toFixed(0)}k</span>}
                    {client.ficoScore && <span className={`font-medium ${client.ficoScore >= 740 ? 'text-emerald-600' : client.ficoScore >= 680 ? 'text-amber-600' : 'text-red-500'}`}>FICO {client.ficoScore}</span>}
                    {client.targetArea && <span>📍 {client.targetArea}</span>}
                    {client.primaryLo && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {client.primaryLo}
                      </span>
                    )}
                    {editingFollowUp === client.id ? (
                      <span className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <input
                          type="date"
                          value={followUpDraft}
                          onChange={e => setFollowUpDraft(e.target.value)}
                          onBlur={() => saveFollowUp(client.id, followUpDraft)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveFollowUp(client.id, followUpDraft)
                            if (e.key === 'Escape') setEditingFollowUp(null)
                          }}
                          autoFocus
                          className="text-xs border border-ocean/40 rounded px-1.5 py-0.5 focus:outline-none focus:border-ocean bg-white"
                        />
                        {followUpDraft && (
                          <button
                            onClick={() => saveFollowUp(client.id, '')}
                            className="text-xs text-red-400 hover:text-red-600 px-1"
                            title="Clear"
                          >✕</button>
                        )}
                      </span>
                    ) : (
                      <button
                        onClick={e => { e.preventDefault(); openFollowUpPicker(client) }}
                        className={`flex items-center gap-1 hover:opacity-70 transition-opacity ${
                          followUp === 'overdue' ? 'text-red-600 font-semibold' :
                          followUp === 'today' ? 'text-amber-600 font-semibold' :
                          client.followUpDate ? 'text-emerald-600' : 'text-midnight/25 hover:text-midnight/50'
                        }`}
                        title="Set follow-up date"
                      >
                        <Calendar className="w-3 h-3" />
                        {client.followUpDate ? relativeDate(client.followUpDate) : 'Set date'}
                      </button>
                    )}
                    {client.lastTouched && (() => {
                      const daysSince = Math.floor((Date.now() - new Date(client.lastTouched!).getTime()) / (1000 * 60 * 60 * 24))
                      const colorClass = daysSince <= 6 ? 'text-emerald-600 bg-emerald-50' : daysSince <= 13 ? 'text-amber-500 bg-amber-50' : 'text-red-500 bg-red-50'
                      const label = daysSince <= 0 ? 'Today' : daysSince === 1 ? '1d ago' : `${daysSince}d ago`
                      return (
                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${colorClass}`} title={`Last touched: ${client.lastTouched}`}>
                          <span className="opacity-60">touched</span> {label}
                        </span>
                      )
                    })()}
                    {(client.referralType || client.referralName) ? (
                      <span className="flex items-center gap-1 text-midnight/40 italic">
                        via {[client.referralType, client.referralName].filter(Boolean).join(' · ')}
                      </span>
                    ) : (
                      <Link
                        href={`/workshop/pph/clients/${client.id}?tab=profile`}
                        className="flex items-center gap-1 text-[10px] font-medium text-amber-500 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 hover:bg-amber-100 transition-colors"
                        title="Add referral source"
                      >
                        <span>+ referral source</span>
                      </Link>
                    )}
                  </div>
                  {client.nextAction && (
                    <p className="text-xs text-midnight/60 mt-1 truncate">→ {client.nextAction}</p>
                  )}
                  {/* Notes Quick-Preview */}
                  {hasNotes && (
                    <button
                      onClick={e => { e.preventDefault(); toggleNotes(client.id) }}
                      className="w-full text-left mt-1.5 flex items-start gap-1.5 px-1 -mx-1 py-0.5 rounded cursor-pointer hover:bg-midnight/[0.03] transition-colors group"
                    >
                      <StickyNote className="w-3 h-3 text-midnight/25 flex-shrink-0 mt-0.5 group-hover:text-midnight/40 transition-colors" />
                      {notesExpanded ? (
                        <span className="flex-1 text-xs text-midnight/60 whitespace-pre-wrap leading-relaxed">{client.notes}</span>
                      ) : (
                        <span className="flex-1 text-xs text-midnight/45 italic truncate">
                          {client.notes.length > 120 ? client.notes.slice(0, 120) + '…' : client.notes}
                        </span>
                      )}
                      <span className="flex-shrink-0 ml-1 text-midnight/25 group-hover:text-midnight/40 transition-colors">
                        {notesExpanded
                          ? <ChevronUp className="w-3 h-3" />
                          : <ChevronDown className="w-3 h-3" />
                        }
                      </span>
                    </button>
                  )}
                  {client.stage !== 'Closed' && client.stage !== 'Lost' && (
                    <StageTimeline stage={client.stage} stageUpdatedAt={client.stageUpdatedAt} />
                  )}
                </div>

                {/* Right: Quick Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setLogCallClient(client)}
                    className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-midnight/8 transition-colors text-xs text-midnight/50 hover:text-midnight"
                    title="Log Call/Note"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Log</span>
                  </button>
                  <button
                    onClick={() => setLogCallClient(client)}
                    className="sm:hidden p-2 rounded-lg hover:bg-midnight/5 transition-colors"
                    title="Log Call"
                  >
                    <Phone className="w-4 h-4 text-midnight/40" />
                  </button>
                  <Link
                    href={`/workshop/pph/clients/${client.id}?tab=chat`}
                    className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-ocean/8 transition-colors text-xs text-midnight/50 hover:text-ocean"
                    title="Ask PPH-Claw"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask AI</span>
                  </Link>
                  <Link
                    href={`/workshop/pph/clients/${client.id}?tab=chat`}
                    className="sm:hidden p-2 rounded-lg hover:bg-midnight/5 transition-colors"
                    title="Chat with PPH-Claw"
                  >
                    <MessageSquare className="w-4 h-4 text-midnight/40" />
                  </Link>
                  <Link
                    href={`/workshop/pph/purchase-builder?client=${client.id}&name=${encodeURIComponent(client.name)}`}
                    className="p-2 rounded-lg hover:bg-midnight/5 transition-colors"
                    title="Run Scenario"
                  >
                    <FileText className="w-4 h-4 text-midnight/40" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && !loading && clients.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <p className="text-4xl">📋</p>
          <p className="text-midnight/50 font-medium">No clients yet</p>
          <p className="text-midnight/30 text-sm">Hit <strong>New Client</strong> to add your first deal</p>
        </div>
      )}
      {filtered.length === 0 && !loading && clients.length > 0 && (
        <div className="text-center py-12 text-midnight/30 text-sm">
          No results — try clearing your filters
        </div>
      )}

      {/* Add Client Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowAddForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-xl text-midnight mb-4">Add New Client</h2>
            <div className="space-y-3">
              <input
                type="text" placeholder="Client Name *"
                value={newName} onChange={e => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50"
              />
              <div className="grid grid-cols-2 gap-3">
                <select value={newLoanType} onChange={e => setNewLoanType(e.target.value)} className="px-3 py-2 border border-midnight/10 rounded-lg text-sm">
                  <option value="">Loan Type</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Refinance">Refinance</option>
                  <option value="DSCR">DSCR</option>
                  <option value="Other">Other</option>
                </select>
                <select value={newPriority} onChange={e => setNewPriority(e.target.value)} className="px-3 py-2 border border-midnight/10 rounded-lg text-sm">
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={newLo} onChange={e => setNewLo(e.target.value)} className="px-3 py-2 border border-midnight/10 rounded-lg text-sm">
                  {LO_OPTIONS.map(lo => <option key={lo} value={lo}>{lo}</option>)}
                </select>
                <input
                  type="tel" placeholder="Phone"
                  value={newPhone} onChange={e => setNewPhone(e.target.value)}
                  className="px-3 py-2 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50"
                />
              </div>
              <textarea
                placeholder="Notes"
                value={newNotes} onChange={e => setNewNotes(e.target.value)}
                className="w-full px-3 py-2 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50 h-20 resize-none"
              />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2 border border-midnight/10 rounded-lg text-sm hover:bg-midnight/5 transition-colors">Cancel</button>
                <button
                  onClick={addClient}
                  disabled={!newName.trim() || submittingNew}
                  className="flex-1 px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors disabled:opacity-50"
                >
                  {submittingNew ? 'Adding...' : 'Add Client'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Call Modal */}
      {logCallClient && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setLogCallClient(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-xl text-midnight mb-1">Log Contact</h2>
            <p className="text-sm text-midnight/50 mb-4">{logCallClient.name}</p>
            <div className="space-y-3">
              <div className="flex gap-2">
                {['Call', 'Text', 'Email', 'In Person', 'Note'].map(t => (
                  <button
                    key={t}
                    onClick={() => setLogCallType(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      logCallType === t ? 'bg-ocean text-white' : 'bg-midnight/5 text-midnight/60 hover:bg-midnight/10'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Notes about this contact..."
                value={logCallNotes} onChange={e => setLogCallNotes(e.target.value)}
                className="w-full px-3 py-2 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50 h-24 resize-none"
                autoFocus
              />
              <div className="flex gap-3">
                <button onClick={() => setLogCallClient(null)} className="flex-1 px-4 py-2 border border-midnight/10 rounded-lg text-sm hover:bg-midnight/5 transition-colors">Cancel</button>
                <button
                  onClick={logCall}
                  disabled={submittingLog}
                  className="flex-1 px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors disabled:opacity-50"
                >
                  {submittingLog ? 'Saving...' : 'Log Contact'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
