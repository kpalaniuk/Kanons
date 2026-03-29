'use client'

import { useState, useEffect } from 'react'

interface WeatherDay {
  date: string
  maxC: number
  minC: number
  code: number
}

function wmoEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2) return '🌤️'
  if (code <= 3) return '☁️'
  if (code <= 49) return '🌫️'
  if (code <= 67) return '🌧️'
  if (code <= 82) return '🌦️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}

function toF(c: number): number {
  return Math.round(c * 9 / 5 + 32)
}

const CABO_ACTIVITIES = [
  { emoji: '🤿', label: 'Snorkel at Pelican Rock' },
  { emoji: '🌅', label: 'Sunrise walk on the beach' },
  { emoji: '🍹', label: 'Poolside with Paige' },
  { emoji: '⛵', label: 'Boat tour to El Arco' },
  { emoji: '🐠', label: 'Fish taco lunch in town' },
  { emoji: '🌊', label: 'Lover\'s Beach day' },
  { emoji: '🎭', label: 'Medano Beach with the kids' },
  { emoji: '🌮', label: 'La Lupita for street tacos' },
]

export default function CaboVacationCard() {
  const [forecast, setForecast] = useState<WeatherDay[] | null>(null)
  const [loading, setLoading] = useState(false)

  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  const caboStart = new Date('2026-03-30T00:00:00')
  const caboEnd = new Date('2026-04-07T00:00:00') // return Apr 6, hide Apr 7+

  // Only show March 30 – April 6
  if (today < caboStart || today >= caboEnd) return null

  const dayNum = Math.floor((today.getTime() - caboStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const totalDays = 8
  const daysLeft = totalDays - dayNum

  // Key reminders while in Cabo
  const reminders = [
    {
      date: '2026-04-04',
      label: 'Check out of HomeExchange — move to Royal Solaris (BOOQ34929)',
      emoji: '🏨',
      urgent: true,
    },
    {
      date: '2026-04-06',
      label: 'Return flight: SJD → SAN · Alaska YAKQHZ',
      emoji: '✈️',
      urgent: false,
    },
  ].filter(r => {
    const d = new Date(r.date + 'T00:00:00')
    d.setHours(0, 0, 0, 0)
    return d >= today
  })

  const todayStr = today.toISOString().slice(0, 10)
  const todayReminders = reminders.filter(r => r.date === todayStr)
  const upcomingReminders = reminders.filter(r => r.date !== todayStr)

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true)
      try {
        // Los Cabos coordinates
        const endDate = '2026-04-06'
        const startDate = today.toISOString().slice(0, 10)
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=22.89&longitude=-109.92&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America%2FDenver&start_date=${startDate}&end_date=${endDate}`
        )
        if (res.ok) {
          const data = await res.json()
          if (data.daily?.time) {
            const f: WeatherDay[] = data.daily.time.map((date: string, i: number) => ({
              date,
              maxC: Math.round(data.daily.temperature_2m_max[i]),
              minC: Math.round(data.daily.temperature_2m_min[i]),
              code: data.daily.weather_code[i],
            }))
            setForecast(f)
          }
        }
      } catch {}
      setLoading(false)
    }
    fetchForecast()
  }, [])

  const activity = CABO_ACTIVITIES[(dayNum - 1) % CABO_ACTIVITIES.length]
  const todayForecast = forecast?.find(f => f.date === todayStr)

  return (
    <div className="rounded-2xl border-2 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)', borderColor: '#38bdf8' }}>
      
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🌊</span>
              <h3 className="text-base font-bold text-sky-900">You're in Cabo!</h3>
              <span className="text-xs bg-sky-600 text-white px-2 py-0.5 rounded-full font-semibold">
                Day {dayNum} of {totalDays}
              </span>
            </div>
            <p className="text-xs text-sky-700 font-medium">
              Los Cabos, Baja California Sur · Mar 30 – Apr 6
            </p>
          </div>
          {daysLeft > 0 && (
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-sky-900">{daysLeft}</div>
              <div className="text-[10px] text-sky-600 font-medium">days left</div>
            </div>
          )}
          {daysLeft === 0 && (
            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-sky-900">Last day! ✈️</div>
              <div className="text-[10px] text-sky-600">Safe travels home</div>
            </div>
          )}
        </div>
      </div>

      {/* Today's weather + activity */}
      <div className="mx-5 mb-3 bg-white/50 rounded-xl px-4 py-3 flex items-center gap-3">
        {todayForecast ? (
          <>
            <span className="text-2xl">{wmoEmoji(todayForecast.code)}</span>
            <div>
              <div className="text-sm font-bold text-sky-900">
                {toF(todayForecast.maxC)}° / {toF(todayForecast.minC)}°F today
              </div>
              <div className="text-xs text-sky-600">Los Cabos forecast</div>
            </div>
          </>
        ) : loading ? (
          <div className="text-xs text-sky-600">Loading weather…</div>
        ) : (
          <span className="text-xl">☀️</span>
        )}
        <div className="ml-auto flex items-center gap-2 bg-sky-100 rounded-lg px-3 py-2">
          <span className="text-base">{activity.emoji}</span>
          <span className="text-xs font-medium text-sky-800">{activity.label}</span>
        </div>
      </div>

      {/* Forecast strip */}
      {forecast && forecast.length > 0 && (
        <div className="mx-5 mb-3">
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {forecast.map((day) => {
              const d = new Date(day.date + 'T12:00:00')
              const isToday = day.date === todayStr
              const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })
              return (
                <div key={day.date}
                  className={`flex flex-col items-center gap-0.5 min-w-[52px] rounded-xl px-2 py-2 text-center ${
                    isToday ? 'bg-sky-600 text-white' : 'bg-white/50 text-sky-900'
                  }`}
                >
                  <span className={`text-[10px] font-medium ${isToday ? 'text-sky-100' : 'text-sky-600'}`}>{label}</span>
                  <span className="text-sm leading-none">{wmoEmoji(day.code)}</span>
                  <span className="text-xs font-bold">{toF(day.maxC)}°</span>
                  <span className={`text-[10px] ${isToday ? 'text-sky-200' : 'text-sky-500'}`}>{toF(day.minC)}°</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Today's reminders */}
      {todayReminders.length > 0 && (
        <div className="mx-5 mb-3 space-y-2">
          {todayReminders.map((r) => (
            <div key={r.date} className={`flex items-start gap-2 rounded-xl px-3 py-2.5 border ${r.urgent ? 'bg-red-50 border-red-200' : 'bg-white/70 border-sky-200'}`}>
              <span className="text-base shrink-0">{r.emoji}</span>
              <p className={`text-xs font-semibold ${r.urgent ? 'text-red-700' : 'text-sky-800'}`}>{r.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming reminders */}
      {upcomingReminders.length > 0 && (
        <div className="mx-5 mb-4 space-y-1.5">
          <p className="text-[10px] font-semibold text-sky-600 uppercase tracking-wide">Coming up</p>
          {upcomingReminders.map((r) => {
            const d = new Date(r.date + 'T00:00:00')
            d.setHours(0, 0, 0, 0)
            const dDiff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            return (
              <div key={r.date} className="flex items-center gap-2 bg-white/40 rounded-lg px-3 py-2">
                <span className="text-sm shrink-0">{r.emoji}</span>
                <p className="text-xs text-sky-800 flex-1">{r.label}</p>
                <span className="text-[10px] text-sky-500 font-medium shrink-0">in {dDiff}d</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer */}
      <div className="px-5 pb-4 text-center">
        <p className="text-xs text-sky-600 italic">
          {daysLeft > 1
            ? 'Leave the mortgage stuff for later. You\'re with your people. 🌊'
            : daysLeft === 1
            ? 'Last full day. Squeeze every drop out of it. 🌅'
            : 'Safe travels home, Palaniuks. What a trip. ✈️'}
        </p>
      </div>
    </div>
  )
}
