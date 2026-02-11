'use client'

import { useState, useEffect } from 'react'

interface Provider {
  name: string
  model: string
  status: 'active' | 'limited' | 'inactive'
  calls: number
  tokensIn: number
  tokensOut: number
  estimatedCost: number
  notes: string
}

interface DailyUsage {
  date: string
  calls: number
  tokensIn: number
  tokensOut: number
  cost: number
  provider: string
}

interface UsageSnapshot {
  lastUpdated: string
  period: string
  providers: Provider[]
  daily: DailyUsage[]
  totals: {
    totalCalls: number
    totalTokensIn: number
    totalTokensOut: number
    totalCost: number
    avgCallsPerDay: number
    avgTokensPerCall: number
  }
}

const STATUS_STYLES = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  limited: 'bg-amber-100 text-amber-700 border-amber-300',
  inactive: 'bg-slate-100 text-slate-500 border-slate-300',
}

const STATUS_LABELS = {
  active: '✓ Active',
  limited: '⚠ Limited',
  inactive: '○ Inactive',
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

function formatCost(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(num)
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function AnimatedNumber({ value, format = 'number' }: { value: number; format?: 'number' | 'currency' }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = value / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value])

  if (format === 'currency') {
    return <>{formatCost(displayValue)}</>
  }
  return <>{formatNumber(Math.round(displayValue))}</>
}

