'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sun, Cloud, CloudRain, Droplets, Wind,
  CheckSquare, AlertCircle, Clock, Trophy,
  Map, Music, Mic, ArrowRight, RefreshCw,
  Calendar, Zap, Heart, Plus, Check, ExternalLink, Plane,
  Calculator, Home, BookOpen, Briefcase, Mail,
} from 'lucide-react'
import { GH_COOP_TENANTS } from '@/lib/gh-coop-data'
import SanDiegoWeatherCard from './SanDiegoWeatherCard'
import BirthdayCountdownCard from './BirthdayCountdownCard'
import CaboDeparturePlan from './CaboDeparturePlan'
import CaboVacationCard from './CaboVacationCard'
import WelcomeBackCard from './WelcomeBackCard'
import DailyPrincipleCard from './DailyPrincipleCard'
import WeeklyCallGoalCard from './WeeklyCallGoalCard'

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

function isWeekend(): boolean {
  return [0, 6].includes(new Date().getDay())
}

const WEEKEND_IDEAS = [
  { emoji: '⚽', label: 'Watch Bohdi play' },
  { emoji: '🎺', label: '20 min of trumpet' },
  { emoji: '☕', label: 'Slow morning coffee' },
  { emoji: '🌊', label: 'Ocean or Balboa walk' },
  { emoji: '🧩', label: 'Puzzle time with Meta' },
  { emoji: '🍳', label: 'Cook something real' },
]

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
  sunrise: string | null
  sunset: string | null
}

interface TideEntry {
  time: string   // e.g. "7:42 AM"
  height: string // e.g. "5.2 ft"
  type: 'H' | 'L'
}

interface SurfData {
  waveHeightFt: number
  swellHeightFt: number
  swellPeriod: number
  directionLabel: string
  rating: string
  emoji: string
}

