'use client'

import Link from 'next/link'
import {
  Server, Bot, Zap, CheckCircle, ExternalLink, Cpu,
  DollarSign, TrendingUp, Users, Video, Phone, Briefcase, Search,
  MessageSquare, MapPin, Mic, Globe, Database, Cloud,
  ArrowRight, AlertCircle, Layers, Settings, BookOpen, Key, Wifi,
} from 'lucide-react'

// ─── DATA ────────────────────────────────────────────────────────────────────

const archetypes = [
  { emoji: '🎥', title: 'Content Machine', tagline: 'Produces and posts social content automatically', who: 'Agencies, creators, real estate, brands', priority: 'HIGH', integrations: ['Instagram/TikTok', 'Buffer', 'Canva API'], voice: false, videoGen: true },
  { emoji: '📞', title: 'Follow-Up Machine', tagline: 'Never lets a lead go cold', who: 'Mortgage, insurance, real estate, med spas', priority: 'VERY HIGH', integrations: ['CRM (GHL/HubSpot)', 'Twilio SMS', 'Gmail'], voice: true, videoGen: false },
  { emoji: '📋', title: 'Operations Manager', tagline: 'Internal KB, reports, team onboarding', who: 'Construction, property mgmt, franchises', priority: 'HIGH', integrations: ['Notion', 'Slack', 'Google Workspace'], voice: false, videoGen: false },
  { emoji: '🔍', title: 'Research Engine', tagline: 'Daily intelligence briefs, document analysis', who: 'Analysts, consultants, investors', priority: 'MEDIUM', integrations: ['Web search', 'PDF parser', 'Slack/email'], voice: false, videoGen: false },
  { emoji: '💬', title: 'Client Comms Hub', tagline: 'Proactive relationship management', who: 'Agencies, law firms, contractors', priority: 'MEDIUM', integrations: ['Gmail', 'Slack', 'Google Calendar'], voice: false, videoGen: false },
  { emoji: '📍', title: 'Local Business Multiplier', tagline: 'Reviews, social, email on autopilot', who: 'Restaurants, salons, gyms, boutiques', priority: 'MEDIUM', integrations: ['Google Business', 'Mailchimp', 'Meta'], voice: false, videoGen: false },
  { emoji: '🎙️', title: 'Executive Assistant', tagline: 'Full personal agent — calendar, email, voice', who: 'Founders, executives, high-volume pros', priority: 'HIGH', integrations: ['Gmail', 'Google Calendar', 'Notion', 'Twilio'], voice: true, videoGen: false },
]

// ── UPDATED TIERS — differentiated by SUPPORT + FEATURES, not model quality
// ALL tiers get the best available models via OpenRouter
const pricingTiers = [
  {
    name: 'Lite',
    emoji: '⚡',
    build: '$999–1,500',
    monthly: '$149/mo',
    highlight: false,
    philosophy: 'Hands-off. Build it, ship it, they run it.',
    includes: [
      '1 primary use case',
      '1–2 integrations',
      'Best available model via OpenRouter',
      'Async email support only',
      '{name}.hotclaw.ai subdomain',
      'Pinecone memory (basic)',
    ],
    vpsResources: '384MB RAM · 0.5 CPU',
    support: 'Async only — no check-ins',
  },
  {
    name: 'Pro',
    emoji: '🔥',
    build: '$2,500–5,000',
    monthly: '$349/mo',
    highlight: true,
    philosophy: 'The bread and butter. Most clients land here.',
    includes: [
      '2–3 use cases',
      '3–4 integrations',
      'Best available model via OpenRouter',
      'Monthly 30-min check-in',
      'Twilio SMS included',
      'Supabase DB + Pinecone memory',
      '{name}.hotclaw.ai subdomain',
    ],
    vpsResources: '512MB RAM · 1.0 CPU',
    support: 'Monthly check-in + Slack/email',
  },
  {
    name: 'Pro Plus',
    emoji: '🚀',
    build: '$6,000–12,000',
    monthly: '$599/mo',
    highlight: false,
    philosophy: 'Full customization. We actively iterate with you.',
    includes: [
      'All use cases',
      '5+ integrations',
      'Best available model via OpenRouter',
      'Quarterly strategy session',
      'Voice (ElevenLabs)',
      'Custom domain (CNAME)',
      'Full Supabase + Pinecone memory',
      'We actively evolve the agent',
    ],
    vpsResources: '1024MB RAM · 2.0 CPU',
    support: 'Quarterly strategy + priority response',
  },
]

