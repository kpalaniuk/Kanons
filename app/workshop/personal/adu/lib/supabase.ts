/**
 * Supabase client for ADU Cash Flow app
 * 
 * Environment variables needed in Vercel:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mqxmvwbzghbzqmeamqtu.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xeG12d2J6Z2hienFtZWFtcXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNzcyMTksImV4cCI6MjA4Njk1MzIxOX0.ZYArZYLixUyQzMHTHoTLYgaitcIaUvlVJsiYRfGbtNw'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Type mapping helpers between DB (snake_case) and frontend (camelCase)
export interface DbTransaction {
  id: number
  date: string
  type: string
  description: string
  amount_in: number
  amount_out: number
  tenant: string
  notes: string
  category: string
  month_year: string
  deposit_usage_amount?: number | null
  management_fee_percentage?: number | null
  created_at?: string
  updated_at?: string
}

export interface DbSettings {
  id: number
  buffer_amount: number
  management_fee_percentage: number
  owner_name: string
  updated_at?: string
}
