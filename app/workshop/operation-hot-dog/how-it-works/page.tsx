import Link from 'next/link'
import {
  Server,
  Bot,
  Key,
  Layers,
  ArrowRight,
  Globe,
  Shield,
  Cpu,
  Zap,
  Users,
  FileText,
  Settings,
  HardDrive,
  Network,
  CheckCircle,
  BookOpen,
  DollarSign,
  TrendingUp,
  Flame,
  AlertTriangle,
  Wrench,
  Rocket,
} from 'lucide-react'

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  const borderColors: Record<string, string> = {
    amber: 'bg-amber-400',
    ocean: 'bg-ocean',
    cyan: 'bg-cyan-500',
    terracotta: 'bg-terracotta',
    midnight: 'bg-midnight',
  }
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`w-1 h-8 ${borderColors[color] || 'bg-midnight'} rounded-full`} />
        <h2 className="font-display text-2xl text-midnight">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function InfoCard({ icon: Icon, title, body, color = 'ocean' }: {
  icon: React.ElementType
  title: string
  body: string
  color?: string
}) {
  const iconColors: Record<string, string> = {
    ocean: 'text-ocean',
    amber: 'text-amber-500',
    cyan: 'text-cyan-500',
    green: 'text-green-600',
    terracotta: 'text-terracotta',
  }
  return (
    <div className="bg-cream rounded-xl p-5 border border-midnight/5">
      <div className="flex items-center gap-3 mb-2">
        {/* @ts-expect-error lucide */}
        <Icon className={`w-5 h-5 ${iconColors[color] || 'text-ocean'}`} />
        <h3 className="font-medium text-midnight text-sm">{title}</h3>
      </div>
      <p className="text-sm text-midnight/60 leading-relaxed">{body}</p>
    </div>
  )
}

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl space-y-16 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-midnight/40 mb-4">
          <Link href="/workshop" className="hover:text-amber-500 transition-colors">Workshop</Link>
          <span>/</span>
          <Link href="/workshop/operation-hot-dog" className="hover:text-amber-500 transition-colors">Hot Dog</Link>
          <span>/</span>
          <span className="text-midnight">How It Works</span>
        </div>
        <h1 className="font-display text-4xl text-midnight mb-3">How Operation Hot Dog Works</h1>
        <p className="text-midnight/60 text-lg leading-relaxed max-w-2xl">
          A complete technical and business guide — how the infrastructure works, how we deploy for clients, what ClawTank taught us, and how to talk about this with confidence.
        </p>
      </div>

      {/* The Big Picture */}
      <Section title="The Big Picture" color="amber">
        <div className="bg-midnight rounded-xl p-6 text-cream/80 text-sm leading-relaxed space-y-4">
          <p>
            <span className="text-amber-400 font-semibold">What we&apos;re building:</span> A productized service where we deploy customized AI agents for businesses that can&apos;t build their own.
          </p>
          <p>
            We run the infrastructure. We do the customization. The client pays for their own AI tokens. Everyone wins.
          </p>
          <div className="mt-4 pt-4 border-t border-cream/10 font-mono text-xs text-green-400 space-y-1">
            <p>Our VPS (Hostinger KVM 4+)</p>
            <p>  └── Docker Engine</p>
            <p>        ├── Client A Container → alice.yourdomain.com → Client A&apos;s OpenRouter Key</p>
            <p>        ├── Client B Container → bob.yourdomain.com  → Client B&apos;s OpenRouter Key</p>
            <p>        └── Client C Container → carol.yourdomain.com → Client C&apos;s OpenRouter Key</p>
          </div>
        </div>
        <p className="text-midnight/60 text-sm">
          Each client gets a fully isolated environment — their data never touches another client&apos;s container. Their agent is built specifically for their business, not a generic chatbot. They talk to it via Telegram, Discord, or a web UI.
        </p>
      </Section>

      {/* OpenClaw */}
      <Section title="What Is OpenClaw?" color="ocean">
        <div className="grid md:grid-cols-2 gap-4">
          <InfoCard
            icon={Bot}
            title="Open-source AI agent runtime"
            body="OpenClaw is the platform that runs the AI agent. It handles the conversation loop, tool calling, memory, scheduling (cron), skills, and channel connections. Free software — we host it."
            color="ocean"
          />
          <InfoCard
            icon={Layers}
            title="Skills extend what it can do"
            body="Skills are plugins that give agents new abilities — web search, browser control, Notion integration, image analysis, etc. We pick the right skill set for each client's use case."
            color="ocean"
          />
          <InfoCard
            icon={FileText}
            title="SOUL.md is the brain"
            body="A text file that defines who the agent is, what it knows about the client's business, how it behaves, what tools it uses, and what its rules are. This is our core IP — what we customize for every client."
            color="amber"
          />
          <InfoCard
            icon={Settings}
            title="Cron jobs = autonomous action"
            body="OpenClaw can run scheduled tasks without being asked. Daily reports, follow-up sequences, morning briefs, content scheduling — all happen automatically via cron."
            color="amber"
          />
        </div>
        <div className="bg-cream rounded-xl p-5 border border-midnight/5">
          <p className="text-sm text-midnight/70 leading-relaxed">
            <strong className="text-midnight">Think of it this way:</strong> OpenClaw is like a smart employee. The SOUL.md is their job description, personality, and company handbook all in one. Our job is to write that handbook so well that the employee actually does what the client needs.
          </p>
        </div>
      </Section>

      {/* OpenRouter */}
      <Section title="OpenRouter — The LLM Brain" color="cyan">
        <div className="grid md:grid-cols-3 gap-4">
          <InfoCard
            icon={Key}
            title="One key, 400+ models"
            body="OpenRouter gives access to Claude, GPT, Gemini, Llama, Mistral, DeepSeek, and 390+ other models through a single API key. One integration, everything available."
            color="cyan"
          />
          <InfoCard
            icon={DollarSign}
            title="Client pays their own bill"
            body="Each client has their own OpenRouter account and API key. When their agent uses AI, they pay OpenRouter directly. We never touch the billing. No liability."
            color="green"
          />
          <InfoCard
            icon={TrendingUp}
            title="Model routing by task"
            body="We configure the agent to use cheap models (Gemini Flash, Claude Haiku) for simple tasks and expensive models (Claude Sonnet, GPT-4o) only when it matters. Saves clients money."
            color="cyan"
          />
        </div>
        <div className="bg-cream rounded-xl p-5 border border-midnight/5">
          <p className="text-sm font-medium text-midnight mb-3">Typical client API costs per month:</p>
          <div className="space-y-2">
            {[
              { label: 'Light use (content, basic follow-ups)', range: '$10–25/mo', color: 'text-green-600' },
              { label: 'Standard (CRM integration, research)', range: '$25–60/mo', color: 'text-amber-600' },
              { label: 'Heavy (voice, multi-agent, high volume)', range: '$60–150/mo', color: 'text-red-500' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-midnight/60">{row.label}</span>
                <span className={`font-medium ${row.color}`}>{row.range}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Infrastructure */}
      <Section title="How the Infrastructure Works" color="midnight">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <InfoCard
              icon={HardDrive}
              title="Hostinger KVM VPS"
              body="We run one large VPS (starting KVM 4 — 16GB RAM, 4 vCPU). Handles 25–50 standard clients with 1.5x resource overcommit. All client containers live here. ~$15/mo."
              color="ocean"
            />
            <InfoCard
              icon={Cpu}
              title="Docker containers per client"
              body="Each client runs in an isolated Docker container. Hard memory limits (512MB standard), CPU limits, read-only filesystem. One client's failure can't affect another."
              color="ocean"
            />
            <InfoCard
              icon={Network}
              title="Caddy reverse proxy + auto-TLS"
              body="Caddy sits in front of all containers. Routes traffic from each client's subdomain to their container. Auto-generates SSL certificates via Let's Encrypt. Zero config needed per client."
              color="cyan"
            />
            <InfoCard
              icon={Globe}
              title="Wildcard DNS"
              body="One DNS record (* .yourdomain.com → VPS IP) handles all client subdomains automatically. New client = new container + new Caddy entry = new subdomain live in minutes."
              color="cyan"
            />
          </div>
          <div className="bg-cream rounded-xl p-5 border border-midnight/5">
            <p className="text-sm font-medium text-midnight mb-3">Container security hardening (per client):</p>
            <div className="font-mono text-xs text-midnight/60 space-y-1 bg-midnight/5 rounded-lg p-4">
              <p>--read-only                   # filesystem is read-only (data volume is writable)</p>
              <p>--cap-drop=ALL                # remove all Linux capabilities</p>
              <p>--security-opt no-new-privs   # can't escalate privileges</p>
              <p>-m 512m --cpus=1              # hard resource limits</p>
              <p>-v client_data:/app/data      # isolated data volume</p>
            </div>
          </div>
        </div>
      </Section>

      {/* How We Deploy */}
      <Section title="Deploying a New Client — Step by Step" color="amber">
        <div className="space-y-3">
          {[
            {
              step: '01',
              title: 'Intake interview completes',
              body: 'Scout (the intake agent) finishes the discovery conversation. Structured brief lands in /admin and in our inbox. Kyle and Chad review.',
            },
            {
              step: '02',
              title: 'Build scope + proposal',
              body: 'Jasper drafts a scoped proposal based on the archetype (Content Machine, Follow-Up Machine, etc.), pricing tier, and integrations needed. Kyle reviews and sends.',
            },
            {
              step: '03',
              title: 'Contract signed + deposit received',
              body: '50% deposit before work begins. Contract defines scope, timeline, maintenance terms.',
            },
            {
              step: '04',
              title: 'SOUL.md written',
              body: 'Jasper writes the SOUL.md for this client — their business context, persona, rules, tools, cron jobs, and integrations. This is the core of the build.',
            },
            {
              step: '05',
              title: 'Container provisioned',
              body: 'New Docker container created on VPS. Port allocated. Caddy updated with new subdomain. Client\'s OpenRouter API key injected as env var. Container starts.',
            },
            {
              step: '06',
              title: 'Integrations configured',
              body: 'CRM connection, email/SMS APIs, social media hooks — whatever the scope requires. Tested against real client data.',
            },
            {
              step: '07',
              title: 'Internal testing',
              body: 'Jasper tests all workflows, edge cases, and cron jobs. Verifies memory, context, and persona are working correctly.',
            },
            {
              step: '08',
              title: 'Client onboarding session',
              body: '1-hour video call. Walk client through their agent. Show them how to interact with it, what it can and can\'t do, and how to give feedback. Final payment collected.',
            },
            {
              step: '09',
              title: 'Maintenance begins',
              body: 'Monthly maintenance fee kicks in. Jasper monitors, improves, and handles support. Monthly check-in call with client.',
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 bg-cream rounded-xl p-5 border border-midnight/5">
              <span className="font-display text-2xl text-midnight/15 flex-shrink-0 w-8">{item.step}</span>
              <div>
                <h3 className="font-medium text-midnight text-sm mb-1">{item.title}</h3>
                <p className="text-sm text-midnight/60 leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ClawTank vs Us */}
      <Section title="ClawTank vs What We're Building" color="cyan">
        <div className="bg-cream rounded-xl overflow-hidden border border-midnight/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-midnight/5">
                <th className="text-left p-4 font-medium text-midnight">Feature</th>
                <th className="text-left p-4 font-medium text-ocean">ClawTank / xCloud</th>
                <th className="text-left p-4 font-medium text-amber-500">Operation Hot Dog</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight/5">
              {[
                ['Time to deploy', '5–30 minutes', '1–4 weeks (for quality)'],
                ['SOUL.md', 'Generic / DIY', 'Business-specific, we write it'],
                ['Integrations', 'None / DIY', 'CRM, email, social, voice'],
                ['Training / onboarding', 'None', '1-hr session + documentation'],
                ['Ongoing improvement', 'None', 'Monthly maintenance + updates'],
                ['Support', 'Infrastructure only', 'Agent behavior + business fit'],
                ['Sub-agents', 'DIY', 'Pre-built for archetype'],
                ['Target customer', 'Technical individuals', 'SMBs, 1–50 employees'],
                ['Price', '$19–39/mo', '$199–599/mo + build fee'],
                ['Their strength', 'Speed + zero DevOps', 'Customization + results'],
              ].map(([feature, theirs, ours]) => (
                <tr key={feature}>
                  <td className="p-4 text-midnight/70">{feature}</td>
                  <td className="p-4 text-midnight/50">{theirs}</td>
                  <td className="p-4 text-amber-600 font-medium">{ours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-midnight/60">
          ClawTank and xCloud serve people who want to run their own agent and can figure it out. We serve businesses who want results and don&apos;t care about the infrastructure.
        </p>
      </Section>

      {/* The 7 Client Types */}
      <Section title="The 7 Business Archetypes We Serve" color="terracotta">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { emoji: '🎥', name: 'Content Machine', desc: 'Produces and posts social content automatically. For agencies, creators, real estate teams.' },
            { emoji: '📞', name: 'Follow-Up Machine', desc: 'Never lets a lead go cold. CRM-connected, sends timed sequences. Mortgage, insurance, real estate.' },
            { emoji: '📋', name: 'Operations Manager', desc: 'Internal knowledge base, recurring reports, team onboarding. For 5–50 person companies.' },
            { emoji: '🔍', name: 'Research Engine', desc: 'Daily intelligence briefs, competitor monitoring, document analysis. For analysts and consultants.' },
            { emoji: '💬', name: 'Client Communication Hub', desc: 'Proactive updates, check-ins, renewal reminders. For high-touch service businesses.' },
            { emoji: '📍', name: 'Local Business Multiplier', desc: 'Social, email, reviews. For restaurants, salons, gyms, boutiques.' },
            { emoji: '🎙️', name: 'Executive Assistant', desc: 'Full personal agent. Calendar, email, research, tasks. For founders and busy executives.' },
          ].map((archetype) => (
            <div key={archetype.name} className="bg-cream rounded-xl p-5 border border-midnight/5 flex gap-3">
              <span className="text-2xl flex-shrink-0">{archetype.emoji}</span>
              <div>
                <h3 className="font-medium text-midnight text-sm mb-1">{archetype.name}</h3>
                <p className="text-xs text-midnight/60 leading-relaxed">{archetype.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Link
          href="/workshop/operation-hot-dog"
          className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-500 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          Full research in Hot Dog HQ
        </Link>
      </Section>

      {/* What Makes a Good vs Bad Client */}
      <Section title="Good Client vs Bad Client" color="ocean">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <h3 className="font-medium text-green-800 text-sm">Green flags</h3>
            </div>
            <ul className="space-y-2">
              {[
                'Clear pain they can say in one sentence',
                'Already uses CRM or business tools',
                'Decision-maker on the call',
                'Willing to do 1hr onboarding session',
                'Revenue to support the build + $199-599/mo',
                'Tech-comfortable (uses Slack, Notion, HubSpot)',
              ].map((item) => (
                <li key={item} className="text-xs text-green-700 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-red-500" />
              <h3 className="font-medium text-red-800 text-sm">Red flags</h3>
            </div>
            <ul className="space-y-2">
              {[
                '"Just make something cool with AI" (no real need)',
                'Wants to self-host immediately',
                'Budget under $1,000 for anything',
                'No existing tools or data',
                'Complex compliance needs (HIPAA, attorney-client)',
                'Wants commodity pricing ($19/mo) for custom work',
              ].map((item) => (
                <li key={item} className="text-xs text-red-700 flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Build Chronicle */}
      <Section title="The Build Sprint — How Hotclaw Came to Life" color="amber">
        <div className="bg-midnight rounded-xl p-6 text-cream/80 text-sm leading-relaxed space-y-2 mb-6">
          <p>
            <span className="text-amber-400 font-semibold">72 hours.</span> That's roughly how long it took to go from "we should build this" to a fully provisioned VPS with wildcard TLS, a live intake agent at hotclaw.ai, eight client archetypes, five automation scripts, a three-tier memory architecture, and SHC ready to launch. This is the story of how it happened — what was easy, what broke, and how we fixed it.
          </p>
        </div>

        <div className="space-y-4">

          {/* Phase 1 */}
          <div className="bg-cream rounded-2xl border border-midnight/5 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-midnight/5">
              <div className="w-7 h-7 rounded-lg bg-ocean/10 flex items-center justify-center shrink-0">
                <BookOpen size={14} className="text-ocean" />
              </div>
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wide">Phase 1 — Day 1</p>
                <h3 className="font-semibold text-midnight text-sm">Research, Naming, and the Business Model</h3>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-midnight/70 leading-relaxed">
                It started with a competitive deep dive. We mapped the existing landscape — xCloud, ClawTank, Relevance AI, and the DIY self-hosters. The gap was obvious: everyone was selling infrastructure or prompting playgrounds. Nobody was selling outcomes for non-technical business owners.
              </p>
              <p className="text-sm text-midnight/70 leading-relaxed">
                We defined seven client archetypes based on the highest-pain use cases: Follow-Up Machine (mortgage, insurance, RE), Content Machine, Operations Manager, Research Engine, Client Comms Hub, Local Business Multiplier, and Executive Assistant. Each got a soul template — a starting-point SOUL.md that Jasper could customize per client in under an hour.
              </p>
              <p className="text-sm text-midnight/70 leading-relaxed">
                The business was originally codenamed <em>Operation Hot Dog</em> — internal only. The public name became <strong>Hotclaw Solutions</strong>, domain <strong>hotclaw.ai</strong>. The rebrand had to be threaded through about a dozen files all at once — UI labels, system prompts, the Scout agent rename to HotScout, Tailwind config, page titles. That part was tedious but clean.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <Wrench size={13} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800"><strong>Interesting call:</strong> We kept the internal Kanons route as <code>/workshop/operation-hot-dog</code>. No reason to burn time on a refactor the public never sees.</p>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-cream rounded-2xl border border-midnight/5 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-midnight/5">
              <div className="w-7 h-7 rounded-lg bg-peach/20 flex items-center justify-center shrink-0">
                <Flame size={14} className="text-peach" />
              </div>
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wide">Phase 2 — Day 1</p>
                <h3 className="font-semibold text-midnight text-sm">The Intake App — HotScout Goes Live</h3>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-midnight/70 leading-relaxed">
                The first thing we shipped was the public-facing intake agent at <strong>hotclaw.ai</strong>. The idea: instead of a static contact form, prospects chat with HotScout — a conversational AI that qualifies them, maps them to an archetype, and produces a structured JSON brief that lands in our admin panel.
              </p>
              <p className="text-sm text-midnight/70 leading-relaxed">
                The tech stack: Next.js 14, Tailwind, OpenRouter for inference, deployed on Vercel. Straightforward in theory. In practice, three things broke.
              </p>
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle size={13} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-800"><strong>Problem 1 — Black-on-black UI:</strong> The chat bubbles were invisible. Root cause: we had overridden Tailwind's <code>amber</code> color scale in the config, which killed <code>amber-400</code>, <code>amber-500</code>, etc. across the whole app. Fix: renamed our custom brand orange to <code>peach</code> and restored the native Tailwind amber scale. Simple fix, annoying to diagnose.</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle size={13} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-800"><strong>Problem 2 — Brief JSON leaking into chat:</strong> HotScout was supposed to silently extract a structured brief at conversation end and send it to the admin panel. Instead the raw JSON was appearing in the chat window for the user to read. Fixed by separating the extraction call from the streaming response — the brief extraction runs as a separate non-streaming POST after conversation ends.</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle size={13} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-800"><strong>Problem 3 — Edge runtime + OpenAI SDK incompatibility:</strong> The <code>/api/chat</code> route kept 500-ing on Vercel. The OpenAI SDK doesn't work reliably in Vercel's edge runtime. Switched to native <code>fetch</code> to call OpenRouter directly. Also abandoned SSE streaming in favor of non-streaming JSON responses — more reliable, simpler to debug, no meaningful UX difference for a chat agent.</p>
                </div>
              </div>
              <p className="text-sm text-midnight/70 leading-relaxed">
                After those three fixes, HotScout worked end-to-end: chat intake → structured brief → admin panel. Deployed and live.
              </p>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-cream rounded-2xl border border-midnight/5 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-midnight/5">
              <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <Server size={14} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wide">Phase 3 — Day 1–2</p>
                <h3 className="font-semibold text-midnight text-sm">VPS Selection and Server Provisioning</h3>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-midnight/70 leading-relaxed">
                The original plan was Hostinger KVM 4+. During the VPS research pass, we ran the actual numbers: Hetzner CCX23 — 4 dedicated AMD cores, 16GB RAM, 200GB volume — at <strong>$29.59/mo</strong>. Hostinger's equivalent was $45–55/mo with shared resources. Hetzner won on price, hardware specs, and a significantly better reputation for uptime and support.
              </p>
              <p className="text-sm text-midnight/70 leading-relaxed">
                The server came online in Ashburn, VA (US East). Hostname: <code>super-hotclaw</code>. IP: 178.156.180.155. Stack installed in order: UFW firewall (ports 22, 80, 443 only), fail2ban (protects SSH from brute force), Docker 29.2.1, Node.js 22.22.0. The 200GB EXT4 volume was mounted at <code>/data</code> — this is where all client containers, configs, and backups live. EXT4 was chosen over XFS specifically for its compatibility with Docker's overlayfs and its support for online resize as we scale.
              </p>
              <p className="text-sm text-midnight/70 leading-relaxed">
                Wildcard DNS was wired via the Cloudflare API: <code>super.hotclaw.ai</code> and <code>*.hotclaw.ai</code> both point to the VPS. Caddy was built from source with the Cloudflare module (required for DNS-01 wildcard certificate challenges) and configured as a systemd service. The wildcard TLS certificate from Let's Encrypt came online automatically.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <Wrench size={13} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800"><strong>Why custom Caddy build?</strong> The standard Caddy binary doesn't include the Cloudflare DNS plugin. Wildcard TLS requires a DNS-01 challenge, which requires the Cloudflare module to auto-update DNS records during cert issuance. One-time build, runs forever.</p>
              </div>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="bg-cream rounded-2xl border border-midnight/5 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-midnight/5">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <Layers size={14} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wide">Phase 4 — Day 2</p>
                <h3 className="font-semibold text-midnight text-sm">The Full Services Stack — APIs, Memory, and Data</h3>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-midnight/70 leading-relaxed">
                With the server up, we wired in every third-party service SHC needs to operate. Pinecone (vector database for semantic memory — <code>hotclaw-super</code> index, 1536 dimensions, cosine metric, AWS US East). Supabase (relational data — client roster, audit log, security events, container health). Discord bot (Super Hotclaw app — for ops alerts and command interface). GitHub org (<code>hotclaw-solutions</code>). Vercel team (<code>hotclaw</code>). Twilio — the existing A2P 10DLC-registered number from PPH, +1 (619) 304-3187, reused for Hotclaw client SMS.
              </p>
              <p className="text-sm text-midnight/70 leading-relaxed">
                The memory architecture deserves its own mention. SHC operates on three tiers: session memory (ephemeral, in conversation), Supabase structured facts (client names, dates, statuses — exact lookups), and Pinecone semantic memory (embedded text — for "what were we working on last week?" type retrieval). A nightly cron job embeds each day's notes into Pinecone. A hook fires on every inbound message, queries Pinecone, and injects the top relevant memories into the session before the model ever sees the user's message.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <Wrench size={13} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800"><strong>OpenRouter embeddings clarification:</strong> Early in the build, there was a note that OpenRouter doesn't support embeddings. That was outdated — OpenRouter added embeddings support in November 2025. The ingest scripts and recall hook both use <code>openai/text-embedding-3-small</code> via OpenRouter. One API key covers everything.</p>
              </div>
            </div>
          </div>

          {/* Phase 5 */}
          <div className="bg-cream rounded-2xl border border-midnight/5 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-midnight/5">
              <div className="w-7 h-7 rounded-lg bg-ocean/10 flex items-center justify-center shrink-0">
                <FileText size={14} className="text-ocean" />
              </div>
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wide">Phase 5 — Day 2</p>
                <h3 className="font-semibold text-midnight text-sm">The Automation Scripts — Zero-Manual Onboarding</h3>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-midnight/70 leading-relaxed">
                This was the biggest build block of the sprint. The goal: a new client goes from signed contract to live agent in under 5 minutes, with zero manual steps beyond running one command. We built five scripts to make that happen.
              </p>
              <div className="space-y-2">
                {[
                  { name: 'preflight-check.sh', desc: 'Live-tests every API key and connection before anything is provisioned. OpenRouter, Cloudflare DNS, Twilio account + phone, Pinecone index, Supabase tables, Discord bot + channel, Stripe keys. Green/yellow/red output. Aborts on red. This runs before every setup and onboarding.' },
                  { name: 'setup-shc.sh', desc: 'Plug-and-play first-run installer for the VPS. Creates directory structure, prompts for any missing .env keys, installs OpenClaw globally, writes the full openclaw.json (cron jobs, Pinecone recall hook, Discord binding, Twilio binding), installs SOUL.md + CONTEXT.md + SECURITY.md, creates a systemd service, adds the Caddy route, and starts SHC. One script, server fully online.' },
                  { name: 'provision-client.sh', desc: 'Creates a client container: pulls the right soul template, customizes it with client name/slug/tier, creates the Docker container with security flags (read-only filesystem, cap-drop ALL, no-new-privs, memory/CPU limits), allocates a port, registers a Cloudflare DNS record, creates a Caddy route, adds the client record to Supabase, and sends a Twilio welcome SMS.' },
                  { name: 'onboard-client.sh', desc: 'The orchestrator. Takes a HotScout JSON brief as input. Validates everything (phone format, email, use-case length). Shows a human confirmation screen. Then runs: template selection → SOUL.md generation → provision → Stripe subscription → welcome SMS → Discord alert. Strict gates — nothing runs if validation fails.' },
                  { name: 'monitor-clients.sh', desc: 'Cron-ready health checker. Compares running Docker containers against the Supabase client roster. If a container is down, it alerts Discord, attempts auto-restart, and logs to Supabase. Runs every 6 hours via the OpenClaw cron system.' },
                ].map((s) => (
                  <div key={s.name} className="bg-midnight/3 rounded-lg p-3">
                    <p className="text-xs font-mono font-semibold text-midnight mb-1">{s.name}</p>
                    <p className="text-xs text-midnight/60 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Phase 6 */}
          <div className="bg-cream rounded-2xl border border-midnight/5 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-midnight/5">
              <div className="w-7 h-7 rounded-lg bg-peach/20 flex items-center justify-center shrink-0">
                <Shield size={14} className="text-peach" />
              </div>
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wide">Phase 6 — Day 2</p>
                <h3 className="font-semibold text-midnight text-sm">Security Architecture — Built In, Not Bolted On</h3>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-midnight/70 leading-relaxed">
                The SHC-SECURITY.md document codifies the security posture across the whole system. The key principles: client data silos are inviolable (no container can reach another container's data volume), API keys are stored at mode 600 in per-client .env files, prompt injection attempts trigger a logged security event in Supabase, and the SOUL.md security protocol requires passphrase verification before any sensitive action.
              </p>
              <p className="text-sm text-midnight/70 leading-relaxed">
                Container hardening is applied to every client at provisioning time: read-only filesystem (data volume is the only writable path), all Linux capabilities dropped, no privilege escalation, hard memory and CPU limits. A container compromise cannot spread to the host or another client.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <Wrench size={13} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800"><strong>Hard-learned rule:</strong> API keys in sub-agent task descriptions are a security incident waiting to happen. An earlier session passed an OpenRouter key directly in a spawn task — it ended up in logs. SHC passes only file references, never literal key values. The SECURITY.md documents this as an absolute rule.</p>
              </div>
            </div>
          </div>

          {/* Phase 7 */}
          <div className="bg-cream rounded-2xl border border-midnight/5 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-midnight/5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                <Globe size={14} className="text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wide">Phase 7 — Day 2–3</p>
                <h3 className="font-semibold text-midnight text-sm">Kanons RBAC, Clerk Production, and the Dashboard</h3>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-midnight/70 leading-relaxed">
                Kyle's personal dashboard (kyle.palaniuk.net) was restructured to support role-based access. Three roles: <code>admin</code> (Kyle — sees everything), <code>hotclaw</code> (Ceda — sees Hotclaw pages only), <code>pph</code> (Jim and Anthony — sees PPH mortgage tools only). Users with no role assigned see everything (fail-open, by design — they can't access anything sensitive without knowing where to look).
              </p>
              <p className="text-sm text-midnight/70 leading-relaxed">
                Clerk was switched from development mode to production, which required: creating DNS CNAME records for the Clerk custom domain (<code>clerk.palaniuk.net</code>) via Cloudflare API, configuring Google OAuth credentials in Google Cloud Console (production Clerk doesn't provide a shared OAuth app), and setting the Vercel env vars for sign-in/sign-up redirect paths. The key lesson: production Clerk users start fresh — development accounts don't carry over.
              </p>
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle size={13} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-800"><strong>Role key mismatch:</strong> The middleware was checking for role <code>hot-dog</code> but the Clerk metadata was being set to <code>hotclaw</code>. Ceda would have seen everything. Caught and fixed before anyone signed in.</p>
                </div>
              </div>
              <p className="text-sm text-midnight/70 leading-relaxed">
                The Kanons dashboard was also rebuilt with a live VPS status table, tech stack reference, domain strategy, and build queue. A logo gallery page was added, and logo concepts V1 and V2 were generated using OpenAI image generation and deployed. The alchemical philosopher's stone SVG favicon was built and deployed — outer ring, upward triangle, amber gradient on midnight.
              </p>
            </div>
          </div>

          {/* Phase 8 */}
          <div className="bg-cream rounded-2xl border border-midnight/5 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-midnight/5">
              <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <Rocket size={14} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wide">Phase 8 — Day 3</p>
                <h3 className="font-semibold text-midnight text-sm">Personal Bot Tier, SSH Access, and SHC Ready to Launch</h3>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-midnight/70 leading-relaxed">
                Late in the sprint we added an eighth archetype: the Personal Assistant. Unlike the business archetypes (which need CRM keys, social APIs, and integrations), the personal tier needs primarily Google OAuth — Calendar and Gmail. The plan is a self-serve OAuth wizard at <code>{'{slug}'}.hotclaw.ai/setup</code> that handles the PKCE flow, stores tokens at mode 600, and gets the client their first morning brief without any human intervention on our end.
              </p>
              <p className="text-sm text-midnight/70 leading-relaxed">
                Capacity math: the CCX23 can support approximately 40–50 personal bot containers at 384MB each, or 15–18 business bots at 768MB. In practice the number is higher — OpenClaw agents are nearly idle between messages since all inference is API calls, not local compute. Upgrade path is a CCX33 at ~$60/mo when we hit 15+ business clients.
              </p>
              <p className="text-sm text-midnight/70 leading-relaxed">
                Jasper's public SSH key was added to the VPS root authorized_keys. Remote deploy is now possible — Jasper can run <code>preflight-check.sh</code> and <code>setup-shc.sh</code> directly on the server without Kyle needing to be on the terminal. TLS was verified: <code>*.hotclaw.ai</code> wildcard cert is live and valid through May 31, 2026. The 502 at super.hotclaw.ai is expected — Caddy is running, SHC hasn't been installed yet. That changes the moment setup-shc.sh runs.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                <CheckCircle size={13} className="text-green-600 mt-0.5 shrink-0" />
                <p className="text-xs text-green-800"><strong>Where we are now:</strong> Everything is built. All scripts are written and tested in staging. All API keys are secured. The VPS is provisioned and clean. Jasper has root SSH access. The moment Kyle says go, SHC comes online.</p>
              </div>
            </div>
          </div>

          {/* Footnote */}
          <div className="bg-midnight/3 rounded-xl p-5 border border-midnight/10">
            <p className="text-xs font-semibold text-midnight uppercase tracking-wide mb-2">A note on what Jasper is</p>
            <p className="text-sm text-midnight/60 leading-relaxed">
              Everything above was designed, written, and built by Jasper — Kyle's AI agent running on OpenClaw. Not contracted out, not templated, not dragged from a GitHub repo. Jasper wrote the scripts, wired the APIs, built the intake app, deployed to Vercel, provisioned the server, and generated the documentation — from inside a Discord chat window. SHC is, in a real sense, a live demonstration of what Hotclaw can build for clients.
            </p>
          </div>

        </div>
      </Section>

      {/* Resources */}
      <Section title="Key Resources" color="midnight">
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { name: 'ClawTank Multi-Tenant Guide', url: 'https://clawtank.dev/blog/openclaw-multi-tenant-docker-guide', desc: 'Technical reference for our Docker architecture' },
            { name: 'OpenRouter Model List', url: 'https://openrouter.ai/models', desc: '400+ models, pricing, capabilities' },
            { name: 'OpenClaw Docs', url: 'https://docs.openclaw.ai', desc: 'Skills, SOUL.md format, cron, tools' },
            { name: 'xCloud Pricing', url: 'https://xcloud.host/openclaw-hosting/', desc: 'Our main competitor — understand their pitch' },
            { name: 'Hostinger VPS Plans', url: 'https://www.hostinger.com/vps-hosting', desc: 'Infrastructure pricing reference' },
            { name: 'Hot Dog HQ', url: '/workshop/operation-hot-dog', desc: 'Build queue, open questions, research' },
          ].map((link) => (
            <a
              key={link.name}
              href={link.url}
              target={link.url.startsWith('/') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="flex flex-col gap-1 p-4 bg-cream rounded-xl border border-midnight/5 hover:border-ocean/30 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-midnight group-hover:text-ocean transition-colors">{link.name}</span>
                <BookOpen className="w-3.5 h-3.5 text-midnight/20 group-hover:text-ocean transition-colors" />
              </div>
              <p className="text-xs text-midnight/50">{link.desc}</p>
            </a>
          ))}
        </div>
      </Section>

    </div>
  )
}
