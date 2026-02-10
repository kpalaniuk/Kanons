'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Task {
  id: string
  title: string
  status: string
  priority: string
  category: string
  dueDate: string | null
  assignedBy: string
  notes: string
  createdAt: string
  updatedAt: string
}

const PRIORITY_ORDER: Record<string, number> = {
  Urgent: 0,
  High: 1,
  Medium: 2,
  Low: 3,
  Normal: 4,
}

const PRIORITY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Urgent: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  High: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  Medium: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  Low: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Normal: { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' },
}

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  'Not Started': { bg: 'bg-slate-100', text: 'text-slate-600', icon: '○' },
  'In Progress': { bg: 'bg-blue-50', text: 'text-blue-700', icon: '◐' },
  'Waiting on Kyle': { bg: 'bg-purple-50', text: 'text-purple-700', icon: '⏳' },
  Done: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '✓' },
  Cancelled: { bg: 'bg-slate-50', text: 'text-slate-400', icon: '✕' },
}

const CATEGORY_ICONS: Record<string, string> = {
  'Life Org': '🏠',
  'LO Buddy': '🤖',
  'Lead Gen': '📊',
  Music: '🎵',
  Finance: '💰',
  'Home & Family': '👨‍👩‍👧‍👦',
  'System / DevOps': '⚙️',
  Other: '📌',
  'Granada House': '🏡',
}