export default function UsageDashboard() {
  const [data, setData] = useState<UsageSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsage()
  }, [])

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/usage')
      if (!res.ok) throw new Error('Failed to fetch usage data')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError('Could not load usage data.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto pb-24">
        <div className="flex items-center justify-center py-24">
          <div className="flex items-center gap-3 text-midnight/40">
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading usage data...
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-6xl mx-auto pb-24">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-700">{error || 'Unknown error'}</p>
        </div>
      </div>
    )
  }

  const maxDailyTokens = Math.max(...data.daily.map(d => d.tokensIn + d.tokensOut))
  const totalProviderCost = data.providers.reduce((sum, p) => sum + p.estimatedCost, 0)

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-ocean/10 rounded-xl flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h1 className="font-display text-3xl text-midnight">API Usage Dashboard</h1>
            <p className="text-sm text-midnight/50">Period: {data.period}</p>
          </div>
        </div>
        <p className="text-xs text-midnight/40">
          Last updated: {new Date(data.lastUpdated).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })}
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-ocean to-ocean/80 rounded-2xl p-5 text-white shadow-lg">
          <div className="text-xs font-medium opacity-80 mb-1">Total Spend</div>
          <div className="font-display text-3xl font-bold tabular-nums">
            <AnimatedNumber value={data.totals.totalCost} format="currency" />
          </div>
        </div>

        <div className="bg-cream border-2 border-midnight/10 rounded-2xl p-5">
          <div className="text-xs font-medium text-midnight/50 mb-1">API Calls</div>
          <div className="font-display text-3xl font-bold text-midnight tabular-nums">
            <AnimatedNumber value={data.totals.totalCalls} />
          </div>
        </div>

        <div className="bg-cream border-2 border-midnight/10 rounded-2xl p-5">
          <div className="text-xs font-medium text-midnight/50 mb-1">Tokens In</div>
          <div className="font-display text-2xl font-bold text-midnight tabular-nums">
            <AnimatedNumber value={data.totals.totalTokensIn} />
          </div>
        </div>

        <div className="bg-cream border-2 border-midnight/10 rounded-2xl p-5">
          <div className="text-xs font-medium text-midnight/50 mb-1">Tokens Out</div>
          <div className="font-display text-2xl font-bold text-midnight tabular-nums">
            <AnimatedNumber value={data.totals.totalTokensOut} />
          </div>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="mb-8">
        <h2 className="font-display text-xl text-midnight mb-4">Providers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.providers.map((provider) => (
            <div
              key={provider.name}
              className="bg-cream border-2 border-midnight/10 rounded-2xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-midnight mb-1">
                    {provider.name}
                  </h3>
                  <p className="text-xs text-midnight/50">{provider.model}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg border ${STATUS_STYLES[provider.status]}`}>
                  {STATUS_LABELS[provider.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-[10px] text-midnight/40 uppercase font-medium mb-1">Calls</div>
                  <div className="font-display text-xl font-bold text-midnight tabular-nums">
                    {formatNumber(provider.calls)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-midnight/40 uppercase font-medium mb-1">Cost</div>
                  <div className="font-display text-xl font-bold text-ocean tabular-nums">
                    {formatCost(provider.estimatedCost)}
                  </div>
                </div>
              </div>

              {provider.tokensIn > 0 || provider.tokensOut > 0 ? (
                <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-midnight/10">
                  <div>
                    <div className="text-[10px] text-midnight/40 uppercase font-medium mb-1">In</div>
                    <div className="text-sm font-semibold text-midnight/70 tabular-nums">
                      {formatNumber(provider.tokensIn)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-midnight/40 uppercase font-medium mb-1">Out</div>
                    <div className="text-sm font-semibold text-midnight/70 tabular-nums">
                      {formatNumber(provider.tokensOut)}
                    </div>
                  </div>
                </div>
              ) : null}

              <p className="text-xs text-midnight/50 leading-relaxed">{provider.notes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Usage Chart */}
      <div className="mb-8">
        <h2 className="font-display text-xl text-midnight mb-4">Daily Token Usage</h2>
        <div className="bg-cream border-2 border-midnight/10 rounded-2xl p-6">
          <div className="flex items-end justify-around gap-4 h-48">
            {data.daily.map((day) => {
              const totalTokens = day.tokensIn + day.tokensOut
              const heightPercent = (totalTokens / maxDailyTokens) * 100
              
              return (
                <div key={day.date} className="flex flex-col items-center flex-1 group">
                  <div className="relative w-full flex items-end justify-center h-40 mb-2">
                    <div
                      className="w-full max-w-[80px] bg-gradient-to-t from-ocean to-cyan rounded-t-lg transition-all hover:from-ocean/80 hover:to-cyan/80 relative group"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-midnight text-cream text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="font-bold">{formatNumber(totalTokens)} tokens</div>
                        <div className="text-[10px] opacity-80">{day.calls} calls • {formatCost(day.cost)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-midnight/60">{formatDate(day.date)}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="mb-8">
        <h2 className="font-display text-xl text-midnight mb-4">Cost Breakdown</h2>
        <div className="bg-cream border-2 border-midnight/10 rounded-2xl p-6">
          <div className="space-y-3">
            {data.providers
              .filter(p => p.estimatedCost > 0)
              .sort((a, b) => b.estimatedCost - a.estimatedCost)
              .map((provider) => {
                const percentage = totalProviderCost > 0 ? (provider.estimatedCost / totalProviderCost) * 100 : 0
                
                return (
                  <div key={provider.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-midnight">{provider.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-midnight/40">{percentage.toFixed(1)}%</span>
                        <span className="text-sm font-bold text-ocean tabular-nums">
                          {formatCost(provider.estimatedCost)}
                        </span>
                      </div>
                    </div>
                    <div className="h-3 bg-midnight/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-ocean to-cyan rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Usage Tips */}
      <div>
        <h2 className="font-display text-xl text-midnight mb-4">💡 Usage Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-2xl p-5">
            <div className="text-2xl mb-2">✅</div>
            <h3 className="font-display font-bold text-midnight mb-2">Excellent Efficiency</h3>
            <p className="text-sm text-midnight/70 leading-relaxed">
              Nexos prepaid credits handle ~80% of traffic with zero marginal cost. This keeps monthly spend low while maintaining high quality.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-2xl p-5">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-display font-bold text-midnight mb-2">Cost Optimization</h3>
            <p className="text-sm text-midnight/70 leading-relaxed">
              Consider using Gemini Flash or GPT-4o-mini for sub-agent tasks to reduce Anthropic API costs by 70-90%.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-200 rounded-2xl p-5">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-display font-bold text-midnight mb-2">Daily Average</h3>
            <p className="text-sm text-midnight/70 leading-relaxed">
              ~{formatNumber(data.totals.avgCallsPerDay)} calls per day with {formatNumber(data.totals.avgTokensPerCall)} tokens per call. 
              Consistent usage pattern indicates stable workload.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-5">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-display font-bold text-midnight mb-2">Provider Health</h3>
            <p className="text-sm text-midnight/70 leading-relaxed">
              {data.providers.filter(p => p.status === 'active').length} active providers provide redundancy. 
              Google Gemini remains available as backup with competitive pricing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
