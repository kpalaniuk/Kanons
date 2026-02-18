import Link from 'next/link'

const scenarios = [
  {
    href: '/workshop/work/refi-builder',
    title: 'Refinance Builder',
    description: 'Model refinancing scenarios with custom terms, cash-out options, and ROI projections',
    icon: '🏦',
    stats: ['Cash-out analysis', 'Rate comparison', 'Break-even calc']
  },
  {
    href: '/workshop/work/purchase-builder',
    title: 'Purchase Builder',
    description: 'Analyze potential property purchases with financing scenarios and return calculations',
    icon: '🏠',
    stats: ['Down payment options', 'Cash flow projection', 'ROI analysis']
  },
  {
    href: '/workshop/work/dscr-calculator',
    title: 'DSCR Calculator',
    description: 'Calculate debt service coverage ratio for investment property qualification',
    icon: '🧮',
    stats: ['Income verification', 'Debt coverage', 'Lender requirements']
  },
]

export default function ScenariosPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-midnight mb-2">Financial Scenarios</h1>
        <p className="text-midnight/60">
          Model different real estate financing scenarios and analyze returns
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {scenarios.map((scenario) => (
          <Link
            key={scenario.href}
            href={scenario.href}
            className="group bg-cream rounded-2xl p-8 border border-midnight/5 hover:border-ocean/30 transition-all hover:shadow-xl"
          >
            <div className="flex items-start gap-6">
              <div className="text-6xl">{scenario.icon}</div>
              <div className="flex-1">
                <h3 className="font-display text-2xl text-midnight mb-2 group-hover:text-ocean transition-colors">
                  {scenario.title}
                </h3>
                <p className="text-midnight/60 mb-4">{scenario.description}</p>
                <div className="flex flex-wrap gap-2">
                  {scenario.stats.map((stat, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full bg-ocean/10 text-ocean font-medium"
                    >
                      {stat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-cream rounded-xl p-6 border border-midnight/5">
        <h3 className="font-display text-lg text-midnight mb-2">💡 Getting Started</h3>
        <p className="text-sm text-midnight/60">
          Each calculator is designed for a specific scenario. Use{' '}
          <strong className="text-midnight">Refi Builder</strong> for existing properties,{' '}
          <strong className="text-midnight">Purchase Builder</strong> for new acquisitions, and{' '}
          <strong className="text-midnight">DSCR Calculator</strong> for lender qualification checks.
        </p>
      </div>
    </div>
  )
}
