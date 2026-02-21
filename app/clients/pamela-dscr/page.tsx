'use client'

import { useState, useEffect } from 'react'
import { Save, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface SavedScenario {
  id: string
  address: string
  purchasePrice: number
  downPayment: number
  monthlyRent: number
  rentType: 'long' | 'short'
  propertyTax: number
  insurance: number
  hoa: number
  interestOnly: boolean
  dscr: number
  timestamp: number
}

// ─── Rate Calculation (HomeXpress Sheet Logic) ───────────────────────────────
// FICO 726 = 720-739 range
// Base rate engineered to deliver AT LEAST 1.5% credit/rebate
// LTV adjustments applied based on down payment

function calculateRate(ltv: number, interestOnly: boolean): number {
  // Base rate that delivers ~1.5% credit for 726 FICO
  // These are example rates - adjust based on actual HomeXpress sheet
  let baseRate = 7.25
  
  // LTV adjustments (example pricing)
  if (ltv <= 70) {
    baseRate -= 0.125
  } else if (ltv <= 75) {
    baseRate -= 0.0
  } else if (ltv <= 80) {
    baseRate += 0.125
  } else if (ltv <= 85) {
    baseRate += 0.25
  } else {
    baseRate += 0.375
  }
  
  // Interest-only adds 0.125%
  if (interestOnly) {
    baseRate += 0.125
  }
  
  return baseRate
}

// ─── DSCR Calculation ────────────────────────────────────────────────────────

function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  interestOnly: boolean
): number {
  const monthlyRate = annualRate / 100 / 12
  
  if (interestOnly) {
    return principal * monthlyRate
  }
  
  // Standard 30-year amortization
  const numPayments = 360
  return (
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  )
}

function getDSCRColor(dscr: number): string {
  if (dscr >= 1.25) return 'text-green-600'
  if (dscr >= 1.0) return 'text-yellow-600'
  if (dscr >= 0.75) return 'text-orange-600'
  return 'text-red-600'
}

