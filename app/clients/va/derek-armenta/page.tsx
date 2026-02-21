'use client'

import { useState, useMemo, useEffect } from 'react'

// ─── Config ───────────────────────────────────────────────────────────────────

const LO = {
  name: 'Kyle Palaniuk',
  nmls: '984138',
  license: '01932878',
  phone: '(619) 777-5700',
  email: 'kyle@planpreparehome.com',
  company: 'Plan Prepare Home | Granada House Group',
  broker: 'C2 Financial Corporation | NMLS# 135622 | CA BRE# 01821025',
  web: 'planpreparehome.com',
}

const CLIENT = { name: 'Derek & Kelsey Armenta' }

const RATE = 5.500 // Locked per LO fee worksheet

// ─── VA Funding Fee Schedule ──────────────────────────────────────────────────

function getVAFundingFeeRate(downPct: number, subsequent: boolean): number {
  if (subsequent) {
    if (downPct >= 10) return 1.25
    if (downPct >= 5) return 1.50
    return 3.30
  }
  if (downPct >= 10) return 1.25
  if (downPct >= 5) return 1.50
  return 2.15
}

// ─── Fixed Closing Cost Line Items (from fee worksheet) ───────────────────────

const CANNOT_SHOP = [
  { label: 'Admin Fee', amount: 1014 },
  { label: 'Appraisal Fee', amount: 700 },
  { label: 'Credit Report Fee', amount: 65 },
  { label: 'Flood Certificate Fee', amount: 9 },
  { label: 'MERS Registration Fee', amount: 23.70 },
  { label: 'Processing Fee (3rd Party)', amount: 995 },
  { label: 'Tax Monitoring Fee', amount: 75 },
  { label: 'Tax Service Fee', amount: 74 },
]

const CAN_SHOP = [
  { label: 'Title – Settlement Agent Fee', amount: 502 },
]

const GOVT_FEES = [
  { label: 'Recording Fees – Mortgage', amount: 200 },
]

const FIXED_TOTAL =
  [...CANNOT_SHOP, ...CAN_SHOP, ...GOVT_FEES].reduce((s, c) => s + c.amount, 0)

// ─── Utilities ────────────────────────────────────────────────────────────────

function fmt(v: number, dec = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  }).format(v)
}

function calcPI(loan: number, rate: number, years = 30): number {
  const mr = rate / 100 / 12
  const n = years * 12
  if (mr === 0) return loan / n
  return (loan * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)
}

