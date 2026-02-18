import { useState } from 'react'

interface AddTaskFormProps {
  onAdd: (task: { title: string; priority: string; category: string; dueDate: string; notes: string }) => Promise<void>
  defaultDueDate?: string
  onCancel?: () => void
  inline?: boolean
}

const PRIORITY_OPTIONS = ['Urgent', 'High', 'Medium', 'Low']

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
  'Neo Somatic': '🧠',
}

export default function AddTaskForm({ onAdd, defaultDueDate = '', onCancel, inline = false }: AddTaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Medium',
    category: 'Other',
    dueDate: defaultDueDate,
    notes: '',
  })
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setCreating(true)
    try {
      await onAdd(formData)
      setFormData({ title: '', priority: 'Medium', category: 'Other', dueDate: defaultDueDate, notes: '' })
    } finally {
      setCreating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={inline ? 'space-y-3' : 'space-y-4'}>
      <div>
        <label className="block text-xs font-medium text-midnight/60 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
          placeholder="What needs to be done?"
          className="w-full px-3 py-2 bg-white border border-midnight/10 rounded-lg text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean transition-colors"
          autoFocus
          disabled={creating}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-midnight/60 mb-1.5">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData(f => ({ ...f, priority: e.target.value }))}
            className="w-full px-3 py-2 bg-white border border-midnight/10 rounded-lg text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
            disabled={creating}
          >
            {PRIORITY_OPTIONS.map(pri => (
              <option key={pri} value={pri}>{pri}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-midnight/60 mb-1.5">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(f => ({ ...f, category: e.target.value }))}
            className="w-full px-3 py-2 bg-white border border-midnight/10 rounded-lg text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
            disabled={creating}
          >
            {Object.keys(CATEGORY_ICONS).map(cat => (
              <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-midnight/60 mb-1.5">Due Date</label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData(f => ({ ...f, dueDate: e.target.value }))}
          className="w-full px-3 py-2 bg-white border border-midnight/10 rounded-lg text-sm text-midnight focus:outline-none focus:border-ocean transition-colors"
          disabled={creating}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-midnight/60 mb-1.5">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(f => ({ ...f, notes: e.target.value }))}
          placeholder="Additional details..."
          className="w-full px-3 py-2 bg-white border border-midnight/10 rounded-lg text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean transition-colors resize-none"
          rows={2}
          disabled={creating}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={!formData.title.trim() || creating}
          className="flex-1 px-4 py-2.5 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {creating ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Adding...
            </>
          ) : (
            '+ Add Task'
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-midnight/5 text-midnight/60 rounded-lg text-sm font-medium hover:bg-midnight/10 transition-colors"
            disabled={creating}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