function getDSCRBgColor(dscr: number): string {
  if (dscr >= 1.25) return 'bg-green-50 border-green-200'
  if (dscr >= 1.0) return 'bg-yellow-50 border-yellow-200'
  if (dscr >= 0.75) return 'bg-orange-50 border-orange-200'
  return 'bg-red-50 border-red-200'
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PamelaDSCRCalculator() {
  // Primary inputs
  const [purchasePrice, setPurchasePrice] = useState(400000)
  const [downPayment, setDownPayment] = useState(25)
  const [monthlyRent, setMonthlyRent] = useState(3000)
  const [rentType, setRentType] = useState<'long' | 'short'>('long')
  
  // Secondary inputs (with defaults)
  const [propertyTaxRate, setPropertyTaxRate] = useState(0.9)
  const [insurance, setInsurance] = useState(1200)
  const [hoa, setHoa] = useState(0)
  const [interestOnly, setInterestOnly] = useState(false)
  
  // UI state
  const [showSecondary, setShowSecondary] = useState(false)
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([])
  const [saveAddress, setSaveAddress] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)
  
  // Load saved scenarios from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pamela-dscr-scenarios')
    if (saved) {
      setSavedScenarios(JSON.parse(saved))
    }
  }, [])
  
  // Calculations
  const loanAmount = purchasePrice * (1 - downPayment / 100)
  const ltv = 100 - downPayment
  const rate = calculateRate(ltv, interestOnly)
  const monthlyPI = calculateMonthlyPayment(loanAmount, rate, interestOnly)
  const monthlyTax = (purchasePrice * propertyTaxRate) / 100 / 12
  const monthlyInsurance = insurance / 12
  const monthlyHOA = hoa
  const monthlyPITIA = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA
  const effectiveRent = monthlyRent * (rentType === 'long' ? 1.0 : 0.8)
  const dscr = effectiveRent / monthlyPITIA
  const cashFlow = effectiveRent - monthlyPITIA
  
  // Dynamic down payment minimum
  const minDownPayment = dscr < 0.75 ? 30 : 10
  
  // Coaching message
  const getCoachingMessage = () => {
    if (dscr < 0.75) {
      return '⚠️ DSCR below 0.75 requires 30% down minimum'
    }
    if (dscr < 1.0) {
      // Calculate how much more down payment needed to reach 1.0 DSCR
      const targetDSCR = 1.0
      // Rough approximation - could be more precise
      const neededIncrease = Math.ceil((1 - dscr / targetDSCR) * 10)
      return `💡 Try increasing down payment by ~${neededIncrease}% to reach 1.0 DSCR`
    }
    return null
  }
  
  const coachingMessage = getCoachingMessage()
  
  // Save scenario
  const handleSave = () => {
    if (!saveAddress.trim()) return
    
    const scenario: SavedScenario = {
      id: Date.now().toString(),
      address: saveAddress,
      purchasePrice,
      downPayment,
      monthlyRent,
      rentType,
      propertyTax: propertyTaxRate,
      insurance,
      hoa,
      interestOnly,
      dscr,
      timestamp: Date.now(),
    }
    
    const updated = [...savedScenarios, scenario]
    setSavedScenarios(updated)
    localStorage.setItem('pamela-dscr-scenarios', JSON.stringify(updated))
    setSaveAddress('')
    setShowSaveModal(false)
  }
  
  // Load scenario
  const loadScenario = (scenario: SavedScenario) => {
    setPurchasePrice(scenario.purchasePrice)
    setDownPayment(scenario.downPayment)
    setMonthlyRent(scenario.monthlyRent)
    setRentType(scenario.rentType)
    setPropertyTaxRate(scenario.propertyTax)
    setInsurance(scenario.insurance)
    setHoa(scenario.hoa)
    setInterestOnly(scenario.interestOnly)
  }
  
  // Delete scenario
  const deleteScenario = (id: string) => {
    const updated = savedScenarios.filter((s) => s.id !== id)
    setSavedScenarios(updated)
    localStorage.setItem('pamela-dscr-scenarios', JSON.stringify(updated))
  }
  
  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex">
      {/* Left Sidebar - Saved Scenarios */}
      <div className="w-64 bg-[var(--color-midnight)] text-[var(--color-cream)] p-6 overflow-y-auto hidden lg:block">
        <h2 className="text-xl font-bold mb-4 font-display">Saved Scenarios</h2>
        <button
          onClick={() => setShowSaveModal(true)}
          className="w-full bg-[var(--color-ocean)] hover:bg-[var(--color-royal)] text-white py-2 px-4 rounded-lg mb-6 flex items-center justify-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Current
        </button>
        
        <div className="space-y-3">
          {savedScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-[var(--color-midnight)] border border-[var(--color-steel)] rounded-lg p-3 cursor-pointer hover:bg-gray-800 transition-colors"
              onClick={() => loadScenario(scenario)}
            >
              <div className="flex items-start justify-between mb-1">
                <p className="text-sm font-semibold line-clamp-2">{scenario.address}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteScenario(scenario.id)
                  }}
                  className="text-red-400 hover:text-red-300 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className={`text-lg font-bold ${getDSCRColor(scenario.dscr)}`}>
                DSCR: {scenario.dscr.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ${(scenario.purchasePrice / 1000).toFixed(0)}K • {scenario.downPayment}% down
              </p>
            </div>
          ))}
          
          {savedScenarios.length === 0 && (
            <p className="text-sm text-gray-400 italic">No saved scenarios yet</p>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-midnight)] mb-2">
            DSCR Calculator
          </h1>
          <p className="text-[var(--color-steel)] mb-8">
            For Pamela Moore • Investment Properties in Brookings, OR
          </p>
          
          {/* Coaching Message */}
          {coachingMessage && (
            <div className={`p-4 rounded-lg border-2 mb-6 ${getDSCRBgColor(dscr)}`}>
              <p className={`font-semibold ${getDSCRColor(dscr)}`}>
                {coachingMessage}
              </p>
            </div>
          )}
          
          {/* Primary Inputs */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-display font-bold text-[var(--color-midnight)] mb-6">
              Primary Details
            </h2>
            
            {/* Purchase Price */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-lg font-semibold text-[var(--color-midnight)]">
                  Purchase Price
                </label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-32 px-3 py-2 border-2 border-[var(--color-steel)] rounded-lg text-right font-semibold"
                />
              </div>
              <input
                type="range"
                min="100000"
                max="2000000"
                step="10000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-ocean)]"
              />
              <div className="flex justify-between text-xs text-[var(--color-steel)] mt-1">
                <span>$100K</span>
                <span>$2M</span>
              </div>
            </div>
            
            {/* Down Payment */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-lg font-semibold text-[var(--color-midnight)]">
                  Down Payment
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Math.max(minDownPayment, Number(e.target.value)))}
                    min={minDownPayment}
                    max="30"
                    className="w-20 px-3 py-2 border-2 border-[var(--color-steel)] rounded-lg text-right font-semibold"
                  />
                  <span className="font-semibold">%</span>
                </div>
              </div>
              <input
                type="range"
                min={minDownPayment}
                max="30"
                step="1"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-ocean)]"
              />
              <div className="flex justify-between text-xs text-[var(--color-steel)] mt-1">
                <span>{minDownPayment}% min</span>
                <span>30%</span>
              </div>
            </div>
            
            {/* Monthly Rent */}
            <div className="mb-6">
              <label className="text-lg font-semibold text-[var(--color-midnight)] block mb-2">
                Monthly Rent Estimate
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="flex-1 px-4 py-3 border-2 border-[var(--color-steel)] rounded-lg text-xl font-semibold"
                />
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setRentType('long')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                      rentType === 'long'
                        ? 'bg-[var(--color-ocean)] text-white'
                        : 'text-[var(--color-steel)] hover:bg-gray-200'
                    }`}
                  >
                    Long Term
                  </button>
                  <button
                    onClick={() => setRentType('short')}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                      rentType === 'short'
                        ? 'bg-[var(--color-terracotta)] text-white'
                        : 'text-[var(--color-steel)] hover:bg-gray-200'
                    }`}
                  >
                    Short Term
                  </button>
                </div>
              </div>
              <p className="text-sm text-[var(--color-steel)] mt-2">
                {rentType === 'short' && '80% of rent used for DSCR calculation (short-term rental)'}
              </p>
            </div>
          </div>
          
          {/* Secondary Inputs (Collapsible) */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6">
            <button
              onClick={() => setShowSecondary(!showSecondary)}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="text-xl font-display font-bold text-[var(--color-midnight)]">
                Advanced Settings
              </h2>
              {showSecondary ? (
                <ChevronUp className="w-5 h-5 text-[var(--color-steel)]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[var(--color-steel)]" />
              )}
            </button>
            
            {showSecondary && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-[var(--color-midnight)] block mb-2">
                    Property Tax (% of purchase price)
                  </label>
                  <input
                    type="number"
                    value={propertyTaxRate}
                    onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                    step="0.1"
                    className="w-full px-4 py-2 border-2 border-[var(--color-steel)] rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-[var(--color-midnight)] block mb-2">
                    Annual Insurance ($)
                  </label>
                  <input
                    type="number"
                    value={insurance}
                    onChange={(e) => setInsurance(Number(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-[var(--color-steel)] rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-[var(--color-midnight)] block mb-2">
                    Monthly HOA ($)
                  </label>
                  <input
                    type="number"
                    value={hoa}
                    onChange={(e) => setHoa(Number(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-[var(--color-steel)] rounded-lg"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="interestOnly"
                    checked={interestOnly}
                    onChange={(e) => setInterestOnly(e.target.checked)}
                    className="w-5 h-5 text-[var(--color-ocean)] rounded"
                  />
                  <label htmlFor="interestOnly" className="text-sm font-semibold text-[var(--color-midnight)]">
                    Interest-Only (adds 0.125% to rate)
                  </label>
                </div>
              </div>
            )}
          </div>
          
          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-display font-bold text-[var(--color-midnight)] mb-6">
              Results
            </h2>
            
            {/* DSCR - Big and Prominent */}
            <div className={`p-6 rounded-xl border-2 mb-6 ${getDSCRBgColor(dscr)}`}>
              <p className="text-sm font-semibold text-[var(--color-steel)] mb-1">
                Debt Service Coverage Ratio
              </p>
              <p className={`text-5xl font-bold ${getDSCRColor(dscr)}`}>
                {dscr.toFixed(2)}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-[var(--color-steel)] mb-1">
                  Loan Amount
                </p>
                <p className="text-2xl font-bold text-[var(--color-midnight)]">
                  ${loanAmount.toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-[var(--color-steel)] mb-1">
                  Interest Rate
                </p>
                <p className="text-2xl font-bold text-[var(--color-midnight)]">
                  {rate.toFixed(3)}%
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-[var(--color-steel)] mb-1">
                  Effective Monthly Rent
                </p>
                <p className="text-2xl font-bold text-[var(--color-midnight)]">
                  ${effectiveRent.toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-[var(--color-steel)] mb-1">
                  Monthly Cash Flow
                </p>
                <p className={`text-2xl font-bold ${cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${cashFlow.toLocaleString()}
                </p>
              </div>
            </div>
            
            {/* PITIA Breakdown */}
            <div className="mt-6 pt-6 border-t-2 border-gray-100">
              <p className="text-lg font-semibold text-[var(--color-midnight)] mb-4">
                Monthly PITIA Breakdown
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--color-steel)]">Principal & Interest</span>
                  <span className="font-semibold">${monthlyPI.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-steel)]">Property Tax</span>
                  <span className="font-semibold">${monthlyTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-steel)]">Insurance</span>
                  <span className="font-semibold">${monthlyInsurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-steel)]">HOA</span>
                  <span className="font-semibold">${monthlyHOA.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t-2 border-gray-200">
                  <span className="font-bold text-[var(--color-midnight)]">Total PITIA</span>
                  <span className="font-bold text-xl">${monthlyPITIA.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Save Button */}
          <div className="lg:hidden mt-6">
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-full bg-[var(--color-ocean)] hover:bg-[var(--color-royal)] text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Scenario
            </button>
          </div>
        </div>
      </div>
      
      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-display font-bold text-[var(--color-midnight)] mb-4">
              Save Scenario
            </h3>
            <input
              type="text"
              value={saveAddress}
              onChange={(e) => setSaveAddress(e.target.value)}
              placeholder="Enter property address"
              className="w-full px-4 py-3 border-2 border-[var(--color-steel)] rounded-lg mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-[var(--color-midnight)] py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!saveAddress.trim()}
                className="flex-1 bg-[var(--color-ocean)] hover:bg-[var(--color-royal)] text-white py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
