'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Circle, ChevronDown, ChevronUp, Download, RefreshCw, AlertCircle, Info } from 'lucide-react'

// ─── TYPES ───────────────────────────────────────────────────────────────────

type AnswerType = 'radio' | 'checkbox' | 'text' | 'select'

interface Option { value: string; label: string; detail?: string }

interface Question {
  id: string
  text: string
  why: string
  type: AnswerType
  options?: Option[]
  placeholder?: string
}

interface Section {
  id: string
  title: string
  emoji: string
  subtitle: string
  questions: Question[]
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const sections: Section[] = [
  {
    id: 'api-billing',
    title: 'API & Billing Model',
    emoji: '💳',
    subtitle: 'Who pays for what. Every service a client bot touches needs a budget owner.',
    questions: [
      {
        id: 'openrouter-model',
        text: 'Who manages OpenRouter (the LLM API covering Claude, GPT-4, Gemini, Llama, etc.)?',
        why: 'OpenRouter covers 400+ text AI models in one API. Every bot call goes here. This is the core AI bill.',
        type: 'radio',
        options: [
          { value: 'hotclaw', label: 'Hotclaw pays & manages one key for all clients', detail: 'We absorb LLM costs, build into monthly retainer. Risk: clients who over-use eat our margin.' },
          { value: 'byok', label: 'BYOK — client creates their own OpenRouter account + key', detail: 'We set up the account, they add a credit card. No throttling, no margin risk, scales cleanly. Recommended.' },
          { value: 'hybrid', label: 'Hotclaw key with per-client usage caps', detail: 'We manage one key, set spending limits per container. More overhead to monitor.' },
        ],
      },
      {
        id: 'runway-model',
        text: 'Who manages Runway (video generation)?',
        why: 'Runway is NOT on OpenRouter. It\'s a separate platform priced per second of video. One client doing heavy UGC can spend hundreds/month. Pro+ tier only.',
        type: 'radio',
        options: [
          { value: 'byok', label: 'BYOK — client gets their own Runway account & key', detail: 'Recommended. Their usage, their bill. We wire the key into their container.' },
          { value: 'hotclaw', label: 'Hotclaw pays & manages', detail: 'Not recommended — video gen costs are unpredictable. One viral campaign could blow the budget.' },
          { value: 'na', label: 'Not offered in current tiers', detail: 'Exclude Runway from all tiers for now, revisit when a client specifically requests it.' },
        ],
      },
      {
        id: 'elevenlabs-model',
        text: 'Who manages ElevenLabs (voice synthesis / TTS)?',
        why: 'ElevenLabs is NOT on OpenRouter. Priced per character of text converted to audio. At low volume (<100k chars/mo), cost is minimal (~$5-22). At scale it adds up.',
        type: 'radio',
        options: [
          { value: 'hotclaw', label: 'Hotclaw pays — one account, absorb the cost', detail: 'Simple for clients. Standard plan is $22/mo flat for 100k chars. Fine for launch at small scale.' },
          { value: 'byok', label: 'BYOK — client gets their own ElevenLabs account', detail: 'Recommended for Pro+ clients doing heavy voice work. Keeps cost liability off us.' },
          { value: 'hotclaw-basic', label: 'Hotclaw covers basic TTS, BYOK for voice cloning', detail: 'We cover standard voices. If client wants a cloned voice (their voice, brand voice), they get their own key.' },
        ],
      },
      {
        id: 'twilio-model',
        text: 'Who manages Twilio (SMS, voice calls, WhatsApp)?',
        why: 'Twilio is per-message / per-minute. Can\'t be shared cleanly across clients without number conflicts. Each client needs their own number.',
        type: 'radio',
        options: [
          { value: 'byok', label: 'BYOK — client creates Twilio account, buys their number', detail: 'Recommended. We configure it for them. Their number, their bill. Clean.' },
          { value: 'hotclaw-sub', label: 'Hotclaw Twilio account, client gets a subaccount', detail: 'Twilio supports subaccounts. More complex to manage but we retain control. Useful if client doesn\'t want to deal with Twilio setup.' },
        ],
      },
      {
        id: 'pinecone-model',
        text: 'Who manages Pinecone (vector memory for the bot)?',
        why: 'Pinecone lets bots remember things over time. We have one Hotclaw Pinecone account. Each client gets their own namespace (isolated, no cross-contamination). Starter plan is free, covers 50+ clients easily.',
        type: 'radio',
        options: [
          { value: 'hotclaw', label: 'Hotclaw manages — one account, namespace per client', detail: 'Recommended. Trivial cost at launch scale. We control the memory layer. Simpler onboarding.' },
          { value: 'byok', label: 'BYOK — client gets their own Pinecone account', detail: 'Overkill for most clients. Only consider for enterprise clients who want data sovereignty.' },
        ],
      },
      {
        id: 'supabase-model',
        text: 'Who manages Supabase (structured database for facts, events, activity)?',
        why: 'Supabase holds structured data — client roster, client facts, activity logs. We have one Hotclaw project. Each client gets their own schema.',
        type: 'radio',
        options: [
          { value: 'hotclaw', label: 'Hotclaw manages — one project, schema per client', detail: 'Recommended. Free tier covers early clients. We own the database infrastructure.' },
          { value: 'byok', label: 'BYOK — client gets their own Supabase project', detail: 'Consider for Pro+ clients with custom database needs or compliance requirements.' },
        ],
      },
    ],
  },
  {
    id: 'security',
    title: 'Security Posture',
    emoji: '🔒',
    subtitle: 'How strict do we lock things down? Client data, access control, incident response.',
    questions: [
      {
        id: 'container-isolation',
        text: 'Container isolation level for client bots?',
        why: 'Docker can isolate containers at different levels. Tighter = safer but more overhead.',
        type: 'radio',
        options: [
          { value: 'standard', label: 'Standard Docker isolation — separate networks, no shared filesystems', detail: 'Good for most clients. Containers can\'t see each other. Recommended for launch.' },
          { value: 'strict', label: 'Strict — add seccomp profiles, no-new-privileges, read-only rootfs', detail: 'Enterprise-grade. More setup. Recommended for financial or healthcare clients.' },
        ],
      },
      {
        id: 'audit-logging',
        text: 'Activity logging for client containers?',
        why: 'Do we log what the bot does? Useful for debugging and client reporting, but creates data you\'re responsible for.',
        type: 'radio',
        options: [
          { value: 'supabase', label: 'Log all significant events to Supabase (provision, deprovision, errors, SMS sent)', detail: 'Recommended. Searchable, auditable, feeds admin dashboard.' },
          { value: 'file', label: 'Log to files only — /data/clients/{name}/logs/', detail: 'Simpler. No external dependency. Harder to search across clients.' },
          { value: 'minimal', label: 'Minimal logging — errors only', detail: 'Less overhead but harder to debug client issues.' },
        ],
      },
      {
        id: 'client-data-access',
        text: 'Can Kyle and Ceda read client bot conversation history?',
        why: 'We need visibility for debugging and support. But clients may expect privacy.',
        type: 'radio',
        options: [
          { value: 'internal-only', label: 'Yes — internal access for support purposes, disclosed in TOS', detail: 'Recommended. Standard for hosted services. Put it in the contract.' },
          { value: 'none', label: 'No — client data is fully private, we can only see error logs', detail: 'Harder to support but gives clients stronger privacy guarantee.' },
        ],
      },
      {
        id: 'key-rotation',
        text: 'What\'s our process when a client reports a compromised API key?',
        why: 'Someone\'s OpenRouter key gets leaked. How fast do we respond?',
        type: 'radio',
        options: [
          { value: 'auto', label: 'SHC handles it — updates .env, restarts container, confirms in Discord. Target: <5 min.', detail: 'Recommended. SHC has the tooling to do this automatically.' },
          { value: 'manual', label: 'Kyle/Ceda handles manually via SSH', detail: 'Slower but simpler for now.' },
        ],
      },
    ],
  },
  {
    id: 'onboarding',
    title: 'Client Onboarding',
    emoji: '🚀',
    subtitle: 'What do we need from clients before we can provision? What do we do for them?',
    questions: [
      {
        id: 'client-effort',
        text: 'How much technical work should a client have to do to get onboarded?',
        why: 'The less they do, the better the experience. But some things require their account.',
        type: 'radio',
        options: [
          { value: 'minimal', label: 'As little as possible — we do 90% of the work', detail: 'Client creates OpenRouter account (5 min, we walk them through), gives us the key. We handle everything else.' },
          { value: 'guided', label: 'We guide them through setup calls for each integration', detail: 'More thorough. Good for complex setups (Twilio, custom domain, Slack). Takes longer.' },
          { value: 'self-serve', label: 'They complete a setup checklist we send, then we provision', detail: 'Fastest for us, more work for them. Risk of errors if they\'re not technical.' },
        ],
      },
      {
        id: 'required-from-client',
        text: 'What do we absolutely require from every client before provisioning?',
        why: 'The minimum set of things we can\'t do without.',
        type: 'checkbox',
        options: [
          { value: 'openrouter-key', label: 'OpenRouter API key (with billing set up)' },
          { value: 'business-name', label: 'Business name + what the bot should be called' },
          { value: 'use-case', label: 'Primary use case (which archetype)' },
          { value: 'contact-info', label: 'Contact name, phone, email' },
          { value: 'signed-contract', label: 'Signed service agreement + first month paid (Stripe)' },
          { value: 'channel-pref', label: 'Preferred communication channel (SMS, Slack, web chat)' },
        ],
      },
      {
        id: 'welcome-experience',
        text: 'What does the client experience in the first 24 hours after going live?',
        why: 'First impressions matter. What makes them go "wow"?',
        type: 'checkbox',
        options: [
          { value: 'welcome-sms', label: 'Welcome SMS from their new agent (their bot\'s first message to them)' },
          { value: 'live-url', label: 'Email with their live URL + login credentials' },
          { value: 'walkthrough-video', label: 'Short Loom walkthrough of their setup (recorded by Kyle or Ceda)' },
          { value: 'first-task', label: 'Bot proactively does its first task (sends a summary, checks the pipeline, etc.)' },
          { value: 'check-in-call', label: '24-hour check-in call (Kyle or Ceda)' },
        ],
      },
      {
        id: 'what-we-do-for-them',
        text: 'What does Hotclaw handle that the client never touches?',
        why: 'This is your value prop. Know it cold.',
        type: 'checkbox',
        options: [
          { value: 'domain', label: 'Subdomain setup (acme.hotclaw.ai) or custom domain' },
          { value: 'tls', label: 'TLS/HTTPS certificates (auto-renewed via Caddy)' },
          { value: 'docker', label: 'Docker container management (start, stop, restart, updates)' },
          { value: 'monitoring', label: 'Uptime monitoring + alerts if bot goes down' },
          { value: 'backups', label: 'Daily backups of bot workspace and memory' },
          { value: 'model-updates', label: 'Model upgrades (when a better AI releases, we upgrade them)' },
          { value: 'github-vercel', label: 'GitHub repo + Vercel deployments for any web tools we build' },
          { value: 'pinecone-supabase', label: 'Pinecone + Supabase infrastructure (memory + database)' },
          { value: 'soul-updates', label: 'SOUL.md updates when client wants bot behavior changes' },
        ],
      },
    ],
  },
  {
    id: 'channels',
    title: 'Communication Channels',
    emoji: '📡',
    subtitle: 'How do clients talk to their bots? How do bots reach their customers?',
    questions: [
      {
        id: 'default-channel',
        text: 'What\'s the default channel for every client bot?',
        why: 'Every client gets this by default, no extra setup required.',
        type: 'radio',
        options: [
          { value: 'web-chat', label: 'Web chat interface at {client}.hotclaw.ai', detail: 'No extra accounts needed. We build it. Clean and brandable.' },
          { value: 'sms', label: 'Twilio SMS — client gets a dedicated phone number', detail: 'Universal, zero friction for end users. Requires Twilio setup.' },
          { value: 'both', label: 'Both — web chat + SMS', detail: 'Best experience. Slightly more onboarding work.' },
        ],
      },
      {
        id: 'optional-channels',
        text: 'Which additional channels do we offer as add-ons?',
        why: 'Client-specific setups on request. Adds to their tier or billed separately.',
        type: 'checkbox',
        options: [
          { value: 'whatsapp', label: 'WhatsApp Business (via Twilio — they need a verified business account)' },
          { value: 'slack', label: 'Slack (bot joins their workspace — great for internal team bots)' },
          { value: 'discord', label: 'Discord (for community/creator clients — more complex setup)' },
          { value: 'email', label: 'Email (outbound reports + summaries via SendGrid)' },
          { value: 'voice', label: 'Voice calls (Twilio voice + ElevenLabs TTS — premium add-on)' },
        ],
      },
      {
        id: 'hotclaw-visibility',
        text: 'Should we be able to see client bot interactions for support purposes?',
        why: 'If something breaks, we need logs. But how much visibility do we want?',
        type: 'radio',
        options: [
          { value: 'errors-only', label: 'Error logs only — we see crashes and failures, not conversations' },
          { value: 'full-admin', label: 'Full admin access — we can read any conversation for support (disclosed in TOS)' },
          { value: 'on-request', label: 'On request only — client grants access when submitting a support ticket' },
        ],
      },
    ],
  },
  {
    id: 'tiers',
    title: 'Service Tiers',
    emoji: '📊',
    subtitle: 'What\'s in each tier? What can\'t clients do in lower tiers?',
    questions: [
      {
        id: 'tier-differentiation',
        text: 'How do we differentiate tiers? (We said NOT by model quality — all tiers get the best models.)',
        why: 'All tiers get Claude Sonnet+ via their own OpenRouter key. Differentiation must come from elsewhere.',
        type: 'checkbox',
        options: [
          { value: 'support', label: 'Support level (Lite = async email, Pro = priority, Pro+ = dedicated Slack channel)' },
          { value: 'channels', label: 'Number of channels (Lite = web chat only, Pro = + SMS, Pro+ = + voice + Slack)' },
          { value: 'soul-updates', label: 'SOUL.md customization (Lite = template, Pro = 1 custom revision, Pro+ = unlimited)' },
          { value: 'custom-tools', label: 'Custom skill building (Lite = none, Pro+ = we build custom integrations)' },
          { value: 'white-label', label: 'White-labeling (Pro+ only — custom domain, no Hotclaw branding)' },
          { value: 'resources', label: 'Container resources (Lite = 384MB/0.5CPU, Pro = 512MB/1CPU, Pro+ = 1GB/2CPU)' },
        ],
      },
      {
        id: 'lite-limits',
        text: 'What does Lite ($149/mo) NOT get?',
        why: 'Lite clients should be able to run independently with minimal support.',
        type: 'checkbox',
        options: [
          { value: 'no-sms', label: 'No SMS channel (web chat only)' },
          { value: 'no-voice', label: 'No voice/ElevenLabs' },
          { value: 'no-runway', label: 'No Runway video gen' },
          { value: 'no-custom-soul', label: 'No custom SOUL.md revisions (template only)' },
          { value: 'no-custom-skills', label: 'No custom skill building' },
          { value: 'no-white-label', label: 'No custom domain (must use {name}.hotclaw.ai)' },
          { value: 'async-support', label: 'Support via email only (48h response)' },
        ],
      },
      {
        id: 'manual-steps',
        text: 'Which onboarding steps will always require manual work from Kyle or Ceda?',
        why: 'Know what can\'t be automated so you can price and schedule correctly.',
        type: 'checkbox',
        options: [
          { value: 'soul-customization', label: 'SOUL.md customization (requires understanding the client\'s business)' },
          { value: 'sales-call', label: 'Initial sales + discovery call' },
          { value: 'twilio-setup', label: 'Twilio account setup + number purchase (walking client through it)' },
          { value: 'slack-setup', label: 'Slack app creation and installation to client workspace' },
          { value: 'custom-domain', label: 'Custom domain DNS configuration (if client has their own domain)' },
          { value: 'first-month-review', label: '30-day check-in call to tune the bot' },
        ],
      },
    ],
  },
]

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function PlannerPage() {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('hotclaw-planner-answers')
    if (saved) { try { setAnswers(JSON.parse(saved)) } catch {} }
  }, [])

  const setAnswer = (qid: string, value: string | string[]) => {
    const next = { ...answers, [qid]: value }
    setAnswers(next)
    localStorage.setItem('hotclaw-planner-answers', JSON.stringify(next))
  }

  const toggleCheckbox = (qid: string, value: string) => {
    const current = (answers[qid] as string[]) || []
    const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value]
    setAnswer(qid, next)
  }

  const totalQ = sections.reduce((s, sec) => s + sec.questions.length, 0)
  const answeredQ = sections.reduce((s, sec) => s + sec.questions.filter(q => {
    const a = answers[q.id]
    return a && (typeof a === 'string' ? a.length > 0 : a.length > 0)
  }).length, 0)
  const pct = Math.round((answeredQ / totalQ) * 100)

  const resetAll = () => {
    setAnswers({})
    localStorage.removeItem('hotclaw-planner-answers')
  }

  const getOptionLabel = (q: Question, value: string) => q.options?.find(o => o.value === value)?.label || value

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f8f7f4] pb-24">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/workshop/operation-hot-dog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-4">
            <ArrowLeft size={14} /> Back to HQ
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">🧭 Hotclaw Planner</h1>
              <p className="text-white/50 mt-1">Answer these questions to lock in how Hotclaw Solutions operates. Answers save automatically.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowSummary(!showSummary)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-400 transition-colors">
                {showSummary ? 'Hide' : 'View'} Summary
              </button>
              <button onClick={resetAll} className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
                <RefreshCw size={12} /> Reset
              </button>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/50">{answeredQ} of {totalQ} questions answered</span>
              <span className={`font-bold ${pct === 100 ? 'text-green-400' : pct > 60 ? 'text-orange-400' : 'text-white/50'}`}>{pct}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8 space-y-6">

        {/* Summary Panel */}
        {showSummary && (
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-6">
            <h2 className="font-bold text-lg mb-4 text-orange-400">📋 Decision Summary</h2>
            <div className="space-y-4">
              {sections.map(sec => (
                <div key={sec.id}>
                  <h3 className="text-sm font-semibold text-white/70 mb-2">{sec.emoji} {sec.title}</h3>
                  <div className="space-y-1.5 ml-4">
                    {sec.questions.map(q => {
                      const a = answers[q.id]
                      if (!a || (Array.isArray(a) && a.length === 0)) return (
                        <div key={q.id} className="text-xs text-white/30 italic">
                          {q.text.substring(0, 60)}... — <span className="text-amber-500">not answered</span>
                        </div>
                      )
                      return (
                        <div key={q.id} className="text-xs">
                          <span className="text-white/50">{q.text.substring(0, 50)}...:</span>{' '}
                          <span className="text-green-400 font-medium">
                            {Array.isArray(a)
                              ? a.map(v => getOptionLabel(q, v)).join(', ')
                              : getOptionLabel(q, a)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sections */}
        {sections.map(sec => {
          const secAnswered = sec.questions.filter(q => {
            const a = answers[q.id]
            return a && (typeof a === 'string' ? a.length > 0 : a.length > 0)
          }).length
          const isCollapsed = collapsed[sec.id]

          return (
            <div key={sec.id} className="rounded-2xl border border-white/10 overflow-hidden">
              <button onClick={() => setCollapsed(c => ({ ...c, [sec.id]: !c[sec.id] }))}
                className="w-full flex items-center gap-4 p-5 bg-white/[0.03] hover:bg-white/[0.05] transition-colors text-left">
                <span className="text-2xl">{sec.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-lg">{sec.title}</h2>
                  <p className="text-sm text-white/40 truncate">{sec.subtitle}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-sm font-medium ${secAnswered === sec.questions.length ? 'text-green-400' : 'text-white/40'}`}>
                    {secAnswered}/{sec.questions.length}
                  </span>
                  <div className={`text-white/40 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}>
                    <ChevronDown size={18} />
                  </div>
                </div>
              </button>

              {!isCollapsed && (
                <div className="divide-y divide-white/5">
                  {sec.questions.map(q => {
                    const a = answers[q.id]
                    const isAnswered = a && (typeof a === 'string' ? a.length > 0 : (a as string[]).length > 0)

                    return (
                      <div key={q.id} className="p-5">
                        <div className="flex items-start gap-2 mb-1">
                          {isAnswered
                            ? <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                            : <Circle size={16} className="text-white/20 flex-shrink-0 mt-0.5" />
                          }
                          <h3 className="font-semibold text-white text-sm leading-snug">{q.text}</h3>
                        </div>

                        <div className="flex items-start gap-1.5 ml-6 mb-4">
                          <Info size={11} className="text-white/30 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-white/40 leading-relaxed">{q.why}</p>
                        </div>

                        <div className="ml-6 space-y-2">
                          {q.type === 'radio' && q.options?.map(opt => {
                            const selected = a === opt.value
                            return (
                              <button key={opt.value} onClick={() => setAnswer(q.id, opt.value)}
                                className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                                  selected
                                    ? 'border-orange-500/50 bg-orange-500/10'
                                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                                }`}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${selected ? 'border-orange-400 bg-orange-400' : 'border-white/30'}`} />
                                  <span className={`text-sm font-medium ${selected ? 'text-orange-300' : 'text-white'}`}>{opt.label}</span>
                                </div>
                                {opt.detail && <p className="text-xs text-white/40 mt-1 ml-5">{opt.detail}</p>}
                              </button>
                            )
                          })}

                          {q.type === 'checkbox' && q.options?.map(opt => {
                            const checked = ((a as string[]) || []).includes(opt.value)
                            return (
                              <button key={opt.value} onClick={() => toggleCheckbox(q.id, opt.value)}
                                className={`w-full text-left rounded-xl border px-4 py-2.5 transition-all ${
                                  checked
                                    ? 'border-orange-500/50 bg-orange-500/10'
                                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                                }`}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3.5 h-3.5 rounded-md border-2 flex-shrink-0 flex items-center justify-center ${checked ? 'border-orange-400 bg-orange-400' : 'border-white/30'}`}>
                                    {checked && <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                  </div>
                                  <span className={`text-sm ${checked ? 'text-orange-300 font-medium' : 'text-white'}`}>{opt.label}</span>
                                </div>
                                {opt.detail && <p className="text-xs text-white/40 mt-1 ml-5">{opt.detail}</p>}
                              </button>
                            )
                          })}

                          {q.type === 'text' && (
                            <textarea
                              value={(a as string) || ''}
                              onChange={e => setAnswer(q.id, e.target.value)}
                              placeholder={q.placeholder || 'Type your answer...'}
                              rows={3}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 resize-none"
                            />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
          <p className="text-white/50 text-sm">Answers save automatically. Come back any time — progress is preserved.</p>
          <p className="text-white/30 text-xs mt-1">Click "View Summary" to export all decisions at once.</p>
        </div>
      </div>
    </div>
  )
}
