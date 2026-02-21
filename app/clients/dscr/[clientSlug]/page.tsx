'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ClientConfig {
  client_name: string
  client_slug: string
  client_fico: number | null
  rate_sheet_data: {
    rates?: Array<{
      ltv_min: number
      ltv_max: number
      fico_min: number
      fico_max: number
      standard_rate: number
      io_adjustment: number
    }>
  }
  lo_name: string
  lo_nmls: string
  lo_phone: string
  lo_email: string
}

interface SavedScenario {
  id: string
  address: string
  purchasePrice: number
  downPayment: number
  rent: number
  rentPeriod: 'monthly' | 'annual'
  rentType: 'long' | 'short'
  propertyTax: number
  taxPeriod: 'monthly' | 'annual'
  taxMode: 'percent' | 'amount'
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

function calculateRateFromSheet(
  ltv: number,
  fico: number,
  interestOnly: boolean,
  rateSheet: ClientConfig['rate_sheet_data']
): number {
  if (!rateSheet.rates || rateSheet.rates.length === 0) {
    // Fallback to default logic
    let rate = 7.25
    if (ltv <= 70) rate -= 0.125
    else if (ltv <= 75) rate += 0
    else if (ltv <= 80) rate += 0.125
    else if (ltv <= 85) rate += 0.25
    else rate += 0.375
    if (interestOnly) rate += 0.125
    return rate
  }

  const match = rateSheet.rates.find((r) =>
    ltv >= r.ltv_min &&
    ltv <= r.ltv_max &&
    fico >= r.fico_min &&
    fico <= r.fico_max
  )

  if (!match) {
    // Fallback to closest match or default
    let rate = 7.25
    if (ltv <= 70) rate -= 0.125
    else if (ltv <= 75) rate += 0
    else if (ltv <= 80) rate += 0.125
    else if (ltv <= 85) rate += 0.25
    else rate += 0.375
    if (interestOnly) rate += 0.125
    return rate
  }

  return match.standard_rate + (interestOnly ? match.io_adjustment : 0)
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
  if (dscr >= 1.25) return '#16a34a'
  if (dscr >= 1.0) return '#ca8a04'
  if (dscr >= 0.75) return '#ea580c'
  return '#dc2626'
}

function getDSCRLabel(dscr: number): string {
  if (dscr >= 1.25) return 'Excellent'
  if (dscr >= 1.0) return 'Qualifying'
  if (dscr >= 0.75) return 'Below Target'
  return 'Does Not Qualify'
}

// ─── Icons ───────────────────────────────────────────────────────────────────

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

export default function DSCRCalculator() {
  const params = useParams()
  const clientSlug = params?.clientSlug as string

  // ── Client Config ──
  const [config, setConfig] = useState<ClientConfig | null>(null)
  const [configLoading, setConfigLoading] = useState(true)
  const [configError, setConfigError] = useState<string | null>(null)

  // ── Primary Inputs ──
  const [purchasePrice, setPurchasePrice] = useState(400000)
  const [downPayment, setDownPayment] = useState(25)
  const [rent, setRent] = useState(3000)
  const [rentPeriod, setRentPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [rentType, setRentType] = useState<'long' | 'short'>('long')

  // ── Secondary Inputs ──
  const [propertyTax, setPropertyTax] = useState(0.9)
  const [taxMode, setTaxMode] = useState<'percent' | 'amount'>('percent')
  const [taxPeriod, setTaxPeriod] = useState<'monthly' | 'annual'>('annual')
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

  // Fetch client config
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch(`/api/dscr/clients/${clientSlug}`)
        if (!res.ok) {
          throw new Error('Client configuration not found')
        }
        const data = await res.json()
        setConfig(data)
      } catch (err) {
        setConfigError(err instanceof Error ? err.message : 'Failed to load configuration')
      } finally {
        setConfigLoading(false)
      }
    }
    if (clientSlug) {
      fetchConfig()
    }
  }, [clientSlug])

  // Hydration guard + localStorage
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(`dscr-scenarios-${clientSlug}`)
      if (saved) setSavedScenarios(JSON.parse(saved))
    } catch {}
  }, [clientSlug])

  // ── Core Calculations (memoized) ──
  const calc = useMemo(() => {
    if (!config) return null

    const loanAmount = purchasePrice * (1 - downPayment / 100)
    const ltv = 100 - downPayment
    const fico = config.client_fico || 720
    const rate = calculateRateFromSheet(ltv, fico, interestOnly, config.rate_sheet_data)
    const pi = calcMonthlyPI(loanAmount, rate, interestOnly)

    // Monthly rent
    const monthlyRent = rentPeriod === 'monthly' ? rent : rent / 12

    // Monthly tax
    let monthlyTax = 0
    if (taxMode === 'percent') {
      monthlyTax = taxPeriod === 'annual'
        ? (purchasePrice * propertyTax / 100) / 12
        : (purchasePrice * propertyTax / 100)
    } else {
      monthlyTax = taxPeriod === 'annual' ? propertyTax / 12 : propertyTax
    }

    const ins = insurance / 12
    const pitia = pi + monthlyTax + ins + hoa
    const effRent = monthlyRent * (rentType === 'long' ? 1.0 : 0.8)
    const dscr = pitia > 0 ? effRent / pitia : 0
    const cashFlow = effRent - pitia

    return { loanAmount, ltv, rate, pi, tax: monthlyTax, ins, pitia, effRent, dscr, cashFlow }
  }, [config, purchasePrice, downPayment, rent, rentPeriod, rentType, propertyTax, taxMode, taxPeriod, insurance, hoa, interestOnly])

  // ── Coaching Logic ──
  const coaching = useMemo(() => {
    if (!calc || calc.dscr >= 1.0) return null

    const targetDSCR = 1.0
    let lo = downPayment
    let hi = 90
    let needed = -1

    for (let i = 0; i < 50; i++) {
      const mid = (lo + hi) / 2
      const loan = purchasePrice * (1 - mid / 100)
      const ltv = 100 - mid
      const fico = config?.client_fico || 720
      const r = calculateRateFromSheet(ltv, fico, interestOnly, config?.rate_sheet_data || {})
      const pi = calcMonthlyPI(loan, r, interestOnly)
      const monthlyRent = rentPeriod === 'monthly' ? rent : rent / 12
      let monthlyTax = 0
      if (taxMode === 'percent') {
        monthlyTax = taxPeriod === 'annual'
          ? (purchasePrice * propertyTax / 100) / 12
          : (purchasePrice * propertyTax / 100)
      } else {
        monthlyTax = taxPeriod === 'annual' ? propertyTax / 12 : propertyTax
      }
      const ins = insurance / 12
      const pitia = pi + monthlyTax + ins + hoa
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

    const increase = needed > 0 ? Math.ceil(needed - downPayment) : null
    return {
      type: 'warning' as const,
      message: '💡 DSCR below 1.0 — consider increasing down payment',
      suggestion: increase !== null && increase > 0
        ? `Increase down payment by ~${increase}% (to ${Math.ceil(needed)}%) to reach 1.0 DSCR`
        : 'Try reducing purchase price or increasing expected rent',
    }
  }, [calc, config, downPayment, purchasePrice, rent, rentPeriod, rentType, propertyTax, taxMode, taxPeriod, insurance, hoa, interestOnly])

  // ── Down Payment Min ──
  const minDown = calc && calc.dscr < 0.75 ? 30 : 10

  // ── Scenario Actions ──
  const handleSave = useCallback(() => {
    if (!saveAddress.trim() || !calc) return
    const scenario: SavedScenario = {
      id: Date.now().toString(),
      address: saveAddress.trim(),
      purchasePrice,
      downPayment,
      rent,
      rentPeriod,
      rentType,
      propertyTax,
      taxMode,
      taxPeriod,
      insurance,
      hoa,
      interestOnly,
      dscr: calc.dscr,
      timestamp: Date.now(),
    }
    const updated = [...savedScenarios, scenario]
    setSavedScenarios(updated)
    localStorage.setItem(`dscr-scenarios-${clientSlug}`, JSON.stringify(updated))
    setSaveAddress('')
    setShowSaveModal(false)
  }, [saveAddress, purchasePrice, downPayment, rent, rentPeriod, rentType, propertyTax, taxMode, taxPeriod, insurance, hoa, interestOnly, calc, savedScenarios, clientSlug])

  const loadScenario = useCallback((s: SavedScenario) => {
    setPurchasePrice(s.purchasePrice)
    setDownPayment(s.downPayment)
    setRent(s.rent)
    setRentPeriod(s.rentPeriod)
    setRentType(s.rentType)
    setPropertyTax(s.propertyTax)
    setTaxMode(s.taxMode)
    setTaxPeriod(s.taxPeriod)
    setInsurance(s.insurance)
    setHoa(s.hoa)
    setInterestOnly(s.interestOnly)
    setShowMobileSidebar(false)
  }, [])

  const deleteScenario = useCallback((id: string) => {
    const updated = savedScenarios.filter((s) => s.id !== id)
    setSavedScenarios(updated)
    localStorage.setItem(`dscr-scenarios-${clientSlug}`, JSON.stringify(updated))
  }, [savedScenarios, clientSlug])

  // Loading state
  if (!mounted || configLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f4' }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', color: '#0a0a0a' }}>
          Loading calculator…
        </div>
      </div>
    )
  }

  // Error state
  if (configError || !config) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f4', padding: '2rem' }}>
        <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2rem', fontWeight: 700, color: '#0a0a0a', marginBottom: '0.5rem' }}>
            Configuration Not Found
          </h1>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            {configError || 'Unable to load calculator configuration'}
          </p>
          <a href="/" style={{ color: '#0066FF', textDecoration: 'underline' }}>Return home</a>
        </div>
      </div>
    )
  }

  if (!calc) return null

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
    <div style={{ minHeight: '100vh', background: '#f8f7f4', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ flex: 1, display: 'flex' }}>
        {/* ── Desktop Sidebar ── */}
        <aside style={{
          width: '280px',
          background: '#0a0a0a',
          color: '#f8f7f4',
          padding: '1.5rem',
          overflowY: 'auto',
          flexShrink: 0,
          display: 'none',
        }} className="dscr-sidebar">
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
                className="dscr-mobile-menu"
              >
                <MenuIcon />
              </button>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: 700, color: '#0a0a0a', margin: 0, letterSpacing: '-0.03em' }}>
                DSCR Calculator
              </h1>
            </div>
            <p style={{ color: '#7A8F9E', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              For {config.client_name}{config.client_fico && ` • FICO ${config.client_fico}`}
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
                  min="50000"
                  max="2000000"
                  step="5000"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0066FF' }}
                />
              </div>

              {/* Down Payment */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '1rem', fontWeight: 600, color: '#0a0a0a' }}>Down Payment</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        if (!isNaN(v) && v >= minDown && v <= 90) setDownPayment(v)
                      }}
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
                    <span style={{ fontWeight: 600, color: '#555' }}>%</span>
                    <span style={{ fontSize: '0.85rem', color: '#888', marginLeft: '0.5rem' }}>
                      ({formatCurrency(purchasePrice * downPayment / 100)})
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={minDown}
                  max="90"
                  step="1"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0066FF' }}
                />
              </div>

              {/* Monthly Rent with Period Toggle */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '1rem', fontWeight: 600, color: '#0a0a0a' }}>Rental Income</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'inline-flex', background: '#f3f4f6', borderRadius: '0.5rem', padding: '2px' }}>
                      <button
                        onClick={() => setRentPeriod('monthly')}
                        style={{
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          background: rentPeriod === 'monthly' ? '#0066FF' : 'transparent',
                          color: rentPeriod === 'monthly' ? '#fff' : '#666',
                          transition: 'all 0.2s',
                        }}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setRentPeriod('annual')}
                        style={{
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          background: rentPeriod === 'annual' ? '#0066FF' : 'transparent',
                          color: rentPeriod === 'annual' ? '#fff' : '#666',
                          transition: 'all 0.2s',
                        }}
                      >
                        Annual
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: '#555' }}>$</span>
                      <input
                        type="number"
                        value={rent}
                        onChange={(e) => {
                          const v = Number(e.target.value)
                          if (!isNaN(v) && v >= 0) setRent(v)
                        }}
                        style={{
                          width: '110px',
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
                </div>
                <input
                  type="range"
                  min="0"
                  max={rentPeriod === 'monthly' ? 10000 : 120000}
                  step={rentPeriod === 'monthly' ? 100 : 1000}
                  value={rent}
                  onChange={(e) => setRent(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0066FF' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => setRentType('long')}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: `2px solid ${rentType === 'long' ? '#0066FF' : '#e5e7eb'}`,
                      borderRadius: '0.5rem',
                      background: rentType === 'long' ? '#0066FF15' : '#fff',
                      color: rentType === 'long' ? '#0066FF' : '#666',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    Long-Term (100%)
                  </button>
                  <button
                    onClick={() => setRentType('short')}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: `2px solid ${rentType === 'short' ? '#0066FF' : '#e5e7eb'}`,
                      borderRadius: '0.5rem',
                      background: rentType === 'short' ? '#0066FF15' : '#fff',
                      color: rentType === 'short' ? '#0066FF' : '#666',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    Short-Term (80%)
                  </button>
                </div>
              </div>

              {/* Interest-Only Toggle */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={interestOnly}
                    onChange={(e) => setInterestOnly(e.target.checked)}
                    style={{ width: '20px', height: '20px', accentColor: '#0066FF', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#0a0a0a' }}>Interest-Only Payment</span>
                </label>
              </div>

              {/* Advanced Toggle */}
              <button
                onClick={() => setShowSecondary(!showSecondary)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  background: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0a0a0a',
                }}
              >
                Advanced Settings
                <ChevronDownIcon open={showSecondary} />
              </button>

              {/* Advanced Inputs */}
              {showSecondary && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #e5e7eb' }}>
                  
                  {/* Property Tax with Mode + Period Toggles */}
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0a0a0a' }}>Property Tax</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ display: 'inline-flex', background: '#f3f4f6', borderRadius: '0.5rem', padding: '2px' }}>
                          <button
                            onClick={() => setTaxMode('percent')}
                            style={{
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              background: taxMode === 'percent' ? '#0066FF' : 'transparent',
                              color: taxMode === 'percent' ? '#fff' : '#666',
                              transition: 'all 0.2s',
                            }}
                          >
                            %
                          </button>
                          <button
                            onClick={() => setTaxMode('amount')}
                            style={{
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              background: taxMode === 'amount' ? '#0066FF' : 'transparent',
                              color: taxMode === 'amount' ? '#fff' : '#666',
                              transition: 'all 0.2s',
                            }}
                          >
                            $
                          </button>
                        </div>
                        <div style={{ display: 'inline-flex', background: '#f3f4f6', borderRadius: '0.5rem', padding: '2px' }}>
                          <button
                            onClick={() => setTaxPeriod('monthly')}
                            style={{
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              background: taxPeriod === 'monthly' ? '#0066FF' : 'transparent',
                              color: taxPeriod === 'monthly' ? '#fff' : '#666',
                              transition: 'all 0.2s',
                            }}
                          >
                            Monthly
                          </button>
                          <button
                            onClick={() => setTaxPeriod('annual')}
                            style={{
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              background: taxPeriod === 'annual' ? '#0066FF' : 'transparent',
                              color: taxPeriod === 'annual' ? '#fff' : '#666',
                              transition: 'all 0.2s',
                            }}
                          >
                            Annual
                          </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {taxMode === 'amount' && <span style={{ fontWeight: 600, color: '#555' }}>$</span>}
                          <input
                            type="number"
                            step={taxMode === 'percent' ? '0.01' : '1'}
                            value={propertyTax}
                            onChange={(e) => {
                              const v = Number(e.target.value)
                              if (!isNaN(v) && v >= 0) setPropertyTax(v)
                            }}
                            style={{
                              width: '90px',
                              padding: '0.5rem 0.75rem',
                              border: '2px solid #e5e7eb',
                              borderRadius: '0.5rem',
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              textAlign: 'right',
                              outline: 'none',
                            }}
                          />
                          {taxMode === 'percent' && <span style={{ fontWeight: 600, color: '#555' }}>%</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Insurance */}
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0a0a0a' }}>Homeowners Insurance (Annual)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ fontWeight: 600, color: '#555' }}>$</span>
                        <input
                          type="number"
                          value={insurance}
                          onChange={(e) => {
                            const v = Number(e.target.value)
                            if (!isNaN(v) && v >= 0) setInsurance(v)
                          }}
                          style={{
                            width: '110px',
                            padding: '0.5rem 0.75rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            textAlign: 'right',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* HOA */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0a0a0a' }}>HOA Fees (Monthly)</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ fontWeight: 600, color: '#555' }}>$</span>
                        <input
                          type="number"
                          value={hoa}
                          onChange={(e) => {
                            const v = Number(e.target.value)
                            if (!isNaN(v) && v >= 0) setHoa(v)
                          }}
                          style={{
                            width: '110px',
                            padding: '0.5rem 0.75rem',
                            border: '2px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            textAlign: 'right',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Results Card ── */}
            <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem 2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.35rem', fontWeight: 700, color: '#0a0a0a', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                Monthly Payment Breakdown
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Principal & Interest
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a0a' }}>
                    {formatCurrency(calc.pi)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '2px' }}>
                    {calc.rate.toFixed(3)}% {interestOnly && '(IO)'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Property Tax
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a0a' }}>
                    {formatCurrency(calc.tax)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Insurance
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a0a' }}>
                    {formatCurrency(calc.ins)}
                  </div>
                </div>

                {hoa > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                      HOA
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a0a' }}>
                      {formatCurrency(hoa)}
                    </div>
                  </div>
                )}

                <div style={{ gridColumn: '1 / -1', borderTop: '2px solid #e5e7eb', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Total PITIA
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0a0a0a' }}>
                    {formatCurrency(calc.pitia)}
                  </div>
                </div>

                <div style={{ background: calc.cashFlow >= 0 ? '#f0fdf4' : '#fef2f2', borderRadius: '0.75rem', padding: '1rem', gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Monthly Cash Flow
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: calc.cashFlow >= 0 ? '#16a34a' : '#dc2626' }}>
                    {formatCurrency(calc.cashFlow, 2)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                    Effective Rent: {formatCurrency(calc.effRent)} {rentType === 'short' && '(80% occupancy)'}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Disclaimer ── */}
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: '0.75rem',
              padding: '1rem 1.25rem',
              marginBottom: '2rem',
            }}>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: '#d97706' }}>⚠️ Important:</strong> Rate estimates only. Subject to credit approval and property appraisal. Actual rates and terms may vary.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* ── Loan Officer Footer ── */}
      <footer style={{
        borderTop: '2px solid #e5e7eb',
        background: '#fff',
        padding: '1.5rem',
        marginTop: 'auto',
      }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0a0a0a', marginBottom: '0.5rem' }}>
            {config.lo_name}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>
            NMLS #{config.lo_nmls} • {config.lo_phone}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#0066FF' }}>
            <a href={`mailto:${config.lo_email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {config.lo_email}
            </a>
          </div>
        </div>
      </footer>

      {/* ── Save Modal ── */}
      {showSaveModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setShowSaveModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '28rem',
              width: '100%',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#0a0a0a', marginBottom: '1rem' }}>
              Save Scenario
            </h3>
            <input
              type="text"
              placeholder="Property address or nickname"
              value={saveAddress}
              onChange={(e) => setSaveAddress(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                marginBottom: '1.5rem',
                outline: 'none',
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowSaveModal(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  background: '#fff',
                  color: '#666',
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
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: saveAddress.trim() ? '#0066FF' : '#ccc',
                  color: '#fff',
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

      <style jsx>{`
        @media (min-width: 768px) {
          .dscr-sidebar {
            display: block !important;
          }
          .dscr-mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
