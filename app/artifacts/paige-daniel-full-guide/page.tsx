import { 
  FileText, Building2, Users, TrendingUp, DollarSign, Shield, 
  Scale, CheckCircle, XCircle, ArrowRight, AlertCircle, Briefcase,
  BookOpen, Target, Award, Clock
} from 'lucide-react'

export default function PaigeDanielFullGuide() {
  return (
    <div className="min-h-screen bg-cream text-midnight">
      {/* Hero Section */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 text-ocean text-sm font-medium mb-4 px-4 py-2 rounded-full border border-ocean/20 bg-ocean/5">
            <BookOpen className="w-4 h-4" />
            Comprehensive Guide
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            Designer-Contractor<br />Partnership Models
          </h1>
          <p className="text-xl text-midnight/70 max-w-3xl mx-auto leading-relaxed">
            A practical guide for Paige & Daniel&apos;s residential renovation business in California
          </p>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-12 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-ocean/5 to-terracotta/5 rounded-2xl border border-ocean/10 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-ocean/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-ocean" />
            </div>
            <h2 className="font-display text-3xl font-bold">Executive Summary</h2>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-midnight/80 mb-4">
              This guide examines partnership structures for an <strong>interior designer with heavy project 
              management skills</strong> (Paige) working with a <strong>newly licensed general contractor</strong> (Daniel) 
              in California residential renovation.
            </p>
            
            <div className="bg-white rounded-xl p-6 border border-midnight/5 mt-6">
              <p className="text-base font-semibold text-ocean mb-2">Key Finding</p>
              <p className="text-midnight/80 leading-relaxed">
                Given Paige&apos;s dual role (design + PM) and Daniel&apos;s new license status, a <strong>phased 
                approach</strong> starting with a <strong>formalized subcontractor relationship</strong> or <strong>joint 
                venture agreement</strong> offers the best balance of flexibility, risk management, and growth potential, 
                with a path toward full design-build integration once the partnership is proven.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl border border-midnight/5 p-8">
          <h3 className="font-display text-2xl font-bold mb-6">Guide Contents</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { icon: Building2, title: 'Common Partnership Structures', num: '1' },
              { icon: Users, title: 'How Partnerships Split Duties & Profit', num: '2' },
              { icon: Shield, title: 'Authority Over Crews & Licensing', num: '3' },
              { icon: Scale, title: 'Legal Considerations in California', num: '4' },
              { icon: TrendingUp, title: 'Pros & Cons of Each Model', num: '5' },
              { icon: Clock, title: 'Transition Strategy', num: '6' },
              { icon: Award, title: 'Practical Recommendations', num: '7' },
              { icon: DollarSign, title: 'Financial Scenarios', num: '8' },
            ].map((item) => (
              <div key={item.num} className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-ocean/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-ocean" />
                </div>
                <div>
                  <span className="text-sm text-midnight/50 font-medium">{item.num}.</span>
                  <span className="ml-2 text-midnight/80">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 1: Partnership Structures */}
      <section id="structures" className="py-12 px-6 md:px-12 max-w-6xl mx-auto">
        <h2 className="font-display text-4xl font-bold mb-10">1. Common Partnership Structures</h2>
        
        <div className="space-y-8">
          {/* Separate Contracts */}
          <div className="bg-white rounded-2xl border border-midnight/5 p-8 transition-all hover:shadow-md">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-terracotta" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">A. Separate Contracts (Current Model)</h3>
                <p className="text-midnight/60">Designer and contractor each have independent contracts with the client</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-ocean">How it Works</h4>
                <ul className="space-y-1 text-midnight/80">
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Paige contracts directly with client for design + PM services
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Daniel contracts separately with client for construction
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> No formal business relationship between Paige and Daniel
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Each responsible for own liability, licensing, insurance
                  </li>
                </ul>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-ocean">Typical Fee Split</h4>
                  <ul className="space-y-1 text-sm text-midnight/80">
                    <li>Designer/PM: 15-25% of construction cost</li>
                    <li>GC: 10-20% markup on hard costs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-ocean">Best For</h4>
                  <p className="text-sm text-midnight/80">Testing the waters, maintaining independence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Fee */}
          <div className="bg-white rounded-2xl border border-midnight/5 p-8 transition-all hover:shadow-md">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-ocean" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">B. Referral Fee Model</h3>
                <p className="text-midnight/60">One party refers clients to the other and receives compensation</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-ocean">Real Numbers</h4>
                <div className="bg-cream/50 rounded-lg p-4">
                  <p className="text-sm text-midnight/80 mb-2">Standard referral fee: <strong className="text-ocean">10%</strong> of contracted amount</p>
                  <p className="text-sm text-midnight/80">On a $100,000 construction project: <strong className="text-terracotta">$10,000 referral fee</strong></p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-ocean pl-4">
                  <h4 className="font-semibold mb-2 text-ocean flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Pros
                  </h4>
                  <ul className="space-y-1 text-sm text-midnight/80">
                    <li>• Simple, clean separation</li>
                    <li>• No licensing complications</li>
                    <li>• Easy to document and tax</li>
                  </ul>
                </div>
                <div className="border-l-4 border-terracotta pl-4">
                  <h4 className="font-semibold mb-2 text-terracotta flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Cons
                  </h4>
                  <ul className="space-y-1 text-sm text-midnight/80">
                    <li>• Doesn&apos;t reflect Paige&apos;s hands-on PM role</li>
                    <li>• Must be disclosed to client</li>
                    <li>• No shared upside from efficiency</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-ocean/5 border border-ocean/20 rounded-lg p-4">
                <p className="text-sm text-midnight/80">
                  <strong className="text-ocean">California Legal Note:</strong> Must be disclosed to client. 
                  Interior designers can receive referral fees without licensing issues as long as they&apos;re 
                  not performing contracting work.
                </p>
              </div>
            </div>
          </div>

          {/* Subcontractor Agreement */}
          <div className="bg-gradient-to-br from-ocean/5 to-cream rounded-2xl border border-ocean/10 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-ocean" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">C. Subcontractor Agreement</h3>
                <p className="text-midnight/60">One party subcontracts to the other under their primary contract</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 border border-midnight/5">
                  <h4 className="font-semibold mb-3 text-ocean">Option 1: Paige as Daniel&apos;s Design Sub</h4>
                  <ul className="space-y-2 text-sm text-midnight/80">
                    <li>• Daniel holds prime contract for design-build</li>
                    <li>• Paige subcontracts for design + PM</li>
                    <li>• Client pays Daniel; Daniel pays Paige</li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-midnight/5">
                    <p className="text-xs text-midnight/60">Typical split:</p>
                    <p className="font-display text-lg font-semibold text-ocean">Paige receives 40-60%</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-midnight/5">
                  <h4 className="font-semibold mb-3 text-terracotta">Option 2: Daniel as Paige&apos;s Construction Sub</h4>
                  <ul className="space-y-2 text-sm text-midnight/80">
                    <li>• Paige holds prime contract for full PM</li>
                    <li>• Daniel subcontracts for construction</li>
                    <li>• Client pays Paige; Paige pays Daniel</li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-midnight/5">
                    <p className="text-xs text-midnight/60">Typical split:</p>
                    <p className="font-display text-lg font-semibold text-terracotta">Daniel receives 70-85%</p>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-ocean pl-4">
                  <h4 className="font-semibold mb-2 text-ocean flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Pros
                  </h4>
                  <ul className="space-y-1 text-sm text-midnight/80">
                    <li>• Single point of contact for client</li>
                    <li>• Clean contract structure</li>
                    <li>• Can test partnership dynamics</li>
                    <li>• Maintains separate business entities</li>
                  </ul>
                </div>
                <div className="border-l-4 border-terracotta pl-4">
                  <h4 className="font-semibold mb-2 text-terracotta flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Cons
                  </h4>
                  <ul className="space-y-1 text-sm text-midnight/80">
                    <li>• Subcontractor has less control</li>
                    <li>• Prime contractor carries all liability</li>
                    <li>• May create unequal power dynamic</li>
                    <li>• More complex if relationship dissolves</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Joint Venture */}
          <div className="bg-white rounded-2xl border border-midnight/5 p-8 transition-all hover:shadow-md">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-terracotta" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">D. Joint Venture (Project-Specific Partnership)</h3>
                <p className="text-midnight/60">Form a partnership for specific projects without creating permanent entity</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-ocean">How it Works</h4>
                <ul className="space-y-1 text-midnight/80">
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Create Joint Venture Agreement for each major project
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Both parties sign unified contract with client
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Revenue and expenses flow through JV
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Profits distributed per agreement (typically 40/60 to 50/50)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> JV dissolves at project completion
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-ocean">Typical Profit Split Models</h4>
                <div className="space-y-2">
                  <div className="bg-cream/50 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-1">1. 50/50 Equal Partners</p>
                    <p className="text-xs text-midnight/70">Simplest, works when contributions are balanced</p>
                  </div>
                  <div className="bg-cream/50 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-1">2. Based on Role Value</p>
                    <p className="text-xs text-midnight/70">Design/PM Heavy: 60% designer / 40% contractor</p>
                    <p className="text-xs text-midnight/70">Construction Heavy: 40% designer / 60% contractor</p>
                  </div>
                  <div className="bg-cream/50 rounded-lg p-4">
                    <p className="font-semibold text-sm mb-1">3. Tiered by Project Phase</p>
                    <p className="text-xs text-midnight/70">Design phase: 70% designer / 30% contractor</p>
                    <p className="text-xs text-midnight/70">Construction phase: 30% designer / 70% contractor</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-ocean/5 to-terracotta/5 rounded-xl p-6 border border-ocean/10">
                <h4 className="font-semibold mb-3 text-midnight">Real-World Example: $250,000 Project</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-midnight/70">Project costs:</span>
                    <span className="font-mono">$200,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-midnight/70">Combined fee (20%):</span>
                    <span className="font-mono font-semibold">$50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-midnight/70">After overhead (~$15,000):</span>
                    <span className="font-mono">$35,000 net</span>
                  </div>
                  <div className="border-t border-midnight/10 pt-2 mt-2">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">50/50 split:</span>
                      <span className="font-mono text-ocean">Paige $17,500 / Daniel $17,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">60/40 split (design-heavy):</span>
                      <span className="font-mono text-terracotta">Paige $21,000 / Daniel $14,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Design-Build LLC */}
          <div className="bg-gradient-to-br from-ocean/10 via-terracotta/5 to-cream rounded-2xl border-2 border-ocean/20 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-ocean flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-cream" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">E. Design-Build LLC ⭐</h3>
                <p className="text-midnight/60">Form permanent Limited Liability Company for integrated design-build services</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-ocean">How it Works</h4>
                <ul className="space-y-1 text-midnight/80">
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Create California LLC (e.g., &quot;Paige Daniel Design-Build, LLC&quot;)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> File operating agreement defining ownership, roles, profit splits
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> LLC holds contractor license (Daniel as RME)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Single contract with clients for design + construction
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span> Shared liability protection
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-ocean">Typical Ownership Structures</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-4 border border-midnight/5">
                    <p className="font-semibold text-sm">Equal 50/50</p>
                    <p className="text-xs text-midnight/60">Partnership of equals</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-midnight/5">
                    <p className="font-semibold text-sm">51/49 Design-Led</p>
                    <p className="text-xs text-midnight/60">Designer controlling interest</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-midnight/5">
                    <p className="font-semibold text-sm">51/49 Contractor-Led</p>
                    <p className="text-xs text-midnight/60">Contractor controlling interest</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-midnight/5">
                    <p className="font-semibold text-sm">60/40 or 70/30</p>
                    <p className="text-xs text-midnight/60">Reflects capital/revenue contribution</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-ocean/20">
                <h4 className="font-semibold mb-3 text-ocean">Fee Structure for Design-Build</h4>
                <p className="text-sm text-midnight/80 mb-3">Combined fee: <strong className="text-ocean">15-30%</strong> of total project cost</p>
                <p className="text-sm text-midnight/80 mb-3">Industry average: <strong className="text-terracotta">20-25%</strong> for residential remodel/renovation</p>
                <div className="space-y-1 text-sm text-midnight/70 bg-cream/50 rounded-lg p-4">
                  <p>Breakdown typically:</p>
                  <ul className="ml-4 space-y-1">
                    <li>• Design services: 8-12%</li>
                    <li>• Project management: 5-8%</li>
                    <li>• GC coordination & overhead: 7-10%</li>
                  </ul>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-l-4 border-ocean pl-4">
                  <h4 className="font-semibold mb-2 text-ocean flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Pros
                  </h4>
                  <ul className="space-y-1 text-sm text-midnight/80">
                    <li>• Single point of contact for client</li>
                    <li>• Liability protection (LLC shield)</li>
                    <li>• Professional, unified brand</li>
                    <li>• Better financing options</li>
                    <li>• Easier to scale and hire employees</li>
                    <li>• Tax flexibility</li>
                    <li>• 12% faster project completion</li>
                  </ul>
                </div>
                <div className="border-l-4 border-terracotta pl-4">
                  <h4 className="font-semibold mb-2 text-terracotta flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Cons
                  </h4>
                  <ul className="space-y-1 text-sm text-midnight/80">
                    <li>• Formation costs ($800+ annual CA tax)</li>
                    <li>• Complex governance required</li>
                    <li>• Requires buy-out provisions</li>
                    <li>• Annual compliance burden</li>
                    <li>• Harder to dissolve than JV</li>
                    <li>• Both parties &quot;locked in&quot;</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-ocean text-cream rounded-xl p-6">
                <h4 className="font-semibold mb-3">Legal Requirements in California</h4>
                <ul className="space-y-2 text-sm opacity-90">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>File Articles of Organization with CA Secretary of State</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Create detailed Operating Agreement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Obtain EIN from IRS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>CSLB contractor license under LLC name (Daniel as RME)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Business insurance (GL, E&O, workers comp)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Annual $800 minimum franchise tax</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Responsibility Matrix */}
      <section id="responsibilities" className="py-12 px-6 md:px-12 max-w-6xl mx-auto">
        <h2 className="font-display text-4xl font-bold mb-10">2. How Partnerships Split Duties & Profit</h2>
        
        <div className="bg-white rounded-2xl border border-midnight/5 overflow-hidden mb-8">
          <div className="bg-midnight text-cream px-6 py-4">
            <h3 className="font-display text-xl font-semibold">Typical Responsibility Matrix</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream">
                <tr className="text-sm">
                  <th className="px-6 py-3 text-left font-semibold">Function</th>
                  <th className="px-6 py-3 text-center font-semibold text-ocean">Designer-PM (Paige)</th>
                  <th className="px-6 py-3 text-center font-semibold text-terracotta">GC (Daniel)</th>
                  <th className="px-6 py-3 text-center font-semibold">Shared</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight/5">
                {[
                  { fn: 'Client relationship', paige: 'Lead', daniel: 'Support', shared: true },
                  { fn: 'Initial design concepts', paige: 'Lead', daniel: 'Input' },
                  { fn: 'Space planning & CAD', paige: '100%', daniel: 'Review' },
                  { fn: 'Material selection', paige: 'Lead', daniel: 'Cost input', shared: true },
                  { fn: 'Permit drawings', paige: 'Prep', daniel: 'Submit*', shared: true },
                  { fn: 'Budget development', paige: 'Input', daniel: 'Lead', shared: true },
                  { fn: 'Subcontractor bidding', paige: 'Review', daniel: 'Lead', shared: true },
                  { fn: 'Schedule creation', paige: 'Input', daniel: 'Lead', shared: true },
                  { fn: 'Site supervision', paige: 'As needed', daniel: 'Daily', shared: true },
                  { fn: 'Trade coordination', paige: 'Strategic', daniel: 'Tactical', shared: true },
                  { fn: 'Quality control', paige: 'Design intent', daniel: 'Construction', shared: true },
                  { fn: 'Change orders', paige: 'Design impact', daniel: 'Cost/schedule', shared: true },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-cream/30 transition-colors text-sm">
                    <td className="px-6 py-3 font-medium">{row.fn}</td>
                    <td className="px-6 py-3 text-center text-ocean">{row.paige}</td>
                    <td className="px-6 py-3 text-center text-terracotta">{row.daniel}</td>
                    <td className="px-6 py-3 text-center">
                      {row.shared && <CheckCircle className="w-4 h-4 text-midnight/40 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-cream/50 border-t border-midnight/5">
            <p className="text-xs text-midnight/60">
              *CA Note: Only licensed contractors can pull permits for structural work; designers can submit non-structural plans.
            </p>
          </div>
        </div>

        {/* Profit Split Methods */}
        <div className="space-y-6">
          <h3 className="font-display text-2xl font-semibold">Real-World Profit Split Approaches</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-midnight/5">
              <h4 className="font-semibold text-ocean mb-3">Method 1: Gross Revenue Percentage</h4>
              <p className="text-sm text-midnight/80 mb-3">
                Calculate total project fee, split based on agreed percentage. Simple but doesn&apos;t account for effort variation.
              </p>
              <div className="bg-cream/50 rounded-lg p-4 text-sm">
                <p className="mb-1">Example: 20% of $300K = $60,000</p>
                <p>50/50 split = $30K each</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-midnight/5">
              <h4 className="font-semibold text-terracotta mb-3">Method 2: Role-Based Compensation</h4>
              <p className="text-sm text-midnight/80 mb-3">
                Designer/PM gets flat fee + hourly. GC gets markup on construction costs + fixed fee.
              </p>
              <div className="bg-cream/50 rounded-lg p-4 text-sm space-y-1">
                <p>Design fee: $15K flat (Paige)</p>
                <p>PM hourly: $85/hr × 200hrs = $17K</p>
                <p>GC fee: 15% × $200K = $30K (Daniel)</p>
                <p className="pt-2 border-t border-midnight/10 font-semibold">Result: 52% Paige / 48% Daniel</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-midnight/5">
              <h4 className="font-semibold text-ocean mb-3">Method 3: Time-Based Split</h4>
              <p className="text-sm text-midnight/80 mb-3">
                Track all hours worked by each partner. Distribute profit proportional to hours invested.
              </p>
              <div className="bg-cream/50 rounded-lg p-4 text-sm">
                <p>Good for early partnership when roles are evolving.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-midnight/5">
              <h4 className="font-semibold text-terracotta mb-3">Method 4: Hybrid (Most Common)</h4>
              <p className="text-sm text-midnight/80 mb-3">
                Base salary or guaranteed minimum for each partner, plus remaining profit split.
              </p>
              <div className="bg-cream/50 rounded-lg p-4 text-sm space-y-1">
                <p>Paige base: $5K/project</p>
                <p>Daniel base: $5K/project</p>
                <p>Remaining profit: 50/50</p>
                <p className="pt-2 text-xs opacity-75">Ensures minimum compensation regardless of profit</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Fair for Paige */}
        <div className="mt-8 bg-gradient-to-br from-ocean/5 to-terracotta/5 rounded-2xl border border-ocean/10 p-8">
          <h3 className="font-display text-2xl font-semibold mb-4">What&apos;s Fair for Designer Doing Design + PM?</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Traditional fee breakdowns:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-4 text-center border border-midnight/5">
                  <p className="text-xs text-midnight/60 mb-1">Interior design only</p>
                  <p className="font-display text-xl font-semibold text-ocean">10-15%</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-midnight/5">
                  <p className="text-xs text-midnight/60 mb-1">PM only</p>
                  <p className="font-display text-xl font-semibold text-ocean">5-10%</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-midnight/5">
                  <p className="text-xs text-midnight/60 mb-1">Design + PM</p>
                  <p className="font-display text-xl font-semibold text-terracotta">15-25%</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-midnight/5">
                  <p className="text-xs text-midnight/60 mb-1">GC markup</p>
                  <p className="font-display text-xl font-semibold text-ocean">10-20%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-midnight/5">
              <h4 className="font-semibold text-ocean mb-3">For Paige&apos;s Dual Role:</h4>
              <p className="text-midnight/80 mb-4">
                Given she&apos;s doing design, CAD, site visits, trade coordination, material sourcing, 
                and on-job decisions, fair compensation is:
              </p>
              <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-ocean/10 to-terracotta/10 rounded-lg">
                <div className="text-center">
                  <p className="font-display text-3xl font-bold text-ocean">18-25%</p>
                  <p className="text-xs text-midnight/60 mt-1">of construction cost</p>
                </div>
                <span className="text-midnight/30 text-2xl">OR</span>
                <div className="text-center">
                  <p className="font-display text-3xl font-bold text-terracotta">55-65%</p>
                  <p className="text-xs text-midnight/60 mt-1">of combined design-build fee</p>
                </div>
              </div>
            </div>
            
            <div className="bg-midnight text-cream rounded-xl p-6">
              <h4 className="font-semibold mb-3">Example: $250,000 Renovation</h4>
              <p className="text-sm opacity-90 mb-3">
                On $250,000 renovation with 22% total fee ($55,000):
              </p>
              <div className="bg-cream/10 rounded-lg p-4">
                <p className="text-lg font-display font-semibold mb-2">60/40 split:</p>
                <div className="flex justify-between text-sm">
                  <span>Paige: $33,000</span>
                  <span>Daniel: $22,000</span>
                </div>
                <p className="text-xs opacity-75 mt-3">
                  This reflects Paige&apos;s dual value-add (design + substantial PM).<br />
                  Daniel&apos;s 40% covers GC coordination, scheduling, permit management, and trade supervision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Authority & Licensing */}
      <section id="authority" className="py-12 px-6 md:px-12 max-w-6xl mx-auto">
        <h2 className="font-display text-4xl font-bold mb-10">3. Authority Over Crews & California Licensing</h2>
        
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-ocean/5 to-cream rounded-2xl border border-ocean/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-ocean" />
              <h3 className="font-display text-2xl font-semibold">The Core Question</h3>
            </div>
            <p className="text-lg text-midnight/80 leading-relaxed">
              When Paige is on-site making decisions, how does she direct Daniel&apos;s subcontractors 
              without creating liability issues or undermining Daniel&apos;s license?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-midnight/5">
              <h4 className="font-semibold text-ocean mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                What Paige CAN Do (Without License)
              </h4>
              <ul className="space-y-2 text-sm text-midnight/80">
                <li className="flex items-start gap-2">
                  <span className="text-ocean">•</span> Scheduling and coordinating trades
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean">•</span> Communicating design intent
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean">•</span> Reviewing quality against plans
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean">•</span> Reporting issues to Daniel
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean">•</span> Making design-related decisions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean">•</span> Advising on material substitutions
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-midnight/5">
              <h4 className="font-semibold text-terracotta mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                What Paige CANNOT Do (Without Daniel&apos;s License)
              </h4>
              <ul className="space-y-2 text-sm text-midnight/80">
                <li className="flex items-start gap-2">
                  <span className="text-terracotta">•</span> Enter contracts with subcontractors
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta">•</span> Pull building permits (structural)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta">•</span> Direct structural work without Daniel&apos;s approval
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta">•</span> Hire or fire subcontractors
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta">•</span> Approve payment to subs directly
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-midnight/5 p-8">
            <h3 className="font-display text-2xl font-semibold mb-6">Formalizing the Authority Structure</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-ocean mb-3">Document 1: Project Management Agreement</h4>
                <p className="text-sm text-midnight/80 mb-3">Attached to each client contract, defines:</p>
                <ul className="space-y-1 text-sm text-midnight/70 ml-4">
                  <li>• Paige&apos;s role as Design-Project Manager</li>
                  <li>• Daniel&apos;s role as Licensed General Contractor</li>
                  <li>• Decision-making hierarchy for various scenarios</li>
                  <li>• Final authority on safety and code compliance (Daniel)</li>
                </ul>
              </div>
              
              <div className="bg-ocean/5 border border-ocean/10 rounded-lg p-6">
                <h4 className="font-semibold text-ocean mb-3">Document 2: Subcontractor Notification Letter</h4>
                <p className="text-sm text-midnight/80 mb-3">Given to all subs at project start:</p>
                <div className="bg-white rounded-lg p-4 text-sm italic text-midnight/70 border-l-4 border-ocean">
                  &quot;[Paige] is the Design-Project Manager for this project and is authorized 
                  to provide design direction, coordinate schedules, and review work quality. 
                  All work must comply with plans and specifications. [Daniel], as the 
                  licensed general contractor, maintains final authority over all construction 
                  means and methods, and approves all payments. Questions regarding site 
                  safety, code compliance, or contractual matters should be directed to 
                  [Daniel].&quot;
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-ocean mb-3">Document 3: Authority Matrix</h4>
                <p className="text-sm text-midnight/80 mb-3">Simple chart showing decision rights (see earlier section)</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-ocean mb-3">Best Practice: Weekly Coordination Meeting</h4>
                <ul className="space-y-1 text-sm text-midnight/80 ml-4">
                  <li>• Paige and Daniel meet weekly (in person or call)</li>
                  <li>• Review upcoming week&apos;s schedule</li>
                  <li>• Discuss any issues or changes</li>
                  <li>• Align on client communication</li>
                  <li>• Document decisions in shared project log</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-terracotta/5 to-cream rounded-xl p-6 border border-terracotta/10">
            <h4 className="font-semibold text-terracotta mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Insurance Considerations
            </h4>
            <ul className="space-y-2 text-sm text-midnight/80">
              <li className="flex items-start gap-2">
                <span className="text-terracotta">•</span> Daniel&apos;s contractor general liability must cover Paige&apos;s PM activities
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terracotta">•</span> Consider adding Paige as &quot;additional insured&quot; on Daniel&apos;s policy
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terracotta">•</span> Paige should carry professional liability (E&O) insurance for design work
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terracotta">•</span> Operating agreement should specify who pays for what insurance
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Transition Strategy */}
      <section id="transition" className="py-12 px-6 md:px-12 max-w-6xl mx-auto">
        <h2 className="font-display text-4xl font-bold mb-10">6. Transition Strategy: From Separate to Unified</h2>
        
        <div className="bg-gradient-to-br from-ocean/5 via-terracotta/5 to-cream rounded-2xl border border-ocean/10 p-8 mb-8">
          <h3 className="font-display text-2xl font-semibold mb-4">Recommended Phased Approach</h3>
          <p className="text-midnight/80 leading-relaxed">
            Given Daniel is new to his own license, current model is separate contracts, and need to 
            test long-term compatibility, here&apos;s the recommended progression:
          </p>
        </div>

        <div className="space-y-8">
          {/* Phase 1 */}
          <div className="bg-white rounded-2xl border border-midnight/5 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0 font-display font-bold text-ocean text-xl">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-display text-2xl font-semibold mb-2">Enhanced Separate Contracts</h3>
                <p className="text-midnight/60 mb-4">Months 1-6: Current state + coordination improvements</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-ocean mb-2">Actions:</h4>
                    <ol className="space-y-2 text-sm text-midnight/80">
                      <li className="flex items-start gap-2">
                        <span className="font-semibold flex-shrink-0">1.</span>
                        <span>Continue separate client contracts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold flex-shrink-0">2.</span>
                        <span>Create <strong>Partnership MOU</strong> (state intent, define roles, set protocols)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold flex-shrink-0">3.</span>
                        <span>Implement weekly coordination meetings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold flex-shrink-0">4.</span>
                        <span><strong>Start tracking hours/effort by project</strong> (build data)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold flex-shrink-0">5.</span>
                        <span>Create unified marketing materials</span>
                      </li>
                    </ol>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-cream/50 rounded-lg p-4">
                      <h4 className="font-semibold text-sm mb-2">Goals:</h4>
                      <ul className="space-y-1 text-xs text-midnight/70">
                        <li>• Complete 3-5 projects successfully</li>
                        <li>• Establish working rhythm</li>
                        <li>• Identify friction points</li>
                        <li>• Validate partnership desire</li>
                      </ul>
                    </div>
                    <div className="bg-cream/50 rounded-lg p-4">
                      <h4 className="font-semibold text-sm mb-2">Exit Path:</h4>
                      <p className="text-xs text-midnight/70">
                        Easy to part ways with no business entanglements if it&apos;s not working.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-white rounded-2xl border border-midnight/5 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0 font-display font-bold text-terracotta text-xl">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-display text-2xl font-semibold mb-2">Formalized Subcontractor Model</h3>
                <p className="text-midnight/60 mb-4">Months 7-18: Test unified client contract</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-terracotta mb-2">Recommended Structure:</h4>
                    <div className="bg-terracotta/5 border border-terracotta/10 rounded-lg p-4 mb-4">
                      <p className="text-sm text-midnight/80">
                        <strong>Daniel as Prime, Paige as Design-PM Sub</strong>
                      </p>
                      <p className="text-xs text-midnight/60 mt-1">
                        Rationale: Daniel&apos;s license must be on permit anyway. Easier for client to pay 
                        one licensed contractor. Paige maintains design authority via subcontract.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-terracotta mb-2">Actions:</h4>
                    <ol className="space-y-2 text-sm text-midnight/80">
                      <li>1. Draft Master Subcontract Agreement between Paige and Daniel</li>
                      <li>2. New projects use unified contract structure</li>
                      <li>3. Set initial split: <strong>60% Paige / 40% Daniel</strong> (adjust based on Phase 1 data)</li>
                      <li>4. Create standard Authority Matrix</li>
                      <li>5. Both carry appropriate insurance (add each other as named insured)</li>
                    </ol>
                  </div>
                  
                  <div className="bg-cream/50 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2">Client Benefit:</h4>
                    <ul className="space-y-1 text-xs text-midnight/70">
                      <li>• &quot;One contract covers your entire project&quot;</li>
                      <li>• &quot;Integrated team from design through completion&quot;</li>
                      <li>• &quot;No finger-pointing if issues arise&quot;</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-gradient-to-br from-ocean/10 to-terracotta/5 rounded-2xl border-2 border-ocean/20 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-ocean flex items-center justify-center flex-shrink-0 font-display font-bold text-cream text-xl">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-display text-2xl font-semibold mb-2">Design-Build LLC</h3>
                <p className="text-midnight/60 mb-4">Month 18+: Commit to long-term partnership structure</p>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-midnight/5">
                    <h4 className="font-semibold text-ocean mb-2">Decision Point Checklist:</h4>
                    <p className="text-sm text-midnight/70 mb-3">After 12-18 months, evaluate:</p>
                    <div className="space-y-2">
                      {[
                        'Do we work well together?',
                        'Do we trust each other\'s judgment?',
                        'Do we have consistent deal flow (4+ projects/year)?',
                        'Do we want to grow this into a brand?',
                        'Do clients value the integrated approach?',
                        'Are we both better off together than separate?'
                      ].map((q, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                          <span className="text-midnight/80">{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-ocean mb-2">If YES → Form LLC:</h4>
                    <ul className="space-y-1 text-sm text-midnight/80">
                      <li>• Hire attorney to draft Operating Agreement</li>
                      <li>• File LLC with California Secretary of State</li>
                      <li>• Transfer contractor license to LLC</li>
                      <li>• Set up business bank accounts, accounting, insurance</li>
                      <li>• Create brand identity</li>
                      <li>• Launch unified marketing</li>
                    </ul>
                  </div>
                  
                  <div className="bg-midnight text-cream rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-sm">LLC Formation Costs (CA):</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="opacity-75">Filing fees:</p>
                        <p className="font-mono">~$100</p>
                      </div>
                      <div>
                        <p className="opacity-75">Operating Agreement:</p>
                        <p className="font-mono">$2,000-$5,000</p>
                      </div>
                      <div>
                        <p className="opacity-75">Annual franchise tax:</p>
                        <p className="font-mono">$800</p>
                      </div>
                      <div>
                        <p className="opacity-75">Insurance setup:</p>
                        <p className="font-mono">$2,000-$5,000</p>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-cream/20">
                        <p className="opacity-75">Total startup:</p>
                        <p className="font-mono font-semibold text-base">~$7,000-$16,000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Scenarios */}
      <section id="financials" className="py-12 px-6 md:px-12 max-w-6xl mx-auto">
        <h2 className="font-display text-4xl font-bold mb-10">8. Sample Financial Scenarios</h2>
        
        <div className="space-y-8">
          {/* Scenario 1 */}
          <div className="bg-white rounded-2xl border border-midnight/5 p-8">
            <div className="mb-6">
              <h3 className="font-display text-2xl font-semibold mb-2">Scenario 1: $200,000 Kitchen + Bath Remodel</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-cream/50 rounded-lg p-4">
                  <p className="text-xs text-midnight/60 mb-1">Separate Contracts (Current)</p>
                  <div className="space-y-1 text-sm">
                    <p>Paige design fee: <span className="font-mono">$30,000</span></p>
                    <p>Daniel GC fee: <span className="font-mono">$29,700</span></p>
                    <p className="text-xs text-midnight/50 pt-2 border-t border-midnight/10">
                      Paige net: ~$22K • Daniel net: ~$18K
                    </p>
                  </div>
                </div>
                
                <div className="bg-ocean/5 border border-ocean/10 rounded-lg p-4">
                  <p className="text-xs text-ocean mb-1 font-semibold">Subcontractor Model (Phase 2)</p>
                  <div className="space-y-1 text-sm">
                    <p>Combined fee (22%): <span className="font-mono">$44,000</span></p>
                    <p>After expenses: <span className="font-mono">$36,000</span></p>
                    <p className="text-xs text-midnight/50 pt-2 border-t border-ocean/10">
                      60/40: Paige $21.6K • Daniel $14.4K
                    </p>
                  </div>
                </div>
                
                <div className="bg-terracotta/5 border border-terracotta/10 rounded-lg p-4">
                  <p className="text-xs text-terracotta mb-1 font-semibold">Design-Build LLC (Phase 3)</p>
                  <div className="space-y-1 text-sm">
                    <p>Combined fee (24%): <span className="font-mono">$48,000</span></p>
                    <p>Net after expenses: <span className="font-mono">$26,000</span></p>
                    <p className="text-xs text-midnight/50 pt-2 border-t border-terracotta/10">
                      50/50: Each receives $19K
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario 2 */}
          <div className="bg-white rounded-2xl border border-midnight/5 p-8">
            <div className="mb-6">
              <h3 className="font-display text-2xl font-semibold mb-2">Scenario 2: $400,000 Whole House Renovation</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-cream/50 rounded-lg p-4">
                  <p className="text-xs text-midnight/60 mb-1">Separate Contracts</p>
                  <div className="space-y-1 text-sm">
                    <p>Total fees: <span className="font-mono">$102,400</span></p>
                    <p className="text-xs text-midnight/50 pt-2 border-t border-midnight/10">
                      Paige net: ~$35K • Daniel net: ~$32K
                    </p>
                  </div>
                </div>
                
                <div className="bg-ocean/5 border border-ocean/10 rounded-lg p-4">
                  <p className="text-xs text-ocean mb-1 font-semibold">Joint Venture Model</p>
                  <div className="space-y-1 text-sm">
                    <p>Combined fee (20%): <span className="font-mono">$80,000</span></p>
                    <p>Net after expenses: <span className="font-mono">$62,000</span></p>
                    <p className="text-xs text-midnight/50 pt-2 border-t border-ocean/10">
                      55/45: Paige $34.1K • Daniel $27.9K
                    </p>
                  </div>
                </div>
                
                <div className="bg-terracotta/5 border border-terracotta/10 rounded-lg p-4">
                  <p className="text-xs text-terracotta mb-1 font-semibold">Design-Build LLC</p>
                  <div className="space-y-1 text-sm">
                    <p>Combined fee (22%): <span className="font-mono">$88,000</span></p>
                    <p>Net profit: <span className="font-mono">$36,000</span></p>
                    <p className="text-xs text-midnight/50 pt-2 border-t border-terracotta/10">
                      Each: $15K salary + $18K profit = $33K
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-gradient-to-br from-ocean/5 to-terracotta/5 rounded-xl p-6 border border-ocean/10">
            <h4 className="font-semibold text-midnight mb-4">Key Insights from Scenarios</h4>
            <ul className="space-y-2 text-sm text-midnight/80">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                <span>Larger projects favor unified models — overhead as % decreases, profit increases</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                <span>Paige&apos;s dual role (design + PM) justifies 55-65% of profit in split scenarios</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                <span>LLC structure creates more overhead but builds enterprise value</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                <span>Efficiency gains (12% faster construction) improve margins over time</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                <span>Gross revenue isn&apos;t everything — net profit and work-life balance matter more</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Final Recommendations */}
      <section className="py-12 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="bg-midnight text-cream rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-10 h-10 text-terracotta" />
            <h2 className="font-display text-3xl font-bold">Final Recommendations for Paige & Daniel</h2>
          </div>
          
          <div className="space-y-6 opacity-95">
            <div>
              <h3 className="font-display text-xl font-semibold mb-3 text-terracotta">Recommended Path Forward:</h3>
              <div className="space-y-4">
                <div className="bg-cream/10 rounded-lg p-4">
                  <p className="font-semibold mb-1">Short Term (Next 6 Months):</p>
                  <p className="text-sm">
                    Formalized Subcontractor Model (Daniel prime, Paige design-PM sub). 
                    Profit split: <strong className="text-terracotta">60% Paige / 40% Daniel</strong>
                  </p>
                </div>
                <div className="bg-cream/10 rounded-lg p-4">
                  <p className="font-semibold mb-1">Medium Term (6-18 Months):</p>
                  <p className="text-sm">
                    Project-Specific Joint Venture OR Continue Refined Subcontractor. 
                    Evaluate after 5-8 successful projects.
                  </p>
                </div>
                <div className="bg-cream/10 rounded-lg p-4">
                  <p className="font-semibold mb-1">Long Term (18+ Months):</p>
                  <p className="text-sm">
                    Design-Build LLC (if partnership is thriving). Form when you have consistent 
                    deal flow (8+ projects/year) and are ready to invest in brand building.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-display text-xl font-semibold mb-3 text-terracotta">Why This Progression Makes Sense:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>De-risks the partnership — Test before committing to LLC</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Easier exit — If Phase 1 doesn&apos;t work, minimal entanglement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Builds trust incrementally — Each phase deepens collaboration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Allows for course correction — Adjust splits and roles as you learn</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Natural evolution — Mirrors how many successful design-build firms started</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA to Summary */}
      <section className="py-12 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-ocean to-terracotta rounded-2xl p-1">
          <div className="bg-cream rounded-xl p-8 text-center">
            <p className="text-lg mb-4 text-midnight/80">
              Want a quicker reference? Check out the condensed version:
            </p>
            <a 
              href="/artifacts/paige-daniel-summary"
              className="inline-flex items-center gap-2 bg-ocean text-cream px-6 py-3 rounded-lg font-display font-semibold hover:bg-ocean/90 transition-all hover:scale-105"
            >
              Partnership Summary
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t border-midnight/5">
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="text-sm text-midnight/50">
            Document Prepared: <span className="font-medium">February 2026</span>
          </p>
          <p className="text-sm text-midnight/50">
            For: <span className="font-medium">Paige & Daniel Partnership Planning</span>
          </p>
          <p className="text-sm text-midnight/50">
            Sources: CSLB regulations, design-build industry studies (DBIA, RSMeans), California case law, industry fee surveys, partnership structure best practices
          </p>
          <div className="pt-4">
            <p className="text-sm text-midnight/50">
              Prepared by <span className="font-medium text-midnight/70">Jasper</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
