'use client'

import { useState, useEffect } from "react";
import { Transaction, Settings, FinancialSummary } from "../types/transaction";
import { supabase, DbTransaction, DbSettings } from "./supabase";
import { calculateFinancials } from "./calculations";

// Map DB row (snake_case) to frontend Transaction (camelCase)
const dbToTransaction = (db: DbTransaction): Transaction => ({
  id: db.id,
  date: db.date,
  type: db.type as Transaction['type'],
  description: db.description,
  amountIn: Number(db.amount_in) || 0,
  amountOut: Number(db.amount_out) || 0,
  tenant: db.tenant || '',
  notes: db.notes || '',
  category: db.category || '',
  monthYear: db.month_year || '',
  depositUsageAmount: db.deposit_usage_amount ? Number(db.deposit_usage_amount) : undefined,
  managementFeePercentage: db.management_fee_percentage ? Number(db.management_fee_percentage) : undefined,
});

// Map frontend Transaction (camelCase) to DB row (snake_case)
// Always includes id to avoid auto-increment sequence conflicts
const transactionToDb = (t: Partial<Transaction>): Partial<DbTransaction> => ({
  ...(t.id !== undefined && { id: t.id }),
  ...(t.date !== undefined && { date: t.date }),
  ...(t.type !== undefined && { type: t.type }),
  ...(t.description !== undefined && { description: t.description }),
  ...(t.amountIn !== undefined && { amount_in: t.amountIn }),
  ...(t.amountOut !== undefined && { amount_out: t.amountOut }),
  ...(t.tenant !== undefined && { tenant: t.tenant }),
  ...(t.notes !== undefined && { notes: t.notes }),
  ...(t.category !== undefined && { category: t.category }),
  ...(t.monthYear !== undefined && { month_year: t.monthYear }),
  ...(t.depositUsageAmount !== undefined && { deposit_usage_amount: t.depositUsageAmount }),
  ...(t.managementFeePercentage !== undefined && { management_fee_percentage: t.managementFeePercentage }),
});

// Map DB settings (snake_case) to frontend Settings (camelCase)
const dbToSettings = (db: DbSettings): Settings => ({
  bufferAmount: Number(db.buffer_amount) || 1000,
  managementFeePercentage: Number(db.management_fee_percentage) || 30,
  ownerName: db.owner_name || 'Mike',
});

// Get next safe id from DB (max id + 1), avoids sequence conflicts from manual inserts
const getNextDbId = async (): Promise<number> => {
  const { data, error } = await supabase
    .from('adu_transactions')
    .select('id')
    .order('id', { ascending: false })
    .limit(1)
    .single();
  if (error || !data) return 2000;
  return (data as DbTransaction).id + 1;
};

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [financials, setFinancials] = useState<FinancialSummary | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from Supabase on mount
  useEffect(() => {
    loadData();
  }, []);

  // Recalculate financials when transactions or settings change
  useEffect(() => {
    if (transactions.length > 0 && settings && isLoaded) {
      const newFinancials = calculateFinancials(transactions, settings);
      setFinancials(newFinancials);
    } else if (isLoaded && settings) {
      // Empty transactions still need financials calculated
      const newFinancials = calculateFinancials([], settings);
      setFinancials(newFinancials);
    }
  }, [transactions, settings, isLoaded]);

  const loadData = async () => {
    try {
      // Fetch transactions
      const { data: txData, error: txError } = await supabase
        .from('adu_transactions')
        .select('*')
        .order('date', { ascending: false });

      if (txError) {
        console.error('Error loading transactions:', txError);
      } else if (txData) {
        const mapped = txData.map(dbToTransaction);
        setTransactions(mapped);
      }

      // Fetch settings (there should only be one row)
      const { data: settingsData, error: settingsError } = await supabase
        .from('adu_settings')
        .select('*')
        .single();

      if (settingsError) {
        console.error('Error loading settings:', settingsError);
        // Set default settings if none found
        setSettings({
          bufferAmount: 1000,
          managementFeePercentage: 30,
          ownerName: 'Mike'
        });
      } else if (settingsData) {
        setSettings(dbToSettings(settingsData));
      }

      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoaded(true);
    }
  };

  const addTransaction = async (transaction: Transaction) => {
    try {
      // Always use DB max+1 as id to avoid sequence conflicts from manual inserts
      const safeId = await getNextDbId();
      const transactionWithId = { ...transaction, id: safeId };
      const dbRow = transactionToDb(transactionWithId);
      const { data, error } = await supabase
        .from('adu_transactions')
        .insert([dbRow])
        .select()
        .single();

      if (error) {
        console.error('Error adding transaction:', error);
        throw error;
      }

      if (data) {
        const newTransaction = dbToTransaction(data);
        setTransactions(prev => [newTransaction, ...prev]);
      }
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    }
  };

  const addTransactions = async (newTransactions: Transaction[]) => {
    try {
      // Get starting id from DB
      const startId = await getNextDbId();
      const transactionsWithIds = newTransactions.map((t, i) => ({ ...t, id: startId + i }));
      const dbRows = transactionsWithIds.map(transactionToDb);
      const { data, error } = await supabase
        .from('adu_transactions')
        .insert(dbRows)
        .select();

      if (error) {
        console.error('Error adding transactions:', error);
        throw error;
      }

      if (data) {
        const mapped = data.map(dbToTransaction);
        setTransactions(prev => [...mapped, ...prev]);
      }
    } catch (error) {
      console.error('Failed to add transactions:', error);
      throw error;
    }
  };

  const updateTransaction = async (id: number, updates: Partial<Transaction>) => {
    try {
      const dbUpdates = transactionToDb(updates);
      const { error } = await supabase
        .from('adu_transactions')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.error('Error updating transaction:', error);
        throw error;
      }

      // Update local state
      setTransactions(prev =>
        prev.map(t => (t.id === id ? { ...t, ...updates } : t))
      );
    } catch (error) {
      console.error('Failed to update transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      const { error } = await supabase
        .from('adu_transactions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting transaction:', error);
        throw error;
      }

      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      throw error;
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    try {
      const dbSettings = {
        buffer_amount: newSettings.bufferAmount,
        management_fee_percentage: newSettings.managementFeePercentage,
        owner_name: newSettings.ownerName,
        updated_at: new Date().toISOString(),
      };

      // Update the first (and should be only) row
      const { error } = await supabase
        .from('adu_settings')
        .update(dbSettings)
        .eq('id', 1);

      if (error) {
        console.error('Error updating settings:', error);
        throw error;
      }

      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  return {
    transactions,
    settings,
    financials,
    isLoaded,
    addTransaction,
    addTransactions,
    updateTransaction,
    deleteTransaction,
    updateSettings,
    reloadData: loadData
  };
};
