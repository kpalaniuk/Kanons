'use client'

import Link from 'next/link'
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
  BookOpen,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Users,
  Video,
  Phone,
  Briefcase,
  Search,
  MessageSquare,
  MapPin,
  Mic,
} from 'lucide-react'

const archetypes = [
  {
    emoji: '🎥',
    icon: Video,
    title: 'Content Machine',
    tagline: 'Produces and posts social content automatically',
    who: 'Agencies, creators, real estate teams, brands',
    priority: 'HIGH',
    complexity: 'MEDIUM',
  },
  {
    emoji: '📞',
    icon: Phone,
    title: 'Follow-Up Machine',
    tagline: 'Never lets a lead go cold',
    who: 'Mortgage, insurance, real estate, med spas',
    priority: 'VERY HIGH',
    complexity: 'MEDIUM-HIGH',
  },
  {
    emoji: '📋',
    icon: Briefcase,
    title: 'Operations Manager',
    tagline: 'Internal KB, reports, team onboarding',
    who: 'Construction, property mgmt, franchises',
    priority: 'HIGH',
    complexity: 'MEDIUM',
  },
  {
    emoji: '🔍',
    icon: Search,
    title: 'Research Engine',
    tagline: 'Daily intelligence briefs, document analysis',
    who: 'Analysts, consultants, investors',
    priority: 'MEDIUM',
    complexity: 'LOW',
  },
  {
    emoji: '💬',
    icon: MessageSquare,
    title: 'Client Communication Hub',
    tagline: 'Proactive updates and renewal management',
    who: 'Agencies, law firms, contractors, designers',
    priority: 'MEDIUM',
    complexity: 'LOW',
  },
  {
    emoji: '📍',
    icon: MapPin,
    title: 'Local Business Multiplier',
    tagline: 'Social, email, Google reviews on autopilot',
    who: 'Restaurants, salons, gyms, boutiques',
    priority: 'MEDIUM',
    complexity: 'LOW',
  },
  {
    emoji: '🎙️',
    icon: Mic,
    title: 'Executive Assistant',
    tagline: 'Full personal agent — calendar, email, voice',
    who: 'Founders, executives, high-volume professionals',
    priority: 'HIGH',
    complexity: 'HIGH',
  },
]

const pricingTiers = [
  {
    name: 'Starter',
    emoji: '🐟',
    build: '$1,500–2,500',
    monthly: '$199/mo',
    includes: ['1 primary use case', '1 integration', 'SOUL.md customization', 'Onboarding session'],
    clientTokens: '~$15–40/mo to OpenRouter',
  },
  {
    name: 'Standard',
    emoji: '🐠',
    build: '$3,000–5,000',
    monthly: '$349/mo',
    includes: ['2–3 use cases', '2–3 integrations', 'Sub-agents included', '30-day check-in'],
    clientTokens: '~$20–60/mo to OpenRouter',
    highlight: true,
  },
  {
    name: 'Professional',
    emoji: '🐋',
    build: '$6,000–12,000',
    monthly: '$599/mo',
    includes: ['All use cases', '5+ integrations', 'Memory system', 'Voice interface'],
    clientTokens: '~$50–150/mo to OpenRouter',
  },
]

const openQuestions = [
  { done: false, text: 'Exact current Hostinger VPS specs — how much room do we have now?' },
  { done: false, text: 'Separate VPS for client containers vs same VPS?' },
  { done: false, text: 'Domain for intake form (Kyle acquiring)' },
  { done: false, text: 'External product name — what do we call this to clients?' },
  { done: false, text: 'Chad\'s target verticals list — first industries to pursue' },
  { done: true, text: 'OpenRouter confirmed as unified LLM gateway ✅' },
  { done: true, text: 'Single VPS + Docker multi-tenant architecture confirmed ✅' },
  { done: true, text: 'Client discovery framework drafted ✅' },
  { done: true, text: 'Business archetypes defined (7 types) ✅' },
  { done: true, text: 'Pricing model drafted (3 tiers) ✅' },
  { done: true, text: 'Competitive landscape mapped ✅' },
  { done: true, text: 'Intake form deployed at hot-dog-intake.vercel.app ✅' },
  { done: true, text: 'Workshop RBAC — Chad gets /operation-hot-dog access ✅' },
]

