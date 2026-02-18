import { useState, useMemo } from 'react'
import AddTaskForm from './AddTaskForm'

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

interface DailyPlannerProps {
  tasks: Task[]
  onAddTask: (task: { title: string; priority: string; category: string; dueDate: string; notes: string }) => Promise<void>
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>
  onExpandTask: (taskId: string) => void
  expandedTask: string | null
  TaskCard: React.ComponentType<{ task: Task }>
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

function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (date.getTime() === today.getTime()) return 'Today'
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow'
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.getTime() === yesterday.getTime()) return 'Yesterday'
  
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function DailyPlanner({ tasks, onAddTask, onUpdateTask, onExpandTask, expandedTask, TaskCard }: DailyPlannerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]
  
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [showAddForm, setShowAddForm] = useState(false)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  // Filter tasks for selected date and unscheduled
  const { scheduledTasks, unscheduledTasks } = useMemo(() => {
    const scheduled = tasks.filter(t => 
      t.dueDate === selectedDate && 
      t.status !== 'Done' && 
      t.status !== 'Cancelled'
    ).sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4))
    
    const unscheduled = tasks.filter(t => 
      !t.dueDate && 
      t.status !== 'Done' && 
      t.status !== 'Cancelled'
    ).sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4))
    
    return { scheduledTasks: scheduled, unscheduledTasks: unscheduled }
  }, [tasks, selectedDate])

  const handlePrevDay = () => {
    const date = new Date(selectedDate + 'T00:00:00')
    date.setDate(date.getDate() - 1)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const handleNextDay = () => {
    const date = new Date(selectedDate + 'T00:00:00')
    date.setDate(date.getDate() + 1)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  const handleAddTask = async (taskData: { title: string; priority: string; category: string; dueDate: string; notes: string }) => {
    await onAddTask(taskData)
    setShowAddForm(false)
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetTaskId: string | null) => {
    e.preventDefault()
    if (!draggedTask || draggedTask === targetTaskId) return

    // In a real implementation, you'd reorder tasks here
    // For now, we'll just let the drop happen without reordering
    // since we'd need to maintain order in Notion or add an order field
    setDraggedTask(null)
  }

  const isToday = selectedDate === todayStr
  const isPast = new Date(selectedDate + 'T00:00:00') < today

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="bg-gradient-to-br from-ocean to-royal rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevDay}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex-1 text-center">
            <h2 className="font-display text-2xl font-bold mb-1">
              {formatDateForDisplay(selectedDate)}
            </h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:bg-white/20 transition-colors text-center"
            />
          </div>
          
          <button
            onClick={handleNextDay}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setSelectedDate(todayStr)}
            disabled={isToday}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Jump to Today
          </button>
          <div className="text-xs text-white/60">
            {scheduledTasks.length} task{scheduledTasks.length !== 1 ? 's' : ''} scheduled
          </div>
        </div>
      </div>

      {/* Add Task Button */}
      <div className="bg-cream rounded-xl p-4 border border-midnight/5">
        {showAddForm ? (
          <div>
            <div className="text-sm font-medium text-midnight mb-3">Add Task for {formatDateForDisplay(selectedDate)}</div>
            <AddTaskForm
              onAdd={handleAddTask}
              defaultDueDate={selectedDate}
              onCancel={() => setShowAddForm(false)}
              inline
            />
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-ocean/5 to-cyan/5 border border-ocean/20 text-ocean rounded-lg text-sm font-medium hover:from-ocean/10 hover:to-cyan/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Task for {isToday ? 'Today' : formatDateForDisplay(selectedDate)}
          </button>
        )}
      </div>

      {/* Scheduled Tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-display font-bold text-midnight">
            {isToday ? 'Today\'s Tasks' : isPast ? 'Tasks from this day' : 'Scheduled Tasks'}
          </h3>
          <span className="text-sm text-midnight/40">{scheduledTasks.length}</span>
        </div>
        
        {scheduledTasks.length === 0 ? (
          <div className="bg-cream rounded-xl p-8 text-center border border-dashed border-midnight/10">
            <div className="text-4xl mb-2">📅</div>
            <p className="text-midnight/50 text-sm">
              {isToday ? 'No tasks scheduled for today' : `No tasks scheduled for ${formatDateForDisplay(selectedDate)}`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {scheduledTasks.map((task, index) => {
              const priColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium
              return (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, task.id)}
                  className={`transition-opacity ${draggedTask === task.id ? 'opacity-50' : 'opacity-100'}`}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-4 cursor-move text-midnight/20 hover:text-midnight/40">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <TaskCard task={task} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Unscheduled Tasks */}
      {unscheduledTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-display font-bold text-midnight/60">
              Unscheduled Tasks
            </h3>
            <span className="text-sm text-midnight/40">{unscheduledTasks.length}</span>
          </div>
          
          <div className="space-y-2 opacity-60">
            {unscheduledTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
