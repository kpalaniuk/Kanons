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
  sleep: string
  sleepIcon?: string
  stopId: string
  type: DayType
  note?: string
  paigeAway?: boolean
  booked?: boolean
}

// ─── Day-by-day ───────────────────────────────────────────────────────────────

const DAYS: TripDay[] = [
  // ICELAND — 3 nights (Jun 27-30)
  { date: 'Jun 27', label: 'Fly SAN → Reykjavik', sleep: 'Reykjavik, Iceland', sleepIcon: '🧊', stopId: 'iceland', type: 'transit' },
  { date: 'Jun 28', label: 'Iceland — Golden Circle, geysers', sleep: 'Reykjavik, Iceland', sleepIcon: '🧊', stopId: 'iceland', type: 'explore' },
  { date: 'Jun 29', label: 'Iceland — hot springs, Kristjan local guide day', sleep: 'Reykjavik, Iceland', sleepIcon: '🧊', stopId: 'iceland', type: 'explore' },

  // SCOTLAND — GLASGOW
  { date: 'Jun 30', label: 'Fly KEF → Glasgow, pick up car', sleep: 'Glasgow HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'glasgow', type: 'transit' },
  { date: 'Jul 1',  label: 'Settle into Glasgow base', sleep: 'Glasgow HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'glasgow', type: 'chill' },
  { date: 'Jul 2',  label: 'Glasgow city explore', sleep: 'Glasgow HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'glasgow', type: 'explore' },
  { date: 'Jul 3',  label: 'Day trip — Loch Lomond or Stirling Castle', sleep: 'Glasgow HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'glasgow', type: 'explore' },
  { date: 'Jul 4',  label: 'Kyle work day', sleep: 'Glasgow HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'glasgow', type: 'work' },
  { date: 'Jul 5',  label: 'Edinburgh day trip (50 min by train)', sleep: 'Glasgow HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'glasgow', type: 'explore' },
  { date: 'Jul 6',  label: 'Family day — Paige preps for Athens', sleep: 'Glasgow HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'glasgow', type: 'chill' },
  { date: 'Jul 7',  label: 'Paige flies Glasgow → Athens', sleep: 'Glasgow HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'glasgow', type: 'solo', paigeAway: true, note: "Paige → Athens, Claudia's 40th" },
  { date: 'Jul 8',  label: 'Kyle + kids adventure (Glasgow or coast)', sleep: 'Glasgow HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'glasgow', type: 'solo', paigeAway: true },
  { date: 'Jul 9',  label: 'Kyle + kids local day', sleep: 'Glasgow HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'glasgow', type: 'solo', paigeAway: true },
  { date: 'Jul 10', label: 'Paige returns 🎉 Rest + pack for Highlands', sleep: 'Glasgow HX', sleepIcon: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stopId: 'glasgow', type: 'chill', note: 'Paige returns from Athens' },

  // HIGHLANDS — SKYE
  { date: 'Jul 11', label: 'Check out Glasgow → Drive to Skye (~2.5 hrs)', sleep: 'Isle of Skye — Croft4, Breakish', sleepIcon: '🏔️', stopId: 'skye', type: 'transit', booked: true, note: 'Via Loch Lomond & Glencoe — stunning drive' },
  { date: 'Jul 12', label: 'Isle of Skye — Fairy Pools, Old Man of Storr', sleep: 'Isle of Skye — Croft4, Breakish', sleepIcon: '🏔️', stopId: 'skye', type: 'excursion', booked: true },

  // HIGHLANDS — EAGLE BRAE
  { date: 'Jul 13', label: 'Skye → Eagle Brae Cabins (Eilean Donan stop)', sleep: 'Eagle Brae — Cinclus Cabin', sleepIcon: '🪵', stopId: 'eagle-brae', type: 'transit', booked: true },
  { date: 'Jul 14', label: 'Eagle Brae — sauna, forest, chill', sleep: 'Eagle Brae — Cinclus Cabin', sleepIcon: '🪵', stopId: 'eagle-brae', type: 'chill', booked: true },

  // INVERNESS
  { date: 'Jul 15', label: 'Eagle Brae check-out → Inverness city day', sleep: 'Inverness — Highland Cow Apt', sleepIcon: '🏙️', stopId: 'inverness', type: 'explore', booked: true, note: 'Check in 3pm. 15 min from Eagle Brae.' },

  // IRELAND — DUBLIN
  { date: 'Jul 16', label: 'Fly Inverness → Dublin. Check into HX.', sleep: 'Dublin HX', sleepIcon: '🍀', stopId: 'dublin', type: 'transit', note: 'Aer Lingus INV→DUB direct, ~1h35m. Checkout 11am.' },
  { date: 'Jul 17', label: 'Dublin — Trinity College, Phoenix Park', sleep: 'Dublin HX', sleepIcon: '🍀', stopId: 'dublin', type: 'explore' },
  { date: 'Jul 18', label: 'Dublin — Hop-On-Hop-Off, Temple Bar', sleep: 'Dublin HX', sleepIcon: '🍀', stopId: 'dublin', type: 'explore' },
  { date: 'Jul 19', label: 'Dublin — chill, prep for Johnsfort', sleep: 'Dublin HX', sleepIcon: '🍀', stopId: 'dublin', type: 'chill' },

  // KELLS — JOHNSFORT
  { date: 'Jul 20', label: 'Johnsfort pickup from Dublin. Farm day 1.', sleep: 'Johnsfort, Kells', sleepIcon: '🐄', stopId: 'kells', type: 'excursion', booked: true, note: 'Richard collects family from hotel' },
  { date: 'Jul 21', label: 'Johnsfort private tour day 2', sleep: 'Johnsfort, Kells', sleepIcon: '🐄', stopId: 'kells', type: 'excursion', booked: true },
  { date: 'Jul 22', label: 'Johnsfort private tour day 3', sleep: 'Johnsfort, Kells', sleepIcon: '🐄', stopId: 'kells', type: 'excursion', booked: true },
  { date: 'Jul 23', label: 'Johnsfort private tour day 4', sleep: 'Johnsfort, Kells', sleepIcon: '🐄', stopId: 'kells', type: 'excursion', booked: true },

  // GALWAY
  { date: 'Jul 24', label: 'Johnsfort drop → pick up car → Galway', sleep: 'Galway HX', sleepIcon: '🎪', stopId: 'galway', type: 'transit', booked: true, note: 'Galway Arts Festival — last 2 days!' },
  { date: 'Jul 25', label: 'Galway Arts Festival 🎭', sleep: 'Galway HX', sleepIcon: '🎪', stopId: 'galway', type: 'festival', booked: true },
  { date: 'Jul 26', label: 'Galway Arts Festival — final day', sleep: 'Galway HX', sleepIcon: '🎪', stopId: 'galway', type: 'festival', booked: true },
  { date: 'Jul 27', label: 'Aran Islands — 90 min ferry', sleep: 'Galway HX', sleepIcon: '🎪', stopId: 'galway', type: 'excursion', booked: true },
  { date: 'Jul 28', label: 'Cliffs of Moher day trip (~1.5 hrs)', sleep: 'Galway HX', sleepIcon: '🎪', stopId: 'galway', type: 'excursion', booked: true },
  { date: 'Jul 29', label: 'Connemara / Wild Atlantic Way', sleep: 'Galway HX', sleepIcon: '🎪', stopId: 'galway', type: 'explore', booked: true },

  // KILKENNY
  { date: 'Jul 30', label: 'Drive Galway → Kilkenny (~2.5 hrs)', sleep: 'Kilkenny', sleepIcon: '🏰', stopId: 'kilkenny', type: 'transit' },
  { date: 'Jul 31', label: 'Kilkenny — castle, old city, pubs', sleep: 'Kilkenny', sleepIcon: '🏰', stopId: 'kilkenny', type: 'explore' },

  // FLY HOME
  { date: 'Aug 1',  label: 'Drive Kilkenny → Dublin (~1.5 hrs). Fly home.', sleep: 'In flight → SAN', sleepIcon: '✈️', stopId: 'home', type: 'transit', note: 'Return car at Dublin airport' },
  { date: 'Aug 2',  label: 'Land San Diego 🏠', sleep: 'Home, San Diego', sleepIcon: '🏠', stopId: 'home', type: 'chill' },
]

// ─── Stops ────────────────────────────────────────────────────────────────────

const STOPS = [
  {
    id: 'iceland', name: 'Reykjavik, Iceland', emoji: '🧊', nights: 3, dates: 'Jun 27–30',
    status: 'pursuing', color: 'bg-sky-50 border-sky-200', dotColor: 'bg-sky-400', who: 'Core family',
    details: "3 nights — Kristjan (Kyle's friend, local travel guide) wants the kids to properly explore. Enough time for the Golden Circle, geothermal soak, and midnight sun adventures. Fly SAN→KEF Jun 27, KEF→Glasgow Jun 30.",
    highlights: ['Golden Circle / geysers', 'Blue Lagoon / hot pools', 'Midnight sun', 'Kristjan as local guide', '3 nights for kids to settle'],
    action: 'Book SAN→KEF (Jun 27) and KEF→GLA (Jun 30) flights. Confirm stay with Kristjan.',
    accommodation: 'Staying with Kristjan (local travel guide)',
  },
  {
    id: 'glasgow', name: 'Glasgow, Scotland', emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', nights: 11, dates: 'Jun 30–Jul 11',
    status: 'pursuing', color: 'bg-indigo-50 border-indigo-200', dotColor: 'bg-indigo-500', who: 'Core family',
    details: "Scotland home base — 11 nights. Glasgow replaces East Lothian. Edinburgh is 50 min by train. Loch Lomond, Stirling Castle, and the Highlands are all on the doorstep. Paige departs Jul 7 for Athens (Claudia's 40th). Kyle solo with Bohdi + Meta Jul 7–9. Paige returns Jul 10. Check out Jul 11 — Glasgow is actually closer to Skye (~2.5 hrs vs 5.5 from East Lothian).",
    highlights: ['Edinburgh 50 min by train', 'Loch Lomond day trip', 'Stirling Castle', 'Kyle work days', 'Closer to Skye than East Lothian'],
    action: 'Confirm Glasgow HomeExchange booking Jun 30–Jul 11.',
    accommodation: 'HomeExchange — awaiting confirmation',
    alert: "Paige departs Glasgow airport Jul 7 → Athens. Returns Jul 10. Kyle solo with kids Jul 7–9."
  },
  {
    id: 'skye', name: 'Isle of Skye', emoji: '🏔️', nights: 2, dates: 'Jul 11–13',
    status: 'booked', color: 'bg-emerald-50 border-emerald-200', dotColor: 'bg-emerald-500', who: 'Core family',
    details: '~2.5 hour drive from Glasgow (much better than 5.5 from East Lothian). Property is Croft4 in Breakish — SE Skye near the bridge. Old Man of Storr and Fairy Pools are a 40–55 min drive north/west — worth it, leave early.',
    highlights: ['Old Man of Storr', 'Fairy Pools', 'Neist Point lighthouse', 'Portree village', 'Leave croft early for best spots'],
    action: 'BOOKED ✅ Croft4, Breakish. Booking #6564117675.',
    accommodation: 'Croft4, 4 Scullamus Moss, Breakish IV42 8QB — BOOKED ✅',
    cost: '£1,179.90 paid',
  },
  {
    id: 'eagle-brae', name: 'Eagle Brae Log Cabins', emoji: '🪵', nights: 2, dates: 'Jul 13–15',
    status: 'booked', color: 'bg-amber-50 border-amber-200', dotColor: 'bg-amber-500', who: 'Core family',
    details: "Luxury Highland log cabin near Beauly, 40 min from Inverness. Cinclus cabin: south-facing views down to the River Glass, sauna in bathroom, French windows, 2 sitting rooms, mezzanine log beds (kids' loft), super king bedroom. Check-in 4pm, check-out 10am. Stop at Eilean Donan Castle en route from Skye.",
    highlights: ['Sauna in cabin', 'River Glass views', "Kids' mezzanine log beds", 'Eilean Donan en route', 'Near Loch Ness'],
    action: 'BOOKED ✅ Cinclus cabin. Deposit paid. Balance £1,161.20 due May 4, 2026.',
    accommodation: 'Cinclus, Eagle Brae — BOOKED ✅ | info@eaglebrae.co.uk | 07738 076711',
    cost: '£1,481.60 total · £320.40 paid · £1,161.20 due May 4',
    alert: '⚠️ Balance of £1,161.20 due May 4, 2026'
  },
  {
    id: 'inverness', name: 'Inverness', emoji: '🏙️', nights: 1, dates: 'Jul 15',
    status: 'booked', color: 'bg-teal-50 border-teal-200', dotColor: 'bg-teal-500', who: 'Core family',
    details: 'One night in Inverness — 15 min from Eagle Brae. Highland Cow Apartment: 2-bed, fully equipped kitchen, garden views. Check-in 3pm, check-out 11am. Explore Inverness city, river walk, Inverness Castle. Return Scotland rental car here before flying to Dublin.',
    highlights: ['15 min from Eagle Brae', 'Inverness city explore', '2-bed apartment', 'Return Scotland car', 'Early INV→DUB flight next morning'],
    action: 'BOOKED ✅ Lockbox. PIN: 7462. Free cancellation until Jul 13.',
    accommodation: 'Highland Cow Apartment, 31 Millburn Court, Inverness IV2 3PW — BOOKED ✅ | +447934244040',
    cost: '£205.20 paid',
  },
  {
    id: 'dublin', name: 'Dublin, Ireland', emoji: '🍀', nights: 4, dates: 'Jul 16–20',
    status: 'pursuing', color: 'bg-green-50 border-green-200', dotColor: 'bg-green-500', who: 'Core family + parents',
    details: 'HomeExchange Jul 16–20. Fly Inverness→Dublin on Aer Lingus direct (1h35m, checkout 11am so aim afternoon/evening departure). No car needed in Dublin — Hop-On-Hop-Off and public transport. Johnsfort collects everyone Jul 20 morning.',
    highlights: ['Trinity College', 'Phoenix Park', 'Hop-On-Hop-Off', 'Temple Bar', 'Aer Lingus direct from Inverness'],
    action: 'Confirm Dublin HX Jul 16–20. Book INV→DUB flight (Aer Lingus direct). Use Chase UR → AerClub Avios.',
    accommodation: 'HomeExchange — pursuing',
    alert: "Book INV→DUB Aer Lingus flight ASAP. Johnsfort collects family Jul 20 morning."
  },
  {
    id: 'kells', name: 'Johnsfort Farm, Kells', emoji: '🐄', nights: 4, dates: 'Jul 20–24',
    status: 'booked', color: 'bg-lime-50 border-lime-300', dotColor: 'bg-lime-600', who: 'Core family · Parents at Headfort Arms Hotel',
    details: 'Private 4-day curated farm experience. Richard collects from Dublin hotel, drops Jul 24. Custom questionnaire shapes every day. Parents join tours à la carte from Headfort Arms Hotel (10 min away).',
    highlights: ['Custom private tours', 'Farm activities for kids', 'Hill of Tara', 'Trim Castle', 'Boyne Valley'],
    action: 'BOOKED ✅ Answer Johnsfort questionnaire when it arrives.',
    accommodation: "Bartholomew's Loft, Johnsfort (BOOKED ✅) · Parents: The Headfort Arms Hotel, Kells",
    cost: '€4,500 family of 4',
  },
  {
    id: 'galway', name: 'Outside Galway', emoji: '🎪', nights: 6, dates: 'Jul 24–30',
    status: 'booked', color: 'bg-orange-50 border-orange-200', dotColor: 'bg-orange-500', who: 'Core family (HX)',
    details: 'HomeExchange outside Galway. Arriving Jul 24 = last 2 days of Galway Arts Festival. Aran Islands, Cliffs of Moher, Connemara all within reach.',
    highlights: ['Galway Arts Festival (Jul 24–26)', 'Aran Islands ferry', 'Cliffs of Moher', 'Connemara', 'Wild Atlantic Way'],
    action: 'BOOKED ✅ Confirm checkout date with host (Jul 29 or 30).',
    accommodation: 'HomeExchange — BOOKED ✅',
    alert: 'Galway Arts Festival runs Jul 13–26. Arriving Jul 24 = final 2 days.'
  },
  {
    id: 'kilkenny', name: 'Kilkenny', emoji: '🏰', nights: 2, dates: 'Jul 30–Aug 1',
    status: 'open', color: 'bg-purple-50 border-purple-200', dotColor: 'bg-purple-500', who: 'Core family',
    details: "Medieval city on the way back to Dublin — 2.5 hrs from Galway, 1.5 hrs from Dublin airport. Kilkenny Castle, the Marble City, great pubs. Perfect final Ireland stop.",
    highlights: ["Kilkenny Castle", "Medieval mile walk", "Smithwick's brewery", "Marble City pubs"],
    action: 'Research B&Bs or small hotels in Kilkenny city centre for Jul 30–Aug 1.',
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
  { urgent: true,  text: 'Glasgow HX — confirm Jun 30–Jul 11 (replacing East Lothian)',
    url: 'https://www.homeexchange.com/my-exchange', label: 'HomeExchange' },
  { urgent: true,  text: 'Dublin HX — confirm Jul 16–20 with host',
    url: 'https://www.homeexchange.com/my-exchange', label: 'HomeExchange' },
  { urgent: true,  text: 'Flights INV → DUB — Jul 16, Aer Lingus direct. Use Chase UR → AerClub Avios.',
    url: 'https://www.aerlingus.com/flight-information/routes/inverness-to-dublin/', label: 'Aer Lingus ↗' },
  { urgent: true,  text: 'Flights SAN → KEF — Jun 27 departure. Family of 4.',
    url: 'https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA2LTI3ag0IAxIJL20vMDZ0d3RyDAgDEggvbS8wMWVmeA', label: 'Google Flights' },
  { urgent: true,  text: 'Flights KEF → GLA — Jun 30. Connect from Iceland to Glasgow.',
    url: 'https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA2LTMwag0IAxIJL20vMDFleHhyDAgDEggvbS8wMWhiNA', label: 'Google Flights' },
  { urgent: false, text: '⚠️ Eagle Brae balance — £1,161.20 due May 4, 2026',
    url: 'https://eaglebrae.co.uk', label: 'Eagle Brae ↗' },
  { urgent: false, text: 'Kilkenny B&B / hotel — ~Jul 30–Aug 1, medieval city centre',
    url: 'https://www.booking.com/searchresults.html?ss=Kilkenny+City+Centre&checkin=2026-07-30&checkout=2026-08-01&group_adults=4', label: 'Booking.com' },
  { urgent: false, text: 'Return flights DUB → SAN — Aug 1 window. Chase Ultimate Rewards.',
    url: 'https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI2LTA4LTAxag0IAxIJL20vMDFueGVzcgwIAxIIL20vMDFob3M', label: 'Google Flights' },
  { urgent: false, text: 'Scotland car rental — Glasgow Airport pickup Jun 30, Inverness drop-off Jul 15',
    url: 'https://www.rentalcars.com/', label: 'RentalCars.com' },
  { urgent: false, text: 'Ireland car rental — Dublin Airport pickup Jul 16, return Aug 1',
    url: 'https://www.rentalcars.com/', label: 'RentalCars.com' },
  { urgent: false, text: 'Johnsfort questionnaire — answer when it arrives',
    url: 'https://johnsfort.ie', label: 'johnsfort.ie' },
  { urgent: false, text: 'Galway HX — confirm checkout date with host (Jul 29 or 30)',
    url: 'https://www.homeexchange.com/my-exchange', label: 'HomeExchange' },
  { urgent: false, text: 'Paige Glasgow → Athens flight — Jul 7 (Claudia\'s 40th, returns Jul 10)',
    url: 'https://www.google.com/travel/flights', label: 'Google Flights' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function TripPage() {
  const [activeStop, setActiveStop] = useState<string | null>(null)
  const [view, setView] = useState<'calendar' | 'route' | 'open'>('calendar')

  const bookedStops = STOPS.filter(s => s.status === 'booked').length
  const urgentCount = OPEN_ITEMS.filter(i => i.urgent).length
  const totalNights = DAYS.length - 1

  return (
    <div className="min-h-screen bg-paper py-8">
      <div className="max-w-3xl mx-auto px-4 space-y-5">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-2xl">🗺️</span>
            <h1 className="font-display text-2xl text-midnight">Iceland · Scotland · Ireland — 2026</h1>
          </div>
          <p className="text-midnight/50 text-sm">Kyle · Paige · Bohdi · Meta · Jun 27 → Aug 2</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Countries', value: '3', sub: 'Iceland · Scotland · Ireland' },
            { label: 'Nights', value: `${totalNights}`, sub: 'Jun 27 → Aug 2' },
            { label: 'Confirmed', value: `${bookedStops}/${STOPS.length}`, sub: 'stops booked' },
            { label: 'Open', value: `${urgentCount} urgent`, sub: 'items remaining' },
          ].map(s => (
            <div key={s.label} className="bg-cream rounded-2xl p-3 border border-midnight/8">
              <div className="font-display text-base text-midnight">{s.value}</div>
              <div className="text-xs font-medium text-midnight/55">{s.label}</div>
              <div className="text-xs text-midnight/30 mt-0.5 leading-tight">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Booking status legend */}
        <div className="bg-cream rounded-2xl border border-midnight/8 p-4">
          <div className="text-xs font-semibold text-midnight/50 uppercase tracking-wide mb-3">Accommodation status</div>
          <div className="space-y-2">
            {STOPS.map(stop => (
              <div key={stop.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${stop.dotColor}`} />
                  <span className="text-sm text-midnight/80">{stop.emoji} {stop.name}</span>
                  <span className="text-xs text-midnight/40">{stop.dates}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_BADGE[stop.status].color}`}>
                  {STATUS_BADGE[stop.status].label}
                </span>
              </div>
            ))}
          </div>
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
                  day.paigeAway ? 'border-red-200 bg-red-50' : 'border-midnight/8 bg-cream'
                }`}>
                  <div className="w-12 flex-shrink-0 pt-0.5">
                    <div className="text-xs font-bold text-midnight/40">{day.date}</div>
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-md flex-shrink-0 mt-0.5 ${style.bg} ${style.text}`}>
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium leading-snug ${day.paigeAway ? 'text-red-800' : 'text-midnight'}`}>
                      {day.label}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Moon size={9} className="text-midnight/30 flex-shrink-0" />
                      <span className="text-xs text-midnight/45">{day.sleepIcon} {day.sleep}</span>
                    </div>
                    {day.note && <div className="text-xs text-midnight/40 mt-0.5 italic">{day.note}</div>}
                  </div>
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
                <div className="text-xs text-midnight/45">Aug 1–2 · DUB → SAN · Chase Ultimate Rewards</div>
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
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                        className="flex-shrink-0 text-xs font-medium bg-red-600 text-white px-2.5 py-1 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap flex items-center gap-1">
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
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                        className="flex-shrink-0 text-xs font-medium bg-amber-600 text-white px-2.5 py-1 rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap flex items-center gap-1">
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
