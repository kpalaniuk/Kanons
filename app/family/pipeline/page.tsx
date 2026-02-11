'use client'

import { useState, useMemo, useEffect } from 'react'

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
  
  if (diff < 0) return 'text-red-600 font-semibold' // overdue
  if (diff === 0) return 'text-amber-600 font-semibold' // today
  return 'text-emerald-600' // future
}

export default function PipelinePage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedClient, setExpandedClient] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [editingField, setEditingField] = useState<{ clientId: string; field: 'nextAction' | 'notes'; value: string } | null>(null)

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

      // Update local state
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    } catch (error) {
      console.error('Error updating client:', error)
      alert('Failed to update client. Please try again.')
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

  function handleFieldEdit(clientId: string, field: 'nextAction' | 'notes', currentValue: string) {
    setEditingField({ clientId, field, value: currentValue })
  }

  function handleFieldSave() {
    if (!editingField) return
    
    const { clientId, field, value } = editingField
    updateClient(clientId, { 
      [field]: value,
      lastTouched: new Date().toISOString().split('T')[0]
    })
    setEditingField(null)
  }

  function handleFieldCancel() {
    setEditingField(null)
  }

  // Filter clients
  const filteredClients = useMemo(() => {
    let result = clients

    if (filterStatus !== 'all') {
      result = result.filter(c => c.stage === filterStatus)
    }

    if (filterPriority !== 'all') {
      result = result.filter(c => c.priority === filterPriority)
    }

    return result
  }, [clients, filterStatus, filterPriority])

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

  const ClientCard = ({ client }: { client: Client }) => {
    const isExpanded = expandedClient === client.id
    const statusStyle = STATUS_COLORS[client.stage]
    const priorityStyle = PRIORITY_COLORS[client.priority]
    const daysSinceUpdate = client.lastTouched 
      ? Math.floor((new Date().getTime() - new Date(client.lastTouched).getTime()) / (1000 * 60 * 60 * 24))
      : 999
    const isStale = daysSinceUpdate > 7

    const isEditingNextAction = editingField?.clientId === client.id && editingField.field === 'nextAction'
    const isEditingNotes = editingField?.clientId === client.id && editingField.field === 'notes'

    return (
      <div
        className={`bg-cream rounded-xl border-2 ${statusStyle.border} hover:shadow-md transition-all`}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display text-lg font-bold text-midnight truncate">
                  {client.name}
                </h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${priorityStyle.bg} ${priorityStyle.text} ring-1 ${priorityStyle.ring}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
                  {client.priority}
                </span>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleStatusCycle(client)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${statusStyle.bg} ${statusStyle.text} hover:opacity-80 transition-opacity cursor-pointer`}
                  title="Click to cycle status"
                >
                  {client.stage}
                </button>
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
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
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

          {/* Follow Up Date */}
          {client.followUpDate && (
            <div className="mb-3">
              <div className="text-[10px] uppercase tracking-wider text-midnight/40 mb-1">Follow Up</div>
              <div className={`text-sm font-medium ${getFollowUpColor(client.followUpDate)}`}>
                📅 {getRelativeTime(client.followUpDate)} 
                {new Date(client.followUpDate) < new Date() && ' (OVERDUE)'}
              </div>
            </div>
          )}

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
              {/* Notes - Inline Editable */}
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
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl text-midnight mb-1">Client Pipeline</h1>
        <p className="text-midnight/50 text-sm">Mortgage client tracker — who needs what, when</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
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

          {/* View Mode Toggle */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-ocean text-white' : 'bg-cream text-midnight/40 hover:text-midnight'
              }`}
              title="List view"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'kanban' ? 'bg-ocean text-white' : 'bg-cream text-midnight/40 hover:text-midnight'
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
      {viewMode === 'list' ? (
        // List View
        <div className="space-y-6">
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
        </div>
      ) : (
        // Kanban View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {STATUS_ORDER.slice(0, 5).map(status => {
            const group = groupedClients[status] || []
            const statusStyle = STATUS_COLORS[status]

            return (
              <div
                key={status}
                className="bg-midnight/5 rounded-xl p-4 min-h-[400px]"
              >
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

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="bg-cream rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📋</span>
          </div>
          <h2 className="font-display text-xl text-midnight mb-2">No clients found</h2>
          <p className="text-midnight/50 text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}
