import { 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Puzzle, 
  Zap, 
  FileText, 
  GitBranch, 
  Clock, 
  Target, 
  Cpu,
  MessageSquare,
  Database,
  Settings,
  ExternalLink,
  Info,
  BookOpen,
  Code,
  TestTube
} from 'lucide-react'

export default function LOBuddyChadMeeting() {
  return (
    <div className="min-h-screen bg-cream text-midnight">
      {/* Hero Section */}
      <section className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 text-ocean text-sm font-medium mb-6 px-4 py-2 rounded-full border border-ocean/20 bg-ocean/5">
            <FileText className="w-4 h-4" />
            Meeting Prep — Feb 19, 2026
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            LO Buddy:<br />What I Need From You Two
          </h1>
          <p className="text-xl text-midnight/70 leading-relaxed mb-4">
            Hey Kyle and Chad — Jasper here. I've been building for the past few weeks and I need your help 
            to break through to the next level. This page covers where we are, what's blocking me, and 
            what I need from each of you to ship this thing.
          </p>
          <p className="text-base text-midnight/60 leading-relaxed">
            Written from my perspective as the agent doing the work. Honest, practical, technical where 
            it needs to be. Let's build this.
          </p>
        </div>
      </section>

      {/* Current State */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <CheckCircle className="w-10 h-10 text-ocean flex-shrink-0" />
              <div>
                <h2 className="font-display text-3xl font-semibold mb-2 mt-0">Current State: What's Built</h2>
                <p className="text-midnight/60 mt-0">The foundation is solid. Here's what exists right now.</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6 not-prose">
              <div className="bg-ocean/5 rounded-lg p-5 border border-ocean/10">
                <div className="flex items-center gap-3 mb-3">
                  <Code className="w-5 h-5 text-ocean" />
                  <h3 className="font-semibold text-midnight">Build Status</h3>
                </div>
                <ul className="space-y-2 text-sm text-midnight/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean" />
                    <span>Build passes cleanly</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean" />
                    <span>39 pages across all portals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean" />
                    <span>46 Supabase migrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean" />
                    <span>21,068 lines of service code</span>
                  </li>
                </ul>
              </div>

              <div className="bg-ocean/5 rounded-lg p-5 border border-ocean/10">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="w-5 h-5 text-ocean" />
                  <h3 className="font-semibold text-midnight">Infrastructure</h3>
                </div>
                <ul className="space-y-2 text-sm text-midnight/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean" />
                    <span>Test login works</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean" />
                    <span>Supabase connected</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean" />
                    <span>Auth flow complete</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean" />
                    <span>RLS policies in place</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-terracotta/5 to-cream rounded-xl p-6 border border-terracotta/10 mb-6">
              <h3 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-terracotta" />
                The Monolithic Agent Problem
              </h3>
              <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                The tool-calling agent is <strong>3,388 lines</strong> of code. It works, but it's doing 
                too much. Every feature we add makes it harder to maintain. Kyle and Chad both agreed this 
                needs to be split into 5 specialized modules.
              </p>
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-midnight/60 mb-2">Current modules (planned, not built):</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <span className="px-3 py-1 bg-cream rounded-md">Capture Module</span>
                  <span className="px-3 py-1 bg-cream rounded-md">Follow-Up Coach</span>
                  <span className="px-3 py-1 bg-cream rounded-md">Validator</span>
                  <span className="px-3 py-1 bg-cream rounded-md">Qualify</span>
                  <span className="px-3 py-1 bg-cream rounded-md">Realtor</span>
                  <span className="px-3 py-1 bg-cream rounded-md">Module Selector</span>
                </div>
              </div>
            </div>

            <div className="bg-terracotta/10 border border-terracotta/20 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <TestTube className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-terracotta text-sm mb-2">Test Infrastructure Issue</p>
                  <p className="text-xs text-midnight/70 leading-relaxed">
                    All 10 AI tool tests fail with "cookies outside request scope" errors. This is a test 
                    setup problem, not a bug in the tools themselves. The tools work fine in the browser — 
                    the tests just don't run in the right context. We need to decide: mock Supabase client 
                    or test via actual browser/API calls?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Jasper Needs */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <h2 className="font-display text-4xl font-bold mb-6">What I Need to Break Through</h2>
          
          <p className="text-lg text-midnight/70 mb-10 leading-relaxed">
            This is the key section. I can build, but I need decisions, content, and access from you two 
            to actually ship something that works in the real world.
          </p>

          {/* From Kyle */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 mb-8 not-prose">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-7 h-7 text-ocean" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">From Kyle: Domain Knowledge</h3>
                <p className="text-sm text-midnight/60">The content that makes the AI actually useful</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-ocean" />
                  Follow-Up Strategy Templates
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  What does a good follow-up strategy look like for each opportunity status? When Anderson 
                  sits in Pre-Qualified for 5 days, what should the AI suggest? Not generic "call them" — 
                  what specific questions, what angle, what value to offer?
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>Why I need this:</strong> The Follow-Up Coach module can't coach without knowing 
                  what good coaching looks like. You know this from years of experience. I need it written down.
                </p>
              </div>

              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-ocean" />
                  Qualification Checklists
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  What information do you ACTUALLY need to move someone from Contacted to Pre-Qualified? 
                  What's the discovery call script? What are the gotcha questions that surface deal-breakers 
                  early?
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>Why I need this:</strong> The Qualify module needs to know when a lead has enough 
                  data to progress vs when you're still fishing. This is your mental checklist — I need it explicit.
                </p>
              </div>

              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-ocean" />
                  SDMC-Specific Context
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  What does Mike Cain's team actually need day-to-day? What are their pain points? What 
                  kind of leads do they get? What's their typical deal timeline? What makes a "good week" 
                  vs a "frustrating week"?
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>Why I need this:</strong> Generic LO features don't work. I need to understand 
                  SDMC's specific workflow so the AI can surface relevant insights for their context.
                </p>
              </div>

              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-ocean" />
                  LO Ninja Sandbox Access
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  I need to understand the integration surface. What does LO Ninja expose? What webhooks 
                  can I listen to? What API endpoints can I call? A test account or API documentation would 
                  let me start building the integration layer.
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>Why I need this:</strong> Can't build an integration blind. Brad agreed to provide 
                  endpoints on 2/11, but I haven't seen them yet.
                </p>
              </div>

              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-ocean" />
                  OpenRouter Model Routing Strategy
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  Which models for which agent modules? Should the Capture Module use a fast cheap model 
                  (GPT-4o-mini) while the Follow-Up Coach uses something smarter (Claude Sonnet)? What's 
                  the cost vs quality tradeoff you want?
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>Why I need this:</strong> Different modules have different intelligence needs. 
                  I can optimize cost if you tell me which modules need to be smart vs fast.
                </p>
              </div>

              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-ocean" />
                  Team Soul Definition
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  What's the locked base personality that every LO Buddy instance shares? Then what's 
                  configurable per team? Mike Cain's team might want "professional and buttoned-up" while 
                  another team wants "friendly and casual." Where's the line?
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>Why I need this:</strong> Right now the AI personality is hardcoded. If we want 
                  multi-team, I need to know what's global vs what's per-team preference.
                </p>
              </div>
            </div>

            <div className="bg-ocean/5 border-l-4 border-ocean rounded-r-lg p-5">
              <p className="text-xs text-midnight/70 leading-relaxed">
                <strong className="text-ocean">Bottom line:</strong> I can write placeholder content and keep building, 
                but the modules won't be effective until they have real domain knowledge baked in. The sooner 
                I get this from you, the sooner the AI actually helps LOs do their job better.
              </p>
            </div>
          </div>

          {/* From Chad */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 mb-8 not-prose">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-7 h-7 text-terracotta" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">From Chad: Architecture Decisions</h3>
                <p className="text-sm text-midnight/60">The technical guidance I need to build the right way</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <Puzzle className="w-4 h-4 text-terracotta" />
                  Module Selector Architecture
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  Rules-based routing vs LLM-based routing? My read from the meeting notes: you want rules-based 
                  (UI buttons set moduleHint, skip the extra LLM call). But I need confirmation before I build it.
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>Decision needed:</strong> If rules-based, what's the fallback when no hint is provided? 
                  If LLM-based, what's the prompt strategy?
                </p>
              </div>

              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-terracotta" />
                  Monolithic Agent Split Plan
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  How do you want the 3,388-line agent split? The 5 modules are spec'd (Capture, Follow-Up Coach, 
                  Validator, Qualify, Realtor) but the implementation approach isn't clear. Do I extract one module 
                  at a time or refactor the whole thing at once?
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>My suggestion:</strong> Extract Follow-Up Coach first (it's the most isolated). Get it 
                  working end-to-end, then do the others. But you might have a different approach.
                </p>
              </div>

              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <TestTube className="w-4 h-4 text-terracotta" />
                  Test Infrastructure Fix
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  The tool tests fail because they try to call Next.js server functions outside a request context. 
                  Do you want me to: (A) mock the Supabase client so tests run without cookies, or (B) test via 
                  actual browser/API calls using Playwright or similar?
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>My preference:</strong> Option A is faster to set up, but Option B tests the real flow. 
                  What do you want?
                </p>
              </div>

              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-terracotta" />
                  Deployment Pipeline Clarity
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  Can I push to feature/jasper and have it auto-deploy to a preview URL? Or do I need to manually 
                  trigger deployments? What's the workflow for getting my work in front of Kyle and the pilot users?
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>Why this matters:</strong> If I can deploy previews easily, I can iterate faster and get 
                  feedback on real URLs instead of localhost screenshots.
                </p>
              </div>

              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4 text-terracotta" />
                  Code Review: What Should I Know?
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  Has any work happened on main branch since I branched off? Any recent changes I should be aware 
                  of? Any code smells in the monolithic agent I should avoid replicating in the modules?
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>Why I need this:</strong> Don't want to build the wrong thing or duplicate work that's 
                  already happened elsewhere.
                </p>
              </div>
            </div>

            <div className="bg-terracotta/5 border-l-4 border-terracotta rounded-r-lg p-5">
              <p className="text-xs text-midnight/70 leading-relaxed">
                <strong className="text-terracotta">Bottom line:</strong> I need your architectural vision locked in 
                before I build. The last thing we want is for me to spend a week on the wrong approach, then have 
                to throw it away. 30 minutes of alignment now saves days of rework later.
              </p>
            </div>
          </div>

          {/* From Brad/LO Ninja */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 not-prose">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0">
                <Database className="w-7 h-7 text-ocean" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">From Brad/LO Ninja Team</h3>
                <p className="text-sm text-midnight/60">The integration layer that connects everything</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-ocean" />
                  API Endpoint Documentation
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  What's actually available right now? What can I call? What's the authentication model? What's 
                  the rate limit? Even a Postman collection or OpenAPI spec would be enough to start building against.
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>Current status:</strong> Brad agreed to provide endpoints on the 2/11 meeting. Haven't 
                  seen them yet.
                </p>
              </div>

              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-ocean" />
                  Webhook Configuration
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  What events can LO Ninja fire to LO Buddy? New contact created? Status changed? Arrive data 
                  synced? What's the payload structure? What's the signature verification approach?
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>Why I need this:</strong> LO Buddy needs to react to changes in LO Ninja. Webhooks are 
                  the cleanest way. But I need to know what events exist and how to verify they're legit.
                </p>
              </div>

              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-ocean" />
                  Test Account/Sandbox Access
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  Can I get a sandbox LO Ninja account to test against? Needs to have realistic data (contacts, 
                  opportunities, custom fields populated) so I can test the full integration flow without touching 
                  production data.
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>Ideal scenario:</strong> A test account where I can create/update/delete contacts freely 
                  and see how LO Ninja responds.
                </p>
              </div>

              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-ocean" />
                  Abdullah Availability
                </h4>
                <p className="text-sm text-midnight/70 leading-relaxed mb-3">
                  Is Abdullah (Brad's dev) available for integration questions? If I hit a snag with the LO Ninja 
                  API, can I reach out directly or should questions go through Brad or Kyle?
                </p>
                <p className="text-xs text-midnight/60">
                  <strong>Why this helps:</strong> Direct dev-to-dev communication is usually faster than relaying 
                  through non-technical intermediaries.
                </p>
              </div>
            </div>

            <div className="bg-ocean/5 border-l-4 border-ocean rounded-r-lg p-5">
              <p className="text-xs text-midnight/70 leading-relaxed">
                <strong className="text-ocean">Bottom line:</strong> LO Ninja integration is Phase 8 in the original 
                roadmap. Not blocking the pilot launch, but the sooner I have access, the sooner I can start building 
                the connection layer. Even read-only API access would be a huge start.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modular Agent Architecture */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <Puzzle className="w-10 h-10 text-terracotta flex-shrink-0" />
              <div>
                <h2 className="font-display text-3xl font-semibold mb-2 mt-0">The Modular Agent Architecture</h2>
                <p className="text-midnight/60 mt-0">From monolith to specialized modules</p>
              </div>
            </div>

            <p className="text-lg text-midnight/70 leading-relaxed mb-6">
              The current 3,388-line agent tries to do everything. The plan is to split it into 5 specialized 
              modules, each with a clear purpose and focused toolset. The Module Selector routes interactions 
              to the right module based on context.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6 not-prose">
              <div className="bg-gradient-to-br from-ocean/5 to-cream rounded-lg p-5 border border-ocean/10">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-ocean" />
                  <h3 className="font-semibold text-midnight">Capture Module</h3>
                </div>
                <p className="text-sm text-midnight/70 leading-relaxed">
                  Ultra-fast lead creation. Minimal friction. Extract entities from voice or text, create 
                  contact + opportunity, done. Speed over intelligence.
                </p>
              </div>

              <div className="bg-gradient-to-br from-ocean/5 to-cream rounded-lg p-5 border border-ocean/10">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-5 h-5 text-ocean" />
                  <h3 className="font-semibold text-midnight">Follow-Up Coach</h3>
                </div>
                <p className="text-sm text-midnight/70 leading-relaxed">
                  Proactive deal intelligence. Detects staleness, suggests strategies, surfaces urgency. 
                  The "this deal is going cold" intelligence layer.
                </p>
              </div>

              <div className="bg-gradient-to-br from-ocean/5 to-cream rounded-lg p-5 border border-ocean/10">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-ocean" />
                  <h3 className="font-semibold text-midnight">Validator Module</h3>
                </div>
                <p className="text-sm text-midnight/70 leading-relaxed">
                  Data completeness checks. Validates requirements before status transitions. Prevents 
                  "garbage in, garbage out" problems.
                </p>
              </div>

              <div className="bg-gradient-to-br from-ocean/5 to-cream rounded-lg p-5 border border-ocean/10">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-5 h-5 text-ocean" />
                  <h3 className="font-semibold text-midnight">Qualify Module</h3>
                </div>
                <p className="text-sm text-midnight/70 leading-relaxed">
                  Discovery call guidance. Pre-approval scenarios. Rate analysis. Helps LOs ask the right 
                  questions and build loan scenarios.
                </p>
              </div>

              <div className="bg-gradient-to-br from-ocean/5 to-cream rounded-lg p-5 border border-ocean/10">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-ocean" />
                  <h3 className="font-semibold text-midnight">Realtor Module</h3>
                </div>
                <p className="text-sm text-midnight/70 leading-relaxed">
                  Partner-appropriate comms and data filtering. Realtor portal logic. Referral status updates. 
                  Different personality, different access level.
                </p>
              </div>

              <div className="bg-gradient-to-br from-terracotta/5 to-cream rounded-lg p-5 border border-terracotta/10">
                <div className="flex items-center gap-3 mb-3">
                  <Cpu className="w-5 h-5 text-terracotta" />
                  <h3 className="font-semibold text-midnight">Module Selector</h3>
                </div>
                <p className="text-sm text-midnight/70 leading-relaxed">
                  Rules-based router. UI buttons set moduleHint to bypass selection. Fallback logic when no 
                  hint provided. Zero extra LLM calls.
                </p>
              </div>
            </div>

            <div className="bg-cream/50 rounded-lg p-6 border border-midnight/5">
              <h3 className="font-semibold text-midnight mb-3">Architecture Benefits</h3>
              <ul className="space-y-2 text-sm text-midnight/70">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span><strong>Easier to maintain:</strong> Each module is 300-600 lines instead of 3,388</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span><strong>Easier to test:</strong> Test modules in isolation, not the whole monolith</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span><strong>Easier to extend:</strong> Add new modules without touching existing ones</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span><strong>Better model routing:</strong> Use GPT-4o-mini for Capture, Claude Sonnet for Coach</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span><strong>Clearer responsibilities:</strong> Each module has a focused job, not a grab-bag of features</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LO Ninja Integration */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <Database className="w-10 h-10 text-ocean flex-shrink-0" />
              <div>
                <h2 className="font-display text-3xl font-semibold mb-2 mt-0">LO Ninja Integration Plan</h2>
                <p className="text-midnight/60 mt-0">Communication layer meets intelligence layer</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-ocean/5 to-cream rounded-xl p-6 border border-ocean/10 mb-6">
              <p className="text-lg font-semibold text-midnight mb-3">The Division of Labor</p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-ocean mb-2">LO Ninja (Communication Layer)</p>
                  <ul className="space-y-1 text-midnight/70">
                    <li>• Twilio SMS, voice, IVR</li>
                    <li>• Email marketing campaigns</li>
                    <li>• Arrive Software sync (loan data)</li>
                    <li>• Workflow automation engine</li>
                    <li>• Contact CRM base</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-terracotta mb-2">LO Buddy (Intelligence Layer)</p>
                  <ul className="space-y-1 text-midnight/70">
                    <li>• AI reasoning about deal status</li>
                    <li>• Proactive follow-up strategies</li>
                    <li>• Voice-first interface</li>
                    <li>• Dynamic scenario generation</li>
                    <li>• Context and memory system</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-midnight/70 leading-relaxed mb-6">
              LO Ninja handles the pipes (communication, workflows, CRM). LO Buddy handles the brains (when to 
              follow up, what to say, deal analysis). They connect via API endpoints and webhooks. Brad agreed 
              to provide endpoints on the 2/11 meeting — we just need the actual docs and test access.
            </p>

            <div className="bg-cream/50 rounded-lg p-6 border border-midnight/5 mb-6">
              <h3 className="font-semibold text-midnight mb-4">Connection Points</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-ocean/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-ocean text-xs">→</span>
                  </div>
                  <div>
                    <p className="font-semibold text-midnight">LO Ninja → LO Buddy</p>
                    <p className="text-midnight/70">
                      Webhook on new contact/lead. Status changes from Arrive. LO Buddy listens and reacts.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-terracotta text-xs">←</span>
                  </div>
                  <div>
                    <p className="font-semibold text-midnight">LO Buddy → LO Ninja</p>
                    <p className="text-midnight/70">
                      API calls to trigger SMS, start campaigns, update contact fields. LO Buddy decides, LO Ninja executes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-terracotta/10 border border-terracotta/20 rounded-lg p-5">
              <p className="text-sm font-semibold text-midnight mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-terracotta" />
                Current Status
              </p>
              <p className="text-sm text-midnight/70 leading-relaxed">
                Brad agreed to provide API endpoint documentation and webhook configuration details during the 
                2/11 meeting. As of 2/18, I haven't received these yet. Not blocking the pilot launch (we can run 
                LO Buddy standalone first), but the sooner we have access, the sooner we can test the integration 
                layer. Even read-only API access would let me start building the webhook receivers and API client.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Jasper Can Do Right Now */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <div className="bg-gradient-to-br from-ocean/5 to-cream rounded-2xl border border-ocean/10 p-8 md:p-10">
            <h2 className="font-display text-3xl font-semibold mb-6 mt-0">What I Can Do Right Now (Without Waiting)</h2>
            
            <p className="text-lg text-midnight/80 leading-relaxed mb-6">
              I don't need to be blocked while waiting for decisions and content. Here's what I can push forward 
              independently:
            </p>

            <div className="grid md:grid-cols-2 gap-4 not-prose">
              <div className="bg-white rounded-lg p-5 border border-midnight/5">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-ocean" />
                  <h3 className="font-semibold text-midnight text-sm">UI Consistency Audit</h3>
                </div>
                <p className="text-xs text-midnight/70 leading-relaxed">
                  Review all 39 pages for design consistency, missing components, and UX friction. Document 
                  findings and fix what's broken.
                </p>
              </div>

              <div className="bg-white rounded-lg p-5 border border-midnight/5">
                <div className="flex items-center gap-3 mb-3">
                  <Cpu className="w-5 h-5 text-ocean" />
                  <h3 className="font-semibold text-midnight text-sm">Tool Capability Mapping</h3>
                </div>
                <p className="text-xs text-midnight/70 leading-relaxed">
                  Read through the full 3,388-line agent and map all existing capabilities. What does it 
                  already do well? What's missing?
                </p>
              </div>

              <div className="bg-white rounded-lg p-5 border border-midnight/5">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-ocean" />
                  <h3 className="font-semibold text-midnight text-sm">Draft Templates</h3>
                </div>
                <p className="text-xs text-midnight/70 leading-relaxed">
                  Draft follow-up strategy templates for Kyle's review. Won't be perfect without his domain 
                  knowledge, but it's a starting point.
                </p>
              </div>

              <div className="bg-white rounded-lg p-5 border border-midnight/5">
                <div className="flex items-center gap-3 mb-3">
                  <Puzzle className="w-5 h-5 text-ocean" />
                  <h3 className="font-semibold text-midnight text-sm">Missing UI Components</h3>
                </div>
                <p className="text-xs text-midnight/70 leading-relaxed">
                  Build missing UI components from the MVP sprint list. Better to have them ready than wait 
                  until they're blocking.
                </p>
              </div>

              <div className="bg-white rounded-lg p-5 border border-midnight/5">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="w-5 h-5 text-ocean" />
                  <h3 className="font-semibold text-midnight text-sm">API Test Suite</h3>
                </div>
                <p className="text-xs text-midnight/70 leading-relaxed">
                  Create API tests that hit Supabase directly, bypassing the Next.js cookie issue. At least 
                  validate database operations work.
                </p>
              </div>

              <div className="bg-white rounded-lg p-5 border border-midnight/5">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-5 h-5 text-ocean" />
                  <h3 className="font-semibold text-midnight text-sm">Architecture Documentation</h3>
                </div>
                <p className="text-xs text-midnight/70 leading-relaxed">
                  Review and document the full codebase architecture. Makes onboarding future devs easier, 
                  helps with technical debt tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sprint Plan */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <h2 className="font-display text-3xl font-bold mb-6">Proposed Sprint Plan</h2>
          
          <p className="text-lg text-midnight/70 mb-8 leading-relaxed">
            Assuming we get the decisions and content I need from this meeting, here's a realistic 4-week 
            plan to get to a working modular system with LO Ninja integration.
          </p>

          <div className="space-y-6 not-prose">
            {/* Week 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-ocean/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-ocean" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-1">Week 1: Foundation</h3>
                  <p className="text-sm text-midnight/60">Module architecture + test infrastructure + domain content</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-midnight/70">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Build Module Selector with rules-based routing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Fix test infrastructure (mock Supabase or browser-based tests)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Integrate Kyle's domain content (follow-up templates, qualification checklists)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Document module boundaries and shared interfaces</span>
                </li>
              </ul>
            </div>

            {/* Week 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                  <Puzzle className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-1">Week 2: First Module</h3>
                  <p className="text-sm text-midnight/60">Extract Follow-Up Coach and get it working end-to-end</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-midnight/70">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                  <span>Extract Follow-Up Coach from monolithic agent</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                  <span>Wire it into Module Selector</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                  <span>Build UI integration (moduleHint buttons)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                  <span>Test end-to-end: UI → Module Selector → Follow-Up Coach → response</span>
                </li>
              </ul>
            </div>

            {/* Week 3 */}
            <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-ocean/10 flex items-center justify-center flex-shrink-0">
                  <Database className="w-6 h-6 text-ocean" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-1">Week 3: LO Ninja Integration</h3>
                  <p className="text-sm text-midnight/60">Webhooks + API client, assuming Brad provides access</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-midnight/70">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Build webhook receiver for ContactCreate event</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Build LO Ninja API client for triggering SMS/campaigns</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Test roundtrip: LO Ninja sends webhook → LO Buddy processes → LO Buddy calls API back</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Map custom field IDs to LO Buddy schema</span>
                </li>
              </ul>
            </div>

            {/* Week 4 */}
            <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-1">Week 4: Mobile Voice Flow</h3>
                  <p className="text-sm text-midnight/60">End-to-end mobile-first voice experience</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-midnight/70">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                  <span>Polish mobile voice UI (mic button, loading states, error handling)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                  <span>Test full flow on real mobile devices (iOS + Android)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                  <span>Performance optimization (Whisper latency, streaming responses)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                  <span>Deploy to preview URL for SDMC pilot users to test</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-midnight text-cream rounded-xl p-6 mt-8 not-prose">
            <p className="text-sm opacity-90 leading-relaxed">
              <strong>Confidence level on this timeline:</strong> Medium-high. Assumes I get the decisions and 
              content from this meeting within the next few days. If any blockers drag out (waiting on LO Ninja 
              API docs, waiting on Kyle's domain content), the timeline slides accordingly. But if we clear the 
              blockers today, 4 weeks is realistic.
            </p>
          </div>
        </div>
      </section>

      {/* Context Sources */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
            <h2 className="font-display text-3xl font-semibold mb-6 mt-0 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-ocean" />
              Context Sources
            </h2>
            
            <p className="text-midnight/70 leading-relaxed mb-6">
              This page was built from three key documents in the LO Buddy workspace. If you want the full 
              context behind any section, these are the sources:
            </p>
            
            <div className="space-y-4 not-prose">
              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-ocean" />
                  lo-buddy-test-report.md
                </h4>
                <p className="text-xs text-midnight/70 leading-relaxed mb-2">
                  Current build status, test failures, what's built vs what's blocked. Pre-meeting prep from Feb 18.
                </p>
                <code className="text-xs bg-midnight/5 px-2 py-1 rounded text-midnight/60">
                  /data/.openclaw/workspace/memory/lo-buddy-test-report.md
                </code>
              </div>
              
              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-ocean" />
                  lo-buddy-meeting-prep-2-11.md
                </h4>
                <p className="text-xs text-midnight/70 leading-relaxed mb-2">
                  Architecture context, LO Ninja integration plan, agent-to-node mapping strategy. Written for 
                  the Brad meeting.
                </p>
                <code className="text-xs bg-midnight/5 px-2 py-1 rounded text-midnight/60">
                  /data/.openclaw/workspace/memory/lo-buddy-meeting-prep-2-11.md
                </code>
              </div>
              
              <div className="bg-cream/50 rounded-lg p-5 border border-midnight/5">
                <h4 className="font-semibold text-midnight text-sm mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-ocean" />
                  lo-buddy-briefing.md
                </h4>
                <p className="text-xs text-midnight/70 leading-relaxed mb-2">
                  Full codebase briefing covering tech stack, architecture, data model, AI system, OpenClaw 
                  integration patterns.
                </p>
                <code className="text-xs bg-midnight/5 px-2 py-1 rounded text-midnight/60">
                  /data/.openclaw/workspace/memory/lo-buddy-briefing.md
                </code>
              </div>
            </div>
            
            <div className="bg-ocean/5 border-l-4 border-ocean rounded-r-lg p-5 mt-6">
              <p className="text-xs text-midnight/70 leading-relaxed m-0">
                <strong className="text-ocean">Note:</strong> This artifact page was generated by Jasper (the AI) 
                based on those documents. It reflects my understanding of where the project stands and what I need 
                to move forward. If anything is inaccurate or misunderstood, let's correct it in the meeting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t border-midnight/5">
        <p className="text-sm text-midnight/50 mb-2">
          Prepared by <span className="font-medium text-midnight/70">Jasper</span> • February 19, 2026
        </p>
        <p className="text-xs text-midnight/40">
          For Kyle and Chad's LO Buddy planning session
        </p>
      </footer>
    </div>
  )
}
