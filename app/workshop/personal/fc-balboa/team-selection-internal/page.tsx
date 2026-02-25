'use client'

import Link from 'next/link'
import { ArrowLeft, Users, ShieldCheck, ClipboardList, Package, MapPin } from 'lucide-react'

function GearRow({ item, qty }: { item: string; qty: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-midnight/5 text-sm last:border-0">
      <span className="text-midnight/80">{item}</span>
      <span className="font-medium text-midnight bg-midnight/5 px-2 py-0.5 rounded">{qty}</span>
    </div>
  )
}

export default function FCBalbaoTeamSelectionInternalPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">

      <Link
        href="/workshop/personal/fc-balboa"
        className="inline-flex items-center gap-2 text-sm text-midnight/40 hover:text-green-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to FC Balboa Hub
      </Link>

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">FC Balboa · Internal</span>
          <span className="text-xs text-midnight/40">February 2026</span>
        </div>
        <h1 className="font-display text-4xl text-midnight mb-2">Team Selection — Internal Notes</h1>
        <p className="text-midnight/60 text-lg leading-relaxed">
          Planning notes for the 2026–27 U10 season build. For Kyle Palaniuk, Coach Andy Laub, and Angie Nielson.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm text-green-800">
        <strong>Audience:</strong> Kyle Palaniuk · Coach Andy Laub · Angie Nielson (Team Manager)
      </div>

      {/* Where We Are */}
      <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-4">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-green-600" />
          <h2 className="font-display text-xl text-midnight">Where We Are</h2>
        </div>
        <p className="text-sm text-midnight/70 leading-relaxed">
          Tryouts wrapped up strong. We had <strong>20 players participate</strong> across sessions — 10 returning or
          practice participants, roughly 6 from last year's official roster, and a handful of new faces. A couple of
          players eligible for U10 are staying with their U11 teams by family preference, which we fully support.
          That leaves us working with approximately <strong>18 players</strong> going into the 2026–27 build.
        </p>
        <p className="text-sm text-midnight/70 leading-relaxed">
          Of those 18, only <strong>3–4 players</strong> sit at a noticeably lower skill tier than the rest. The rest
          of the group is solid — and more importantly, we have good energy, coachability, and genuine attachment to
          the program across the board.
        </p>
      </div>

      {/* Two-Team Approach */}
      <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <h2 className="font-display text-xl text-midnight">The Two-Team Approach</h2>
        </div>
        <p className="text-sm text-midnight/70 leading-relaxed">
          Coach Andy Laub and I cannot coach two separate teams — that's the honest reality, and we're not trying to.
          But 18 players is too many for a single 7v7 roster, and <strong>we don't want to cut anyone</strong> if we
          can avoid it.
        </p>
        <p className="text-sm text-midnight/70 leading-relaxed">
          The plan: <strong>field two teams in different US Soccer flights.</strong> Team 1 (Tier 1) competes at a
          higher flight. Team 2 (Tier 2) competes at a development flight. Both teams practice together at Jefferson.
          Both share gear. The coaching load for Team 2 is separate — and we have leads.
        </p>

        <div className="bg-white rounded-xl p-4 border border-green-100 space-y-3">
          <div className="text-xs font-semibold text-green-700 uppercase tracking-wide">Coaching Pipeline — Team 2</div>
          <div className="space-y-3 text-sm text-midnight/70">
            <div>
              <strong>Max's dad</strong> — Max was playing with the U11s and is eligible for our team. On skill alone
              he'd be a borderline call, but his dad has expressed interest in coaching and Chhem is already aware.
              Max on Team 2 with his dad coaching is a natural fit.
            </div>
            <div>
              <strong>Derrick's dad</strong> — Derrick is younger but playing up and more than capable. His dad has
              also expressed coaching interest. If both commit, Team 2 has a coaching staff.
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>Action before Thursday:</strong> Have a real conversation with both dads — not a casual mention, a
          sit-down. We should know where they stand so we can present this as an almost-staffed solution, not a hope.
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sm text-sky-800">
          <strong>Question for Chhem before Thursday:</strong> What's the official US Soccer roster limit per 7v7 team?
          We need to know how to split 18 players across two rosters appropriately.
        </div>
      </div>

      {/* Player Philosophy */}
      <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <h2 className="font-display text-xl text-midnight">Player Philosophy</h2>
        </div>
        <p className="text-sm text-midnight/70 leading-relaxed">
          At this age, we're not selecting for the best team right now. We're developing players for the 9v9
          transition in a couple of years, and eventually 11v11. Bigger rosters are coming — we're just building
          toward that now. The 3–4 borderline players aren't liabilities; they're kids who need another season of
          development in a structured environment.
        </p>
        <p className="text-sm text-midnight/70 leading-relaxed">
          The only caveat: a couple of the lower-tier players have shown some attitude or coachability concerns. That's
          worth watching, but it's not a reason to cut at U10. We document it, we coach to it, and we reassess.{' '}
          <strong>No cuts is still the goal.</strong>
        </p>
      </div>

      {/* Field Times */}
      <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-green-600" />
          <h2 className="font-display text-xl text-midnight">Field Times</h2>
        </div>
        <p className="text-sm text-midnight/70 leading-relaxed">
          Our strong preference is to keep <strong>Wednesdays and Thursdays at Jefferson Elementary.</strong> A
          significant portion of our players attend Jefferson, so these times are already woven into family routines —
          it's a real retention driver.
        </p>
        <p className="text-sm text-midnight/70 leading-relaxed">
          On Wednesdays, Duda currently runs a player development pickup session. We're open to sliding in right after
          at <strong>4:45 or 5:00pm</strong> for a shorter hour practice and sharing the field until Duda's program
          winds down. That's a workable near-term solution.
        </p>
        <p className="text-sm text-midnight/70 leading-relaxed">
          We'd also be moving <strong>away from the joint practice with the U11 teams</strong> — that arrangement has
          run its course. Our hope is that this group gets to retain the Jefferson field for its own dedicated sessions
          as that separation happens.
        </p>
        <div className="bg-midnight/5 rounded-xl p-4 text-sm text-midnight/60">
          <strong>Fallback options</strong> if Jefferson isn't available for both slots: North Park Recreation Center
          or Morley Field. Jefferson is highly preferred, but we have workable alternatives if needed.
        </div>
      </div>

      {/* Gear */}
      <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-4">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-green-600" />
          <h2 className="font-display text-xl text-midnight">Gear Request</h2>
        </div>
        <p className="text-sm text-midnight/70">
          We have <strong>unspent budget from last season</strong> that should be allocated this year.
          Proposed spend, shared between both teams:
        </p>
        <div className="rounded-xl border border-midnight/10 overflow-hidden">
          <GearRow item="Pop-up goals" qty="4" />
          <GearRow item="FC Balboa match balls (quality)" qty="15" />
          <GearRow item="Cones + disc markers" qty="1 full set" />
          <GearRow item="Gear wagon/cart" qty="1" />
          <GearRow item="FC Balboa pop-up tent" qty="2 (one per team)" />
          <GearRow item="Ancillary coaching tools (pinnies, sticks, etc.)" qty="TBD" />
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>Angie Nielson:</strong> Can you pull the remaining budget number before Thursday so we know what
          we're working with and whether anything requires additional club funding?
        </div>
      </div>

      {/* Thursday Checklist */}
      <div className="bg-midnight rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-5 h-5 text-green-400" />
          <h2 className="font-display text-xl text-cream">Thursday Meeting Checklist</h2>
        </div>
        <ul className="space-y-3">
          {[
            "Confirm where Max's dad and Derrick's dad stand on coaching Team 2",
            'Get roster limit clarification from Chhem (7v7 max per team)',
            'Pull remaining 2025 season budget (Angie Nielson)',
            'Align on which flight each team registers in',
            'Confirm Jefferson field slot availability — Wednesday 4:45/5pm + Thursday',
            'Agree on how to communicate the two-team structure to families',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-cream/80">
              <div className="mt-0.5 w-4 h-4 rounded border-2 border-cream/30 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}
