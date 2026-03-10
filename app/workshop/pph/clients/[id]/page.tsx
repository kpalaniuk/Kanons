'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
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

const STAGES = ['New Lead', 'Pre-Approved', 'In Process', 'Waiting', 'App Sent', 'Processing', 'Closing', 'Closed', 'Lost']
const PRIORITIES = ['Hot', 'Active', 'Warm', 'Monitoring']
const LO_OPTIONS = ['Kyle', 'Jim', 'Anthony']
const CALL_TYPES = ['Call', 'Text', 'Email', 'In Person', 'Note']

const TABS = ['overview', 'calls', 'scenarios', 'chat'] as const
type Tab = typeof TABS[number]

export default function ClientProfilePage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') as Tab) || 'overview'

  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>(initialTab)
  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [loadingCalls, setLoadingCalls] = useState(false)

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
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchClient() }, [id])
  useEffect(() => { if (tab === 'calls') fetchCalls() }, [tab, id])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])

  async function fetchClient() {
    try {
      const res = await fetch('/api/pipeline')
      if (!res.ok) throw new Error('Failed')
      const all: Client[] = await res.json()
      const found = all.find(c => c.id === id)
      setClient(found || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
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
      const res = await fetch('/api/pipeline', {
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
          notionClientId: client.id,
          clientName: client.name,
          callType: logType,
          notes: logNotes,
        }),
      })
      await fetch('/api/pipeline', {
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

  async function sendChat() {
    if (!chatInput.trim() || !client) return
    const userMsg: ChatMessage = { role: 'user', content: chatInput }
    const newMessages = [...chatMessages, userMsg]
    setChatMessages(newMessages)
    setChatInput('')
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
        body: JSON.stringify({ messages: newMessages, clientContext }),
      })
      if (res.ok) {
        const data = await res.json()
        setChatMessages([...newMessages, { role: 'assistant', content: data.content }])
      }
    } catch (err) {
      console.error(err)
      setChatMessages([...newMessages, { role: 'assistant', content: 'Error connecting to PPH-Claw. Try again.' }])
    } finally {
      setChatLoading(false)
    }
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

  function EditableSelect({ field, value, options, label }: { field: string; value: string | null; options: string[]; label: string }) {
    return (
      <div>
        <span className="text-xs text-midnight/40 block mb-0.5">{label}</span>
        <select
          value={value || ''}
          onChange={e => saveField(field, e.target.value)}
          className="px-2 py-1 bg-cream border border-midnight/10 rounded text-sm w-full focus:outline-none focus:border-ocean/50"
        >
          <option value="">—</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    )
  }

  function EditableText({ field, value, label }: { field: string; value: string | null; label: string }) {
    if (editingField === field) {
      return (
        <div>
          <span className="text-xs text-midnight/40 block mb-0.5">{label}</span>
          <div className="flex items-center gap-1">
            <input
              type={field === 'followUpDate' ? 'date' : 'text'}
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              className="flex-1 px-2 py-1 bg-cream border border-ocean/50 rounded text-sm focus:outline-none"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') saveField(field, editValue); if (e.key === 'Escape') setEditingField(null) }}
            />
            <button onClick={() => saveField(field, editValue)} className="p-1 text-ocean hover:bg-ocean/10 rounded" disabled={saving}>
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setEditingField(null)} className="p-1 text-midnight/30 hover:bg-midnight/5 rounded">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )
    }
    return (
      <div
        className="cursor-pointer group"
        onClick={() => { setEditingField(field); setEditValue(value || '') }}
      >
        <span className="text-xs text-midnight/40 block mb-0.5">{label}</span>
        <span className="text-sm text-midnight flex items-center gap-1">
          {value || <span className="text-midnight/20">—</span>}
          <Edit3 className="w-3 h-3 text-midnight/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
        <EditableSelect field="stage" value={client.stage} options={STAGES} label="Stage" />
        <EditableSelect field="priority" value={client.priority} options={PRIORITIES} label="Priority" />
        <EditableSelect field="primaryLo" value={client.primaryLo} options={LO_OPTIONS} label="Primary LO" />
        <EditableText field="primaryContact" value={client.primaryContact} label="Primary Contact" />
        <EditableText field="phone" value={client.phone} label="Phone" />
        <EditableText field="followUpDate" value={client.followUpDate} label="Follow-up Date" />
        <EditableText field="nextAction" value={client.nextAction} label="Next Action" />
        <EditableText field="notes" value={client.notes} label="Notes" />
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
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Quick note..."
                value={logNotes}
                onChange={e => setLogNotes(e.target.value)}
                className="flex-1 px-3 py-2 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50"
                onKeyDown={e => { if (e.key === 'Enter') logCall() }}
              />
              <button
                onClick={logCall}
                disabled={submittingLog}
                className="px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors disabled:opacity-50"
              >
                {submittingLog ? '...' : 'Log'}
              </button>
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
                  {log.notes && <p className="text-sm text-midnight/70">{log.notes}</p>}
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
          <p className="text-center py-8 text-midnight/30 text-sm">
            Scenarios created for this client will appear here.
            <br />
            <Link href={`/workshop/pph/purchase-builder?client=${client.id}&name=${encodeURIComponent(client.name)}`} className="text-ocean hover:underline">
              Create one now →
            </Link>
          </p>
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
          <div className="border-t border-midnight/10 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Ask about ${client.name}...`}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() } }}
                className="flex-1 px-3 py-2 bg-white border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50"
                disabled={chatLoading}
              />
              <button
                onClick={sendChat}
                disabled={chatLoading || !chatInput.trim()}
                className="px-3 py-2 bg-ocean text-white rounded-lg hover:bg-ocean/90 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
