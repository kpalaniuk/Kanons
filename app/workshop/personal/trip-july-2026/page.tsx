'use client'

import { useState } from 'react'
import {
  MapPin, Calendar, Car, Plane, Home, Star,
  ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock, Briefcase,
  Coffee, Users, Heart, Train
} from 'lucide-react'

// ─── Trip Data ───────────────────────────────────────────────────────────────

const STOPS = [
  {
    id: 'iceland',
    name: 'Reykjavik, Iceland',
    emoji: '🧊',
    nights: 2,
    dates: 'Jun 28–30',
    type: 'stopover',
    status: 'open',
    color: 'bg-sky-50 border-sky-200',
    dotColor: 'bg-sky-400',
    who: 'Core family',
    details: "Stopover to ease the time change and add adventure. Kyle has a friend who lives there — possible HomeExchange or crash with him. 2 nights = enough for a geothermal soak, a drive, and a good meal.",
    highlights: ['Time zone buffer', 'Golden Circle / geysers', 'Hot springs & pools', "Kyle's friend is local", 'Midnight sun in June'],
    action: 'Text Kyle\'s friend. Check HomeExchange credits for KEF.',
    accommodation: 'HomeExchange or friend — open',
  },
  {
    id: 'east-lothian',
    name: 'East Lothian, Scotland',
    emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    nights: 11,
    dates: 'Jun 30–Jul 11',
    type: 'home-exchange',
    status: 'pursuing',
    color: 'bg-indigo-50 border-indigo-200',
    dotColor: 'bg-indigo-500',
    who: 'Core family',
    details: 'Scotland home base near Edinburgh — ~10/11 nights (Jun 30 or Jul 1 through Jul 10 or 11, flexible). Settle in, get into a rhythm, Edinburgh day trips, Kyle work days. Paige departs Edinburgh airport July 7 for Athens. Kyle solo with kids July 7–9. Paige returns July 10 — rest day — then the whole family checks out July 11 and drives to Skye.',
    highlights: ['Edinburgh (25 min)', 'Dirleton & Tantallon castles', 'East Lothian beaches', 'Kyle work days', 'Scottish culture soak'],
    action: 'Confirm HX booking (~10 nights, Jun 30/Jul 1 – Jul 10/11).',
    accommodation: 'HomeExchange (pursuing)',
    alert: 'Paige departs Edinburgh airport Jul 7 → Athens (returns Jul 10). Kyle solo Jul 7–9.'
  },
  {
    id: 'skye',
    name: 'Isle of Skye',
    emoji: '🏔️',
    nights: 2,
    dates: 'Jul 11–13 (2 nights)',
    type: 'airbnb',
    status: 'open',
    color: 'bg-emerald-50 border-emerald-200',
    dotColor: 'bg-emerald-500',
    who: 'Core family',
    details: "Drive from East Lothian on Jul 11 (5–6 hrs, leave early, lunch en route). 2 nights in Skye. Then continue to Eagle Bray Jul 13. Need to reach Dublin Jul 16 so Highlands = 4 nights total (Jul 11–14) + transit Jul 15.",
    highlights: ['Old Man of Storr', 'Fairy Pools', 'Neist Point lighthouse', 'Dunvegan Castle', 'Portree village'],
    action: "Check Paige's saved Airbnb listing ASAP. Book soon — July is peak season.",
    accommodation: 'Airbnb (Paige has one saved) or guest house — open',
  },
  {
    id: 'eagle-bray',
    name: 'Eagle Bray Log Cabins',
    emoji: '🪵',
    nights: 2,
    dates: 'Jul 13–15 (2 nights)',
    type: 'cabin',
    status: 'open',
    color: 'bg-amber-50 border-amber-200',
    dotColor: 'bg-amber-500',
    who: 'Core family',
    details: 'Luxury log cabins Paige found — next stop after Isle of Skye. A proper Highland splurge before heading back toward Dublin. Likely hot tubs, forest setting, self-catering. After 2 nights, drive south on Jul 15 and transit to Dublin.',
    highlights: ['Luxury Highland cabin', 'Hot tubs (likely)', 'Forest/mountain setting', 'Self-catering', 'Family-friendly'],
    action: 'Check Jul 13–15 availability: eaglebray.co.uk',
    accommodation: 'Eagle Bray Luxury Log Cabins — open',
  },
  {
    id: 'dublin',
    name: 'Dublin, Ireland',
    emoji: '🍀',
    nights: 4,
    dates: 'Jul 16–20',
    type: 'home-exchange',
    status: 'pursuing',
    color: 'bg-green-50 border-green-200',
    dotColor: 'bg-green-500',
    who: 'Core family + Paige\'s parents',
    details: "HomeExchange Jul 16–20. Drive south from Highlands on Jul 15, fly or ferry to Dublin, check in Jul 16. No car needed in Dublin — great public transport and Hop-On-Hop-Off buses. Richard from Johnsfort confirmed a full week is too much here with young kids; 4 nights is the sweet spot. Paige's parents fly in and join here. Johnsfort collects everyone Monday morning Jul 20.",
    highlights: ['Trinity College & Book of Kells', 'Phoenix Park', 'Hop-On-Hop-Off bus', 'Temple Bar food scene', 'Family-friendly city'],
    action: 'Confirm option with Dublin HX host (Jul 16–20). Coordinate parents\' arrival flights.',
    accommodation: 'HomeExchange (almost confirmed — Jul 16–20)',
    alert: "Paige's parents fly in to join here. Johnsfort collects everyone Jul 20 morning."
  },
  {
    id: 'kells',
    name: 'Johnsfort Farm, near Kells',
    emoji: '🐄',
    nights: 4,
    dates: 'Jul 20–24',
    type: 'farmstay',
    status: 'booked',
    color: 'bg-lime-50 border-lime-300',
    dotColor: 'bg-lime-600',
    who: 'Core family at Johnsfort · Parents at Headfort Arms Hotel',
    details: "Private 4-day curated farm experience. Richard and Bairbre collect from Dublin hotel Monday morning, drop off Friday at Athlone train station (→ Galway) or car rental. Custom questionnaire shapes every day — kid-friendly farm activities, culture, history, foodie stuff for parents. Paige's father has Irish ancestry — Richard will lean into this. Parents stay at The Headfort Arms Hotel in Kells (10 min away) and join tours à la carte.",
    highlights: [
      'Custom itinerary via questionnaire',
      'Farm activities for kids',
      'Private guided tours — no bus crowds',
      'Hill of Tara, Trim Castle, Boyne Valley nearby',
      "Paige's father's Irish heritage exploration",
      'Giants Causeway possible bucket-list day',
      'Breakfast baskets + Tuesday beef stew included',
      'Baking experience (acts as lunch)',
    ],
    action: 'BOOKED ✅ Deposit paid. Answer Johnsfort questionnaire when it arrives.',
    accommodation: 'Bartholomew\'s Loft, Johnsfort (BOOKED ✅) · Parents: The Headfort Arms Hotel, Kells',
    cost: '€4,500 family of 4 · Parents pay à la carte per tour day',
  },
  {
    id: 'galway',
    name: 'Outside Galway',
    emoji: '🎪',
    nights: 6,
    dates: 'Jul 24–30',
    type: 'home-exchange',
    status: 'booked',
    color: 'bg-orange-50 border-orange-200',
    dotColor: 'bg-orange-500',
    who: 'Core family (HX) · Parents: hotel TBD',
    details: "HomeExchange outside Galway — currently 4 nights, extending to 6 to fit the Galway Arts Festival tail end (Jul 13–26), Cliffs of Moher, Aran Islands, and Connemara. Arrive Jul 24 = last 2 days of GIAF. Car rental from Athlone or Dublin airport on Jul 24 gives full flexibility. Parents' Galway accommodation still open — Bairbre recommended Salthill (pool + beach, great for kids) or city centre near Aran Islands ferry.",
    highlights: [
      'Galway Arts Festival — last 2 days (ends Jul 26)',
      'Cliffs of Moher (~1.5 hr south)',
      'Aran Islands — 90 min ferry from Galway',
      'Connemara & Wild Atlantic Way',
      'Galway city food & music scene',
    ],
    action: 'Extend HX booking to Jul 30. Book parents\' Galway hotel (Salthill recommended for kids). Decide car rental plan.',
    accommodation: 'HomeExchange (BOOKED ✅, extending to 6 nights) · Parents: open — Salthill Hotel, Galway Bay Hotel, or Parkhouse Hotel',
    alert: 'Galway Arts Festival: Jul 13–26. Arriving Jul 24 = last 2 days. Extend stay?',
  },
]

