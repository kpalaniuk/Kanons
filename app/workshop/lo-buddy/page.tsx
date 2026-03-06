'use client'

import { useState } from 'react'
import {
  Sparkles, Mic, Zap, GitBranch, CheckSquare, Lightbulb,
  Clock, AlertCircle, ArrowRight, ExternalLink, Database
} from 'lucide-react'

const sprint = {
  name: 'Sprint 2 — Voice Intelligence + Soul',
  goal: 'Full voice AI overhaul: state machine, intent classifier, cross-session memory, and SOUL.md deployed. LO Buddy now knows who it is, who it serves, and what it will never do.',
  status: 'In Progress — GH Group testing next',
  preview: 'https://lo-buddy-git-chad-kyle-palaniuks-projects.vercel.app',
}

const blocking: { id: string; title: string; detail: string; sql: string; where: string }[] = []

const inProgress = [
  { id: 'T-01', title: 'GH Group live testing — onboarding → new leads → pipeline', owner: 'Kyle + Ceda', priority: 'high' },
  { id: 'T-02', title: 'GHL outbound messaging end-to-end test', owner: 'LOB-Jasper', priority: 'high' },
  { id: 'T-03', title: 'KB → AI integration (AI pulls lender guides into responses)', owner: 'LOB-Jasper', priority: 'medium' },
  { id: 'T-04', title: 'SDMC onboarding — after GH Group results', owner: 'Kyle', priority: 'medium' },
]

const done = [
  { id: 'V-01', title: 'Page context → AI (knows what page you\'re on)', owner: 'LOB-Jasper' },
  { id: 'V-02', title: 'Dynamic action buttons (change after lead creation)', owner: 'LOB-Jasper' },
  { id: 'V-03', title: '12-message history (doubled from 6)', owner: 'LOB-Jasper' },
  { id: 'V-04', title: 'Last-action tracking (AI knows who "they" refers to)', owner: 'LOB-Jasper' },
  { id: 'V-05', title: 'Structured quick capture (no ambiguous text to AI)', owner: 'LOB-Jasper' },
  { id: 'V-06', title: 'Transcript review (editable, 3s auto-send)', owner: 'LOB-Jasper' },
  { id: 'V-07', title: 'Timeout + cancel (5s cancel button, 20s hard timeout)', owner: 'LOB-Jasper' },
  { id: 'V-10', title: 'Conversation State Machine — voice-state-machine.ts', owner: 'LOB-Jasper', commit: 'ed07471' },
  { id: 'V-11', title: 'Structured action buttons (gold/outlined/ghost hierarchy)', owner: 'LOB-Jasper', commit: 'ed07471' },
  { id: 'V-12', title: 'Short-circuit responses (zero LLM call for predictable actions)', owner: 'LOB-Jasper', commit: 'ed07471' },
  { id: 'V-13', title: 'Active entity tracking (no more duplicate leads)', owner: 'LOB-Jasper', commit: 'ed07471' },
  { id: 'DB-01', title: 'Supabase migration — flow_state + active_entity columns ✅', owner: 'Kyle' },
  { id: 'V-14', title: 'Intent classifier — zero-LLM pattern matching for 11 intent types', owner: 'LOB-Jasper', commit: '1fe8166' },
  { id: 'V-15', title: 'Memory namespace fallback — Pinecone always works (no more silent failures)', owner: 'LOB-Jasper', commit: '1fe8166' },
  { id: 'V-16', title: 'Cold-start session recall — AI remembers last 3 sessions on new conversation', owner: 'LOB-Jasper', commit: '1fe8166' },
  { id: 'S-01', title: 'SOUL.md — full identity, security protocols, account + user customization', owner: 'LOB-Jasper', commit: 'baaecdd' },
  { id: 'S-02', title: 'Full soul injection into every prompt (was 4 lines, now complete document)', owner: 'LOB-Jasper', commit: 'baaecdd' },
  { id: 'S-03', title: 'Per-team soul config wired (tone, cadence, geography, loan focus)', owner: 'LOB-Jasper', commit: 'baaecdd' },
  { id: 'S-04', title: 'Per-user preferences injected (first name, verbosity, loan types)', owner: 'LOB-Jasper', commit: 'baaecdd' },
  { id: 'S1-01', title: 'Sprint 1 audit completed', owner: 'LOB-Jasper' },
  { id: 'S1-02', title: 'Inbox threading API', owner: 'LOB-Jasper' },
  { id: 'S1-03', title: 'Unknown contact classification UI', owner: 'LOB-Jasper' },
  { id: 'S2-01', title: 'Scenario Comparison component', owner: 'LOB-Jasper' },
  { id: 'S2-02', title: 'Underwriter Knowledge Base', owner: 'LOB-Jasper' },
]

