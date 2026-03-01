'use client'

import { useState, useMemo, useEffect } from 'react'

export default function PamelaDSCRPage() {
  // Input states
  const [purchasePrice, setPurchasePrice] = useState(400000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(25)
  const [interestRate, setInterestRate] = useState(7.5)
  const [annualTax, setAnnualTax] = useState(3600) // Will update based on purchase price
  const [annualInsurance, setAnnualInsurance] = useState(1200)
  const [monthlyHOA, setMonthlyHOA] = useState(0)
  const [rentInput, setRentInput] = useState(2800)
  const [rentFrequency, setRentFrequency] = useState<'monthly' | 'annual'>('monthly')
  const [rentType, setRentType] = useState<'long-term' | 'short-term'>('long-term')
  const [userAdjustedRate, setUserAdjustedRate] = useState(false)

  // Update tax default when purchase price changes (unless user has manually edited it)
  useEffect(() => {
    const defaultTax = purchasePrice * 0.009
    // Only auto-update if the current value is close to the default from previous price
    // This is a simple heuristic - in production you might want a "lock" toggle
    if (!userAdjustedRate && Math.abs(annualTax / purchasePrice - 0.009) < 0.002) {
      setAnnualTax(defaultTax)
    }
  }, [purchasePrice])

  // Calculations
  const downPayment = useMemo(() => purchasePrice * (downPaymentPercent / 100), [purchasePrice, downPaymentPercent])
  const loanAmount = useMemo(() => purchasePrice - downPayment, [purchasePrice, downPayment])
  
  // Monthly P&I using standard mortgage formula
  const monthlyPI = useMemo(() => {
    const principal = loanAmount
    const monthlyRate = interestRate / 100 / 12
    const months = 360 // 30-year
    
    if (monthlyRate === 0) return principal / months
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }, [loanAmount, interestRate])

  const monthlyTax = useMemo(() => annualTax / 12, [annualTax])
  const monthlyInsurance = useMemo(() => annualInsurance / 12, [annualInsurance])
  
  // PITIA = Principal + Interest + Taxes + Insurance + Association
  const monthlyPITIA = useMemo(() => {
    return monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA
  }, [monthlyPI, monthlyTax, monthlyInsurance, monthlyHOA])

  // Rent conversion to monthly
  const monthlyRent = useMemo(() => {
    return rentFrequency === 'annual' ? rentInput / 12 : rentInput
  }, [rentInput, rentFrequency])

  // Rent adjustment based on type
  const effectiveRent = useMemo(() => {
    return rentType === 'short-term' ? monthlyRent * 0.80 : monthlyRent
  }, [monthlyRent, rentType])

  // DSCR calculation
  const rawDSCR = useMemo(() => {
    if (monthlyPITIA === 0) return 0
    return effectiveRent / monthlyPITIA
  }, [effectiveRent, monthlyPITIA])

  // Special rule: if DSCR < 0.75, adjust rate to 8.0%
  const [appliedRate, actualDSCR, showWarning] = useMemo(() => {
    if (rawDSCR < 0.75 && interestRate !== 8.0) {
      // Recalculate with 8.0% rate
      const adjustedMonthlyRate = 8.0 / 100 / 12
      const months = 360
      const adjustedPI = loanAmount * (adjustedMonthlyRate * Math.pow(1 + adjustedMonthlyRate, months)) / 
                         (Math.pow(1 + adjustedMonthlyRate, months) - 1)
      const adjustedPITIA = adjustedPI + monthlyTax + monthlyInsurance + monthlyHOA
      const adjustedDSCR = effectiveRent / adjustedPITIA
      return [8.0, adjustedDSCR, true]
    }
    return [interestRate, rawDSCR, false]
  }, [rawDSCR, interestRate, loanAmount, monthlyTax, monthlyInsurance, monthlyHOA, effectiveRent])

  // Recalculate monthly PITIA with applied rate for display
  const displayMonthlyPI = useMemo(() => {
    const principal = loanAmount
    const monthlyRate = appliedRate / 100 / 12
    const months = 360
    
    if (monthlyRate === 0) return principal / months
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }, [loanAmount, appliedRate])

  const displayPITIA = useMemo(() => {
    return displayMonthlyPI + monthlyTax + monthlyInsurance + monthlyHOA
  }, [displayMonthlyPI, monthlyTax, monthlyInsurance, monthlyHOA])

  const cashFlow = useMemo(() => effectiveRent - displayPITIA, [effectiveRent, displayPITIA])

  // DSCR color coding
  const dscrColor = useMemo(() => {
    if (actualDSCR >= 1.25) return 'text-emerald-600'
    if (actualDSCR >= 1.0) return 'text-yellow-600'
    if (actualDSCR >= 0.75) return 'text-orange-600'
    return 'text-red-600'
  }, [actualDSCR])

  const dscrBgColor = useMemo(() => {
    if (actualDSCR >= 1.25) return 'bg-emerald-50 border-emerald-200'
    if (actualDSCR >= 1.0) return 'bg-yellow-50 border-yellow-200'
    if (actualDSCR >= 0.75) return 'bg-orange-50 border-orange-200'
    return 'bg-red-50 border-red-200'
  }, [actualDSCR])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Custom slider component
  const Slider = ({ 
    value, 
    onChange, 
    min, 
    max, 
    step = 1,
    format = (v: number) => v.toString()
  }: {
    value: number
    onChange: (value: number) => void
    min: number
    max: number
    step?: number
    format?: (value: number) => string
  }) => {
    const percentage = ((value - min) / (max - min)) * 100
    
    return (
      <div className="relative pt-8">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-midnight/10 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #0066FF 0%, #0066FF ${percentage}%, rgb(10 10 10 / 0.1) ${percentage}%, rgb(10 10 10 / 0.1) 100%)`
          }}
        />
        <div 
          className="absolute -top-8 bg-midnight text-cream px-2 py-1 rounded text-xs font-medium pointer-events-none whitespace-nowrap"
          style={{ left: `clamp(0px, calc(${percentage}% - 20px), calc(100% - 60px))` }}
        >
          {format(value)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl text-midnight mb-2">Pamela's DSCR Calculator</h1>
        <p className="text-midnight/60 text-lg">
          Investment property analysis for Brookings, OR
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Inputs (3 columns) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Property Details */}
          <section className="bg-cream rounded-2xl border-2 border-midnight/5 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-ocean/10 rounded-xl flex items-center justify-center">
                <span className="text-xl">🏡</span>
              </div>
              <h2 className="font-display text-2xl text-midnight">Property Details</h2>
            </div>

            <div className="space-y-6">
              {/* Purchase Price */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Purchase Price
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Slider
                      value={purchasePrice}
                      onChange={setPurchasePrice}
                      min={100000}
                      max={2000000}
                      step={10000}
                      format={formatCurrency}
                    />
                  </div>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-32 bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Down Payment: {downPaymentPercent}% ({formatCurrency(downPayment)})
                </label>
                <Slider
                  value={downPaymentPercent}
                  onChange={setDownPaymentPercent}
                  min={10}
                  max={30}
                  step={1}
                  format={(v) => `${v}%`}
                />
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Interest Rate: {interestRate.toFixed(2)}%
                </label>
                <Slider
                  value={interestRate}
                  onChange={(val) => {
                    setInterestRate(val)
                    setUserAdjustedRate(true)
                  }}
                  min={6.0}
                  max={8.25}
                  step={0.125}
                  format={(v) => `${v.toFixed(2)}%`}
                />
              </div>

              {/* Property Tax */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Annual Property Tax (default: 0.9% of purchase)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-midnight/50">$</span>
                  <input
                    type="number"
                    value={Math.round(annualTax)}
                    onChange={(e) => {
                      setAnnualTax(Number(e.target.value))
                      setUserAdjustedRate(true)
                    }}
                    className="flex-1 bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                  <button
                    onClick={() => {
                      setAnnualTax(purchasePrice * 0.009)
                      setUserAdjustedRate(false)
                    }}
                    className="text-xs text-ocean hover:underline"
                  >
                    Reset to 0.9%
                  </button>
                </div>
              </div>

              {/* Insurance */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Annual Insurance
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-midnight/50">$</span>
                  <input
                    type="number"
                    value={annualInsurance}
                    onChange={(e) => setAnnualInsurance(Number(e.target.value))}
                    className="flex-1 bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
              </div>

              {/* HOA */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Monthly HOA (optional)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-midnight/50">$</span>
                  <input
                    type="number"
                    value={monthlyHOA}
                    onChange={(e) => setMonthlyHOA(Number(e.target.value))}
                    placeholder="0"
                    className="flex-1 bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Rent Details */}
          <section className="bg-cream rounded-2xl border-2 border-midnight/5 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <h2 className="font-display text-2xl text-midnight">Rental Income</h2>
            </div>

            <div className="space-y-6">
              {/* Rent Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-3">
                  Rental Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setRentType('long-term')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      rentType === 'long-term'
                        ? 'bg-ocean text-white ring-2 ring-ocean/20'
                        : 'bg-white border border-midnight/10 text-midnight/60 hover:border-ocean/30'
                    }`}
                  >
                    Long Term
                    <div className="text-xs opacity-70 mt-1">100% rent</div>
                  </button>
                  <button
                    onClick={() => setRentType('short-term')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      rentType === 'short-term'
                        ? 'bg-ocean text-white ring-2 ring-ocean/20'
                        : 'bg-white border border-midnight/10 text-midnight/60 hover:border-ocean/30'
                    }`}
                  >
                    Short Term
                    <div className="text-xs opacity-70 mt-1">80% rent</div>
                  </button>
                </div>
              </div>

              {/* Rent Input */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Rent Estimate
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center flex-1 gap-2">
                    <span className="text-xs text-midnight/50">$</span>
                    <input
                      type="number"
                      value={rentInput}
                      onChange={(e) => setRentInput(Number(e.target.value))}
                      className="flex-1 bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                    />
                  </div>
                  <select
                    value={rentFrequency}
                    onChange={(e) => setRentFrequency(e.target.value as 'monthly' | 'annual')}
                    className="bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  >
                    <option value="monthly">/ month</option>
                    <option value="annual">/ year</option>
                  </select>
                </div>
                <p className="text-xs text-midnight/50 mt-2">
                  Monthly rent: {formatCurrency(monthlyRent)} → Effective: {formatCurrency(effectiveRent)}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Results (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* DSCR Result Card */}
          <div className={`rounded-2xl border-2 p-6 ${dscrBgColor}`}>
            {showWarning && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-700">
                ⚠️ DSCR below 0.75 — rate adjusted to 8.0%
              </div>
            )}
            
            <div className="text-center mb-6">
              <div className="text-xs uppercase tracking-wider text-midnight/50 font-medium mb-2">
                DSCR
              </div>
              <div className={`font-display text-6xl font-bold ${dscrColor} mb-2`}>
                {actualDSCR.toFixed(2)}
              </div>
              {showWarning && (
                <div className="text-xs text-midnight/60">
                  (Rate adjusted to {appliedRate.toFixed(2)}%)
                </div>
              )}
            </div>

            {/* Visual gauge */}
            <div className="mb-6">
              <div className="h-3 bg-midnight/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    actualDSCR >= 1.25 ? 'bg-emerald-500' :
                    actualDSCR >= 1.0 ? 'bg-yellow-500' :
                    actualDSCR >= 0.75 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(actualDSCR / 1.5 * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-midnight/40 mt-1">
                <span>0.00</span>
                <span>0.75</span>
                <span>1.00</span>
                <span>1.25</span>
              </div>
            </div>

            {/* Loan Amount */}
            <div className="bg-white/50 rounded-lg p-3 mb-4">
              <div className="text-xs text-midnight/60 mb-1">Loan Amount</div>
              <div className="font-display text-2xl text-midnight">
                {formatCurrency(loanAmount)}
              </div>
            </div>

            {/* Cash Flow */}
            <div className="bg-white/50 rounded-lg p-3 mb-4">
              <div className="text-xs text-midnight/60 mb-1">Monthly Cash Flow</div>
              <div className={`font-display text-2xl ${cashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(cashFlow)}
              </div>
            </div>

            {/* PITIA Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="font-medium text-midnight mb-3">Monthly PITIA Breakdown</div>
              
              <div className="flex justify-between text-midnight/70">
                <span>Principal & Interest</span>
                <span className="font-mono">{formatCurrency(displayMonthlyPI)}</span>
              </div>
              
              <div className="flex justify-between text-midnight/70">
                <span>Property Tax</span>
                <span className="font-mono">{formatCurrency(monthlyTax)}</span>
              </div>
              
              <div className="flex justify-between text-midnight/70">
                <span>Insurance</span>
                <span className="font-mono">{formatCurrency(monthlyInsurance)}</span>
              </div>
              
              <div className="flex justify-between text-midnight/70">
                <span>HOA</span>
                <span className="font-mono">{formatCurrency(monthlyHOA)}</span>
              </div>
              
              <div className="flex justify-between pt-2 border-t border-midnight/20 font-bold text-midnight">
                <span>Total PITIA</span>
                <span className="font-mono">{formatCurrency(displayPITIA)}</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-midnight/20 font-bold text-midnight">
                <span>Effective Rent</span>
                <span className="font-mono">{formatCurrency(effectiveRent)}</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-midnight/5 rounded-xl p-4 text-xs text-midnight/70">
            <div className="font-medium text-midnight mb-2">About DSCR</div>
            <div className="space-y-1">
              <p>• <span className="text-emerald-600 font-medium">≥ 1.25:</span> Strong</p>
              <p>• <span className="text-yellow-600 font-medium">1.0-1.24:</span> Good</p>
              <p>• <span className="text-orange-600 font-medium">0.75-0.99:</span> Marginal</p>
              <p>• <span className="text-red-600 font-medium">&lt; 0.75:</span> Below threshold</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
