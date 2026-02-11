'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function DSCRCalculatorPage() {
  // Property inputs
  const [purchasePrice, setPurchasePrice] = useState(300000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(25)
  const [zipCode, setZipCode] = useState('')
  const [annualTaxes, setAnnualTaxes] = useState(3600)
  const [annualInsurance, setAnnualInsurance] = useState(1200)
  const [monthlyHOA, setMonthlyHOA] = useState(0)
  
  // Income inputs
  const [grossMonthlyRent, setGrossMonthlyRent] = useState(2500)
  const [vacancyFactor, setVacancyFactor] = useState(80)
  
  // Financing inputs
  const [interestRate, setInterestRate] = useState(7.5)
  const [amortization, setAmortization] = useState<'30yr' | '40yr' | 'io'>('30yr')
  const [otherMonthlyPayments, setOtherMonthlyPayments] = useState(0)
  
  // Borrower inputs
  const [availableFunds, setAvailableFunds] = useState(100000)
  const [ficoScore, setFicoScore] = useState(720)

  // Calculations
  const loanAmount = useMemo(() => {
    return purchasePrice * (1 - downPaymentPercent / 100)
  }, [purchasePrice, downPaymentPercent])

  const downPayment = useMemo(() => {
    return purchasePrice * (downPaymentPercent / 100)
  }, [purchasePrice, downPaymentPercent])

  const closingCosts = useMemo(() => {
    return loanAmount * 0.03
  }, [loanAmount])

  const totalCashNeeded = useMemo(() => {
    return downPayment + closingCosts
  }, [downPayment, closingCosts])

  const monthlyPI = useMemo(() => {
    const principal = loanAmount
    const monthlyRate = interestRate / 100 / 12

    if (amortization === 'io') {
      return principal * monthlyRate
    }

    const months = amortization === '30yr' ? 360 : 480
    
    if (monthlyRate === 0) return principal / months
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1)
  }, [loanAmount, interestRate, amortization])

  const effectiveMonthlyRent = useMemo(() => {
    return grossMonthlyRent * (vacancyFactor / 100)
  }, [grossMonthlyRent, vacancyFactor])

  const monthlyPITIA = useMemo(() => {
    return monthlyPI + (annualTaxes / 12) + (annualInsurance / 12) + monthlyHOA + otherMonthlyPayments
  }, [monthlyPI, annualTaxes, annualInsurance, monthlyHOA, otherMonthlyPayments])

  const dscr = useMemo(() => {
    if (monthlyPITIA === 0) return 0
    return effectiveMonthlyRent / monthlyPITIA
  }, [effectiveMonthlyRent, monthlyPITIA])

  const monthlyCashFlow = useMemo(() => {
    return effectiveMonthlyRent - monthlyPITIA
  }, [effectiveMonthlyRent, monthlyPITIA])

  const annualCashFlow = useMemo(() => {
    return monthlyCashFlow * 12
  }, [monthlyCashFlow])

  const cashOnCashReturn = useMemo(() => {
    if (totalCashNeeded === 0) return 0
    return (annualCashFlow / totalCashNeeded) * 100
  }, [annualCashFlow, totalCashNeeded])

  const ltv = useMemo(() => {
    return (loanAmount / purchasePrice) * 100
  }, [loanAmount, purchasePrice])

  const hasSufficientFunds = useMemo(() => {
    return availableFunds >= totalCashNeeded
  }, [availableFunds, totalCashNeeded])

  // Qualification status
  const qualification = useMemo(() => {
    if (dscr >= 1.25) return { 
      status: 'strong', 
      label: 'Strong Qualification ✅', 
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      ring: 'ring-emerald-500/20'
    }
    if (dscr >= 1.15) return { 
      status: 'qualifies', 
      label: 'Qualifies ✅', 
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      ring: 'ring-blue-500/20'
    }
    if (dscr >= 1.00) return { 
      status: 'marginal', 
      label: 'Marginal ⚠️ — May qualify with compensating factors', 
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      ring: 'ring-amber-500/20'
    }
    return { 
      status: 'does-not-qualify', 
      label: 'Does Not Qualify ❌', 
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      ring: 'ring-red-500/20'
    }
  }, [dscr])

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
      <div className="relative">
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
          className="absolute -top-8 left-0 bg-midnight text-cream px-2 py-1 rounded text-xs font-medium pointer-events-none"
          style={{ left: `calc(${percentage}% - 20px)` }}
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

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  return (
    <div className="max-w-6xl mx-auto pb-24">
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
        
        <h1 className="font-display text-4xl text-midnight mb-2">DSCR Loan Calculator</h1>
        <p className="text-midnight/60 text-lg">
          Calculate Debt Service Coverage Ratio to determine investment property loan qualification
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-cream rounded-2xl border-2 border-midnight/5 p-6"
          >
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
                      max={5000000}
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
                  min={15}
                  max={40}
                  step={1}
                  format={(v) => `${v}%`}
                />
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Property Zip Code
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="e.g., 90210"
                  maxLength={5}
                  className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Annual Taxes */}
                <div>
                  <label className="block text-sm font-medium text-midnight mb-2">
                    Est. Annual Property Taxes
                  </label>
                  <input
                    type="number"
                    value={annualTaxes}
                    onChange={(e) => setAnnualTaxes(Number(e.target.value))}
                    className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>

                {/* Annual Insurance */}
                <div>
                  <label className="block text-sm font-medium text-midnight mb-2">
                    Est. Annual Insurance
                  </label>
                  <input
                    type="number"
                    value={annualInsurance}
                    onChange={(e) => setAnnualInsurance(Number(e.target.value))}
                    className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>

                {/* Monthly HOA */}
                <div>
                  <label className="block text-sm font-medium text-midnight mb-2">
                    Monthly HOA Dues
                  </label>
                  <input
                    type="number"
                    value={monthlyHOA}
                    onChange={(e) => setMonthlyHOA(Number(e.target.value))}
                    className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>

                {/* Other Monthly */}
                <div>
                  <label className="block text-sm font-medium text-midnight mb-2">
                    Other Monthly Payments
                  </label>
                  <input
                    type="number"
                    value={otherMonthlyPayments}
                    onChange={(e) => setOtherMonthlyPayments(Number(e.target.value))}
                    className="w-full bg-white border border-midnight/10 rounded-lg px-4 py-3 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Income & Expenses Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-cream rounded-2xl border-2 border-midnight/5 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <h2 className="font-display text-2xl text-midnight">Income & Expenses</h2>
            </div>

            <div className="space-y-6">
              {/* Gross Monthly Rent */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Estimated Gross Monthly Rent
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Slider
                      value={grossMonthlyRent}
                      onChange={setGrossMonthlyRent}
                      min={500}
                      max={15000}
                      step={100}
                      format={formatCurrency}
                    />
                  </div>
                  <input
                    type="number"
                    value={grossMonthlyRent}
                    onChange={(e) => setGrossMonthlyRent(Number(e.target.value))}
                    className="w-32 bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
              </div>

              {/* Vacancy Factor */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Vacancy Factor: {vacancyFactor}% (Effective Rent: {formatCurrency(effectiveMonthlyRent)}/mo)
                </label>
                <Slider
                  value={vacancyFactor}
                  onChange={setVacancyFactor}
                  min={50}
                  max={100}
                  step={5}
                  format={(v) => `${v}%`}
                />
                <p className="text-xs text-midnight/50 mt-2">
                  Accounts for potential vacancy, repairs, and collection issues. 80% is typical.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Financing Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-cream rounded-2xl border-2 border-midnight/5 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center">
                <span className="text-xl">🏦</span>
              </div>
              <h2 className="font-display text-2xl text-midnight">Financing</h2>
            </div>

            <div className="space-y-6">
              {/* Loan Amount (Display Only) */}
              <div className="bg-ocean/5 rounded-lg p-4 border border-ocean/10">
                <div className="text-xs uppercase tracking-wider text-ocean font-medium mb-1">
                  Loan Amount (Calculated)
                </div>
                <div className="font-display text-3xl text-midnight">
                  {formatCurrency(loanAmount)}
                </div>
                <div className="text-xs text-midnight/50 mt-1">
                  {formatCurrency(purchasePrice)} × {100 - downPaymentPercent}%
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
                  min={5}
                  max={12}
                  step={0.125}
                  format={(v) => `${v.toFixed(3)}%`}
                />
              </div>

              {/* Amortization */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-3">
                  Amortization Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: '30yr', label: '30 Year', months: '360 mo' },
                    { value: '40yr', label: '40 Year', months: '480 mo' },
                    { value: 'io', label: 'Interest Only', months: 'I/O' },
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
                      <div>{option.label}</div>
                      <div className="text-xs opacity-70">{option.months}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Borrower Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-cream rounded-2xl border-2 border-midnight/5 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan/10 rounded-xl flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <h2 className="font-display text-2xl text-midnight">Borrower Details</h2>
            </div>

            <div className="space-y-6">
              {/* Available Funds */}
              <div>
                <label className="block text-sm font-medium text-midnight mb-2">
                  Available Funds for Purchase
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Slider
                      value={availableFunds}
                      onChange={setAvailableFunds}
                      min={0}
                      max={2000000}
                      step={10000}
                      format={formatCurrency}
                    />
                  </div>
                  <input
                    type="number"
                    value={availableFunds}
                    onChange={(e) => setAvailableFunds(Number(e.target.value))}
                    className="w-32 bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
              </div>

              {/* FICO Score */}
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
            </div>
          </motion.section>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-1 space-y-6">
          {/* DSCR Result Card - Sticky */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="sticky top-6"
          >
            <div className={`rounded-2xl border-2 ${qualification.border} ${qualification.bg} p-6 shadow-lg`}>
              <div className="text-center mb-6">
                <div className="text-xs uppercase tracking-wider text-midnight/50 font-medium mb-2">
                  Debt Service Coverage Ratio
                </div>
                <motion.div
                  key={dscr}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, type: "spring" }}
                  className={`font-display text-7xl font-bold ${qualification.color} mb-3`}
                >
                  {dscr.toFixed(2)}
                </motion.div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${qualification.bg} ${qualification.color} ring-2 ${qualification.ring} font-medium text-sm`}>
                  {qualification.label}
                </div>
              </div>

              {/* Visual Gauge */}
              <div className="mb-6">
                <div className="h-3 bg-midnight/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((dscr / 1.5) * 100, 100)}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      dscr >= 1.25 ? 'bg-emerald-500' :
                      dscr >= 1.15 ? 'bg-blue-500' :
                      dscr >= 1.00 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-midnight/40 mt-1">
                  <span>0.00</span>
                  <span>1.00</span>
                  <span>1.25+</span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-midnight/10">
                  <span className="text-xs text-midnight/60">Monthly Cash Flow</span>
                  <span className={`font-medium text-sm ${monthlyCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {formatCurrency(monthlyCashFlow)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-midnight/10">
                  <span className="text-xs text-midnight/60">Annual Cash Flow</span>
                  <span className={`font-medium text-sm ${annualCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {formatCurrency(annualCashFlow)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-midnight/10">
                  <span className="text-xs text-midnight/60">Cash-on-Cash Return</span>
                  <span className={`font-medium text-sm ${cashOnCashReturn >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {cashOnCashReturn.toFixed(2)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-midnight/10">
                  <span className="text-xs text-midnight/60">Loan-to-Value (LTV)</span>
                  <span className="font-medium text-sm text-midnight">
                    {ltv.toFixed(2)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-midnight/60">Sufficient Funds?</span>
                  <span className={`font-medium text-sm ${hasSufficientFunds ? 'text-emerald-700' : 'text-red-700'}`}>
                    {hasSufficientFunds ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
              </div>

              {/* Funds Breakdown */}
              <div className="mt-6 pt-6 border-t border-midnight/10">
                <div className="text-xs uppercase tracking-wider text-midnight/50 font-medium mb-3">
                  Cash Required
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-midnight/60">Down Payment</span>
                    <span className="font-medium text-midnight">{formatCurrency(downPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-midnight/60">Est. Closing Costs (~3%)</span>
                    <span className="font-medium text-midnight">{formatCurrency(closingCosts)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-midnight/10 font-bold">
                    <span className="text-midnight">Total Cash Needed</span>
                    <span className="text-midnight">{formatCurrency(totalCashNeeded)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-midnight/60">Available Funds</span>
                    <span className={`font-medium ${hasSufficientFunds ? 'text-emerald-700' : 'text-red-700'}`}>
                      {formatCurrency(availableFunds)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-midnight">Shortfall/Surplus</span>
                    <span className={availableFunds - totalCashNeeded >= 0 ? 'text-emerald-700' : 'text-red-700'}>
                      {formatCurrency(availableFunds - totalCashNeeded)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 bg-cream rounded-2xl border-2 border-midnight/5 p-6"
            >
              <div className="text-xs uppercase tracking-wider text-midnight/50 font-medium mb-4">
                📊 How We Calculate DSCR
              </div>
              
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-midnight/60 mb-1">Effective Monthly Rent</div>
                  <div className="font-mono text-xs bg-midnight/5 rounded px-2 py-1">
                    {formatCurrency(grossMonthlyRent)} × {vacancyFactor}% = {formatCurrency(effectiveMonthlyRent)}
                  </div>
                </div>

                <div>
                  <div className="text-midnight/60 mb-1">Monthly P&I Payment</div>
                  <div className="font-mono text-xs bg-midnight/5 rounded px-2 py-1">
                    {formatCurrency(monthlyPI)}
                  </div>
                </div>

                <div>
                  <div className="text-midnight/60 mb-1">Monthly PITIA (Total Housing)</div>
                  <div className="font-mono text-xs bg-midnight/5 rounded px-2 py-1 mb-1">
                    {formatCurrency(monthlyPI)} + {formatCurrency(annualTaxes / 12)} + {formatCurrency(annualInsurance / 12)} + {formatCurrency(monthlyHOA)} + {formatCurrency(otherMonthlyPayments)}
                  </div>
                  <div className="font-mono text-xs bg-ocean/10 text-ocean rounded px-2 py-1 font-bold">
                    = {formatCurrency(monthlyPITIA)}
                  </div>
                </div>

                <div>
                  <div className="text-midnight/60 mb-1">DSCR Formula</div>
                  <div className="font-mono text-xs bg-midnight/5 rounded px-2 py-1 mb-1">
                    {formatCurrency(effectiveMonthlyRent)} ÷ {formatCurrency(monthlyPITIA)}
                  </div>
                  <div className={`font-mono text-xs ${qualification.bg} ${qualification.color} rounded px-2 py-1 font-bold`}>
                    = {dscr.toFixed(3)}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Info Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-12 bg-midnight/5 rounded-xl p-6"
      >
        <h3 className="font-display text-lg text-midnight mb-3">ℹ️ About DSCR Loans</h3>
        <div className="text-sm text-midnight/70 space-y-2">
          <p>
            <strong>DSCR (Debt Service Coverage Ratio)</strong> measures whether a property generates enough rental income to cover its debt obligations. Lenders use this to qualify investors without traditional income verification.
          </p>
          <p>
            <strong>Typical Requirements:</strong> DSCR ≥ 1.15-1.25 (varies by lender), FICO ≥ 680, 15-25% down payment. Rates are typically 0.5-1.5% higher than conventional mortgages.
          </p>
          <p className="text-xs text-midnight/50">
            ⚠️ This calculator provides estimates for planning purposes only. Actual qualification depends on lender guidelines, credit profile, and property specifics. Contact a loan officer for personalized guidance.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
