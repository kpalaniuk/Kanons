'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  AlertTriangle, Calendar, User, Phone, MessageSquare, FileText, StickyNote
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

const ACTIVE_STAGES = ['New Lead', 'Pre-Approved', 'In Process', 'Waiting', 'App Sent', 'Processing', 'Closing']

const STAGE_COLORS: Record<string, string> = {
  'New Lead':    'bg-slate-100 border-slate-200',
  'Pre-Approved':'bg-blue-50  border-blue-200',
  'In Process':  'bg-purple-50 border-purple-200',
  'Waiting':     'bg-amber-50  border-amber-200',
  'App Sent':    'bg-cyan-50   border-cyan-200',
  'Processing':  'bg-indigo-50 border-indigo-200',
  'Closing':     'bg-emerald-50 border-emerald-200',
}

const STAGE_HEADER_COLORS: Record<string, string> = {
  'New Lead':    'bg-slate-100 text-slate-700',
  'Pre-Approved':'bg-blue-100 text-blue-700',
  'In Process':  'bg-purple-100 text-purple-700',
  'Waiting':     'bg-amber-100 text-amber-700',
  'App Sent':    'bg-cyan-100 text-cyan-700',
  'Processing':  'bg-indigo-100 text-indigo-700',
  'Closing':     'bg-emerald-100 text-emerald-700',
}

const PRIORITY_DOT: Record<string, string> = {
  Hot: 'bg-red-500',
  Active: 'bg-orange-500',
  Warm: 'bg-amber-500',
  Monitoring: 'bg-emerald-500',
}

const STORAGE_KEY = 'pph-kanban-order'

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

// Load/save column order from localStorage, keyed by stage
function loadColumnOrder(): Record<string, string[]> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveColumnOrder(order: Record<string, string[]>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order))
  } catch {
    // ignore
  }
}

// Apply saved order to a list of clients within a stage
function applyOrder(clients: Client[], savedIds: string[]): Client[] {
  if (!savedIds || savedIds.length === 0) return clients
  const idMap = new Map(clients.map(c => [c.id, c]))
  const ordered: Client[] = []
  // First: those in saved order
  for (const id of savedIds) {
    const c = idMap.get(id)
    if (c) {
      ordered.push(c)
      idMap.delete(id)
    }
  }
  // Then: any new clients not in saved order (append at bottom)
  for (const c of idMap.values()) {
    ordered.push(c)
  }
  return ordered
}

interface KanbanCardProps {
  client: Client
  index: number
  stage: string
  isDragging: boolean
  isDropTarget: boolean
  onLogCall: (client: Client) => void
  onCardDragStart: (e: React.DragEvent, clientId: string, stage: string, index: number) => void
  onCardDragOver: (e: React.DragEvent, clientId: string) => void
  onCardDragLeave: (e: React.DragEvent) => void
  onCardDrop: (e: React.DragEvent, targetStage: string, targetIndex: number) => void
  onCardDragEnd: () => void
}

