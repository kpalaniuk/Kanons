'use client'

import Link from 'next/link'
import {
  Server, Bot, Zap, FileText, CheckCircle, Circle, ExternalLink, Cpu,
  DollarSign, TrendingUp, Users, Video, Phone, Briefcase, Search,
  MessageSquare, MapPin, Mic, Globe, Shield, Database, Cloud,
  ArrowRight, AlertCircle, Layers, Settings, BarChart3, BookOpen,
} from 'lucide-react'

// ─── DATA ────────────────────────────────────────────────────────────────────

const archetypes = [
  { emoji: '🎥', title: 'Content Machine', tagline: 'Produces and posts social content automatically', who: 'Agencies, creators, real estate, brands', priority: 'HIGH', complexity: 'MEDIUM', db: 'Supabase (content queue)', storage: 'Cloudinary or S3', integrations: ['Instagram/TikTok', 'Buffer/Hootsuite', 'Canva API'], voice: false, videoGen: true },
  { emoji: '📞', title: 'Follow-Up Machine', tagline: 'Never lets a lead go cold', who: 'Mortgage, insurance, real estate, med spas', priority: 'VERY HIGH', complexity: 'MEDIUM-HIGH', db: 'Supabase (lead/task table)', storage: 'None', integrations: ['CRM (GHL/HubSpot)', 'Twilio SMS', 'Gmail/Outlook'], voice: true, videoGen: false },
  { emoji: '📋', title: 'Operations Manager', tagline: 'Internal KB, reports, team onboarding', who: 'Construction, property mgmt, franchises', priority: 'HIGH', complexity: 'MEDIUM', db: 'Notion + Supabase', storage: 'Google Drive', integrations: ['Notion', 'Slack', 'Google Workspace'], voice: false, videoGen: false },
  { emoji: '🔍', title: 'Research Engine', tagline: 'Daily intelligence briefs, document analysis', who: 'Analysts, consultants, investors', priority: 'MEDIUM', complexity: 'LOW', db: 'Pinecone (vector search)', storage: 'S3 (doc archive)', integrations: ['Web search', 'PDF parser', 'Slack/email'], voice: false, videoGen: false },
  { emoji: '💬', title: 'Client Comms Hub', tagline: 'Proactive updates and relationship management', who: 'Agencies, law firms, contractors', priority: 'MEDIUM', complexity: 'LOW', db: 'Supabase (client table)', storage: 'None', integrations: ['Gmail', 'Slack', 'Calendar'], voice: false, videoGen: false },
  { emoji: '📍', title: 'Local Business Multiplier', tagline: 'Social, email, Google reviews on autopilot', who: 'Restaurants, salons, gyms, boutiques', priority: 'MEDIUM', complexity: 'LOW', db: 'Supabase (reviews/posts)', storage: 'Cloudinary', integrations: ['Google Business', 'Mailchimp', 'Meta'], voice: false, videoGen: false },
  { emoji: '🎙️', title: 'Executive Assistant', tagline: 'Full personal agent — calendar, email, voice', who: 'Founders, executives, professionals', priority: 'HIGH', complexity: 'HIGH', db: 'Supabase + Pinecone', storage: 'Google Drive', integrations: ['Gmail', 'Google Calendar', 'Notion', 'Twilio'], voice: true, videoGen: false },
]

const pricingTiers = [
  { name: 'Starter', emoji: '🐟', build: '$1,500–2,500', monthly: '$199/mo', includes: ['1 primary use case', '1 integration', 'SOUL.md customization', 'Onboarding session'], vpsResources: '384MB RAM · 0.5 CPU', tokenEst: '~$15–40/mo', },
  { name: 'Standard', emoji: '🐠', build: '$3,000–5,000', monthly: '$349/mo', includes: ['2–3 use cases', '2–3 integrations', 'Sub-agents', '30-day check-in'], vpsResources: '512MB RAM · 1.0 CPU', tokenEst: '~$20–60/mo', highlight: true },
  { name: 'Professional', emoji: '🐋', build: '$6,000–12,000', monthly: '$599/mo', includes: ['All use cases', '5+ integrations', 'Memory system', 'Voice interface'], vpsResources: '1024MB RAM · 2.0 CPU', tokenEst: '~$50–150/mo', },
]

