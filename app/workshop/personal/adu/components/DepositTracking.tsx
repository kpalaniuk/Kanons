import { Transaction } from '../types/transaction'
import { formatCurrency, formatDate } from '../lib/calculations'

interface DepositTrackingProps {
  transactions: Transaction[]
}

export default function DepositTracking({ transactions }: DepositTrackingProps) {
  // Get all deposit-related transactions
  const depositTransactions = transactions.filter(t => 
    t.type === 'Deposit' || 
    t.type === 'Deposit Refund' || 
    t.type === 'Deposit Usage'
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Calculate current deposits held by tenant
  const depositsByTenant = new Map<string, number>()
  
  transactions.forEach(t => {
    if (!t.tenant) return
    
    const current = depositsByTenant.get(t.tenant) || 0
    
    if (t.type === 'Deposit') {
      depositsByTenant.set(t.tenant, current + t.amountIn)
    } else if (t.type === 'Deposit Refund') {
      depositsByTenant.set(t.tenant, current - t.amountOut)
    } else if (t.type === 'Deposit Usage') {
      depositsByTenant.set(t.tenant, current - (t.depositUsageAmount || 0))
    }
  })

  const totalDepositsHeld = Array.from(depositsByTenant.values()).reduce((sum, val) => sum + val, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-midnight mb-2">Deposit Tracking</h2>
        <p className="text-midnight/60">Separate ledger for security deposits (not part of operating cash flow)</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-cream rounded-xl p-6 border-2 border-sunset/30">
          <div className="text-sm text-midnight/60 mb-2">Total Deposits Held</div>
          <div className="font-display text-4xl text-sunset">
            {formatCurrency(totalDepositsHeld)}
          </div>
          <div className="text-xs text-midnight/50 mt-2">
            Held in separate account, not available for operating expenses
          </div>
        </div>

        <div className="bg-cream rounded-xl p-6 border border-midnight/10">
          <div className="text-sm text-midnight/60 mb-3">By Tenant</div>
          <div className="space-y-2">
            {Array.from(depositsByTenant.entries())
              .filter(([_, amount]) => amount > 0)
              .map(([tenant, amount]) => (
                <div key={tenant} className="flex justify-between items-center">
                  <span className="text-midnight font-medium">{tenant}</span>
                  <span className="text-sunset font-semibold">{formatCurrency(amount)}</span>
                </div>
              ))}
            {Array.from(depositsByTenant.entries()).filter(([_, amount]) => amount > 0).length === 0 && (
              <div className="text-midnight/50 text-sm">No deposits currently held</div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="font-display text-lg text-midnight mb-4">Deposit History</h3>
        <div className="space-y-3">
          {depositTransactions.map(transaction => (
            <div
              key={transaction.id}
              className="bg-cream rounded-lg p-4 border border-midnight/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-midnight/60">
                      {formatDate(transaction.date)}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      transaction.type === 'Deposit' 
                        ? 'bg-ocean/10 text-ocean'
                        : transaction.type === 'Deposit Refund'
                        ? 'bg-terracotta/10 text-terracotta'
                        : 'bg-sunset/10 text-sunset'
                    }`}>
                      {transaction.type}
                    </span>
                    {transaction.tenant && (
                      <span className="text-xs text-midnight/50">
                        {transaction.tenant}
                      </span>
                    )}
                  </div>
                  <div className="font-medium text-midnight mb-1">
                    {transaction.description}
                  </div>
                  {transaction.notes && (
                    <div className="text-sm text-midnight/60">
                      {transaction.notes}
                    </div>
                  )}
                </div>
                <div className="text-right ml-4">
                  {transaction.type === 'Deposit' && (
                    <>
                      <div className="text-sm text-midnight/60">Received</div>
                      <div className="font-semibold text-ocean">
                        +{formatCurrency(transaction.amountIn)}
                      </div>
                    </>
                  )}
                  {transaction.type === 'Deposit Refund' && (
                    <>
                      <div className="text-sm text-midnight/60">Refunded</div>
                      <div className="font-semibold text-terracotta">
                        -{formatCurrency(transaction.amountOut)}
                      </div>
                    </>
                  )}
                  {transaction.type === 'Deposit Usage' && (
                    <>
                      <div className="text-sm text-midnight/60">Used</div>
                      <div className="font-semibold text-sunset">
                        -{formatCurrency(transaction.depositUsageAmount || 0)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {depositTransactions.length === 0 && (
          <div className="text-center py-12 text-midnight/60">
            No deposit transactions yet.
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-ocean/5 rounded-xl p-6 border border-ocean/20">
        <h4 className="font-display text-lg text-midnight mb-2 flex items-center gap-2">
          <span>💡</span>
          How Deposits Work
        </h4>
        <div className="text-sm text-midnight/70 space-y-2">
          <p>
            <strong>Deposit:</strong> Money received from tenant as security. Goes into separate ledger, not operating account.
          </p>
          <p>
            <strong>Deposit Usage:</strong> When deposit funds are used (e.g., for cleaning). Reduces deposit ledger, actual payment comes from operating account.
          </p>
          <p>
            <strong>Deposit Refund:</strong> Money returned to tenant. Comes from separate deposit ledger.
          </p>
        </div>
      </div>
    </div>
  )
}
