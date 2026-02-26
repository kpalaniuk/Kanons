'use client'

import { useState } from 'react'
import {
  MapPin, Calendar, Car, Plane, Ship, Home, Tent, Star,
  ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock, Briefcase,
  Sun, Coffee, Users, Heart
} from 'lucide-react'

// ─── Trip Data ───────────────────────────────────────────────────────────────

const STOPS = [
  {
    id: 'iceland',
    name: 'Reykjavik, Iceland',
    emoji: '🧊',
    country: 'Iceland',
    nights: 2,
    dates: 'Jun 28–30',
    startDay: 0,
    type: 'stopover',
    status: 'open',
    color: 'bg-sky-100 border-sky-300 text-sky-800',
    dotColor: 'bg-sky-400',
    details: "Stopover to ease the time change. Kyle's friend is local — possible HomeExchange or stay with friend.",
    highlights: ['Time zone buffer', 'Hot springs', 'Midnight sun', "Kyle's friend is local"],
    notes: 'Check HomeExchange credits for KEF. Text the friend.',
    accommodation: 'HomeExchange or friend — TBD',
  },
  {
    id: 'east-lothian-1',
    name: 'East Lothian (Edinburgh area)',
    emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    country: 'Scotland',
    nights: 6,
    dates: 'Jun 30–Jul 6',
    startDay: 2,
    type: 'home-exchange',
    status: 'pursuing',
    color: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    dotColor: 'bg-indigo-500',
    details: 'Home exchange base near Edinburgh. 10-night minimum — negotiating down to 8 total (6 now + 2 return). Great for slow mornings, Edinburgh day trips, and Kyle getting work done.',
    highlights: ['Edinburgh day trips', 'Scottish culture soak', 'Kyle work base', 'Near airport for Paige departure'],
    notes: 'Negotiate HX offer from 10 → 8 nights. Confirm credit balance.',
    accommodation: 'HomeExchange (pursuing)',
    alert: 'Paige departs Jul 7 from Edinburgh airport → Athens'
  },
  {
    id: 'skye',
    name: 'Isle of Skye',
    emoji: '🏔️',
    country: 'Scotland',
    nights: 2,
    dates: 'Jul 12–14',
    startDay: 14,
    type: 'airbnb',
    status: 'open',
    color: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    dotColor: 'bg-emerald-500',
    details: "Drive 5–6 hours from East Lothian. Stop for lunch en route. Paige has an Airbnb saved (need to check availability). Guest houses are a backup.",
    highlights: ['Old Man of Storr', 'Fairy Pools', 'Neist Point lighthouse', 'Dunvegan Castle'],
    notes: "Check Paige's saved Airbnb listing. Book ASAP — July availability is tight.",
    accommodation: 'Airbnb (Paige has one saved) or guest house',
  },
  {
    id: 'eagle-bray',
    name: 'Eagle Bray Log Cabins',
    emoji: '🪵',
    country: 'Scotland',
    nights: 2,
    dates: 'Jul 14–16',
    startDay: 16,
    type: 'cabin',
    status: 'open',
    color: 'bg-amber-100 border-amber-300 text-amber-800',
    dotColor: 'bg-amber-500',
    details: 'Luxury log cabins Paige found during research. After Isle of Skye — a special spot to unwind before heading back south.',
    highlights: ['Luxury self-catering cabins', 'Highland setting', 'Family-friendly', 'Hot tubs likely'],
    notes: 'Check July 14–16 availability at eaglebray.co.uk',
    accommodation: 'Eagle Bray Luxury Log Cabins (open)',
  },
  {
    id: 'east-lothian-2',
    name: 'East Lothian (return)',
    emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    country: 'Scotland',
    nights: 2,
    dates: 'Jul 17–19',
    startDay: 19,
    type: 'home-exchange',
    status: 'pursuing',
    color: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    dotColor: 'bg-indigo-500',
    details: 'Return to East Lothian base to repack and prep for Ireland. Decompression before the transit.',
    highlights: ['Repack', 'Laundry', 'Rest', 'Last Scotland night'],
    notes: 'Same HX booking as Jun 30 – Jul 6.',
    accommodation: 'HomeExchange (same as above)',
  },
  {
    id: 'kells',
    name: 'Kells, Ireland',
    emoji: '🐄',
    country: 'Ireland',
    nights: 4,
    dates: 'Jul 20–24',
    startDay: 22,
    type: 'farmstay',
    status: 'booked',
    color: 'bg-green-100 border-green-300 text-green-800',
    dotColor: 'bg-green-600',
    details: 'Private 4-day curated farmstay experience near Kells, County Meath. Not a regular farm stay — they provide private guides, drive you around, completely custom itinerary for your family. Real, local Ireland experience. This is the vacation centerpiece.',
    highlights: ['Private curated family tours', 'Hill of Tara nearby', 'Trim Castle', 'Book of Kells area', 'Boyne Valley', 'Real Irish farm life'],
    notes: 'BOOKED ✅ Kyle to share website link for details.',
    accommodation: 'Private farmstay (BOOKED)',
  },
  {
    id: 'galway',
    name: 'Outside Galway',
    emoji: '🎪',
    country: 'Ireland',
    nights: 6,
    dates: 'Jul 24–30',
    startDay: 26,
    type: 'home-exchange',
    status: 'booked',
    color: 'bg-orange-100 border-orange-300 text-orange-800',
    dotColor: 'bg-orange-500',
    details: 'HomeExchange outside Galway. Currently 4 nights booked — extend to 6 to catch more of the Galway International Arts Festival (Jul 13–26) and fit in Cliffs of Moher + Aran Islands.',
    highlights: ['Galway Arts Festival (ends Jul 26)', 'Cliffs of Moher (~1.5h)', 'Aran Islands (ferry from Rossaveal)', 'Connemara', 'Wild Atlantic Way', 'Galway city'],
    notes: 'Extend from Jul 28 → Jul 30. Arriving Jul 24 = last 2 days of GIAF.',
    accommodation: 'HomeExchange (BOOKED, extending)',
    alert: 'Galway Arts Festival: Jul 13–26. You arrive Jul 24 — last 2 days.'
  },
]

