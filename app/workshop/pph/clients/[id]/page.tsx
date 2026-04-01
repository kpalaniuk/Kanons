'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
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
  nextActionAiGenerated: boolean
  nextActionUpdatedAt: string | null
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
  email: string | null
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
  aiTldr: string | null
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
  isInteractive: boolean
  interactiveUrl: string | null
  label: string
  description: string | null
  data: Record<string, unknown>
  createdAt: string
  publicUrl: string
}

interface ScenarioViewData {
  viewCount: number
  lastViewed: string | null
  snapshots: { id: string; data: Record<string, number>; note: string; at: string }[]
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
// BorrowerCard — must be outside page component to avoid hooks-in-map violation
function BorrowerCard({
  label,
  nameKey, typeKey, incomeKey, detailsKey,
  client, editingField, editValue, saving,
  onStartEdit, onSave, onCancel, onEditChange,
  saveClientFields,
}: {
  label: string
  nameKey: 'b1Name' | 'b2Name'
  typeKey: 'b1IncomeType' | 'b2IncomeType'
  incomeKey: 'b1MonthlyIncome' | 'b2MonthlyIncome'
  detailsKey: 'b1IncomeDetails' | 'b2IncomeDetails'
  client: Record<string, unknown>
  editingField: string | null
  editValue: string
  saving: boolean
  onStartEdit: (f: string, v: string) => void
  onSave: (f: string, v: string) => void
  onCancel: () => void
  onEditChange: (v: string) => void
  saveClientFields: (fields: Record<string, unknown>) => void
}) {
  const incomeType = client[typeKey] as string | null
  const details = (client[detailsKey] || {}) as Record<string, number | string | null>
  const detailsRef = React.useRef(details)
  detailsRef.current = details

  const saveDetails = React.useCallback((updates: Record<string, number | string | null>) => {
    const merged = { ...detailsRef.current, ...updates }
    saveClientFields({ [detailsKey]: merged })
  }, [detailsKey, saveClientFields])

  function calcSuggestedIncome(): number | null {
    if (incomeType === 'W2') {
      const base = Number(details.base || 0)
      const bonus = Number(details.bonus || 0)
      const overtime = Number(details.overtime || 0)
      const commission = Number(details.commission || 0)
      return base + (bonus + overtime + commission) / 24
    }
    if (incomeType === 'SE/Self-Employed' || incomeType === '1099') {
      const y1 = Number(details.year1Net || 0)
      const y2 = Number(details.year2Net || 0)
      if (y1 && y2) return (y2 < y1 ? y2 : (y1 + y2) / 2) / 12
    }
    return null
  }
  const suggested = calcSuggestedIncome()

  return (
    <div className="bg-white/60 rounded-xl p-4 border border-midnight/5 space-y-3">
      <p className="text-xs font-semibold text-midnight/50 uppercase tracking-wider">{label}</p>
      <EditableText field={nameKey} value={client[nameKey] as string | null} label="Full Name"
        editingField={editingField} editValue={editValue} saving={saving}
        onStartEdit={onStartEdit} onSave={onSave} onCancel={onCancel} onEditChange={onEditChange} />
      <div>
        <span className="text-xs text-midnight/40 block mb-0.5">Income Type</span>
        <select value={incomeType || ''} onChange={e => saveClientFields({ [typeKey]: e.target.value })}
          className="w-full px-2 py-1 bg-cream border border-midnight/10 rounded text-sm focus:outline-none">
          <option value="">—</option>
          {INCOME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

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
                <FieldInput type="number" placeholder="0" value={Number(details[key] || '') || null}
                  onSave={v => saveDetails({ [key]: parseFloat(v) || null })} className="flex-1 text-xs" />
                <span className="text-[10px] text-midnight/30">{unit}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {(incomeType === 'SE/Self-Employed' || incomeType === '1099') && (
        <div className="space-y-2 pt-1 border-t border-midnight/8">
          <p className="text-[10px] text-midnight/30 uppercase tracking-wider font-medium">{incomeType} Breakdown</p>
          {[
            { key: 'year1Gross', label: 'Year 1 Gross Revenue' },
            { key: 'year1Net', label: 'Year 1 Net Income' },
            { key: 'year2Gross', label: 'Year 2 Gross Revenue' },
            { key: 'year2Net', label: 'Year 2 Net Income' },
          ].map(({ key, label: fLabel }) => (
            <div key={key}>
              <span className="text-xs text-midnight/40 block mb-0.5">{fLabel}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-midnight/40">$</span>
                <FieldInput type="number" placeholder="0" value={Number(details[key] || '') || null}
                  onSave={v => saveDetails({ [key]: parseFloat(v) || null })} className="flex-1 text-xs" />
              </div>
            </div>
          ))}
          {details.year1Net && details.year2Net && (
            <p className={Number(details.year2Net) < Number(details.year1Net) ? 'text-xs text-amber-600' : 'text-xs text-emerald-600'}>
              {Number(details.year2Net) < Number(details.year1Net) ? '📉 Declining — using lower year' : '📈 Trending up — 2yr avg'}
            </p>
          )}
        </div>
      )}

      {suggested !== null && (
        <div className="mt-2 p-2 bg-ocean/5 rounded-lg border border-ocean/15 flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] text-ocean/70 font-medium">Suggested qualifying</p>
            <p className="text-sm font-bold text-ocean">${Math.round(suggested).toLocaleString()}/mo</p>
          </div>
          <button onClick={() => saveClientFields({ [incomeKey]: Math.round(suggested) })}
            className="px-2.5 py-1 text-xs bg-ocean text-white rounded-lg font-medium hover:bg-ocean/90 transition-colors whitespace-nowrap">Apply</button>
        </div>
      )}

      <div className={incomeType && incomeType !== 'Rental' && incomeType !== 'Other' ? 'pt-2 border-t border-midnight/8' : ''}>
        <span className="text-xs text-midnight/40 block mb-0.5">Monthly Qualifying Income</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-midnight/40">$</span>
          <FieldInput type="number" placeholder="0" value={client[incomeKey] as number}
            onSave={v => saveClientFields({ [incomeKey]: parseFloat(v) || null })} className="flex-1" />
          <span className="text-xs text-midnight/40">/mo</span>
        </div>
      </div>
    </div>
  )
}

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


function getLoanTypeBadge(lt: string): string {
  const map: Record<string, string> = {
    "Conventional": "bg-blue-50 text-blue-700 border-blue-200",
    "Conv":         "bg-blue-50 text-blue-700 border-blue-200",
    "FHA":          "bg-emerald-50 text-emerald-700 border-emerald-200",
    "VA":           "bg-violet-50 text-violet-700 border-violet-200",
    "DSCR":         "bg-amber-50 text-amber-700 border-amber-200",
    "Jumbo":        "bg-rose-50 text-rose-700 border-rose-200",
    "Non-QM":       "bg-orange-50 text-orange-700 border-orange-200",
    "Bridge":       "bg-slate-50 text-slate-700 border-slate-200",
  }
  return map[lt] ?? "bg-slate-50 text-slate-600 border-slate-200"
}

export default function ClientProfilePage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') as Tab) || 'overview'

  const [client, setClient] = useState<Client | null>(null)
  const clientRef = useRef<Client | null>(null)
  useEffect(() => { clientRef.current = client }, [client])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>(initialTab)
  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [loadingCalls, setLoadingCalls] = useState(false)
  const [scenarios, setScenarios] = useState<ClientScenario[]>([])
  const [activityLog, setActivityLog] = useState<Array<{id:string;field:string;old_value:string|null;new_value:string|null;changed_by:string;ts:string}>>([])
  const [loadingActivity, setLoadingActivity] = useState(false)
  const [loadingScenarios, setLoadingScenarios] = useState(false)
  const [scenarioViews, setScenarioViews] = useState<Record<string, ScenarioViewData>>({})
  const [showFinancials, setShowFinancials] = useState(false)
  const [showFullSummary, setShowFullSummary] = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesDraft, setNotesDraft] = useState('')
  const [editingReferralNote, setEditingReferralNote] = useState(false)
  const [referralNoteDraft, setReferralNoteDraft] = useState('')

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
  const [generatingNextAction, setGeneratingNextAction] = useState(false)
  const [showNextActionPrompt, setShowNextActionPrompt] = useState(false)
  const [nextActionDraft, setNextActionDraft] = useState('')
  const [lastAppliedFields, setLastAppliedFields] = useState<Record<string, unknown> | null>(null)

