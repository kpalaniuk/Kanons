'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

type LoanProgram = 'Conventional' | 'FHA' | 'VA'
type PropertyType = 'Single Family' | 'Condo' | '2-Unit' | '3-4 Unit'

interface Scenario {
  price: number
  downPaymentPercent: number
  loanAmount: number
  monthlyPI: number
  pmi: number
  monthlyPITIA: number
  dti: number
  qualifies: boolean
  cashRequired: number
  isConforming: boolean
  ltv: number
}

export default function PurchaseScenarioBuilderPage() {
  // Client Info
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [ficoScore, setFicoScore] = useState(720)
  const [monthlyIncome, setMonthlyIncome] = useState(8000)
  const [monthlyDebts, setMonthlyDebts] = useState(500)
  const [availableAssets, setAvailableAssets] = useState(150000)

  // Property
  const [priceMin, setPriceMin] = useState(500000)
  const [priceMax, setPriceMax] = useState(800000)
  const [highCostArea, setHighCostArea] = useState(false)
  const [propertyType, setPropertyType] = useState<PropertyType>('Single Family')
  const [loanProgram, setLoanProgram] = useState<LoanProgram>('Conventional')

  // Financing
  const [interestRate, setInterestRate] = useState(6.5)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [amortization, setAmortization] = useState<30 | 20 | 15>(30)
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.1)
  const [annualInsurance, setAnnualInsurance] = useState(1800)
  const [monthlyHOA, setMonthlyHOA] = useState(0)

  // View toggle
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid')

  // Constants
  const conformingLimit = highCostArea ? 1149825 : 766550
  const maxDTI = loanProgram === 'Conventional' ? 45 : loanProgram === 'FHA' ? 56.9 : 50

  // PMI Rate Table
  const getPMIRate = (ltv: number, fico: number, program: LoanProgram): number => {
    if (program === 'VA') return 0 // VA has no PMI
    if (ltv <= 80) return 0

    if (program === 'FHA') {
      // FHA MIP rates
      if (ltv > 95) return 0.55
      return 0.50
    }

    // Conventional PMI rates
    const ficoTier = 
      fico >= 760 ? 0 :
      fico >= 740 ? 1 :
      fico >= 720 ? 2 :
      fico >= 700 ? 3 :
      fico >= 680 ? 4 :
      fico >= 660 ? 5 : 6

    const ltvTier =
      ltv <= 80 ? 0 :
      ltv <= 85 ? 1 :
      ltv <= 90 ? 2 :
      ltv <= 95 ? 3 : 4

    const rateTable = [
      [0, 0, 0, 0, 0, 0, 0],           // ≤80%
      [0.15, 0.20, 0.26, 0.32, 0.43, 0.54, 0.65],  // 80-85%
      [0.30, 0.38, 0.46, 0.54, 0.72, 0.90, 1.08],  // 85-90%
      [0.46, 0.55, 0.65, 0.78, 0.96, 1.15, 1.36],  // 90-95%
      [0.58, 0.68, 0.82, 0.96, 1.15, 1.36, 1.52],  // 95-97%
    ]

    return rateTable[ltvTier]?.[ficoTier] || 0
  }

  // Calculate monthly P&I
  const calculateMonthlyPayment = (loanAmount: number, rate: number, years: number): number => {
    const monthlyRate = rate / 100 / 12
    const months = years * 12
    
    if (monthlyRate === 0) return loanAmount / months
    
    return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }

  // Generate scenarios
  const scenarios = useMemo(() => {
    const results: Scenario[] = []
    const priceStep = 50000
    const downPaymentOptions = [5, 10, 15, 20, 25]

    // Generate price points
    const pricePoints: number[] = []
    for (let price = priceMin; price <= priceMax; price += priceStep) {
      pricePoints.push(price)
    }

    // Generate scenarios for each price point and down payment
    for (const price of pricePoints) {
      for (const dpPercent of downPaymentOptions) {
        const downPayment = price * (dpPercent / 100)
        const loanAmount = price - downPayment
        const ltv = (loanAmount / price) * 100

        // Add FHA upfront MIP if applicable
        const upfrontMIP = loanProgram === 'FHA' ? loanAmount * 0.0175 : 0
        const totalLoanAmount = loanAmount + upfrontMIP

        // Calculate monthly P&I
        const monthlyPI = calculateMonthlyPayment(totalLoanAmount, interestRate, amortization)

        // Calculate PMI/MI
        const annualPMIRate = getPMIRate(ltv, ficoScore, loanProgram)
        const monthlyPMI = (loanAmount * annualPMIRate) / 100 / 12

        // Calculate PITIA
        const monthlyTax = (price * propertyTaxRate / 100) / 12
        const monthlyInsurance = annualInsurance / 12
        const monthlyPITIA = monthlyPI + monthlyPMI + monthlyTax + monthlyInsurance + monthlyHOA

        // Calculate DTI
        const backEndDTI = ((monthlyPITIA + monthlyDebts) / monthlyIncome) * 100

        // Check if qualifies
        const qualifies = backEndDTI <= maxDTI

        // Calculate cash required
        const closingCosts = loanAmount * 0.03
        const prepaids = 3000
        const cashRequired = downPayment + closingCosts + prepaids

        // Check if conforming
        const isConforming = loanAmount <= conformingLimit

        results.push({
          price,
          downPaymentPercent: dpPercent,
          loanAmount,
          monthlyPI,
          pmi: monthlyPMI,
          monthlyPITIA,
          dti: backEndDTI,
          qualifies,
          cashRequired,
          isConforming,
          ltv
        })
      }
    }

    return results
  }, [priceMin, priceMax, ficoScore, monthlyIncome, monthlyDebts, interestRate, amortization, propertyTaxRate, annualInsurance, monthlyHOA, loanProgram, highCostArea])

  // Get qualification color
  const getQualificationStyle = (scenario: Scenario) => {
    if (!scenario.qualifies) {
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: '❌' }
    }
    if (scenario.dti > maxDTI * 0.9) {
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: '⚠️' }
    }
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: '✅' }
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatCurrencyShort = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`
    }
    return formatCurrency(value)
  }

  // Group scenarios by price
  const scenariosByPrice = useMemo(() => {
    const grouped = new Map<number, Scenario[]>()
    scenarios.forEach(s => {
      if (!grouped.has(s.price)) {
        grouped.set(s.price, [])
      }
      grouped.get(s.price)!.push(s)
    })
    return Array.from(grouped.entries()).sort((a, b) => a[0] - b[0])
  }, [scenarios])

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
        
        <h1 className="font-display text-4xl text-midnight mb-2">Purchase Scenario Builder</h1>
        <p className="text-midnight/60 text-lg">
          Compare purchase price scenarios across different down payment options — your killer feature for client consultations
        </p>
      </motion.div>

      {/* Input Sections */}
      <div className="space-y-8 mb-12">
        {/* Client Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-cream rounded-2xl border-2 border-midnight/5 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-cyan/10 rounded-xl flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <h2 className="font-display text-2xl text-midnight">Client Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Name & Phone */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-2">Phone Number</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
              />
            </div>

            {/* FICO */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">
                FICO Score: {ficoScore}
              </label>
              <Slider
                value={ficoScore}
                onChange={setFicoScore}
                min={580}
                max={850}
                step={1}
                format={(v) => v.toString()}
              />
            </div>

            {/* Monthly Income */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">Monthly Gross Income</label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
              />
            </div>

            {/* Monthly Debts */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">Monthly Debt Payments</label>
              <input
                type="number"
                value={monthlyDebts}
                onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
              />
            </div>

            {/* Available Assets */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">Available Assets/Funds</label>
              <input
                type="number"
                value={availableAssets}
                onChange={(e) => setAvailableAssets(Number(e.target.value))}
                className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
              />
            </div>
          </div>
        </motion.section>

        {/* Property & Financing */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-cream rounded-2xl border-2 border-midnight/5 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-ocean/10 rounded-xl flex items-center justify-center">
              <span className="text-xl">🏡</span>
            </div>
            <h2 className="font-display text-2xl text-midnight">Property & Financing</h2>
          </div>

          <div className="space-y-6">
            {/* Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Min Purchase Price
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Slider
                      value={priceMin}
                      onChange={setPriceMin}
                      min={200000}
                      max={2000000}
                      step={50000}
                      format={formatCurrencyShort}
                    />
                  </div>
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    className="w-32 bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Max Purchase Price
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Slider
                      value={priceMax}
                      onChange={setPriceMax}
                      min={priceMin}
                      max={3000000}
                      step={50000}
                      format={formatCurrencyShort}
                    />
                  </div>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-32 bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
              </div>
            </div>

            {/* Conforming Limit */}
            <div className="flex items-center gap-3 bg-ocean/5 rounded-lg p-4">
              <input
                type="checkbox"
                id="highCost"
                checked={highCostArea}
                onChange={(e) => setHighCostArea(e.target.checked)}
                className="w-5 h-5 text-ocean border-midnight/20 rounded focus:ring-ocean focus:ring-2"
              />
              <label htmlFor="highCost" className="text-sm text-midnight cursor-pointer flex-1">
                <span className="font-bold">High-Cost Area</span> (San Diego, LA, SF, NYC, etc.)
                <div className="text-xs text-midnight/60 mt-1">
                  Conforming limit: {formatCurrency(conformingLimit)} {highCostArea ? '(High-Cost)' : '(Standard)'}
                </div>
              </label>
            </div>

            {/* Property Type & Loan Program */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-midnight mb-3">Property Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Single Family', 'Condo', '2-Unit', '3-4 Unit'] as PropertyType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setPropertyType(type)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        propertyType === type
                          ? 'bg-ocean text-white ring-2 ring-ocean/20'
                          : 'bg-white border border-midnight/10 text-midnight/60 hover:border-ocean/30'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight mb-3">Loan Program</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Conventional', 'FHA', 'VA'] as LoanProgram[]).map((program) => (
                    <button
                      key={program}
                      onClick={() => setLoanProgram(program)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        loanProgram === program
                          ? 'bg-ocean text-white ring-2 ring-ocean/20'
                          : 'bg-white border border-midnight/10 text-midnight/60 hover:border-ocean/30'
                      }`}
                    >
                      {program}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">
                Interest Rate: {interestRate.toFixed(3)}%
              </label>
              <Slider
                value={interestRate}
                onChange={setInterestRate}
                min={4}
                max={10}
                step={0.125}
                format={(v) => `${v.toFixed(3)}%`}
              />
            </div>

            {/* Amortization */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-3">Amortization</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 30, label: '30 Year' },
                  { value: 20, label: '20 Year' },
                  { value: 15, label: '15 Year' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAmortization(option.value as typeof amortization)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      amortization === option.value
                        ? 'bg-ocean text-white ring-2 ring-ocean/20'
                        : 'bg-white border border-midnight/10 text-midnight/60 hover:border-ocean/30'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tax Rate, Insurance, HOA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Property Tax Rate: {propertyTaxRate.toFixed(2)}%
                </label>
                <Slider
                  value={propertyTaxRate}
                  onChange={setPropertyTaxRate}
                  min={0.5}
                  max={3.0}
                  step={0.1}
                  format={(v) => `${v.toFixed(2)}%`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight mb-2">Annual Insurance</label>
                <input
                  type="number"
                  value={annualInsurance}
                  onChange={(e) => setAnnualInsurance(Number(e.target.value))}
                  className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight mb-2">Monthly HOA</label>
                <input
                  type="number"
                  value={monthlyHOA}
                  onChange={(e) => setMonthlyHOA(Number(e.target.value))}
                  className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                />
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-midnight">Scenario Comparison</h2>
          <p className="text-sm text-midnight/60">
            Max DTI for {loanProgram}: {maxDTI}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-ocean text-white'
                : 'bg-cream border border-midnight/10 text-midnight/60 hover:bg-midnight/5'
            }`}
          >
            📊 Grid View
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'cards'
                ? 'bg-ocean text-white'
                : 'bg-cream border border-midnight/10 text-midnight/60 hover:bg-midnight/5'
            }`}
          >
            📇 Card View
          </button>
        </div>
      </div>

      {/* Scenarios Display */}
      {viewMode === 'grid' ? (
        // Grid View
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-cream rounded-2xl border-2 border-midnight/5 p-6 overflow-x-auto"
        >
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-midnight/10">
                <th className="text-left py-3 px-2 text-midnight font-bold sticky left-0 bg-cream z-10">Price</th>
                <th className="text-center py-3 px-2 text-midnight font-bold">5% Down</th>
                <th className="text-center py-3 px-2 text-midnight font-bold">10% Down</th>
                <th className="text-center py-3 px-2 text-midnight font-bold">15% Down</th>
                <th className="text-center py-3 px-2 text-midnight font-bold">20% Down</th>
                <th className="text-center py-3 px-2 text-midnight font-bold">25% Down</th>
              </tr>
            </thead>
            <tbody>
              {scenariosByPrice.map(([price, priceScenarios]) => (
                <tr key={price} className="border-b border-midnight/5 hover:bg-midnight/5">
                  <td className="py-3 px-2 font-bold text-midnight sticky left-0 bg-cream z-10">
                    {formatCurrencyShort(price)}
                  </td>
                  {priceScenarios.map((scenario) => {
                    const style = getQualificationStyle(scenario)
                    const hasFunds = availableAssets >= scenario.cashRequired
                    return (
                      <td key={scenario.downPaymentPercent} className={`py-3 px-2 ${style.bg} ${style.border} border`}>
                        <div className="text-center space-y-1">
                          <div className={`font-bold ${style.text}`}>
                            {formatCurrency(scenario.monthlyPITIA)}
                          </div>
                          <div className={`text-[10px] ${style.text}`}>
                            {style.label} DTI: {scenario.dti.toFixed(1)}%
                          </div>
                          <div className="text-[9px] text-midnight/50">
                            {scenario.isConforming ? '✓ Conforming' : '⚠ Jumbo'}
                          </div>
                          <div className={`text-[9px] ${hasFunds ? 'text-emerald-600' : 'text-red-600'}`}>
                            Cash: {formatCurrencyShort(scenario.cashRequired)}
                          </div>
                          {scenario.pmi > 0 && (
                            <div className="text-[9px] text-midnight/50">
                              +{formatCurrency(scenario.pmi)} MI
                            </div>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ) : (
        // Card View
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {scenarios.map((scenario, idx) => {
            const style = getQualificationStyle(scenario)
            const hasFunds = availableAssets >= scenario.cashRequired
            return (
              <motion.div
                key={`${scenario.price}-${scenario.downPaymentPercent}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                className={`${style.bg} ${style.border} border-2 rounded-xl p-4`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-display text-lg font-bold text-midnight">
                      {formatCurrencyShort(scenario.price)}
                    </div>
                    <div className="text-xs text-midnight/60">
                      {scenario.downPaymentPercent}% Down ({formatCurrencyShort(scenario.price * scenario.downPaymentPercent / 100)})
                    </div>
                  </div>
                  <div className={`text-2xl ${style.text}`}>{style.label}</div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-midnight/60">Monthly PITIA:</span>
                    <span className={`font-bold ${style.text}`}>{formatCurrency(scenario.monthlyPITIA)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-midnight/60">DTI:</span>
                    <span className={`font-bold ${style.text}`}>{scenario.dti.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-midnight/60">LTV:</span>
                    <span className="font-medium text-midnight">{scenario.ltv.toFixed(1)}%</span>
                  </div>
                  {scenario.pmi > 0 && (
                    <div className="flex justify-between">
                      <span className="text-midnight/60">PMI/MI:</span>
                      <span className="font-medium text-midnight">{formatCurrency(scenario.pmi)}/mo</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-midnight/10">
                    <span className="text-midnight/60">Cash Required:</span>
                    <span className={`font-bold ${hasFunds ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(scenario.cashRequired)}
                    </span>
                  </div>
                  <div className="text-[10px] text-midnight/50">
                    {scenario.isConforming ? '✓ Conforming Loan' : '⚠️ Jumbo Loan'}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Info Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 bg-midnight/5 rounded-xl p-6"
      >
        <h3 className="font-display text-lg text-midnight mb-3">📖 Understanding the Scenarios</h3>
        <div className="text-sm text-midnight/70 space-y-2">
          <p>
            <strong>Color Coding:</strong> <span className="text-emerald-700">✅ Green</span> = Qualifies comfortably, <span className="text-amber-700">⚠️ Yellow</span> = Tight but qualifies, <span className="text-red-700">❌ Red</span> = Over DTI limit.
          </p>
          <p>
            <strong>DTI Limits:</strong> Conventional ≤45%, FHA ≤56.9%, VA ≤50%. Your client's back-end DTI = (PITIA + Other Debts) / Gross Income.
          </p>
          <p>
            <strong>Conforming vs Jumbo:</strong> Loans above {formatCurrency(conformingLimit)} are jumbo loans — typically higher rates and stricter requirements.
          </p>
          <p>
            <strong>PMI/MI:</strong> Required when LTV > 80% for conventional and all FHA loans. VA loans have no MI. Rates vary by credit score and LTV.
          </p>
          <p className="text-xs text-midnight/50">
            ⚠️ This tool provides guidance for client conversations. Final qualification depends on full underwriting, credit review, and lender overlays. Always verify with your pricing engine and underwriting guidelines.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
