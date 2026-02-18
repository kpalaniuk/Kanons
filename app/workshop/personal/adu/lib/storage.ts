/**
 * DEPRECATED: This file is no longer used.
 * Data storage has been migrated to Supabase.
 * See lib/supabase.ts and lib/useTransactions.ts for the new implementation.
 */

import { Settings } from "../types/transaction";

export const DEFAULT_SETTINGS: Settings = {
  bufferAmount: 1000,
  managementFeePercentage: 30,
  ownerName: "Mike"
};

// These functions are kept as stubs for backward compatibility
// but they no longer do anything
export const initializeData = (): boolean => false;
export const getTransactions = () => [];
export const saveTransactions = () => {};
export const getSettings = () => DEFAULT_SETTINGS;
export const saveSettings = () => {};
export const clearAllData = () => {};
export const exportData = () => ({ transactions: [], settings: DEFAULT_SETTINGS, exportDate: new Date().toISOString() });
export const importData = () => {};
