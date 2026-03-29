'use client'

import { useState, useEffect } from 'react'

const CHECKLIST_KEY = 'cabo-welcome-back-2026'

const RESET_ITEMS = [
  { id: 'unpack', label: 'Unpack + laundry' },
  { id: 'pipeline', label: 'Check mortgage pipeline follow-ups' },
  { id: 'groceries', label: 'Restock groceries' },
  { id: 'school', label: 'Kids back to school schedule confirmed' },
]

export default function WelcomeBackCard() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  // Only show Apr 7–14, 2026
  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const showFrom = new Date('2026-04-07T00:00:00')
  const showUntil = new Date('2026-04-15T00:00:00') // hide Apr 15+
  if (today < showFrom || today >= showUntil) return null

  const homeDate = new Date('2026-04-06T00:00:00')
  const daysHome = Math.max(1, Math.floor((today.getTime() - homeDate.getTime()) / (1000 * 60 * 60 * 24)))

  const parentsDate = new Date('2026-04-22T00:00:00')
  const daysToParents = Math.ceil((parentsDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHECKLIST_KEY)
      if (raw) setChecked(JSON.parse(raw))
    } catch {}
  }, [])

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next)) } catch {}
  }

  const checkedCount = RESET_ITEMS.filter(i => checked[i.id]).length
  const allDone = checkedCount === RESET_ITEMS.length

  return (
    <div
      className="rounded-2xl border-2 p-5 transition-all"
      style={{
        background: allDone
          ? 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)'
          : '#f8f7f4',
        borderColor: allDone ? '#66bb6a' : '#0066FF',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌴</span>
          <h3 className="text-base font-bold text-midnight">Welcome back from Cabo!</h3>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-semibold border shrink-0"
          style={{ background: '#e8f0ff', color: '#0066FF', borderColor: '#b3ceff' }}
        >
          {checkedCount}/{RESET_ITEMS.length} done
        </span>
      </div>

      {/* Sub-header */}
      <p className="text-sm mb-4 ml-9" style={{ color: '#0066FF' }}>
        You've been home{' '}
        <strong>{daysHome} {daysHome === 1 ? 'day' : 'days'}</strong>
        {' '}— time to reset.
      </p>

      {/* All-done celebration */}
      {allDone ? (
        <div
          className="rounded-xl px-4 py-3 text-center border mb-4"
          style={{ background: '#e8f5e9', borderColor: '#66bb6a' }}
        >
          <p className="text-sm font-bold text-green-700">You're fully reset! 🙌</p>
          <p className="text-xs text-green-600 mt-0.5">Back in the groove. Cabo was well-earned.</p>
        </div>
      ) : (
        /* Checklist */
        <ul className="space-y-2 mb-4 ml-1">
          {RESET_ITEMS.map(item => (
            <li key={item.id}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={!!checked[item.id]}
                  onChange={() => toggle(item.id)}
                  className="w-4 h-4 rounded cursor-pointer shrink-0"
                  style={{ accentColor: '#0066FF' }}
                />
                <span
                  className={`text-sm transition-colors ${
                    checked[item.id]
                      ? 'line-through text-midnight/30'
                      : 'text-midnight/80 group-hover:text-midnight'
                  }`}
                >
                  {item.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {/* Parents visit reminder */}
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2.5 border"
        style={{ background: '#fff8e1', borderColor: '#ffe082' }}
      >
        <span className="text-base shrink-0">🏡</span>
        <p className="text-xs text-amber-800 flex-1">
          <strong>Parents visit</strong> in{' '}
          <strong
            style={{ color: daysToParents <= 7 ? '#e53935' : '#f57c00' }}
          >
            ~{daysToParents} {daysToParents === 1 ? 'day' : 'days'}
          </strong>{' '}
          (Apr 22)
        </p>
        <span className="text-[10px] text-amber-600 font-medium shrink-0">AS 3421 · 7:34pm</span>
      </div>
    </div>
  )
}
