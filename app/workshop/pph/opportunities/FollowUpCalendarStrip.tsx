'use client'

interface Client {
  id: string
  name: string
  followUpDate: string | null
  stage: string
}

interface Props {
  clients: Client[]
  activeDay: string | null        // ISO date string "YYYY-MM-DD" or null
  onDayClick: (day: string | null) => void
}

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function FollowUpCalendarStrip({ clients, activeDay, onDayClick }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = toLocalDateStr(today)

  // Build 14 days starting from today
  const days: Date[] = []
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }

  // Active clients only
  const activeClients = clients.filter(c => c.stage !== 'Closed' && c.stage !== 'Lost')

  // Map dateStr → clients
  const byDay: Record<string, Client[]> = {}
  activeClients.forEach(c => {
    if (!c.followUpDate) return
    const ds = c.followUpDate.slice(0, 10)
    if (!byDay[ds]) byDay[ds] = []
    byDay[ds].push(c)
  })

  // Count overdue (before today) clients
  const overdueClients = activeClients.filter(c => {
    if (!c.followUpDate) return false
    return c.followUpDate.slice(0, 10) < todayStr
  })

  return (
    <div className="bg-cream border border-midnight/8 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-midnight/60 uppercase tracking-wide">Follow-Up Calendar</span>
          {activeDay && (
            <button
              onClick={() => onDayClick(null)}
              className="flex items-center gap-1 px-2 py-0.5 bg-ocean/10 text-ocean rounded-full text-xs font-medium hover:bg-ocean/20 transition-colors"
            >
              Clear ×
            </button>
          )}
        </div>
        {overdueClients.length > 0 && (
          <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
            {overdueClients.length} overdue not shown
          </span>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {days.map(d => {
          const ds = toLocalDateStr(d)
          const isToday = ds === todayStr
          const isActive = activeDay === ds
          const dayClients = byDay[ds] || []
          const count = dayClients.length
          const dayLabel = DAY_LABELS[d.getDay()]
          const dateLabel = d.getDate()

          return (
            <button
              key={ds}
              onClick={() => onDayClick(isActive ? null : ds)}
              className={`flex flex-col items-center min-w-[52px] rounded-lg px-1.5 py-2 transition-all border ${
                isActive
                  ? 'bg-ocean text-white border-ocean shadow-sm'
                  : isToday
                  ? 'bg-ocean/10 border-ocean/30 text-ocean hover:bg-ocean/20'
                  : 'bg-midnight/3 border-midnight/8 text-midnight/70 hover:bg-midnight/8'
              }`}
            >
              <span className="text-[10px] font-medium uppercase tracking-wide opacity-75">{dayLabel}</span>
              <span className={`text-sm font-bold leading-tight ${isActive ? 'text-white' : isToday ? 'text-ocean' : 'text-midnight'}`}>
                {dateLabel}
              </span>

              {count > 0 ? (
                <div className="mt-1.5 flex flex-col items-center gap-0.5 w-full">
                  {/* Show up to 2 initials pills, then +N */}
                  {dayClients.slice(0, 2).map(c => (
                    <span
                      key={c.id}
                      title={c.name}
                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full w-full text-center truncate ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-ocean/15 text-ocean'
                      }`}
                    >
                      {getInitials(c.name)}
                    </span>
                  ))}
                  {count > 2 && (
                    <span className={`text-[9px] font-medium ${isActive ? 'text-white/70' : 'text-midnight/40'}`}>
                      +{count - 2}
                    </span>
                  )}
                </div>
              ) : (
                <div className="mt-1.5 w-6 h-0.5 rounded-full bg-midnight/10" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
