import Link from 'next/link'
import { 
  ClipboardList, 
  Target, 
  Calculator, 
  Building2, 
  Home, 
  CheckSquare, 
  House, 
  BarChart3, 
  DollarSign,
  Music,
  ExternalLink
} from 'lucide-react'

const workTools = [
  { 
    href: '/workshop/work/pipeline', 
    title: 'Pipeline', 
    description: 'Track and manage client opportunities',
    icon: ClipboardList,
    color: 'ocean' 
  },
  { 
    href: '/workshop/work/scenarios', 
    title: 'Scenarios', 
    description: 'Financial modeling hub',
    icon: Target,
    color: 'ocean' 
  },
  { 
    href: '/workshop/work/dscr-calculator', 
    title: 'DSCR Calculator', 
    description: 'Debt service coverage ratio analysis',
    icon: Calculator,
    color: 'ocean' 
  },
  { 
    href: '/workshop/work/refi-builder', 
    title: 'Refi Builder', 
    description: 'Refinance scenario modeling',
    icon: Building2,
    color: 'ocean' 
  },
  { 
    href: '/workshop/work/purchase-builder', 
    title: 'Purchase Builder', 
    description: 'Purchase analysis & projections',
    icon: Home,
    color: 'ocean' 
  },
]

const personalTools = [
  { 
    href: '/workshop/personal/tasks', 
    title: 'Tasks', 
    description: 'Personal task tracking',
    icon: CheckSquare,
    color: 'terracotta' 
  },
  { 
    href: '/workshop/personal/adu', 
    title: 'ADU Cash Flow', 
    description: "Mike's property management ledger",
    icon: House,
    color: 'terracotta' 
  },
  { 
    href: '/workshop/personal/usage', 
    title: 'Usage Tracker', 
    description: 'Resource and time usage analytics',
    icon: BarChart3,
    color: 'terracotta' 
  },
  { 
    href: '/workshop/personal/events', 
    title: 'Event Splitter', 
    description: 'Expense splitting calculator',
    icon: DollarSign,
    color: 'terracotta' 
  },
  { 
    href: '/workshop/personal/lyrics', 
    title: 'Lyrics', 
    description: 'Music lyrics database',
    icon: Music,
    color: 'terracotta' 
  },
]

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
