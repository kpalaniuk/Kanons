'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

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

// ─── Utility Functions ───────────────────────────────────────────────────────

function formatCurrency(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function formatCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

// ─── Rate Calculation ────────────────────────────────────────────────────────
// FICO 726 (720-739 range)
// Base rate ~7.25% — delivers ≥1.5% credit
// LTV adjustments per HomeXpress sheet

function calculateRate(ltv: number, interestOnly: boolean): number {
  let rate = 7.25

  if (ltv <= 70) rate -= 0.125
  else if (ltv <= 75) rate += 0
  else if (ltv <= 80) rate += 0.125
  else if (ltv <= 85) rate += 0.25
  else rate += 0.375

  if (interestOnly) rate += 0.125

  return rate
}

// ─── Monthly Payment ─────────────────────────────────────────────────────────

function calcMonthlyPI(principal: number, annualRate: number, io: boolean): number {
  if (principal <= 0 || annualRate <= 0) return 0
  const r = annualRate / 100 / 12
  if (io) return principal * r
  const n = 360
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

// ─── DSCR Helpers ────────────────────────────────────────────────────────────

function getDSCRColor(dscr: number): string {
  if (dscr >= 1.25) return '#16a34a' // green-600
  if (dscr >= 1.0) return '#ca8a04'  // yellow-600
  if (dscr >= 0.75) return '#ea580c' // orange-600
  return '#dc2626'                    // red-600
}

function getDSCRLabel(dscr: number): string {
  if (dscr >= 1.25) return 'Excellent'
  if (dscr >= 1.0) return 'Qualifying'
  if (dscr >= 0.75) return 'Below Target'
  return 'Does Not Qualify'
}

// ─── Icons (inline SVG to avoid dependency issues) ───────────────────────────

function SaveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PamelaDSCRCalculator() {
  // ── Primary Inputs ──
  const [purchasePrice, setPurchasePrice] = useState(400000)
  const [downPayment, setDownPayment] = useState(25)
  const [monthlyRent, setMonthlyRent] = useState(3000)
  const [rentType, setRentType] = useState<'long' | 'short'>('long')

  // ── Secondary Inputs ──
  const [propertyTaxRate, setPropertyTaxRate] = useState(0.9)
  const [insurance, setInsurance] = useState(1200)
  const [hoa, setHoa] = useState(0)
  const [interestOnly, setInterestOnly] = useState(false)

  // ── UI State ──
  const [showSecondary, setShowSecondary] = useState(false)
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([])
  const [saveAddress, setSaveAddress] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Hydration guard
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('pamela-dscr-scenarios')
      if (saved) setSavedScenarios(JSON.parse(saved))
    } catch {}
  }, [])

  // ── Core Calculations (memoized) ──
  const calc = useMemo(() => {
    const loanAmount = purchasePrice * (1 - downPayment / 100)
    const ltv = 100 - downPayment
    const rate = calculateRate(ltv, interestOnly)
    const pi = calcMonthlyPI(loanAmount, rate, interestOnly)
    const tax = (purchasePrice * propertyTaxRate / 100) / 12
    const ins = insurance / 12
    const pitia = pi + tax + ins + hoa
    const effRent = monthlyRent * (rentType === 'long' ? 1.0 : 0.8)
    const dscr = pitia > 0 ? effRent / pitia : 0
    const cashFlow = effRent - pitia

    return { loanAmount, ltv, rate, pi, tax, ins, pitia, effRent, dscr, cashFlow }
  }, [purchasePrice, downPayment, monthlyRent, rentType, propertyTaxRate, insurance, hoa, interestOnly])

  // ── Coaching Logic ──
  const coaching = useMemo(() => {
    if (calc.dscr >= 1.0) return null

    // Binary search for the down payment % needed to hit 1.0 DSCR
    const targetDSCR = 1.0
    let lo = downPayment
    let hi = 90
    let needed = -1

    for (let i = 0; i < 50; i++) {
      const mid = (lo + hi) / 2
      const loan = purchasePrice * (1 - mid / 100)
      const ltv = 100 - mid
      const r = calculateRate(ltv, interestOnly)
      const pi = calcMonthlyPI(loan, r, interestOnly)
      const tax = (purchasePrice * propertyTaxRate / 100) / 12
      const ins = insurance / 12
      const pitia = pi + tax + ins + hoa
      const effRent = monthlyRent * (rentType === 'long' ? 1.0 : 0.8)
      const d = pitia > 0 ? effRent / pitia : 0

      if (d >= targetDSCR) {
        needed = mid
        hi = mid
      } else {
        lo = mid
      }
    }

    if (calc.dscr < 0.75) {
      const increase = needed > 0 ? Math.ceil(needed - downPayment) : null
      return {
        type: 'error' as const,
        message: '⚠️ DSCR below 0.75 — minimum 30% down payment required',
        suggestion: increase !== null && increase > 0
          ? `Try increasing down payment by ${increase}% (to ${Math.ceil(needed)}%) to reach 1.0 DSCR`
          : null,
      }
    }

    // DSCR 0.75 - 0.99
    const increase = needed > 0 ? Math.ceil(needed - downPayment) : null
    return {
      type: 'warning' as const,
      message: '💡 DSCR below 1.0 — consider increasing down payment',
      suggestion: increase !== null && increase > 0
        ? `Increase down payment by ~${increase}% (to ${Math.ceil(needed)}%) to reach 1.0 DSCR`
        : 'Try reducing purchase price or increasing expected rent',
    }
  }, [calc.dscr, downPayment, purchasePrice, monthlyRent, rentType, propertyTaxRate, insurance, hoa, interestOnly])

  // ── Down Payment Min ──
  const minDown = calc.dscr < 0.75 ? 30 : 10

  // ── Scenario Actions ──
  const handleSave = useCallback(() => {
    if (!saveAddress.trim()) return
    const scenario: SavedScenario = {
      id: Date.now().toString(),
      address: saveAddress.trim(),
      purchasePrice,
      downPayment,
      monthlyRent,
      rentType,
      propertyTax: propertyTaxRate,
      insurance,
      hoa,
      interestOnly,
      dscr: calc.dscr,
      timestamp: Date.now(),
    }
    const updated = [...savedScenarios, scenario]
    setSavedScenarios(updated)
    localStorage.setItem('pamela-dscr-scenarios', JSON.stringify(updated))
    setSaveAddress('')
    setShowSaveModal(false)
  }, [saveAddress, purchasePrice, downPayment, monthlyRent, rentType, propertyTaxRate, insurance, hoa, interestOnly, calc.dscr, savedScenarios])

  const loadScenario = useCallback((s: SavedScenario) => {
    setPurchasePrice(s.purchasePrice)
    setDownPayment(s.downPayment)
    setMonthlyRent(s.monthlyRent)
    setRentType(s.rentType)
    setPropertyTaxRate(s.propertyTax)
    setInsurance(s.insurance)
    setHoa(s.hoa)
    setInterestOnly(s.interestOnly)
    setShowMobileSidebar(false)
  }, [])

  const deleteScenario = useCallback((id: string) => {
    const updated = savedScenarios.filter((s) => s.id !== id)
    setSavedScenarios(updated)
    localStorage.setItem('pamela-dscr-scenarios', JSON.stringify(updated))
  }, [savedScenarios])

  // Don't render until hydrated (prevents localStorage mismatch)
  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f4' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', color: '#0a0a0a' }}>
          Loading calculator…
        </div>
      </div>
    )
  }

  // ── Shared sidebar content ──
  const sidebarContent = (
    <>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#f8f7f4' }}>
        Saved Scenarios
      </h2>
      <button
        onClick={() => setShowSaveModal(true)}
        style={{
          width: '100%',
          background: '#0066FF',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '0.625rem 1rem',
          fontWeight: 600,
          fontSize: '0.875rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <SaveIcon /> Save Current
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {savedScenarios.map((s) => (
          <div
            key={s.id}
            onClick={() => loadScenario(s)}
            style={{
              background: '#111',
              border: '1px solid #333',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8f7f4', lineHeight: 1.3 }}>{s.address}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteScenario(s.id) }}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
              >
                <TrashIcon />
              </button>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: getDSCRColor(s.dscr) }}>
              DSCR: {s.dscr.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.25rem' }}>
              {formatCompact(s.purchasePrice)} • {s.downPayment}% down
            </div>
          </div>
        ))}
        {savedScenarios.length === 0 && (
          <p style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>No saved scenarios yet</p>
        )}
      </div>
    </>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Desktop Sidebar ── */}
      <aside style={{
        width: '280px',
        background: '#0a0a0a',
        color: '#f8f7f4',
        padding: '1.5rem',
        overflowY: 'auto',
        flexShrink: 0,
        display: 'none',
      }} className="pamela-sidebar">
        {sidebarContent}
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {showMobileSidebar && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }}
          onClick={() => setShowMobileSidebar(false)}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '280px',
              background: '#0a0a0a',
              color: '#f8f7f4',
              padding: '1.5rem',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <button
              onClick={() => setShowMobileSidebar(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#0a0a0a' }}
              className="pamela-mobile-menu"
            >
              <MenuIcon />
            </button>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: 700, color: '#0a0a0a', margin: 0, letterSpacing: '-0.03em' }}>
              DSCR Calculator
            </h1>
          </div>
          <p style={{ color: '#7A8F9E', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            For Pamela Moore • Investment Properties — Brookings, OR • FICO 726
          </p>

          {/* ── DSCR Hero ── */}
          <div style={{
            background: '#fff',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            border: `2px solid ${getDSCRColor(calc.dscr)}20`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7A8F9E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Debt Service Coverage Ratio
            </div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(3.5rem, 10vw, 5rem)',
              fontWeight: 700,
              color: getDSCRColor(calc.dscr),
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}>
              {calc.dscr.toFixed(2)}
            </div>
            <div style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: getDSCRColor(calc.dscr),
              background: `${getDSCRColor(calc.dscr)}15`,
            }}>
              {getDSCRLabel(calc.dscr)}
            </div>
          </div>

          {/* ── Coaching ── */}
          {coaching && (
            <div style={{
              padding: '1rem 1.25rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
              background: coaching.type === 'error' ? '#fef2f2' : '#fffbeb',
              border: `1px solid ${coaching.type === 'error' ? '#fecaca' : '#fde68a'}`,
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: coaching.type === 'error' ? '#dc2626' : '#d97706', marginBottom: coaching.suggestion ? '0.25rem' : 0 }}>
                {coaching.message}
              </div>
              {coaching.suggestion && (
                <div style={{ fontSize: '0.85rem', color: '#555' }}>
                  {coaching.suggestion}
                </div>
              )}
            </div>
          )}

          {/* ── Primary Inputs Card ── */}
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem 2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.35rem', fontWeight: 700, color: '#0a0a0a', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Property Details
            </h2>

            {/* Purchase Price */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '1rem', fontWeight: 600, color: '#0a0a0a' }}>Purchase Price</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ fontWeight: 600, color: '#555' }}>$</span>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      if (!isNaN(v) && v >= 0) setPurchasePrice(v)
                    }}
                    style={{
                      width: '130px',
                      padding: '0.5rem 0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textAlign: 'right',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
              <input
                type="range"
                min={100000}
                max={2000000}
                step={10000}
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                style={{ width: '100%', height: '8px', cursor: 'pointer', accentColor: '#0066FF' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>
                <span>$100K</span>
                <span style={{ fontWeight: 600, color: '#0066FF' }}>{formatCompact(purchasePrice)}</span>
                <span>$2M</span>
              </div>
            </div>

            {/* Down Payment */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '1rem', fontWeight: 600, color: '#0a0a0a' }}>
                  Down Payment
                  <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#999', marginLeft: '0.5rem' }}>
                    ({formatCurrency(purchasePrice * downPayment / 100)})
                  </span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => {
                      let v = Number(e.target.value)
                      if (!isNaN(v)) {
                        v = Math.max(minDown, Math.min(90, v))
                        setDownPayment(v)
                      }
                    }}
                    min={minDown}
                    max={90}
                    style={{
                      width: '70px',
                      padding: '0.5rem 0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textAlign: 'right',
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontWeight: 600 }}>%</span>
                </div>
              </div>
              <input
                type="range"
                min={minDown}
                max={90}
                step={1}
                value={Math.max(minDown, downPayment)}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                style={{ width: '100%', height: '8px', cursor: 'pointer', accentColor: '#0066FF' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>
                <span>{minDown}% min</span>
                <span style={{ fontWeight: 600, color: '#0066FF' }}>{downPayment}%</span>
                <span>90%</span>
              </div>
            </div>

            {/* Monthly Rent */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '1rem', fontWeight: 600, color: '#0a0a0a', display: 'block', marginBottom: '0.5rem' }}>
                Monthly Rent Estimate
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'stretch', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ fontWeight: 600, color: '#555', fontSize: '1.25rem' }}>$</span>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      if (!isNaN(v) && v >= 0) setMonthlyRent(v)
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      outline: 'none',
                      minWidth: 0,
                    }}
                  />
                </div>
                <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '0.5rem', padding: '4px', gap: '2px' }}>
                  <button
                    onClick={() => setRentType('long')}
                    style={{
                      padding: '0.625rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      transition: 'all 0.15s',
                      background: rentType === 'long' ? '#0066FF' : 'transparent',
                      color: rentType === 'long' ? '#fff' : '#666',
                    }}
                  >
                    Long Term
                  </button>
                  <button
                    onClick={() => setRentType('short')}
                    style={{
                      padding: '0.625rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      transition: 'all 0.15s',
                      background: rentType === 'short' ? '#FFB366' : 'transparent',
                      color: rentType === 'short' ? '#fff' : '#666',
                    }}
                  >
                    Short Term
                  </button>
                </div>
              </div>
              {rentType === 'short' && (
                <p style={{ fontSize: '0.8rem', color: '#ea580c', marginTop: '0.5rem', fontWeight: 500 }}>
                  80% of rent used for DSCR (short-term rental haircut)
                </p>
              )}
            </div>
          </div>

          {/* ── Secondary Inputs (Collapsible) ── */}
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem 2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <button
              onClick={() => setShowSecondary(!showSecondary)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#0a0a0a' }}>
                Advanced Settings
              </span>
              <ChevronDownIcon open={showSecondary} />
            </button>

            {showSecondary && (
              <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.375rem' }}>
                    Property Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={propertyTaxRate}
                    onChange={(e) => { const v = Number(e.target.value); if (!isNaN(v)) setPropertyTaxRate(v) }}
                    step={0.1}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.375rem' }}>
                    Annual Insurance ($)
                  </label>
                  <input
                    type="number"
                    value={insurance}
                    onChange={(e) => { const v = Number(e.target.value); if (!isNaN(v)) setInsurance(v) }}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '0.375rem' }}>
                    Monthly HOA ($)
                  </label>
                  <input
                    type="number"
                    value={hoa}
                    onChange={(e) => { const v = Number(e.target.value); if (!isNaN(v)) setHoa(v) }}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', border: '2px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.25rem' }}>
                  <input
                    type="checkbox"
                    id="io-toggle"
                    checked={interestOnly}
                    onChange={(e) => setInterestOnly(e.target.checked)}
                    style={{ width: '1.25rem', height: '1.25rem', accentColor: '#0066FF', cursor: 'pointer' }}
                  />
                  <label htmlFor="io-toggle" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333', cursor: 'pointer' }}>
                    Interest-Only
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* ── Results Card ── */}
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem 2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.35rem', fontWeight: 700, color: '#0a0a0a', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
              Results
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <ResultItem label="Loan Amount" value={formatCurrency(calc.loanAmount)} />
              <ResultItem label="Interest Rate" value={`${calc.rate.toFixed(3)}%`} />
              <ResultItem label="Effective Rent" value={formatCurrency(calc.effRent)} />
              <ResultItem
                label="Monthly Cash Flow"
                value={formatCurrency(calc.cashFlow)}
                color={calc.cashFlow >= 0 ? '#16a34a' : '#dc2626'}
              />
            </div>

            {/* PITIA Breakdown */}
            <div style={{ borderTop: '2px solid #f3f4f6', paddingTop: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0a0a0a', marginBottom: '0.75rem' }}>
                Monthly PITIA Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <PITIARow label={interestOnly ? 'Interest (I/O)' : 'Principal & Interest'} value={calc.pi} />
                <PITIARow label="Property Tax" value={calc.tax} />
                <PITIARow label="Insurance" value={calc.ins} />
                <PITIARow label="HOA" value={hoa} />
                <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '0.5rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: '#0a0a0a' }}>Total PITIA</span>
                  <span style={{ fontWeight: 700, fontSize: '1.15rem', color: '#0a0a0a' }}>{formatCurrency(calc.pitia, 2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Mobile Save Button ── */}
          <div className="pamela-mobile-save" style={{ display: 'none', marginBottom: '2rem' }}>
            <button
              onClick={() => setShowSaveModal(true)}
              style={{
                width: '100%',
                background: '#0066FF',
                color: '#fff',
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.875rem 1.5rem',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <SaveIcon /> Save Scenario
            </button>
          </div>
        </div>
      </main>

      {/* ── Save Modal ── */}
      {showSaveModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 100 }}
          onClick={() => setShowSaveModal(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', maxWidth: '28rem', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#0a0a0a', marginBottom: '1rem' }}>
              Save Scenario
            </h3>
            <input
              type="text"
              value={saveAddress}
              onChange={(e) => setSaveAddress(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
              placeholder="Enter property address..."
              autoFocus
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                marginBottom: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowSaveModal(false)}
                style={{
                  flex: 1,
                  background: '#f3f4f6',
                  color: '#333',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.625rem 1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!saveAddress.trim()}
                style={{
                  flex: 1,
                  background: saveAddress.trim() ? '#0066FF' : '#ccc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.625rem 1rem',
                  fontWeight: 600,
                  cursor: saveAddress.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Responsive Styles ── */}
      <style>{`
        .pamela-sidebar { display: none !important; }
        .pamela-mobile-menu { display: block !important; }
        .pamela-mobile-save { display: block !important; }

        @media (min-width: 1024px) {
          .pamela-sidebar { display: block !important; }
          .pamela-mobile-menu { display: none !important; }
          .pamela-mobile-save { display: none !important; }
        }

        /* Slider thumb styling for cross-browser */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: #e5e7eb;
          border-radius: 999px;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #0066FF;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #0066FF;
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 999px;
          background: #e5e7eb;
        }
        input[type="range"]::-moz-range-track {
          height: 8px;
          border-radius: 999px;
          background: #e5e7eb;
        }

        /* Remove number input arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }

        /* Focus styles */
        input:focus {
          border-color: #0066FF !important;
          box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
        }
      `}</style>
    </div>
  )
}

// ── Sub-components ──

function ResultItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#7A8F9E', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: color || '#0a0a0a', fontFamily: "'Space Grotesk', sans-serif" }}>
        {value}
      </div>
    </div>
  )
}

function PITIARow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: '#666', fontSize: '0.9rem' }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}
      </span>
    </div>
  )
}
