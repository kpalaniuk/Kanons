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
  Activity,
  ChevronRight,
  Box,
  Calculator,
  Briefcase,
} from 'lucide-react'

const workLinks = [
  { href: '/workshop/work/pipeline',         label: 'Pipeline',       icon: ClipboardList },
  { href: '/workshop/work/income-qualifier', label: 'Income Check',   icon: Calculator },
  { href: '/workshop/work/dscr-calculator',  label: 'DSCR',           icon: Calculator },
  { href: '/workshop/work/purchase-builder', label: 'Purchase',       icon: Briefcase },
  { href: '/workshop/work/refi-builder',     label: 'Refi',           icon: Briefcase },
  { href: '/workshop/work/scenarios',        label: 'Scenarios',      icon: Briefcase },
]

const pphLinks = [
  { href: '/workshop/pph/pipeline', label: 'Pipeline', icon: ClipboardList },
  { href: '/workshop/pph/tools',    label: 'Tools',    icon: Wrench },
  { href: '/workshop/pph/clients',  label: 'Clients',  icon: Users },
]

const hotDogLinks = [
  { href: '/workshop/operation-hot-dog',                  label: 'Hotclaw',      icon: Zap },
  { href: '/workshop/operation-hot-dog/meeting',          label: 'Mar 3 Brief',  icon: Inbox },
  { href: '/workshop/operation-hot-dog/setup',            label: 'Setup Guide',  icon: BookOpen },
  { href: '/workshop/operation-hot-dog/how-it-works',     label: 'How It Works', icon: BookOpen },
]

const loBuddyLinks = [
  { href: '/workshop/lo-buddy',           label: 'Control Center', icon: LayoutDashboard },
  { href: '/workshop/lo-buddy/character', label: 'Character',      icon: Sparkles },
]

const personalLinks = [
  { href: '/workshop/personal/journal',        label: 'Journal',    icon: NotebookPen },
  { href: '/workshop/personal/tasks',          label: 'Tasks',      icon: CheckSquare },
  { href: '/workshop/personal/music',          label: 'Music',      icon: Music },
  { href: '/workshop/personal/strongnome',     label: 'StronGnome', icon: Disc },
  { href: '/workshop/personal/trip-july-2026', label: 'July Trip',  icon: Map },
  { href: '/workshop/personal/focus',          label: 'Focus',      icon: Sparkles },
  { href: '/workshop/personal/fc-balboa',      label: 'FC Balboa',  icon: Trophy },
  { href: '/workshop/personal/life',           label: 'Life',       icon: Leaf },
  { href: '/workshop/personal/jasper-health',  label: 'Jasper ♥',   icon: Activity },
]

function useRoles(): string[] {
  const { user } = useUser()
  const meta = user?.publicMetadata as Record<string, unknown> | undefined
  return (meta?.roles as string[]) ?? []
}

function hasAccess(roles: string[], section: 'pph' | 'hotclaw' | 'personal' | 'lo-buddy' | 'work') {
  if (roles.length === 0) return true
  if (roles.includes('admin')) return true
  if (section === 'personal') return false
  if (section === 'lo-buddy') return roles.includes('hotclaw') || roles.includes('pph')
  if (section === 'work') return roles.includes('pph') || roles.includes('hotclaw')
  return roles.includes(section)
}

