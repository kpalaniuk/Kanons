import Link from 'next/link'
import { House, DollarSign, BarChart3, Music } from 'lucide-react'

const tools = [
  {
    href: '/workshop/personal/adu',
    title: 'ADU Cash Flow',
    description: "Mike's property management ledger — income, expenses, and net cash flow.",
    icon: House,
  },
  {
    href: '/workshop/personal/events',
    title: 'Event Splitter',
    description: 'Expense splitting calculator for events and group outings.',
    icon: DollarSign,
  },
  {
    href: '/workshop/personal/usage',
    title: 'Usage Tracker',
    description: 'Resource and time usage analytics dashboard.',
    icon: BarChart3,
  },
  {
    href: '/workshop/personal/lyrics',
    title: 'Lyrics',
    description: 'Music lyrics database for StronGnome, Neo Somatic, and other projects.',
    icon: Music,
  },
]

export default function LifePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-midnight mb-2">Life</h1>
        <p className="text-midnight/60">Personal tools — home, finances, music, and tracking.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tools.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group bg-cream rounded-xl p-6 border border-midnight/5 hover:border-terracotta/30 transition-all hover:shadow-lg flex items-start gap-4"
          >
            <Icon className="w-8 h-8 text-terracotta flex-shrink-0" />
            <div>
              <h2 className="font-display text-lg text-midnight mb-1 group-hover:text-terracotta transition-colors">
                {title}
              </h2>
              <p className="text-sm text-midnight/60">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
