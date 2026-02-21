'use client'

import { useState, useMemo } from 'react'

// ─── Config ───────────────────────────────────────────────────────────────────

const LO = {
  name: 'Kyle Palaniuk',
  nmls: '984138',
  phone: '(425) 753-3204',
  email: 'kyle@planpreparehome.com',
  company: 'Plan Prepare Home | Granada House Group',
  broker: 'C2 Financial Corporation | NMLS# 135622 | CA BRE# 01821025',
  web: 'planpreparehome.com',
}

const CLIENT = {
  name: 'Derek & Kelsey Armenta',
  program: 'VA Purchase Loan',
}

const INTEREST_RATE = 6.625 // Locked rate per LO

// ─── VA Funding Fee ───────────────────────────────────────────────────────────

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

// ─── Closing Cost Line Items (Fixed) ──────────────────────────────────────────

const CLOSING_COSTS = [
  // Lender
  { group: 'Lender Fees', label: 'Origination / Admin Fee', amount: 995 },
  { group: 'Lender Fees', label: 'VA Appraisal', amount: 700 },
  { group: 'Lender Fees', label: 'Credit Report', amount: 75 },
  { group: 'Lender Fees', label: 'Flood Certification', amount: 25 },
  { group: 'Lender Fees', label: 'Tax Service Fee', amount: 85 },
  // Title & Escrow
  { group: 'Title & Escrow', label: "Lender's Title Insurance", amount: 1195 },
  { group: 'Title & Escrow', label: "Owner's Title Insurance", amount: 975 },
  { group: 'Title & Escrow', label: 'Settlement / Escrow Fee', amount: 1395 },
  { group: 'Title & Escrow', label: 'Wire Fee', amount: 35 },
  { group: 'Title & Escrow', label: 'Notary', amount: 200 },
  { group: 'Title & Escrow', label: 'Recording Fee', amount: 150 },
  // HOA
  { group: 'HOA', label: 'HOA Transfer / Resale Disclosure', amount: 350 },
]

const FIXED_TOTAL = CLOSING_COSTS.reduce((s, c) => s + c.amount, 0)

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

// ─── Toggle ───────────────────────────────────────────────────────────────────

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

// ─── Section Heading ──────────────────────────────────────────────────────────

