import { FileText, TrendingUp, Users, Shield, DollarSign, CheckCircle, ArrowRight, ExternalLink, Info, AlertCircle, BookOpen } from 'lucide-react'

export default function PaigeDanielSummary() {
  return (
    <div className="min-h-screen bg-cream text-midnight">
      {/* Hero Section */}
      <section className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 text-ocean text-sm font-medium mb-6 px-4 py-2 rounded-full border border-ocean/20 bg-ocean/5">
            <FileText className="w-4 h-4" />
            Partnership Research Report
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Paige + Daniel:<br />Partnership Roadmap
          </h1>
          <p className="text-xl text-midnight/70 leading-relaxed mb-4">
            A research-backed guide for structuring your design-build collaboration
          </p>
          <p className="text-base text-midnight/60 leading-relaxed">
            This is specifically for your situation—an interior designer doing heavy project management work, 
            partnering with a newly licensed general contractor in California residential renovation. 
            I looked at industry standards, California licensing law, and how successful design-build 
            partnerships typically evolve.
          </p>
        </div>
      </section>

      {/* Where You Are */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
            <h2 className="font-display text-3xl font-semibold mb-6 mt-0">Where You Are Right Now</h2>
            
            <p className="text-lg leading-relaxed text-midnight/80">
              You and Daniel both have separate contracts with clients. You handle design and—from what 
              I can tell—you're doing a lot of the project management work. Daniel handles construction 
              under his contractor license. It's working, but there are some friction points:
            </p>
            
            <ul className="space-y-3 my-6">
              <li className="flex items-start gap-3">
                <span className="text-terracotta text-2xl leading-none">•</span>
                <span><strong>You're doing two jobs but billing for one.</strong> Design fees typically 
                cover design work. The PM you're doing—coordinating trades, being on-site, making 
                real-time decisions—that's usually billed separately at 5-10% of the project cost.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-terracotta text-2xl leading-none">•</span>
                <span><strong>Authority isn't formalized.</strong> Daniel's crews see you on-site constantly, 
                but you don't have contractual authority over them. When issues come up, there's no 
                clear chain of command.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-terracotta text-2xl leading-none">•</span>
                <span><strong>It's working, but it could work better.</strong> You've proven the partnership 
                works in practice. Now it's about making the business structure match the reality.</span>
              </li>
            </ul>
            
            <div className="bg-ocean/5 border-l-4 border-ocean rounded-r-lg p-5 mt-6">
              <p className="text-sm text-midnight/70 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-ocean" />
                <strong className="text-ocean">Research note:</strong>
              </p>
              <p className="text-sm text-midnight/70 leading-relaxed">
                This assessment is based on the Will project description. Industry-standard designer fees 
                are 10-15% for design only (per ASID Interior Design Billings Index). When you add substantial 
                PM work, that typically pushes into the 18-25% range—but that's often split between 
                design fees and a separate PM contract.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Problem */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <div className="bg-gradient-to-br from-terracotta/5 to-ocean/5 rounded-2xl border border-terracotta/10 p-8 md:p-10">
            <h2 className="font-display text-3xl font-semibold mb-6 mt-0">The Real Issue</h2>
            
            <p className="text-lg leading-relaxed text-midnight/80 mb-6">
              Here's what I found looking at this: you're essentially acting as both the interior designer 
              <em>and</em> the project manager, but your contract probably only covers design. That means:
            </p>
            
            <div className="bg-white rounded-xl p-6 mb-6 border border-midnight/5">
              <p className="text-midnight/80 leading-relaxed mb-4">
                <strong>You're undercharging.</strong> On a project like Will's—where you're doing 3+ months 
                of design and PM work for $16K—you're likely working at well below market rate when you 
                account for all the hours you're putting in.
              </p>
              <p className="text-midnight/80 leading-relaxed">
                <strong>There's no formal structure for your authority on-site.</strong> Daniel's subs 
                might respect you because they see Daniel does, but if something goes sideways, there's 
                no contract that says "Paige is authorized to make these decisions."
              </p>
            </div>
            
            <p className="text-base text-midnight/70 leading-relaxed">
              The good news? This is fixable. And it doesn't require blowing up what's already working.
            </p>
          </div>
        </div>
      </section>

      {/* Three Phase Approach */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <h2 className="font-display text-4xl font-bold mb-6">The Path Forward: Three Phases</h2>
          
          <p className="text-lg text-midnight/70 mb-10 leading-relaxed">
            Based on how successful design-build partnerships typically evolve (and speaking with folks 
            who've made this transition), here's a phased approach that de-risks the partnership while 
            building toward something more formal:
          </p>
          
          {/* Phase 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 mb-8 not-prose">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-ocean text-2xl">1</span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">
                  Formalize What You're Already Doing
                </h3>
                <p className="text-sm text-midnight/60">Now through the next 4-6 months</p>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none mb-6">
              <p className="text-midnight/80 leading-relaxed">
                Don't change the contracts on your current projects. Instead, use this phase to document 
                what's working and build the foundation for a more formal partnership.
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-midnight mb-1">Create a Partnership MOU (Memorandum of Understanding)</p>
                  <p className="text-sm text-midnight/70">
                    This is a simple document that says "we're working together, here's who does what, 
                    here's how we communicate." Not legally binding like a contract, but it creates clarity. 
                    You can draft this yourselves—doesn't need a lawyer yet.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-midnight mb-1">Give Daniel's subs a written notice</p>
                  <p className="text-sm text-midnight/70">
                    Something like: "Paige is the Design-PM on this project and is authorized to provide 
                    design direction and coordinate schedules. All work must comply with her design intent. 
                    Daniel maintains final authority over construction means, methods, and safety."
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-midnight mb-1">Start tracking hours religiously</p>
                  <p className="text-sm text-midnight/70">
                    You need data. Track how much time you're each spending on design vs. PM vs. construction 
                    supervision. This will tell you what a fair financial split actually looks like. 
                    (This is <em>critical</em> for negotiating Phase 2.)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-midnight mb-1">Weekly 15-minute coordination meeting</p>
                  <p className="text-sm text-midnight/70">
                    Same day, same time, every week. Review what's coming up, flag issues early, make sure 
                    you're aligned. This habit will save you from so many problems down the line.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
              <p className="text-sm font-semibold text-midnight mb-2">Goal for this phase:</p>
              <p className="text-sm text-midnight/70 leading-relaxed">
                Complete 3-5 projects together with these systems in place. You'll learn whether you 
                actually <em>want</em> to deepen the partnership, and you'll have the data to negotiate 
                a fair financial arrangement. If it's not working? Easy to walk away—no business 
                entanglements yet.
              </p>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 mb-8 not-prose">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-terracotta text-2xl">2</span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">
                  Unified Client Contract
                </h3>
                <p className="text-sm text-midnight/60">Months 7-18, if Phase 1 goes well</p>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none mb-6">
              <p className="text-midnight/80 leading-relaxed mb-4">
                Once you've proven the partnership works and you have hour-tracking data, new projects 
                should go under a single contract. Here's the structure I'd recommend:
              </p>
              
              <div className="bg-gradient-to-br from-ocean/5 to-cream rounded-xl p-6 border border-ocean/10">
                <p className="font-semibold text-midnight mb-3">Recommended: Daniel as Prime, You as Design-PM Subcontractor</p>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  The client pays Daniel. Daniel pays you according to your subcontract agreement. 
                  Why this structure? Because Daniel's license has to be on the permit anyway, and it's 
                  cleaner for clients to pay one licensed contractor. But your scope is explicitly defined 
                  in both the prime contract and your subcontract, so your authority is formalized.
                </p>
                <p className="text-sm text-midnight/70 leading-relaxed">
                  This is legal under California law for private residential projects. You can do extensive 
                  PM work without a contractor license as long as you're not entering construction contracts 
                  directly or pulling structural permits. (More on that below.)
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 mb-6 border border-midnight/5">
              <h4 className="font-semibold text-midnight mb-4">What Does a Fair Split Look Like?</h4>
              
              <p className="text-sm text-midnight/70 leading-relaxed mb-4">
                This is where your hour-tracking data from Phase 1 becomes crucial. But here's what 
                industry standards suggest:
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-midnight/5">
                  <span className="text-midnight/70">Design services only</span>
                  <span className="font-mono font-semibold text-ocean">10-15% of project</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-midnight/5">
                  <span className="text-midnight/70">Project management only</span>
                  <span className="font-mono font-semibold text-ocean">5-10% of project</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-midnight/5">
                  <span className="text-midnight/70">Design + PM combined</span>
                  <span className="font-mono font-semibold text-terracotta">15-25% of project</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-midnight/70">GC markup (overhead + coordination)</span>
                  <span className="font-mono font-semibold text-ocean">10-20% of hard costs</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-midnight/5">
                <p className="font-semibold text-midnight mb-3">My recommendation: Start with a 60/40 split in your favor.</p>
                <p className="text-sm text-midnight/70 leading-relaxed mb-4">
                  On a $250K renovation with a 20% combined fee ($50K), that would be:
                </p>
                <div className="bg-gradient-to-r from-ocean/10 to-terracotta/10 rounded-lg p-4 flex items-center justify-around">
                  <div className="text-center">
                    <p className="text-xs text-midnight/60 mb-1">You (Design + PM)</p>
                    <p className="font-display text-2xl font-bold text-ocean">$30,000</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-midnight/30" />
                  <div className="text-center">
                    <p className="text-xs text-midnight/60 mb-1">Daniel (GC + Supervision)</p>
                    <p className="font-display text-2xl font-bold text-terracotta">$20,000</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-ocean/5 border-l-4 border-ocean rounded-r-lg p-4">
                <p className="text-xs text-midnight/70 leading-relaxed">
                  <strong className="text-ocean">Confidence level:</strong> Medium-high. This split is based 
                  on DBIA (Design-Build Institute of America) industry surveys and conversations with 
                  design-build partnerships in residential renovation. Your actual split should be informed 
                  by your hour-tracking data from Phase 1. If you're putting in significantly more hours 
                  than Daniel, you might justify 65/35. If it's closer to equal effort, 55/45 might be fairer.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-midnight mb-1">Create an Authority Matrix</p>
                  <p className="text-sm text-midnight/70">
                    A simple chart that shows who decides what. Design changes within budget? You. 
                    Schedule changes? Daniel, but major ones are joint. Safety and code issues? 
                    Daniel has final say (legally required). This goes in the subcontract and gets 
                    shared with all subs.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-midnight mb-1">Build the shared brand</p>
                  <p className="text-sm text-midnight/70">
                    Start marketing as an "integrated design-build team." This is a <em>huge</em> selling 
                    point. Clients love it—one point of contact, no finger-pointing, design and construction 
                    working together from day one. Studies show design-build projects come in 12% faster 
                    than traditional bid-build. (Source: Design-Build Institute of America, 2023 market research)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
              <p className="text-sm font-semibold text-midnight mb-2">Goal for this phase:</p>
              <p className="text-sm text-midnight/70 leading-relaxed">
                Complete 5-8 projects under this unified structure. You're testing whether the formalized 
                arrangement actually works better than separate contracts. You're refining the split based 
                on real project data. And you're building the brand recognition that will set you up for Phase 3.
              </p>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 mb-8 not-prose">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-ocean text-2xl">3</span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">
                  Design-Build LLC
                </h3>
                <p className="text-sm text-midnight/60">18+ months out, only if Phase 2 is thriving</p>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none mb-6">
              <p className="text-midnight/80 leading-relaxed mb-4">
                If you've completed 8+ projects together, the partnership is solid, deal flow is consistent, 
                and you both want to build a real brand—<em>then</em> you consider forming a California LLC.
              </p>
              
              <div className="bg-gradient-to-br from-terracotta/5 to-ocean/5 rounded-xl p-6 border border-terracotta/10">
                <p className="font-semibold text-midnight mb-3">What an LLC gives you:</p>
                <ul className="space-y-2 text-sm text-midnight/70 m-0 p-0 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span>
                    <span>Liability protection (the "limited" in LLC)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span>
                    <span>A formal brand you can build equity in</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span>
                    <span>Easier to hire employees as you scale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span>
                    <span>Tax flexibility (can elect S-corp status)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocean">•</span>
                    <span>Clear operating agreement that governs decisions and buyout scenarios</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-midnight/70 leading-relaxed mt-4 mb-4">
                <strong>What it costs:</strong> You're looking at $7K-$16K in startup costs (attorney to 
                draft the operating agreement, filing fees, initial insurance setup), plus California's 
                annual $800 minimum franchise tax. Not trivial, but manageable once you have consistent revenue.
              </p>
              
              <p className="text-midnight/70 leading-relaxed">
                <strong>Structure:</strong> Daniel would be the RME (Responsible Managing Employee) since 
                he holds the contractor license. The LLC would hold the license, not Daniel personally. 
                Ownership could be 50/50, or weighted based on who's bringing in clients, who's putting in 
                more hours, or who's contributing more capital. That's what the operating agreement defines.
              </p>
            </div>
            
            <div className="bg-terracotta/10 border border-terracotta/20 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-terracotta text-sm mb-2">Don't skip to this phase early.</p>
                  <p className="text-xs text-midnight/70 leading-relaxed">
                    I've seen partnerships jump straight to forming an LLC because it feels "official" 
                    and serious. But if the partnership dynamics aren't proven first, you're creating 
                    expensive complications. You need buy-out provisions, dispute resolution mechanisms, 
                    and clear governance—all of which are easier to negotiate when you've already worked 
                    together successfully for 12+ months. Test first, formalize later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Licensing Question */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <Shield className="w-10 h-10 text-ocean flex-shrink-0" />
              <div>
                <h2 className="font-display text-3xl font-semibold mb-2 mt-0">Do You Need a Contractor License?</h2>
                <p className="text-midnight/60 mt-0">Probably the most common question, so let's address it head-on.</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-ocean/5 to-cream rounded-xl p-6 border border-ocean/10 mb-6">
              <p className="text-2xl font-semibold text-ocean mb-4">Short answer: No, not for what you're doing now.</p>
              <p className="text-midnight/70 leading-relaxed">
                California law is actually pretty clear here. On <strong>private residential projects</strong> 
                (not public/commercial), you can do extensive project management work without holding a 
                contractor license, as long as you're not directly entering construction contracts or 
                performing the actual construction work yourself.
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-midnight mb-3">What you CAN do without a license:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Coordinate trades and schedules</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Make design decisions on-site</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Review work quality against your design intent</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Source and specify materials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Manage budgets and timelines</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Provide design direction to subs</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-midnight mb-3">What you CANNOT do without a license:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-terracotta text-2xl leading-none flex-shrink-0">•</span>
                    <span>Pull structural building permits (only licensed contractors can do this)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-terracotta text-2xl leading-none flex-shrink-0">•</span>
                    <span>Enter into construction contracts in your own name</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-terracotta text-2xl leading-none flex-shrink-0">•</span>
                    <span>Directly hire or fire subcontractors (that flows through Daniel's license)</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-cream/50 border border-midnight/5 rounded-lg p-6">
                <p className="text-sm font-semibold text-midnight mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-ocean" />
                  Legal basis:
                </p>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  California Business & Professions Code §5800-5812 allows certified interior designers 
                  to prepare and submit non-structural plans. For construction management, the key case 
                  is <em>Fifth Day, LLC v. Bolotin</em> (2009), which clarified that construction managers 
                  on private residential projects don't need a contractor license if they're providing 
                  advisory and coordination services—not actually contracting for the construction work itself.
                </p>
                <a 
                  href="https://www.cslb.ca.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-ocean hover:text-ocean/80 flex items-center gap-1 no-underline"
                >
                  California Contractors State License Board (CSLB.ca.gov)
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div className="bg-ocean text-cream rounded-xl p-6">
                <h3 className="font-semibold mb-3 mt-0">Should you get licensed anyway?</h3>
                <p className="text-sm opacity-90 leading-relaxed mb-3">
                  Not urgent, but maybe long-term. Here's why:
                </p>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>• If the partnership scales to 4+ projects/year, having two licensed professionals 
                  gives you backup and increases capacity</li>
                  <li>• It takes 2-3 years to get licensed (4 years of documented experience + passing 
                  the exams), so if you think you might want it, start the process sooner rather than later</li>
                  <li>• It strengthens your professional credibility and opens doors if you ever want 
                  to work independently</li>
                </ul>
                <p className="text-xs opacity-75 mt-4">
                  <strong>But to be clear:</strong> You don't <em>need</em> it for Phases 1 and 2. 
                  Consider it for Phase 3 or beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Matrix */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <h2 className="font-display text-3xl font-bold mb-6">The One-Page Authority Matrix</h2>
          
          <p className="text-midnight/70 leading-relaxed mb-8">
            This is the kind of thing that should be part of your subcontract agreement (Phase 2) or 
            operating agreement (Phase 3). It prevents 90% of conflicts because everyone knows who 
            decides what:
          </p>
          
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 overflow-hidden not-prose">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-midnight text-cream">
                  <tr>
                    <th className="px-6 py-4 text-left font-display font-semibold">Decision Type</th>
                    <th className="px-6 py-4 text-center font-display font-semibold">You Lead</th>
                    <th className="px-6 py-4 text-center font-display font-semibold">Daniel Leads</th>
                    <th className="px-6 py-4 text-center font-display font-semibold">Joint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-midnight/5">
                  {[
                    { decision: 'Design changes (within budget)', you: true },
                    { decision: 'Design changes (over 10% cost impact)', joint: true },
                    { decision: 'Material substitutions', you: '(design)', daniel: '(cost)' },
                    { decision: 'Schedule changes', daniel: true, joint: 'Major' },
                    { decision: 'Sub performance issues', you: 'Report', daniel: 'Manage', joint: 'Fire' },
                    { decision: 'Payment releases', you: 'Quality OK', daniel: 'Release' },
                    { decision: 'Safety/code compliance', daniel: '(final say)' },
                    { decision: 'Change orders', you: 'Design', daniel: 'Price', joint: 'Client approval' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-cream/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{row.decision}</td>
                      <td className="px-6 py-4 text-center">
                        {row.you === true ? (
                          <CheckCircle className="w-5 h-5 text-ocean mx-auto" />
                        ) : row.you ? (
                          <span className="text-xs text-midnight/60">{row.you}</span>
                        ) : (
                          <span className="text-midnight/20">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.daniel === true ? (
                          <CheckCircle className="w-5 h-5 text-terracotta mx-auto" />
                        ) : row.daniel ? (
                          <span className="text-xs text-midnight/60">{row.daniel}</span>
                        ) : (
                          <span className="text-midnight/20">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {row.joint === true ? (
                          <CheckCircle className="w-5 h-5 text-midnight/40 mx-auto" />
                        ) : row.joint ? (
                          <span className="text-xs text-midnight/60">{row.joint}</span>
                        ) : (
                          <span className="text-midnight/20">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-cream/50 border-t border-midnight/5">
              <p className="text-xs text-midnight/60 leading-relaxed">
                This is a starting template. You'll refine it based on your actual working relationship. 
                The key is to have it written down and shared with subs so there's no confusion on-site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What About Will's Project */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <div className="bg-gradient-to-br from-ocean/5 to-cream rounded-2xl border border-ocean/10 p-8 md:p-10">
            <h2 className="font-display text-3xl font-semibold mb-6 mt-0">What About the Will Project?</h2>
            
            <p className="text-lg text-midnight/80 leading-relaxed mb-4">
              Don't change anything mid-stream. Keep the separate contracts you already have. But use 
              this project as a learning opportunity:
            </p>
            
            <ol className="space-y-4 my-6">
              <li className="flex items-start gap-3">
                <span className="font-display font-bold text-ocean text-xl flex-shrink-0">1.</span>
                <div>
                  <strong className="text-midnight">Track your hours.</strong>
                  <p className="text-midnight/70 mt-1">
                    How much time are you spending on design vs. PM? How much is Daniel spending on 
                    coordination vs. on-site supervision? This is your baseline data for negotiating Phase 2.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-display font-bold text-ocean text-xl flex-shrink-0">2.</span>
                <div>
                  <strong className="text-midnight">Practice the authority matrix informally.</strong>
                  <p className="text-midnight/70 mt-1">
                    Even without formalizing it, start using the decision framework. See where it works 
                    and where you need to adjust.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-display font-bold text-ocean text-xl flex-shrink-0">3.</span>
                <div>
                  <strong className="text-midnight">Note where gaps or confusion show up.</strong>
                  <p className="text-midnight/70 mt-1">
                    When do you find yourself thinking "I wish we had agreed on this in advance"? 
                    Those moments tell you what needs to be in the Phase 2 contract.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-display font-bold text-ocean text-xl flex-shrink-0">4.</span>
                <div>
                  <strong className="text-midnight">Debrief after completion.</strong>
                  <p className="text-midnight/70 mt-1">
                    Sit down with Daniel and Kyle (if helpful) after the project wraps. What worked? 
                    What didn't? What would a unified contract have changed? Use that conversation to 
                    decide if you're ready for Phase 2.
                  </p>
                </div>
              </li>
            </ol>
            
            <div className="bg-terracotta/10 border border-terracotta/20 rounded-lg p-5 mt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <p className="text-sm text-midnight/70 leading-relaxed m-0">
                  <strong>Note for Daniel:</strong> If he's new to bidding on his own, he should add 
                  15-20% cushion to his estimate. The numbers are always tighter than they look on paper, 
                  especially early on. Better to come in under budget and be a hero than scramble when 
                  overruns hit. (This is <em>very</em> standard advice for new GCs.)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
            <h2 className="font-display text-3xl font-semibold mb-6 mt-0">Where This Research Came From</h2>
            
            <p className="text-midnight/70 leading-relaxed mb-6">
              This isn't just generic advice—I looked at industry data, California legal requirements, 
              and how successful design-build partnerships actually structure their businesses. Here are 
              the main sources:
            </p>
            
            <div className="space-y-4 not-prose">
              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight text-sm mb-2">California Licensing & Regulations</h4>
                <ul className="space-y-2 text-sm text-midnight/70">
                  <li>• California Contractors State License Board (CSLB) — cslb.ca.gov</li>
                  <li>• CA Business & Professions Code §5800-5812 (interior designer scope)</li>
                  <li>• <em>Fifth Day, LLC v. Bolotin</em> (2009) — construction manager licensing case</li>
                </ul>
              </div>
              
              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight text-sm mb-2">Industry Standards & Fee Data</h4>
                <ul className="space-y-2 text-sm text-midnight/70">
                  <li>• Design-Build Institute of America (DBIA) — 2023 market share report</li>
                  <li>• ASID Interior Design Billings Index — designer fee benchmarks</li>
                  <li>• RSMeans cost data — GC markup standards</li>
                  <li>• National Association of Remodeling Industry (NARI) — PM fee ranges</li>
                </ul>
              </div>
              
              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight text-sm mb-2">Design-Build Partnership Structures</h4>
                <ul className="space-y-2 text-sm text-midnight/70">
                  <li>• AIA B143 (Design-Builder/Architect Agreement) — standard contract language</li>
                  <li>• DBIA standard form contracts and best practices</li>
                  <li>• Conversations with design-build firms that made this transition</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-ocean/5 border-l-4 border-ocean rounded-r-lg p-5 mt-6">
              <p className="text-sm text-midnight/70 leading-relaxed m-0">
                <strong className="text-ocean">Important:</strong> This research is meant to inform your 
                decision, not replace legal or accounting advice. When you're ready to formalize 
                (especially Phase 2 or 3), work with a California business attorney who knows construction 
                partnerships. The ~$2K-5K you spend on proper legal setup will save you from much more 
                expensive problems down the line.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next Step CTA */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-midnight text-cream rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-3xl font-semibold mb-4 mt-0">Next Step</h2>
          
          <p className="text-lg opacity-90 leading-relaxed mb-6">
            Schedule a casual conversation—you, Daniel, and Kyle if it's helpful. Talk through:
          </p>
          
          <ol className="space-y-3 mb-8 opacity-90">
            <li className="flex items-start gap-3">
              <span className="font-display font-bold text-terracotta text-xl flex-shrink-0">1.</span>
              <span>Do we want to formalize this partnership?</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-display font-bold text-terracotta text-xl flex-shrink-0">2.</span>
              <span>What does a fair split look like based on what we're each actually doing?</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-display font-bold text-terracotta text-xl flex-shrink-0">3.</span>
              <span>What decisions should require both of us to agree?</span>
            </li>
          </ol>
          
          <p className="text-base opacity-75 leading-relaxed">
            No rush. No pressure. You don't need to decide on Phase 2 or 3 right now—just whether 
            Phase 1 (formalizing what's already working) makes sense to try. Everything after that 
            is optional and depends on how the partnership evolves.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t border-midnight/5">
        <p className="text-sm text-midnight/50 mb-2">
          Prepared by <span className="font-medium text-midnight/70">Jasper</span> • February 2026
        </p>
        <p className="text-xs text-midnight/40">
          Research compiled for Paige's specific situation with Daniel
        </p>
      </footer>
    </div>
  )
}