interface PipelineClient {
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

// Set to true once Kyle books the Cabo rental car (trip Mar 30 – Apr 6)
const CABO_RENTAL_CAR_BOOKED = false
// Set to true once Kyle books the Inverness → Dublin flight (Jul 16)
const INV_DUB_BOOKED = false
// Set to true once Kyle books the Columbus return flight (CMH→SAN, May 26)
const COLUMBUS_RETURN_BOOKED = false
// Set to true once the Eagle Brae balance has been paid (£1,161.20 due May 4, 2026)
const EAGLE_BRAE_PAID = false
// Set to true once Kyle calls Tareck El Khoury (refi lead, Mar 22)
const TARECK_CALL_DONE = false
// Jeffrey & Hannah Domenech — UW conditions (3642 Arizona St deal, Mar 22 2026)
const DOMENECH_ML_STATEMENTS_RECEIVED = false  // Updated Merrill Lynch statements (full, not first page only)
const DOMENECH_GIFT_LETTER_RECEIVED = false     // Gift letter for $565k gift funds
const DOMENECH_APPRAISAL_ORDERED = false        // New appraisal ordered

function getTripCountdown(): { days: number; label: string; dest: string; dateLabel: string; href: string; emoji: string } {
  const now = new Date()

  const trips = [
    {
      start: new Date('2026-03-30'),
      end: new Date('2026-04-07'),
      dest: 'Cabo San Lucas',
      dateLabel: 'March 30 — SAN → SJD',
      href: '',
      emoji: '🌊',
    },
    {
          start: new Date('2026-05-22'),
      end: new Date('2026-05-27'),
      dest: "Columbus — Janey's Graduation",
      dateLabel: 'May 22 — SAN → DEN → CMH',
      href: '/workshop/personal/trip-columbus-2026',
      emoji: '🎓',
    },
    {
            start: new Date('2026-06-27'),
      end: new Date('2026-08-04'),
      dest: 'Iceland · Scotland · Ireland',
      dateLabel: 'June 27, 2026 — SAN → KEF',
      href: '/workshop/personal/trip-july-2026',
      emoji: '🏴',
    },
  ]

  const upcoming = trips.find(t => now < t.end)

  if (!upcoming) {
    return { days: 0, label: 'Next adventure TBD', dest: '', dateLabel: '', href: '', emoji: '✈️' }
  }

  const msLeft = upcoming.start.getTime() - now.getTime()
  const days = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))

  return {
    days,
    label: days > 0 ? `${days} days` : "IT'S TIME!",
    dest: upcoming.dest,
    dateLabel: upcoming.dateLabel,
    href: upcoming.href,
    emoji: upcoming.emoji,
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

function getWardrobeSuggestion(weather: WeatherData): { outfit: string; note: string } {
  const { temp_f, description, wind_kph, humidity } = weather
  const desc = description.toLowerCase()
  const isRainy = desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')
  const isWindy = wind_kph > 25
  const isOvercast = desc.includes('cloud') || desc.includes('overcast')

  let outfit = ''
  let note = ''

  if (temp_f >= 80) {
    outfit = 'Shorts + lightweight tee or linen shirt'
    note = isRainy ? 'Grab a light rain layer — it\'s warm but wet.' : 'Sunglasses and sunscreen if you\'re outside.'
  } else if (temp_f >= 72) {
    outfit = 'Chinos or jeans + short sleeve button-down'
    note = isWindy ? 'Breezier than it looks — throw a light layer in your bag.' : 'Classic San Diego day. Easy.'
  } else if (temp_f >= 62) {
    outfit = 'Jeans + long sleeve or light jacket'
    note = isRainy ? 'Light waterproof layer worth it today.' : isOvercast ? 'Marine layer morning — might warm up later.' : 'Comfortable layers.'
  } else if (temp_f >= 52) {
    outfit = 'Jeans + jacket or heavier overshirt'
    note = isWindy ? 'Windy — zip up.' : 'Chilly for SD. Layer up.'
  } else {
    outfit = 'Full layers — coat, the works'
    note = 'Rare cold day. Don\'t leave the house underdressed.'
  }

  if (isRainy && !note.includes('rain')) note = 'Rain today — bring a jacket.'

  return { outfit, note }
}

function getSurfBadgeClass(rating: string): string {
  switch (rating) {
    case 'Flat':        return 'bg-midnight/10 text-midnight/40'
    case 'Ankle–knee':  return 'bg-amber-100 text-amber-700'
    case 'Knee–waist':  return 'bg-green-100 text-green-700'
    case 'Waist–chest': return 'bg-green-200 text-green-800'
    case 'Head high':   return 'bg-ocean/10 text-ocean'
    case 'Overhead+':   return 'bg-purple-100 text-purple-700'
    default:            return 'bg-midnight/10 text-midnight/40'
  }
}

// ── Cabo Packing List Component ───────────────────────────────────────────────

const CABO_PACKING_ITEMS = [
  { id: 'passports', label: 'Passports (all 4)', category: '📋 Documents & Money' },
  { id: 'insurance', label: 'Travel insurance cards', category: '📋 Documents & Money' },
  { id: 'flights', label: 'Alaska confirmation (YAKQHZ)', category: '📋 Documents & Money' },
  { id: 'homeexchange', label: 'HomeExchange info (Destrie Long — +18016648906)', category: '📋 Documents & Money' },
  { id: 'solaris', label: 'Royal Solaris confirmation (BOOQ34929)', category: '📋 Documents & Money' },
  { id: 'rental', label: 'Rental car info (justasklaura.com.mx)', category: '📋 Documents & Money' },
  { id: 'cash', label: 'Cash (pesos + USD)', category: '📋 Documents & Money' },
  { id: 'carseats', label: 'Car seats / boosters', category: '👶 Kids' },
  { id: 'snacks', label: 'Snacks for plane', category: '👶 Kids' },
  { id: 'ipads', label: 'iPad + headphones (×2)', category: '👶 Kids' },
  { id: 'kidsun', label: 'Sunscreen SPF 50+ (kids)', category: '👶 Kids' },
  { id: 'watershoes', label: 'Water shoes', category: '👶 Kids' },
  { id: 'swimgear', label: 'Swim gear', category: '👶 Kids' },
  { id: 'swimsuits', label: 'Swimsuits', category: '🧴 Adults' },
  { id: 'sunscreen', label: 'Sunscreen', category: '🧴 Adults' },
  { id: 'reefsafe', label: 'Reef-safe sunscreen (HomeExchange stay)', category: '🧴 Adults' },
  { id: 'layers', label: 'Light layers (evenings)', category: '🧴 Adults' },
  { id: 'meds', label: 'Meds (prescriptions + OTC)', category: '🧴 Adults' },
  { id: 'chargers', label: 'Phone chargers + adapters', category: '🧴 Adults' },
  { id: 'snorkel', label: 'Snorkel gear (or rent there?)', category: '🏄 Activities' },
  { id: 'beachbag', label: 'Beach bag', category: '🏄 Activities' },
  { id: 'bottles', label: 'Reusable water bottles', category: '🏄 Activities' },
]

function CaboPackingList({ daysLeft }: { daysLeft: number }) {
  const [expanded, setExpanded] = useState(false)
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cabo-packing-2026')
      if (stored) setChecked(JSON.parse(stored))
    } catch {}
  }, [])

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    try { localStorage.setItem('cabo-packing-2026', JSON.stringify(next)) } catch {}
  }

  const totalCount = CABO_PACKING_ITEMS.length
  const checkedCount = CABO_PACKING_ITEMS.filter(i => checked[i.id]).length
  const allDone = checkedCount === totalCount

  const categories = Array.from(new Set(CABO_PACKING_ITEMS.map(i => i.category)))

  return (
    <div className={`rounded-2xl p-5 border-2 ${allDone ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-200'}`}>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-2 text-left"
      >
        <span className="text-xl">🌊</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-midnight">Cabo Packing List</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${daysLeft <= 3 ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
              {daysLeft === 1 ? '1 day left!' : `${daysLeft} days`}
            </span>
            <span className="text-xs text-midnight/50 ml-auto">{checkedCount}/{totalCount}</span>
          </div>
          {allDone && (
            <div className="text-xs font-semibold text-emerald-600 mt-0.5">✅ You&apos;re ready for Cabo!</div>
          )}
        </div>
        <span className="text-midnight/40 text-sm ml-2">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {categories.map(cat => (
            <div key={cat}>
              <div className="text-xs font-bold text-midnight/60 uppercase tracking-wide mb-2">{cat}</div>
              <ul className="space-y-1.5">
                {CABO_PACKING_ITEMS.filter(i => i.category === cat).map(item => (
                  <li key={item.id}>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={!!checked[item.id]}
                        onChange={() => toggle(item.id)}
                        className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                      />
                      <span className={`text-xs ${checked[item.id] ? 'line-through text-midnight/30' : 'text-midnight/80 group-hover:text-midnight'}`}>
                        {item.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {allDone && (
            <div className="mt-3 text-center text-sm font-bold text-emerald-600 bg-emerald-100 rounded-xl py-2">
              ✅ You&apos;re ready for Cabo! Have an amazing trip. 🌊
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MorningBriefPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [pipeline, setPipeline] = useState<PipelineClient[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [tides, setTides] = useState<TideEntry[]>([])
  const [surf, setSurf] = useState<SurfData | null>(null)
  const [desertWeather, setDesertWeather] = useState<WeatherData | null>(null)
  const [caboForecast, setCaboForecast] = useState<Array<{ date: string; maxC: number; minC: number; code: number }> | null>(null)
  const [musicStreak, setMusicStreak] = useState<number>(0)
  const [hasMusicToday, setHasMusicToday] = useState<boolean>(false)
  const [musicSessions, setMusicSessions] = useState<MusicSession[]>([])
  const [emailDigest, setEmailDigest] = useState<{ unread: number; topMessages: Array<{ subject: string; from: string; preview: string; timestamp: string }> } | null>(null)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({})
  const [topThree, setTopThree] = useState('')
  const sunday = isSunday()
  const weekend = isWeekend()

  // Quick Task Add
  const [quickTitle, setQuickTitle] = useState('')
  const [quickPriority, setQuickPriority] = useState('Medium')
  const [quickCategory, setQuickCategory] = useState('Other')
  const [quickAdding, setQuickAdding] = useState(false)
  const [quickSuccess, setQuickSuccess] = useState(false)
  const [quickError, setQuickError] = useState('')

  const { greeting, dayNote, isCoachingDay } = getDayContext()
  const trip = getTripCountdown()

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  const fetchAll = async () => {
    setLoading(true)
    try {
      // Fetch tasks, weather, pipeline, and tides
      const [tasksRes, weatherRes, pipelineRes, tidesRes, surfRes, desertRes, emailRes, caboRes] = await Promise.allSettled([
        fetch('/api/tasks?status=Not%20Started&status=In%20Progress&limit=20'),
        fetch('https://wttr.in/San+Diego?format=j1'),
        fetch('/api/pipeline'),
        fetch('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&station=9410170&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=kanons_morning_brief&format=json&date=today'),
        fetch('https://marine-api.open-meteo.com/v1/marine?latitude=32.72&longitude=-117.16&hourly=wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_period,swell_wave_direction&timezone=America%2FLos_Angeles&forecast_days=1'),
        fetch('https://wttr.in/Joshua+Tree+California?format=j1'),
        fetch('/api/agentmail-digest'),
        fetch('https://api.open-meteo.com/v1/forecast?latitude=22.89&longitude=-109.92&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America%2FDenver&start_date=2026-03-30&end_date=2026-04-06'),
      ])

      if (tasksRes.status === 'fulfilled' && tasksRes.value.ok) {
        const data = await tasksRes.value.json()
        const allTasks: Task[] = data.tasks || []
        // Sort by priority, take top 7 (or 3 on weekends — lighter mode)
        const priorityOrder: Record<string, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 }
        const isWknd = [0, 6].includes(new Date().getDay())
        const sorted = allTasks
          .filter((t) => t.status !== 'Done' && t.status !== 'Cancelled')
          .sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9))
          .slice(0, isWknd ? 3 : 7)
        setTasks(sorted)
      }

      if (weatherRes.status === 'fulfilled' && weatherRes.value.ok) {
        const data = await weatherRes.value.json()
        const current = data.current_condition?.[0]
        if (current) {
          const todayWeather = data.weather?.[0]
          setWeather({
            temp_c: parseInt(current.temp_C),
            temp_f: parseInt(current.temp_F),
            description: current.weatherDesc?.[0]?.value || 'Clear',
            humidity: parseInt(current.humidity),
            wind_kph: parseInt(current.windspeedKmph),
            sunrise: todayWeather?.astronomy?.[0]?.sunrise || null,
            sunset: todayWeather?.astronomy?.[0]?.sunset || null,
          })
        }
      }

      if (pipelineRes.status === 'fulfilled' && pipelineRes.value.ok) {
        const data = await pipelineRes.value.json()
        setPipeline(data.clients || [])
      }

      if (tidesRes.status === 'fulfilled' && tidesRes.value.ok) {
        const data = await tidesRes.value.json()
        if (data.predictions) {
          const now = new Date()
          const parsed: TideEntry[] = data.predictions
            .map((p: { t: string; v: string; type: string }) => {
              const dt = new Date(p.t.replace(' ', 'T'))
              return {
                time: dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                height: `${parseFloat(p.v).toFixed(1)} ft`,
                type: p.type as 'H' | 'L',
                _dt: dt,
              }
            })
            .filter((e: { _dt: Date }) => e._dt >= now)
            .slice(0, 3)
            .map(({ time, height, type }: TideEntry) => ({ time, height, type }))
          setTides(parsed)
        }
      }
      if (surfRes.status === 'fulfilled' && surfRes.value.ok) {
        const data = await surfRes.value.json()
        if (data.hourly) {
          const hourIdx = new Date().getHours()
          const waveH = data.hourly.wave_height?.[hourIdx] ?? 0
          const swellH = data.hourly.swell_wave_height?.[hourIdx] ?? waveH
          const swellPeriod = data.hourly.swell_wave_period?.[hourIdx] ?? data.hourly.wave_period?.[hourIdx] ?? 0
          const swellDir = data.hourly.swell_wave_direction?.[hourIdx] ?? data.hourly.wave_direction?.[hourIdx] ?? 0
          const waveHFt = waveH * 3.28084
          const swellHFt = swellH * 3.28084
          const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
          const dirLabel = dirs[Math.round(swellDir / 22.5) % 16]
          let rating = 'Flat'; let emoji = '😴'
          if (waveHFt >= 0.5) { rating = 'Ankle–knee'; emoji = '🏄' }
          if (waveHFt >= 1.5) { rating = 'Knee–waist'; emoji = '🌊' }
          if (waveHFt >= 3)   { rating = 'Waist–chest'; emoji = '🌊' }
          if (waveHFt >= 5)   { rating = 'Head high'; emoji = '🔥' }
          if (waveHFt >= 7)   { rating = 'Overhead+'; emoji = '🔥' }
          setSurf({ waveHeightFt: waveHFt, swellHeightFt: swellHFt, swellPeriod, directionLabel: dirLabel, rating, emoji })
        }
      }
      if (desertRes.status === 'fulfilled' && desertRes.value.ok) {
        const data = await desertRes.value.json()
        const current = data.current_condition?.[0]
        if (current) {
          setDesertWeather({
            temp_c: parseInt(current.temp_C),
            temp_f: parseInt(current.temp_F),
            description: current.weatherDesc?.[0]?.value || 'Clear',
            humidity: parseInt(current.humidity),
            wind_kph: parseInt(current.windspeedKmph),
            sunrise: null,
            sunset: null,
          })
        }
      }
      if (emailRes.status === 'fulfilled' && emailRes.value.ok) {
        const data = await emailRes.value.json()
        setEmailDigest({ unread: data.unread ?? 0, topMessages: data.topMessages ?? [] })
      }
      if (caboRes.status === 'fulfilled' && caboRes.value.ok) {
        const data = await caboRes.value.json()
        if (data.daily && data.daily.time) {
          const forecast = data.daily.time.map((date: string, i: number) => ({
            date,
            maxC: Math.round(data.daily.temperature_2m_max[i]),
            minC: Math.round(data.daily.temperature_2m_min[i]),
            code: data.daily.weather_code[i],
          }))
          setCaboForecast(forecast)
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
        const todayStr = new Date().toISOString().slice(0, 10)
        setHasMusicToday((data.sessions || []).some((s) => s.date === todayStr))
        setMusicSessions(data.sessions || [])
      }
    } catch {
      // localStorage unavailable or malformed
    }
  }, [])

  const handleQuickTaskAdd = async () => {
    if (!quickTitle.trim()) return
    setQuickAdding(true)
    setQuickError('')
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: quickTitle.trim(),
          priority: quickPriority,
          category: quickCategory,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setQuickTitle('')
      setQuickPriority('Medium')
      setQuickCategory('Other')
      setQuickSuccess(true)
      setTimeout(() => setQuickSuccess(false), 3000)
      // Refresh task list to show new item
      fetchAll()
    } catch {
      setQuickError('Failed to add task — try again')
    } finally {
      setQuickAdding(false)
    }
  }

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
            <div className="text-xs text-cream/40 mt-0.5">Days to departure</div>
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
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <WeatherIcon desc={weather.description} />
                <div>
                  <div className="text-3xl font-display text-midnight">{weather.temp_f}°F</div>
                  <div className="text-sm text-midnight/50">{weather.description}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-midnight/40">
                    <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{weather.humidity}%</span>
                    <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{weather.wind_kph} km/h</span>
                  </div>
                  {(weather.sunrise || weather.sunset) && (
                    <div className="flex items-center gap-3 mt-1 text-xs text-midnight/40">
                      {weather.sunrise && <span>🌅 {weather.sunrise}</span>}
                      {weather.sunset && <span>🌇 {weather.sunset}</span>}
                    </div>
                  )}
                  {tides.length > 0 && (
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {tides.map((t, i) => (
                        <span key={i} className={`text-xs font-medium ${t.type === 'H' ? 'text-ocean' : 'text-midnight/40'}`}>
                          {t.type === 'H' ? '🌊' : '↓'} {t.height} @ {t.time}
                        </span>
                      ))}
                    </div>
                  )}
                  {surf && (
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${getSurfBadgeClass(surf.rating)}`}>
                        {surf.emoji} {surf.rating}
                      </span>
                      <span className="text-xs text-midnight/40">
                        {surf.waveHeightFt.toFixed(1)}ft · {surf.swellPeriod.toFixed(0)}s · {surf.directionLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Wardrobe suggestion */}
              {(() => {
                const { outfit, note } = getWardrobeSuggestion(weather)
                return (
                  <div className="border-t border-midnight/5 pt-3">
                    <p className="text-xs font-semibold text-midnight/40 uppercase tracking-wide mb-1">👔 Wear today</p>
                    <p className="text-sm font-medium text-midnight">{outfit}</p>
                    <p className="text-xs text-midnight/40 mt-0.5">{note}</p>
                  </div>
                )
              })()}
              {desertWeather && (
                <div className="border-t border-midnight/5 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🌵</span>
                    <div>
                      <p className="text-xs font-semibold text-midnight/40 uppercase tracking-wide">Joshua Tree</p>
                      <p className="text-sm text-midnight/60">{desertWeather.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-display text-midnight">{desertWeather.temp_f}°F</p>
                    <p className="text-xs text-midnight/40">{desertWeather.humidity}% humidity</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-midnight/30 text-sm">{loading ? 'Loading…' : 'Unavailable'}</div>
          )}
        </div>

        {/* Trip Countdown */}
        <div className={`rounded-2xl p-6 border transition-all ${
          trip.days > 0 && trip.days <= 7
            ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-300 shadow-md'
            : 'bg-gradient-to-br from-ocean/10 to-cyan-500/10 border-ocean/20'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">{trip.emoji}</span>
            <Map className={`w-4 h-4 ${trip.days > 0 && trip.days <= 7 ? 'text-red-500' : 'text-ocean'}`} />
            <h2 className="font-display text-lg text-midnight">{trip.dest}</h2>
            {trip.days > 0 && trip.days <= 7 && (
              <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-red-500 animate-pulse">
                🚨 Soon
              </span>
            )}
          </div>
          <div className={`font-display transition-all ${
            trip.days > 0 && trip.days <= 3
              ? 'text-5xl text-red-600 animate-pulse'
              : trip.days > 0 && trip.days <= 7
              ? 'text-5xl text-orange-500'
              : 'text-4xl text-ocean'
          }`}>{trip.label}</div>
          {trip.days > 0 && trip.days <= 7 && (
            <div className="mt-2 text-xs font-semibold text-red-500">
              Pack. Book what&apos;s open. Go time.
            </div>
          )}
          {trip.dateLabel && (
            <div className="text-sm text-midnight/50 mt-1">{trip.dateLabel}</div>
          )}
          {trip.href && (
            <Link
              href={trip.href}
              className={`inline-flex items-center gap-1.5 mt-4 text-xs font-medium hover:underline ${
                trip.days > 0 && trip.days <= 7 ? 'text-red-500' : 'text-ocean'
              }`}
            >
              View itinerary <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>


      {/* ── San Diego Weather (Open-Meteo) ── */}
      <SanDiegoWeatherCard />

      {/* ── Birthday Countdown ── */}
      <BirthdayCountdownCard />

      {/* -- Cabo Prep Checklist -- */}
      {trip.dest === 'Cabo San Lucas' && trip.days > 0 && trip.days <= 14 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌊</span>
            <h3 className="text-sm font-bold text-midnight">Cabo Prep — {trip.days} days out</h3>
          </div>
          <ul className="space-y-2">
            {[
              { label: 'Book rental car (justasklaura.com.mx)', done: false, urgent: true },
              { label: 'Flights booked (Alaska YAKQHZ)', done: true },
              { label: 'HomeExchange confirmed (Destrie Long)', done: true },
              { label: 'Royal Solaris Apr 4–6 (BOOQ34929)', done: true },
              { label: 'Pack snorkel gear + sunscreen', done: false },
              { label: 'Download offline maps for BCS', done: false },
              { label: 'Notify bank of international travel', done: false },
            ].map((item, i) => (
              <li key={i} className={"flex items-start gap-2 text-xs " + (item.done ? "text-midnight/40 line-through" : (item as {urgent?:boolean}).urgent ? "text-red-700 font-semibold" : "text-midnight/70")}>
                <span className="mt-0.5 shrink-0">{item.done ? "✅" : (item as {urgent?:boolean}).urgent ? "🔴" : "⬜"}</span>
                {item.label}
              </li>
            ))}
          </ul>
          <a href="https://justasklaura.com.mx" target="_blank" rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline">
            Book rental car → justasklaura.com.mx
          </a>
        </div>
      )}

      {/* ── Cabo Trip Weather Forecast ── */}
      {trip.dest === 'Cabo San Lucas' && trip.days > 0 && trip.days <= 14 && caboForecast && caboForecast.length > 0 && (() => {
        const wmoEmoji = (code: number) => {
          if (code === 0) return '☀️'
          if (code <= 2) return '🌤️'
          if (code <= 3) return '☁️'
          if (code <= 49) return '🌫️'
          if (code <= 67) return '🌧️'
          if (code <= 77) return '🌨️'
          if (code <= 82) return '🌦️'
          if (code <= 99) return '⛈️'
          return '🌡️'
        }
        const toF = (c: number) => Math.round(c * 9 / 5 + 32)
        return (
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌊</span>
              <h3 className="text-sm font-bold text-midnight">Cabo Weather — Mar 30–Apr 6</h3>
              <span className="text-xs text-midnight/40 ml-auto">Los Cabos, BCS</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {caboForecast.map((day, i) => {
                const d = new Date(day.date + 'T12:00:00')
                const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })
                return (
                  <div key={i} className="flex flex-col items-center gap-0.5 min-w-[52px] bg-white/70 rounded-xl px-2 py-2 text-center">
                    <span className="text-[10px] text-midnight/50 font-medium">{label}</span>
                    <span className="text-base leading-none">{wmoEmoji(day.code)}</span>
                    <span className="text-xs font-bold text-midnight">{toF(day.maxC)}°</span>
                    <span className="text-[10px] text-midnight/40">{toF(day.minC)}°</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* ── Cabo Packing List ── */}
      {trip.dest === 'Cabo San Lucas' && trip.days > 0 && trip.days <= 14 && (
        <CaboPackingList daysLeft={trip.days} />
      )}

      {/* ── Cabo Vacation Card (shows Mar 30 - Apr 6 in-trip) ── */}
      <CaboVacationCard />

      {/* ── Cabo Departure Plan ── */}
      <CaboDeparturePlan />

      {/* ── Post-Cabo Welcome Back Card (Apr 7-14) ── */}
      <WelcomeBackCard />

      {/* ── Cabo Rental Car Alert ── */}
      {!CABO_RENTAL_CAR_BOOKED && (() => {
        const caboDate = new Date('2026-03-30T00:00:00')
        const nowDate = new Date()
        nowDate.setHours(0, 0, 0, 0)
        const msLeft = caboDate.getTime() - nowDate.getTime()
        const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))
        if (daysLeft <= 0) return null
        return (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">&#x1F697;</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-bold text-midnight">Cabo rental car unbooked &#x2014; Mar 30 &#xB7; Laura @ justasklaura.com.mx</p>
                  <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                    {daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
                  </span>
                </div>
                <p className="text-xs text-midnight/60 leading-snug mb-2">
                  Options: Jeep Compass $275/wk &#xB7; Wrangler $350/wk &#xB7; Yukon $350/wk
                </p>
                <p className="text-xs text-midnight/40">
                  Set <code className="text-xs bg-amber-100 px-1 rounded">CABO_RENTAL_CAR_BOOKED = true</code> once booked.
                </p>
              </div>
            </div>
            <div className="mt-3">
              <a
                href="mailto:cars@justasklaura.com.mx"
                className="inline-flex items-center gap-1.5 bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors"
              >
                Email Laura &#x2192;
              </a>
            </div>
          </div>
        )
      })()}

      {/* ── Columbus Return Flight Alert ── */}
      {!COLUMBUS_RETURN_BOOKED && trip.dest.includes('Columbus') && trip.days > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Plane className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-sm font-bold text-midnight">Book: CMH → SAN — May 26</p>
                <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">Return not booked</span>
              </div>
              <p className="text-xs text-midnight/60 leading-snug">
                Columbus return flight for the graduation trip. Book before fares change.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <a
              href="https://www.southwest.com/air/booking/select.html?originationAirportCode=CMH&destinationAirportCode=SAN"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-amber-600 text-white text-xs font-semibold py-2 rounded-xl hover:bg-amber-700 transition-colors"
            >
              Search Southwest <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* ── Scotland/Ireland Trip — Open Bookings Alert ── */}
      {trip.dest.includes('Iceland') && trip.days > 0 && trip.days < 200 && (
        <Link
          href="/workshop/personal/trip-july-2026"
          className="block bg-gradient-to-r from-sky-50 to-indigo-50 rounded-2xl p-5 border border-sky-200 hover:border-sky-400 transition-colors group"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">🏴󠁧󠁢󠁳󠁣󠁴󠁿</span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-midnight">Scotland &amp; Ireland — flights + 3 stays still open</p>
                  <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">!</span>
                </div>
                <p className="text-xs text-midnight/45 mt-0.5">
                  Flights (SAN→KEF · INV→DUB · DUB→SAN) · Dromquinna Manor · Kilkenny
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-sky-600 group-hover:text-sky-800 transition-colors shrink-0">
              Book now <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </Link>
      )}

      {/* ── INV→DUB Flight Alert ── */}
      {!INV_DUB_BOOKED && (() => {
        const invDubDate = new Date('2026-07-16T00:00:00')
        const nowDate = new Date()
        nowDate.setHours(0, 0, 0, 0)
        const msLeft = invDubDate.getTime() - nowDate.getTime()
        const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))
        if (daysLeft <= 0) return null
        return (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Plane className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-bold text-midnight">✈️ INV→DUB flight unbooked — Jul 16 · Aer Lingus Regional direct (Thu only)</p>
                  <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                    {daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
                  </span>
                </div>
                <p className="text-xs text-midnight/60 leading-snug">
                  Aer Lingus Regional — direct Inverness → Dublin.{' '}
                  <strong className="text-midnight/80">Flies Thursdays only.</strong>{' '}
                  Set <code className="text-xs bg-amber-100 px-1 rounded">INV_DUB_BOOKED = true</code> once booked.
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <a
                href="https://www.aerlingus.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-amber-600 text-white text-xs font-semibold py-2 rounded-xl hover:bg-amber-700 transition-colors"
              >
                Book Aer Lingus <ExternalLink className="w-3 h-3" />
              </a>
              <Link
                href="/workshop/personal/trip-july-2026"
                className="flex items-center gap-1 text-xs text-amber-700 border border-amber-300 px-3 py-2 rounded-xl hover:bg-amber-100 transition-colors whitespace-nowrap"
              >
                Trip planner <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )
      })()}


      {/* ── Eagle Brae Balance Alert ── */}
      {!EAGLE_BRAE_PAID && (() => {
        const dueDate = new Date('2026-05-04T00:00:00')
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        const msLeft = dueDate.getTime() - now.getTime()
        const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))
        if (daysLeft <= 0) return null
        return (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">🏴󠁧󠁢󠁳󠁣󠁴󠁿</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-sm font-bold text-midnight">Eagle Brae balance due — £1,161.20</p>
                  <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                    {daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
                  </span>
                </div>
                <p className="text-xs text-midnight/60 leading-snug">
                  Due <strong className="text-midnight/80">May 4, 2026</strong> · Scotland Highland lodge balance. Set <code className="text-xs bg-amber-100 px-1 rounded">EAGLE_BRAE_PAID = true</code> once paid.
                </p>
              </div>
            </div>
          </div>
        )
      })()}
      {/* ── Parents Visit — April 22–26 ── */}
      {(() => {
        const arrivalDate = new Date('2026-04-22T00:00:00')
        const hideAfter = new Date('2026-04-27T00:00:00')
        const nowDate = new Date()
        nowDate.setHours(0, 0, 0, 0)
        const daysToArrival = Math.ceil((arrivalDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysToArrival > 35 || nowDate >= hideAfter) return null
        const isUrgent = daysToArrival <= 7
        const isVeryUrgent = daysToArrival <= 3
        const isArrived = daysToArrival <= 0
        return (
          <div className={`rounded-2xl p-5 border-2 ${isVeryUrgent ? 'bg-red-50 border-red-300' : isUrgent ? 'bg-orange-50 border-orange-300' : 'bg-amber-50 border-amber-300'}`}>
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">👨‍👩‍👧</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <p className="text-sm font-bold text-midnight">Mom &amp; Dad visiting — April 22–26</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${isVeryUrgent ? 'bg-red-100 text-red-700 border-red-200' : isUrgent ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                    {isArrived ? 'They are here!' : daysToArrival === 1 ? 'Tomorrow!' : `${daysToArrival} days to arrival`}
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-midnight/70">
                  <li className="flex items-start gap-1.5">
                    <span className="shrink-0">✈️</span>
                    <span><strong className="text-midnight">Arrival:</strong> Apr 22 @ 7:34pm · AS 3421 (EUG → SAN) · Conf: UJZZFW</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="shrink-0">🚗</span>
                    <span>Pick up at SAN airport</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="shrink-0">✈️</span>
                    <span><strong className="text-midnight">Departure:</strong> Apr 26 @ 8:14pm · SAN → EUG · Same conf</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── Joshua Tree Departure Banner ── */}
      {(() => {
        const now = new Date()
        const month = now.getMonth() + 1
        const day = now.getDate()
        const hour = now.getHours()
        const showBanner = (month === 3 && day === 11) || (month === 3 && day === 12 && hour < 10)
        if (!showBanner) return null
        const leavingToday = month === 3 && day === 12
        return (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">🏜️</span>
              <div>
                <p className="font-display text-lg text-midnight mb-1">
                  {leavingToday ? 'Desert day — you\'re leaving this morning!' : 'Joshua Tree tomorrow — pack tonight'}
                </p>
                <p className="text-sm text-midnight/60">
                  {leavingToday
                    ? 'Load up the car. Pappy & Harriet\'s tonight. Drive safe.'
                    : 'Leaving Thu morning. Pack tonight after band practice. Lidia has the kids Thursday.'}
                </p>
                {!leavingToday && (
                  <div className="flex flex-wrap gap-2 mt-3 text-xs text-midnight/60">
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-lg">🎸 Well Well Well 3pm (leave 2:30)</span>
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-lg">🧳 Pack after practice</span>
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-lg">🔩 Super glue door lock cover</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── GH Co-Op Lease Expiry Alert ── */}
      {(() => {
        const now = Date.now()
        const expiring = GH_COOP_TENANTS.filter(t => {
          if (!t.leaseEnd || t.currentStatus === 'vacant') return false
          const daysLeft = Math.ceil((new Date(t.leaseEnd).getTime() - now) / (1000 * 60 * 60 * 24))
          return daysLeft >= 0 && daysLeft <= 60
        }).map(t => ({
          ...t,
          daysLeft: Math.ceil((new Date(t.leaseEnd!).getTime() - now) / (1000 * 60 * 60 * 24)),
        }))
        if (!expiring.length) return null
        return (
          <Link
            href="/workshop/personal/gh-coop"
            className="block bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 hover:border-amber-400 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">🏢</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-midnight">GH Co-Op — Lease expiring soon</p>
                  <span className="text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">{expiring.length}</span>
                </div>
                <div className="space-y-1">
                  {expiring.map(t => (
                    <p key={t.id} className="text-xs text-midnight/70">
                      <span className="font-semibold text-midnight">{t.name}</span>
                      {' — '}{t.unit}
                      {' · '}
                      <span className={t.daysLeft <= 30 ? 'text-red-600 font-semibold' : 'text-amber-700'}>
                        {t.daysLeft === 0 ? 'expires today' : `${t.daysLeft}d left`}
                      </span>
                      {' · lease ends '}
                      {new Date(t.leaseEnd!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                    </p>
                  ))}
                </div>
                <p className="text-xs text-midnight/40 mt-2">Start renewal conversation now → GH Co-Op</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-amber-700 group-hover:text-amber-900 transition-colors shrink-0 mt-0.5">
                View <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        )
      })()}

      {/* ── Weekend Mode Card ── */}
      {weekend && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🌿</span>
            <h2 className="font-display text-lg text-midnight">Weekend Mode</h2>
            <span className="ml-auto text-xs bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">Off duty</span>
          </div>
          <p className="text-sm text-midnight/50 mb-4 ml-8">No pipeline pressure. No urgency. Just good stuff.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {WEEKEND_IDEAS.map((idea, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/70 rounded-xl p-3 border border-green-100">
                <span className="text-base">{idea.emoji}</span>
                <span className="text-xs text-midnight/70 font-medium">{idea.label}</span>
              </div>
            ))}
          </div>
        </div>
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

      {/* ── Pipeline Health ── */}
      {pipeline.length > 0 && weekend && (
        <div className="bg-cream rounded-2xl p-4 border border-midnight/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-midnight/50">
            <Briefcase className="w-4 h-4" />
            <span>Pipeline — {pipeline.filter(c => c.stage !== 'Closed' && c.stage !== 'Lost').length} active clients</span>
          </div>
          <Link href="/workshop/pph/pipeline" className="text-xs font-medium text-ocean hover:underline flex items-center gap-1">
            View <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
      {pipeline.length > 0 && !weekend && (() => {
        const today = new Date(); today.setHours(0,0,0,0)
        const active = pipeline.filter(c => c.stage !== 'Closed' && c.stage !== 'Lost')
        const hot = active.filter(c => c.priority === 'Hot')
        const needsContact = active.filter(c => {
          const threshold = c.priority === 'Hot' ? 3 : c.priority === 'Active' ? 7 : 14
          if (!c.lastTouched) return true
          const last = new Date(c.lastTouched); last.setHours(0,0,0,0)
          return Math.floor((today.getTime() - last.getTime()) / 86400000) >= threshold
        })
        const overdueFollowUp = active.filter(c => {
          if (!c.followUpDate) return false
          const d = new Date(c.followUpDate); d.setHours(0,0,0,0)
          return d < today
        })
        const stuckDeals = active.filter(c => {
          if (!c.lastTouched) return false
          const last = new Date(c.lastTouched); last.setHours(0,0,0,0)
          const days = Math.floor((today.getTime() - last.getTime()) / 86400000)
          return days >= 14
        })
        const hasAlerts = needsContact.length > 0 || overdueFollowUp.length > 0 || stuckDeals.length > 0
        return (
          <div className={`rounded-2xl p-6 border ${hasAlerts ? 'bg-amber-50 border-amber-200' : 'bg-cream border-midnight/5'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className={`w-4 h-4 ${hasAlerts ? 'text-amber-600' : 'text-ocean'}`} />
                <h2 className="font-display text-lg text-midnight">Pipeline</h2>
                {hasAlerts && (
                  <span className="text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                    {needsContact.length + overdueFollowUp.length} need attention
                  </span>
                )}
              </div>
              <Link href="/workshop/pph/pipeline" className="text-xs text-ocean hover:underline flex items-center gap-1">
                Open <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/70 rounded-xl p-3 text-center border border-midnight/5">
                <div className="text-xl font-display text-midnight">{active.length}</div>
                <div className="text-[10px] text-midnight/40 mt-0.5 uppercase tracking-wide">Active</div>
              </div>
              <div className={`rounded-xl p-3 text-center border ${hot.length > 0 ? 'bg-red-50 border-red-100' : 'bg-white/70 border-midnight/5'}`}>
                <div className={`text-xl font-display ${hot.length > 0 ? 'text-red-600' : 'text-midnight'}`}>{hot.length}</div>
                <div className="text-[10px] text-midnight/40 mt-0.5 uppercase tracking-wide">Hot 🔥</div>
              </div>
              <div className={`rounded-xl p-3 text-center border ${needsContact.length > 0 ? 'bg-amber-50 border-amber-100' : 'bg-white/70 border-midnight/5'}`}>
                <div className={`text-xl font-display ${needsContact.length > 0 ? 'text-amber-600' : 'text-midnight'}`}>{needsContact.length}</div>
                <div className="text-[10px] text-midnight/40 mt-0.5 uppercase tracking-wide">Contact Due</div>
              </div>
            </div>

            {/* Who needs contact */}
            {needsContact.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-midnight/40 uppercase tracking-wider">Call or text today</p>
                {needsContact.slice(0, 4).map(c => (
                  <div key={c.id} className="flex items-center gap-3 bg-white/80 rounded-xl px-3 py-2.5 border border-amber-100">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${c.priority === 'Hot' ? 'bg-red-500' : c.priority === 'Active' ? 'bg-orange-400' : 'bg-amber-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-midnight truncate">{c.name}</p>
                      <p className="text-xs text-midnight/40 truncate">{c.nextAction || c.stage}</p>
                    </div>
                    <span className="text-[10px] text-midnight/30 shrink-0">
                      {c.lastTouched ? (() => { const d = new Date(c.lastTouched); d.setHours(0,0,0,0); const days = Math.floor((today.getTime() - d.getTime()) / 86400000); return days === 0 ? 'today' : `${days}d ago` })() : 'never'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Overdue follow-ups */}
            {overdueFollowUp.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="text-[10px] font-semibold text-orange-500 uppercase tracking-wider flex items-center gap-1">
                  📅 Overdue Follow-Ups
                </p>
                {overdueFollowUp.slice(0, 4).map(c => {
                  const due = new Date(c.followUpDate!); due.setHours(0,0,0,0)
                  const daysOverdue = Math.floor((today.getTime() - due.getTime()) / 86400000)
                  return (
                    <Link key={c.id} href={`/workshop/pph/clients/${c.id}`} className="flex items-center gap-3 bg-orange-50 rounded-xl px-3 py-2.5 border border-orange-100 hover:border-orange-300 transition-colors">
                      <span className="w-2 h-2 rounded-full shrink-0 bg-orange-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-midnight truncate">{c.name}</p>
                        <p className="text-xs text-midnight/40 truncate">{c.stage} · {c.nextAction || 'Follow up needed'}</p>
                      </div>
                      <span className="text-[10px] font-bold text-orange-500 shrink-0">{daysOverdue}d late</span>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Stuck deals — 14+ days in same stage */}
            {stuckDeals.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider flex items-center gap-1">
                  ⚠️ Stuck Deals — 14+ days in stage
                </p>
                {stuckDeals.map(c => {
                  const days = c.lastTouched ? Math.floor((today.getTime() - (() => { const d = new Date(c.lastTouched!); d.setHours(0,0,0,0); return d })().getTime()) / 86400000) : 0
                  return (
                    <Link key={c.id} href={`/workshop/pph/clients/${c.id}`} className="flex items-center gap-3 bg-red-50 rounded-xl px-3 py-2.5 border border-red-100 hover:border-red-200 transition-colors">
                      <span className="w-2 h-2 rounded-full shrink-0 bg-red-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-midnight truncate">{c.name}</p>
                        <p className="text-xs text-midnight/40 truncate">{c.stage} · {c.nextAction || 'No next action set'}</p>
                      </div>
                      <span className="text-[10px] font-bold text-red-500 shrink-0">{days}d</span>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* This week's follow-ups (forward-looking, not overdue) */}
            {(() => {
              const todayDate = new Date(); todayDate.setHours(0,0,0,0)
              const dayOfWeek = todayDate.getDay()
              const monday = new Date(todayDate); monday.setDate(todayDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
              const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6)
              const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
              const thisWeek = active
                .filter(c => {
                  if (!c.followUpDate) return false
                  const d = new Date(c.followUpDate); d.setHours(0,0,0,0)
                  return d >= todayDate && d <= sunday
                })
                .sort((a, b) => new Date(a.followUpDate!).getTime() - new Date(b.followUpDate!).getTime())
              if (thisWeek.length === 0) return null
              const byDay: Record<string, typeof thisWeek> = {}
              thisWeek.forEach(c => {
                const key = c.followUpDate!.slice(0, 10)
                if (!byDay[key]) byDay[key] = []
                byDay[key].push(c)
              })
              const todayKey = todayDate.toISOString().slice(0, 10)
              return (
                <div className="space-y-2 mt-3">
                  <p className="text-[10px] font-semibold text-ocean uppercase tracking-wider flex items-center gap-1">
                    📅 This Week — {thisWeek.length} follow-up{thisWeek.length !== 1 ? 's' : ''}
                  </p>
                  {Object.entries(byDay).map(([dateKey, clients]) => {
                    const d = new Date(dateKey + 'T00:00:00')
                    const isToday = dateKey === todayKey
                    const label = isToday ? 'Today' : DAY_LABELS[d.getDay()]
                    return (
                      <div key={dateKey} className={`flex items-start gap-3 rounded-xl px-3 py-2.5 border ${isToday ? 'bg-ocean/5 border-ocean/20' : 'bg-white/70 border-midnight/5'}`}>
                        <span className={`text-xs font-bold w-10 shrink-0 pt-0.5 ${isToday ? 'text-ocean' : 'text-midnight/40'}`}>{label}</span>
                        <div className="flex-1 min-w-0 space-y-1">
                          {clients.map(c => (
                            <Link key={c.id} href={`/workshop/pph/clients/${c.id}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.priority === 'Hot' ? 'bg-red-500' : c.priority === 'Active' ? 'bg-orange-400' : 'bg-amber-400'}`} />
                              <span className="text-sm text-midnight truncate">{c.name}</span>
                              {c.nextAction && <span className="text-xs text-midnight/35 truncate hidden sm:inline">· {c.nextAction}</span>}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
          </div>
        )
      })()}


      {/* ── Weekly Call Goal Tracker ── */}
      <WeeklyCallGoalCard />

      {/* ── Jeffrey & Hannah Domenech — Active Deal Conditions ── */}
      {(!DOMENECH_ML_STATEMENTS_RECEIVED || !DOMENECH_GIFT_LETTER_RECEIVED || !DOMENECH_APPRAISAL_ORDERED) && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">🏠</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <p className="text-sm font-bold text-midnight">Jeffrey & Hannah Domenech — Open UW Conditions</p>
                <span className="text-xs bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-medium">3642 Arizona St</span>
              </div>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-xs">
                  {DOMENECH_ML_STATEMENTS_RECEIVED
                    ? <span className="text-emerald-600 font-bold">✅</span>
                    : <span className="text-red-500 font-bold">🔴</span>}
                  <span className={DOMENECH_ML_STATEMENTS_RECEIVED ? 'line-through text-midnight/40' : 'text-midnight/80 font-medium'}>
                    Updated Merrill Lynch statements (full — not first page only)
                  </span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  {DOMENECH_GIFT_LETTER_RECEIVED
                    ? <span className="text-emerald-600 font-bold">✅</span>
                    : <span className="text-red-500 font-bold">🔴</span>}
                  <span className={DOMENECH_GIFT_LETTER_RECEIVED ? 'line-through text-midnight/40' : 'text-midnight/80 font-medium'}>
                    Gift letter for $565k gift funds (Merrill Lynch Jan 27)
                  </span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  {DOMENECH_APPRAISAL_ORDERED
                    ? <span className="text-emerald-600 font-bold">✅</span>
                    : <span className="text-red-500 font-bold">🔴</span>}
                  <span className={DOMENECH_APPRAISAL_ORDERED ? 'line-through text-midnight/40' : 'text-midnight/80 font-medium'}>
                    New appraisal ordered
                  </span>
                </li>
              </ul>
              <p className="text-[10px] text-midnight/40 mt-2">
                Flip flags in morning/page.tsx once each item is received. Card auto-hides when all done.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Tareck El Khoury — Refi Call Reminder ── */}
      {!TARECK_CALL_DONE && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">📞</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-midnight">Call Tareck El Khoury — Refi lead · Follow up on refinance conversation</p>
              <p className="text-xs text-midnight/50 mt-1">
                Flip <code className="text-xs bg-amber-100 px-1 rounded">TARECK_CALL_DONE = true</code> once called
              </p>
            </div>
          </div>
        </div>
      )}

            {/* ── Music Weekly Snapshot ── */}
      {(() => {
        const now = new Date()
        const hour = now.getHours()
        const isLateNoMusic = !hasMusicToday && hour >= 18
        const pad2 = (n: number) => String(n).padStart(2, '0')
        const fmtD = (d: Date) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
        const todayBase = new Date(now); todayBase.setHours(0, 0, 0, 0)
        const dow = todayBase.getDay()
        const monday = new Date(todayBase)
        monday.setDate(todayBase.getDate() - (dow === 0 ? 6 : dow - 1))
        const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return fmtD(d) })
        const todayStr = fmtD(todayBase)
        const sessionDates = new Set(musicSessions.map(s => s.date))
        const weekMinutes = musicSessions.filter(s => s.date >= weekDays[0] && s.date <= weekDays[6]).reduce((sum, s) => sum + s.durationMin, 0)
        const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
        const cardCls = isLateNoMusic ? 'bg-amber-50 border-2 border-amber-300 rounded-2xl p-5' : 'bg-cream border border-midnight/10 rounded-2xl p-5'
        return (
          <div className={cardCls}>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2'>
                <span className='text-base'>🎺</span>
                <span className='text-sm font-bold text-midnight'>Music this week</span>
                {musicStreak > 0 && (
                  <span className='inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full'>
                    🔥 {musicStreak}d
                  </span>
                )}
              </div>
              <a href='/workshop/personal/music' className='text-xs text-ocean hover:underline font-medium'>
                Log session →
              </a>
            </div>
            <div className='flex gap-2 items-end mb-1'>
              {weekDays.map((d, i) => {
                const isFuture = d > todayStr
                const played = sessionDates.has(d)
                const isToday2 = d === todayStr
                const dotCls = played ? 'w-6 h-6 rounded-md bg-terracotta' : isFuture ? 'w-6 h-6 rounded-md bg-midnight/5' : isToday2 ? (isLateNoMusic ? 'w-6 h-6 rounded-md bg-amber-200 ring-2 ring-amber-400' : 'w-6 h-6 rounded-md bg-midnight/15 ring-2 ring-midnight/20') : 'w-6 h-6 rounded-md bg-midnight/10'
                return (
                  <div key={d} className='flex flex-col items-center gap-1'>
                    <div className={dotCls} />
                    <span className='text-[9px] text-midnight/40 font-medium'>{DAY_LABELS[i]}</span>
                  </div>
                )
              })}
              <div className='ml-auto flex flex-col items-end justify-center pb-4'>
                <span className='text-sm font-bold text-midnight'>{weekMinutes}m</span>
                <span className='text-[10px] text-midnight/40'>this week</span>
              </div>
            </div>
            {isLateNoMusic && (
              <p className='text-xs text-amber-700 mt-1'>No music yet today — 30 min keeps the streak alive 🎺</p>
            )}
          </div>
        )
      })()}

            {/* ── Quick Task Add ── */}
      <div className="relative bg-cream rounded-2xl p-6 border border-midnight/5 overflow-hidden">
        {quickSuccess && (
          <div
            className="absolute inset-0 bg-emerald-50 flex flex-col items-center justify-center gap-2 z-10 rounded-2xl"
            style={{ animation: 'fadeIn 0.15s ease-out' }}
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="w-7 h-7 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-emerald-700">Task added to Notion</span>
          </div>
        )}
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-4 h-4 text-ocean" />
          <h2 className="font-display text-lg text-midnight">Quick Add Task</h2>
        </div>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="What needs doing?"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !quickAdding && handleQuickTaskAdd()}
            className="w-full text-sm bg-white border border-midnight/10 rounded-xl px-4 py-2.5 text-midnight placeholder-midnight/25 focus:outline-none focus:border-ocean transition-colors"
          />
          <div className="flex gap-2">
            <select
              value={quickPriority}
              onChange={(e) => setQuickPriority(e.target.value)}
              className="flex-1 text-sm bg-white border border-midnight/10 rounded-xl px-3 py-2 text-midnight focus:outline-none focus:border-ocean transition-colors"
            >
              <option value="Urgent">🔴 Urgent</option>
              <option value="High">🟠 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">⚪ Low</option>
            </select>
            <select
              value={quickCategory}
              onChange={(e) => setQuickCategory(e.target.value)}
              className="flex-1 text-sm bg-white border border-midnight/10 rounded-xl px-3 py-2 text-midnight focus:outline-none focus:border-ocean transition-colors"
            >
              <option value="LO Buddy">🤖 LO Buddy</option>
              <option value="Lead Gen">📊 Lead Gen</option>
              <option value="Life Org">🏠 Life Org</option>
              <option value="Home &amp; Family">👨‍👩‍👧‍👦 Home &amp; Family</option>
              <option value="Music">🎵 Music</option>
              <option value="Finance">💰 Finance</option>
              <option value="System / DevOps">⚙️ System / DevOps</option>
              <option value="Other">📌 Other</option>
            </select>
            <button
              onClick={handleQuickTaskAdd}
              disabled={quickAdding || !quickTitle.trim()}
              className="px-5 py-2 bg-midnight text-cream text-sm font-medium rounded-xl hover:bg-ocean transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {quickAdding ? '…' : 'Add'}
            </button>
          </div>
          {quickError && <p className="text-xs text-red-500">{quickError}</p>}
        </div>
      </div>

      {/* ── Email Digest ── */}
      {emailDigest !== null && (
        <div className={`rounded-2xl p-6 border transition-all ${
          emailDigest.unread > 0
            ? 'bg-sky-50 border-sky-200'
            : 'bg-cream border-midnight/5'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mail className={`w-4 h-4 ${emailDigest.unread > 0 ? 'text-sky-600' : 'text-midnight/40'}`} />
              <h2 className="font-display text-lg text-midnight">Jasper Inbox</h2>
              <span className="text-xs text-midnight/30">jasperthedog@agentmail.to</span>
            </div>
            {emailDigest.unread > 0 && (
              <span className="bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {emailDigest.unread} unread
              </span>
            )}
          </div>
          {emailDigest.unread === 0 ? (
            <p className="text-sm text-midnight/40 italic">Inbox clear ✓</p>
          ) : (
            <div className="space-y-2">
              {emailDigest.topMessages.map((msg, i) => (
                <div key={i} className="bg-white/70 rounded-xl px-4 py-3 border border-sky-100">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-midnight truncate">{msg.subject}</div>
                      <div className="text-xs text-midnight/50 mt-0.5 truncate">From: {msg.from}</div>
                      {msg.preview && (
                        <div className="text-xs text-midnight/40 mt-1 line-clamp-1">{msg.preview}</div>
                      )}
                    </div>
                    <div className="text-xs text-midnight/30 shrink-0 mt-0.5">
                      {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </div>
                  </div>
                </div>
              ))}
              {emailDigest.unread > 3 && (
                <p className="text-xs text-midnight/40 text-center pt-1">
                  +{emailDigest.unread - 3} more unread
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Quick Links ── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-8 bg-ocean rounded-full" />
          <h2 className="font-display text-2xl text-midnight">Quick Access</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Mortgage Pipeline (Notion) */}
          <Link
            href="/workshop/pph/opportunities"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-cream border-midnight/5 hover:border-midnight/20 transition-all text-center"
          >
            <CheckSquare className="w-5 h-5 text-ocean" />
            <span className="text-xs font-medium text-midnight/70">Pipeline</span>
          </Link>

          {/* PPH Kanban */}
          <Link
            href="/workshop/pph/pipeline"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-cream border-midnight/5 hover:border-midnight/20 transition-all text-center"
          >
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <span className="text-xs font-medium text-midnight/70">PPH Kanban</span>
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

          {/* Income Qualifier */}
          <Link
            href="/workshop/pph/income-qualifier"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-cream border-midnight/5 hover:border-midnight/20 transition-all text-center"
          >
            <Calculator className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-midnight/70">Income Qualifier</span>
          </Link>

          {/* GH Co-Op */}
          <Link
            href="/workshop/personal/gh-coop"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-cream border-midnight/5 hover:border-midnight/20 transition-all text-center"
          >
            <Home className="w-5 h-5 text-terracotta" />
            <span className="text-xs font-medium text-midnight/70">GH Co-Op</span>
          </Link>

          {/* Trip Planner */}
          <Link
            href="/workshop/personal/trip-july-2026"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-cream border-midnight/5 hover:border-midnight/20 transition-all text-center"
          >
            <Plane className="w-5 h-5 text-sky-500" />
            <span className="text-xs font-medium text-midnight/70">Trip Planner</span>
          </Link>

          {/* KB */}
          <Link
            href="/workshop/kb"
            className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-cream border-midnight/5 hover:border-midnight/20 transition-all text-center"
          >
            <BookOpen className="w-5 h-5 text-midnight/40" />
            <span className="text-xs font-medium text-midnight/70">Knowledge Base</span>
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

      {/* ── Daily Hermetic Principle ── */}
      <DailyPrincipleCard />

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