// ─── Day Types ────────────────────────────────────────────────────────────────

type DayType = 'transit' | 'explore' | 'chill' | 'work' | 'solo' | 'excursion' | 'festival'

interface Day {
  date: string
  label: string
  stop: string
  type: DayType
  note?: string
  paigeAway?: boolean
  booked?: boolean
}

const DAYS: Day[] = [
  { date: 'Jun 28', label: 'Fly SAN → KEF', stop: 'In transit', type: 'transit' },
  { date: 'Jun 29', label: 'Reykjavik', stop: 'iceland', type: 'explore' },
  { date: 'Jun 30', label: 'Fly KEF → EDI, pick up car', stop: 'east-lothian-1', type: 'transit' },
  { date: 'Jul 1', label: 'Settle in East Lothian', stop: 'east-lothian-1', type: 'chill' },
  { date: 'Jul 2', label: 'Edinburgh explore', stop: 'east-lothian-1', type: 'explore' },
  { date: 'Jul 3', label: 'Local / chill', stop: 'east-lothian-1', type: 'chill' },
  { date: 'Jul 4', label: 'Kyle work day', stop: 'east-lothian-1', type: 'work' },
  { date: 'Jul 5', label: 'Edinburgh or coast', stop: 'east-lothian-1', type: 'explore' },
  { date: 'Jul 6', label: 'Paige prep / family day', stop: 'east-lothian-1', type: 'chill' },
  { date: 'Jul 7', label: 'Paige flies to Athens', stop: 'east-lothian-1', type: 'solo', paigeAway: true, note: 'Paige → Athens for Claudia\'s 40th' },
  { date: 'Jul 8', label: 'Kyle + kids adventure', stop: 'east-lothian-1', type: 'solo', paigeAway: true },
  { date: 'Jul 9', label: 'Kyle + kids local', stop: 'east-lothian-1', type: 'solo', paigeAway: true },
  { date: 'Jul 10', label: 'Paige returns from Athens', stop: 'east-lothian-1', type: 'chill', paigeAway: false, note: 'Paige returns!' },
  { date: 'Jul 11', label: 'Recovery / reset day', stop: 'east-lothian-1', type: 'chill' },
  { date: 'Jul 12', label: 'Drive to Isle of Skye', stop: 'skye', type: 'transit', note: '5–6 hr drive, lunch en route' },
  { date: 'Jul 13', label: 'Isle of Skye explore', stop: 'skye', type: 'excursion' },
  { date: 'Jul 14', label: 'Drive Skye → Eagle Bray', stop: 'eagle-bray', type: 'transit' },
  { date: 'Jul 15', label: 'Eagle Bray cabins', stop: 'eagle-bray', type: 'chill' },
  { date: 'Jul 16', label: 'Drive back south', stop: 'east-lothian-2', type: 'transit' },
  { date: 'Jul 17', label: 'East Lothian — repack', stop: 'east-lothian-2', type: 'chill' },
  { date: 'Jul 18', label: 'Kyle work / last Scotland day', stop: 'east-lothian-2', type: 'work' },
  { date: 'Jul 19', label: 'Drive/fly to Ireland', stop: 'kells', type: 'transit', note: 'Return car Scotland, pick up Ireland?' },
  { date: 'Jul 20', label: 'Kells farmstay begins', stop: 'kells', type: 'excursion', booked: true },
  { date: 'Jul 21', label: 'Private farm tour day 2', stop: 'kells', type: 'excursion', booked: true },
  { date: 'Jul 22', label: 'Private farm tour day 3', stop: 'kells', type: 'excursion', booked: true },
  { date: 'Jul 23', label: 'Private farm tour day 4', stop: 'kells', type: 'excursion', booked: true },
  { date: 'Jul 24', label: 'Drive to Galway — Arts Festival!', stop: 'galway', type: 'festival', booked: true, note: 'GIAF last 2 days' },
  { date: 'Jul 25', label: 'Galway Arts Festival final day', stop: 'galway', type: 'festival', booked: true },
  { date: 'Jul 26', label: 'Galway city explore', stop: 'galway', type: 'explore', booked: true },
  { date: 'Jul 27', label: 'Cliffs of Moher day trip', stop: 'galway', type: 'excursion', booked: true },
  { date: 'Jul 28', label: 'Aran Islands ferry', stop: 'galway', type: 'excursion', booked: true },
  { date: 'Jul 29', label: 'Connemara / chill', stop: 'galway', type: 'chill', note: 'Extended night ✦' },
  { date: 'Jul 30', label: 'Drive to airport', stop: 'galway', type: 'transit', note: 'Dublin or Shannon' },
  { date: 'Jul 31', label: 'Fly home', stop: 'In transit', type: 'transit' },
  { date: 'Aug 1', label: 'Land SAN 🏠', stop: 'In transit', type: 'transit' },
]

