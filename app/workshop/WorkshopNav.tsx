'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ClipboardList, 
  Target, 
  Calculator, 
  Building2, 
  Home, 
  CheckSquare, 
  House, 
  BarChart3, 
  DollarSign,
  LayoutDashboard,
  Music,
  BookOpen,
  MessageSquare,
  Settings
} from 'lucide-react'

const workLinks = [
  { href: '/workshop/work/pipeline', label: 'Pipeline', icon: ClipboardList },
  { href: '/workshop/work/scenarios', label: 'Scenarios', icon: Target },
  { href: '/workshop/work/refi-builder', label: 'Refi', icon: Building2 },
  { href: '/workshop/work/purchase-builder', label: 'Purchase', icon: Home },
  { href: '/underwriting', label: 'Underwriting', icon: MessageSquare },
]

const personalLinks = [
  { href: '/workshop/personal/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/workshop/personal/adu', label: 'ADU', icon: House },
  { href: '/workshop/personal/usage', label: 'Usage', icon: BarChart3 },
  { href: '/workshop/personal/events', label: 'Events', icon: DollarSign },
  { href: '/workshop/personal/lyrics', label: 'Lyrics', icon: Music },
]

const adminLinks = [
  { href: '/workshop/admin/dscr-clients', label: 'DSCR Clients', icon: Settings },
]

export default function WorkshopNav() {
  const pathname = usePathname()
  const isWorkActive = pathname?.startsWith('/workshop/work')
  const isPersonalActive = pathname?.startsWith('/workshop/personal')
  const isAdminActive = pathname?.startsWith('/workshop/admin')
  const isKBActive = pathname?.startsWith('/workshop/kb')

  return (
    <div className="bg-cream border-b border-midnight/10 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          {/* Home */}
          <Link
            href="/workshop"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === '/workshop'
                ? 'bg-midnight text-cream'
                : 'text-midnight/60 hover:text-midnight hover:bg-sand'
            }`}
          >
            <LayoutDashboard size={14} />
            Home
          </Link>

          <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />

          {/* Work section label */}
          <span className={`text-xs font-bold uppercase tracking-wider px-2 flex-shrink-0 ${
            isWorkActive ? 'text-ocean' : 'text-midnight/30'
          }`}>
            Work
          </span>

          {workLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  isActive
                    ? 'bg-ocean text-cream'
                    : 'text-midnight/50 hover:text-midnight hover:bg-sand'
                }`}
              >
                <Icon size={14} />
                {link.label}
              </Link>
            )
          })}

          <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />

          {/* Personal section label */}
          <span className={`text-xs font-bold uppercase tracking-wider px-2 flex-shrink-0 ${
            isPersonalActive ? 'text-terracotta' : 'text-midnight/30'
          }`}>
            Personal
          </span>

          {personalLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  isActive
                    ? 'bg-terracotta text-cream'
                    : 'text-midnight/50 hover:text-midnight hover:bg-sand'
                }`}
              >
                <Icon size={14} />
                {link.label}
              </Link>
            )
          })}

          <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />

          {/* Admin section label */}
          <span className={`text-xs font-bold uppercase tracking-wider px-2 flex-shrink-0 ${
            isAdminActive ? 'text-amber' : 'text-midnight/30'
          }`}>
            Admin
          </span>

          {adminLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  isActive
                    ? 'bg-amber text-midnight'
                    : 'text-midnight/50 hover:text-midnight hover:bg-sand'
                }`}
              >
                <Icon size={14} />
                {link.label}
              </Link>
            )
          })}

          <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />

          {/* Knowledge Base */}
          <Link
            href="/workshop/kb"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              isKBActive
                ? 'bg-cyan-500 text-cream'
                : 'text-midnight/50 hover:text-midnight hover:bg-sand'
            }`}
          >
            <BookOpen size={14} />
            KB
          </Link>
        </nav>
      </div>
    </div>
  )
}