const buildQueue = [
  { label: 'Super Hotclaw — Our own internal agent', description: 'Spin up Hotclaw\'s own OpenClaw instance on VPS first. This IS us eating our own dog food and our control plane.', status: 'NEXT', priority: 1 },
  { label: 'Choose and provision VPS (Hetzner CX43 recommended)', description: '8 vCPU / 16GB at $11/mo vs Hostinger $35/mo same specs. Set up Docker + Caddy + wildcard DNS on hotclaw.ai.', status: 'NEXT', priority: 2 },
  { label: 'Test client onboarding script end-to-end', description: 'Run provision-client.sh for a test client. Verify subdomain routing, container isolation, resource limits.', status: 'NEXT', priority: 3 },
  { label: 'Vercel team org setup', description: 'Create Hotclaw Solutions Vercel team. Move hot-dog-intake project under it. All future client portals in one org.', status: 'NEXT', priority: 4 },
  { label: 'Domain management system', description: 'Build process for: subdomain on hotclaw.ai (default) OR custom domain CNAME pointing to Caddy. Document both flows.', status: 'PLANNED', priority: 5 },
  { label: 'Billing tracker spreadsheet/dashboard', description: 'Track per-client: VPS resource usage, Vercel usage, subdomain cost, token estimates. Monthly billing view.', status: 'PLANNED', priority: 6 },
  { label: 'Tech stack decision per archetype', description: 'Finalize which DBs, storage, APIs each archetype needs. Lock in our preferred stack per tier.', status: 'PLANNED', priority: 7 },
  { label: 'HotScout intake → proposal generator', description: 'After intake brief saved, Jasper auto-generates scoped proposal doc in Notion.', status: 'PLANNED', priority: 8 },
  { label: 'Client portal (access to their own agent)', description: 'Minimal web UI where client can see their agent status, usage, change contact prefs.', status: 'FUTURE', priority: 9 },
]

const decisions = [
  { done: true, text: 'Brand: Hotclaw Solutions · hotclaw.ai' },
  { done: true, text: 'Runtime: OpenClaw (Docker per client)' },
  { done: true, text: 'LLM gateway: OpenRouter — client pays their own tokens' },
  { done: true, text: 'Intake form live: hotclaw.ai/chat/demo (HotScout agent)' },
  { done: true, text: 'Architecture: Single VPS + Docker multi-tenant + Caddy reverse proxy' },
  { done: true, text: '7 business archetypes defined with SOUL.md templates' },
  { done: true, text: 'Pricing: 3 tiers ($199/$349/$599/mo + build fee)' },
  { done: true, text: 'Partners: Kyle (builder) + Chad (strategy/sales) — equal' },
  { done: false, text: 'DECISION NEEDED: Hostinger (current) vs Hetzner (recommended) for client VPS' },
  { done: false, text: 'DECISION NEEDED: Vercel team setup — create Hotclaw org' },
  { done: false, text: 'DECISION NEEDED: Chad\'s target verticals (first 3 industries to pursue)' },
  { done: false, text: 'PENDING: Super Hotclaw provisioned on VPS' },
  { done: false, text: 'PENDING: DNS wildcard *.hotclaw.ai → VPS configured' },
]

const techStackMatrix = [
  { service: 'AI Runtime', starter: 'OpenClaw + gpt-4o', standard: 'OpenClaw + Claude 3.5', pro: 'OpenClaw + Claude Opus + sub-agents', cost: 'Client pays via OpenRouter' },
  { service: 'Database', starter: 'Supabase (free tier)', standard: 'Supabase (Pro $25/mo)', pro: 'Supabase Pro + Pinecone', cost: 'Hotclaw pays, bundled in monthly' },
  { service: 'Storage', starter: '—', standard: 'Cloudinary (free)', pro: 'S3 or Cloudinary Pro', cost: 'Bundled or client' },
  { service: 'Voice (TTS)', starter: '—', standard: '—', pro: 'ElevenLabs or Twilio', cost: 'Client pays ~$5–22/mo' },
  { service: 'Video Gen (UGC)', starter: '—', standard: 'Runway Gen-3 API', pro: 'Runway + Midjourney API', cost: 'Client pays per generation' },
  { service: 'Messaging', starter: 'Email only', standard: 'Email + SMS (Twilio)', pro: 'Email + SMS + WhatsApp + Slack', cost: 'Twilio ~$5–20/mo client' },
  { service: 'Hosting', starter: '384MB container', standard: '512MB container', pro: '1GB container', cost: 'Hotclaw pays VPS split' },
  { service: 'Domain', starter: '{name}.hotclaw.ai', standard: '{name}.hotclaw.ai', pro: 'Custom domain (CNAME)', cost: 'Domain: ~$12/yr if custom' },
]

