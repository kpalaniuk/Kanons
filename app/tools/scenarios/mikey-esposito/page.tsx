'use client'

import { useMemo } from 'react'

interface Scenario {
  price: number
  downPayment: number
  downPaymentPercent: number
  loanAmount: number
  monthlyPI: number
  pmi: number
  monthlyPITIA: number
  cashRequired: number
  isConforming: boolean
  ltv: number
}

export default function MikeyEspositoScenarioPage() {
  const lo = {
    name: 'Jim Sakrison',
    nmls: '244905',
    phone: '619-251-5047',
    email: 'jim@planpreparehome.com',
  }

  const clientName = 'Mikey Esposito'
  const downPayment = 600000
  const interestRate = 6.0
  const amortization = 30
  const propertyTaxRate = 1.22
  const insuranceRate = 0.0015 // 0.15% of purchase price
  const conformingLimit = 1149825 // San Diego high-cost area

  const calculateMonthlyPayment = (loanAmount: number, rate: number, years: number): number => {
    const monthlyRate = rate / 100 / 12
    const months = years * 12
    if (monthlyRate === 0) return loanAmount / months
    return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
  }

  const scenarios = useMemo(() => {
    const results: Scenario[] = []
    const prices = []
    for (let p = 1750000; p <= 2500000; p += 50000) {
      prices.push(p)
    }

    for (const price of prices) {
      const loanAmount = price - downPayment
      const ltv = (loanAmount / price) * 100
      const dpPercent = (downPayment / price) * 100

      const monthlyPI = calculateMonthlyPayment(loanAmount, interestRate, amortization)

      // PMI - unlikely at these LTVs but calculate anyway
      const pmi = ltv > 80 ? (loanAmount * 0.003) / 12 : 0

      const monthlyTax = (price * propertyTaxRate / 100) / 12
      const monthlyInsurance = (price * insuranceRate) / 12
      const monthlyPITIA = monthlyPI + pmi + monthlyTax + monthlyInsurance

      const closingCosts = loanAmount * 0.02
      const prepaids = 5000
      const cashRequired = downPayment + closingCosts + prepaids

      const isConforming = loanAmount <= conformingLimit

      results.push({
        price,
        downPayment,
        downPaymentPercent: dpPercent,
        loanAmount,
        monthlyPI,
        pmi,
        monthlyPITIA,
        cashRequired,
        isConforming,
        ltv,
      })
    }
    return results
  }, [])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  const formatCurrencyFull = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 pb-24">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#0066FF]/10 rounded-xl flex items-center justify-center">
            <span className="text-xl">🏡</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-[#0a0a0a]">Purchase Scenarios</h1>
        </div>
        <p className="text-[#0a0a0a]/60 text-lg mt-2">
          Prepared for <strong className="text-[#0a0a0a]">{clientName}</strong>
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-[#f8f7f4] rounded-2xl border-2 border-[#0a0a0a]/5 p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-[#0a0a0a]/50 uppercase tracking-wide mb-1">Down Payment</div>
            <div className="text-xl font-bold text-[#0a0a0a]">{formatCurrency(downPayment)}</div>
          </div>
          <div>
            <div className="text-xs text-[#0a0a0a]/50 uppercase tracking-wide mb-1">Interest Rate</div>
            <div className="text-xl font-bold text-[#0a0a0a]">{interestRate.toFixed(3)}%</div>
          </div>
          <div>
            <div className="text-xs text-[#0a0a0a]/50 uppercase tracking-wide mb-1">Term</div>
            <div className="text-xl font-bold text-[#0a0a0a]">{amortization}-Year Fixed</div>
          </div>
          <div>
            <div className="text-xs text-[#0a0a0a]/50 uppercase tracking-wide mb-1">Price Range</div>
            <div className="text-xl font-bold text-[#0a0a0a]">$1.75M – $2.5M</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4 pt-4 border-t border-[#0a0a0a]/10">
          <div>
            <div className="text-xs text-[#0a0a0a]/50 uppercase tracking-wide mb-1">Property Tax</div>
            <div className="text-sm font-medium text-[#0a0a0a]">{propertyTaxRate}% of purchase price</div>
          </div>
          <div>
            <div className="text-xs text-[#0a0a0a]/50 uppercase tracking-wide mb-1">Insurance</div>
            <div className="text-sm font-medium text-[#0a0a0a]">0.15% of purchase price</div>
          </div>
          <div>
            <div className="text-xs text-[#0a0a0a]/50 uppercase tracking-wide mb-1">Loan Program</div>
            <div className="text-sm font-medium text-[#0a0a0a]">Conventional</div>
          </div>
          <div>
            <div className="text-xs text-[#0a0a0a]/50 uppercase tracking-wide mb-1">Conforming Limit</div>
            <div className="text-sm font-medium text-[#0a0a0a]">{formatCurrency(conformingLimit)} (High-Cost)</div>
          </div>
        </div>
      </div>

      {/* Scenarios Table */}
      <div className="bg-[#f8f7f4] rounded-2xl border-2 border-[#0a0a0a]/5 p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#0a0a0a]/10">
              <th className="text-left py-3 px-3 text-[#0a0a0a] font-bold">Purchase Price</th>
              <th className="text-right py-3 px-3 text-[#0a0a0a] font-bold">Loan Amount</th>
              <th className="text-right py-3 px-3 text-[#0a0a0a] font-bold">LTV</th>
              <th className="text-right py-3 px-3 text-[#0a0a0a] font-bold">Down %</th>
              <th className="text-right py-3 px-3 text-[#0a0a0a] font-bold">P&I</th>
              <th className="text-right py-3 px-3 text-[#0a0a0a] font-bold">Total PITIA</th>
              <th className="text-right py-3 px-3 text-[#0a0a0a] font-bold">Cash Needed</th>
              <th className="text-center py-3 px-3 text-[#0a0a0a] font-bold">Type</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s) => {
              const isJumbo = !s.isConforming
              const hasPMI = s.pmi > 0
              return (
                <tr
                  key={s.price}
                  className={`border-b border-[#0a0a0a]/5 hover:bg-[#0a0a0a]/[0.03] transition-colors ${
                    isJumbo ? '' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-bold text-[#0a0a0a]">{formatCurrency(s.price)}</td>
                  <td className="py-3 px-3 text-right text-[#0a0a0a]">{formatCurrency(s.loanAmount)}</td>
                  <td className="py-3 px-3 text-right text-[#0a0a0a]">{s.ltv.toFixed(1)}%</td>
                  <td className="py-3 px-3 text-right text-[#0a0a0a]">{s.downPaymentPercent.toFixed(1)}%</td>
                  <td className="py-3 px-3 text-right text-[#0a0a0a]">{formatCurrencyFull(s.monthlyPI)}</td>
                  <td className="py-3 px-3 text-right font-bold text-[#0a0a0a]">
                    {formatCurrencyFull(s.monthlyPITIA)}
                    {hasPMI && (
                      <div className="text-[10px] text-amber-600 font-normal">
                        incl. {formatCurrency(s.pmi)} PMI
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-[#0a0a0a]/70 text-xs">{formatCurrency(s.cashRequired)}</td>
                  <td className="py-3 px-3 text-center">
                    {s.isConforming ? (
                      <span className="inline-block px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        Conforming
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                        Jumbo
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div className="mt-8 bg-[#0a0a0a]/[0.03] rounded-xl p-6 text-sm text-[#0a0a0a]/60 space-y-2">
        <p><strong>PITIA</strong> = Principal + Interest + Property Taxes + Insurance. HOA not included — add if applicable.</p>
        <p><strong>Cash Needed</strong> = Down payment + estimated closing costs (2%) + $5,000 prepaids.</p>
        <p><strong>Conforming</strong> loans are under the {formatCurrency(conformingLimit)} high-cost area limit. <strong>Jumbo</strong> loans may carry different rate and reserve requirements.</p>
        <p className="text-xs text-[#0a0a0a]/40 pt-2">
          ⚠️ These are estimates for discussion purposes only. Final terms subject to full underwriting, credit review, appraisal, and lender guidelines.
        </p>
      </div>

      {/* LO Footer */}
      <div className="mt-10 text-center space-y-2">
        <div className="inline-flex items-center gap-3 bg-[#f8f7f4] rounded-2xl px-6 py-4">
          <div className="text-left">
            <div className="font-bold text-[#0a0a0a]">{lo.name}</div>
            <div className="text-xs text-[#0a0a0a]/60">NMLS# {lo.nmls}</div>
            <div className="text-xs text-[#0a0a0a]/60">{lo.phone} · {lo.email}</div>
          </div>
        </div>
        <div className="text-xs text-[#0a0a0a]/40">
          C2 Financial Corporation | NMLS# 135622 | CA BRE# 01821025 | planpreparehome.com
        </div>
      </div>
    </div>
  )
}
