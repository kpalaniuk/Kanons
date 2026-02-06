"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import type { Scenario, LtvOption } from "@/lib/types";

function calcPI(loanAmt: number, annualRate: number, months: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return loanAmt / months;
  return loanAmt * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}
function fmt(n: number) { return "$" + Math.round(n).toLocaleString("en-US"); }
function fmtMo(n: number) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtK(n: number) { return n >= 1_000_000 ? "$" + (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 2) + "M" : "$" + (n / 1000).toFixed(0) + "K"; }

function OptionCard({ opt, price, months, taxRate, monthlyInsurance, monthlyHoa, pmiRate }: {
  opt: LtvOption; price: number; months: number; taxRate: number; monthlyInsurance: number; monthlyHoa: number; pmiRate: number;
}) {
  const downPmt = price * (1 - opt.ltv / 100);
  const loanAmt = price * (opt.ltv / 100);
  const pi = calcPI(loanAmt, opt.rate, months);
  const monthlyTax = (price * taxRate) / 12;
  const hasPMI = opt.ltv > 80;
  const monthlyPMI = hasPMI ? (loanAmt * pmiRate) / 12 : 0;
  const creditAmt = opt.credit > 0 ? loanAmt * (opt.credit / 100) : 0;
  const total = pi + monthlyTax + monthlyInsurance + monthlyHoa + monthlyPMI;

  return (
    <div className="gh-option-card">
      <div className="gh-card-ltv">{opt.ltv}% LTV</div>
      <div className="gh-card-rate">{opt.rate.toFixed(3)}%</div>
      <div className="gh-card-credit">{opt.credit > 0 ? `${opt.credit}% lender credit (${fmt(creditAmt)})` : "\u00A0"}</div>
      <div className="gh-card-divider" />
      <div className="gh-card-row"><span className="gh-card-row-label">Down Payment</span><span className="gh-card-row-value">{fmt(downPmt)}</span></div>
      <div className="gh-card-row"><span className="gh-card-row-label">Loan Amount</span><span className="gh-card-row-value">{fmt(loanAmt)}</span></div>
      <div className="gh-card-divider" />
      <div className="gh-card-row"><span className="gh-card-row-label">Principal & Interest</span><span className="gh-card-row-value">{fmtMo(pi)}</span></div>
      <div className="gh-card-row"><span className="gh-card-row-label">Est. Taxes</span><span className="gh-card-row-value">{fmtMo(monthlyTax)}</span></div>
      <div className="gh-card-row"><span className="gh-card-row-label">Est. Insurance</span><span className="gh-card-row-value">{fmtMo(monthlyInsurance)}</span></div>
      {monthlyHoa > 0 && <div className="gh-card-row"><span className="gh-card-row-label">HOA</span><span className="gh-card-row-value">{fmtMo(monthlyHoa)}</span></div>}
      {hasPMI && <div className="gh-card-row gh-pmi"><span className="gh-card-row-label">Mortgage Insurance</span><span className="gh-card-row-value">{fmtMo(monthlyPMI)}</span></div>}
      <div className="gh-piti-total">
        <div className="gh-piti-label">Total {monthlyHoa > 0 || hasPMI ? "Monthly Payment" : "PITI"}</div>
        <div className="gh-piti-value">{fmtMo(total)}</div>
      </div>
    </div>
  );
}

export default function ClientScenarioPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    fetch(`/api/scenarios/${slug}`)
      .then((res) => { if (!res.ok) throw new Error("Not found"); return res.json(); })
      .then((data: Scenario) => { setScenario(data); setPrice(data.purchasePrice); })
      .catch(() => setNotFound(true));
  }, [slug]);

  const sliderPct = useMemo(() => {
    if (!scenario) return 50;
    return ((price - scenario.priceMin) / (scenario.priceMax - scenario.priceMin)) * 100;
  }, [price, scenario]);

  if (notFound) {
    return (
      <div className="gh-not-found">
        <h1>Scenario Not Found</h1>
        <p>This link may be expired or incorrect. Please contact your loan officer.</p>
      </div>
    );
  }
  if (!scenario) return <div className="gh-loading">Loading your scenario...</div>;

  const monthlyInsurance = scenario.annualInsurance / 12;

  return (
    <div className="gh-client-page">
      <div className="gh-client-hero">
        <div className="gh-client-hero-badge">Prepared for {scenario.clientName}</div>
        <h1>Your Purchase Options</h1>
        <p>Explore how different purchase prices and down payments shape your monthly payment.</p>
      </div>

      <div className="gh-client-container">
        <div className="gh-client-slider-section">
          <div className="gh-slider-header">
            <span className="gh-slider-label">Purchase Price</span>
            <span className="gh-price-display">{fmt(price)}</span>
          </div>
          <div className="gh-slider-row">
            <span className="gh-slider-bound">{fmtK(scenario.priceMin)}</span>
            <input
              type="range"
              min={scenario.priceMin} max={scenario.priceMax} step={scenario.priceStep} value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              style={{ "--pct": `${sliderPct}%` } as React.CSSProperties}
            />
            <span className="gh-slider-bound">{fmtK(scenario.priceMax)}</span>
          </div>
          <div className="gh-slider-extras">
            <div className="gh-slider-extra-item">Tax Rate: <span>{(scenario.taxRate * 100).toFixed(2)}%</span></div>
            <div className="gh-slider-extra-item">Annual Insurance: <span>{fmt(scenario.annualInsurance)}</span></div>
            {scenario.monthlyHoa > 0 && <div className="gh-slider-extra-item">Monthly HOA: <span>{fmt(scenario.monthlyHoa)}</span></div>}
            {scenario.loanTerms.some((t) => t.options.some((o) => o.ltv > 80)) && <div className="gh-slider-extra-item">PMI Rate: <span>{(scenario.pmiRate * 100).toFixed(2)}%</span></div>}
          </div>
        </div>

        {scenario.loanTerms.map((term, i) => (
          <div key={i}>
            <div className="gh-section-title">
              <h2>{term.name}</h2>
              <span className="gh-term-badge">{term.months} Months</span>
            </div>
            <div className="gh-cards-grid">
              {term.options.sort((a, b) => b.ltv - a.ltv).map((opt, j) => (
                <OptionCard key={j} opt={opt} price={price} months={term.months} taxRate={scenario.taxRate} monthlyInsurance={monthlyInsurance} monthlyHoa={scenario.monthlyHoa} pmiRate={scenario.pmiRate} />
              ))}
            </div>
          </div>
        ))}

        {scenario.loanOfficer && (
          <div className="gh-lo-footer">Prepared by <strong>{scenario.loanOfficer}</strong> — Granada House Group</div>
        )}
      </div>

      <div className="gh-disclaimer">
        <strong>Disclaimer:</strong> These figures are estimates for comparison purposes only and do not constitute a loan commitment or offer of credit. Actual rates, terms, and costs may vary. Taxes, insurance, and mortgage insurance are estimated and subject to change. Contact your loan officer for a personalized quote and official Loan Estimate.
      </div>
    </div>
  );
}
