import { Transaction, FinancialSummary, MonthlyPL, Settings } from "../types/transaction";

export const calculateFinancials = (
  transactions: Transaction[],
  settings: Settings
): FinancialSummary => {
  // Operating Account Balance - exclude deposit ledger transactions
  const totalIn = transactions
    .filter(t => t.type === "Income")
    .reduce((sum, t) => sum + t.amountIn, 0);
  
  const totalOut = transactions
    .filter(t => 
      t.type === "Expense" || 
      t.type === "Management Fee" || 
      t.type === "Capital Improvement" ||
      t.type === "Owner Payout" ||
      t.type === "Cleaning" ||
      t.type === "Deposit Refund"
    )
    .reduce((sum, t) => sum + t.amountOut, 0);
  
  const currentBalance = totalIn - totalOut;

  // Deposits Held (separate ledger)
  const depositsReceived = transactions
    .filter(t => t.type === "Deposit")
    .reduce((sum, t) => sum + t.amountIn, 0);
  
  const depositsReturned = transactions
    .filter(t => t.type === "Deposit Refund")
    .reduce((sum, t) => sum + t.amountOut, 0);
  
  const depositsUsed = transactions
    .filter(t => t.type === "Deposit Usage")
    .reduce((sum, t) => sum + (t.depositUsageAmount || 0), 0);
  
  const depositsHeld = depositsReceived - depositsReturned - depositsUsed;

  // Total Income from operations (not deposits)
  const totalIncome = transactions
    .filter(t => t.type === "Income")
    .reduce((sum, t) => sum + t.amountIn, 0);

  // Total Expenses (only operating account outflows)
  const totalExpenses = totalOut;

  // Management Fees Collected
  const managementFeesCollected = transactions
    .filter(t => t.type === "Management Fee")
    .reduce((sum, t) => sum + t.amountOut, 0);

  // Owner Payouts Made
  const ownerPayoutsMade = transactions
    .filter(t => t.type === "Owner Payout")
    .reduce((sum, t) => sum + t.amountOut, 0);

  // Amount Owed to Owner - calculated per transaction with individual management fees
  const rentTransactions = transactions.filter(t => t.type === "Income" && t.category === "Rent");
  
  let rentIncome = 0;
  let ownerShare = 0;
  let calculatedManagementFees = 0;
  
  rentTransactions.forEach(t => {
    const feePercentage = t.managementFeePercentage ?? settings.managementFeePercentage;
    const transactionManagementFee = t.amountIn * (feePercentage / 100);
    const transactionOwnerShare = t.amountIn * (1 - feePercentage / 100);
    
    rentIncome += t.amountIn;
    calculatedManagementFees += transactionManagementFee;
    ownerShare += transactionOwnerShare;
  });
  
  // Calculate expenses (excluding management fees and owner payouts)
  const ownerExpenses = transactions
    .filter(t => t.type === "Expense" || t.type === "Cleaning" || t.type === "Capital Improvement")
    .reduce((sum, t) => sum + t.amountOut, 0);
  
  // Cash-based: Owner gets the operating account balance minus buffer
  const amountOwedToOwner = currentBalance;

  // Available to pay = current balance minus buffer
  const availableToPayOwner = Math.max(
    0,
    amountOwedToOwner - settings.bufferAmount
  );

  return {
    currentBalance,
    depositsHeld,
    totalIncome,
    totalExpenses,
    managementFeesCollected,
    ownerPayoutsMade,
    amountOwedToOwner,
    availableToPayOwner,
    rentIncome,
    ownerShare,
    ownerExpenses
  };
};

export const calculateMonthlyPL = (
  transactions: Transaction[],
  settings: Settings
): MonthlyPL[] => {
  const monthlyData = new Map<string, MonthlyPL>();

  transactions.forEach(t => {
    if (!monthlyData.has(t.monthYear)) {
      monthlyData.set(t.monthYear, {
        monthYear: t.monthYear,
        grossRent: 0,
        managementFee: 0,
        ownerShare: 0,
        expenses: 0,
        netCashFlow: 0,
        ownerPayoutStatus: "Owed",
        ownerPayoutAmount: 0
      });
    }

    const month = monthlyData.get(t.monthYear)!;

    if (t.type === "Income" && t.category === "Rent") {
      month.grossRent += t.amountIn;
    }
    if (t.type === "Expense" || t.type === "Cleaning" || t.type === "Capital Improvement") {
      month.expenses += t.amountOut;
    }
    if (t.type === "Owner Payout") {
      month.ownerPayoutAmount += t.amountOut;
    }
  });

  // Calculate derived values for each month
  monthlyData.forEach(month => {
    // Calculate management fee by summing up individual transaction fees
    const monthRentTransactions = transactions.filter(
      t => t.monthYear === month.monthYear && t.type === "Income" && t.category === "Rent"
    );
    
    let monthManagementFee = 0;
    let monthOwnerShare = 0;
    
    monthRentTransactions.forEach(t => {
      const feePercentage = t.managementFeePercentage ?? settings.managementFeePercentage;
      monthManagementFee += t.amountIn * (feePercentage / 100);
      monthOwnerShare += t.amountIn * (1 - feePercentage / 100);
    });
    
    month.managementFee = monthManagementFee;
    month.ownerShare = monthOwnerShare;
    month.netCashFlow = month.grossRent - month.managementFee - month.expenses;

    // Determine payout status
    if (month.ownerPayoutAmount === 0) {
      month.ownerPayoutStatus = "Owed";
    } else if (month.ownerPayoutAmount >= month.ownerShare) {
      month.ownerPayoutStatus = "Paid";
    } else {
      month.ownerPayoutStatus = "Partial";
    }
  });

  // Sort by month/year descending
  return Array.from(monthlyData.values()).sort((a, b) => 
    b.monthYear.localeCompare(a.monthYear)
  );
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatMonthYear = (monthYear: string): string => {
  const [year, month] = monthYear.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const getNextTransactionId = (transactions: Transaction[]): number => {
  if (transactions.length === 0) return 1000;
  return Math.max(...transactions.map(t => t.id)) + 1;
};

export const getMonthYearFromDate = (date: string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};
