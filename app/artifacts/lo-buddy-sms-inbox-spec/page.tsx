import {
  MessageSquare,
  Layout,
  Database,
  Bell,
  Filter,
  Zap,
  CheckCircle,
  AlertTriangle,
  Code,
  FileText,
  ArrowRight,
  Smartphone,
  Eye,
  Clock,
  Shield,
} from 'lucide-react'

export default function LOBuddySMSInboxSpec() {
  return (
    <div className="min-h-screen bg-cream text-midnight">

      {/* Hero */}
      <section className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
        <div>
          <div className="inline-flex items-center gap-2 text-ocean text-sm font-medium mb-6 px-4 py-2 rounded-full border border-ocean/20 bg-ocean/5">
            <FileText className="w-4 h-4" />
            Build Spec — Mar 19, 2026
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            LO Buddy:<br />SMS Inbox Redesign
          </h1>
          <p className="text-xl text-midnight/70 leading-relaxed mb-4">
            The current inbox is a flat approval queue. This spec redesigns it into a threaded conversation hub — modeled on iMessage and Intercom patterns that LOs already understand.
          </p>
          <p className="text-base text-midnight/60 leading-relaxed">
            Written by LOB-Jasper · Status: Research Complete — Ready for Implementation
          </p>
        </div>
      </section>

      {/* Current State */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
          <div className="flex items-start gap-4 mb-6">
            <AlertTriangle className="w-10 h-10 text-amber-500 flex-shrink-0" />
            <div>
              <h2 className="font-display text-3xl font-semibold mb-2">Current State</h2>
              <p className="text-midnight/60">What exists today and why it doesn&apos;t scale.</p>
            </div>
          </div>
          <ul className="space-y-3 text-midnight/70">
            {[
              'Flat list of individual messages — no threading',
              'Only shows status=pending — approved messages disappear',
              'No way to see outbound messages you\'ve sent',
              'No search, no filtering',
              'No per-contact unread indicators',
              '30-second polling (no realtime)',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Redesigned Layout */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
          <div className="flex items-start gap-4 mb-8">
            <Layout className="w-10 h-10 text-ocean flex-shrink-0" />
            <div>
              <h2 className="font-display text-3xl font-semibold mb-2">Redesigned Layout</h2>
              <p className="text-midnight/60">Split-pane on desktop. Full-screen list → detail on mobile.</p>
            </div>
          </div>

          <div className="bg-midnight/3 rounded-xl border border-midnight/8 p-6 font-mono text-xs text-midnight/70 overflow-x-auto mb-8">
            <pre>{`┌─────────────────────────────────────────────────────────┐
│ SMS Inbox                              🔍 Search  ⚙️    │
├──────────────────┬──────────────────────────────────────┤
│ CONVERSATIONS    │  THREAD: John Smith                   │
│                  │  ─────────────────────────            │
│ ● John Smith   2│  [12:15] John: Hey, do I need to     │
│   "Do I need..." │  send that tax return?                │
│                  │                                       │
│   Sarah Jones    │  [12:18] You: Yes! Please send your  │
│   "Thanks for..."│  2024 tax return to...               │
│                  │                                       │
│ ● Mike Wilson  1│  [3:45] John: Also, the HOA docs?    │
│   "What rate..." │                                       │
│                  │  ┌─────────────────────────────────┐ │
│ ─── UNKNOWN ──── │  │ AI Draft: "Great question! The  │ │
│ ● (425) 555-0199│  │ HOA docs are..."  ✏️ Edit        │ │
│   "Is this..."   │  │ [Send ✓] [Dismiss ✕]            │ │
│                  │  └─────────────────────────────────┘ │
└──────────────────┴──────────────────────────────────────┘`}</pre>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-ocean/5 rounded-xl p-5 border border-ocean/10">
              <div className="flex items-center gap-2 mb-3">
                <Layout className="w-5 h-5 text-ocean" />
                <h3 className="font-semibold text-midnight">Desktop: Split-Pane</h3>
              </div>
              <ul className="space-y-2 text-sm text-midnight/70">
                <li>Left sidebar: conversation list</li>
                <li>Right panel: full thread</li>
                <li>Search + tab filters at top</li>
                <li>AI draft banner inline</li>
                <li>Compose bar always visible</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-midnight">Mobile: List → Detail</h3>
              </div>
              <ul className="space-y-2 text-sm text-midnight/70">
                <li>Full-screen conversation list</li>
                <li>Tap → slides into thread view</li>
                <li>Back button returns to list</li>
                <li>Same UX as iMessage</li>
                <li>Draft & compose at bottom</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Data Model */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
          <div className="flex items-start gap-4 mb-6">
            <Database className="w-10 h-10 text-ocean flex-shrink-0" />
            <div>
              <h2 className="font-display text-3xl font-semibold mb-2">Data Model</h2>
              <p className="text-midnight/60">Minimal changes — leverage what already exists.</p>
            </div>
          </div>
          <p className="text-midnight/70 mb-6">
            Messages are already stored in <code className="bg-midnight/5 px-2 py-0.5 rounded text-sm">ghl_inbound_messages</code> with <code className="bg-midnight/5 px-2 py-0.5 rounded text-sm">ghl_contact_id</code>. Conversations are just a GROUP BY — no new message tables needed.
          </p>
          <div className="bg-midnight/3 rounded-xl border border-midnight/8 p-6 font-mono text-xs text-midnight/70 overflow-x-auto mb-6">
            <pre>{`-- Conversations = distinct contacts with messages
SELECT DISTINCT ON (ghl_contact_id)
  ghl_contact_id, contact_id,
  body as last_message,
  received_at as last_message_at
FROM ghl_inbound_messages
WHERE team_id = $1
ORDER BY ghl_contact_id, received_at DESC;

-- New: sms_read_state for unread tracking
CREATE TABLE public.sms_read_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  contact_id UUID NOT NULL REFERENCES public.contacts(id),
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, contact_id)
);`}</pre>
          </div>
          <p className="text-sm text-midnight/50">One new table. That&apos;s it.</p>
        </div>
      </section>

      {/* API Changes */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
          <div className="flex items-start gap-4 mb-8">
            <Code className="w-10 h-10 text-ocean flex-shrink-0" />
            <div>
              <h2 className="font-display text-3xl font-semibold mb-2">New API Endpoints</h2>
              <p className="text-midnight/60">Three new routes power the full inbox.</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              {
                method: 'GET',
                path: '/api/sms/conversations',
                desc: 'Conversation list with last message, unread count, contact info. Supports ?search= and ?tab=all|unknown|unread',
                color: 'bg-ocean/10 text-ocean',
              },
              {
                method: 'GET',
                path: '/api/sms/conversations/[contactId]/messages',
                desc: 'All messages (inbound + outbound) for a contact, ordered chronologically. Returns contact info and AI draft if pending.',
                color: 'bg-ocean/10 text-ocean',
              },
              {
                method: 'POST',
                path: '/api/sms/conversations/[contactId]/read',
                desc: 'Updates sms_read_state.last_read_at. Called when a conversation thread is opened.',
                color: 'bg-green-100 text-green-700',
              },
            ].map((endpoint) => (
              <div key={endpoint.path} className="border border-midnight/8 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${endpoint.color}`}>{endpoint.method}</span>
                  <code className="text-sm font-mono text-midnight/80">{endpoint.path}</code>
                </div>
                <p className="text-sm text-midnight/60">{endpoint.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
          <div className="flex items-start gap-4 mb-8">
            <Bell className="w-10 h-10 text-ocean flex-shrink-0" />
            <div>
              <h2 className="font-display text-3xl font-semibold mb-2">Notification System</h2>
              <p className="text-midnight/60">Awareness at every level — inbox, sidebar, contact, opportunity.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Toast', desc: 'Real-time popup on inbound SMS (already built)', status: '✅ Exists' },
              { label: 'Sidebar Badge', desc: 'Total unread count in nav (needs real data source)', status: '⚠️ Needs wire-up' },
              { label: 'Contact Page Badge', desc: '"📱 2 new texts" on contact detail view', status: '🔨 New' },
              { label: 'Opportunity Badge', desc: 'Same badge on the borrower\'s opportunity card', status: '🔨 New' },
            ].map((item) => (
              <div key={item.label} className="bg-midnight/2 rounded-xl p-5 border border-midnight/6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-midnight">{item.label}</h3>
                  <span className="text-xs text-midnight/50">{item.status}</span>
                </div>
                <p className="text-sm text-midnight/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spam Detection */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
          <div className="flex items-start gap-4 mb-6">
            <Shield className="w-10 h-10 text-ocean flex-shrink-0" />
            <div>
              <h2 className="font-display text-3xl font-semibold mb-2">Spam Detection</h2>
              <p className="text-midnight/60">Phase 1: rule-based. Phase 2: AI classification (future sprint).</p>
            </div>
          </div>
          <div className="bg-midnight/3 rounded-xl border border-midnight/8 p-6 font-mono text-xs text-midnight/70 overflow-x-auto mb-6">
            <pre>{`function isLikelySpam(body: string): boolean {
  const patterns = [
    /\\bunsubscribe\\b/i,
    /\\bfree\\s+(quote|consultation)\\b/i,
    /\\bclick\\s+(here|now)\\b/i,
    /\\bopt[- ]?out\\b/i,
    /\\breply\\s+stop\\b/i,
    /bit\\.ly|tinyurl/i,
  ];
  return patterns.some(p => p.test(body));
}`}</pre>
          </div>
          <p className="text-sm text-midnight/60">Spam messages auto-set to <code className="bg-midnight/5 px-2 py-0.5 rounded">dismissed</code> status and appear only in a Spam tab.</p>
        </div>
      </section>

      {/* Auto-Draft Improvements */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
          <div className="flex items-start gap-4 mb-8">
            <Zap className="w-10 h-10 text-amber-500 flex-shrink-0" />
            <div>
              <h2 className="font-display text-3xl font-semibold mb-2">Auto-Draft Improvements</h2>
              <p className="text-midnight/60">Better context = better AI replies.</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              {
                title: 'Full SMS history context',
                desc: 'Inject all messages from ghl_inbound_messages (not just Pinecone semantic search). Sequential context matters.',
              },
              {
                title: 'Smarter persona routing',
                desc: 'Active opportunity → respond about their loan. Realtor → referral context. Unknown → qualification questions. Spam → flag, skip draft.',
              },
              {
                title: 'Quick-reply suggestions',
                desc: '3 one-tap replies below the full draft: "Got it, I\'ll follow up today" / "Can you send that document?" / "Let me check and get back to you"',
              },
              {
                title: 'Draft quality indicator',
                desc: '"🤖 AI Draft" badge with context age warning if opportunity was updated after last message.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <ArrowRight className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-midnight mb-1">{item.title}</h3>
                  <p className="text-sm text-midnight/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Phases */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
          <div className="flex items-start gap-4 mb-8">
            <Clock className="w-10 h-10 text-ocean flex-shrink-0" />
            <div>
              <h2 className="font-display text-3xl font-semibold mb-2">Implementation Phases</h2>
              <p className="text-midnight/60">Estimated total: 2–3 days of focused work.</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { phase: '1', what: 'Conversation list API + thread API', effort: '2–3 hrs', impact: 'Foundation' },
              { phase: '2', what: 'Split-pane inbox UI (desktop + mobile)', effort: '3–4 hrs', impact: 'Core UX' },
              { phase: '3', what: 'Unread tracking (sms_read_state)', effort: '1–2 hrs', impact: 'Notifications' },
              { phase: '4', what: 'Contact/opportunity SMS badges', effort: '1 hr', impact: 'Awareness' },
              { phase: '5', what: 'Name reconciliation banner', effort: '1–2 hrs', impact: 'Data quality' },
              { phase: '6', what: 'Spam detection (rule-based)', effort: '1 hr', impact: 'Inbox hygiene' },
              { phase: '7', what: 'Quick-reply suggestions', effort: '1–2 hrs', impact: 'Speed' },
              { phase: '8', what: 'Enhanced auto-draft context', effort: '2 hrs', impact: 'AI quality' },
            ].map((row) => (
              <div key={row.phase} className="flex items-center gap-4 p-4 border border-midnight/6 rounded-xl">
                <span className="w-8 h-8 rounded-full bg-ocean/10 text-ocean text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {row.phase}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-midnight text-sm">{row.what}</p>
                </div>
                <span className="text-xs text-midnight/40 w-16 text-right">{row.effort}</span>
                <span className="text-xs bg-ocean/10 text-ocean px-2 py-1 rounded-full hidden md:block">{row.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Files to Change */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
          <div className="flex items-start gap-4 mb-8">
            <CheckCircle className="w-10 h-10 text-green-500 flex-shrink-0" />
            <div>
              <h2 className="font-display text-3xl font-semibold mb-2">Files to Create / Modify</h2>
              <p className="text-midnight/60">Exactly what gets touched.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" /> New Files
              </h3>
              <ul className="space-y-2 font-mono text-xs text-midnight/70">
                {[
                  'app/api/sms/conversations/route.ts',
                  'app/api/sms/conversations/[contactId]/messages/route.ts',
                  'app/api/sms/conversations/[contactId]/read/route.ts',
                  'components/inbox/conversation-list.tsx',
                  'components/inbox/conversation-thread.tsx',
                  'components/inbox/inbox-layout.tsx',
                  'lib/spam-detector.ts',
                  'supabase/migrations/XXXXXX_sms_read_state.sql',
                ].map((f) => (
                  <li key={f} className="bg-green-50 px-3 py-1.5 rounded">{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Modified Files
              </h3>
              <ul className="space-y-2 font-mono text-xs text-midnight/70">
                {[
                  'app/(auth)/inbox/page.tsx',
                  'components/layout/desktop-sidebar.tsx',
                  'components/contacts/contact-detail-panel.tsx',
                  'components/opportunities/opportunity-detail-view.tsx',
                  'app/api/integrations/lo-ninja/webhook/route.ts',
                  'services/ghl-draft.service.ts',
                ].map((f) => (
                  <li key={f} className="bg-amber-50 px-3 py-1.5 rounded">{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Design Rules */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto pb-24">
        <div className="bg-midnight rounded-2xl p-8 md:p-10 text-cream">
          <div className="flex items-start gap-4 mb-8">
            <Eye className="w-10 h-10 text-amber-400 flex-shrink-0" />
            <div>
              <h2 className="font-display text-3xl font-semibold mb-2">Design Rules</h2>
              <p className="text-cream/60">Non-negotiable constraints for every component.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { rule: 'Brand colors', detail: '#FFBA00 gold + stone palette' },
              { rule: 'No gradients', detail: 'Flat solid colors only' },
              { rule: 'No Framer Motion', detail: 'CSS transitions only' },
              { rule: 'Mobile-first', detail: 'List view mobile, split-pane desktop' },
              { rule: 'Dark mode', detail: 'Use dark: Tailwind variants throughout' },
              { rule: 'Outbound bubbles', detail: 'bg-amber-50 border-amber-200 (light)' },
              { rule: 'Inbound bubbles', detail: 'bg-stone-100 (light) / bg-stone-800 (dark)' },
              { rule: 'Unread indicator', detail: 'bg-blue-500 dot (6px)' },
            ].map((item) => (
              <div key={item.rule} className="bg-white/5 rounded-xl p-4">
                <p className="font-semibold text-cream mb-1">{item.rule}</p>
                <p className="text-sm text-cream/50 font-mono">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
