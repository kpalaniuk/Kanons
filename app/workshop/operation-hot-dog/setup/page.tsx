'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Server, Key, Globe, Database, Phone, Mic, CreditCard, Github,
  Bot, CheckCircle2, Circle, ChevronDown, ChevronUp, ExternalLink,
  ArrowLeft, Zap, Shield, Terminal, Package, Wifi, AlertCircle,
  RefreshCw, Video, MessageSquare, Cloud
} from 'lucide-react'

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Step {
  id: string
  who: 'kyle' | 'chad' | 'jasper' | 'both'
  text: string
  detail?: string
  link?: { label: string; url: string }
  code?: string
  warning?: string
}

interface Phase {
  id: string
  number: number
  title: string
  subtitle: string
  icon: React.ReactNode
  color: string
  steps: Step[]
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const phases: Phase[] = [
  {
    id: 'phase-0',
    number: 0,
    title: 'Accounts & Keys',
    subtitle: 'Create every account and collect every API key before touching the server.',
    icon: <Key size={20} />,
    color: 'orange',
    steps: [
      {
        id: 'p0-hetzner-signup',
        who: 'kyle',
        text: 'Sign up for Hetzner Cloud',
        detail: 'Create account, add a payment method. This is our VPS host — 3x cheaper than Hostinger for better hardware.',
        link: { label: 'hetzner.com/cloud', url: 'https://www.hetzner.com/cloud' },
      },
      {
        id: 'p0-hetzner-server',
        who: 'kyle',
        text: 'Provision CX52 server',
        detail: 'New Project → "hotclaw-solutions". Create Server: Location = Ashburn VA, OS = Ubuntu 24.04 LTS, Type = CX52 (16 vCPU / 32GB / $37/mo). Add your SSH public key. Hostname: super.hotclaw.ai',
        warning: 'Run `cat ~/.ssh/id_ed25519.pub` on your Mac to get your public key. If no key exists, run `ssh-keygen -t ed25519` first.',
      },
      {
        id: 'p0-hetzner-volume',
        who: 'kyle',
        text: 'Add a 160GB volume to the server',
        detail: 'In Hetzner dashboard → Volumes → Create Volume → 160GB → attach to your CX52. This is where client data lives. ~$8/mo.',
      },
      {
        id: 'p0-hetzner-ip',
        who: 'kyle',
        text: 'Copy server IP → share with Jasper',
        detail: 'After provisioning, Hetzner shows the IP. Drop it in Discord so Jasper can wire up Cloudflare DNS.',
      },
      {
        id: 'p0-cloudflare-token',
        who: 'kyle',
        text: 'Create Cloudflare API token',
        detail: 'Cloudflare dashboard → Profile → API Tokens → Create Token → use "Edit zone DNS" template → scope to hotclaw.ai zone only.',
        link: { label: 'cloudflare.com/profile/api-tokens', url: 'https://dash.cloudflare.com/profile/api-tokens' },
      },
      {
        id: 'p0-twilio',
        who: 'kyle',
        text: 'Create Twilio account + buy a number',
        detail: 'Sign up at twilio.com. Buy a number — (619) area code if available, otherwise (858) or (760). Copy Account SID + Auth Token from the console dashboard.',
        link: { label: 'twilio.com/console', url: 'https://console.twilio.com' },
      },
      {
        id: 'p0-openrouter',
        who: 'kyle',
        text: 'Confirm OpenRouter API key is funded',
        detail: 'Check openrouter.ai → Keys — confirm the Super Hotclaw key is active. Top up credits if needed. One key covers all our LLM calls.',
        link: { label: 'openrouter.ai/keys', url: 'https://openrouter.ai/keys' },
      },
      {
        id: 'p0-pinecone',
        who: 'kyle',
        text: 'Create Pinecone project + index',
        detail: 'Sign in at pinecone.io → Create Project "hotclaw" → Create Index: Name = hotclaw-super, Dimensions = 1536, Metric = cosine, Cloud = AWS us-east-1. Starter plan is free to start.',
        link: { label: 'pinecone.io', url: 'https://app.pinecone.io' },
      },
      {
        id: 'p0-supabase',
        who: 'kyle',
        text: 'Create Supabase project',
        detail: 'supabase.com → New project → name: hotclaw-super, region: East US. Copy the Project URL and anon/service_role keys.',
        link: { label: 'supabase.com', url: 'https://supabase.com/dashboard' },
      },
      {
        id: 'p0-elevenlabs',
        who: 'kyle',
        text: 'Get ElevenLabs API key',
        detail: 'elevenlabs.io → Profile → API Keys → Create. Standard plan ($22/mo) gives us 100k chars/mo — plenty for agent voice responses.',
        link: { label: 'elevenlabs.io', url: 'https://elevenlabs.io' },
      },
      {
        id: 'p0-runway',
        who: 'kyle',
        text: 'Get Runway API key',
        detail: 'runwayml.com → account → API access. We use this for video gen. BYOK for clients (they get their own key for Pro+ tier).',
        link: { label: 'runwayml.com', url: 'https://runwayml.com' },
      },
      {
        id: 'p0-discord-bot',
        who: 'kyle',
        text: 'Create Discord bot for Super Hotclaw',
        detail: 'discord.com/developers → New Application → "Super Hotclaw" → Bot → Reset Token (copy it) → OAuth2 → Bot → check: Send Messages, Read History, Add Reactions → invite to your server. Also get your Guild ID (right-click server → Copy ID).',
        link: { label: 'discord.com/developers', url: 'https://discord.com/developers/applications' },
      },
      {
        id: 'p0-stripe',
        who: 'chad',
        text: 'Create Stripe account for Hotclaw Solutions',
        detail: 'stripe.com → sign up under Hotclaw Solutions name. Get the Secret Key from Dashboard → Developers → API Keys. Also set up a product + pricing plan for each tier.',
        link: { label: 'stripe.com', url: 'https://stripe.com' },
      },
      {
        id: 'p0-github-org',
        who: 'kyle',
        text: 'Create GitHub org "hotclaw-solutions"',
        detail: 'github.com → + → New organization → hotclaw-solutions. Free tier is fine. We\'ll move hot-dog-infra here.',
        link: { label: 'github.com/organizations/new', url: 'https://github.com/organizations/new' },
      },
      {
        id: 'p0-vercel-team',
        who: 'kyle',
        text: 'Create Vercel team "hotclaw"',
        detail: 'vercel.com → create team → transfer hot-dog-intake project into it. This keeps Hotclaw billing separate from Kanons.',
        link: { label: 'vercel.com', url: 'https://vercel.com' },
      },
      {
        id: 'p0-keys-collected',
        who: 'both',
        text: 'Paste all keys into Discord for Jasper',
        detail: 'Drop them in a DM or private channel — NOT in #lo-buddy-hopper. Jasper will load them into the VPS .env file and then confirm they\'re saved.',
        warning: 'Never paste API keys in a public channel. DM Jasper or use a private thread.',
      },
    ],
  },
  {
    id: 'phase-1',
    number: 1,
    title: 'Server Hardening',
    subtitle: 'Base security and infrastructure setup. Kyle SSH\'s in and runs these commands.',
    icon: <Shield size={20} />,
    color: 'blue',
    steps: [
      {
        id: 'p1-ssh',
        who: 'kyle',
        text: 'SSH into the server',
        code: 'ssh root@YOUR_SERVER_IP',
        detail: 'First login is as root. We\'ll create a dedicated hotclaw user next.',
      },
      {
        id: 'p1-update',
        who: 'kyle',
        text: 'Update system packages',
        code: 'apt update && apt upgrade -y',
      },
      {
        id: 'p1-essentials',
        who: 'kyle',
        text: 'Install essentials',
        code: 'apt install -y curl wget git htop ufw fail2ban ca-certificates gnupg lsb-release jq unzip tmux',
      },
      {
        id: 'p1-user',
        who: 'kyle',
        text: 'Create hotclaw user',
        code: `adduser hotclaw\nusermod -aG sudo hotclaw\nrsync --archive --chown=hotclaw:hotclaw ~/.ssh /home/hotclaw/`,
        detail: 'Creates a non-root user for running services. Copies your SSH key so you can still log in.',
      },
      {
        id: 'p1-firewall',
        who: 'kyle',
        text: 'Configure UFW firewall',
        code: `ufw default deny incoming\nufw default allow outgoing\nufw allow ssh\nufw allow 80\nufw allow 443\nufw enable`,
      },
      {
        id: 'p1-fail2ban',
        who: 'kyle',
        text: 'Enable fail2ban',
        code: `systemctl enable fail2ban\nsystemctl start fail2ban`,
        detail: 'Blocks IPs that repeatedly fail SSH login. Essential for any public server.',
      },
      {
        id: 'p1-docker',
        who: 'kyle',
        text: 'Install Docker',
        code: `curl -fsSL https://get.docker.com | bash\nusermod -aG docker hotclaw\nnewgrp docker\ndocker run hello-world`,
      },
      {
        id: 'p1-volume',
        who: 'kyle',
        text: 'Mount the data volume',
        code: `# Find your volume device (look for unformatted block device)\nlsblk\n\n# Format + mount (replace sdb with your device name)\nmkfs.ext4 /dev/sdb\nmkdir -p /data\nmount /dev/sdb /data\nchown -R hotclaw:hotclaw /data\n\n# Auto-mount on reboot\necho '/dev/sdb /data ext4 defaults 0 2' >> /etc/fstab`,
      },
      {
        id: 'p1-dirs',
        who: 'kyle',
        text: 'Create directory structure',
        code: `mkdir -p /data/{clients,super,shared,backups,caddy-data,scripts}\nmkdir -p /data/super/{workspace,config,tools}`,
      },
      {
        id: 'p1-ssh-jasper',
        who: 'kyle',
        text: 'Give Jasper SSH access',
        detail: 'Ask Jasper for a public key to add to /home/hotclaw/.ssh/authorized_keys. Jasper will then be able to deploy and configure everything remotely.',
      },
    ],
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'Caddy + DNS',
    subtitle: 'Reverse proxy with auto-HTTPS. Jasper configures this once SSH is available.',
    icon: <Globe size={20} />,
    color: 'green',
    steps: [
      {
        id: 'p2-cloudflare-dns',
        who: 'jasper',
        text: 'Jasper: Wire Cloudflare DNS',
        detail: 'Adds A records: super.hotclaw.ai → server IP, *.hotclaw.ai → server IP (wildcard for client subdomains). Proxied off so Caddy can get TLS certs.',
      },
      {
        id: 'p2-caddy-install',
        who: 'jasper',
        text: 'Jasper: Install Caddy (Cloudflare build)',
        detail: 'The Cloudflare-DNS-enabled build of Caddy is required for wildcard TLS certs. Jasper installs and configures it.',
      },
      {
        id: 'p2-caddyfile',
        who: 'jasper',
        text: 'Jasper: Write Caddyfile',
        detail: 'Routes: super.hotclaw.ai → port 18900 (Super Hotclaw), hotclaw.ai → port 18901 (marketing/intake), *.hotclaw.ai → dynamic client routes.',
      },
      {
        id: 'p2-tls-verify',
        who: 'jasper',
        text: 'Jasper: Verify wildcard TLS is working',
        detail: 'Checks that https://super.hotclaw.ai loads with a valid cert. If not, debugs Cloudflare token permissions.',
      },
    ],
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Super Hotclaw Deploy',
    subtitle: 'Install OpenClaw, load keys, write SOUL.md, bring the agent online.',
    icon: <Bot size={20} />,
    color: 'purple',
    steps: [
      {
        id: 'p3-node',
        who: 'jasper',
        text: 'Jasper: Install Node.js 22',
        detail: 'Required runtime for OpenClaw.',
      },
      {
        id: 'p3-openclaw',
        who: 'jasper',
        text: 'Jasper: Install OpenClaw globally',
        code: 'npm install -g openclaw',
      },
      {
        id: 'p3-env',
        who: 'jasper',
        text: 'Jasper: Load all API keys into /data/super/.env',
        detail: 'OpenRouter, Twilio, Pinecone, Supabase, ElevenLabs, Runway, Stripe, Cloudflare, Discord — all keys go here.',
      },
      {
        id: 'p3-config',
        who: 'jasper',
        text: 'Jasper: Write openclaw.json config',
        detail: 'Configures agent ID (super-hotclaw), port 18900, Discord channel bindings, Twilio channel binding.',
      },
      {
        id: 'p3-soul',
        who: 'jasper',
        text: 'Jasper: Write SOUL.md for Super Hotclaw',
        detail: 'Personality, capabilities, standing directives. Super Hotclaw is the ops engine — runs provision scripts, monitors containers, manages client SMS, Stripe status.',
      },
      {
        id: 'p3-systemd',
        who: 'jasper',
        text: 'Jasper: Create systemd service (auto-restart)',
        detail: 'openclaw gateway start runs as a service. Auto-restarts on crash. Starts on server reboot.',
      },
      {
        id: 'p3-verify',
        who: 'both',
        text: 'Verify Super Hotclaw is online',
        detail: 'Kyle or Chad DMs the Discord bot — if it responds, it\'s live. Jasper will post the confirmation in #lo-buddy-hopper.',
      },
    ],
  },
  {
    id: 'phase-4',
    number: 4,
    title: 'Custom Skills',
    subtitle: 'Five purpose-built skills that make Super Hotclaw actually powerful. All written by Jasper — no open marketplace.',
    icon: <Package size={20} />,
    color: 'orange',
    steps: [
      {
        id: 'p4-provisioner',
        who: 'jasper',
        text: 'Jasper: Build client-provisioner skill',
        detail: 'Chat command triggers provision-client.sh. Takes client name, tier, API keys. Returns subdomain + admin URL. Updates client roster in Notion.',
      },
      {
        id: 'p4-monitor',
        who: 'jasper',
        text: 'Jasper: Build container-monitor skill',
        detail: 'Runs docker ps on the VPS every 6 hours. Alerts Discord if any client container is down. Reports memory/CPU usage.',
      },
      {
        id: 'p4-twilio',
        who: 'jasper',
        text: 'Jasper: Build twilio-outreach skill',
        detail: 'Send SMS to one number or a list. Track delivery. Good for: client onboarding welcome, marketing campaigns, status alerts.',
      },
      {
        id: 'p4-stripe',
        who: 'jasper',
        text: 'Jasper: Build stripe-dashboard skill',
        detail: 'List subscriptions, MRR, outstanding invoices. Create new client subscriptions. Handle payment failures.',
      },
      {
        id: 'p4-dns',
        who: 'jasper',
        text: 'Jasper: Build cloudflare-dns skill',
        detail: 'Auto-adds {client}.hotclaw.ai DNS record on provisioning. Removes it on deprovisioning. Part of the 20-min onboarding pipeline.',
      },
      {
        id: 'p4-skills-test',
        who: 'both',
        text: 'Test all 5 skills via Discord chat',
        detail: 'Each skill gets a smoke test command. Jasper will document the commands in #super-hotclaw Discord channel.',
      },
    ],
  },
  {
    id: 'phase-5',
    number: 5,
    title: 'First Client Dry Run',
    subtitle: 'Provision a fake "acme-corp" client end-to-end. Validate the 20-minute onboarding target.',
    icon: <Zap size={20} />,
    color: 'yellow',
    steps: [
      {
        id: 'p5-stripe-sub',
        who: 'jasper',
        text: 'Jasper: Set up Stripe subscription products',
        detail: 'Create Lite ($149/mo), Pro ($349/mo), Pro Plus ($599/mo) products in Stripe. Add setup fees as one-time charges.',
      },
      {
        id: 'p5-test-provision',
        who: 'jasper',
        text: 'Jasper: Provision test client "acme-corp"',
        detail: 'Runs provision-client.sh with test OpenRouter key. Creates Docker container, Caddy route, Cloudflare DNS for acme.hotclaw.ai. Target: complete in under 5 min.',
      },
      {
        id: 'p5-test-agent',
        who: 'both',
        text: 'Chat with the acme.hotclaw.ai agent',
        detail: 'Open acme.hotclaw.ai — the agent should respond. Test basic commands. Verify the SOUL template is loaded.',
      },
      {
        id: 'p5-welcome-sms',
        who: 'jasper',
        text: 'Jasper: Send test welcome SMS via Twilio',
        detail: 'Trigger welcome SMS to Kyle\'s number from the Twilio outreach skill. Confirms end-to-end SMS is wired.',
      },
      {
        id: 'p5-timing',
        who: 'both',
        text: 'Time the full onboarding workflow',
        detail: 'From "provision command issued" to "agent responding at acme.hotclaw.ai". Target is 20 minutes. Document actual time.',
      },
      {
        id: 'p5-deprovision',
        who: 'jasper',
        text: 'Jasper: Deprovision acme-corp cleanly',
        detail: 'Tests the teardown path — container stops, DNS removed, Caddy route gone. Client data archived to /data/backups.',
      },
    ],
  },
  {
    id: 'phase-6',
    number: 6,
    title: 'Monitoring & Backups',
    subtitle: 'Set it and forget it. Jasper configures everything — alerts come to Discord automatically.',
    icon: <Wifi size={20} />,
    color: 'green',
    steps: [
      {
        id: 'p6-health-cron',
        who: 'jasper',
        text: 'Jasper: Set up container health check cron',
        detail: 'Every 5 min: docker ps → write running containers to /data/shared/containers-up.txt. Every 6 hours: Super Hotclaw compares against known clients and alerts Discord on any gap.',
      },
      {
        id: 'p6-backup-cron',
        who: 'jasper',
        text: 'Jasper: Set up daily backup cron',
        detail: 'Daily: tar all /data/clients/ to /data/backups/YYYY-MM-DD.tar.gz. Keeps 30 days. Simple, reliable, no external services needed to start.',
      },
      {
        id: 'p6-uptime',
        who: 'jasper',
        text: 'Jasper: Set up Uptime Kuma (optional)',
        detail: 'Lightweight self-hosted monitoring with a status page. Checks each client subdomain every minute. Free, runs in Docker.',
      },
      {
        id: 'p6-client-roster',
        who: 'jasper',
        text: 'Jasper: Create client status tracker in Notion',
        detail: 'A simple database: client name, tier, subdomain, container ID, billing status, go-live date. Super Hotclaw updates it on provision/deprovision.',
      },
    ],
  },
  {
    id: 'phase-7',
    number: 7,
    title: 'Sales & Intake Pipeline',
    subtitle: 'Chad\'s side of the house. Everything needed to close first 3 clients.',
    icon: <CreditCard size={20} />,
    color: 'blue',
    steps: [
      {
        id: 'p7-admin-password',
        who: 'kyle',
        text: 'Reset hotclaw.ai/admin password for Chad',
        detail: 'Kyle goes to Vercel → hot-dog-intake → Environment Variables → update ADMIN_PASSWORD to something Chad knows. Redeploy.',
        warning: 'Current password is in workspace .env but may not be synced. Just set a fresh one.',
      },
      {
        id: 'p7-chad-login',
        who: 'chad',
        text: 'Chad logs into hotclaw.ai/admin',
        detail: 'Verify Chad can see HotScout conversation briefs. This is where leads come in from the intake chat.',
        link: { label: 'hotclaw.ai/admin', url: 'https://hotclaw.ai/admin' },
      },
      {
        id: 'p7-stripe-test',
        who: 'chad',
        text: 'Chad does a test Stripe invoice',
        detail: 'Send a $0 test invoice to cedadjurdjevic98@gmail.com. Confirm the payment flow works before sending to a real client.',
      },
      {
        id: 'p7-verticals',
        who: 'chad',
        text: 'Chad shares target verticals list',
        detail: 'Top 3 industries to pursue first. Follow-Up Machine (mortgage/insurance/RE) is the easiest to sell — confirm or override. This determines which SOUL templates to polish first.',
      },
      {
        id: 'p7-outreach',
        who: 'chad',
        text: 'Chad identifies first 10 warm leads',
        detail: 'People in his network who fit the target verticals. Name, company, role, what problem they have. Jasper can help write the outreach messages.',
      },
      {
        id: 'p7-first-client',
        who: 'both',
        text: 'GOAL: First paying client signed',
        detail: 'Stripe paid → Jasper provisions → Super Hotclaw sends welcome SMS → client is live at their subdomain. This is the milestone.',
      },
    ],
  },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const whoColors: Record<string, string> = {
  kyle: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  chad: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  jasper: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  both: 'bg-green-500/20 text-green-400 border border-green-500/30',
}

const whoLabel: Record<string, string> = {
  kyle: 'Kyle',
  chad: 'Chad',
  jasper: 'Jasper',
  both: 'Kyle + Chad',
}

const phaseColors: Record<string, { bg: string; border: string; text: string; num: string }> = {
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', num: 'bg-orange-500' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', num: 'bg-blue-500' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', num: 'bg-green-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', num: 'bg-purple-500' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', num: 'bg-yellow-500' },
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function SetupPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hotclaw-setup-checks')
    if (saved) {
      try { setChecked(JSON.parse(saved)) } catch {}
    }
  }, [])

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    localStorage.setItem('hotclaw-setup-checks', JSON.stringify(next))
  }

  const togglePhase = (id: string) => {
    setCollapsed(c => ({ ...c, [id]: !c[id] }))
  }

  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0)
  const completedSteps = Object.values(checked).filter(Boolean).length
  const pct = Math.round((completedSteps / totalSteps) * 100)

  const resetAll = () => {
    setChecked({})
    localStorage.removeItem('hotclaw-setup-checks')
  }

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
              <h1 className="text-3xl font-bold tracking-tight">
                🔥 Super Hotclaw Setup
              </h1>
              <p className="text-white/50 mt-1">Step-by-step guide to get off the ground. Check items off as you go.</p>
            </div>
            <button
              onClick={resetAll}
              className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors mt-1"
            >
              <RefreshCw size={12} /> Reset all
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/50">{completedSteps} of {totalSteps} steps complete</span>
              <span className={`font-bold ${pct === 100 ? 'text-green-400' : pct > 50 ? 'text-orange-400' : 'text-white/50'}`}>{pct}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            {Object.entries(whoLabel).map(([key, label]) => (
              <span key={key} className={`text-xs px-2 py-0.5 rounded-full font-medium ${whoColors[key]}`}>
                {label}
              </span>
            ))}
            <span className="text-xs text-white/30 ml-2">— who does it</span>
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="max-w-4xl mx-auto px-6 mt-8 space-y-6">
        {phases.map((phase) => {
          const c = phaseColors[phase.color] ?? phaseColors.orange
          const phaseTotal = phase.steps.length
          const phaseDone = phase.steps.filter(s => checked[s.id]).length
          const phaseCollapsed = collapsed[phase.id]

          return (
            <div key={phase.id} className={`rounded-2xl border ${c.border} overflow-hidden`}>
              {/* Phase header */}
              <button
                onClick={() => togglePhase(phase.id)}
                className={`w-full flex items-center gap-4 p-5 ${c.bg} hover:brightness-110 transition-all text-left`}
              >
                <div className={`w-8 h-8 rounded-full ${c.num} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {phaseDone === phaseTotal ? <CheckCircle2 size={16} /> : phase.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`${c.text}`}>{phase.icon}</span>
                    <h2 className="font-bold text-lg">Phase {phase.number}: {phase.title}</h2>
                  </div>
                  <p className="text-sm text-white/50 mt-0.5 truncate">{phase.subtitle}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-sm font-medium ${phaseDone === phaseTotal ? 'text-green-400' : c.text}`}>
                    {phaseDone}/{phaseTotal}
                  </span>
                  <div className={`text-white/40 transition-transform duration-200 ${phaseCollapsed ? '' : 'rotate-180'}`}>
                    <ChevronDown size={18} />
                  </div>
                </div>
              </button>

              {/* Steps */}
              {!phaseCollapsed && (
                <div className="divide-y divide-white/5">
                  {phase.steps.map((step, i) => {
                    const done = checked[step.id] ?? false
                    return (
                      <div key={step.id} className={`px-5 py-4 transition-colors ${done ? 'bg-white/[0.02]' : 'hover:bg-white/[0.02]'}`}>
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <button
                            onClick={() => toggle(step.id)}
                            className={`mt-0.5 flex-shrink-0 transition-colors ${done ? 'text-green-400' : 'text-white/20 hover:text-white/50'}`}
                          >
                            {done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm font-semibold ${done ? 'text-white/30 line-through' : 'text-white'}`}>
                                {step.text}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${whoColors[step.who]}`}>
                                {whoLabel[step.who]}
                              </span>
                            </div>

                            {step.detail && (
                              <p className={`text-sm mt-1 ${done ? 'text-white/20' : 'text-white/50'}`}>
                                {step.detail}
                              </p>
                            )}

                            {step.warning && (
                              <div className="mt-2 flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                                <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-300">{step.warning}</p>
                              </div>
                            )}

                            {step.code && (
                              <pre className="mt-2 bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-xs font-mono text-green-300 overflow-x-auto whitespace-pre-wrap">
                                {step.code}
                              </pre>
                            )}

                            {step.link && (
                              <a
                                href={step.link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <ExternalLink size={11} />
                                {step.link.label}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* Footer milestone */}
        <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-6 text-center">
          <div className="text-4xl mb-3">🔥</div>
          <h3 className="text-xl font-bold">First Client Live</h3>
          <p className="text-white/50 text-sm mt-1">Stripe paid → Jasper provisions → welcome SMS sent → agent responding at their subdomain.</p>
          <p className="text-orange-400 font-semibold text-sm mt-3">This is the milestone. Everything above leads here.</p>
        </div>
      </div>
    </div>
  )
}
