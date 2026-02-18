import { useState } from 'react'
import { Transaction, Settings, TransactionType } from '../types/transaction'
import { formatCurrency, formatDate, getNextTransactionId, getMonthYearFromDate } from '../lib/calculations'

interface TransactionListProps {
  transactions: Transaction[]
  settings: Settings
  onAdd: (transaction: Transaction) => void
  onUpdate: (id: number, updates: Partial<Transaction>) => void
  onDelete: (id: number) => void
}

const transactionTypes: TransactionType[] = [
  "Income", "Deposit", "Deposit Refund", "Deposit Usage", 
  "Expense", "Management Fee", "Cleaning", "Capital Improvement", "Owner Payout"
]

export default function TransactionList({ transactions, settings, onAdd, onUpdate, onDelete }: TransactionListProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Transaction>>({})

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const startAdd = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'Income',
      description: '',
      amountIn: 0,
      amountOut: 0,
      tenant: '',
      notes: '',
      category: 'Rent',
      managementFeePercentage: settings.managementFeePercentage
    })
    setIsAdding(true)
  }

  const startEdit = (transaction: Transaction) => {
    setFormData(transaction)
    setEditingId(transaction.id)
  }

  const handleSubmit = () => {
    if (!formData.date || !formData.type || !formData.description) return

    const monthYear = getMonthYearFromDate(formData.date)
    
    if (editingId) {
      onUpdate(editingId, { ...formData, monthYear })
      setEditingId(null)
    } else {
      const newTransaction: Transaction = {
        id: getNextTransactionId(transactions),
        date: formData.date!,
        type: formData.type!,
        description: formData.description!,
        amountIn: formData.amountIn || 0,
        amountOut: formData.amountOut || 0,
        tenant: formData.tenant || '',
        notes: formData.notes || '',
        category: formData.category || '',
        monthYear,
        depositUsageAmount: formData.depositUsageAmount,
        managementFeePercentage: formData.managementFeePercentage
      }
      onAdd(newTransaction)
      setIsAdding(false)
    }
    setFormData({})
  }

  const cancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({})
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl text-midnight">Transactions</h2>
        {!isAdding && (
          <button
            onClick={startAdd}
            className="px-4 py-2 bg-ocean text-cream rounded-lg font-medium hover:bg-ocean/90 transition-colors"
          >
            + Add Transaction
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-cream rounded-xl p-6 border-2 border-ocean/30 space-y-4">
          <h3 className="font-display text-lg text-midnight mb-4">
            {editingId ? 'Edit Transaction' : 'New Transaction'}
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-midnight mb-1">Date</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-midnight/20 focus:border-ocean focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1">Type</label>
              <select
                value={formData.type || ''}
                onChange={e => setFormData({ ...formData, type: e.target.value as TransactionType })}
                className="w-full px-3 py-2 rounded-lg border border-midnight/20 focus:border-ocean focus:outline-none"
              >
                {transactionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1">Description</label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-midnight/20 focus:border-ocean focus:outline-none"
                placeholder="Brief description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1">Tenant</label>
              <input
                type="text"
                value={formData.tenant || ''}
                onChange={e => setFormData({ ...formData, tenant: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-midnight/20 focus:border-ocean focus:outline-none"
                placeholder="Tenant name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1">Amount In</label>
              <input
                type="number"
                step="0.01"
                value={formData.amountIn || 0}
                onChange={e => setFormData({ ...formData, amountIn: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-midnight/20 focus:border-ocean focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1">Amount Out</label>
              <input
                type="number"
                step="0.01"
                value={formData.amountOut || 0}
                onChange={e => setFormData({ ...formData, amountOut: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg border border-midnight/20 focus:border-ocean focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-midnight mb-1">Category</label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-midnight/20 focus:border-ocean focus:outline-none"
                placeholder="e.g., Rent, Maintenance"
              />
            </div>

            {formData.type === 'Income' && formData.category === 'Rent' && (
              <div>
                <label className="block text-sm font-medium text-midnight mb-1">Management Fee %</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.managementFeePercentage ?? settings.managementFeePercentage}
                  onChange={e => setFormData({ ...formData, managementFeePercentage: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-midnight/20 focus:border-ocean focus:outline-none"
                />
              </div>
            )}

            {formData.type === 'Deposit Usage' && (
              <div>
                <label className="block text-sm font-medium text-midnight mb-1">Deposit Usage Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.depositUsageAmount || 0}
                  onChange={e => setFormData({ ...formData, depositUsageAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-midnight/20 focus:border-ocean focus:outline-none"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-midnight mb-1">Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-midnight/20 focus:border-ocean focus:outline-none"
                rows={2}
                placeholder="Additional notes"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-ocean text-cream rounded-lg font-medium hover:bg-ocean/90 transition-colors"
            >
              {editingId ? 'Save Changes' : 'Add Transaction'}
            </button>
            <button
              onClick={cancel}
              className="px-6 py-2 bg-sand text-midnight rounded-lg font-medium hover:bg-sand/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-3">
        {sortedTransactions.map(transaction => (
          <div
            key={transaction.id}
            className="bg-cream rounded-lg p-4 border border-midnight/10 hover:border-midnight/20 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-midnight/60">
                    {formatDate(transaction.date)}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-ocean/10 text-ocean font-medium">
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
              <div className="flex items-center gap-4">
                {transaction.amountIn > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-midnight/60">In</div>
                    <div className="font-semibold text-ocean">
                      {formatCurrency(transaction.amountIn)}
                    </div>
                  </div>
                )}
                {transaction.amountOut > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-midnight/60">Out</div>
                    <div className="font-semibold text-terracotta">
                      {formatCurrency(transaction.amountOut)}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(transaction)}
                    className="p-2 text-midnight/60 hover:text-ocean hover:bg-ocean/10 rounded transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this transaction?')) {
                        onDelete(transaction.id)
                      }
                    }}
                    className="p-2 text-midnight/60 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedTransactions.length === 0 && (
        <div className="text-center py-12 text-midnight/60">
          No transactions yet. Add your first one above!
        </div>
      )}
    </div>
  )
}
