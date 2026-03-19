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

export default function CalculatorPage() {
  // ── Gate state ──
  const [gate, setGate] = useState<GateState>('form')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientId, setClientId] = useState<string | null>(null)
  const [isNewClient, setIsNewClient] = useState(false)
  const [gateError, setGateError] = useState('')

  // ── Calculator inputs ──
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

  // ── Math ──
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
    if (!clientEmail.trim() && !clientPhone.trim()) { setGateError('Please provide at least an email or phone'); return }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Purchase Scenario Calculator</h1>
            <p className="text-slate-400 text-sm">Get a full payment breakdown in seconds. Enter your info to get started — no account needed.</p>
          </div>

          <form onSubmit={handleGateSubmit} className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Your Name <span className="text-red-400">*</span></label>
              <input
                type="text" value={clientName} onChange={e => setClientName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone</label>
              <input
                type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                placeholder="(619) 555-1234"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
              />
            </div>

            {gateError && <p className="text-red-400 text-sm">{gateError}</p>}

            <button
              type="submit" disabled={gate === 'submitting'}
              className="w-full py-3.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 mt-2"
            >
              {gate === 'submitting' ? 'Just a sec...' : 'Calculate My Payment →'}
            </button>

            <p className="text-xs text-slate-500 text-center">Your info is only shared with your loan officer. No spam, ever.</p>
          </form>
        </div>
      </div>
    )
  }

  // ── Calculator screen ──
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🏠</span>
            <h1 className="text-xl font-bold text-slate-900">Purchase Calculator</h1>
          </div>
          <p className="text-sm text-slate-500">Hi {clientName.split(' ')[0]} — adjust the numbers below to explore your payment options.</p>
        </div>

        {/* Loan type */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Loan Type</p>
          <div className="grid grid-cols-3 gap-2">
            {(['conventional', 'fha', 'va'] as const).map(t => (
              <button key={t} onClick={() => setLoanType(t)}
                className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${loanType === t ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {t === 'conventional' ? 'Conv' : t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Property Details</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Purchase Price</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <span className="text-slate-400 text-sm mr-1">$</span>
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))}
                  className="flex-1 bg-transparent text-sm font-semibold text-slate-900 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Down Payment %</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <input type="number" value={downPct} onChange={e => setDownPct(Number(e.target.value))} min={loanType === 'va' ? 0 : loanType === 'fha' ? 3.5 : 3} max={60}
                  className="flex-1 bg-transparent text-sm font-semibold text-slate-900 focus:outline-none" />
                <span className="text-slate-400 text-sm ml-1">%</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Down: {fmt(price * downPct / 100)}</p>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Interest Rate</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <input type="number" step="0.125" value={rate} onChange={e => setRate(Number(e.target.value))}
                  className="flex-1 bg-transparent text-sm font-semibold text-slate-900 focus:outline-none" />
                <span className="text-slate-400 text-sm ml-1">%</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Loan Term</label>
              <select value={term} onChange={e => setTerm(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none">
                <option value={30}>30 years</option>
                <option value={20}>20 years</option>
                <option value={15}>15 years</option>
                <option value={10}>10 years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Optional inputs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Costs & Income (optional)</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Property Tax Rate %', value: taxRate, set: setTaxRate, step: 0.1, suffix: '%' },
              { label: 'Home Insurance /mo', value: insurance, set: setInsurance, prefix: '$' },
              { label: 'HOA /mo', value: hoa, set: setHoa, prefix: '$' },
              { label: 'Gross Income /mo', value: monthlyIncome, set: setMonthlyIncome, prefix: '$', hint: 'For DTI' },
              { label: 'Monthly Debts', value: monthlyDebts, set: setMonthlyDebts, prefix: '$', hint: 'Car, student loans, etc.' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs text-slate-500 mb-1">{f.label}</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                  {f.prefix && <span className="text-slate-400 text-sm mr-1">{f.prefix}</span>}
                  <input type="number" step={f.step || 1} value={f.value}
                    onChange={e => f.set(Number(e.target.value))}
                    className="flex-1 bg-transparent text-sm font-semibold text-slate-900 focus:outline-none" />
                  {f.suffix && <span className="text-slate-400 text-sm ml-1">{f.suffix}</span>}
                </div>
                {f.hint && <p className="text-xs text-slate-400 mt-1">{f.hint}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-blue-600 rounded-2xl p-5 mb-4 text-white">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Estimated Monthly Payment</p>
          <p className="text-4xl font-bold mb-4">{fmt(calc.total)}<span className="text-blue-300 text-xl">/mo</span></p>
          <div className="space-y-2">
            {[
              { label: 'Principal & Interest', val: calc.pi },
              { label: 'Property Tax', val: calc.tax },
              { label: 'Home Insurance', val: calc.ins },
              calc.pmi > 0 ? { label: loanType === 'fha' ? 'FHA MIP' : 'PMI', val: calc.pmi } : null,
              calc.hoa > 0 ? { label: 'HOA', val: calc.hoa } : null,
            ].filter(Boolean).map(row => (
              <div key={row!.label} className="flex justify-between text-sm">
                <span className="text-blue-200">{row!.label}</span>
                <span className="font-semibold">{fmt(row!.val)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Loan summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Loan Summary</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Loan Amount', val: fmt(calc.loan) },
              { label: 'Down Payment', val: fmt(calc.down) },
              { label: 'LTV', val: fmtPct(calc.ltv * 100) },
              { label: 'Loan Type', val: loanType === 'fha' ? 'FHA' : loanType === 'va' ? 'VA' : 'Conventional' },
              calc.isJumbo ? { label: 'Loan Class', val: '⚠️ Jumbo' } : { label: 'Loan Class', val: '✓ Conforming' },
              { label: 'Term', val: `${term} years` },
            ].map(r => (
              <div key={r.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-0.5">{r.label}</p>
                <p className="text-sm font-bold text-slate-900">{r.val}</p>
              </div>
            ))}
          </div>
          {loanType === 'fha' && calc.ufmip > 0 && (
            <p className="text-xs text-slate-400 mt-3">FHA includes {fmt(calc.ufmip)} UFMIP rolled into loan amount.</p>
          )}
        </div>

        {/* DTI */}
        {calc.backDTI !== null && (
          <div className={`rounded-2xl border p-4 mb-4 ${calc.dtiOk ? 'bg-emerald-50 border-emerald-200' : calc.dtiWarn ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-slate-600">Debt-to-Income</p>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Front-End DTI</p>
                <p className={`text-xl font-bold ${calc.dtiOk ? 'text-emerald-700' : calc.dtiWarn ? 'text-amber-700' : 'text-red-700'}`}>{fmtPct(calc.frontDTI!)}</p>
                <p className="text-xs text-slate-400">Housing only · target &lt;28%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Back-End DTI</p>
                <p className={`text-xl font-bold ${calc.dtiOk ? 'text-emerald-700' : calc.dtiWarn ? 'text-amber-700' : 'text-red-700'}`}>{fmtPct(calc.backDTI)}</p>
                <p className="text-xs text-slate-400">All debts · target &lt;43%</p>
              </div>
            </div>
            <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden">
              <div className={`h-2 rounded-full transition-all ${calc.dtiOk ? 'bg-emerald-500' : calc.dtiWarn ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(calc.backDTI, 100)}%` }} />
            </div>
            <p className={`text-xs font-medium mt-2 ${calc.dtiOk ? 'text-emerald-700' : calc.dtiWarn ? 'text-amber-700' : 'text-red-700'}`}>
              {calc.dtiOk ? '✓ Looks good — within conventional guidelines' : calc.dtiWarn ? '⚠ Borderline — FHA may be more flexible' : '✗ Above typical limits — let\'s talk options'}
            </p>
          </div>
        )}

        {/* LO Contact */}
        <div className="bg-slate-900 rounded-2xl p-5 text-white">
          <p className="text-slate-400 text-xs mb-4">Ready to move forward? Your team:</p>
          <div className="space-y-3">
            {LOAN_OFFICERS.map(lo => (
              <div key={lo.nmls} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{lo.name}</p>
                  <p className="text-slate-400 text-xs">NMLS #{lo.nmls}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${lo.phone}`} className="px-3 py-1.5 bg-white/10 rounded-lg text-xs hover:bg-white/20 transition-colors">📞 Call</a>
                  <a href={`mailto:${lo.email}`} className="px-3 py-1.5 bg-blue-500 rounded-lg text-xs hover:bg-blue-400 transition-colors">Email</a>
                </div>
              </div>
            ))}
          </div>
          <p className="text-slate-600 text-xs mt-4 text-center">Plan Prepare Home · planpreparehome.com</p>
        </div>

      </div>
    </div>
  )
}
