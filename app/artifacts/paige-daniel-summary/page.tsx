import { FileText, ExternalLink, CheckCircle, AlertCircle, ArrowRight, Scale, DollarSign, Shield, Users, BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Design-Build Partnership Research — For Paige',
  description: 'Research on structuring a designer-contractor partnership for residential renovation.',
}

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'moderate' }) {
  const styles = {
    high: 'bg-green-50 text-green-700 border-green-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    moderate: 'bg-blue-50 text-blue-700 border-blue-200',
  }
  const labels = { high: 'High confidence', medium: 'Medium confidence', moderate: 'Moderate confidence' }
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${styles[level]}`}>
      <CheckCircle className="w-3 h-3" />
      {labels[level]}
    </span>
  )
}

function Source({ text, url }: { text: string; url?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-steel">
      <BookOpen className="w-3 h-3" />
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-ocean transition-colors">
          {text}
        </a>
      ) : (
        <span>{text}</span>
      )}
    </span>
  )
}

export default function PaigeDanielSummary() {
  return (
    <div className="min-h-screen bg-cream text-midnight">
      {/* Hero */}
      <header className="pt-16 pb-12 px-6 md:px-12 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-ocean text-sm font-medium mb-6 px-4 py-2 rounded-full border border-ocean/20 bg-ocean/5">
          <FileText className="w-4 h-4" />
          Research Report
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
          Building a Design-Build Partnership
        </h1>
        <p className="text-xl text-midnight/60 leading-relaxed">
          Paige — I spent time researching how designers and contractors in your exact situation 
          have structured their partnerships. This is what I found, tailored specifically to 
          where you and Daniel are right now.
        </p>
        <p className="text-sm text-steel mt-6">
          Prepared by Jasper &middot; February 2026
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-6 md:px-12 pb-24 space-y-16">

        {/* The Short Version */}
        <section>
          <div className="bg-gradient-to-br from-ocean/5 to-terracotta/5 rounded-2xl border border-ocean/10 p-8 md:p-10">
            <h2 className="font-display text-2xl font-semibold mb-4">The short version</h2>
            <p className="text-lg leading-relaxed text-midnight/80 mb-4">
              You&apos;re doing two jobs — design and project management — but your contracts and compensation 
              only reflect one. That&apos;s common in this industry, and it&apos;s fixable. There are well-established 
              models for how designer-contractor teams structure things, and none of them require you to 
              overhaul your business overnight.
            </p>
            <p className="text-lg leading-relaxed text-midnight/80">
              The recommended path: <strong>formalize what you&apos;re already doing</strong>, then evolve 
              the structure as you and Daniel take on more projects together.
            </p>
          </div>
        </section>

        {/* What You're Actually Doing */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-terracotta" />
            </div>
            <h2 className="font-display text-2xl font-semibold">What you&apos;re actually doing</h2>
          </div>
          <p className="text-lg leading-relaxed text-midnight/70 mb-6">
            Before talking about structure, it&apos;s worth naming the reality. Based on what Kyle described, 
            your role on projects goes well beyond &ldquo;interior design&rdquo;:
          </p>
          <div className="grid gap-3">
            {[
              'Full design packages (CAD drawings, finish schedules, material selections)',
              'Sourcing and vetting subcontractors and vendors',
              'On-site project management and quality control',
              'Coordinating trades and resolving field problems in real time',
              'Managing budgets, timelines, and client communication',
              'Handling tax compliance on trade purchases',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-midnight/5">
                <CheckCircle className="w-5 h-5 text-ocean mt-0.5 flex-shrink-0" />
                <span className="text-midnight/80">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-lg leading-relaxed text-midnight/70 mt-6">
            In the industry, this combination is called <strong>design-build project management</strong>. 
            It&apos;s a specific, high-value skill set — and it commands specific compensation.
          </p>
        </section>

        {/* What the Industry Says You Should Charge */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-ocean/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-ocean" />
            </div>
            <h2 className="font-display text-2xl font-semibold">What the industry says about compensation</h2>
          </div>
          <ConfidenceBadge level="high" />
          <p className="text-lg leading-relaxed text-midnight/70 mt-4 mb-6">
            These ranges come from industry fee surveys, the Design-Build Institute of America (DBIA), 
            and NARI (National Association of the Remodeling Industry). They&apos;re well-established 
            benchmarks for residential renovation in coastal California markets.
          </p>
          <div className="bg-white rounded-2xl border border-midnight/5 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-midnight/[0.03]">
                  <th className="text-left p-4 font-display font-semibold text-sm">Role</th>
                  <th className="text-left p-4 font-display font-semibold text-sm">Typical Fee (% of project cost)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight/5">
                <tr><td className="p-4 text-midnight/70">Interior design only</td><td className="p-4 font-medium">10–15%</td></tr>
                <tr><td className="p-4 text-midnight/70">Project management only</td><td className="p-4 font-medium">5–10%</td></tr>
                <tr className="bg-ocean/[0.03]"><td className="p-4 text-midnight/90 font-medium">Design + project management (your role)</td><td className="p-4 font-bold text-ocean">15–25%</td></tr>
                <tr><td className="p-4 text-midnight/70">General contractor markup</td><td className="p-4 font-medium">10–20%</td></tr>
                <tr><td className="p-4 text-midnight/70">Design-build combined fee</td><td className="p-4 font-medium">20–25%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-steel mt-4 flex flex-wrap gap-4">
            <Source text="DBIA industry fee surveys" url="https://www.dbia.org" />
            <Source text="NARI remodeling standards" url="https://www.nari.org" />
            <Source text="RSMeans cost data" />
          </p>
          <div className="mt-6 bg-terracotta/5 rounded-xl border border-terracotta/20 p-6">
            <p className="text-midnight/80">
              <strong>What this means in practice:</strong> On a $250K renovation with a 20% combined design-build fee ($50K), 
              a fair split for someone doing both design and PM would be around 60% — that&apos;s <strong>$30,000</strong>. 
              The contractor&apos;s 40% ($20K) covers construction coordination, scheduling, licensing, and trade supervision.
            </p>
          </div>
        </section>

        {/* The Licensing Question */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-700" />
            </div>
            <h2 className="font-display text-2xl font-semibold">Do you need a contractor&apos;s license?</h2>
          </div>
          <ConfidenceBadge level="high" />
          <div className="mt-4 bg-green-50 rounded-xl border border-green-200 p-6 mb-6">
            <p className="text-lg font-medium text-green-800 mb-2">No — not for what you&apos;re doing now.</p>
            <p className="text-green-700">
              California law is clear on this. On private residential projects, you can do everything 
              you&apos;re currently doing without a contractor&apos;s license.
            </p>
          </div>
          <p className="text-lg leading-relaxed text-midnight/70 mb-4">
            Under California case law (<em>Fifth Day, LLC v. Bolotin</em>, 2009) and CSLB regulations, 
            construction managers on private residential projects do NOT need a contractor license if they:
          </p>
          <ul className="space-y-2 mb-6">
            {[
              'Provide advisory, coordination, and scheduling services',
              'Don\'t directly contract for construction work',
              'Don\'t hire subcontractors on their own (that stays under the GC)',
              'Work in coordination with a licensed contractor (Daniel)',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-midnight/70">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-lg leading-relaxed text-midnight/70 mb-4">
            <strong>What you can legally do</strong> under Daniel&apos;s license: coordinate trades, manage schedules, 
            make design decisions on-site, review work quality, source materials, manage budgets and timelines, 
            and communicate with clients.
          </p>
          <p className="text-lg leading-relaxed text-midnight/70">
            <strong>What you can&apos;t do</strong> without your own license: pull structural permits, enter construction 
            contracts in your name, or directly hire/fire subcontractors. All of that stays under Daniel.
          </p>
          <p className="text-sm text-steel mt-4 flex flex-wrap gap-4">
            <Source text="CSLB regulations" url="https://www.cslb.ca.gov" />
            <Source text="Fifth Day, LLC v. Bolotin (2009)" />
            <Source text="CA Business & Professions Code §5800-5812" />
          </p>
          <div className="mt-6 bg-white rounded-xl border border-midnight/5 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Long-term consideration</p>
                <p className="text-midnight/60 text-sm">
                  If the partnership grows to 4+ projects/year, getting your own Class B license 
                  (2–3 year process) would strengthen the business and give you more flexibility. 
                  Not urgent — just worth knowing the option exists.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Models */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-ocean/10 flex items-center justify-center">
              <Scale className="w-5 h-5 text-ocean" />
            </div>
            <h2 className="font-display text-2xl font-semibold">How other designers structure this</h2>
          </div>
          <ConfidenceBadge level="moderate" />
          <p className="text-sm text-midnight/50 mt-1 mb-4">
            These models are well-documented in the industry, but &ldquo;best&rdquo; depends on your specific situation. 
            The percentages are typical ranges, not rules.
          </p>

          <div className="space-y-6">
            {/* Model 1 */}
            <div className="bg-white rounded-2xl border border-midnight/5 p-6 md:p-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-xl font-semibold">Separate contracts</h3>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-midnight/5 text-midnight/60">Where you are now</span>
              </div>
              <p className="text-midnight/70 mb-4">
                You and Daniel each have your own contract with the client. Maximum independence, 
                but roles blur and the client has to manage two relationships.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-green-700">Works well for: testing compatibility</span>
                <span className="text-amber-700">Watch out for: authority gaps with crews</span>
              </div>
            </div>

            {/* Model 2 */}
            <div className="bg-white rounded-2xl border-2 border-ocean/30 p-6 md:p-8 relative">
              <div className="absolute -top-3 left-6 bg-ocean text-white text-xs font-medium px-3 py-1 rounded-full">
                Recommended next step
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 mt-1">Subcontractor model</h3>
              <p className="text-midnight/70 mb-4">
                One contract with the client — Daniel as the licensed prime contractor, you as the 
                design-PM subcontractor. Client pays Daniel, Daniel pays you per your agreement. 
                Your authority is written into the contract.
              </p>
              <p className="text-midnight/70 mb-4">
                <strong>Recommended split: 60% you / 40% Daniel</strong> — reflecting the fact that you&apos;re 
                doing both design and extensive project management.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-green-700">Works well for: formalizing what you already do</span>
                <span className="text-green-700">Client benefit: single point of contact</span>
              </div>
            </div>

            {/* Model 3 */}
            <div className="bg-white rounded-2xl border border-midnight/5 p-6 md:p-8">
              <h3 className="font-display text-xl font-semibold mb-3">Joint venture (per project)</h3>
              <p className="text-midnight/70 mb-4">
                Form a temporary partnership for each project. True shared ownership of the work, 
                profits split by agreement. Dissolves when the project is done.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-green-700">Works well for: larger projects, true partnership feel</span>
                <span className="text-amber-700">Watch out for: more admin, shared liability</span>
              </div>
            </div>

            {/* Model 4 */}
            <div className="bg-white rounded-2xl border border-midnight/5 p-6 md:p-8">
              <h3 className="font-display text-xl font-semibold mb-3">Design-build LLC</h3>
              <p className="text-midnight/70 mb-4">
                A permanent business entity you and Daniel own together. The most professional structure — 
                unified brand, liability protection, easier to scale and hire. But also the biggest commitment.
              </p>
              <p className="text-midnight/70 mb-4">
                Studies from DBIA show design-build projects complete <strong>12% faster</strong> and have 
                <strong>33% faster overall delivery</strong> compared to separate contracts. Clients love the 
                single point of accountability.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-green-700">Works well for: proven partnerships ready to scale</span>
                <span className="text-amber-700">Startup cost: ~$7K–16K (CA LLC + legal + insurance)</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-steel mt-4 flex flex-wrap gap-4">
            <Source text="DBIA market share reports" url="https://www.dbia.org" />
            <Source text="AIA contract templates (A141, B143)" url="https://www.aiacc.org" />
          </p>
        </section>

        {/* Recommended Path */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-terracotta" />
            </div>
            <h2 className="font-display text-2xl font-semibold">The recommended path</h2>
          </div>
          <ConfidenceBadge level="medium" />
          <p className="text-sm text-midnight/50 mt-1 mb-6">
            This is a recommendation based on industry patterns, not a rule. Adjust to what feels right for you and Daniel.
          </p>

          <div className="space-y-8">
            {/* Phase 1 */}
            <div className="relative pl-8 border-l-2 border-ocean/20">
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-ocean text-white flex items-center justify-center text-xs font-bold">1</div>
              <h3 className="font-display text-xl font-semibold mb-2">Now – 6 months: Formalize what you&apos;re already doing</h3>
              <ul className="space-y-2 text-midnight/70">
                <li className="flex items-start gap-2"><span className="text-ocean mt-1">•</span>Keep separate contracts for current projects — don&apos;t disrupt anything</li>
                <li className="flex items-start gap-2"><span className="text-ocean mt-1">•</span>Write a simple partnership memo: who does what, how decisions get made</li>
                <li className="flex items-start gap-2"><span className="text-ocean mt-1">•</span>Give Daniel&apos;s crews a written note about your authority on-site</li>
                <li className="flex items-start gap-2"><span className="text-ocean mt-1">•</span>Start tracking your hours on every project — this data is gold for future pricing</li>
                <li className="flex items-start gap-2"><span className="text-ocean mt-1">•</span>Weekly 15-min check-in with Daniel</li>
              </ul>
            </div>

            {/* Phase 2 */}
            <div className="relative pl-8 border-l-2 border-ocean/20">
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-ocean/60 text-white flex items-center justify-center text-xs font-bold">2</div>
              <h3 className="font-display text-xl font-semibold mb-2">Months 7–18: Unified client contract</h3>
              <ul className="space-y-2 text-midnight/70">
                <li className="flex items-start gap-2"><span className="text-ocean mt-1">•</span>New projects go under one contract (Daniel as prime, you as design-PM sub)</li>
                <li className="flex items-start gap-2"><span className="text-ocean mt-1">•</span>Split: 60% you / 40% Daniel (adjust based on Phase 1 data)</li>
                <li className="flex items-start gap-2"><span className="text-ocean mt-1">•</span>Create an authority matrix so crews know exactly who decides what</li>
                <li className="flex items-start gap-2"><span className="text-ocean mt-1">•</span>Market yourselves as an integrated design-build team</li>
              </ul>
            </div>

            {/* Phase 3 */}
            <div className="relative pl-8 border-l-2 border-ocean/20">
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-ocean/30 text-white flex items-center justify-center text-xs font-bold">3</div>
              <h3 className="font-display text-xl font-semibold mb-2">18+ months: Design-build LLC (only if it&apos;s working)</h3>
              <ul className="space-y-2 text-midnight/70">
                <li className="flex items-start gap-2"><span className="text-ocean mt-1">•</span>Form a California LLC together</li>
                <li className="flex items-start gap-2"><span className="text-ocean mt-1">•</span>Set salaries + profit distribution in an operating agreement</li>
                <li className="flex items-start gap-2"><span className="text-ocean mt-1">•</span>Only when: 8+ projects together, trust is solid, deal flow is consistent</li>
              </ul>
            </div>
          </div>
        </section>

        {/* For the Will Project */}
        <section>
          <div className="bg-white rounded-2xl border border-midnight/5 p-8 md:p-10">
            <h2 className="font-display text-2xl font-semibold mb-4">For the current project with Will</h2>
            <p className="text-lg leading-relaxed text-midnight/70 mb-4">
              Don&apos;t change anything mid-stream. Finish this one under your existing contracts. But use it to:
            </p>
            <ol className="space-y-3 text-midnight/70">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-ocean/10 text-ocean flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <span>Track your hours carefully — both of you</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-ocean/10 text-ocean flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <span>Practice the authority structure informally</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-ocean/10 text-ocean flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <span>Note where confusion or gaps show up</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-ocean/10 text-ocean flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                <span>After it&apos;s done, sit down together and review: what worked, what didn&apos;t, what would a unified contract have changed?</span>
              </li>
            </ol>
            <div className="mt-6 bg-terracotta/5 rounded-xl border border-terracotta/20 p-5">
              <p className="text-midnight/80">
                <strong>On Daniel&apos;s estimate:</strong> He should add 15–20% cushion across the board. 
                He&apos;s new to bidding on his own, and the numbers are tight. Better to come in under budget 
                than scramble when overruns hit — and they always hit in renovation.
              </p>
            </div>
          </div>
        </section>

        {/* About This Research */}
        <section>
          <div className="bg-midnight/[0.02] rounded-2xl p-8 md:p-10">
            <h2 className="font-display text-xl font-semibold mb-4">About this research</h2>
            <p className="text-midnight/60 mb-4">
              This report draws from CSLB regulations, DBIA industry studies, California case law, 
              AIA contract standards, NARI remodeling industry data, and RSMeans cost benchmarks. 
              The fee percentages and split recommendations are based on published industry surveys 
              for residential renovation in coastal California markets.
            </p>
            <p className="text-midnight/60 mb-6">
              Where I&apos;m most confident: licensing requirements (clear California law), fee ranges 
              (well-documented industry data), and partnership structures (established legal models). 
              Where I&apos;m less certain: the specific split percentages for your situation — those should 
              be adjusted based on your actual hours data once you start tracking.
            </p>
            <p className="text-midnight/60">
              A full detailed guide with financial scenarios, legal citations, authority matrices, 
              and contract template references is available if you want to go deeper on any section.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-steel pt-8 border-t border-midnight/5">
          <p>Prepared by Jasper &middot; February 2026</p>
          <p className="mt-1 text-midnight/30">Research compiled for Paige &amp; Daniel&apos;s partnership planning</p>
        </footer>
      </div>
    </div>
  )
}
