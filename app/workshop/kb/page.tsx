'use client'

import { BookOpen, Mic, Cpu, FileText, ExternalLink, Users, Brain, MessageSquare } from 'lucide-react'
import { articles } from '@/lib/articles'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  '/artifacts/trumpet-mic-comparison.html': Mic,
  '/artifacts/lo-buddy-openclaw-architecture.html': Cpu,
  '/artifacts/paige-daniel-summary': Users,
  '/artifacts/multi-agent-research': Brain,
  '/artifacts/lo-buddy-chad-meeting': MessageSquare,
  '/artifacts/Designer-Contractor_Partnership_Guide.md': FileText,
}

const colorMap: Record<string, string> = {
  '/artifacts/trumpet-mic-comparison.html': 'terracotta',
  '/artifacts/lo-buddy-openclaw-architecture.html': 'ocean',
  '/artifacts/paige-daniel-summary': 'terracotta',
  '/artifacts/multi-agent-research': 'ocean',
  '/artifacts/lo-buddy-chad-meeting': 'ocean',
  '/artifacts/Designer-Contractor_Partnership_Guide.md': 'terracotta',
}

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
  'Technology': 'bg-ocean/10 text-ocean',
  'Business': 'bg-sunset/10 text-amber-600',
}

export default function KnowledgeBasePage() {
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
          {articles.map((item) => {
            const Icon = iconMap[item.href] || FileText
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
                  <span
                    className={`text-xs font-semibold px-4 py-2 rounded-lg inline-block ${
                      item.published
                        ? 'bg-cyan-500 text-white'
                        : 'border border-midnight/20 text-midnight/50'
                    }`}
                  >
                    {item.published ? 'Published ✓' : 'Not Published'}
                  </span>
                  <p className="text-xs text-midnight/30 mt-2">Ask Jasper to publish</p>
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
