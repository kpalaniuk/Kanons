'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Plus, ChevronDown, ChevronUp, Trash2,
  Clock, Users, Star, Edit3, Check, X, Copy
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

interface Drill {
  id: string
  name: string
  duration: number       // minutes
  description: string
  playersNeeded: string  // e.g. "whole squad" | "pairs" | "4-6"
  equipment: string
  coachingPoints: string
  category: DrillCategory
}

type DrillCategory = 'warmup' | 'technical' | 'tactical' | 'small-sided' | 'conditioning' | 'cooldown'

interface PracticeSession {
  id: string
  date: string           // YYYY-MM-DD
  theme: string
  durationMin: number
  drills: Drill[]
  coachNotes: string
  venue: string
  weather: string
  attendance: number | null
}

// ── Preset drill library ────────────────────────────────────────────────────

const DRILL_LIBRARY: Omit<Drill, 'id'>[] = [
  {
    name: 'Dynamic Warm-Up',
    duration: 8,
    category: 'warmup',
    description: 'High knees, butt kicks, lateral shuffles, arm circles. Light jog around the grid.',
    playersNeeded: 'Whole squad',
    equipment: 'Cones',
    coachingPoints: 'Get heart rate up. Focus on mobility not intensity.',
  },
  {
    name: 'Passing + Moving (4-corner)',
    duration: 10,
    category: 'technical',
    description: 'Four cones in a square ~10yd. Pass and follow your pass to the next cone. Progress to 1-2 combos.',
    playersNeeded: '8–16',
    equipment: '4 cones, 2 balls',
    coachingPoints: 'Weight of pass. Foot you receive on. Call "man on" / "turn".',
  },
  {
    name: 'Dribbling Gates',
    duration: 8,
    category: 'technical',
    description: 'Set up 8–10 small gates (pairs of cones 1yd wide) in a 20×20 grid. Players dribble through as many gates as possible in 60 sec.',
    playersNeeded: 'Whole squad',
    equipment: '20 cones',
    coachingPoints: 'Head up. Close ball control. Change of speed through gate.',
  },
  {
    name: 'Rondo (4v2)',
    duration: 10,
    category: 'tactical',
    description: '4 players on outside, 2 defenders in middle. Keep possession. Switch when defenders win or 5 seconds.',
    playersNeeded: '6',
    equipment: '1 ball',
    coachingPoints: 'Move before ball arrives. Support angles. Communication.',
  },
  {
    name: '1v1 Defending',
    duration: 10,
    category: 'technical',
    description: 'Two end lines, each player tries to dribble through opponent\'s end line. Attacker goes first. Reset after each rep.',
    playersNeeded: 'Pairs',
    equipment: 'Cones',
    coachingPoints: 'Jockey stance. Delay. Force wide. Don\'t dive in.',
  },
  {
    name: 'Finishing — Shooting Circuit',
    duration: 12,
    category: 'technical',
    description: 'Serve from wide, player cuts to goal and finishes. Alternate sides. GK rotates every 5 shots.',
    playersNeeded: 'Whole squad',
    equipment: 'Balls, goal',
    coachingPoints: 'Plant foot beside ball. Head steady. Follow through low.',
  },
  {
    name: 'Possession 4v4 (+2 neutrals)',
    duration: 15,
    category: 'small-sided',
    description: '4v4 in a 30×20 grid, 2 neutral players always with possession team (6v4). Points for 5+ consecutive passes.',
    playersNeeded: '10',
    equipment: 'Bibs, cones, 1 ball',
    coachingPoints: 'Play forward first. Support width. Communicate.',
  },
  {
    name: '3v3 Small-Sided Game',
    duration: 15,
    category: 'small-sided',
    description: 'Three teams rotating. 3-minute games. Winners stay, losers off. Full press.',
    playersNeeded: '9+',
    equipment: 'Bibs, mini goals',
    coachingPoints: 'High intensity. Press immediately on turnover. Be brave in 1v1.',
  },
  {
    name: 'Shape Walk-Through',
    duration: 8,
    category: 'tactical',
    description: 'Walk the team through defensive and attacking shape. Show positions, lines, compactness. No pressure.',
    playersNeeded: 'Whole squad',
    equipment: 'Cones (optional)',
    coachingPoints: 'Defensive line. Mid-block. Where is the ball?',
  },
  {
    name: '7v7 Full Game',
    duration: 20,
    category: 'small-sided',
    description: 'Full field practice match. Coaches can freeze-play to coach moments. Subs every 5 min.',
    playersNeeded: '14–16',
    equipment: 'Bibs, full goals',
    coachingPoints: 'Let them play. Freeze for key teaching moments only.',
  },
  {
    name: 'Passing Triangles',
    duration: 8,
    category: 'technical',
    description: 'Three players in a triangle ~8yd apart. Pass and move. Progress to 1-touch on demand.',
    playersNeeded: 'Groups of 3',
    equipment: 'Cones, 1 ball per triangle',
    coachingPoints: 'Open body. Receive across body. Third man movement.',
  },
  {
    name: 'Set Piece — Corner Kicks',
    duration: 8,
    category: 'tactical',
    description: 'Practice near-post run, far-post run, and penalty spot option from corner. Alternate sides.',
    playersNeeded: 'Whole squad',
    equipment: 'Balls, goal',
    coachingPoints: 'Time the run. Attack the ball. Near-post flick option.',
  },
  {
    name: 'Cooldown + Stretch',
    duration: 5,
    category: 'cooldown',
    description: 'Light jog, then team stretches together. Quads, hamstrings, hip flexors, calves.',
    playersNeeded: 'Whole squad',
    equipment: 'None',
    coachingPoints: 'Hold 20+ sec. Breathe. Quiet debrief moment.',
  },
]

