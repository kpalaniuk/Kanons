'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Client {
  id: string
  name: string
  status: 'Lead' | 'Pre-Approved' | 'In Process' | 'Waiting' | 'Closing' | 'Closed' | 'Lost'
  priority: 'Hot' | 'Active' | 'Monitoring'
  loanType: 'Purchase' | 'Refinance' | 'DSCR' | 'Other' | null
  contacts: string[]
  rate: string | null
  nextAction: string
  lastUpdate: string
  notes: string
}

const INITIAL_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Ian Englund',
    status: 'In Process',
    priority: 'Hot',
    loanType: 'Purchase',
    contacts: [],
    rate: '6.124% (~$3k cost)',
    nextAction: 'Monitor credit bureau update',
    lastUpdate: new Date().toISOString().split('T')[0],
    notes: 'Locked file. Appraisal ordered. Currently 759 score, 6.124% rate with ~$3k cost. Waiting on credit bureau to update with new authorized user credit card. Once 760+, should flip to rebate.',
  },
  {
    id: '2',
    name: 'Jay Lin',
    status: 'Waiting',
    priority: 'Hot',
    loanType: 'Refinance',
    contacts: ['Tax Attorney'],
    rate: null,
    nextAction: 'Follow up with tax attorney',
    lastUpdate: new Date().toISOString().split('T')[0],
    notes: 'Waiting on tax attorney to confirm deed of trust filed on property. Once filed, refi goes into process.',
  },
  {
    id: '3',
    name: 'Derek Armenta',
    status: 'Lead',
    priority: 'Active',
    loanType: null,
    contacts: [],
    rate: null,
    nextAction: 'Find out who Derek is and get details',
    lastUpdate: new Date().toISOString().split('T')[0],
    notes: 'Need to identify who Derek Armenta is. May be connected to Noah\'s friend (see separate entry). Follow up on applications.',
  },
  {
    id: '4',
    name: 'Jeffrey & Hannah Domenech',
    status: 'Pre-Approved',
    priority: 'Active',
    loanType: null,
    contacts: [],
    rate: null,
    nextAction: 'Check-in call/text',
    lastUpdate: new Date().toISOString().split('T')[0],
    notes: 'Pre-approved. Need to stay in regular contact.',
  },
  {
    id: '5',
    name: 'David Rossi',
    status: 'In Process',
    priority: 'Hot',
    loanType: 'DSCR',
    contacts: ['Kevin Christiansen (AMC Rep)'],
    rate: null,
    nextAction: 'Follow up with Kevin Christiansen on rent data',
    lastUpdate: new Date().toISOString().split('T')[0],
    notes: 'Working with Kevin Christiansen (AMC Rep) on appraisal rent data estimates. Need data to confirm DSCR deal works, then build rate calculator.',
  },
  {
    id: '6',
    name: 'Nate & Lexie Ayers',
    status: 'Waiting',
    priority: 'Monitoring',
    loanType: 'Purchase',
    contacts: ['Lexie Ayers (spouse)'],
    rate: null,
    nextAction: 'Warm check-in in 3-4 weeks (early March) — empathetic, no pressure',
    lastUpdate: new Date().toISOString().split('T')[0],
    notes: 'Looking for down payment assistance program. Hit unexpected financial changes and paused home search. Last message: "Hey Kyle, we\'ve just had some unexpected changes in our current financial circumstances and are going to have to stop our home search for now. Sorry for not getting back to you earlier, things have been hectic. We appreciate your assistance thus far."\n\n--- Strategy ---\nDon\'t push — they\'re dealing with something. Plan:\n1. Wait 3-4 weeks, then send a warm check-in (early March)\n2. Keep it human: "Hey Nate, no rush at all — just wanted to check in and see how things are going"\n3. If they re-engage, explore DPA programs that might help with their new circumstances\n4. If still paused, check in again in 2 months (April)\n5. Keep them on the Tue/Thu pipeline review as Monitoring priority',
  },
  {
    id: '7',
    name: "Noah's Friend (possibly Derek?)",
    status: 'Lead',
    priority: 'Active',
    loanType: null,
    contacts: ['Noah'],
    rate: null,
    nextAction: 'Confirm identity — may be Derek Armenta',
    lastUpdate: new Date().toISOString().split('T')[0],
    notes: 'Referred by Noah. May overlap with Derek Armenta — Kyle to clarify.',
  },
]

