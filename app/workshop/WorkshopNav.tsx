'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const workLinks = [
  { href: '/workshop/work/pipeline', label: 'Pipeline', icon: '📋' },
  { href: '/workshop/work/scenarios', label: 'Scenarios', icon: '🎯' },
  { href: '/workshop/work/dscr-calculator', label: 'DSCR', icon: '🧮' },
  { href: '/workshop/work/refi-builder', label: 'Refi', icon: '🏦' },
  { href: '/workshop/work/purchase-builder', label: 'Purchase', icon: '🏠' },
]

const personalLinks = [
  { href: '/workshop/personal/tasks', label: 'Tasks', icon: '✅' },
  { href: '/workshop/personal/adu', label: 'ADU', icon: '🏡' },
  { href: '/workshop/personal/usage', label: 'Usage', icon: '📊' },
  { href: '/workshop/personal/events', label: 'Events', icon: '💰' },
]

export default function WorkshopNav() {
  const pathname = usePathname()

  return (
    <div className="bg-cream border-b border-midnight/10">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center gap-6 overflow-x-auto py-2">
          <Link
            href="/workshop"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === '/workshop'
                ? 'bg-midnight text-cream'
                : 'text-midnight/60 hover:text-midnight hover:bg-sand'
            }`}
          >
            <span>🏠</span>
            Home
          </Link>
          
          <div className="h-6 w-px bg-midnight/10" />
          
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-midnight/40 px-2">WORK</span>
            {workLinks.map((link) => {
              const isActive = pathname === link.href ||
                (pathname?.startsWith(link.href) && link.href !== '/workshop')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-ocean text-cream'
                      : 'text-midnight/60 hover:text-midnight hover:bg-sand'
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="h-6 w-px bg-midnight/10" />
          
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-midnight/40 px-2">PERSONAL</span>
            {personalLinks.map((link) => {
              const isActive = pathname === link.href ||
                (pathname?.startsWith(link.href) && link.href !== '/workshop')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-terracotta text-cream'
                      : 'text-midnight/60 hover:text-midnight hover:bg-sand'
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
