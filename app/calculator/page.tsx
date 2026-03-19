'use client'

import { useState, useMemo } from 'react'

const LOAN_OFFICERS = [
  { name: 'Kyle Palaniuk', nmls: '984138', phone: '(425) 753-3204', email: 'kyle@planpreparehome.com' },
  { name: 'Jim Sakrison', nmls: '244905', phone: '(619) 251-5047', email: 'jim@planpreparehome.com' },
  { name: 'Anthony Cafiso', nmls: '2104568', phone: '(619) 843-6053', email: 'anthony@planpreparehome.com' },
]

const CONFORMING_LIMIT = 1_006_250

function calcMonthlyPI(loan: number, rate: number, term: number) {
  const r = rate / 100 / 12
  const n = term * 12
  if (r === 0) return loan / n
  return (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function calcPMI(loan: number, price: number, type: string) {
  const ltv = loan / price
  if (type === 'va') return 0
  if (type === 'fha') return (loan * (ltv > 0.9 ? 0.0055 : 0.005)) / 12
  if (ltv <= 0.8) return 0
  const rate = ltv <= 0.85 ? 0.003 : ltv <= 0.9 ? 0.005 : ltv <= 0.95 ? 0.007 : 0.009
  return (loan * rate) / 12
}

type GateState = 'form' | 'submitting' | 'done'

// Kanons input style
const inputCls = 'flex-1 bg-transparent text-sm font-semibold text-midnight focus:outline-none'
const inputWrapCls = 'flex items-center bg-cream border border-midnight/10 rounded-xl px-3 py-2.5 focus-within:border-ocean focus-within:ring-1 focus-within:ring-ocean transition-colors'
const labelCls = 'block text-xs text-midnight/50 mb-1.5 font-medium'

export default function CalculatorPage() {
  const [gate, setGate] = useState<GateState>('form')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientId, setClientId] = useState<string | null>(null)
  const [isNewClient, setIsNewClient] = useState(false)
  const [gateError, setGateError] = useState('')

  const [loanType, setLoanType] = useState<'conventional' | 'fha' | 'va'>('conventional')
  const [price, setPrice] = useState(650000)
  const [downPct, setDownPct] = useState(10)
  const [rate, setRate] = useState(6.5)
  const [term, setTerm] = useState(30)
  const [taxRate, setTaxRate] = useState(1.2)
  const [insurance, setInsurance] = useState(150)
  const [hoa, setHoa] = useState(0)
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [monthlyDebts, setMonthlyDebts] = useState(0)

  const calc = useMemo(() => {
    const down = price * (downPct / 100)
    let loan = price - down
    const ltv = loan / price
    const isJumbo = loan > CONFORMING_LIMIT
    const ufmip = loanType === 'fha' ? loan * 0.0175 : 0
    if (loanType === 'fha') loan += ufmip
    const pi = calcMonthlyPI(loan, rate, term)
    const pmi = calcPMI(loan, price, loanType)
    const tax = (price * (taxRate / 100)) / 12
    const ins = insurance
    const total = pi + pmi + tax + ins + hoa
    const frontDTI = monthlyIncome > 0 ? (total / monthlyIncome) * 100 : null
    const backDTI = monthlyIncome > 0 ? ((total + monthlyDebts) / monthlyIncome) * 100 : null
    const dtiOk = backDTI !== null ? backDTI <= 43 : null
    const dtiWarn = backDTI !== null ? backDTI > 43 && backDTI <= 50 : null
    return { down, loan, ltv, pi, pmi, tax, ins, hoa, total, ufmip, isJumbo, frontDTI, backDTI, dtiOk, dtiWarn }
  }, [price, downPct, rate, term, taxRate, insurance, hoa, loanType, monthlyIncome, monthlyDebts])

  async function handleGateSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientName.trim()) { setGateError('Name is required'); return }
    if (!clientEmail.trim() && !clientPhone.trim()) { setGateError('Please provide at least an email or phone number'); return }
    setGateError('')
    setGate('submitting')
    try {
      const res = await fetch('/api/pph/client-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: clientName, email: clientEmail, phone: clientPhone, source: 'Public Calculator' }),
      })
      const data = await res.json()
      if (res.ok) {
        setClientId(data.clientId)
        setIsNewClient(data.isNew)
        setGate('done')
      } else {
        setGateError(data.error || 'Something went wrong')
        setGate('form')
      }
    } catch {
      setGateError('Connection error — please try again')
      setGate('form')
    }
  }

  const fmt = (n: number) => '$' + Math.round(n).toLocaleString()
  const fmtPct = (n: number) => n.toFixed(1) + '%'

  // ── Gate screen ──
  if (gate !== 'done') {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo / Brand */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-ocean rounded-2xl mb-5 shadow-lg shadow-ocean/20">
              <span className="text-2xl">🏠</span>
            </div>
            <h1 className="font-display text-3xl text-cream mb-2">Purchase Calculator</h1>
            <p className="text-cream/40 text-sm leading-relaxed max-w-sm mx-auto">
              Get a full payment breakdown in seconds — no account needed.
            </p>
          </div>

          <form onSubmit={handleGateSubmit} className="bg-cream/5 backdrop-blur rounded-2xl border border-cream/10 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">
                Your Name <span className="text-terracotta">*</span>
              </label>
              <input
                type="text" value={clientName} onChange={e => setClientName(e.target.value)}
                placeholder="Jane Smith"
                autoComplete="name"
                className="w-full bg-cream/10 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/25 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">Email</label>
              <input
                type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)}
                placeholder="jane@example.com"
                autoComplete="email"
                className="w-full bg-cream/10 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/25 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream/70 mb-1.5">Phone</label>
              <input
                type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                placeholder="(619) 555-1234"
                autoComplete="tel"
                className="w-full bg-cream/10 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/25 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-colors"
              />
            </div>

            {gateError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{gateError}</p>
              </div>
            )}

            <button
              type="submit" disabled={gate === 'submitting'}
              className="w-full py-3.5 bg-ocean hover:bg-ocean/90 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 mt-2 shadow-lg shadow-ocean/20"
            >
              {gate === 'submitting' ? 'One moment...' : 'Calculate My Payment →'}
            </button>

            <p className="text-xs text-cream/25 text-center">
              Your info is only shared with your loan officer. No spam, ever.
            </p>
          </form>

          <p className="text-center text-cream/20 text-xs mt-6">Plan Prepare Home · planpreparehome.com</p>
        </div>
      </div>
    )
  }

  // ── Calculator screen ──
  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <div className="bg-midnight px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-ocean rounded-lg flex items-center justify-center text-sm">🏠</div>
          <span className="font-display text-cream text-sm font-semibold">Purchase Calculator</span>
        </div>
        <span className="text-cream/30 text-xs">Hi, {clientName.split(' ')[0]} 👋</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Loan type */}
        <div className="bg-white rounded-2xl border border-midnight/5 p-4">
          <p className={labelCls}>Loan Type</p>
          <div className="grid grid-cols-3 gap-2">
            {(['conventional', 'fha', 'va'] as const).map(t => (
              <button key={t} onClick={() => setLoanType(t)}
                className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  loanType === t
                    ? 'bg-midnight text-cream shadow-sm'
                    : 'bg-cream text-midnight/60 hover:bg-midnight/5'
                }`}>
                {t === 'conventional' ? 'Conventional' : t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Property inputs */}
        <div className="bg-white rounded-2xl border border-midnight/5 p-4 space-y-4">
          <p className={labelCls + ' uppercase tracking-wider'}>Property Details</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Purchase Price</label>
              <div className={inputWrapCls}>
                <span className="text-midnight/40 text-sm mr-1">$</span>
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Down Payment</label>
              <div className={inputWrapCls}>
                <input type="number" value={downPct}
                  onChange={e => setDownPct(Number(e.target.value))}
                  min={loanType === 'va' ? 0 : loanType === 'fha' ? 3.5 : 3} max={60}
                  className={inputCls} />
                <span className="text-midnight/40 text-sm ml-1">%</span>
              </div>
              <p className="text-xs text-midnight/35 mt-1">{fmt(price * downPct / 100)} down</p>
            </div>
            <div>
              <label className={labelCls}>Interest Rate</label>
              <div className={inputWrapCls}>
                <input type="number" step="0.125" value={rate} onChange={e => setRate(Number(e.target.value))} className={inputCls} />
                <span className="text-midnight/40 text-sm ml-1">%</span>
              </div>
            </div>
            <div>
              <label className={labelCls}>Loan Term</label>
              <select value={term} onChange={e => setTerm(Number(e.target.value))}
                className="w-full bg-cream border border-midnight/10 rounded-xl px-3 py-2.5 text-sm font-semibold text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean transition-colors">
                <option value={30}>30 years</option>
                <option value={20}>20 years</option>
                <option value={15}>15 years</option>
                <option value={10}>10 years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Optional inputs */}
        <div className="bg-white rounded-2xl border border-midnight/5 p-4 space-y-4">
          <p className={labelCls + ' uppercase tracking-wider'}>Costs & Income <span className="normal-case font-normal text-midnight/30">(optional — for DTI)</span></p>
          <div className="grid grid-cols-2 gap-4">
            {([
              { label: 'Property Tax Rate', value: taxRate, set: setTaxRate, step: 0.1, suffix: '%' },
              { label: 'Home Insurance /mo', value: insurance, set: setInsurance, prefix: '$' },
              { label: 'HOA /mo', value: hoa, set: setHoa, prefix: '$' },
              { label: 'Gross Income /mo', value: monthlyIncome, set: setMonthlyIncome, prefix: '$' },
              { label: 'Monthly Debts', value: monthlyDebts, set: setMonthlyDebts, prefix: '$' },
            ] as const).map(f => (
              <div key={f.label}>
                <label className={labelCls}>{f.label}</label>
                <div className={inputWrapCls}>
                  {'prefix' in f && f.prefix && <span className="text-midnight/40 text-sm mr-1">{f.prefix}</span>}
                  <input type="number" step={'step' in f ? f.step : 1} value={f.value}
                    onChange={e => (f.set as (v: number) => void)(Number(e.target.value))}
                    className={inputCls} />
                  {'suffix' in f && f.suffix && <span className="text-midnight/40 text-sm ml-1">{f.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment result — midnight card */}
        <div className="bg-midnight rounded-2xl p-6 text-cream">
          <p className="text-cream/40 text-xs font-semibold uppercase tracking-wider mb-1">Estimated Monthly Payment</p>
          <p className="font-display text-5xl text-cream mb-1">
            {fmt(calc.total)}
            <span className="text-cream/40 text-2xl">/mo</span>
          </p>
          <p className="text-cream/30 text-xs mb-5">Principal · Interest · Tax · Insurance{calc.pmi > 0 ? ' · PMI/MIP' : ''}{calc.hoa > 0 ? ' · HOA' : ''}</p>

          <div className="space-y-2.5 border-t border-cream/10 pt-4">
            {([
              { label: 'Principal & Interest', val: calc.pi },
              { label: 'Property Tax', val: calc.tax },
              { label: 'Home Insurance', val: calc.ins },
              calc.pmi > 0 ? { label: loanType === 'fha' ? 'FHA MIP' : 'PMI', val: calc.pmi } : null,
              calc.hoa > 0 ? { label: 'HOA', val: calc.hoa } : null,
            ] as const).filter(Boolean).map(row => (
              <div key={row!.label} className="flex justify-between text-sm">
                <span className="text-cream/50">{row!.label}</span>
                <span className="font-semibold text-cream">{fmt(row!.val)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Loan summary */}
        <div className="bg-white rounded-2xl border border-midnight/5 p-4">
          <p className={labelCls + ' uppercase tracking-wider mb-3'}>Loan Summary</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Loan Amount', val: fmt(calc.loan) },
              { label: 'Down Payment', val: fmt(calc.down) },
              { label: 'LTV', val: fmtPct(calc.ltv * 100) },
              { label: 'Loan Type', val: loanType === 'fha' ? 'FHA' : loanType === 'va' ? 'VA' : 'Conventional' },
              { label: 'Loan Class', val: calc.isJumbo ? '⚠️ Jumbo' : '✓ Conforming' },
              { label: 'Term', val: `${term} years` },
            ].map(r => (
              <div key={r.label} className="bg-cream rounded-xl p-3">
                <p className="text-xs text-midnight/40 mb-0.5">{r.label}</p>
                <p className="text-sm font-bold text-midnight">{r.val}</p>
              </div>
            ))}
          </div>
          {loanType === 'fha' && calc.ufmip > 0 && (
            <p className="text-xs text-midnight/35 mt-3 pl-1">
              FHA includes {fmt(calc.ufmip)} UFMIP rolled into the loan amount.
            </p>
          )}
        </div>

        {/* DTI */}
        {calc.backDTI !== null && (
          <div className={`rounded-2xl border p-4 ${
            calc.dtiOk ? 'bg-emerald-50 border-emerald-200/60' :
            calc.dtiWarn ? 'bg-amber-50 border-amber-200/60' :
            'bg-red-50 border-red-200/60'
          }`}>
            <p className={labelCls + ' uppercase tracking-wider mb-3'}>Debt-to-Income</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: 'Front-End', val: calc.frontDTI!, hint: 'Housing · target <28%' },
                { label: 'Back-End', val: calc.backDTI, hint: 'All debts · target <43%' },
              ].map(d => (
                <div key={d.label}>
                  <p className="text-xs text-midnight/40 mb-1">{d.label}</p>
                  <p className={`text-2xl font-bold ${
                    calc.dtiOk ? 'text-emerald-700' :
                    calc.dtiWarn ? 'text-amber-700' : 'text-red-600'
                  }`}>{fmtPct(d.val)}</p>
                  <p className="text-xs text-midnight/35 mt-0.5">{d.hint}</p>
                </div>
              ))}
            </div>
            <div className="w-full bg-midnight/8 rounded-full h-1.5 overflow-hidden mb-3">
              <div className={`h-1.5 rounded-full transition-all ${
                calc.dtiOk ? 'bg-emerald-500' : calc.dtiWarn ? 'bg-amber-500' : 'bg-red-500'
              }`} style={{ width: `${Math.min(calc.backDTI, 100)}%` }} />
            </div>
            <p className={`text-xs font-medium ${
              calc.dtiOk ? 'text-emerald-700' : calc.dtiWarn ? 'text-amber-700' : 'text-red-600'
            }`}>
              {calc.dtiOk
                ? '✓ Within conventional guidelines'
                : calc.dtiWarn
                ? '⚠ Borderline — FHA may offer more flexibility'
                : '✗ Above typical limits — let\'s talk through your options'}
            </p>
          </div>
        )}

        {/* LO Contact */}
        <div className="bg-midnight rounded-2xl p-5">
          <p className="text-cream/40 text-xs mb-4">Ready to move forward? Talk to your team:</p>
          <div className="space-y-3">
            {LOAN_OFFICERS.map(lo => (
              <div key={lo.nmls} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-cream text-sm">{lo.name}</p>
                  <p className="text-cream/30 text-xs">NMLS #{lo.nmls}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a href={`tel:${lo.phone}`}
                    className="px-3 py-1.5 bg-cream/10 hover:bg-cream/20 text-cream rounded-lg text-xs transition-colors">
                    📞 Call
                  </a>
                  <a href={`mailto:${lo.email}`}
                    className="px-3 py-1.5 bg-ocean hover:bg-ocean/80 text-white rounded-lg text-xs transition-colors">
                    Email
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="text-cream/15 text-xs mt-5 text-center">Plan Prepare Home · planpreparehome.com</p>
        </div>

      </div>
    </div>
  )
}
