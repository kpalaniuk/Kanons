'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, UserPlus, Check, Loader } from 'lucide-react'

interface ClientResult {
  id: string
  name: string
  stage: string
  phone: string | null
  primary_lo: string | null
  fico_score: number | null
  target_purchase_price: number | null
}

interface Props {
  value: string
  clientId: string | null
  onChange: (name: string, clientId: string | null) => void
  placeholder?: string
}

const STAGE_COLORS: Record<string, string> = {
  'New Lead': 'bg-slate-100 text-slate-600',
  'Pre-Approved': 'bg-blue-100 text-blue-700',
  'In Process': 'bg-amber-100 text-amber-700',
  'Funded': 'bg-emerald-100 text-emerald-700',
  'Closed': 'bg-gray-100 text-gray-500',
}

export function ClientSearchInput({ value, clientId, onChange, placeholder = 'Search or create client...' }: Props) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<ClientResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [linked, setLinked] = useState<ClientResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Search as user types
  const search = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 2) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/pph/clients/search?q=${encodeURIComponent(q)}`)
      if (res.ok) setResults(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 250)
  }, [query, search])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node) && !inputRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function selectClient(c: ClientResult) {
    setQuery(c.name)
    setLinked(c)
    setOpen(false)
    onChange(c.name, c.id)
  }

  async function createClient() {
    if (!query.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/pph/clients/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: query.trim() }),
      })
      if (res.ok) {
        const created = await res.json()
        setLinked(created)
        setOpen(false)
        onChange(created.name, created.id)
      }
    } finally {
      setCreating(false)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    setLinked(null)
    onChange(e.target.value, null)
    setOpen(true)
  }

  const exactMatch = results.some(r => r.name.toLowerCase() === query.trim().toLowerCase())
  const showCreate = query.trim().length >= 2 && !exactMatch && !linked

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 w-full bg-white border rounded-lg px-4 py-3 transition-colors ${
        linked ? 'border-emerald-400 ring-1 ring-emerald-200' : 'border-midnight/10 focus-within:border-ocean focus-within:ring-1 focus-within:ring-ocean'
      }`}>
        {linked
          ? <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          : <Search className="w-4 h-4 text-midnight/30 flex-shrink-0" />
        }
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if (query.length >= 2) setOpen(true) }}
          placeholder={placeholder}
          className="flex-1 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none bg-transparent"
        />
        {loading && <Loader className="w-3.5 h-3.5 text-midnight/30 animate-spin flex-shrink-0" />}
        {linked && (
          <button onClick={() => { setLinked(null); setQuery(''); onChange('', null) }}
            className="text-midnight/20 hover:text-midnight/50 text-xs flex-shrink-0">✕</button>
        )}
      </div>

      {/* Linked badge */}
      {linked && (
        <div className="mt-1.5 flex items-center gap-2 text-xs text-emerald-700">
          <span className="font-medium">✓ Linked to {linked.name}</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${STAGE_COLORS[linked.stage] || 'bg-gray-100 text-gray-500'}`}>{linked.stage}</span>
          <a href={`/workshop/pph/clients/${linked.id}`} target="_blank" rel="noopener noreferrer"
            className="text-ocean hover:underline">View profile ↗</a>
        </div>
      )}

      {/* Dropdown */}
      {open && query.trim().length >= 2 && (
        <div ref={dropdownRef} className="absolute z-50 top-full mt-1 w-full bg-white rounded-xl border border-midnight/10 shadow-lg overflow-hidden">
          {results.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[10px] text-midnight/40 uppercase tracking-wider font-medium border-b border-midnight/5">Existing clients</p>
              {results.map(c => (
                <button key={c.id} onClick={() => selectClient(c)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-midnight/3 transition-colors text-left border-b border-midnight/5 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-midnight">{c.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${STAGE_COLORS[c.stage] || 'bg-gray-100 text-gray-500'}`}>{c.stage}</span>
                      {c.fico_score && <span className="text-[10px] text-midnight/40">FICO {c.fico_score}</span>}
                      {c.target_purchase_price && <span className="text-[10px] text-midnight/40">${Math.round(c.target_purchase_price/1000)}k</span>}
                      {c.primary_lo && <span className="text-[10px] text-midnight/30">{c.primary_lo}</span>}
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-midnight/10" />
                </button>
              ))}
            </div>
          )}

          {showCreate && (
            <button onClick={createClient} disabled={creating}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-ocean/5 transition-colors text-left">
              <UserPlus className="w-4 h-4 text-ocean flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-ocean">
                  {creating ? 'Creating...' : `Create "${query.trim()}" as new client`}
                </p>
                <p className="text-[10px] text-midnight/40 mt-0.5">New Lead — you can fill in details from their profile</p>
              </div>
            </button>
          )}

          {results.length === 0 && !showCreate && (
            <p className="px-4 py-3 text-sm text-midnight/40 italic">Type a name to search...</p>
          )}
        </div>
      )}
    </div>
  )
}
