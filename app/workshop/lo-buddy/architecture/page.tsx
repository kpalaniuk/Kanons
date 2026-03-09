'use client'

import { useState } from 'react'
import { ArrowRight, ArrowDown, AlertTriangle, CheckCircle, Zap, GitBranch, FileCode, Brain, Layers, Cpu, Database, MessageSquare } from 'lucide-react'

// ─── Data ──────────────────────────────────────────────────────────────────

const oldFiles = [
  { name: 'tool-calling-agent.service.ts', lines: 3643, role: 'Main agent / tool executor', problem: 'Monolithic — accumulated conflicting logic from multiple devs/models over months', color: 'bg-red-100 border-red-300 text-red-800' },
  { name: 'voice-state-machine.ts', lines: 761, role: 'Pre-pipeline interceptor', problem: 'Intercepts BEFORE the AI pipeline runs. Conflicts with module selector on routing decisions', color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { name: 'model-router.service.ts', lines: 531, role: 'Model selection', problem: 'Maps only 3 task types → 3-5 hardcoded models. Ignores 95% of OpenRouter\'s catalog', color: 'bg-amber-100 border-amber-300 text-amber-800' },
  { name: 'prompt-cache.ts', lines: 493, role: 'System prompt builder', problem: 'Assembles prompt from competing sources — persona JSON, module injection, state context. No single source of truth', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  { name: 'module-selector.service.ts', lines: 200, role: 'Module routing', problem: 'Second routing layer that conflicts with voice-state-machine. No defined execution order between the two', color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { name: 'agent-modules/ (5 files)', lines: 750, role: 'Behavioral modules', problem: 'Each injects its own prompt section on top of base persona. Result: contradictory instructions in a single prompt', color: 'bg-red-100 border-red-300 text-red-800' },
  { name: 'LOBUDDY_PERSONA.json', lines: 100, role: 'AI identity (old)', problem: 'Competes with LOBUDDY_SOUL.md as the source of truth. Neither is clearly canonical', color: 'bg-slate-100 border-slate-300 text-slate-600' },
]

const newFiles = [
  { name: 'lo-buddy-runtime.ts', lines: 400, role: 'Master orchestrator', detail: 'Thin entry point. Calls initializer → classifier → builder → OR → memory write. Nothing else.', color: 'bg-cyan-50 border-cyan-300 text-cyan-800' },
  { name: 'session-initializer.ts', lines: 150, role: 'Soul + memory loader', detail: 'Runs once per conversation. Loads team soul, user prefs, Pinecone recall. Returns immutable SessionContext.', color: 'bg-cyan-50 border-cyan-300 text-cyan-800' },
  { name: 'intent-classifier.ts', lines: 150, role: 'Single router (replaces 2)', detail: 'Zero LLM cost. Absorbs voice-state-machine routing + module-selector into one rules-based function.', color: 'bg-green-50 border-green-300 text-green-800' },
  { name: 'prompt-builder.ts', lines: 200, role: 'Clean prompt composer', detail: 'One coherent document: soul + mode section + user prefs + opportunity context + memories. No competing injections.', color: 'bg-cyan-50 border-cyan-300 text-cyan-800' },
  { name: 'LOBUDDY_SOUL.md', lines: null, role: 'The intelligence (canonical)', detail: 'Absorbs LOBUDDY_PERSONA.json + all module behavior + business rules. Markdown → LLM reads it, no TypeScript needed.', color: 'bg-indigo-50 border-indigo-300 text-indigo-800' },
  { name: 'openrouter/auto', lines: 0, role: 'Model selection (20-line config)', detail: 'OR reads the actual prompt content and routes to its full catalog. Rich context → better model selection than any hardcoded map.', color: 'bg-green-50 border-green-300 text-green-800' },
]

const conflictZones = [
  {
    title: 'Who routes the request?',
    old: 'voice-state-machine.ts intercepts first — may short-circuit. If it doesn\'t, module-selector.service.ts runs. No defined execution order.',
    new: 'intent-classifier.ts. One function. One decision. Zero ambiguity.',
  },
  {
    title: 'What goes in the system prompt?',
    old: 'LOBUDDY_PERSONA.json + active module injection + voice state context injection + opportunity context. Assembled by prompt-cache.ts with no guarantee of coherence.',
    new: 'LOBUDDY_SOUL.md rendered as one document. Soul section + mode-specific section + user/team context. Built once by prompt-builder.ts.',
  },
  {
    title: 'Which model runs?',
    old: 'model-router.service.ts maps task type → one of 3-5 hardcoded model strings. 95% of OpenRouter\'s catalog is never considered.',
    new: 'openrouter/auto receives the full rich prompt context and picks from the entire catalog. A DTI calculation gets a reasoning model. A "log this call" gets fast+cheap.',
  },
  {
    title: 'What does the AI remember between sessions?',
    old: 'Only within context window. Pinecone exists but write path is inconsistent — some turns write, many don\'t. AI "forgets" anything outside 12-message history.',
    new: 'Every turn writes to Pinecone. Every session start recalls. The AI progressively knows the LO\'s patterns, partner relationships, and deal history.',
  },
  {
    title: 'What happens after a lead is captured?',
    old: 'Nothing autonomous. The AI answers the request and stops. Follow-up, partner identification, task creation — none of it happens unless explicitly asked.',
    new: 'Soul doc has 8 standing internal goals. After capture: Pinecone write, proactive suggestedActions[] generated, follow-up task created — automatically.',
  },
]

const movesToSoul = [
  { file: 'services/auto-task.rules.ts', what: 'Follow-up strategy rules' },
  { file: 'services/auto-task.rule-set.ts', what: 'Strategy templates per lead type' },
  { file: 'services/agent-modules/proactive-engine.ts', what: 'Proactive suggestion logic' },
  { file: 'services/agent-modules/module-selector.service.ts', what: 'Routing intent descriptions' },
  { file: 'services/voice-state-machine.ts (state descriptions)', what: 'Conversational flow intent' },
  { file: 'services/soul-security.service.ts', what: 'Security rules (already in soul)' },
]

const totalOld = oldFiles.reduce((acc, f) => acc + f.lines, 0)
const totalNew = newFiles.filter(f => f.lines !== null).reduce((acc, f) => acc + (f.lines || 0), 0)
const reduction = Math.round((1 - totalNew / totalOld) * 100)

// ─── Component ─────────────────────────────────────────────────────────────

export default function ArchitecturePage() {
  const [activeConflict, setActiveConflict] = useState(0)

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-14">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-midnight/40 mb-3">
          <a href="/workshop/lo-buddy" className="hover:text-ocean transition-colors">LO Buddy</a>
          <span>›</span>
          <span>Architecture Overhaul</span>
        </div>
        <h1 className="font-display text-4xl text-midnight mb-3">Architecture Overhaul</h1>
        <p className="text-midnight/60 max-w-2xl">
          Visual comparison of the current AI stack vs. the new OpenClaw-inspired architecture.
          Why it breaks today, what changes, and what we get.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current AI lines', value: totalOld.toLocaleString(), sub: 'agent + routers + modules', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
          { label: 'New runtime lines', value: totalNew.toLocaleString(), sub: 'everything else → soul doc', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
          { label: 'Code reduction', value: `${reduction}%`, sub: 'logic moves to markdown', color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200' },
          { label: 'Routing conflicts', value: '0', sub: 'was 3 competing systems', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-5 ${s.bg}`}>
            <div className={`font-display text-3xl font-bold mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-sm font-semibold text-midnight">{s.label}</div>
            <div className="text-xs text-midnight/40 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Side-by-side pipeline */}
      <div>
        <h2 className="font-display text-2xl text-midnight mb-6">Pipeline Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* OLD */}
          <div>
            <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle size={15} className="text-red-500" />
              <span className="text-sm font-bold text-red-700">Current — 3 Competing Routers</span>
            </div>
            <div className="space-y-1">
              {[
                { label: 'INPUT', color: 'bg-slate-100 border-slate-300', note: 'voice / text / button' },
                { label: '⚡ voice-state-machine.ts', color: 'bg-orange-100 border-orange-300', note: 'May short-circuit. May inject. May pass through.' },
                { label: '⚡ module-selector.service.ts', color: 'bg-orange-100 border-orange-300', note: 'Picks one of 5 modules — possibly after state machine already decided' },
                { label: '⚡ prompt-cache.ts', color: 'bg-amber-100 border-amber-300', note: 'Persona JSON + module injection + state context — no defined coherence' },
                { label: '⚡ model-router.service.ts', color: 'bg-amber-100 border-amber-300', note: '3 task types → 3-5 hardcoded models' },
                { label: 'tool-calling-agent.service.ts', color: 'bg-red-100 border-red-300', note: '3,643 lines — accumulated contradictions' },
                { label: 'OUTPUT', color: 'bg-slate-100 border-slate-300', note: 'Response + maybe some tool calls' },
              ].map((step, i) => (
                <div key={i}>
                  <div className={`border rounded-xl px-4 py-2.5 ${step.color}`}>
                    <div className="text-sm font-semibold font-mono">{step.label}</div>
                    <div className="text-xs text-midnight/50 mt-0.5">{step.note}</div>
                  </div>
                  {i < 6 && <div className="flex justify-center py-0.5"><ArrowDown size={12} className="text-midnight/20" /></div>}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-xs text-red-700 font-medium">After response:</p>
              <p className="text-xs text-red-600 mt-1">Nothing. The AI stops. No autonomous follow-up, no Pinecone write, no proactive suggestions.</p>
            </div>
          </div>

          {/* NEW */}
          <div>
            <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle size={15} className="text-green-600" />
              <span className="text-sm font-bold text-green-700">New — Single Clean Pipeline</span>
            </div>
            <div className="space-y-1">
              {[
                { label: 'INPUT', color: 'bg-slate-100 border-slate-300', note: 'voice / text / button' },
                { label: '✅ session-initializer.ts', color: 'bg-cyan-50 border-cyan-300', note: 'Runs once. Soul + user prefs + Pinecone recall → SessionContext.' },
                { label: '✅ intent-classifier.ts', color: 'bg-green-50 border-green-300', note: 'One rules-based function. Returns mode + taskComplexity. Zero LLM cost.' },
                { label: '✅ prompt-builder.ts', color: 'bg-cyan-50 border-cyan-300', note: 'One coherent document. Soul + mode section + context. No competing injections.' },
                { label: '✅ openrouter/auto', color: 'bg-green-50 border-green-300', note: 'Full catalog. OR reads prompt content and picks the right model.' },
                { label: '✅ lo-buddy-runtime.ts', color: 'bg-cyan-50 border-cyan-300', note: '~400 lines — thin, readable, no contradictions' },
                { label: 'OUTPUT', color: 'bg-slate-100 border-slate-300', note: 'Response + suggestedActions[] + memoryToWrite[]' },
              ].map((step, i) => (
                <div key={i}>
                  <div className={`border rounded-xl px-4 py-2.5 ${step.color}`}>
                    <div className="text-sm font-semibold font-mono">{step.label}</div>
                    <div className="text-xs text-midnight/50 mt-0.5">{step.note}</div>
                  </div>
                  {i < 6 && <div className="flex justify-center py-0.5"><ArrowDown size={12} className="text-midnight/20" /></div>}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-xs text-green-700 font-medium">After response:</p>
              <p className="text-xs text-green-600 mt-1">memory-write.service.ts writes key facts to Pinecone. Standing goals check fires. suggestedActions[] rendered to UI. AI pursues its own agenda.</p>
            </div>
          </div>
        </div>
      </div>

      {/* File-by-file comparison */}
      <div>
        <h2 className="font-display text-2xl text-midnight mb-2">File Map</h2>
        <p className="text-sm text-midnight/50 mb-6">What exists today vs. what replaces it — and what moves to the soul doc (0 code lines)</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Old files */}
          <div>
            <h3 className="text-sm font-semibold text-midnight/40 uppercase tracking-wide mb-3">Current (7 AI logic files)</h3>
            <div className="space-y-2">
              {oldFiles.map(f => (
                <div key={f.name} className={`border rounded-xl p-3 ${f.color}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-mono font-bold">{f.name}</span>
                    <span className="text-xs font-bold flex-shrink-0">{f.lines.toLocaleString()} lines</span>
                  </div>
                  <div className="text-xs font-medium opacity-70 mb-1">{f.role}</div>
                  <div className="text-xs opacity-60">⚠ {f.problem}</div>
                </div>
              ))}
              <div className="border border-dashed border-midnight/20 rounded-xl p-3 text-center">
                <span className="text-sm font-bold text-midnight">{totalOld.toLocaleString()} total lines</span>
                <span className="text-xs text-midnight/40 block">of competing AI logic</span>
              </div>
            </div>
          </div>

          {/* New files */}
          <div>
            <h3 className="text-sm font-semibold text-midnight/40 uppercase tracking-wide mb-3">New (4 runtime files + soul doc)</h3>
            <div className="space-y-2">
              {newFiles.map(f => (
                <div key={f.name} className={`border rounded-xl p-3 ${f.color}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-mono font-bold">{f.name}</span>
                    <span className="text-xs font-bold flex-shrink-0">{f.lines === null ? 'markdown' : f.lines === 0 ? 'config' : `~${f.lines}`}</span>
                  </div>
                  <div className="text-xs font-medium opacity-70 mb-1">{f.role}</div>
                  <div className="text-xs opacity-60">✓ {f.detail}</div>
                </div>
              ))}
              <div className="border border-dashed border-green-300 rounded-xl p-3 text-center bg-green-50">
                <span className="text-sm font-bold text-green-700">~{totalNew.toLocaleString()} lines of runtime</span>
                <span className="text-xs text-green-600 block">business logic lives in soul doc (markdown)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What moves to soul doc */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={18} className="text-indigo-600" />
          <h2 className="font-display text-xl text-midnight">What Moves Into the Soul Doc</h2>
        </div>
        <p className="text-sm text-midnight/60 mb-5">These TypeScript files encode business logic that belongs in natural language. The LLM reads the soul doc and acts on it — no code needed.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {movesToSoul.map(m => (
            <div key={m.file} className="bg-white border border-indigo-100 rounded-xl p-3 flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileCode size={12} className="text-indigo-600" />
              </div>
              <div>
                <div className="text-xs font-mono text-indigo-700 font-bold">{m.file}</div>
                <div className="text-xs text-midnight/50 mt-0.5">→ {m.what}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-indigo-100 rounded-xl">
          <p className="text-xs text-indigo-700">
            <strong>The principle:</strong> Code = thin runtime (receive → classify → build prompt → call OR → write memory). Soul doc = the intelligence (follow-up rules, partner onboarding, compliance guardrails, proactive patterns). One is easy to audit and debug. The other is easy to edit and improve.
          </p>
        </div>
      </div>

      {/* Conflict zones */}
      <div>
        <h2 className="font-display text-2xl text-midnight mb-2">Where It Breaks Today</h2>
        <p className="text-sm text-midnight/50 mb-5">Click each conflict to see old vs. new</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {conflictZones.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveConflict(i)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${activeConflict === i ? 'bg-midnight text-cream' : 'bg-cream border border-midnight/15 text-midnight hover:border-midnight/40'}`}
            >
              {c.title}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-red-500" />
              <span className="text-sm font-bold text-red-700">Current Behavior</span>
            </div>
            <p className="text-sm text-midnight/70">{conflictZones[activeConflict].old}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={14} className="text-green-600" />
              <span className="text-sm font-bold text-green-700">New Behavior</span>
            </div>
            <p className="text-sm text-midnight/70">{conflictZones[activeConflict].new}</p>
          </div>
        </div>
      </div>

      {/* Q1 — What Ceda's test showed */}
      <div className="bg-cream border border-midnight/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={18} className="text-midnight/60" />
          <h2 className="font-display text-xl text-midnight">Q1 Test Results (Mekhi Noble, March 9)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">What worked ✅</p>
            <ul className="space-y-1 text-sm text-midnight/70">
              <li>• Caught incomplete phone number (7 digits) — asked for 10</li>
              <li>• Parsed referral info from natural language ("referred by Shane Mueller")</li>
              <li>• Updated lead record with referral source + lead source type</li>
              <li>• Created Purchase opportunity from one message</li>
              <li>• Presented structured next steps</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">What failed ❌</p>
            <ul className="space-y-1 text-sm text-midnight/70">
              <li>• <strong>Slow:</strong> AuthContext re-fetches user profile on every render (up to 1,577ms)</li>
              <li>• <strong>Broken orb:</strong> SVG avatar getting undefined path data</li>
              <li>• <strong>No autonomy:</strong> After capture — nothing. No follow-up task, no "Shane isn't in portal" suggestion</li>
              <li>• <strong>Phone ambiguity:</strong> Referrer's phone may have overwritten lead's phone</li>
              <li>• <strong>404:</strong> pre-approval-range endpoint missing on chad branch</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Phase roadmap */}
      <div>
        <h2 className="font-display text-2xl text-midnight mb-5">Build Phases</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              phase: 'Phase 1', name: 'Clean Foundation', color: 'bg-cyan-600', items: [
                'lo-buddy-runtime.ts', 'session-initializer.ts', 'intent-classifier.ts',
                'prompt-builder.ts', 'openrouter/auto routing', 'Pinecone memory loop',
                'Standing internal goals', 'AI-generated suggestedActions[]',
              ]
            },
            {
              phase: 'Phase 2', name: 'Communication Engine', color: 'bg-ocean', items: [
                'Borrower-facing communication', 'Persona system (custom sender names)',
                'Inbound message classification', 'Partner portal onboarding flow',
                'Twilio direct integration',
              ]
            },
            {
              phase: 'Phase 3', name: 'Lifecycle Engine', color: 'bg-indigo-600', items: [
                'Post-close follow-up sequences', 'Referral request campaigns',
                'Review request automation', 'Anniversary check-ins',
                'Repeat client identification',
              ]
            },
            {
              phase: 'Phase 4', name: 'Compliance Layer', color: 'bg-midnight', items: [
                'Full underwriting flag detection', 'Fair lending monitoring',
                'Lender overlay knowledge base', 'HMDA reporting assistance',
                'Rate engine integration',
              ]
            },
          ].map(p => (
            <div key={p.phase} className="bg-cream border border-midnight/10 rounded-2xl overflow-hidden">
              <div className={`${p.color} px-4 py-3`}>
                <div className="text-xs font-semibold text-white/70 uppercase tracking-wide">{p.phase}</div>
                <div className="text-sm font-bold text-white">{p.name}</div>
              </div>
              <div className="p-4">
                <ul className="space-y-1.5">
                  {p.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-midnight/70">
                      <span className="mt-0.5 text-midnight/20">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRD link */}
      <div className="bg-midnight text-cream rounded-2xl p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch size={15} className="text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Full PRD</span>
          </div>
          <p className="font-display text-lg">feature/openclaw-prd</p>
          <p className="text-cream/50 text-sm">prd/LOBUDDY_OVERHAUL_PRD.md · github.com/kpalaniuk/lo-buddy</p>
        </div>
        <a
          href="https://github.com/kpalaniuk/lo-buddy/blob/feature/openclaw-prd/prd/LOBUDDY_OVERHAUL_PRD.md"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-cream/10 hover:bg-cream/20 border border-cream/20 rounded-xl text-sm font-medium text-cream transition-colors flex items-center gap-2"
        >
          View PRD <ArrowRight size={14} />
        </a>
      </div>

    </div>
  )
}
