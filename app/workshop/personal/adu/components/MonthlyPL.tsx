import { Transaction, Settings } from '../types/transaction'
import { calculateMonthlyPL, formatCurrency, formatMonthYear } from '../lib/calculations'

interface MonthlyPLProps {
  transactions: Transaction[]
  settings: Settings
}

export default function MonthlyPL({ transactions, settings }: MonthlyPLProps) {
  const monthlyData = calculateMonthlyPL(transactions, settings)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-ocean/10 text-ocean'
      case 'Owed': return 'bg-sunset/10 text-sunset'
      case 'Partial': return 'bg-terracotta/10 text-terracotta'
      default: return 'bg-steel/10 text-steel'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-midnight mb-2">Monthly Profit & Loss</h2>
        <p className="text-midnight/60">Month-by-month breakdown of income and expenses</p>
      </div>

      <div className="space-y-4">
        {monthlyData.map(month => (
          <div
            key={month.monthYear}
            className="bg-cream rounded-xl p-6 border border-midnight/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl text-midnight">
                  {formatMonthYear(month.monthYear)}
                </h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(month.ownerPayoutStatus)}`}>
                  {month.ownerPayoutStatus}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-midnight/60 mb-1">Net Cash Flow</div>
                <div className={`font-display text-3xl ${
                  month.netCashFlow >= 0 ? 'text-ocean' : 'text-red-500'
                }`}>
                  {formatCurrency(month.netCashFlow)}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div>
                <div className="text-sm text-midnight/60 mb-1">Gross Rent</div>
                <div className="font-semibold text-lg text-midnight">
                  {formatCurrency(month.grossRent)}
                </div>
              </div>

              <div>
                <div className="text-sm text-midnight/60 mb-1">Management Fee</div>
                <div className="font-semibold text-lg text-terracotta">
                  -{formatCurrency(month.managementFee)}
                </div>
              </div>

              <div>
                <div className="text-sm text-midnight/60 mb-1">Owner Share</div>
                <div className="font-semibold text-lg text-midnight">
                  {formatCurrency(month.ownerShare)}
                </div>
              </div>

              <div>
                <div className="text-sm text-midnight/60 mb-1">Expenses</div>
                <div className="font-semibold text-lg text-terracotta">
                  -{formatCurrency(month.expenses)}
                </div>
              </div>

              <div>
                <div className="text-sm text-midnight/60 mb-1">Owner Payout</div>
                <div className="font-semibold text-lg text-ocean">
                  {formatCurrency(month.ownerPayoutAmount)}
                </div>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="mt-4 pt-4 border-t border-midnight/10 text-sm text-midnight/60">
              <div className="flex justify-between">
                <span>Rent Revenue</span>
                <span>{formatCurrency(month.grossRent)}</span>
              </div>
              <div className="flex justify-between">
                <span>- Management Fee ({settings.managementFeePercentage}%)</span>
                <span>-{formatCurrency(month.managementFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>- Operating Expenses</span>
                <span>-{formatCurrency(month.expenses)}</span>
              </div>
              <div className="flex justify-between font-semibold text-midnight pt-2 border-t border-midnight/10">
                <span>Net Cash Flow</span>
                <span>{formatCurrency(month.netCashFlow)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {monthlyData.length === 0 && (
        <div className="text-center py-12 text-midnight/60">
          No monthly data yet. Add some transactions to see the breakdown.
        </div>
      )}
    </div>
  )
}
