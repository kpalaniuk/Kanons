import Link from 'next/link'
import { ClipboardList, Wrench, Users, Palette, Calculator, BookOpen, ArrowRight } from 'lucide-react'

const pphTools = [
  {
    href: '/workshop/pph/pipeline',
    title: 'Pipeline',
    description: 'Track and manage client opportunities',
    icon: ClipboardList,
  },
  {
    href: '/workshop/pph/tools',
    title: 'Tools',
    description: 'Scenario builders, DSCR calc, underwriting chat',
    icon: Wrench,
  },
  {
    href: '/workshop/pph/clients',
    title: 'Clients',
    description: 'Saved scenario pages for individual clients',
    icon: Users,
  },
  {
    href: '/workshop/pph/lo-buddy-character',
    title: 'LO Buddy Art',
    description: 'Character concept gallery',
    icon: Palette,
  },
  {
    href: '/workshop/pph/dscr-calculator',
    title: 'DSCR Calculator',
    description: 'Debt service coverage ratio tool',
    icon: Calculator,
  },
  {
    href: '/workshop/pph/scenarios',
    title: 'Scenarios',
    description: 'Purchase, refi, and custom scenario builders',
    icon: BookOpen,
  },
]

export default function PPHPage() {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-2 text-sm text-midnight/40 mb-3">
          <Link href="/workshop" className="hover:text-ocean transition-colors">Workshop</Link>
          <span>/</span>
          <span className="text-midnight">PPH</span>
        </div>
        <h1 className="font-display text-4xl text-midnight mb-2">Plan Prepare Home</h1>
        <p className="text-midnight/60">Mortgage tools, pipeline, and client resources</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pphTools.map((tool) => {
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
                <ArrowRight className="w-4 h-4 text-midnight/20 group-hover:text-ocean transition-colors mt-1" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
