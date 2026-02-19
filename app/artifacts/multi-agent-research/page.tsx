import { FileText, GitBranch, Settings, Zap, TrendingUp, AlertTriangle, CheckCircle, ExternalLink, Info, ArrowRight, Code, Database, Network, Shield } from 'lucide-react'

export default function MultiAgentResearch() {
  return (
    <div className="min-h-screen bg-cream text-midnight">
      {/* Hero Section */}
      <section className="py-16 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 text-ocean text-sm font-medium mb-6 px-4 py-2 rounded-full border border-ocean/20 bg-ocean/5">
            <FileText className="w-4 h-4" />
            Technical Research Report
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Multi-Agent AI Systems:<br />Production Reality Check
          </h1>
          <p className="text-xl text-midnight/70 leading-relaxed mb-4">
            What's actually working in 2026, how to configure OpenClaw properly, and where the hype diverges from production reality
          </p>
          <p className="text-base text-midnight/60 leading-relaxed">
            Research compiled from production systems (Anthropic, Praetorian), framework comparisons, Reddit/community discussions, and OpenClaw GitHub issues. Focused on practical patterns for personal assistant setups with specialist agents.
          </p>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-ocean/5 to-terracotta/5 rounded-2xl border border-ocean/10 p-8 md:p-10">
          <h2 className="font-display text-3xl font-bold mb-6 mt-0">Executive Summary</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-midnight/5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-ocean" />
                <h3 className="font-semibold text-midnight">What's Working</h3>
              </div>
              <ul className="space-y-2 text-sm text-midnight/70">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Simple 2-3 agent setups with human checkpoints</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Orchestrator-worker pattern with explicit contracts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Parallel execution for independent tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Artifact-based state sharing (filesystem, not context)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-midnight/5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-terracotta" />
                <h3 className="font-semibold text-midnight">What's Failing</h3>
              </div>
              <ul className="space-y-2 text-sm text-midnight/70">
                <li className="flex items-start gap-2">
                  <span className="text-terracotta text-xl leading-none">•</span>
                  <span>Complex 10+ agent orchestrations (40% failure rate)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta text-xl leading-none">•</span>
                  <span>Conversational debate patterns (token costs spiral)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta text-xl leading-none">•</span>
                  <span>Fully autonomous swarms (66% test, 11% deploy)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta text-xl leading-none">•</span>
                  <span>No error boundaries or state management</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-midnight text-cream rounded-xl p-6">
            <p className="font-semibold mb-3 text-lg">Key Finding: Token Usage Explains 80% of Performance Variance</p>
            <p className="text-sm opacity-90 leading-relaxed">
              Architecture matters more than model selection. A well-designed orchestrator with Sonnet 4 workers 
              outperforms a single Opus 4 agent by <strong>90.2%</strong> on complex research tasks (Anthropic, 2026). 
              The difference isn't intelligence—it's context management and parallel execution.
            </p>
          </div>
        </div>
      </section>

      {/* Core Patterns */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <h2 className="font-display text-4xl font-bold mb-8">Orchestration Patterns That Work</h2>
        
        <div className="space-y-6">
          {/* Orchestrator-Worker */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0">
                <Network className="w-6 h-6 text-ocean" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-2xl font-semibold mb-2">Orchestrator-Worker Pattern</h3>
                <div className="flex items-center gap-3 text-sm text-midnight/60">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-ocean/10 text-ocean font-medium">
                    Most Common
                  </span>
                  <span>Used by Anthropic Research, most production systems</span>
                </div>
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none mb-6">
              <p className="text-midnight/80 leading-relaxed">
                Lead agent coordinates, specialized subagents execute in parallel with isolated context windows. 
                Subagents write outputs to filesystem, passing lightweight references back—not full outputs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-midnight mb-2">Advantages</h4>
                <ul className="space-y-1 text-sm text-midnight/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Clear responsibility boundaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Parallel execution scales token capacity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Failure isolation per worker</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-midnight mb-2">Token Cost</h4>
                <div className="bg-cream/50 rounded-lg p-4">
                  <p className="text-xs text-midnight/60 mb-2">Relative to single agent:</p>
                  <p className="font-mono text-2xl font-bold text-ocean">~15×</p>
                  <p className="text-xs text-midnight/60 mt-1">For complex multi-step tasks</p>
                </div>
              </div>
            </div>
            
            <div className="bg-ocean/5 border-l-4 border-ocean rounded-r-lg p-4">
              <p className="text-xs text-midnight/70 leading-relaxed">
                <strong className="text-ocean">Implementation note:</strong> Use artifact systems where subagents 
                store work externally (files, database). Orchestrator receives status updates and refs, not megabytes 
                of raw data. This prevents context pollution and allows scale beyond single-agent token limits.
              </p>
            </div>
          </div>

          {/* Supervisor Pattern */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-6 h-6 text-terracotta" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-2xl font-semibold mb-2">Supervisor Pattern</h3>
                <div className="flex items-center gap-3 text-sm text-midnight/60">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-terracotta/10 text-terracotta font-medium">
                    Production-Ready
                  </span>
                  <span>Best for customer service, incident response</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-midnight/80 leading-relaxed mb-4">
              Central supervisor routes to specialist agents based on task type using deterministic criteria. 
              More token-efficient than conversational patterns (no back-and-forth overhead).
            </p>
            
            <div className="bg-cream/50 rounded-lg p-4">
              <p className="text-xs font-semibold text-midnight mb-2">Example routing logic:</p>
              <pre className="text-xs text-midnight/70 font-mono leading-relaxed">
{`classify_intent(query) → route:
  • "code_question" → coding_agent
  • "mortgage_calc" → mortgage_agent  
  • "schedule_meeting" → calendar_agent
  • else → main_agent`}
              </pre>
            </div>
          </div>

          {/* Pipeline Pattern */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-6 h-6 text-ocean" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-2xl font-semibold mb-2">Pipeline Pattern</h3>
                <div className="flex items-center gap-3 text-sm text-midnight/60">
                  <span>Sequential chain: researcher → writer → editor → publisher</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-midnight/80 leading-relaxed mb-4">
              Simple to understand, deterministic flow. Good for content workflows where each stage has clear inputs/outputs. 
              Limitation: No parallelism, linear bottleneck.
            </p>
          </div>

          {/* Debate Pattern */}
          <div className="bg-terracotta/5 rounded-2xl border border-terracotta/20 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-terracotta" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-2xl font-semibold mb-2">Debate/Consensus Pattern</h3>
                <div className="flex items-center gap-3 text-sm text-midnight/60">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-terracotta/20 text-terracotta font-medium">
                    Experimental
                  </span>
                  <span>Not production-ready</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-midnight/70 leading-relaxed mb-4">
              Multiple agents argue/discuss until reaching solution. <strong>Status: Research toy.</strong> Token costs 
              spiral (~8,000+ per simple task), unpredictable outcomes, difficult debugging. Only use for tasks where 
              iterative refinement genuinely improves quality—and even then, prefer deterministic patterns.
            </p>
          </div>
        </div>
      </section>

      {/* OpenClaw Configuration */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <h2 className="font-display text-4xl font-bold mb-8">OpenClaw Multi-Agent Setup</h2>
        
        <div className="bg-midnight text-cream rounded-2xl p-8 md:p-10 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Settings className="w-8 h-8 text-terracotta flex-shrink-0" />
            <div>
              <h3 className="font-display text-2xl font-semibold mb-2">Core Architecture</h3>
              <p className="text-sm opacity-75">Understanding the routing model</p>
            </div>
          </div>
          
          <div className="space-y-4 text-sm opacity-90 leading-relaxed">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold mb-2">Key Concepts:</p>
              <ul className="space-y-2">
                <li><strong className="text-terracotta">agentId:</strong> One "brain" (workspace, auth, session store)</li>
                <li><strong className="text-terracotta">accountId:</strong> One channel account instance (e.g., Telegram bot #1 vs bot #2)</li>
                <li><strong className="text-terracotta">binding:</strong> Routes inbound messages to agentId by (channel, accountId, peer)</li>
                <li><strong className="text-terracotta">session:</strong> Direct chats collapse to <code className="bg-black/30 px-1 rounded">agent:&lt;agentId&gt;:main</code></li>
              </ul>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <p className="font-semibold mb-2">Routing Priority (most-specific wins):</p>
              <ol className="space-y-1 text-xs list-decimal list-inside ml-2">
                <li><code>peer</code> match (exact DM/group/channel ID)</li>
                <li><code>parentPeer</code> match (thread inheritance)</li>
                <li><code>guildId + roles</code> (Discord role routing)</li>
                <li><code>guildId</code> or <code>teamId</code></li>
                <li><code>accountId</code> match for a channel</li>
                <li>Channel-level match (<code>accountId: "*"</code>)</li>
                <li>Fallback to default agent</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Config Examples */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8">
            <h3 className="font-display text-xl font-semibold mb-4">Single Agent + Subagent Spawning (Recommended Start)</h3>
            
            <p className="text-sm text-midnight/70 leading-relaxed mb-4">
              Main agent handles all user interaction, spawns ephemeral specialists as needed. Simplest to maintain, 
              shared context through MEMORY.md, dynamic specialization.
            </p>
            
            <div className="bg-cream rounded-lg p-4 mb-4">
              <p className="text-xs font-semibold text-midnight mb-2">openclaw.json:</p>
              <pre className="text-xs font-mono text-midnight/70 overflow-x-auto">
{`{
  "agents": {
    "list": [
      { "id": "main", "workspace": "~/.openclaw/workspace" }
    ]
  },
  "channels": {
    "telegram": { "dmPolicy": "pairing" }
  }
}`}
              </pre>
            </div>
            
            <div className="bg-ocean/5 border-l-4 border-ocean rounded-r-lg p-4">
              <p className="text-xs text-midnight/70 leading-relaxed">
                <strong className="text-ocean">Best for:</strong> Personal assistant setups where you want one conversational 
                agent that can delegate to specialists. Main agent spawns coding/mortgage/music subagents when needed, 
                results bubble back for synthesis. No routing complexity.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8">
            <h3 className="font-display text-xl font-semibold mb-4">Multi-Agent with Separate Telegram Bots</h3>
            
            <p className="text-sm text-midnight/70 leading-relaxed mb-4">
              Each agent has its own Telegram bot. User chooses which bot to message. True isolation, 
              separate conversation histories, but requires managing shared context.
            </p>
            
            <div className="bg-cream rounded-lg p-4 mb-4">
              <p className="text-xs font-semibold text-midnight mb-2">openclaw.json:</p>
              <pre className="text-xs font-mono text-midnight/70 overflow-x-auto">
{`{
  "agents": {
    "list": [
      { "id": "main", "workspace": "~/.openclaw/workspace-main" },
      { "id": "coding", "workspace": "~/.openclaw/workspace-coding" },
      { "id": "mortgage", "workspace": "~/.openclaw/workspace-mortgage" }
    ]
  },
  "bindings": [
    { "agentId": "main", "match": { "channel": "telegram", "accountId": "default" } },
    { "agentId": "coding", "match": { "channel": "telegram", "accountId": "coding" } },
    { "agentId": "mortgage", "match": { "channel": "telegram", "accountId": "mortgage" } }
  ],
  "channels": {
    "telegram": {
      "accounts": {
        "default": { "botToken": "..." },
        "coding": { "botToken": "..." },
        "mortgage": { "botToken": "..." }
      }
    }
  }
}`}
              </pre>
            </div>
            
            <div className="bg-terracotta/5 border-l-4 border-terracotta rounded-r-lg p-4">
              <p className="text-xs text-midnight/70 leading-relaxed">
                <strong className="text-terracotta">Challenge:</strong> No shared context by default. Each agent has isolated memory. 
                Solutions: shared filesystem (same workspace), Memory as a Service API, or lead agent synthesis pattern 
                (main agent periodically reads specialist outputs and updates shared MEMORY.md).
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8">
            <h3 className="font-display text-xl font-semibold mb-4">Per-Agent Tool Control & Sandboxing</h3>
            
            <p className="text-sm text-midnight/70 leading-relaxed mb-4">
              OpenClaw v2026.1.6+ supports per-agent tool permissions and sandboxing. Critical for security and preventing 
              specialist agents from accessing tools they shouldn't.
            </p>
            
            <div className="bg-cream rounded-lg p-4">
              <pre className="text-xs font-mono text-midnight/70 overflow-x-auto">
{`{
  "agents": {
    "list": [
      {
        "id": "coding",
        "workspace": "~/.openclaw/workspace-coding",
        "sandbox": {
          "mode": "all",
          "scope": "agent",
          "docker": {
            "setupCommand": "apt-get update && apt-get install -y git python3"
          }
        },
        "tools": {
          "allow": ["read", "write", "exec"],
          "deny": ["browser", "message", "nodes"]
        }
      }
    ]
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-gradient-to-br from-terracotta/5 to-cream rounded-2xl border border-terracotta/20 p-8 mt-8">
          <h3 className="font-display text-2xl font-semibold mb-6">Common Issues & Solutions</h3>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-5 border border-midnight/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-midnight text-sm mb-1">Session path resolution errors (Issue #15246)</p>
                  <p className="text-xs text-midnight/70 mb-2">
                    Non-default agents fail silently due to session file path bugs.
                  </p>
                  <p className="text-xs text-ocean font-medium">
                    Solution: Verify <code className="bg-cream px-1 rounded">agentDir</code> paths are unique per agent
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 border border-midnight/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-midnight text-sm mb-1">Context overflow (Issue #4561)</p>
                  <p className="text-xs text-midnight/70 mb-2">
                    Token growth from bootstrap files + tool outputs + history causes crashes.
                  </p>
                  <p className="text-xs text-ocean font-medium">
                    Solutions: Keep AGENTS.md/SOUL.md under 2KB each, use session compaction, implement just-in-time context loading
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 border border-midnight/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-midnight text-sm mb-1">Agent boundary bleeding (Issue #4385)</p>
                  <p className="text-xs text-midnight/70 mb-2">
                    <code className="bg-cream px-1 rounded">/new</code> on non-default agent resets default agent's session.
                  </p>
                  <p className="text-xs text-ocean font-medium">
                    Solution: Use separate <code className="bg-cream px-1 rounded">agentDir</code> for each agent, never reuse
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-ocean text-cream rounded-2xl p-8 mt-8">
          <h3 className="font-display text-2xl font-semibold mb-6">OpenClaw Best Practices (Community-Validated)</h3>
          
          <div className="space-y-4 text-sm opacity-90">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Agent Topology: Start with router + 2-3 specialists maximum</p>
                <p className="text-xs opacity-75">More than 4 agents = exponential coordination complexity</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Bootstrap Files: Keep AGENTS.md/SOUL.md/TOOLS.md under 5KB total</p>
                <p className="text-xs opacity-75">Every byte counts against context window</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Memory Strategy: Write to memory/YYYY-MM-DD.md during execution</p>
                <p className="text-xs opacity-75">Don't rely on chat history for knowledge transfer—it gets pruned</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Artifacts: Turn chat into durable files (DECISIONS.md, ARCH.md, RUNBOOK.md)</p>
                <p className="text-xs opacity-75">Specialists write results to files, pass refs to coordinator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Comparison */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <h2 className="font-display text-4xl font-bold mb-8">Framework Comparison</h2>
        
        <div className="space-y-6">
          {/* LangGraph */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">LangGraph</h3>
                <p className="text-sm text-midnight/60">Explicit graph-based control flow</p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-ocean/10 text-ocean text-xs font-semibold">
                Production-Ready
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-midnight mb-3">Strengths</h4>
                <ul className="space-y-2 text-sm text-midnight/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Native checkpointing and state persistence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Visual debugging (render graph as diagram)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Excellent observability with LangSmith</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Token efficiency (~2,000 tokens simple task)</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-midnight mb-3">Weaknesses</h4>
                <ul className="space-y-2 text-sm text-midnight/70">
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta text-lg leading-none">•</span>
                    <span>Steep learning curve (graph-based thinking)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta text-lg leading-none">•</span>
                    <span>High setup complexity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta text-lg leading-none">•</span>
                    <span>Overkill for simple workflows</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-ocean/5 rounded-lg p-4">
              <p className="text-xs font-semibold text-midnight mb-2">When to Choose:</p>
              <p className="text-xs text-midnight/70 leading-relaxed">
                Mission-critical systems requiring auditability/compliance, complex conditional logic, fine-grained 
                control over every step. Already using LangChain ecosystem.
              </p>
            </div>
          </div>

          {/* CrewAI */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">CrewAI</h3>
                <p className="text-sm text-midnight/60">Role-based team collaboration</p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-ocean/10 text-ocean text-xs font-semibold">
                Production-Ready
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-midnight mb-3">Strengths</h4>
                <ul className="space-y-2 text-sm text-midnight/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Lowest learning curve</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Intuitive role/task metaphor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Built-in memory and learning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>40% faster time-to-production vs LangGraph</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-midnight mb-3">Weaknesses</h4>
                <ul className="space-y-2 text-sm text-midnight/70">
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta text-lg leading-none">•</span>
                    <span>Less control over execution flow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta text-lg leading-none">•</span>
                    <span>Higher token usage (~3,500 tokens)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta text-lg leading-none">•</span>
                    <span>Limited for complex conditional logic</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-terracotta/5 rounded-lg p-4">
              <p className="text-xs font-semibold text-midnight mb-2">When to Choose:</p>
              <p className="text-xs text-midnight/70 leading-relaxed">
                Rapid prototyping priority, workflow maps to human team roles, non-engineers need to understand system. 
                Content creation and business automation workflows.
              </p>
            </div>
          </div>

          {/* AutoGen */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">AutoGen / Microsoft Agent Framework</h3>
                <p className="text-sm text-midnight/60">Conversational collaboration</p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold">
                Preview (GA Q1'26)
              </span>
            </div>
            
            <div className="bg-cream/50 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-midnight mb-2">Status Update:</p>
              <p className="text-xs text-midnight/70 leading-relaxed">
                AutoGen (research-oriented) is being merged with Semantic Kernel into <strong>Microsoft Agent Framework</strong>. 
                Preview available now, GA expected end of Q1 2026. Targets enterprise with session-based state management, 
                type safety, middleware, telemetry, and graph-based workflows.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-midnight mb-3">Strengths</h4>
                <ul className="space-y-2 text-sm text-midnight/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Code execution capabilities (sandboxed)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Natural human-AI collaboration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                    <span>Agent Framework adds enterprise features</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-midnight mb-3">Weaknesses</h4>
                <ul className="space-y-2 text-sm text-midnight/70">
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta text-lg leading-none">•</span>
                    <span>Token costs spiral (~8,000 tokens)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta text-lg leading-none">•</span>
                    <span>Less deterministic/predictable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta text-lg leading-none">•</span>
                    <span>AutoGen alone: not production-ready</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-ocean/5 rounded-lg p-4">
              <p className="text-xs font-semibold text-midnight mb-2">When to Choose:</p>
              <p className="text-xs text-midnight/70 leading-relaxed">
                Tasks benefit from iterative refinement, code generation/execution needed, human collaboration central. 
                Worth watching Agent Framework GA release—could become strong enterprise option.
              </p>
            </div>
          </div>

          {/* Swarm */}
          <div className="bg-terracotta/5 rounded-2xl border border-terracotta/20 p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">OpenAI Swarm</h3>
                <p className="text-sm text-midnight/60">Lightweight handoffs between agents</p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-terracotta/20 text-terracotta text-xs font-semibold">
                Experimental Only
              </span>
            </div>
            
            <div className="bg-white rounded-lg p-5 border border-terracotta/20 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-midnight mb-2">Official Stance:</p>
                  <p className="text-xs text-midnight/70 leading-relaxed">
                    "Not an official OpenAI product... not meant for production use." Great for learning agent concepts 
                    and educational purposes, but lacks state management, persistence, observability, and enterprise features.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-midnight/70 leading-relaxed">
              <strong>Verdict:</strong> Use for learning only, not real applications.
            </p>
          </div>
        </div>

        {/* Comparison Matrix */}
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 overflow-hidden mt-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-midnight text-cream">
                <tr>
                  <th className="px-6 py-4 text-left font-display font-semibold">Dimension</th>
                  <th className="px-6 py-4 text-center font-display font-semibold">LangGraph</th>
                  <th className="px-6 py-4 text-center font-display font-semibold">CrewAI</th>
                  <th className="px-6 py-4 text-center font-display font-semibold">AutoGen/Fwk</th>
                  <th className="px-6 py-4 text-center font-display font-semibold">Swarm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight/5">
                {[
                  { dim: 'Learning Curve', lang: 'Steep', crew: 'Gentle', auto: 'Medium', swarm: 'Very Low' },
                  { dim: 'Production Ready', lang: '✅ Yes', crew: '✅ Yes', auto: '⚠️ Preview', swarm: '❌ No' },
                  { dim: 'Token Efficiency', lang: '~2,000', crew: '~3,500', auto: '~8,000', swarm: 'N/A' },
                  { dim: 'Control Level', lang: 'Maximum', crew: 'Limited', auto: 'High', swarm: 'Minimal' },
                  { dim: 'Debugging', lang: 'Excellent', crew: 'Good', auto: 'Challenging', swarm: 'Basic' },
                  { dim: 'Time-to-Prod', lang: 'Slower', crew: '40% faster', auto: 'TBD', swarm: 'N/A' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-cream/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.dim}</td>
                    <td className="px-6 py-4 text-center text-xs">{row.lang}</td>
                    <td className="px-6 py-4 text-center text-xs">{row.crew}</td>
                    <td className="px-6 py-4 text-center text-xs">{row.auto}</td>
                    <td className="px-6 py-4 text-center text-xs">{row.swarm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What's Working vs Hype */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <h2 className="font-display text-4xl font-bold mb-8">What's Working vs. Hype</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Working */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-ocean/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-ocean" />
              </div>
              <h3 className="font-display text-2xl font-semibold">What's Working</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-midnight text-sm mb-2">Simple Multi-Agent (2-4 Agents)</h4>
                <p className="text-xs text-midnight/70 leading-relaxed mb-2">
                  Lead + 3-5 parallel subagents → 90% better than single agent (Anthropic Research). 
                  Clear boundaries, human checkpoints, explicit error handling.
                </p>
                <p className="text-xs text-ocean font-medium">Example: Classifier → Router → Specialist → Response</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-midnight text-sm mb-2">Deterministic Orchestration</h4>
                <p className="text-xs text-midnight/70 leading-relaxed">
                  Graph-based or explicit routing. Predictable execution, easier debugging, controlled token costs. 
                  Not conversational "agents talking to each other."
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-midnight text-sm mb-2">Parallel Execution</h4>
                <p className="text-xs text-midnight/70 leading-relaxed">
                  For truly independent tasks (research, data gathering). 10 parallel subagents → 90% faster 
                  than sequential single agent.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-midnight text-sm mb-2">Human-in-the-Loop</h4>
                <p className="text-xs text-midnight/70 leading-relaxed">
                  Main agent shows plan → Human approves → Execute. LangGraph <code className="bg-cream px-1 rounded text-xs">interrupt()</code>, 
                  CrewAI approval workflows.
                </p>
              </div>
            </div>
          </div>

          {/* Hype */}
          <div className="bg-terracotta/5 rounded-2xl border border-terracotta/20 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-terracotta/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="font-display text-2xl font-semibold">What's Failing</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-midnight text-sm mb-2">Complex Orchestrations (10+ Agents)</h4>
                <p className="text-xs text-midnight/70 leading-relaxed mb-2">
                  Gartner: 40% of AI agent projects will fail by 2027. Exponential coordination complexity, 
                  error propagation (0.95^10 = 60% reliability), debugging nightmares.
                </p>
                <p className="text-xs text-terracotta font-medium">Token costs explode, no clear owner when breaks</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-midnight text-sm mb-2">Conversational Multi-Agent (Debate)</h4>
                <p className="text-xs text-midnight/70 leading-relaxed">
                  Token costs spiral to 8,000+ per simple task, outcomes unpredictable. Research toy, 
                  not production-ready.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-midnight text-sm mb-2">Fully Autonomous Swarms</h4>
                <p className="text-xs text-midnight/70 leading-relaxed mb-2">
                  66% test multi-agent, only 11% deploy to production. #1 blocker: Quality (accuracy, consistency). 
                  #2: Latency. #3: Security/compliance.
                </p>
                <p className="text-xs text-terracotta font-medium">What works: Supervised multi-agent with human oversight</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-midnight text-sm mb-2">Zero-Shot Collaboration</h4>
                <p className="text-xs text-midnight/70 leading-relaxed">
                  Agents need explicit instructions: who does what, format, handoff timing, failure handling. 
                  Won't "just figure it out."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Honest Assessment */}
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 overflow-hidden mt-8">
          <div className="px-6 py-4 bg-midnight text-cream">
            <h3 className="font-display text-xl font-semibold">Honest Assessment: Maturity Levels</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-midnight">Pattern</th>
                  <th className="px-6 py-3 text-left font-semibold text-midnight">Maturity</th>
                  <th className="px-6 py-3 text-center font-semibold text-midnight">Production Ready?</th>
                  <th className="px-6 py-3 text-left font-semibold text-midnight">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-midnight/5">
                {[
                  { pattern: 'Single agent + tools', maturity: 'Mature', ready: '✅', notes: 'Start here' },
                  { pattern: 'Orchestrator + 2-4 workers', maturity: 'Early adoption', ready: '✅', notes: 'Proven in production' },
                  { pattern: 'Parallel subagents', maturity: 'Early adoption', ready: '✅', notes: 'Anthropic validated' },
                  { pattern: 'Sequential pipeline', maturity: 'Mature', ready: '✅', notes: 'Simple, reliable' },
                  { pattern: 'Conversational multi-agent', maturity: 'Experimental', ready: '❌', notes: 'Research only' },
                  { pattern: '10+ agent swarms', maturity: 'Experimental', ready: '❌', notes: 'Demos only' },
                  { pattern: 'Memory as a Service', maturity: 'Emerging', ready: '⚠️', notes: 'Custom implementations' },
                  { pattern: 'Fully autonomous', maturity: 'Hype', ready: '❌', notes: 'Needs human oversight' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-cream/50 transition-colors">
                    <td className="px-6 py-3">{row.pattern}</td>
                    <td className="px-6 py-3 text-xs text-midnight/70">{row.maturity}</td>
                    <td className="px-6 py-3 text-center text-lg">{row.ready}</td>
                    <td className="px-6 py-3 text-xs text-midnight/60">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Practical Recommendations */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <h2 className="font-display text-4xl font-bold mb-8">Recommendations for Your Setup</h2>
        
        <div className="space-y-6">
          {/* Phase 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-ocean text-2xl">1</span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">Phase 1: Start Simple</h3>
                <p className="text-sm text-midnight/60">Single main agent with subagent spawning</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-midnight mb-1">Architecture</p>
                  <p className="text-xs text-midnight/70">
                    Single main agent (Jasper), spawns specialists as needed (coding, mortgage, music, email). 
                    One Telegram bot, shared workspace.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-midnight mb-1">Workspace Structure</p>
                  <p className="text-xs text-midnight/70 font-mono">
                    workspace/AGENTS.md (&lt;2KB), SOUL.md, MEMORY.md (main session only), 
                    domains/coding.md, domains/mortgage.md
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-ocean flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-midnight mb-1">Success Criteria</p>
                  <p className="text-xs text-midnight/70">
                    Main agent spawns specialists, synthesizes results. Daily logs capture activity. 
                    MEMORY.md stays under 10KB, updated weekly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-terracotta text-2xl">2</span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">Phase 2: Add Routing (If Needed)</h3>
                <p className="text-sm text-midnight/60">Only if Phase 1 proves insufficient</p>
              </div>
            </div>
            
            <div className="bg-terracotta/5 border-l-4 border-terracotta rounded-r-lg p-5 mb-4">
              <p className="text-sm font-semibold text-midnight mb-2">Only If:</p>
              <ul className="space-y-1 text-xs text-midnight/70">
                <li>• Need true isolation (team bot vs personal)</li>
                <li>• Different tool permissions per domain</li>
                <li>• Separate conversation histories required</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-ocean text-2xl leading-none">•</span>
                <div>
                  <p className="text-sm font-semibold text-midnight mb-1">Multiple Telegram bots (separate accounts)</p>
                  <p className="text-xs text-midnight/70">
                    Bindings route to appropriate agent. Shared workspace OR memory sync strategy needed.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-ocean text-2xl leading-none">•</span>
                <div>
                  <p className="text-sm font-semibold text-midnight mb-1">Memory Solutions</p>
                  <p className="text-xs text-midnight/70">
                    Option A: Shared filesystem (same workspace, separate agentDir). Option B: Lead agent synthesis 
                    (main reads specialist outputs, updates MEMORY.md). Option C: Memory as a Service (Redis + HTTP API).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0">
                <span className="font-display font-bold text-ocean text-2xl">3</span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold mb-2">Phase 3: Scale (Future)</h3>
                <p className="text-sm text-midnight/60">When Phase 2 proven + clear need</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-midnight/70">
              <p>
                Memory as a Service (Redis + HTTP API), advanced routing (intent-based), 
                multiple VPS instances for load balancing, framework migration (LangGraph if need compliance).
              </p>
            </div>
          </div>
        </div>

        {/* Anti-Patterns */}
        <div className="bg-terracotta/5 rounded-2xl border border-terracotta/20 p-8 mt-8">
          <h3 className="font-display text-2xl font-semibold mb-6">Anti-Patterns to Avoid</h3>
          
          <div className="space-y-3">
            {[
              'Never reuse agentDir across agents (causes auth/session collisions)',
              'Don\'t create giant bootstrap files that eat context window',
              'Avoid relying on chat history for knowledge transfer (it gets pruned)',
              'Don\'t skip error boundaries between agents',
              'Never deploy 10+ agent systems without proven need',
              'Don\'t use conversational debate patterns in production',
              'Avoid fully autonomous agents without human checkpoints',
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <p className="text-sm text-midnight/70">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-midnight text-cream rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-3xl font-semibold mb-6 mt-0">Key Takeaways</h2>
          
          <div className="space-y-4 text-sm opacity-90 leading-relaxed">
            <div className="flex items-start gap-3">
              <span className="text-terracotta font-bold text-xl flex-shrink-0">1.</span>
              <p><strong>Start with single agent + tools</strong> — Most "multi-agent" problems don't need multi-agent</p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-terracotta font-bold text-xl flex-shrink-0">2.</span>
              <p><strong>2-4 agents is the sweet spot</strong> — More than that, complexity explodes</p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-terracotta font-bold text-xl flex-shrink-0">3.</span>
              <p><strong>Deterministic routing beats conversation</strong> — Explicit flow, not debate</p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-terracotta font-bold text-xl flex-shrink-0">4.</span>
              <p><strong>Human checkpoints are mandatory</strong> — Don't trust fully autonomous</p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-terracotta font-bold text-xl flex-shrink-0">5.</span>
              <p><strong>Token management is #1 performance driver</strong> — Architecture matters more than model</p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-terracotta font-bold text-xl flex-shrink-0">6.</span>
              <p><strong>OpenClaw supports multi-agent well</strong> — Use bindings, separate workspaces, per-agent tool config</p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-terracotta font-bold text-xl flex-shrink-0">7.</span>
              <p><strong>Memory is still manual</strong> — Memory-as-a-Service not mature, use MEMORY.md + daily logs</p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-terracotta font-bold text-xl flex-shrink-0">8.</span>
              <p><strong>LangGraph wins for production</strong> — If you need reliability + compliance</p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-terracotta font-bold text-xl flex-shrink-0">9.</span>
              <p><strong>CrewAI wins for speed</strong> — If you need to ship fast</p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-terracotta font-bold text-xl flex-shrink-0">10.</span>
              <p><strong>Don't believe the hype</strong> — 40% of agent projects fail. Test patterns before scaling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="py-12 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-8 md:p-10">
          <h2 className="font-display text-3xl font-semibold mb-6 mt-0">Sources & Resources</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-midnight mb-3">Production Systems</h3>
              <ul className="space-y-2 text-sm text-midnight/70">
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <a 
                    href="https://www.anthropic.com/engineering/multi-agent-research-system" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-ocean hover:underline"
                  >
                    Anthropic Multi-Agent Research System (2026)
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Praetorian Production Architecture (Feb 2026) — Reddit r/LocalLLaMA</span>
                </li>
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Anthropic 2026 Agentic Coding Trends Report</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-midnight mb-3">Framework Documentation</h3>
              <ul className="space-y-2 text-sm text-midnight/70">
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <a 
                    href="https://python.langchain.com/docs/langgraph" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-ocean hover:underline"
                  >
                    LangGraph Documentation
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <a 
                    href="https://docs.crewai.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-ocean hover:underline"
                  >
                    CrewAI Documentation
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Microsoft Agent Framework (Preview, GA Q1 2026)</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-midnight mb-3">OpenClaw</h3>
              <ul className="space-y-2 text-sm text-midnight/70">
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <a 
                    href="https://docs.openclaw.ai/concepts/multi-agent" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-ocean hover:underline"
                  >
                    OpenClaw Multi-Agent Documentation
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>OpenClaw GitHub Issues #15246, #4561, #4385, #14417, #9471</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-midnight mb-3">Community Discussions</h3>
              <ul className="space-y-2 text-sm text-midnight/70">
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>r/LocalLLaMA — Production architecture threads (1qxn1gu, 1qh8xj6, 1qio9nj)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>r/AI_Agents — Framework comparisons (1r1yfkr, 1quz5ra)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-ocean flex-shrink-0 mt-0.5" />
                  <span>Design-Build Institute of America (DBIA) — 2023 market research</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-ocean/5 border-l-4 border-ocean rounded-r-lg p-5 mt-6">
            <p className="text-xs text-midnight/70 leading-relaxed">
              <strong className="text-ocean">Research compiled:</strong> February 19, 2026. 
              Total sources reviewed: 40+ articles, Reddit threads, GitHub issues, framework documentation. 
              Focus period: January-February 2026 (last 1-3 months of real-world production experience).
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t border-midnight/5">
        <p className="text-sm text-midnight/50 mb-2">
          Prepared by <span className="font-medium text-midnight/70">Jasper</span> • February 19, 2026
        </p>
        <p className="text-xs text-midnight/40">
          Research compiled for Kyle's OpenClaw multi-agent setup
        </p>
      </footer>
    </div>
  )
}