const buildQueue = [
  { label: 'Add OPENROUTER_API_KEY to intake form', description: 'Kyle adds env var in Vercel → intake form goes live', status: 'blocked', blocker: 'Needs Kyle' },
  { label: 'Provision script for new client containers', description: 'Bash script: new Docker container + Caddy entry + subdomain per client', status: 'next' },
  { label: 'SOUL.md templates by archetype', description: 'Pre-built starter souls for each of the 7 business types', status: 'next' },
  { label: 'Admin dashboard for intakes', description: 'Improve /admin on intake app — show full brief, add notes, status tracking', status: 'planned' },
  { label: 'Proposal generator', description: 'Jasper reads intake brief → drafts scoped proposal doc in Notion', status: 'planned' },
  { label: 'Client onboarding wizard', description: 'Step-by-step setup flow after intake — account creation, key collection, container provisioning', status: 'planned' },
]

const competitorData = [
  { name: 'xCloud', price: '$24/mo', custom: false, integration: false, support: 'Infra only', target: 'Individuals' },
  { name: 'ClawTank', price: '$19–39/mo', custom: false, integration: false, support: 'None', target: 'Developers' },
  { name: 'AI Agency', price: '$2k+/mo', custom: true, integration: true, support: 'Full', target: 'Enterprise' },
  { name: '🌭 Hot Dog', price: '$199–599/mo', custom: true, integration: true, support: 'Included', target: 'SMB' },
]

