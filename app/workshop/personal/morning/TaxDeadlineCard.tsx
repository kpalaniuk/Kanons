'use client'

import { useEffect, useState } from 'react'

// Auto-shows within 30 days of Apr 15. Hides after Apr 15.
const TAX_DEADLINE = new Date('2026-04-15T00:00:00')
const SHOW_DAYS_OUT = 30

export default function TaxDeadlineCard() {
  const [mounted, setMounted] = useState(false)
  const [personalFiled, setPersonalFiled] = useState(false)
  const [extensionFiled, setExtensionFiled] = useState(false)
  const [ghFiled, setGhFiled] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('tax-deadline-2026')
      if (stored) {
        const data = JSON.parse(stored)
        setPersonalFiled(!!data.personalFiled)
        setExtensionFiled(!!data.extensionFiled)
        setGhFiled(!!data.ghFiled)
      }
    } catch {}
  }, [])

  const save = (update: { personalFiled?: boolean; extensionFiled?: boolean; ghFiled?: boolean }) => {
    try {
      const current = { personalFiled, extensionFiled, ghFiled, ...update }
      localStorage.setItem('tax-deadline-2026', JSON.stringify(current))
    } catch {}
  }

  const toggle = (key: 'personalFiled' | 'extensionFiled' | 'ghFiled') => {
    const updates = { personalFiled, extensionFiled, ghFiled }
    updates[key] = !updates[key]
    if (key === 'personalFiled') setPersonalFiled(updates.personalFiled)
    if (key === 'extensionFiled') setExtensionFiled(updates.extensionFiled)
    if (key === 'ghFiled') setGhFiled(updates.ghFiled)
    save(updates)
  }

  if (!mounted) return null

  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const msLeft = TAX_DEADLINE.getTime() - now.getTime()
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))

  // Hide if past deadline or more than SHOW_DAYS_OUT away
  if (daysLeft < 0 || daysLeft > SHOW_DAYS_OUT) return null

  // Hide if both personal + GH are filed
  if (personalFiled && ghFiled) return null

  const isVeryUrgent = daysLeft <= 3
  const isUrgent = daysLeft <= 7

  const bgCls = isVeryUrgent
    ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
    : isUrgent
    ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300'
    : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'

  const badgeCls = isVeryUrgent
    ? 'bg-red-100 text-red-700 border-red-200'
    : isUrgent
    ? 'bg-orange-100 text-orange-700 border-orange-200'
    : 'bg-amber-100 text-amber-700 border-amber-200'

  const accentCls = isVeryUrgent ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-amber-700'

  const deadlineLabel = daysLeft === 0 ? 'TODAY' : daysLeft === 1 ? '1 day left' : `${daysLeft} days left`

  return (
    <div className={`rounded-2xl border-2 overflow-hidden ${bgCls}`}>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-start gap-4 p-5 text-left"
        aria-expanded={expanded}
      >
        <div className="shrink-0 text-2xl leading-none mt-0.5">🧾</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold uppercase tracking-widest ${accentCls}`}>
              Tax Day 2026
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeCls} ${isVeryUrgent ? 'animate-pulse' : ''}`}>
              {deadlineLabel}
            </span>
          </div>
          <h3 className="font-display text-lg text-midnight mt-0.5">
            April 15 — Federal &amp; State Taxes Due
          </h3>
          <p className="text-sm text-midnight/50 mt-0.5 leading-snug">
            {extensionFiled
              ? 'Extension filed — Oct 15 deadline. Taxes still owed by Apr 15.'
              : 'Personal 1040 · Granada House Design LLC · CA 540'}
          </p>
        </div>

        <span className="text-midnight/25 text-sm shrink-0 mt-1">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-0">
          <div className="border-t border-midnight/10 pt-4 space-y-4">

            {/* Checklist */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-midnight/30 mb-3">
                Status
              </p>
              <ul className="space-y-2.5">
                {[
                  {
                    key: 'personalFiled' as const,
                    state: personalFiled,
                    label: 'Personal — 1040 filed (federal + CA 540)',
                    note: 'Includes self-employment income from GHL brokerage',
                  },
                  {
                    key: 'ghFiled' as const,
                    state: ghFiled,
                    label: 'Granada House Design LLC — Schedule C / K-1',
                    note: `EIN 33-3558892 · Paige's design LLC`,
                  },
                  {
                    key: 'extensionFiled' as const,
                    state: extensionFiled,
                    label: 'Extension filed (Form 4868) if needed',
                    note: 'Extension gives until Oct 15 — but tax owed is still due Apr 15',
                  },
                ].map(item => (
                  <li key={item.key}>
                    <label className="flex items-start gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={item.state}
                        onChange={() => toggle(item.key)}
                        className="mt-0.5 w-4 h-4 rounded accent-amber-500 cursor-pointer shrink-0"
                      />
                      <div>
                        <span className={`text-sm font-medium ${item.state ? 'line-through text-midnight/30' : 'text-midnight group-hover:text-midnight/80'}`}>
                          {item.label}
                        </span>
                        <p className="text-xs text-midnight/35 mt-0.5">{item.note}</p>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reminder */}
            <div className="bg-white/60 rounded-xl px-4 py-3 border border-midnight/10">
              <p className="text-xs font-semibold text-midnight/50 mb-1">📋 Quick reminders</p>
              <ul className="space-y-1 text-xs text-midnight/60">
                <li>• Travis Foster is your CPA — loop him in ASAP if not already</li>
                <li>• SE income: GHL brokerage commissions + any LO Buddy revenue</li>
                <li>• Deductions: home office, mortgage software/tools, coaching miles</li>
                <li>• If filing extension: <strong className="text-midnight/80">you still owe estimated taxes by Apr 15</strong></li>
                <li>• CA underpayment penalty kicks in if you owe &gt;$500 and miss Apr 15</li>
              </ul>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="https://www.irs.gov/filing/e-file-options"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border ${badgeCls} hover:opacity-80 transition-opacity`}
              >
                IRS e-File →
              </a>
              <a
                href="https://ftb.ca.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-midnight/10 bg-white/60 text-midnight/50 hover:opacity-80 transition-opacity"
              >
                CA FTB →
              </a>
              <span className="text-xs text-midnight/25">
                Deadline: Apr 15, 2026 · Auto-hides when filed
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
