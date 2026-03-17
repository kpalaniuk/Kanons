'use client'

import { useState } from 'react'
import { Plane, Car, Home, AlertCircle, CheckCircle, ExternalLink, MapPin } from 'lucide-react'
import Link from 'next/link'

const DAYS = [
  { date: 'Mon Mar 30', label: 'Fly SAN → SJD · Arrive 2:48 PM', icon: '✈️', note: 'AS 1414 nonstop. Pick up rental car at airport. Check in to accommodation.' },
  { date: 'Tue Mar 31', label: 'First full day in Cabo', icon: '🌊', note: 'Settle in, beach, explore.' },
  { date: 'Wed Apr 1',  label: 'Explore', icon: '🐟', note: '' },
  { date: 'Thu Apr 2',  label: 'Explore', icon: '🌮', note: '' },
  { date: 'Fri Apr 3',  label: 'Explore', icon: '🏖️', note: '' },
  { date: 'Sat Apr 4',  label: 'Explore', icon: '🎉', note: '' },
  { date: 'Sun Apr 5',  label: 'Last night — near SJD airport', icon: '🏨', note: 'Check in to airport hotel for easy morning departure.' },
  { date: 'Mon Apr 6',  label: 'Fly home 🎂', icon: '✈️', note: "AS 547. Departs 10:40 AM → SAN 1:06 PM. Kyle's birthday!" },
]

const OPEN_ITEMS = [
  { done: false, urgent: true,  text: 'Rental car — Mar 30–Apr 6. 4x4, good AC, fits 4. Pick up/drop off SJD.' },
  { done: false, urgent: true,  text: 'Main accommodation — Mar 30–Apr 5 (6 nights). HomeExchange or hotel.' },
  { done: false, urgent: true,  text: 'Airport hotel — Apr 5 night near SJD, shuttle included.' },
  { done: true,  urgent: false, text: 'Flights booked — AS 1414 out (Mar 30) + AS 547 return (Apr 6). Conf: YAKQHZ.' },
]

