'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'

type LoanProgram = 'Conventional' | 'FHA' | 'VA'

interface PurchaseScenarioData {
  clientName: string
  loanOfficer: string
  loanOfficerNMLS: string
  loanOfficerPhone: string
  loanOfficerEmail: string
  ficoScore: number
  monthlyIncome: number
  monthlyDebts: number
  availableAssets: number
  priceMin: number
  priceMax: number
  interestRate: number
  loanProgram: LoanProgram
  propertyTaxRate: number
  annualInsurance: number
  monthlyHOA: number
  amortization: number
  highCostArea: boolean
  miOverrides: Record<number, string>
  createdAt: string
}

function calcPI(loan: number, rate: number, years: number) {
  const r = rate / 100 / 12
  const n = years * 12
  if (r === 0) return loan / n
  return loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function fmt(n: number) { return '$' + Math.round(n).toLocaleString() }
function fmtK(n: number) {
  return n >= 1_000_000 ? '$' + (n / 1_000_000).toFixed(1) + 'M' : '$' + (n / 1000).toFixed(0) + 'K'
}

function getPMIRate(ltv: number, fico: number, program: LoanProgram): number {
  if (program === 'VA') return 0
  if (ltv <= 80) return 0
  if (program === 'FHA') return ltv > 95 ? 0.55 : 0.50
  const ficoTier = fico >= 760 ? 0 : fico >= 740 ? 1 : fico >= 720 ? 2 : fico >= 700 ? 3 : fico >= 680 ? 4 : fico >= 660 ? 5 : 6
  const ltvTier = ltv <= 80 ? 0 : ltv <= 85 ? 1 : ltv <= 90 ? 2 : ltv <= 95 ? 3 : 4
  const table = [
    [0,0,0,0,0,0,0],
    [0.15,0.20,0.26,0.32,0.43,0.54,0.65],
    [0.30,0.38,0.46,0.54,0.72,0.90,1.08],
    [0.46,0.55,0.65,0.78,0.96,1.15,1.36],
    [0.58,0.68,0.82,0.96,1.15,1.36,1.52],
  ]
  return table[ltvTier]?.[ficoTier] || 0
}

const DOWN_OPTIONS = [5, 10, 15, 20, 25]

export default function PurchaseClientPage() {
  const { slug } = useParams() as { slug: string }
  const [data, setData] = useState<PurchaseScenarioData | null>(null)
  const [htmlScenario, setHtmlScenario] = useState<{ htmlStoragePath: string; label: string; clientName: string; loanOfficer: string } | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/scenarios/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => {
        // Agent-deployed HTML scenarios — render as iframe
        if (d.type === 'html' && d.htmlStoragePath) {
          setHtmlScenario({ htmlStoragePath: d.htmlStoragePath, label: d.label || slug, clientName: d.clientName || '', loanOfficer: d.loanOfficer || '' })
        } else {
          setData(d)
        }
      })
      .catch(() => setNotFound(true))
  }, [slug])

  const scenarios = useMemo(() => {
    if (!data) return []
    const conformingLimit = data.highCostArea ? 1149825 : 766550
    const maxDTI = data.loanProgram === 'Conventional' ? 45 : data.loanProgram === 'FHA' ? 56.9 : 50
    const results: Array<{
      price: number; dp: number; loanAmt: number; monthlyPI: number
      pmi: number; tax: number; ins: number; hoa: number; total: number
      dti: number; qualifies: boolean; cashRequired: number; conforming: boolean; ltv: number
    }> = []

    for (let price = data.priceMin; price <= data.priceMax; price += 50000) {
      for (const dp of DOWN_OPTIONS) {
        const down = price * (dp / 100)
        const loanAmt = price - down
        const ltv = (loanAmt / price) * 100
        const upfront = data.loanProgram === 'FHA' ? loanAmt * 0.0175 : 0
        const totalLoan = loanAmt + upfront
        const monthlyPI = calcPI(totalLoan, data.interestRate, data.amortization)
        const overrideVal = data.miOverrides?.[dp]
        const annualMI = dp >= 20 ? 0
          : (overrideVal !== '' && overrideVal !== undefined && !isNaN(Number(overrideVal)))
            ? Number(overrideVal)
            : getPMIRate(ltv, data.ficoScore, data.loanProgram)
        const pmi = (loanAmt * annualMI) / 100 / 12
        const tax = (price * data.propertyTaxRate / 100) / 12
        const ins = data.annualInsurance / 12
        const hoa = data.monthlyHOA
        const total = monthlyPI + pmi + tax + ins + hoa
        const dti = ((total + data.monthlyDebts) / data.monthlyIncome) * 100
        results.push({
          price, dp, loanAmt, monthlyPI, pmi, tax, ins, hoa, total,
          dti, qualifies: dti <= maxDTI,
          cashRequired: down + loanAmt * 0.03 + 3000,
          conforming: loanAmt <= conformingLimit, ltv,
        })
      }
    }
    return results
  }, [data])

  const pricePoints = useMemo(() => [...new Set(scenarios.map(s => s.price))], [scenarios])

  if (notFound) return (
    <div className="min-h-screen bg-sand flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="font-display text-2xl text-midnight mb-2">Scenario not found</h1>
        <p className="text-midnight/50">This link may have expired or the scenario was removed.</p>
      </div>
    </div>
  )

  // HTML scenario — render via server proxy (avoids CORS, content-type, and sandbox issues)
  if (htmlScenario) return (
    <div className="min-h-screen bg-midnight flex flex-col">
      <div className="bg-midnight px-4 py-2.5 flex items-center justify-between border-b border-cream/10">
        <div>
          <p className="text-cream font-semibold text-sm">{htmlScenario.label}</p>
          {htmlScenario.clientName && <p className="text-cream/40 text-xs">{htmlScenario.clientName}{htmlScenario.loanOfficer ? ` · ${htmlScenario.loanOfficer}` : ''}</p>}
        </div>
        <span className="text-cream/20 text-xs">Plan Prepare Home</span>
      </div>
      <iframe
        src={`/api/pph/scenario-html?slug=${slug}`}
        className="flex-1 w-full border-0"
        style={{ minHeight: 'calc(100vh - 48px)' }}
        title={htmlScenario.label}
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  )

  if (!data) return (
    <div className="min-h-screen bg-sand flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-ocean border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const byPrice = new Map(pricePoints.map(p => [p, scenarios.filter(s => s.price === p)]))

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <div className="bg-midnight text-cream px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-cream/40 text-sm mb-1 uppercase tracking-widest font-medium">Purchase Scenario</p>
          <h1 className="font-display text-3xl mb-1">
            {data.clientName ? `${data.clientName}'s Scenarios` : 'Purchase Scenarios'}
          </h1>
          <p className="text-cream/60 text-sm">
            {data.loanProgram} · {data.interestRate}% rate · {data.amortization}-yr · FICO {data.ficoScore}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Price Range', value: `${fmtK(data.priceMin)} – ${fmtK(data.priceMax)}` },
            { label: 'Monthly Income', value: fmt(data.monthlyIncome) },
            { label: 'Available Funds', value: fmt(data.availableAssets) },
            { label: 'Existing Debts', value: `${fmt(data.monthlyDebts)}/mo` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-cream rounded-xl p-4">
              <p className="text-xs text-midnight/40 mb-1">{label}</p>
              <p className="font-display text-lg text-midnight">{value}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="bg-cream rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-midnight/10">
            <h2 className="font-display text-xl text-midnight">Monthly Payment by Price &amp; Down Payment</h2>
            <p className="text-xs text-midnight/40 mt-0.5">Includes P&amp;I · Taxes · Insurance · MI · HOA · Green = qualifies · Red = over DTI limit</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-midnight/5">
                  <th className="text-left py-3 px-4 font-semibold text-midnight">Price</th>
                  {DOWN_OPTIONS.map(dp => (
                    <th key={dp} className="text-center py-3 px-3 font-semibold text-midnight">{dp}% Down</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricePoints.map((price) => {
                  const row = byPrice.get(price) || []
                  return (
                    <tr key={price} className="border-t border-midnight/5">
                      <td className="py-3 px-4 font-bold text-midnight">{fmtK(price)}</td>
                      {row.map(s => {
                        const hasFunds = data.availableAssets >= s.cashRequired
                        const bg = !s.qualifies ? 'bg-red-50' : s.dti > 40 ? 'bg-amber-50' : 'bg-emerald-50'
                        const txt = !s.qualifies ? 'text-red-700' : s.dti > 40 ? 'text-amber-700' : 'text-emerald-700'
                        return (
                          <td key={s.dp} className={`py-3 px-3 ${bg}`}>
                            <div className="text-center space-y-0.5">
                              <div className={`font-bold text-sm ${txt}`}>{fmt(s.total)}</div>
                              <div className={`text-[10px] ${txt}`}>DTI {s.dti.toFixed(1)}%</div>
                              <div className={`text-[9px] ${hasFunds ? 'text-emerald-600' : 'text-red-500'}`}>
                                Cash {fmtK(s.cashRequired)}
                              </div>
                              {s.pmi > 0 && <div className="text-[9px] text-midnight/40">+{fmt(s.pmi)} MI</div>}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* LO Card */}
        <div className="bg-midnight text-cream rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-ocean/20 flex items-center justify-center text-2xl flex-shrink-0">🏠</div>
          <div className="flex-1">
            <p className="font-display text-lg">{data.loanOfficer}</p>
            <p className="text-cream/50 text-sm">NMLS# {data.loanOfficerNMLS}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <a href={`tel:${data.loanOfficerPhone}`} className="text-terracotta hover:text-cream transition-colors">{data.loanOfficerPhone}</a>
            <a href={`mailto:${data.loanOfficerEmail}`} className="text-ocean hover:text-cream transition-colors">{data.loanOfficerEmail}</a>
          </div>
        </div>

        <p className="text-xs text-midnight/30 text-center pb-4">
          This analysis is for informational purposes only. Actual rates, costs, and qualification depend on credit profile, property details, and lender review. Contact your loan officer for a personalized quote. · Plan Prepare Home
        </p>
      </div>
    </div>
  )
}
