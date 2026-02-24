import Link from 'next/link'
import { Building2, Home, Calculator, MessageSquare, Target } from 'lucide-react'

const tools = [
  {
    href: '/workshop/work/refi-builder',
    title: 'Refi Builder',
    description: 'Refinance scenario modeling — rate comparison, cash-out analysis, break-even calc.',
    icon: Building2,
    color: 'ocean',
  },
  {
    href: '/workshop/work/purchase-builder',
    title: 'Purchase Builder',
    description: 'Purchase analysis — down payment options, cash flow projections, ROI analysis.',
    icon: Home,
    color: 'ocean',
  },
  {
    href: '/workshop/work/dscr-calculator',
    title: 'DSCR Calculator',
    description: 'Debt service coverage ratio for investment property qualification.',
    icon: Calculator,
    color: 'ocean',
  },
  {
    href: '/underwriting',
    title: 'Underwriting Chat',
    description: 'AI assistant for guideline questions, overlays, and loan scenarios. Powered by PPH knowledge base.',
    icon: MessageSquare,
    color: 'ocean',
  },
  {
    href: '/workshop/work/scenarios',
    title: 'Scenarios Hub',
    description: 'Overview and comparison across all scenario types.',
    icon: Target,
    color: 'ocean',
  },
]

export default function WorkToolsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-midnight mb-2">Work Tools</h1>
        <p className="text-midnight/60">Calculators, scenario builders, and AI tools for mortgage work.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tools.map(({ href, title, description, icon: Icon }) => {
          const isExternal = href === '/underwriting'
          const Tag = isExternal ? 'a' : Link
          const extraProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}
          return (
            <Tag
              key={href}
              href={href}
              {...(extraProps as object)}
              className="group bg-cream rounded-xl p-6 border border-midnight/5 hover:border-ocean/30 transition-all hover:shadow-lg flex items-start gap-4"
            >
              <Icon className="w-8 h-8 text-ocean flex-shrink-0" />
              <div>
                <h2 className="font-display text-lg text-midnight mb-1 group-hover:text-ocean transition-colors">
                  {title}
                </h2>
                <p className="text-sm text-midnight/60">{description}</p>
              </div>
            </Tag>
          )
        })}
      </div>
    </div>
  )
}
