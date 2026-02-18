import { useState } from 'react'
import { Transaction, Settings, FinancialSummary } from '../types/transaction'
import { formatCurrency, formatDate, calculateMonthlyPL } from '../lib/calculations'

interface OwnerStatementDialogProps {
  transactions: Transaction[]
  settings: Settings
  financials: FinancialSummary
}

export default function OwnerStatementDialog({ transactions, settings, financials }: OwnerStatementDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const generateStatement = () => {
    const monthlyData = calculateMonthlyPL(transactions, settings)
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    let statement = `
OWNER STATEMENT
Generated: ${today}
Property Owner: ${settings.ownerName}
Management Fee: ${settings.managementFeePercentage}%
Buffer Reserve: ${formatCurrency(settings.bufferAmount)}

═══════════════════════════════════════════════════════

CURRENT POSITION

Operating Account Balance:     ${formatCurrency(financials.currentBalance)}
Less: Buffer Reserve:          -${formatCurrency(settings.bufferAmount)}
                               ─────────────────
Available for Payout:          ${formatCurrency(financials.availableToPayOwner)}

Deposits Held (Separate):     ${formatCurrency(financials.depositsHeld)}

═══════════════════════════════════════════════════════

LIFETIME SUMMARY

Total Rent Income:             ${formatCurrency(financials.rentIncome)}
Management Fees Paid:          -${formatCurrency(financials.managementFeesCollected)}
Operating Expenses:            -${formatCurrency(financials.ownerExpenses)}
Owner Payouts Made:            -${formatCurrency(financials.ownerPayoutsMade)}

═══════════════════════════════════════════════════════

MONTHLY BREAKDOWN
`

    monthlyData.slice(0, 6).forEach(month => {
      const date = new Date(month.monthYear + '-01')
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      
      statement += `
${monthName} - ${month.ownerPayoutStatus}
  Gross Rent:                  ${formatCurrency(month.grossRent)}
  Management Fee:              -${formatCurrency(month.managementFee)}
  Expenses:                    -${formatCurrency(month.expenses)}
  Net Cash Flow:               ${formatCurrency(month.netCashFlow)}
  Owner Payout:                ${formatCurrency(month.ownerPayoutAmount)}
`
    })

    statement += `
═══════════════════════════════════════════════════════

Questions? Contact your property manager.
`

    return statement
  }

  const copyToClipboard = () => {
    const statement = generateStatement()
    navigator.clipboard.writeText(statement)
    alert('Statement copied to clipboard!')
  }

  const downloadStatement = () => {
    const statement = generateStatement()
    const blob = new Blob([statement], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `owner-statement-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-ocean text-cream rounded-lg font-medium hover:bg-ocean/90 transition-colors flex items-center gap-2"
      >
        <span>📄</span>
        Generate Owner Statement
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/50 p-4">
      <div className="bg-sand rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-midnight/10">
          <h2 className="font-display text-2xl text-midnight">Owner Statement</h2>
          <p className="text-sm text-midnight/60 mt-1">
            Statement for {settings.ownerName}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <pre className="bg-cream p-6 rounded-lg text-sm font-mono text-midnight whitespace-pre-wrap border border-midnight/10">
            {generateStatement()}
          </pre>
        </div>

        <div className="p-6 border-t border-midnight/10 flex gap-3">
          <button
            onClick={copyToClipboard}
            className="px-6 py-2 bg-ocean text-cream rounded-lg font-medium hover:bg-ocean/90 transition-colors"
          >
            Copy to Clipboard
          </button>
          <button
            onClick={downloadStatement}
            className="px-6 py-2 bg-terracotta text-cream rounded-lg font-medium hover:bg-terracotta/90 transition-colors"
          >
            Download
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 bg-sand text-midnight rounded-lg font-medium hover:bg-sand/80 transition-colors border border-midnight/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
