'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface LineItem {
  id: string
  description: string
  amount: number
}

interface Party {
  name: string
  revenue: LineItem[]
  expenses: LineItem[]
  splitPercent: number
}

interface TipItem {
  id: string
  recipient: string
  amount: number
  via: string
}

export default function EventSplitterPage() {
  const [eventName, setEventName] = useState('GH Concert')
  const [eventDate, setEventDate] = useState('Feb 14, 2026')
  
  // Initialize with pre-loaded GH Concert data
  const [parties, setParties] = useState<Party[]>([
    {
      name: 'Dom',
      revenue: [],
      expenses: [
        { id: '1', description: 'Expenses', amount: 56 }
      ],
      splitPercent: 25
    },
    {
      name: 'Seton',
      revenue: [
        { id: '2', description: 'Square reader', amount: 328 }
      ],
      expenses: [
        { id: '3', description: 'Jimmy', amount: 150 },
        { id: '4', description: 'Smart & Final', amount: 88 }
      ],
      splitPercent: 25
    },
    {
      name: 'Kyle',
      revenue: [],
      expenses: [],
      splitPercent: 25
    },
    {
      name: 'Granada House',
      revenue: [
        { id: '5', description: 'Toast Tab bar', amount: 657 },
        { id: '6', description: 'Venmo tickets/beer/popcorn', amount: 955 }
      ],
      expenses: [
        { id: '7', description: 'Amanda', amount: 150 },
        { id: '8', description: 'Nico', amount: 100 },
        { id: '9', description: 'other', amount: 37 }
      ],
      splitPercent: 25
    }
  ])

  const [tips, setTips] = useState<TipItem[]>([
    { id: '1', recipient: 'Nico', amount: 56, via: 'Seton' },
    { id: '2', recipient: 'Amanda', amount: 137, via: 'Granada House' }
  ])

  const [showAddRevenue, setShowAddRevenue] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddTip, setShowAddTip] = useState(false)
  const [selectedPartyForRevenue, setSelectedPartyForRevenue] = useState('')
  const [selectedPartyForExpense, setSelectedPartyForExpense] = useState('')

  // Calculate totals
  const totalRevenue = useMemo(() => {
    return parties.reduce((sum, party) => {
      return sum + party.revenue.reduce((s, item) => s + item.amount, 0)
    }, 0)
  }, [parties])

  const totalExpenses = useMemo(() => {
    return parties.reduce((sum, party) => {
      return sum + party.expenses.reduce((s, item) => s + item.amount, 0)
    }, 0)
  }, [parties])

  const netProceeds = useMemo(() => {
    return totalRevenue - totalExpenses
  }, [totalRevenue, totalExpenses])

  const totalTips = useMemo(() => {
    return tips.reduce((sum, tip) => sum + tip.amount, 0)
  }, [tips])

  // Calculate what each party should receive based on split
  const settlement = useMemo(() => {
    const balances: Record<string, number> = {}
    
    // Calculate net position for each party
    parties.forEach(party => {
      const partyRevenue = party.revenue.reduce((sum, item) => sum + item.amount, 0)
      const partyExpenses = party.expenses.reduce((sum, item) => sum + item.amount, 0)
      const partyShare = netProceeds * (party.splitPercent / 100)
      
      // What they should receive minus what they've already received (revenue - expenses)
      balances[party.name] = partyShare - (partyRevenue - partyExpenses)
    })

    // Create settlement transactions
    const settlements: { from: string; to: string; amount: number }[] = []
    const debtors = Object.entries(balances).filter(([_, amount]) => amount < 0).sort((a, b) => a[1] - b[1])
    const creditors = Object.entries(balances).filter(([_, amount]) => amount > 0).sort((a, b) => b[1] - a[1])

    let i = 0
    let j = 0
    
    while (i < debtors.length && j < creditors.length) {
      const [debtor, debtAmount] = debtors[i]
      const [creditor, creditAmount] = creditors[j]
      
      const settleAmount = Math.min(Math.abs(debtAmount), creditAmount)
      
      if (settleAmount > 0.01) {
        settlements.push({
          from: debtor,
          to: creditor,
          amount: settleAmount
        })
      }
      
      debtors[i] = [debtor, debtAmount + settleAmount]
      creditors[j] = [creditor, creditAmount - settleAmount]
      
      if (Math.abs(debtors[i][1]) < 0.01) i++
      if (Math.abs(creditors[j][1]) < 0.01) j++
    }

    return settlements
  }, [parties, netProceeds])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const addRevenueLine = (partyName: string, description: string, amount: number) => {
    setParties(prev => prev.map(party => 
      party.name === partyName
        ? {
            ...party,
            revenue: [...party.revenue, {
              id: Date.now().toString(),
              description,
              amount
            }]
          }
        : party
    ))
  }

  const addExpenseLine = (partyName: string, description: string, amount: number) => {
    setParties(prev => prev.map(party => 
      party.name === partyName
        ? {
            ...party,
            expenses: [...party.expenses, {
              id: Date.now().toString(),
              description,
              amount
            }]
          }
        : party
    ))
  }

  const addTip = (recipient: string, amount: number, via: string) => {
    setTips(prev => [...prev, {
      id: Date.now().toString(),
      recipient,
      amount,
      via
    }])
  }

  const updateSplitPercent = (partyName: string, percent: number) => {
    setParties(prev => prev.map(party =>
      party.name === partyName
        ? { ...party, splitPercent: percent }
        : party
    ))
  }

  const resetToEqual = () => {
    const equalSplit = 100 / parties.length
    setParties(prev => prev.map(party => ({ ...party, splitPercent: equalSplit })))
  }

  const removeLineItem = (partyName: string, type: 'revenue' | 'expenses', itemId: string) => {
    setParties(prev => prev.map(party =>
      party.name === partyName
        ? {
            ...party,
            [type]: party[type].filter(item => item.id !== itemId)
          }
        : party
    ))
  }

  const removeTip = (tipId: string) => {
    setTips(prev => prev.filter(tip => tip.id !== tipId))
  }

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/family/tools"
          className="inline-flex items-center gap-2 text-sm text-midnight/60 hover:text-midnight mb-4 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tools
        </Link>
        
        <div className="flex items-center gap-4 mb-2">
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="font-display text-4xl text-midnight bg-transparent border-none outline-none focus:ring-0 p-0"
          />
          <span className="text-midnight/30 text-2xl">—</span>
          <input
            type="text"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="font-display text-2xl text-midnight/60 bg-transparent border-none outline-none focus:ring-0 p-0"
          />
        </div>
        <p className="text-midnight/60 text-lg">
          Split event expenses across multiple parties
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Data Entry */}
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Section */}
          <section className="bg-cream rounded-2xl border-2 border-midnight/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <span className="text-xl">💰</span>
                </div>
                <h2 className="font-display text-2xl text-midnight">Revenue</h2>
              </div>
              <button
                onClick={() => {
                  setShowAddRevenue(true)
                  setSelectedPartyForRevenue(parties[0].name)
                }}
                className="px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors"
              >
                + Add Revenue
              </button>
            </div>

            <div className="space-y-4">
              {parties.map(party => {
                const partyTotal = party.revenue.reduce((sum, item) => sum + item.amount, 0)
                if (party.revenue.length === 0) return null
                
                return (
                  <div key={party.name} className="border-b border-midnight/10 pb-4 last:border-b-0 last:pb-0">
                    <div className="font-medium text-midnight mb-2 flex items-center justify-between">
                      <span>{party.name}</span>
                      <span className="text-emerald-600">{formatCurrency(partyTotal)}</span>
                    </div>
                    <div className="space-y-1">
                      {party.revenue.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm text-midnight/60 pl-4 group">
                          <span>{item.description}</span>
                          <div className="flex items-center gap-2">
                            <span>{formatCurrency(item.amount)}</span>
                            <button
                              onClick={() => removeLineItem(party.name, 'revenue', item.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {showAddRevenue && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const description = formData.get('description') as string
                  const amount = parseFloat(formData.get('amount') as string)
                  if (description && amount) {
                    addRevenueLine(selectedPartyForRevenue, description, amount)
                    setShowAddRevenue(false)
                    e.currentTarget.reset()
                  }
                }}
                className="mt-4 pt-4 border-t border-midnight/10 space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={selectedPartyForRevenue}
                    onChange={(e) => setSelectedPartyForRevenue(e.target.value)}
                    className="bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  >
                    {parties.map(party => (
                      <option key={party.name} value={party.name}>{party.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    required
                    className="bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
                <div className="flex gap-3">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    step="0.01"
                    required
                    className="flex-1 bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddRevenue(false)}
                    className="px-4 py-2 bg-midnight/5 text-midnight rounded-lg text-sm font-medium hover:bg-midnight/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-4 border-t border-midnight/10 flex justify-between items-center font-bold">
              <span className="text-midnight">Total Revenue</span>
              <span className="text-emerald-600 text-xl">{formatCurrency(totalRevenue)}</span>
            </div>
          </section>

          {/* Expenses Section */}
          <section className="bg-cream rounded-2xl border-2 border-midnight/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <span className="text-xl">💸</span>
                </div>
                <h2 className="font-display text-2xl text-midnight">Expenses</h2>
              </div>
              <button
                onClick={() => {
                  setShowAddExpense(true)
                  setSelectedPartyForExpense(parties[0].name)
                }}
                className="px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors"
              >
                + Add Expense
              </button>
            </div>

            <div className="space-y-4">
              {parties.map(party => {
                const partyTotal = party.expenses.reduce((sum, item) => sum + item.amount, 0)
                if (party.expenses.length === 0) return null
                
                return (
                  <div key={party.name} className="border-b border-midnight/10 pb-4 last:border-b-0 last:pb-0">
                    <div className="font-medium text-midnight mb-2 flex items-center justify-between">
                      <span>{party.name}</span>
                      <span className="text-red-600">{formatCurrency(partyTotal)}</span>
                    </div>
                    <div className="space-y-1">
                      {party.expenses.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm text-midnight/60 pl-4 group">
                          <span>{item.description}</span>
                          <div className="flex items-center gap-2">
                            <span>{formatCurrency(item.amount)}</span>
                            <button
                              onClick={() => removeLineItem(party.name, 'expenses', item.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {showAddExpense && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const description = formData.get('description') as string
                  const amount = parseFloat(formData.get('amount') as string)
                  if (description && amount) {
                    addExpenseLine(selectedPartyForExpense, description, amount)
                    setShowAddExpense(false)
                    e.currentTarget.reset()
                  }
                }}
                className="mt-4 pt-4 border-t border-midnight/10 space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={selectedPartyForExpense}
                    onChange={(e) => setSelectedPartyForExpense(e.target.value)}
                    className="bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  >
                    {parties.map(party => (
                      <option key={party.name} value={party.name}>{party.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    required
                    className="bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
                <div className="flex gap-3">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    step="0.01"
                    required
                    className="flex-1 bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddExpense(false)}
                    className="px-4 py-2 bg-midnight/5 text-midnight rounded-lg text-sm font-medium hover:bg-midnight/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-4 border-t border-midnight/10 flex justify-between items-center font-bold">
              <span className="text-midnight">Total Expenses</span>
              <span className="text-red-600 text-xl">{formatCurrency(totalExpenses)}</span>
            </div>
          </section>

          {/* Tips Section */}
          <section className="bg-cream rounded-2xl border-2 border-midnight/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber/10 rounded-xl flex items-center justify-center">
                  <span className="text-xl">💵</span>
                </div>
                <div>
                  <h2 className="font-display text-2xl text-midnight">Tips</h2>
                  <p className="text-xs text-midnight/50">Informational only — not included in split</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddTip(true)}
                className="px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors"
              >
                + Add Tip
              </button>
            </div>

            <div className="space-y-2">
              {tips.map(tip => (
                <div key={tip.id} className="flex items-center justify-between text-sm group">
                  <span className="text-midnight/60">
                    {tip.recipient} (via {tip.via})
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-midnight font-medium">{formatCurrency(tip.amount)}</span>
                    <button
                      onClick={() => removeTip(tip.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showAddTip && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const recipient = formData.get('recipient') as string
                  const amount = parseFloat(formData.get('amount') as string)
                  const via = formData.get('via') as string
                  if (recipient && amount && via) {
                    addTip(recipient, amount, via)
                    setShowAddTip(false)
                    e.currentTarget.reset()
                  }
                }}
                className="mt-4 pt-4 border-t border-midnight/10 space-y-3"
              >
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    name="recipient"
                    placeholder="Recipient"
                    required
                    className="bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    step="0.01"
                    required
                    className="bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                  <input
                    type="text"
                    name="via"
                    placeholder="Via"
                    required
                    className="bg-white border border-midnight/10 rounded-lg px-3 py-2 text-sm text-midnight placeholder:text-midnight/30 focus:outline-none focus:border-ocean focus:ring-1 focus:ring-ocean"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean/90 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTip(false)}
                    className="px-4 py-2 bg-midnight/5 text-midnight rounded-lg text-sm font-medium hover:bg-midnight/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {tips.length > 0 && (
              <div className="mt-4 pt-4 border-t border-midnight/10 flex justify-between items-center">
                <span className="text-midnight/60 text-sm">Total Tips</span>
                <span className="text-midnight font-medium">{formatCurrency(totalTips)}</span>
              </div>
            )}
          </section>

          {/* Split Configuration */}
          <section className="bg-cream rounded-2xl border-2 border-midnight/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ocean/10 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
                <h2 className="font-display text-2xl text-midnight">Split Configuration</h2>
              </div>
              <button
                onClick={resetToEqual}
                className="px-4 py-2 bg-midnight/5 text-midnight rounded-lg text-sm font-medium hover:bg-midnight/10 transition-colors"
              >
                Reset to Equal
              </button>
            </div>

            <div className="space-y-4">
              {parties.map(party => (
                <div key={party.name}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-midnight">{party.name}</label>
                    <span className="text-sm text-midnight/60">{party.splitPercent.toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={party.splitPercent}
                    onChange={(e) => updateSplitPercent(party.name, parseFloat(e.target.value))}
                    className="w-full h-2 bg-midnight/10 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #0066FF 0%, #0066FF ${party.splitPercent}%, rgb(10 10 10 / 0.1) ${party.splitPercent}%, rgb(10 10 10 / 0.1) 100%)`
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-midnight/10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-midnight/60">Total Split</span>
                <span className={`font-medium ${Math.abs(parties.reduce((sum, p) => sum + p.splitPercent, 0) - 100) < 0.1 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {parties.reduce((sum, p) => sum + p.splitPercent, 0).toFixed(1)}%
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-6 space-y-6">
            {/* Net Proceeds */}
            <div className="bg-cream rounded-2xl border-2 border-midnight/5 p-6">
              <div className="text-xs uppercase tracking-wider text-midnight/50 font-medium mb-2">
                Net Proceeds
              </div>
              <div className={`font-display text-5xl font-bold mb-4 ${netProceeds >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(netProceeds)}
              </div>
              
              <div className="space-y-2 text-sm border-t border-midnight/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-midnight/60">Total Revenue</span>
                  <span className="text-emerald-600 font-medium">{formatCurrency(totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-midnight/60">Total Expenses</span>
                  <span className="text-red-600 font-medium">-{formatCurrency(totalExpenses)}</span>
                </div>
              </div>
            </div>

            {/* Settlement Summary */}
            <div className="bg-cream rounded-2xl border-2 border-midnight/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sky/10 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⚖️</span>
                </div>
                <h3 className="font-display text-xl text-midnight">Settlement</h3>
              </div>

              {settlement.length === 0 ? (
                <div className="text-center py-8 text-midnight/40">
                  <div className="text-4xl mb-2">✅</div>
                  <div className="text-sm">All settled!</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {settlement.map((s, idx) => (
                    <div
                      key={idx}
                      className="bg-ocean/5 rounded-lg p-4 border border-ocean/10"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-midnight text-sm">{s.from}</span>
                        <span className="text-ocean font-bold">{formatCurrency(s.amount)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-midnight/60">
                        <span>pays</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="font-medium">{s.to}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Party Breakdown */}
            <div className="bg-cream rounded-2xl border-2 border-midnight/5 p-6">
              <h3 className="font-display text-lg text-midnight mb-4">Party Breakdown</h3>
              <div className="space-y-3">
                {parties.map(party => {
                  const partyRevenue = party.revenue.reduce((sum, item) => sum + item.amount, 0)
                  const partyExpenses = party.expenses.reduce((sum, item) => sum + item.amount, 0)
                  const partyShare = netProceeds * (party.splitPercent / 100)
                  const netPosition = partyRevenue - partyExpenses
                  const balance = partyShare - netPosition
                  
                  return (
                    <div key={party.name} className="border-b border-midnight/10 pb-3 last:border-b-0 last:pb-0">
                      <div className="font-medium text-midnight mb-2">{party.name}</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-midnight/60">
                          <span>Revenue collected</span>
                          <span className="text-emerald-600">{formatCurrency(partyRevenue)}</span>
                        </div>
                        <div className="flex justify-between text-midnight/60">
                          <span>Expenses paid</span>
                          <span className="text-red-600">{formatCurrency(partyExpenses)}</span>
                        </div>
                        <div className="flex justify-between text-midnight/60">
                          <span>Split ({party.splitPercent.toFixed(1)}%)</span>
                          <span className="text-midnight font-medium">{formatCurrency(partyShare)}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-midnight/5 font-medium">
                          <span className="text-midnight">Balance</span>
                          <span className={balance > 0 ? 'text-red-600' : balance < 0 ? 'text-emerald-600' : 'text-midnight'}>
                            {balance > 0 ? `owes ${formatCurrency(Math.abs(balance))}` : balance < 0 ? `gets ${formatCurrency(Math.abs(balance))}` : 'even'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
