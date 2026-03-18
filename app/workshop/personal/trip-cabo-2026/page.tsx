'use client'

import { useState } from 'react'
import { Plane, Car, Home, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'

const DAYS = [
  { date: 'Mon Mar 30', label: 'Fly SAN → SJD · Arrive 2:48 PM', icon: '✈️', note: 'AS 1414 nonstop. Pick up rental car at airport. Check in to HomeExchange at Cerritos/Pescadero.' },
  { date: 'Tue Mar 31', label: 'First full day', icon: '🌊', note: 'Cerritos Beach. Settle in, surf, explore Pescadero.' },
  { date: 'Wed Apr 1',  label: 'Explore', icon: '🐟', note: 'Day trip options: Todos Santos, La Paz, or beach day.' },
  { date: 'Thu Apr 2',  label: 'Explore', icon: '🌮', note: '' },
  { date: 'Fri Apr 3',  label: 'Explore', icon: '🏖️', note: '' },
  { date: 'Sat Apr 4',  label: 'Explore', icon: '🎉', note: '' },
  { date: 'Sun Apr 5',  label: 'Check out → Airport hotel', icon: '🏨', note: 'Check out of HomeExchange. Head to SJD area. Hotel near airport for easy morning departure.' },
  { date: 'Mon Apr 6',  label: 'Fly home 🎂', icon: '✈️', note: "AS 547. Departs 10:40 AM → SAN 1:06 PM. Kyle's birthday!" },
]

const OPEN_ITEMS = [
  { done: false, urgent: true,  text: 'Rental car — choose from Laura\'s options (see Overview). Reply to cars@justasklaura.com.mx.' },
  { done: false, urgent: true,  text: 'Airport hotel — Apr 5 night near SJD. Need shuttle or close to airport for 10:40 AM flight.' },
  { done: true,  urgent: false, text: 'Main accommodation — HomeExchange confirmed (Destrie Long, Pescadero/Cerritos, Mar 30–Apr 5, Exchange #118502653).' },
  { done: true,  urgent: false, text: 'Flights booked — AS 1414 out (Mar 30) + AS 547 return (Apr 6). Conf: YAKQHZ.' },
]

export default function CaboTripPage() {
  const [view, setView] = useState<'overview' | 'days' | 'open'>('overview')

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="text-center pt-2 pb-1">
        <div className="text-5xl mb-3">🌵</div>
        <h1 className="font-display text-3xl text-midnight">Cabo Spring Break</h1>
        <p className="text-midnight/50 text-sm mt-1">March 30 – April 6, 2026 · Family of 4</p>
        <div className="flex justify-center gap-2 mt-3 flex-wrap">
          <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-medium">✈️ Flights Booked</span>
          <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-medium">🏠 HX Confirmed</span>
          <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full font-medium">🚗 Car Needed</span>
          <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full font-medium">🏨 Airport Hotel Needed</span>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-cream border border-midnight/8 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Plane size={14} className="text-ocean" />
            <span className="text-xs text-midnight/40 font-medium uppercase tracking-wide">Outbound</span>
          </div>
          <div className="text-midnight font-display text-base">SAN → SJD</div>
          <div className="text-midnight/60 text-xs mt-1">Mon Mar 30 · 12:25 PM</div>
          <div className="text-midnight/40 text-xs">AS 1414 · Nonstop · 2h 23m</div>
          <div className="text-emerald-600 text-xs mt-2 font-medium">✓ Conf: YAKQHZ</div>
        </div>
        <div className="bg-cream border border-midnight/8 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Plane size={14} className="text-ocean rotate-180" />
            <span className="text-xs text-midnight/40 font-medium uppercase tracking-wide">Return</span>
          </div>
          <div className="text-midnight font-display text-base">SJD → SAN</div>
          <div className="text-midnight/60 text-xs mt-1">Mon Apr 6 · 10:40 AM 🎂</div>
          <div className="text-midnight/40 text-xs">AS 547 · Nonstop · 2h 26m</div>
          <div className="text-emerald-600 text-xs mt-2 font-medium">✓ Conf: YAKQHZ</div>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="flex gap-1 bg-midnight/5 rounded-xl p-1">
        {(['overview','days','open'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-cream text-midnight shadow-sm' : 'text-midnight/50 hover:text-midnight'}`}>
            {v === 'overview' ? '📋 Overview' : v === 'days' ? '📅 Days' : '⚡ Open'}
          </button>
        ))}
      </div>

      {/* Overview */}
      {view === 'overview' && (
        <div className="space-y-3">

          {/* HomeExchange — CONFIRMED */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Home size={16} className="text-emerald-600" />
              <span className="font-semibold text-emerald-800">HomeExchange — Confirmed ✓</span>
            </div>
            <div className="space-y-1 text-sm text-midnight/70 mb-3">
              <p>📅 <span className="text-midnight font-medium">Mar 30 – Apr 5</span> (6 nights) · Non-reciprocal · 1,344 GP</p>
              <p>📍 <span className="text-midnight font-medium">Cerritos / Pescadero, BCS</span> — Vista Sol 6 Cerritos 2358</p>
              <p>👤 <span className="text-midnight font-medium">Destrie Long</span> · destrie.jensen@gmail.com</p>
              <p>📞 <span className="text-midnight font-medium font-mono">+1 801 664 8906</span></p>
              <p className="text-midnight/40 text-xs">Exchange #118502653</p>
            </div>
            <a href="https://www.homeexchange.com/en/stay/118502653" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
              View on HomeExchange <ExternalLink size={10} />
            </a>
          </div>

          {/* Airport Hotel — NEEDED */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Home size={16} className="text-amber-600" />
              <span className="font-semibold text-midnight">Airport Hotel — Apr 5 night</span>
              <span className="ml-auto text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">Needed</span>
            </div>
            <p className="text-midnight/60 text-sm mb-3">1 night near SJD. Flight departs Apr 6 at 10:40 AM — want easy morning. Shuttle or walkable preferred.</p>
            <div className="flex flex-wrap gap-2">
              <a href="https://www.hotelaeropuertoloscabos.com/en" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors">
                Hotel Aeropuerto Los Cabos <ExternalLink size={10} />
              </a>
              <a href="https://www.booking.com/airport/mx/sjd.html" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium bg-midnight/8 text-midnight/70 border border-midnight/10 px-3 py-1.5 rounded-lg hover:border-amber-400 transition-colors">
                Booking.com near SJD <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {/* Rental Car */}
          <div className="bg-cream border border-midnight/8 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Car size={16} className="text-ocean" />
              <span className="font-semibold text-midnight">Rental Car — Options from Laura</span>
              <span className="ml-auto text-xs bg-ocean/10 text-ocean px-2 py-0.5 rounded-full font-medium">Choose One</span>
            </div>
            <p className="text-midnight/40 text-xs mb-3">Mar 30 2:48 PM → Apr 6 by 9 AM · SJD pickup/dropoff · Reply to cars@justasklaura.com.mx</p>
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between bg-midnight/4 rounded-xl px-3 py-2.5">
                <div>
                  <p className="text-sm text-midnight font-medium">2014 Jeep Compass <span className="text-midnight/40 font-normal">"Silver"</span></p>
                  <p className="text-xs text-midnight/40">4x4 · ~12 years old</p>
                </div>
                <span className="text-ocean font-semibold text-sm">$275/wk</span>
              </div>
              <div className="flex items-center justify-between bg-midnight/4 rounded-xl px-3 py-2.5">
                <div>
                  <p className="text-sm text-midnight font-medium">2012 Jeep Wrangler <span className="text-midnight/40 font-normal">"Shadow"</span></p>
                  <p className="text-xs text-midnight/40">4x4 · ~14 years old · Good for Cerritos beach</p>
                </div>
                <span className="text-ocean font-semibold text-sm">$350/wk</span>
              </div>
              <div className="flex items-center justify-between bg-midnight/4 rounded-xl px-3 py-2.5">
                <div>
                  <p className="text-sm text-midnight font-medium">2011 GMC Yukon <span className="text-midnight/40 font-normal">"Apple"</span></p>
                  <p className="text-xs text-midnight/40">4x4 · ~15 years old · Most room for 4</p>
                </div>
                <span className="text-ocean font-semibold text-sm">$350/wk</span>
              </div>
            </div>
            <a href="mailto:cars@justasklaura.com.mx"
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-ocean text-white px-3 py-1.5 rounded-lg hover:bg-ocean/90 transition-colors">
              Email Laura <ExternalLink size={10} />
            </a>
          </div>

          {/* Flights */}
          <div className="bg-cream border border-midnight/8 rounded-2xl p-4 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={14} className="text-emerald-500" />
              <span className="font-semibold text-midnight">Flights — Booked</span>
            </div>
            <div className="text-midnight/50 space-y-1 text-xs">
              <p>Alaska Airlines · Conf: <span className="text-midnight font-mono font-medium">YAKQHZ</span></p>
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
            <div key={i} className="bg-cream border border-midnight/8 rounded-xl px-4 py-3 flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">{day.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs text-midnight/40 font-medium">{day.date}</span>
                  <span className="text-sm text-midnight">{day.label}</span>
                </div>
                {day.note && <p className="text-xs text-midnight/50 mt-0.5">{day.note}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Open items */}
      {view === 'open' && (
        <div className="space-y-2">
          {OPEN_ITEMS.map((item, i) => (
            <div key={i} className={`rounded-xl px-4 py-3 flex items-start gap-3 border ${item.done ? 'bg-midnight/3 border-midnight/8 opacity-60' : item.urgent ? 'bg-amber-50 border-amber-200' : 'bg-cream border-midnight/8'}`}>
              {item.done
                ? <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                : <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              }
              <p className={`text-sm ${item.done ? 'text-midnight/40 line-through' : 'text-midnight'}`}>{item.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="pb-8" />
    </div>
  )
}
