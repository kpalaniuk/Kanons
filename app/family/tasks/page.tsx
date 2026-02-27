'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

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
  'StronGnome': '🎸',
  'Neo-Somatic': '🧠',
}

// Life area mappings
const LIFE_AREAS = {
  'Work & Business': ['LO Buddy', 'Lead Gen', 'Granada House'],
  'Music & Creative': ['Music', 'StronGnome', 'Neo-Somatic'],
  'Family & Home': ['Home & Family'],
  'System / DevOps': ['System / DevOps'],
  'Finance': ['Finance'],
  'Life Org / Other': ['Life Org', 'Other'],
}

const STATUS_FLOW: string[] = ['Not Started', 'In Progress', 'Waiting on Kyle', 'Done']

// Weekly schedule context
interface DaySchedule {
  label: string
  constraints: string[]
  availableHours: string
  emoji: string
  workEnd?: string
  reminder?: {
    icon: string
    title: string
    message: string
  }
}

const WEEKLY_SCHEDULE: Record<number, DaySchedule> = {
  0: { // Sunday
    label: 'Sunday',
    constraints: [],
    availableHours: 'Full day available',
    emoji: '☀️',
  },
  1: { // Monday
    label: 'Monday — Pickleball Day',
    constraints: ['Pickleball takes most of the day', 'Work window: 9am-2pm only'],
    availableHours: '5 hours',
    emoji: '🏓',
    workEnd: '2pm',
  },
  2: { // Tuesday
    label: 'Tuesday — Date Night',
    constraints: ['Date night with Paige (evening)'],
    availableHours: 'Full work day',
    emoji: '💕',
    reminder: {
      icon: '📅',
      title: 'Date Night Reminder',
      message: 'Confirm plans with Paige & nanny Lidia for tonight',
    },
  },
  3: { // Wednesday
    label: 'Wednesday — Soccer Practice',
    constraints: ['Pick up Bodhi at 3:30pm', 'Must leave by 3:15pm'],
    availableHours: 'Until 3:15pm',
    emoji: '⚽',
    workEnd: '3:15pm',
  },
  4: { // Thursday
    label: 'Thursday — FC Balboa Coaching',
    constraints: ['Coach FC Balboa soccer', 'Must be home by 3:30pm'],
    availableHours: 'Until 3:15pm',
    emoji: '⚽',
    workEnd: '3:15pm',
  },
  5: { // Friday
    label: 'Friday',
    constraints: [],
    availableHours: 'Full day available',
    emoji: '🎉',
  },
  6: { // Saturday
    label: 'Saturday',
    constraints: [],
    availableHours: 'Full day available',
    emoji: '🌟',
  },
}

type QuickFilterType = 'all' | 'focus' | 'waiting' | 'overdue' | 'done'

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

