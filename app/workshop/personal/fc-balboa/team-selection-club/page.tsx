'use client'

import Link from 'next/link'
import { ArrowLeft, Users, ShieldCheck, ClipboardList, Package, MapPin } from 'lucide-react'

function GearRow({ item, detail }: { item: string; detail: string }) {
  return (
    <div className="py-2.5 border-b border-midnight/5 last:border-0">
      <div className="text-sm font-medium text-midnight">{item}</div>
      <div className="text-xs text-midnight/50 mt-0.5">{detail}</div>
    </div>
  )
}

export default function FCBalbaoTeamSelectionClubPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">

      <Link
        href="/workshop/personal/fc-balboa"
        className="inline-flex items-center gap-2 text-sm text-midnight/40 hover:text-sky-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to FC Balboa Hub
      </Link>

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-100 text-sky-700">FC Balboa · Club Proposal</span>
          <span className="text-xs text-midnight/40">February 2026</span>
        </div>
        <h1 className="font-display text-4xl text-midnight mb-2">FC Balboa U10 — 2026–27 Season Proposal</h1>
        <p className="text-midnight/60 text-lg leading-relaxed">
          From Kyle Palaniuk and Coach Andy Laub — submitted for review by FC Balboa coaching staff and leadership.
        </p>
      </div>

      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-sm text-sky-800">
        <strong>To:</strong> Chhem (Director of Coaching), Theo, Michelle, and interested parties in the FC Balboa younger boys program
      </div>

      {/* Overview */}
      <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-4">
        <h2 className="font-display text-xl text-midnight">Overview</h2>
        <p className="text-sm text-midnight/70 leading-relaxed">
          We're excited about where this group is heading into next season. Tryouts went well, interest in the program
          is strong, and we have a clear path forward. This proposal outlines our plan for the 2026–27 season and what
          we're asking the club to help make possible.
        </p>
        <p className="text-sm text-midnight/70 leading-relaxed">
          We ended tryouts with approximately <strong>18 players ready to commit</strong> to FC Balboa U10. Rather than
          reduce that number through cuts, we want to grow the program by fielding{' '}
          <strong>two teams in the 2026–27 season</strong> — one competing in a higher flight, one in a development
          flight. Every player stays in the FC Balboa ecosystem.
        </p>
      </div>

      {/* The Plan */}
      <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-4">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-sky-500" />
          <h2 className="font-display text-xl text-midnight">The Plan: Two Teams, No Cuts</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-sky-100">
            <div className="text-xs font-semibold text-sky-600 uppercase tracking-wide mb-2">Team 1 — Tier 1</div>
            <p className="text-sm text-midnight/70">
              Competes in a higher US Soccer flight. Led by <strong>Kyle Palaniuk</strong> and{' '}
              <strong>Coach Andy Laub.</strong>
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-100">
            <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">Team 2 — Development</div>
            <p className="text-sm text-midnight/70">
              Competes in a development flight. Separate coaching staff — parent volunteer coaches currently in
              early conversations. We expect to have clarity on this shortly.
            </p>
          </div>
        </div>

        <p className="text-sm text-midnight/70 leading-relaxed">
          Both teams practice together, which builds program cohesion and gives players cross-tier development
          opportunities. This structure also positions us well for the natural roster growth that comes with the 9v9
          and eventually 11v11 transitions in future seasons.
        </p>

        <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-sm text-sky-800">
          <strong>Note on coaching:</strong> We understand you've already had a conversation with at least one of the
          parent volunteers being considered for Team 2. We're aligned on the candidates and will have more to share
          shortly.
        </div>
      </div>

      {/* Why No Cuts */}
      <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-sky-500" />
          <h2 className="font-display text-xl text-midnight">Why No Cuts</h2>
        </div>
        <p className="text-sm text-midnight/70 leading-relaxed">
          At U10, we believe we're not yet selecting for the best team right now — we're developing players for the
          long game. The players who would otherwise be on the cut line are exactly the ones who benefit most from
          another season of structured, positive development. Many of them will grow significantly between now and the
          9v9 transition, and we'd rather develop them inside FC Balboa than lose them to another club or out of the
          sport entirely.
        </p>
        <p className="text-sm text-midnight/70 leading-relaxed">
          The two-team model creates a natural development ladder — players grow on Team 2 and move up when they're
          ready. That's the kind of culture that keeps families in the program for years.
        </p>
      </div>

      {/* Field Time */}
      <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-sky-500" />
          <h2 className="font-display text-xl text-midnight">Field Time at Jefferson Elementary</h2>
        </div>
        <p className="text-sm text-midnight/70 leading-relaxed">
          Jefferson Elementary is our strong preference for both practice slots. A significant number of our players
          attend Jefferson, which means these practice times are already built into their family routines. Field
          consistency is one of the biggest drivers of our attendance and retention, and we want to make the case for
          keeping both the Wednesday and Thursday slots there.
        </p>
        <p className="text-sm text-midnight/70 leading-relaxed">
          We're also planning to move away from the joint practice arrangement with the U11 teams, which has served
          its purpose. Our hope is that this group gets to retain the Jefferson field for dedicated sessions as that
          transition happens.
        </p>
        <p className="text-sm text-midnight/70 leading-relaxed">
          On Wednesdays specifically, we know Duda is currently running a player development pickup program. We're
          happy to slide in right after at <strong>4:45 or 5:00pm</strong> for a shorter practice and share the field
          in the near term — we want to be good neighbors to that program while it continues.
        </p>

        <div className="bg-white rounded-xl p-4 border border-sky-100 space-y-2">
          <div className="text-xs font-semibold text-sky-600 uppercase tracking-wide">Requested Times</div>
          <div className="text-sm text-midnight/70 space-y-1">
            <div><strong>Wednesday:</strong> 4:45–5:00pm start (flexible, sharing with Duda's program near-term)</div>
            <div><strong>Thursday:</strong> 4:00–6:30pm (current slot, preferred to retain)</div>
            <div><strong>Location:</strong> Jefferson Elementary — both sessions</div>
          </div>
        </div>

        <p className="text-sm text-midnight/50 italic">
          If Jefferson isn't available for both slots, our fallback options include North Park Recreation Center and
          Morley Field.
        </p>
      </div>

      {/* Equipment */}
      <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-4">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-sky-500" />
          <h2 className="font-display text-xl text-midnight">Equipment Request</h2>
        </div>
        <p className="text-sm text-midnight/70 leading-relaxed">
          We have unspent budget from the 2025 season. We'd like to use it to properly equip both teams going into
          2026–27. All gear would be shared across both teams and maintained by our team manager Angie Nielson.
        </p>
        <div className="rounded-xl border border-midnight/10 overflow-hidden">
          <GearRow item="4 pop-up goals" detail="Allows us to run full-sided and small-sided games simultaneously across both groups" />
          <GearRow item="15 FC Balboa match-quality balls" detail="Shared pool, properly branded, covers both teams comfortably" />
          <GearRow item="Cones and field markers" detail="Complete set for structured, organized training sessions" />
          <GearRow item="1 gear wagon/cart" detail="Efficient transport and storage at Jefferson — reduces setup time significantly" />
          <GearRow item="2 FC Balboa pop-up tents" detail="One per team — sideline presence and club identity at games" />
          <GearRow item="Ancillary coaching tools" detail="Pinnies, training sticks, aids — TBD based on budget" />
        </div>
        <p className="text-sm text-midnight/50 italic">
          This is a one-time investment that serves the program for multiple seasons. We'll work with Angie Nielson
          to confirm remaining budget before submitting a final request.
        </p>
      </div>

      {/* Admin */}
      <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-5 h-5 text-sky-500" />
          <h2 className="font-display text-xl text-midnight">Administrative Support</h2>
        </div>
        <p className="text-sm text-midnight/70 leading-relaxed">
          We'll need guidance on registering a second team through US Soccer — specifically roster limits for 7v7,
          flight selection, and player card processing. We want to handle this on the club's timeline and as cleanly
          as possible.
        </p>
        <p className="text-sm text-midnight/70 leading-relaxed">
          On revenue: two teams means each player still pays one registration fee. But the program grows because no
          one gets cut, and there's ongoing opportunity to add players throughout the year as roster spots open. It's
          a net positive for the club.
        </p>
      </div>

      {/* Closing */}
      <div className="bg-midnight rounded-2xl p-6 space-y-4">
        <h2 className="font-display text-xl text-cream">We're Committed to Making This Work</h2>
        <p className="text-sm text-cream/70 leading-relaxed">
          Kyle Palaniuk and Coach Andy Laub are fully invested in this group and in FC Balboa. The two-team model
          gives us the best shot at keeping every player developing, retaining families long-term, and building
          something that compounds season over season.
        </p>
        <p className="text-sm text-cream/70 leading-relaxed">
          We just need the club behind us on field access and equipment to execute it the right way. We're happy to
          discuss any of this further and look forward to the conversation.
        </p>
        <p className="text-sm text-cream/50 italic">
          — Kyle Palaniuk & Coach Andy Laub
        </p>
      </div>

      <div className="text-center text-sm text-midnight/40 pt-2">
        Questions — reach Kyle Palaniuk directly or through Angie Nielson (Team Manager).
      </div>

    </div>
  )
}
