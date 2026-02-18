import { Transaction, Settings } from "../types/transaction";
import { INITIAL_TRANSACTIONS } from "./initialData";

const TRANSACTIONS_KEY = "adu_transactions";
const SETTINGS_KEY = "adu_settings";
const INITIALIZED_KEY = "adu_initialized";

export const DEFAULT_SETTINGS: Settings = {
  bufferAmount: 1000,
  managementFeePercentage: 30,
  ownerName: "Mike"
};

const migrateDepositUsageTransactions = (transactions: Transaction[]): Transaction[] => {
  let needsMigration = false;
  
  const migratedTransactions = transactions.map(t => {
    if (t.type === "Deposit Usage" && !t.depositUsageAmount && t.amountOut > 0) {
      needsMigration = true;
      return {
        ...t,
        depositUsageAmount: t.amountOut,
        amountOut: 0
      };
    }
    return t;
  });
  
  return needsMigration ? migratedTransactions : transactions;
};

export const initializeData = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const isInitialized = localStorage.getItem(INITIALIZED_KEY);
  
  if (!isInitialized) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(INITIALIZED_KEY, "true");
    return true;
  }
  
  return false;
};

export const getTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  if (!data) return [];
  
  const transactions = JSON.parse(data);
  return migrateDepositUsageTransactions(transactions);
};

export const saveTransactions = (transactions: Transaction[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const getSettings = (): Settings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
};

export const saveSettings = (settings: Settings) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const clearAllData = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(TRANSACTIONS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(INITIALIZED_KEY);
};

export const exportData = () => {
  return {
    transactions: getTransactions(),
    settings: getSettings(),
    exportDate: new Date().toISOString()
  };
};

export const importData = (data: { transactions: Transaction[], settings: Settings }) => {
  saveTransactions(data.transactions);
  saveSettings(data.settings);
};
