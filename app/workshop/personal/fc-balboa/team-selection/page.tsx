'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  ClipboardList,
  Package,
  MapPin,
  ChevronRight,
} from 'lucide-react'

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-2">
      <div className="flex-1 h-px bg-midnight/10" />
      <span className="text-xs font-semibold text-midnight/40 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-midnight/10" />
    </div>
  )
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-midnight/80">
      <div className="mt-0.5 w-4 h-4 rounded border-2 border-midnight/20 flex-shrink-0" />
      <span>{children}</span>
    </li>
  )
}

function GearRow({ item, qty }: { item: string; qty: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-midnight/5 text-sm last:border-0">
      <span className="text-midnight/80">{item}</span>
      <span className="font-medium text-midnight bg-midnight/5 px-2 py-0.5 rounded">{qty}</span>
    </div>
  )
}

export default function FCBalbaoTeamSelectionPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-16">

      {/* Back nav */}
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
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">FC Balboa · Personal</span>
          <span className="text-xs text-midnight/40">February 24, 2026</span>
        </div>
        <h1 className="font-display text-4xl text-midnight mb-2">Team Selection — 2026–27 Season</h1>
        <p className="text-midnight/60 text-lg leading-relaxed">
          Two-part planning document: internal coaching notes and club proposal for the U10 two-team approach.
        </p>
      </div>

      {/* Quick nav */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a href="#internal" className="flex-1 flex items-center justify-between gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm font-medium text-green-800 hover:bg-green-100 transition-colors">
          <span>Part 1 — Internal (Kyle, Andy, Angie)</span>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </a>
        <a href="#proposal" className="flex-1 flex items-center justify-between gap-3 bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 text-sm font-medium text-sky-800 hover:bg-sky-100 transition-colors">
          <span>Part 2 — Club Proposal (Chhem)</span>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </a>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* PART 1 — INTERNAL */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      <SectionDivider label="Part 1 — Internal" />

      <div id="internal" className="space-y-6">

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-sm text-green-800">
          <strong>Audience:</strong> Kyle Palaniuk, Andy Palaniuk, Angie (Team Manager)
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
            of the group is solid — and more importantly, we have a group with good energy, coachability, and genuine
            attachment to the program.
          </p>
        </div>

        {/* Two-Team Approach */}
        <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <h2 className="font-display text-xl text-midnight">The Two-Team Approach</h2>
          </div>
          <p className="text-sm text-midnight/70 leading-relaxed">
            Andy and I cannot coach two separate teams. That's the honest reality, and we're not trying to. But 18
            players is too many for a single 7v7 roster, and <strong>we don't want to cut anyone</strong> if we can
            avoid it.
          </p>
          <p className="text-sm text-midnight/70 leading-relaxed">
            The plan: <strong>field two teams playing in different US Soccer flights.</strong> Team 1 (Tier 1) competes
            at a higher flight. Team 2 (Tier 2) competes at a development flight. Both teams practice together at
            Jefferson. Both teams share gear. The coaching load for Team 2 is separate — and we have leads.
          </p>

          <div className="bg-white rounded-xl p-4 border border-green-100 space-y-3">
            <div className="text-xs font-semibold text-green-700 uppercase tracking-wide">Coaching Pipeline for Team 2</div>
            <div className="space-y-3 text-sm text-midnight/70">
              <div>
                <strong>Max's dad</strong> — Max was playing with the U11s and is eligible for our team. On skill alone
                he'd be a borderline call, but his dad has expressed interest in coaching and Chhem is already aware.
                Max being on Team 2 with his dad coaching is a natural fit.
              </div>
              <div>
                <strong>Derrick's dad</strong> — Derrick is younger but playing up and more than capable. His dad has
                also expressed coaching interest. If both commit, Team 2 has a full coaching staff.
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
            The only caveat: a couple of the lower-tier players have shown attitude or coachability concerns. That's
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
            We want to protect <strong>Wednesdays and Thursdays, 4:00–6:30pm at Jefferson Elementary.</strong> Start
            time can flex to 4:30 or 5:00pm as needed. These slots work because many of our players attend Jefferson
            and their families can already commit to this schedule. <strong>This is not negotiable for us</strong> — it's
            a cornerstone of why this group is able to show up consistently.
          </p>
        </div>

        {/* Gear */}
        <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-4">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-green-600" />
            <h2 className="font-display text-xl text-midnight">Gear Request</h2>
          </div>
          <p className="text-sm text-midnight/70">
            We have <strong>unspent budget from last season</strong> that should be allocated this year. Proposed spend
            (shared between both teams):
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
            <strong>Angie:</strong> Can you pull the remaining budget number before Thursday so we know what we're
            working with and whether any of this requires additional club funding?
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
              'Confirm where Max\'s dad and Derrick\'s dad stand on coaching',
              'Get roster limit clarification from Chhem',
              'Pull remaining season budget (Angie)',
              'Align on which flight each team registers in',
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* PART 2 — CLUB PROPOSAL */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      <SectionDivider label="Part 2 — Club Proposal" />

      <div id="proposal" className="space-y-6">

        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 text-sm text-sky-800">
          <strong>Audience:</strong> Chhem (Director of Coaching) and Boys Coaching Staff
        </div>

        {/* Proposal Header */}
        <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-3">
          <h2 className="font-display text-2xl text-midnight">FC Balboa U10 — 2026–27 Season Proposal</h2>
          <p className="text-sm text-midnight/70 leading-relaxed">
            We're excited about the direction of this group heading into next season. Tryouts went well, interest in
            the program is strong, and we have a clear path forward. Here's what we're proposing and what we're asking
            for from the club.
          </p>
        </div>

        {/* The Plan */}
        <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-sky-500" />
            <h2 className="font-display text-xl text-midnight">The Plan: Two Teams, No Cuts</h2>
          </div>
          <p className="text-sm text-midnight/70 leading-relaxed">
            We ended tryouts with approximately <strong>18 players ready to commit</strong> to FC Balboa U10. Rather
            than reduce that number, we want to grow the program by fielding{' '}
            <strong>two teams in the 2026–27 season</strong> — a Tier 1 team competing in a higher flight, and a Tier 2
            team competing in a development flight.
          </p>
          <p className="text-sm text-midnight/70 leading-relaxed">
            Both teams practice together, building team cohesion and giving players cross-tier development
            opportunities. This keeps every player in the FC Balboa ecosystem, supports long-term player retention, and
            positions us well for the roster growth that comes with the 9v9 and eventually 11v11 transitions in future
            seasons.
          </p>
          <div className="bg-white rounded-xl p-4 border border-sky-100 text-sm text-midnight/70">
            <strong>On coaching:</strong> Andy Palaniuk and I will lead Team 1. We have two parent volunteers — connected
            to players on the team — who have expressed strong interest in coaching Team 2. We understand you've already
            spoken with at least one of them. We're in early conversations and expect to have a clearer picture shortly.
          </div>
        </div>

        {/* What We're Asking */}
        <div className="bg-cream rounded-2xl p-6 border border-midnight/5 space-y-6">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-sky-500" />
            <h2 className="font-display text-xl text-midnight">What We're Asking the Club to Support</h2>
          </div>

          {/* Field Time */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-midnight">1. Field Time at Jefferson Elementary</div>
            <p className="text-sm text-midnight/70 leading-relaxed">
              We're requesting that the club confirm and protect our{' '}
              <strong>Wednesday and Thursday afternoon practice slots at Jefferson Elementary, 4:00–6:30pm</strong>{' '}
              (with flexibility to start at 4:30 or 5:00pm).
            </p>
            <p className="text-sm text-midnight/70 leading-relaxed">
              Jefferson is the right home for this group. A significant number of our players attend Jefferson
              Elementary, which means these times are already built into their family routines. Consistency in location
              and time is directly tied to our attendance and retention numbers. Losing these slots would meaningfully
              impact our ability to field two committed teams.
            </p>
          </div>

          {/* Equipment */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-midnight">2. Equipment Allocation</div>
            <p className="text-sm text-midnight/70">
              We'd like to use the remaining budget from the 2025 season to equip the program properly for both teams
              going forward:
            </p>
            <div className="rounded-xl border border-midnight/10 overflow-hidden">
              <GearRow item="4 pop-up goals" qty="Run full-sided + small-sided games simultaneously" />
              <GearRow item="15 FC Balboa match-quality balls" qty="Shared, properly branded" />
              <GearRow item="Cones and field markers" qty="Complete set for structured training" />
              <GearRow item="1 gear wagon" qty="Transport + storage at Jefferson" />
              <GearRow item="2 FC Balboa pop-up tents" qty="One per team, sideline identity at games" />
              <GearRow item="Ancillary coaching tools" qty="Pinnies, training aids, etc." />
            </div>
            <p className="text-sm text-midnight/50 italic">
              All gear shared across both teams and maintained by our team manager Angie. One-time investment that
              serves the program for multiple seasons.
            </p>
          </div>

          {/* Admin Support */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-midnight">3. Administrative Support for Two-Team Registration</div>
            <p className="text-sm text-midnight/70 leading-relaxed">
              We'll need guidance on the process for registering a second team through US Soccer — specifically roster
              limits for 7v7, flight selection, and player card processing. We want to handle this cleanly and on the
              club's timeline.
            </p>
          </div>
        </div>

        {/* Why This Matters */}
        <div className="bg-midnight rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-xl text-cream">Why This Matters</h2>
          <p className="text-sm text-cream/70 leading-relaxed">
            Keeping all 18 players in the program isn't just good for the kids — it's the right long-term move for
            this age group. The players who would otherwise be on the cut line are exactly the ones who benefit most
            from another season of structured development. Many of them will grow significantly between now and the
            9v9 transition, and we'd rather develop them inside FC Balboa than lose them to another club or out of
            the sport entirely.
          </p>
          <p className="text-sm text-cream/70 leading-relaxed">
            The two-team model also keeps our coaching investment intact and creates a natural ladder — players develop
            on Team 2 and move up as they're ready. That's the kind of program culture that retains families for years.
          </p>
          <p className="text-sm text-cream/60 italic">
            We're committed to making this work. We just need the club behind us on field access and equipment to do
            it right.
          </p>
        </div>

        {/* Contact footer */}
        <div className="text-center text-sm text-midnight/40 pt-2">
          Questions or feedback — reach Kyle directly or through Angie.
        </div>

      </div>

    </div>
  )
}