const vpsComparison = [
  { provider: 'Hetzner CX43', specs: '8 vCPU / 16GB / 160GB NVMe', price: '~$11/mo', notes: 'Owns hardware. Best value. Recommended.', recommended: true },
  { provider: 'Hostinger KVM 4', specs: '4 vCPU / 16GB / 200GB SSD', price: '$35/mo', notes: 'Currently have. Leases datacenter space. 3x more expensive.', recommended: false },
  { provider: 'Hetzner CX52', specs: '16 vCPU / 32GB / 320GB NVMe', price: '~$37/mo', notes: 'Scale option: 25–50 clients comfortably.', recommended: false },
  { provider: 'DigitalOcean s-4vcpu-8gb', specs: '4 vCPU / 8GB / 160GB SSD', price: '$48/mo', notes: 'Best DX + managed services. Premium price.', recommended: false },
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
            <p className="text-midnight/50 text-sm mt-0.5">AI agent deployment service · hotclaw.ai · internal: Operation Hot Dog 🌭</p>
          </div>
        </div>
        <p className="text-midnight/60 max-w-2xl mt-4 leading-relaxed">
          We build, host, and maintain custom AI agents for SMBs that can't build their own. Each client gets a dedicated OpenClaw agent — customized, connected, and maintained by us. They bring their business. We bring the brain.
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">hotclaw.ai ✅</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">HotScout Live ✅</span>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Stage: Foundation</span>
          <span className="px-3 py-1 bg-ocean/10 text-ocean rounded-full text-xs font-medium">OpenClaw + Docker</span>
          <span className="px-3 py-1 bg-ocean/10 text-ocean rounded-full text-xs font-medium">OpenRouter Gateway</span>
        </div>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link href="/workshop/operation-hot-dog/how-it-works" className="inline-flex items-center gap-2 px-4 py-2 bg-midnight text-cream rounded-lg text-sm font-medium hover:bg-ocean transition-colors">
            <BookOpen className="w-4 h-4" /> How It Works Guide
          </Link>
          <a href="https://hotclaw.ai/chat/demo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-ink rounded-lg text-sm font-medium hover:bg-amber-300 transition-colors">
            <ExternalLink className="w-4 h-4" /> HotScout Demo
          </a>
          <a href="https://hotclaw.ai/admin" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-cream border border-midnight/10 text-midnight rounded-lg text-sm font-medium hover:border-midnight/30 transition-colors">
            <Settings className="w-4 h-4" /> Admin (Intakes)
          </a>
        </div>
      </div>

      {/* Decisions & Status */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-green-500 rounded-full" />
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h2 className="font-display text-2xl text-midnight">Decisions & Status</h2>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {decisions.map((item, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${item.done ? 'bg-cream border-midnight/5' : 'bg-amber-50 border-amber-200'}`}>
              {item.done
                ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                : <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              }
              <span className={`text-sm leading-relaxed ${item.done ? 'text-midnight/60' : 'text-midnight/80 font-medium'}`}>
                {item.text}
              </span>
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
          <span className="text-sm text-midnight/40">— prioritized</span>
        </div>
        <div className="space-y-3">
          {buildQueue.map((item) => (
            <div key={item.priority} className={`flex items-start gap-4 p-4 rounded-xl border ${
              item.status === 'NEXT' ? 'bg-amber-50 border-amber-200' :
              item.status === 'PLANNED' ? 'bg-cream border-midnight/5' :
              'bg-cream border-midnight/5 opacity-60'
            }`}>
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${
                item.status === 'NEXT' ? 'bg-amber-400' : item.status === 'PLANNED' ? 'bg-midnight/30' : 'bg-midnight/15'
              }`}>
                {item.priority}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-medium text-midnight text-sm">{item.label}</h3>
                  {item.status === 'NEXT' && <span className="px-2 py-0.5 bg-amber-400 text-white rounded-full text-[10px] font-bold tracking-wide">DO THIS</span>}
                  {item.status === 'FUTURE' && <span className="px-2 py-0.5 bg-midnight/10 text-midnight/40 rounded-full text-[10px] font-bold">FUTURE</span>}
                </div>
                <p className="text-xs text-midnight/55 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VPS Comparison */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-cyan-500 rounded-full" />
          <Server className="w-5 h-5 text-cyan-500" />
          <h2 className="font-display text-2xl text-midnight">Hosting Options</h2>
        </div>
        <p className="text-midnight/50 text-sm mb-6">One large VPS shared across all clients — Docker containers + Caddy. Clients won&apos;t all be at peak simultaneously. Start with Hetzner CX43 or CX52.</p>
        <div className="space-y-3">
          {vpsComparison.map((v) => (
            <div key={v.provider} className={`flex items-start gap-4 p-4 rounded-xl border ${v.recommended ? 'bg-green-50 border-green-200' : 'bg-cream border-midnight/5'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-medium text-midnight text-sm">{v.provider}</h3>
                  {v.recommended && <span className="px-2 py-0.5 bg-green-500 text-white rounded-full text-[10px] font-bold">RECOMMENDED</span>}
                </div>
                <p className="text-xs text-midnight/60 mb-1">{v.specs}</p>
                <p className="text-xs text-midnight/40">{v.notes}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-midnight text-sm">{v.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-midnight rounded-xl">
          <p className="text-cream/70 text-xs font-mono leading-relaxed">
            <span className="text-amber-400">// Resource budget per client tier</span><br />
            Starter:      384MB RAM / 0.5 CPU  → fits ~30 starters on CX43<br />
            Standard:     512MB RAM / 1.0 CPU  → fits ~16 standards on CX43<br />
            Professional: 1024MB RAM / 2.0 CPU → fits ~8 pros on CX43<br />
            <span className="text-green-400 mt-2 block">// Real load is 30–40% of limits — bursting handled by Docker</span>
          </p>
        </div>
      </section>

      {/* Domain Strategy */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-ocean rounded-full" />
          <Globe className="w-5 h-5 text-ocean" />
          <h2 className="font-display text-2xl text-midnight">Domain Strategy</h2>
        </div>
        <p className="text-midnight/50 text-sm mb-5">Two tracks. Default is subdomain. Pro tier can bring their own domain.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-cream rounded-xl p-5 border border-midnight/5">
            <h3 className="font-medium text-midnight text-sm mb-2">Default — Hotclaw Subdomain</h3>
            <p className="text-xs text-midnight/50 mb-3">Client gets <code className="bg-midnight/5 px-1.5 py-0.5 rounded text-xs">acmecorp.hotclaw.ai</code></p>
            <ul className="space-y-1.5 text-xs text-midnight/60">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />Zero DNS setup for client</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />Auto-TLS via Caddy + Let&apos;s Encrypt</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />We control, we manage</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />Wildcard *.hotclaw.ai → VPS IP</li>
            </ul>
          </div>
          <div className="bg-ocean/5 rounded-xl p-5 border border-ocean/20">
            <h3 className="font-medium text-midnight text-sm mb-2">Pro — Custom Domain</h3>
            <p className="text-xs text-midnight/50 mb-3">Client sets <code className="bg-midnight/5 px-1.5 py-0.5 rounded text-xs">ai.acmecorp.com → CNAME → acmecorp.hotclaw.ai</code></p>
            <ul className="space-y-1.5 text-xs text-midnight/60">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />White-labeled for client</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />Auto-TLS still works via Caddy</li>
              <li className="flex items-center gap-2"><AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />Client manages their DNS record</li>
              <li className="flex items-center gap-2"><AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />Pro tier add-on only</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tech Stack Matrix */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-purple-500 rounded-full" />
          <Layers className="w-5 h-5 text-purple-500" />
          <h2 className="font-display text-2xl text-midnight">Tech Stack by Tier</h2>
        </div>
        <p className="text-midnight/50 text-sm mb-5">What Hotclaw provides vs. what clients pay for directly. UGC/video clients need the most external services.</p>
        <div className="bg-cream rounded-xl overflow-hidden border border-midnight/5">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[600px]">
              <thead>
                <tr className="bg-midnight/5">
                  <th className="text-left p-3 font-semibold text-midnight">Service</th>
                  <th className="text-left p-3 font-semibold text-midnight">🐟 Starter</th>
                  <th className="text-left p-3 font-semibold text-midnight">🐠 Standard</th>
                  <th className="text-left p-3 font-semibold text-midnight">🐋 Pro</th>
                  <th className="text-left p-3 font-semibold text-midnight/50">Who pays</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight/5">
                {techStackMatrix.map((row) => (
                  <tr key={row.service}>
                    <td className="p-3 font-medium text-midnight">{row.service}</td>
                    <td className="p-3 text-midnight/60">{row.starter || <span className="text-midnight/20">—</span>}</td>
                    <td className="p-3 text-midnight/60">{row.standard || <span className="text-midnight/20">—</span>}</td>
                    <td className="p-3 text-midnight/60">{row.pro || <span className="text-midnight/20">—</span>}</td>
                    <td className="p-3 text-midnight/40">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          <strong>UGC clients (Content Machine):</strong> Video generation via Runway/Sora APIs gets expensive fast. Bill pass-through or require client to have their own API key. Don&apos;t bundle this into flat monthly — it&apos;ll hurt margins.
        </div>
      </section>

      {/* Archetype Cards */}
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
                  <span className="text-midnight/40 w-20 flex-shrink-0">Database</span>
                  <span className="text-midnight/70">{a.db}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-midnight/40 w-20 flex-shrink-0">Integrations</span>
                  <span className="text-midnight/70">{a.integrations.join(', ')}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  {a.voice && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">Voice</span>}
                  {a.videoGen && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-medium">Video Gen</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-ocean rounded-full" />
          <DollarSign className="w-5 h-5 text-ocean" />
          <h2 className="font-display text-2xl text-midnight">Pricing</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {pricingTiers.map((tier) => (
            <div key={tier.name} className={`rounded-xl p-6 border ${tier.highlight ? 'bg-ocean/5 border-ocean/30' : 'bg-cream border-midnight/5'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{tier.emoji}</span>
                <h3 className="font-display text-lg text-midnight">{tier.name}</h3>
                {tier.highlight && <span className="px-2 py-0.5 bg-ocean text-cream rounded-full text-xs font-bold">SWEET SPOT</span>}
              </div>
              <p className="text-2xl font-semibold text-midnight mt-3">{tier.monthly}</p>
              <p className="text-sm text-midnight/50 mb-3">Build: {tier.build}</p>
              <ul className="space-y-1.5 mb-3">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-midnight/70">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="border-t border-midnight/10 pt-3 space-y-1">
                <p className="text-xs text-midnight/40"><span className="text-midnight/60 font-medium">VPS:</span> {tier.vpsResources}</p>
                <p className="text-xs text-midnight/40"><span className="text-midnight/60 font-medium">Tokens:</span> {tier.tokenEst}/mo (client pays)</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vercel / Infrastructure */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-8 bg-midnight rounded-full" />
          <Cloud className="w-5 h-5 text-midnight" />
          <h2 className="font-display text-2xl text-midnight">Infrastructure Map</h2>
        </div>
        <div className="bg-midnight rounded-xl p-6 font-mono text-xs text-green-400 leading-loose overflow-x-auto">
          <p className="text-amber-400 mb-2">// Hotclaw Production Stack</p>
          <p className="text-white/60">Vercel Team (hotclaw-solutions-org)</p>
          <p className="ml-4">├── hotclaw.ai           <span className="text-amber-400">← landing + HotScout intake</span></p>
          <p className="ml-4">├── admin.hotclaw.ai     <span className="text-amber-400">← intake management</span></p>
          <p className="ml-4">└── [client].hotclaw.ai  <span className="text-amber-400">← per-client portal (future)</span></p>
          <p className="text-white/60 mt-3">VPS (Hetzner CX43 — recommended)</p>
          <p className="ml-4">├── Caddy (reverse proxy + auto-TLS)</p>
          <p className="ml-4">├── super-hotclaw        <span className="text-amber-400">← OUR agent, runs on :18799</span></p>
          <p className="ml-4">├── openclaw-acmecorp    <span className="text-amber-400">← client 1, runs on :18800</span></p>
          <p className="ml-4">└── openclaw-[...]       <span className="text-amber-400">← clients 2-N, ports 18801+</span></p>
          <p className="text-white/60 mt-3">DNS (Cloudflare)</p>
          <p className="ml-4">hotclaw.ai      → Vercel</p>
          <p className="ml-4">*.hotclaw.ai    → VPS IP  <span className="text-amber-400">← wildcard for all client subdomains</span></p>
        </div>
      </section>

      {/* Links */}
      <section className="pt-8 border-t border-midnight/10">
        <h2 className="font-display text-xl text-midnight mb-4">Reference Links</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { name: 'How It Works Guide', href: '/workshop/operation-hot-dog/how-it-works', desc: 'Full technical + business reference', internal: true },
            { name: 'HotScout Live Demo', href: 'https://hotclaw.ai/chat/demo', desc: 'Test the intake experience', internal: false },
            { name: 'Admin Dashboard', href: 'https://hotclaw.ai/admin', desc: 'View submitted intakes', internal: false },
            { name: 'Hetzner Cloud', href: 'https://www.hetzner.com/cloud/', desc: 'Recommended VPS (CX43)', internal: false },
            { name: 'OpenRouter Models', href: 'https://openrouter.ai/models', desc: '400+ models, pricing', internal: false },
            { name: 'Provision Script', href: '/workshop/operation-hot-dog/how-it-works', desc: 'provision-client.sh — infra on disk', internal: true },
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