function sliderBg(pct: number): string {
  const p = Math.max(0, Math.min(100, pct))
  return `linear-gradient(to right, #0066FF 0%, #0066FF ${p}%, rgba(10,10,10,0.1) ${p}%, rgba(10,10,10,0.1) 100%)`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
        value ? 'bg-[#0066FF]' : 'bg-[#0a0a0a]/20'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

function GroupHeading({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-bold text-[#0a0a0a]/30 uppercase tracking-widest pt-2 pb-0.5">{label}</p>
  )
}

function LineItem({
  label, value, accent, muted, bold, large,
}: {
  label: string
  value: string
  accent?: 'green' | 'amber'
  muted?: boolean
  bold?: boolean
  large?: boolean
}) {
  return (
    <div className={`flex justify-between items-center ${large ? 'py-1' : ''}`}>
      <span className={`${large ? 'text-base font-bold text-[#0a0a0a]' : muted ? 'text-sm text-[#0a0a0a]/50' : 'text-sm text-[#0a0a0a]/75'}`}>
        {label}
      </span>
      <span className={`font-medium ${
        large ? 'text-xl font-bold' :
        bold ? 'font-bold text-[#0a0a0a]' : ''
      } ${
        accent === 'green' ? 'text-emerald-600' :
        accent === 'amber' ? 'text-amber-600' :
        'text-[#0a0a0a]'
      }`}>
        {value}
      </span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DerekArmentaVAPage() {
  // Address — persisted to localStorage
  const [address, setAddress] = useState('')
  useEffect(() => {
    const saved = localStorage.getItem('va-armenta-address')
    if (saved) setAddress(saved)
  }, [])
  const handleAddressChange = (val: string) => {
    setAddress(val)
    localStorage.setItem('va-armenta-address', val)
  }

  // Scenario inputs
  const [purchasePrice, setPurchasePrice] = useState(625000)
  const [downPct, setDownPct] = useState(0)
  const [sellerCredit, setSellerCredit] = useState(15000)
  const [feeFinanced, setFeeFinanced] = useState(true)
  const [subsequentUse, setSubsequentUse] = useState(false)

  // VA seller concession limit: 4% of purchase price
  const maxSellerCredit = Math.round(purchasePrice * 0.04)
  const effectiveSellerCredit = Math.min(sellerCredit, maxSellerCredit)
  const sellerCreditPct = ((effectiveSellerCredit / purchasePrice) * 100).toFixed(2)

  // Editable monthly cost estimates
  const [monthlyInsurance, setMonthlyInsurance] = useState(100)
  const [monthlyHOA, setMonthlyHOA] = useState(450)
  const [taxRatePct, setTaxRatePct] = useState(1.22) // ~$635/mo on $625k

  // ─── Core math ─────────────────────────────────────────────────────────────
  const c = useMemo(() => {
    const downPayment = purchasePrice * (downPct / 100)
    const baseLoan = purchasePrice - downPayment
    const ltv = (baseLoan / purchasePrice) * 100

    const feeRate = getVAFundingFeeRate(downPct, subsequentUse)
    const feeAmt = baseLoan * (feeRate / 100)
    const totalLoan = feeFinanced ? baseLoan + feeAmt : baseLoan

    const monthlyPI = calcPI(totalLoan, RATE)
    const monthlyTax = (purchasePrice * taxRatePct / 100) / 12
    const totalPITIA = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA

    // Prepaids (matching fee sheet structure)
    const prepaidInsurance12 = monthlyInsurance * 12   // 12 months
    const prepaidInterest9 = totalLoan * RATE / 100 / 365 * 9  // 9 days

    // Property tax prepaid: 6 months (per fee sheet)
    const prepaidTax6 = monthlyTax * 6

    // Escrow reserves
    const reserveInsurance6 = monthlyInsurance * 6     // 6 months
    const reserveTax3 = monthlyTax * 3                 // 3 months

    const prepaidTotal = prepaidInsurance12 + prepaidInterest9 + prepaidTax6
    const reserveTotal = reserveInsurance6 + reserveTax3

    // VA fee in closing (only when NOT financed)
    const feeInClosing = feeFinanced ? 0 : feeAmt

    const totalClosing = FIXED_TOTAL + prepaidTotal + reserveTotal + feeInClosing
    const netAfterCredit = totalClosing - effectiveSellerCredit
    const excessCredit = Math.max(0, -netAfterCredit)
    const closingCashNeeded = Math.max(0, netAfterCredit)
    const totalCash = downPayment + closingCashNeeded

    return {
      downPayment, baseLoan, ltv, feeRate, feeAmt, totalLoan,
      monthlyPI, monthlyTax, totalPITIA,
      prepaidInsurance12, prepaidInterest9, prepaidTax6,
      reserveInsurance6, reserveTax3,
      prepaidTotal, reserveTotal,
      feeInClosing, totalClosing,
      excessCredit, closingCashNeeded, totalCash,
    }
  }, [purchasePrice, downPct, sellerCredit, feeFinanced, subsequentUse, monthlyInsurance, monthlyHOA, taxRatePct])

  // Slider fills
  const priceFill = ((purchasePrice - 500000) / (800000 - 500000)) * 100
  const downFill = (downPct / 20) * 100
  const creditFill = (effectiveSellerCredit / maxSellerCredit) * 100

  // PITIA bar shares
  const piShare = (c.monthlyPI / c.totalPITIA) * 100
  const taxShare = (c.monthlyTax / c.totalPITIA) * 100
  const insShare = (monthlyInsurance / c.totalPITIA) * 100
  const hoaShare = (monthlyHOA / c.totalPITIA) * 100

  return (
    <div className="max-w-xl mx-auto px-4 py-10 pb-24">

      {/* ── Header ── */}
      <div className="mb-8">
        <span className="inline-block bg-[#0066FF]/10 text-[#0066FF] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
          VA Purchase · No PMI · 30-Year Fixed
        </span>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#0a0a0a] leading-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Purchase Scenario
        </h1>
        <p className="text-[#0a0a0a]/60 text-lg mt-2">
          Prepared for <strong className="text-[#0a0a0a]">{CLIENT.name}</strong>
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-[#0a0a0a]/50">
          <span>Rate: <strong className="text-[#0a0a0a]">{RATE.toFixed(3)}%</strong> fixed</span>
          <span>·</span>
          <span>APR: <strong className="text-[#0a0a0a]">5.746%</strong></span>
          <span>·</span>
          <span>No mortgage insurance</span>
        </div>
      </div>

      {/* ── Property Address ── */}
      <div className="bg-[#f8f7f4] rounded-2xl border border-[#0a0a0a]/5 p-6 mb-5">
        <p className="text-xs font-bold text-[#0a0a0a]/40 uppercase tracking-widest mb-3">Property Address</p>
        <input
          type="text"
          placeholder="Enter property address…"
          value={address}
          onChange={e => handleAddressChange(e.target.value)}
          className="w-full text-sm text-[#0a0a0a] bg-white border border-[#0a0a0a]/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0066FF] transition-colors placeholder:text-[#0a0a0a]/30"
        />
        {address && (
          <p className="text-xs text-[#0a0a0a]/40 mt-2">Saved automatically</p>
        )}
      </div>

      {/* ── Scenario Controls ── */}
      <div className="bg-[#f8f7f4] rounded-2xl border border-[#0a0a0a]/5 p-6 mb-5 space-y-8">
        <p className="text-xs font-bold text-[#0a0a0a]/40 uppercase tracking-widest">Adjust Your Scenario</p>

        {/* Purchase Price */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#0a0a0a]">Purchase Price</label>
            <span className="text-2xl font-bold text-[#0a0a0a]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {fmt(purchasePrice)}
            </span>
          </div>
          <input
            type="range" min={500000} max={800000} step={5000}
            value={purchasePrice}
            onChange={e => setPurchasePrice(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ background: sliderBg(priceFill) }}
          />
          <div className="flex justify-between text-xs text-[#0a0a0a]/40 mt-1">
            <span>$500,000</span><span>$800,000</span>
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#0a0a0a]">Down Payment</label>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#0a0a0a]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {downPct === 0 ? '$0 down' : `${downPct.toFixed(1)}%`}
              </p>
              {downPct > 0 && (
                <p className="text-xs text-[#0a0a0a]/50 mt-0.5">{fmt(c.downPayment)}</p>
              )}
            </div>
          </div>
          <input
            type="range" min={0} max={20} step={0.5}
            value={downPct}
            onChange={e => setDownPct(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ background: sliderBg(downFill) }}
          />
          <div className="flex justify-between text-xs text-[#0a0a0a]/40 mt-1">
            <span>$0 (VA benefit)</span><span>20%</span>
          </div>
        </div>

        {/* Seller Credit */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="text-sm font-medium text-[#0a0a0a]">Seller Credit</label>
              <p className="text-xs text-[#0a0a0a]/40 mt-0.5">VA max: 4% of purchase price ({fmt(maxSellerCredit)})</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {fmt(effectiveSellerCredit)}
              </p>
              <p className="text-xs text-[#0a0a0a]/40 mt-0.5">{sellerCreditPct}% of price</p>
            </div>
          </div>
          <input
            type="range" min={0} max={maxSellerCredit} step={500}
            value={Math.min(sellerCredit, maxSellerCredit)}
            onChange={e => setSellerCredit(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ background: sliderBg(creditFill) }}
          />
          <div className="flex justify-between text-xs text-[#0a0a0a]/40 mt-1">
            <span>$0 (0%)</span><span>{fmt(maxSellerCredit)} (4%)</span>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-5 pt-4 border-t border-[#0a0a0a]/5">

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0a0a0a]">Finance VA Funding Fee into Loan</p>
              <p className="text-xs text-[#0a0a0a]/50 mt-0.5">
                {feeFinanced
                  ? `${fmt(c.feeAmt)} added to loan — $0 due at closing`
                  : `${fmt(c.feeAmt)} due at closing`}
                {' '}· {c.feeRate}% of base loan
              </p>
            </div>
            <Toggle value={feeFinanced} onChange={setFeeFinanced} />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0a0a0a]">Subsequent VA Loan Use</p>
              <p className="text-xs text-[#0a0a0a]/50 mt-0.5">
                {subsequentUse
                  ? 'Funding fee: 3.30% at 0% down'
                  : 'First-time VA use: 2.15% at 0% down'}
              </p>
            </div>
            <Toggle value={subsequentUse} onChange={setSubsequentUse} />
          </div>

        </div>
      </div>

      {/* ── Monthly Payment ── */}
      <div className="bg-[#f8f7f4] rounded-2xl border border-[#0a0a0a]/5 p-6 mb-5">
        <p className="text-xs font-bold text-[#0a0a0a]/40 uppercase tracking-widest mb-4">Monthly Payment</p>

        <div className="text-center mb-6">
          <p className="text-[#0a0a0a]/50 text-sm mb-1">Estimated Monthly Total (PITIA)</p>
          <p
            className="text-5xl font-bold text-[#0a0a0a]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {fmt(c.totalPITIA)}
          </p>
          <p className="text-xs text-[#0a0a0a]/40 mt-1.5">Principal · Interest · Taxes · Insurance · HOA</p>
        </div>

        {/* Color bar */}
        <div className="h-4 rounded-full overflow-hidden flex mb-5">
          <div className="h-full bg-[#0066FF] transition-all duration-300" style={{ width: `${piShare}%` }} />
          <div className="h-full bg-[#FFBA00] transition-all duration-300" style={{ width: `${taxShare}%` }} />
          <div className="h-full bg-[#22E8E8] transition-all duration-300" style={{ width: `${insShare}%` }} />
          <div className="h-full bg-[#FFB366] transition-all duration-300" style={{ width: `${hoaShare}%` }} />
        </div>

        <div className="space-y-3">
          {/* P&I */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full shrink-0 bg-[#0066FF]" />
              <span className="text-sm text-[#0a0a0a]">Principal & Interest</span>
            </div>
            <span className="text-sm font-semibold text-[#0a0a0a]">{fmt(c.monthlyPI, 2)}</span>
          </div>

          {/* Property Tax */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full shrink-0 bg-[#FFBA00]" />
              <span className="text-sm text-[#0a0a0a]">Property Taxes</span>
              <span className="text-xs text-[#0a0a0a]/35">({taxRatePct}%/yr est.)</span>
            </div>
            <span className="text-sm font-semibold text-[#0a0a0a]">{fmt(c.monthlyTax, 2)}</span>
          </div>

          {/* Insurance — editable */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full shrink-0 bg-[#22E8E8]" />
              <span className="text-sm text-[#0a0a0a]">Homeowner's Insurance</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-[#0a0a0a]/40">$</span>
              <input
                type="number"
                value={monthlyInsurance}
                min={0}
                onChange={e => setMonthlyInsurance(Math.max(0, Number(e.target.value)))}
                className="w-16 text-right text-sm font-semibold text-[#0a0a0a] bg-transparent border-b border-[#0a0a0a]/20 focus:border-[#0066FF] outline-none"
              />
              <span className="text-sm text-[#0a0a0a]/40">/mo</span>
            </div>
          </div>

          {/* HOA — editable */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full shrink-0 bg-[#FFB366]" />
              <span className="text-sm text-[#0a0a0a]">HOA Dues</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-[#0a0a0a]/40">$</span>
              <input
                type="number"
                value={monthlyHOA}
                min={0}
                onChange={e => setMonthlyHOA(Math.max(0, Number(e.target.value)))}
                className="w-16 text-right text-sm font-semibold text-[#0a0a0a] bg-transparent border-b border-[#0a0a0a]/20 focus:border-[#0066FF] outline-none"
              />
              <span className="text-sm text-[#0a0a0a]/40">/mo</span>
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-[#0a0a0a]/10">
            <span className="text-sm font-bold text-[#0a0a0a]">Monthly Total</span>
            <span className="text-sm font-bold text-[#0a0a0a]">{fmt(c.totalPITIA, 2)}</span>
          </div>
        </div>
      </div>

      {/* ── Loan Summary ── */}
      <div className="bg-[#f8f7f4] rounded-2xl border border-[#0a0a0a]/5 p-6 mb-5">
        <p className="text-xs font-bold text-[#0a0a0a]/40 uppercase tracking-widest mb-4">Loan Summary</p>
        <div className="space-y-2.5 text-sm">
          <LineItem label="Purchase Price" value={fmt(purchasePrice)} />
          {c.downPayment > 0 && (
            <LineItem label={`Down Payment (${downPct.toFixed(1)}%)`} value={`– ${fmt(c.downPayment)}`} />
          )}
          <LineItem label="Base VA Loan Amount" value={fmt(c.baseLoan)} />
          <LineItem
            label={`VA Funding Fee (${c.feeRate}% · ${feeFinanced ? 'financed' : 'at closing'})`}
            value={`+ ${fmt(c.feeAmt)}`}
            accent={feeFinanced ? undefined : 'amber'}
          />
          <div className="pt-2 border-t border-[#0a0a0a]/10">
            <LineItem label="Total Loan Amount" value={fmt(c.totalLoan)} bold />
          </div>
          <LineItem label="LTV · No PMI Required" value={`${((c.baseLoan / purchasePrice) * 100).toFixed(1)}%`} muted />
          <LineItem label="Condominium · Primary Residence" value="30-Year Fixed" muted />
        </div>
      </div>

      {/* ── Cash to Close ── */}
      <div className="bg-[#f8f7f4] rounded-2xl border border-[#0a0a0a]/5 p-6 mb-5">
        <p className="text-xs font-bold text-[#0a0a0a]/40 uppercase tracking-widest mb-4">Estimated Cash to Close</p>

        <div className="space-y-2 text-sm">

          {/* Lender fees */}
          <GroupHeading label="Lender & 3rd Party Fees" />
          {CANNOT_SHOP.map(item => (
            <LineItem key={item.label} label={item.label} value={fmt(item.amount, 2)} muted />
          ))}

          {/* Title */}
          <GroupHeading label="Title & Settlement" />
          {CAN_SHOP.map(item => (
            <LineItem key={item.label} label={item.label} value={fmt(item.amount, 2)} muted />
          ))}

          {/* Govt */}
          <GroupHeading label="Taxes & Government" />
          {GOVT_FEES.map(item => (
            <LineItem key={item.label} label={item.label} value={fmt(item.amount, 2)} muted />
          ))}

          {/* VA fee if not financed */}
          {!feeFinanced && (
            <>
              <GroupHeading label="VA Funding Fee" />
              <LineItem
                label={`VA Funding Fee (${c.feeRate}%)`}
                value={fmt(c.feeInClosing, 2)}
                accent="amber"
              />
            </>
          )}

          {/* Prepaids */}
          <GroupHeading label="Prepaids" />
          <LineItem label="Hazard Insurance Premium (12 months)" value={fmt(c.prepaidInsurance12, 2)} muted />
          <LineItem label="Prepaid Mortgage Interest (9 days)" value={fmt(c.prepaidInterest9, 2)} muted />
          <LineItem label="Property Taxes (6 months)" value={fmt(c.prepaidTax6, 2)} muted />

          {/* Reserves */}
          <GroupHeading label="Initial Escrow Reserves" />
          <LineItem label="Hazard Insurance Reserve (6 months)" value={fmt(c.reserveInsurance6, 2)} muted />
          <LineItem label="Property Tax Reserve (3 months)" value={fmt(c.reserveTax3, 2)} muted />

          {/* Subtotal */}
          <div className="pt-3 border-t border-[#0a0a0a]/10 space-y-2.5">
            <LineItem label="Total Closing Costs" value={fmt(c.totalClosing)} bold />

            {effectiveSellerCredit > 0 && (
              <LineItem
                label={`Seller Credit (${sellerCreditPct}% of price)`}
                value={`– ${fmt(effectiveSellerCredit)}`}
                accent="green"
              />
            )}

            {c.excessCredit > 0 && (
              <div className="bg-emerald-50 rounded-xl px-3 py-2 text-xs text-emerald-700">
                🎉 Credits exceed closing costs by <strong>{fmt(c.excessCredit)}</strong>. Excess may be applied to reduce the purchase price or returned per lender guidelines.
              </div>
            )}

            {c.downPayment > 0 && (
              <LineItem label={`Down Payment (${downPct.toFixed(1)}%)`} value={fmt(c.downPayment)} />
            )}
          </div>

          {/* Final */}
          <div className="pt-3 border-t-2 border-[#0a0a0a]/10">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-[#0a0a0a]">Total Cash to Close</span>
              <span
                className={`text-2xl font-bold ${c.totalCash === 0 ? 'text-emerald-600' : 'text-[#0a0a0a]'}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {c.totalCash === 0 ? '$0 ✓' : fmt(c.totalCash)}
              </span>
            </div>
            {c.totalCash === 0 && (
              <p className="text-xs text-emerald-600 mt-1 text-right">Closing costs fully covered by credits</p>
            )}
          </div>

        </div>
      </div>

      {/* ── Disclosures ── */}
      <div className="bg-[#0a0a0a]/[0.03] rounded-xl p-5 text-xs text-[#0a0a0a]/50 mb-8 space-y-2">
        <p className="font-semibold text-[#0a0a0a]/60">Important Disclosures</p>
        <p>
          This estimate is provided for illustrative and informational purposes only based on the initial basic loan scenario presented. This is not a loan approval or commitment to lend.
        </p>
        <p>
          Rate of {RATE.toFixed(3)}% / APR 5.746% is based on conditions as of 02/21/2026 and subject to change. Until a rate lock is confirmed, rates are subject to change or may not be available at commitment or closing.
        </p>
        <p>
          Property taxes estimated at {taxRatePct}% annually. Actual taxes determined by county assessor.
          VA Funding Fee rate shown for {subsequentUse ? 'subsequent' : 'first-time'} VA loan use at {downPct.toFixed(1)}% down ({c.feeRate}%).
          Veterans with a service-connected disability rating of 10%+ may be exempt — confirm eligibility with your lender.
        </p>
        <p>Annual Percentage Rate (APR) is an estimate based on criteria provided.</p>
      </div>

      {/* ── LO Footer ── */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-4 bg-[#f8f7f4] rounded-2xl px-6 py-5 border border-[#0a0a0a]/5">
          <div className="text-left">
            <p className="font-bold text-[#0a0a0a]">{LO.name}</p>
            <p className="text-xs text-[#0a0a0a]/60">NMLS# {LO.nmls} · LIC# {LO.license}</p>
            <p className="text-xs text-[#0a0a0a]/60">{LO.phone} · {LO.email}</p>
            <p className="text-xs text-[#0a0a0a]/50 mt-1">{LO.company}</p>
          </div>
        </div>
        <p className="text-xs text-[#0a0a0a]/30">{LO.broker} | {LO.web}</p>
      </div>

    </div>
  )
}
