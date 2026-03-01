'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sun, Cloud, CloudRain, Droplets, Wind,
  CheckSquare, AlertCircle, Clock, Trophy,
  Map, Music, Mic, ArrowRight, RefreshCw,
  Calendar, Zap, Heart,
} from 'lucide-react'

// ── Gratitude Prompts ─────────────────────────────────────────────────────────

const GRATITUDE_PROMPTS = [
  "What's one small thing that made yesterday worth it?",
  "Who's someone you're quietly grateful for right now?",
  "Name one thing about your home that you love.",
  "What's a skill you've built that you take for granted?",
  "What made you smile this week, even briefly?",
  "Think of one moment with Bohdi or Meta that you want to remember.",
  "What's working well in your business right now?",
  "Name something beautiful you've seen recently.",
  "What's a relationship in your life you don't appreciate enough?",
  "What's one thing your body can do that you're grateful for?",
  "What piece of music has moved you lately?",
  "What's something you built — physical or otherwise — that you're proud of?",
  "What's one convenience in your life that people 100 years ago would have considered magic?",
  "What's something Paige does that makes your life better?",
  "Name a mentor, teacher, or influence who shaped who you are.",
  "What's a challenge from last year that made you stronger?",
  "What's one thing about North Park / San Diego that you love?",
  "What's a tool or system in your life that quietly makes everything easier?",
  "What's one thing your kids said or did recently that stuck with you?",
  "Name something in nature you find genuinely beautiful.",
  "What's a creative project you're proud of, finished or not?",
  "What's one freedom you have today that you don't want to take for granted?",
  "Who in your community shows up consistently? What does that mean to you?",
  "What's something about your grandfather Stefan's story that inspires you?",
  "What's a meal, coffee, or experience you genuinely enjoy?",
  "What's one aspect of running your own business that you love?",
  "Name something you learned this month — even something small.",
  "What's one thing you'd miss if it disappeared tomorrow?",
  "What does Granada House mean to you right now?",
  "What's something in your life that's better than it was a year ago?",
  "What's one moment from soccer coaching you want to carry with you?",
]

// ── Music Streak ──────────────────────────────────────────────────────────────

interface MusicSession {
  id: string
  date: string // YYYY-MM-DD
  instrument: string
  durationMin: number
}

function calcMusicStreak(sessions: MusicSession[]): number {
  if (!sessions.length) return 0
  const days = [...new Set(sessions.map((s) => s.date))].sort().reverse()
  const today = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

  let streak = 0
  let cursor = fmt(today)

  for (const day of days) {
    if (day === cursor) {
      streak++
      const d = new Date(cursor)
      d.setDate(d.getDate() - 1)
      cursor = fmt(d)
    } else if (day < cursor) {
      if (streak === 0) {
        // Allow yesterday to start the streak
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        if (day === fmt(yesterday)) {
          streak++
          yesterday.setDate(yesterday.getDate() - 1)
          cursor = fmt(yesterday)
        } else break
      } else break
    }
  }
  return streak
}

// ── Sunday Weekly Review ──────────────────────────────────────────────────────

const WEEKLY_REVIEW_PROMPTS = [
  { area: 'Work & Business', icon: '💼', q: 'What moved the needle this week? What stalled?' },
  { area: 'Music & Creative', icon: '🎵', q: 'Did you play? What creative energy needs attention?' },
  { area: 'Family & Home', icon: '🏡', q: 'How present were you with Paige, Bohdi, and Meta?' },
  { area: 'Health & Body', icon: '💪', q: 'How did your body feel? Sleep, movement, food?' },
  { area: 'Relationships', icon: '🤝', q: 'Who showed up for you this week? Who needs a check-in?' },
  { area: 'Finance', icon: '💰', q: 'Anything slipping on the money side? Decisions pending?' },
]

function isSunday(): boolean {
  return new Date().getDay() === 0
}

