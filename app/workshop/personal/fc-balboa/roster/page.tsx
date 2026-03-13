'use client'

import Link from 'next/link'
import { ArrowLeft, Trophy, AlertCircle, CheckCircle2, Users, ClipboardList } from 'lucide-react'

// FC Balboa U10B — Spring 2026 Roster
// Built from Kyle's session on 2026-03-12. Both Blue + White rosters combined into one squad.

interface Player {
  number: number
  name: string
  registered: boolean
  notes?: string
}

const ROSTER: Player[] = [
  { number: 2,  name: 'Bohdan Palaniuk',   registered: false, notes: "Kyle's son — register ASAP" },
  { number: 3,  name: 'Danilo Borunda',    registered: true },
  { number: 4,  name: 'Oliver Neison',     registered: true },
  { number: 5,  name: 'Noah Bendinelli',   registered: true },
  { number: 6,  name: 'Keaton Rempel',     registered: true },
  { number: 7,  name: 'Maddox Short',      registered: true },
  { number: 8,  name: 'Clayton Coder',     registered: true },
  { number: 9,  name: 'Walker Laub',       registered: false, notes: 'Contact family to register' },
  { number: 10, name: 'Benjamin Vela',     registered: true },
  { number: 11, name: 'Declan Cameron',    registered: true },
  { number: 12, name: 'Landon West',       registered: true },
  { number: 13, name: 'Jackson Holleran',  registered: true },
  { number: 14, name: 'Asher Siewert',     registered: true },
  { number: 15, name: 'Oliver Nascimento', registered: true },
  { number: 16, name: 'Isaac Perez-Kimes', registered: true },
  { number: 17, name: 'Dylan Jones',       registered: true },
]

const ADMIN_CHECKLIST = [
  { done: false, task: 'Register Bohdan Palaniuk (#2) for spring season — fcbalboa.byga.net' },
  { done: false, task: 'Contact Walker Laub family to register (#9)' },
  { done: false, task: 'Lock down Jefferson Elementary fields — Wed & Thu 5–6:30pm' },
  { done: false, task: 'Confirm Spring Season schedule with league' },
]

export default function FCBalboaRosterPage() {
  const registered = ROSTER.filter(p => p.registered)
  const unregistered = ROSTER.filter(p => !p.registered)

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">

      {/* Back */}
      <Link
        href="/workshop/personal/fc-balboa"
        className="inline-flex items-center gap-2 text-sm text-midnight/50 hover:text-midnight transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> FC Balboa
      </Link>

      {/* Header */}
      <div className="bg-midnight rounded-2xl p-8 text-cream">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6 text-terracotta" />
          <h1 className="font-display text-3xl text-cream">Spring 2026 Roster</h1>
        </div>
        <p className="text-cream/50 text-sm">FC Balboa U10B · Coach Kyle Palaniuk & Dean Jones</p>
        <div className="mt-6 pt-6 border-t border-cream/10 grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-display text-cream">{ROSTER.length}</div>
            <div className="text-xs text-cream/40 mt-0.5">Total players</div>
          </div>
          <div>
            <div className={`text-2xl font-display ${unregistered.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {unregistered.length}
            </div>
            <div className="text-xs text-cream/40 mt-0.5">Unregistered</div>
          </div>
          <div>
            <div className="text-2xl font-display text-emerald-400">{registered.length}</div>
            <div className="text-xs text-cream/40 mt-0.5">Registered</div>
          </div>
        </div>
      </div>

      {/* Unregistered Alert */}
      {unregistered.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-red-700">Registration Required</h2>
          </div>
          <div className="space-y-2">
            {unregistered.map(p => (
              <div key={p.number} className="flex items-start gap-3 bg-white/80 rounded-xl px-4 py-3 border border-red-100">
                <span className="text-xs font-bold text-red-400 bg-red-50 border border-red-200 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {p.number}
                </span>
                <div>
                  <p className="text-sm font-semibold text-midnight">{p.name}</p>
                  {p.notes && <p className="text-xs text-red-500 mt-0.5">{p.notes}</p>}
                </div>
              </div>
            ))}
          </div>
          <a
            href="https://fcbalboa.byga.net"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors"
          >
            Register at fcbalboa.byga.net →
          </a>
        </div>
      )}

      {/* Full Roster */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-midnight/40" />
          <h2 className="font-display text-xl text-midnight">Full Roster</h2>
        </div>
        <div className="space-y-2">
          {ROSTER.map(player => (
            <div
              key={player.number}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${
                !player.registered
                  ? 'bg-red-50 border-red-100'
                  : 'bg-cream border-midnight/5'
              }`}
            >
              {/* Jersey number */}
              <span className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 ${
                !player.registered
                  ? 'bg-red-100 text-red-600 border border-red-200'
                  : 'bg-midnight/5 text-midnight/60'
              }`}>
                {player.number}
              </span>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${!player.registered ? 'text-red-800' : 'text-midnight'}`}>
                  {player.name}
                  {player.name === 'Bohdan Palaniuk' && (
                    <span className="ml-2 text-xs text-terracotta font-semibold">⭐ Coach&apos;s son</span>
                  )}
                </p>
                {player.notes && (
                  <p className="text-xs text-red-500 mt-0.5">{player.notes}</p>
                )}
              </div>

              {/* Status */}
              {player.registered ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Admin Checklist */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <ClipboardList className="w-5 h-5 text-midnight/40" />
          <h2 className="font-display text-xl text-midnight">Admin Checklist</h2>
        </div>
        <div className="space-y-2">
          {ADMIN_CHECKLIST.map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${
                item.done
                  ? 'bg-emerald-50 border-emerald-100'
                  : 'bg-cream border-midnight/5'
              }`}
            >
              <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                item.done
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-midnight/20'
              }`}>
                {item.done && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              <p className={`text-sm ${item.done ? 'text-emerald-700 line-through' : 'text-midnight/70'}`}>
                {item.task}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Info */}
      <div className="bg-gradient-to-br from-terracotta/10 to-amber-50 rounded-2xl p-6 border border-terracotta/20">
        <h2 className="font-display text-lg text-midnight mb-3">Practice Schedule</h2>
        <div className="space-y-2 text-sm text-midnight/70">
          <div className="flex gap-3">
            <span className="font-semibold text-midnight w-24 flex-shrink-0">Wednesday</span>
            <span>5:00 – 6:30 PM · Jefferson Elementary</span>
          </div>
          <div className="flex gap-3">
            <span className="font-semibold text-midnight w-24 flex-shrink-0">Thursday</span>
            <span>5:00 – 6:30 PM · Jefferson Elementary</span>
          </div>
        </div>
        <p className="text-xs text-midnight/40 mt-3">Co-coach: Dean Jones (from England)</p>
      </div>

      <div className="text-center text-xs text-midnight/30">
        Roster confirmed March 12, 2026 · 16 players · No #1
      </div>
    </div>
  )
}
