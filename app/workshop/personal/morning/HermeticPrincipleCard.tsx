'use client'

import { useEffect, useState } from 'react'

// The Seven Hermetic Principles — from The Kybalion
const PRINCIPLES = [
  {
    number: 1,
    name: 'Mentalism',
    axiom: 'The All is Mind; the Universe is Mental.',
    reflection: 'What story are you running today? Your reality is a projection of your inner state. Adjust the lens.',
    color: { bg: 'from-violet-50 to-purple-50', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-700 border-violet-200', accent: 'text-violet-700' },
    emoji: '🧠',
  },
  {
    number: 2,
    name: 'Correspondence',
    axiom: 'As above, so below; as below, so above.',
    reflection: 'Where in your life do patterns repeat at different scales? The macro reflects the micro — and vice versa.',
    color: { bg: 'from-sky-50 to-cyan-50', border: 'border-sky-200', badge: 'bg-sky-100 text-sky-700 border-sky-200', accent: 'text-sky-700' },
    emoji: '🪞',
  },
  {
    number: 3,
    name: 'Vibration',
    axiom: 'Nothing rests; everything moves; everything vibrates.',
    reflection: 'What frequency are you transmitting right now? Energy is contagious — what are you adding to the field?',
    color: { bg: 'from-amber-50 to-yellow-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700 border-amber-200', accent: 'text-amber-700' },
    emoji: '〰️',
  },
  {
    number: 4,
    name: 'Polarity',
    axiom: 'Everything is dual; everything has poles.',
    reflection: 'The thing you resist most — what is its opposite teaching you? Both ends of the spectrum are part of the same thing.',
    color: { bg: 'from-slate-50 to-zinc-50', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-700 border-slate-200', accent: 'text-slate-700' },
    emoji: '⚖️',
  },
  {
    number: 5,
    name: 'Rhythm',
    axiom: 'Everything flows, out and in; everything has its tides.',
    reflection: 'Are you in an ebb or a flow right now? Neither is permanent. Trust the tide — don\'t fight it.',
    color: { bg: 'from-teal-50 to-emerald-50', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-700 border-teal-200', accent: 'text-teal-700' },
    emoji: '🌊',
  },
  {
    number: 6,
    name: 'Cause & Effect',
    axiom: 'Every cause has its effect; every effect has its cause.',
    reflection: 'What seeds are you planting with today\'s actions? What harvest are yesterday\'s choices delivering right now?',
    color: { bg: 'from-orange-50 to-red-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700 border-orange-200', accent: 'text-orange-700' },
    emoji: '🎯',
  },
  {
    number: 7,
    name: 'Gender',
    axiom: 'Gender is in everything; everything has its Masculine and Feminine principles.',
    reflection: 'Where do you need more receptivity today (yin), and where does action need to be taken (yang)?',
    color: { bg: 'from-pink-50 to-rose-50', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700 border-pink-200', accent: 'text-pink-700' },
    emoji: '☯️',
  },
]

function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export default function HermeticPrincipleCard() {
  const [expanded, setExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const principle = PRINCIPLES[getDayOfYear() % 7]
  const { color } = principle

  return (
    <div
      className={`rounded-2xl border-2 bg-gradient-to-br ${color.bg} ${color.border} overflow-hidden`}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-start gap-4 p-5 text-left"
        aria-expanded={expanded}
      >
        {/* Principle number badge */}
        <div className={`shrink-0 w-9 h-9 rounded-xl border text-sm font-bold flex items-center justify-center ${color.badge}`}>
          {principle.number}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base leading-none">{principle.emoji}</span>
            <span className={`text-xs font-bold uppercase tracking-widest ${color.accent}`}>
              Principle {principle.number} of 7
            </span>
          </div>
          <h3 className="font-display text-lg text-midnight mt-0.5">{principle.name}</h3>
          <p className="text-sm text-midnight/50 italic mt-0.5 leading-snug">
            &ldquo;{principle.axiom}&rdquo;
          </p>
        </div>

        <span className="text-midnight/25 text-sm shrink-0 mt-1">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-0">
          <div className="border-t border-midnight/10 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-midnight/30 mb-2">
              Today&apos;s Reflection
            </p>
            <p className="text-sm text-midnight/70 leading-relaxed">
              {principle.reflection}
            </p>
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <a
                href="https://t.me/kybalion_oracle_bot"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border ${color.badge} hover:opacity-80 transition-opacity`}
              >
                🔮 Kybalion Oracle →
              </a>
              <span className="text-xs text-midnight/25">
                Cycles through all 7 · Day {getDayOfYear() % 7 === 0 ? 7 : getDayOfYear() % 7} of 7
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
