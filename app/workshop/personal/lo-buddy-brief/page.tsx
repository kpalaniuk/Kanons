import Link from 'next/link'
import { ArrowLeft, CheckCircle2, AlertCircle, Clock, Zap, Users, LayoutDashboard, MessageSquare, FileText, Rocket, Wrench, Calendar } from 'lucide-react'

const priority: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  LOW: 'bg-green-100 text-green-700',
}

function Badge({ level }: { level: 'HIGH' | 'MEDIUM' | 'LOW' }) {
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${priority[level]}`}>
      {level}
    </span>
  )
}

function SectionHeader({ icon: Icon, title, color = 'text-cyan-500' }: { icon: React.ElementType; title: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-8 bg-cyan-500 rounded-full" />
      <Icon className={`w-6 h-6 ${color}`} />
      <h2 className="font-display text-2xl text-midnight">{title}</h2>
    </div>
  )
}

export default function LOBuddyBriefPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">

      {/* Back nav */}
      <Link href="/workshop/kb" className="inline-flex items-center gap-2 text-sm text-midnight/40 hover:text-cyan-500 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Knowledge Base
      </Link>

      {/* Header */}
      <div className="bg-midnight rounded-2xl p-8 text-cream">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400">Report · Personal · LO Buddy</span>
          <span className="text-xs text-cream/40">February 24, 2026</span>
        </div>
        <h1 className="font-display text-4xl mb-3">LO Buddy — Full Product Brief</h1>
        <p className="text-cream/60 text-lg">For Kyle Palaniuk & Chad Djurdjevic · Prepared by Jasper</p>
        <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-cream/10">
          <div>
            <div className="text-2xl font-display text-cyan-400">10</div>
            <div className="text-xs text-cream/40 mt-0.5">Commits shipped</div>
          </div>
          <div>
            <div className="text-2xl font-display text-cyan-400">4</div>
            <div className="text-xs text-cream/40 mt-0.5">Vercel deploys</div>
          </div>
          <div>
            <div className="text-2xl font-display text-cyan-400">Live</div>
            <div className="text-xs text-cream/40 mt-0.5">www.lobuddy.com</div>
          </div>
        </div>
      </div>

      {/* What We Shipped */}
      <section>
        <SectionHeader icon={CheckCircle2} title="What We Shipped" color="text-green-500" />
        <div className="space-y-4">

          <div className="bg-cream rounded-xl p-6 border border-midnight/5">
            <h3 className="font-display text-lg text-midnight mb-3">GHL ↔ LO Buddy Integration — Full Bidirectional Sync</h3>
            <div className="space-y-4 text-sm text-midnight/70">
              <div>
                <div className="font-semibold text-midnight mb-1">Inbound Pipeline</div>
                <ol className="list-decimal list-inside space-y-1">
                  <li>GHL Workflow triggers on Customer Replied (SMS) → fires Custom Webhook</li>
                  <li>Webhook hits <code className="bg-midnight/5 px-1 rounded">/api/integrations/lo-ninja/webhook</code></li>
                  <li>LO Buddy stores message in approval queue (status: pending)</li>
                  <li>AI draft auto-generated in background using <code className="bg-midnight/5 px-1 rounded">gpt-4o-mini</code></li>
                  <li>LO sees message + draft → one-click approve → SMS fires from (619) 777-5700</li>
                </ol>
              </div>
              <div>
                <div className="font-semibold text-midnight mb-1">Outbound Coverage</div>
                <p>Messages sent directly in GHL (drip sequences, manual replies, automations) captured by a <strong>5-minute polling cron</strong> that syncs all recent conversation messages. LO Buddy now has a complete, near-real-time picture of every client conversation.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              { name: 'LOBuddy Inbound Messages', desc: 'SMS inbound → approval queue' },
              { name: 'LOBuddy Contact Created', desc: 'New GHL contacts sync to LO Buddy' },
              { name: 'LOBuddy Pipeline Stage Changes', desc: 'Stage moves sync bidirectionally' },
            ].map(w => (
              <div key={w.name} className="bg-cream rounded-xl p-4 border border-midnight/5">
                <div className="w-2 h-2 rounded-full bg-green-400 mb-2" />
                <div className="font-semibold text-sm text-midnight">{w.name}</div>
                <div className="text-xs text-midnight/50 mt-1">{w.desc}</div>
              </div>
            ))}
          </div>

          <div className="bg-cream rounded-xl p-6 border border-midnight/5">
            <h3 className="font-display text-lg text-midnight mb-3">Architecture Decisions Locked</h3>
            <ul className="space-y-2 text-sm text-midnight/70">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><span><strong>LO Buddy = brain. LO Ninja = channel.</strong> LO Buddy never sends without LO sign-off.</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><span>Conversation ID, opportunity data, and contact details auto-resolved from GHL API when missing from webhook payload</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><span>Real GHL message IDs used for deduplication; per-team data isolation via <code className="bg-midnight/5 px-1 rounded">team_&#123;team_id&#125;</code> namespacing in Pinecone</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /><span><code className="bg-midnight/5 px-1 rounded">bash scripts/deploy.sh</code> — the authoritative deploy command (commits → GitHub → Vercel production deploy)</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bugs to Fix */}
      <section>
        <SectionHeader icon={Wrench} title="Fix Before Going Live" color="text-red-500" />
        <div className="space-y-3">
          {[
            {
              title: 'Settings Page Doesn\'t Load',
              priority: 'HIGH' as const,
              cause: 'Supabase fetch failing silently — no error shown to user',
              fix: 'Debug settings page fetch, add error boundary, test with Kyle\'s admin account',
            },
            {
              title: 'Unknown Contact Handling',
              priority: 'HIGH' as const,
              cause: 'New phone number texts in → message captured but no AI draft generated',
              fix: 'Create stub contact from phone number, flag as "New Lead," generate context-light AI draft, alert LO. This is literally new lead capture — the most valuable moment.',
            },
            {
              title: 'Left Nav Bar Needs Cleanup',
              priority: 'HIGH' as const,
              cause: 'Unbuilt nav items visible — some links go nowhere or to broken pages',
              fix: 'Audit all nav items — hide anything without a working page. Clean nav = confident product.',
            },
            {
              title: 'Audit Logs Page Has Errors',
              priority: 'MEDIUM' as const,
              cause: 'Query building against changed table structure, or missing RLS permissions',
              fix: 'Check Supabase query, verify RLS policies allow admin to read audit logs',
            },
            {
              title: 'No Team Indicator in UI',
              priority: 'MEDIUM' as const,
              cause: 'No visible indication of which team you\'re on after login',
              fix: 'Add team name + logo to nav header or sidebar',
            },
            {
              title: 'Team Chat / Messaging Center — Incomplete',
              priority: 'MEDIUM' as const,
              cause: 'Internal team messaging exists in nav but isn\'t fully built',
              fix: 'Build core: channel list, message thread, real-time updates via Supabase Realtime. Kyle, Jim, Anthony need to coordinate on clients inside LO Buddy.',
            },
          ].map(item => (
            <div key={item.title} className="bg-cream rounded-xl p-5 border border-midnight/5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="font-semibold text-midnight">{item.title}</h3>
                <Badge level={item.priority} />
              </div>
              <p className="text-sm text-midnight/50 mb-1"><span className="font-medium text-midnight/70">Cause:</span> {item.cause}</p>
              <p className="text-sm text-midnight/50"><span className="font-medium text-midnight/70">Fix:</span> {item.fix}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Feature Roadmap */}
      <section>
        <SectionHeader icon={Rocket} title="New Feature Roadmap" color="text-ocean" />
        <div className="space-y-4">

          <div className="bg-cream rounded-xl p-6 border border-midnight/5">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-display text-lg text-midnight">AI-Powered Dynamic Scenarios</span>
              <span className="text-xs bg-ocean/10 text-ocean font-semibold px-2 py-0.5 rounded-full">Feature 1</span>
            </div>
            <p className="text-sm text-midnight/60 mb-4">The Kanons model, built for LOs. Three modes:</p>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { name: 'Baseline Mode', desc: 'LO selects template → pulls client data → generates standard scenario. Pure math, no AI, always works.' },
                { name: 'AI-Enhanced Mode', desc: 'LO types a prompt → AI reads full client profile → generates 3–4 custom scenario narratives with talking points.' },
                { name: 'Real-Time Builder', desc: 'During client calls. Voice-first: "Show me what happens if we bump the buy-down by .5%". Results update live. This is the co-pilot.' },
              ].map(m => (
                <div key={m.name} className="bg-white rounded-lg p-4 border border-midnight/5">
                  <div className="font-semibold text-sm text-midnight mb-1">{m.name}</div>
                  <div className="text-xs text-midnight/50">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {[
            {
              num: '2',
              title: 'Pre-Approval Package Builder',
              desc: 'Pull financials from contact record → auto-generate pre-approval letter → LO reviews + approves → branded PDF → sends to client via SMS link or email with one click. Realtor gets it instantly.',
            },
            {
              num: '3',
              title: 'Realtor Portal',
              desc: 'Realtors who work with PPH/GH Group get their own view: submitted clients + status, pre-approval letters, rate quote requests, messaging thread with LO. No financial details — status and docs only. They refer more when you give them a better experience than any other lender.',
            },
            {
              num: '4',
              title: 'Client Portal Polish',
              desc: 'Progress tracker (Application → Processing → Underwriting → Clear to Close → Funded), document upload with status, direct messaging with LO (SMS-backed), mobile-first redesign. Most clients will access on their phone.',
            },
            {
              num: '5',
              title: 'Landing Page Revamp',
              desc: 'The Kanons aesthetic translated: warm cream/midnight palette, Space Grotesk display, confident section transitions. Hero: "Your AI loan officer co-pilot. Close more. Work less." Animated approval queue demo. No generic SaaS look — this is a craft product.',
            },
          ].map(f => (
            <div key={f.num} className="bg-cream rounded-xl p-6 border border-midnight/5">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-display text-lg text-midnight">{f.title}</span>
                <span className="text-xs bg-midnight/5 text-midnight/50 font-semibold px-2 py-0.5 rounded-full">Feature {f.num}</span>
              </div>
              <p className="text-sm text-midnight/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New Team Onboarding */}
      <section>
        <SectionHeader icon={Users} title="New Team Onboarding Wizard" color="text-terracotta" />
        <div className="grid gap-3 md:grid-cols-5">
          {[
            { step: '1', title: 'Team Creation', desc: 'Name, logo, primary LO, add team members' },
            { step: '2', title: 'GHL Connection', desc: 'Enter Location ID, get pre-filled webhook payloads, confirm with test button' },
            { step: '3', title: 'Contact Sync', desc: 'Import existing GHL contacts, assign to LOs, AI classifies by status' },
            { step: '4', title: 'Configuration', desc: 'AI model prefs, notification routing, pre-approval templates, Twilio number' },
            { step: '5', title: 'Go Live', desc: 'Run real-time test → confirm queue populates → confirm approve flow → ship it' },
          ].map(s => (
            <div key={s.step} className="bg-cream rounded-xl p-4 border border-midnight/5 text-center">
              <div className="w-8 h-8 rounded-full bg-terracotta/10 text-terracotta font-display text-lg flex items-center justify-center mx-auto mb-2">{s.step}</div>
              <div className="font-semibold text-sm text-midnight mb-1">{s.title}</div>
              <div className="text-xs text-midnight/50">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GH Group Go-Live Plan */}
      <section>
        <SectionHeader icon={Calendar} title="GH Group Go-Live Plan" color="text-cyan-500" />
        <div className="bg-cream rounded-xl p-6 border border-midnight/5">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-midnight mb-3">Team Setup ✅</h3>
              <ul className="space-y-2 text-sm">
                {[
                  { name: 'Kyle Palaniuk', role: 'Admin' },
                  { name: 'Jim', role: 'Member / LO' },
                  { name: 'Anthony', role: 'Member / LO' },
                  { name: 'Chad Djurdjevic', role: 'Admin' },
                ].map(m => (
                  <li key={m.name} className="flex items-center justify-between">
                    <span className="text-midnight/70">{m.name}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{m.role}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-midnight mb-3">Contact Sync Steps</h3>
              <ol className="space-y-1.5 text-sm text-midnight/70 list-decimal list-inside">
                <li>Bulk import all contacts via GHL API</li>
                <li>Match to opportunities by pipeline stage</li>
                <li>Assign to LOs by <code className="bg-midnight/5 px-1 rounded">ghl_assigned_lo_email</code></li>
                <li>Unassigned → Kyle (default owner)</li>
                <li>Review 10 records in dashboard</li>
                <li>Turn on team notifications</li>
                <li>Ship it</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Debt */}
      <section>
        <SectionHeader icon={AlertCircle} title="Technical Debt" color="text-amber-500" />
        <div className="space-y-2">
          {[
            '`synced_from_ghl` column needs migration on `ghl_inbound_messages` table',
            '`LOCATION_TEAM_MAP` is hardcoded — move to `ghl_locations` DB table for multi-org scale',
            'GHL webhook auto-registration still unresolved (404s). Manual workflow setup per team for now.',
            'Pinecone three-tier memory for Jasper — Kyle wants to set up together',
            '`lo-buddy-jasper` Vercel project — old preview, disconnect once main confirmed stable',
          ].map(item => (
            <div key={item} className="flex items-start gap-3 bg-cream rounded-lg px-4 py-3 border border-midnight/5 text-sm text-midnight/60">
              <Clock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: item.replace(/`([^`]+)`/g, '<code class="bg-midnight/5 px-1 rounded text-midnight/80">$1</code>') }} />
            </div>
          ))}
        </div>
      </section>

      {/* Tomorrow */}
      <section>
        <div className="bg-ocean rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-white/80" />
            <h2 className="font-display text-xl">Start Here Tomorrow</h2>
          </div>
          <ol className="space-y-2 text-sm text-white/80 list-decimal list-inside">
            <li>Check GHL → <strong className="text-white">LOBuddy Inbound Messages</strong> → Execution Logs — confirm green run from your test</li>
            <li>If green: we're end-to-end. Start the GH Group contact sync.</li>
            <li>If red: paste the error and debug first.</li>
            <li>Chad call: walk through this doc, start prioritizing roadmap.</li>
          </ol>
          <p className="text-white/40 text-xs mt-4">The infrastructure is real now. Time to put clients through it.</p>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center text-midnight/30 text-sm pb-8">
        Prepared by Jasper · February 24, 2026 · <Link href="/workshop/kb" className="hover:text-cyan-500 transition-colors">Back to KB</Link>
      </div>

    </div>
  )
}
