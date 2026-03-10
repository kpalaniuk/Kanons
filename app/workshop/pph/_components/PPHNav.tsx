'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Calculator, RefreshCw, BarChart3 } from 'lucide-react'

const links = [
  { href: '/workshop/pph/opportunities', label: 'Pipeline', icon: LayoutGrid },
  { href: '/workshop/pph/purchase-builder', label: 'Purchase', icon: Calculator },
  { href: '/workshop/pph/refi-builder', label: 'Refi', icon: RefreshCw },
  { href: '/workshop/pph/dscr-calculator', label: 'DSCR', icon: BarChart3 },
]

export function PPHNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1 mb-6 bg-midnight/5 rounded-xl p-1 w-fit">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/workshop/pph/opportunities' && pathname.startsWith(href))
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
