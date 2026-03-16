'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PPHNav } from '../../_components/PPHNav'
import {
  ArrowLeft, Phone, MessageSquare, FileText, Save, Send,
  Plus, User, Calendar, Clock, Edit3, Check, X, RefreshCw, Paperclip, Zap, Settings2
} from 'lucide-react'

interface ReoProperty {
  id: string
  address: string
  propertyType: string
  status: string
  marketValue: number | null
  mortgageBalance: number | null
  monthlyPayment: number | null
  lender: string
  estimatedRent: number | null
  vacancyRate: number
  taxesInsurance: number | null
  hoaDues: number | null
}

interface Liability {
  id: string
  type: 'auto' | 'student' | 'credit_card' | 'installment' | 'other'
  description: string
  balance: number | null
  monthlyPayment: number
}

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
  referralDate: string | null
  referralType: string | null
  primaryLo: string | null
  primaryContact: string | null
  phone: string | null
  // Borrowers
  married: boolean
  b1Name: string | null
  b1IncomeType: string | null
  b1MonthlyIncome: number | null
  b2Name: string | null
  b2IncomeType: string | null
  b2MonthlyIncome: number | null
  // Income details (structured sub-fields)
  b1IncomeDetails: Record<string, number | string | null>
  b2IncomeDetails: Record<string, number | string | null>
  // Assets
  b1Assets: number | null
  b1AssetsNotes: string | null
  b2Assets: number | null
  b2AssetsNotes: string | null
  // Liabilities
  liabilities: Liability[]
  // REO
  reo: ReoProperty[]
  // Deal basics
  targetPurchasePrice: number | null
  ficoScore: number | null
  targetArea: string | null
  // AI summary
  aiSummary: string | null
  aiSummaryUpdatedAt: string | null
}

interface CallLog {
  id: string
  notion_client_id: string
  client_name: string
  logged_by_email: string
  call_type: string
  notes: string
  created_at: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ClientScenario {
  slug: string
  clientName: string
  type: string
  createdAt: string
  publicUrl: string
}

const INCOME_TYPES = ['W2', 'SE/Self-Employed', '1099', 'Rental', 'Retired/SSA', 'Pension', 'Other']
const PROPERTY_TYPES = ['SFR', 'Condo', '2-Unit', '3-Unit', '4-Unit', 'Commercial', 'Land']
const PROPERTY_STATUSES = ['Primary', 'Rental', 'Vacation/Second', 'Pending Sale', 'Vacant']
const STAGES = ['New Lead', 'Pre-Approved', 'In Process', 'Waiting', 'App Sent', 'Processing', 'Closing', 'Funded', 'Closed', 'Lost']
const PRIORITIES = ['Hot', 'Active', 'Warm', 'Monitoring']
const STAGE_COLORS: Record<string, string> = {
  'New Lead': 'bg-slate-100 text-slate-700',
  'Pre-Approved': 'bg-blue-100 text-blue-700',
  'In Process': 'bg-purple-100 text-purple-700',
  'Waiting': 'bg-amber-100 text-amber-700',
  'App Sent': 'bg-cyan-100 text-cyan-700',
  'Processing': 'bg-indigo-100 text-indigo-700',
  'Closing': 'bg-emerald-100 text-emerald-700',
  'Funded': 'bg-green-100 text-green-700',
  'Closed': 'bg-green-100 text-green-700',
  'Lost': 'bg-red-100 text-red-400',
}
const LO_OPTIONS = ['Kyle', 'Jim', 'Anthony']
const CALL_TYPES = ['Call', 'Text', 'Email', 'In Person', 'Note']

const TABS = [
  { id: 'overview',  label: 'Overview',  icon: '🏠' },
  { id: 'calls',     label: 'Activity',  icon: '📞' },
  { id: 'scenarios', label: 'Scenarios', icon: '📊' },
  { id: 'chat',      label: 'PPH-Claw',  icon: '🤖' },
] as const
type Tab = typeof TABS[number]['id']

// ── Module-level components (NOT inside the page fn) to prevent remount on re-render ──

// ── Liability add button + inline form ───────────────────────────────────────
function LiabilityAddButton({
  types,
  onAdd,
}: {
  types: { value: Liability['type']; label: string }[]
  onAdd: (entry: Omit<Liability, 'id'>) => void
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<{
    type: Liability['type']
    description: string
    balance: string
    monthlyPayment: string
  }>({ type: 'auto', description: '', balance: '', monthlyPayment: '' })

  function submit() {
    const payment = parseFloat(form.monthlyPayment)
    if (!payment) return
    onAdd({
      type: form.type,
      description: form.description.trim(),
      balance: parseFloat(form.balance) || null,
      monthlyPayment: payment,
    })
    setForm({ type: 'auto', description: '', balance: '', monthlyPayment: '' })
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-midnight text-cream rounded-lg text-xs font-medium hover:bg-midnight/80 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Add Debt
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-midnight/40 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-3" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-midnight">Add Monthly Debt</p>
          <button onClick={() => setOpen(false)} className="text-midnight/30 hover:text-midnight"><X className="w-4 h-4" /></button>
        </div>
        <div>
          <label className="text-xs text-midnight/40 block mb-1">Type</label>
          <select
            value={form.type}
            onChange={e => setForm(p => ({ ...p, type: e.target.value as Liability['type'] }))}
            className="w-full px-3 py-2 border border-midnight/10 rounded-lg text-sm focus:outline-none"
          >
            {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-midnight/40 block mb-1">Description (optional)</label>
          <input
            type="text"
            placeholder="e.g. Honda Civic, Chase Visa…"
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="w-full px-3 py-2 border border-midnight/10 rounded-lg text-sm focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-midnight/40 block mb-1">Outstanding Balance ($)</label>
            <input
              type="number"
              placeholder="0"
              value={form.balance}
              onChange={e => setForm(p => ({ ...p, balance: e.target.value }))}
              className="w-full px-3 py-2 border border-midnight/10 rounded-lg text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-midnight/40 block mb-1">Monthly Payment ($) *</label>
            <input
              type="number"
              placeholder="0"
              value={form.monthlyPayment}
              onChange={e => setForm(p => ({ ...p, monthlyPayment: e.target.value }))}
              className="w-full px-3 py-2 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') submit() }}
            />
          </div>
        </div>
        <button
          onClick={submit}
          disabled={!form.monthlyPayment}
          className="w-full py-2.5 bg-midnight text-cream rounded-xl text-sm font-semibold hover:bg-midnight/80 transition-colors disabled:opacity-40"
        >
          Add Debt
        </button>
      </div>
    </div>
  )
}

// FieldInput — defined outside page component so it never remounts on parent re-render
// Manages local state, saves on blur or Enter only
function FieldInput({ value, onSave, type = 'text', placeholder, prefix, className = '' }: {
  value: string | number | null
  onSave: (v: string) => void
  type?: string
  placeholder?: string
  prefix?: string
  className?: string
}) {
  const [local, setLocal] = React.useState(String(value ?? ''))
  React.useEffect(() => { setLocal(String(value ?? '')) }, [value])
  return (
    <div className={`flex items-center gap-1 ${prefix ? '' : ''}`}>
      {prefix && <span className="text-xs text-midnight/40">{prefix}</span>}
      <input
        type={type}
        value={local}
        placeholder={placeholder}
        onChange={e => setLocal(e.target.value)}
        onBlur={() => onSave(local)}
        onKeyDown={e => { if (e.key === 'Enter') { e.currentTarget.blur() } }}
        className={`px-2 py-1.5 bg-white border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50 ${className}`}
      />
    </div>
  )
}

function EditableSelect({ field, value, options, label, onChange }: {
  field: string; value: string | null; options: string[]; label: string
  onChange: (field: string, value: string) => void
}) {
  return (
    <div>
      <span className="text-xs text-midnight/40 block mb-0.5">{label}</span>
      <select
        value={value || ''}
        onChange={e => onChange(field, e.target.value)}
        className="px-2 py-1 bg-cream border border-midnight/10 rounded text-sm w-full focus:outline-none focus:border-ocean/50"
      >
        <option value="">—</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function EditableText({ field, value, label, editingField, editValue, saving, onStartEdit, onSave, onCancel, onEditChange }: {
  field: string; value: string | null; label: string
  editingField: string | null; editValue: string; saving: boolean
  onStartEdit: (field: string, value: string) => void
  onSave: (field: string, value: string) => void
  onCancel: () => void
  onEditChange: (v: string) => void
}) {
  if (editingField === field) {
    return (
      <div>
        <span className="text-xs text-midnight/40 block mb-0.5">{label}</span>
        <div className="flex items-center gap-1">
          <input
            type={field === 'followUpDate' ? 'date' : 'text'}
            value={editValue}
            onChange={e => onEditChange(e.target.value)}
            className="flex-1 px-2 py-1 bg-cream border border-ocean/50 rounded text-sm focus:outline-none"
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') onSave(field, editValue); if (e.key === 'Escape') onCancel() }}
          />
          <button onClick={() => onSave(field, editValue)} className="p-1 text-ocean hover:bg-ocean/10 rounded" disabled={saving}>
            <Check className="w-3.5 h-3.5" />
          </button>
          <button onClick={onCancel} className="p-1 text-midnight/30 hover:bg-midnight/5 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="cursor-pointer group" onClick={() => onStartEdit(field, value || '')}>
      <span className="text-xs text-midnight/40 block mb-0.5">{label}</span>
      <span className="text-sm text-midnight flex items-center gap-1">
        {value || <span className="text-midnight/20">—</span>}
        <Edit3 className="w-3 h-3 text-midnight/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </span>
    </div>
  )
}

export default function ClientProfilePage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') as Tab) || 'overview'

  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>(initialTab)
  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [loadingCalls, setLoadingCalls] = useState(false)
  const [scenarios, setScenarios] = useState<ClientScenario[]>([])
  const [loadingScenarios, setLoadingScenarios] = useState(false)
  const [interactiveSnapshots, setInteractiveSnapshots] = useState<{ id: string; data: Record<string, number>; note: string; at: string }[]>([])
  const [interactiveViewCount, setInteractiveViewCount] = useState<number | null>(null)

  // Edit states
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)

  // Log call
  const [logType, setLogType] = useState('Call')
  const [logNotes, setLogNotes] = useState('')
  const [submittingLog, setSubmittingLog] = useState(false)

  // AI summary
  const [generatingSummary, setGeneratingSummary] = useState(false)

  // Chat layout
  const [showHistory, setShowHistory] = useState(false)

  async function refreshSummary() {
    if (!client) return
    setGeneratingSummary(true)
    try {
      const res = await fetch('/api/pph/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: client.id }),
      })
      if (res.ok) {
        const { summary } = await res.json()
        setClient(prev => prev ? { ...prev, aiSummary: summary, aiSummaryUpdatedAt: new Date().toISOString() } : prev)
      }
    } finally {
      setGeneratingSummary(false)
    }
  }

  // REO
  const [showReoForm, setShowReoForm] = useState(false)
  const [reoForm, setReoForm] = useState<Partial<ReoProperty>>({
    address: '', propertyType: 'SFR', status: 'rental',
    marketValue: null, mortgageBalance: null, monthlyPayment: null, lender: '',
    estimatedRent: null, vacancyRate: 5, taxesInsurance: null, hoaDues: null,
  })

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatHistoryLoading, setChatHistoryLoading] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<{ dataUrl: string; name: string; mimeType: string }[]>([])
  const [scenarioMode, setScenarioMode] = useState<'none' | 'quick' | 'custom'>('none')
  const [pendingScenario, setPendingScenario] = useState<Record<string, unknown> | null>(null)
  const [savingScenario, setSavingScenario] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchClient() }, [id])
  useEffect(() => { if (tab === 'calls') fetchCalls() }, [tab, id])
  const JH_CLIENT_ID = '77e3ef8a-fe47-44c9-8c78-c45552463818'