  // Chat layout
  const [showHistory, setShowHistory] = useState(false)

  async function refreshSummary() {
    if (!client) return
    setGeneratingSummary(true)
    setLastAppliedFields(null)
    try {
      const res = await fetch('/api/pph/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: client.id }),
      })
      if (res.ok) {
        const { tldr, summary, extractedFields } = await res.json()
        setClient(prev => {
          if (!prev) return prev
          const u = { ...prev, aiSummary: summary, aiTldr: tldr, aiSummaryUpdatedAt: new Date().toISOString() }
          if (extractedFields?.ficoScore)           u.ficoScore = extractedFields.ficoScore
          if (extractedFields?.targetPurchasePrice) u.targetPurchasePrice = extractedFields.targetPurchasePrice
          if (extractedFields?.b1MonthlyIncome)     u.b1MonthlyIncome = extractedFields.b1MonthlyIncome
          if (extractedFields?.b2MonthlyIncome)     u.b2MonthlyIncome = extractedFields.b2MonthlyIncome
          if (extractedFields?.b1Assets)            u.b1Assets = extractedFields.b1Assets
          if (extractedFields?.stage)               u.stage = extractedFields.stage as string
          if (extractedFields?.loanType)            u.loanType = extractedFields.loanType as string
          return u
        })
        const applied = Object.fromEntries(Object.entries(extractedFields || {}).filter(([, v]) => v !== null && v !== undefined))
        if (Object.keys(applied).length > 0) setLastAppliedFields(applied)
      }
    } finally {
      setGeneratingSummary(false)
    }
  }

  async function generateNextAction(silent = false) {
    if (!client) return
    setGeneratingNextAction(true)
    try {
      const res = await fetch('/api/pph/next-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: client.id }),
      })
      if (res.ok) {
        const { nextAction } = await res.json()
        setClient(prev => prev ? { ...prev, nextAction, nextActionAiGenerated: true, nextActionUpdatedAt: new Date().toISOString() } : prev)
        if (!silent) setNextActionDraft(nextAction)
      }
    } finally {
      setGeneratingNextAction(false)
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
  // Auto-generate next action if empty after client loads
  useEffect(() => {
    if (client && !client.nextAction?.trim()) {
      generateNextAction(true)
    }
  }, [client?.id]) // only fires once per client load
  useEffect(() => { fetchCalls() }, [id]) // fetch on mount for last-contact card
  useEffect(() => { if (tab === 'calls') fetchActivity() }, [tab, id])
  useEffect(() => {
    if (tab === 'scenarios') fetchScenarios()
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
      nextActionAiGenerated: (row.next_action_ai_generated as boolean) || false,
      nextActionUpdatedAt: (row.next_action_updated_at as string) || null,
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
      email: (row.email as string) || null,
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
      aiTldr: (row.ai_tldr as string) || null,
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

  async function fetchScenarios() {
    try {
      setLoadingScenarios(true)
      const res = await fetch(`/api/pph/scenarios?clientId=${id}`)
      if (res.ok) {
        const list = await res.json()
        setScenarios(list)
        // Fetch view data for each scenario in parallel
        const viewEntries = await Promise.all(
          list.map(async (s: ClientScenario) => {
            try {
              const vr = await fetch(`/api/scenario-events?pageKey=${s.slug}`)
              if (vr.ok) {
                const vd = await vr.json()
                return [s.slug, { viewCount: vd.viewCount ?? 0, lastViewed: vd.lastViewed ?? null, snapshots: vd.snapshots || [] }] as [string, ScenarioViewData]
              }
            } catch { /* ignore */ }
            return [s.slug, { viewCount: 0, lastViewed: null, snapshots: [] }] as [string, ScenarioViewData]
          })
        )
        setScenarioViews(Object.fromEntries(viewEntries))
      }
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
  async function fetchActivity() {
    try {
      setLoadingActivity(true)
      const res = await fetch(`/api/pph/activity?clientId=${id}`)
      if (res.ok) setActivityLog(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingActivity(false)
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

  const saveClientFields = useCallback(async (fields: Record<string, unknown>) => {
    setClient(prev => {
      if (!prev) return prev
      // Optimistic update — no re-render storm from API roundtrip
      const optimistic = { ...prev }
      for (const [k, v] of Object.entries(fields)) {
        // camelCase field names map directly to Client interface
        (optimistic as Record<string, unknown>)[k] = v
      }
      return optimistic
    })
    const currentId = clientRef.current?.id
    if (!currentId) return
    const res = await fetch('/api/pph/clients', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentId, ...fields }),
    })
    if (res.ok) {
      const updated = await res.json()
      setClient(mapRow(updated))
    }
  }, []) // stable ref

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
      // Prompt to update next action after every call/note log
      setShowNextActionPrompt(true)
      setNextActionDraft(client.nextAction || '')
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

  // Convert each PDF page to a JPEG image using pdfjs (browser-side)
  // This handles scanned/image-based PDFs that have no text layer
  // Convert PDF pages to JPEG images via server-side API (handles scanned PDFs)
  async function pdfToImages(file: File): Promise<{ dataUrl: string; name: string; mimeType: string }[]> {
    const arrayBuffer = await file.arrayBuffer()
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const res = await fetch('/api/pph/pdf-to-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdfBase64, fileName: file.name }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `PDF API error ${res.status}`)
    }
    const { images } = await res.json()
    return images as { dataUrl: string; name: string; mimeType: string }[]
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
    const allResults: { dataUrl: string; name: string; mimeType: string }[] = []
    for (const file of files) {
      if (file.type === 'application/pdf') {
        // Convert PDF pages to images for vision analysis (handles scanned/image PDFs)
        try {
          const pages = await pdfToImages(file)
          if (pages.length === 0) throw new Error('No pages rendered')
          allResults.push(...pages)
        } catch (err) {
          console.error('PDF→image conversion failed:', err)
          // Surface the error visibly rather than silent fallback
          allResults.push({ dataUrl: '', name: `[PDF conversion failed: ${file.name}]`, mimeType: 'text/plain' })
        }
      } else {
        const dataUrl = await readFileAsDataUrl(file)
        allResults.push({ dataUrl, name: file.name, mimeType: file.type })
      }
    }
    setAttachedFiles(prev => [...prev, ...allResults])
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

  const EARLY_STAGES = ['New Lead', 'Pre-Approved', 'Waiting']
  const isEarlyStage = EARLY_STAGES.includes(client.stage)
  const combinedIncome = (client.b1MonthlyIncome || 0) + (client.b2MonthlyIncome || 0)
  const totalAssets = (client.b1Assets || 0) + (client.b2Assets || 0)
  const totalDebt = client.liabilities.reduce((s, d) => s + (d.monthlyPayment || 0), 0)
  const dtiRatio = combinedIncome > 0 ? ((totalDebt / combinedIncome) * 100).toFixed(1) : null

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header: Name + Status Pills */}
      <div className="flex items-start gap-3">
        <Link href="/workshop/pph/opportunities" className="p-2 rounded-lg hover:bg-midnight/5 transition-colors mt-0.5 flex-shrink-0" title="Back to Pipeline">
          <ArrowLeft className="w-5 h-5 text-midnight/40" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display text-2xl text-midnight">{client.name}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STAGE_COLORS[client.stage] || 'bg-gray-100 text-gray-600'}`}>{client.stage}</span>
            {client.ficoScore && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${client.ficoScore >= 740 ? 'bg-emerald-50 text-emerald-700' : client.ficoScore >= 680 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>FICO {client.ficoScore}</span>}
            {client.targetPurchasePrice && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-midnight/5 text-midnight/60">${(client.targetPurchasePrice/1000).toFixed(0)}k</span>}
          </div>
          <div className="flex items-center gap-3 text-xs text-midnight/40 mt-1 flex-wrap">
            {client.loanType && <span className={"px-2 py-0.5 rounded-full text-xs font-semibold border " + getLoanTypeBadge(client.loanType!)}>{client.loanType}</span>}
            {client.targetArea && <span>📍 {client.targetArea}</span>}
            {client.primaryLo && <span>👤 {client.primaryLo}</span>}
            {client.phone && <a href={`tel:${client.phone}`} className="hover:text-ocean transition-colors">📞 {client.phone}</a>}
            {client.email && <a href={`mailto:${client.email}`} className="hover:text-ocean transition-colors">✉️ {client.email}</a>}
          </div>
        </div>
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

      {/* Compact status row — 4 fields only */}
      <div className="bg-cream rounded-xl px-4 py-3 border border-midnight/5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <EditableSelect field="stage" value={client.stage} options={STAGES} label="Stage" onChange={saveField} />
          <EditableSelect field="priority" value={client.priority} options={PRIORITIES} label="Priority" onChange={saveField} />
          <EditableText field="followUpDate" value={client.followUpDate} label="Follow-up" editingField={editingField} editValue={editValue} saving={saving} onStartEdit={(f,v) => { setEditingField(f); setEditValue(v) }} onSave={saveField} onCancel={() => setEditingField(null)} onEditChange={setEditValue} />
          <div>
            <EditableText field="phone" value={client.phone} label="Phone" editingField={editingField} editValue={editValue} saving={saving} onStartEdit={(f,v) => { setEditingField(f); setEditValue(v) }} onSave={saveField} onCancel={() => setEditingField(null)} onEditChange={setEditValue} />
          </div>
        </div>
      </div>

      {/* Next Action — To-Do card */}
      {(() => {
        const followUpPast = client.followUpDate && new Date(client.followUpDate + 'T12:00:00') < new Date()
        const updatedAt = client.nextActionUpdatedAt ? new Date(client.nextActionUpdatedAt) : null
        const daysSinceUpdate = updatedAt ? Math.floor((Date.now() - updatedAt.getTime()) / 86400000) : null
        const isStale = daysSinceUpdate !== null && daysSinceUpdate > 3
        const showWarning = followUpPast || isStale
        return (
          <div className={`rounded-xl border px-4 py-3 ${showWarning ? 'bg-amber-50 border-amber-200' : 'bg-cream border-midnight/5'}`}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-midnight/60 uppercase tracking-wider">Next Action</span>
                {client.nextActionAiGenerated && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-ocean/10 text-ocean uppercase tracking-wider">AI</span>
                )}
                {showWarning && (
                  <span className="text-xs text-amber-700 font-medium">
                    {followUpPast ? '⚠️ Follow-up date passed' : `⚠️ Not updated in ${daysSinceUpdate}d`}
                  </span>
                )}
              </div>
              <button
                onClick={() => generateNextAction(false)}
                disabled={generatingNextAction}
                className="text-[10px] text-midnight/30 hover:text-ocean transition-colors disabled:opacity-40 flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${generatingNextAction ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
            </div>
            {editingField === 'nextAction' ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { saveField('nextAction', editValue); setEditingField(null) } if (e.key === 'Escape') setEditingField(null) }}
                  className="flex-1 px-2 py-1 bg-white border border-ocean/40 rounded text-sm focus:outline-none"
                />
                <button onClick={() => { saveField('nextAction', editValue); setEditingField(null) }} className="px-2 py-1 bg-ocean text-white rounded text-xs">Save</button>
                <button onClick={() => setEditingField(null)} className="px-2 py-1 text-midnight/40 text-xs">✕</button>
              </div>
            ) : (
              <button
                onClick={() => { setEditingField('nextAction'); setEditValue(client.nextAction || '') }}
                className="w-full text-left"
              >
                <p className={`text-sm ${client.nextAction ? 'text-midnight font-medium' : 'text-midnight/30 italic'}`}>
                  {client.nextAction || 'No next action — tap to set or regenerate'}
                </p>
              </button>
            )}
            {client.followUpDate && !followUpPast && (
              <p className="text-[10px] text-midnight/30 mt-1">
                📅 Due {new Date(client.followUpDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            )}
          </div>
        )
      })()}

      {/* Post-call: prompt to update next action */}
      {showNextActionPrompt && (
        <div className="bg-ocean/5 border border-ocean/20 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-ocean mb-2">Update next action after this contact?</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="What needs to happen next..."
              value={nextActionDraft}
              onChange={e => setNextActionDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && nextActionDraft.trim()) {
                  saveClientFields({ nextAction: nextActionDraft, nextActionAiGenerated: false, nextActionUpdatedAt: new Date().toISOString() })
                  setShowNextActionPrompt(false)
                }
              }}
              className="flex-1 px-3 py-1.5 bg-white border border-ocean/30 rounded-lg text-sm focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => {
                if (nextActionDraft.trim()) saveClientFields({ nextAction: nextActionDraft, nextActionAiGenerated: false, nextActionUpdatedAt: new Date().toISOString() })
                setShowNextActionPrompt(false)
              }}
              className="px-3 py-1.5 bg-ocean text-white rounded-lg text-xs font-medium hover:bg-ocean/90 transition-colors"
            >Save</button>
            <button onClick={() => { generateNextAction(true); setShowNextActionPrompt(false) }}
              className="px-3 py-1.5 bg-midnight/5 text-midnight/50 rounded-lg text-xs hover:bg-midnight/10 transition-colors">
              AI Generate
            </button>
            <button onClick={() => setShowNextActionPrompt(false)} className="text-midnight/30 hover:text-midnight text-xs px-1">Skip</button>
          </div>
        </div>
      )}

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

      {/* ═══════ OVERVIEW TAB ═══════ */}
      {tab === 'overview' && (
        <div className="space-y-4">

          {/* Last Contact summary card */}
          {(() => {
            const lastLog = callLogs[0] ?? null
            const lastTouchedDate = client.lastTouched ? new Date(client.lastTouched + 'T12:00:00') : null
            const daysSince = lastTouchedDate ? Math.floor((Date.now() - lastTouchedDate.getTime()) / 86400000) : null
            const isStale = daysSince !== null && daysSince > 7
            const neverTouched = daysSince === null
            return (
              <div
                className={`rounded-xl border px-4 py-3 cursor-pointer transition-all hover:shadow-sm ${isStale || neverTouched ? 'bg-amber-50 border-amber-200' : 'bg-cream border-midnight/5'}`}
                onClick={() => setTab('calls')}
                title="View all call logs"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-midnight/60 uppercase tracking-wider">Last Contact</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isStale || neverTouched ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {neverTouched ? 'Never touched' : daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince}d ago`}
                  </span>
                </div>
                {lastLog ? (
                  <div>
                    <p className="text-sm text-midnight/80 line-clamp-2">{lastLog.notes || '(no notes)'}</p>
                    <p className="text-xs text-midnight/40 mt-1">{lastLog.call_type} · {new Date(lastLog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                ) : (
                  <p className="text-sm text-midnight/40 italic">No activity logged yet — tap to add a note.</p>
                )}
              </div>
            )
          })()}

          {/* Notes — inline click-to-edit, same style as Next Action */}
          <div className="bg-cream rounded-xl px-4 py-3 border border-midnight/5">
            <p className="text-xs font-semibold text-midnight/60 uppercase tracking-wider mb-1.5">Notes</p>
            {editingNotes ? (
              <div className="space-y-2">
                <textarea
                  autoFocus
                  value={notesDraft}
                  onChange={e => setNotesDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Escape') setEditingNotes(false) }}
                  rows={3}
                  className="w-full px-2 py-1.5 bg-white border border-ocean/40 rounded-lg text-sm focus:outline-none resize-none"
                  placeholder="Internal notes about this client..."
                />
                <div className="flex gap-2">
                  <button onClick={() => { saveClientFields({ notes: notesDraft, nextActionUpdatedAt: client.nextActionUpdatedAt }); setEditingNotes(false) }}
                    className="px-3 py-1 bg-ocean text-white rounded-lg text-xs font-medium">Save</button>
                  <button onClick={() => setEditingNotes(false)} className="text-midnight/30 hover:text-midnight text-xs px-1">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => { setNotesDraft(client.notes || ''); setEditingNotes(true) }} className="w-full text-left">
                <p className={`text-sm leading-relaxed ${client.notes ? 'text-midnight' : 'text-midnight/30 italic'}`}>
                  {client.notes || 'No notes — tap to add'}
                </p>
              </button>
            )}

          </div>

          {/* Referral context — own card, same position */}
          <div className="bg-cream rounded-xl px-4 py-3 border border-midnight/5">
            <div className="flex items-center gap-2 mb-1.5">
              <p className="text-xs font-semibold text-midnight/60 uppercase tracking-wider">Referral</p>
              {(client.referralType || client.referralName) && (
                <p className="text-[10px] text-midnight/35">
                  {[client.referralType, client.referralName, client.referralDate].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
            {editingReferralNote ? (
              <div className="flex gap-2">
                <input autoFocus type="text" value={referralNoteDraft} onChange={e => setReferralNoteDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { saveClientFields({ referralSource: referralNoteDraft }); setEditingReferralNote(false) } if (e.key === 'Escape') setEditingReferralNote(false) }}
                  className="flex-1 px-2 py-1.5 bg-white border border-ocean/40 rounded-lg text-sm focus:outline-none"
                  placeholder="Referral context, company, how you met..." />
                <button onClick={() => { saveClientFields({ referralSource: referralNoteDraft }); setEditingReferralNote(false) }} className="px-2 py-1 bg-ocean text-white rounded text-xs">Save</button>
                <button onClick={() => setEditingReferralNote(false)} className="text-midnight/30 text-xs px-1">✕</button>
              </div>
            ) : (
              <button onClick={() => { setReferralNoteDraft(client.referralSource || ''); setEditingReferralNote(true) }} className="w-full text-left">
                <p className={`text-sm ${client.referralSource ? 'text-midnight' : 'text-midnight/30 italic'}`}>
                  {client.referralSource || 'No referral context — tap to add'}
                </p>
              </button>
            )}
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
              <button onClick={refreshSummary} disabled={generatingSummary}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-midnight/5 text-midnight/50 rounded-lg text-xs hover:bg-midnight/10 transition-colors disabled:opacity-40">
                <RefreshCw className={`w-3 h-3 ${generatingSummary ? 'animate-spin' : ''}`} />
                {generatingSummary ? 'Generating…' : 'Refresh'}
              </button>
            </div>
            {client.aiTldr && (
              <div className="bg-ocean/5 border border-ocean/15 rounded-xl px-4 py-3 mb-3">
                <p className="text-xs font-semibold text-ocean/70 uppercase tracking-wider mb-1">TL;DR</p>
                <p className="text-sm font-medium text-midnight">{client.aiTldr}</p>
              </div>
            )}
            {lastAppliedFields && Object.keys(lastAppliedFields).length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 mb-3 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <div>
                  <p className="text-xs font-semibold text-emerald-700">Fields auto-populated:</p>
                  <p className="text-xs text-emerald-600 mt-0.5">{Object.entries(lastAppliedFields).map(([k, v]) => `${k}: ${v}`).join(' · ')}</p>
                </div>
              </div>
            )}
            {client.aiSummary ? (
              <>
                <p className={`text-sm text-midnight/70 leading-relaxed whitespace-pre-wrap ${!showFullSummary ? 'line-clamp-3' : ''}`}>
                  {client.aiSummary}
                </p>
                <button onClick={() => setShowFullSummary(!showFullSummary)}
                  className="mt-2 flex items-center gap-1 text-xs text-midnight/40 hover:text-midnight transition-colors">
                  {showFullSummary ? '▲ Show less' : '▼ Show more'}
                </button>
              </>
            ) : (
              <p className="text-sm text-midnight/30 italic">No summary yet — hit Refresh to generate from all data, notes, and chat history.</p>
            )}
          </div>

          {/* Contextual section by stage */}
          {isEarlyStage ? (
            <>
              {/* Referral Source — shown for new/early leads */}
              <div className="bg-cream rounded-xl p-5 border border-midnight/5">
                <h3 className="text-sm font-semibold text-midnight mb-4">Referral Source</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-midnight/40 block mb-1">Source Type</span>
                    <select value={client.referralType || ''} onChange={e => saveClientFields({ referralType: e.target.value || null })}
                      className="w-full px-2 py-1.5 bg-white border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50 text-midnight">
                      <option value="">— Select type —</option>
                      {['Realtor','Past Client','Friend / Family','Cold Lead','Partner','Online','Other'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <span className="text-xs text-midnight/40 block mb-1">Referred By</span>
                    <FieldInput type="text" placeholder="Name..." value={client.referralName} onSave={v => saveClientFields({ referralName: v || null })} className="w-full" />
                  </div>
                  <div>
                    <span className="text-xs text-midnight/40 block mb-1">Referral Date</span>
                    <FieldInput type="date" value={client.referralDate} onSave={v => saveClientFields({ referralDate: v || null })} className="w-full" />
                  </div>
                </div>
              </div>

              {/* Deal Basics — also show for early leads */}
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
            </>
          ) : (
            /* Active deal — show financial snapshot */
            <div className="bg-cream rounded-xl p-5 border border-midnight/5">
              <h3 className="text-sm font-semibold text-midnight mb-4">Deal Snapshot</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-3 border border-midnight/5 text-center">
                  <p className="text-[10px] text-midnight/40 uppercase tracking-wider mb-1">Target Price</p>
                  <p className="text-lg font-bold text-midnight">{client.targetPurchasePrice ? `$${(client.targetPurchasePrice/1000).toFixed(0)}k` : '—'}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-midnight/5 text-center">
                  <p className="text-[10px] text-midnight/40 uppercase tracking-wider mb-1">FICO</p>
                  <p className={`text-lg font-bold ${client.ficoScore ? (client.ficoScore >= 740 ? 'text-emerald-600' : client.ficoScore >= 680 ? 'text-amber-600' : 'text-red-600') : 'text-midnight/20'}`}>
                    {client.ficoScore || '—'}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-midnight/5 text-center">
                  <p className="text-[10px] text-midnight/40 uppercase tracking-wider mb-1">Monthly Income</p>
                  <p className="text-lg font-bold text-midnight">{combinedIncome > 0 ? `$${combinedIncome.toLocaleString()}` : '—'}</p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-midnight/5 text-center">
                  <p className="text-[10px] text-midnight/40 uppercase tracking-wider mb-1">DTI (Existing)</p>
                  <p className={`text-lg font-bold ${dtiRatio ? (parseFloat(dtiRatio) <= 36 ? 'text-emerald-600' : parseFloat(dtiRatio) <= 45 ? 'text-amber-600' : 'text-red-600') : 'text-midnight/20'}`}>
                    {dtiRatio ? `${dtiRatio}%` : '—'}
                  </p>
                </div>
              </div>
              {totalAssets > 0 && (
                <div className="mt-3 flex items-center gap-3 text-sm text-midnight/60">
                  <span>💰 Assets: <strong className="text-midnight">${totalAssets.toLocaleString()}</strong></span>
                  {totalDebt > 0 && <span>📊 Monthly Debts: <strong className="text-midnight">${totalDebt.toLocaleString()}</strong></span>}
                </div>
              )}
            </div>
          )}

          {/* Collapsible Financial Details */}
          <button
            onClick={() => setShowFinancials(!showFinancials)}
            className="w-full flex items-center justify-between px-5 py-3 bg-midnight/3 rounded-xl text-sm font-medium text-midnight/60 hover:bg-midnight/5 transition-colors"
          >
            <span>{showFinancials ? '▾' : '▸'} Financial Details — Borrowers, Income, Assets, Debts, REO</span>
            {combinedIncome > 0 && <span className="text-xs text-midnight/30">${combinedIncome.toLocaleString()}/mo combined</span>}
          </button>

          {showFinancials && (
            <div className="space-y-4">
              {/* Deal Basics (editable) — show here for active deals too */}
              {!isEarlyStage && (
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
              )}

              {/* Referral for active deals */}
              {!isEarlyStage && (client.referralType || client.referralName || client.referralSource) && (
                <div className="bg-cream rounded-xl p-5 border border-midnight/5">
                  <h3 className="text-sm font-semibold text-midnight mb-3">Referral Source</h3>
                  <p className="text-sm text-midnight/60">
                    {[client.referralType, client.referralName, client.referralSource].filter(Boolean).join(' · ')}
                    {client.referralDate && <span className="text-xs text-midnight/30 ml-2">({client.referralDate})</span>}
                  </p>
                </div>
              )}

              {/* Borrowers + Income */}
              <div className="bg-cream rounded-xl p-5 border border-midnight/5">
                <h3 className="text-sm font-semibold text-midnight mb-4 flex items-center gap-2">
                  Borrowers & Income
                  <label className="flex items-center gap-1.5 text-xs text-midnight/40 font-normal">
                    <input type="checkbox" checked={client.married} onChange={e => saveClientFields({ married: e.target.checked })} className="rounded" />
                    Married
                  </label>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                { label: 'Borrower 1', nameKey: 'b1Name', typeKey: 'b1IncomeType', incomeKey: 'b1MonthlyIncome', detailsKey: 'b1IncomeDetails' },
                { label: 'Borrower 2', nameKey: 'b2Name', typeKey: 'b2IncomeType', incomeKey: 'b2MonthlyIncome', detailsKey: 'b2IncomeDetails' },
              ] as const).map(({ label, nameKey, typeKey, incomeKey, detailsKey }) => (
                <BorrowerCard key={label} label={label}
                  nameKey={nameKey} typeKey={typeKey} incomeKey={incomeKey} detailsKey={detailsKey}
                  client={client as unknown as Record<string, unknown>}
                  editingField={editingField} editValue={editValue} saving={saving}
                  onStartEdit={(f,v) => { setEditingField(f); setEditValue(v) }}
                  onSave={saveField} onCancel={() => setEditingField(null)} onEditChange={setEditValue}
                  saveClientFields={saveClientFields}
                />
              ))}
            </div>
            {combinedIncome > 0 && (
              <div className="mt-3 pt-3 border-t border-midnight/8 flex gap-4 text-sm">
                <span className="text-midnight/50">Combined:</span>
                <span className="font-semibold text-midnight">${combinedIncome.toLocaleString()}/mo</span>
                <span className="text-midnight/40">${(combinedIncome * 12).toLocaleString()}/yr</span>
              </div>
            )}
          </div>

              {/* Assets */}
              <div className="bg-cream rounded-xl p-5 border border-midnight/5">
                <h3 className="text-sm font-semibold text-midnight mb-4">Assets</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[{ label: 'B1 Liquid Assets', assetsKey: 'b1Assets', notesKey: 'b1AssetsNotes' }, { label: 'B2 Liquid Assets', assetsKey: 'b2Assets', notesKey: 'b2AssetsNotes' }].map(({ label, assetsKey, notesKey }) => (
                <div key={label} className="space-y-1.5">
                <p className="text-xs font-semibold text-midnight/50 uppercase tracking-wider">{label}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-midnight/40">$</span>
                    <FieldInput type="number" placeholder="0" value={client[assetsKey as keyof Client] as number} onSave={v => saveClientFields({ [assetsKey]: parseFloat(v) || null })} className="flex-1" />
                  </div>
                  <FieldInput type="text" placeholder="Notes (checking, savings, 401k, stocks...)" value={client[notesKey as keyof Client] as string} onSave={v => saveClientFields({ [notesKey]: v })} className="w-full text-xs text-midnight/60" />
                </div>
              ))}
            </div>
            {totalAssets > 0 && (
              <div className="mt-3 pt-3 border-t border-midnight/8 flex gap-4 text-sm">
                <span className="text-midnight/50">Total assets:</span>
                <span className="font-semibold text-midnight">${totalAssets.toLocaleString()}</span>
              </div>
            )}
          </div>

              {/* Liabilities & DTI */}
              {(() => {
                const LIABILITY_TYPES: { value: Liability['type']; label: string }[] = [
                  { value: 'auto', label: '🚗 Auto Loan' },
                  { value: 'student', label: '🎓 Student Loan' },
                  { value: 'credit_card', label: '💳 Credit Card' },
                  { value: 'installment', label: '📦 Installment Loan' },
                  { value: 'other', label: '📋 Other' },
                ]
                return (
                  <div className="bg-cream rounded-xl p-5 border border-midnight/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-midnight">Liabilities & DTI</h3>
                      <LiabilityAddButton types={LIABILITY_TYPES} onAdd={entry => {
                        const newList = [...client.liabilities, { ...entry, id: `l-${Date.now()}` }]
                        saveClientFields({ liabilities: JSON.stringify(newList) })
                      }} />
                    </div>
                    {client.liabilities.length === 0 && (
                      <p className="text-xs text-midnight/30 italic">No debts recorded. Add monthly obligations to calculate DTI.</p>
                    )}
                    {client.liabilities.map(d => (
                      <div key={d.id} className="flex items-center justify-between py-2 border-b border-midnight/5 last:border-0">
                        <div>
                          <span className="text-xs font-medium text-midnight/60">{LIABILITY_TYPES.find(t => t.value === d.type)?.label || d.type}</span>
                          {d.description && <span className="text-xs text-midnight/30 ml-2">{d.description}</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          {d.balance && <span className="text-xs text-midnight/30">${d.balance.toLocaleString()} bal</span>}
                          <span className="text-sm font-semibold text-midnight">${d.monthlyPayment.toLocaleString()}/mo</span>
                          <button onClick={() => {
                            const updated = client.liabilities.filter(l => l.id !== d.id)
                            saveClientFields({ liabilities: JSON.stringify(updated) })
                          }} className="text-midnight/20 hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                    {combinedIncome > 0 && totalDebt > 0 && (
                      <div className="mt-3 pt-3 border-t border-midnight/8">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-midnight/50">Total Monthly Debts:</span>
                          <span className="font-semibold text-midnight">${totalDebt.toLocaleString()}/mo</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-midnight/50">Back-end DTI (existing debts only):</span>
                          <span className={`font-bold ${parseFloat(dtiRatio || '0') <= 36 ? 'text-emerald-600' : parseFloat(dtiRatio || '0') <= 45 ? 'text-amber-600' : 'text-red-600'}`}>{dtiRatio}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* REO */}
              <div className="bg-cream rounded-xl p-5 border border-midnight/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-midnight">Real Estate Owned</h3>
                  <button onClick={() => setShowReoForm(!showReoForm)} className="flex items-center gap-1.5 px-3 py-1.5 bg-midnight text-cream rounded-lg text-xs font-medium hover:bg-midnight/80 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Property
                  </button>
                </div>
                {client.reo.length === 0 && !showReoForm && (
                  <p className="text-xs text-midnight/30 italic">No properties recorded.</p>
                )}
                {client.reo.map(r => (
                  <div key={r.id} className="bg-white/60 rounded-xl p-3 border border-midnight/5 mb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-midnight">{r.address}</p>
                        <p className="text-xs text-midnight/40 mt-0.5">{r.propertyType} · {r.status} {r.lender && `· ${r.lender}`}</p>
                      </div>
                      <button onClick={() => removeReo(r.id)} className="text-midnight/20 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-xs text-midnight/50">
                      {r.marketValue && <span>Value: <strong className="text-midnight">${r.marketValue.toLocaleString()}</strong></span>}
                      {r.mortgageBalance && <span>Mortgage: <strong className="text-midnight">${r.mortgageBalance.toLocaleString()}</strong></span>}
                      {r.monthlyPayment && <span>Payment: <strong className="text-midnight">${r.monthlyPayment.toLocaleString()}/mo</strong></span>}
                      {r.estimatedRent && <span>Rent: <strong className="text-midnight">${r.estimatedRent.toLocaleString()}/mo</strong></span>}
                    </div>
                  </div>
                ))}
                {showReoForm && (
                  <div className="bg-white rounded-xl p-4 border border-ocean/20 space-y-3 mt-2">
                    <input placeholder="Address" value={reoForm.address || ''} onChange={e => setReoForm(p => ({...p, address: e.target.value}))} className="w-full px-2 py-1.5 border border-midnight/10 rounded text-sm focus:outline-none focus:border-ocean/50" />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs text-midnight/40 block mb-0.5">Type</span>
                        <select value={reoForm.propertyType || 'SFR'} onChange={e => setReoForm(p => ({...p, propertyType: e.target.value}))} className="w-full px-2 py-1 border border-midnight/10 rounded text-sm focus:outline-none">
                          {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <span className="text-xs text-midnight/40 block mb-0.5">Status</span>
                        <select value={reoForm.status || 'rental'} onChange={e => setReoForm(p => ({...p, status: e.target.value}))} className="w-full px-2 py-1 border border-midnight/10 rounded text-sm focus:outline-none">
                          {PROPERTY_STATUSES.map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { key: 'marketValue', label: 'Market Value' },
                        { key: 'mortgageBalance', label: 'Mortgage Balance' },
                        { key: 'monthlyPayment', label: 'Monthly Payment' },
                        { key: 'estimatedRent', label: 'Est. Rent' },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <span className="text-xs text-midnight/40 block mb-0.5">{label}</span>
                          <input type="number" placeholder="0" value={(reoForm[key as keyof typeof reoForm] as number) || ''} onChange={e => setReoForm(p => ({...p, [key]: parseFloat(e.target.value) || null}))} className="w-full px-2 py-1 border border-midnight/10 rounded text-sm focus:outline-none" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="text-xs text-midnight/40 block mb-0.5">Lender</span>
                      <input type="text" placeholder="Chase, BofA..." value={reoForm.lender || ''} onChange={e => setReoForm(p => ({...p, lender: e.target.value}))} className="w-full px-2 py-1 border border-midnight/10 rounded text-sm focus:outline-none" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setShowReoForm(false)} className="px-3 py-1.5 text-xs text-midnight/40 hover:text-midnight transition-colors">Cancel</button>
                      <button onClick={addReo} disabled={!reoForm.address?.trim()} className="px-3 py-1.5 bg-ocean text-white rounded-lg text-xs font-medium hover:bg-ocean/90 disabled:opacity-40 transition-colors">Add Property</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════ ACTIVITY TAB ═══════ */}
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
          {/* Activity History */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-midnight mb-3 flex items-center gap-2">
              <span>📋</span> Field Change History
            </h3>
            {loadingActivity ? (
              <p className="text-xs text-midnight/40">Loading...</p>
            ) : activityLog.length === 0 ? (
              <p className="text-xs text-midnight/40 italic">No field changes recorded yet. Changes to stage, follow-up date, income, and other fields will appear here.</p>
            ) : (
              <div className="space-y-1.5">
                {activityLog.map(entry => (
                  <div key={entry.id} className="flex items-start gap-3 py-2 border-b border-midnight/5 last:border-0">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-midnight">{entry.field}</span>
                      <span className="text-xs text-midnight/40 mx-1.5">·</span>
                      {entry.old_value ? (
                        <span className="text-xs text-midnight/40 line-through mr-1.5">{entry.old_value}</span>
                      ) : null}
                      <span className="text-xs text-midnight/80">{entry.new_value ?? '—'}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-midnight/30">
                        {new Date(entry.ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
                        {new Date(entry.ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ═══════ SCENARIOS TAB ═══════ */}
      {tab === 'scenarios' && (
        <div className="space-y-4">
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Link href={`/workshop/pph/purchase-builder?client=${client.id}&name=${encodeURIComponent(client.name)}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Purchase Scenario
            </Link>
            <Link href={`/workshop/pph/refi-builder?client=${client.id}&name=${encodeURIComponent(client.name)}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-midnight/80 text-cream rounded-lg text-sm font-medium hover:bg-midnight/70 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Refi Scenario
            </Link>
            <button onClick={() => setTab('chat')}
              className="flex items-center gap-1.5 px-4 py-2 bg-midnight/5 text-midnight/60 rounded-lg text-sm font-medium hover:bg-midnight/10 transition-colors">
              <MessageSquare className="w-3.5 h-3.5" /> Ask PPH-Claw
            </button>
          </div>

          {/* Scenario cards */}
          {loadingScenarios && <div className="text-center py-8"><RefreshCw className="w-5 h-5 text-ocean animate-spin mx-auto" /></div>}

          {!loadingScenarios && scenarios.length === 0 && (
            <div className="text-center py-8 space-y-1">
              <p className="text-2xl">📊</p>
              <p className="text-midnight/40 text-sm font-medium">No scenarios yet</p>
              <p className="text-midnight/25 text-xs">Create one above or ask PPH-Claw to generate one in chat</p>
            </div>
          )}

          {scenarios.map(s => {
            const views = scenarioViews[s.slug]
            const isInteractive = s.isInteractive
            const isHtml = s.type === 'html'
            // Always use the Kanons /clients/purchase/[slug] wrapper — it handles iframe rendering internally
            const openUrl = s.publicUrl.startsWith('http') ? s.publicUrl : `https://kyle.palaniuk.net${s.publicUrl}`
            return (
              <div key={s.slug} className={`bg-white rounded-xl border overflow-hidden ${isInteractive ? 'border-ocean/20' : isHtml ? 'border-amber-200' : 'border-midnight/10'}`}>
                <div className={`px-5 py-4 ${isInteractive ? 'bg-ocean/5 border-b border-ocean/10' : isHtml ? 'bg-amber-50/60 border-b border-amber-100' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {isInteractive && <span className="text-xs font-bold text-ocean uppercase tracking-wider">Interactive</span>}
                        {isHtml && <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Agent Built</span>}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${isInteractive ? 'bg-ocean/10 text-ocean' : isHtml ? 'bg-amber-100 text-amber-700' : 'bg-midnight/5 text-midnight/50'}`}>
                          {s.type === 'interactive' ? 'Live' : s.type === 'purchase-grid' ? 'Purchase' : s.type === 'html' ? 'HTML Tool' : s.type}
                        </span>
                        {views && views.viewCount > 0 && (
                          <span className="text-[10px] text-midnight/30">
                            👁 {views.viewCount} view{views.viewCount !== 1 ? 's' : ''}
                            {views.lastViewed && <> · last {new Date(views.lastViewed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-midnight">{s.label}</p>
                      {s.description && <p className="text-xs text-midnight/50 mt-1">{s.description}</p>}
                      <p className="text-[10px] text-midnight/30 mt-1">
                        Created {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 flex items-center gap-2">
                  <a href={openUrl} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${isInteractive ? 'bg-ocean text-white hover:bg-ocean/90' : isHtml ? 'bg-amber-500 text-white hover:bg-amber-400' : 'bg-midnight/5 text-midnight/60 hover:bg-midnight/10'}`}>
                    {isInteractive ? 'Open Page ↗' : isHtml ? 'Open Tool ↗' : 'View ↗'}
                  </a>
                  <button onClick={() => navigator.clipboard.writeText(openUrl)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-midnight/5 text-midnight/60 rounded-lg text-xs font-medium hover:bg-midnight/10 transition-colors">
                    🔗 Copy Link
                  </button>
                </div>

                {/* Snapshots (client-saved scenarios) */}
                {views && views.snapshots.length > 0 && (
                  <div className="px-5 pb-4 space-y-2 border-t border-midnight/8 pt-4">
                    <p className="text-xs font-semibold text-midnight/40 uppercase tracking-wider">Client Snapshots — what they saved</p>
                    {views.snapshots.map((snap, i) => (
                      <div key={snap.id} className="bg-[#f8f7f4] rounded-xl p-3 border border-midnight/5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-midnight/60">Snapshot #{views.snapshots.length - i}</span>
                          <span className="text-[10px] text-midnight/30">
                            {new Date(snap.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-midnight/60 mb-1.5">
                          {snap.data.purchasePrice && <span>Price: <strong className="text-midnight">${Math.round(snap.data.purchasePrice / 1000)}k</strong></span>}
                          {snap.data.downPct && <span>Down: <strong className="text-midnight">{snap.data.downPct}%</strong></span>}
                          {snap.data.total && <span>Payment: <strong className="text-midnight">${Math.round(snap.data.total).toLocaleString()}/mo</strong></span>}
                          {snap.data.backDTI && <span>DTI: <strong className="text-midnight">{snap.data.backDTI.toFixed(1)}%</strong></span>}
                        </div>
                        {snap.note && <p className="text-xs text-midnight italic border-l-2 border-ocean/30 pl-2">&ldquo;{snap.note}&rdquo;</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ═══════ CHAT TAB ═══════ */}
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
