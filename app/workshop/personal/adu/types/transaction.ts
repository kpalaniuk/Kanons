export type TransactionType = 
  | "Income"
  | "Deposit"
  | "Deposit Refund"
  | "Deposit Usage"
  | "Expense"
  | "Management Fee"
  | "Cleaning"
  | "Capital Improvement"
  | "Owner Payout";

export interface Transaction {
  id: number;
  date: string;
  type: TransactionType;
  description: string;
  amountIn: number;
  amountOut: number;
  tenant: string;
  notes: string;
  category: string;
  monthYear: string;
  depositUsageAmount?: number;
  managementFeePercentage?: number;
}

export interface Settings {
  bufferAmount: number;
  managementFeePercentage: number;
  ownerName: string;
}

export interface FinancialSummary {
  currentBalance: number;
  depositsHeld: number;
  totalIncome: number;
  totalExpenses: number;
  managementFeesCollected: number;
  ownerPayoutsMade: number;
  amountOwedToOwner: number;
  availableToPayOwner: number;
  rentIncome: number;
  ownerShare: number;
  ownerExpenses: number;
}

export interface MonthlyPL {
  monthYear: string;
  grossRent: number;
  managementFee: number;
  ownerShare: number;
  expenses: number;
  netCashFlow: number;
  ownerPayoutStatus: "Paid" | "Owed" | "Partial";
  ownerPayoutAmount: number;
}