const STATUS_FLOW: string[] = ['Not Started', 'In Progress', 'Waiting on Kyle', 'Done']

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const diff = date.getTime() - today.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days <= 7) return `${days}d`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState<{ category: string; priority: string; showDone: boolean }>({
    category: 'all',
    priority: 'all',
    showDone: false,
  })
  const [expandedTask, setExpandedTask] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filter.showDone) params.set('showDone', 'true')
      if (filter.category !== 'all') params.set('category', filter.category)
      if (filter.priority !== 'all') params.set('priority', filter.priority)

      const res = await fetch(`/api/tasks?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch tasks')
      const data = await res.json()
      setTasks(data.tasks)
      setError(null)
    } catch (err) {
      setError('Could not load tasks. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    setLoading(true)
    fetchTasks()
  }, [fetchTasks])

  const updateStatus = async (taskId: string, newStatus: string) => {
    setUpdating(taskId)
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update')

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      )

      // If we marked as Done and not showing done, remove after animation
      if ((newStatus === 'Done' || newStatus === 'Cancelled') && !filter.showDone) {
        setTimeout(() => {
          setTasks((prev) => prev.filter((t) => t.id !== taskId))
        }, 600)
      }
    } catch (err) {
      console.error(err)
      // Revert on error
      fetchTasks()
    } finally {
      setUpdating(null)
    }
  }

  const cycleStatus = (task: Task) => {
    const currentIdx = STATUS_FLOW.indexOf(task.status)
    const nextIdx = (currentIdx + 1) % STATUS_FLOW.length
    updateStatus(task.id, STATUS_FLOW[nextIdx])
  }

  // Group tasks by status
  const groupedTasks = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const group = task.status
    if (!acc[group]) acc[group] = []
    acc[group].push(task)
    return acc
  }, {})

  // Get unique categories from tasks for filter
  const categories = [...new Set(tasks.map((t) => t.category))].sort()

  // Stats
  const urgentCount = tasks.filter((t) => t.priority === 'Urgent' || t.priority === 'High').length
  const overdueCount = tasks.filter((t) => isOverdue(t.dueDate)).length
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length

  const statusOrder = ['In Progress', 'Not Started', 'Waiting on Kyle', 'Done', 'Cancelled']

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="font-display text-3xl text-midnight mb-1">Tasks</h1>
        <p className="text-midnight/50 text-sm">Synced from Notion Task Queue</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <div className="bg-cream rounded-xl p-4 border border-midnight/5">
          <div className="text-2xl font-display font-bold text-midnight">{tasks.length}</div>
          <div className="text-xs text-midnight/50 mt-0.5">Active Tasks</div>
        </div>
        <div className={`rounded-xl p-4 border ${urgentCount > 0 ? 'bg-red-50 border-red-100' : 'bg-cream border-midnight/5'}`}>
          <div className={`text-2xl font-display font-bold ${urgentCount > 0 ? 'text-red-600' : 'text-midnight'}`}>
            {urgentCount}
          </div>
          <div className={`text-xs mt-0.5 ${urgentCount > 0 ? 'text-red-500' : 'text-midnight/50'}`}>
            Urgent / High
          </div>
        </div>
        <div className={`rounded-xl p-4 border ${overdueCount > 0 ? 'bg-amber-50 border-amber-100' : 'bg-cream border-midnight/5'}`}>
          <div className={`text-2xl font-display font-bold ${overdueCount > 0 ? 'text-amber-600' : 'text-midnight'}`}>
            {overdueCount}
          </div>
          <div className={`text-xs mt-0.5 ${overdueCount > 0 ? 'text-amber-500' : 'text-midnight/50'}`}>
            Overdue
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap items-center gap-2 mb-6"
      >
        <select
          value={filter.category}
          onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))}
          className="bg-cream border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
        >
          <option value="all">All Categories</option>
          {['Life Org', 'LO Buddy', 'Lead Gen', 'Music', 'Finance', 'Home & Family', 'System / DevOps', 'Granada House', 'Other'].map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_ICONS[cat] || '📌'} {cat}
            </option>
          ))}
        </select>

        <select
          value={filter.priority}
          onChange={(e) => setFilter((f) => ({ ...f, priority: e.target.value }))}
          className="bg-cream border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
        >
          <option value="all">All Priorities</option>
          {['Urgent', 'High', 'Medium', 'Low'].map((pri) => (
            <option key={pri} value={pri}>{pri}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-midnight/60 cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={filter.showDone}
            onChange={(e) => setFilter((f) => ({ ...f, showDone: e.target.checked }))}
            className="rounded border-midnight/20 text-ocean focus:ring-ocean"
          />
          Show completed
        </label>

        <button
          onClick={() => { setLoading(true); fetchTasks() }}
          className="p-2 text-midnight/40 hover:text-ocean transition-colors"
          title="Refresh"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </motion.div>

      {/* Loading */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-16"
        >
          <div className="flex items-center gap-3 text-midnight/40">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading tasks...
          </div>
        </motion.div>
      )}

      {/* Error */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
        >
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => { setLoading(true); fetchTasks() }}
            className="mt-2 text-sm text-red-600 underline hover:text-red-800"
          >
            Try again
          </button>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cream rounded-2xl p-12 text-center"
        >
          <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="font-display text-xl text-midnight mb-2">All clear!</h2>
          <p className="text-midnight/50 text-sm">No tasks match your filters. Adjust filters or add tasks via Telegram.</p>
        </motion.div>
      )}

      {/* Task Groups */}
      {!loading && !error && tasks.length > 0 && (
        <div className="space-y-6">
          {statusOrder.map((status) => {
            const group = groupedTasks[status]
            if (!group || group.length === 0) return null

            const statusStyle = STATUS_STYLES[status] || STATUS_STYLES['Not Started']

            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Group Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                    <span>{statusStyle.icon}</span>
                    {status}
                  </span>
                  <span className="text-xs text-midnight/30">{group.length}</span>
                </div>

                {/* Tasks */}
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {group
                      .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4))
                      .map((task) => {
                        const priColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium
                        const overdue = isOverdue(task.dueDate)
                        const isExpanded = expandedTask === task.id
                        const isUpdating = updating === task.id

                        return (
                          <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: isUpdating ? 0.6 : 1, y: 0 }}
                            exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
                            className={`bg-cream rounded-xl border transition-all ${
                              overdue ? 'border-red-200' : 'border-midnight/5 hover:border-midnight/10'
                            } ${isExpanded ? 'shadow-md' : 'hover:shadow-sm'}`}
                          >
                            {/* Main Row */}
                            <div className="flex items-start gap-3 p-4">
                              {/* Status Toggle Button */}
                              <button
                                onClick={() => cycleStatus(task)}
                                disabled={isUpdating}
                                className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                  task.status === 'Done'
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : task.status === 'In Progress'
                                    ? 'border-blue-400 bg-blue-50'
                                    : task.status === 'Waiting on Kyle'
                                    ? 'border-purple-400 bg-purple-50'
                                    : 'border-midnight/20 hover:border-ocean'
                                } ${isUpdating ? 'animate-pulse' : ''}`}
                                title={`Status: ${task.status} — Click to advance`}
                              >
                                {task.status === 'Done' && (
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                {task.status === 'In Progress' && (
                                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                )}
                                {task.status === 'Waiting on Kyle' && (
                                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                )}
                              </button>

                              {/* Content */}
                              <div
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className={`text-sm font-medium leading-snug ${
                                    task.status === 'Done' ? 'text-midnight/40 line-through' : 'text-midnight'
                                  }`}>
                                    {task.title}
                                  </span>
                                </div>

                                {/* Meta Row */}
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                  {/* Priority Badge */}
                                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${priColor.bg} ${priColor.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${priColor.dot}`} />
                                    {task.priority}
                                  </span>

                                  {/* Category */}
                                  <span className="text-[10px] text-midnight/40">
                                    {CATEGORY_ICONS[task.category] || '📌'} {task.category}
                                  </span>

                                  {/* Due Date */}
                                  {task.dueDate && (
                                    <span className={`text-[10px] font-medium ${overdue ? 'text-red-500' : 'text-midnight/40'}`}>
                                      📅 {formatDate(task.dueDate)}
                                    </span>
                                  )}

                                  {/* Assigned By */}
                                  {task.assignedBy && task.assignedBy !== 'Kyle' && (
                                    <span className="text-[10px] text-midnight/30">
                                      via {task.assignedBy}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Expand indicator */}
                              <button
                                onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                                className="text-midnight/20 hover:text-midnight/40 transition-colors shrink-0 mt-1"
                              >
                                <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 pt-0 border-t border-midnight/5">
                                    {/* Notes */}
                                    {task.notes && (
                                      <div className="mt-3">
                                        <div className="text-[10px] uppercase tracking-wider text-midnight/30 mb-1">Notes</div>
                                        <p className="text-sm text-midnight/70 leading-relaxed">{task.notes}</p>
                                      </div>
                                    )}

                                    {/* Status Actions */}
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                      {STATUS_FLOW.map((s) => {
                                        const sStyle = STATUS_STYLES[s]
                                        const isCurrent = task.status === s
                                        return (
                                          <button
                                            key={s}
                                            onClick={() => !isCurrent && updateStatus(task.id, s)}
                                            disabled={isCurrent || isUpdating}
                                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                                              isCurrent
                                                ? `${sStyle.bg} ${sStyle.text} ring-1 ring-current/20`
                                                : 'bg-midnight/5 text-midnight/40 hover:bg-midnight/10 hover:text-midnight/60'
                                            }`}
                                          >
                                            {sStyle.icon} {s}
                                          </button>
                                        )
                                      })}
                                    </div>

                                    {/* Timestamps */}
                                    <div className="mt-3 text-[10px] text-midnight/25">
                                      Created {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                      {task.updatedAt !== task.createdAt && (
                                        <> · Updated {new Date(task.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )
                      })}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8 mb-4"
      >
        <p className="text-[11px] text-midnight/25">
          Powered by Jasper · Synced from Notion
        </p>
      </motion.div>
    </div>
  )
}