const CATEGORY_COLORS: Record<DrillCategory, string> = {
  warmup:       'bg-orange-100 text-orange-700',
  technical:    'bg-blue-100 text-blue-700',
  tactical:     'bg-purple-100 text-purple-700',
  'small-sided':'bg-green-100 text-green-700',
  conditioning: 'bg-red-100 text-red-700',
  cooldown:     'bg-slate-100 text-slate-600',
}

const CATEGORY_LABELS: Record<DrillCategory, string> = {
  warmup:       'Warm-Up',
  technical:    'Technical',
  tactical:     'Tactical',
  'small-sided':'Small-Sided',
  conditioning: 'Conditioning',
  cooldown:     'Cool-Down',
}

const THEMES = [
  'Passing & Possession', 'Defending', 'Finishing', 'Dribbling & 1v1',
  'Shape & Positioning', 'Set Pieces', 'Transition', 'Game Day Prep', 'Fun Session',
]

const VENUES = ['Jefferson Elementary', 'FC Balboa HQ', 'Away Field', 'Other']

// ── Helpers ────────────────────────────────────────────────────────────────

function genId() { return Math.random().toString(36).slice(2, 10) }
function today() { return new Date().toISOString().split('T')[0] }
function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-').map(Number)
  return new Date(y, m - 1, day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Sub-components ─────────────────────────────────────────────────────────

function DrillCard({ drill, onRemove, onMoveUp, onMoveDown, isFirst, isLast }: {
  drill: Drill
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white rounded-xl border border-midnight/8 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex flex-col gap-0.5">
          <button onClick={e => { e.stopPropagation(); onMoveUp() }} disabled={isFirst}
            className="p-0.5 text-midnight/20 hover:text-midnight/60 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
            <ChevronUp className="w-3 h-3" />
          </button>
          <button onClick={e => { e.stopPropagation(); onMoveDown() }} disabled={isLast}
            className="p-0.5 text-midnight/20 hover:text-midnight/60 disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-midnight">{drill.name}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[drill.category]}`}>
              {CATEGORY_LABELS[drill.category]}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-midnight/40">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{drill.duration} min</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{drill.playersNeeded}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4 text-midnight/30" /> : <ChevronDown className="w-4 h-4 text-midnight/30" />}
          <button onClick={e => { e.stopPropagation(); onRemove() }}
            className="p-1 text-midnight/20 hover:text-red-400 transition-colors rounded">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t border-midnight/5 pt-3 space-y-2 text-sm">
          <p className="text-midnight/70">{drill.description}</p>
          {drill.equipment && (
            <p className="text-xs text-midnight/40"><span className="font-medium text-midnight/60">Equipment:</span> {drill.equipment}</p>
          )}
          {drill.coachingPoints && (
            <div className="bg-amber-50 border border-amber-200/60 rounded-lg px-3 py-2">
              <p className="text-xs font-semibold text-amber-700 mb-0.5 flex items-center gap-1">
                <Star className="w-3 h-3" /> Coaching Points
              </p>
              <p className="text-xs text-amber-800">{drill.coachingPoints}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'fc-balboa-practice-plans'

function loadSessions(): PracticeSession[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function saveSessions(sessions: PracticeSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export default function PracticePlansPage() {
  const [sessions, setSessions] = useState<PracticeSession[]>([])
  const [view, setView] = useState<'list' | 'edit' | 'new'>('list')
  const [activeSession, setActiveSession] = useState<PracticeSession | null>(null)
  const [showLibrary, setShowLibrary] = useState(false)
  const [libraryFilter, setLibraryFilter] = useState<DrillCategory | 'all'>('all')
  const [customDrillOpen, setCustomDrillOpen] = useState(false)
  const [customDrill, setCustomDrill] = useState<Partial<Drill>>({ duration: 10, category: 'technical', playersNeeded: 'Whole squad' })
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => { setSessions(loadSessions()) }, [])

  function persist(updated: PracticeSession[]) {
    setSessions(updated)
    saveSessions(updated)
  }

  function newSession() {
    const s: PracticeSession = {
      id: genId(),
      date: today(),
      theme: 'Passing & Possession',
      durationMin: 90,
      drills: [],
      coachNotes: '',
      venue: 'Jefferson Elementary',
      weather: '',
      attendance: null,
    }
    setActiveSession(s)
    setView('new')
  }

  function editSession(s: PracticeSession) {
    setActiveSession(JSON.parse(JSON.stringify(s)))
    setView('edit')
  }

  function deleteSession(id: string) {
    if (!confirm('Delete this session?')) return
    persist(sessions.filter(s => s.id !== id))
  }

  function saveActive() {
    if (!activeSession) return
    const exists = sessions.find(s => s.id === activeSession.id)
    if (exists) {
      persist(sessions.map(s => s.id === activeSession.id ? activeSession : s))
    } else {
      persist([activeSession, ...sessions])
    }
    setView('list')
    setActiveSession(null)
  }

  function updateActive(fields: Partial<PracticeSession>) {
    setActiveSession(prev => prev ? { ...prev, ...fields } : prev)
  }

  function addDrillFromLibrary(d: Omit<Drill, 'id'>) {
    if (!activeSession) return
    const drill: Drill = { ...d, id: genId() }
    updateActive({ drills: [...activeSession.drills, drill] })
  }

  function addCustomDrill() {
    if (!activeSession || !customDrill.name?.trim()) return
    const drill: Drill = {
      id: genId(),
      name: customDrill.name,
      duration: customDrill.duration || 10,
      category: (customDrill.category as DrillCategory) || 'technical',
      description: customDrill.description || '',
      playersNeeded: customDrill.playersNeeded || 'Whole squad',
      equipment: customDrill.equipment || '',
      coachingPoints: customDrill.coachingPoints || '',
    }
    updateActive({ drills: [...activeSession.drills, drill] })
    setCustomDrill({ duration: 10, category: 'technical', playersNeeded: 'Whole squad' })
    setCustomDrillOpen(false)
  }

  function removeDrill(id: string) {
    if (!activeSession) return
    updateActive({ drills: activeSession.drills.filter(d => d.id !== id) })
  }

  function moveDrill(id: string, dir: 'up' | 'down') {
    if (!activeSession) return
    const idx = activeSession.drills.findIndex(d => d.id === id)
    if (idx < 0) return
    const drills = [...activeSession.drills]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= drills.length) return
    ;[drills[idx], drills[swap]] = [drills[swap], drills[idx]]
    updateActive({ drills })
  }

  function totalPlannedMin(s: PracticeSession) {
    return s.drills.reduce((acc, d) => acc + d.duration, 0)
  }

  function copyPlan(s: PracticeSession) {
    const lines = [
      `FC Balboa Practice Plan — ${formatDate(s.date)}`,
      `Theme: ${s.theme} | Duration: ${s.durationMin} min | Venue: ${s.venue}`,
      '',
      ...s.drills.map((d, i) => `${i + 1}. ${d.name} (${d.duration} min) — ${CATEGORY_LABELS[d.category]}\n   ${d.description}${d.coachingPoints ? `\n   ★ ${d.coachingPoints}` : ''}`),
      '',
      s.coachNotes ? `Notes: ${s.coachNotes}` : '',
    ].filter(Boolean)
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {})
    setCopiedId(s.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredLibrary = libraryFilter === 'all'
    ? DRILL_LIBRARY
    : DRILL_LIBRARY.filter(d => d.category === libraryFilter)

  // ── List View ──────────────────────────────────────────────────────────────

  if (view === 'list') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/workshop/personal/fc-balboa" className="inline-flex items-center gap-2 text-sm text-midnight/40 hover:text-green-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to FC Balboa
        </Link>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl text-midnight">Practice Plans</h1>
            <p className="text-midnight/50 text-sm mt-1">FC Balboa U10 · Wed/Thu · Jefferson Elementary</p>
          </div>
          <button onClick={newSession}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors flex-shrink-0">
            <Plus className="w-4 h-4" /> New Session
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-midnight/15 rounded-2xl">
            <p className="text-4xl mb-3">⚽</p>
            <p className="text-midnight/40 font-medium">No sessions yet</p>
            <p className="text-midnight/25 text-sm mt-1">Create your first practice plan above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions
              .sort((a, b) => b.date.localeCompare(a.date))
              .map(s => {
                const planned = totalPlannedMin(s)
                return (
                  <div key={s.id} className="bg-cream rounded-xl border border-midnight/8 overflow-hidden">
                    <div className="px-5 py-4 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-midnight">{formatDate(s.date)}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{s.theme}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-midnight/40 flex-wrap">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.durationMin} min planned</span>
                          {s.drills.length > 0 && <span>{s.drills.length} drill{s.drills.length !== 1 ? 's' : ''} · {planned} min</span>}
                          <span>📍 {s.venue}</span>
                          {s.attendance !== null && <span><Users className="w-3 h-3 inline" /> {s.attendance} players</span>}
                        </div>
                        {s.drills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {s.drills.slice(0, 4).map(d => (
                              <span key={d.id} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[d.category]}`}>
                                {d.name}
                              </span>
                            ))}
                            {s.drills.length > 4 && <span className="text-[10px] text-midnight/30 px-1">+{s.drills.length - 4} more</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                        <button onClick={() => copyPlan(s)} title="Copy to clipboard"
                          className="p-2 text-midnight/30 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                          {copiedId === s.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => editSession(s)}
                          className="p-2 text-midnight/30 hover:text-ocean rounded-lg hover:bg-ocean/5 transition-colors">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteSession(s.id)}
                          className="p-2 text-midnight/20 hover:text-red-400 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>
    )
  }

  // ── Edit / New View ────────────────────────────────────────────────────────

  if (!activeSession) return null
  const planned = totalPlannedMin(activeSession)
  const timeGap = activeSession.durationMin - planned

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={() => { setView('list'); setActiveSession(null) }}
          className="p-2 rounded-lg hover:bg-midnight/5 transition-colors text-midnight/40 hover:text-midnight">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-xl text-midnight flex-1">
          {view === 'new' ? 'New Session' : 'Edit Session'}
        </h1>
        <button onClick={saveActive}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
          <Check className="w-4 h-4" /> Save
        </button>
      </div>

      {/* Session meta */}
      <div className="bg-cream rounded-xl p-5 border border-midnight/8 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-midnight/40 block mb-1">Date</label>
            <input type="date" value={activeSession.date}
              onChange={e => updateActive({ date: e.target.value })}
              className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-green-500/50" />
          </div>
          <div>
            <label className="text-xs text-midnight/40 block mb-1">Duration (min)</label>
            <input type="number" value={activeSession.durationMin} min={30} max={180} step={15}
              onChange={e => updateActive({ durationMin: parseInt(e.target.value) || 90 })}
              className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-green-500/50" />
          </div>
          <div>
            <label className="text-xs text-midnight/40 block mb-1">Attendance</label>
            <input type="number" placeholder="# players" value={activeSession.attendance ?? ''}
              onChange={e => updateActive({ attendance: parseInt(e.target.value) || null })}
              className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-green-500/50" />
          </div>
          <div>
            <label className="text-xs text-midnight/40 block mb-1">Theme</label>
            <select value={activeSession.theme}
              onChange={e => updateActive({ theme: e.target.value })}
              className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none bg-white">
              {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-midnight/40 block mb-1">Venue</label>
            <select value={activeSession.venue}
              onChange={e => updateActive({ venue: e.target.value })}
              className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none bg-white">
              {VENUES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-midnight/40 block mb-1">Weather</label>
            <input type="text" placeholder="Sunny, 68°F" value={activeSession.weather}
              onChange={e => updateActive({ weather: e.target.value })}
              className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-green-500/50" />
          </div>
        </div>
      </div>

      {/* Time tracker */}
      <div className={`rounded-xl px-4 py-3 flex items-center justify-between text-sm ${
        timeGap < 0 ? 'bg-red-50 border border-red-200' : timeGap < 10 ? 'bg-green-50 border border-green-200' : 'bg-midnight/3 border border-midnight/8'
      }`}>
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-midnight/40" />
          <span className="text-midnight/60">
            <span className="font-semibold text-midnight">{planned} min</span> planned of <span className="font-semibold text-midnight">{activeSession.durationMin} min</span>
          </span>
        </div>
        <span className={`text-sm font-semibold ${timeGap < 0 ? 'text-red-600' : timeGap < 10 ? 'text-green-600' : 'text-midnight/40'}`}>
          {timeGap > 0 ? `${timeGap} min left` : timeGap === 0 ? '✅ Perfect fit' : `${Math.abs(timeGap)} min over`}
        </span>
      </div>

      {/* Drills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-midnight text-sm">Drills ({activeSession.drills.length})</h2>
          <div className="flex gap-2">
            <button onClick={() => setShowLibrary(l => !l)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ocean text-white rounded-lg text-xs font-medium hover:bg-ocean/90 transition-colors">
              <Plus className="w-3.5 h-3.5" /> From Library
            </button>
            <button onClick={() => setCustomDrillOpen(c => !c)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-midnight/5 text-midnight/60 rounded-lg text-xs font-medium hover:bg-midnight/10 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Custom
            </button>
          </div>
        </div>

        {activeSession.drills.length === 0 && (
          <div className="text-center py-8 border border-dashed border-midnight/10 rounded-xl text-midnight/30 text-sm">
            No drills yet — add from the library or create a custom drill
          </div>
        )}

        {activeSession.drills.map((drill, i) => (
          <DrillCard
            key={drill.id}
            drill={drill}
            isFirst={i === 0}
            isLast={i === activeSession.drills.length - 1}
            onRemove={() => removeDrill(drill.id)}
            onMoveUp={() => moveDrill(drill.id, 'up')}
            onMoveDown={() => moveDrill(drill.id, 'down')}
          />
        ))}
      </div>

      {/* Drill Library panel */}
      {showLibrary && (
        <div className="bg-cream rounded-xl border border-midnight/8 overflow-hidden">
          <div className="px-4 py-3 border-b border-midnight/8 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-sm text-midnight">Drill Library</h3>
            <button onClick={() => setShowLibrary(false)} className="text-midnight/30 hover:text-midnight"><X className="w-4 h-4" /></button>
          </div>
          {/* Category filter */}
          <div className="px-4 py-2 border-b border-midnight/5 flex flex-wrap gap-1.5">
            {(['all', 'warmup', 'technical', 'tactical', 'small-sided', 'conditioning', 'cooldown'] as const).map(c => (
              <button key={c}
                onClick={() => setLibraryFilter(c)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                  libraryFilter === c
                    ? 'bg-midnight text-cream'
                    : 'bg-midnight/5 text-midnight/50 hover:bg-midnight/10'
                }`}>
                {c === 'all' ? 'All' : CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
          <div className="divide-y divide-midnight/5 max-h-80 overflow-y-auto">
            {filteredLibrary.map((d, i) => (
              <button
                key={i}
                onClick={() => { addDrillFromLibrary(d); setShowLibrary(false) }}
                className="w-full text-left px-4 py-3 hover:bg-ocean/3 transition-colors group flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-midnight group-hover:text-ocean transition-colors">{d.name}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[d.category]}`}>
                      {CATEGORY_LABELS[d.category]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-midnight/35">
                    <span>{d.duration} min</span>
                    <span>{d.playersNeeded}</span>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-midnight/20 group-hover:text-ocean flex-shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom drill form */}
      {customDrillOpen && (
        <div className="bg-cream rounded-xl border border-ocean/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-midnight">Custom Drill</h3>
            <button onClick={() => setCustomDrillOpen(false)} className="text-midnight/30 hover:text-midnight"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="text-xs text-midnight/40 block mb-0.5">Drill Name *</label>
              <input type="text" placeholder="e.g. Box Passing" value={customDrill.name || ''}
                onChange={e => setCustomDrill(p => ({ ...p, name: e.target.value }))}
                className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-ocean/50" />
            </div>
            <div>
              <label className="text-xs text-midnight/40 block mb-0.5">Duration (min)</label>
              <input type="number" value={customDrill.duration || 10} min={1}
                onChange={e => setCustomDrill(p => ({ ...p, duration: parseInt(e.target.value) || 10 }))}
                className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-midnight/40 block mb-0.5">Category</label>
              <select value={customDrill.category || 'technical'}
                onChange={e => setCustomDrill(p => ({ ...p, category: e.target.value as DrillCategory }))}
                className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none bg-white">
                {(Object.keys(CATEGORY_LABELS) as DrillCategory[]).map(c => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-midnight/40 block mb-0.5">Players Needed</label>
              <input type="text" placeholder="e.g. Pairs, 4–6" value={customDrill.playersNeeded || ''}
                onChange={e => setCustomDrill(p => ({ ...p, playersNeeded: e.target.value }))}
                className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-midnight/40 block mb-0.5">Equipment</label>
              <input type="text" placeholder="Cones, bibs..." value={customDrill.equipment || ''}
                onChange={e => setCustomDrill(p => ({ ...p, equipment: e.target.value }))}
                className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-midnight/40 block mb-0.5">Description</label>
              <textarea rows={2} placeholder="Setup and how it works..."
                value={customDrill.description || ''}
                onChange={e => setCustomDrill(p => ({ ...p, description: e.target.value }))}
                className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none resize-none" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-midnight/40 block mb-0.5">Coaching Points</label>
              <input type="text" placeholder="What to look for / correct..."
                value={customDrill.coachingPoints || ''}
                onChange={e => setCustomDrill(p => ({ ...p, coachingPoints: e.target.value }))}
                className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={addCustomDrill}
              className="px-4 py-1.5 bg-midnight text-cream rounded-lg text-xs font-medium hover:bg-midnight/80 transition-colors">
              Add Drill
            </button>
            <button onClick={() => setCustomDrillOpen(false)}
              className="px-3 py-1.5 text-midnight/40 hover:text-midnight text-xs transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Coach Notes */}
      <div className="bg-cream rounded-xl p-5 border border-midnight/8">
        <label className="text-sm font-semibold text-midnight block mb-2">Coach Notes</label>
        <textarea rows={4} placeholder="Session goals, player notes, things to remember..."
          value={activeSession.coachNotes}
          onChange={e => updateActive({ coachNotes: e.target.value })}
          className="w-full px-3 py-2 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-green-500/50 resize-none" />
      </div>

      {/* Save button (bottom) */}
      <div className="fixed bottom-6 right-6 sm:static sm:bottom-auto sm:right-auto sm:flex sm:justify-end">
        <button onClick={saveActive}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 shadow-lg sm:shadow-none transition-colors">
          <Check className="w-4 h-4" /> Save Session
        </button>
      </div>
    </div>
  )
}
