'use client'

import Link from 'next/link'
import { Bot, Palette, Mic, Settings, ExternalLink, Trello, BookOpen, Github, Layout, MessageSquare } from 'lucide-react'

const cards = [
  {
    href: '/workshop/lo-buddy/character',
    label: 'Character',
    desc: '3D character design, concept art, Meshy iterations & Blender builds',
    icon: Palette,
    ready: true,
    external: false,
  },
  {
    href: '#',
    label: 'Voice UI',
    desc: 'Voice interaction design, animation states, speech integration',
    icon: Mic,
    ready: false,
    external: false,
  },
  {
    href: '#',
    label: 'Agent',
    desc: 'AI agent config, memory, tools, personality',
    icon: Bot,
    ready: false,
    external: false,
  },
  {
    href: '#',
    label: 'Settings',
    desc: 'GHL integration, Twilio, team config',
    icon: Settings,
    ready: false,
    external: false,
  },
]

const externalLinks = [
  {
    href: 'https://trello.com/b/699ebbc82d58921099391505',
    label: 'Trello — V1 Roadmap',
    desc: 'Sprint board, backlog, priorities',
    icon: Layout,
  },
  {
    href: 'https://www.notion.so/2f6bba5ab1ac81ff9755c53c95a30b35',
    label: 'Notion — Jasper HQ',
    desc: 'Task queue, inbox, activity log',
    icon: BookOpen,
  },
  {
    href: 'https://github.com/kpalaniuk/lo-buddy',
    label: 'GitHub Repo',
    desc: 'Source code, PRs, issues',
    icon: Github,
  },
  {
    href: 'https://www.meshy.ai',
    label: 'Meshy.ai',
    desc: '3D model generation from text & images',
    icon: Bot,
  },
  {
    href: 'https://discord.com/channels/1476344207949037619',
    label: 'Discord — Hotclaw',
    desc: 'Team chat, #lo-buddy-hopper',
    icon: MessageSquare,
  },
]

export default function LOBuddyHome() {
  return (
    <div style={{ minHeight: '60vh' }}>
      <h1 className="font-display text-3xl text-midnight mb-2">LO Buddy</h1>
      <p className="text-midnight/50 mb-8">AI command center for loan officers — character, voice, agent, and integrations.</p>

      {/* Internal pages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {cards.map(c => {
          const Icon = c.icon
          const inner = (
            <div
              className={`bg-cream rounded-2xl p-6 transition-shadow ${c.ready ? 'hover:shadow-lg cursor-pointer' : 'opacity-50'}`}
            >
              <div className="w-10 h-10 bg-midnight/5 rounded-xl flex items-center justify-center mb-3">
                <Icon size={20} className="text-midnight/60" />
              </div>
              <h3 className="font-display text-lg text-midnight mb-1">{c.label}</h3>
              <p className="text-midnight/50 text-sm">{c.desc}</p>
              {!c.ready && <span className="text-xs text-midnight/30 mt-2 block">Coming soon</span>}
            </div>
          )
          return c.ready ? <Link key={c.label} href={c.href} className="no-underline">{inner}</Link> : <div key={c.label}>{inner}</div>
        })}
      </div>

      {/* External links */}
      <h2 className="font-display text-xl text-midnight mb-4">External Resources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {externalLinks.map(l => {
          const Icon = l.icon
          return (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <div className="bg-cream rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer flex items-start gap-3">
                <div className="w-9 h-9 bg-midnight/5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={16} className="text-midnight/50" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm text-midnight">{l.label}</span>
                    <ExternalLink size={12} className="text-midnight/30 flex-shrink-0" />
                  </div>
                  <p className="text-midnight/40 text-xs mt-0.5">{l.desc}</p>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