export default function OperationHotDogPage() {
  return (
    <div className="space-y-14 pb-16">

      {/* Header */}
      <div className="border-b border-midnight/10 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-midnight rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-4xl text-midnight">Operation Hot Dog</h1>
            <p className="text-midnight/50 text-sm mt-0.5">Productized AI agent deployment service — internal codename 🌭</p>
          </div>
        </div>
        <p className="text-midnight/60 max-w-2xl mt-4 leading-relaxed">
          We host customized OpenClaw agents for businesses that can't build their own. Each client gets a dedicated AI built specifically for their workflows — connected to their tools, trained on their business, maintained by us.
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          <span className="px-3 py-1 bg-ocean/10 text-ocean rounded-full text-xs font-medium">OpenClaw + Docker</span>
          <span className="px-3 py-1 bg-ocean/10 text-ocean rounded-full text-xs font-medium">Hostinger VPS</span>
          <span className="px-3 py-1 bg-ocean/10 text-ocean rounded-full text-xs font-medium">OpenRouter (client BYOK)</span>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Stage: Research + Early Build</span>
        </div>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link
            href="/workshop/operation-hot-dog/how-it-works"
            className="inline-flex items-center gap-2 px-4 py-2 bg-midnight text-cream rounded-lg text-sm font-medium hover:bg-ocean transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Read the How It Works Guide
          </Link>
          <a
            href="https://hot-dog-intake.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-ink rounded-lg text-sm font-medium hover:bg-amber-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Intake Form (Live)
          </a>
        </div>
      </div>

      {/* Business Archetypes */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-amber-400 rounded-full" />
          <h2 className="font-display text-2xl text-midnight">The 7 Client Archetypes</h2>
        </div>
        <p className="text-midnight/60 mb-5 text-sm">Every client maps to one of these. Archetype determines SOUL.md template, tools, and pricing tier.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {archetypes.map((a) => (
            <div key={a.title} className="bg-cream rounded-xl p-5 border border-midnight/5 flex gap-4">
              <span className="text-2xl flex-shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-midnight text-sm">{a.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                    a.priority === 'VERY HIGH' ? 'bg-red-100 text-red-700' :
                    a.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                    'bg-midnight/5 text-midnight/50'
                  }`}>
                    {a.priority}
                  </span>
                </div>
                <p className="text-xs text-midnight/60 mb-1">{a.tagline}</p>
                <p className="text-xs text-midnight/40">{a.who}</p>
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
          <h2 className="font-display text-2xl text-midnight">Pricing Model</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl p-6 border ${tier.highlight ? 'bg-ocean/5 border-ocean/30' : 'bg-cream border-midnight/5'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{tier.emoji}</span>
                <h3 className="font-display text-lg text-midnight">{tier.name}</h3>
                {tier.highlight && <span className="px-2 py-0.5 bg-ocean text-cream rounded-full text-xs font-bold">SWEET SPOT</span>}
              </div>
              <p className="text-2xl font-semibold text-midnight mt-3">{tier.monthly}</p>
              <p className="text-sm text-midnight/50 mb-4">Build: {tier.build}</p>
              <ul className="space-y-1.5 mb-4">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-midnight/70">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-midnight/40 border-t border-midnight/10 pt-3">
                Client also pays: {tier.clientTokens}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Competitive Landscape */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-cyan-500 rounded-full" />
          <TrendingUp className="w-5 h-5 text-cyan-500" />
          <h2 className="font-display text-2xl text-midnight">Competitive Landscape</h2>
        </div>
        <div className="bg-cream rounded-xl overflow-hidden border border-midnight/5">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-midnight/5">
                <th className="text-left p-3 font-medium text-midnight">Provider</th>
                <th className="text-left p-3 font-medium text-midnight">Price</th>
                <th className="text-left p-3 font-medium text-midnight">Custom</th>
                <th className="text-left p-3 font-medium text-midnight">Integrations</th>
                <th className="text-left p-3 font-medium text-midnight">Support</th>
                <th className="text-left p-3 font-medium text-midnight">Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight/5">
              {competitorData.map((c) => (
                <tr key={c.name} className={c.name.includes('Hot Dog') ? 'bg-amber-50' : ''}>
                  <td className="p-3 font-medium text-midnight">{c.name}</td>
                  <td className="p-3 text-midnight/70">{c.price}</td>
                  <td className="p-3">{c.custom ? <CheckCircle className="w-4 h-4 text-green-500" /> : <span className="text-midnight/25">—</span>}</td>
                  <td className="p-3">{c.integration ? <CheckCircle className="w-4 h-4 text-green-500" /> : <span className="text-midnight/25">—</span>}</td>
                  <td className="p-3 text-midnight/70">{c.support}</td>
                  <td className="p-3 text-midnight/70">{c.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-midnight/40 mt-2">
          We&apos;re the only provider with business-specific customization at SMB price points. xCloud and ClawTank serve individuals. Agencies serve enterprise.
        </p>
      </section>

      {/* Build Queue */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-amber-400 rounded-full" />
          <h2 className="font-display text-2xl text-midnight">Build Queue</h2>
        </div>
        <div className="space-y-3">
          {buildQueue.map((item, i) => (
            <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${
              item.status === 'next' ? 'bg-amber-50 border-amber-200' :
              item.status === 'blocked' ? 'bg-red-50 border-red-200' :
              'bg-cream border-midnight/5'
            }`}>
              <div className={`w-6 h-6 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-xs font-bold text-white ${
                item.status === 'next' ? 'bg-amber-400' :
                item.status === 'blocked' ? 'bg-red-400' :
                'bg-midnight/20'
              }`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-midnight text-sm">{item.label}</h3>
                  {item.status === 'next' && <span className="px-2 py-0.5 bg-amber-400 text-white rounded-full text-xs font-bold">NEXT</span>}
                  {item.status === 'blocked' && <span className="px-2 py-0.5 bg-red-400 text-white rounded-full text-xs font-bold">BLOCKED: {item.blocker}</span>}
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

      {/* Architecture */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-cyan-500 rounded-full" />
          <h2 className="font-display text-2xl text-midnight">Infrastructure</h2>
        </div>
        <div className="bg-midnight rounded-xl p-6 font-mono text-sm text-green-400 leading-relaxed overflow-x-auto mb-4">
          <p className="text-midnight/50 font-sans text-xs mb-4">// Hostinger KVM 4+ (16GB RAM) — handles 25–50 clients comfortably</p>
          <p>Client A → alice.yourdomain.com → Caddy → :18800 → <span className="text-amber-400">openclaw-clientA</span></p>
          <p>Client B → bob.yourdomain.com  → Caddy → :18801 → <span className="text-amber-400">openclaw-clientB</span></p>
          <p>Client C → carol.yourdomain.com → Caddy → :18802 → <span className="text-amber-400">openclaw-clientC</span></p>
          <p className="mt-4 text-green-400/50">// Each container: -m 512m --cpus=1 --read-only --cap-drop=ALL</p>
          <p className="text-green-400/50">// Client API key: -e OPENROUTER_API_KEY=their-own-key</p>
        </div>
      </section>

      {/* Key Links */}
      <section className="pt-8 border-t border-midnight/10">
        <h2 className="font-display text-xl text-midnight mb-4">References</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { name: 'ClawTank Docker Guide', url: 'https://clawtank.dev/blog/openclaw-multi-tenant-docker-guide', desc: 'Our technical architecture reference' },
            { name: 'OpenRouter Models', url: 'https://openrouter.ai/models', desc: '400+ models, pricing, capabilities' },
            { name: 'Hostinger VPS', url: 'https://www.hostinger.com/vps-hosting', desc: 'Infrastructure specs and pricing' },
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