// ─── Day Types ────────────────────────────────────────────────────────────────

type DayType = 'transit' | 'explore' | 'chill' | 'work' | 'solo' | 'excursion' | 'festival'

interface TripDay {
  date: string
  label: string
  stopId: string
  type: DayType
  note?: string
  paigeAway?: boolean
  booked?: boolean
}

const DAYS: TripDay[] = [
  { date: 'Jun 28', label: 'Fly SAN → Reykjavik', stopId: 'iceland', type: 'transit' },
  { date: 'Jun 29', label: 'Reykjavik — Golden Circle', stopId: 'iceland', type: 'explore' },
  { date: 'Jun 30', label: 'Fly KEF → Edinburgh, pick up car', stopId: 'east-lothian', type: 'transit' },
  { date: 'Jul 1', label: 'Settle into East Lothian', stopId: 'east-lothian', type: 'chill' },
  { date: 'Jul 2', label: 'Edinburgh explore', stopId: 'east-lothian', type: 'explore' },
  { date: 'Jul 3', label: 'Local / Scottish coast', stopId: 'east-lothian', type: 'explore' },
  { date: 'Jul 4', label: 'Kyle work day', stopId: 'east-lothian', type: 'work' },
  { date: 'Jul 5', label: 'Edinburgh or East Lothian beaches', stopId: 'east-lothian', type: 'explore' },
  { date: 'Jul 6', label: 'Family day — Paige preps for Athens', stopId: 'east-lothian', type: 'chill' },
  { date: 'Jul 7', label: 'Paige flies Edinburgh → Athens', stopId: 'east-lothian', type: 'solo', paigeAway: true, note: "Paige → Athens, Claudia's 40th" },
  { date: 'Jul 8', label: 'Kyle + kids adventure day', stopId: 'east-lothian', type: 'solo', paigeAway: true },
  { date: 'Jul 9', label: 'Kyle + kids local day', stopId: 'east-lothian', type: 'solo', paigeAway: true },
  { date: 'Jul 10', label: 'Paige returns from Athens 🎉', stopId: 'east-lothian', type: 'chill', note: 'Rest day. Pack for Highlands.' },
  { date: 'Jul 11', label: 'Check out East Lothian → Drive to Skye', stopId: 'skye', type: 'transit', note: '5–6 hrs. Leave early, lunch en route.' },
  { date: 'Jul 12', label: 'Isle of Skye — Fairy Pools, Old Man of Storr', stopId: 'skye', type: 'excursion' },
  { date: 'Jul 13', label: 'Skye → Eagle Bray Cabins', stopId: 'eagle-bray', type: 'transit' },
  { date: 'Jul 14', label: 'Eagle Bray — chill, forest, hot tub', stopId: 'eagle-bray', type: 'chill' },
  { date: 'Jul 15', label: 'Drive south → fly/ferry to Dublin', stopId: 'dublin', type: 'transit', note: 'Return Scotland car. Transit to Ireland.' },
  { date: 'Jul 16', label: 'Arrive Dublin — check into HX', stopId: 'dublin', type: 'chill', note: 'Parents fly in separately.' },
  { date: 'Jul 17', label: 'Dublin — Trinity College, Phoenix Park', stopId: 'dublin', type: 'explore' },
  { date: 'Jul 18', label: 'Dublin — Hop-On-Hop-Off, Temple Bar', stopId: 'dublin', type: 'explore' },
  { date: 'Jul 19', label: 'Dublin — chill day, prep for Johnsfort', stopId: 'dublin', type: 'chill' },
  { date: 'Jul 20', label: 'Johnsfort collection from Dublin hotel', stopId: 'kells', type: 'excursion', booked: true, note: 'Richard collects family + parents en route' },
  { date: 'Jul 21', label: 'Johnsfort private tour day 2', stopId: 'kells', type: 'excursion', booked: true },
  { date: 'Jul 22', label: 'Johnsfort private tour day 3', stopId: 'kells', type: 'excursion', booked: true },
  { date: 'Jul 23', label: 'Johnsfort private tour day 4', stopId: 'kells', type: 'excursion', booked: true },
  { date: 'Jul 24', label: 'Johnsfort drop → Athlone or Dublin → Galway', stopId: 'galway', type: 'transit', booked: true, note: 'Pick up car. GIAF starts!' },
  { date: 'Jul 25', label: 'Galway Arts Festival 🎭', stopId: 'galway', type: 'festival', booked: true },
  { date: 'Jul 26', label: 'Galway Arts Festival — final day', stopId: 'galway', type: 'festival', booked: true },
  { date: 'Jul 27', label: 'Galway city + Aran Islands ferry', stopId: 'galway', type: 'excursion', booked: true },
  { date: 'Jul 28', label: 'Cliffs of Moher day trip', stopId: 'galway', type: 'excursion', booked: true },
  { date: 'Jul 29', label: 'Connemara drive / Wild Atlantic Way', stopId: 'galway', type: 'explore', note: 'Extended night ✦' },
  { date: 'Jul 30', label: 'Kyle work day / chill', stopId: 'galway', type: 'work', note: 'Extended night ✦' },
  { date: 'Jul 31', label: 'Drive to Shannon or Dublin airport', stopId: 'galway', type: 'transit' },
  { date: 'Aug 1', label: 'Fly home → land SAN 🏠', stopId: 'galway', type: 'transit' },
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
  booked:    { label: 'Booked ✓', color: 'bg-green-100 text-green-700 border border-green-200' },
  pursuing:  { label: 'Pursuing', color: 'bg-amber-100 text-amber-700 border border-amber-200' },
  open:      { label: 'Open',     color: 'bg-slate-100 text-slate-500 border border-slate-200' },
}

