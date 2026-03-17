/**
 * Mortgage Calculator — shared engine ported from LO Buddy
 * Source: lo-buddy/lib/mortgage-calc.ts
 */

const CONFORMING_LIMIT_2026 = 1006250; // SD County 2026

export function annualPmiRate(ltv: number): number {
  if (ltv <= 0.80) return 0;
  if (ltv <= 0.85) return 0.003;
  if (ltv <= 0.90) return 0.005;
  if (ltv <= 0.95) return 0.007;
  return 0.009;
}

export function annualFhaMip(loanAmount: number, ltv: number): number {
  if (ltv <= 0.90) return loanAmount * 0.005 / 12;
  return loanAmount * 0.0055 / 12;
}

export interface ScenarioInput {
  name: string;
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  loanType: 'conventional' | 'fha' | 'va';
  propertyTax?: number;
  homeInsurance?: number;
  hoaDues?: number;
  isRecommended?: boolean;
}

export interface ScenarioResult extends ScenarioInput {
  loanAmount: number;
  downPayment: number;
  monthlyPI: number;
  monthlyPMI: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  totalMonthly: number;
  ltv: number;
  totalInterest: number;
  totalCost: number;
  isJumbo: boolean;
}

export function calculateMonthlyPI(loanAmount: number, annualRate: number, termYears: number): number {
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return loanAmount / n;
  return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calculateScenario(input: ScenarioInput): ScenarioResult {
  const downPayment = input.purchasePrice * (input.downPaymentPercent / 100);
  const loanAmount = input.purchasePrice - downPayment;
  const ltv = loanAmount / input.purchasePrice;
  const isJumbo = loanAmount > CONFORMING_LIMIT_2026;

  const monthlyPI = calculateMonthlyPI(loanAmount, input.interestRate, input.loanTermYears);

  let monthlyPMI = 0;
  if (input.loanType === 'fha') {
    monthlyPMI = annualFhaMip(loanAmount, ltv);
  } else if (input.loanType === 'conventional') {
    monthlyPMI = (loanAmount * annualPmiRate(ltv)) / 12;
  }

  const monthlyTax = (input.propertyTax ?? input.purchasePrice * 0.012) / 12;
  const monthlyInsurance = (input.homeInsurance ?? input.purchasePrice * 0.004) / 12;
  const monthlyHOA = input.hoaDues ?? 0;
  const totalMonthly = monthlyPI + monthlyPMI + monthlyTax + monthlyInsurance + monthlyHOA;
  const totalPayments = monthlyPI * input.loanTermYears * 12;
  const totalInterest = totalPayments - loanAmount;

  return {
    ...input,
    loanAmount,
    downPayment,
    monthlyPI,
    monthlyPMI,
    monthlyTax,
    monthlyInsurance,
    monthlyHOA,
    totalMonthly,
    ltv,
    totalInterest,
    totalCost: totalMonthly * input.loanTermYears * 12,
    isJumbo,
  };
}

/** DTI calculation helpers */
export function calcFrontEndDTI(monthlyHousingPayment: number, grossMonthlyIncome: number): number {
  if (!grossMonthlyIncome) return 0;
  return (monthlyHousingPayment / grossMonthlyIncome) * 100;
}

export function calcBackEndDTI(monthlyHousingPayment: number, monthlyDebts: number, grossMonthlyIncome: number): number {
  if (!grossMonthlyIncome) return 0;
  return ((monthlyHousingPayment + monthlyDebts) / grossMonthlyIncome) * 100;
}

/** Max purchase price given income, debts, and DTI limits */
export function maxPurchasePrice(
  grossMonthlyIncome: number,
  monthlyDebts: number,
  interestRate: number,
  loanTermYears: number,
  loanType: 'conventional' | 'fha' | 'va',
  downPaymentPercent: number,
  backEndDtiLimit = 43,
  propertyTaxRate = 0.012,
  homeInsuranceRate = 0.004,
  monthlyHOA = 0,
): number {
  const maxTotalDebt = grossMonthlyIncome * (backEndDtiLimit / 100);
  const maxHousingPayment = maxTotalDebt - monthlyDebts;

  // Binary search for purchase price
  let lo = 50_000, hi = 5_000_000;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const result = calculateScenario({
      name: 'max',
      purchasePrice: mid,
      downPaymentPercent,
      interestRate,
      loanTermYears,
      loanType,
      propertyTax: mid * propertyTaxRate,
      homeInsurance: mid * homeInsuranceRate,
      hoaDues: monthlyHOA,
    });
    if (result.totalMonthly < maxHousingPayment) lo = mid;
    else hi = mid;
  }
  return Math.round(lo / 5000) * 5000;
}
