'use client'

import { useState, useEffect } from "react";
import { Transaction, Settings, FinancialSummary } from "../types/transaction";
import {
  getTransactions,
  saveTransactions,
  getSettings,
  saveSettings,
  initializeData
} from "./storage";
import { calculateFinancials } from "./calculations";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [financials, setFinancials] = useState<FinancialSummary | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initializeData();
    loadData();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (transactions.length > 0 && settings && isLoaded) {
      const newFinancials = calculateFinancials(transactions, settings);
      setFinancials(newFinancials);
    }
  }, [transactions, settings, isLoaded]);

  const loadData = () => {
    const loadedTransactions = getTransactions();
    const loadedSettings = getSettings();
    setTransactions(loadedTransactions);
    setSettings(loadedSettings);
  };

  const addTransaction = (transaction: Transaction) => {
    const updated = [...transactions, transaction];
    setTransactions(updated);
    saveTransactions(updated);
  };

  const addTransactions = (newTransactions: Transaction[]) => {
    const updated = [...transactions, ...newTransactions];
    setTransactions(updated);
    saveTransactions(updated);
  };

  const updateTransaction = (id: number, updates: Partial<Transaction>) => {
    const updated = transactions.map(t =>
      t.id === id ? { ...t, ...updates } : t
    );
    setTransactions(updated);
    saveTransactions(updated);
  };

  const deleteTransaction = (id: number) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
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