  useEffect(() => {
    if (tab === 'scenarios') {
      fetchScenarios()
      if (id === JH_CLIENT_ID) fetchInteractiveEvents('jh-domenech')
    }
  }, [tab, id])
  useEffect(() => { if (tab === 'chat' && id) fetchChatHistory() }, [tab, id])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])

  function mapRow(row: Record<string, unknown>): Client {
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
      referralDate: (row.referral_date as string) || null,
      referralType: (row.referral_type as string) || null,
      primaryLo: (row.primary_lo as string) || null,
      primaryContact: (row.primary_contact as string) || null,
      phone: (row.phone as string) || null,
      married: !!(row.married),
      b1Name: (row.b1_name as string) || null,
      b1IncomeType: (row.b1_income_type as string) || null,
      b1MonthlyIncome: (row.b1_monthly_income as number) || null,
      b2Name: (row.b2_name as string) || null,
      b2IncomeType: (row.b2_income_type as string) || null,
      b2MonthlyIncome: (row.b2_monthly_income as number) || null,
      b1IncomeDetails: (row.b1_income_details as Record<string, number | string | null>) || {},
      b2IncomeDetails: (row.b2_income_details as Record<string, number | string | null>) || {},
      b1Assets: (row.b1_assets as number) || null,
      b1AssetsNotes: (row.b1_assets_notes as string) || null,
      b2Assets: (row.b2_assets as number) || null,
      b2AssetsNotes: (row.b2_assets_notes as string) || null,
      liabilities: (row.liabilities as Liability[]) || [],
      reo: (row.reo as ReoProperty[]) || [],
      targetPurchasePrice: (row.target_purchase_price as number) || null,
      ficoScore: (row.fico_score as number) || null,
      targetArea: (row.target_area as string) || null,
      aiSummary: (row.ai_summary as string) || null,
      aiSummaryUpdatedAt: (row.ai_summary_updated_at as string) || null,
    }
  }

  async function fetchClient() {
    try {
      const res = await fetch(`/api/pph/clients/${id}`)
      if (!res.ok) throw new Error('Failed')
      const row = await res.json()
      setClient(mapRow(row))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchInteractiveEvents(pageKey: string) {
    const res = await fetch(`/api/scenario-events?pageKey=${pageKey}`)
    if (res.ok) {
      const d = await res.json()
      setInteractiveSnapshots(d.snapshots || [])
      setInteractiveViewCount(d.viewCount ?? null)
    }
  }

  async function fetchScenarios() {
    try {
      setLoadingScenarios(true)
      const res = await fetch(`/api/pph/scenarios?clientId=${id}`)
      if (res.ok) setScenarios(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingScenarios(false)
    }
  }

  async function fetchChatHistory() {
    try {
      setChatHistoryLoading(true)
      const res = await fetch(`/api/pph/chat-messages?clientId=${id}`)
      if (res.ok) {
        const rows = await res.json()
        setChatMessages(rows.map((r: { role: string; content: string }) => ({
          role: r.role as 'user' | 'assistant',
          content: r.content,
        })))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setChatHistoryLoading(false)
    }
  }

  async function clearChatHistory() {
    await fetch(`/api/pph/chat-messages?clientId=${id}`, { method: 'DELETE' })
    setChatMessages([])
  }

  async function fetchCalls() {
    try {
      setLoadingCalls(true)
      const res = await fetch(`/api/pph/calls?clientId=${id}`)
      if (res.ok) setCallLogs(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingCalls(false)
    }
  }

  async function saveField(field: string, value: string) {
    if (!client) return
    setSaving(true)
    try {
      const body: Record<string, string> = { id: client.id }
      body[field] = value
      const res = await fetch('/api/pph/clients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setClient(prev => prev ? { ...prev, [field]: value } : prev)
        setEditingField(null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function saveClientFields(fields: Record<string, unknown>) {
    if (!client) return
    const res = await fetch('/api/pph/clients', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: client.id, ...fields }),
    })
    if (res.ok) {
      const updated = await res.json()
      setClient(mapRow(updated))
    }
  }

  async function addReo() {
    if (!client || !reoForm.address?.trim()) return
    const newReo: ReoProperty = {
      id: `reo-${Date.now()}`,
      address: reoForm.address || '',
      propertyType: reoForm.propertyType || 'SFR',
      status: reoForm.status || 'rental',
      marketValue: reoForm.marketValue || null,
      mortgageBalance: reoForm.mortgageBalance || null,
      monthlyPayment: reoForm.monthlyPayment || null,
      lender: reoForm.lender || '',
      estimatedRent: reoForm.estimatedRent || null,
      vacancyRate: reoForm.vacancyRate ?? 5,
      taxesInsurance: reoForm.taxesInsurance || null,
      hoaDues: reoForm.hoaDues || null,
    }
    const updatedReo = [...client.reo, newReo]
    await saveClientFields({ reo: JSON.stringify(updatedReo) })
    setShowReoForm(false)
    setReoForm({ address: '', propertyType: 'SFR', status: 'rental', marketValue: null, mortgageBalance: null, monthlyPayment: null, lender: '', estimatedRent: null, vacancyRate: 5, taxesInsurance: null, hoaDues: null })
  }

  async function removeReo(reoId: string) {
    if (!client) return
    const updatedReo = client.reo.filter(r => r.id !== reoId)
    await saveClientFields({ reo: JSON.stringify(updatedReo) })
  }

  async function logCall() {
    if (!client) return
    setSubmittingLog(true)
    try {
      await fetch('/api/pph/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          clientName: client.name,
          callType: logType,
          notes: logNotes,
        }),
      })
      await fetch('/api/pph/clients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: client.id, lastTouched: new Date().toISOString().split('T')[0] }),
      })
      setLogNotes('')
      setLogType('Call')
      fetchCalls()
      fetchClient()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmittingLog(false)
    }
  }

  function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  function handleChatPaste(e: React.ClipboardEvent) {
    const items = e.clipboardData?.items
    if (!items) return
    const imageItems = Array.from(items).filter(i => i.type.startsWith('image/'))
    if (!imageItems.length) return
    e.preventDefault()
    Promise.all(
      imageItems.map(async item => {
        const file = item.getAsFile()
        if (!file) return null
        const dataUrl = await readFileAsDataUrl(file)
        return { dataUrl, name: `paste-${Date.now()}.png`, mimeType: item.type }
      })
    ).then(results => {
      const valid = results.filter(Boolean) as { dataUrl: string; name: string; mimeType: string }[]
      setAttachedFiles(prev => [...prev, ...valid])
    })
  }

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const results = await Promise.all(
      files.map(async file => {
        const dataUrl = await readFileAsDataUrl(file)
        return { dataUrl, name: file.name, mimeType: file.type }
      })
    )
    setAttachedFiles(prev => [...prev, ...results])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  async function sendChat() {
    if (!chatInput.trim() && attachedFiles.length === 0) return
    if (!client) return

    const fileNote = attachedFiles.length > 0 ? ` [${attachedFiles.length} file${attachedFiles.length > 1 ? 's' : ''} attached]` : ''
    const modePrefix = scenarioMode === 'quick' ? '[QUICK SCENARIO] ' : scenarioMode === 'custom' ? '[CUSTOM SCENARIO] ' : ''
    const content = modePrefix + (chatInput.trim() || '(see attached files)')
    const userMsg: ChatMessage = { role: 'user', content: content + fileNote }
    const newMessages = [...chatMessages, userMsg]
    setChatMessages(newMessages)
    setChatInput('')
    const filesForSend = [...attachedFiles]
    setAttachedFiles([])
    setScenarioMode('none')
    setChatLoading(true)

    try {
      const clientContext = {
        name: client.name, stage: client.stage, priority: client.priority,
        loanType: client.loanType, loanAmount: client.loanAmount, nextAction: client.nextAction,
        notes: client.notes, primaryLo: client.primaryLo, primaryContact: client.primaryContact,
        followUpDate: client.followUpDate, referralSource: client.referralSource,
        referralType: client.referralType, referralName: client.referralName, referralDate: client.referralDate,
        married: client.married,
        b1: { name: client.b1Name, incomeType: client.b1IncomeType, monthlyIncome: client.b1MonthlyIncome, assets: client.b1Assets, assetsNotes: client.b1AssetsNotes },
        b2: { name: client.b2Name, incomeType: client.b2IncomeType, monthlyIncome: client.b2MonthlyIncome, assets: client.b2Assets, assetsNotes: client.b2AssetsNotes },
        combinedMonthlyIncome: (client.b1MonthlyIncome || 0) + (client.b2MonthlyIncome || 0),
        totalAssets: (client.b1Assets || 0) + (client.b2Assets || 0),
        reo: client.reo,
        ficoScore: client.ficoScore,
        targetPurchasePrice: client.targetPurchasePrice,
        targetArea: client.targetArea,
        recentCalls: callLogs.slice(0, 10).map(c => ({ type: c.call_type, notes: c.notes, date: c.created_at, by: c.logged_by_email })),
      }
      const res = await fetch('/api/pph/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          clientContext,
          attachedFiles: filesForSend.length > 0 ? filesForSend : undefined,
          scenarioMode,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const assistantContent: string = data.content || 'No response'
        const scenarioMatch = assistantContent.match(/```scenario\n([\s\S]*?)```/)
        if (scenarioMatch) {
          try {
            const parsed = JSON.parse(scenarioMatch[1])
            setPendingScenario({ ...parsed, notionClientId: client.id, clientName: client.name })
          } catch { /* ignore */ }
        }

        // Auto-apply client-update blocks
        const updateMatch = assistantContent.match(/```client-update\n([\s\S]*?)```/)
        if (updateMatch) {
          try {
            const updates = JSON.parse(updateMatch[1])
            await fetch('/api/pph/clients', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: client.id, ...updates }),
            }).then(async r => {
              if (r.ok) {
                const updated = await r.json()
                setClient(mapRow(updated))
              }
            })
          } catch { /* ignore */ }
        }

        const finalMessages = [...newMessages, { role: 'assistant' as const, content: assistantContent }]
        setChatMessages(finalMessages)
        fetch('/api/pph/chat-messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId: id,
            messages: [
              { role: 'user', content: userMsg.content, hasImage: filesForSend.length > 0 },
              { role: 'assistant', content: assistantContent },
            ],
          }),
        }).catch(() => {})
      }
    } catch (err) {
      console.error(err)
      setChatMessages([...newMessages, { role: 'assistant', content: 'Error connecting to PPH-Claw. Try again.' }])
    } finally {
      setChatLoading(false)
    }
  }

  async function saveGeneratedScenario() {
    if (!pendingScenario || !client) return
    setSavingScenario(true)
    const baseName = client.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const type = (pendingScenario.type as string) || 'purchase'
    const slug = `${baseName}-${type}-${Date.now()}`
    const res = await fetch('/api/scenarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, ...pendingScenario, notionClientId: client.id }),
    })
    if (res.ok) {
      const url = `https://kyle.palaniuk.net/clients/purchase/${slug}`
      setPendingScenario(null)
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: `✅ Scenario saved! Share link: ${url}`,
      }])
      fetchScenarios()
    }
    setSavingScenario(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-6 h-6 text-ocean animate-spin" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-midnight/40 mb-4">Client not found</p>
        <Link href="/workshop/pph/opportunities" className="text-ocean text-sm hover:underline">← Back to Opportunities</Link>
      </div>
    )
  }



  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PPHNav />
      {/* Back + Name */}
      <div className="flex items-start gap-3">
        <Link href="/workshop/pph/opportunities" className="p-2 rounded-lg hover:bg-midnight/5 transition-colors mt-0.5 flex-shrink-0" title="Back to Pipeline">
          <ArrowLeft className="w-5 h-5 text-midnight/40" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display text-2xl text-midnight">{client.name}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STAGE_COLORS[client.stage] || 'bg-gray-100 text-gray-600'}`}>{client.stage}</span>
            {client.ficoScore && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-midnight/5 text-midnight/60">FICO {client.ficoScore}</span>}
            {client.targetPurchasePrice && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-midnight/5 text-midnight/60">${(client.targetPurchasePrice/1000).toFixed(0)}k target</span>}
          </div>
          <div className="flex items-center gap-3 text-xs text-midnight/40 mt-1 flex-wrap">
            {client.loanType && <span>{client.loanType}</span>}
            {client.targetArea && <span>📍 {client.targetArea}</span>}
            {client.primaryLo && <span>👤 {client.primaryLo}</span>}
            {(client.referralType || client.referralName || client.referralSource) && (
              <span>
                via {[client.referralType, client.referralName, client.referralSource].filter(Boolean).join(' · ')}
              </span>
            )}
            {client.phone && <a href={`tel:${client.phone}`} className="hover:text-ocean transition-colors">📞 {client.phone}</a>}
          </div>
        </div>
        {/* Quick action buttons */}
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={() => setTab('chat')} title="Ask PPH-Claw"
            className={`p-2 rounded-lg transition-colors ${tab === 'chat' ? 'bg-ocean text-white' : 'hover:bg-ocean/10 text-midnight/40 hover:text-ocean'}`}>
            <MessageSquare className="w-4 h-4" />
          </button>
          <button onClick={() => setTab('calls')} title="Log Activity"
            className={`p-2 rounded-lg transition-colors ${tab === 'calls' ? 'bg-midnight text-white' : 'hover:bg-midnight/5 text-midnight/40 hover:text-midnight'}`}>
            <Phone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header fields grid — tap any field to edit */}
      <div className="bg-cream rounded-xl p-4 border border-midnight/5">
        <p className="text-[10px] text-midnight/25 uppercase tracking-wider mb-3 font-medium">Tap any field to edit</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <EditableSelect field="stage" value={client.stage} options={STAGES} label="Stage" onChange={saveField} />
        <EditableSelect field="priority" value={client.priority} options={PRIORITIES} label="Priority" onChange={saveField} />
        <EditableSelect field="primaryLo" value={client.primaryLo} options={LO_OPTIONS} label="Primary LO" onChange={saveField} />
        <EditableText field="primaryContact" value={client.primaryContact} label="Primary Contact" editingField={editingField} editValue={editValue} saving={saving} onStartEdit={(f,v) => { setEditingField(f); setEditValue(v) }} onSave={saveField} onCancel={() => setEditingField(null)} onEditChange={setEditValue} />
        <EditableText field="phone" value={client.phone} label="Phone" editingField={editingField} editValue={editValue} saving={saving} onStartEdit={(f,v) => { setEditingField(f); setEditValue(v) }} onSave={saveField} onCancel={() => setEditingField(null)} onEditChange={setEditValue} />
        <EditableText field="followUpDate" value={client.followUpDate} label="Follow-up Date" editingField={editingField} editValue={editValue} saving={saving} onStartEdit={(f,v) => { setEditingField(f); setEditValue(v) }} onSave={saveField} onCancel={() => setEditingField(null)} onEditChange={setEditValue} />
        <EditableText field="nextAction" value={client.nextAction} label="Next Action" editingField={editingField} editValue={editValue} saving={saving} onStartEdit={(f,v) => { setEditingField(f); setEditValue(v) }} onSave={saveField} onCancel={() => setEditingField(null)} onEditChange={setEditValue} />
        <EditableText field="notes" value={client.notes} label="Notes" editingField={editingField} editValue={editValue} saving={saving} onStartEdit={(f,v) => { setEditingField(f); setEditValue(v) }} onSave={saveField} onCancel={() => setEditingField(null)} onEditChange={setEditValue} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-midnight/10 -mx-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] whitespace-nowrap ${
              tab === t.id
                ? 'text-ocean border-ocean bg-ocean/3'
                : 'text-midnight/40 border-transparent hover:text-midnight hover:bg-midnight/3'
            }`}
          >
            <span className="text-base leading-none">{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="space-y-4">

          {/* Notes + Next Action */}
          <div className="bg-cream rounded-xl p-5 border border-midnight/5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-midnight mb-1">Notes</h3>
              <p className="text-sm text-midnight/70 whitespace-pre-wrap">{client.notes || 'No notes yet.'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-midnight mb-1">Next Action</h3>
              <p className="text-sm text-midnight/70">{client.nextAction || 'None set.'}</p>
            </div>
            <div className="flex gap-3 pt-1">
              <Link href={`/workshop/pph/purchase-builder?client=${client.id}&name=${encodeURIComponent(client.name)}`} className="flex items-center gap-2 px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors">
                <FileText className="w-4 h-4" /> Run Scenario
              </Link>
              <button onClick={() => setTab('chat')} className="flex items-center gap-2 px-4 py-2 bg-midnight text-cream rounded-lg text-sm font-medium hover:bg-midnight/80 transition-colors">
                <MessageSquare className="w-4 h-4" /> Ask PPH-Claw
              </button>
            </div>
          </div>

          {/* Referral Source */}
          <div className="bg-cream rounded-xl p-5 border border-midnight/5">
            <h3 className="text-sm font-semibold text-midnight mb-4">Referral Source</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Referral Type */}
              <div>
                <span className="text-xs text-midnight/40 block mb-1">Source Type</span>
                <select
                  value={client.referralType || ''}
                  onChange={e => saveClientFields({ referralType: e.target.value || null })}
                  className="w-full px-2 py-1.5 bg-white border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50 text-midnight"
                >
                  <option value="">— Select type —</option>
                  <option value="Realtor">Realtor</option>
                  <option value="Past Client">Past Client</option>
                  <option value="Friend / Family">Friend / Family</option>
                  <option value="Cold Lead">Cold Lead</option>
                  <option value="Partner">Partner (PPH / GH)</option>
                  <option value="Online">Online / Social</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/* Referred By */}
              <div>
                <span className="text-xs text-midnight/40 block mb-1">Referred By</span>
                <input
                  type="text"
                  placeholder="Name..."
                  value={client.referralName || ''}
                  onChange={e => saveClientFields({ referralName: e.target.value || null })}
                  className="w-full px-2 py-1.5 bg-white border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50"
                />
              </div>
              {/* Referral Date */}
              <div>
                <span className="text-xs text-midnight/40 block mb-1">Referral Date</span>
                <input
                  type="date"
                  value={client.referralDate || ''}
                  onChange={e => saveClientFields({ referralDate: e.target.value || null })}
                  className="w-full px-2 py-1.5 bg-white border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50 text-midnight"
                />
              </div>
              {/* Legacy referralSource (free-form notes / company) */}
              <div className="sm:col-span-3">
                <span className="text-xs text-midnight/40 block mb-1">Additional Notes (company, context)</span>
                <input
                  type="text"
                  placeholder="e.g. Coldwell Banker Mission Hills, met at open house..."
                  value={client.referralSource || ''}
                  onChange={e => saveClientFields({ referralSource: e.target.value })}
                  className="w-full px-2 py-1.5 bg-white border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50"
                />
              </div>
            </div>
          </div>

          {/* Deal Basics */}
          <div className="bg-cream rounded-xl p-5 border border-midnight/5">
            <h3 className="text-sm font-semibold text-midnight mb-4">Deal Basics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-midnight/40 block mb-1">Target Purchase Price</span>
                <FieldInput type="number" placeholder="e.g. 850000" prefix="$" value={client.targetPurchasePrice} onSave={v => saveClientFields({ targetPurchasePrice: parseFloat(v) || null })} className="w-full" />
              </div>
              <div>
                <span className="text-xs text-midnight/40 block mb-1">FICO Score</span>
                <FieldInput type="number" placeholder="e.g. 740" value={client.ficoScore} onSave={v => saveClientFields({ ficoScore: parseInt(v) || null })} className="w-full" />
              </div>
              <div>
                <span className="text-xs text-midnight/40 block mb-1">Target Area</span>
                <FieldInput type="text" placeholder="e.g. North Park, San Diego CA" value={client.targetArea} onSave={v => saveClientFields({ targetArea: v })} className="w-full" />
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div className="bg-cream rounded-xl p-5 border border-midnight/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-midnight">AI Summary</h3>
                {client.aiSummaryUpdatedAt && (
                  <p className="text-[10px] text-midnight/30 mt-0.5">
                    Updated {new Date(client.aiSummaryUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </p>
                )}
              </div>
              <button
                onClick={refreshSummary}
                disabled={generatingSummary}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-midnight/5 text-midnight/50 rounded-lg text-xs hover:bg-midnight/10 transition-colors disabled:opacity-40"
              >
                <RefreshCw className={`w-3 h-3 ${generatingSummary ? 'animate-spin' : ''}`} />
                {generatingSummary ? 'Generating…' : 'Refresh'}
              </button>
            </div>
            {client.aiSummary
              ? <p className="text-sm text-midnight/70 leading-relaxed whitespace-pre-wrap">{client.aiSummary}</p>
              : <p className="text-sm text-midnight/30 italic">No summary yet. Hit Refresh to generate one from this client&apos;s data.</p>
            }
          </div>

          {/* Borrowers + Income */}
          <div className="bg-cream rounded-xl p-5 border border-midnight/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-midnight">Borrowers & Income</h3>
              <label className="flex items-center gap-2 text-xs text-midnight/60 cursor-pointer">
                <input type="checkbox" checked={client.married} onChange={e => saveClientFields({ married: e.target.checked })} className="rounded" />
                Married
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                { label: 'Borrower 1', nameKey: 'b1Name', typeKey: 'b1IncomeType', incomeKey: 'b1MonthlyIncome', detailsKey: 'b1IncomeDetails' },
                { label: 'Borrower 2', nameKey: 'b2Name', typeKey: 'b2IncomeType', incomeKey: 'b2MonthlyIncome', detailsKey: 'b2IncomeDetails' },
              ] as const).map(({ label, nameKey, typeKey, incomeKey, detailsKey }) => {
                const incomeType = client[typeKey] as string | null
                const details = (client[detailsKey] || {}) as Record<string, number | string | null>

                function calcSuggestedIncome(): number | null {
                  if (incomeType === 'W2') {
                    const base = Number(details.base || 0)
                    const bonus = Number(details.bonus || 0)
                    const overtime = Number(details.overtime || 0)
                    const commission = Number(details.commission || 0)
                    // Base is monthly; bonus/OT/commission are annual, averaged over 24 months per guideline
                    return base + (bonus + overtime + commission) / 24
                  }
                  if (incomeType === 'SE/Self-Employed' || incomeType === '1099') {
                    const y1 = Number(details.year1Net || 0)
                    const y2 = Number(details.year2Net || 0)
                    if (!y1 && !y2) return null
                    // Declining income: use lower year; otherwise 2yr avg
                    const avg = (y1 + y2) / 2
                    const qualifying = y2 < y1 ? y2 : avg
                    return qualifying / 12
                  }
                  return null
                }

                const suggested = calcSuggestedIncome()

                function saveDetails(updates: Record<string, number | string | null>) {
                  const merged = { ...details, ...updates }
                  saveClientFields({ [detailsKey]: merged })
                }

                return (
                  <div key={label} className="bg-white/60 rounded-xl p-4 border border-midnight/5 space-y-3">
                    <p className="text-xs font-semibold text-midnight/50 uppercase tracking-wider">{label}</p>
                    <EditableText field={nameKey} value={client[nameKey] as string | null} label="Full Name" editingField={editingField} editValue={editValue} saving={saving} onStartEdit={(f,v) => { setEditingField(f); setEditValue(v) }} onSave={saveField} onCancel={() => setEditingField(null)} onEditChange={setEditValue} />

                    {/* Income Type */}
                    <div>
                      <span className="text-xs text-midnight/40 block mb-0.5">Income Type</span>
                      <select value={incomeType || ''} onChange={e => saveClientFields({ [typeKey]: e.target.value })} className="w-full px-2 py-1 bg-cream border border-midnight/10 rounded text-sm focus:outline-none">
                        <option value="">—</option>
                        {INCOME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    {/* W2 sub-fields */}
                    {incomeType === 'W2' && (
                      <div className="space-y-2 pt-1 border-t border-midnight/8">
                        <p className="text-[10px] text-midnight/30 uppercase tracking-wider font-medium">W2 Breakdown</p>
                        {[
                          { key: 'base', label: 'Base Salary', unit: '/mo' },
                          { key: 'bonus', label: 'Annual Bonus', unit: '/yr' },
                          { key: 'overtime', label: 'Overtime', unit: '/yr' },
                          { key: 'commission', label: 'Commission', unit: '/yr' },
                        ].map(({ key, label: fLabel, unit }) => (
                          <div key={key}>
                            <span className="text-xs text-midnight/40 block mb-0.5">{fLabel}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-midnight/40">$</span>
                              <input type="number" placeholder="0" value={Number(details[key] || '') || ''} onChange={e => saveDetails({ [key]: parseFloat(e.target.value) || null })} className="flex-1 px-2 py-1 bg-cream border border-midnight/10 rounded text-xs focus:outline-none" />
                              <span className="text-[10px] text-midnight/30">{unit}</span>
                            </div>
                          </div>
                        ))}
                        {suggested !== null && (
                          <div className="mt-2 p-2 bg-ocean/5 rounded-lg border border-ocean/15 flex items-center justify-between gap-2">
                            <div>
                              <p className="text-[10px] text-ocean/70 font-medium">Suggested qualifying</p>
                              <p className="text-sm font-bold text-ocean">${Math.round(suggested).toLocaleString()}/mo</p>
                              <p className="text-[10px] text-midnight/30">base + (bonus+OT+commission) ÷ 24</p>
                            </div>
                            <button onClick={() => saveClientFields({ [incomeKey]: Math.round(suggested) })} className="px-2.5 py-1 text-xs bg-ocean text-white rounded-lg font-medium hover:bg-ocean/90 transition-colors whitespace-nowrap">Apply</button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SE / 1099 sub-fields */}
                    {(incomeType === 'SE/Self-Employed' || incomeType === '1099') && (
                      <div className="space-y-2 pt-1 border-t border-midnight/8">
                        <p className="text-[10px] text-midnight/30 uppercase tracking-wider font-medium">{incomeType} — Net Income (Schedule C/K-1)</p>
                        {[
                          { key: 'year2Net', label: 'Year 2 (Most Recent) Net' },
                          { key: 'year1Net', label: 'Year 1 Net' },
                        ].map(({ key, label: fLabel }) => (
                          <div key={key}>
                            <span className="text-xs text-midnight/40 block mb-0.5">{fLabel}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-midnight/40">$</span>
                              <input type="number" placeholder="0" value={Number(details[key] || '') || ''} onChange={e => saveDetails({ [key]: parseFloat(e.target.value) || null })} className="flex-1 px-2 py-1 bg-cream border border-midnight/10 rounded text-xs focus:outline-none" />
                              <span className="text-[10px] text-midnight/30">/yr</span>
                            </div>
                          </div>
                        ))}
                        {(details.year1Net || details.year2Net) && (
                          <div className="text-xs text-midnight/50 space-y-0.5 pt-1">
                            {details.year1Net && details.year2Net && (
                              <p className={Number(details.year2Net) < Number(details.year1Net) ? 'text-amber-600' : 'text-emerald-600'}>
                                {Number(details.year2Net) < Number(details.year1Net) ? '📉 Declining' : '📈 Trending up'} — {Number(details.year2Net) < Number(details.year1Net) ? 'using lower year' : '2yr avg'}
                              </p>
                            )}
                          </div>
                        )}
                        {suggested !== null && (
                          <div className="mt-2 p-2 bg-ocean/5 rounded-lg border border-ocean/15 flex items-center justify-between gap-2">
                            <div>
                              <p className="text-[10px] text-ocean/70 font-medium">Suggested qualifying</p>
                              <p className="text-sm font-bold text-ocean">${Math.round(suggested).toLocaleString()}/mo</p>
                              <p className="text-[10px] text-midnight/30">{Number(details.year2Net) < Number(details.year1Net) ? 'lower year ÷ 12' : '2yr avg ÷ 12'}</p>
                            </div>
                            <button onClick={() => saveClientFields({ [incomeKey]: Math.round(suggested) })} className="px-2.5 py-1 text-xs bg-ocean text-white rounded-lg font-medium hover:bg-ocean/90 transition-colors whitespace-nowrap">Apply</button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Monthly qualifying income (always shown) */}
                    <div className={incomeType && incomeType !== 'Rental' && incomeType !== 'Other' ? 'pt-2 border-t border-midnight/8' : ''}>
                      <span className="text-xs text-midnight/40 block mb-0.5">Monthly Qualifying Income</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-midnight/40">$</span>
                        <FieldInput type="number" placeholder="0" value={client[incomeKey] as number} onSave={v => saveClientFields({ [incomeKey]: parseFloat(v) || null })} className="flex-1" />
                        <span className="text-xs text-midnight/40">/mo</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {(client.b1MonthlyIncome || client.b2MonthlyIncome) && (
              <div className="mt-3 pt-3 border-t border-midnight/8 flex gap-4 text-sm">
                <span className="text-midnight/50">Combined:</span>
                <span className="font-semibold text-midnight">${((client.b1MonthlyIncome || 0) + (client.b2MonthlyIncome || 0)).toLocaleString()}/mo</span>
                <span className="text-midnight/40">${(((client.b1MonthlyIncome || 0) + (client.b2MonthlyIncome || 0)) * 12).toLocaleString()}/yr</span>
              </div>
            )}
          </div>

          {/* Assets */}
          <div className="bg-cream rounded-xl p-5 border border-midnight/5">
            <h3 className="text-sm font-semibold text-midnight mb-4">Assets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[{ label: 'B1 Liquid Assets', assetsKey: 'b1Assets', notesKey: 'b1AssetsNotes' }, { label: 'B2 Liquid Assets', assetsKey: 'b2Assets', notesKey: 'b2AssetsNotes' }].map(({ label, assetsKey, notesKey }) => (
                <div key={label} className="bg-white/60 rounded-xl p-4 border border-midnight/5 space-y-2">
                  <p className="text-xs font-semibold text-midnight/50 uppercase tracking-wider">{label}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-midnight/40">$</span>
                    <FieldInput type="number" placeholder="0" value={client[assetsKey as keyof Client] as number} onSave={v => saveClientFields({ [assetsKey]: parseFloat(v) || null })} className="flex-1" />
                  </div>
                  <FieldInput type="text" placeholder="Notes (checking, savings, 401k, stocks...)" value={client[notesKey as keyof Client] as string} onSave={v => saveClientFields({ [notesKey]: v })} className="w-full text-xs text-midnight/60" />
                </div>
              ))}
            </div>
            {(client.b1Assets || client.b2Assets) && (
              <div className="mt-3 pt-3 border-t border-midnight/8 flex gap-4 text-sm">
                <span className="text-midnight/50">Total assets:</span>
                <span className="font-semibold text-midnight">${((client.b1Assets || 0) + (client.b2Assets || 0)).toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Liabilities & DTI */}
          {(() => {
            const totalDebt = client.liabilities.reduce((sum, d) => sum + (d.monthlyPayment || 0), 0)
            const combinedIncome = (client.b1MonthlyIncome || 0) + (client.b2MonthlyIncome || 0)
            const LIABILITY_TYPES: { value: Liability['type']; label: string }[] = [
              { value: 'auto', label: '🚗 Auto Loan' },
              { value: 'student', label: '🎓 Student Loan' },
              { value: 'credit_card', label: '💳 Credit Card' },
              { value: 'installment', label: '📦 Installment Loan' },
              { value: 'other', label: '📋 Other' },
            ]

            function addLiability(entry: Omit<Liability, 'id'>) {
              if (!client) return
              const updated = [...client.liabilities, { ...entry, id: `debt-${Date.now()}` }]
              saveClientFields({ liabilities: JSON.stringify(updated) })
            }
            function removeLiability(lid: string) {
              if (!client) return
              const updated = client.liabilities.filter(d => d.id !== lid)
              saveClientFields({ liabilities: JSON.stringify(updated) })
            }

            return (
              <div className="bg-cream rounded-xl p-5 border border-midnight/5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-midnight">Monthly Liabilities</h3>
                    {totalDebt > 0 && (
                      <p className="text-xs text-midnight/40 mt-0.5">
                        Total: <span className="font-semibold text-midnight">${totalDebt.toLocaleString()}/mo</span>
                        {combinedIncome > 0 && (
                          <span className="ml-2 text-midnight/50">
                            Non-housing DTI: <span className={`font-semibold ${totalDebt / combinedIncome > 0.36 ? 'text-red-500' : totalDebt / combinedIncome > 0.28 ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {((totalDebt / combinedIncome) * 100).toFixed(1)}%
                            </span>
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <LiabilityAddButton types={LIABILITY_TYPES} onAdd={addLiability} />
                </div>

                {client.liabilities.length === 0 ? (
                  <p className="text-sm text-midnight/30">No liabilities on file.</p>
                ) : (
                  <div className="space-y-2">
                    {client.liabilities.map(debt => (
                      <div key={debt.id} className="flex items-center gap-3 bg-white/60 rounded-lg px-4 py-3 border border-midnight/5">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-midnight/60 capitalize">{debt.type.replace('_', ' ')}</span>
                            {debt.description && <span className="text-sm text-midnight truncate">{debt.description}</span>}
                          </div>
                          {debt.balance !== null && debt.balance > 0 && (
                            <p className="text-xs text-midnight/40 mt-0.5">Balance: ${debt.balance.toLocaleString()}</p>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-midnight whitespace-nowrap">${debt.monthlyPayment.toLocaleString()}/mo</span>
                        <button onClick={() => removeLiability(debt.id)} className="text-midnight/20 hover:text-red-400 transition-colors flex-shrink-0">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* DTI summary card */}
                {combinedIncome > 0 && totalDebt > 0 && (
                  <div className="mt-4 p-3 bg-midnight/3 rounded-xl border border-midnight/8">
                    <p className="text-xs font-semibold text-midnight/50 uppercase tracking-wider mb-2">DTI Snapshot</p>
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div>
                        <p className="text-midnight/40">Monthly Income</p>
                        <p className="font-bold text-midnight mt-0.5">${combinedIncome.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-midnight/40">Non-Housing Debts</p>
                        <p className="font-bold text-midnight mt-0.5">${totalDebt.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-midnight/40">Max Housing (43% BTI)</p>
                        <p className="font-bold text-emerald-600 mt-0.5">${Math.max(0, Math.round(combinedIncome * 0.43 - totalDebt)).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="h-1.5 bg-midnight/8 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${totalDebt / combinedIncome > 0.36 ? 'bg-red-400' : totalDebt / combinedIncome > 0.28 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                          style={{ width: `${Math.min(100, (totalDebt / combinedIncome) * 100 / 0.43 * 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-midnight/30 mt-1">Non-housing debts vs 43% back-end limit</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          {/* REO */}
          <div className="bg-cream rounded-xl p-5 border border-midnight/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-midnight">Real Estate Owned (REO)</h3>
              <button onClick={() => setShowReoForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-midnight text-cream rounded-lg text-xs font-medium hover:bg-midnight/80 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Property
              </button>
            </div>

            {client.reo.length === 0 && !showReoForm && <p className="text-sm text-midnight/30">No properties on file.</p>}

            {client.reo.map(prop => {
              const netRental = prop.estimatedRent ? prop.estimatedRent * (1 - (prop.vacancyRate / 100)) * 0.75 : null
              return (
                <div key={prop.id} className="bg-white/60 rounded-xl p-4 border border-midnight/5 mb-3 text-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-midnight">{prop.address}</p>
                      <p className="text-xs text-midnight/50 mt-0.5">{prop.propertyType} · {prop.status} · {prop.lender || 'no lender'}</p>
                    </div>
                    <button onClick={() => removeReo(prop.id)} className="text-midnight/20 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
                    <div><span className="text-midnight/40 block">Market Value</span><span className="font-medium">{prop.marketValue ? `$${prop.marketValue.toLocaleString()}` : '—'}</span></div>
                    <div><span className="text-midnight/40 block">Mortgage Balance</span><span className="font-medium">{prop.mortgageBalance ? `$${prop.mortgageBalance.toLocaleString()}` : '—'}</span></div>
                    <div><span className="text-midnight/40 block">Monthly PITIA</span><span className="font-medium">{prop.monthlyPayment ? `$${prop.monthlyPayment.toLocaleString()}` : '—'}</span></div>
                    <div><span className="text-midnight/40 block">Est. Rent</span><span className="font-medium">{prop.estimatedRent ? `$${prop.estimatedRent.toLocaleString()}` : '—'}</span></div>
                    <div><span className="text-midnight/40 block">Vacancy Rate</span><span className="font-medium">{prop.vacancyRate}%</span></div>
                    <div><span className="text-midnight/40 block">Taxes + Ins</span><span className="font-medium">{prop.taxesInsurance ? `$${prop.taxesInsurance.toLocaleString()}/mo` : '—'}</span></div>
                    <div><span className="text-midnight/40 block">HOA</span><span className="font-medium">{prop.hoaDues ? `$${prop.hoaDues.toLocaleString()}/mo` : '—'}</span></div>
                    {netRental !== null && <div><span className="text-midnight/40 block">Net Rental Income</span><span className="font-semibold text-emerald-600">${Math.round(netRental).toLocaleString()}/mo</span></div>}
                  </div>
                </div>
              )
            })}

            {showReoForm && (
              <div className="bg-white/80 rounded-xl p-4 border border-ocean/20 mt-3 space-y-3">
                <p className="text-xs font-semibold text-midnight/60 uppercase tracking-wider">New Property</p>
                <input placeholder="Address" value={reoForm.address || ''} onChange={e => setReoForm(p => ({...p, address: e.target.value}))} className="w-full px-2 py-1.5 border border-midnight/10 rounded text-sm focus:outline-none focus:border-ocean/50" />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-midnight/40 block mb-0.5">Type</label>
                    <select value={reoForm.propertyType || 'SFR'} onChange={e => setReoForm(p => ({...p, propertyType: e.target.value}))} className="w-full px-2 py-1 border border-midnight/10 rounded text-sm focus:outline-none">
                      {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-midnight/40 block mb-0.5">Status</label>
                    <select value={reoForm.status || 'rental'} onChange={e => setReoForm(p => ({...p, status: e.target.value}))} className="w-full px-2 py-1 border border-midnight/10 rounded text-sm focus:outline-none">
                      {PROPERTY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { key: 'marketValue', label: 'Market Value ($)' },
                    { key: 'mortgageBalance', label: 'Mortgage Balance ($)' },
                    { key: 'monthlyPayment', label: 'Monthly PITIA ($)' },
                    { key: 'estimatedRent', label: 'Est. Monthly Rent ($)' },
                    { key: 'vacancyRate', label: 'Vacancy Rate (%)' },
                    { key: 'taxesInsurance', label: 'Tax + Ins/mo ($)' },
                    { key: 'hoaDues', label: 'HOA/mo ($)' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="text-midnight/40 block mb-0.5">{label}</label>
                      <input type="number" placeholder="0" value={(reoForm[key as keyof typeof reoForm] as number) || ''} onChange={e => setReoForm(p => ({...p, [key]: parseFloat(e.target.value) || null}))} className="w-full px-2 py-1 border border-midnight/10 rounded text-sm focus:outline-none" />
                    </div>
                  ))}
                  <div>
                    <label className="text-midnight/40 block mb-0.5">Lender</label>
                    <input type="text" placeholder="Chase, BofA..." value={reoForm.lender || ''} onChange={e => setReoForm(p => ({...p, lender: e.target.value}))} className="w-full px-2 py-1 border border-midnight/10 rounded text-sm focus:outline-none" />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={addReo} className="px-4 py-1.5 bg-midnight text-cream rounded-lg text-xs font-medium hover:bg-midnight/80 transition-colors">Save Property</button>
                  <button onClick={() => setShowReoForm(false)} className="px-3 py-1.5 text-midnight/40 hover:text-midnight text-xs transition-colors">Cancel</button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {tab === 'calls' && (
        <div className="space-y-4">
          {/* Log new call */}
          <div className="bg-cream rounded-xl p-4 border border-midnight/5">
            <h3 className="text-sm font-semibold text-midnight mb-3">Log Contact</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {CALL_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setLogType(t)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    logType === t ? 'bg-ocean text-white' : 'bg-midnight/5 text-midnight/60 hover:bg-midnight/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <textarea
                placeholder="Notes... (paragraph formatting supported, Shift+Enter for new line)"
                value={logNotes}
                onChange={e => setLogNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50 resize-y whitespace-pre-wrap"
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && e.metaKey) logCall() }}
              />
              <div className="flex justify-end">
                <button
                  onClick={logCall}
                  disabled={submittingLog || !logNotes.trim()}
                  className="px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors disabled:opacity-50"
                >
                  {submittingLog ? 'Logging...' : `Log ${logType}`}
                </button>
              </div>
            </div>
          </div>

          {/* Call history */}
          {loadingCalls ? (
            <div className="text-center py-8"><RefreshCw className="w-5 h-5 text-ocean animate-spin mx-auto" /></div>
          ) : callLogs.length === 0 ? (
            <div className="text-center py-8 space-y-1">
              <p className="text-2xl">📞</p>
              <p className="text-midnight/40 text-sm font-medium">No contact logged yet</p>
              <p className="text-midnight/25 text-xs">Use the form above to log a call, text, email, or note</p>
            </div>
          ) : (
            <div className="space-y-2">
              {callLogs.map(log => (
                <div key={log.id} className="bg-cream rounded-lg p-3 border border-midnight/5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-midnight/5 text-midnight/60">
                        {log.call_type}
                      </span>
                      <span className="text-xs text-midnight/40">
                        {log.logged_by_email.split('@')[0]}
                      </span>
                    </div>
                    <span className="text-xs text-midnight/30">
                      {new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
                      {new Date(log.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                  {log.notes && <p className="text-sm text-midnight/70 whitespace-pre-wrap">{log.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'scenarios' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-midnight">Scenarios</h3>
            <Link
              href={`/workshop/pph/purchase-builder?client=${client.id}&name=${encodeURIComponent(client.name)}`}
              className="flex items-center gap-1 px-3 py-1.5 bg-ocean text-white rounded-lg text-xs font-medium hover:bg-ocean/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> New Scenario
            </Link>
          </div>
          {/* Interactive scenario — only show for J&H */}
          {id === JH_CLIENT_ID && <div className="bg-white rounded-xl border border-ocean/20 overflow-hidden">
            <div className="bg-ocean/5 px-5 py-4 border-b border-ocean/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-ocean uppercase tracking-wider">Interactive Scenario</span>
                    {interactiveViewCount !== null && (
                      <span className="px-2 py-0.5 rounded-full bg-ocean/10 text-xs text-ocean font-medium">
                        {interactiveViewCount} view{interactiveViewCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-base font-semibold text-midnight">Jeffrey & Hannah Domenech — Purchase</p>
                  <p className="text-xs text-midnight/50 mt-1">
                    A live, shareable page where Jeffrey & Hannah can drag sliders to explore different purchase prices, down payments, and Hannah&apos;s income scenarios in real time. When they find a number they like, they hit <strong>Save This Scenario</strong> and it appears below — with their note to you.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 flex items-center gap-2">
              <a href="/clients/interactive/jh-domenech" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-ocean text-white rounded-lg text-xs font-semibold hover:bg-ocean/90 transition-colors">
                Open Page ↗
              </a>
              <button onClick={() => { navigator.clipboard.writeText('https://kyle.palaniuk.net/clients/interactive/jh-domenech') }}
                className="flex items-center gap-1.5 px-4 py-2 bg-midnight/5 text-midnight/60 rounded-lg text-xs font-medium hover:bg-midnight/10 transition-colors">
                🔗 Copy Link
              </button>
            </div>

            {/* Client snapshots */}
            {interactiveSnapshots.length > 0 && (
              <div className="px-5 pb-4 space-y-2 border-t border-midnight/8 pt-4">
                <p className="text-xs font-semibold text-midnight/40 uppercase tracking-wider">Client Snapshots — what they saved</p>
                {interactiveSnapshots.map((s, i) => (
                  <div key={s.id} className="bg-[#f8f7f4] rounded-xl p-3 border border-midnight/5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-midnight/60">Snapshot #{interactiveSnapshots.length - i}</span>
                      <span className="text-[10px] text-midnight/30">
                        {new Date(s.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-midnight/60 mb-1.5">
                      <span>Price: <strong className="text-midnight">${Math.round(s.data.purchasePrice / 1000)}k</strong></span>
                      <span>Down: <strong className="text-midnight">{s.data.downPct}%</strong></span>
                      <span>Hannah income: <strong className="text-midnight">${s.data.hannahIncome?.toLocaleString()}/mo</strong></span>
                      <span>PITIA: <strong className="text-midnight">${Math.round(s.data.total).toLocaleString()}/mo</strong></span>
                      <span>Back DTI: <strong className="text-midnight">{s.data.backDTI?.toFixed(1)}%</strong></span>
                    </div>
                    {s.note && <p className="text-xs text-midnight italic border-l-2 border-ocean/30 pl-2">&ldquo;{s.note}&rdquo;</p>}
                  </div>
                ))}
              </div>
            )}
            {interactiveSnapshots.length === 0 && (
              <div className="px-5 pb-4 pt-3 border-t border-midnight/8">
                <p className="text-xs text-midnight/30 italic">No snapshots yet — send them the link and ask them to save their favorite scenario.</p>
              </div>
            )}
          </div>}

          {/* Static scenarios (PPH-Claw generated) */}
          {scenarios.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-midnight/40 uppercase tracking-wider px-1">Saved Scenarios</p>
              {scenarios.map(s => (
                <div key={s.slug} className="bg-cream rounded-lg p-4 border border-midnight/5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-midnight">{s.type === 'purchase-grid' ? 'Purchase Scenario' : s.type}</p>
                    <p className="text-xs text-midnight/40 mt-0.5">
                      {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={s.publicUrl} target="_blank" rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs text-ocean border border-ocean/30 rounded-lg hover:bg-ocean/5 transition-colors">
                      View
                    </a>
                    <button onClick={() => { navigator.clipboard.writeText(`kyle.palaniuk.net${s.publicUrl}`) }}
                      className="px-3 py-1.5 text-xs text-midnight/50 border border-midnight/10 rounded-lg hover:bg-midnight/5 transition-colors">
                      Copy Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'chat' && (
        <div className="bg-cream rounded-xl border border-midnight/5 flex flex-col sm:flex-row" style={{ height: 'min(580px, 80dvh)' }}>

          {/* LEFT: History panel — hidden on mobile unless toggled */}
          <div className={`${showHistory ? 'flex' : 'hidden'} sm:flex flex-col w-full sm:w-48 sm:flex-shrink-0 border-b sm:border-b-0 sm:border-r border-midnight/8 sm:h-full h-48`}>
            <div className="px-3 py-2.5 border-b border-midnight/8 flex items-center justify-between">
              <p className="text-xs font-semibold text-midnight/50 uppercase tracking-wider">History</p>
              <button onClick={() => setShowHistory(false)} className="sm:hidden text-midnight/30 hover:text-midnight">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {chatHistoryLoading && <RefreshCw className="w-4 h-4 text-ocean animate-spin mx-auto mt-4" />}
              {!chatHistoryLoading && chatMessages.length === 0 && (
                <p className="text-xs text-midnight/30 text-center mt-4 px-2">No history yet</p>
              )}
              {!chatHistoryLoading && chatMessages
                .map((m, i) => ({ m, i }))
                .filter(({ m }) => m.role === 'user')
                .map(({ m, i }) => (
                  <button
                    key={i}
                    onClick={() => {
                      const el = document.getElementById(`msg-${i}`)
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      setShowHistory(false) // auto-close on mobile after selecting
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-midnight/60 hover:bg-midnight/8 hover:text-midnight transition-colors truncate"
                    title={m.content}
                  >
                    {m.content.replace(/\[Image attached\]/, '📷').replace(/^\[(?:QUICK|CUSTOM) SCENARIO\] /, '').slice(0, 45)}
                  </button>
                ))}
            </div>
            {chatMessages.length > 0 && (
              <div className="p-2 border-t border-midnight/8">
                <button onClick={clearChatHistory} className="w-full text-xs text-midnight/30 hover:text-red-400 transition-colors py-1">
                  Clear history
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Active conversation */}
          <div className={`${showHistory ? 'hidden sm:flex' : 'flex'} flex-1 flex-col min-w-0`}>
            {/* Mobile header — History toggle + Clear */}
            <div className="sm:hidden flex items-center justify-between px-3 py-2 border-b border-midnight/8">
              <button onClick={() => setShowHistory(true)} className="flex items-center gap-1.5 text-xs text-midnight/50 hover:text-midnight transition-colors">
                <MessageSquare className="w-3.5 h-3.5" /> History
              </button>
              <span className="text-xs font-medium text-midnight/60">PPH-Claw · {client.name}</span>
              {chatMessages.length > 0 && (
                <button onClick={clearChatHistory} className="text-xs text-midnight/30 hover:text-red-400 transition-colors">Clear</button>
              )}
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistoryLoading && (
                <div className="text-center py-8">
                  <RefreshCw className="w-5 h-5 text-ocean animate-spin mx-auto" />
                </div>
              )}
              {!chatHistoryLoading && chatMessages.length === 0 && (
                <div className="text-center py-8 text-midnight/30 text-sm">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-midnight/15" />
                  <p>Ask PPH-Claw anything about {client.name}.</p>
                  <p className="text-xs mt-1">Income calc · UW questions · FHA/Conv/VA qualify · Scenario creation</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} id={`msg-${i}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-ocean text-white'
                      : 'bg-white border border-midnight/10 text-midnight/80'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-midnight/10 rounded-xl px-4 py-2.5 text-sm text-midnight/40">
                    PPH-Claw is thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-midnight/10 p-3 space-y-2">

              {/* Scenario mode toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-midnight/40 font-medium">Scenario:</span>
                {(['none', 'quick', 'custom'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setScenarioMode(prev => prev === mode ? 'none' : mode)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
                      scenarioMode === mode
                        ? mode === 'quick' ? 'bg-amber-500 text-white border-amber-500' : mode === 'custom' ? 'bg-ocean text-white border-ocean' : 'bg-midnight/10 text-midnight border-midnight/20'
                        : 'bg-white text-midnight/50 border-midnight/10 hover:border-midnight/30'
                    }`}
                  >
                    {mode === 'quick' && <Zap className="w-3 h-3" />}
                    {mode === 'custom' && <Settings2 className="w-3 h-3" />}
                    {mode === 'none' ? 'Off' : mode === 'quick' ? 'Quick' : 'Custom'}
                  </button>
                ))}
                {scenarioMode !== 'none' && (
                  <span className="text-xs text-midnight/30 italic">
                    {scenarioMode === 'quick' ? 'Give price/down/rate → instant PITIA' : 'Guided conversation → tailored scenario'}
                  </span>
                )}
              </div>

              {/* Pending scenario banner */}
              {pendingScenario && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-emerald-700">📊 Scenario ready to save</p>
                      <p className="text-xs text-emerald-600 mt-0.5 font-medium">
                        {String(pendingScenario.type ?? 'purchase').replace('-', ' ')} · ${Number(pendingScenario.purchasePrice || 0).toLocaleString()} · {String(pendingScenario.downPaymentPct ?? '')}% down · {String(pendingScenario.interestRate ?? '')}%
                      </p>
                      {!!pendingScenario.notes && <p className="text-xs text-emerald-600/80 mt-1 italic">{String(pendingScenario.notes)}</p>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => setPendingScenario(null)} className="px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors">Dismiss</button>
                      <button onClick={saveGeneratedScenario} disabled={savingScenario} className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
                        {savingScenario ? 'Saving...' : 'Save & Share'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Attached files preview */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map((f, i) => (
                    <div key={i} className="relative group">
                      {f.mimeType.startsWith('image/') ? (
                        <img src={f.dataUrl} alt={f.name} className="h-16 w-16 object-cover rounded-lg border border-midnight/10" />
                      ) : (
                        <div className="h-16 w-16 flex flex-col items-center justify-center bg-midnight/5 rounded-lg border border-midnight/10">
                          <FileText className="w-6 h-6 text-midnight/40" />
                          <span className="text-[9px] text-midnight/40 mt-1 truncate w-full text-center px-1">{f.name.slice(0,10)}</span>
                        </div>
                      )}
                      <button
                        onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-midnight text-cream rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* Text input row */}
              <div className="flex gap-2 items-end">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-midnight/40 hover:text-midnight hover:bg-midnight/5 rounded-lg transition-colors flex-shrink-0"
                  title="Attach images or PDFs"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <textarea
                  placeholder={`Ask about ${client.name}... (paste or attach screenshots, PDFs)`}
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onPaste={handleChatPaste}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() } }}
                  rows={2}
                  className="flex-1 px-3 py-2 bg-white border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50 resize-none"
                  disabled={chatLoading}
                />
                <button
                  onClick={sendChat}
                  disabled={chatLoading || (!chatInput.trim() && attachedFiles.length === 0)}
                  className="px-3 py-2 bg-ocean text-white rounded-lg hover:bg-ocean/90 transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-midnight/30">Paste or attach images/PDFs · Enter to send · Shift+Enter for new line</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}