export default function WorkshopNav() {
  const pathname = usePathname()
  const roles = useRoles()

  const canPPH      = hasAccess(roles, 'pph')
  const canHotDog   = hasAccess(roles, 'hotclaw')
  const canLOBuddy  = hasAccess(roles, 'lo-buddy')
  const canPersonal = hasAccess(roles, 'personal')
  const canWork     = hasAccess(roles, 'work')

  const inPPH      = pathname?.startsWith('/workshop/pph')
  const inHotDog   = pathname?.startsWith('/workshop/operation-hot-dog')
  const inLOBuddy  = pathname?.startsWith('/workshop/lo-buddy')
  const inPersonal = pathname?.startsWith('/workshop/personal')
  const inKB       = pathname?.startsWith('/workshop/kb')
  const inWork     = pathname?.startsWith('/workshop/work')

  // Active sub-links
  let subLinks: { href: string; label: string; icon: React.ElementType }[] = []
  if (inWork && canWork)          subLinks = workLinks
  else if (inPPH && canPPH)      subLinks = pphLinks
  else if (inHotDog && canHotDog) subLinks = hotDogLinks
  else if (inLOBuddy && canLOBuddy) subLinks = loBuddyLinks
  else if (inPersonal && canPersonal) subLinks = personalLinks

  function sectionClass(active: boolean, color: string) {
    return `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
      active ? `bg-midnight/10 text-midnight border border-midnight/20` : 'text-midnight/50 hover:text-midnight hover:bg-sand'
    }`
  }

  function subLinkClass(href: string, activeColor: string) {
    const active = pathname === href || pathname?.startsWith(href + '/')
    return `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
      active ? `bg-midnight/10 text-midnight border border-midnight/20` : 'text-midnight/50 hover:text-midnight hover:bg-sand'
    }`
  }

  return (
    <div className="bg-cream border-b border-midnight/10 sticky top-16 z-30">
      {/* TOP BAR — section tabs */}
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">

          {/* Home */}
          <Link
            href="/workshop"
            className={sectionClass(pathname === '/workshop', 'bg-midnight')}
          >
            <LayoutDashboard size={14} />
            Home
          </Link>

          {/* PPH */}
          {canPPH && (
            <>
              <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />
              <Link href="/workshop/pph/pipeline" className={sectionClass(!!inPPH, 'bg-ocean')}>
                <Building2 size={14} />
                PPH
                {inPPH && <ChevronRight size={12} className="opacity-60" />}
              </Link>
            </>
          )}

          {/* Hotclaw */}
          {canHotDog && (
            <>
              <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />
              <Link href="/workshop/operation-hot-dog" className={sectionClass(!!inHotDog, 'bg-amber-500')}>
                <Zap size={14} />
                Hotclaw
                {inHotDog && <ChevronRight size={12} className="opacity-60" />}
              </Link>
            </>
          )}

          {/* LO Buddy */}
          {canLOBuddy && (
            <>
              <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />
              <Link href="/workshop/lo-buddy" className={sectionClass(!!inLOBuddy, 'bg-cyan-600')}>
                <Sparkles size={14} />
                LO Buddy
                {inLOBuddy && <ChevronRight size={12} className="opacity-60" />}
              </Link>
            </>
          )}

          {/* Personal */}
          {canPersonal && (
            <>
              <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />
              <Link href="/workshop/personal/journal" className={sectionClass(!!inPersonal, 'bg-terracotta')}>
                <Leaf size={14} />
                Personal
                {inPersonal && <ChevronRight size={12} className="opacity-60" />}
              </Link>
            </>
          )}

          {/* Work Tools */}
          {canWork && (
            <>
              <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />
              <Link href="/workshop/work/pipeline" className={sectionClass(!!inWork, 'bg-ocean')}>
                <Briefcase size={14} />
                Work
                {inWork && <ChevronRight size={12} className="opacity-60" />}
              </Link>
            </>
          )}

          {/* RoomForge */}
          <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />
          <Link
            href="/workshop/work/roomforge"
            className={sectionClass(!!pathname?.startsWith('/workshop/work/roomforge'), 'bg-amber-700')}
          >
            <Box size={14} />
            RoomForge
          </Link>

          {/* KB */}
          <div className="h-5 w-px bg-midnight/10 mx-1 flex-shrink-0" />
          <Link
            href="/workshop/kb"
            className={sectionClass(!!inKB, 'bg-ocean/80')}
          >
            <BookOpen size={14} />
            KB
          </Link>

        </nav>
      </div>

      {/* SUB-NAV — only shows when inside a section */}
      {subLinks.length > 0 && (
        <div className="border-t border-midnight/5 bg-sand/40">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center gap-1 py-1.5 overflow-x-auto scrollbar-hide">
              {subLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={subLinkClass(
                    href,
                    inWork ? 'bg-ocean' : inPPH ? 'bg-ocean' : inHotDog ? 'bg-amber-500' : inLOBuddy ? 'bg-cyan-600' : 'bg-terracotta'
                  )}
                >
                  <Icon size={13} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
