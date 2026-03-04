'use client'

import Link from 'next/link'
import { Bot, Palette, Mic, Settings } from 'lucide-react'

const cards = [
  {
    href: '/workshop/lo-buddy/character',
    label: 'Character',
    desc: '3D character design, concept art, Meshy iterations & Blender builds',
    icon: Palette,
    ready: true,
  },
  {
    href: '#',
    label: 'Voice UI',
    desc: 'Voice interaction design, animation states, speech integration',
    icon: Mic,
    ready: false,
  },
  {
    href: '#',
    label: 'Agent',
    desc: 'AI agent config, memory, tools, personality',
    icon: Bot,
    ready: false,
  },
  {
    href: '#',
    label: 'Settings',
    desc: 'GHL integration, Twilio, team config',
    icon: Settings,
    ready: false,
  },
]

export default function LOBuddyHome() {
  return (
    <div style={{ minHeight: '60vh' }}>
      <h1 className="font-display text-3xl text-midnight mb-2">LO Buddy</h1>
      <p className="text-midnight/50 mb-8">AI command center for loan officers — character, voice, agent, and integrations.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  )
}
