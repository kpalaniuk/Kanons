'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ClipboardList, 
  Wrench, 
  Users,
  CheckSquare, 
  Sparkles,
  Trophy,
  Leaf,
  LayoutDashboard,
  BookOpen,
  Inbox,
  Map,
  Music,
  Disc,
  NotebookPen,
} from 'lucide-react'

const workLinks = [
  { href: '/workshop/work/pipeline',  label: 'Pipeline', icon: ClipboardList },
  { href: '/workshop/work/hopper',    label: 'Hopper',   icon: Inbox },
  { href: '/workshop/work/tools',     label: 'Tools',    icon: Wrench },
  { href: '/workshop/work/clients',   label: 'Clients',  icon: Users },
]

const personalLinks = [
  { href: '/workshop/personal/journal',          label: 'Journal',  icon: NotebookPen },
  { href: '/workshop/personal/tasks',           label: 'Tasks',    icon: CheckSquare },
  { href: '/workshop/personal/music',            label: 'Music',    icon: Music },
  { href: '/workshop/personal/strongnome',       label: 'StronGnome', icon: Disc },
  { href: '/workshop/personal/trip-july-2026',  label: 'July Trip',icon: Map },
  { href: '/workshop/personal/focus',           label: 'Focus',    icon: Sparkles },
  { href: '/workshop/personal/fc-balboa',       label: 'FC Balboa',icon: Trophy },
  { href: '/workshop/personal/life',            label: 'Life',     icon: Leaf },
]

export default function WorkshopNav() {
  const pathname = usePathname()

  const isWorkActive     = pathname?.startsWith('/workshop/work')
  const isPersonalActive = pathname?.startsWith('/workshop/personal')

  function workLinkClass(href: string) {
    const active = pathname === href || (href !== '/workshop/work/pipeline' && pathname?.startsWith(href))
    return `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
      active ? 'bg-ocean text-cream' : 'text-midnight/50 hover:text-midnight hover:bg-sand'
    }`
  }

  function personalLinkClass(href: string) {
    const active = pathname === href || pathname?.startsWith(href)
    return `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
      active ? 'bg-terracotta text-cream' : 'text-midnight/50 hover:text-midnight hover:bg-sand'
    }`
  }

  const isKBWork     = pathname?.startsWith('/workshop/kb') && false  // handled by query
  const isKBActive   = pathname?.startsWith('/workshop/kb')

  return (
    <div className="bg-cream border-b border-midnight/10 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">

          {/* Home */}
          <Link
            href="/workshop"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              pathname === '/workshop' ? 'bg-midnight text-cream' : 'text-midnight/60 hover:text-midnight hover:bg-sand'
            }`}
          >
            <LayoutDashboard size={14} />
            Home
          </Link>

          <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />

          {/* WORK */}
          <span className={`text-xs font-bold uppercase tracking-wider px-2 flex-shrink-0 ${isWorkActive ? 'text-ocean' : 'text-midnight/30'}`}>
            Work
          </span>
          {workLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={workLinkClass(href)}>
              <Icon size={14} />
              {label}
            </Link>
          ))}

          <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />

          {/* PERSONAL */}
          <span className={`text-xs font-bold uppercase tracking-wider px-2 flex-shrink-0 ${isPersonalActive ? 'text-terracotta' : 'text-midnight/30'}`}>
            Personal
          </span>
          {personalLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={personalLinkClass(href)}>
              <Icon size={14} />
              {label}
            </Link>
          ))}

          <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />

          {/* KB — Work + Personal */}
          <Link
            href="/workshop/kb?cat=Work"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              isKBActive ? 'bg-ocean/10 text-ocean' : 'text-midnight/50 hover:text-midnight hover:bg-sand'
            }`}
          >
            <BookOpen size={14} />
            KB Work
          </Link>
          <Link
            href="/workshop/kb?cat=Personal"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              isKBActive ? 'bg-cyan-500/10 text-cyan-600' : 'text-midnight/50 hover:text-midnight hover:bg-sand'
            }`}
          >
            <BookOpen size={14} />
            KB Personal
          </Link>

        </nav>
      </div>
    </div>
  )
}
