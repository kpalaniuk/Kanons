import { useRef, useState } from 'react'
import { Transaction, Settings } from '../types/transaction'
import { supabase } from '../lib/supabase'

interface ImportExportProps {
  transactions: Transaction[]
  settings: Settings
  onImport: () => void
}

export default function ImportExport({ transactions, settings, onImport }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Fetch all data from Supabase
      const { data: txData, error: txError } = await supabase
        .from('adu_transactions')
        .select('*')
        .order('date', { ascending: false })

      const { data: settingsData, error: settingsError } = await supabase
        .from('adu_settings')
        .select('*')
        .single()

      if (txError || settingsError) {
        alert('Error fetching data from database')
        console.error({ txError, settingsError })
        return
      }

      const exportData = {
        transactions: txData || [],
        settings: settingsData || {},
        exportDate: new Date().toISOString()
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `adu-cashflow-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      setIsImporting(true)
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)
        
        if (!data.transactions || !data.settings) {
          alert('Invalid backup file format')
          return
        }

        if (!confirm('This will replace all current data. Continue?')) {
          return
        }

        // Delete all existing transactions
        const { error: deleteError } = await supabase
          .from('adu_transactions')
          .delete()
          .neq('id', 0) // Delete all rows

        if (deleteError) {
          console.error('Error clearing transactions:', deleteError)
          alert('Failed to clear existing data')
          return
        }

        // Insert new transactions
        // Note: data.transactions might be in snake_case if exported from DB
        // We'll insert them as-is since they came from the DB format
        const { error: insertError } = await supabase
          .from('adu_transactions')
          .insert(data.transactions)

        if (insertError) {
          console.error('Error inserting transactions:', insertError)
          alert('Failed to import transactions')
          return
        }

        // Update settings (assuming id=1)
        const { error: settingsError } = await supabase
          .from('adu_settings')
          .update({
            buffer_amount: data.settings.buffer_amount || data.settings.bufferAmount,
            management_fee_percentage: data.settings.management_fee_percentage || data.settings.managementFeePercentage,
            owner_name: data.settings.owner_name || data.settings.ownerName,
            updated_at: new Date().toISOString()
          })
          .eq('id', 1)

        if (settingsError) {
          console.error('Error updating settings:', settingsError)
          alert('Transactions imported but failed to update settings')
        } else {
          alert('Data imported successfully!')
        }

        onImport()
      } catch (error) {
        console.error('Import error:', error)
        alert('Error reading file: ' + (error as Error).message)
      } finally {
        setIsImporting(false)
      }
    }
    reader.readAsText(file)
    
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="px-4 py-2 bg-cream text-midnight rounded-lg font-medium border border-midnight/20 hover:bg-sand transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>📥</span>
        {isExporting ? 'Exporting...' : 'Export'}
      </button>
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="px-4 py-2 bg-cream text-midnight rounded-lg font-medium border border-midnight/20 hover:bg-sand transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>📤</span>
        {isImporting ? 'Importing...' : 'Import'}
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  )
}
