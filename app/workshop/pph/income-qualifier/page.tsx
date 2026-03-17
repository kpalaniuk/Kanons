'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, DollarSign, Home, Percent, Calculator, ChevronDown, ChevronUp, Info } from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────

function pmt(rate: number, nper: number, pv: number): number {
  if (rate === 0) return pv / nper
  return (pv * rate * Math.pow(1 + rate, nper)) / (Math.pow(1 + rate, nper) - 1)
}

function fmt(n: number, decimals = 0): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function fmtDollar(n: number): string {
  return '$' + fmt(Math.round(n))
}

function fmtDollarK(n: number): string {
  if (n >= 1000) return '$' + fmt(n / 1000, 1) + 'k'
  return fmtDollar(n)
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DTI_TIERS = [
  { label: 'Conservative', dti: 0.36, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
  { label: 'Standard',     dti: 0.43, color: 'text-blue-700',  bg: 'bg-blue-50',  border: 'border-blue-200',  badge: 'bg-blue-100 text-blue-700'  },
  { label: 'Stretch',      dti: 0.45, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  { label: 'Max',          dti: 0.50, color: 'text-red-700',   bg: 'bg-red-50',   border: 'border-red-200',   badge: 'bg-red-100 text-red-700'    },
]

const LOAN_PROGRAMS = ['Conventional', 'FHA', 'VA', 'Jumbo'] as const
type LoanProgram = typeof LOAN_PROGRAMS[number]

// ── Component ─────────────────────────────────────────────────────────────────

export default function IncomeQualifierPage() {
  // Inputs
  const [purchasePrice, setPurchasePrice]   = useState(900000)
  const [downPct, setDownPct]               = useState(20)
  const [rate, setRate]                     = useState(6.875)
  const [termYears, setTermYears]           = useState(30)
  const [propTaxRate, setPropTaxRate]       = useState(1.2)   // % of price annually
  const [insurance, setInsurance]           = useState(150)   // monthly
  const [hoaDues, setHoaDues]               = useState(0)     // monthly
  const [program, setProgram]               = useState<LoanProgram>('Conventional')
  const [existingDebt, setExistingDebt]     = useState(0)     // monthly existing debt (car, student loans, etc.)
  const [showAdvanced, setShowAdvanced]     = useState(false)
  const [clientName, setClientName]         = useState('Hannah Domenech')

  // Derived
  const results = useMemo(() => {
    const dp = (downPct / 100) * purchasePrice
    const loanAmount = purchasePrice - dp
    const ltv = loanAmount / purchasePrice
    const monthlyRate = rate / 100 / 12
    const nper = termYears * 12

    const pi = pmt(monthlyRate, nper, loanAmount)

    // PMI (conventional only, LTV > 80%)
    const pmi = (program === 'Conventional' && ltv > 0.80)
      ? (loanAmount * 0.0085) / 12
      : 0

    // FHA MIP
    const fhaMIP = program === 'FHA' ? (loanAmount * 0.0055) / 12 : 0

    const propTaxMonthly = (propTaxRate / 100 * purchasePrice) / 12

    const housingPayment = pi + propTaxMonthly + insurance + hoaDues + pmi + fhaMIP

    return DTI_TIERS.map(tier => {
      // Total allowed debt payment = gross income × DTI
      // Housing + existing debt ≤ gross × DTI
      // So: gross ≥ (housing + existing) / DTI
      const requiredMonthly = (housingPayment + existingDebt) / tier.dti
      const requiredAnnual  = requiredMonthly * 12
      return {
        ...tier,
        pi,
        pmi,
        fhaMIP,
        propTaxMonthly,
        housingPayment,
        loanAmount,
        ltv,
        dp,
        requiredMonthly,
        requiredAnnual,
      }
    })
  }, [purchasePrice, downPct, rate, termYears, propTaxRate, insurance, hoaDues, program, existingDebt])

  const base = results[1] // Standard (43%) as the main reference

  return (
    <div className="min-h-screen bg-paper py-8">
      <div className="max-w-2xl mx-auto px-4 space-y-5">

        {/* Header */}
        <div>
          <Link href="/workshop/work" className="inline-flex items-center gap-1 text-xs text-midnight/40 hover:text-midnight mb-3 transition-colors">
            <ArrowLeft size={12} /> Work Tools
          </Link>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="font-display text-2xl text-midnight flex items-center gap-2">
                <Calculator size={22} className="text-ocean" /> Income Qualifier
              </h1>
              <p className="text-sm text-midnight/50 mt-0.5">What income does a buyer need to qualify at a given purchase price?</p>
            </div>
          </div>
        </div>

        {/* Client name */}
        <div className="bg-cream rounded-2xl border border-midnight/8 p-4">
          <label className="block text-xs font-semibold text-midnight/50 uppercase tracking-wide mb-1.5">Client</label>
          <input
            type="text"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
            className="w-full text-sm text-midnight bg-white border border-midnight/10 rounded-xl px-3 py-2 focus:outline-none focus:border-ocean"
            placeholder="Client name (optional)"
          />
        </div>

        {/* Primary inputs */}
        <div className="bg-cream rounded-2xl border border-midnight/8 p-4 space-y-4">
          <div className="text-xs font-semibold text-midnight/50 uppercase tracking-wide">Purchase Details</div>

          {/* Purchase price */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-midnight mb-2">
              <Home size={13} className="text-midnight/40" /> Purchase Price
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-midnight/40">$</span>
              <input
                type="number"
                value={purchasePrice}
                onChange={e => setPurchasePrice(Number(e.target.value))}
                className="flex-1 text-sm text-midnight bg-white border border-midnight/10 rounded-xl px-3 py-2 focus:outline-none focus:border-ocean"
                step={10000}
              />
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {[700000, 800000, 900000, 1000000, 1200000, 1500000].map(p => (
                <button key={p} onClick={() => setPurchasePrice(p)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${purchasePrice === p ? 'bg-midnight text-cream' : 'bg-white border border-midnight/10 text-midnight/50 hover:text-midnight'}`}>
                  {fmtDollarK(p)}
                </button>
              ))}
            </div>
          </div>

          {/* Down payment + program row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-midnight mb-2">
                <Percent size={13} className="text-midnight/40" /> Down Payment
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={downPct}
                  onChange={e => setDownPct(Number(e.target.value))}
                  className="flex-1 text-sm text-midnight bg-white border border-midnight/10 rounded-xl px-3 py-2 focus:outline-none focus:border-ocean"
                  min={3} max={50} step={1}
                />
                <span className="text-sm text-midnight/40">%</span>
              </div>
              <div className="text-xs text-midnight/35 mt-1">{fmtDollar((downPct / 100) * purchasePrice)} down</div>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {[5, 10, 20, 25].map(p => (
                  <button key={p} onClick={() => setDownPct(p)}
                    className={`text-xs px-2 py-0.5 rounded-lg transition-colors ${downPct === p ? 'bg-midnight text-cream' : 'bg-white border border-midnight/10 text-midnight/50 hover:text-midnight'}`}>
                    {p}%
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-midnight mb-2 block">Loan Program</label>
              <select
                value={program}
                onChange={e => setProgram(e.target.value as LoanProgram)}
                className="w-full text-sm text-midnight bg-white border border-midnight/10 rounded-xl px-3 py-2 focus:outline-none focus:border-ocean"
              >
                {LOAN_PROGRAMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Rate */}
          <div>
            <label className="text-sm font-medium text-midnight mb-2 block">Interest Rate (%)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={rate}
                onChange={e => setRate(Number(e.target.value))}
                className="w-32 text-sm text-midnight bg-white border border-midnight/10 rounded-xl px-3 py-2 focus:outline-none focus:border-ocean"
                step={0.125} min={2} max={12}
              />
              <span className="text-sm text-midnight/40">% / {termYears}yr fixed</span>
            </div>
          </div>

          {/* Advanced toggle */}
          <button onClick={() => setShowAdvanced(o => !o)}
            className="flex items-center gap-1.5 text-xs text-midnight/45 hover:text-midnight transition-colors">
            {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showAdvanced ? 'Hide' : 'Show'} advanced (taxes, HOA, existing debt)
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-midnight/6">
              <div>
                <label className="text-xs font-medium text-midnight/60 mb-1.5 block">Property Tax (% / yr)</label>
                <input type="number" value={propTaxRate} onChange={e => setPropTaxRate(Number(e.target.value))}
                  className="w-full text-sm text-midnight bg-white border border-midnight/10 rounded-xl px-3 py-2 focus:outline-none focus:border-ocean"
                  step={0.1} min={0} max={3} />
                <div className="text-xs text-midnight/35 mt-1">{fmtDollar((propTaxRate / 100 * purchasePrice) / 12)}/mo</div>
              </div>
              <div>
                <label className="text-xs font-medium text-midnight/60 mb-1.5 block">Insurance ($/mo)</label>
                <input type="number" value={insurance} onChange={e => setInsurance(Number(e.target.value))}
                  className="w-full text-sm text-midnight bg-white border border-midnight/10 rounded-xl px-3 py-2 focus:outline-none focus:border-ocean"
                  step={25} min={0} />
              </div>
              <div>
                <label className="text-xs font-medium text-midnight/60 mb-1.5 block">HOA Dues ($/mo)</label>
                <input type="number" value={hoaDues} onChange={e => setHoaDues(Number(e.target.value))}
                  className="w-full text-sm text-midnight bg-white border border-midnight/10 rounded-xl px-3 py-2 focus:outline-none focus:border-ocean"
                  step={50} min={0} />
              </div>
              <div>
                <label className="text-xs font-medium text-midnight/60 mb-1.5 block">Existing Debt ($/mo)</label>
                <input type="number" value={existingDebt} onChange={e => setExistingDebt(Number(e.target.value))}
                  className="w-full text-sm text-midnight bg-white border border-midnight/10 rounded-xl px-3 py-2 focus:outline-none focus:border-ocean"
                  step={100} min={0} />
                <div className="text-xs text-midnight/35 mt-1">Car, student loans, etc.</div>
              </div>
              <div>
                <label className="text-xs font-medium text-midnight/60 mb-1.5 block">Loan Term</label>
                <select value={termYears} onChange={e => setTermYears(Number(e.target.value))}
                  className="w-full text-sm text-midnight bg-white border border-midnight/10 rounded-xl px-3 py-2 focus:outline-none focus:border-ocean">
                  <option value={30}>30 Year</option>
                  <option value={20}>20 Year</option>
                  <option value={15}>15 Year</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Payment breakdown */}
        <div className="bg-midnight rounded-2xl p-4 text-cream">
          <div className="text-xs font-semibold text-cream/50 uppercase tracking-wide mb-3">Monthly Housing Payment Breakdown</div>
          <div className="space-y-1.5 text-sm">
            {[
              { label: 'Principal & Interest', value: base.pi },
              { label: 'Property Tax', value: base.propTaxMonthly },
              { label: 'Insurance', value: insurance },
              ...(hoaDues > 0 ? [{ label: 'HOA', value: hoaDues }] : []),
              ...(base.pmi > 0 ? [{ label: 'PMI', value: base.pmi }] : []),
              ...(base.fhaMIP > 0 ? [{ label: 'FHA MIP', value: base.fhaMIP }] : []),
              ...(existingDebt > 0 ? [{ label: 'Existing Debt', value: existingDebt }] : []),
            ].map(row => (
              <div key={row.label} className="flex justify-between gap-2">
                <span className="text-cream/60">{row.label}</span>
                <span className="font-medium">{fmtDollar(row.value)}</span>
              </div>
            ))}
            <div className="border-t border-cream/15 pt-2 mt-2 flex justify-between gap-2">
              <span className="font-semibold text-cream/80">Total PITIA</span>
              <span className="font-display text-lg text-cream">{fmtDollar(base.housingPayment)}/mo</span>
            </div>
            {existingDebt > 0 && (
              <div className="flex justify-between gap-2 text-cream/50 text-xs">
                <span>Housing only</span>
                <span>{fmtDollar(base.housingPayment - existingDebt)}/mo</span>
              </div>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-cream/10 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-cream/40">Loan</div>
              <div className="font-medium text-cream">{fmtDollar(base.loanAmount)}</div>
            </div>
            <div>
              <div className="text-cream/40">LTV</div>
              <div className="font-medium text-cream">{(base.ltv * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-cream/40">Down</div>
              <div className="font-medium text-cream">{fmtDollar(base.dp)}</div>
            </div>
          </div>
        </div>

        {/* Required income tiers */}
        <div>
          <div className="text-xs font-semibold text-midnight/50 uppercase tracking-wide mb-2">
            Required Gross Income — {clientName || 'Buyer'}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {results.map(r => (
              <div key={r.label} className={`rounded-2xl border-2 p-4 ${r.bg} ${r.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.badge}`}>{r.label}</span>
                  <span className="text-xs text-midnight/40">{(r.dti * 100).toFixed(0)}% DTI</span>
                </div>
                <div className={`font-display text-2xl font-bold ${r.color}`}>{fmtDollar(r.requiredAnnual)}</div>
                <div className="text-xs text-midnight/45 mt-0.5">per year</div>
                <div className="text-xs text-midnight/35 mt-2">{fmtDollar(r.requiredMonthly)}/mo gross</div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 mt-3 bg-cream rounded-xl border border-midnight/8 p-3">
            <Info size={12} className="text-midnight/30 shrink-0 mt-0.5" />
            <p className="text-xs text-midnight/45 leading-relaxed">
              These are <strong className="text-midnight/60">gross income</strong> thresholds. Include all documented sources: W2, self-employment (2yr avg), rental income (75% rule), etc. Work with your CPA on income documentation strategy.
            </p>
          </div>
        </div>

        {/* Scenario comparison */}
        <div>
          <div className="text-xs font-semibold text-midnight/50 uppercase tracking-wide mb-2">Price Sensitivity</div>
          <div className="bg-cream rounded-2xl border border-midnight/8 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-midnight/5 text-midnight/50 text-xs">
                  <th className="text-left p-3 font-semibold">Price</th>
                  <th className="text-right p-3 font-semibold">PITIA/mo</th>
                  <th className="text-right p-3 font-semibold">Income (43%)</th>
                  <th className="text-right p-3 font-semibold">Income (50%)</th>
                </tr>
              </thead>
              <tbody>
                {[-200000, -100000, 0, 100000, 200000].map(delta => {
                  const p = purchasePrice + delta
                  if (p <= 0) return null
                  const dp2 = (downPct / 100) * p
                  const loan2 = p - dp2
                  const monthlyRate = rate / 100 / 12
                  const nper = termYears * 12
                  const pi2 = pmt(monthlyRate, nper, loan2)
                  const tax2 = (propTaxRate / 100 * p) / 12
                  const pmi2 = (program === 'Conventional' && loan2 / p > 0.8) ? (loan2 * 0.0085) / 12 : 0
                  const fha2 = program === 'FHA' ? (loan2 * 0.0055) / 12 : 0
                  const pitia2 = pi2 + tax2 + insurance + hoaDues + pmi2 + fha2
                  const income43 = ((pitia2 + existingDebt) / 0.43) * 12
                  const income50 = ((pitia2 + existingDebt) / 0.50) * 12
                  const isSelected = delta === 0
                  return (
                    <tr key={delta} className={`border-t border-midnight/6 ${isSelected ? 'bg-ocean/5' : 'hover:bg-midnight/2'}`}>
                      <td className={`p-3 font-medium ${isSelected ? 'text-ocean font-bold' : 'text-midnight'}`}>
                        {fmtDollarK(p)} {isSelected && '◀'}
                      </td>
                      <td className="p-3 text-right text-midnight/70">{fmtDollar(pitia2)}</td>
                      <td className="p-3 text-right text-midnight/70">{fmtDollarK(income43)}</td>
                      <td className="p-3 text-right text-midnight/70">{fmtDollarK(income50)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-midnight/25 pb-4">
          For professional use only · Not a loan commitment · Kyle Palaniuk NMLS #984138
        </div>

      </div>
    </div>
  )
}