function KanbanCard({
  client, index, stage, isDragging, isDropTarget, onLogCall,
  onCardDragStart, onCardDragOver, onCardDragLeave, onCardDrop, onCardDragEnd,
}: KanbanCardProps) {
  const followUp = getFollowUpStatus(client.followUpDate)
  const daysSince = client.stageUpdatedAt
    ? Math.floor((Date.now() - new Date(client.stageUpdatedAt).getTime()) / (1000 * 60 * 60 * 24))
    : null
  const isStale = daysSince !== null && daysSince >= 21

  return (
    <div
      draggable
      onDragStart={e => onCardDragStart(e, client.id, stage, index)}
      onDragOver={e => onCardDragOver(e, client.id)}
      onDragLeave={e => onCardDragLeave(e)}
      onDrop={e => onCardDrop(e, stage, index)}
      onDragEnd={onCardDragEnd}
      className={`
        relative
        bg-white rounded-xl border p-3 shadow-sm transition-all select-none cursor-grab
        ${isDragging ? 'opacity-50' : 'hover:shadow-md'}
        ${followUp === 'overdue' ? 'border-red-300' : followUp === 'today' ? 'border-amber-300' : 'border-midnight/8'}
      `}
    >
      {isDropTarget && !isDragging && (
        <div className="absolute -top-1.5 left-1 right-1 h-0.5 bg-blue-500 rounded-full" />
      )}
      {/* Header row */}
      <div className="flex items-start gap-2 mb-1.5">
        <span
          className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[client.priority] || 'bg-gray-400'}`}
          title={client.priority}
        />
        <div className="flex-1 min-w-0">
          <Link
            href={`/workshop/pph/clients/${client.id}`}
            className="font-display text-sm text-midnight hover:text-ocean transition-colors leading-tight block truncate"
            onClick={e => e.stopPropagation()}
          >
            {client.name}
          </Link>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-1 text-[10px] text-midnight/50 mb-1.5">
        {client.loanType && (
          <span className="px-1.5 py-0.5 rounded-full bg-midnight/5 text-midnight/60 font-medium">
            {client.loanType}
          </span>
        )}
        {client.targetPurchasePrice && (
          <span className="font-medium text-midnight/70">
            ${(client.targetPurchasePrice / 1000).toFixed(0)}k
          </span>
        )}
        {client.ficoScore && (
          <span className={`font-medium ${client.ficoScore >= 740 ? 'text-emerald-600' : client.ficoScore >= 680 ? 'text-amber-600' : 'text-red-500'}`}>
            {client.ficoScore}
          </span>
        )}
        {client.primaryLo && (
          <span className="flex items-center gap-0.5">
            <User className="w-2.5 h-2.5" />{client.primaryLo}
          </span>
        )}
      </div>

      {/* Follow-up */}
      {client.followUpDate && (
        <div className={`flex items-center gap-1 text-[10px] font-medium mb-1 ${
          followUp === 'overdue' ? 'text-red-600' :
          followUp === 'today' ? 'text-amber-600' :
          'text-emerald-600'
        }`}>
          <Calendar className="w-2.5 h-2.5" />
          {relativeDate(client.followUpDate)}
        </div>
      )}

      {/* Stale alert */}
      {isStale && (
        <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full w-fit mb-1.5 ${
          daysSince! >= 35 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
        }`}>
          <AlertTriangle className="w-2.5 h-2.5" />
          {daysSince}d stale
        </div>
      )}

      {/* Notes preview */}
      {client.notes && (
        <div className="flex items-start gap-1 mt-1">
          <StickyNote className="w-2.5 h-2.5 text-midnight/20 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-midnight/40 italic line-clamp-2 leading-relaxed">
            {client.notes}
          </p>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-midnight/5">
        <button
          onClick={e => { e.stopPropagation(); onLogCall(client) }}
          className="flex items-center gap-0.5 px-2 py-1 rounded-md hover:bg-midnight/5 transition-colors text-[10px] text-midnight/40 hover:text-midnight"
          title="Log Call"
        >
          <Phone className="w-3 h-3" />
        </button>
        <Link
          href={`/workshop/pph/clients/${client.id}?tab=chat`}
          className="flex items-center gap-0.5 px-2 py-1 rounded-md hover:bg-ocean/5 transition-colors text-[10px] text-midnight/40 hover:text-ocean"
          title="Ask AI"
          onClick={e => e.stopPropagation()}
        >
          <MessageSquare className="w-3 h-3" />
        </Link>
        <Link
          href={`/workshop/pph/purchase-builder?client=${client.id}&name=${encodeURIComponent(client.name)}`}
          className="flex items-center gap-0.5 px-2 py-1 rounded-md hover:bg-midnight/5 transition-colors text-[10px] text-midnight/40 hover:text-midnight"
          title="Run Scenario"
          onClick={e => e.stopPropagation()}
        >
          <FileText className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

interface KanbanBoardProps {
  clients: Client[]
  onLogCall: (client: Client) => void
}

export default function KanbanBoard({ clients, onLogCall }: KanbanBoardProps) {
  const [columnOrder, setColumnOrder] = useState<Record<string, string[]>>({})
  const [mounted, setMounted] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const dragRef = useRef<{ clientId: string; stage: string; index: number } | null>(null)

  // Hydrate from localStorage after mount (avoid SSR mismatch)
  useEffect(() => {
    setColumnOrder(loadColumnOrder())
    setMounted(true)
  }, [])

  // Build per-stage client lists, applying saved order
  const columns: Record<string, Client[]> = {}
  for (const stage of ACTIVE_STAGES) {
    const stageClients = clients.filter(c => c.stage === stage)
    const savedIds = columnOrder[stage] || []
    columns[stage] = applyOrder(stageClients, savedIds)
  }

  function handleDragStart(e: React.DragEvent, clientId: string, stage: string, index: number) {
    dragRef.current = { clientId, stage, index }
    setDraggingId(clientId)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent, clientId: string) {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(null)
    if (dragRef.current && dragRef.current.clientId !== clientId) {
      setDropTargetId(clientId)
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    const relatedTarget = e.relatedTarget as Node | null
    if (!e.currentTarget.contains(relatedTarget)) {
      setDropTargetId(null)
    }
  }

  function handleDrop(e: React.DragEvent, targetStage: string, targetIndex: number) {
    e.preventDefault()
    e.stopPropagation()
    const source = dragRef.current
    if (!source) return
    // Only allow same-column reorder
    if (source.stage !== targetStage) return
    if (source.index === targetIndex) return

    const items = Array.from(columns[targetStage])
    const [moved] = items.splice(source.index, 1)
    items.splice(targetIndex, 0, moved)

    const newOrder = {
      ...columnOrder,
      [targetStage]: items.map(c => c.id),
    }
    setColumnOrder(newOrder)
    saveColumnOrder(newOrder)
    setDraggingId(null)
    setDropTargetId(null)
    setDragOverColumn(null)
    dragRef.current = null
  }

  function handleDragEnd() {
    setDraggingId(null)
    setDropTargetId(null)
    setDragOverColumn(null)
    dragRef.current = null
  }

  function handleColumnDragOver(e: React.DragEvent, stage: string) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(stage)
    setDropTargetId(null)
  }

  function handleColumnDragLeave(e: React.DragEvent) {
    const relatedTarget = e.relatedTarget as Node | null
    if (!e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null)
    }
  }

  function handleColumnDrop(e: React.DragEvent, targetStage: string) {
    e.preventDefault()
    const source = dragRef.current
    if (!source) return
    if (source.stage !== targetStage) return

    const items = Array.from(columns[targetStage])
    const sourceIndex = items.findIndex(c => c.id === source.clientId)
    if (sourceIndex === -1) return
    const [moved] = items.splice(sourceIndex, 1)
    items.push(moved)

    const newOrder = {
      ...columnOrder,
      [targetStage]: items.map(c => c.id),
    }
    setColumnOrder(newOrder)
    saveColumnOrder(newOrder)
    setDraggingId(null)
    setDropTargetId(null)
    setDragOverColumn(null)
    dragRef.current = null
  }

  if (!mounted) {
    // Avoid hydration mismatch — render skeleton until client-side
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {ACTIVE_STAGES.map(stage => (
          <div key={stage} className="flex-shrink-0 w-60 h-40 bg-midnight/5 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1">
      {ACTIVE_STAGES.map(stage => {
        const stageClients = columns[stage]
        return (
          <div
            key={stage}
            className={`flex-shrink-0 w-60 rounded-xl border ${STAGE_COLORS[stage] || 'bg-slate-50 border-slate-200'}`}
          >
            {/* Column header */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-t-xl ${STAGE_HEADER_COLORS[stage] || 'bg-slate-100 text-slate-700'}`}>
              <span className="text-xs font-semibold">{stage}</span>
              <span className="text-xs font-bold opacity-60">{stageClients.length}</span>
            </div>

            {/* Droppable area */}
            <div
              className={`p-2 space-y-2 min-h-[80px] rounded-b-xl transition-all ${
                dragOverColumn === stage && draggingId ? 'ring-2 ring-blue-400 ring-inset' : ''
              }`}
              onDragOver={e => handleColumnDragOver(e, stage)}
              onDragLeave={handleColumnDragLeave}
              onDrop={e => handleColumnDrop(e, stage)}
            >
              {stageClients.map((client, index) => (
                <KanbanCard
                  key={client.id}
                  client={client}
                  index={index}
                  stage={stage}
                  isDragging={draggingId === client.id}
                  isDropTarget={dropTargetId === client.id}
                  onLogCall={onLogCall}
                  onCardDragStart={handleDragStart}
                  onCardDragOver={handleDragOver}
                  onCardDragLeave={handleDragLeave}
                  onCardDrop={handleDrop}
                  onCardDragEnd={handleDragEnd}
                />
              ))}
              {stageClients.length === 0 && (
                <div className="text-center py-4 text-[10px] text-midnight/25 italic">
                  empty
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
