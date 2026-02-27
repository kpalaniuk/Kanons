import { useState, useMemo } from 'react'

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

interface WeeklyPlannerProps {
  tasks: Task[]
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>
  onExpandTask: (taskId: string) => void
  expandedTask: string | null
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

function getWeekDates(weekOffset: number = 0): Date[] {
  const today = new Date()
  const currentDay = today.getDay() // 0 = Sunday
  const monday = new Date(today)
  
  // Calculate days to subtract to get to Monday
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1
  monday.setDate(today.getDate() - daysToMonday + (weekOffset * 7))
  monday.setHours(0, 0, 0, 0)
  
  const week: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    week.push(day)
  }
  
  return week
}

function formatDateStr(date: Date): string {
  return date.toISOString().split('T')[0]
}

function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export default function WeeklyPlanner({ tasks, onUpdateTask, onExpandTask, expandedTask }: WeeklyPlannerProps) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [draggedTask, setDraggedTask] = useState<{ task: Task; fromDate: string | null } | null>(null)

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset])

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {}
    const unscheduled: Task[] = []
    
    tasks
      .filter(t => t.status !== 'Done' && t.status !== 'Cancelled')
      .forEach(task => {
        if (task.dueDate) {
          if (!grouped[task.dueDate]) grouped[task.dueDate] = []
          grouped[task.dueDate].push(task)
        } else {
          unscheduled.push(task)
        }
      })
    
    // Sort each day's tasks by priority
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4))
    })
    
    unscheduled.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4))
    
    return { grouped, unscheduled }
  }, [tasks])

  const handlePrevWeek = () => setWeekOffset(w => w - 1)
  const handleNextWeek = () => setWeekOffset(w => w + 1)
  const handleThisWeek = () => setWeekOffset(0)

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, task: Task, fromDate: string | null) => {
    setDraggedTask({ task, fromDate })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetDate: string | null) => {
    e.preventDefault()
    if (!draggedTask) return

    const { task, fromDate } = draggedTask
    
    // Don't update if dropped on same date
    if (fromDate === targetDate) {
      setDraggedTask(null)
      return
    }

    // Update task due date
    try {
      await onUpdateTask(task.id, { dueDate: targetDate })
    } catch (err) {
      console.error('Failed to update task date:', err)
    }
    
    setDraggedTask(null)
  }

  const CompactTaskCard = ({ task, fromDate }: { task: Task; fromDate: string | null }) => {
    const priColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium
    const isDragging = draggedTask?.task.id === task.id

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task, fromDate)}
        onDragEnd={handleDragEnd}
        onClick={() => onExpandTask(task.id)}
        className={`bg-white rounded-lg p-2 border border-midnight/10 hover:border-ocean/40 hover:shadow-sm cursor-pointer transition-all ${
          isDragging ? 'opacity-30' : 'opacity-100'
        } ${expandedTask === task.id ? 'ring-2 ring-ocean' : ''}`}
      >
        <div className="flex items-start gap-2">
          <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${priColor.dot}`} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-midnight truncate leading-tight">
              {task.title}
            </div>
            <div className="text-[10px] text-midnight/40 mt-0.5">
              {CATEGORY_ICONS[task.category] || '📌'}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="bg-gradient-to-br from-ocean to-royal rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevWeek}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold mb-1">
              {weekOffset === 0 ? 'This Week' : weekOffset > 0 ? `${weekOffset} Week${weekOffset > 1 ? 's' : ''} Ahead` : `${Math.abs(weekOffset)} Week${Math.abs(weekOffset) > 1 ? 's' : ''} Ago`}
            </h2>
            <p className="text-white/70 text-sm">
              {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {weekOffset !== 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={handleThisWeek}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
            >
              Jump to This Week
            </button>
          </div>
        )}
      </div>

      {/* Week Grid */}
      <div className="bg-cream rounded-2xl p-4 border border-midnight/5 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-7 gap-3 mb-4">
            {weekDates.map((date, index) => {
              const dateStr = formatDateStr(date)
              const dayTasks = tasksByDate.grouped[dateStr] || []
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
              const dayNum = date.getDate()
              const isCurrentDay = isToday(date)

              return (
                <div
                  key={dateStr}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dateStr)}
                  className={`rounded-xl p-3 min-h-[300px] transition-colors ${
                    isCurrentDay 
                      ? 'bg-gradient-to-br from-ocean/10 to-cyan/10 border-2 border-ocean/30' 
                      : 'bg-white border border-midnight/10'
                  }`}
                >
                  <div className="mb-3 pb-2 border-b border-midnight/10">
                    <div className={`text-xs font-medium uppercase tracking-wider ${
                      isCurrentDay ? 'text-ocean' : 'text-midnight/60'
                    }`}>
                      {dayName}
                    </div>
                    <div className={`text-2xl font-display font-bold ${
                      isCurrentDay ? 'text-ocean' : 'text-midnight'
                    }`}>
                      {dayNum}
                    </div>
                    <div className="text-[10px] text-midnight/40 mt-0.5">
                      {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {dayTasks.map(task => (
                      <CompactTaskCard key={task.id} task={task} fromDate={dateStr} />
                    ))}
                  </div>

                  {dayTasks.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-midnight/20 text-xs">
                      Drop tasks here
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Unscheduled Tasks Row */}
          {tasksByDate.unscheduled.length > 0 && (
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, null)}
              className="bg-midnight/5 rounded-xl p-4 border-2 border-dashed border-midnight/20"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-display font-bold text-midnight/60">
                  📦 Unscheduled
                </h3>
                <span className="text-xs text-midnight/40">
                  {tasksByDate.unscheduled.length} task{tasksByDate.unscheduled.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {tasksByDate.unscheduled.map(task => (
                  <CompactTaskCard key={task.id} task={task} fromDate={null} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-ocean/5 border border-ocean/20 rounded-xl p-4">
        <div className="flex items-start gap-2 text-sm text-midnight/60">
          <span className="text-ocean">💡</span>
          <div>
            <strong className="text-midnight">Drag & Drop:</strong> Drag tasks between days to reschedule them. Drop in "Unscheduled" to remove due dates.
          </div>
        </div>
      </div>
    </div>
  )
}
