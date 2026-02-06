export interface LtvOption {
  ltv: number;
  rate: number;
  credit: number; // lender credit %, 0 if none
}

export interface LoanTerm {
  name: string;    // e.g. "30-Year Fixed"
  months: number;  // e.g. 360
  options: LtvOption[];
}

export interface Scenario {
  slug: string;
  clientName: string;
  loanOfficer: string;
  purchasePrice: number;
  priceMin: number;
  priceMax: number;
  priceStep: number;
  taxRate: number;        // decimal, e.g. 0.0122
  annualInsurance: number;
  monthlyHoa: number;
  pmiRate: number;        // decimal, e.g. 0.0055
  loanTerms: LoanTerm[];
  createdAt: string;
  updatedAt: string;
}
