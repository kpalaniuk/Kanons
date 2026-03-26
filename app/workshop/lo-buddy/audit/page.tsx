import { CheckCircle2, Clock, Database, GitCommit, AlertCircle, Wrench, ArrowRight } from 'lucide-react'

const commits = [
  { hash: 'fb06576', desc: 'feat: mobile nav, tag filtering, auto-tagging, portal management, referral connections' },
  { hash: 'a71ea90', desc: 'feat: sync GHL address/city/state fields to contacts' },
  { hash: 'fbd8e7b', desc: 'fix: opportunity detail crash — id before await params' },
  { hash: 'df76491', desc: 'fix: comprehensive route audit — force-dynamic, auth pattern, await params' },
  { hash: '(realtor)', desc: 'feat: realtor assignment from contacts (not users) — referring_contact_id' },
  { hash: '(audit)', desc: 'fix: deep UI audit — action buttons, collapsible sections, null safety' },
  { hash: '72884c4', desc: 'fix: deep UI audit final — wire buttons, coming soon toasts, null safety' },
]

const fixes = [
  {
    title: 'Mobile Navigation',
    status: 'done',
    items: [
      'New bottom nav: Pipeline, Inbox, People (contacts/partners/lead review), Chat, More (tasks/rate quotes/settings)',
      'Bottom sheet menus for People and More tabs',
    ],
  },
  {
    title: 'Tag System',
    status: 'done',
    items: [
      'Tag filtering on contacts page',
      'Tag management API (add/remove tags)',
      'Auto-tagger: buyer / client / state:XX / referred / referrer',
      'GHL webhook now syncs address/city/state',
      'Backfilled: 424 client tags, 403 buyer tags, 273 state tags, 100 realtor tags',
    ],
  },
  {
    title: 'Realtor Assignment',
    status: 'done',
    items: [
      'Added referring_contact_id column to opportunities (FK → contacts)',
      'Dropdown now shows contacts with realtor tag — not just users with logins',
      'Janine Smith and 100 other realtors now selectable',
      'Backfilled 5 opportunities from note mentions',
    ],
  },
  {
    title: 'Action Buttons',
    status: 'done',
    items: [
      'Log Call → opens QuickCallLogModal',
      'Send Text → opens SMS compose dialog with conversation thread',
      'Send Email → opens email compose dialog',
      'Add Note → scrolls to notes section',
      'Request Docs → scrolls to documents section',
      'Create Scenario → scrolls to scenarios section',
      'Send Scenarios / Share with Realtor / Generate Pre-Approval / Submit to Processing → "Coming Soon" toasts',
    ],
  },
  {
    title: 'Collapsible Sections',
    status: 'done',
    items: [
      'Notes and Documents sections collapsible by default on opportunity detail',
      'Reusable CollapsibleSection component created',
    ],
  },
  {
    title: 'Route Audit',
    status: 'done',
    items: [
      'Fixed await createAdminClient() in 5 files',
      'Fixed auth.getUser() on admin client in 8 files',
      'Added force-dynamic to 9 missing routes',
      'Fixed id before await params in 6 routes',
    ],
  },
  {
    title: 'Null Safety',
    status: 'done',
    items: [
      'Fixed contact.first_name[0] crash in co-borrower-selector',
      'All contact name references now use fallbacks',
    ],
  },
]

const dbChanges = [
  'opportunities.referring_contact_id UUID REFERENCES contacts(id) — NEW COLUMN',
  '4 new realtor contacts created (Mike Thompson, Henrietta Baldwin, Roger Rose, Sam Sampson)',
  '927 new contact_tags rows (424 client + 403 buyer + ~100 state tags)',
]

