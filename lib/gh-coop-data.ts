// Shared GH Co-Op tenant data
// TODO: Replace with Notion/Supabase API call when real data is ready

export interface CoOpTenant {
  id: string;
  name: string;
  unit: string;       // Physical space/unit label
  unitType: string;   // Studio, Gallery, Office, etc.
  monthlyRent: number;
  currentStatus: 'paid' | 'pending' | 'overdue' | 'vacant';
  lastPaid?: string;  // YYYY-MM-DD
  leaseEnd?: string;  // YYYY-MM-DD
  notes?: string;
}

export const GH_COOP_TENANTS: CoOpTenant[] = [
  {
    id: '1',
    name: 'Matt Mangum',
    unit: 'Studio A',
    unitType: 'Studio',
    monthlyRent: 800,
    currentStatus: 'pending',
    lastPaid: '2026-02-01',
    leaseEnd: '2026-04-30',   // ← expires within 60 days — needs renewal conversation
    notes: 'Check-in needed'
  },
  {
    id: '2',
    name: 'Artist Collective',
    unit: 'Main Gallery',
    unitType: 'Gallery',
    monthlyRent: 1200,
    currentStatus: 'paid',
    lastPaid: '2026-03-01',
    leaseEnd: '2026-12-31'
  },
  {
    id: '3',
    name: 'Yoga Studio',
    unit: 'Room B',
    unitType: 'Flex Space',
    monthlyRent: 600,
    currentStatus: 'paid',
    lastPaid: '2026-03-01',
    leaseEnd: '2026-09-30'
  },
  {
    id: '4',
    name: '',
    unit: 'Room C',
    unitType: 'Flex Space',
    monthlyRent: 500,
    currentStatus: 'vacant',
  }
];