// ── OPENROUTER: what it covers vs what still needs separate APIs
const openRouterCovers = [
  'Claude 3.5 Haiku, Sonnet, Opus — ALL versions',
  'GPT-4o, GPT-4o mini, o1, o3, o4',
  'Gemini 1.5 Pro, 2.0, Flash',
  'Llama 3.x, Mistral, Cohere, DeepSeek',
  '300+ models, one API key, one format',
  'Per-model cost transparency + spend limits per key',
  'Client BYOK OR Hotclaw master key with usage tracking',
]

const separateAPIs = [
  { name: 'Supabase', purpose: 'PostgreSQL relational DB', tier: 'ALL', cost: '$0–25/mo, Hotclaw pays' },
  { name: 'Pinecone', purpose: 'Vector memory / semantic search', tier: 'ALL', cost: '$70/mo (Starter) — namespaced per client' },
  { name: 'Twilio', purpose: 'Two-way SMS + WhatsApp + Voice', tier: 'Pro+', cost: '$1/mo/number + $0.0075/SMS' },
  { name: 'ElevenLabs', purpose: 'Voice cloning / TTS', tier: 'Pro Plus', cost: '~$5–22/mo, client pays' },
  { name: 'Cloudinary', purpose: 'Media storage and transforms', tier: 'Pro+', cost: 'Free–$89/mo depending on usage' },
  { name: 'Runway', purpose: 'AI video generation (UGC clients)', tier: 'UGC only', cost: 'Client BYOK — DO NOT bundle' },
  { name: 'Stripe', purpose: 'Collect monthly retainers from clients', tier: 'Hotclaw ops', cost: '2.9% + $0.30 per txn' },
  { name: 'Cloudflare', purpose: 'DNS + wildcard SSL for hotclaw.ai', tier: 'Hotclaw ops', cost: 'Free' },
]

const masterAPIList = [
  { category: 'ESSENTIAL — Set up now', items: ['OpenRouter (master account + per-client spend limits)', 'Hetzner (VPS — CX52)', 'Supabase (one org)', 'Pinecone (one account, namespace per client)', 'Cloudflare (DNS + wildcard *.hotclaw.ai)', 'GitHub (Hotclaw org)', 'Vercel (team account)', 'Stripe (client billing)', 'Twilio (SMS provisioning)'] },
  { category: 'ON-DEMAND — Provision per client', items: ['ElevenLabs (voice package add-on)', 'Cloudinary (media-heavy clients)', 'Runway (UGC clients — or client BYOK)', 'Google OAuth app (Gmail/Calendar integrations)', 'Slack app credentials (per Slack integration)', 'Meta Business API (Instagram/Facebook posting)', 'HubSpot/GHL API key (CRM integrations)'] },
]

// ── HETZNER CX52 SIZING MATH
const vpsScenarios = [
  { scenario: '5 clients (3 Pro + 2 Pro Plus) + Super Hotclaw', ramUsed: '~6.6GB', cpuUsed: '~11 vCPU peak', realLoad: '~2.5GB RAM · ~4 vCPU real', machines: 1, note: '80%+ headroom remaining' },
  { scenario: '15 Pro clients + Super Hotclaw', ramUsed: '~10GB', cpuUsed: '~17 vCPU peak', realLoad: '~4GB RAM · ~7 vCPU real', machines: 1, note: 'Still comfortable on one' },
  { scenario: '25 clients (mixed)', ramUsed: '~16GB', cpuUsed: 'Near cap', realLoad: '~6–8GB real', machines: 2, note: 'Add second for comfort + redundancy' },
  { scenario: '50 clients (mixed)', ramUsed: '—', cpuUsed: '—', realLoad: '~12–15GB real', machines: 2, note: '2x CX52 handles it. $74/mo.' },
  { scenario: '100 clients (mixed)', ramUsed: '—', cpuUsed: '—', realLoad: '~25GB real', machines: 4, note: '$148/mo infra vs $20–60K MRR. 🔥' },
]

