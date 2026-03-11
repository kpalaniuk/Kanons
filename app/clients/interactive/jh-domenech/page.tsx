'use client'

import { useMemo, useState } from 'react'

// ── Fixed assumptions ─────────────────────────────────────────────
const JEFFREY_INCOME = 8254    // $/mo W2
const MONTHLY_DEBTS  = 140     // $/mo liabilities
const TAX_RATE       = 0.012   // 1.2% annually (SD County)
const SD_CONFORMING  = 1006250 // 2026 SD County high-cost conforming limit
const RATE_CONFORMING = 6.0
const RATE_JUMBO      = 6.5

function formatCurrency(n: number) {
  return '$' + Math.round(n).toLocaleString()
}

function calcPI(loan: number, annualRate: number, termYears: number) {
  const r = annualRate / 100 / 12
  const n = termYears * 12
  if (r === 0) return loan / n
  return loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function Slider({ label, value, min, max, step, format, onChange, color = 'ocean' }: {
  label: string; value: number; min: number; max: number; step: number
  format: (v: number) => string; onChange: (v: number) => void; color?: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-[#0a0a0a]/60">{label}</label>
        <span className={`text-sm font-bold ${color === 'amber' ? 'text-amber-600' : 'text-[#0066FF]'}`}>{format(value)}</span>
      </div>
      <div className="relative h-2 bg-[#0a0a0a]/10 rounded-full">
        <div
          className={`absolute left-0 top-0 h-2 rounded-full ${color === 'amber' ? 'bg-amber-400' : 'bg-[#0066FF]'}`}
          style={{ width: `${pct}%` }}
        />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md ${color === 'amber' ? 'bg-amber-400' : 'bg-[#0066FF]'}`}
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[#0a0a0a]/30">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  )
}

export default function JHInteractiveScenario() {
  const [hannahIncome, setHannahIncome] = useState(1871)
  const [purchasePrice, setPurchasePrice] = useState(1350000)
  const [downPct, setDownPct] = useState(60)
  const [insurance, setInsurance] = useState(150)

  const calc = useMemo(() => {
    const downAmt   = Math.round(purchasePrice * downPct / 100)
    const loan      = purchasePrice - downAmt
    const rate      = loan > SD_CONFORMING ? RATE_JUMBO : RATE_CONFORMING
    const isJumbo   = loan > SD_CONFORMING
    const pi        = calcPI(loan, rate, 30)
    const taxMo     = (purchasePrice * TAX_RATE) / 12
    const total     = pi + taxMo + insurance
    const combined  = JEFFREY_INCOME + hannahIncome
    const frontDTI  = (total / combined) * 100
    const backDTI   = ((total + MONTHLY_DEBTS) / combined) * 100
    const ltv       = (loan / purchasePrice) * 100

    let status: 'strong' | 'caution' | 'tight' | 'over'
    if (backDTI <= 43)       status = 'strong'
    else if (backDTI <= 45)  status = 'caution'
    else if (backDTI <= 50)  status = 'tight'
    else                     status = 'over'

    return { downAmt, loan, rate, isJumbo, pi, taxMo, total, combined, frontDTI, backDTI, ltv, status }
  }, [hannahIncome, purchasePrice, downPct, insurance])

  const statusConfig = {
    strong:  { label: '✅ Strong qualifier',  color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    caution: { label: '⚠️ Borderline',        color: 'bg-amber-50 border-amber-200 text-amber-700' },
    tight:   { label: '⚡ Tight — needs AUS', color: 'bg-orange-50 border-orange-200 text-orange-700' },
    over:    { label: '❌ Over limit',         color: 'bg-red-50 border-red-200 text-red-700' },
  }[calc.status]

  return (
    <div className="min-h-screen bg-[#f8f7f4] py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <p className="text-xs font-medium text-[#0066FF] uppercase tracking-wider mb-1">Purchase Scenario</p>
          <h1 className="text-2xl font-bold text-[#0a0a0a]">Jeffrey & Hannah Domenech</h1>
          <p className="text-sm text-[#0a0a0a]/50 mt-0.5">Prepared by Kyle Palaniuk · NMLS 984138</p>
        </div>

        {/* PITIA Result — top of fold */}
        <div className="bg-[#0a0a0a] text-[#f8f7f4] rounded-2xl p-6 shadow-lg">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Monthly Payment (PITIA)</p>
              <p className="text-4xl font-bold">{formatCurrency(calc.total)}<span className="text-lg text-white/40">/mo</span></p>
            </div>
            <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${statusConfig.color}`}>
              {statusConfig.label}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-white/40 mb-0.5">Principal & Interest</p>
              <p className="font-semibold">{formatCurrency(calc.pi)}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-0.5">Property Tax</p>
              <p className="font-semibold">{formatCurrency(calc.taxMo)}/mo</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-0.5">Insurance</p>
              <p className="font-semibold">{formatCurrency(insurance)}/mo</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-0.5">Loan Amount</p>
              <p className="font-semibold">{formatCurrency(calc.loan)}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-0.5">Rate</p>
              <p className="font-semibold">{calc.rate}% {calc.isJumbo ? <span className="text-[10px] text-amber-400">JUMBO</span> : <span className="text-[10px] text-emerald-400">CONF</span>}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-0.5">LTV</p>
              <p className="font-semibold">{calc.ltv.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* DTI Summary */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Front-End DTI', value: calc.frontDTI, note: 'PITIA ÷ income', limit: 45 },
            { label: 'Back-End DTI', value: calc.backDTI, note: `+ $${MONTHLY_DEBTS}/mo debts`, limit: 50 },
          ].map(({ label, value, note, limit }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-[#0a0a0a]/5">
              <p className="text-xs text-[#0a0a0a]/40 mb-0.5">{label}</p>
              <p className={`text-2xl font-bold ${value > limit ? 'text-red-500' : value > limit * 0.9 ? 'text-amber-500' : 'text-emerald-600'}`}>
                {value.toFixed(1)}%
              </p>
              <p className="text-xs text-[#0a0a0a]/30 mt-0.5">{note} · limit {limit}%</p>
              <div className="mt-2 h-1.5 bg-[#0a0a0a]/8 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${value > limit ? 'bg-red-400' : value > limit * 0.9 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${Math.min(value / limit * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Sliders */}
        <div className="bg-white rounded-2xl p-6 border border-[#0a0a0a]/5 space-y-6">
          <h2 className="text-sm font-semibold text-[#0a0a0a]">Adjust Scenario</h2>

          <Slider
            label="Hannah's Monthly Income"
            value={hannahIncome}
            min={1250} max={6000} step={50}
            format={v => `${formatCurrency(v)}/mo`}
            onChange={setHannahIncome}
            color="amber"
          />
          <Slider
            label="Purchase Price"
            value={purchasePrice}
            min={900000} max={1600000} step={10000}
            format={v => formatCurrency(v)}
            onChange={setPurchasePrice}
          />
          <Slider
            label="Down Payment"
            value={downPct}
            min={20} max={65} step={1}
            format={v => `${v}% (${formatCurrency(purchasePrice * v / 100)})`}
            onChange={setDownPct}
          />
          <Slider
            label="Monthly Insurance"
            value={insurance}
            min={100} max={500} step={10}
            format={v => `${formatCurrency(v)}/mo`}
            onChange={setInsurance}
          />
        </div>

        {/* Income summary */}
        <div className="bg-white rounded-2xl p-5 border border-[#0a0a0a]/5">
          <h2 className="text-sm font-semibold text-[#0a0a0a] mb-3">Combined Income</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#0a0a0a]/50">Jeffrey (W2, fixed)</span>
              <span className="font-medium">{formatCurrency(JEFFREY_INCOME)}/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-600">Hannah (SE, variable)</span>
              <span className="font-medium text-amber-600">{formatCurrency(hannahIncome)}/mo</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#0a0a0a]/8">
              <span className="font-semibold text-[#0a0a0a]">Combined qualifying</span>
              <span className="font-bold text-[#0a0a0a]">{formatCurrency(calc.combined)}/mo</span>
            </div>
          </div>
        </div>

        {/* Rate note */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
          <strong>Rate logic:</strong> {calc.isJumbo
            ? `Loan ($${Math.round(calc.loan / 1000)}k) exceeds SD County conforming limit ($1,006,250) → Jumbo rate ${RATE_JUMBO}%`
            : `Loan ($${Math.round(calc.loan / 1000)}k) is within SD County conforming limit ($1,006,250) → Conforming rate ${RATE_CONFORMING}%`
          }
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[#0a0a0a]/30 pb-4">
          <p>Prepared by Kyle Palaniuk, NMLS 984138 · Plan Prepare Home</p>
          <p className="mt-0.5">Estimates only. Actual rates and terms subject to underwriting approval.</p>
        </div>

      </div>
    </div>
  )
}