const STATUS_ORDER = ['Lead', 'Pre-Approved', 'In Process', 'Waiting', 'Closing', 'Closed', 'Lost']

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Lead: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
  'Pre-Approved': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'In Process': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Waiting: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Closing: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Closed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  Lost: { bg: 'bg-red-50', text: 'text-red-400', border: 'border-red-200' },
}

const PRIORITY_COLORS: Record<string, { bg: string; text: string; dot: string; ring: string }> = {
  Hot: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', ring: 'ring-red-200' },
  Active: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', ring: 'ring-orange-200' },
  Monitoring: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', ring: 'ring-emerald-200' },
}

const LOAN_TYPE_ICONS: Record<string, string> = {
  Purchase: '🏡',
  Refinance: '🔄',
  DSCR: '📊',
  Other: '📋',
}

function getLastChecked(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function PipelinePage() {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS)
  const [expandedClient, setExpandedClient] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [updateInput, setUpdateInput] = useState<{ clientId: string; text: string } | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

  // Filter clients
  const filteredClients = useMemo(() => {
    let result = clients

    if (filterStatus !== 'all') {
      result = result.filter(c => c.status === filterStatus)
    }

    if (filterPriority !== 'all') {
      result = result.filter(c => c.priority === filterPriority)
    }

    return result
  }, [clients, filterStatus, filterPriority])

  // Group by status
  const groupedClients = useMemo(() => {
    return filteredClients.reduce<Record<string, Client[]>>((acc, client) => {
      if (!acc[client.status]) acc[client.status] = []
      acc[client.status].push(client)
      return acc
    }, {})
  }, [filteredClients])

  // Stats
  const stats = useMemo(() => {
    const hot = clients.filter(c => c.priority === 'Hot' && c.status !== 'Closed' && c.status !== 'Lost').length
    const active = clients.filter(c => c.status !== 'Closed' && c.status !== 'Lost').length
    const waiting = clients.filter(c => c.status === 'Waiting').length
    
    return { hot, active, waiting }
  }, [clients])

  const handleUpdate = (clientId: string) => {
    if (!updateInput?.text.trim()) return

    const timestamp = new Date().toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit' 
    })
    
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          notes: `${c.notes}\n\n[${timestamp}] ${updateInput.text}`,
          lastUpdate: new Date().toISOString().split('T')[0],
        }
      }
      return c
    }))

    setUpdateInput(null)
  }

  const ClientCard = ({ client }: { client: Client }) => {
    const isExpanded = expandedClient === client.id
    const statusStyle = STATUS_COLORS[client.status]
    const priorityStyle = PRIORITY_COLORS[client.priority]
    const daysSinceUpdate = Math.floor(
      (new Date().getTime() - new Date(client.lastUpdate).getTime()) / (1000 * 60 * 60 * 24)
    )
    const isStale = daysSinceUpdate > 7

    return (
      <motion.div
        layout={updateInput?.clientId !== client.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
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
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                  {client.status}
                </span>
                {client.loanType && (
                  <span className="inline-flex items-center gap-1 text-xs text-midnight/60">
                    {LOAN_TYPE_ICONS[client.loanType]} {client.loanType}
                  </span>
                )}
                {client.rate && (
                  <span className="inline-flex items-center gap-1 text-xs text-midnight/60">
                    💰 {client.rate}
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

          {/* Next Action */}
          <div className="mb-3">
            <div className="text-[10px] uppercase tracking-wider text-midnight/40 mb-1">Next Action</div>
            <div className="flex items-start gap-2">
              <span className="text-ocean mt-0.5">→</span>
              <span className="text-sm font-medium text-midnight flex-1">{client.nextAction}</span>
            </div>
          </div>

          {/* Contacts */}
          {client.contacts.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-[10px] uppercase tracking-wider text-midnight/40">Contacts:</span>
              {client.contacts.map((contact, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-midnight/5 rounded text-xs text-midnight/70">
                  👤 {contact}
                </span>
              ))}
            </div>
          )}

          {/* Last Update */}
          <div className={`flex items-center gap-1.5 text-[11px] ${isStale ? 'text-amber-600' : 'text-midnight/40'}`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last updated {getLastChecked(client.lastUpdate)}
            {isStale && ' ⚠️'}
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              layout={false}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t-2 border-midnight/5"
            >
              <div className="p-4 space-y-4">
                {/* Notes / Timeline */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-midnight/40 mb-2">Notes & Timeline</div>
                  <div className="bg-midnight/5 rounded-lg p-3">
                    <pre className="text-sm text-midnight/80 whitespace-pre-wrap font-body leading-relaxed">
                      {client.notes}
                    </pre>
                  </div>
                </div>

                {/* Quick Update */}
                <div>
                  {updateInput?.clientId === client.id ? (
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase tracking-wider text-ocean font-medium">Add Update</div>
                      <textarea
                        value={updateInput.text}
                        onChange={(e) => {
                          e.stopPropagation()
                          setUpdateInput({ clientId: client.id, text: e.target.value })
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        placeholder="What's the latest? (e.g., 'Called client, scheduled closing for Friday')"
                        className="w-full bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean resize-none"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(client.id)}
                          disabled={!updateInput.text.trim()}
                          className="flex-1 px-3 py-2 bg-ocean text-white rounded-lg text-xs font-medium hover:bg-ocean/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          💬 Add Update
                        </button>
                        <button
                          onClick={() => setUpdateInput(null)}
                          className="px-3 py-2 bg-midnight/5 text-midnight/50 rounded-lg text-xs font-medium hover:bg-midnight/10 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setUpdateInput({ clientId: client.id, text: '' })}
                      className="w-full px-3 py-2 bg-gradient-to-r from-ocean/5 to-cyan/5 border border-ocean/10 text-ocean rounded-lg text-xs font-medium hover:from-ocean/10 hover:to-cyan/10 transition-all flex items-center justify-center gap-1.5"
                    >
                      💬 Quick Update
                    </button>
                  )}
                </div>

                {/* Status Change Buttons */}
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-midnight/40 mb-2">Change Status</div>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUS_ORDER.map(status => {
                      const style = STATUS_COLORS[status]
                      const isCurrent = client.status === status
                      return (
                        <button
                          key={status}
                          onClick={() => {
                            if (!isCurrent) {
                              setClients(prev => prev.map(c => 
                                c.id === client.id ? { ...c, status: status as Client['status'] } : c
                              ))
                            }
                          }}
                          disabled={isCurrent}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                            isCurrent
                              ? `${style.bg} ${style.text} ring-1 ring-current/20`
                              : 'bg-midnight/5 text-midnight/40 hover:bg-midnight/10 hover:text-midnight/60'
                          }`}
                        >
                          {status}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="font-display text-3xl text-midnight mb-1">Client Pipeline</h1>
        <p className="text-midnight/50 text-sm">Mortgage client tracker — who needs what, when</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="grid grid-cols-3 gap-4 mb-6"
      >
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
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
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
              const count = clients.filter(c => c.status === status).length
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
            {['all', 'Hot', 'Active', 'Monitoring'].map(priority => {
              const count = priority === 'all' 
                ? clients.length 
                : clients.filter(c => c.priority === priority).length
              const style = priority !== 'all' ? PRIORITY_COLORS[priority] : null
              
              return (
                <button
                  key={priority}
                  onClick={() => setFilterPriority(priority.toLowerCase())}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    filterPriority === priority.toLowerCase()
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
      </motion.div>

      {/* Clients Display */}
      {viewMode === 'list' ? (
        // List View
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
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
                  <AnimatePresence mode="popLayout">
                    {group.map(client => (
                      <ClientCard key={client.id} client={client} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </motion.div>
      ) : (
        // Kanban View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {STATUS_ORDER.slice(0, 5).map(status => {
            const group = groupedClients[status] || []
            const statusStyle = STATUS_COLORS[status]

            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-midnight/5 rounded-xl p-4 min-h-[400px]"
              >
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium mb-4 ${statusStyle.bg} ${statusStyle.text}`}>
                  {status}
                  <span className="ml-1 opacity-60">({group.length})</span>
                </div>

                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {group.map(client => (
                      <ClientCard key={client.id} client={client} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-cream rounded-2xl p-12 text-center"
        >
          <div className="w-20 h-20 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📋</span>
          </div>
          <h2 className="font-display text-xl text-midnight mb-2">No clients found</h2>
          <p className="text-midnight/50 text-sm">Try adjusting your filters</p>
        </motion.div>
      )}
    </div>
  )
}
