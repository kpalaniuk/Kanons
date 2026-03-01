'use client'

import {
  Server,
  Bot,
  Zap,
  FileText,
  CheckCircle,
  Circle,
  ExternalLink,
  Cpu,
  Key,
  Users,
  ClipboardList,
  Globe,
} from 'lucide-react'

const researchCards = [
  {
    icon: Key,
    title: 'OpenRouter — Confirmed ✅',
    color: 'ocean',
    points: [
      '400+ models: Claude, GPT, Gemini, Llama, Mistral, DeepSeek + more',
      'Single OpenAI-compatible API — write code once, works everywhere',
      'Each client brings their own API key (BYOK) — we manage settings',
      'Client pays OpenRouter directly for tokens — zero billing overhead for us',
    ],
  },
  {
    icon: Server,
    title: 'VPS Architecture — One Big Server',
    color: 'ocean',
    points: [
      'Single Hostinger VPS, multiple isolated Docker containers',
      'Each client gets their own container, subdomain, TLS via Caddy',
      'Memory per container: 384MB light / 512MB standard / 1GB heavy',
      '16GB VPS handles 25–50 clients comfortably with 1.5x overcommit',
    ],
  },
  {
    icon: Cpu,
    title: 'Hostinger KVM Sizing',
    color: 'cyan',
    points: [
      'KVM 2 (8GB) → 10–25 clients',
      'KVM 4 (16GB) → 25–50 clients — recommended starting point',
      'KVM 8 (32GB) → 50–100 clients',
      'Recommended: dedicated VPS for client containers (separate from our own)',
    ],
  },
  {
    icon: Bot,
    title: 'Container Stack Per Client',
    color: 'cyan',
    points: [
      'openclaw/openclaw:latest image',
      'Custom SOUL.md tuned to client business + use case',
      'Client OpenRouter API key injected as env var',
      'Caddy reverse proxy → unique subdomain + auto-TLS',
    ],
  },
]

const discoveryPhases = [
  {
    phase: '01',
    title: 'Business Snapshot',
    questions: [
      'What does this company do?',
      'How many people, what revenue range, what stage?',
      'Who makes decisions?',
    ],
  },
  {
    phase: '02',
    title: 'Pain & Opportunity',
    questions: [
      'What tasks eat the most time without needing deep human judgment?',
      'Where do things fall through the cracks?',
      'What have they tried before that didn\'t work?',
    ],
  },
  {
    phase: '03',
    title: 'Goals & Metrics',
    questions: [
      'What does success look like in 90 days? 1 year?',
      'What KPIs do they track today?',
      'Any hard constraints (compliance, privacy, budget)?',
    ],
  },
  {
    phase: '04',
    title: 'Tech Stack Audit',
    questions: [
      'What tools do they currently use? (CRM, email, social, PM)',
      'Who manages tech internally?',
      'Automation appetite: beginner / comfortable / advanced?',
    ],
  },
  {
    phase: '05',
    title: 'Use Case Fit',
    questions: [
      'Content & UGC / Customer comms / Internal ops / Lead gen / Research / Custom?',
      'Single primary job or multiple?',
      'Human-in-the-loop approval or fully autonomous?',
    ],
  },
  {
    phase: '06',
    title: 'SWOT Analysis',
    questions: [
      'Strengths: what can automation amplify?',
      'Weaknesses: where are the clear gaps?',
      'Threats: compliance, brand voice, data privacy risks?',
    ],
  },
]

const openQuestions = [
  { done: false, text: 'Exact current Hostinger VPS specs — how much room do we have now?' },
  { done: false, text: 'Separate VPS for client containers vs same VPS?' },
  { done: false, text: 'Domain for intake form (Kyle acquiring)' },
  { done: false, text: 'External product name — what do we call this to clients?' },
  { done: false, text: 'Pricing tiers: build fee + monthly retainer ranges' },
  { done: false, text: 'Chad\'s target verticals list — first industries to pursue' },
  { done: true, text: 'OpenRouter confirmed as unified LLM gateway ✅' },
  { done: true, text: 'Single VPS + Docker multi-tenant confirmed as right architecture ✅' },
  { done: true, text: 'Discovery framework drafted ✅' },
]

const buildQueue = [
  { label: 'Intake Form App', description: 'Standalone Vercel project — chat-based discovery interview', status: 'next' },
  { label: 'Client Container Provisioning Script', description: 'Auto-create Docker container + Caddy config + subdomain per client', status: 'planned' },
  { label: 'Admin Dashboard', description: 'See all clients, container status, API key health, usage', status: 'planned' },
  { label: 'SOUL.md Templates', description: 'Pre-built starter souls by use case (UGC, customer comms, ops, lead gen)', status: 'planned' },
  { label: 'Onboarding Wizard', description: 'Step-by-step client setup flow tied to intake results', status: 'planned' },
]

