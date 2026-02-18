'use client'

import { useState } from 'react'
import { useTransactions } from './lib/useTransactions'
import Dashboard from './components/Dashboard'
import TransactionList from './components/TransactionList'
import MonthlyPL from './components/MonthlyPL'
import DepositTracking from './components/DepositTracking'
import SettingsPanel from './components/SettingsPanel'
import ImportExport from './components/ImportExport'

type Tab = 'dashboard' | 'transactions' | 'monthly' | 'deposits' | 'settings'

export default function ADUCashFlowPage() {
  const {
    transactions,
    settings,
    financials,
    isLoaded,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateSettings,
    reloadData
  } = useTransactions()

  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  if (!isLoaded || !settings || !financials) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ocean/30 border-t-ocean rounded-full animate-spin mx-auto mb-4" />
          <p className="text-midnight/60">Loading...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: '📊' },
    { id: 'transactions' as Tab, label: 'Transactions', icon: '💳' },
    { id: 'monthly' as Tab, label: 'Monthly P&L', icon: '📅' },
    { id: 'deposits' as Tab, label: 'Deposits', icon: '🏦' },
    { id: 'settings' as Tab, label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-midnight mb-2">ADU Cash Flow</h1>
          <p className="text-midnight/60">Property management ledger for Mike</p>
        </div>
        <ImportExport 
          transactions={transactions}
          settings={settings}
          onImport={reloadData}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-midnight/10">
        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-terracotta text-midnight'
                  : 'border-transparent text-midnight/60 hover:text-midnight hover:border-midnight/20'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'dashboard' && (
          <Dashboard
            financials={financials}
            transactions={transactions}
            settings={settings}
          />
        )}
        
        {activeTab === 'transactions' && (
          <TransactionList
            transactions={transactions}
            settings={settings}
            onAdd={addTransaction}
            onUpdate={updateTransaction}
            onDelete={deleteTransaction}
          />
        )}
        
        {activeTab === 'monthly' && (
          <MonthlyPL
            transactions={transactions}
            settings={settings}
          />
        )}
        
        {activeTab === 'deposits' && (
          <DepositTracking
            transactions={transactions}
          />
        )}
        
        {activeTab === 'settings' && (
          <SettingsPanel
            settings={settings}
            onUpdate={updateSettings}
          />
        )}
      </div>
    </div>
  )
}