const backlog = [
  { id: 'N-01', title: 'GH Group contact bulk import from GHL', owner: '', priority: 'high' },
  { id: 'N-02', title: 'Communications inbox — full SMS + email unification', owner: '', priority: 'high' },
  { id: 'N-03', title: 'Scenario PDF export (branded)', owner: '', priority: 'medium' },
  { id: 'N-04', title: 'Rate stack parser (lender rate sheet → auto-populate scenarios)', owner: '', priority: 'medium' },
  { id: 'N-05', title: 'Proactive follow-up nudges (AI texts LO when deal goes stale)', owner: '', priority: 'medium' },
  { id: 'N-06', title: 'Custom fee sheets per lender', owner: '', priority: 'medium' },
  { id: 'N-07', title: 'Weekly pipeline digest (Monday morning summary)', owner: '', priority: 'low' },
  { id: 'V-20', title: 'Mobile-first one-handed voice UX (driving between appointments)', owner: '', priority: 'high' },
  { id: 'V-21', title: 'LOB character animation while listening', owner: '', priority: 'medium' },
]

const ideas = [
  { text: 'Voice input that feels like leaving a voicemail — natural, async', tag: 'UX' },
  { text: 'LOB character reacts to voice with subtle animation while listening', tag: 'Character' },
  { text: 'Auto-detect command vs. note vs. follow-up intent from voice', tag: 'AI' },
  { text: 'WhatsApp-style voice note playback in the inbox', tag: 'Inbox' },
]

const links = [
  { label: 'GitHub — LO Buddy', href: 'https://github.com/kpalaniuk/lo-buddy', icon: GitBranch },
  { label: 'Vercel Preview', href: sprint.preview, icon: ExternalLink },
  { label: 'Character Page', href: '/workshop/lo-buddy/character', icon: Sparkles },
  { label: 'Supabase SQL Editor', href: 'https://supabase.com/dashboard/project/vzkjlgcpggwyxcewukaq/sql', icon: Database },
]

const priorityColor = (p: string) =>
  p === 'high' ? 'bg-red-100 text-red-700' :
  p === 'medium' ? 'bg-amber-100 text-amber-700' :
  'bg-slate-100 text-slate-500'