export default function OperationHotDogPage() {
  return (
    <div className="space-y-12 pb-16">

      {/* Header */}
      <div className="border-b border-midnight/10 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-midnight rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-4xl text-midnight">Operation Hot Dog</h1>
            <p className="text-midnight/50 text-sm mt-0.5">Productized AI agent deployment service</p>
          </div>
        </div>
        <p className="text-midnight/60 max-w-2xl mt-4 leading-relaxed">
          We host customized OpenClaw instances for clients on our VPS infrastructure. Each client gets a dedicated AI agent, tuned to their business, running on their own tokens. We handle setup, customization, and maintenance. They pay for the build and a monthly retainer.
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          <span className="px-3 py-1 bg-ocean/10 text-ocean rounded-full text-xs font-medium">OpenClaw + Docker</span>
          <span className="px-3 py-1 bg-ocean/10 text-ocean rounded-full text-xs font-medium">Hostinger VPS</span>
          <span className="px-3 py-1 bg-ocean/10 text-ocean rounded-full text-xs font-medium">OpenRouter</span>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">🌭 Internal Codename</span>
        </div>
      </div>

      {/* Research Findings */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-ocean rounded-full" />
          <h2 className="font-display text-2xl text-midnight">Research Findings</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {researchCards.map((card) => {
            const Icon = card.icon
            const isOcean = card.color === 'ocean'
            return (
              <div key={card.title} className="bg-cream rounded-xl p-6 border border-midnight/5">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`w-5 h-5 ${isOcean ? 'text-ocean' : 'text-cyan-500'}`} />
                  <h3 className="font-display text-lg text-midnight">{card.title}</h3>
                </div>
                <ul className="space-y-2">
                  {card.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-midnight/70">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Discovery Framework */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-terracotta rounded-full" />
          <h2 className="font-display text-2xl text-midnight">Client Discovery Framework</h2>
        </div>
        <p className="text-midnight/60 mb-6 text-sm">
          The intake agent will walk clients through these phases conversationally. At the end, it generates a structured brief and sends it to us.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {discoveryPhases.map((phase) => (
            <div key={phase.phase} className="bg-cream rounded-xl p-5 border border-midnight/5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-display text-midnight/20">{phase.phase}</span>
                <h3 className="font-display text-base text-midnight">{phase.title}</h3>
              </div>
              <ul className="space-y-1.5">
                {phase.questions.map((q, i) => (
                  <li key={i} className="text-xs text-midnight/60 leading-relaxed pl-2 border-l-2 border-terracotta/30">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Build Queue */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-amber-400 rounded-full" />
          <h2 className="font-display text-2xl text-midnight">Build Queue</h2>
        </div>
        <div className="space-y-3">
          {buildQueue.map((item, i) => (
            <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${item.status === 'next' ? 'bg-amber-50 border-amber-200' : 'bg-cream border-midnight/5'}`}>
              <div className={`w-6 h-6 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center ${item.status === 'next' ? 'bg-amber-400' : 'bg-midnight/10'}`}>
                <span className="text-xs font-bold text-white">{i + 1}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-midnight text-sm">{item.label}</h3>
                  {item.status === 'next' && (
                    <span className="px-2 py-0.5 bg-amber-400 text-white rounded-full text-xs font-bold">NEXT</span>
                  )}
                </div>
                <p className="text-xs text-midnight/60 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Open Questions */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-midnight rounded-full" />
          <h2 className="font-display text-2xl text-midnight">Open Questions</h2>
        </div>
        <div className="space-y-2">
          {openQuestions.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-cream border border-midnight/5">
              {item.done
                ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                : <Circle className="w-4 h-4 text-midnight/30 flex-shrink-0 mt-0.5" />
              }
              <span className={`text-sm ${item.done ? 'text-midnight/40 line-through' : 'text-midnight/80'}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Diagram (Text) */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-cyan-500 rounded-full" />
          <h2 className="font-display text-2xl text-midnight">Container Architecture</h2>
        </div>
        <div className="bg-midnight rounded-xl p-6 font-mono text-sm text-green-400 leading-relaxed overflow-x-auto">
          <p className="text-midnight/50 font-sans text-xs mb-4">// Hostinger KVM 4+ (16GB RAM) — recommended starting VPS</p>
          <p>Client A → alice.yourdomain.com → Caddy → :18800 → <span className="text-amber-400">openclaw-clientA</span></p>
          <p>Client B → bob.yourdomain.com  → Caddy → :18801 → <span className="text-amber-400">openclaw-clientB</span></p>
          <p>Client C → carol.yourdomain.com → Caddy → :18802 → <span className="text-amber-400">openclaw-clientC</span></p>
          <p className="mt-4 text-green-400/50">// Each container:</p>
          <p className="text-green-400/50">// -m 512m --cpus=1 (standard) or -m 1g --cpus=2 (heavy)</p>
          <p className="text-green-400/50">// -v clientX_data:/app/data  (isolated filesystem)</p>
          <p className="text-green-400/50">// -e OPENROUTER_API_KEY=client-own-key</p>
          <p className="text-green-400/50">// --read-only --cap-drop=ALL --security-opt no-new-privileges</p>
        </div>
      </section>

      {/* Key Links */}
      <section className="pt-8 border-t border-midnight/10">
        <h2 className="font-display text-xl text-midnight mb-4">Key References</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { name: 'ClawTank Multi-Tenant Guide', url: 'https://clawtank.dev/blog/openclaw-multi-tenant-docker-guide', desc: 'Official OpenClaw multi-tenant Docker architecture' },
            { name: 'OpenRouter Models', url: 'https://openrouter.ai/models', desc: '400+ models, pricing, and capabilities' },
            { name: 'Hostinger VPS Plans', url: 'https://www.hostinger.com/vps-hosting', desc: 'KVM plans, pricing, and specs' },
          ].map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between p-4 bg-cream rounded-lg border border-midnight/5 hover:border-ocean/30 transition-colors group"
            >
              <div>
                <h3 className="font-medium text-midnight text-sm group-hover:text-ocean transition-colors">{link.name}</h3>
                <p className="text-xs text-midnight/50 mt-0.5">{link.desc}</p>
              </div>
              <ExternalLink size={14} className="text-midnight/30 flex-shrink-0 mt-0.5 group-hover:text-ocean transition-colors" />
            </a>
          ))}
        </div>
      </section>

    </div>
  )
}
