'use client'

import { useState, useMemo } from 'react'

export default function MikeyEspositoScenarioPage() {
  const lo = {
    name: 'Jim Sakrison',
    nmls: '244905',
    phone: '619-251-5047',
    email: 'jim@planpreparehome.com',
  }

  const clientName = 'Mikey Esposito'
  const interestRate = 6.0
  const amortization = 30
  const propertyTaxRate = 1.22
  const insuranceRate = 0.0015
  const conformingLimit = 1149825
  const maxCash = 650000
  const maxLTV = 75

  const [purchasePrice, setPurchasePrice] = useState(2000000)
  const [downPayment, setDownPayment] = useState(600000)

  // Enforce constraints
  const minDown = purchasePrice * (1 - maxLTV / 100)
  const effectiveDown = Math.max(downPayment, minDown)
  const effectiveDownClamped = Math.min(effectiveDown, maxCash)

  const loanAmount = purchasePrice - effectiveDownClamped
  const ltv = (loanAmount / purchasePrice) * 100
  const downPercent = (effectiveDownClamped / purchasePrice) * 100

  const calculateMonthlyPayment = (loan: number, rate: number, years: number): number => {
    const mr = rate / 100 / 12
    const months = years * 12
    if (mr === 0) return loan / months
    return loan * (mr * Math.pow(1 + mr, months)) / (Math.pow(1 + mr, months) - 1)
  }

  const scenario = useMemo(() => {
    const monthlyPI = calculateMonthlyPayment(loanAmount, interestRate, amortization)
    const monthlyTax = (purchasePrice * propertyTaxRate / 100) / 12
    const monthlyInsurance = (purchasePrice * insuranceRate) / 12
    const monthlyPITIA = monthlyPI + monthlyTax + monthlyInsurance
    const closingCosts = loanAmount * 0.02
    const prepaids = 5000
    const cashRequired = effectiveDownClamped + closingCosts + prepaids
    const isConforming = loanAmount <= conformingLimit

    return {
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyPITIA,
      cashRequired,
      closingCosts,
      isConforming,
    }
  }, [purchasePrice, effectiveDownClamped, loanAmount])

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v)

  const formatCurrencyFull = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)

  const sliderTrack = (pct: number) =>
    `linear-gradient(to right, #0066FF 0%, #0066FF ${pct}%, rgb(10 10 10 / 0.1) ${pct}%, rgb(10 10 10 / 0.1) 100%)`

  const pricePct = ((purchasePrice - 1750000) / (2500000 - 1750000)) * 100
  const downPct = ((downPayment - 300000) / (maxCash - 300000)) * 100

  // PITIA breakdown for pie chart
  const piPct = (scenario.monthlyPI / scenario.monthlyPITIA) * 100
  const taxPct = (scenario.monthlyTax / scenario.monthlyPITIA) * 100
  const insPct = (scenario.monthlyInsurance / scenario.monthlyPITIA) * 100

  // Warning if down payment got clamped
  const downClamped = downPayment < minDown
  const overCash = effectiveDown > maxCash

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-3xl md:text-4xl font-bold text-[#0a0a0a]">
          Purchase Scenarios
        </h1>
        <p className="text-[#0a0a0a]/60 text-lg mt-2">
          Prepared for <strong className="text-[#0a0a0a]">{clientName}</strong>
        </p>
      </div>

      {/* Sliders */}
      <div className="bg-[#f8f7f4] rounded-2xl border-2 border-[#0a0a0a]/5 p-6 mb-6 space-y-8">
        {/* Purchase Price Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#0a0a0a]">Purchase Price</label>
            <span className="text-xl font-bold text-[#0a0a0a]">{formatCurrency(purchasePrice)}</span>
          </div>
          <input
            type="range"
            min={1750000}
            max={2500000}
            step={25000}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ background: sliderTrack(pricePct) }}
          />
          <div className="flex justify-between text-xs text-[#0a0a0a]/40 mt-1">
            <span>$1,750,000</span>
            <span>$2,500,000</span>
          </div>
        </div>

        {/* Down Payment Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#0a0a0a]">Down Payment</label>
            <span className="text-xl font-bold text-[#0a0a0a]">{formatCurrency(effectiveDownClamped)}</span>
          </div>
          <input
            type="range"
            min={300000}
            max={maxCash}
            step={10000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ background: sliderTrack(downPct) }}
          />
          <div className="flex justify-between text-xs text-[#0a0a0a]/40 mt-1">
            <span>$300,000</span>
            <span>{formatCurrency(maxCash)}</span>
          </div>
          {downClamped && (
            <div className="mt-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              ⚠️ Minimum down payment of {formatCurrency(Math.ceil(minDown))} required to stay at {maxLTV}% LTV. Adjusted automatically.
            </div>
          )}
          {overCash && (
            <div className="mt-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              ⚠️ Capped at {formatCurrency(maxCash)} max available cash.
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#f8f7f4] rounded-xl border border-[#0a0a0a]/5 p-4 text-center">
          <div className="text-xs text-[#0a0a0a]/50 uppercase tracking-wide mb-1">Loan Amount</div>
          <div className="text-lg font-bold text-[#0a0a0a]">{formatCurrency(loanAmount)}</div>
        </div>
        <div className="bg-[#f8f7f4] rounded-xl border border-[#0a0a0a]/5 p-4 text-center">
          <div className="text-xs text-[#0a0a0a]/50 uppercase tracking-wide mb-1">LTV</div>
          <div className="text-lg font-bold text-[#0a0a0a]">{ltv.toFixed(1)}%</div>
        </div>
        <div className="bg-[#f8f7f4] rounded-xl border border-[#0a0a0a]/5 p-4 text-center">
          <div className="text-xs text-[#0a0a0a]/50 uppercase tracking-wide mb-1">Down %</div>
          <div className="text-lg font-bold text-[#0a0a0a]">{downPercent.toFixed(1)}%</div>
        </div>
        <div className="bg-[#f8f7f4] rounded-xl border border-[#0a0a0a]/5 p-4 text-center">
          <div className="text-xs text-[#0a0a0a]/50 uppercase tracking-wide mb-1">Type</div>
          <div className={`text-lg font-bold ${scenario.isConforming ? 'text-emerald-600' : 'text-amber-600'}`}>
            {scenario.isConforming ? 'Conforming' : 'Jumbo'}
          </div>
        </div>
      </div>

      {/* Monthly Payment Breakdown */}
      <div className="bg-[#f8f7f4] rounded-2xl border-2 border-[#0a0a0a]/5 p-6 mb-6">
        <div className="text-center mb-6">
          <div className="text-xs text-[#0a0a0a]/50 uppercase tracking-wide mb-1">Estimated Monthly Payment</div>
          <div className="text-4xl font-bold text-[#0a0a0a]">{formatCurrencyFull(scenario.monthlyPITIA)}</div>
          <div className="text-sm text-[#0a0a0a]/50 mt-1">PITIA — Principal, Interest, Taxes & Insurance</div>
        </div>

        {/* Visual Breakdown Bar */}
        <div className="h-6 rounded-full overflow-hidden flex mb-6">
          <div
            className="h-full bg-[#0066FF] transition-all duration-300"
            style={{ width: `${piPct}%` }}
            title={`P&I: ${formatCurrencyFull(scenario.monthlyPI)}`}
          />
          <div
            className="h-full bg-[#FFBA00] transition-all duration-300"
            style={{ width: `${taxPct}%` }}
            title={`Tax: ${formatCurrencyFull(scenario.monthlyTax)}`}
          />
          <div
            className="h-full bg-[#22E8E8] transition-all duration-300"
            style={{ width: `${insPct}%` }}
            title={`Insurance: ${formatCurrencyFull(scenario.monthlyInsurance)}`}
          />
        </div>

        {/* Breakdown Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#0066FF]" />
              <span className="text-sm text-[#0a0a0a]">Principal & Interest</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#0a0a0a]">{formatCurrencyFull(scenario.monthlyPI)}</span>
              <span className="text-xs text-[#0a0a0a]/40 ml-2">{piPct.toFixed(0)}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#FFBA00]" />
              <span className="text-sm text-[#0a0a0a]">Property Taxes</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#0a0a0a]">{formatCurrencyFull(scenario.monthlyTax)}</span>
              <span className="text-xs text-[#0a0a0a]/40 ml-2">{taxPct.toFixed(0)}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#22E8E8]" />
              <span className="text-sm text-[#0a0a0a]">Homeowners Insurance</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#0a0a0a]">{formatCurrencyFull(scenario.monthlyInsurance)}</span>
              <span className="text-xs text-[#0a0a0a]/40 ml-2">{insPct.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cash to Close */}
      <div className="bg-[#f8f7f4] rounded-2xl border-2 border-[#0a0a0a]/5 p-6 mb-6">
        <h3 className="text-sm font-bold text-[#0a0a0a] mb-4 uppercase tracking-wide">Estimated Cash to Close</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[#0a0a0a]/60">Down Payment</span>
            <span className="font-medium text-[#0a0a0a]">{formatCurrency(effectiveDownClamped)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#0a0a0a]/60">Closing Costs (est. 2%)</span>
            <span className="font-medium text-[#0a0a0a]">{formatCurrency(scenario.closingCosts)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#0a0a0a]/60">Prepaids & Escrow</span>
            <span className="font-medium text-[#0a0a0a]">$5,000</span>
          </div>
          <div className="flex justify-between text-sm pt-3 border-t border-[#0a0a0a]/10">
            <span className="font-bold text-[#0a0a0a]">Total Cash Needed</span>
            <span className={`font-bold text-lg ${scenario.cashRequired <= maxCash ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(scenario.cashRequired)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[#0a0a0a]/40">Available Funds</span>
            <span className="text-[#0a0a0a]/40">{formatCurrency(maxCash)}</span>
          </div>
        </div>
      </div>

      {/* Loan Details */}
      <div className="bg-[#0a0a0a]/[0.03] rounded-xl p-6 text-sm text-[#0a0a0a]/60 space-y-1 mb-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Rate: {interestRate.toFixed(3)}% fixed</span>
          <span>Term: {amortization} years</span>
          <span>Tax Rate: {propertyTaxRate}%</span>
          <span>Insurance: 0.15% annually</span>
          <span>Program: Conventional</span>
          <span>Max LTV: {maxLTV}%</span>
        </div>
        <p className="text-xs text-[#0a0a0a]/40 pt-3">
          ⚠️ Estimates for discussion purposes only. Final terms subject to full underwriting, credit review, appraisal, and lender guidelines.
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