export default function LOBuddyControlCenter() {
  const [newIdea, setNewIdea] = useState('')
  const [localIdeas, setLocalIdeas] = useState(ideas)
  const [sqlCopied, setSqlCopied] = useState(false)

  function addIdea() {
    if (!newIdea.trim()) return
    setLocalIdeas(prev => [{ text: newIdea.trim(), tag: 'Idea' }, ...prev])
    setNewIdea('')
  }

  function copySql(sql: string) {
    navigator.clipboard.writeText(sql)
    setSqlCopied(true)
    setTimeout(() => setSqlCopied(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center">
              <Mic className="text-white" size={20} />
            </div>
            <h1 className="font-display text-3xl text-midnight">LO Buddy Control Center</h1>
          </div>
          <p className="text-midnight/50 text-sm">Kyle · Ceda · LOB-Jasper — shared workspace</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 border border-cyan-200 rounded-full">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-cyan-700">Active Development</span>
        </div>
      </div>

      {/* Sprint Banner */}
      <div className="bg-midnight text-cream rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Zap size={16} className="text-amber-400" />
          <span className="text-sm font-medium text-amber-400 uppercase tracking-wide">Current Sprint</span>
        </div>
        <h2 className="font-display text-2xl mb-2">{sprint.name}</h2>
        <p className="text-cream/70 text-sm max-w-2xl mb-4">{sprint.goal}</p>
        <a
          href={sprint.preview}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-cream/10 hover:bg-cream/20 border border-cream/20 rounded-lg text-sm text-cream transition-colors"
        >
          <ExternalLink size={13} /> View Preview Build
        </a>
      </div>

      {/* Blocker */}
      {blocking.map(b => (
        <div key={b.id} className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-red-600" />
            <span className="text-sm font-semibold text-red-700">🚨 Action Required — {b.title}</span>
          </div>
          <p className="text-sm text-red-700 mb-3">{b.detail}</p>
          <p className="text-xs font-medium text-red-600 mb-2">Run in: {b.where}</p>
          <div className="relative">
            <pre className="bg-red-100 text-red-800 text-xs rounded-xl p-4 overflow-x-auto font-mono">{b.sql}</pre>
            <button
              onClick={() => copySql(b.sql)}
              className="absolute top-3 right-3 px-2 py-1 bg-red-200 hover:bg-red-300 text-red-800 text-xs rounded-lg transition-colors"
            >
              {sqlCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      ))}

      {/* Sprint Board */}
      <div>
        <h2 className="font-display text-xl text-midnight mb-4 flex items-center gap-2">
          <CheckSquare size={18} /> Sprint Board
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* In Progress */}
          <div className="bg-cream rounded-2xl p-4 border border-midnight/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full" />
              <span className="text-xs font-semibold text-midnight/50 uppercase tracking-wide">In Progress</span>
            </div>
            <div className="space-y-2">
              {inProgress.map(t => (
                <div key={t.id} className="bg-white rounded-xl p-3 border border-midnight/5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs text-midnight/30 font-mono">{t.id}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${priorityColor(t.priority)}`}>{t.priority}</span>
                  </div>
                  <p className="text-sm text-midnight font-medium">{t.title}</p>
                  {t.owner && <p className="text-xs text-midnight/40 mt-1">{t.owner}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Backlog */}
          <div className="bg-cream rounded-2xl p-4 border border-midnight/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-ocean rounded-full" />
              <span className="text-xs font-semibold text-midnight/50 uppercase tracking-wide">Backlog</span>
            </div>
            <div className="space-y-2">
              {backlog.map(t => (
                <div key={t.id} className="bg-white rounded-xl p-3 border border-midnight/5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs text-midnight/30 font-mono">{t.id}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${priorityColor(t.priority)}`}>{t.priority}</span>
                  </div>
                  <p className="text-sm text-midnight font-medium">{t.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Done */}
          <div className="bg-cream rounded-2xl p-4 border border-midnight/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs font-semibold text-midnight/50 uppercase tracking-wide">Done ({done.length})</span>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {done.map(t => (
                <div key={t.id} className="bg-white rounded-xl p-3 border border-midnight/5 opacity-60">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-xs text-midnight/30 font-mono">{t.id}</span>
                    {'commit' in t && t.commit && (
                      <span className="text-xs text-midnight/20 font-mono">{t.commit}</span>
                    )}
                  </div>
                  <p className="text-sm text-midnight line-through">{t.title}</p>
                  {t.owner && <p className="text-xs text-midnight/40 mt-1">{t.owner}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What We Built Tonight */}
      <div className="bg-midnight/5 border border-midnight/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-cyan-600" />
          <h2 className="font-display text-lg text-midnight">What We Built Tonight (Ceda + LOB-Jasper)</h2>
        </div>
        <div className="space-y-4 text-sm text-midnight/80">
          <div>
            <p className="font-semibold text-midnight mb-1">🔧 7 Voice Fixes — deployed to chad branch</p>
            <ul className="space-y-1 pl-4 list-disc text-midnight/60">
              <li>AI now knows what page you're on — no more "which opportunity?"</li>
              <li>Buttons change after actions (post-lead: "Set Follow-up / Build Scenario")</li>
              <li>History doubled from 6 → 12 messages</li>
              <li>AI tracks last action so "they" / "it" always resolves correctly</li>
              <li>Structured quick capture — no ambiguous text sent to AI</li>
              <li>Editable transcript review after voice — auto-sends in 3s</li>
              <li>Processing timeout + cancel button at 5s / hard stop at 20s</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-midnight mb-1">🧠 Conversation State Machine — commit ed07471</p>
            <ul className="space-y-1 pl-4 list-disc text-midnight/60">
              <li>Tracks flow state: idle → lead_creation:awaiting_contact → lead_creation:complete → etc.</li>
              <li>Short-circuits LLM for predictable responses (zero cost, zero latency)</li>
              <li>Injects context into AI when it does need to run ("you're working on Chad Clinton")</li>
              <li>Structured buttons: gold primary / outlined secondary / ghost</li>
              <li>Before: tap "I'll add later" → AI re-creates lead → 2 Chad Clintons 🤦</li>
              <li>After: tap "I'll add later" → instant "Got it, Chad Clinton is in your pipeline" → buttons flip ✅</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-midnight mb-1">⚡ Intent Classifier + Memory Fixes — commit 1fe8166</p>
            <ul className="space-y-1 pl-4 list-disc text-midnight/60">
              <li><strong>Intent classifier</strong>: 11 LO-specific patterns — greetings, help, and navigation return <em>instantly</em> with zero LLM call</li>
              <li>High-confidence intents (new lead, log call, pipeline, scenario, etc.) auto-route to the right AI module</li>
              <li><strong>Memory namespace fallback</strong>: Pinecone was silently failing when team membership query failed — now falls back to user-level namespace. Memory always works.</li>
              <li><strong>Cold-start session recall</strong>: New conversations inject snippets from last 3 sessions so the AI isn't flying blind</li>
              <li>Result: say "Hey" → instant response, zero latency, zero cost. Say "New lead" → routes straight to capture module, no model-selection overhead</li>
            </ul>
          </div>
          <p className="text-midnight/50 text-xs">✅ DB migration done. State machine fully live. All 3 systems (classifier → state machine → memory) deployed to chad branch.</p>
        </div>
      </div>

      {/* Ideas Parking Lot */}
      <div>
        <h2 className="font-display text-xl text-midnight mb-4 flex items-center gap-2">
          <Lightbulb size={18} /> Ideas &amp; Notes
        </h2>
        <div className="bg-cream rounded-2xl p-5 border border-midnight/10">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newIdea}
              onChange={e => setNewIdea(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addIdea()}
              placeholder="Drop an idea or note..."
              className="flex-1 bg-white border border-midnight/10 rounded-xl px-4 py-2 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={addIdea}
              className="px-4 py-2 bg-midnight text-cream rounded-xl text-sm font-medium hover:bg-ocean transition-colors"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {localIdeas.map((idea, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-midnight/5">
                <span className="mt-0.5 px-2 py-0.5 bg-cyan-50 text-cyan-700 text-xs rounded-full font-medium flex-shrink-0">{idea.tag}</span>
                <p className="text-sm text-midnight">{idea.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="font-display text-xl text-midnight mb-4 flex items-center gap-2">
          <ArrowRight size={18} /> Quick Links
        </h2>
        <div className="flex flex-wrap gap-3">
          {links.map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-2 px-4 py-2 bg-cream border border-midnight/10 rounded-xl text-sm font-medium text-midnight hover:border-cyan-400 hover:text-cyan-700 transition-colors"
            >
              <Icon size={14} />
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* LOB-Jasper context note */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={16} className="text-amber-600" />
          <span className="text-sm font-semibold text-amber-700">For LOB-Jasper</span>
        </div>
        <p className="text-sm text-amber-700">
          Deploy key: <code className="bg-amber-100 px-1 rounded">/data/.ssh/dashboard-deploy</code> · 
          Repo: <code className="bg-amber-100 px-1 rounded">/data/projects/kanons/</code> · 
          SSH alias: <code className="bg-amber-100 px-1 rounded">github.com-kanons-lob</code> · 
          Always <code className="bg-amber-100 px-1 rounded">git pull</code> before editing. 
          Run <code className="bg-amber-100 px-1 rounded">npx tsc --noEmit</code> before pushing. 
          Vercel auto-deploys from main. LO Buddy branch: <code className="bg-amber-100 px-1 rounded">chad</code>.
        </p>
      </div>

    </div>
  )
}
