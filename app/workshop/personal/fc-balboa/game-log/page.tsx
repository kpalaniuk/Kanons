'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Edit3, Check, X, Trophy, Minus } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

type Result = 'W' | 'L' | 'D'

interface GameGoal {
  player: string
  assist: string
}

interface Game {
  id: string
  date: string
  opponent: string
  venue: 'Home' | 'Away' | 'Neutral'
  goalsFor: number
  goalsAgainst: number
  result: Result
  scorers: GameGoal[]
  notes: string
  attendance: number | null
}

// ── Constants ──────────────────────────────────────────────────────────────

const ROSTER = [
  'Bohdan Palaniuk', 'Danilo Borunda', 'Oliver Neison', 'Noah Bendinelli',
  'Keaton Rempel', 'Maddox Short', 'Clayton Coder', 'Walker Laub',
  'Benjamin Vela', 'Declan Cameron', 'Landon West', 'Jackson Holleran',
  'Asher Siewert', 'Oliver Nascimento', 'Isaac Perez-Kimes', 'Dylan Jones',
]

const STORAGE_KEY = 'fc-balboa-game-log'

// ── Helpers ────────────────────────────────────────────────────────────────

function genId() { return Math.random().toString(36).slice(2, 10) }
function today() { return new Date().toISOString().split('T')[0] }
function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-').map(Number)
  return new Date(y, m - 1, day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
function calcResult(gf: number, ga: number): Result {
  if (gf > ga) return 'W'
  if (gf < ga) return 'L'
  return 'D'
}

function loadGames(): Game[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}
function saveGames(games: Game[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
}

// ── Result badge ──────────────────────────────────────────────────────────

function ResultBadge({ result }: { result: Result }) {
  const styles: Record<Result, string> = {
    W: 'bg-green-100 text-green-700',
    L: 'bg-red-100 text-red-600',
    D: 'bg-slate-100 text-slate-600',
  }
  const labels: Record<Result, string> = { W: 'W', L: 'L', D: 'D' }
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${styles[result]}`}>
      {labels[result]}
    </span>
  )
}

// ── Season summary ─────────────────────────────────────────────────────────

function SeasonSummary({ games }: { games: Game[] }) {
  const w = games.filter(g => g.result === 'W').length
  const d = games.filter(g => g.result === 'D').length
  const l = games.filter(g => g.result === 'L').length
  const gf = games.reduce((a, g) => a + g.goalsFor, 0)
  const ga = games.reduce((a, g) => a + g.goalsAgainst, 0)

  // Top scorer
  const scorerMap: Record<string, number> = {}
  games.forEach(g => g.scorers.forEach(s => {
    if (s.player) scorerMap[s.player] = (scorerMap[s.player] || 0) + 1
  }))
  const topScorer = Object.entries(scorerMap).sort((a, b) => b[1] - a[1])[0]

  if (games.length === 0) return null

  return (
    <div className="bg-cream rounded-xl p-5 border border-midnight/8">
      <h2 className="font-semibold text-sm text-midnight mb-3">Spring 2026 Season</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 text-center">
        <div className="bg-white/70 rounded-xl p-3 border border-midnight/5">
          <div className="text-xl font-bold text-green-600">{w}</div>
          <div className="text-[10px] text-midnight/40 uppercase tracking-wider mt-0.5">Wins</div>
        </div>
        <div className="bg-white/70 rounded-xl p-3 border border-midnight/5">
          <div className="text-xl font-bold text-slate-500">{d}</div>
          <div className="text-[10px] text-midnight/40 uppercase tracking-wider mt-0.5">Draws</div>
        </div>
        <div className="bg-white/70 rounded-xl p-3 border border-midnight/5">
          <div className="text-xl font-bold text-red-500">{l}</div>
          <div className="text-[10px] text-midnight/40 uppercase tracking-wider mt-0.5">Losses</div>
        </div>
        <div className="bg-white/70 rounded-xl p-3 border border-midnight/5">
          <div className="text-xl font-bold text-midnight">{gf}–{ga}</div>
          <div className="text-[10px] text-midnight/40 uppercase tracking-wider mt-0.5">Goals</div>
        </div>
        {topScorer && (
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 col-span-3 sm:col-span-1">
            <div className="text-sm font-bold text-amber-700">⚽ {topScorer[1]}</div>
            <div className="text-[10px] text-amber-600 mt-0.5 truncate">{topScorer[0].split(' ')[0]}</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function GameLogPage() {
  const [games, setGames] = useState<Game[]>([])
  const [editing, setEditing] = useState<Game | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { setGames(loadGames()) }, [])

  function persist(updated: Game[]) {
    setGames(updated)
    saveGames(updated)
  }

  function newGame(): Game {
    return {
      id: genId(), date: today(), opponent: '', venue: 'Home',
      goalsFor: 0, goalsAgainst: 0, result: 'D',
      scorers: [], notes: '', attendance: null,
    }
  }

  function startAdd() { setEditing(newGame()); setShowForm(true) }

  function updateEditing(fields: Partial<Game>) {
    setEditing(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...fields }
      // auto-calc result when scores change
      if ('goalsFor' in fields || 'goalsAgainst' in fields) {
        updated.result = calcResult(updated.goalsFor, updated.goalsAgainst)
      }
      return updated
    })
  }

  function addScorer() {
    if (!editing) return
    updateEditing({ scorers: [...editing.scorers, { player: '', assist: '' }] })
  }

  function updateScorer(i: number, field: keyof GameGoal, value: string) {
    if (!editing) return
    const scorers = [...editing.scorers]
    scorers[i] = { ...scorers[i], [field]: value }
    updateEditing({ scorers })
  }

  function removeScorer(i: number) {
    if (!editing) return
    updateEditing({ scorers: editing.scorers.filter((_, idx) => idx !== i) })
  }

  function save() {
    if (!editing || !editing.opponent.trim()) return
    const exists = games.find(g => g.id === editing.id)
    if (exists) {
      persist(games.map(g => g.id === editing.id ? editing : g))
    } else {
      persist([editing, ...games])
    }
    setEditing(null)
    setShowForm(false)
  }

  function editGame(g: Game) { setEditing({ ...g }); setShowForm(true) }

  function deleteGame(id: string) {
    if (!confirm('Delete this game?')) return
    persist(games.filter(g => g.id !== id))
  }

  const sorted = [...games].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <Link href="/workshop/personal/fc-balboa" className="inline-flex items-center gap-2 text-sm text-midnight/40 hover:text-green-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to FC Balboa
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-midnight">Game Log</h1>
          <p className="text-midnight/50 text-sm mt-1">FC Balboa U10 · Spring 2026</p>
        </div>
        {!showForm && (
          <button onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors flex-shrink-0">
            <Plus className="w-4 h-4" /> Log Game
          </button>
        )}
      </div>

      <SeasonSummary games={games} />

      {/* Add/Edit Form */}
      {showForm && editing && (
        <div className="bg-cream rounded-xl border border-ocean/20 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-midnight">{games.find(g => g.id === editing.id) ? 'Edit Game' : 'Log Game'}</h2>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="text-midnight/30 hover:text-midnight">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-midnight/40 block mb-1">Date</label>
              <input type="date" value={editing.date}
                onChange={e => updateEditing({ date: e.target.value })}
                className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs text-midnight/40 block mb-1">Opponent *</label>
              <input type="text" placeholder="e.g. SD United U10" value={editing.opponent}
                onChange={e => updateEditing({ opponent: e.target.value })}
                className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-green-500/50" />
            </div>
            <div>
              <label className="text-xs text-midnight/40 block mb-1">Venue</label>
              <select value={editing.venue}
                onChange={e => updateEditing({ venue: e.target.value as 'Home' | 'Away' | 'Neutral' })}
                className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none bg-white">
                <option>Home</option>
                <option>Away</option>
                <option>Neutral</option>
              </select>
            </div>
          </div>

          {/* Score */}
          <div>
            <label className="text-xs text-midnight/40 block mb-2">Score</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-midnight/10 rounded-xl px-4 py-2">
                <button onClick={() => updateEditing({ goalsFor: Math.max(0, editing.goalsFor - 1) })}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-midnight/5 hover:bg-midnight/10 transition-colors text-midnight/60">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-2xl font-bold text-green-600 w-8 text-center">{editing.goalsFor}</span>
                <button onClick={() => updateEditing({ goalsFor: editing.goalsFor + 1 })}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors text-green-700">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <span className="text-midnight/30 font-bold text-lg">—</span>
              <div className="flex items-center gap-2 bg-white border border-midnight/10 rounded-xl px-4 py-2">
                <button onClick={() => updateEditing({ goalsAgainst: Math.max(0, editing.goalsAgainst - 1) })}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-midnight/5 hover:bg-midnight/10 transition-colors text-midnight/60">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-2xl font-bold text-red-500 w-8 text-center">{editing.goalsAgainst}</span>
                <button onClick={() => updateEditing({ goalsAgainst: editing.goalsAgainst + 1 })}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors text-red-600">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <ResultBadge result={editing.result} />
              <span className="text-xs text-midnight/40">FC Balboa — Opp</span>
            </div>
          </div>

          {/* Goal scorers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-midnight/40">Goal Scorers</label>
              <button onClick={addScorer}
                className="flex items-center gap-1 text-xs text-ocean hover:text-ocean/80 transition-colors">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            {editing.scorers.length === 0 && (
              <p className="text-xs text-midnight/25 italic">No scorers logged yet</p>
            )}
            <div className="space-y-2">
              {editing.scorers.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-midnight/30 w-4 text-right">{i + 1}.</span>
                  <select value={s.player}
                    onChange={e => updateScorer(i, 'player', e.target.value)}
                    className="flex-1 px-2 py-1 border border-midnight/10 rounded-lg text-xs focus:outline-none bg-white">
                    <option value="">— Scorer —</option>
                    {ROSTER.map(p => <option key={p} value={p}>{p}</option>)}
                    <option value="OG">Own Goal</option>
                  </select>
                  <span className="text-xs text-midnight/30">assist:</span>
                  <select value={s.assist}
                    onChange={e => updateScorer(i, 'assist', e.target.value)}
                    className="flex-1 px-2 py-1 border border-midnight/10 rounded-lg text-xs focus:outline-none bg-white">
                    <option value="">— none —</option>
                    {ROSTER.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <button onClick={() => removeScorer(i)} className="text-midnight/20 hover:text-red-400 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-midnight/40 block mb-1">Coach Notes</label>
            <textarea rows={3} placeholder="Highlights, things to work on, standout moments..."
              value={editing.notes}
              onChange={e => updateEditing({ notes: e.target.value })}
              className="w-full px-2 py-1.5 border border-midnight/10 rounded-lg text-sm focus:outline-none focus:border-green-500/50 resize-none" />
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={save}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors">
              <Check className="w-4 h-4" /> Save Game
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null) }}
              className="px-3 py-2 text-midnight/40 hover:text-midnight text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Game list */}
      {sorted.length === 0 && !showForm ? (
        <div className="text-center py-16 border border-dashed border-midnight/15 rounded-2xl">
          <p className="text-4xl mb-3">🏆</p>
          <p className="text-midnight/40 font-medium">No games logged yet</p>
          <p className="text-midnight/25 text-sm mt-1">Hit "Log Game" after each match</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(g => {
            const goalScorers = g.scorers.filter(s => s.player && s.player !== 'OG')
            return (
              <div key={g.id} className="bg-cream rounded-xl border border-midnight/8 overflow-hidden">
                <div className="px-5 py-4 flex items-start gap-3">
                  <ResultBadge result={g.result} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-midnight text-sm">{g.opponent}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        g.venue === 'Home' ? 'bg-green-50 text-green-700' : g.venue === 'Away' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-600'
                      }`}>{g.venue}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-midnight/40 flex-wrap">
                      <span>{formatDate(g.date)}</span>
                      <span className="font-semibold text-midnight">{g.goalsFor}–{g.goalsAgainst}</span>
                    </div>
                    {goalScorers.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {goalScorers.map((s, i) => (
                          <span key={i} className="text-[11px] bg-white border border-midnight/8 rounded-full px-2 py-0.5 text-midnight/60">
                            ⚽ {s.player.split(' ')[0]}{s.assist ? ` (${s.assist.split(' ')[0]})` : ''}
                          </span>
                        ))}
                      </div>
                    )}
                    {g.notes && (
                      <p className="text-xs text-midnight/50 mt-1.5 line-clamp-2">{g.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => editGame(g)}
                      className="p-2 text-midnight/25 hover:text-ocean rounded-lg hover:bg-ocean/5 transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteGame(g.id)}
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

      {games.length > 0 && (
        <div className="text-center pt-2">
          <Link href="/workshop/personal/fc-balboa" className="text-xs text-midnight/30 hover:text-midnight transition-colors">
            ← Back to FC Balboa hub
          </Link>
        </div>
      )}
    </div>
  )
}
