'use client'

import { useState } from 'react'
import { Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

interface ScenarioDescribeInputProps {
  type: 'purchase' | 'refi'
  onParsed: (data: Record<string, unknown>) => void
}

const EXAMPLES = {
  purchase: [
    'Client has $90K saved, looking at $600-700K home in San Diego, FICO 740, monthly income $12K, existing debts $800/mo',
    'First-time buyer, $50K down, $450K max budget, FICO 680, income $7500/mo, no existing debt. FHA preferred.',
    'VA buyer, $0 down, looking $550K range, FICO 760, income $9K/mo, $300 car payment',
  ],
  refi: [
    'Client has $420K balance at 7.25%, current payment $2850, property worth $580K, wants to pull $30K cash out',
    'Refi from 6.875% to current rates. Balance $310K, home worth $490K, 22 years left, payment $2100/mo',
    'Rate-and-term refi only. Balance $275K at 7.5%, worth $400K, 300 months remaining, payment $1925',
  ],
}

export function ScenarioDescribeInput({ type, onParsed }: ScenarioDescribeInputProps) {
  const [open, setOpen] = useState(true)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleParse() {
    if (!description.trim()) return
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/scenarios/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, type }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Parse failed')

      onParsed(data.parsed)
      setSuccess(true)
      setTimeout(() => setOpen(false), 1200)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-ocean/5 border border-ocean/20 rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-ocean/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-ocean" />
          <span className="font-semibold text-midnight">Describe the scenario</span>
          <span className="text-xs text-midnight/40 hidden sm:block">— type it out and I'll fill the form</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-midnight/40" /> : <ChevronDown className="w-4 h-4 text-midnight/40" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`Describe the client's situation in plain English...\n\ne.g. "${EXAMPLES[type][0]}"`}
            rows={3}
            className="w-full px-4 py-3 bg-white border-2 border-midnight/10 rounded-xl focus:border-ocean focus:outline-none resize-none text-sm placeholder:text-midnight/30"
          />

          {/* Quick examples */}
          <div className="flex flex-wrap gap-2">
            {EXAMPLES[type].map((ex, i) => (
              <button
                key={i}
                onClick={() => setDescription(ex)}
                className="text-xs px-3 py-1.5 bg-white border border-midnight/10 rounded-full text-midnight/60 hover:border-ocean hover:text-ocean transition-colors truncate max-w-[220px]"
              >
                {ex.substring(0, 40)}…
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleParse}
              disabled={!description.trim() || loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-ocean text-cream rounded-xl font-medium hover:bg-midnight transition-colors disabled:opacity-40 text-sm"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Parsing...</>
                : <><Sparkles className="w-4 h-4" />Fill Form</>
              }
            </button>

            {success && (
              <span className="text-sm text-green-600 font-medium">✓ Form filled — review and adjust below</span>
            )}
            {error && (
              <span className="text-sm text-red-500">{error}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
