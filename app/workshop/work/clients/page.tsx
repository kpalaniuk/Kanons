import Link from 'next/link'
import { User, ExternalLink } from 'lucide-react'

const clients = [
  {
    href: '/workshop/work/pamela-dscr',
    name: 'Pamela',
    type: 'DSCR Analysis',
    description: 'Investment property DSCR calculator — custom parameters, income analysis.',
    internal: true,
    lo: 'Kyle Palaniuk',
  },
  {
    href: '/clients/va/derek-armenta',
    name: 'Derek Armenta',
    type: 'VA Purchase',
    description: 'VA loan purchase scenario — custom rate and payment breakdown.',
    internal: false,
    lo: 'Kyle Palaniuk',
  },
  {
    href: '/tools/scenarios/mikey-esposito',
    name: 'Mikey Esposito',
    type: 'Purchase Scenarios',
    description: 'Purchase scenario builder with multiple financing options.',
    internal: false,
    lo: 'Jim Sakrison',
  },
]

export default function WorkClientsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-midnight mb-2">Client Pages</h1>
        <p className="text-midnight/60">Saved scenario pages for individual clients.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {clients.map(({ href, name, type, description, internal, lo }) => {
          const Tag = internal ? Link : 'a'
          const extraProps = internal ? {} : { target: '_blank', rel: 'noopener noreferrer' }
          return (
            <Tag
              key={href}
              href={href}
              {...(extraProps as object)}
              className="group bg-cream rounded-xl p-6 border border-midnight/5 hover:border-ocean/30 transition-all hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-ocean/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-ocean" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg text-midnight group-hover:text-ocean transition-colors">
                      {name}
                    </h2>
                    <span className="text-xs text-midnight/40">{lo}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-midnight/20 group-hover:text-ocean transition-colors" />
              </div>
              <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-ocean/10 text-ocean mb-2">
                {type}
              </span>
              <p className="text-sm text-midnight/60">{description}</p>
            </Tag>
          )
        })}
      </div>

      <div className="bg-cream rounded-xl p-5 border border-midnight/5 border-dashed text-center text-midnight/30 text-sm">
        New client pages go here as they're built.
      </div>
    </div>
  )
}
