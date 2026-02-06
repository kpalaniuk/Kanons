"use client";
import { useState, useEffect, useCallback } from "react";
import type { Scenario, LoanTerm, LtvOption } from "@/lib/types";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const defaultTerm = (name: string, months: number): LoanTerm => ({
  name,
  months,
  options: [
    { ltv: 80, rate: 6.0, credit: 0 },
    { ltv: 75, rate: 5.875, credit: 0 },
    { ltv: 70, rate: 5.75, credit: 0 },
  ],
});

const emptyScenario = (): Omit<Scenario, "createdAt" | "updatedAt"> => ({
  slug: "",
  clientName: "",
  loanOfficer: "",
  purchasePrice: 1000000,
  priceMin: 900000,
  priceMax: 1200000,
  priceStep: 5000,
  taxRate: 0.0122,
  annualInsurance: 2400,
  monthlyHoa: 0,
  pmiRate: 0.0055,
  loanTerms: [defaultTerm("30-Year Fixed", 360), defaultTerm("15-Year Fixed", 180)],
});

export default function ClientsAdmin() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Scenario | null>(null);
  const [form, setForm] = useState(emptyScenario());
  const [toast, setToast] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const t = sessionStorage.getItem("gh_token");
    if (t) setToken(t);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) { setAuthError("Incorrect password"); return; }
    const { token: t } = await res.json();
    sessionStorage.setItem("gh_token", t);
    setToken(t);
  }

  function logout() {
    sessionStorage.removeItem("gh_token");
    setToken(null);
  }

  const headers = useCallback(
    () => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }),
    [token]
  );

  const loadScenarios = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/scenarios", { headers: headers() });
      if (res.ok) setScenarios(await res.json());
    } catch { /* noop */ }
    setLoading(false);
  }, [token, headers]);

  useEffect(() => { loadScenarios(); }, [loadScenarios]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function saveScenario() {
    const payload = { ...form, slug: form.slug || slugify(form.clientName) };
    const isEdit = !!editing;
    const url = isEdit ? `/api/scenarios/${editing!.slug}` : "/api/scenarios";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(payload) });
    if (!res.ok) { const err = await res.json(); showToast(err.error || "Error saving"); return; }
    setShowModal(false);
    setEditing(null);
    setForm(emptyScenario());
    loadScenarios();
    showToast(isEdit ? "Scenario updated" : "Scenario created");
  }

  async function handleDelete(slug: string) {
    await fetch(`/api/scenarios/${slug}`, { method: "DELETE", headers: headers() });
    setConfirmDelete(null);
    loadScenarios();
    showToast("Scenario deleted");
  }

  function openCreate() { setEditing(null); setForm(emptyScenario()); setShowModal(true); }
  function openEdit(s: Scenario) { setEditing(s); setForm(s); setShowModal(true); }

  function updateField(field: string, value: any) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function updateTerm(idx: number, field: string, value: any) {
    setForm((f) => {
      const terms = [...f.loanTerms];
      terms[idx] = { ...terms[idx], [field]: value };
      return { ...f, loanTerms: terms };
    });
  }
  function updateOption(termIdx: number, optIdx: number, field: string, value: number) {
    setForm((f) => {
      const terms = [...f.loanTerms];
      const opts = [...terms[termIdx].options];
      opts[optIdx] = { ...opts[optIdx], [field]: value };
      terms[termIdx] = { ...terms[termIdx], options: opts };
      return { ...f, loanTerms: terms };
    });
  }
  function addOption(termIdx: number) {
    setForm((f) => {
      const terms = [...f.loanTerms];
      terms[termIdx] = { ...terms[termIdx], options: [...terms[termIdx].options, { ltv: 65, rate: 5.5, credit: 0 }] };
      return { ...f, loanTerms: terms };
    });
  }
  function removeOption(termIdx: number, optIdx: number) {
    setForm((f) => {
      const terms = [...f.loanTerms];
      terms[termIdx] = { ...terms[termIdx], options: terms[termIdx].options.filter((_, i) => i !== optIdx) };
      return { ...f, loanTerms: terms };
    });
  }
  function addTerm() {
    setForm((f) => ({ ...f, loanTerms: [...f.loanTerms, defaultTerm("20-Year Fixed", 240)] }));
  }
  function removeTerm(idx: number) {
    setForm((f) => ({ ...f, loanTerms: f.loanTerms.filter((_, i) => i !== idx) }));
  }

  /* ── LOGIN GATE ── */
  if (!token) {
    return (
      <div className="gh-login-wrapper">
        <form className="gh-login-box" onSubmit={handleLogin}>
          <h1>Client Portal</h1>
          <p>Enter the admin password to continue</p>
          {authError && <div className="gh-error">{authError}</div>}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" autoFocus />
          <button type="submit" className="gh-btn gh-btn-primary">Enter</button>
        </form>
      </div>
    );
  }

  /* ── DASHBOARD ── */
  return (
    <div className="gh-admin-wrapper">
      <div className="gh-admin-header">
        <h1>Scenario Manager</h1>
        <div className="gh-admin-header-right">
          <button className="gh-btn gh-btn-primary" onClick={openCreate}>+ New Scenario</button>
          <button className="gh-btn gh-btn-ghost" onClick={logout}>Log Out</button>
        </div>
      </div>

      {loading && <p style={{ color: "#5a5a5a" }}>Loading...</p>}

      {!loading && scenarios.length === 0 && (
        <div className="gh-empty-state">
          <h3>No scenarios yet</h3>
          <p>Create your first client scenario to get started.</p>
        </div>
      )}

      <div className="gh-scenario-list">
        {scenarios.map((s) => (
          <div key={s.slug} className="gh-scenario-item">
            <div className="gh-scenario-info">
              <h3>{s.clientName}</h3>
              <div className="gh-scenario-meta">
                <span>/{s.slug}</span>
                <span>{s.loanOfficer}</span>
                <span>${s.purchasePrice.toLocaleString()}</span>
                <span>{new Date(s.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="gh-scenario-actions">
              <a href={`/clients/${s.slug}`} target="_blank" className="gh-btn gh-btn-secondary gh-btn-sm">View</a>
              <button className="gh-btn gh-btn-secondary gh-btn-sm" onClick={() => openEdit(s)}>Edit</button>
              <button className="gh-btn gh-btn-danger gh-btn-sm" onClick={() => setConfirmDelete(s.slug)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE CONFIRM */}
      {confirmDelete && (
        <div className="gh-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="gh-modal-content" style={{ maxWidth: 400, marginTop: "20vh" }} onClick={(e) => e.stopPropagation()}>
            <h2>Delete Scenario?</h2>
            <p style={{ color: "#8a8a8a", marginBottom: "1.5rem" }}>This will permanently remove the client page.</p>
            <div className="gh-modal-footer" style={{ borderTop: "none", marginTop: 0, paddingTop: 0 }}>
              <button className="gh-btn gh-btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="gh-btn gh-btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="gh-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="gh-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? "Edit Scenario" : "New Scenario"}</h2>

            <div className="gh-form-section">
              <div className="gh-form-section-title">Client Details</div>
              <div className="gh-form-row">
                <div className="gh-form-group">
                  <label>Client Name</label>
                  <input value={form.clientName} onChange={(e) => { updateField("clientName", e.target.value); if (!editing) updateField("slug", slugify(e.target.value)); }} placeholder="Chris Groh" />
                </div>
                <div className="gh-form-group">
                  <label>URL Slug</label>
                  <input value={form.slug} onChange={(e) => updateField("slug", slugify(e.target.value))} placeholder="chris-groh" disabled={!!editing} style={editing ? { opacity: 0.5 } : {}} />
                </div>
              </div>
              <div className="gh-form-row">
                <div className="gh-form-group">
                  <label>Loan Officer</label>
                  <input value={form.loanOfficer} onChange={(e) => updateField("loanOfficer", e.target.value)} placeholder="Kyle Palaniuk" />
                </div>
              </div>
            </div>

            <div className="gh-form-section">
              <div className="gh-form-section-title">Property & Costs</div>
              <div className="gh-form-row">
                <div className="gh-form-group">
                  <label>Default Purchase Price</label>
                  <input type="number" value={form.purchasePrice} onChange={(e) => updateField("purchasePrice", Number(e.target.value))} />
                </div>
                <div className="gh-form-group">
                  <label>Slider Min</label>
                  <input type="number" value={form.priceMin} onChange={(e) => updateField("priceMin", Number(e.target.value))} />
                </div>
                <div className="gh-form-group">
                  <label>Slider Max</label>
                  <input type="number" value={form.priceMax} onChange={(e) => updateField("priceMax", Number(e.target.value))} />
                </div>
              </div>
              <div className="gh-form-row">
                <div className="gh-form-group">
                  <label>Tax Rate (%)</label>
                  <input type="number" step="0.01" value={+(form.taxRate * 100).toFixed(4)} onChange={(e) => updateField("taxRate", Number(e.target.value) / 100)} />
                </div>
                <div className="gh-form-group">
                  <label>Annual Insurance ($)</label>
                  <input type="number" value={form.annualInsurance} onChange={(e) => updateField("annualInsurance", Number(e.target.value))} />
                </div>
                <div className="gh-form-group">
                  <label>Monthly HOA ($)</label>
                  <input type="number" value={form.monthlyHoa} onChange={(e) => updateField("monthlyHoa", Number(e.target.value))} />
                </div>
              </div>
              <div className="gh-form-row">
                <div className="gh-form-group">
                  <label>PMI Rate (%) — over 80% LTV</label>
                  <input type="number" step="0.01" value={+(form.pmiRate * 100).toFixed(4)} onChange={(e) => updateField("pmiRate", Number(e.target.value) / 100)} />
                </div>
                <div className="gh-form-group">
                  <label>Slider Step ($)</label>
                  <input type="number" value={form.priceStep} onChange={(e) => updateField("priceStep", Number(e.target.value))} />
                </div>
              </div>
            </div>

            <div className="gh-form-section">
              <div className="gh-form-section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Loan Terms & Rate Options</span>
                <button className="gh-btn gh-btn-secondary gh-btn-sm" onClick={addTerm}>+ Add Term</button>
              </div>
              {form.loanTerms.map((term, ti) => (
                <div key={ti} className="gh-term-block">
                  <div className="gh-term-block-header">
                    <div className="gh-form-row" style={{ marginBottom: 0, gap: "0.5rem", flex: 1 }}>
                      <div className="gh-form-group">
                        <label>Term Name</label>
                        <input value={term.name} onChange={(e) => updateTerm(ti, "name", e.target.value)} placeholder="30-Year Fixed" />
                      </div>
                      <div className="gh-form-group">
                        <label>Months</label>
                        <input type="number" value={term.months} onChange={(e) => updateTerm(ti, "months", Number(e.target.value))} />
                      </div>
                    </div>
                    {form.loanTerms.length > 1 && (
                      <button className="gh-btn gh-btn-danger gh-btn-sm" style={{ marginLeft: "0.5rem", alignSelf: "flex-end" }} onClick={() => removeTerm(ti)}>✕</button>
                    )}
                  </div>
                  {term.options.map((opt, oi) => (
                    <div key={oi} className="gh-ltv-row">
                      <div><label>LTV %</label><input type="number" step="1" value={opt.ltv} onChange={(e) => updateOption(ti, oi, "ltv", Number(e.target.value))} /></div>
                      <div><label>Rate %</label><input type="number" step="0.001" value={opt.rate} onChange={(e) => updateOption(ti, oi, "rate", Number(e.target.value))} /></div>
                      <div><label>Credit %</label><input type="number" step="0.001" value={opt.credit} onChange={(e) => updateOption(ti, oi, "credit", Number(e.target.value))} /></div>
                      <button className="gh-btn gh-btn-ghost gh-btn-sm" style={{ marginBottom: "2px" }} onClick={() => removeOption(ti, oi)} disabled={term.options.length <= 1}>✕</button>
                    </div>
                  ))}
                  <button className="gh-btn gh-btn-ghost gh-btn-sm" style={{ marginTop: "0.5rem" }} onClick={() => addOption(ti)}>+ Add LTV Option</button>
                </div>
              ))}
            </div>

            <div className="gh-modal-footer">
              <button className="gh-btn gh-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="gh-btn gh-btn-primary" onClick={saveScenario} disabled={!form.clientName}>{editing ? "Save Changes" : "Create Scenario"}</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="gh-toast">{toast}</div>}
    </div>
  );
}