export default function CaboTripPage() {
  const [view, setView] = useState<'overview' | 'days' | 'open'>('overview')

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

        {/* Header */}
        <div className="text-center pt-4 pb-2">
          <div className="text-5xl mb-3">🌵</div>
          <h1 className="font-display text-3xl text-[#f8f7f4]">Cabo Spring Break</h1>
          <p className="text-[#f8f7f4]/50 text-sm mt-1">March 30 – April 6, 2026 · Family of 4</p>
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            <span className="text-xs bg-green-900/50 text-green-300 border border-green-700/40 px-3 py-1 rounded-full">✈️ Flights Booked</span>
            <span className="text-xs bg-amber-900/50 text-amber-300 border border-amber-700/40 px-3 py-1 rounded-full">🚗 Car Needed</span>
            <span className="text-xs bg-amber-900/50 text-amber-300 border border-amber-700/40 px-3 py-1 rounded-full">🏨 Hotel Needed</span>
          </div>
        </div>

        {/* Flight Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#f8f7f4]/5 border border-[#f8f7f4]/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Plane size={14} className="text-[#0066FF]" />
              <span className="text-xs text-[#f8f7f4]/50 font-medium uppercase tracking-wide">Outbound</span>
            </div>
            <div className="text-[#f8f7f4] font-display text-base">SAN → SJD</div>
            <div className="text-[#f8f7f4]/60 text-xs mt-1">Mon Mar 30 · 12:25 PM</div>
            <div className="text-[#f8f7f4]/40 text-xs">AS 1414 · Nonstop · 2h 23m</div>
            <div className="text-green-400 text-xs mt-2 font-medium">✓ Conf: YAKQHZ</div>
          </div>
          <div className="bg-[#f8f7f4]/5 border border-[#f8f7f4]/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Plane size={14} className="text-[#0066FF] rotate-180" />
              <span className="text-xs text-[#f8f7f4]/50 font-medium uppercase tracking-wide">Return</span>
            </div>
            <div className="text-[#f8f7f4] font-display text-base">SJD → SAN</div>
            <div className="text-[#f8f7f4]/60 text-xs mt-1">Mon Apr 6 · 10:40 AM 🎂</div>
            <div className="text-[#f8f7f4]/40 text-xs">AS 547 · Nonstop · 2h 26m</div>
            <div className="text-green-400 text-xs mt-2 font-medium">✓ Conf: YAKQHZ</div>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="flex gap-1 bg-[#f8f7f4]/5 rounded-xl p-1">
          {(['overview','days','open'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${view === v ? 'bg-[#f8f7f4] text-[#0a0a0a]' : 'text-[#f8f7f4]/50 hover:text-[#f8f7f4]'}`}>
              {v === 'overview' ? '📋 Overview' : v === 'days' ? '📅 Days' : '⚡ Open'}
            </button>
          ))}
        </div>

        {/* Overview */}
        {view === 'overview' && (
          <div className="space-y-3">
            {/* Rental Car */}
            <div className="bg-amber-900/20 border border-amber-700/40 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Car size={16} className="text-amber-400" />
                <span className="font-semibold text-amber-300">Rental Car</span>
                <span className="ml-auto text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Needed</span>
              </div>
              <p className="text-[#f8f7f4]/60 text-sm mb-3">Mar 30 (2:48 PM) → Apr 6 (by 9 AM) · SJD Airport · 4x4, good AC, seats 4</p>
              <div className="flex flex-wrap gap-2">
                <a href="https://www.discovercars.com/cabo-san-lucas-airport" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium bg-amber-500 text-[#0a0a0a] px-3 py-1.5 rounded-lg hover:bg-amber-400 transition-colors">
                  Discover Cars <ExternalLink size={10} />
                </a>
                <a href="https://www.google.com/travel/explore?dest=Cabo+San+Lucas&type=car&pickup=2026-03-30&dropoff=2026-04-06" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium bg-[#f8f7f4]/10 text-[#f8f7f4]/70 border border-[#f8f7f4]/15 px-3 py-1.5 rounded-lg hover:border-amber-500/40 transition-colors">
                  Google Travel <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Accommodation */}
            <div className="bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Home size={16} className="text-[#0066FF]" />
                <span className="font-semibold text-[#f8f7f4]">Accommodation</span>
                <span className="ml-auto text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Needed</span>
              </div>
              <div className="space-y-2 text-sm text-[#f8f7f4]/60">
                <p>📅 <span className="text-[#f8f7f4]/80">Mar 30 – Apr 5</span> (6 nights) — main stay, Cabo area</p>
                <p>🏨 <span className="text-[#f8f7f4]/80">Apr 5 night</span> — airport hotel near SJD, shuttle for early morning</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <a href="https://www.homeexchange.com/s#search?destination=Cabo+San+Lucas&guests=4" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium bg-[#0066FF] text-white px-3 py-1.5 rounded-lg hover:bg-[#0066FF]/80 transition-colors">
                  HomeExchange <ExternalLink size={10} />
                </a>
                <a href="https://www.airbnb.com/s/Cabo-San-Lucas/homes?checkin=2026-03-30&checkout=2026-04-05&adults=2&children=2" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium bg-[#f8f7f4]/10 text-[#f8f7f4]/70 border border-[#f8f7f4]/15 px-3 py-1.5 rounded-lg hover:border-[#0066FF]/40 transition-colors">
                  Airbnb <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Flight details */}
            <div className="bg-[#f8f7f4]/5 border border-[#f8f7f4]/10 rounded-2xl p-4 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={14} className="text-green-400" />
                <span className="font-semibold text-[#f8f7f4]">Flights — Booked</span>
              </div>
              <div className="text-[#f8f7f4]/50 space-y-1 text-xs">
                <p>Alaska Airlines · Conf: <span className="text-[#f8f7f4]/80 font-mono">YAKQHZ</span></p>
                <p>4 passengers (Kyle, Paige, Bohdi, Meta) · Premium seats</p>
                <p>Paid: 120k Alaska miles + $663.12</p>
              </div>
            </div>
          </div>
        )}

        {/* Days */}
        {view === 'days' && (
          <div className="space-y-2">
            {DAYS.map((day, i) => (
              <div key={i} className="bg-[#f8f7f4]/5 border border-[#f8f7f4]/10 rounded-xl px-4 py-3 flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{day.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-xs text-[#f8f7f4]/40 font-medium">{day.date}</span>
                    <span className="text-sm text-[#f8f7f4]/80">{day.label}</span>
                  </div>
                  {day.note && <p className="text-xs text-[#f8f7f4]/40 mt-0.5">{day.note}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Open items */}
        {view === 'open' && (
          <div className="space-y-2">
            {OPEN_ITEMS.map((item, i) => (
              <div key={i} className={`rounded-xl px-4 py-3 flex items-start gap-3 border ${item.done ? 'bg-[#f8f7f4]/3 border-[#f8f7f4]/8 opacity-60' : item.urgent ? 'bg-amber-900/20 border-amber-700/40' : 'bg-[#f8f7f4]/5 border-[#f8f7f4]/10'}`}>
                {item.done
                  ? <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                  : <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                }
                <p className={`text-sm ${item.done ? 'text-[#f8f7f4]/40 line-through' : 'text-[#f8f7f4]/80'}`}>{item.text}</p>
              </div>
            ))}
          </div>
        )}

        <div className="pb-8" />
      </div>
    </div>
  )
}
