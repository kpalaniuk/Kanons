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
