import { useState } from 'react'
import { Settings } from '../types/transaction'
import { formatCurrency } from '../lib/calculations'

interface SettingsPanelProps {
  settings: Settings
  onUpdate: (settings: Settings) => void
}

export default function SettingsPanel({ settings, onUpdate }: SettingsPanelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Settings>(settings)

  const handleSave = () => {
    onUpdate(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(settings)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-midnight mb-2">Settings</h2>
          <p className="text-midnight/60">Configure buffer amounts and management fees</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-ocean text-cream rounded-lg font-medium hover:bg-ocean/90 transition-colors"
          >
            Edit Settings
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-cream rounded-xl p-6 border-2 border-ocean/30 space-y-6">
          <div>
            <label className="block text-sm font-medium text-midnight mb-2">
              Owner Name
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
              className="w-full max-w-md px-4 py-2 rounded-lg border border-midnight/20 focus:border-ocean focus:outline-none"
              placeholder="Property owner name"
            />
            <p className="text-xs text-midnight/60 mt-1">
              Used in owner statements and reports
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-midnight mb-2">
              Buffer Amount
            </label>
            <div className="relative max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight/60">$</span>
              <input
                type="number"
                step="100"
                value={formData.bufferAmount}
                onChange={e => setFormData({ ...formData, bufferAmount: parseFloat(e.target.value) || 0 })}
                className="w-full pl-8 pr-4 py-2 rounded-lg border border-midnight/20 focus:border-ocean focus:outline-none"
              />
            </div>
            <p className="text-xs text-midnight/60 mt-1">
              Minimum amount to keep in operating account before making owner payouts
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-midnight mb-2">
              Management Fee Percentage
            </label>
            <div className="relative max-w-md">
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={formData.managementFeePercentage}
                onChange={e => setFormData({ ...formData, managementFeePercentage: parseFloat(e.target.value) || 0 })}
                className="w-full pr-8 pl-4 py-2 rounded-lg border border-midnight/20 focus:border-ocean focus:outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-midnight/60">%</span>
            </div>
            <p className="text-xs text-midnight/60 mt-1">
              Default management fee taken from rental income. Can be overridden per transaction.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-ocean text-cream rounded-lg font-medium hover:bg-ocean/90 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-sand text-midnight rounded-lg font-medium hover:bg-sand/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-cream rounded-xl p-6 border border-midnight/10">
            <div className="text-sm text-midnight/60 mb-1">Owner Name</div>
            <div className="font-display text-2xl text-midnight">
              {settings.ownerName}
            </div>
          </div>

          <div className="bg-cream rounded-xl p-6 border border-midnight/10">
            <div className="text-sm text-midnight/60 mb-1">Buffer Amount</div>
            <div className="font-display text-2xl text-midnight">
              {formatCurrency(settings.bufferAmount)}
            </div>
            <p className="text-xs text-midnight/50 mt-2">
              This amount is reserved in the operating account before calculating available owner payout
            </p>
          </div>

          <div className="bg-cream rounded-xl p-6 border border-midnight/10">
            <div className="text-sm text-midnight/60 mb-1">Management Fee Percentage</div>
            <div className="font-display text-2xl text-midnight">
              {settings.managementFeePercentage}%
            </div>
            <p className="text-xs text-midnight/50 mt-2">
              Default fee percentage deducted from rental income. Individual transactions can override this.
            </p>
          </div>
        </div>
      )}

      {/* Explanation Section */}
      <div className="bg-ocean/5 rounded-xl p-6 border border-ocean/20">
        <h3 className="font-display text-lg text-midnight mb-3">How These Settings Work</h3>
        <div className="space-y-3 text-sm text-midnight/70">
          <div>
            <strong className="text-midnight">Buffer Amount:</strong>
            <p className="mt-1">
              Acts as a safety reserve. When calculating how much to pay the owner, this amount is subtracted
              from the current balance to ensure there's always cash available for unexpected expenses.
            </p>
          </div>
          <div>
            <strong className="text-midnight">Management Fee:</strong>
            <p className="mt-1">
              Your fee for managing the property. Automatically calculated when rent income is received.
              For example, with 30% fee on $3,000 rent: you get $900, owner gets $2,100.
            </p>
          </div>
          <div>
            <strong className="text-midnight">Per-Transaction Override:</strong>
            <p className="mt-1">
              Each rent transaction can have its own management fee percentage if needed (e.g., different
              rates for different tenants or promotional periods).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
