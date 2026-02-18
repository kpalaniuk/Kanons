import Link from 'next/link'

const workTools = [
  { 
    href: '/workshop/work/pipeline', 
    title: 'Pipeline', 
    description: 'Track and manage client opportunities',
    icon: '📋',
    color: 'ocean' 
  },
  { 
    href: '/workshop/work/scenarios', 
    title: 'Scenarios', 
    description: 'Financial modeling hub',
    icon: '🎯',
    color: 'ocean' 
  },
  { 
    href: '/workshop/work/dscr-calculator', 
    title: 'DSCR Calculator', 
    description: 'Debt service coverage ratio analysis',
    icon: '🧮',
    color: 'ocean' 
  },
  { 
    href: '/workshop/work/refi-builder', 
    title: 'Refi Builder', 
    description: 'Refinance scenario modeling',
    icon: '🏦',
    color: 'ocean' 
  },
  { 
    href: '/workshop/work/purchase-builder', 
    title: 'Purchase Builder', 
    description: 'Purchase analysis & projections',
    icon: '🏠',
    color: 'ocean' 
  },
]

const personalTools = [
  { 
    href: '/workshop/personal/tasks', 
    title: 'Tasks', 
    description: 'Personal task tracking',
    icon: '✅',
    color: 'terracotta' 
  },
  { 
    href: '/workshop/personal/adu', 
    title: 'ADU Cash Flow', 
    description: "Mike's property management ledger",
    icon: '🏡',
    color: 'terracotta' 
  },
  { 
    href: '/workshop/personal/usage', 
    title: 'Usage Tracker', 
    description: 'Resource and time usage analytics',
    icon: '📊',
    color: 'terracotta' 
  },
  { 
    href: '/workshop/personal/events', 
    title: 'Event Splitter', 
    description: 'Expense splitting calculator',
    icon: '💰',
    color: 'terracotta' 
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
          {workTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-cream rounded-xl p-6 border border-midnight/5 hover:border-ocean/30 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{tool.icon}</div>
                <div className="flex-1">
                  <h3 className="font-display text-lg text-midnight mb-1 group-hover:text-ocean transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-midnight/60">{tool.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Personal Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-terracotta rounded-full" />
          <h2 className="font-display text-2xl text-midnight">Personal</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {personalTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-cream rounded-xl p-6 border border-midnight/5 hover:border-terracotta/30 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{tool.icon}</div>
                <div className="flex-1">
                  <h3 className="font-display text-lg text-midnight mb-1 group-hover:text-terracotta transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-midnight/60">{tool.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