const OPEN_ITEMS = [
  { urgent: true,  text: 'Dublin HX — confirm Jul 16–20 with host (almost done)' },
  { urgent: true,  text: 'Reply to Bairbre: where are parents staying in Galway?' },
  { urgent: true,  text: 'East Lothian HX — confirm 10 nights Jun 30–Jul 10 and book' },
  { urgent: true,  text: "Isle of Skye — check Paige's saved Airbnb Jul 11–12 (2 nights) + book backup" },
  { urgent: true,  text: 'Eagle Bray Cabins — check Jul 13–14 (2 nights) availability: eaglebray.co.uk' },
  { urgent: false, text: 'Galway: extend HX to 6 nights (add Jul 28–30)' },
  { urgent: false, text: 'Galway parents hotel: Salthill (pool/beach for kids) or Parkhouse (ferry access)' },
  { urgent: false, text: 'Iceland: text Kyle\'s friend + check HomeExchange credits for KEF' },
  { urgent: false, text: 'Flights: SAN → KEF → EDI (Chase points, late June window)' },
  { urgent: false, text: 'Scotland → Ireland transit: fly EDI → DUB or ferry?' },
  { urgent: false, text: 'Car rental: Jul 24 from Athlone or Dublin airport → return Shannon or Dublin' },
  { urgent: false, text: 'Return flight: Shannon or Dublin → SAN (Chase points, Jul 31–Aug 4)' },
  { urgent: false, text: 'Meta activities Jul 7–10 near East Lothian (under-7, need alternatives to age 7+ camps)' },
  { urgent: false, text: 'Johnsfort questionnaire: answer it when it arrives to shape itinerary' },
  { urgent: false, text: 'Kyle: share Johnsfort booking confirmation link' },
]

