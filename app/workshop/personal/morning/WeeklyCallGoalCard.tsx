'use client'

import { useState, useEffect } from 'react'
import { Phone, Plus, Minus, RefreshCw } from 'lucide-react'

// ── Weekly Call Goal Tracker ──────────────────────────────────────────────────
// Persists in localStorage. Resets every Monday.
// Shows Mon–Fri only (hides weekends).

const STORAGE_KEY = 'morning-brief-call-goal'
const DEFAULT_GOAL = 20

interface CallGoalData {
  weekKey: string   // ISO string of Monday of current week e.g. "2026-04-06"
  calls: number
  goal: number
}

function getMonday(d: Date): string {
  const date = new Date(d)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day // adjust to Monday
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date.toISOString().slice(0, 10)
}

export default function WeeklyCallGoalCard() {
  const [data, setData] = useState<CallGoalData | null>(null)
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState('')

  // Hide on weekends
  const dayOfWeek = new Date().getDay()
  if (dayOfWeek === 0 || dayOfWeek === 6) return null

  // Load / reset from localStorage
  useEffect(() => {
    const thisWeek = getMonday(new Date())
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const stored: CallGoalData = JSON.parse(raw)
        if (stored.weekKey === thisWeek) {
          setData(stored)
          return
        }
      }
    } catch {}
    // Fresh week
    const fresh: CallGoalData = { weekKey: thisWeek, calls: 0, goal: DEFAULT_GOAL }
    setData(fresh)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)) } catch {}
  }, [])

  const save = (next: CallGoalData) => {
    setData(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
  }

  const increment = () => {
    if (!data) return
    save({ ...data, calls: data.calls + 1 })
  }

  const decrement = () => {
    if (!data || data.calls === 0) return
    save({ ...data, calls: data.calls - 1 })
  }

  const reset = () => {
    if (!data) return
    save({ ...data, calls: 0 })
  }

  const saveGoal = () => {
    if (!data) return
    const n = parseInt(goalInput)
    if (!isNaN(n) && n > 0) save({ ...data, goal: n })
    setEditingGoal(false)
  }

  if (!data) return null

  const pct = Math.min(100, Math.round((data.calls / data.goal) * 100))
  const remaining = Math.max(0, data.goal - data.calls)
  const done = data.calls >= data.goal

  // Day labels Mon–Fri
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const todayIdx = new Date().getDay() - 1 // 0=Mon

  return (
    <div className={`rounded-2xl p-5 border-2 transition-all ${
      done
        ? 'bg-emerald-50 border-emerald-300'
        : pct >= 75
        ? 'bg-green-50 border-green-200'
        : 'bg-cream border-midnight/10'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Phone className={`w-4 h-4 ${done ? 'text-emerald-600' : 'text-ocean'}`} />
          <h2 className="font-display text-lg text-midnight">Weekly Calls</h2>
          {done && (
            <span className="text-xs font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full animate-pulse">
              GOAL HIT 🎉
            </span>
          )}
        </div>
        <button
          onClick={reset}
          className="text-xs text-midnight/30 hover:text-midnight/60 transition-colors flex items-center gap-1"
          title="Reset to 0"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      {/* Big counter */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <button
          onClick={decrement}
          disabled={data.calls === 0}
          className="w-10 h-10 rounded-full bg-midnight/5 hover:bg-midnight/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          <Minus className="w-4 h-4 text-midnight" />
        </button>

        <div className="text-center">
          <div className={`text-5xl font-display leading-none ${done ? 'text-emerald-600' : 'text-midnight'}`}>
            {data.calls}
          </div>
          {editingGoal ? (
            <div className="flex items-center gap-1 mt-1 justify-center">
              <span className="text-xs text-midnight/40">of</span>
              <input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onBlur={saveGoal}
                onKeyDown={(e) => e.key === 'Enter' && saveGoal()}
                autoFocus
                className="w-14 text-sm text-center border border-ocean rounded-lg px-1 py-0.5 focus:outline-none"
              />
            </div>
          ) : (
            <button
              onClick={() => { setGoalInput(String(data.goal)); setEditingGoal(true) }}
              className="text-xs text-midnight/30 hover:text-midnight/60 transition-colors mt-1"
              title="Tap to change goal"
            >
              of {data.goal} goal
            </button>
          )}
        </div>

        <button
          onClick={increment}
          className="w-10 h-10 rounded-full bg-ocean hover:bg-ocean/80 flex items-center justify-center transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="w-full bg-midnight/5 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              done ? 'bg-emerald-500' : pct >= 75 ? 'bg-green-500' : pct >= 40 ? 'bg-ocean' : 'bg-amber-400'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-midnight/30 mt-1">
          <span>{pct}%</span>
          <span>{done ? '✓ Done!' : `${remaining} to go`}</span>
        </div>
      </div>

      {/* Day dots — visual week tracker */}
      <div className="flex gap-2 justify-center">
        {dayNames.map((d, i) => (
          <div key={d} className="flex flex-col items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              i < todayIdx ? 'bg-ocean/40' : i === todayIdx ? 'bg-ocean' : 'bg-midnight/10'
            }`} />
            <span className={`text-[9px] ${i === todayIdx ? 'text-ocean font-bold' : 'text-midnight/25'}`}>{d}</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-midnight/20 text-center mt-2">Resets each Monday · tap goal to edit</p>
    </div>
  )
}
