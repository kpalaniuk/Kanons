'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PPHNav } from '../../_components/PPHNav'
import {
  ArrowLeft, Phone, MessageSquare, FileText, Save, Send,
  Plus, User, Calendar, Clock, Edit3, Check, X, RefreshCw
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
  primaryLo: string | null
  primaryContact: string | null
  phone: string | null
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

const STAGES = ['New Lead', 'Pre-Approved', 'In Process', 'Waiting', 'App Sent', 'Processing', 'Closing', 'Closed', 'Lost']
const PRIORITIES = ['Hot', 'Active', 'Warm', 'Monitoring']
const LO_OPTIONS = ['Kyle', 'Jim', 'Anthony']
const CALL_TYPES = ['Call', 'Text', 'Email', 'In Person', 'Note']

const TABS = ['overview', 'calls', 'scenarios', 'chat'] as const
type Tab = typeof TABS[number]

// ── Module-level components (NOT inside the page fn) to prevent remount on re-render ──

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

  // Edit states
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)

  // Log call
  const [logType, setLogType] = useState('Call')
  const [logNotes, setLogNotes] = useState('')
  const [submittingLog, setSubmittingLog] = useState(false)

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [pastedImage, setPastedImage] = useState<string | null>(null) // base64 data URL
  const [pendingScenario, setPendingScenario] = useState<Record<string, unknown> | null>(null)
  const [savingScenario, setSavingScenario] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchClient() }, [id])
  useEffect(() => { if (tab === 'calls') fetchCalls() }, [tab, id])
  useEffect(() => { if (tab === 'scenarios') fetchScenarios() }, [tab, id])
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
      primaryLo: (row.primary_lo as string) || null,
      primaryContact: (row.primary_contact as string) || null,
      phone: (row.phone as string) || null,
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
      if (res.ok) setScenarios(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingScenarios(false)
    }
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

  function handleChatPaste(e: React.ClipboardEvent) {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (!file) continue
        const reader = new FileReader()
        reader.onload = () => setPastedImage(reader.result as string)
        reader.readAsDataURL(file)
        break
      }
    }
  }

  async function sendChat() {
    if (!chatInput.trim() && !pastedImage) return
    if (!client) return
    const content = chatInput.trim() || '(see attached image)'
    const userMsg: ChatMessage = { role: 'user', content: pastedImage ? `${content}\n[Image attached]` : content }
    const newMessages = [...chatMessages, userMsg]
    setChatMessages(newMessages)
    setChatInput('')
    setPastedImage(null)
    setChatLoading(true)
    try {
      const clientContext = {
        name: client.name,
        stage: client.stage,
        priority: client.priority,
        loanType: client.loanType,
        loanAmount: client.loanAmount,
        nextAction: client.nextAction,
        notes: client.notes,
        primaryLo: client.primaryLo,
        primaryContact: client.primaryContact,
        followUpDate: client.followUpDate,
        referralSource: client.referralSource,
        recentCalls: callLogs.slice(0, 10).map(c => ({
          type: c.call_type,
          notes: c.notes,
          date: c.created_at,
          by: c.logged_by_email,
        })),
      }
      const res = await fetch('/api/pph/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, clientContext, imageBase64: pastedImage || undefined }),
      })
      if (res.ok) {
        const data = await res.json()
        const assistantContent: string = data.content || 'No response'

        // Detect scenario JSON block
        const scenarioMatch = assistantContent.match(/```scenario\n([\s\S]*?)```/)
        if (scenarioMatch) {
          try {
            const parsed = JSON.parse(scenarioMatch[1])
            setPendingScenario({ ...parsed, notionClientId: client.id, clientName: client.name })
          } catch { /* ignore parse error */ }
        }

        setChatMessages([...newMessages, { role: 'assistant', content: assistantContent }])
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
      <div className="flex items-center gap-3">
        <Link href="/workshop/pph/opportunities" className="p-2 rounded-lg hover:bg-midnight/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-midnight/40" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl text-midnight">{client.name}</h1>
          <div className="flex items-center gap-3 text-xs text-midnight/50 mt-0.5">
            {client.loanType && <span>{client.loanType}</span>}
            {client.loanAmount && <span>${(client.loanAmount / 1000).toFixed(0)}k</span>}
            {client.referralSource && <span>via {client.referralSource}</span>}
          </div>
        </div>
      </div>

      {/* Header fields grid */}
      <div className="bg-cream rounded-xl p-4 border border-midnight/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <EditableSelect field="stage" value={client.stage} options={STAGES} label="Stage" onChange={saveField} />
        <EditableSelect field="priority" value={client.priority} options={PRIORITIES} label="Priority" onChange={saveField} />
        <EditableSelect field="primaryLo" value={client.primaryLo} options={LO_OPTIONS} label="Primary LO" onChange={saveField} />
        <EditableText field="primaryContact" value={client.primaryContact} label="Primary Contact" editingField={editingField} editValue={editValue} saving={saving} onStartEdit={(f,v) => { setEditingField(f); setEditValue(v) }} onSave={saveField} onCancel={() => setEditingField(null)} onEditChange={setEditValue} />
        <EditableText field="phone" value={client.phone} label="Phone" editingField={editingField} editValue={editValue} saving={saving} onStartEdit={(f,v) => { setEditingField(f); setEditValue(v) }} onSave={saveField} onCancel={() => setEditingField(null)} onEditChange={setEditValue} />
        <EditableText field="followUpDate" value={client.followUpDate} label="Follow-up Date" editingField={editingField} editValue={editValue} saving={saving} onStartEdit={(f,v) => { setEditingField(f); setEditValue(v) }} onSave={saveField} onCancel={() => setEditingField(null)} onEditChange={setEditValue} />
        <EditableText field="nextAction" value={client.nextAction} label="Next Action" editingField={editingField} editValue={editValue} saving={saving} onStartEdit={(f,v) => { setEditingField(f); setEditValue(v) }} onSave={saveField} onCancel={() => setEditingField(null)} onEditChange={setEditValue} />
        <EditableText field="notes" value={client.notes} label="Notes" editingField={editingField} editValue={editValue} saving={saving} onStartEdit={(f,v) => { setEditingField(f); setEditValue(v) }} onSave={saveField} onCancel={() => setEditingField(null)} onEditChange={setEditValue} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-midnight/10">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-[1px] ${
              tab === t ? 'text-ocean border-ocean' : 'text-midnight/40 border-transparent hover:text-midnight/70'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="bg-cream rounded-xl p-5 border border-midnight/5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-midnight mb-1">Notes</h3>
            <p className="text-sm text-midnight/70 whitespace-pre-wrap">{client.notes || 'No notes yet.'}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-midnight mb-1">Next Action</h3>
            <p className="text-sm text-midnight/70">{client.nextAction || 'None set.'}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Link
              href={`/workshop/pph/purchase-builder?client=${client.id}&name=${encodeURIComponent(client.name)}`}
              className="flex items-center gap-2 px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors"
            >
              <FileText className="w-4 h-4" /> Run Scenario
            </Link>
            <button
              onClick={() => setTab('chat')}
              className="flex items-center gap-2 px-4 py-2 bg-midnight text-cream rounded-lg text-sm font-medium hover:bg-midnight/80 transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Ask PPH-Claw
            </button>
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
            <p className="text-center py-8 text-midnight/30 text-sm">No contact history yet.</p>
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
          {loadingScenarios ? (
            <div className="text-center py-8"><RefreshCw className="w-5 h-5 text-ocean animate-spin mx-auto" /></div>
          ) : scenarios.length === 0 ? (
            <div className="text-center py-8 text-midnight/30 text-sm">
              No scenarios saved for {client.name} yet.
              <br />
              <Link href={`/workshop/pph/purchase-builder?client=${client.id}&name=${encodeURIComponent(client.name)}`} className="text-ocean hover:underline mt-1 block">
                Build one now →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {scenarios.map(s => (
                <div key={s.slug} className="bg-cream rounded-lg p-4 border border-midnight/5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-midnight">{s.type === 'purchase-grid' ? 'Purchase Scenario' : s.type}</p>
                    <p className="text-xs text-midnight/40 mt-0.5">
                      {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={s.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs text-ocean border border-ocean/30 rounded-lg hover:bg-ocean/5 transition-colors"
                    >
                      View
                    </a>
                    <button
                      onClick={() => { navigator.clipboard.writeText(`kyle.palaniuk.net${s.publicUrl}`) }}
                      className="px-3 py-1.5 text-xs text-midnight/50 border border-midnight/10 rounded-lg hover:bg-midnight/5 transition-colors"
                    >
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
        <div className="bg-cream rounded-xl border border-midnight/5 flex flex-col" style={{ height: '500px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 && (
              <div className="text-center py-8 text-midnight/30 text-sm">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-midnight/15" />
                <p>Ask PPH-Claw anything about {client.name}.</p>
                <p className="text-xs mt-1">Income calc · UW questions · FHA/Conv/VA qualify · Scenario creation</p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
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

          {/* Input */}
          <div className="border-t border-midnight/10 p-3 space-y-2">
            {pendingScenario && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">📊 Scenario ready to save</p>
                    <p className="text-xs text-emerald-600 mt-0.5 font-medium">
                      {String(pendingScenario.type ?? 'purchase').replace('-', ' ')} · ${Number(pendingScenario.purchasePrice || 0).toLocaleString()} · {String(pendingScenario.downPaymentPct ?? '')}% down · {String(pendingScenario.interestRate ?? '')}%
                    </p>
                    {!!pendingScenario.notes && (
                      <p className="text-xs text-emerald-600/80 mt-1 italic">{String(pendingScenario.notes)}</p>
                    )}
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
            {pastedImage && (
              <div className="relative w-fit">
                <img src={pastedImage} alt="pasted" className="max-h-24 rounded-lg border border-midnight/10 object-contain" />
                <button
                  onClick={() => setPastedImage(null)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-midnight text-cream rounded-full flex items-center justify-center hover:bg-midnight/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="flex gap-2 items-end">
              <textarea
                placeholder={`Ask about ${client.name}... (paste screenshots to analyze income docs)`}
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
                disabled={chatLoading || (!chatInput.trim() && !pastedImage)}
                className="px-3 py-2 bg-ocean text-white rounded-lg hover:bg-ocean/90 transition-colors disabled:opacity-50 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-midnight/30">Paste a screenshot to analyze income docs · Shift+Enter for new line</p>
          </div>
        </div>
      )}
    </div>
  )
}
