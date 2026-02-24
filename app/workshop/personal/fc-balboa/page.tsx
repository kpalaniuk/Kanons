import Link from 'next/link'
import { ArrowLeft, Trophy, Users, Calendar, ClipboardList } from 'lucide-react'

export default function FCBalboapage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">

      <Link href="/workshop/kb" className="inline-flex items-center gap-2 text-sm text-midnight/40 hover:text-cyan-500 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Knowledge Base
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">FC Balboa · Personal</span>
        </div>
        <h1 className="font-display text-4xl text-midnight mb-2">FC Balboa</h1>
        <p className="text-midnight/60">U10 coaching hub — season notes, roster, practice plans, game log.</p>
      </div>

      {/* Season Overview */}
      <section className="bg-cream rounded-xl p-6 border border-midnight/5">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-5 h-5 text-green-600" />
          <h2 className="font-display text-xl text-midnight">Season Overview</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-midnight/40 text-xs mb-1">Team</div>
            <div className="font-medium text-midnight">FC Balboa U10</div>
          </div>
          <div>
            <div className="text-midnight/40 text-xs mb-1">Coach</div>
            <div className="font-medium text-midnight">Kyle Palaniuk</div>
          </div>
          <div>
            <div className="text-midnight/40 text-xs mb-1">Birth Year Window</div>
            <div className="font-medium text-midnight">Aug 2016 – Jul 2017</div>
          </div>
          <div>
            <div className="text-midnight/40 text-xs mb-1">Practice</div>
            <div className="font-medium text-midnight">Wednesdays 3:30pm · Thursdays (coaching)</div>
          </div>
        </div>
      </section>

      {/* Roster */}
      <section className="bg-cream rounded-xl p-6 border border-midnight/5">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-5 h-5 text-green-600" />
          <h2 className="font-display text-xl text-midnight">Roster</h2>
        </div>
        <p className="text-sm text-midnight/40 italic">Add players here as the season progresses.</p>
      </section>

      {/* Practice Plans */}
      <section className="bg-cream rounded-xl p-6 border border-midnight/5">
        <div className="flex items-center gap-3 mb-4">
          <ClipboardList className="w-5 h-5 text-green-600" />
          <h2 className="font-display text-xl text-midnight">Practice Plans</h2>
        </div>
        <p className="text-sm text-midnight/40 italic">Session plans, drills, and focus areas go here.</p>
      </section>

      {/* Game Log */}
      <section className="bg-cream rounded-xl p-6 border border-midnight/5">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-green-600" />
          <h2 className="font-display text-xl text-midnight">Game Log</h2>
        </div>
        <p className="text-sm text-midnight/40 italic">Results and notes by game date.</p>
      </section>

    </div>
  )
}