function getDailyGratitudePrompt(): string {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  return GRATITUDE_PROMPTS[dayOfYear % GRATITUDE_PROMPTS.length]
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface Task {
  id: string
  title: string
  status: string
  priority: string
  category: string
  dueDate: string | null
  notes: string
}

interface WeatherData {
  temp_c: number
  temp_f: number
  description: string
  humidity: number
  wind_kph: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDayContext(): { greeting: string; dayNote: string; isCoachingDay: boolean } {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay() // 0=Sun, 4=Thu

  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    'Good evening'

  const isCoachingDay = day === 4 // Thursday
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayName = dayNames[day]

  const dayNotes: Record<number, string> = {
    1: 'Pickleball day — work window 9am–2pm',
    2: 'Date night with Paige tonight',
    3: 'Bohdi soccer practice at 3:30pm — leave by 3:15',
    4: 'FC Balboa coaching — home by 3:30pm',
    5: 'TGIF. Wrap the week strong.',
    6: 'Weekend. Recharge.',
    0: 'Sunday. Weekly review is below ↓',
  }

  return {
    greeting,
    dayNote: dayNotes[day] || `Happy ${dayName}`,
    isCoachingDay,
  }
}

function getTripCountdown(): { days: number; label: string; dest: string } {
  const now = new Date()
  // Scotland/Ireland trip: July 14, 2026
  const tripStart = new Date('2026-07-14')
  const msLeft = tripStart.getTime() - now.getTime()
  const days = Math.ceil(msLeft / (1000 * 60 * 60 * 24))
  return {
    days,
    label: days > 0 ? `${days} days` : 'IT\'S TIME!',
    dest: 'Scotland / Ireland',
  }
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case 'Urgent': return { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200' }
    case 'High':   return { dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700 border-orange-200' }
    case 'Medium': return { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200' }
    default:       return { dot: 'bg-slate-400', badge: 'bg-slate-50 text-slate-600 border-slate-200' }
  }
}

function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    'LO Buddy': '🤖', 'Lead Gen': '📊', 'Granada House': '🏡',
    Music: '🎵', Finance: '💰', 'Life Org': '🏠',
    'System / DevOps': '⚙️', 'Home & Family': '👨‍👩‍👧‍👦', Other: '📌',
  }
  return icons[category] || '📌'
}

function WeatherIcon({ desc }: { desc: string }) {
  const d = desc.toLowerCase()
  if (d.includes('rain') || d.includes('drizzle')) return <CloudRain className="w-8 h-8 text-blue-400" />
  if (d.includes('cloud') || d.includes('overcast')) return <Cloud className="w-8 h-8 text-slate-400" />
  return <Sun className="w-8 h-8 text-amber-400" />
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MorningBriefPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [musicStreak, setMusicStreak] = useState<number>(0)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({})
  const [topThree, setTopThree] = useState('')
  const sunday = isSunday()

  const { greeting, dayNote, isCoachingDay } = getDayContext()
  const trip = getTripCountdown()

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  const fetchAll = async () => {
    setLoading(true)
    try {
      // Fetch tasks — top priority items
      const [tasksRes, weatherRes] = await Promise.allSettled([
        fetch('/api/tasks?status=Not%20Started&status=In%20Progress&limit=20'),
        fetch('https://wttr.in/San+Diego?format=j1'),
      ])

      if (tasksRes.status === 'fulfilled' && tasksRes.value.ok) {
        const data = await tasksRes.value.json()
        const allTasks: Task[] = data.tasks || []
        // Sort by priority, take top 7
        const priorityOrder: Record<string, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 }
        const sorted = allTasks
          .filter((t) => t.status !== 'Done' && t.status !== 'Cancelled')
          .sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9))
          .slice(0, 7)
        setTasks(sorted)
      }

      if (weatherRes.status === 'fulfilled' && weatherRes.value.ok) {
        const data = await weatherRes.value.json()
        const current = data.current_condition?.[0]
        if (current) {
          setWeather({
            temp_c: parseInt(current.temp_C),
            temp_f: parseInt(current.temp_F),
            description: current.weatherDesc?.[0]?.value || 'Clear',
            humidity: parseInt(current.humidity),
            wind_kph: parseInt(current.windspeedKmph),
          })
        }
      }
    } catch (err) {
      console.error('Error fetching morning brief data:', err)
    } finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  }

  useEffect(() => {
    fetchAll()
    // Load music streak from localStorage
    try {
      const raw = localStorage.getItem('kanons-music-habit')
      if (raw) {
        const data = JSON.parse(raw) as { sessions: MusicSession[] }
        setMusicStreak(calcMusicStreak(data.sessions || []))
      }
    } catch {
      // localStorage unavailable or malformed
    }
  }, [])

  const urgentTasks = tasks.filter((t) => t.priority === 'Urgent')
  const highTasks = tasks.filter((t) => t.priority === 'High')
  const otherTasks = tasks.filter((t) => t.priority !== 'Urgent' && t.priority !== 'High')
  const overdueTasks = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date())
  const gratitudePrompt = getDailyGratitudePrompt()

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">

      {/* ── Header ── */}
      <div className="bg-midnight rounded-2xl p-8 text-cream">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-cream/40 text-sm font-medium tracking-wide uppercase mb-1">{dateStr}</p>
            <h1 className="font-display text-4xl text-cream mb-2">{greeting}, Kyle.</h1>
            <p className="text-cream/60 text-lg">{dayNote}</p>
          </div>
          <button
            onClick={fetchAll}
            className="flex items-center gap-2 text-xs text-cream/40 hover:text-cream/80 transition-colors mt-1 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-6 pt-6 border-t border-cream/10 grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-display text-red-400">{urgentTasks.length}</div>
            <div className="text-xs text-cream/40 mt-0.5">Urgent items</div>
          </div>
          <div>
            <div className="text-2xl font-display text-orange-400">{highTasks.length}</div>
            <div className="text-xs text-cream/40 mt-0.5">High priority</div>
          </div>
          <div>
            <div className="text-2xl font-display text-cyan-400">{trip.days}</div>
            <div className="text-xs text-cream/40 mt-0.5">Days to Scotland</div>
          </div>
        </div>
      </div>

      {/* ── Two-column: Weather + Trip Countdown ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Weather */}
        <div className="bg-cream rounded-2xl p-6 border border-midnight/5">
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-4 h-4 text-amber-400" />
            <h2 className="font-display text-lg text-midnight">San Diego</h2>
          </div>
          {weather ? (
            <div className="flex items-center gap-4">
              <WeatherIcon desc={weather.description} />
              <div>
                <div className="text-3xl font-display text-midnight">{weather.temp_f}°F</div>
                <div className="text-sm text-midnight/50">{weather.description}</div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-midnight/40">
                  <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{weather.humidity}%</span>
                  <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{weather.wind_kph} km/h</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-midnight/30 text-sm">{loading ? 'Loading…' : 'Unavailable'}</div>
          )}
        </div>

        {/* Trip Countdown */}
        <div className="bg-gradient-to-br from-ocean/10 to-cyan-500/10 rounded-2xl p-6 border border-ocean/20">
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-4 h-4 text-ocean" />
            <h2 className="font-display text-lg text-midnight">{trip.dest}</h2>
          </div>
          <div className="text-4xl font-display text-ocean">{trip.label}</div>
          <div className="text-sm text-midnight/50 mt-1">July 14, 2026</div>
          <Link
            href="/workshop/personal/trip-july-2026"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-ocean hover:underline"
          >
            View itinerary <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ── Scotland/Ireland Trip — Open Bookings Alert ── */}
      {trip.days > 0 && trip.days < 200 && (
        <Link
          href="/workshop/personal/trip-july-2026"
          className="block bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl p-5 border border-sky-200 hover:border-sky-400 transition-colors group"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">🏴󠁧󠁢󠁳󠁣󠁴󠁿</span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-midnight">Scotland &amp; Ireland — 5 urgent bookings open</p>
                  <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">!</span>
                </div>
                <p className="text-xs text-midnight/45 mt-0.5">
                  Eagle Brae · Skye Airbnb · East Lothian HX · Dublin HX · Edinburgh hotel
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-sky-600 group-hover:text-sky-800 transition-colors shrink-0">
              Book now <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </Link>
      )}

      {/* ── Sunday Weekly Review ── */}
      {sunday && (
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 overflow-hidden">
          <button
            onClick={() => setReviewOpen(o => !o)}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-base">📋</div>
              <div>
                <h2 className="font-display text-lg text-midnight">Sunday Weekly Review</h2>
                <p className="text-xs text-midnight/40 mt-0.5">15 minutes. Reflect, reset, set the week.</p>
              </div>
            </div>
            <div className={`text-midnight/30 transition-transform duration-200 ${reviewOpen ? 'rotate-180' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 10.5L2.5 5h11L8 10.5z"/>
              </svg>
            </div>
          </button>

          {reviewOpen && (
            <div className="px-6 pb-6 space-y-5">
              <div className="border-t border-indigo-100 pt-5">
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-4">Life Area Check-In</p>
                <div className="space-y-4">
                  {WEEKLY_REVIEW_PROMPTS.map((prompt) => (
                    <div key={prompt.area}>
                      <label className="block text-sm font-medium text-midnight mb-1">
                        {prompt.icon} {prompt.area}
                        <span className="block text-xs font-normal text-midnight/40 mt-0.5">{prompt.q}</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Quick note…"
                        value={reviewNotes[prompt.area] || ''}
                        onChange={(e) => setReviewNotes(n => ({ ...n, [prompt.area]: e.target.value }))}
                        className="w-full text-sm bg-white/80 border border-indigo-100 rounded-xl px-3 py-2 text-midnight placeholder-midnight/20 resize-none focus:outline-none focus:border-indigo-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-indigo-100 pt-5">
                <label className="block text-sm font-semibold text-midnight mb-1">
                  🎯 Top 3 priorities for this week
                </label>
                <textarea
                  rows={3}
                  placeholder="1. &#10;2. &#10;3."
                  value={topThree}
                  onChange={(e) => setTopThree(e.target.value)}
                  className="w-full text-sm bg-white/80 border border-indigo-100 rounded-xl px-3 py-2 text-midnight placeholder-midnight/20 resize-none focus:outline-none focus:border-indigo-300"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-midnight/30">Notes stay local — refresh clears them.</p>
                <Link
                  href="/workshop/personal/tasks"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:underline"
                >
                  Open Task Board <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Overdue Alert ── */}
      {overdueTasks.length > 0 && (
        <div className="bg-red-50 rounded-2xl p-5 border border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <h2 className="font-display text-lg text-red-700">
              {overdueTasks.length} Overdue {overdueTasks.length === 1 ? 'Task' : 'Tasks'}
            </h2>
          </div>
          <div className="space-y-2">
            {overdueTasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 bg-white/70 rounded-lg px-4 py-3 border border-red-100">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-800 leading-snug">{task.title}</p>
                  <p className="text-xs text-red-400 mt-0.5">
                    Due {new Date(task.dueDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {task.category ? ` · ${task.category}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Today's Priorities ── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-8 bg-terracotta rounded-full" />
          <Zap className="w-5 h-5 text-terracotta" />
          <h2 className="font-display text-2xl text-midnight">Today's Priorities</h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-cream rounded-xl p-4 border border-midnight/5 animate-pulse">
                <div className="h-4 bg-midnight/10 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-cream rounded-2xl p-8 text-center border border-midnight/5">
            <CheckSquare className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-midnight/50">Clear queue. Nice.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const style = getPriorityStyle(task.priority)
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
              return (
                <div
                  key={task.id}
                  className="bg-cream rounded-xl p-4 border border-midnight/5 hover:border-midnight/15 transition-colors flex items-start gap-3 group"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${style.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-midnight leading-snug">{task.title}</span>
                      {isOverdue && (
                        <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                          <AlertCircle className="w-3 h-3" /> Overdue
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${style.badge}`}>
                        {task.priority}
                      </span>
                      {task.category && (
                        <span className="text-xs text-midnight/40">
                          {getCategoryIcon(task.category)} {task.category}
                        </span>
                      )}
                      {task.status === 'In Progress' && (
                        <span className="flex items-center gap-1 text-xs text-blue-600">
                          <Clock className="w-3 h-3" /> In Progress
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-4 text-center">
          <Link
            href="/workshop/personal/tasks"
            className="inline-flex items-center gap-1.5 text-sm text-midnight/40 hover:text-ocean transition-colors"
          >
            Full task board <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Quick Links ── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-8 bg-ocean rounded-full" />
          <h2 className="font-display text-2xl text-midnight">Quick Access</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Pipeline */}
          <Link
            href="/workshop/work/pipeline"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-cream border-midnight/5 hover:border-midnight/20 transition-all text-center"
          >
            <CheckSquare className="w-5 h-5 text-ocean" />
            <span className="text-xs font-medium text-midnight/70">Pipeline</span>
          </Link>

          {/* FC Balboa */}
          <Link
            href="/workshop/personal/fc-balboa"
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center
              ${isCoachingDay
                ? 'bg-terracotta/10 border-terracotta/30 hover:border-terracotta/60'
                : 'bg-cream border-midnight/5 hover:border-midnight/20'}`}
          >
            <Trophy className="w-5 h-5 text-terracotta" />
            <span className="text-xs font-medium text-midnight/70">FC Balboa</span>
            {isCoachingDay && <span className="text-xs text-terracotta font-semibold">Today!</span>}
          </Link>

          {/* Task Board */}
          <Link
            href="/workshop/personal/tasks"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-cream border-midnight/5 hover:border-midnight/20 transition-all text-center"
          >
            <Calendar className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-medium text-midnight/70">Task Board</span>
          </Link>

          {/* Music Habit — with streak badge */}
          <Link
            href="/workshop/personal/music"
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center
              ${musicStreak >= 3
                ? 'bg-orange-50 border-orange-200 hover:border-orange-400'
                : 'bg-cream border-midnight/5 hover:border-midnight/20'}`}
          >
            <div className="relative">
              <Music className={`w-5 h-5 ${musicStreak >= 3 ? 'text-orange-500' : 'text-midnight/50'}`} />
              {musicStreak > 0 && (
                <span className="absolute -top-2 -right-3 text-[10px] font-bold bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {musicStreak}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-midnight/70">Music Habit</span>
            {musicStreak >= 3 && (
              <span className="text-xs text-orange-600 font-semibold">🔥 {musicStreak} days</span>
            )}
            {musicStreak === 0 && (
              <span className="text-xs text-midnight/30">Start today</span>
            )}
          </Link>
        </div>
      </div>

      {/* ── Gratitude Prompt ── */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-terracotta" />
          <h2 className="font-display text-lg text-midnight">Morning Reflection</h2>
        </div>
        <p className="text-midnight/70 text-base leading-relaxed italic">
          &ldquo;{gratitudePrompt}&rdquo;
        </p>
        <p className="text-xs text-midnight/30 mt-3">Take 30 seconds. Just notice.</p>
      </div>

      {/* ── Footer ── */}
      <div className="text-center text-xs text-midnight/20 pt-4">
        Last refreshed {lastRefresh.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        {' · '}
        <button onClick={fetchAll} className="hover:text-midnight/50 transition-colors underline">
          Refresh now
        </button>
      </div>
    </div>
  )
}
