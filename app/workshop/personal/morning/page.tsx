'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sun, Cloud, CloudRain, Droplets, Wind,
  CheckSquare, AlertCircle, Clock, Trophy,
  Map, Music, Mic, ArrowRight, RefreshCw,
  Calendar, Zap,
} from 'lucide-react'

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
    0: 'Sunday. Weekly review tonight?',
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
  }, [])

  const urgentTasks = tasks.filter((t) => t.priority === 'Urgent')
  const highTasks = tasks.filter((t) => t.priority === 'High')
  const otherTasks = tasks.filter((t) => t.priority !== 'Urgent' && t.priority !== 'High')

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
          {[
            { href: '/workshop/work/pipeline', label: 'Pipeline', icon: CheckSquare, color: 'text-ocean' },
            { href: '/workshop/personal/fc-balboa', label: 'FC Balboa', icon: Trophy, color: 'text-terracotta', highlight: isCoachingDay },
            { href: '/workshop/personal/tasks', label: 'Task Board', icon: Calendar, color: 'text-amber-500' },
            { href: '/workshop/personal/trip-july-2026', label: 'Trip Planner', icon: Map, color: 'text-cyan-500' },
          ].map(({ href, label, icon: Icon, color, highlight }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center
                ${highlight
                  ? 'bg-terracotta/10 border-terracotta/30 hover:border-terracotta/60'
                  : 'bg-cream border-midnight/5 hover:border-midnight/20'}`}
            >
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-xs font-medium text-midnight/70">{label}</span>
              {highlight && <span className="text-xs text-terracotta font-semibold">Today!</span>}
            </Link>
          ))}
        </div>
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