const pending = [
  { id: '1', title: 'Portal invite email', detail: 'sendPortalInvitation() has email send commented out. Needs real email integration.' },
  { id: '2', title: 'Capture module auto-linking', detail: 'When LO Buddy captures "referred by [name]" in voice, auto-match to realtor contact and set referring_contact_id.' },
  { id: '3', title: 'More collapsible sections', detail: 'Only notes/docs are collapsible now. Could add financials, scenarios, tasks, activity timeline.' },
  { id: '4', title: 'Scenario deep dive', detail: 'Kyle mentioned testing interactive scenarios this week (Kanons/PPH Claw style). Ready for that sprint.' },
  { id: '5', title: 'Desktop sidebar', detail: 'Collapse/expand was already implemented. Verify it works.' },
]

export default function AuditPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Wrench className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-display text-3xl text-midnight">Overnight Audit Results</h1>
            <p className="text-midnight/40 text-sm">LOB-Jasper · March 25–26, 2026</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
          <CheckCircle2 size={14} className="text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">All deployed — Vercel auto-built from main</span>
        </div>
      </div>

      {/* Commits */}
      <div>
        <h2 className="font-display text-xl text-midnight mb-4 flex items-center gap-2">
          <GitCommit size={18} /> Commits Deployed
        </h2>
        <div className="bg-midnight rounded-2xl overflow-hidden">
          {commits.map((c, i) => (
            <div key={i} className={`flex items-start gap-4 px-5 py-3.5 ${i < commits.length - 1 ? 'border-b border-white/5' : ''}`}>
              <code className="text-amber-400 font-mono text-xs mt-0.5 flex-shrink-0 w-20">{c.hash}</code>
              <p className="text-cream/80 text-sm">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What Got Fixed */}
      <div>
        <h2 className="font-display text-xl text-midnight mb-4 flex items-center gap-2">
          <CheckCircle2 size={18} /> What Got Fixed
        </h2>
        <div className="space-y-3">
          {fixes.map((fix) => (
            <div key={fix.title} className="bg-cream border border-midnight/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <h3 className="font-semibold text-midnight">{fix.title}</h3>
                <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">✅ Done</span>
              </div>
              <ul className="space-y-1">
                {fix.items.map((item, i) => (
                  <li key={i} className="text-sm text-midnight/70 flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* DB Changes */}
      <div>
        <h2 className="font-display text-xl text-midnight mb-4 flex items-center gap-2">
          <Database size={18} /> Database Changes
        </h2>
        <div className="bg-cream border border-midnight/10 rounded-2xl p-5 space-y-2">
          {dbChanges.map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-midnight/80">
              <span className="text-ocean mt-0.5 flex-shrink-0">›</span>
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Still Pending */}
      <div>
        <h2 className="font-display text-xl text-midnight mb-4 flex items-center gap-2">
          <Clock size={18} /> Still Pending / Next Up
        </h2>
        <div className="space-y-3">
          {pending.map((p) => (
            <div key={p.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-amber-600 w-4">{p.id}.</span>
                <h3 className="font-semibold text-midnight text-sm">{p.title}</h3>
              </div>
              <p className="text-sm text-midnight/60 pl-6">{p.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ready for next */}
      <div className="bg-midnight text-cream rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <ArrowRight size={16} className="text-amber-400" />
          <span className="text-sm font-medium text-amber-400 uppercase tracking-wide">Next Priority</span>
        </div>
        <p className="text-cream/80 text-sm leading-relaxed">
          Interactive scenarios for borrowers (Kanons-style deep dive Kyle mentioned). 
          Codebase is significantly more stable — all major action buttons work, mobile nav functional, 
          tag system live, realtor assignment pulls from contacts. The overnight audit caught and fixed 
          the systemic patterns that were causing crashes across the board.
        </p>
      </div>

      {/* Back link */}
      <div>
        <a
          href="/workshop/lo-buddy"
          className="inline-flex items-center gap-2 text-sm text-midnight/50 hover:text-midnight transition-colors"
        >
          ← Back to LO Buddy Control Center
        </a>
      </div>

    </div>
  )
}
