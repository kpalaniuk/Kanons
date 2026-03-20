'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Printer, CheckSquare, Square, Trophy, RotateCcw } from 'lucide-react'

const ROSTER = [
  { number: 2,  name: 'Bohdan Palaniuk' },
  { number: 3,  name: 'Danilo Borunda' },
  { number: 4,  name: 'Oliver Neison' },
  { number: 5,  name: 'Noah Bendinelli' },
  { number: 6,  name: 'Keaton Rempel' },
  { number: 7,  name: 'Maddox Short' },
  { number: 8,  name: 'Clayton Coder' },
  { number: 9,  name: 'Walker Laub' },
  { number: 10, name: 'Benjamin Vela' },
  { number: 11, name: 'Declan Cameron' },
  { number: 12, name: 'Landon West' },
  { number: 13, name: 'Jackson Holleran' },
  { number: 14, name: 'Asher Siewert' },
  { number: 15, name: 'Oliver Nascimento' },
  { number: 16, name: 'Isaac Perez-Kimes' },
  { number: 17, name: 'Dylan Jones' },
]

function getTodayStr() {
  const d = new Date()
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function getDateInputDefault() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default function AttendancePage() {
  const [date, setDate] = useState(getDateInputDefault())
  const [practiceType, setPracticeType] = useState<'Practice' | 'Game'>('Practice')
  const [notes, setNotes] = useState('')
  const [attendance, setAttendance] = useState<Record<number, 'present' | 'absent' | 'late' | null>>(
    Object.fromEntries(ROSTER.map(p => [p.number, null]))
  )
  const printRef = useRef<HTMLDivElement>(null)

  const toggle = (number: number) => {
    setAttendance(prev => {
      const current = prev[number]
      const next = current === null ? 'present' : current === 'present' ? 'absent' : current === 'absent' ? 'late' : null
      return { ...prev, [number]: next }
    })
  }

  const markAll = (status: 'present' | null) => {
    setAttendance(Object.fromEntries(ROSTER.map(p => [p.number, status])))
  }

  const present = ROSTER.filter(p => attendance[p.number] === 'present').length
  const absent  = ROSTER.filter(p => attendance[p.number] === 'absent').length
  const late    = ROSTER.filter(p => attendance[p.number] === 'late').length
  const unknown = ROSTER.filter(p => attendance[p.number] === null).length

  const displayDate = date
    ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : getTodayStr()

  const statusStyle = (s: 'present' | 'absent' | 'late' | null) => {
    if (s === 'present') return 'bg-emerald-100 text-emerald-700 border-emerald-300'
    if (s === 'absent')  return 'bg-red-100 text-red-600 border-red-300'
    if (s === 'late')    return 'bg-amber-100 text-amber-700 border-amber-300'
    return 'bg-sand text-midnight/30 border-midnight/15'
  }

  const statusLabel = (s: 'present' | 'absent' | 'late' | null) => {
    if (s === 'present') return '✓ Present'
    if (s === 'absent')  return '✗ Absent'
    if (s === 'late')    return '~ Late'
    return '— —'
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">

      {/* Back */}
      <Link href="/workshop/personal/fc-balboa" className="inline-flex items-center gap-2 text-sm text-midnight/50 hover:text-midnight transition-colors">
        <ArrowLeft className="w-4 h-4" /> FC Balboa
      </Link>

      {/* Header */}
      <div className="bg-midnight rounded-2xl p-6 text-cream">
        <div className="flex items-center gap-3 mb-1">
          <Trophy className="w-5 h-5 text-terracotta" />
          <h1 className="font-display text-2xl text-cream">Attendance Sheet</h1>
        </div>
        <p className="text-cream/50 text-sm">FC Balboa U10B · Coach Kyle & Dean</p>
        <div className="mt-4 grid grid-cols-4 gap-3 text-center">
          <div><div className="text-xl font-display text-emerald-400">{present}</div><div className="text-xs text-cream/40">Present</div></div>
          <div><div className="text-xl font-display text-red-400">{absent}</div><div className="text-xs text-cream/40">Absent</div></div>
          <div><div className="text-xl font-display text-amber-400">{late}</div><div className="text-xs text-cream/40">Late</div></div>
          <div><div className="text-xl font-display text-cream/40">{unknown}</div><div className="text-xs text-cream/40">Unknown</div></div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-cream border border-midnight/10 rounded-2xl p-4 space-y-3">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[160px]">
            <label className="text-xs text-midnight/40 font-medium block mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-midnight/15 rounded-xl px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-ocean/30"
            />
          </div>
          <div>
            <label className="text-xs text-midnight/40 font-medium block mb-1">Type</label>
            <div className="flex gap-1">
              {(['Practice', 'Game'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setPracticeType(t)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${practiceType === t ? 'bg-midnight text-cream border-midnight' : 'bg-white text-midnight/50 border-midnight/15 hover:border-midnight/30'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs text-midnight/40 font-medium block mb-1">Coach Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Focus areas, observations, weather, location..."
            rows={2}
            className="w-full border border-midnight/15 rounded-xl px-3 py-2 text-sm text-midnight bg-white focus:outline-none focus:ring-2 focus:ring-ocean/30 resize-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => markAll('present')} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors">
            <CheckSquare size={12} /> Mark All Present
          </button>
          <button onClick={() => markAll(null)} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-sand text-midnight/50 border border-midnight/15 rounded-lg hover:bg-midnight/5 transition-colors">
            <RotateCcw size={12} /> Reset
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-ocean text-white border border-ocean rounded-lg hover:bg-ocean/90 transition-colors ml-auto"
          >
            <Printer size={12} /> Print Sheet
          </button>
        </div>
      </div>

      {/* Roster list */}
      <div ref={printRef} className="bg-cream border border-midnight/10 rounded-2xl overflow-hidden">
        {/* Print header — only visible when printing */}
        <div className="hidden print:block p-6 border-b border-midnight/10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-display text-2xl text-midnight">FC Balboa U10B</h2>
              <p className="text-sm text-midnight/60 mt-0.5">{practiceType} — {displayDate}</p>
            </div>
            <div className="text-right text-sm text-midnight/50">
              <div>Coach: Kyle Palaniuk &amp; Dean Jones</div>
              <div>Jefferson Elementary</div>
            </div>
          </div>
          {notes && <p className="mt-3 text-sm text-midnight/60 bg-sand rounded-xl px-3 py-2">Notes: {notes}</p>}
        </div>

        <div className="p-2">
          {ROSTER.map((player, i) => {
            const status = attendance[player.number]
            return (
              <button
                key={player.number}
                onClick={() => toggle(player.number)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 border transition-all text-left ${statusStyle(status)}`}
              >
                <span className="text-xs font-bold w-6 text-center opacity-50">#{player.number}</span>
                <span className="flex-1 font-medium text-sm">{player.name}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-lg border bg-white/50">
                  {statusLabel(status)}
                </span>
                {/* Print checkbox area */}
                <div className="hidden print:flex gap-4 ml-4">
                  <span className="text-xs">P □</span>
                  <span className="text-xs">A □</span>
                  <span className="text-xs">L □</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Print footer */}
        <div className="hidden print:block p-4 border-t border-midnight/10">
          <div className="flex justify-between text-xs text-midnight/40">
            <span>Total: {ROSTER.length} players</span>
            <span>Present: ___ / Absent: ___ / Late: ___</span>
          </div>
        </div>
      </div>

      {/* Tap hint */}
      <p className="text-xs text-center text-midnight/30">Tap a player to cycle: Present → Absent → Late → Clear</p>

    </div>
  )
}
