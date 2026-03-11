'use client'

import { useMemo, useState, useEffect, useRef } from 'react'

const PAGE_KEY = 'jh-domenech'

// ── Fixed assumptions ─────────────────────────────────────────────
const JEFFREY_INCOME  = 8254      // $/mo W2, fixed
const MONTHLY_DEBTS   = 140       // $/mo liabilities
const TAX_RATE        = 0.012     // 1.2% annually
const SD_CONFORMING   = 1006250   // 2026 SD County high-cost limit
const RATE_CONFORMING = 6.0
const RATE_JUMBO      = 6.5

function fmt(n: number) { return '$' + Math.round(n).toLocaleString() }
function fmtPct(n: number) { return n.toFixed(1) + '%' }

// ── Closing costs calculator ──────────────────────────────────────
function calcClosingCosts(purchasePrice: number, loan: number, insurance: number) {
  // Lender fees
  const originationFee   = 0            // broker, no lender origination
  const appraisal        = 750
  const creditReport     = 65
  const floodCert        = 12
  const taxService       = 75
  const lenderFees       = originationFee + appraisal + creditReport + floodCert + taxService

  // Title & escrow (SD County)
  const titleLender      = Math.round(loan * 0.001 + 500)          // ~0.1% + base
  const titleOwner       = Math.round(purchasePrice * 0.00225)     // ~0.225% of price
  const escrowFee        = Math.round(purchasePrice * 0.001 + 500) // ~0.1% + $500
  const notary           = 200
  const recording        = 175
  const titleEscrow      = titleLender + titleOwner + escrowFee + notary + recording

  // Transfer tax — SD County $1.10/$1,000 (buyer pays in SD City)
  const transferTax      = Math.round(purchasePrice / 1000 * 1.10)

  // Prepaids
  const hoiPrepaid       = insurance * 12   // 1 year upfront
  const taxReserve       = Math.round((purchasePrice * 0.012 / 12) * 3)  // 3 months
  const perDiemInterest  = 0 // variable, shown as TBD
  const prepaids         = hoiPrepaid + taxReserve

  const totalCC = lenderFees + titleEscrow + transferTax + prepaids

  return {
    sections: [
      {
        label: 'Lender Fees',
        items: [
          { label: 'Origination Fee', amount: originationFee, note: 'Broker — waived' },
          { label: 'Appraisal', amount: appraisal },
          { label: 'Credit Report', amount: creditReport },
          { label: 'Flood Cert', amount: floodCert },
          { label: 'Tax Service', amount: taxService },
        ],
        total: lenderFees,
      },
      {
        label: 'Title & Escrow',
        items: [
          { label: "Lender's Title Insurance", amount: titleLender },
          { label: "Owner's Title Insurance", amount: titleOwner },
          { label: 'Escrow / Settlement Fee', amount: escrowFee },
          { label: 'Notary', amount: notary },
          { label: 'Recording Fees', amount: recording },
        ],
        total: titleEscrow,
      },
      {
        label: 'Transfer Tax',
        items: [
          { label: 'SD County Transfer Tax ($1.10/$1k)', amount: transferTax },
        ],
        total: transferTax,
      },
      {
        label: 'Prepaids & Reserves',
        items: [
          { label: 'Homeowner\'s Insurance (12 mo)', amount: hoiPrepaid },
          { label: 'Property Tax Reserve (3 mo)', amount: taxReserve },
          { label: 'Per Diem Interest (~15 days)', amount: perDiemInterest, note: 'Varies by close date' },
        ],
        total: prepaids,
      },
    ],
    totalCC,
  }
}

