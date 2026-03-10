'use client'

import { useState, useMemo, useEffect, useRef } from 'react'

interface Client {
  id: string
  name: string
  stage: 'New Lead' | 'Pre-Approved' | 'In Process' | 'Waiting' | 'App Sent' | 'Processing' | 'Closing' | 'Closed' | 'Lost'
  priority: 'Hot' | 'Active' | 'Warm' | 'Monitoring'
  loanType: string | null
  loanAmount: number | null
  nextAction: string
  followUpDate: string | null
  lastTouched: string | null
  notes: string
  referralSource: string
}

const STATUS_ORDER: Client['stage'][] = ['New Lead', 'Pre-Approved', 'In Process', 'Waiting', 'App Sent', 'Processing', 'Closing', 'Closed', 'Lost']

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'New Lead': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
  'Pre-Approved': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'In Process': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Waiting': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'App Sent': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  'Processing': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Closing': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Closed': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Lost': { bg: 'bg-red-50', text: 'text-red-400', border: 'border-red-200' },
}

const PRIORITY_COLORS: Record<string, { bg: string; text: string; dot: string; ring: string }> = {
  Hot: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', ring: 'ring-red-200' },
  Active: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', ring: 'ring-orange-200' },
  Warm: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', ring: 'ring-amber-200' },
  Monitoring: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', ring: 'ring-emerald-200' },
}

const LOAN_TYPE_ICONS: Record<string, string> = {
  Purchase: '🏡',
  Refinance: '🔄',
  DSCR: '📊',
  Other: '📋',
}

// ── Empty form state ───────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '',
  stage: 'New Lead' as Client['stage'],
  priority: 'Active' as Client['priority'],
  loanType: '',
  loanAmount: '',
  nextAction: '',
  followUpDate: '',
  referralSource: '',
  notes: '',
}

function getRelativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Never'
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
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getFollowUpColor(dateStr: string | null): string {
  if (!dateStr) return 'text-midnight/40'
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  const diff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return 'text-red-600 font-semibold'
  if (diff === 0) return 'text-amber-600 font-semibold'
  return 'text-emerald-600'
}

function getStageDays(lastTouched: string | null): { days: number; label: string; bgColor: string; textColor: string; title: string } {
  if (!lastTouched) return { days: 0, label: '—', bgColor: 'bg-midnight/5', textColor: 'text-midnight/30', title: 'No activity recorded' }
  const date = new Date(lastTouched)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  const days = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  const label = days === 0 ? 'Today' : `${days}d`
  const bgColor = days <= 5 ? 'bg-emerald-50' : days <= 13 ? 'bg-amber-50' : 'bg-red-50'
  const textColor = days <= 5 ? 'text-emerald-700' : days <= 13 ? 'text-amber-700' : 'text-red-700'
  const title = `In this stage since ${lastTouched}${days > 13 ? ' — consider moving forward' : ''}`
  return { days, label, bgColor, textColor, title }
}

// ── Add Client Modal ──────────────────────────────────────────────────────────

function AddClientModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  // Focus name field when modal opens
  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM)
      setError(null)
      setTimeout(() => nameRef.current?.focus(), 80)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Client name is required.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        stage: form.stage,
        priority: form.priority,
        nextAction: form.nextAction.trim(),
        referralSource: form.referralSource.trim(),
        notes: form.notes.trim(),
        lastTouched: new Date().toISOString().split('T')[0],
      }
      if (form.loanType) payload.loanType = form.loanType
      if (form.loanAmount) payload.loanAmount = parseFloat(form.loanAmount)
      if (form.followUpDate) payload.followUpDate = form.followUpDate

      const res = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create client')
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full bg-white border border-midnight/15 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean transition-colors'
  const labelClass = 'block text-[10px] font-semibold text-midnight/50 uppercase tracking-wider mb-1'

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-midnight/40 z-40 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-paper shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: '#f8f7f4' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-midnight/10">
          <div>
            <h2 className="font-display text-xl text-midnight">Add Client</h2>
            <p className="text-xs text-midnight/40 mt-0.5">Saves directly to Notion</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-midnight/5 hover:bg-midnight/10 transition-colors text-midnight/50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Name */}
          <div>
            <label className={labelClass}>Client Name *</label>
            <input
              ref={nameRef}
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="First Last"
              className={inputClass}
              required
            />
          </div>

          {/* Stage + Priority row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Stage</label>
              <select
                value={form.stage}
                onChange={e => setForm(f => ({ ...f, stage: e.target.value as Client['stage'] }))}
                className={inputClass}
              >
                {STATUS_ORDER.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as Client['priority'] }))}
                className={inputClass}
              >
                {['Hot', 'Active', 'Warm', 'Monitoring'].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Loan Type + Amount row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Loan Type</label>
              <select
                value={form.loanType}
                onChange={e => setForm(f => ({ ...f, loanType: e.target.value }))}
                className={inputClass}
              >
                <option value="">— none —</option>
                {['Purchase', 'Refinance', 'DSCR', 'Other'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Loan Amount ($)</label>
              <input
                type="number"
                value={form.loanAmount}
                onChange={e => setForm(f => ({ ...f, loanAmount: e.target.value }))}
                placeholder="500000"
                className={inputClass}
                min={0}
                step={1000}
              />
            </div>
          </div>

          {/* Next Action */}
          <div>
            <label className={labelClass}>Next Action</label>
            <input
              type="text"
              value={form.nextAction}
              onChange={e => setForm(f => ({ ...f, nextAction: e.target.value }))}
              placeholder="Call re: appraisal status"
              className={inputClass}
            />
          </div>

          {/* Follow Up Date */}
          <div>
            <label className={labelClass}>Follow Up Date</label>
            <input
              type="date"
              value={form.followUpDate}
              onChange={e => setForm(f => ({ ...f, followUpDate: e.target.value }))}
              className={inputClass}
            />
          </div>

          {/* Referral Source */}
          <div>
            <label className={labelClass}>Referral Source</label>
            <input
              type="text"
              value={form.referralSource}
              onChange={e => setForm(f => ({ ...f, referralSource: e.target.value }))}
              placeholder="Susan R. / cold call / Zillow"
              className={inputClass}
            />
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="DSCR — 4-unit in Chula Vista. Waiting on appraisal."
              rows={4}
              className={inputClass + ' resize-none'}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-midnight/10 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-midnight/15 text-sm font-medium text-midnight/60 hover:bg-midnight/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.name.trim()}
            className="flex-1 px-4 py-2.5 rounded-lg bg-ocean text-cream text-sm font-medium hover:bg-ocean/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </>
            ) : (
              'Add to Pipeline →'
            )}
          </button>
        </div>
      </div>
    </>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedClient, setExpandedClient] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [callSheetMode, setCallSheetMode] = useState(false)
  const [editingField, setEditingField] = useState<{ clientId: string; field: 'nextAction' | 'notes' | 'followUpDate'; value: string } | null>(null)
  const [cashNet, setCashNet] = useState<string>('')
  const [editingCashNet, setEditingCashNet] = useState(false)
  const [cashNetDraft, setCashNetDraft] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)
  const [activityLogs, setActivityLogs] = useState<Record<string, { ts: string; text: string }[]>>({})
  const [activityDraft, setActivityDraft] = useState<Record<string, string>>({})

  // Load cash net from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pipeline-cash-net')
    if (saved) setCashNet(saved)
  }, [])

  // Load activity logs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pipeline-activity-logs')
    if (saved) {
      try { setActivityLogs(JSON.parse(saved)) } catch {}
    }
  }, [])

  function addActivityEntry(clientId: string) {
    const text = (activityDraft[clientId] ?? '').trim()
    if (!text) return
    const entry = { ts: new Date().toISOString(), text }
    const updated = { ...activityLogs, [clientId]: [entry, ...(activityLogs[clientId] ?? [])] }
    setActivityLogs(updated)
    localStorage.setItem('pipeline-activity-logs', JSON.stringify(updated))
    setActivityDraft(d => ({ ...d, [clientId]: '' }))
    // Also update lastTouched
    updateClient(clientId, { lastTouched: new Date().toISOString().split('T')[0] })
  }

  function deleteActivityEntry(clientId: string, idx: number) {
    const updated = {
      ...activityLogs,
      [clientId]: (activityLogs[clientId] ?? []).filter((_, i) => i !== idx)
    }
    setActivityLogs(updated)
    localStorage.setItem('pipeline-activity-logs', JSON.stringify(updated))
  }

  function formatActivityTs(ts: string): string {
    const d = new Date(ts)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffH = diffMs / (1000 * 60 * 60)
    if (diffH < 24) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    if (diffH < 168) return d.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: diffH > 8760 ? 'numeric' : undefined })
  }

  // Fetch clients on mount
  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    try {
      setLoading(true)
      const response = await fetch('/api/pipeline')
      if (!response.ok) throw new Error('Failed to fetch clients')
      const data = await response.json()
      setClients(data.clients)
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateClient(id: string, updates: Partial<Client>) {
    try {
      const response = await fetch('/api/pipeline', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
      if (!response.ok) throw new Error('Failed to update client')
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    } catch (error) {
      console.error('Error updating client:', error)
      alert('Failed to update client. Please try again.')
    }
  }

  async function archiveClient(id: string) {
    try {
      const response = await fetch('/api/pipeline', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: id }),
      })
      if (!response.ok) throw new Error('Failed to archive client')
      setClients(prev => prev.filter(c => c.id !== id))
      setExpandedClient(null)
    } catch (error) {
      console.error('Error archiving client:', error)
      alert('Failed to archive client. Please try again.')
    }
  }

  function handleStatusCycle(client: Client) {
    const currentIndex = STATUS_ORDER.indexOf(client.stage)
    const nextIndex = (currentIndex + 1) % STATUS_ORDER.length
    const nextStatus = STATUS_ORDER[nextIndex]
    updateClient(client.id, {
      stage: nextStatus,
      lastTouched: new Date().toISOString().split('T')[0]
    })
  }

  function handleFieldEdit(clientId: string, field: 'nextAction' | 'notes' | 'followUpDate', currentValue: string) {
    setEditingField({ clientId, field, value: currentValue })
  }

  function handleFieldSave() {
    if (!editingField) return
    const { clientId, field, value } = editingField
    updateClient(clientId, {
      [field]: value || null,
      lastTouched: new Date().toISOString().split('T')[0]
    })
    setEditingField(null)
  }

  function handleFieldCancel() {
    setEditingField(null)
  }

  function handleAddSuccess() {
    fetchClients()
    setAddSuccess(true)
    setTimeout(() => setAddSuccess(false), 3000)
  }

  // Activity log CSV export
  function exportActivityLog() {
    const saved = localStorage.getItem('pipeline-activity-logs')
    const logs: Record<string, { ts: string; text: string }[]> = saved ? JSON.parse(saved) : {}
    const clientMap = Object.fromEntries(clients.map(c => [c.id, c]))
    const rows: string[] = []
    const headers = ['Client Name', 'Stage', 'Date', 'Time', 'Entry']
    rows.push(headers.join(','))
    // Sort all entries by timestamp desc
    const allEntries: { clientId: string; ts: string; text: string }[] = []
    for (const [clientId, entries] of Object.entries(logs)) {
      for (const e of entries) allEntries.push({ clientId, ...e })
    }
    allEntries.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    for (const e of allEntries) {
      const c = clientMap[e.clientId]
      const d = new Date(e.ts)
      rows.push([
        c ? c.name : e.clientId,
        c ? c.stage : '',
        d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        e.text,
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    }
    if (allEntries.length === 0) { alert('No activity log entries to export.'); return }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pipeline-activity-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // CSV export
  function exportCSV() {
    const active = clients.filter(c => c.stage !== 'Closed' && c.stage !== 'Lost')
    const headers = ['Name', 'Stage', 'Priority', 'Loan Type', 'Loan Amount', 'Next Action', 'Follow Up Date', 'Last Touched', 'Referral Source', 'Notes']
    const rows = active.map(c => [
      c.name,
      c.stage,
      c.priority,
      c.loanType ?? '',
      c.loanAmount ? `$${c.loanAmount.toLocaleString()}` : '',
      c.nextAction,
      c.followUpDate ?? '',
      c.lastTouched ?? '',
      c.referralSource,
      (c.notes ?? '').replace(/\n/g, ' | '),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pipeline-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Filter clients
  const filteredClients = useMemo(() => {
    let result = clients
    if (callSheetMode) {
      const todayStr = new Date().toISOString().split('T')[0]
      result = result.filter(c =>
        c.stage !== 'Closed' && c.stage !== 'Lost' &&
        c.followUpDate != null && c.followUpDate <= todayStr
      )
      return result.sort((a, b) => {
        const pOrder = { Hot: 0, Active: 1, Warm: 2, Monitoring: 3 }
        return (pOrder[a.priority] ?? 9) - (pOrder[b.priority] ?? 9)
      })
    }
    if (filterStatus !== 'all') result = result.filter(c => c.stage === filterStatus)
    if (filterPriority !== 'all') result = result.filter(c => c.priority === filterPriority)
    return result
  }, [clients, filterStatus, filterPriority, callSheetMode])

  // Group by status
  const groupedClients = useMemo(() => {
    return filteredClients.reduce<Record<string, Client[]>>((acc, client) => {
      if (!acc[client.stage]) acc[client.stage] = []
      acc[client.stage].push(client)
      return acc
    }, {})
  }, [filteredClients])

  // Stats
  const stats = useMemo(() => {
    const hot = clients.filter(c => c.priority === 'Hot' && c.stage !== 'Closed' && c.stage !== 'Lost').length
    const active = clients.filter(c => c.stage !== 'Closed' && c.stage !== 'Lost').length
    const waiting = clients.filter(c => c.stage === 'Waiting').length
    return { hot, active, waiting }
  }, [clients])

  function ArchiveButton({ clientName, onConfirm }: { clientName: string; onConfirm: () => void }) {
    const [confirming, setConfirming] = useState(false)
    if (confirming) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-xs text-midnight/60">Archive {clientName}?</span>
          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
          >
            Yes, archive
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="px-3 py-1 bg-midnight/10 text-midnight rounded-lg text-xs font-medium hover:bg-midnight/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      )
    }
    return (
      <button
        onClick={() => setConfirming(true)}
        className="flex items-center gap-1.5 text-xs text-midnight/30 hover:text-red-500 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8m-9 4v6m4-6v6" />
        </svg>
        Archive client
      </button>
    )
  }

  const ClientCard = ({ client }: { client: Client }) => {
    const isExpanded = expandedClient === client.id
    const statusStyle = STATUS_COLORS[client.stage]
    const priorityStyle = PRIORITY_COLORS[client.priority]
    const daysSinceUpdate = client.lastTouched
      ? Math.floor((new Date().getTime() - new Date(client.lastTouched).getTime()) / (1000 * 60 * 60 * 24))
      : 999
    const isStale = daysSinceUpdate > 7
    const [priorityOpen, setPriorityOpen] = useState(false)

    const isEditingNextAction = editingField?.clientId === client.id && editingField.field === 'nextAction'
    const isEditingNotes = editingField?.clientId === client.id && editingField.field === 'notes'

    const PRIORITIES: Client['priority'][] = ['Hot', 'Active', 'Warm', 'Monitoring']

    function handlePriorityChange(newPriority: Client['priority']) {
      setPriorityOpen(false)
      if (newPriority === client.priority) return
      updateClient(client.id, {
        priority: newPriority,
        lastTouched: new Date().toISOString().split('T')[0],
      })
    }

    return (
      <div className={`bg-cream rounded-xl border-2 ${statusStyle.border} hover:shadow-md transition-all`}>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display text-lg font-bold text-midnight truncate">{client.name}</h3>

                {/* Priority badge — tap to change */}
                <div className="relative">
                  <button
                    onClick={() => setPriorityOpen(o => !o)}
                    title="Tap to change priority"
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityStyle.bg} ${priorityStyle.text} ring-1 ${priorityStyle.ring} hover:opacity-80 transition-opacity`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
                    {client.priority}
                    <svg className={`w-2.5 h-2.5 ml-0.5 transition-transform ${priorityOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown picker */}
                  {priorityOpen && (
                    <>
                      {/* Backdrop */}
                      <div className="fixed inset-0 z-10" onClick={() => setPriorityOpen(false)} />
                      <div className="absolute left-0 top-full mt-1 z-20 bg-white rounded-xl shadow-xl border border-midnight/10 p-1.5 flex flex-col gap-0.5 min-w-[130px]">
                        {PRIORITIES.map(p => {
                          const ps = PRIORITY_COLORS[p]
                          const isActive = p === client.priority
                          return (
                            <button
                              key={p}
                              onClick={() => handlePriorityChange(p)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                                isActive
                                  ? `${ps.bg} ${ps.text}`
                                  : 'text-midnight/70 hover:bg-midnight/5'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 ${ps.dot}`} />
                              {p}
                              {isActive && (
                                <svg className="w-3 h-3 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleStatusCycle(client)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${statusStyle.bg} ${statusStyle.text} hover:opacity-80 transition-opacity cursor-pointer`}
                  title="Click to cycle status"
                >
                  {client.stage}
                </button>
                {/* Stage timer badge */}
                {(() => {
                  const { label, bgColor, textColor, title } = getStageDays(client.lastTouched)
                  return (
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${bgColor} ${textColor}`}
                      title={title}
                    >
                      <svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {label}
                    </span>
                  )
                })()}
                {client.loanType && (
                  <span className="inline-flex items-center gap-1 text-xs text-midnight/60">
                    {LOAN_TYPE_ICONS[client.loanType] || '📋'} {client.loanType}
                  </span>
                )}
                {client.loanAmount && (
                  <span className="inline-flex items-center gap-1 text-xs text-midnight/60">
                    💰 ${client.loanAmount.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setExpandedClient(isExpanded ? null : client.id)}
              className="text-midnight/30 hover:text-midnight/60 transition-colors shrink-0"
            >
              <svg
                className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Next Action - Inline Editable */}
          <div className="mb-3">
            <div className="text-[10px] uppercase tracking-wider text-midnight/40 mb-1">Next Action</div>
            {isEditingNextAction ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingField.value}
                  onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                  onBlur={handleFieldSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFieldSave()
                    if (e.key === 'Escape') handleFieldCancel()
                  }}
                  className="w-full bg-white border border-ocean rounded px-2 py-1 text-sm text-midnight focus:outline-none focus:ring-1 focus:ring-ocean"
                  autoFocus
                />
                <div className="text-[10px] text-midnight/40">Press Enter to save, Esc to cancel</div>
              </div>
            ) : (
              <div
                onClick={() => handleFieldEdit(client.id, 'nextAction', client.nextAction)}
                className="flex items-start gap-2 cursor-text hover:bg-midnight/5 rounded p-1 -m-1 transition-colors"
              >
                <span className="text-ocean mt-0.5">→</span>
                <span className="text-sm font-medium text-midnight flex-1">{client.nextAction || 'Click to add...'}</span>
              </div>
            )}
          </div>

          {/* Follow Up Date — Inline Editable */}
          <div className="mb-3">
            <div className="text-[10px] uppercase tracking-wider text-midnight/40 mb-1">Follow Up</div>
            {editingField?.clientId === client.id && editingField.field === 'followUpDate' ? (
              <div className="space-y-1">
                <input
                  type="date"
                  value={editingField.value}
                  onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                  onBlur={handleFieldSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFieldSave()
                    if (e.key === 'Escape') handleFieldCancel()
                  }}
                  className="bg-white border border-ocean rounded px-2 py-1 text-sm text-midnight focus:outline-none focus:ring-1 focus:ring-ocean"
                  autoFocus
                />
                <div className="text-[10px] text-midnight/40">Press Enter to save, Esc to cancel</div>
              </div>
            ) : (
              <button
                onClick={() => handleFieldEdit(client.id, 'followUpDate', client.followUpDate ?? '')}
                className="flex items-center gap-1.5 hover:bg-midnight/5 rounded p-1 -m-1 transition-colors text-left"
                title="Click to change follow-up date"
              >
                {client.followUpDate ? (
                  <span className={`text-sm font-medium ${getFollowUpColor(client.followUpDate)}`}>
                    📅 {getRelativeTime(client.followUpDate)}
                    {new Date(client.followUpDate) < new Date() && ' (OVERDUE)'}
                  </span>
                ) : (
                  <span className="text-sm text-midnight/30 italic">📅 Set date…</span>
                )}
              </button>
            )}
          </div>

          {/* Referral Source */}
          {client.referralSource && (
            <div className="mb-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-midnight/5 rounded text-xs text-midnight/70">
                👤 {client.referralSource}
              </span>
            </div>
          )}

          {/* Last Touched */}
          <div className={`flex items-center gap-1.5 text-[11px] ${isStale ? 'text-amber-600' : 'text-midnight/40'}`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last touched {getRelativeTime(client.lastTouched)}
            {isStale && ' ⚠️'}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="overflow-hidden border-t-2 border-midnight/5">
            <div className="p-4 space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-midnight/40 mb-2">Notes</div>
                {isEditingNotes ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingField.value}
                      onChange={(e) => setEditingField({ ...editingField, value: e.target.value })}
                      onBlur={handleFieldSave}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') handleFieldCancel()
                      }}
                      className="w-full bg-white border border-ocean rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:ring-1 focus:ring-ocean resize-none"
                      rows={5}
                      autoFocus
                    />
                    <div className="text-[10px] text-midnight/40">Click outside to save, Esc to cancel</div>
                  </div>
                ) : (
                  <div
                    onClick={() => handleFieldEdit(client.id, 'notes', client.notes)}
                    className="bg-midnight/5 rounded-lg p-3 cursor-text hover:bg-midnight/10 transition-colors"
                  >
                    <pre className="text-sm text-midnight/80 whitespace-pre-wrap font-body leading-relaxed">
                      {client.notes || 'Click to add notes...'}
                    </pre>
                  </div>
                )}
              </div>

              {/* Activity Log */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-midnight/40 mb-2">Activity Log</div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={activityDraft[client.id] ?? ''}
                    onChange={e => setActivityDraft(d => ({ ...d, [client.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addActivityEntry(client.id) } }}
                    placeholder="Log a touch, call, email… (Enter to save)"
                    className="flex-1 bg-midnight/5 border border-midnight/10 rounded-lg px-3 py-1.5 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:ring-1 focus:ring-ocean focus:border-ocean"
                  />
                  <button
                    onClick={() => addActivityEntry(client.id)}
                    className="px-3 py-1.5 bg-midnight text-cream rounded-lg text-sm font-medium hover:bg-ocean transition-colors"
                  >
                    Log
                  </button>
                </div>
                {(activityLogs[client.id] ?? []).length === 0 ? (
                  <p className="text-xs text-midnight/25 italic">No activity logged yet.</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {(activityLogs[client.id] ?? []).map((entry, idx) => (
                      <div key={idx} className="flex items-start gap-2 group">
                        <span className="text-[10px] text-midnight/35 mt-0.5 whitespace-nowrap shrink-0 w-20 text-right">
                          {formatActivityTs(entry.ts)}
                        </span>
                        <span className="text-sm text-midnight/80 leading-snug flex-1">{entry.text}</span>
                        <button
                          onClick={() => deleteActivityEntry(client.id, idx)}
                          className="opacity-0 group-hover:opacity-100 text-midnight/25 hover:text-red-400 transition-all text-xs shrink-0 mt-0.5"
                          title="Remove"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Archive / Remove */}
              <div className="pt-2 border-t border-midnight/5">
                <ArchiveButton clientName={client.name} onConfirm={() => archiveClient(client.id)} />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-ocean/20 rounded-full mx-auto mb-4"></div>
          <p className="text-midnight/50">Loading pipeline...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Add Client Modal */}
      <AddClientModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <div className="max-w-6xl mx-auto pb-24">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="font-display text-3xl text-midnight mb-1">Client Pipeline</h1>
            <p className="text-midnight/50 text-sm">Mortgage client tracker — who needs what, when</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {addSuccess && (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 text-xs font-medium bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Client added!
              </span>
            )}
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-ocean text-cream rounded-xl text-sm font-medium hover:bg-ocean/90 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Client
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-4 text-white">
            <div className="text-3xl font-display font-bold">{stats.hot}</div>
            <div className="text-sm text-white/80">🔥 Hot Deals</div>
          </div>
          <div className="bg-gradient-to-br from-ocean to-cyan rounded-xl p-4 text-white">
            <div className="text-3xl font-display font-bold">{stats.active}</div>
            <div className="text-sm text-white/80">📊 Active Clients</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
            <div className="text-3xl font-display font-bold">{stats.waiting}</div>
            <div className="text-sm text-white/80">⏳ Waiting</div>
          </div>
          <div
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white cursor-pointer"
            onClick={() => { setEditingCashNet(true); setCashNetDraft(cashNet) }}
          >
            {editingCashNet ? (
              <input
                autoFocus
                type="text"
                inputMode="decimal"
                value={cashNetDraft}
                onChange={e => setCashNetDraft(e.target.value)}
                onBlur={() => {
                  setCashNet(cashNetDraft)
                  localStorage.setItem('pipeline-cash-net', cashNetDraft)
                  setEditingCashNet(false)
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setCashNet(cashNetDraft)
                    localStorage.setItem('pipeline-cash-net', cashNetDraft)
                    setEditingCashNet(false)
                  }
                  if (e.key === 'Escape') setEditingCashNet(false)
                }}
                className="w-full bg-white/20 text-white text-3xl font-display font-bold rounded-md px-1 outline-none placeholder-white/50"
                placeholder="$0"
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <div className="text-3xl font-display font-bold">
                {cashNet ? (cashNet.startsWith('$') ? cashNet : `$${cashNet}`) : '—'}
              </div>
            )}
            <div className="text-sm text-white/80">💵 Cash Net</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  filterStatus === 'all'
                    ? 'bg-midnight text-cream'
                    : 'bg-cream text-midnight/60 hover:bg-midnight/5 border border-midnight/10'
                }`}
              >
                All Statuses ({clients.length})
              </button>
              {STATUS_ORDER.map(status => {
                const count = clients.filter(c => c.stage === status).length
                const style = STATUS_COLORS[status]
                return (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      filterStatus === status
                        ? `${style.bg} ${style.text} ring-1 ring-current/20`
                        : 'bg-cream text-midnight/60 hover:bg-midnight/5 border border-midnight/10'
                    }`}
                  >
                    {status} ({count})
                  </button>
                )
              })}
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              {['all', 'Hot', 'Active', 'Warm', 'Monitoring'].map(priority => {
                const statusFilteredClients = filterStatus !== 'all'
                  ? clients.filter(c => c.stage === filterStatus)
                  : clients
                const count = priority === 'all'
                  ? statusFilteredClients.length
                  : statusFilteredClients.filter(c => c.priority === priority).length
                const style = priority !== 'all' ? PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] : null

                return (
                  <button
                    key={priority}
                    onClick={() => setFilterPriority(priority)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      filterPriority === priority
                        ? style ? `${style.bg} ${style.text}` : 'bg-midnight text-cream'
                        : 'bg-cream text-midnight/60 hover:bg-midnight/5 border border-midnight/10'
                    }`}
                  >
                    {style && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
                    {priority === 'all' ? 'All' : priority} ({count})
                  </button>
                )
              })}
            </div>

            {/* View Mode Toggle + Actions */}
            <div className="ml-auto flex items-center gap-2">
              {/* Today's Calls */}
              <button
                onClick={() => setCallSheetMode(m => !m)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  callSheetMode
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'bg-cream text-midnight/60 hover:bg-midnight/5 border border-midnight/10'
                }`}
                title="Show only clients with follow-up due today or overdue"
              >
                📞 {callSheetMode ? `Calls Due (${filteredClients.length})` : 'Calls Due'}
              </button>

              {/* CSV Export */}
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cream text-midnight/60 hover:bg-midnight/5 border border-midnight/10 transition-colors"
                title="Export active pipeline to CSV"
              >
                ⬇️ Pipeline
              </button>
              <button
                onClick={exportActivityLog}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cream text-midnight/60 hover:bg-midnight/5 border border-midnight/10 transition-colors"
                title="Export full activity log to CSV"
              >
                ⬇️ Activity
              </button>

              <div className="w-px h-5 bg-midnight/10" />

              <button
                onClick={() => { setViewMode('list'); setCallSheetMode(false) }}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' && !callSheetMode ? 'bg-ocean text-white' : 'bg-cream text-midnight/40 hover:text-midnight'
                }`}
                title="List view"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => { setViewMode('kanban'); setCallSheetMode(false) }}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'kanban' && !callSheetMode ? 'bg-ocean text-white' : 'bg-cream text-midnight/40 hover:text-midnight'
                }`}
                title="Kanban view"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4H5a2 2 0 00-2 2v14a2 2 0 002 2h4m0-18v18m0-18l6 0m-6 0v18m6-18h4a2 2 0 012 2v14a2 2 0 01-2 2h-4m0-18v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Clients Display */}
        {viewMode === 'list' || callSheetMode ? (
          <div className="space-y-6">
            {/* Call Sheet Mode — flat list sorted by priority */}
            {callSheetMode ? (
              <>
                <div className="flex items-center gap-3 pb-2 border-b-2 border-red-200">
                  <span className="text-red-500 font-display font-bold text-lg">📞 Today&apos;s Calls</span>
                  <span className="text-sm text-midnight/50">{filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} need contact</span>
                </div>
                {filteredClients.length === 0 ? (
                  <div className="text-center py-12 text-midnight/40">
                    <div className="text-4xl mb-3">✅</div>
                    <div className="font-medium">No follow-ups due today</div>
                    <div className="text-sm mt-1">You&apos;re all caught up!</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredClients.map(client => (
                      <ClientCard key={client.id} client={client} />
                    ))}
                  </div>
                )}
              </>
            ) : (
            /* Normal grouped list */
            <>
            {STATUS_ORDER.map(status => {
              const group = groupedClients[status]
              if (!group || group.length === 0) return null
              const statusStyle = STATUS_COLORS[status]
              return (
                <div key={status}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                      {status}
                    </span>
                    <span className="text-sm text-midnight/40">{group.length} client{group.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-3">
                    {group.map(client => (
                      <ClientCard key={client.id} client={client} />
                    ))}
                  </div>
                </div>
              )
            })}
            </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {STATUS_ORDER.slice(0, 5).map(status => {
              const group = groupedClients[status] || []
              const statusStyle = STATUS_COLORS[status]
              return (
                <div key={status} className="bg-midnight/5 rounded-xl p-4 min-h-[400px]">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium mb-4 ${statusStyle.bg} ${statusStyle.text}`}>
                    {status}
                    <span className="ml-1 opacity-60">({group.length})</span>
                  </div>
                  <div className="space-y-3">
                    {group.map(client => (
                      <ClientCard key={client.id} client={client} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty State — only show in normal mode */}
        {filteredClients.length === 0 && !loading && !callSheetMode && (
          <div className="bg-cream rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <h2 className="font-display text-xl text-midnight mb-2">No clients found</h2>
            <p className="text-midnight/50 text-sm mb-6">
              {clients.length === 0 ? 'Add your first client to get started.' : 'Try adjusting your filters'}
            </p>
            {clients.length === 0 && (
              <button
                onClick={() => setAddModalOpen(true)}
                className="px-6 py-3 bg-ocean text-cream rounded-xl font-medium hover:bg-ocean/90 transition-colors"
              >
                Add First Client
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
