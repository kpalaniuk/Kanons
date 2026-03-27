'use client'

import { useState, useEffect } from 'react'
import { Wind, Droplets } from 'lucide-react'

// ── WMO Weather Code → emoji + label ────────────────────────────────────────

function getWeatherCondition(code: number): { emoji: string; label: string } {
  if (code === 0)                                    return { emoji: '☀️',  label: 'Clear' }
  if (code <= 3)                                     return { emoji: '🌤️', label: code === 1 ? 'Mostly Clear' : code === 2 ? 'Partly Cloudy' : 'Overcast' }
  if (code === 45 || code === 48)                    return { emoji: '🌫️', label: 'Foggy' }
  if ([51,53,55,61,63,65].includes(code))            return { emoji: '🌧️', label: code <= 55 ? 'Drizzle' : 'Rain' }
  if ([80,81,82].includes(code))                     return { emoji: '🌦️', label: 'Showers' }
  if ([95,96,99].includes(code))                     return { emoji: '⛈️', label: 'Thunderstorm' }
  return { emoji: '🌡️', label: 'Mixed' }
}

function cToF(c: number): number {
  return Math.round(c * 9 / 5 + 32)
}

// ── Types ────────────────────────────────────────────────────────────────────

interface OpenMeteoWeather {
  tempF: number
  highF: number
  lowF: number
  windMph: number
  humidity: number
  rainChance: number
  weatherCode: number
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SanDiegoWeatherCard() {
  const [data, setData] = useState<OpenMeteoWeather | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=32.7331&longitude=-117.1297' +
          '&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m' +
          '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
          '&timezone=America%2FLos_Angeles&forecast_days=1'
        )
        if (!res.ok) throw new Error('Fetch failed')
        const json = await res.json()

        const current = json.current
        const daily = json.daily

        setData({
          tempF: cToF(current.temperature_2m),
          highF: cToF(daily.temperature_2m_max[0]),
          lowF:  cToF(daily.temperature_2m_min[0]),
          windMph: Math.round(current.wind_speed_10m * 0.621371),
          humidity: current.relative_humidity_2m,
          rainChance: daily.precipitation_probability_max[0] ?? 0,
          weatherCode: current.weather_code,
        })
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  const condition = data ? getWeatherCondition(data.weatherCode) : null

  return (
    <div className="bg-midnight rounded-2xl p-5 border border-cream/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">📍</span>
          <h3 className="font-display text-sm text-cream/60 uppercase tracking-wide">San Diego</h3>
        </div>
        <span className="text-xs text-cream/30">Open-Meteo</span>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-cream/30 text-sm animate-pulse">
          <span>Loading weather…</span>
        </div>
      )}

      {error && !loading && (
        <div className="text-cream/30 text-sm">Weather unavailable</div>
      )}

      {data && condition && (
        <div className="space-y-3">
          {/* Main temp + condition */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none">{condition.emoji}</span>
              <div>
                <div className="text-3xl font-display text-cream leading-none">{data.tempF}°F</div>
                <div className="text-xs text-cream/50 mt-0.5">{condition.label}</div>
              </div>
            </div>
            {/* High / Low */}
            <div className="text-right">
              <div className="text-xs font-semibold text-cream/80">
                <span className="text-red-400">{data.highF}°</span>
                {' / '}
                <span className="text-sky-400">{data.lowF}°</span>
              </div>
              <div className="text-[10px] text-cream/30 mt-0.5">High / Low</div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 pt-2 border-t border-cream/10">
            <div className="flex items-center gap-1.5 text-xs text-cream/50">
              <Wind className="w-3.5 h-3.5 text-cream/30" />
              <span>{data.windMph} mph</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-cream/50">
              <Droplets className="w-3.5 h-3.5 text-cream/30" />
              <span>{data.humidity}% humidity</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-cream/50 ml-auto">
              <span>☔</span>
              <span className={data.rainChance >= 50 ? 'text-sky-400 font-semibold' : ''}>
                {data.rainChance}% rain
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
