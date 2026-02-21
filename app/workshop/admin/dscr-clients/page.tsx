'use client'

import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'

interface DSCRClient {
  id: string
  client_name: string
  client_slug: string
  client_fico: number | null
  rate_sheet_data: any
  lo_name: string
  lo_nmls: string
  lo_phone: string
  lo_email: string
  active: boolean
  created_at: string
}

export default function DSCRClientsAdmin() {
  const [clients, setClients] = useState<DSCRClient[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    client_name: '',
    client_slug: '',
    client_fico: '',
    lo_name: 'Kyle Palaniuk',
    lo_nmls: '984138',
    lo_phone: '619-777-5700',
    lo_email: 'kyle@planpreparehome.com',
  })
  const [rateSheetJSON, setRateSheetJSON] = useState(`{
  "rates": [
    {"ltv_min": 0, "ltv_max": 70, "fico_min": 720, "fico_max": 739, "standard_rate": 7.125, "io_adjustment": 0.125},
    {"ltv_min": 70, "ltv_max": 75, "fico_min": 720, "fico_max": 739, "standard_rate": 7.25, "io_adjustment": 0.125},
    {"ltv_min": 75, "ltv_max": 80, "fico_min": 720, "fico_max": 739, "standard_rate": 7.375, "io_adjustment": 0.125},
    {"ltv_min": 80, "ltv_max": 85, "fico_min": 720, "fico_max": 739, "standard_rate": 7.5, "io_adjustment": 0.125},
    {"ltv_min": 85, "ltv_max": 100, "fico_min": 720, "fico_max": 739, "standard_rate": 7.625, "io_adjustment": 0.125}
  ]
}`)

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('dscr_client_configs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (err) {
      console.error('Error fetching clients:', err)
      alert('Failed to load clients. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const rateSheetData = JSON.parse(rateSheetJSON)
      const supabase = getSupabase()

      const { error } = await supabase
        .from('dscr_client_configs')
        .insert([
          {
            client_name: formData.client_name,
            client_slug: formData.client_slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
            client_fico: formData.client_fico ? parseInt(formData.client_fico) : null,
            rate_sheet_data: rateSheetData,
            lo_name: formData.lo_name,
            lo_nmls: formData.lo_nmls,
            lo_phone: formData.lo_phone,
            lo_email: formData.lo_email,
            active: true,
          },
        ])

      if (error) throw error

      alert('Client created successfully!')
      setShowForm(false)
      setFormData({
        client_name: '',
        client_slug: '',
        client_fico: '',
        lo_name: 'Kyle Palaniuk',
        lo_nmls: '984138',
        lo_phone: '619-777-5700',
        lo_email: 'kyle@planpreparehome.com',
      })
      fetchClients()
    } catch (err) {
      console.error('Error creating client:', err)
      alert('Failed to create client. Check console for details.')
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const supabase = getSupabase()
      const { error } = await supabase
        .from('dscr_client_configs')
        .update({ active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      fetchClients()
    } catch (err) {
      console.error('Error updating client:', err)
      alert('Failed to update client status')
    }
  }

  async function deleteClient(id: string) {
    if (!confirm('Delete this client configuration?')) return

    try {
      const supabase = getSupabase()
      const { error } = await supabase
        .from('dscr_client_configs')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchClients()
    } catch (err) {
      console.error('Error deleting client:', err)
      alert('Failed to delete client')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold text-midnight mb-2">
              DSCR Client Management
            </h1>
            <p className="text-steel">
              Manage client-specific DSCR calculators and rate sheets
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-ocean text-cream rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            {showForm ? 'Cancel' : '+ Add Client'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
            <h2 className="font-display text-2xl font-bold text-midnight mb-6">
              New Client Configuration
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-midnight mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) =>
                      setFormData({ ...formData, client_name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ocean outline-none"
                    placeholder="Pamela Moore"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-midnight mb-2">
                    URL Slug * (no spaces, lowercase)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client_slug}
                    onChange={(e) =>
                      setFormData({ ...formData, client_slug: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ocean outline-none font-mono"
                    placeholder="pamela"
                  />
                  <p className="text-xs text-steel mt-1">
                    Will create: /clients/dscr/{formData.client_slug || 'slug'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-midnight mb-2">
                    Client FICO Score
                  </label>
                  <input
                    type="number"
                    value={formData.client_fico}
                    onChange={(e) =>
                      setFormData({ ...formData, client_fico: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ocean outline-none"
                    placeholder="726"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-midnight mb-2">
                  Rate Sheet Data (JSON)
                </label>
                <textarea
                  value={rateSheetJSON}
                  onChange={(e) => setRateSheetJSON(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ocean outline-none font-mono text-sm"
                  rows={12}
                  placeholder="Paste rate sheet JSON"
                />
                <p className="text-xs text-steel mt-1">
                  Format: rates array with ltv_min, ltv_max, fico_min, fico_max,
                  standard_rate, io_adjustment
                </p>
              </div>

              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="font-display text-lg font-bold text-midnight mb-4">
                  Loan Officer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-midnight mb-2">
                      LO Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lo_name}
                      onChange={(e) =>
                        setFormData({ ...formData, lo_name: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ocean outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-midnight mb-2">
                      NMLS # *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lo_nmls}
                      onChange={(e) =>
                        setFormData({ ...formData, lo_nmls: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ocean outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-midnight mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.lo_phone}
                      onChange={(e) =>
                        setFormData({ ...formData, lo_phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ocean outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-midnight mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.lo_email}
                      onChange={(e) =>
                        setFormData({ ...formData, lo_email: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-ocean outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-ocean text-cream rounded-lg font-semibold hover:bg-opacity-90 transition"
                >
                  Create Client
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-3 bg-gray-200 text-midnight rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-2xl font-bold text-midnight">
                      {client.client_name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        client.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {client.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-steel space-y-1">
                    <p className="font-mono text-sm">
                      <strong>URL:</strong> /clients/dscr/{client.client_slug}
                    </p>
                    {client.client_fico && (
                      <p>
                        <strong>FICO:</strong> {client.client_fico}
                      </p>
                    )}
                    <p>
                      <strong>LO:</strong> {client.lo_name} (NMLS #{client.lo_nmls})
                    </p>
                    <p className="text-xs text-gray-400">
                      Created: {new Date(client.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/clients/dscr/${client.client_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-ocean text-cream rounded-lg text-sm font-semibold hover:bg-opacity-90 transition"
                  >
                    View
                  </a>
                  <button
                    onClick={() => toggleActive(client.id, client.active)}
                    className="px-4 py-2 bg-amber text-midnight rounded-lg text-sm font-semibold hover:bg-opacity-90 transition"
                  >
                    {client.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteClient(client.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {clients.length === 0 && (
            <div className="text-center py-12 text-steel">
              <p className="text-xl mb-2">No client configurations yet</p>
              <p className="text-sm">Click "Add Client" to create your first DSCR calculator</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