const DAY_STYLES: Record<DayType, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
  transit:   { bg: 'bg-slate-100',   text: 'text-slate-600',   label: 'Transit',   icon: <Plane size={10} /> },
  explore:   { bg: 'bg-blue-100',    text: 'text-blue-700',    label: 'Explore',   icon: <MapPin size={10} /> },
  chill:     { bg: 'bg-green-100',   text: 'text-green-700',   label: 'Chill',     icon: <Coffee size={10} /> },
  work:      { bg: 'bg-amber-100',   text: 'text-amber-700',   label: 'Work',      icon: <Briefcase size={10} /> },
  solo:      { bg: 'bg-purple-100',  text: 'text-purple-700',  label: 'Kyle solo', icon: <Users size={10} /> },
  excursion: { bg: 'bg-orange-100',  text: 'text-orange-700',  label: 'Excursion', icon: <Star size={10} /> },
  festival:  { bg: 'bg-pink-100',    text: 'text-pink-700',    label: 'Festival',  icon: <Heart size={10} /> },
}

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  booked:    { label: 'Booked ✓', color: 'bg-green-100 text-green-700' },
  pursuing:  { label: 'Pursuing', color: 'bg-amber-100 text-amber-700' },
  open:      { label: 'Open',     color: 'bg-slate-100 text-slate-600' },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TripPage() {
  const [activeStop, setActiveStop] = useState<string | null>(null)
  const [view, setView] = useState<'route' | 'calendar'>('route')

  const totalNights = STOPS.reduce((s, st) => s + st.nights, 0)
  const bookedNights = STOPS.filter(s => s.status === 'booked').reduce((s, st) => s + st.nights, 0)

  return (
    <div className="min-h-screen bg-paper py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🗺️</span>
            <h1 className="font-display text-2xl text-midnight">Scotland & Ireland — July 2026</h1>
          </div>
          <p className="text-midnight/50 text-sm">Kyle · Paige · Bohdi · Meta &nbsp;·&nbsp; ~35 days &nbsp;·&nbsp; {bookedNights} nights booked, {totalNights - bookedNights} to lock</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Countries', value: '3', sub: 'Iceland · Scotland · Ireland' },
            { label: 'Nights', value: `${totalNights}`, sub: `${bookedNights} confirmed` },
            { label: 'Paige solo', value: 'Jul 7–10', sub: '3 nights Athens' },
            { label: 'Return window', value: 'Jul 31–Aug 4', sub: 'Chase points' },
          ].map(s => (
            <div key={s.label} className="bg-cream rounded-2xl p-3 border border-midnight/8">
              <div className="font-display text-lg text-midnight">{s.value}</div>
              <div className="text-xs font-medium text-midnight/60">{s.label}</div>
              <div className="text-xs text-midnight/35 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-2">
          {(['route', 'calendar'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                view === v ? 'bg-midnight text-cream' : 'bg-cream text-midnight/50 hover:text-midnight border border-midnight/10'
              }`}
            >
              {v === 'route' ? '📍 Route & Stops' : '📅 Day by Day'}
            </button>
          ))}
        </div>

        {/* ── ROUTE VIEW ── */}
        {view === 'route' && (
          <div className="space-y-3">
            {STOPS.map((stop, i) => {
              const isOpen = activeStop === stop.id
              const badge = STATUS_BADGE[stop.status]
              return (
                <div key={stop.id}>
                  {/* Connector */}
                  {i > 0 && (
                    <div className="flex items-center gap-2 py-1 px-4 ml-4">
                      <div className="w-0.5 h-5 bg-midnight/10 ml-2" />
                      <span className="text-xs text-midnight/30 flex items-center gap-1">
                        {stop.id === 'east-lothian-2' ? <Car size={10} /> : stop.id === 'kells' ? <Plane size={10} /> : <Car size={10} />}
                        transit
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => setActiveStop(isOpen ? null : stop.id)}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${stop.color} ${isOpen ? 'shadow-md' : 'hover:shadow-sm'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${stop.dotColor}`} />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display text-base text-midnight">{stop.emoji} {stop.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>{badge.label}</span>
                            {stop.alert && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 flex items-center gap-1">
                                <AlertCircle size={9} /> Alert
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-midnight/60 mt-0.5">{stop.dates} &nbsp;·&nbsp; {stop.nights} nights</div>
                        </div>
                      </div>
                      {isOpen ? <ChevronUp size={16} className="text-midnight/40 mt-1 flex-shrink-0" /> : <ChevronDown size={16} className="text-midnight/40 mt-1 flex-shrink-0" />}
                    </div>

                    {isOpen && (
                      <div className="mt-4 ml-6 space-y-3" onClick={e => e.stopPropagation()}>
                        {stop.alert && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex items-start gap-2">
                            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                            {stop.alert}
                          </div>
                        )}
                        <p className="text-sm text-midnight/70 leading-relaxed">{stop.details}</p>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-midnight/40 mb-1.5">Highlights</div>
                          <div className="flex flex-wrap gap-1.5">
                            {stop.highlights.map(h => (
                              <span key={h} className="text-xs bg-white/60 border border-midnight/10 px-2 py-1 rounded-lg text-midnight/70">{h}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-midnight/40 mb-1">Accommodation</div>
                          <div className="text-sm text-midnight/70">{stop.accommodation}</div>
                        </div>
                        {stop.notes && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                            <span className="font-medium">Action: </span>{stop.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              )
            })}

            {/* Return */}
            <div className="flex items-center gap-2 py-1 px-4 ml-4">
              <div className="w-0.5 h-5 bg-midnight/10 ml-2" />
              <span className="text-xs text-midnight/30 flex items-center gap-1"><Plane size={10} /> fly home</span>
            </div>
            <div className="rounded-2xl border-2 border-midnight/10 bg-cream p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-midnight/30 flex-shrink-0" />
                <div>
                  <div className="font-display text-base text-midnight">🏠 San Diego</div>
                  <div className="text-sm text-midnight/60">Jul 31 – Aug 4 landing window &nbsp;·&nbsp; Chase points</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CALENDAR VIEW ── */}
        {view === 'calendar' && (
          <div className="space-y-2">
            {/* Legend */}
            <div className="flex flex-wrap gap-2 pb-2">
              {(Object.entries(DAY_STYLES) as [DayType, typeof DAY_STYLES[DayType]][]).map(([type, style]) => (
                <span key={type} className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${style.bg} ${style.text}`}>
                  {style.icon} {style.label}
                </span>
              ))}
              <span className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-600">👩 Paige away</span>
            </div>

            {DAYS.map((day, i) => {
              const style = DAY_STYLES[day.type]
              const stop = STOPS.find(s => s.id === day.stop)
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border ${
                    day.paigeAway ? 'border-red-200 bg-red-50' : `border-midnight/8 ${style.bg}`
                  }`}
                >
                  <div className="w-14 flex-shrink-0">
                    <div className="text-xs font-bold text-midnight/50">{day.date}</div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md flex-shrink-0 ${style.bg} ${style.text}`}>
                    {style.icon}
                    <span className="hidden sm:inline">{style.label}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${day.paigeAway ? 'text-red-800' : 'text-midnight'}`}>{day.label}</div>
                    {day.note && <div className="text-xs text-midnight/50 mt-0.5">{day.note}</div>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {day.paigeAway && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Solo</span>}
                    {day.booked && <CheckCircle size={13} className="text-green-600" />}
                    {stop && <span className="text-xs">{stop.emoji}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Open items */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-1.5">
            <Clock size={14} /> Still needs to be locked
          </div>
          <ul className="space-y-1">
            {[
              'East Lothian HX — negotiate 10 → 8 nights, confirm booking',
              'Iceland — text friend + check HomeExchange credits for KEF',
              'Isle of Skye — check Paige\'s saved Airbnb + backups (book ASAP)',
              'Eagle Bray Cabins — check Jul 14–16 availability (eaglebray.co.uk)',
              'Galway — extend 2 extra nights (Jul 28–30)',
              'Meta activities Jul 7–10 — find alternatives to age 7+ camps',
              'Scotland → Ireland transit — fly vs ferry decision + car rental plan',
              'Return flight — Dublin or Shannon → SAN on Chase points',
              'Kyle: share Kells farmstay link',
            ].map(item => (
              <li key={item} className="text-xs text-amber-800 flex items-start gap-1.5">
                <span className="mt-0.5 flex-shrink-0">○</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
