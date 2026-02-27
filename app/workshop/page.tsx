import Link from 'next/link'
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
} from 'lucide-react'

const workTools = [
  { href: '/workshop/work/pipeline', title: 'Pipeline',  description: 'Track and manage client opportunities', icon: ClipboardList, color: 'ocean' },
  { href: '/workshop/work/tools',    title: 'Tools',     description: 'Scenario builders, DSCR calc, underwriting chat', icon: Wrench, color: 'ocean' },
  { href: '/workshop/work/clients',  title: 'Clients',   description: 'Saved scenario pages for individual clients', icon: Users, color: 'ocean' },
]

const personalTools = [
  { href: '/workshop/personal/morning',   title: 'Morning Brief', description: 'Daily priorities, weather, trip countdown',         icon: Sun,        color: 'terracotta' },
  { href: '/workshop/personal/tasks',     title: 'Tasks',         description: 'Personal task tracking',                           icon: CheckSquare, color: 'terracotta' },
  { href: '/workshop/personal/focus',     title: 'Focus',         description: 'Scoped AI sessions that produce clean artifacts',   icon: Sparkles,   color: 'terracotta' },
  { href: '/workshop/personal/fc-balboa', title: 'FC Balboa',     description: 'U10 coaching hub — roster, practice plans, log',    icon: Trophy,     color: 'terracotta' },
  { href: '/workshop/personal/life',      title: 'Life',          description: 'ADU ledger, event splitter, usage, lyrics',         icon: Leaf,       color: 'terracotta' },
]

// Knowledge Base articles imported from shared data (published only, newest 6)
import { articles as allKbArticles } from '@/lib/articles'
const kbArticles = allKbArticles.filter(a => a.published).slice(0, 6)

const quickLinks = [
  {
    name: 'Granada House',
    url: 'https://granadahouse.com',
    description: 'Music venue & creative space'
  },
  {
    name: 'Plan Prepare Home',
    url: 'https://planpreparehome.com',
    description: 'Real estate investment consulting'
  },
]

export default function WorkshopPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-display text-4xl text-midnight mb-2">Workshop</h1>
        <p className="text-midnight/60">Your tools and trackers in one place</p>
      </div>

      {/* Work Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-ocean rounded-full" />
          <h2 className="font-display text-2xl text-midnight">Work</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-cream rounded-xl p-6 border border-midnight/5 hover:border-ocean/30 transition-all hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <Icon className="w-8 h-8 text-ocean" />
                  <div className="flex-1">
                    <h3 className="font-display text-lg text-midnight mb-1 group-hover:text-ocean transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-midnight/60">{tool.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Personal Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-terracotta rounded-full" />
          <h2 className="font-display text-2xl text-midnight">Personal</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {personalTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-cream rounded-xl p-6 border border-midnight/5 hover:border-terracotta/30 transition-all hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <Icon className="w-8 h-8 text-terracotta" />
                  <div className="flex-1">
                    <h3 className="font-display text-lg text-midnight mb-1 group-hover:text-terracotta transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-midnight/60">{tool.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Knowledge Base Section */}
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

      {/* Quick Links Section */}
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
                <h3 className="font-medium text-midnight group-hover:text-ocean transition-colors">
                  {link.name}
                </h3>
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
