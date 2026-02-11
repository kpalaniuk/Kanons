'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const familyLinks = [
  { href: '/family', label: 'Home', icon: '🏠' },
  { href: '/family/tasks', label: 'Tasks', icon: '✅' },
  { href: '/family/pipeline', label: 'Pipeline', icon: '📋' },
  { href: '/family/tools', label: 'Tools', icon: '🛠️' },
]

export default function FamilyNav() {
  const pathname = usePathname()

  return (
    <div className="bg-cream border-b border-midnight/10">
      <div className="max-w-6xl mx-auto px-6">
        <nav className="flex items-center gap-1 overflow-x-auto py-2">
          {familyLinks.map((link) => {
            const isActive = pathname === link.href ||
              (link.href !== '/family' && pathname?.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-midnight text-cream'
                    : 'text-midnight/60 hover:text-midnight hover:bg-sand'
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