export default function TripPage() {
  const [activeStop, setActiveStop] = useState<string | null>(null)
  const [view, setView] = useState<'route' | 'calendar' | 'open'>('route')

  const totalNights = STOPS.reduce((s, st) => s + st.nights, 0)
  const bookedNights = STOPS.filter(s => s.status === 'booked').reduce((s, st) => s + st.nights, 0)
  const urgentItems = OPEN_ITEMS.filter(i => i.urgent).length

  return (
    <div className="min-h-screen bg-paper py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🗺️</span>
            <h1 className="font-display text-2xl text-midnight">Scotland & Ireland — July 2026</h1>
          </div>
          <p className="text-midnight/50 text-sm">Kyle · Paige · Bohdi · Meta · Paige's parents &nbsp;·&nbsp; ~35 days &nbsp;·&nbsp; johnsfort.ie booked ✅</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Countries', value: '3', sub: 'Iceland · Scotland · Ireland' },
            { label: 'Est. nights', value: `${totalNights}`, sub: `${bookedNights} confirmed` },
            { label: 'Johnsfort', value: '€4,500', sub: 'Deposit paid ✅' },
            { label: 'Open items', value: `${urgentItems} urgent`, sub: `${OPEN_ITEMS.length} total` },
          ].map(s => (
            <div key={s.label} className="bg-cream rounded-2xl p-3 border border-midnight/8">
              <div className="font-display text-lg text-midnight">{s.value}</div>
              <div className="text-xs font-medium text-midnight/60">{s.label}</div>
              <div className="text-xs text-midnight/35 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-2 flex-wrap">
          {([['route', '📍 Route & Stops'], ['calendar', '📅 Day by Day'], ['open', '⚡ Open Items']] as const).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                view === v ? 'bg-midnight text-cream' : 'bg-cream text-midnight/50 hover:text-midnight border border-midnight/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── ROUTE VIEW ── */}
        {view === 'route' && (
          <div className="space-y-2">
            {STOPS.map((stop, i) => {
              const isOpen = activeStop === stop.id
              const badge = STATUS_BADGE[stop.status]
              return (
                <div key={stop.id}>
                  {i > 0 && (
                    <div className="flex items-center gap-2 py-0.5 ml-6">
                      <div className="w-0.5 h-4 bg-midnight/10" />
                      <span className="text-xs text-midnight/25 flex items-center gap-1">
                        {stop.id === 'kells' ? <Train size={9} /> : stop.id === 'dublin' ? <Plane size={9} /> : <Car size={9} />}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setActiveStop(isOpen ? null : stop.id)}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${stop.color} ${isOpen ? 'shadow-md' : 'hover:shadow-sm'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${stop.dotColor}`} />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display text-base text-midnight">{stop.emoji} {stop.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>{badge.label}</span>
                            {stop.alert && <AlertCircle size={13} className="text-red-500" />}
                          </div>
                          <div className="text-xs text-midnight/50 mt-0.5">{stop.dates} · {stop.nights} nights · {stop.who}</div>
                        </div>
                      </div>
                      {isOpen ? <ChevronUp size={15} className="text-midnight/30 mt-1 flex-shrink-0" /> : <ChevronDown size={15} className="text-midnight/30 mt-1 flex-shrink-0" />}
                    </div>

                    {isOpen && (
                      <div className="mt-4 ml-6 space-y-3" onClick={e => e.stopPropagation()}>
                        {stop.alert && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex items-start gap-2">
                            <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                            {stop.alert}
                          </div>
                        )}
                        <p className="text-sm text-midnight/70 leading-relaxed">{stop.details}</p>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-midnight/35 mb-1.5">Highlights</div>
                          <div className="flex flex-wrap gap-1.5">
                            {stop.highlights.map(h => (
                              <span key={h} className="text-xs bg-white/70 border border-midnight/10 px-2 py-1 rounded-lg text-midnight/65">{h}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-midnight/35 mb-1">Accommodation</div>
                          <div className="text-sm text-midnight/65">{stop.accommodation}</div>
                        </div>
                        {'cost' in stop && stop.cost && (
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-midnight/35 mb-1">Cost</div>
                            <div className="text-sm text-midnight/65">{stop.cost}</div>
                          </div>
                        )}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                          <span className="font-semibold">Next action: </span>{stop.action}
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              )
            })}
            <div className="flex items-center gap-2 py-0.5 ml-6">
              <div className="w-0.5 h-4 bg-midnight/10" />
              <Plane size={9} className="text-midnight/25" />
            </div>
            <div className="rounded-2xl border-2 border-midnight/10 bg-cream p-4 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-midnight/25 flex-shrink-0" />
              <div>
                <div className="font-display text-base text-midnight">🏠 San Diego</div>
                <div className="text-xs text-midnight/50 mt-0.5">Jul 31–Aug 4 landing window · Chase Ultimate Rewards · Shannon or Dublin</div>
              </div>
            </div>
          </div>
        )}

        {/* ── CALENDAR VIEW ── */}
        {view === 'calendar' && (
          <div className="space-y-1.5">
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800 flex items-start gap-2">
              <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span><strong>Scotland routing confirmed:</strong> East Lothian Jun 30–Jul 11 → Highlands Jul 11–15 (4-5 nights) → Dublin HX Jul 16. Ireland fixed from Jul 20.</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pb-3">
              {(Object.entries(DAY_STYLES) as [DayType, typeof DAY_STYLES[DayType]][]).map(([type, style]) => (
                <span key={type} className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${style.bg} ${style.text}`}>
                  {style.icon} {style.label}
                </span>
              ))}
              <span className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-600 flex items-center gap-1"><Users size={10} /> Paige away</span>
            </div>
            {DAYS.map((day, i) => {
              const style = DAY_STYLES[day.type]
              const stop = STOPS.find(s => s.id === day.stopId)
              return (
                <div key={i} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border ${
                  day.paigeAway ? 'border-red-200 bg-red-50' : `border-midnight/8 ${style.bg}`
                }`}>
                  <div className="w-12 flex-shrink-0 text-xs font-bold text-midnight/40">{day.date}</div>
                  <div className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md flex-shrink-0 ${style.bg} ${style.text} border border-current/10`}>
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${day.paigeAway ? 'text-red-800' : 'text-midnight'}`}>{day.label}</div>
                    {day.note && <div className="text-xs text-midnight/45 mt-0.5">{day.note}</div>}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {day.paigeAway && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md">Solo</span>}
                    {day.booked && <CheckCircle size={12} className="text-green-500" />}
                    {stop && <span className="text-sm">{stop.emoji}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── OPEN ITEMS VIEW ── */}
        {view === 'open' && (
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="text-sm font-bold text-red-800 mb-2 flex items-center gap-1.5">
                <AlertCircle size={14} /> Urgent — do these first
              </div>
              <ul className="space-y-2">
                {OPEN_ITEMS.filter(i => i.urgent).map((item, idx) => (
                  <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0 font-bold">{idx + 1}.</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-1.5">
                <Clock size={14} /> Research & logistics
              </div>
              <ul className="space-y-2">
                {OPEN_ITEMS.filter(i => !i.urgent).map((item, idx) => (
                  <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0 text-amber-500">○</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
