import { FileText, TrendingUp, Users, Shield, DollarSign, CheckCircle, ArrowRight } from 'lucide-react'

export default function PaigeDanielSummary() {
  return (
    <div className="min-h-screen bg-cream text-midnight">
      {/* Hero Section */}
      <section className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 text-ocean text-sm font-medium mb-4 px-4 py-2 rounded-full border border-ocean/20 bg-ocean/5">
            <FileText className="w-4 h-4" />
            Partnership Roadmap
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Paige + Daniel
          </h1>
          <p className="text-xl text-midnight/70 max-w-2xl mx-auto">
            A practical guide for structuring your design-build collaboration
          </p>
        </div>
      </section>

      {/* Current State */}
      <section className="py-12 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10 animate-fade-up stagger-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-terracotta" />
            </div>
            <h2 className="font-display text-2xl font-semibold">Where You Are Now</h2>
          </div>
          <p className="text-lg leading-relaxed text-midnight/80">
            Separate contracts with clients. Paige handles design + heavy project management. 
            Daniel handles construction under his own license. It works, but roles blur, 
            authority isn&apos;t formalized, and Paige is undercharging for the PM work she&apos;s actually doing.
          </p>
        </div>
      </section>

      {/* Core Problem */}
      <section className="py-12 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-ocean/5 to-terracotta/5 rounded-2xl border border-ocean/10 p-8 md:p-10 animate-fade-up stagger-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-ocean/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-ocean" />
            </div>
            <h2 className="font-display text-2xl font-semibold">The Core Problem</h2>
          </div>
          <p className="text-lg leading-relaxed text-midnight/80 mb-4">
            Paige is doing two jobs (design + project management) but only billing for one. 
            Daniel&apos;s crews see Paige on-site constantly but she has no contractual authority 
            over them. When issues arise, there&apos;s no clear chain of command.
          </p>
        </div>
      </section>

      {/* Three Phases */}
      <section className="py-12 px-6 md:px-12 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-bold mb-10 text-center">Recommended Path (3 Phases)</h2>
        
        <div className="space-y-6">
          {/* Phase 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 animate-fade-up stagger-3 transition-all hover:shadow-md hover:border-midnight/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0 font-display font-bold text-ocean text-xl">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-semibold mb-2">
                  Formalize What You&apos;re Already Doing
                </h3>
                <p className="text-sm text-midnight/60 mb-4">Now – 6 months</p>
                <ul className="space-y-2 text-midnight/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Keep separate contracts for current projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Create a simple Partnership MOU — who does what, how you communicate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Give Daniel&apos;s subs written notice of Paige&apos;s authority</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span><strong>Start tracking hours</strong> on every project</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Weekly coordination meeting (15 min, same day each week)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 animate-fade-up stagger-4 transition-all hover:shadow-md hover:border-midnight/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0 font-display font-bold text-terracotta text-xl">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-semibold mb-2">
                  Unified Client Contract
                </h3>
                <p className="text-sm text-midnight/60 mb-4">Months 7–18</p>
                <ul className="space-y-2 text-midnight/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                    <span>New projects go under one contract — Daniel as prime, Paige as design-PM sub</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                    <span>Client pays Daniel. Daniel pays Paige per your agreement.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                    <span><strong>Recommended split: 60% Paige / 40% Daniel</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                    <span>Create standard authority matrix so crews know who decides what</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                    <span>Build shared brand: &quot;Integrated design-build team&quot;</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 animate-fade-up stagger-5 transition-all hover:shadow-md hover:border-midnight/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0 font-display font-bold text-ocean text-xl">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-semibold mb-2">
                  Design-Build LLC
                </h3>
                <p className="text-sm text-midnight/60 mb-4">18+ months, only if Phase 2 thrives</p>
                <ul className="space-y-2 text-midnight/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Form a California LLC together</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Daniel as licensed RME (Responsible Managing Employee)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Set salaries + profit distribution in operating agreement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Ownership 50/50 or based on contribution</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-midnight/5 rounded-lg">
                  <p className="text-sm font-medium text-midnight/70">
                    <strong>Only do this when:</strong> You&apos;ve completed 8+ projects together, trust is solid, 
                    deal flow is consistent, and you both want to build a brand
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-terracotta/5 to-ocean/5 rounded-2xl border border-terracotta/10 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-terracotta" />
            </div>
            <h2 className="font-display text-2xl font-semibold">What Paige Should Charge</h2>
          </div>
          
          <div className="space-y-4 text-midnight/80">
            <p className="text-lg">
              Industry ranges for someone doing <strong>both design AND project management:</strong>
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-midnight/5">
                <p className="text-sm text-midnight/60 mb-1">Design only</p>
                <p className="font-display text-2xl font-semibold text-ocean">10–15%</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-midnight/5">
                <p className="text-sm text-midnight/60 mb-1">PM only</p>
                <p className="font-display text-2xl font-semibold text-ocean">5–10%</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-midnight/5">
                <p className="text-sm text-midnight/60 mb-1">Design + PM</p>
                <p className="font-display text-2xl font-semibold text-terracotta">15–25%</p>
              </div>
            </div>
            
            <div className="mt-6 p-6 bg-white rounded-xl border border-midnight/5">
              <p className="text-sm text-midnight/60 mb-2">Example: $250K renovation at 20% ($50K)</p>
              <div className="flex items-center justify-between">
                <span className="text-lg">60/40 split</span>
                <ArrowRight className="w-5 h-5 text-midnight/30" />
                <div className="text-right">
                  <p className="font-display text-xl font-semibold text-ocean">$30K Paige</p>
                  <p className="font-display text-xl font-semibold text-terracotta">$20K Daniel</p>
                </div>
              </div>
            </div>
            
            <p className="text-base italic pt-4">
              At $16K for 3+ months of design AND PM on Will&apos;s project, Paige is significantly below market.
            </p>
          </div>
        </div>
      </section>

      {/* Licensing */}
      <section className="py-12 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-ocean/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-ocean" />
            </div>
            <h2 className="font-display text-2xl font-semibold">California Licensing: Does Paige Need One?</h2>
          </div>
          
          <div className="space-y-4 text-midnight/80">
            <p className="text-xl font-semibold text-ocean">
              No — not for what she&apos;s doing now.
            </p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2">On private residential projects, Paige can legally:</h4>
                <ul className="space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Coordinate trades and schedules
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Make design decisions on-site
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Review work quality
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Source materials
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Manage budgets and timelines
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">She cannot (without a license):</h4>
                <ul className="space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta">•</span> Pull structural permits
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta">•</span> Enter construction contracts
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta">•</span> Directly hire/fire subs
                  </li>
                </ul>
                <p className="mt-2 text-sm">All of that stays under Daniel&apos;s license.</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-ocean/5 rounded-lg border border-ocean/10">
              <p className="text-sm">
                <strong>Long-term:</strong> If the partnership grows to 4+ projects/year, Paige getting 
                her own Class B license (2-3 year timeline) would strengthen the business and provide backup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Matrix */}
      <section className="py-12 px-6 md:px-12 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-bold mb-8 text-center">The One-Page Authority Matrix</h2>
        
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-midnight text-cream">
                <tr>
                  <th className="px-6 py-4 text-left font-display font-semibold">Decision</th>
                  <th className="px-6 py-4 text-center font-display font-semibold">Paige Leads</th>
                  <th className="px-6 py-4 text-center font-display font-semibold">Daniel Leads</th>
                  <th className="px-6 py-4 text-center font-display font-semibold">Joint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight/5">
                {[
                  { decision: 'Design changes (within budget)', paige: true },
                  { decision: 'Design changes (over 10% impact)', joint: true },
                  { decision: 'Material substitutions', paige: '(design)', daniel: '(cost)' },
                  { decision: 'Schedule changes', daniel: true, joint: 'Major ones' },
                  { decision: 'Sub performance issues', paige: 'Reports', daniel: 'Manages', joint: 'Termination' },
                  { decision: 'Payment releases', paige: 'Quality sign-off', daniel: 'Releases' },
                  { decision: 'Safety/code', daniel: '(final authority)' },
                  { decision: 'Change orders', paige: 'Design impact', daniel: 'Price/schedule', joint: 'Client approval' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-cream/50 transition-colors">
                    <td className="px-6 py-4">{row.decision}</td>
                    <td className="px-6 py-4 text-center">
                      {row.paige === true ? (
                        <CheckCircle className="w-5 h-5 text-ocean mx-auto" />
                      ) : row.paige ? (
                        <span className="text-sm text-midnight/60">{row.paige}</span>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.daniel === true ? (
                        <CheckCircle className="w-5 h-5 text-terracotta mx-auto" />
                      ) : row.daniel ? (
                        <span className="text-sm text-midnight/60">{row.daniel}</span>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.joint === true ? (
                        <CheckCircle className="w-5 h-5 text-midnight mx-auto" />
                      ) : row.joint ? (
                        <span className="text-sm text-midnight/60">{row.joint}</span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Key Numbers */}
      <section className="py-12 px-6 md:px-12 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-bold mb-8 text-center">Key Numbers to Know</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 border border-midnight/5">
            <p className="text-sm text-midnight/60 mb-1">GC markup (industry standard)</p>
            <p className="font-display text-2xl font-semibold text-ocean">10–20%</p>
            <p className="text-xs text-midnight/50 mt-1">on hard costs</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-midnight/5">
            <p className="text-sm text-midnight/60 mb-1">Design-build combined fee</p>
            <p className="font-display text-2xl font-semibold text-ocean">20–25%</p>
            <p className="text-xs text-midnight/50 mt-1">of total project</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-midnight/5">
            <p className="text-sm text-midnight/60 mb-1">Referral fee (if staying separate)</p>
            <p className="font-display text-2xl font-semibold text-terracotta">10%</p>
            <p className="text-xs text-midnight/50 mt-1">standard</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-midnight/5">
            <p className="text-sm text-midnight/60 mb-1">CA LLC annual franchise tax</p>
            <p className="font-display text-2xl font-semibold text-terracotta">$800</p>
            <p className="text-xs text-midnight/50 mt-1">minimum</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-midnight/5 md:col-span-2">
            <p className="text-sm text-midnight/60 mb-1">LLC formation cost (with attorney)</p>
            <p className="font-display text-2xl font-semibold text-ocean">$7K–$16K</p>
            <p className="text-xs text-midnight/50 mt-1">total startup</p>
          </div>
        </div>
      </section>

      {/* Will Project */}
      <section className="py-12 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-ocean/5 to-cream rounded-2xl border border-ocean/10 p-8 md:p-10">
          <h2 className="font-display text-2xl font-semibold mb-4">What This Means for the Will Project</h2>
          
          <p className="text-lg mb-4 text-midnight/80">
            This project stays as-is — separate contracts, no disruption. But use it to:
          </p>
          
          <ol className="space-y-3 text-midnight/80 mb-6">
            <li className="flex items-start gap-3">
              <span className="font-display font-bold text-ocean flex-shrink-0">1.</span>
              <span>Track your hours carefully (both of you)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-display font-bold text-ocean flex-shrink-0">2.</span>
              <span>Practice the authority matrix informally</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-display font-bold text-ocean flex-shrink-0">3.</span>
              <span>Note where confusion or gaps show up</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-display font-bold text-ocean flex-shrink-0">4.</span>
              <span>After it&apos;s done, sit down and review: what worked, what didn&apos;t, what would a unified contract have changed?</span>
            </li>
          </ol>
          
          <div className="p-4 bg-terracotta/10 rounded-lg border border-terracotta/20">
            <p className="text-sm text-midnight/80">
              <strong>Note:</strong> Daniel should add 15–20% cushion to his estimate. He&apos;s new to bidding 
              on his own and the numbers are tight. Better to come in under budget than scramble when overruns hit.
            </p>
          </div>
        </div>
      </section>

      {/* Next Step */}
      <section className="py-12 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="bg-midnight text-cream rounded-2xl p-8 md:p-10 text-center">
          <h2 className="font-display text-2xl font-semibold mb-4">Next Step</h2>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto mb-6 opacity-90">
            Schedule a casual sit-down — Paige, Daniel, and Kyle if helpful — to talk through:
          </p>
          <ol className="text-left max-w-xl mx-auto space-y-3 mb-8 opacity-90">
            <li className="flex items-start gap-3">
              <span className="font-display font-bold text-terracotta flex-shrink-0">1.</span>
              <span>Do we want to formalize this?</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-display font-bold text-terracotta flex-shrink-0">2.</span>
              <span>What does a fair split look like based on what we&apos;re each actually doing?</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-display font-bold text-terracotta flex-shrink-0">3.</span>
              <span>What decisions should require both of us to agree?</span>
            </li>
          </ol>
          <p className="text-base opacity-75">
            No rush. No pressure. Just a conversation about making something that&apos;s already working... work better for both of you.
          </p>
        </div>
      </section>

      {/* CTA to Full Guide */}
      <section className="py-12 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-ocean to-terracotta rounded-2xl p-1">
          <div className="bg-cream rounded-xl p-8 text-center">
            <p className="text-lg mb-4 text-midnight/80">
              Want more details? Financial scenarios, legal citations, and contract templates available in the:
            </p>
            <a 
              href="/artifacts/paige-daniel-full-guide"
              className="inline-flex items-center gap-2 bg-ocean text-cream px-6 py-3 rounded-lg font-display font-semibold hover:bg-ocean/90 transition-all hover:scale-105"
            >
              Full Detailed Guide
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t border-midnight/5">
        <p className="text-sm text-midnight/50">
          Prepared by <span className="font-medium text-midnight/70">Jasper</span>
        </p>
      </footer>
    </div>
  )
}
