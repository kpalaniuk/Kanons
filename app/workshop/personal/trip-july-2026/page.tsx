'use client'

import { useState } from 'react'
import {
  MapPin, Plane, Car, Star, ChevronDown, ChevronUp,
  AlertCircle, CheckCircle, Clock, Briefcase, Coffee, Users, Heart, Train, Moon, ExternalLink
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type DayType = 'transit' | 'explore' | 'chill' | 'work' | 'solo' | 'excursion' | 'festival'

interface TripDay {
  date: string
  label: string
  sleep: string       // where you sleep THAT NIGHT
  sleepIcon?: string  // emoji for the sleep location
  stopId: string
  type: DayType
  note?: string
  paigeAway?: boolean
  booked?: boolean
}

// ─── Day-by-day ───────────────────────────────────────────────────────────────

const DAYS: TripDay[] = [
  // ICELAND
  { date: 'Jun 28', label: 'Fly SAN → Reykjavik', sleep: 'Reykjavik, Iceland', sleepIcon: '🧊', stopId: 'iceland', type: 'transit' },
  { date: 'Jun 29', label: 'Iceland — Golden Circle, hot springs', sleep: 'Reykjavik, Iceland', sleepIcon: '🧊', stopId: 'iceland', type: 'explore' },

  // SCOTLAND — EAST LOTHIAN
  { date: 'Jun 30', label: 'Fly KEF → Edinburgh, pick up car', sleep: 'East Lothian HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'east-lothian', type: 'transit' },
  { date: 'Jul 1',  label: 'Settle into East Lothian base', sleep: 'East Lothian HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'east-lothian', type: 'chill' },
  { date: 'Jul 2',  label: 'Edinburgh explore', sleep: 'East Lothian HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'east-lothian', type: 'explore' },
  { date: 'Jul 3',  label: 'East Lothian coast / castles', sleep: 'East Lothian HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'east-lothian', type: 'explore' },
  { date: 'Jul 4',  label: 'Kyle work day', sleep: 'East Lothian HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'east-lothian', type: 'work' },
  { date: 'Jul 5',  label: 'Edinburgh or North Berwick beach', sleep: 'East Lothian HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'east-lothian', type: 'explore' },
  { date: 'Jul 6',  label: 'Family day — Paige preps for Athens', sleep: 'East Lothian HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'east-lothian', type: 'chill' },
  { date: 'Jul 7',  label: 'Paige flies Edinburgh → Athens', sleep: 'East Lothian HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'east-lothian', type: 'solo', paigeAway: true, note: "Paige → Athens, Claudia's 40th" },
  { date: 'Jul 8',  label: 'Kyle + kids adventure', sleep: 'East Lothian HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'east-lothian', type: 'solo', paigeAway: true },
  { date: 'Jul 9',  label: 'Kyle + kids local day', sleep: 'East Lothian HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'east-lothian', type: 'solo', paigeAway: true },
  { date: 'Jul 10', label: 'Paige returns 🎉 Rest + pack for Highlands', sleep: 'East Lothian HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'east-lothian', type: 'chill', note: 'Paige returns from Athens' },

  // HIGHLANDS — SKYE
  { date: 'Jul 11', label: 'Check out East Lothian → Drive to Skye (5-6 hrs)', sleep: 'Isle of Skye', sleepIcon: '🏔️', stopId: 'skye', type: 'transit', note: 'Leave early, lunch en route' },
  { date: 'Jul 12', label: 'Isle of Skye — Fairy Pools, Old Man of Storr', sleep: 'Isle of Skye', sleepIcon: '🏔️', stopId: 'skye', type: 'excursion' },

  // HIGHLANDS — EAGLE BRAY
  { date: 'Jul 13', label: 'Skye → Eagle Brae Luxury Cabins', sleep: 'Eagle Brae Cabins', sleepIcon: '🪵', stopId: 'eagle-bray', type: 'transit' },
  { date: 'Jul 14', label: 'Eagle Brae — forest, hot tub, chill', sleep: 'Eagle Brae Cabins', sleepIcon: '🪵', stopId: 'eagle-bray', type: 'chill' },

  // TRANSIT — EDINBURGH AIRPORT HOTEL
  { date: 'Jul 15', label: 'Drive south → Edinburgh airport hotel', sleep: 'Hotel, Edinburgh Airport', sleepIcon: '✈️', stopId: 'edinburgh-hotel', type: 'transit', note: 'Return Scotland car. Early flight to Dublin tomorrow.' },

  // IRELAND — DUBLIN
  { date: 'Jul 16', label: 'Fly Edinburgh → Dublin. Check into HX.', sleep: 'Dublin HX', sleepIcon: '🍀', stopId: 'dublin', type: 'transit', note: 'Parents fly in separately' },
  { date: 'Jul 17', label: 'Dublin — Trinity College, Phoenix Park', sleep: 'Dublin HX', sleepIcon: '🍀', stopId: 'dublin', type: 'explore' },
  { date: 'Jul 18', label: 'Dublin — Hop-On-Hop-Off, Temple Bar', sleep: 'Dublin HX', sleepIcon: '🍀', stopId: 'dublin', type: 'explore' },
  { date: 'Jul 19', label: 'Dublin — chill, prep for Johnsfort', sleep: 'Dublin HX', sleepIcon: '🍀', stopId: 'dublin', type: 'chill' },

  // KELLS — JOHNSFORT
  { date: 'Jul 20', label: 'Johnsfort pickup from Dublin. Farm day 1.', sleep: 'Johnsfort, Kells', sleepIcon: '🐄', stopId: 'kells', type: 'excursion', booked: true, note: 'Richard collects family + parents from hotel' },
  { date: 'Jul 21', label: 'Johnsfort private tour day 2', sleep: 'Johnsfort, Kells', sleepIcon: '🐄', stopId: 'kells', type: 'excursion', booked: true },
  { date: 'Jul 22', label: 'Johnsfort private tour day 3', sleep: 'Johnsfort, Kells', sleepIcon: '🐄', stopId: 'kells', type: 'excursion', booked: true },
  { date: 'Jul 23', label: 'Johnsfort private tour day 4', sleep: 'Johnsfort, Kells', sleepIcon: '🐄', stopId: 'kells', type: 'excursion', booked: true },

  // GALWAY
  { date: 'Jul 24', label: 'Johnsfort drop → pick up car → Galway', sleep: 'Galway HX', sleepIcon: '🎪', stopId: 'galway', type: 'transit', booked: true, note: 'Galway Arts Festival — last 2 days!' },
  { date: 'Jul 25', label: 'Galway Arts Festival 🎭', sleep: 'Galway HX', sleepIcon: '🎪', stopId: 'galway', type: 'festival', booked: true },
  { date: 'Jul 26', label: 'Galway Arts Festival — final day', sleep: 'Galway HX', sleepIcon: '🎪', stopId: 'galway', type: 'festival', booked: true },
  { date: 'Jul 27', label: 'Aran Islands — 90 min ferry', sleep: 'Galway HX', sleepIcon: '🎪', stopId: 'galway', type: 'excursion', booked: true },
  { date: 'Jul 28', label: 'Cliffs of Moher day trip (~1.5 hrs)', sleep: 'Galway HX', sleepIcon: '🎪', stopId: 'galway', type: 'excursion', booked: true },
  { date: 'Jul 29', label: 'Connemara / Wild Atlantic Way', sleep: 'Galway HX', sleepIcon: '🎪', stopId: 'galway', type: 'explore', note: 'Flexible — may check out today or tomorrow' },

  // KILKENNY
  { date: 'Jul 30', label: 'Drive Galway → Kilkenny (~2.5 hrs)', sleep: 'Kilkenny', sleepIcon: '🏰', stopId: 'kilkenny', type: 'transit', note: 'Medieval city, Kilkenny Castle' },
  { date: 'Jul 31', label: 'Kilkenny — castle, old city, pubs', sleep: 'Kilkenny', sleepIcon: '🏰', stopId: 'kilkenny', type: 'explore' },

  // FLY HOME
  { date: 'Aug 1',  label: 'Drive Kilkenny → Dublin (~1.5 hrs). Fly home.', sleep: 'In flight → SAN', sleepIcon: '✈️', stopId: 'home', type: 'transit', note: 'Return car at Dublin airport' },
  { date: 'Aug 2',  label: 'Land San Diego 🏠', sleep: 'Home, San Diego', sleepIcon: '🏠', stopId: 'home', type: 'chill' },
]

// ─── Stops ────────────────────────────────────────────────────────────────────

const STOPS = [
  {
    id: 'iceland', name: 'Reykjavik, Iceland', emoji: '🧊', nights: 2, dates: 'Jun 28–30',
    status: 'open', color: 'bg-sky-50 border-sky-200', dotColor: 'bg-sky-400', who: 'Core family',
    details: "Stopover — time zone buffer + adventure. Kyle has a friend who lives there. 2 nights is enough for the Golden Circle, a geothermal soak, and landing rested.",
    highlights: ['Golden Circle / geysers', 'Blue Lagoon / hot pools', 'Midnight sun', "Kyle's friend local"],
    action: 'Text Kyle\'s friend. Check HomeExchange credits for KEF.',
    accommodation: 'HomeExchange or friend — open',
  },
  {
    id: 'east-lothian', name: 'East Lothian, Scotland', emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', nights: 11, dates: 'Jun 30–Jul 11',
    status: 'pursuing', color: 'bg-indigo-50 border-indigo-200', dotColor: 'bg-indigo-500', who: 'Core family',
    details: 'Scotland home base near Edinburgh — ~11 nights. Paige departs Edinburgh airport Jul 7 for Athens (Claudia\'s 40th). Kyle solo with kids Jul 7–9. Paige returns Jul 10, rest day. Check out Jul 11 and drive to Skye.',
    highlights: ['Edinburgh city (25 min)', 'North Berwick beach', 'Tantallon Castle', 'Kyle work days', 'Scottish culture soak'],
    action: 'Confirm HomeExchange booking Jun 30–Jul 11.',
    accommodation: 'HomeExchange (pursuing)',
    alert: 'Paige departs Edinburgh airport Jul 7 → Athens. Returns Jul 10. Kyle solo Jul 7–9.'
  },
  {
    id: 'skye', name: 'Isle of Skye', emoji: '🏔️', nights: 2, dates: 'Jul 11–13',
    status: 'open', color: 'bg-emerald-50 border-emerald-200', dotColor: 'bg-emerald-500', who: 'Core family',
    details: '5–6 hour drive from East Lothian. Leave early Jul 11, stop for lunch en route. 2 nights. Paige has an Airbnb saved — check availability immediately.',
    highlights: ['Old Man of Storr', 'Fairy Pools', 'Neist Point lighthouse', 'Dunvegan Castle', 'Portree village'],
    action: "Check Paige's saved Airbnb for Jul 11–12. Book fast — July peak season.",
    accommodation: 'Airbnb (Paige has one saved) or guest house — open',
  },
  {
    id: 'eagle-bray', name: 'Eagle Brae Log Cabins', emoji: '🪵', nights: 2, dates: 'Jul 13–15',
    status: 'open', color: 'bg-amber-50 border-amber-200', dotColor: 'bg-amber-500', who: 'Core family',
    details: 'Luxury log cabins Paige found. Next stop after Skye — Highland splurge before heading back south. Likely hot tubs, forest setting, self-catering.',
    highlights: ['Luxury Highland cabin', 'Hot tubs (likely)', 'Forest setting', 'Self-catering', 'Family-friendly'],
    action: 'Check Jul 13–14 availability: eaglebrae.co.uk',
    accommodation: 'Eagle Brae Luxury Log Cabins — open',
  },
  {
    id: 'edinburgh-hotel', name: 'Edinburgh Airport Hotel', emoji: '✈️', nights: 1, dates: 'Jul 15',
    status: 'open', color: 'bg-slate-50 border-slate-200', dotColor: 'bg-slate-400', who: 'Core family',
    details: 'One night near Edinburgh airport before early Dublin flight. Return Scotland rental car here. No need for anything fancy — just sleep and wheels to the terminal.',
    highlights: ['Return car rental', 'Airport convenience', 'Early Dublin flight'],
    action: 'Book 1 night airport hotel for Jul 15. Return car at Edinburgh airport.',
    accommodation: 'Airport hotel — open',
  },
  {
    id: 'dublin', name: 'Dublin, Ireland', emoji: '🍀', nights: 4, dates: 'Jul 16–20',
    status: 'pursuing', color: 'bg-green-50 border-green-200', dotColor: 'bg-green-500', who: 'Core family + parents',
    details: 'HomeExchange Jul 16–20. No car needed — Hop-On-Hop-Off and public transport. Parents fly in and join here. Johnsfort collects everyone Monday morning Jul 20.',
    highlights: ['Trinity College', 'Phoenix Park', 'Hop-On-Hop-Off', 'Temple Bar', 'Family pubs'],
    action: 'Confirm Dublin HX with host (Jul 16–20). Coordinate parents\' arrival flights.',
    accommodation: 'HomeExchange (almost confirmed)',
    alert: "Paige's parents fly in to join. Johnsfort collects all Jul 20 morning."
  },
  {
    id: 'kells', name: 'Johnsfort Farm, Kells', emoji: '🐄', nights: 4, dates: 'Jul 20–24',
    status: 'booked', color: 'bg-lime-50 border-lime-300', dotColor: 'bg-lime-600', who: 'Core family · Parents at Headfort Arms Hotel',
    details: 'Private 4-day curated farm experience. Richard collects from Dublin hotel, drops Jul 24 at Athlone (train to Galway) or car rental. Custom questionnaire shapes every day. Parents join tours à la carte from Headfort Arms Hotel (10 min away).',
    highlights: ['Custom private tours', 'Farm activities for kids', 'Hill of Tara', 'Trim Castle', 'Boyne Valley', "Father-in-law's Irish ancestry"],
    action: 'BOOKED ✅ Answer Johnsfort questionnaire when it arrives.',
    accommodation: "Bartholomew's Loft, Johnsfort (BOOKED ✅) · Parents: The Headfort Arms Hotel, Kells",
    cost: '€4,500 family of 4 · Parents à la carte',
  },
  {
    id: 'galway', name: 'Outside Galway', emoji: '🎪', nights: 6, dates: 'Jul 24–30',
    status: 'booked', color: 'bg-orange-50 border-orange-200', dotColor: 'bg-orange-500', who: 'Core family (HX) · Parents TBD',
    details: 'HomeExchange outside Galway. Arriving Jul 24 = last 2 days of Galway Arts Festival (Jul 13–26). Pick up car from Athlone/Johnsfort drop on Jul 24. Day trips to Aran Islands, Cliffs of Moher, Connemara. Flexible on last night — Jul 29 or 30 depending on Kilkenny timing and flight costs.',
    highlights: ['Galway Arts Festival (Jul 24–26)', 'Aran Islands ferry (90 min)', 'Cliffs of Moher', 'Connemara', 'Wild Atlantic Way', 'Galway city food & music'],
    action: 'Confirm extension dates with HX host. Decide Jul 29 or 30 checkout based on flights.',
    accommodation: 'HomeExchange (BOOKED ✅ — extending)',
    alert: 'Galway Arts Festival Jul 13–26. Arriving Jul 24 = last 2 days.'
  },
  {
    id: 'kilkenny', name: 'Kilkenny', emoji: '🏰', nights: 2, dates: 'Jul 30–Aug 1',
    status: 'open', color: 'bg-purple-50 border-purple-200', dotColor: 'bg-purple-500', who: 'Core family',
    details: "Medieval city on the way back to Dublin — 2.5 hrs from Galway, 1.5 hrs from Dublin airport. Kilkenny Castle, the Marble City, great pubs and food. Perfect final Ireland stop before flying home. Dates flex based on Galway checkout and flight costs.",
    highlights: ["Kilkenny Castle", "Medieval mile walk", "Smithwick's brewery", "Marble City pubs", "St Canice's Cathedral"],
    action: 'Research B&Bs or small hotels in Kilkenny city. Check flight costs from Dublin Aug 1–3.',
    accommodation: 'B&B or hotel — open',
  },
]

// ─── Day styles ───────────────────────────────────────────────────────────────

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
  booked:   { label: 'Booked ✓', color: 'bg-green-100 text-green-700 border border-green-200' },
  pursuing: { label: 'Pursuing', color: 'bg-amber-100 text-amber-700 border border-amber-200' },
  open:     { label: 'Open',     color: 'bg-slate-100 text-slate-500 border border-slate-200' },
}

const OPEN_ITEMS = [
  { urgent: true,  text: 'Dublin HX — confirm Jul 16–20 with host',
    url: 'https://www.homeexchange.com/my-exchange', label: 'HomeExchange' },
  { urgent: true,  text: 'East Lothian HX — confirm Jun 30–Jul 11 and book',
    url: 'https://www.homeexchange.com/my-exchange', label: 'HomeExchange' },
  { urgent: true,  text: "Isle of Skye — check Paige's saved Airbnb Jul 11–12. Book ASAP.",
    url: 'https://www.airbnb.com/wishlists', label: 'Airbnb Wishlists' },
  { urgent: true,  text: 'Eagle Brae Cabins — Aquila cabin Jul 13–15. Book directly.',
    url: 'https://eaglebrae.co.uk/our-cabins/aquila/', label: 'Eagle Brae ↗' },
  { urgent: true,  text: 'Edinburgh airport hotel — 1 night Jul 15 (early Dublin flight)',
    url: 'https://www.booking.com/searchresults.html?ss=Edinburgh+Airport&checkin=2026-07-15&checkout=2026-07-16&group_adults=4', label: 'Booking.com' },
  { urgent: false, text: 'Kilkenny B&B / hotel — ~Jul 30–Aug 1, medieval city center',
    url: 'https://www.booking.com/searchresults.html?ss=Kilkenny+City+Centre&checkin=2026-07-30&checkout=2026-08-01&group_adults=4', label: 'Booking.com' },
  { urgent: false, text: 'Return flights — Dublin → SAN, Aug 1–3 window. Chase points. Compare DUB vs SNN.',
    url: 'https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA4LTAxag0IAxIJL20vMDFueGVzcgwIAxIIL20vMDFob3MaHhIKMjAyNi0wOC0wMWoMCAMSCC9tLzAxaG9zcg0IAxIJL20vMDFueGVz', label: 'Google Flights' },
  { urgent: false, text: 'Galway: confirm HX host for extension Jul 29–30 checkout',
    url: 'https://www.homeexchange.com/my-exchange', label: 'HomeExchange' },
  { urgent: false, text: 'Parents Galway hotel — Salthill (pool) or Parkhouse (ferry). Book near Galway HX.',
    url: 'https://www.booking.com/searchresults.html?ss=Salthill+Galway&checkin=2026-07-24&checkout=2026-07-28&group_adults=2', label: 'Booking.com' },
  { urgent: false, text: "Iceland — text Kyle's friend. Check HomeExchange credits for Reykjavik.",
    url: 'https://www.homeexchange.com/s#?b_map=false&q=Reykjavik', label: 'HX Reykjavik' },
  { urgent: false, text: 'Flights SAN → KEF → EDI — Chase Ultimate Rewards, late June',
    url: 'https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA2LTI4ag0IAxIJL20vMDZ0d3RyDAgDEggvbS8wMWVmeA', label: 'Google Flights' },
  { urgent: false, text: 'Edinburgh → Dublin flight Jul 16 morning (return Scotland car first)',
    url: 'https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA3LTE2ag0IAxIJL20vMDJtNzJyDAgDEggvbS8wMXl3Zg', label: 'Google Flights' },
  { urgent: false, text: 'Ireland car rental — Athlone pickup Jul 24, Dublin airport return Aug 1',
    url: 'https://www.rentalcars.com/en/country/ie/?affiliateCode=google&preflang=en&dateFrom=2026-07-24&dateTo=2026-08-01', label: 'RentalCars.com' },
  { urgent: false, text: 'Meta activities Jul 7–9 near East Lothian (under-7, not age-gated)',
    url: 'https://www.visitscotland.com/see-do/activities/family/', label: 'VisitScotland' },
  { urgent: false, text: 'Johnsfort questionnaire — answer when it arrives to shape the farm itinerary',
    url: 'https://johnsfort.ie', label: 'johnsfort.ie' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function TripPage() {
  const [activeStop, setActiveStop] = useState<string | null>(null)
  const [view, setView] = useState<'calendar' | 'route' | 'open'>('calendar')

  const totalNights = DAYS.length - 1
  const bookedStops = STOPS.filter(s => s.status === 'booked').length
  const urgentCount = OPEN_ITEMS.filter(i => i.urgent).length

  return (
    <div className="min-h-screen bg-paper py-8">
      <div className="max-w-3xl mx-auto px-4 space-y-5">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-2xl">🗺️</span>
            <h1 className="font-display text-2xl text-midnight">Scotland & Ireland — July 2026</h1>
          </div>
          <p className="text-midnight/50 text-sm">Kyle · Paige · Bohdi · Meta · Paige's parents · johnsfort.ie booked ✅</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Countries', value: '3', sub: 'Iceland · Scotland · Ireland' },
            { label: '~Nights', value: `${totalNights}`, sub: `${bookedStops} stops confirmed` },
            { label: 'Johnsfort', value: '€4,500', sub: 'Deposit paid ✅' },
            { label: 'Urgent', value: `${urgentCount} items`, sub: 'Still to book' },
          ].map(s => (
            <div key={s.label} className="bg-cream rounded-2xl p-3 border border-midnight/8">
              <div className="font-display text-base text-midnight">{s.value}</div>
              <div className="text-xs font-medium text-midnight/55">{s.label}</div>
              <div className="text-xs text-midnight/30 mt-0.5 leading-tight">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-2 flex-wrap">
          {([['calendar', '📅 Every Night'], ['route', '📍 Stops'], ['open', '⚡ Open Items']] as const).map(([v, label]) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                view === v ? 'bg-midnight text-cream' : 'bg-cream text-midnight/50 hover:text-midnight border border-midnight/10'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── CALENDAR — every night ── */}
        {view === 'calendar' && (
          <div className="space-y-1">
            {/* Legend */}
            <div className="flex flex-wrap gap-1.5 pb-2">
              {(Object.entries(DAY_STYLES) as [DayType, typeof DAY_STYLES[DayType]][]).map(([type, style]) => (
                <span key={type} className={`text-xs px-2 py-0.5 rounded-md flex items-center gap-1 ${style.bg} ${style.text}`}>
                  {style.icon} {style.label}
                </span>
              ))}
            </div>

            {DAYS.map((day, i) => {
              const style = DAY_STYLES[day.type]
              return (
                <div key={i} className={`flex items-start gap-2 rounded-xl px-3 py-2 border ${
                  day.paigeAway ? 'border-red-200 bg-red-50' : `border-midnight/8 bg-cream`
                }`}>
                  {/* Date */}
                  <div className="w-12 flex-shrink-0 pt-0.5">
                    <div className="text-xs font-bold text-midnight/40">{day.date}</div>
                  </div>

                  {/* Type badge */}
                  <div className={`flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-md flex-shrink-0 mt-0.5 ${style.bg} ${style.text}`}>
                    {style.icon}
                  </div>

                  {/* Activity + sleep */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium leading-snug ${day.paigeAway ? 'text-red-800' : 'text-midnight'}`}>
                      {day.label}
                    </div>
                    {/* Sleep location */}
                    <div className="flex items-center gap-1 mt-0.5">
                      <Moon size={9} className="text-midnight/30 flex-shrink-0" />
                      <span className="text-xs text-midnight/45">{day.sleepIcon} {day.sleep}</span>
                    </div>
                    {day.note && <div className="text-xs text-midnight/40 mt-0.5 italic">{day.note}</div>}
                  </div>

                  {/* Flags */}
                  <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                    {day.paigeAway && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md">Solo</span>}
                    {day.booked && <CheckCircle size={12} className="text-green-500" />}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── ROUTE — stops ── */}
        {view === 'route' && (
          <div className="space-y-2">
            {STOPS.map((stop, i) => {
              const isOpen = activeStop === stop.id
              const badge = STATUS_BADGE[stop.status]
              return (
                <div key={stop.id}>
                  {i > 0 && <div className="w-0.5 h-4 bg-midnight/10 ml-5 my-0.5" />}
                  <button onClick={() => setActiveStop(isOpen ? null : stop.id)}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${stop.color} ${isOpen ? 'shadow-md' : 'hover:shadow-sm'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${stop.dotColor}`} />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display text-base text-midnight">{stop.emoji} {stop.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>{badge.label}</span>
                            {('alert' in stop) && stop.alert && <AlertCircle size={13} className="text-red-400" />}
                          </div>
                          <div className="text-xs text-midnight/45 mt-0.5">{stop.dates} · {stop.nights} night{stop.nights !== 1 ? 's' : ''} · {stop.who}</div>
                        </div>
                      </div>
                      {isOpen ? <ChevronUp size={15} className="text-midnight/30 mt-1" /> : <ChevronDown size={15} className="text-midnight/30 mt-1" />}
                    </div>

                    {isOpen && (
                      <div className="mt-3 ml-6 space-y-3" onClick={e => e.stopPropagation()}>
                        {('alert' in stop) && stop.alert && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex gap-2">
                            <AlertCircle size={13} className="mt-0.5 flex-shrink-0" /> {stop.alert}
                          </div>
                        )}
                        <p className="text-sm text-midnight/65 leading-relaxed">{stop.details}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {stop.highlights.map(h => (
                            <span key={h} className="text-xs bg-white/70 border border-midnight/10 px-2 py-1 rounded-lg text-midnight/60">{h}</span>
                          ))}
                        </div>
                        <div className="text-sm text-midnight/60"><span className="font-medium text-midnight/80">Sleep: </span>{stop.accommodation}</div>
                        {('cost' in stop) && stop.cost && (
                          <div className="text-sm text-midnight/60"><span className="font-medium text-midnight/80">Cost: </span>{stop.cost}</div>
                        )}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                          <span className="font-semibold">Action: </span>{stop.action}
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              )
            })}
            <div className="w-0.5 h-4 bg-midnight/10 ml-5" />
            <div className="rounded-2xl border-2 border-midnight/10 bg-cream p-4 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-midnight/20 flex-shrink-0" />
              <div>
                <div className="font-display text-base text-midnight">🏠 San Diego</div>
                <div className="text-xs text-midnight/45">Aug 1–2 · Chase Ultimate Rewards · Dublin airport</div>
              </div>
            </div>
          </div>
        )}

        {/* ── OPEN ITEMS ── */}
        {view === 'open' && (
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="text-sm font-bold text-red-800 mb-2 flex items-center gap-1.5">
                <AlertCircle size={14} /> Urgent — book these now
              </div>
              <ul className="space-y-2.5">
                {OPEN_ITEMS.filter(i => i.urgent).map((item, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="text-sm font-bold text-red-700 flex-shrink-0">{idx + 1}.</span>
                      <span className="text-sm text-red-800 leading-snug">{item.text}</span>
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-xs font-medium bg-red-600 text-white px-2.5 py-1 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap flex items-center gap-1"
                      >
                        {item.label} <ExternalLink size={10} />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-1.5">
                <Clock size={14} /> Research & logistics
              </div>
              <ul className="space-y-2.5">
                {OPEN_ITEMS.filter(i => !i.urgent).map((item, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="text-amber-400 flex-shrink-0 mt-0.5">○</span>
                      <span className="text-sm text-amber-800 leading-snug">{item.text}</span>
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 text-xs font-medium bg-amber-600 text-white px-2.5 py-1 rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap flex items-center gap-1"
                      >
                        {item.label} <ExternalLink size={10} />
                      </a>
                    )}
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
