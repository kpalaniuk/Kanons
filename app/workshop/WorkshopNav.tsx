'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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
  ChevronDown
} from 'lucide-react'

const workLinks = [
  { href: '/workshop/work/pipeline', label: 'Pipeline', icon: ClipboardList },
  { href: '/workshop/work/scenarios', label: 'Scenarios', icon: Target },
  { href: '/workshop/work/dscr-calculator', label: 'DSCR', icon: Calculator },
  { href: '/workshop/work/refi-builder', label: 'Refi', icon: Building2 },
  { href: '/workshop/work/purchase-builder', label: 'Purchase', icon: Home },
]

const personalLinks = [
  { href: '/workshop/personal/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/workshop/personal/adu', label: 'ADU', icon: House },
  { href: '/workshop/personal/usage', label: 'Usage', icon: BarChart3 },
  { href: '/workshop/personal/events', label: 'Events', icon: DollarSign },
  { href: '/workshop/personal/lyrics', label: 'Lyrics', icon: Music },
]

export default function WorkshopNav() {
  const pathname = usePathname()
  const [workOpen, setWorkOpen] = useState(false)
  const [personalOpen, setPersonalOpen] = useState(false)

  const isWorkActive = pathname?.startsWith('/workshop/work')
  const isPersonalActive = pathname?.startsWith('/workshop/personal')

  return (
    <div className="bg-cream border-b border-midnight/10">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center gap-4 overflow-x-auto py-2">
          {/* Home Link */}
          <Link
            href="/workshop"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              pathname === '/workshop'
                ? 'bg-midnight text-cream'
                : 'text-midnight/60 hover:text-midnight hover:bg-sand'
            }`}
          >
            <LayoutDashboard size={16} />
            Workshop
          </Link>
          
          <div className="h-6 w-px bg-midnight/10" />
          
          {/* WORK Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setWorkOpen(true)}
            onMouseLeave={() => setWorkOpen(false)}
          >
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isWorkActive
                  ? 'bg-ocean text-cream'
                  : 'text-midnight/60 hover:text-midnight hover:bg-sand'
              }`}
            >
              <span className="font-semibold">WORK</span>
              <ChevronDown size={14} className={`transition-transform ${workOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Desktop Dropdown */}
            <div 
              className={`hidden md:block absolute top-full left-0 mt-1 bg-cream rounded-lg shadow-lg border border-midnight/10 overflow-hidden transition-all duration-200 ${
                workOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              style={{ minWidth: '200px' }}
            >
              {workLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-ocean text-cream'
                        : 'text-midnight/70 hover:bg-sand hover:text-midnight'
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Mobile WORK Links */}
          <div className="flex md:hidden items-center gap-1">
            {workLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
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
                  <Icon size={16} />
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="h-6 w-px bg-midnight/10" />
          
          {/* PERSONAL Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setPersonalOpen(true)}
            onMouseLeave={() => setPersonalOpen(false)}
          >
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isPersonalActive
                  ? 'bg-terracotta text-cream'
                  : 'text-midnight/60 hover:text-midnight hover:bg-sand'
              }`}
            >
              <span className="font-semibold">PERSONAL</span>
              <ChevronDown size={14} className={`transition-transform ${personalOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Desktop Dropdown */}
            <div 
              className={`hidden md:block absolute top-full left-0 mt-1 bg-cream rounded-lg shadow-lg border border-midnight/10 overflow-hidden transition-all duration-200 ${
                personalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              style={{ minWidth: '200px' }}
            >
              {personalLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-terracotta text-cream'
                        : 'text-midnight/70 hover:bg-sand hover:text-midnight'
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Mobile PERSONAL Links */}
          <div className="flex md:hidden items-center gap-1">
            {personalLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
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
                  <Icon size={16} />
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
