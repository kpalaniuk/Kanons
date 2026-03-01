'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
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
  Zap,
  Building2,
} from 'lucide-react'

const pphLinks = [
  { href: '/workshop/pph/pipeline', label: 'Pipeline', icon: ClipboardList },
  { href: '/workshop/pph/tools',    label: 'Tools',    icon: Wrench },
  { href: '/workshop/pph/clients',  label: 'Clients',  icon: Users },
]

const hotDogLinks = [
  { href: '/workshop/operation-hot-dog',                  label: 'Hot Dog',     icon: Zap },
  { href: '/workshop/operation-hot-dog/hopper',           label: 'Hopper',      icon: Inbox },
  { href: '/workshop/operation-hot-dog/how-it-works',     label: 'How It Works',icon: BookOpen },
]

const personalLinks = [
  { href: '/workshop/personal/journal',         label: 'Journal',   icon: NotebookPen },
  { href: '/workshop/personal/tasks',           label: 'Tasks',     icon: CheckSquare },
  { href: '/workshop/personal/music',           label: 'Music',     icon: Music },
  { href: '/workshop/personal/strongnome',      label: 'StronGnome',icon: Disc },
  { href: '/workshop/personal/trip-july-2026',  label: 'July Trip', icon: Map },
  { href: '/workshop/personal/focus',           label: 'Focus',     icon: Sparkles },
  { href: '/workshop/personal/fc-balboa',       label: 'FC Balboa', icon: Trophy },
  { href: '/workshop/personal/life',            label: 'Life',      icon: Leaf },
]

function useRoles(): string[] {
  const { user } = useUser()
  const meta = user?.publicMetadata as Record<string, unknown> | undefined
  return (meta?.roles as string[]) ?? []
}

function hasAccess(roles: string[], section: 'pph' | 'hot-dog' | 'personal') {
  if (roles.length === 0) return true // fail-open for uninitialized users
  if (roles.includes('admin')) return true
  if (section === 'personal') return false // personal = admin only
  return roles.includes(section)
}

export default function WorkshopNav() {
  const pathname = usePathname()
  const roles = useRoles()

  const canPPH     = hasAccess(roles, 'pph')
  const canHotDog  = hasAccess(roles, 'hot-dog')
  const canPersonal = hasAccess(roles, 'personal')

  function linkClass(href: string, activeColor: string, baseColor: string) {
    const active = pathname === href || pathname?.startsWith(href + '/')
    return `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
      active ? `${activeColor} text-cream` : `text-midnight/50 hover:text-midnight hover:bg-sand`
    }`
  }

  const isKBActive = pathname?.startsWith('/workshop/kb')

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

          {/* PPH SECTION */}
          {canPPH && (
            <>
              <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />
              <span className={`text-xs font-bold uppercase tracking-wider px-2 flex-shrink-0 ${
                pathname?.startsWith('/workshop/pph') ? 'text-ocean' : 'text-midnight/30'
              }`}>
                <Building2 size={11} className="inline mr-1" />PPH
              </span>
              {pphLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className={linkClass(href, 'bg-ocean', 'text-ocean')}>
                  <Icon size={14} />
                  {label}
                </Link>
              ))}
            </>
          )}

          {/* HOT DOG SECTION */}
          {canHotDog && (
            <>
              <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />
              <span className={`text-xs font-bold uppercase tracking-wider px-2 flex-shrink-0 ${
                pathname?.startsWith('/workshop/operation-hot-dog') ? 'text-amber-500' : 'text-midnight/30'
              }`}>
                🌭
              </span>
              {hotDogLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className={linkClass(href, 'bg-amber-500', 'text-amber-500')}>
                  <Icon size={14} />
                  {label}
                </Link>
              ))}
            </>
          )}

          {/* PERSONAL SECTION */}
          {canPersonal && (
            <>
              <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />
              <span className={`text-xs font-bold uppercase tracking-wider px-2 flex-shrink-0 ${
                pathname?.startsWith('/workshop/personal') ? 'text-terracotta' : 'text-midnight/30'
              }`}>
                Personal
              </span>
              {personalLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className={linkClass(href, 'bg-terracotta', 'text-terracotta')}>
                  <Icon size={14} />
                  {label}
                </Link>
              ))}
            </>
          )}

          {/* KB */}
          <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />
          <Link
            href="/workshop/kb"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              isKBActive ? 'bg-ocean/10 text-ocean' : 'text-midnight/50 hover:text-midnight hover:bg-sand'
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
