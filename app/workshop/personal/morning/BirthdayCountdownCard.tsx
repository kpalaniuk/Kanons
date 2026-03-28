'use client'

import { useEffect, useState } from 'react'

interface BirthdayInfo {
  daysUntil: number
  isToday: boolean
  show: boolean
}

function getBirthdayInfo(): BirthdayInfo {
  const now = new Date()
  const year = now.getFullYear()

  // Birthday: April 6 (month 3 in 0-indexed)
  const todayMidnight = new Date(year, now.getMonth(), now.getDate())
  let birthdayMidnight = new Date(year, 3, 6)

  let daysUntil = Math.round(
    (birthdayMidnight.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24)
  )

  // If birthday passed by more than 1 day, roll to next year
  if (daysUntil < -1) {
    birthdayMidnight = new Date(year + 1, 3, 6)
    daysUntil = Math.round(
      (birthdayMidnight.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24)
    )
  }

  const isToday = daysUntil === 0
  // Show within 10 days before (inclusive), on the day, or 1 day after
  const show = daysUntil <= 10 && daysUntil >= -1

  return { daysUntil, isToday, show }
}

export default function BirthdayCountdownCard() {
  const [info, setInfo] = useState<BirthdayInfo | null>(null)

  useEffect(() => {
    setInfo(getBirthdayInfo())
  }, [])

  if (!info || !info.show) return null

  const { daysUntil, isToday } = info
  const isDayAfter = daysUntil === -1
  const isVeryClose = daysUntil <= 3 && daysUntil > 0

  // 🎉 Birthday — celebration card
  if (isToday) {
    return (
      <div className="rounded-2xl p-6 border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 overflow-hidden relative">
        {/* Bouncing confetti decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          {['🎉', '🎊', '✨', '🎈', '🎂', '🥳'].map((e, i) => (
            <span
              key={i}
              className="absolute text-2xl opacity-25 animate-bounce"
              style={{
                left: `${[8, 22, 42, 58, 74, 88][i]}%`,
                top: `${[18, 58, 28, 68, 12, 48][i]}%`,
                animationDelay: `${i * 0.25}s`,
                animationDuration: `${1.4 + i * 0.2}s`,
              }}
            >
              {e}
            </span>
          ))}
        </div>
        <div className="relative z-10">
          <div className="text-3xl mb-2">🎉 🎂 🎉</div>
          <h3 className="font-display text-2xl text-midnight mb-1">Happy Birthday Kyle!</h3>
          <p className="text-sm text-midnight/60">Another year of building cool shit. 🥂</p>
        </div>
      </div>
    )
  }

  // 1 day after — brief warm farewell, then gone
  if (isDayAfter) {
    return (
      <div className="rounded-2xl p-5 border border-amber-200 bg-amber-50">
        <div className="flex items-center gap-3">
          <span className="text-xl">🎂</span>
          <p className="text-sm text-midnight/60">Hope the birthday was great. 🥂</p>
        </div>
      </div>
    )
  }

  // 1–10 days out
  return (
    <div
      className={`rounded-2xl p-5 border-2 ${
        isVeryClose
          ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300'
          : 'bg-amber-50 border-amber-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">🎂</span>
        <div className="flex-1">
          <p
            className={`text-sm font-bold ${
              isVeryClose ? 'text-orange-700' : 'text-amber-800'
            }`}
          >
            Kyle&apos;s birthday in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
          </p>
          <p className="text-xs text-midnight/40 mt-0.5">April 6 🎂</p>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
            isVeryClose
              ? 'bg-orange-100 text-orange-700 border-orange-200'
              : 'bg-amber-100 text-amber-700 border-amber-200'
          }`}
        >
          {daysUntil === 1 ? 'Tomorrow!' : `${daysUntil} days`}
        </span>
      </div>
    </div>
  )
}
