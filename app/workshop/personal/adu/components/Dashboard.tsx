import { FinancialSummary, Transaction, Settings } from '../types/transaction'
import { formatCurrency } from '../lib/calculations'
import OwnerStatementDialog from './OwnerStatementDialog'

interface DashboardProps {
  financials: FinancialSummary
  transactions: Transaction[]
  settings: Settings
}

export default function Dashboard({ financials, transactions, settings }: DashboardProps) {
  const isPayoutAvailable = financials.availableToPayOwner > 0

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <OwnerStatementDialog
          transactions={transactions}
          financials={financials}
          settings={settings}
        />
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className={`bg-cream rounded-xl p-6 border-2 ${
          financials.currentBalance > 0 ? 'border-ocean/20' : 'border-red-500/20'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">💵</span>
            <span className="text-sm text-midnight/60 font-medium">Current Balance</span>
          </div>
          <p className={`font-display text-3xl ${
            financials.currentBalance > 0 ? 'text-ocean' : 'text-red-500'
          }`}>
            {formatCurrency(financials.currentBalance)}
          </p>
        </div>

        <div className="bg-cream rounded-xl p-6 border-2 border-sunset/20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🏦</span>
            <span className="text-sm text-midnight/60 font-medium">Deposits Held</span>
          </div>
          <p className="font-display text-3xl text-sunset">
            {formatCurrency(financials.depositsHeld)}
          </p>
          <p className="text-xs text-midnight/50 mt-1">Cannot be paid out</p>
        </div>

        <div className="bg-cream rounded-xl p-6 border-2 border-ocean/20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📈</span>
            <span className="text-sm text-midnight/60 font-medium">Total Income</span>
          </div>
          <p className="font-display text-3xl text-ocean">
            {formatCurrency(financials.totalIncome)}
          </p>
        </div>

        <div className="bg-cream rounded-xl p-6 border-2 border-terracotta/20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📉</span>
            <span className="text-sm text-midnight/60 font-medium">Total Expenses</span>
          </div>
          <p className="font-display text-3xl text-terracotta">
            {formatCurrency(financials.totalExpenses)}
          </p>
        </div>
      </div>

      {/* Owner Payout Breakdown */}
      <div className="bg-cream rounded-xl p-6 border border-midnight/10">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🧮</span>
          <div>
            <h2 className="font-display text-xl text-midnight">Owner Payout Breakdown</h2>
            <p className="text-sm text-midnight/60">Clear calculation of available funds</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-midnight/70">Current Balance (Operating Account)</span>
            <span className="font-semibold text-lg text-midnight">
              {formatCurrency(financials.currentBalance)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-midnight/70">Less: Buffer Amount</span>
            <span className="font-semibold text-sunset">
              -{formatCurrency(settings.bufferAmount)}
            </span>
          </div>
          
          <div className="h-px bg-midnight/10" />
          
          <div className={`flex justify-between items-center py-3 px-4 rounded-lg ${
            isPayoutAvailable ? 'bg-ocean/10' : 'bg-red-50'
          }`}>
            <span className="font-semibold text-midnight">Available to Pay Owner Now</span>
            <span className={`text-2xl font-bold font-display ${
              isPayoutAvailable ? 'text-ocean' : 'text-red-500'
            }`}>
              {formatCurrency(financials.availableToPayOwner)}
            </span>
          </div>
        </div>

        {!isPayoutAvailable && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 text-red-700">
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-medium">
                All funds are currently held in buffer reserve. Buffer must be reduced to make payout.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-cream rounded-xl p-6 border border-midnight/10">
          <div className="text-sm text-midnight/60 mb-1">Rent Income (Total)</div>
          <div className="font-display text-2xl text-midnight">
            {formatCurrency(financials.rentIncome)}
          </div>
        </div>

        <div className="bg-cream rounded-xl p-6 border border-midnight/10">
          <div className="text-sm text-midnight/60 mb-1">Owner Share (Calculated)</div>
          <div className="font-display text-2xl text-midnight">
            {formatCurrency(financials.ownerShare)}
          </div>
          <div className="text-xs text-midnight/50 mt-1">
            After {settings.managementFeePercentage}% management fee
          </div>
        </div>

        <div className="bg-cream rounded-xl p-6 border border-midnight/10">
          <div className="text-sm text-midnight/60 mb-1">Management Fees Collected</div>
          <div className="font-display text-2xl text-midnight">
            {formatCurrency(financials.managementFeesCollected)}
          </div>
        </div>
      </div>
    </div>
  )
}
