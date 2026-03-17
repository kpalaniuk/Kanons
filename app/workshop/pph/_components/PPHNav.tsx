'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Users } from 'lucide-react'

const links = [
  { href: '/workshop/pph/opportunities', label: 'Pipeline', icon: LayoutGrid },
  { href: '/workshop/pph/clients', label: 'Clients', icon: Users, matchPrefix: true },
]

export function PPHNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1 mb-4 bg-midnight/5 rounded-xl p-1 w-fit">
      {links.map(({ href, label, icon: Icon, matchPrefix }) => {
        const active = pathname === href || (matchPrefix && pathname.startsWith('/workshop/pph/clients'))
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              active
                ? 'bg-midnight text-cream shadow-sm'
                : 'text-midnight/60 hover:text-midnight hover:bg-midnight/8'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
