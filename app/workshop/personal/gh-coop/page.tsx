'use client';

import { useState } from 'react';

interface CoOpTenant {
  id: string;
  name: string;
  space: string;
  monthlyRent: number;
  currentStatus: 'paid' | 'pending' | 'overdue';
  lastPaid?: string; // YYYY-MM-DD
  notes?: string;
}

// TODO: Replace with real data (Notion API, Airtable, or Supabase)
const MOCK_TENANTS: CoOpTenant[] = [
  {
    id: '1',
    name: 'Matt Mangum',
    space: 'Studio A',
    monthlyRent: 800,
    currentStatus: 'pending',
    lastPaid: '2026-02-01',
    notes: 'Check-in needed'
  },
  {
    id: '2',
    name: 'Artist Collective',
    space: 'Main Gallery',
    monthlyRent: 1200,
    currentStatus: 'paid',
    lastPaid: '2026-03-01'
  },
  {
    id: '3',
    name: 'Yoga Studio',
    space: 'Room B',
    monthlyRent: 600,
    currentStatus: 'paid',
    lastPaid: '2026-03-01'
  }
];

export default function GHCoOpPage() {
  const [tenants] = useState<CoOpTenant[]>(MOCK_TENANTS);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const filteredTenants = filter === 'all' 
    ? tenants 
    : tenants.filter(t => t.currentStatus === filter);

  const totalRent = tenants.reduce((sum, t) => sum + t.monthlyRent, 0);
  const paidCount = tenants.filter(t => t.currentStatus === 'paid').length;
  const pendingCount = tenants.filter(t => t.currentStatus === 'pending').length;
  const overdueCount = tenants.filter(t => t.currentStatus === 'overdue').length;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-sand p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-4xl text-midnight mb-2">Granada House Co-Op</h1>
          <p className="text-midnight/60">Tenant rent tracker</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-cream rounded-xl p-4 border border-midnight/10">
            <div className="text-sm text-midnight/60 mb-1">Total Tenants</div>
            <div className="font-display text-2xl text-midnight">{tenants.length}</div>
          </div>
          <div className="bg-cream rounded-xl p-4 border border-midnight/10">
            <div className="text-sm text-midnight/60 mb-1">Total Rent</div>
            <div className="font-display text-2xl text-midnight">${totalRent.toLocaleString()}</div>
          </div>
          <div className="bg-cream rounded-xl p-4 border border-green-200 bg-green-50">
            <div className="text-sm text-green-800/60 mb-1">Paid</div>
            <div className="font-display text-2xl text-green-800">{paidCount}</div>
          </div>
          <div className="bg-cream rounded-xl p-4 border border-amber-200 bg-amber-50">
            <div className="text-sm text-amber-800/60 mb-1">Pending</div>
            <div className="font-display text-2xl text-amber-800">{pendingCount}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-midnight/10 pb-2">
          {(['all', 'paid', 'pending', 'overdue'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status 
                  ? 'bg-midnight text-cream' 
                  : 'bg-cream text-midnight/60 hover:bg-midnight/5'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Tenant List */}
        <div className="space-y-3">
          {filteredTenants.length === 0 ? (
            <div className="bg-cream rounded-xl p-8 text-center border border-midnight/10">
              <p className="text-midnight/40">No tenants in this category</p>
            </div>
          ) : (
            filteredTenants.map(tenant => (
              <div 
                key={tenant.id}
                className="bg-cream rounded-xl p-5 border border-midnight/10 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display text-xl text-midnight">{tenant.name}</h3>
                    <p className="text-sm text-midnight/60">{tenant.space}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tenant.currentStatus)}`}>
                    {tenant.currentStatus.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-midnight/40 mb-1">Monthly Rent</div>
                    <div className="font-medium text-midnight">${tenant.monthlyRent.toLocaleString()}</div>
                  </div>
                  {tenant.lastPaid && (
                    <div>
                      <div className="text-xs text-midnight/40 mb-1">Last Paid</div>
                      <div className="font-medium text-midnight">
                        {new Date(tenant.lastPaid).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  )}
                </div>

                {tenant.notes && (
                  <div className="mt-3 pt-3 border-t border-midnight/10">
                    <p className="text-sm text-midnight/60 italic">{tenant.notes}</p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4">
                  <button className="px-3 py-1.5 bg-midnight text-cream rounded-lg text-sm font-medium hover:bg-midnight/90 transition-colors">
                    Mark Paid
                  </button>
                  <button className="px-3 py-1.5 bg-cream text-midnight border border-midnight/20 rounded-lg text-sm font-medium hover:bg-midnight/5 transition-colors">
                    Send Reminder
                  </button>
                  <button className="px-3 py-1.5 bg-cream text-midnight border border-midnight/20 rounded-lg text-sm font-medium hover:bg-midnight/5 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Tenant Button */}
        <button className="w-full py-4 bg-midnight/5 border-2 border-dashed border-midnight/20 rounded-xl text-midnight/60 font-medium hover:bg-midnight/10 hover:border-midnight/30 transition-colors">
          + Add New Tenant
        </button>

        {/* Data Source Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            <strong>TODO:</strong> This is currently using mock data. Connect to Notion, Airtable, or Supabase to track real tenant rent payments.
          </p>
        </div>
      </div>
    </div>
  );
}
