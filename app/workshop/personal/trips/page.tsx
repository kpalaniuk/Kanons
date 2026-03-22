'use client'

import Link from 'next/link'
import { Map, Plane, CheckCircle, AlertCircle } from 'lucide-react'

const TRIPS = [
  {
    href: '/workshop/personal/trip-cabo-2026',
    emoji: '🌊',
    name: 'Cabo Spring Break',
    dates: 'March 30 – April 6, 2026',
    status: 'upcoming',
    daysUntil: () => {
      const now = new Date()
      const departure = new Date('2026-03-30')
      const diff = Math.ceil((departure.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : null
    },
    tags: [
      { label: '✈️ Flights', done: true },
      { label: '🏠 HomeExchange', done: true },
      { label: '💦 Royal Solaris', done: true },
      { label: '🚗 Rental Car', done: false, urgent: true },
    ],
    note: 'Family of 4 · SAN → SJD nonstop',
  },
  {
    href: '/workshop/personal/trip-columbus-2026',
    emoji: '🎓',
    name: "Columbus — Janey's Graduation",
    dates: 'May 22 – 26, 2026',
    status: 'upcoming',
    daysUntil: () => {
      const now = new Date()
      const departure = new Date('2026-05-22')
      const diff = Math.ceil((departure.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : null
    },
    tags: [
      { label: '✈️ Southwest BQ4KS8', done: true },
      { label: '🏨 Hotel', done: false },
      { label: '✈️ Return May 26', done: false, urgent: true },
    ],
    note: 'Family of 4 · SAN→DEN→CMH · Nick & Janey',
  },
  {
    href: '/workshop/personal/trip-july-2026',
    emoji: '🏴',
    name: 'Iceland · Scotland · Ireland',
    dates: 'June 27 – August 3, 2026',
    status: 'upcoming',
    daysUntil: () => {
      const now = new Date()
      const departure = new Date('2026-06-27')
      const diff = Math.ceil((departure.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : null
    },
    tags: [
      { label: '✈️ Icelandair', done: true },
      { label: '🏴 Glasgow HX', done: true },
      { label: '🏰 Eagle Brae', done: true },
      { label: '✈️ INV→DUB', done: false, urgent: true },
    ],
    note: '37 days · Icelandair C6DYEZ',
  },
]

export default function TripsPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="pt-2">
        <div className="flex items-center gap-3 mb-1">
          <Map className="w-6 h-6 text-ocean" />
          <h1 className="font-display text-2xl text-midnight">Trips</h1>
        </div>
        <p className="text-midnight/50 text-sm">Upcoming adventures</p>
      </div>

      <div className="space-y-4">
        {TRIPS.map((trip) => {
          const days = trip.daysUntil()
          const urgentTags = trip.tags.filter(t => !t.done && (t as any).urgent)
          return (
            <Link
              key={trip.href}
              href={trip.href}
              className="block bg-cream border border-midnight/10 rounded-2xl p-5 hover:border-ocean/40 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="text-4xl leading-none mt-0.5">{trip.emoji}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display text-lg text-midnight">{trip.name}</h2>
                      {urgentTags.length > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <AlertCircle size={10} /> Action needed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-midnight/50 mt-0.5">{trip.dates}</p>
                    <p className="text-xs text-midnight/40 mt-0.5">{trip.note}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {trip.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className={`text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1 ${
                            tag.done
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : (tag as any).urgent
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {tag.done ? <CheckCircle size={9} /> : <AlertCircle size={9} />}
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {days !== null && (
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-display text-ocean">{days}</div>
                    <div className="text-xs text-midnight/40">days away</div>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
