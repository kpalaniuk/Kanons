'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, CheckCircle2, Circle, Clock, AlertCircle, Zap,
  Server, Globe, Bot, CreditCard, Users, Mail, MessageSquare,
  ChevronDown, ChevronUp, ExternalLink, Terminal, Flame
} from 'lucide-react'

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface AgendaItem {
  id: string
  time: string
  title: string
  lead: 'kyle' | 'ceda' | 'both' | 'jasper'
  type: 'launch' | 'decision' | 'review' | 'build'
  points: string[]
  decisions?: string[]
  link?: { label: string; url: string }
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const agendaItems: AgendaItem[] = [
  {
    id: 'a1',
    time: '9:00',
    title: 'State of the Build — What Jasper Built Overnight',
    lead: 'kyle',
    type: 'review',
    points: [
      'VPS provisioned: super-hotclaw at 178.156.180.155 (Hetzner CCX23, Ashburn VA) — 4 dedicated AMD cores, 16GB RAM, 200GB volume',
      'Caddy installed with wildcard TLS — *.hotclaw.ai cert is live and valid through May 31',
      'DNS wired: super.hotclaw.ai + *.hotclaw.ai → VPS via Cloudflare',
      'All ops scripts built: provision-client.sh, onboard-client.sh, monitor-clients.sh, preflight-check.sh, ingest-memories.sh',
      'Pinecone three-tier memory architecture wired (hotclaw-super index, recall hook ready)',
      'Supabase project created, schema ready to initialize',
      'Discord bot live in the Jasper server',
      'HotScout intake form live at hotclaw.ai — Scout chat agent capturing briefs',
      'Jasper has root SSH access to VPS — can deploy remotely on command',
    ],
    link: { label: 'Full setup guide →', url: '/workshop/operation-hot-dog/setup' },
  },
  {
    id: 'a2',
    time: '9:15',
    title: 'SHC Launch Sequence — Do This Live in the Meeting',
    lead: 'both',
    type: 'launch',
    points: [
      'Step 1 (Kyle): Paste SUPABASE-INIT.sql into Supabase SQL editor — creates 4 tables in ~30 seconds',
      'Step 2 (Jasper): Run preflight-check.sh — live-tests every API key before touching anything',
      'Step 3 (Jasper): Run setup-shc.sh — installs OpenClaw, writes config, hooks, systemd service, starts SHC',
      'Step 4 (Both): @mention Super Hotclaw Discord bot — if it responds, SHC is online',
      'Step 5 (Both): https://super.hotclaw.ai should return 200 instead of 502',
    ],
    decisions: [
      'Stripe price IDs — do we add dummy values to unblock onboard-client.sh, or wait for Stripe verification first?',
    ],
    link: { label: 'Supabase SQL editor →', url: 'https://supabase.com/dashboard/project/apceaxfvgnqsscdilxqd/sql' },
  },
  {
    id: 'a3',
    time: '9:45',
    title: 'Ceda Briefing — What Hotclaw Is',
    lead: 'kyle',
    type: 'review',
    points: [
      'Hotclaw Solutions: productized AI agent deployment for SMBs. We provision customized OpenClaw instances on our VPS.',
      'One VPS, Docker containers per client, wildcard subdomain routing (client.hotclaw.ai)',
      'Clients bring their own OpenRouter key — self-govern AI costs, we handle infra',
      'HotScout captures intake brief → onboard-client.sh provisions full environment in ~5 min',
      'Three archetypes to lead with: Follow-Up Machine (mortgage/insurance/RE), Personal Assistant, Executive Assistant',
      'Ceda\'s role: sales, strategy, warm leads. Kyle + Jasper handle all code and infra.',
    ],
    link: { label: 'How It Works →', url: '/workshop/operation-hot-dog/how-it-works' },
  },
  {
    id: 'a4',
    time: '10:00',
    title: 'Personal Bot Tier — Add to Offering',
    lead: 'both',
    type: 'decision',
    points: [
      'Personal tier: lightweight assistant via SMS — morning brief, calendar, reminders, email triage',
      'CCX23 capacity: ~40-50 personal bots at 384MB each (vs ~15 business bots at 768MB)',
      'Personal tier requires Google OAuth wizard — Calendar + Gmail — Jasper builds this once Google Cloud app is registered',
      'SDMC (Tracy + Mike) are the first personal bot test — mortgage business context, GHL wire-up, SMS morning briefs',
      'Consumer positioning: above commodity ($20/mo ChatGPT), below business tier. All-hands-off at scale.',
    ],
    decisions: [
      'What do we name this tier publicly? (Personal, Starter, Companion?)',
      'Price point? (Parked — but need a ballpark before Ceda pitches anyone)',
      'Does SDMC get it free as a pilot, or soft-charge to test billing flow?',
    ],
  },
  {
    id: 'a5',
    time: '10:20',
    title: 'Pricing & Tiers — Align Before First Pitch',
    lead: 'both',
    type: 'decision',
    points: [
      'Current placeholder tiers: Personal (?/mo), Pro (~$349/mo), Pro Plus (~$599/mo)',
      'All tiers get the same model quality via OpenRouter — differentiated by features, support, onboarding depth',
      'Setup fee is the main value signal: includes SOUL.md customization, integrations, and Jasper\'s time',
      'Business archetypes (Follow-Up Machine, Exec Assistant, etc.) each need specific integrations — more setup = higher setup fee',
      'Twilio SMS is included for all tiers on our shared number; clients optionally BYOK for dedicated number',
    ],
    decisions: [
      'Personal tier monthly price?',
      'Pro setup fee range? ($1,500? $2,500? Scope-dependent?)',
      'Do we do a limited-time founder rate for first 10 clients?',
      'Ceda: what are the first 10 warm verticals you want to target?',
    ],
  },
  {
    id: 'a6',
    time: '10:40',
    title: 'SHC First Mission — Admin Control Center',
    lead: 'jasper',
    type: 'build',
    points: [
      'admin.hotclaw.ai — Kyle + Ceda\'s command center, auth via Clerk (separate hotclaw.ai app)',
      'Shows: all client containers (status, uptime, CPU/mem), Stripe MRR, HotScout intake briefs, Twilio SMS log, VPS system health',
      'One-click provision/deprovision from the UI',
      'Jasper builds this autonomously after SHC is online',
    ],
    decisions: [
      'Ceda needs a Clerk invite to admin.hotclaw.ai — separate from kyle.palaniuk.net Clerk instance',
      'Should admin panel show raw client API keys, or mask them for Ceda?',
    ],
  },
  {
    id: 'a7',
    time: '10:55',
    title: 'Email & Comms Setup',
    lead: 'kyle',
    type: 'build',
    points: [
      'kyle@hotclaw.ai + ceda@hotclaw.ai via Google Workspace ($6/user/mo = $12/mo) — Gmail UI, same Google account',
      'MX records added to Cloudflare hotclaw.ai zone — 5 minutes to set up',
      'Transactional email (client welcome, Stripe receipts, alerts): Resend.com — Next.js native, 3k emails/mo free, $20/mo after',
      'Twilio already live: +1 (619) 304-3187, A2P 10DLC registered — usable for LO Buddy and Hotclaw SMS',
    ],
    decisions: [
      'Kyle: Set up Google Workspace for hotclaw.ai today or after SHC launch?',
      'Resend vs Postmark for transactional? (Resend recommended — React Email templates, Next.js native)',
    ],
  },
  {
    id: 'a8',
    time: '11:05',
    title: 'SDMC Pilot — Provision Tracy + Mike',
    lead: 'both',
    type: 'build',
    points: [
      'Tracy and Mike are Brad\'s SDMC team — personal assistant + follow-up hybrid bots',
      'LO Ninja/GHL already wired in the Hotclaw infra via the follow-up-machine soul template',
      'Manual intake for first pilot — onboard-client.sh takes ~5 minutes per client',
      'Test the full pipeline: provision → SOUL.md customized → agent online at sdmc-tracy.hotclaw.ai',
      'Once Google OAuth wizard is built, SDMC gets self-serve Calendar + Gmail connection',
    ],
    decisions: [
      'Tracy + Mike timezone? (Assuming Pacific — confirm with Brad)',
      'Individual OpenRouter keys or one shared SDMC key?',
      'SMS or Discord as their primary interface?',
    ],
  },
  {
    id: 'a9',
    time: '11:20',
    title: 'Ceda\'s Sales Pipeline — First 10 Targets',
    lead: 'ceda',
    type: 'decision',
    points: [
      'Lead with the Follow-Up Machine for mortgage, insurance, real estate — high pain, measurable ROI',
      'Personal Assistant tier for solo operators, coaches, consultants — lower friction sale',
      'Hotclaw.ai intake form is live — HotScout can qualify leads async',
      'Warm intros beat cold outreach — who does Ceda know in mortgage, RE, insurance?',
    ],
    decisions: [
      'Ceda: Who are your first 10 warm leads? Names + verticals.',
      'Do we build a one-pager / pitch deck before first outreach?',
      'What\'s the target MRR for the first 60 days?',
    ],
  },
]

// ─── BADGE HELPERS ─────────────────────────────────────────────────────────────

const leadLabel = (lead: AgendaItem['lead']) => {
  if (lead === 'kyle') return { text: 'Kyle leads', bg: 'bg-ocean/10 text-ocean' }
  if (lead === 'ceda') return { text: 'Ceda leads', bg: 'bg-purple-500/10 text-purple-600' }
  if (lead === 'jasper') return { text: 'Jasper', bg: 'bg-peach/20 text-peach' }
  return { text: 'Both', bg: 'bg-green-500/10 text-green-600' }
}

const typeLabel = (type: AgendaItem['type']) => {
  if (type === 'launch') return { text: '🚀 Launch', bg: 'bg-red-500/10 text-red-600' }
  if (type === 'decision') return { text: '⚡ Decision', bg: 'bg-amber-500/10 text-amber-700' }
  if (type === 'review') return { text: '📋 Review', bg: 'bg-blue-500/10 text-blue-600' }
  return { text: '🔨 Build', bg: 'bg-green-500/10 text-green-700' }
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function MeetingBriefPage() {
  const [expanded, setExpanded] = useState<string | null>('a2')

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <Link href="/workshop/operation-hot-dog" className="inline-flex items-center gap-2 text-muted text-sm mb-8 hover:text-ocean transition-colors">
          <ArrowLeft size={14} />
          Hotclaw HQ
        </Link>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-peach/20 flex items-center justify-center">
              <Flame size={20} className="text-peach" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wider">Meeting Brief</p>
              <h1 className="text-2xl font-display font-bold text-midnight">Kyle × Ceda — March 3, 2026</h1>
            </div>
          </div>
          <p className="text-midnight/60 leading-relaxed">
            9:00 AM PST. Launch SHC, align on pricing, confirm SDMC pilot, and figure out what Ceda pitches first.
            Jasper built the infra — today we bring it online and start selling.
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'Server', value: 'Online ✓', sub: 'Hetzner CCX23, Ashburn VA' },
              { label: 'TLS', value: '*.hotclaw.ai ✓', sub: 'Let\'s Encrypt, exp May 31' },
              { label: 'SHC Status', value: '502 → needs install', sub: 'Step 2 of today\'s agenda' },
            ].map((s, i) => (
              <div key={i} className="bg-cream rounded-xl p-4 border border-midnight/5">
                <p className="text-xs text-muted mb-1">{s.label}</p>
                <p className="text-sm font-semibold text-midnight">{s.value}</p>
                <p className="text-xs text-muted mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agenda */}
        <div className="space-y-3">
          {agendaItems.map((item) => {
            const isOpen = expanded === item.id
            const lead = leadLabel(item.lead)
            const type = typeLabel(item.type)
            return (
              <div key={item.id} className="bg-cream rounded-2xl border border-midnight/5 overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-midnight/2 transition-colors"
                >
                  <span className="text-xs font-mono text-muted w-10 shrink-0">{item.time}</span>
                  <span className="flex-1 font-medium text-midnight text-sm">{item.title}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${type.bg}`}>{type.text}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lead.bg}`}>{lead.text}</span>
                    {isOpen ? <ChevronUp size={14} className="text-muted" /> : <ChevronDown size={14} className="text-muted" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-midnight/5">
                    <div className="pt-4 space-y-4">
                      {/* Points */}
                      <ul className="space-y-2">
                        {item.points.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-midnight/70">
                            <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Decisions */}
                      {item.decisions && item.decisions.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Decisions needed</p>
                          <ul className="space-y-1.5">
                            {item.decisions.map((d, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                                <AlertCircle size={13} className="mt-0.5 shrink-0" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Link */}
                      {item.link && (
                        <Link
                          href={item.link.url}
                          target={item.link.url.startsWith('http') ? '_blank' : undefined}
                          className="inline-flex items-center gap-1.5 text-sm text-ocean hover:underline"
                        >
                          <ExternalLink size={13} />
                          {item.link.label}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer nav */}
        <div className="mt-10 pt-6 border-t border-midnight/10 flex flex-wrap gap-3">
          {[
            { label: '← Hotclaw HQ', href: '/workshop/operation-hot-dog' },
            { label: 'Setup Guide', href: '/workshop/operation-hot-dog/setup' },
            { label: 'How It Works', href: '/workshop/operation-hot-dog/how-it-works' },
            { label: 'Logos', href: '/workshop/operation-hot-dog/logos' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-ocean hover:underline">
              {l.label}
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
