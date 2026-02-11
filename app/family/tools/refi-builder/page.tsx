'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

export default function RefiScenarioBuilderPage() {
  // Client info (optional)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  
  // Current loan details
  const [currentBalance, setCurrentBalance] = useState(350000)
  const [currentRate, setCurrentRate] = useState(6.5)
  const [currentPayment, setCurrentPayment] = useState(2212)
  const [currentTermRemaining, setCurrentTermRemaining] = useState(300)
  const [propertyValue, setPropertyValue] = useState(500000)
  
  // New loan details
  const [newRate, setNewRate] = useState(5.5)
  const [newTerm, setNewTerm] = useState<30 | 25 | 20 | 15>(30)
  const [closingCosts, setClosingCosts] = useState(7000)
  const [rollInClosingCosts, setRollInClosingCosts] = useState(true)
  const [cashOut, setCashOut] = useState(0)

  // Calculations
  const newLoanAmount = useMemo(() => {
    return currentBalance + (rollInClosingCosts ? closingCosts : 0) + cashOut
  }, [currentBalance, closingCosts, rollInClosingCosts, cashOut])

  const estimatedClosingCosts = useMemo(() => {
    return currentBalance * 0.02
  }, [currentBalance])

  const newMonthlyPayment = useMemo(() => {
    const principal = newLoanAmount
    const monthlyRate = newRate / 100 / 12
    const months = newTerm * 12
    
    if (monthlyRate === 0) return principal / months
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }, [newLoanAmount, newRate, newTerm])

  const monthlySavings = useMemo(() => {
    return currentPayment - newMonthlyPayment
  }, [currentPayment, newMonthlyPayment])

  const breakEvenMonths = useMemo(() => {
    if (monthlySavings <= 0) return Infinity
    const costs = rollInClosingCosts ? 0 : closingCosts
    return costs / monthlySavings
  }, [closingCosts, rollInClosingCosts, monthlySavings])

  const totalInterestCurrent = useMemo(() => {
    return (currentPayment * currentTermRemaining) - currentBalance
  }, [currentPayment, currentTermRemaining, currentBalance])

  const totalInterestNew = useMemo(() => {
    return (newMonthlyPayment * newTerm * 12) - newLoanAmount
  }, [newMonthlyPayment, newTerm, newLoanAmount])

  const interestSavings = useMemo(() => {
    return totalInterestCurrent - totalInterestNew
  }, [totalInterestCurrent, totalInterestNew])

  const currentLTV = useMemo(() => {
    return (currentBalance / propertyValue) * 100
  }, [currentBalance, propertyValue])

  const newLTV = useMemo(() => {
    return (newLoanAmount / propertyValue) * 100
  }, [newLoanAmount, propertyValue])

  const recommendation = useMemo(() => {
    if (breakEvenMonths < 36) {
      return {
        label: '✅ Strong Refinance Candidate',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        description: 'Break-even is less than 36 months. This is an excellent refinance opportunity.'
      }
    } else if (breakEvenMonths < 60) {
      return {
        label: '⚠️ Worth Considering',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        description: 'Break-even is under 5 years. Consider if you plan to keep the property long-term.'
      }
    } else if (breakEvenMonths === Infinity) {
      return {
        label: '❌ Payment Increases',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        description: 'Monthly payment would increase. This refinance may not make financial sense.'
      }
    } else {
      return {
        label: '❌ May Not Make Sense',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        description: 'Break-even is over 5 years. Only refinance if you have other strategic reasons.'
      }
    }
  }, [breakEvenMonths])

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
          className="absolute -top-8 bg-midnight text-cream px-2 py-1 rounded text-xs font-medium pointer-events-none whitespace-nowrap"% - 20px), calc(100% - 60px))` }}
        >
          {format(value)}
        </div>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div}}}
        className="mb-8"
      >
        <Link 
          href="/family/tools"
          className="inline-flex items-center gap-2 text-sm text-midnight/60 hover:text-midnight mb-4 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tools
        </Link>
        
        <h1 className="font-display text-4xl text-midnight mb-2">Refi Scenario Builder</h1>
        <p className="text-midnight/60 text-lg">
          Compare your current loan to refinance options with break-even analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Client Info (Optional) */}
          <section}}}
            className="bg-cream rounded-2xl border-2 border-midnight/5 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan/10 rounded-xl flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <h2 className="font-display text-2xl text-midnight">Client Info</h2>
                <p className="text-xs text-midnight/50">Optional — for saving/sharing scenarios</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                />
              </div>
            </div>
          </section>

          {/* Current Loan Section */}
          <section}}}
            className="bg-cream rounded-2xl border-2 border-midnight/5 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <h2 className="font-display text-2xl text-midnight">Current Loan</h2>
            </div>

            <div className="space-y-6">
              {/* Current Balance */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Current Loan Balance
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Slider
                      value={currentBalance}
                      onChange={setCurrentBalance}
                      min={50000}
                      max={2000000}
                      step={5000}
                      format={formatCurrency}
                    />
                  </div>
                  <input
                    type="number"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(Number(e.target.value))}
                    className="w-32 bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
              </div>

              {/* Current Rate */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Current Interest Rate: {currentRate.toFixed(3)}%
                </label>
                <Slider
                  value={currentRate}
                  onChange={setCurrentRate}
                  min={3}
                  max={10}
                  step={0.125}
                  format={(v) => `${v.toFixed(3)}%`}
                />
              </div>

              {/* Current Payment */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Current Monthly Payment (P&I)
                </label>
                <input
                  type="number"
                  value={currentPayment}
                  onChange={(e) => setCurrentPayment(Number(e.target.value))}
                  className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                />
              </div>

              {/* Term Remaining */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Term Remaining: {currentTermRemaining} months ({(currentTermRemaining / 12).toFixed(1)} years)
                </label>
                <Slider
                  value={currentTermRemaining}
                  onChange={setCurrentTermRemaining}
                  min={12}
                  max={360}
                  step={12}
                  format={(v) => `${v} mo`}
                />
              </div>

              {/* Property Value */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Current Property Value
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Slider
                      value={propertyValue}
                      onChange={setPropertyValue}
                      min={100000}
                      max={5000000}
                      step={10000}
                      format={formatCurrency}
                    />
                  </div>
                  <input
                    type="number"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(Number(e.target.value))}
                    className="w-32 bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* New Loan Section */}
          <section}}}
            className="bg-cream rounded-2xl border-2 border-midnight/5 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-ocean/10 rounded-xl flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <h2 className="font-display text-2xl text-midnight">New Loan Scenario</h2>
            </div>

            <div className="space-y-6">
              {/* New Rate */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  New Interest Rate: {newRate.toFixed(3)}%
                </label>
                <Slider
                  value={newRate}
                  onChange={setNewRate}
                  min={4}
                  max={9}
                  step={0.125}
                  format={(v) => `${v.toFixed(3)}%`}
                />
              </div>

              {/* New Term */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-3">
                  New Loan Term
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 30, label: '30 Year' },
                    { value: 25, label: '25 Year' },
                    { value: 20, label: '20 Year' },
                    { value: 15, label: '15 Year' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setNewTerm(option.value as typeof newTerm)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        newTerm === option.value
                          ? 'bg-ocean text-white ring-2 ring-ocean/20'
                          : 'bg-white border border-midnight/10 text-midnight/60 hover:border-ocean/30'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Closing Costs */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Estimated Closing Costs
                  <span className="text-xs text-midnight/50 ml-2">(Default: 2% of balance = {formatCurrency(estimatedClosingCosts)})</span>
                </label>
                <input
                  type="number"
                  value={closingCosts}
                  onChange={(e) => setClosingCosts(Number(e.target.value))}
                  className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                />
              </div>

              {/* Roll in costs checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="rollInCosts"
                  checked={rollInClosingCosts}
                  onChange={(e) => setRollInClosingCosts(e.target.checked)}
                  className="w-5 h-5 text-ocean border-midnight/20 rounded focus:ring-ocean focus:ring-2"
                />
                <label htmlFor="rollInCosts" className="text-sm text-midnight cursor-pointer">
                  Roll closing costs into new loan
                </label>
              </div>

              {/* Cash Out */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Cash-Out Amount (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Slider
                      value={cashOut}
                      onChange={setCashOut}
                      min={0}
                      max={200000}
                      step={5000}
                      format={formatCurrency}
                    />
                  </div>
                  <input
                    type="number"
                    value={cashOut}
                    onChange={(e) => setCashOut(Number(e.target.value))}
                    className="w-32 bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recommendation Card - Sticky */}
          <div}}}
            className="sticky top-6"
          >
            <div className={`rounded-2xl border-2 ${recommendation.border} ${recommendation.bg} p-6 shadow-lg`}>
              <div className="text-center mb-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${recommendation.bg} ${recommendation.color} ring-2 ring-current/20 font-bold text-sm mb-4`}>
                  {recommendation.label}
                </div>
                <p className="text-xs text-midnight/60 leading-relaxed">
                  {recommendation.description}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-midnight/10">
                  <span className="text-xs text-midnight/60">Monthly Savings</span>
                  <span className={`font-bold text-sm ${monthlySavings >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {monthlySavings >= 0 ? '+' : ''}{formatCurrency(monthlySavings)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-midnight/10">
                  <span className="text-xs text-midnight/60">Break-Even Point</span>
                  <span className="font-bold text-sm text-midnight">
                    {breakEvenMonths === Infinity ? 'N/A' : `${Math.ceil(breakEvenMonths)} months`}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-midnight/10">
                  <span className="text-xs text-midnight/60">Interest Savings</span>
                  <span className={`font-bold text-sm ${interestSavings >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {interestSavings >= 0 ? '+' : ''}{formatCurrency(interestSavings)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-midnight/60">New LTV</span>
                  <span className="font-bold text-sm text-midnight">
                    {newLTV.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="mt-6 pt-6 border-t border-midnight/10">
                <div className="text-xs uppercase tracking-wider text-midnight/50 font-medium mb-4">
                  Side-by-Side Comparison
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-midnight/10">
                        <th className="text-left py-2 text-midnight/60 font-medium"></th>
                        <th className="text-right py-2 text-midnight/60 font-medium">Current</th>
                        <th className="text-right py-2 text-ocean font-bold">New</th>
                      </tr>
                    </thead>
                    <tbody className="text-midnight">
                      <tr className="border-b border-midnight/5">
                        <td className="py-2 text-midnight/60">Loan Amount</td>
                        <td className="text-right font-mono">{formatCurrency(currentBalance)}</td>
                        <td className="text-right font-mono font-bold text-ocean">{formatCurrency(newLoanAmount)}</td>
                      </tr>
                      <tr className="border-b border-midnight/5">
                        <td className="py-2 text-midnight/60">Interest Rate</td>
                        <td className="text-right font-mono">{currentRate.toFixed(3)}%</td>
                        <td className="text-right font-mono font-bold text-ocean">{newRate.toFixed(3)}%</td>
                      </tr>
                      <tr className="border-b border-midnight/5">
                        <td className="py-2 text-midnight/60">Monthly P&I</td>
                        <td className="text-right font-mono">{formatCurrency(currentPayment)}</td>
                        <td className="text-right font-mono font-bold text-ocean">{formatCurrency(newMonthlyPayment)}</td>
                      </tr>
                      <tr className="border-b border-midnight/5">
                        <td className="py-2 text-midnight/60">Term Remaining</td>
                        <td className="text-right font-mono">{currentTermRemaining} mo</td>
                        <td className="text-right font-mono font-bold text-ocean">{newTerm * 12} mo</td>
                      </tr>
                      <tr className="border-b border-midnight/5">
                        <td className="py-2 text-midnight/60">LTV</td>
                        <td className="text-right font-mono">{currentLTV.toFixed(2)}%</td>
                        <td className="text-right font-mono font-bold text-ocean">{newLTV.toFixed(2)}%</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-midnight/60">Total Interest</td>
                        <td className="text-right font-mono">{formatCurrency(totalInterestCurrent)}</td>
                        <td className="text-right font-mono font-bold text-ocean">{formatCurrency(totalInterestNew)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Closing Costs Note */}
              {!rollInClosingCosts && (
                <div className="mt-6 pt-6 border-t border-midnight/10">
                  <div className="text-xs text-midnight/60 mb-2">
                    💰 <span className="font-bold">Cash Required at Closing:</span>
                  </div>
                  <div className="font-bold text-lg text-midnight">
                    {formatCurrency(closingCosts + cashOut)}
                  </div>
                  <div className="text-xs text-midnight/50 mt-1">
                    {closingCosts > 0 && `Closing costs: ${formatCurrency(closingCosts)}`}
                    {closingCosts > 0 && cashOut > 0 && ' + '}
                    {cashOut > 0 && `Cash-out: ${formatCurrency(cashOut)}`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div}}}
        className="mt-12 bg-midnight/5 rounded-xl p-6"
      >
        <h3 className="font-display text-lg text-midnight mb-3">💡 When to Refinance</h3>
        <div className="text-sm text-midnight/70 space-y-2">
          <p>
            <strong>Good Reasons:</strong> Lower interest rate (0.5%+ reduction), shorter term to build equity faster, cash-out for home improvements or debt consolidation, switching from ARM to fixed rate.
          </p>
          <p>
            <strong>Break-Even Rule:</strong> If you plan to stay in the home longer than the break-even period, refinancing usually makes sense. Under 36 months is excellent, 36-60 months is reasonable.
          </p>
          <p className="text-xs text-midnight/50">
            ⚠️ This calculator provides estimates only. Actual rates, costs, and savings depend on credit profile, property details, and lender terms. Consult your loan officer for personalized guidance.
          </p>
        </div>
      </div>
    </div>
  )
}