function SectionHeading({ title }: { title: string }) {
  return (
    <p className="text-xs font-bold text-[#0a0a0a]/40 uppercase tracking-widest mb-4">{title}</p>
  )
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function Row({ label, value, accent, muted, bold }: {
  label: string
  value: string
  accent?: boolean
  muted?: boolean
  bold?: boolean
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={muted ? 'text-[#0a0a0a]/50' : 'text-[#0a0a0a]/70'}>{label}</span>
      <span
        className={`font-medium ${
          accent === true ? 'text-emerald-600' :
          accent === false ? 'text-amber-600' :
          bold ? 'font-bold text-[#0a0a0a]' : 'text-[#0a0a0a]'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DerekArmentaVAPage() {
  // Adjustable inputs
  const [purchasePrice, setPurchasePrice] = useState(625000)
  const [downPct, setDownPct] = useState(0)
  const [sellerCredit, setSellerCredit] = useState(15000)
  const [feeFinanced, setFeeFinanced] = useState(true)
  const [subsequentUse, setSubsequentUse] = useState(false)

  // Editable monthly costs
  const [monthlyInsurance, setMonthlyInsurance] = useState(150)
  const [monthlyHOA, setMonthlyHOA] = useState(450)
  const [taxRatePct, setTaxRatePct] = useState(1.25)

  // ─── Calculations ───────────────────────────────────────────────────────────
  const c = useMemo(() => {
    const downPayment = purchasePrice * (downPct / 100)
    const baseLoan = purchasePrice - downPayment
    const ltv = (baseLoan / purchasePrice) * 100

    const feeRate = getVAFundingFeeRate(downPct, subsequentUse)
    const feeAmt = baseLoan * (feeRate / 100)

    const totalLoan = feeFinanced ? baseLoan + feeAmt : baseLoan

    const monthlyPI = calcPI(totalLoan, INTEREST_RATE)
    const monthlyTax = (purchasePrice * taxRatePct / 100) / 12
    const totalPITIA = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA

    // Closing costs
    const prepaidInsurance = monthlyInsurance * 12
    const prepaidInterest = totalLoan * INTEREST_RATE / 100 / 365 * 15
    const reserveInsurance = monthlyInsurance * 3
    const reserveTaxes = monthlyTax * 3

    const feeInClosing = feeFinanced ? 0 : feeAmt
    const totalClosing =
      FIXED_TOTAL + prepaidInsurance + prepaidInterest + reserveInsurance + reserveTaxes + feeInClosing

    const netAfterCredit = totalClosing - sellerCredit
    const excessCredit = Math.max(0, -netAfterCredit)
    const closingCashNeeded = Math.max(0, netAfterCredit)
    const totalCash = downPayment + closingCashNeeded

    return {
      downPayment, baseLoan, ltv, feeRate, feeAmt, totalLoan,
      monthlyPI, monthlyTax, totalPITIA,
      prepaidInsurance, prepaidInterest, reserveInsurance, reserveTaxes,
      feeInClosing, totalClosing,
      excessCredit, closingCashNeeded, totalCash,
    }
  }, [purchasePrice, downPct, sellerCredit, feeFinanced, subsequentUse, monthlyInsurance, monthlyHOA, taxRatePct])

  // Slider fill percentages
  const priceFill = ((purchasePrice - 500000) / (800000 - 500000)) * 100
  const downFill = (downPct / 20) * 100
  const creditFill = (sellerCredit / 25000) * 100

  // Payment bar shares
  const piShare = (c.monthlyPI / c.totalPITIA) * 100
  const taxShare = (c.monthlyTax / c.totalPITIA) * 100
  const insShare = (monthlyInsurance / c.totalPITIA) * 100
  const hoaShare = (monthlyHOA / c.totalPITIA) * 100

  return (
    <div className="max-w-xl mx-auto px-4 py-10 pb-24">

      {/* ── Header ── */}
      <div className="mb-8">
        <span className="inline-block bg-[#0066FF]/10 text-[#0066FF] text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
          VA Purchase · No PMI
        </span>
        <h1
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          className="text-3xl md:text-4xl font-bold text-[#0a0a0a] leading-tight"
        >
          Purchase Scenario
        </h1>
        <p className="text-[#0a0a0a]/60 text-lg mt-2">
          Prepared for <strong className="text-[#0a0a0a]">{CLIENT.name}</strong>
        </p>
        <div className="flex flex-wrap gap-3 mt-3 text-sm text-[#0a0a0a]/50">
          <span>Rate: <strong className="text-[#0a0a0a]">{INTEREST_RATE.toFixed(3)}%</strong> fixed 30yr</span>
          <span>·</span>
          <span>VA Loan — No PMI Required</span>
        </div>
      </div>

      {/* ── Scenario Controls ── */}
      <div className="bg-[#f8f7f4] rounded-2xl border border-[#0a0a0a]/5 p-6 mb-5 space-y-8">
        <SectionHeading title="Adjust Your Scenario" />

        {/* Purchase Price */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#0a0a0a]">Purchase Price</label>
            <span className="text-xl font-bold text-[#0a0a0a]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
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
              <span className="text-xl font-bold text-[#0a0a0a]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {downPct === 0 ? '$0 (0%)' : `${downPct.toFixed(1)}%`}
              </span>
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
            <label className="text-sm font-medium text-[#0a0a0a]">Seller Credit</label>
            <span className="text-xl font-bold text-emerald-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {fmt(sellerCredit)}
            </span>
          </div>
          <input
            type="range" min={0} max={25000} step={500}
            value={sellerCredit}
            onChange={e => setSellerCredit(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ background: sliderBg(creditFill) }}
          />
          <div className="flex justify-between text-xs text-[#0a0a0a]/40 mt-1">
            <span>$0 (no credit)</span><span>$25,000</span>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-5 pt-4 border-t border-[#0a0a0a]/5">

          {/* Finance VA Fee */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0a0a0a]">Finance VA Funding Fee</p>
              <p className="text-xs text-[#0a0a0a]/50 mt-0.5">
                {feeFinanced
                  ? `${fmt(c.feeAmt)} added to loan — nothing due at closing`
                  : `${fmt(c.feeAmt)} due at closing`}
                {' '}({c.feeRate}%)
              </p>
            </div>
            <Toggle value={feeFinanced} onChange={setFeeFinanced} />
          </div>

          {/* Subsequent Use */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#0a0a0a]">Subsequent VA Loan Use</p>
              <p className="text-xs text-[#0a0a0a]/50 mt-0.5">
                {subsequentUse
                  ? 'Higher funding fee applies (3.30% at 0% down)'
                  : 'First-time VA use (2.15% at 0% down)'}
              </p>
            </div>
            <Toggle value={subsequentUse} onChange={setSubsequentUse} />
          </div>

        </div>
      </div>

      {/* ── Monthly Payment ── */}
      <div className="bg-[#f8f7f4] rounded-2xl border border-[#0a0a0a]/5 p-6 mb-5">
        <SectionHeading title="Monthly Payment" />

        {/* Big number */}
        <div className="text-center mb-6">
          <p className="text-[#0a0a0a]/50 text-sm mb-1">Estimated Monthly PITIA</p>
          <p className="text-5xl font-bold text-[#0a0a0a]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {fmt(c.totalPITIA)}
          </p>
          <p className="text-xs text-[#0a0a0a]/40 mt-1">Principal · Interest · Taxes · Insurance · HOA</p>
        </div>

        {/* Visual breakdown bar */}
        <div className="h-4 rounded-full overflow-hidden flex mb-6">
          <div className="h-full bg-[#0066FF] transition-all duration-300" style={{ width: `${piShare}%` }} />
          <div className="h-full bg-[#FFBA00] transition-all duration-300" style={{ width: `${taxShare}%` }} />
          <div className="h-full bg-[#22E8E8] transition-all duration-300" style={{ width: `${insShare}%` }} />
          <div className="h-full bg-[#FFB366] transition-all duration-300" style={{ width: `${hoaShare}%` }} />
        </div>

        {/* Line items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full shrink-0 bg-[#0066FF]" />
              <span className="text-sm text-[#0a0a0a]">Principal & Interest</span>
            </div>
            <span className="text-sm font-semibold text-[#0a0a0a]">{fmt(c.monthlyPI, 2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full shrink-0 bg-[#FFBA00]" />
              <span className="text-sm text-[#0a0a0a]">Property Taxes</span>
              <button
                className="text-xs text-[#0a0a0a]/30 hover:text-[#0066FF] transition-colors"
                title="Click to edit tax rate"
              >
                <span>{taxRatePct}%/yr</span>
              </button>
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
        <SectionHeading title="Loan Summary" />
        <div className="space-y-2.5">
          <Row label="Purchase Price" value={fmt(purchasePrice)} />
          {c.downPayment > 0 && (
            <Row label={`Down Payment (${downPct.toFixed(1)}%)`} value={`– ${fmt(c.downPayment)}`} />
          )}
          <Row label="Base VA Loan Amount" value={fmt(c.baseLoan)} />
          <Row
            label={`VA Funding Fee (${c.feeRate}% · ${feeFinanced ? 'financed into loan' : 'paid at closing'})`}
            value={`+ ${fmt(c.feeAmt)}`}
            accent={feeFinanced ? undefined : false}
          />
          <div className="pt-2 border-t border-[#0a0a0a]/10">
            <Row label="Total Loan Amount" value={fmt(c.totalLoan)} bold />
          </div>
          <Row
            label="Loan-to-Value (LTV)"
            value={`${((c.baseLoan / purchasePrice) * 100).toFixed(1)}% · No PMI`}
            muted
          />
        </div>
      </div>

      {/* ── Cash to Close ── */}
      <div className="bg-[#f8f7f4] rounded-2xl border border-[#0a0a0a]/5 p-6 mb-5">
        <SectionHeading title="Estimated Cash to Close" />

        <div className="space-y-2.5 text-sm">

          {/* Lender Fees */}
          <p className="text-xs font-bold text-[#0a0a0a]/30 uppercase tracking-widest pt-1">Lender Fees</p>
          {CLOSING_COSTS.filter(c => c.group === 'Lender Fees').map(item => (
            <Row key={item.label} label={item.label} value={fmt(item.amount)} muted />
          ))}

          {/* Title & Escrow */}
          <p className="text-xs font-bold text-[#0a0a0a]/30 uppercase tracking-widest pt-3">Title & Escrow</p>
          {CLOSING_COSTS.filter(c => c.group === 'Title & Escrow').map(item => (
            <Row key={item.label} label={item.label} value={fmt(item.amount)} muted />
          ))}

          {/* HOA */}
          <p className="text-xs font-bold text-[#0a0a0a]/30 uppercase tracking-widest pt-3">HOA</p>
          {CLOSING_COSTS.filter(c => c.group === 'HOA').map(item => (
            <Row key={item.label} label={item.label} value={fmt(item.amount)} muted />
          ))}

          {/* VA Funding Fee (if not financed) */}
          {!feeFinanced && (
            <>
              <p className="text-xs font-bold text-[#0a0a0a]/30 uppercase tracking-widest pt-3">VA Funding Fee</p>
              <Row label={`VA Funding Fee (${c.feeRate}%)`} value={fmt(c.feeInClosing)} accent={false} />
            </>
          )}

          {/* Prepaids */}
          <p className="text-xs font-bold text-[#0a0a0a]/30 uppercase tracking-widest pt-3">Prepaids</p>
          <Row label="12 Months Homeowner's Insurance" value={fmt(c.prepaidInsurance)} muted />
          <Row label="Prepaid Mortgage Interest (15 days)" value={fmt(c.prepaidInterest)} muted />

          {/* Reserves */}
          <p className="text-xs font-bold text-[#0a0a0a]/30 uppercase tracking-widest pt-3">Escrow Reserves</p>
          <Row label="3 Months Insurance" value={fmt(c.reserveInsurance)} muted />
          <Row label="3 Months Property Taxes" value={fmt(c.reserveTaxes)} muted />

          {/* Subtotals */}
          <div className="pt-3 border-t border-[#0a0a0a]/10 space-y-2.5">
            <Row label="Total Closing Costs" value={fmt(c.totalClosing)} bold />

            {sellerCredit > 0 && (
              <Row label="Seller Credit" value={`– ${fmt(sellerCredit)}`} accent />
            )}

            {c.excessCredit > 0 && (
              <div className="bg-emerald-50 rounded-xl px-3 py-2 text-xs text-emerald-700">
                Seller credit exceeds closing costs by <strong>{fmt(c.excessCredit)}</strong>. Excess may reduce the purchase price or be re-negotiated with the seller.
              </div>
            )}

            {c.downPayment > 0 && (
              <Row label="Down Payment" value={fmt(c.downPayment)} />
            )}
          </div>

          {/* Final Cash to Close */}
          <div className="flex justify-between items-center pt-3 border-t-2 border-[#0a0a0a]/10">
            <span className="font-bold text-base text-[#0a0a0a]">Total Cash to Close</span>
            <span
              className={`font-bold text-xl ${c.totalCash === 0 ? 'text-emerald-600' : 'text-[#0a0a0a]'}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {c.totalCash === 0 ? '$0 — Fully Covered' : fmt(c.totalCash)}
            </span>
          </div>

        </div>
      </div>

      {/* ── Disclosures ── */}
      <div className="bg-[#0a0a0a]/[0.03] rounded-xl p-5 text-xs text-[#0a0a0a]/50 mb-8 space-y-2">
        <p className="font-semibold text-[#0a0a0a]/60">Important Disclosures</p>
        <p>
          Interest rate of {INTEREST_RATE}% is based on current market conditions and is subject to change.
          This is not a loan commitment, rate lock, or Good Faith Estimate.
        </p>
        <p>
          Closing costs are estimates and will vary based on final loan terms, title company, and closing date.
          Property taxes estimated at {taxRatePct}% annually; actual taxes are determined by the county assessor.
        </p>
        <p>
          VA Funding Fee shown for {subsequentUse ? 'subsequent' : 'first-time'} VA loan use.
          Veterans with a service-connected disability rating of 10% or greater may be exempt from the VA Funding Fee — confirm eligibility with your lender.
        </p>
        <p>This tool is for educational discussion purposes only and does not constitute legal or financial advice.</p>
      </div>

      {/* ── LO Footer ── */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-4 bg-[#f8f7f4] rounded-2xl px-6 py-5 border border-[#0a0a0a]/5">
          <div className="text-left">
            <p className="font-bold text-[#0a0a0a]">{LO.name}</p>
            <p className="text-xs text-[#0a0a0a]/60">NMLS# {LO.nmls}</p>
            <p className="text-xs text-[#0a0a0a]/60">{LO.phone} · {LO.email}</p>
            <p className="text-xs text-[#0a0a0a]/50 mt-1">{LO.company}</p>
          </div>
        </div>
        <p className="text-xs text-[#0a0a0a]/30">{LO.broker} | {LO.web}</p>
      </div>

    </div>
  )
}
