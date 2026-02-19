'use client'

import { useState } from 'react'
import { BookOpen, Mic, Cpu, FileText, ExternalLink, Users, Brain, MessageSquare } from 'lucide-react'

const initialArtifacts = [
  {
    title: 'Trumpet Mic Comparison',
    description: 'Bell clip vs off-bell vs dual mount — side by side comparison for live gigging. DPA 4099, AMT P800, EVNO TPX2, and more.',
    href: '/artifacts/trumpet-mic-comparison.html',
    category: 'Music & Gear',
    date: 'Feb 19, 2026',
    icon: Mic,
    color: 'terracotta',
    published: false,
  },
  {
    title: 'LO Buddy × OpenClaw Architecture',
    description: 'How OpenClaw patterns (SOUL.md, sessions, multi-agent, skills, heartbeat, memory) can power LO Buddy at scale. Full strategy doc with implementation phases.',
    href: '/artifacts/lo-buddy-openclaw-architecture.html',
    category: 'LO Buddy',
    date: 'Feb 19, 2026',
    icon: Cpu,
    color: 'ocean',
    published: false,
  },
  {
    title: 'Paige + Daniel Partnership Roadmap',
    description: 'Strategic roadmap for the designer-contractor partnership — roles, revenue, and growth phases.',
    href: '/artifacts/paige-daniel-summary',
    category: 'GH Design',
    date: 'Feb 19, 2026',
    icon: Users,
    color: 'terracotta',
    published: false,
  },
  {
    title: 'Multi-Agent Research',
    description: 'Deep dive into multi-agent AI architectures — patterns, frameworks, and practical applications.',
    href: '/artifacts/multi-agent-research',
    category: 'LO Buddy',
    date: 'Feb 19, 2026',
    icon: Brain,
    color: 'ocean',
    published: false,
  },
  {
    title: 'LO Buddy + Chad Meeting',
    description: 'Meeting notes and action items from the LO Buddy + Chad strategy session.',
    href: '/artifacts/lo-buddy-chad-meeting',
    category: 'LO Buddy',
    date: 'Feb 19, 2026',
    icon: MessageSquare,
    color: 'ocean',
    published: false,
  },
  {
    title: 'Designer-Contractor Partnership Guide',
    description: 'Framework for structuring a designer-contractor partnership — from pricing to project flow.',
    href: '/artifacts/Designer-Contractor_Partnership_Guide.md',
    category: 'GH Design',
    date: 'Feb 19, 2026',
    icon: FileText,
    color: 'terracotta',
    published: false,
  },
]

const contextFiles = [
  {
    title: 'LO Buddy Full Briefing',
    description: 'Complete codebase briefing — tech stack, architecture, data model, AI system, OpenClaw integration patterns.',
    filename: 'lo-buddy-briefing.md',
    category: 'LO Buddy',
  },
  {
    title: 'LO Buddy Test Report',
    description: 'Current build status, test failures, what\'s built vs what\'s blocked. Pre-meeting prep from Feb 18.',
    filename: 'lo-buddy-test-report.md',
    category: 'LO Buddy',
  },
  {
    title: 'LO Buddy Meeting Prep (2/11)',
    description: 'Architecture context, LO Ninja integration plan, agent-to-node mapping strategy. Written for the Brad meeting.',
    filename: 'lo-buddy-meeting-prep-2-11.md',
    category: 'LO Buddy',
  },
  {
    title: 'OpenRouter Strategy Memo',
    description: 'Using OpenRouter as the API agent router for LO Buddy — model routing, cost optimization.',
    filename: 'lo-buddy-openrouter-memo.md',
    category: 'LO Buddy',
  },
  {
    title: 'GH Design Strategy',
    description: 'Website strategy for Granada House Design — Paige\'s interior design business.',
    filename: 'gh-design-strategy.md',
    category: 'GH Design',
  },
  {
    title: 'Designer-Contractor Partnership Guide',
    description: 'Framework for Paige + Daniel partnership structure.',
    filename: 'designer-contractor-partnership-guide.md',
    category: 'GH Design',
  },
  {
    title: 'Trumpet Mic Research (Raw)',
    description: 'Full research notes — all 8 mics, wireless systems, pro accounts, pricing.',
    filename: 'trumpet-mic-research.md',
    category: 'Music & Gear',
  },
]

const categoryColors: Record<string, string> = {
  'LO Buddy': 'bg-ocean/10 text-ocean',
  'Music & Gear': 'bg-terracotta/10 text-terracotta',
  'GH Design': 'bg-sunset/10 text-amber-600',
}

export default function KnowledgeBasePage() {
  const [artifacts, setArtifacts] = useState(initialArtifacts)

  const togglePublish = (index: number) => {
    setArtifacts((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, published: !item.published } : item
      )
    )
    // Future: call /api/kb/publish
    fetch('/api/kb/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        href: artifacts[index].href,
        published: !artifacts[index].published,
      }),
    }).catch(() => {
      // API not wired yet — that's fine
    })
  }

  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-cyan-500" />
          <h1 className="font-display text-4xl text-midnight">Knowledge Base</h1>
        </div>
        <p className="text-midnight/60">Research, strategy docs, and reference materials — organized and designed for humans.</p>
      </div>

      {/* Published Artifacts */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-cyan-500 rounded-full" />
          <h2 className="font-display text-2xl text-midnight">Published Articles</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {artifacts.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={item.href}
                className="group bg-cream rounded-xl p-6 border border-midnight/5 hover:border-cyan-500/30 transition-all hover:shadow-lg"
              >
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-cyan-500" />
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[item.category] || 'bg-midnight/5 text-midnight/60'}`}>
                        {item.category}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-midnight/30 group-hover:text-cyan-500 transition-colors" />
                  </div>
                  <h3 className="font-display text-lg text-midnight mb-2 group-hover:text-cyan-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-midnight/60 mb-3">{item.description}</p>
                  <span className="text-xs text-midnight/40">{item.date}</span>
                </a>
                <div className="mt-4 pt-4 border-t border-midnight/5">
                  <button
                    onClick={() => togglePublish(index)}
                    className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                      item.published
                        ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                        : 'border border-midnight/20 text-midnight/50 hover:border-cyan-500 hover:text-cyan-500'
                    }`}
                  >
                    {item.published ? 'Published ✓' : 'Publish to Blog →'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Context Files */}
      <section>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-midnight/20 rounded-full" />
          <h2 className="font-display text-2xl text-midnight">Context Files</h2>
        </div>
        <p className="text-midnight/50 text-sm mb-6">Raw reference docs synced to Syncthing + Notion. These are AI-readable context files — not designed for browsing, but listed here for reference.</p>
        <div className="space-y-2">
          {contextFiles.map((file) => (
            <div
              key={file.filename}
              className="flex items-center justify-between p-4 bg-sand/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-midnight/40" />
                <div>
                  <h3 className="text-sm font-medium text-midnight">{file.title}</h3>
                  <p className="text-xs text-midnight/50">{file.description}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[file.category] || 'bg-midnight/5 text-midnight/60'}`}>
                {file.category}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