const buildQueue = [
  { label: 'Super Hotclaw — our own internal agent on VPS', description: 'Provision the Hotclaw agent first. Control plane + proof of concept. We eat our own dog food.', status: 'NEXT', priority: 1 },
  { label: 'Hetzner CX52 — provision and configure', description: 'Spin up CX52 at $37/mo. Docker + Caddy + wildcard DNS *.hotclaw.ai. One machine handles 15-20 clients.', status: 'NEXT', priority: 2 },
  { label: 'Run provision-client.sh end-to-end test', description: 'Full onboarding flow: new container → subdomain → Caddy entry → SSL → live. Verify in 20 minutes.', status: 'NEXT', priority: 3 },
  { label: 'Vercel team org + Stripe setup', description: 'Hotclaw Solutions Vercel team. Stripe for collecting monthly retainers. Set up billing flow before first client.', status: 'NEXT', priority: 4 },
  { label: 'Twilio SMS integration wire-up', description: 'Configure webhook → OpenClaw channel plugin → two-way SMS works. 2-4 hours. Unlocks Follow-Up Machine and Client Comms archetypes.', status: 'PLANNED', priority: 5 },
  { label: 'Pinecone + Supabase org setup', description: 'One Pinecone account (namespace per client). One Supabase org. Master accounts ready to provision per client.', status: 'PLANNED', priority: 6 },
  { label: 'First 3 clients onboarded (revenue!)', description: 'Target: 2 Pro + 1 Lite. From network or early HotScout inquiries. Get MRR flowing before building more features.', status: 'PLANNED', priority: 7 },
  { label: 'Usage dashboard — track per-client costs', description: 'OpenRouter usage + Twilio SMS + Supabase + Pinecone per client. Monthly billing view so we know margin on each client.', status: 'PLANNED', priority: 8 },
]

