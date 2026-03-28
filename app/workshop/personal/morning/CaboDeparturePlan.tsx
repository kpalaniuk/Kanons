'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'

interface PlanItem {
  id: string
  label: string
  urgent?: boolean
  externalUrl?: string
}

interface PlanDay {
  label: string
  emoji: string
  date: string // YYYY-MM-DD
  items: PlanItem[]
}

const PLAN: PlanDay[] = [
  {
    label: 'D-2 — Today',
    emoji: '⏳',
    date: '2026-03-28',
    items: [
      { id: 'd2-rental', label: 'Book rental car (justasklaura.com.mx)', urgent: true, externalUrl: 'https://justasklaura.com.mx' },
      { id: 'd2-bank', label: 'Notify bank — international travel (Mexico)', urgent: true },
      { id: 'd2-exchange-details', label: 'Review HomeExchange host notes (Destrie Long +18016648906)' },
      { id: 'd2-solaris', label: 'Confirm Royal Solaris Apr 4–6 (BOOQ34929)' },
      { id: 'd2-pack-start', label: 'Start packing — pull out bags tonight' },
      { id: 'd2-kids', label: 'Car seats / boosters — locate + load' },
      { id: 'd2-ipads', label: 'Charge iPads + headphones (×2) for flight' },
    ],
  },
  {
    label: 'D-1 — Sunday',
    emoji: '🌅',
    date: '2026-03-29',
    items: [
      { id: 'd1-checkin', label: 'Alaska check-in opens (24h before) — conf YAKQHZ', urgent: true, externalUrl: 'https://www.alaskaair.com/check-in' },
      { id: 'd1-docs', label: 'Passports in bag — all 4' },
      { id: 'd1-pesos', label: 'Cash: pesos + USD' },
      { id: 'd1-snacks', label: 'Pack plane snacks for Bohdi + Meta' },
      { id: 'd1-chargers', label: 'Chargers, adapters, power bank' },
      { id: 'd1-sunscreen', label: 'Sunscreen SPF 50+ + reef-safe for HomeExchange' },
      { id: 'd1-meds', label: 'Meds: prescriptions + OTC' },
      { id: 'd1-bags', label: 'Bags packed + weighed (50 lb limit)' },
    ],
  },
  {
    label: 'D-Day — Monday',
    emoji: '✈️',
    date: '2026-03-30',
    items: [
      { id: 'd0-passports', label: 'Final passport check — everyone has theirs' },
      { id: 'd0-airport', label: 'Head to SAN — SJD via Alaska (YAKQHZ)' },
      { id: 'd0-carseats', label: 'Car seats loaded in vehicle' },
      { id: 'd0-exchange-keys', label: 'HomeExchange key pickup plan confirmed w/ Destrie' },
      { id: 'd0-phone', label: 'International data plan on (or download offline maps)' },
      { id: 'd0-enjoy', label: '🌊 Enjoy Cabo. You earned this.' },
    ],
  },
]

export default function CaboDeparturePlan() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cabo-departure-plan-2026')
      if (raw) setChecked(JSON.parse(raw))
    } catch {}
  }, [])

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    try { localStorage.setItem('cabo-departure-plan-2026', JSON.stringify(next)) } catch {}
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const departDate = new Date('2026-03-30T00:00:00')
  const daysLeft = Math.ceil((departDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysLeft < 0 || daysLeft > 3) return null

  const todayStr = today.toISOString().slice(0, 10)

  const activeDays = PLAN.filter(day => {
    const d = new Date(day.date + 'T00:00:00')
    d.setHours(0, 0, 0, 0)
    return d >= today
  })

  return (
    <div className={`rounded-2xl p-5 border-2 ${daysLeft <= 1 ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-300' : 'bg-gradient-to-br from-sky-50 to-cyan-50 border-sky-300'}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">✈️</span>
        <div>
          <h3 className="text-sm font-bold text-midnight">
            Cabo Departure Plan{' '}
            <span className={`ml-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
              daysLeft === 0 ? 'bg-red-100 text-red-700 border-red-200' :
              daysLeft === 1 ? 'bg-orange-100 text-orange-700 border-orange-200' :
              'bg-sky-100 text-sky-700 border-sky-200'
            }`}>
              {daysLeft === 0 ? "Today's the day! 🎉" : daysLeft === 1 ? '1 day left' : `${daysLeft} days out`}
            </span>
          </h3>
          <p className="text-xs text-midnight/40">SAN → SJD · Alaska YAKQHZ · Mar 30</p>
        </div>
      </div>

      <div className="space-y-5">
        {activeDays.map((day) => {
          const isToday = day.date === todayStr
          const dayComplete = day.items.every(i => checked[i.id])
          return (
            <div key={day.date}>
              <div className={`flex items-center gap-2 mb-2 ${isToday ? 'text-midnight' : 'text-midnight/50'}`}>
                <span className="text-base">{day.emoji}</span>
                <span className={`text-xs font-bold uppercase tracking-wide ${isToday ? 'text-midnight' : 'text-midnight/40'}`}>{day.label}</span>
                {dayComplete && <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">✓ Done</span>}
              </div>
              <ul className="space-y-1.5">
                {day.items.map(item => (
                  <li key={item.id}>
                    <label className={`flex items-start gap-2 cursor-pointer group ${!isToday && !checked[item.id] ? 'opacity-50' : ''}`}>
                      <button
                        type="button"
                        onClick={() => toggle(item.id)}
                        className="shrink-0 mt-0.5"
                        aria-label={checked[item.id] ? 'Uncheck' : 'Check'}
                      >
                        {checked[item.id]
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          : <Circle className={`w-4 h-4 ${item.urgent && isToday ? 'text-red-400' : 'text-midnight/25'}`} />
                        }
                      </button>
                      <span className={`text-xs leading-snug ${
                        checked[item.id] ? 'line-through text-midnight/30' :
                        item.urgent && isToday ? 'text-red-700 font-semibold' :
                        'text-midnight/80 group-hover:text-midnight'
                      }`}>
                        {item.externalUrl && !checked[item.id] ? (
                          <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:no-underline" onClick={e => e.stopPropagation()}>
                            {item.label}
                          </a>
                        ) : item.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
