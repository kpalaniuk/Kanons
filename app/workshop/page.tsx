'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { 
  ClipboardList,
  Wrench,
  Users,
  CheckSquare, 
  Sparkles,
  Trophy,
  Leaf,
  Sun,
  ExternalLink,
  BookOpen,
  Music,
  Palette,
  Disc,
  NotebookPen,
  Zap,
  Building2,
  Inbox,
  Map,
} from 'lucide-react'

// Import articles for KB section
import { articles as allKbArticles } from '@/lib/articles'
const kbArticles = allKbArticles.filter(a => a.published).slice(0, 6)

function useRoles(): string[] {
  const { user } = useUser()
  const meta = user?.publicMetadata as Record<string, unknown> | undefined
  return (meta?.roles as string[]) ?? []
}

function hasAccess(roles: string[], section: 'pph' | 'hot-dog' | 'personal') {
  if (roles.length === 0) return true
  if (roles.includes('admin')) return true
  if (section === 'personal') return false
  return roles.includes(section)
}

const pphTools = [
  { href: '/workshop/pph/pipeline',          title: 'Pipeline',        description: 'Track and manage client opportunities',                     icon: ClipboardList },
  { href: '/workshop/pph/tools',             title: 'Tools',           description: 'Scenario builders, DSCR calc, underwriting chat',           icon: Wrench },
  { href: '/workshop/pph/clients',           title: 'Clients',         description: 'Saved scenario pages for individual clients',               icon: Users },
  { href: '/workshop/pph/lo-buddy-character',title: 'LO Buddy Art',    description: 'Character concept gallery',                                 icon: Palette },
]

const hotDogTools = [
  { href: '/workshop/operation-hot-dog',        title: 'Hot Dog HQ',  description: 'Research, discovery framework, build queue',                 icon: Zap },
  { href: '/workshop/operation-hot-dog/hopper', title: 'Hopper',      description: 'Sprint planning discovery interview for LO Buddy',           icon: Inbox },
]

const personalTools = [
  { href: '/workshop/personal/journal',          title: 'Journal',       description: 'Brain dumps and late-night reflections',                  icon: NotebookPen },
  { href: '/workshop/personal/morning',          title: 'Morning Brief', description: 'Daily priorities, weather, trip countdown',               icon: Sun },
  { href: '/workshop/personal/tasks',            title: 'Tasks',         description: 'Personal task tracking',                                  icon: CheckSquare },
  { href: '/workshop/personal/music',            title: 'Music Habit',   description: '30-min daily habit — trumpet + production, streak log',   icon: Music },
  { href: '/workshop/personal/focus',            title: 'Focus',         description: 'Scoped AI sessions that produce clean artifacts',          icon: Sparkles },
  { href: '/workshop/personal/fc-balboa',        title: 'FC Balboa',     description: 'U10 coaching hub — roster, practice plans, log',          icon: Trophy },
  { href: '/workshop/personal/lyrics',           title: 'Songs',         description: 'Song library by band',                                    icon: Music },
  { href: '/workshop/personal/strongnome',       title: 'StronGnome',    description: '"Vast" release — landing page draft',                     icon: Disc },
  { href: '/workshop/personal/trip-july-2026',   title: 'July Trip',     description: 'Ireland + Scotland — itinerary and logistics',            icon: Map },
  { href: '/workshop/personal/life',             title: 'Life',          description: 'ADU ledger, event splitter, usage',                       icon: Leaf },
]

type ColorScheme = 'ocean' | 'amber' | 'terracotta'

const colorMap: Record<ColorScheme, { icon: string; hover: string; border: string }> = {
  ocean:      { icon: 'text-ocean',      hover: 'group-hover:text-ocean',      border: 'hover:border-ocean/30' },
  amber:      { icon: 'text-amber-500',  hover: 'group-hover:text-amber-500',  border: 'hover:border-amber-400/30' },
  terracotta: { icon: 'text-terracotta', hover: 'group-hover:text-terracotta', border: 'hover:border-terracotta/30' },
}

function SectionCard({ tool, color }: { tool: typeof pphTools[0]; color: ColorScheme }) {
  const Icon = tool.icon
  const c = colorMap[color]
  return (
    <Link
      href={tool.href}
      className={`group bg-cream rounded-xl p-6 border border-midnight/5 ${c.border} transition-all hover:shadow-lg`}
    >
      <div className="flex items-start gap-4">
        <Icon className={`w-8 h-8 ${c.icon}`} />
        <div className="flex-1">
          <h3 className={`font-display text-lg text-midnight mb-1 ${c.hover} transition-colors`}>
            {tool.title}
          </h3>
          <p className="text-sm text-midnight/60">{tool.description}</p>
        </div>
      </div>
    </Link>
  )
}

const quickLinks = [
  { name: 'Granada House', url: 'https://granadahouse.com', description: 'Music venue & creative space' },
  { name: 'Plan Prepare Home', url: 'https://planpreparehome.com', description: 'Real estate investment consulting' },
]

export default function WorkshopPage() {
  const roles = useRoles()
  const canPPH      = hasAccess(roles, 'pph')
  const canHotDog   = hasAccess(roles, 'hot-dog')
  const canPersonal = hasAccess(roles, 'personal')

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-4xl text-midnight mb-2">Workshop</h1>
        <p className="text-midnight/60">Your tools and trackers in one place</p>
      </div>

      {/* PPH Section */}
      {canPPH && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-ocean rounded-full" />
            <Building2 className="w-5 h-5 text-ocean" />
            <h2 className="font-display text-2xl text-midnight">Plan Prepare Home</h2>
            <Link href="/workshop/pph" className="ml-auto text-xs text-ocean/60 hover:text-ocean transition-colors">
              All PPH tools →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pphTools.map(tool => <SectionCard key={tool.href} tool={tool} color="ocean" />)}
          </div>
        </section>
      )}

      {/* Hot Dog Section */}
      {canHotDog && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-amber-400 rounded-full" />
            <span className="text-lg">🌭</span>
            <h2 className="font-display text-2xl text-midnight">Operation Hot Dog</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hotDogTools.map(tool => <SectionCard key={tool.href} tool={tool} color="amber" />)}
          </div>
        </section>
      )}

      {/* Personal Section */}
      {canPersonal && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-terracotta rounded-full" />
            <h2 className="font-display text-2xl text-midnight">Personal</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {personalTools.map(tool => <SectionCard key={tool.href} tool={tool} color="terracotta" />)}
          </div>
        </section>
      )}

      {/* Knowledge Base */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-cyan-500 rounded-full" />
            <h2 className="font-display text-2xl text-midnight">Knowledge Base</h2>
          </div>
          <Link href="/workshop/kb" className="text-sm font-medium text-cyan-500 hover:text-cyan-600 transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {kbArticles.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-cream rounded-xl p-6 border border-midnight/5 hover:border-cyan-500/30 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <BookOpen className="w-8 h-8 text-cyan-500 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-display text-lg text-midnight mb-1 group-hover:text-cyan-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-midnight/60">{item.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="pt-8 border-t border-midnight/10">
        <h2 className="font-display text-xl text-midnight mb-4">Quick Links</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {quickLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-sand rounded-lg hover:bg-sand/60 transition-colors group"
            >
              <div>
                <h3 className="font-medium text-midnight group-hover:text-ocean transition-colors">{link.name}</h3>
                <p className="text-sm text-midnight/60">{link.description}</p>
              </div>
              <ExternalLink size={18} className="text-midnight/40 group-hover:text-ocean transition-colors" />
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