const decisions = [
  { done: true, text: 'Brand: Hotclaw Solutions · hotclaw.ai' },
  { done: true, text: 'Runtime: OpenClaw (Docker per client)' },
  { done: true, text: 'LLM: OpenRouter — ALL tiers get best available models. No restrictions.' },
  { done: true, text: 'HotScout intake live at hotclaw.ai/chat/demo' },
  { done: true, text: 'Architecture: Single large VPS + Docker + Caddy reverse proxy' },
  { done: true, text: 'VPS choice: Hetzner CX52 (16vCPU/32GB/$37mo) — one machine handles 20+ clients' },
  { done: true, text: 'Tiers: Lite/Pro/Pro Plus — differentiated by SUPPORT + FEATURES, not model quality' },
  { done: true, text: 'Pinecone: all tiers get vector memory, namespaced per client' },
  { done: true, text: 'Twilio: two-way SMS, ~2-4hr to integrate, unlocks 3 archetypes' },
  { done: true, text: 'Partners: Kyle (builds all) + Chad (strategy/sales) — equal partners' },
  { done: false, text: 'PENDING: Hetzner CX52 provisioned' },
  { done: false, text: 'PENDING: Super Hotclaw live on VPS' },
  { done: false, text: 'PENDING: Stripe + Vercel team setup' },
  { done: false, text: 'PENDING: Chad\'s target verticals + first 3 client prospects' },
]

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function OperationHotDogPage() {
  return (
    <div className="space-y-16 pb-20">

      {/* Header */}
      <div className="border-b border-midnight/10 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-midnight rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-4xl text-midnight">Hotclaw Solutions HQ</h1>
            <p className="text-midnight/50 text-sm mt-0.5">AI agent deployment consultancy · hotclaw.ai · internal: Operation Hot Dog 🌭</p>
          </div>
        </div>
        <p className="text-midnight/60 max-w-2xl mt-4 leading-relaxed">
          Fast, hot, easy-to-use AI agents that transform how your business runs. We build, host, and maintain custom OpenClaw agents for SMBs. Best-in-class models (always), one VPS, OpenRouter for everything.
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">hotclaw.ai ✅</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">HotScout Live ✅</span>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Stage: Foundation</span>
          <span className="px-3 py-1 bg-ocean/10 text-ocean rounded-full text-xs font-medium">OpenRouter — all LLMs</span>
          <span className="px-3 py-1 bg-ocean/10 text-ocean rounded-full text-xs font-medium">Hetzner CX52</span>
        </div>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link href="/workshop/operation-hot-dog/how-it-works" className="inline-flex items-center gap-2 px-4 py-2 bg-midnight text-cream rounded-lg text-sm font-medium hover:bg-ocean transition-colors">
            <BookOpen className="w-4 h-4" /> How It Works
          </Link>
          <a href="https://hotclaw.ai/chat/demo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-ink rounded-lg text-sm font-medium hover:bg-amber-300 transition-colors">
            <ExternalLink className="w-4 h-4" /> HotScout Demo
          </a>
          <Link href="/workshop/operation-hot-dog/logos" className="inline-flex items-center gap-2 px-4 py-2 bg-cream border border-midnight/10 text-midnight rounded-lg text-sm font-medium hover:border-midnight/30 transition-colors">
            <Zap className="w-4 h-4" /> Logo Concepts V3
          </Link>
          <Link href="/workshop/operation-hot-dog/setup" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-400 transition-colors">
            <Settings className="w-4 h-4" /> 🔥 Setup Guide
          </Link>
        </div>
      </div>

      {/* Decisions */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-green-500 rounded-full" />
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h2 className="font-display text-2xl text-midnight">Decisions & Status</h2>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {decisions.map((item, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${item.done ? 'bg-cream border-midnight/5' : 'bg-amber-50 border-amber-200'}`}>
              {item.done ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />}
              <span className={`text-sm leading-relaxed ${item.done ? 'text-midnight/55' : 'text-midnight/80 font-medium'}`}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Build Queue */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-amber-400 rounded-full" />
          <Zap className="w-5 h-5 text-amber-500" />
          <h2 className="font-display text-2xl text-midnight">Build Queue</h2>
        </div>
        <div className="space-y-3">
          {buildQueue.map((item) => (
            <div key={item.priority} className={`flex items-start gap-4 p-4 rounded-xl border ${item.status === 'NEXT' ? 'bg-amber-50 border-amber-200' : 'bg-cream border-midnight/5'}`}>
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${item.status === 'NEXT' ? 'bg-amber-400' : 'bg-midnight/25'}`}>
                {item.priority}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-medium text-midnight text-sm">{item.label}</h3>
                  {item.status === 'NEXT' && <span className="px-2 py-0.5 bg-amber-400 text-white rounded-full text-[10px] font-bold">DO THIS</span>}
                </div>
                <p className="text-xs text-midnight/55 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing — updated tiers */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-ocean rounded-full" />
          <DollarSign className="w-5 h-5 text-ocean" />
          <h2 className="font-display text-2xl text-midnight">Tiers</h2>
        </div>
        <div className="mb-4 p-4 bg-midnight/5 rounded-xl border border-midnight/5 text-sm text-midnight/70">
          <strong className="text-midnight">Model philosophy:</strong> ALL tiers get the best available model for each task via OpenRouter. We never artificially restrict model quality. Tiers differ by <em>support level, number of integrations, and features</em> — not by AI quality.
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {pricingTiers.map((tier) => (
            <div key={tier.name} className={`rounded-xl p-6 border ${tier.highlight ? 'bg-ocean/5 border-ocean/30' : 'bg-cream border-midnight/5'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{tier.emoji}</span>
                <h3 className="font-display text-xl text-midnight">{tier.name}</h3>
                {tier.highlight && <span className="px-2 py-0.5 bg-ocean text-cream rounded-full text-xs font-bold">BREAD & BUTTER</span>}
              </div>
              <p className="text-xs text-midnight/40 italic mb-3">{tier.philosophy}</p>
              <p className="text-2xl font-semibold text-midnight">{tier.monthly}</p>
              <p className="text-sm text-midnight/50 mb-4">Build: {tier.build}</p>
              <ul className="space-y-1.5 mb-4">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-midnight/70">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="border-t border-midnight/10 pt-3 space-y-1">
                <p className="text-xs text-midnight/40"><span className="text-midnight/60 font-medium">VPS:</span> {tier.vpsResources}</p>
                <p className="text-xs text-midnight/40"><span className="text-midnight/60 font-medium">Support:</span> {tier.support}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OpenRouter — the unified LLM layer */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-purple-500 rounded-full" />
          <Cloud className="w-5 h-5 text-purple-500" />
          <h2 className="font-display text-2xl text-midnight">OpenRouter — Unified LLM Gateway</h2>
        </div>
        <p className="text-midnight/50 text-sm mb-5">One API key, 300+ models, one billing line. Eliminates separate Anthropic/OpenAI/Google keys. Client pays their own tokens OR we track usage and bill back.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-cream rounded-xl p-5 border border-midnight/5">
            <h3 className="font-medium text-midnight text-sm mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" /> What OpenRouter covers
            </h3>
            <ul className="space-y-1.5">
              {openRouterCovers.map(item => (
                <li key={item} className="text-xs text-midnight/65 flex items-start gap-2">
                  <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-cream rounded-xl p-5 border border-midnight/5">
            <h3 className="font-medium text-midnight text-sm mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Still needs separate APIs
            </h3>
            <div className="space-y-2">
              {separateAPIs.map(api => (
                <div key={api.name} className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-medium text-midnight">{api.name}</span>
                    <span className="text-xs text-midnight/40 ml-2">{api.purpose}</span>
                  </div>
                  <span className="text-[10px] text-midnight/30 flex-shrink-0 text-right">{api.cost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-800">
          <strong>Twilio SMS — 2-4 hours to integrate.</strong> Buy number ($1/mo) → set webhook URL → OpenClaw receives SMS → agent responds. OpenClaw already has Twilio as a channel plugin. Unlocks Follow-Up Machine, Client Comms, and Executive Assistant archetypes immediately. Per SMS: ~$0.0075 each way.
        </div>
      </section>

      {/* VPS Sizing */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-cyan-500 rounded-full" />
          <Server className="w-5 h-5 text-cyan-500" />
          <h2 className="font-display text-2xl text-midnight">Hetzner CX52 — Sizing Math</h2>
        </div>
        <div className="mb-4 p-4 bg-midnight rounded-xl font-mono text-xs text-green-400 leading-relaxed">
          <span className="text-amber-400">// Hetzner CX52: 16 vCPU / 32GB RAM / 320GB NVMe / $37/mo</span><br/>
          <span className="text-white/40">// Container limits: Lite=384MB/0.5CPU · Pro=512MB/1CPU · Pro Plus=1GB/2CPU</span><br/>
          <span className="text-white/40">// Real load = 30-40% of limits (agents sleep between tasks)</span>
        </div>
        <div className="space-y-3">
          {vpsScenarios.map((s) => (
            <div key={s.scenario} className={`flex items-start gap-4 p-4 rounded-xl border ${s.machines === 1 ? 'bg-green-50 border-green-200' : s.machines === 2 ? 'bg-cream border-midnight/5' : 'bg-ocean/5 border-ocean/20'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${s.machines === 1 ? 'bg-green-500' : s.machines <= 2 ? 'bg-ocean' : 'bg-midnight/50'}`}>
                {s.machines}x
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-midnight text-sm mb-1">{s.scenario}</h3>
                <p className="text-xs text-midnight/60">{s.realLoad} · <span className="font-medium">{s.note}</span></p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <strong>Start with ONE CX52.</strong> First 5 clients = 20% capacity used. First 15 = ~60%. Add a second at 15-20 clients for load distribution and redundancy. Economics: $37/mo server vs $2K-10K MRR. Best ratio in infra.
        </div>
      </section>

      {/* Master API List */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-midnight rounded-full" />
          <Key className="w-5 h-5 text-midnight" />
          <h2 className="font-display text-2xl text-midnight">API Accounts to Amass</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {masterAPIList.map((group) => (
            <div key={group.category} className="bg-cream rounded-xl p-5 border border-midnight/5">
              <h3 className="font-medium text-midnight text-xs uppercase tracking-wide mb-3">{group.category}</h3>
              <ul className="space-y-2">
                {group.items.map(item => (
                  <li key={item} className="text-xs text-midnight/65 flex items-start gap-2">
                    <span className="text-midnight/25 flex-shrink-0 mt-0.5">·</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Infra Map */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-cyan-500 rounded-full" />
          <Globe className="w-5 h-5 text-cyan-500" />
          <h2 className="font-display text-2xl text-midnight">Infrastructure Map</h2>
        </div>
        <div className="bg-midnight rounded-xl p-6 font-mono text-xs text-green-400 leading-loose overflow-x-auto">
          <p className="text-amber-400">// Full Hotclaw Stack</p>
          <p className="text-white/60 mt-2">OpenRouter ─────────────── ALL LLM calls (one key, every model)</p>
          <p className="text-white/60">Pinecone ───────────────── Vector memory (namespace per client)</p>
          <p className="text-white/60">Supabase ───────────────── Relational DB (one org, per-client schema)</p>
          <p className="text-white/60">Twilio ─────────────────── SMS + WhatsApp (one account, per-client number)</p>
          <p className="text-white/60">Stripe ─────────────────── Client billing (monthly retainer collection)</p>
          <p className="text-white/60 mt-3">Cloudflare DNS</p>
          <p className="ml-4 text-green-400">hotclaw.ai          → Vercel (landing + HotScout + admin)</p>
          <p className="ml-4 text-green-400">*.hotclaw.ai        → Hetzner CX52 (all client containers)</p>
          <p className="text-white/60 mt-3">Hetzner CX52 ($37/mo) — 16vCPU / 32GB / handles 20+ clients</p>
          <p className="ml-4">├── Caddy (reverse proxy + auto-TLS)</p>
          <p className="ml-4">├── super-hotclaw        <span className="text-amber-400">← our agent</span></p>
          <p className="ml-4">├── openclaw-[client-1]  <span className="text-amber-400">← Pro client, :18800</span></p>
          <p className="ml-4">└── openclaw-[client-N]  <span className="text-amber-400">← scales to 20+ on one box</span></p>
        </div>
      </section>

      {/* Archetypes */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-amber-400 rounded-full" />
          <Users className="w-5 h-5 text-amber-500" />
          <h2 className="font-display text-2xl text-midnight">The 7 Client Archetypes</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {archetypes.map((a) => (
            <div key={a.title} className="bg-cream rounded-xl p-5 border border-midnight/5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{a.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-midnight text-sm">{a.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.priority === 'VERY HIGH' ? 'bg-red-100 text-red-700' : a.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' : 'bg-midnight/5 text-midnight/40'}`}>{a.priority}</span>
                  </div>
                  <p className="text-xs text-midnight/50">{a.tagline}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex gap-2">
                  <span className="text-midnight/40 w-20 flex-shrink-0">Who</span>
                  <span className="text-midnight/70">{a.who}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-midnight/40 w-20 flex-shrink-0">Needs</span>
                  <span className="text-midnight/70">{a.integrations.join(', ')}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  {a.voice && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">Voice</span>}
                  {a.videoGen && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-medium">Video Gen ⚠️ client BYOK</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="pt-8 border-t border-midnight/10">
        <h2 className="font-display text-xl text-midnight mb-4">References</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { name: 'How It Works Guide', href: '/workshop/operation-hot-dog/how-it-works', desc: 'Full technical + business reference', internal: true },
            { name: 'Logo Concepts V3', href: '/workshop/operation-hot-dog/logos', desc: 'Forge identity — HOT/CLAW split', internal: true },
            { name: 'HotScout Demo', href: 'https://hotclaw.ai/chat/demo', desc: 'Live intake experience', internal: false },
            { name: 'Hetzner Cloud', href: 'https://www.hetzner.com/cloud/', desc: 'CX52 — $37/mo recommended', internal: false },
            { name: 'OpenRouter', href: 'https://openrouter.ai/models', desc: '300+ models, one key', internal: false },
            { name: 'Admin Dashboard', href: 'https://hotclaw.ai/admin', desc: 'Intake briefs', internal: false },
          ].map((link) => (
            link.internal
              ? <Link key={link.href} href={link.href} className="flex items-start justify-between p-4 bg-cream rounded-lg border border-midnight/5 hover:border-ocean/30 transition-colors group">
                  <div><h3 className="font-medium text-midnight text-sm group-hover:text-ocean transition-colors">{link.name}</h3><p className="text-xs text-midnight/50 mt-0.5">{link.desc}</p></div>
                  <ArrowRight size={14} className="text-midnight/30 flex-shrink-0 mt-0.5 group-hover:text-ocean" />
                </Link>
              : <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between p-4 bg-cream rounded-lg border border-midnight/5 hover:border-ocean/30 transition-colors group">
                  <div><h3 className="font-medium text-midnight text-sm group-hover:text-ocean transition-colors">{link.name}</h3><p className="text-xs text-midnight/50 mt-0.5">{link.desc}</p></div>
                  <ExternalLink size={14} className="text-midnight/30 flex-shrink-0 mt-0.5 group-hover:text-ocean" />
                </a>
          ))}
        </div>
      </section>

    </div>
  )
}