function getTimeRemaining(): { morning: string; afternoon: string; isLunchTime: boolean } {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  
  const isLunchTime = hours === 12 && minutes < 30
  
  // Calculate morning remaining (until 12pm)
  const morningEnd = 12 * 60 // 12:00 in minutes
  const currentMinutes = hours * 60 + minutes
  const morningRemaining = Math.max(0, morningEnd - currentMinutes)
  const morningHours = Math.floor(morningRemaining / 60)
  const morningMins = morningRemaining % 60
  
  // Calculate afternoon remaining (12:30pm-5pm)
  const afternoonStart = 12 * 60 + 30 // 12:30
  const afternoonEnd = 17 * 60 // 5:00
  const afternoonRemaining = currentMinutes < afternoonStart 
    ? afternoonEnd - afternoonStart
    : Math.max(0, afternoonEnd - currentMinutes)
  const afternoonHours = Math.floor(afternoonRemaining / 60)
  const afternoonMins = afternoonRemaining % 60
  
  return {
    morning: morningRemaining > 0 ? `${morningHours}h ${morningMins}m` : 'Done',
    afternoon: afternoonRemaining > 0 ? `${afternoonHours}h ${afternoonMins}m` : 'Done',
    isLunchTime,
  }
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState<{ lifeArea: string; priority: string; status: string; showDone: boolean }>({
    lifeArea: 'all',
    priority: 'all',
    status: 'all',
    showDone: false,
  })
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>('all')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'Medium',
    category: 'Other',
    dueDate: '',
    notes: '',
  })
  const [creating, setCreating] = useState(false)
  const [updateContext, setUpdateContext] = useState<{ taskId: string; text: string } | null>(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateSuggestion, setUpdateSuggestion] = useState<{
    taskId: string
    nextAction: string
    subTasks: string[]
    followUpDate: string | null
    dateReason: string
  } | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filter.showDone || quickFilter === 'done') params.set('showDone', 'true')

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
  }, [filter.showDone, quickFilter])

  useEffect(() => {
    setLoading(true)
    fetchTasks()
  }, [fetchTasks])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        setShowAddModal(true)
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        setQuickFilter(quickFilter === 'focus' ? 'all' : 'focus')
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault()
        setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')
      } else if (e.key === 'Escape') {
        setShowAddModal(false)
        setExpandedTask(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [quickFilter, viewMode])

  const updateStatus = async (taskId: string, newStatus: string) => {
    setUpdating(taskId)
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update')

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      )

      if ((newStatus === 'Done' || newStatus === 'Cancelled') && !filter.showDone && quickFilter !== 'done') {
        setTimeout(() => {
          setTasks((prev) => prev.filter((t) => t.id !== taskId))
        }, 600)
      }
    } catch (err) {
      console.error(err)
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

  const createTask = async () => {
    if (!newTask.title.trim()) return

    setCreating(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      })
      if (!res.ok) throw new Error('Failed to create task')

      setShowAddModal(false)
      setNewTask({ title: '', priority: 'Medium', category: 'Other', dueDate: '', notes: '' })
      fetchTasks()
    } catch (err) {
      console.error(err)
      alert('Failed to create task')
    } finally {
      setCreating(false)
    }
  }

  const submitUpdate = async (task: Task) => {
    if (!updateContext?.text.trim()) return

    setUpdateLoading(true)
    try {
      const res = await fetch('/api/tasks/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          taskTitle: task.title,
          taskNotes: task.notes,
          taskCategory: task.category,
          taskPriority: task.priority,
          taskDueDate: task.dueDate,
          context: updateContext.text,
        }),
      })
      if (!res.ok) throw new Error('Failed to submit update')

      const data = await res.json()
      setUpdateSuggestion({
        taskId: task.id,
        nextAction: data.suggestion?.nextAction || '',
        subTasks: data.suggestion?.subTasks || [],
        followUpDate: data.suggestion?.followUpDate || null,
        dateReason: data.suggestion?.dateReason || '',
      })
      setUpdateContext(null)

      // Refresh tasks to show updated notes + due date
      fetchTasks()
    } catch (err) {
      console.error(err)
      alert('Failed to submit update')
    } finally {
      setUpdateLoading(false)
    }
  }

  const dismissSuggestion = () => {
    setUpdateSuggestion(null)
  }

  // Today's context
  const today = new Date()
  const dayOfWeek = today.getDay()
  const todaySchedule = WEEKLY_SCHEDULE[dayOfWeek]
  const timeBlocks = getTimeRemaining()

  // Apply quick filters
  const applyQuickFilter = (tasks: Task[]) => {
    switch (quickFilter) {
      case 'focus':
        return tasks.filter(t => 
          (t.priority === 'Urgent' || t.priority === 'High') &&
          (t.status === 'Not Started' || t.status === 'In Progress')
        )
      case 'waiting':
        return tasks.filter(t => t.status === 'Waiting on Kyle')
      case 'overdue':
        return tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'Done')
      case 'done':
        return tasks.filter(t => t.status === 'Done')
      default:
        return tasks
    }
  }

  // Filter tasks by life area and priority
  const filteredTasks = useMemo(() => {
    let result = applyQuickFilter(tasks)

    // Filter by life area
    if (filter.lifeArea !== 'all') {
      const categories = LIFE_AREAS[filter.lifeArea as keyof typeof LIFE_AREAS]
      result = result.filter(t => categories.includes(t.category))
    }

    // Filter by priority (unless quick filter is active)
    if (filter.priority !== 'all' && quickFilter === 'all') {
      result = result.filter(t => t.priority === filter.priority)
    }

    // Filter by status (unless quick filter is active)
    if (filter.status !== 'all' && quickFilter === 'all') {
      result = result.filter(t => t.status === filter.status)
    }

    return result
  }, [tasks, filter.lifeArea, filter.priority, filter.status, quickFilter])

  // Count tasks per life area
  const lifeAreaCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    Object.entries(LIFE_AREAS).forEach(([area, categories]) => {
      counts[area] = tasks.filter(t => categories.includes(t.category) && t.status !== 'Done' && t.status !== 'Cancelled').length
    })
    return counts
  }, [tasks])

  // Quick filter counts
  const quickFilterCounts = useMemo(() => ({
    focus: tasks.filter(t => 
      (t.priority === 'Urgent' || t.priority === 'High') &&
      (t.status === 'Not Started' || t.status === 'In Progress')
    ).length,
    waiting: tasks.filter(t => t.status === 'Waiting on Kyle').length,
    overdue: tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'Done').length,
    done: tasks.filter(t => t.status === 'Done').length,
  }), [tasks])

  // Progress calculation
  const progress = useMemo(() => {
    const total = tasks.filter(t => t.status !== 'Cancelled').length
    const done = tasks.filter(t => t.status === 'Done').length
    return total > 0 ? (done / total) * 100 : 0
  }, [tasks])

  // Group tasks by status
  const groupedTasks = filteredTasks.reduce<Record<string, Task[]>>((acc, task) => {
    const group = task.status
    if (!acc[group]) acc[group] = []
    acc[group].push(task)
    return acc
  }, {})

  // Suggested tasks for today (urgent/high priority, not done, has work time available)
  const suggestedTasks = useMemo(() => {
    return tasks
      .filter(t => 
        (t.priority === 'Urgent' || t.priority === 'High') &&
        t.status !== 'Done' &&
        t.status !== 'Cancelled'
      )
      .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4))
      .slice(0, 3)
  }, [tasks])

  // Stats
  const urgentCount = tasks.filter((t) => t.priority === 'Urgent' || t.priority === 'High').length
  const overdueCount = tasks.filter((t) => isOverdue(t.dueDate)).length

  const statusOrder = ['In Progress', 'Not Started', 'Waiting on Kyle', 'Done', 'Cancelled']

  // Empty state messages
  const getEmptyStateMessage = () => {
    switch (quickFilter) {
      case 'focus':
        return { emoji: '🎉', title: 'Nothing urgent!', message: 'All high-priority tasks are handled.' }
      case 'waiting':
        return { emoji: '🤖', title: 'All clear!', message: 'No tasks waiting on you — Jasper\'s got it handled.' }
      case 'overdue':
        return { emoji: '🎉', title: 'Nothing overdue!', message: 'You\'re on top of everything.' }
      case 'done':
        return { emoji: '💪', title: 'No completed tasks yet', message: 'Get started and crush some tasks!' }
      default:
        return { emoji: '🎉', title: 'All clear!', message: 'No tasks in this view.' }
    }
  }

  const TaskCard = ({ task }: { task: Task }) => {
    const priColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium
    const overdue = isOverdue(task.dueDate)
    const isExpanded = expandedTask === task.id
    const isUpdating = updating === task.id

    return (
      <div
        key={task.id}
        className={`rounded-xl border transition-all ${
          overdue ? 'border-red-200' : 'border-midnight/5 hover:border-midnight/10'
        } ${isExpanded ? 'shadow-md' : 'hover:shadow-sm'} ${isUpdating ? 'opacity-60' : 'opacity-100'}`}
      >
        <div className="flex items-start gap-3 p-4">
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
          >
            {task.status === 'Done' && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {task.status === 'In Progress' && <div className="w-2 h-2 bg-blue-400 rounded-full" />}
            {task.status === 'Waiting on Kyle' && <div className="w-2 h-2 bg-purple-400 rounded-full" />}
          </button>

          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedTask(isExpanded ? null : task.id)}>
            <div className="flex items-start justify-between gap-2">
              <span className={`text-sm font-medium leading-snug ${
                task.status === 'Done' ? 'text-midnight/40 line-through' : 'text-midnight'
              }`}>
                {task.title}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${priColor.bg} ${priColor.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${priColor.dot}`} />
                {task.priority}
              </span>
              <span className="text-[10px] text-midnight/40">
                {CATEGORY_ICONS[task.category] || '📌'} {task.category}
              </span>
              {task.dueDate && (
                <span className={`text-[10px] font-medium ${overdue ? 'text-red-500' : 'text-midnight/40'}`}>
                  📅 {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setExpandedTask(isExpanded ? null : task.id)}
            className="text-midnight/20 hover:text-midnight/40 transition-colors shrink-0 mt-1"
          >
            <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {isExpanded && (
          <div className="overflow-hidden">
            <div className="px-4 pb-4 pt-0 border-t border-midnight/5">
                {task.notes && (
                  <div className="mt-3">
                    <div className="text-[10px] uppercase tracking-wider text-midnight/30 mb-1">Notes</div>
                    <p className="text-sm text-midnight/70 leading-relaxed">{task.notes}</p>
                  </div>
                )}

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

                {/* Quick Update Section */}
                <div className="mt-4 pt-3 border-t border-midnight/5">
                  {updateContext?.taskId === task.id ? (
                    // Input mode
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase tracking-wider text-ocean font-medium">Quick Update</div>
                      <textarea
                        value={updateContext.text}
                        onChange={(e) => {
                          e.stopPropagation()
                          setUpdateContext({ taskId: task.id, text: e.target.value })
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        placeholder="What happened? (e.g. 'Called but got voicemail, need to try again Thursday')"
                        className="w-full bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean resize-none"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => submitUpdate(task)}
                          disabled={!updateContext.text.trim() || updateLoading}
                          className="flex-1 px-3 py-2 bg-ocean text-white rounded-lg text-xs font-medium hover:bg-ocean/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          {updateLoading ? (
                            <>
                              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Analyzing...
                            </>
                          ) : (
                            <>🤖 Get Jasper&apos;s Take</>
                          )}
                        </button>
                        <button
                          onClick={() => setUpdateContext(null)}
                          className="px-3 py-2 bg-midnight/5 text-midnight/50 rounded-lg text-xs font-medium hover:bg-midnight/10 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : updateSuggestion?.taskId === task.id ? (
                    // Suggestion display mode
                    <div className="space-y-2">
                      <div className="text-[10px] uppercase tracking-wider text-ocean font-medium flex items-center gap-1">
                        🤖 Jasper&apos;s Suggestion
                      </div>
                      <div className="bg-ocean/5 border border-ocean/10 rounded-lg p-3 space-y-2">
                        <div className="text-sm text-midnight font-medium flex items-start gap-2">
                          <span className="text-ocean mt-0.5">→</span>
                          <span>{updateSuggestion.nextAction}</span>
                        </div>
                        {updateSuggestion.subTasks.length > 0 && (
                          <div className="ml-5 space-y-1">
                            {updateSuggestion.subTasks.map((st, i) => (
                              <div key={i} className="text-xs text-midnight/60 flex items-start gap-1.5">
                                <span className="text-ocean/60">•</span>
                                <span>{st}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {updateSuggestion.followUpDate && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-ocean/10">
                            <span className="text-xs font-medium text-ocean">📅 Follow up: {new Date(updateSuggestion.followUpDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            <span className="text-[10px] text-midnight/40">— {updateSuggestion.dateReason}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setUpdateContext({ taskId: task.id, text: '' })}
                          className="px-3 py-1.5 bg-midnight/5 text-midnight/50 rounded-lg text-[11px] font-medium hover:bg-midnight/10 transition-colors"
                        >
                          Add Another Update
                        </button>
                        <button
                          onClick={dismissSuggestion}
                          className="px-3 py-1.5 text-midnight/30 text-[11px] hover:text-midnight/50 transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Default: show Update button
                    <button
                      onClick={() => setUpdateContext({ taskId: task.id, text: '' })}
                      className="w-full px-3 py-2 bg-gradient-to-r from-ocean/5 to-cyan/5 border border-ocean/10 text-ocean rounded-lg text-xs font-medium hover:from-ocean/10 hover:to-cyan/10 transition-all flex items-center justify-center gap-1.5"
                    >
                      💬 Update &amp; Get Next Steps
                    </button>
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-3xl text-midnight mb-1">Daily Planner</h1>
        <p className="text-midnight/50 text-sm">Smart task management for your life</p>
      </div>

      {/* Today's Plan */}
      <div className="mb-6 bg-gradient-to-br from-ocean to-royal rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-3xl">{todaySchedule.emoji}</span>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold">{todaySchedule.label}</h2>
            <p className="text-white/70 text-sm">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Constraints */}
        {todaySchedule.constraints.length > 0 && (
          <div className="bg-white/10 rounded-xl p-4 mb-4 backdrop-blur-sm">
            <div className="text-xs uppercase tracking-wider text-white/60 mb-2">Today's Schedule</div>
            {todaySchedule.constraints.map((constraint, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="text-sunset">•</span>
                <span>{constraint}</span>
              </div>
            ))}
          </div>
        )}

        {/* Time Blocks */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-[10px] uppercase tracking-wider text-white/60 mb-1">Morning</div>
            <div className="font-display text-lg font-bold">{timeBlocks.morning}</div>
            <div className="text-[10px] text-white/60">Until noon</div>
          </div>
          <div className={`rounded-lg p-3 backdrop-blur-sm ${timeBlocks.isLunchTime ? 'bg-sunset/30 ring-2 ring-sunset' : 'bg-white/10'}`}>
            <div className="text-[10px] uppercase tracking-wider text-white/60 mb-1">Lunch</div>
            <div className="font-display text-lg font-bold">{timeBlocks.isLunchTime ? '🍽️ Now' : '12-12:30'}</div>
            <div className="text-[10px] text-white/60">Always blocked</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-[10px] uppercase tracking-wider text-white/60 mb-1">Afternoon</div>
            <div className="font-display text-lg font-bold">{timeBlocks.afternoon}</div>
            <div className="text-[10px] text-white/60">{todaySchedule.workEnd ? `Until ${todaySchedule.workEnd}` : 'Until 5pm'}</div>
          </div>
        </div>

        {/* Tuesday Reminder */}
        {todaySchedule.reminder && (
          <div className="bg-gradient-to-r from-terracotta to-sunset rounded-xl p-4 text-midnight">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{todaySchedule.reminder.icon}</span>
              <span className="font-display font-bold">{todaySchedule.reminder.title}</span>
            </div>
            <p className="text-sm">{todaySchedule.reminder.message}</p>
          </div>
        )}

        {/* Suggested Tasks */}
        {suggestedTasks.length > 0 && (
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wider text-white/60 mb-2">Suggested Focus</div>
            <div className="space-y-2">
              {suggestedTasks.map((task) => (
                <div key={task.id} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer" onClick={() => setExpandedTask(task.id)}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[task.priority]?.dot.replace('bg-', 'bg-')}`} />
                    <span className="text-sm font-medium flex-1">{task.title}</span>
                    <span className="text-xs text-white/60">{CATEGORY_ICONS[task.category]} {task.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Row with Progress Bar */}
      <div className="mb-6">
        {/* Progress Bar */}
        <div className="bg-cream rounded-xl p-4 border border-midnight/5 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-midnight/60">Today's Progress</span>
            <span className="text-sm font-display font-bold text-midnight">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-midnight/5 rounded-full overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-ocean to-cyan rounded-full transition-all duration-1000"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-cream rounded-xl p-4 border border-midnight/5">
            <div className="text-2xl font-display font-bold text-midnight">{filteredTasks.length}</div>
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
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setQuickFilter(quickFilter === 'focus' ? 'all' : 'focus')}
            className={`p-4 rounded-2xl text-left transition-all ${
              quickFilter === 'focus'
                ? 'bg-gradient-to-br from-ocean to-cyan text-white shadow-lg ring-2 ring-ocean/20'
                : 'bg-cream border border-midnight/10 hover:border-ocean hover:shadow-md'
            }`}
          >
            <div className="text-2xl mb-1">⚡</div>
            <div className={`font-display font-bold text-lg ${quickFilter === 'focus' ? 'text-white' : 'text-midnight'}`}>
              {quickFilterCounts.focus}
            </div>
            <div className={`text-xs ${quickFilter === 'focus' ? 'text-white/80' : 'text-midnight/60'}`}>
              My Focus
            </div>
          </button>

          <button
            onClick={() => setQuickFilter(quickFilter === 'waiting' ? 'all' : 'waiting')}
            className={`p-4 rounded-2xl text-left transition-all ${
              quickFilter === 'waiting'
                ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg ring-2 ring-purple-500/20'
                : 'bg-cream border border-midnight/10 hover:border-purple-500 hover:shadow-md'
            }`}
          >
            <div className="text-2xl mb-1">⏳</div>
            <div className={`font-display font-bold text-lg ${quickFilter === 'waiting' ? 'text-white' : 'text-midnight'}`}>
              {quickFilterCounts.waiting}
            </div>
            <div className={`text-xs ${quickFilter === 'waiting' ? 'text-white/80' : 'text-midnight/60'}`}>
              Waiting on Me
            </div>
          </button>

          <button
            onClick={() => setQuickFilter(quickFilter === 'overdue' ? 'all' : 'overdue')}
            className={`p-4 rounded-2xl text-left transition-all ${
              quickFilter === 'overdue'
                ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg ring-2 ring-red-500/20'
                : 'bg-cream border border-midnight/10 hover:border-red-500 hover:shadow-md'
            }`}
          >
            <div className="text-2xl mb-1">🔥</div>
            <div className={`font-display font-bold text-lg ${quickFilter === 'overdue' ? 'text-white' : 'text-midnight'}`}>
              {quickFilterCounts.overdue}
            </div>
            <div className={`text-xs ${quickFilter === 'overdue' ? 'text-white/80' : 'text-midnight/60'}`}>
              Overdue
            </div>
          </button>

          <button
            onClick={() => setQuickFilter(quickFilter === 'done' ? 'all' : 'done')}
            className={`p-4 rounded-2xl text-left transition-all ${
              quickFilter === 'done'
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg ring-2 ring-emerald-500/20'
                : 'bg-cream border border-midnight/10 hover:border-emerald-500 hover:shadow-md'
            }`}
          >
            <div className="text-2xl mb-1">✅</div>
            <div className={`font-display font-bold text-lg ${quickFilter === 'done' ? 'text-white' : 'text-midnight'}`}>
              {quickFilterCounts.done}
            </div>
            <div className={`text-xs ${quickFilter === 'done' ? 'text-white/80' : 'text-midnight/60'}`}>
              Recently Done
            </div>
          </button>
        </div>
      </div>

      {/* Life Area Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
          {['all', ...Object.keys(LIFE_AREAS)].map((area) => {
            const count = area === 'all' 
              ? tasks.filter(t => t.status !== 'Done' && t.status !== 'Cancelled').length
              : lifeAreaCounts[area] || 0
            return (
              <button
                key={area}
                onClick={() => setFilter(f => ({ ...f, lifeArea: area }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  filter.lifeArea === area
                    ? 'bg-ocean text-white shadow-md'
                    : 'bg-cream text-midnight/60 hover:bg-midnight/5'
                }`}
              >
                {area === 'all' ? '🎯 All' : area}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filter.lifeArea === area ? 'bg-white/20' : 'bg-midnight/10'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {['all', ...STATUS_FLOW].map((status) => {
            const style = status === 'all' ? null : STATUS_STYLES[status]
            const count = status === 'all' 
              ? tasks.length 
              : tasks.filter(t => t.status === status).length
            const isActive = filter.status === status
            return (
              <button
                key={status}
                onClick={() => setFilter(f => ({ ...f, status }))}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? style ? `${style.bg} ${style.text} ring-1 ring-current/20` : 'bg-midnight text-cream'
                    : 'bg-cream text-midnight/40 hover:bg-midnight/5 border border-midnight/5'
                }`}
              >
                {style && <span>{style.icon}</span>}
                {status === 'all' ? 'All Statuses' : status}
                <span className={`ml-0.5 ${isActive ? 'opacity-80' : 'opacity-40'}`}>({count})</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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

          <label className="flex items-center gap-2 text-sm text-midnight/60 cursor-pointer">
            <input
              type="checkbox"
              checked={filter.showDone}
              onChange={(e) => setFilter((f) => ({ ...f, showDone: e.target.checked }))}
              className="rounded border-midnight/20 text-ocean focus:ring-ocean"
            />
            Show completed
          </label>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-ocean text-white' : 'bg-cream text-midnight/40 hover:text-midnight'}`}
              title="List view"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-ocean text-white' : 'bg-cream text-midnight/40 hover:text-midnight'}`}
              title="Kanban view (K)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4H5a2 2 0 00-2 2v14a2 2 0 002 2h4m0-18v18m0-18l6 0m-6 0v18m6-18h4a2 2 0 012 2v14a2 2 0 01-2 2h-4m0-18v18" />
              </svg>
            </button>
            <button
              onClick={() => { setLoading(true); fetchTasks() }}
              className="p-2 text-midnight/40 hover:text-ocean transition-colors"
              title="Refresh"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Keyboard Hints */}
        <div className="hidden md:flex items-center gap-3 mt-3 text-[10px] text-midnight/30">
          <span>💡 Keyboard shortcuts:</span>
          <kbd className="px-2 py-1 bg-midnight/5 rounded">N</kbd>
          <span>New task</span>
          <kbd className="px-2 py-1 bg-midnight/5 rounded">F</kbd>
          <span>Focus mode</span>
          <kbd className="px-2 py-1 bg-midnight/5 rounded">K</kbd>
          <span>Kanban</span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-midnight/40">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading tasks...
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTasks.length === 0 && (
        <div className="bg-cream rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">{getEmptyStateMessage().emoji}</span>
          </div>
          <h2 className="font-display text-xl text-midnight mb-2">{getEmptyStateMessage().title}</h2>
          <p className="text-midnight/50 text-sm">{getEmptyStateMessage().message}</p>
        </div>
      )}

      {/* Task Views */}
      {!loading && !error && filteredTasks.length > 0 && (
        <>
          {viewMode === 'list' ? (
            // List View
            <div className="space-y-6">
              {statusOrder.map((status) => {
                const group = groupedTasks[status]
                if (!group || group.length === 0) return null

                const statusStyle = STATUS_STYLES[status] || STATUS_STYLES['Not Started']

                return (
                  <div key={status}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        <span>{statusStyle.icon}</span>
                        {status}
                      </span>
                      <span className="text-xs text-midnight/30">{group.length}</span>
                    </div>

                    <div className="space-y-2">
                      {group
                        .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4))
                        .map((task) => <TaskCard key={task.id} task={task} />)}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // Kanban View
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Not Started', 'In Progress', 'Waiting on Kyle', 'Done'].map((status) => {
                const group = groupedTasks[status] || []
                const statusStyle = STATUS_STYLES[status]

                return (
                  <div
                    key={status}
                    className="bg-midnight/5 rounded-xl p-4 min-h-[400px]"
                  >
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium mb-4 ${statusStyle.bg} ${statusStyle.text}`}>
                      <span>{statusStyle.icon}</span>
                      {status}
                      <span className="ml-1 opacity-60">({group.length})</span>
                    </div>

                    <div className="space-y-2">
                      {group
                        .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4))
                        .map((task) => <TaskCard key={task.id} task={task} />)}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-ocean to-cyan text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:shadow-ocean/50 hover:scale-110 transition-transform"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Add Task Modal */}
      {showAddModal && (
        <>
          <div
            onClick={() => setShowAddModal(false)}
            className="fixed inset-0 bg-midnight/40 backdrop-blur-sm z-50"
          />
          <div
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-cream rounded-2xl shadow-2xl z-50 p-6 max-h-[90vh] overflow-y-auto"
          >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-midnight">Create New Task</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-midnight/40 hover:text-midnight transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-midnight/60 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(t => ({ ...t, title: e.target.value }))}
                    placeholder="What needs to be done?"
                    className="w-full px-4 py-3 bg-white border border-midnight/10 rounded-xl text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean transition-colors"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-midnight/60 mb-2">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(t => ({ ...t, priority: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-midnight/10 rounded-xl text-midnight focus:outline-none focus:border-ocean transition-colors"
                    >
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-midnight/60 mb-2">Category</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask(t => ({ ...t, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-midnight/10 rounded-xl text-midnight focus:outline-none focus:border-ocean transition-colors"
                    >
                      {Object.keys(CATEGORY_ICONS).map(cat => (
                        <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight/60 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(t => ({ ...t, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border border-midnight/10 rounded-xl text-midnight focus:outline-none focus:border-ocean transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight/60 mb-2">Notes</label>
                  <textarea
                    value={newTask.notes}
                    onChange={(e) => setNewTask(t => ({ ...t, notes: e.target.value }))}
                    placeholder="Additional details..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-midnight/10 rounded-xl text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 bg-midnight/5 text-midnight rounded-xl font-medium hover:bg-midnight/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createTask}
                    disabled={!newTask.title.trim() || creating}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-ocean to-cyan text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

      {/* Footer */}
      <div className="text-center mt-8 mb-4">
        <p className="text-[11px] text-midnight/25">
          Built by Jasper · Synced from Notion
        </p>
      </div>
    </div>
  )
}