function calcPI(loan: number, annualRate: number, termYears = 30) {
  const r = annualRate / 100 / 12
  const n = termYears * 12
  if (r === 0) return loan / n
  return loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function Slider({ label, value, min, max, step, format, onChange, color = 'blue' }: {
  label: string; value: number; min: number; max: number; step: number
  format: (v: number) => string; onChange: (v: number) => void; color?: string
}) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
  const accent = color === 'amber' ? '#FFBA00' : '#0066FF'
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-[#0a0a0a]/60">{label}</label>
        <span className="text-sm font-bold" style={{ color: accent }}>{format(value)}</span>
      </div>
      <div className="relative h-2 bg-[#0a0a0a]/10 rounded-full">
        <div className="absolute left-0 top-0 h-2 rounded-full" style={{ width: `${pct}%`, background: accent }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2" />
        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)`, background: accent }} />
      </div>
      <div className="flex justify-between text-[10px] text-[#0a0a0a]/30">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  )
}

interface SnapshotEntry {
  id: string
  data: { hannahIncome: number; purchasePrice: number; downPct: number; insurance: number; total: number; backDTI: number }
  note: string
  at: string
}

export default function JHInteractiveScenario() {
  const [hannahIncome,  setHannahIncome]  = useState(1871)
  const [purchasePrice, setPurchasePrice] = useState(1350000)
  const [downPct,       setDownPct]       = useState(60)
  const [insurance,     setInsurance]     = useState(150)
  const [sellerCredit,  setSellerCredit]  = useState(0)
  const [ccOpen,        setCcOpen]        = useState(false)

  // View / snapshot state
  const [viewCount,   setViewCount]   = useState<number | null>(null)
  const [lastViewed,  setLastViewed]  = useState<string | null>(null)
  const [snapshots,   setSnapshots]   = useState<SnapshotEntry[]>([])
  const [showSnap,    setShowSnap]    = useState(false)
  const [snapNote,    setSnapNote]    = useState('')
  const [snapSaving,  setSnapSaving]  = useState(false)
  const [snapSaved,   setSnapSaved]   = useState(false)
  const [copied,      setCopied]      = useState(false)
  const viewFired = useRef(false)

  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://kyle.palaniuk.net/clients/interactive/jh-domenech'

  // Fire view event once on load
  useEffect(() => {
    if (viewFired.current) return
    viewFired.current = true
    fetch('/api/scenario-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageKey: PAGE_KEY, type: 'view', data: {} }),
    }).then(() => loadEvents())
  }, [])

  function loadEvents() {
    fetch(`/api/scenario-events?pageKey=${PAGE_KEY}`)
      .then(r => r.json())
      .then(d => {
        setViewCount(d.viewCount)
        setLastViewed(d.lastViewed)
        setSnapshots(d.snapshots || [])
      })
  }

  const calc = useMemo(() => {
    const downAmt   = Math.round(purchasePrice * downPct / 100)
    const loan      = purchasePrice - downAmt
    const rate      = loan > SD_CONFORMING ? RATE_JUMBO : RATE_CONFORMING
    const isJumbo   = loan > SD_CONFORMING
    const pi        = calcPI(loan, rate)
    const taxMo     = (purchasePrice * TAX_RATE) / 12
    const total     = pi + taxMo + insurance
    const combined  = JEFFREY_INCOME + hannahIncome
    const frontDTI  = (total / combined) * 100
    const backDTI   = ((total + MONTHLY_DEBTS) / combined) * 100
    const ltv       = (loan / purchasePrice) * 100
    const cc        = calcClosingCosts(purchasePrice, loan, insurance)
    const netCC     = Math.max(0, cc.totalCC - sellerCredit)
    const totalFunds = downAmt + netCC
    let status: 'strong' | 'caution' | 'tight' | 'over'
    if (backDTI <= 43)      status = 'strong'
    else if (backDTI <= 45) status = 'caution'
    else if (backDTI <= 50) status = 'tight'
    else                    status = 'over'
    return { downAmt, loan, rate, isJumbo, pi, taxMo, total, combined, frontDTI, backDTI, ltv, status, cc, netCC, totalFunds }
  }, [hannahIncome, purchasePrice, downPct, insurance, sellerCredit])

  async function saveSnapshot() {
    setSnapSaving(true)
    await fetch('/api/scenario-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageKey: PAGE_KEY, type: 'snapshot',
        data: { hannahIncome, purchasePrice, downPct, insurance, sellerCredit, total: calc.total, backDTI: calc.backDTI, totalFunds: calc.totalFunds },
        note: snapNote,
      }),
    })
    setSnapSaving(false)
    setSnapSaved(true)
    setShowSnap(false)
    setSnapNote('')
    loadEvents()
    setTimeout(() => setSnapSaved(false), 4000)
  }

  function copyLink() {
    navigator.clipboard.writeText(pageUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statusConfig = {
    strong:  { label: '✅ Strong qualifier',   bg: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    caution: { label: '⚠️ Borderline',          bg: 'bg-amber-50 border-amber-200 text-amber-700' },
    tight:   { label: '⚡ Tight — needs AUS',   bg: 'bg-orange-50 border-orange-200 text-orange-700' },
    over:    { label: '❌ Over DTI limit',       bg: 'bg-red-50 border-red-200 text-red-700' },
  }[calc.status]

  return (
    <div className="min-h-screen bg-[#f8f7f4] py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-[#0066FF] uppercase tracking-wider mb-1">Interactive Purchase Scenario</p>
            <h1 className="text-2xl font-bold text-[#0a0a0a]">Jeffrey & Hannah Domenech</h1>
            <p className="text-sm text-[#0a0a0a]/50 mt-0.5">Prepared by Kyle Palaniuk · NMLS 984138</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button onClick={copyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#0a0a0a]/10 rounded-lg text-xs font-medium text-[#0a0a0a]/60 hover:border-[#0066FF]/40 hover:text-[#0066FF] transition-all shadow-sm">
              {copied ? '✓ Copied!' : '🔗 Copy Link'}
            </button>
            {viewCount !== null && (
              <p className="text-[10px] text-[#0a0a0a]/30 text-right">
                {viewCount} view{viewCount !== 1 ? 's' : ''}
                {lastViewed && <span> · last {new Date(lastViewed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
              </p>
            )}
          </div>
        </div>

        {/* PITIA Result */}
        <div className="bg-[#0a0a0a] text-[#f8f7f4] rounded-2xl p-6 shadow-lg">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Monthly Payment (PITIA)</p>
              <p className="text-4xl font-bold">{fmt(calc.total)}<span className="text-lg text-white/40">/mo</span></p>
            </div>
            <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${statusConfig.bg}`}>
              {statusConfig.label}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-sm">
            <div><p className="text-xs text-white/40 mb-0.5">Principal & Interest</p><p className="font-semibold">{fmt(calc.pi)}</p></div>
            <div><p className="text-xs text-white/40 mb-0.5">Property Tax</p><p className="font-semibold">{fmt(calc.taxMo)}/mo</p></div>
            <div><p className="text-xs text-white/40 mb-0.5">Insurance</p><p className="font-semibold">{fmt(insurance)}/mo</p></div>
            <div><p className="text-xs text-white/40 mb-0.5">Loan Amount</p><p className="font-semibold">{fmt(calc.loan)}</p></div>
            <div><p className="text-xs text-white/40 mb-0.5">Rate</p><p className="font-semibold">{calc.rate}% {calc.isJumbo ? <span className="text-[10px] text-amber-400">JUMBO</span> : <span className="text-[10px] text-emerald-400">CONFORMING</span>}</p></div>
            <div><p className="text-xs text-white/40 mb-0.5">LTV / Equity</p><p className="font-semibold">{fmtPct(calc.ltv)} / {fmt(calc.downAmt)}</p></div>
          </div>
        </div>

        {/* DTI */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Front-End DTI', value: calc.frontDTI, note: 'PITIA ÷ income', limit: 45 },
            { label: 'Back-End DTI',  value: calc.backDTI,  note: `+ ${fmt(MONTHLY_DEBTS)}/mo debts`, limit: 50 },
          ].map(({ label, value, note, limit }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-[#0a0a0a]/5">
              <p className="text-xs text-[#0a0a0a]/40 mb-0.5">{label}</p>
              <p className={`text-2xl font-bold ${value > limit ? 'text-red-500' : value > limit * 0.9 ? 'text-amber-500' : 'text-emerald-600'}`}>
                {fmtPct(value)}
              </p>
              <p className="text-xs text-[#0a0a0a]/30 mt-0.5">{note} · limit {limit}%</p>
              <div className="mt-2 h-1.5 bg-[#0a0a0a]/8 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${value > limit ? 'bg-red-400' : value > limit * 0.9 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                  style={{ width: `${Math.min(value / limit * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Sliders */}
        <div className="bg-white rounded-2xl p-6 border border-[#0a0a0a]/5 space-y-6">
          <h2 className="text-sm font-semibold text-[#0a0a0a]">Adjust the Scenario</h2>
          <Slider label="Hannah's Monthly Income" value={hannahIncome} min={1250} max={6000} step={50}
            format={v => `${fmt(v)}/mo`} onChange={setHannahIncome} color="amber" />
          <Slider label="Purchase Price" value={purchasePrice} min={900000} max={1600000} step={10000}
            format={v => fmt(v)} onChange={setPurchasePrice} />
          <Slider label="Down Payment" value={downPct} min={20} max={65} step={1}
            format={v => `${v}% (${fmt(purchasePrice * v / 100)})`} onChange={setDownPct} />
          <Slider label="Monthly Insurance" value={insurance} min={100} max={500} step={10}
            format={v => `${fmt(v)}/mo`} onChange={setInsurance} />

          {/* Save Snapshot */}
          <div className="pt-2 border-t border-[#0a0a0a]/8">
            {!showSnap && !snapSaved && (
              <button onClick={() => setShowSnap(true)}
                className="w-full py-2.5 rounded-xl bg-[#0066FF] text-white text-sm font-semibold hover:bg-[#0066FF]/90 transition-colors">
                📌 Save This Scenario
              </button>
            )}
            {snapSaved && (
              <div className="text-center py-2.5 text-emerald-600 text-sm font-semibold">
                ✅ Saved! Kyle will see your snapshot.
              </div>
            )}
            {showSnap && (
              <div className="space-y-3">
                <p className="text-xs font-medium text-[#0a0a0a]/60">Leave a note for Kyle <span className="text-[#0a0a0a]/30">(optional)</span></p>
                <textarea
                  value={snapNote}
                  onChange={e => setSnapNote(e.target.value)}
                  placeholder="e.g. We like this one — comfortable if Hannah qualifies at $2,500/mo. Want to know if we can lock this rate."
                  rows={3}
                  className="w-full px-3 py-2 border border-[#0a0a0a]/10 rounded-xl text-sm focus:outline-none focus:border-[#0066FF]/50 resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={saveSnapshot} disabled={snapSaving}
                    className="flex-1 py-2 rounded-xl bg-[#0066FF] text-white text-sm font-semibold hover:bg-[#0066FF]/90 disabled:opacity-50 transition-colors">
                    {snapSaving ? 'Saving…' : 'Send to Kyle'}
                  </button>
                  <button onClick={() => { setShowSnap(false); setSnapNote('') }}
                    className="px-4 py-2 rounded-xl text-sm text-[#0a0a0a]/40 hover:text-[#0a0a0a] transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Saved Snapshots (client-visible confirmation) */}
        {snapshots.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-[#0a0a0a]/5">
            <h2 className="text-sm font-semibold text-[#0a0a0a] mb-3">Your Saved Scenarios</h2>
            <div className="space-y-3">
              {snapshots.map((s, i) => (
                <div key={s.id} className="bg-[#f8f7f4] rounded-xl p-3 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-[#0a0a0a]/60">Snapshot #{snapshots.length - i}</span>
                    <span className="text-[#0a0a0a]/30">{new Date(s.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[#0a0a0a]/60 mb-1.5">
                    <span>Price: <strong>{fmt(s.data.purchasePrice)}</strong></span>
                    <span>Down: <strong>{s.data.downPct}%</strong></span>
                    <span>Hannah income: <strong>{fmt(s.data.hannahIncome)}/mo</strong></span>
                    <span>PITIA: <strong>{fmt(s.data.total)}/mo</strong></span>
                    <span>DTI: <strong>{s.data.backDTI.toFixed(1)}%</strong></span>
                  </div>
                  {s.note && <p className="text-[#0a0a0a]/70 italic">"{s.note}"</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Closing Costs */}
        <div className="bg-white rounded-2xl border border-[#0a0a0a]/5 overflow-hidden">
          {/* Summary row — always visible */}
          <button onClick={() => setCcOpen(o => !o)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#0a0a0a]/2 transition-colors">
            <div className="text-left">
              <p className="text-sm font-semibold text-[#0a0a0a]">Closing Costs & Funds to Close</p>
              <p className="text-xs text-[#0a0a0a]/40 mt-0.5">
                Est. closing costs: <strong className="text-[#0a0a0a]">{fmt(calc.cc.totalCC)}</strong>
                {sellerCredit > 0 && <span className="text-emerald-600"> − {fmt(sellerCredit)} seller credit = <strong>{fmt(calc.netCC)}</strong></span>}
                &nbsp;·&nbsp;Total funds to close: <strong className="text-[#0a0a0a]">{fmt(calc.totalFunds)}</strong>
              </p>
            </div>
            <span className="text-[#0a0a0a]/30 text-sm ml-4">{ccOpen ? '▲' : '▼'}</span>
          </button>

          {ccOpen && (
            <div className="border-t border-[#0a0a0a]/8 px-5 pb-5 pt-4 space-y-5">

              {/* Line-item table */}
              {calc.cc.sections.map(section => (
                <div key={section.label}>
                  <p className="text-xs font-semibold text-[#0a0a0a]/40 uppercase tracking-wider mb-2">{section.label}</p>
                  <div className="space-y-1">
                    {section.items.map(item => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="text-[#0a0a0a]/60">
                          {item.label}
                          {item.note && <span className="text-[10px] text-[#0a0a0a]/30 ml-1.5">({item.note})</span>}
                        </span>
                        <span className={`font-medium tabular-nums ${item.amount === 0 ? 'text-emerald-500' : 'text-[#0a0a0a]'}`}>
                          {item.amount === 0 ? '—' : fmt(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 pt-2 border-t border-[#0a0a0a]/6 text-sm font-semibold">
                    <span className="text-[#0a0a0a]/50">{section.label} subtotal</span>
                    <span>{fmt(section.total)}</span>
                  </div>
                </div>
              ))}

              {/* Seller credit slider */}
              <div className="pt-2 border-t border-[#0a0a0a]/8">
                <Slider
                  label="Seller Credit (offsets closing costs)"
                  value={sellerCredit}
                  min={0}
                  max={Math.min(calc.cc.totalCC, purchasePrice * 0.03)}
                  step={500}
                  format={v => v === 0 ? 'None' : fmt(v)}
                  onChange={setSellerCredit}
                  color="amber"
                />
                <p className="text-[10px] text-[#0a0a0a]/30 mt-1">Conventional max seller concession: 3% of purchase price at &gt;10% down</p>
              </div>

              {/* Funds to close summary */}
              <div className="bg-[#f8f7f4] rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-[#0a0a0a]/50 uppercase tracking-wider mb-3">Total Funds to Close</p>
                <div className="flex justify-between text-sm">
                  <span className="text-[#0a0a0a]/60">Down Payment ({downPct}%)</span>
                  <span className="font-medium">{fmt(calc.downAmt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#0a0a0a]/60">Closing Costs (est.)</span>
                  <span className="font-medium">{fmt(calc.cc.totalCC)}</span>
                </div>
                {sellerCredit > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">Seller Credit</span>
                    <span className="font-medium text-emerald-600">− {fmt(sellerCredit)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t border-[#0a0a0a]/10">
                  <span className="text-[#0a0a0a]">Total Cash Needed</span>
                  <span className="text-[#0066FF]">{fmt(calc.totalFunds)}</span>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Setup Details */}
        <div className="bg-white rounded-2xl p-5 border border-[#0a0a0a]/5">
          <h2 className="text-sm font-semibold text-[#0a0a0a] mb-3">How This Was Built</h2>
          <div className="space-y-2 text-xs text-[#0a0a0a]/60">
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              <div><span className="text-[#0a0a0a]/40 block">Jeffrey's Income (W2, fixed)</span><span className="font-medium text-[#0a0a0a]">{fmt(JEFFREY_INCOME)}/mo</span></div>
              <div><span className="text-[#0a0a0a]/40 block">Monthly Debts</span><span className="font-medium text-[#0a0a0a]">{fmt(MONTHLY_DEBTS)}/mo</span></div>
              <div><span className="text-[#0a0a0a]/40 block">Property Tax Rate</span><span className="font-medium text-[#0a0a0a]">1.20% annually (SD County)</span></div>
              <div><span className="text-[#0a0a0a]/40 block">Loan Term</span><span className="font-medium text-[#0a0a0a]">30-year fixed</span></div>
              <div><span className="text-[#0a0a0a]/40 block">Conforming Rate</span><span className="font-medium text-[#0a0a0a]">{RATE_CONFORMING}% (loan ≤ $1,006,250)</span></div>
              <div><span className="text-[#0a0a0a]/40 block">Jumbo Rate</span><span className="font-medium text-[#0a0a0a]">{RATE_JUMBO}% (loan &gt; $1,006,250)</span></div>
              <div><span className="text-[#0a0a0a]/40 block">SD County Conforming Limit</span><span className="font-medium text-[#0a0a0a]">$1,006,250 (2026)</span></div>
              <div><span className="text-[#0a0a0a]/40 block">Down Payment Minimum</span><span className="font-medium text-[#0a0a0a]">20% (no MI required)</span></div>
            </div>
            <p className="pt-2 text-[#0a0a0a]/30">Hannah's income is shown as variable because her 2024 tax returns are in process. The actual qualifying amount depends on CPA review. All figures are estimates — final approval subject to underwriting.</p>
          </div>
        </div>

        {/* Rate note */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
          <strong>Current rate:</strong> {calc.rate}% — loan of {fmt(calc.loan)} is{' '}
          {calc.isJumbo ? `above the conforming limit → Jumbo rate applies` : `within SD County conforming limit → best conventional rate`}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[#0a0a0a]/30 pb-4 space-y-1">
          <p>Prepared by Kyle Palaniuk, NMLS 984138 · Plan Prepare Home</p>
          <p>Estimates only. Actual rates and terms subject to underwriting approval.</p>
        </div>

      </div>
    </div>
  )
}
