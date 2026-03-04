'use client'

import { useState, useEffect } from 'react'
import {
  Music,
  Mic,
  Headphones,
  Flame,
  CheckCircle,
  Circle,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  Trophy,
  Star,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type InstrumentType = 'trumpet' | 'production'

interface MusicSession {
  id: string
  date: string // YYYY-MM-DD
  instrument: InstrumentType
  durationMin: number
  notes: string
  timestamp: number
}

interface StorageData {
  sessions: MusicSession[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDate(dateStr: string): string {
  const [y, m, day] = dateStr.split('-').map(Number)
  const d = new Date(y, m - 1, day)
  const opts: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }
  return d.toLocaleDateString('en-US', opts)
}

function calcStreak(sessions: MusicSession[], instrument: InstrumentType | 'any'): number {
  const filtered = instrument === 'any'
    ? sessions
    : sessions.filter(s => s.instrument === instrument)

  const days = [...new Set(filtered.map(s => s.date))].sort().reverse()

  if (!days.length) return 0

  let streak = 0
  const today = todayStr()
  let cursor = today

  for (const day of days) {
    if (day === cursor) {
      streak++
      // Move cursor back one day
      const d = new Date(cursor)
      d.setDate(d.getDate() - 1)
      cursor = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    } else if (day < cursor) {
      // Streak broken — but check if it's just today missing (still valid if yesterday was hit)
      if (streak === 0) {
        // Haven't started yet — check if yesterday was logged (streak carries)
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const yd = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`
        if (day === yd) {
          streak++
          const d = new Date(yd)
          d.setDate(d.getDate() - 1)
          cursor = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        } else {
          break
        }
      } else {
        break
      }
    }
  }

  return streak
}

function calcTotalMinutes(sessions: MusicSession[], instrument: InstrumentType | 'any'): number {
  return sessions
    .filter(s => instrument === 'any' || s.instrument === instrument)
    .reduce((sum, s) => sum + s.durationMin, 0)
}

function calcTotalDays(sessions: MusicSession[], instrument: InstrumentType | 'any'): number {
  const filtered = instrument === 'any'
    ? sessions
    : sessions.filter(s => s.instrument === instrument)
  return new Set(filtered.map(s => s.date)).size
}

function loadData(): StorageData {
  if (typeof window === 'undefined') return { sessions: [] }
  try {
    const raw = localStorage.getItem('kanons-music-habit')
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return { sessions: [] }
}

function saveData(data: StorageData) {
  if (typeof window === 'undefined') return
  localStorage.setItem('kanons-music-habit', JSON.stringify(data))
}

// ── Streak Badge ──────────────────────────────────────────────────────────────

function StreakBadge({ streak }: { streak: number }) {
  if (streak === 0) return null
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
      <Flame size={11} />
      {streak}d streak
    </span>
  )
}

// ── Instrument Card ───────────────────────────────────────────────────────────

function InstrumentCard({
  type,
  label,
  icon: Icon,
  color,
  sessions,
  todayDone,
  onLog,
}: {
  type: InstrumentType
  label: string
  icon: React.ElementType
  color: string
  sessions: MusicSession[]
  todayDone: boolean
  onLog: (instrument: InstrumentType) => void
}) {
  const streak = calcStreak(sessions, type)
  const totalMin = calcTotalMinutes(sessions, type)
  const totalDays = calcTotalDays(sessions, type)
  const todaySessions = sessions.filter(s => s.date === todayStr() && s.instrument === type)
  const todayMin = todaySessions.reduce((s, x) => s + x.durationMin, 0)

  return (
    <div className={`bg-cream rounded-2xl p-6 border ${todayDone ? 'border-green-200' : 'border-midnight/10'} transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={20} className="text-cream" />
          </div>
          <div>
            <h3 className="font-display text-lg text-midnight">{label}</h3>
            <StreakBadge streak={streak} />
          </div>
        </div>
        {todayDone ? (
          <CheckCircle size={24} className="text-green-500" />
        ) : (
          <Circle size={24} className="text-midnight/20" />
        )}
      </div>

      {/* Today's minutes */}
      {todayDone && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
          <p className="text-sm text-green-700 font-medium">
            ✓ {todayMin} min logged today
            {todaySessions.length > 1 && ` (${todaySessions.length} sessions)`}
          </p>
          {todaySessions[0]?.notes && (
            <p className="text-xs text-green-600 mt-0.5 italic">"{todaySessions[0].notes}"</p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-2 bg-sand/50 rounded-lg">
          <p className="text-xl font-bold text-midnight">{totalDays}</p>
          <p className="text-xs text-midnight/50">total days</p>
        </div>
        <div className="text-center p-2 bg-sand/50 rounded-lg">
          <p className="text-xl font-bold text-midnight">{Math.round(totalMin / 60 * 10) / 10}h</p>
          <p className="text-xs text-midnight/50">total time</p>
        </div>
      </div>

      <button
        onClick={() => onLog(type)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-midnight text-cream rounded-lg text-sm font-medium hover:bg-ocean transition-colors"
      >
        <PlusCircle size={15} />
        Log session
      </button>
    </div>
  )
}

// ── Log Modal ─────────────────────────────────────────────────────────────────

function LogModal({
  instrument,
  onClose,
  onSave,
}: {
  instrument: InstrumentType
  onClose: () => void
  onSave: (session: Omit<MusicSession, 'id' | 'timestamp'>) => void
}) {
  const [duration, setDuration] = useState('30')
  const [notes, setNotes] = useState('')
  const label = instrument === 'trumpet' ? '🎺 Trumpet' : '🎛️ Production'

  function handleSave() {
    const d = parseInt(duration)
    if (!d || d < 1) return
    onSave({ date: todayStr(), instrument, durationMin: d, notes: notes.trim() })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-midnight/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-cream rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-xl text-midnight mb-1">Log session</h3>
        <p className="text-sm text-midnight/50 mb-5">{label} · {formatDate(todayStr())}</p>

        <label className="block mb-4">
          <span className="text-sm font-medium text-midnight/70 mb-1.5 flex items-center gap-1.5">
            <Clock size={13} /> Duration (minutes)
          </span>
          <input
            type="number"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            min="1"
            max="240"
            className="w-full border border-midnight/15 rounded-lg px-4 py-2.5 text-midnight bg-white focus:outline-none focus:border-ocean text-sm"
          />
        </label>

        {/* Quick presets */}
        <div className="flex gap-2 mb-4">
          {[15, 30, 45, 60].map(min => (
            <button
              key={min}
              onClick={() => setDuration(String(min))}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                duration === String(min)
                  ? 'bg-midnight text-cream border-midnight'
                  : 'text-midnight/60 border-midnight/15 hover:border-midnight/40'
              }`}
            >
              {min}m
            </button>
          ))}
        </div>

        <label className="block mb-5">
          <span className="text-sm font-medium text-midnight/70 mb-1.5 block">
            Notes <span className="text-midnight/30 font-normal">(optional)</span>
          </span>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="What did you work on? How did it feel?"
            rows={3}
            className="w-full border border-midnight/15 rounded-lg px-4 py-2.5 text-midnight bg-white focus:outline-none focus:border-ocean text-sm resize-none"
          />
        </label>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-midnight/15 rounded-lg text-sm text-midnight/60 hover:text-midnight transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-midnight text-cream rounded-lg text-sm font-medium hover:bg-ocean transition-colors"
          >
            Save session
          </button>
        </div>
      </div>
    </div>
  )
}

// ── History ───────────────────────────────────────────────────────────────────

function History({ sessions }: { sessions: MusicSession[] }) {
  const [expanded, setExpanded] = useState(false)

  // Group by date
  const byDate: Record<string, MusicSession[]> = {}
  sessions.forEach(s => {
    if (!byDate[s.date]) byDate[s.date] = []
    byDate[s.date].push(s)
  })

  const sortedDates = Object.keys(byDate).sort().reverse()
  const displayDates = expanded ? sortedDates : sortedDates.slice(0, 7)

  if (!sessions.length) {
    return (
      <div className="text-center py-12 text-midnight/30">
        <Music size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">No sessions logged yet. Start today! 🎺</p>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-3">
        {displayDates.map(date => {
          const day = byDate[date]
          const trumpetMin = day.filter(s => s.instrument === 'trumpet').reduce((s, x) => s + x.durationMin, 0)
          const prodMin = day.filter(s => s.instrument === 'production').reduce((s, x) => s + x.durationMin, 0)
          const isToday = date === todayStr()

          return (
            <div key={date} className={`p-4 rounded-xl border ${isToday ? 'bg-amber-50 border-amber-200' : 'bg-cream border-midnight/8'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-semibold ${isToday ? 'text-amber-800' : 'text-midnight'}`}>
                  {isToday ? '🌟 Today' : formatDate(date)}
                </span>
                <span className="text-xs text-midnight/40">
                  {trumpetMin + prodMin} min total
                </span>
              </div>
              <div className="flex gap-3">
                {trumpetMin > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-terracotta/10 text-terracotta rounded-full border border-terracotta/20">
                    🎺 {trumpetMin}m
                  </span>
                )}
                {prodMin > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-ocean/10 text-ocean rounded-full border border-ocean/20">
                    🎛️ {prodMin}m
                  </span>
                )}
              </div>
              {day.filter(s => s.notes).map(s => (
                <p key={s.id} className="text-xs text-midnight/50 mt-1.5 italic">
                  {s.instrument === 'trumpet' ? '🎺' : '🎛️'} "{s.notes}"
                </p>
              ))}
            </div>
          )
        })}
      </div>

      {sortedDates.length > 7 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 text-sm text-midnight/50 hover:text-midnight transition-colors py-2"
        >
          {expanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show {sortedDates.length - 7} more days</>}
        </button>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MusicHabitPage() {
  const [data, setData] = useState<StorageData>({ sessions: [] })
  const [mounted, setMounted] = useState(false)
  const [logInstrument, setLogInstrument] = useState<InstrumentType | null>(null)

  useEffect(() => {
    setData(loadData())
    setMounted(true)
  }, [])

  function handleLog(instrument: InstrumentType) {
    setLogInstrument(instrument)
  }

  function handleSave(session: Omit<MusicSession, 'id' | 'timestamp'>) {
    const newSession: MusicSession = {
      ...session,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
    }
    const updated = { sessions: [newSession, ...data.sessions] }
    setData(updated)
    saveData(updated)
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64 text-midnight/30">
        <Music size={32} className="animate-pulse" />
      </div>
    )
  }

  const todayTrumpet = data.sessions.some(s => s.date === todayStr() && s.instrument === 'trumpet')
  const todayProd = data.sessions.some(s => s.date === todayStr() && s.instrument === 'production')
  const todayDone = todayTrumpet || todayProd

  const overallStreak = calcStreak(data.sessions, 'any')
  const totalMinAll = calcTotalMinutes(data.sessions, 'any')
  const totalDaysAll = calcTotalDays(data.sessions, 'any')

  // 30-min habit — how many days this month hit ≥30min?
  const now = new Date()
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const thisMothSessions = data.sessions.filter(s => s.date.startsWith(monthPrefix))
  const byDateThisMonth: Record<string, number> = {}
  thisMothSessions.forEach(s => {
    byDateThisMonth[s.date] = (byDateThisMonth[s.date] || 0) + s.durationMin
  })
  const daysHit30 = Object.values(byDateThisMonth).filter(m => m >= 30).length
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const daysSoFar = now.getDate()
  const paceFor30 = Math.round((daysHit30 / daysSoFar) * daysInMonth)

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-midnight flex items-center justify-center">
            <Music size={20} className="text-cream" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-midnight">Music Habit</h1>
            <p className="text-sm text-midnight/50">30 min/day · trumpet + production</p>
          </div>
        </div>

        {/* Today status banner */}
        <div className={`mt-4 p-4 rounded-xl border ${todayDone ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center gap-2">
            {todayDone
              ? <CheckCircle size={18} className="text-green-600" />
              : <Circle size={18} className="text-amber-500" />
            }
            <p className={`text-sm font-semibold ${todayDone ? 'text-green-800' : 'text-amber-800'}`}>
              {todayDone
                ? `You played today ✓${todayTrumpet && todayProd ? ' (both!)' : ''}`
                : `Haven't logged music yet today`
              }
            </p>
          </div>
          {!todayDone && (
            <p className="text-xs text-amber-700 mt-1 ml-6">30 minutes keeps the streak alive 🎺</p>
          )}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-4 bg-cream rounded-xl border border-midnight/8">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame size={16} className="text-amber-500" />
            <span className="text-2xl font-bold text-midnight">{overallStreak}</span>
          </div>
          <p className="text-xs text-midnight/50">day streak</p>
        </div>
        <div className="text-center p-4 bg-cream rounded-xl border border-midnight/8">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Calendar size={16} className="text-ocean" />
            <span className="text-2xl font-bold text-midnight">{totalDaysAll}</span>
          </div>
          <p className="text-xs text-midnight/50">days logged</p>
        </div>
        <div className="text-center p-4 bg-cream rounded-xl border border-midnight/8">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Trophy size={16} className="text-terracotta" />
            <span className="text-2xl font-bold text-midnight">{daysHit30}</span>
          </div>
          <p className="text-xs text-midnight/50">≥30min days</p>
        </div>
      </div>

      {/* Monthly pace bar */}
      {daysSoFar > 0 && (
        <div className="bg-cream rounded-xl p-4 border border-midnight/8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-midnight">Monthly pace</span>
            <span className="text-xs text-midnight/50">
              {daysHit30}/{daysSoFar} days · on pace for {paceFor30}/{daysInMonth}
            </span>
          </div>
          <div className="h-2 bg-midnight/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-terracotta rounded-full transition-all"
              style={{ width: `${Math.min(100, (daysHit30 / daysSoFar) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Instrument Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InstrumentCard
          type="trumpet"
          label="Trumpet"
          icon={Mic}
          color="bg-terracotta"
          sessions={data.sessions}
          todayDone={todayTrumpet}
          onLog={handleLog}
        />
        <InstrumentCard
          type="production"
          label="Production"
          icon={Headphones}
          color="bg-ocean"
          sessions={data.sessions}
          todayDone={todayProd}
          onLog={handleLog}
        />
      </div>

      {/* Total time summary */}
      <div className="bg-cream rounded-xl p-4 border border-midnight/8">
        <div className="flex items-center gap-2 mb-3">
          <Star size={14} className="text-amber-500" />
          <span className="text-sm font-semibold text-midnight">All-time</span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-midnight">{Math.round(totalMinAll / 60 * 10) / 10}h</p>
            <p className="text-xs text-midnight/50">total logged</p>
          </div>
          <div>
            <p className="text-lg font-bold text-terracotta">{Math.round(calcTotalMinutes(data.sessions, 'trumpet') / 60 * 10) / 10}h</p>
            <p className="text-xs text-midnight/50">trumpet</p>
          </div>
          <div>
            <p className="text-lg font-bold text-ocean">{Math.round(calcTotalMinutes(data.sessions, 'production') / 60 * 10) / 10}h</p>
            <p className="text-xs text-midnight/50">production</p>
          </div>
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="font-display text-xl text-midnight mb-4">Session history</h2>
        <History sessions={data.sessions} />
      </div>

      {/* Log modal */}
      {logInstrument && (
        <LogModal
          instrument={logInstrument}
          onClose={() => setLogInstrument(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
