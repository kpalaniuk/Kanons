'use client';

import { useState } from 'react';
import { GH_COOP_TENANTS, type CoOpTenant } from '@/lib/gh-coop-data';

const STATUS_STYLES: Record<string, string> = {
  paid:    'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  overdue: 'bg-red-100 text-red-800 border-red-200',
  vacant:  'bg-midnight/5 text-midnight/40 border-midnight/10',
};

const UNIT_BG: Record<string, string> = {
  paid:    'bg-green-50 border-green-200',
  pending: 'bg-amber-50 border-amber-200',
  overdue: 'bg-red-50 border-red-200',
  vacant:  'bg-midnight/5 border-midnight/10',
};

function statusLabel(s: string) {
  return s === 'vacant' ? 'VACANT' : s.toUpperCase();
}

function daysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function GHCoOpPage() {
  const [tenants] = useState<CoOpTenant[]>(GH_COOP_TENANTS);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue' | 'vacant'>('all');
  const [view, setView] = useState<'units' | 'tenants'>('units');

  const occupied = tenants.filter(t => t.currentStatus !== 'vacant');
  const filteredTenants = filter === 'all' ? tenants : tenants.filter(t => t.currentStatus === filter);

  const expectedRent = occupied.reduce((s, t) => s + t.monthlyRent, 0);
  const collectedRent = tenants.filter(t => t.currentStatus === 'paid').reduce((s, t) => s + t.monthlyRent, 0);
  const outstandingRent = tenants.filter(t => t.currentStatus === 'pending' || t.currentStatus === 'overdue').reduce((s, t) => s + t.monthlyRent, 0);
  const collectionRate = expectedRent > 0 ? Math.round((collectedRent / expectedRent) * 100) : 0;

  return (
    <div className="min-h-screen bg-sand p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-4xl text-midnight mb-1">Granada House Co-Op</h1>
            <p className="text-midnight/60 text-sm">
              {occupied.length} of {tenants.length} units occupied · March 2026
            </p>
          </div>
          <div className="flex gap-2 mt-1">
            {(['units', 'tenants'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  view === v ? 'bg-midnight text-cream' : 'bg-cream text-midnight/60 hover:bg-midnight/10 border border-midnight/10'
                }`}
              >
                {v === 'units' ? '🏢 Units' : '👤 Tenants'}
              </button>
            ))}
          </div>
        </div>

        {/* Collection Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-cream rounded-xl p-4 border border-midnight/10">
            <div className="text-xs text-midnight/50 mb-1 uppercase tracking-wide">Expected</div>
            <div className="font-display text-2xl text-midnight">${expectedRent.toLocaleString()}</div>
            <div className="text-xs text-midnight/40 mt-0.5">{occupied.length} tenants</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-xs text-green-700/70 mb-1 uppercase tracking-wide">Collected</div>
            <div className="font-display text-2xl text-green-800">${collectedRent.toLocaleString()}</div>
            <div className="text-xs text-green-700/60 mt-0.5">{collectionRate}% of expected</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="text-xs text-amber-700/70 mb-1 uppercase tracking-wide">Outstanding</div>
            <div className="font-display text-2xl text-amber-800">${outstandingRent.toLocaleString()}</div>
            <div className="text-xs text-amber-700/60 mt-0.5">
              {tenants.filter(t => t.currentStatus === 'pending' || t.currentStatus === 'overdue').length} tenant{tenants.filter(t => t.currentStatus === 'pending' || t.currentStatus === 'overdue').length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="bg-midnight/5 rounded-xl p-4 border border-midnight/10">
            <div className="text-xs text-midnight/50 mb-1 uppercase tracking-wide">Vacant</div>
            <div className="font-display text-2xl text-midnight">
              {tenants.filter(t => t.currentStatus === 'vacant').length}
            </div>
            <div className="text-xs text-midnight/40 mt-0.5">
              ${tenants.filter(t => t.currentStatus === 'vacant').reduce((s, t) => s + t.monthlyRent, 0).toLocaleString()}/mo potential
            </div>
          </div>
        </div>

        {/* Collection Rate Bar */}
        <div className="bg-cream rounded-xl p-4 border border-midnight/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-midnight/60 uppercase tracking-wide">March Collection Rate</span>
            <span className="text-sm font-semibold text-midnight">{collectionRate}%</span>
          </div>
          <div className="h-2 bg-midnight/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${collectionRate === 100 ? 'bg-green-500' : collectionRate >= 70 ? 'bg-amber-400' : 'bg-red-400'}`}
              style={{ width: `${collectionRate}%` }}
            />
          </div>
        </div>

        {/* Unit Grid View */}
        {view === 'units' && (
          <div>
            <h2 className="font-display text-xl text-midnight mb-3">Unit Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tenants.map(tenant => {
                const leasedays = daysUntil(tenant.leaseEnd);
                return (
                  <div
                    key={tenant.id}
                    className={`rounded-xl p-5 border ${UNIT_BG[tenant.currentStatus]} transition-shadow hover:shadow-md`}
                  >
                    {/* Unit header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-display text-lg text-midnight">{tenant.unit}</div>
                        <div className="text-xs text-midnight/50">{tenant.unitType}</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[tenant.currentStatus]}`}>
                        {statusLabel(tenant.currentStatus)}
                      </span>
                    </div>

                    {/* Tenant & rent */}
                    {tenant.currentStatus !== 'vacant' ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-midnight/40 mb-0.5">Tenant</div>
                            <div className="text-sm font-semibold text-midnight">{tenant.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-midnight/40 mb-0.5">Rent</div>
                            <div className="text-sm font-semibold text-midnight">${tenant.monthlyRent.toLocaleString()}/mo</div>
                          </div>
                        </div>
                        {(tenant.leaseEnd || tenant.lastPaid) && (
                          <div className="mt-3 pt-3 border-t border-midnight/10 flex gap-4 text-xs text-midnight/50">
                            {tenant.lastPaid && (
                              <span>Last paid: {new Date(tenant.lastPaid).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            )}
                            {tenant.leaseEnd && leasedays !== null && (
                              <span className={leasedays < 60 ? 'text-amber-600 font-medium' : ''}>
                                Lease ends: {new Date(tenant.leaseEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                {leasedays < 60 && ` (${leasedays}d)`}
                              </span>
                            )}
                          </div>
                        )}
                        {tenant.notes && (
                          <p className="mt-2 text-xs text-amber-700 italic">{tenant.notes}</p>
                        )}
                      </>
                    ) : (
                      <div className="mt-2">
                        <div className="text-sm text-midnight/40 italic">No tenant assigned</div>
                        <div className="text-xs text-midnight/40 mt-1">Listed at ${tenant.monthlyRent}/mo</div>
                        <button className="mt-3 px-3 py-1.5 bg-midnight text-cream rounded-lg text-xs font-medium hover:bg-midnight/90 transition-colors">
                          + Assign Tenant
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tenant List View */}
        {view === 'tenants' && (
          <div>
            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-midnight/10 pb-2 mb-4">
              {(['all', 'paid', 'pending', 'overdue', 'vacant'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-midnight text-cream'
                      : 'bg-cream text-midnight/60 hover:bg-midnight/5'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

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
                        <h3 className="font-display text-xl text-midnight">
                          {tenant.currentStatus === 'vacant' ? <span className="text-midnight/30 italic">Vacant</span> : tenant.name}
                        </h3>
                        <p className="text-sm text-midnight/60">{tenant.unit} · {tenant.unitType}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[tenant.currentStatus]}`}>
                        {statusLabel(tenant.currentStatus)}
                      </span>
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

                    {tenant.currentStatus !== 'vacant' && (
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
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Add Tenant Button */}
        <button className="w-full py-4 bg-midnight/5 border-2 border-dashed border-midnight/20 rounded-xl text-midnight/60 font-medium hover:bg-midnight/10 hover:border-midnight/30 transition-colors">
          + Add New Tenant
        </button>

        {/* Data Source Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            <strong>Mock data.</strong> Connect to Notion, Airtable, or Supabase to track real tenant rent payments.
          </p>
        </div>

      </div>
    </div>
  );
}
