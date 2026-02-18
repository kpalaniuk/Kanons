import { useRef } from 'react'
import { Transaction, Settings } from '../types/transaction'
import { exportData, importData } from '../lib/storage'

interface ImportExportProps {
  transactions: Transaction[]
  settings: Settings
  onImport: () => void
}

export default function ImportExport({ transactions, settings, onImport }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `adu-cashflow-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)
        
        if (!data.transactions || !data.settings) {
          alert('Invalid backup file format')
          return
        }

        if (confirm('This will replace all current data. Continue?')) {
          importData(data)
          onImport()
          alert('Data imported successfully!')
        }
      } catch (error) {
        alert('Error reading file: ' + (error as Error).message)
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
        className="px-4 py-2 bg-cream text-midnight rounded-lg font-medium border border-midnight/20 hover:bg-sand transition-colors flex items-center gap-2"
      >
        <span>📥</span>
        Export
      </button>
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-cream text-midnight rounded-lg font-medium border border-midnight/20 hover:bg-sand transition-colors flex items-center gap-2"
      >
        <span>📤</span>
        Import
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
