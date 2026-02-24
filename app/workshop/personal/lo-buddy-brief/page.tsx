'use client';

export default function LOBuddyBriefPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] px-4 py-12">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7A8F9E] bg-white border border-[#e8e6e1] px-3 py-1 rounded-full">
              Product Brief
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#7A8F9E] bg-white border border-[#e8e6e1] px-3 py-1 rounded-full">
              Feb 24, 2026
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-[#0a0a0a] leading-tight mb-4">
            LO Buddy
          </h1>
          <p className="text-xl text-[#0a0a0a]/60 leading-relaxed">
            Full session recap, production issues, roadmap, and the GH Group go-live plan.
            For Kyle & Chad — morning review.
          </p>
        </div>

        {/* What We Shipped */}
        <Section title="What We Shipped Today">
          <p className="text-[#0a0a0a]/70 mb-6 leading-relaxed">
            The GHL ↔ LO Buddy integration is fully live. Every piece of the communication pipeline is wired.
          </p>

          <div className="space-y-3 mb-6">
            {[
              ['Inbound SMS webhook', 'GHL Workflow fires on customer SMS → queued in approval table → AI draft generated'],
              ['Outbound sync cron', 'Runs every 5 min — captures all GHL-automated messages (drips, sequences, manual replies)'],
              ['Approve & send', 'LO reviews AI draft → one-click approve → SMS fires from (619) 777-5700'],
              ['Contact Created webhook', 'New GHL contacts sync to LO Buddy automatically'],
              ['Pipeline Stage webhook', 'Stage changes sync — full opportunity data fetched from GHL API'],
              ['Deploy pipeline', 'bash scripts/deploy.sh — push + Vercel deploy + poll to completion, all in one'],
              ['Outbound timeline logging', 'When LO approves a send, reply stored as outbound record for full conversation view'],
              ['GHL merge tag workarounds', 'conversationId, messageId, pipelineId all auto-resolved via API (GHL merge tags don\'t expose them)'],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3 p-4 bg-white rounded-xl border border-[#e8e6e1]">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <div>
                  <p className="font-medium text-[#0a0a0a] text-sm">{title}</p>
                  <p className="text-[#0a0a0a]/60 text-sm mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#0a0a0a] text-[#f8f7f4] rounded-xl p-5 font-mono text-sm space-y-1">
            <p className="text-[#7A8F9E] text-xs mb-2">GHL Webhook Payloads (confirmed valid — no invalid merge tags)</p>
            <p className="text-[#FFB366]">// Workflow 1 — Inbound SMS</p>
            <p>type: "InboundMessage" · locationId: hardcoded · contactId: {'{{contact.id}}'}</p>
            <p>body: {'{{message.body}}'} · firstName/lastName/phone/email: confirmed ✓</p>
            <p className="text-[#FFB366] mt-2">// Workflow 2 — Contact Created</p>
            <p>type: "ContactCreate" · contact.id/first_name/last_name/email/phone ✓</p>
            <p className="text-[#FFB366] mt-2">// Workflow 3 — Pipeline Stage Changed</p>
            <p>type: "OpportunityUpdate" · contact.id · opportunity.id · opportunity.pipeline_name · opportunity.status ✓</p>
          </div>
        </Section>

        {/* Production Issues */}
        <Section title="Production Issues — Fix Before Go-Live">
          <div className="space-y-4">
            {[
              {
                priority: 'HIGH',
                title: 'Settings page doesn\'t load',
                detail: 'Click name → Settings → page doesn\'t populate. Supabase fetch failing silently. Needs error boundary + fetch debug.',
              },
              {
                priority: 'HIGH',
                title: 'Unknown contact texting in = no AI draft',
                detail: 'New phone number texts (619) 777-5700 → message captured but no draft generated (contact lookup fails). Fix: create stub contact, generate context-light draft, alert LO.',
              },
              {
                priority: 'HIGH',
                title: 'Left nav has broken/empty links',
                detail: 'Nav items pointing to unbuilt pages create confusion. Audit all nav items — hide anything without a working page. Clean nav = confident product.',
              },
              {
                priority: 'MEDIUM',
                title: 'Audit logs page has errors',
                detail: 'Likely Supabase RLS policy issue. Check query + verify admin role has read access.',
              },
              {
                priority: 'MEDIUM',
                title: 'No team indicator in UI',
                detail: 'No way to see which team you\'re logged into. Add team name to nav header. Simple but important for multi-team LOs.',
              },
              {
                priority: 'MEDIUM',
                title: 'Team chat / messaging center incomplete',
                detail: 'Internal LO-to-LO chat exists in nav but isn\'t functional. Needed before Kyle/Jim/Anthony work together in the app. Build: channel list, message thread, Supabase Realtime.',
              },
            ].map((issue) => (
              <div key={issue.title} className="p-4 bg-white rounded-xl border border-[#e8e6e1]">
                <div className="flex items-start gap-3">
                  <span className={`text-xs font-mono uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                    issue.priority === 'HIGH'
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}>
                    {issue.priority}
                  </span>
                  <div>
                    <p className="font-medium text-[#0a0a0a] text-sm">{issue.title}</p>
                    <p className="text-[#0a0a0a]/60 text-sm mt-1">{issue.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Feature Roadmap */}
        <Section title="Feature Roadmap">

          <FeatureBlock
            tag="Scenarios"
            title="AI-Powered Dynamic Scenario Builder"
            color="blue"
          >
            <p className="text-[#0a0a0a]/70 text-sm leading-relaxed mb-4">
              Like the custom pricing scenarios on Kanons — but smarter. Three modes:
            </p>
            <div className="space-y-3">
              <ModeCard
                label="Baseline"
                desc="No AI. LO picks template (Purchase, Refi, DSCR). Tool pulls client's actual FICO, income, assets from their record. Pure math — fast, always works. Outputs PDF / shareable link."
              />
              <ModeCard
                label="AI-Enhanced"
                desc='LO types a prompt: "First-time buyer, under $2,800/month, nervous about ARMs, self-employed." AI reads full client profile + conversation history → generates 3–4 custom scenario narratives with talking points tailored to her situation.'
              />
              <ModeCard
                label="Real-Time (Voice)"
                desc='During a client call: "Show me what happens if we buy the rate down .5%." Results update live. This is the core product promise: LO Buddy is the AI co-pilot on every client call.'
              />
            </div>
            <p className="text-[#0a0a0a]/60 text-sm mt-4 italic">
              Underwriting KB (same 6 files from the tool at kyle.palaniuk.net/underwriting) integrated as the knowledge layer. One AI that knows the guidelines AND the client.
            </p>
          </FeatureBlock>

          <FeatureBlock
            tag="Docs"
            title="Pre-Approval Package Builder"
            color="green"
          >
            <p className="text-[#0a0a0a]/70 text-sm leading-relaxed">
              Pull financials from contact record → auto-generate pre-approval letter with correct loan amount, rate range, conditions → LO reviews + approves → professional PDF with PPH/GH Group branding → client receives via SMS link or email. Client shares directly with realtor. One click, end to end.
            </p>
          </FeatureBlock>

          <FeatureBlock
            tag="Portals"
            title="Realtor Portal"
            color="purple"
          >
            <p className="text-[#0a0a0a]/70 text-sm leading-relaxed">
              Realtors who work with PPH/GH Group get their own view: client status (no financial details), pre-approval letters on file, rate quote requests, direct messaging with assigned LO. The differentiation: if LO Buddy gives realtors a better experience than any other lender — real-time updates, instant pre-approval access — they refer more. Routes exist at /realtor/* but need to be built out.
            </p>
          </FeatureBlock>

          <FeatureBlock
            tag="Portals"
            title="Client Portal Polish"
            color="purple"
          >
            <p className="text-[#0a0a0a]/70 text-sm leading-relaxed">
              Exists at /client/* but needs work: cleaner onboarding flow, visual progress tracker (Application → Processing → Underwriting → CTC → Funded), document upload with status, direct messaging with LO (SMS-backed), mobile-first design. Most clients will access this on their phone.
            </p>
          </FeatureBlock>

          <FeatureBlock
            tag="Brand"
            title="Landing Page Revamp"
            color="orange"
          >
            <p className="text-[#0a0a0a]/70 text-sm leading-relaxed">
              The landing page doesn't yet communicate what LO Buddy is or why an LO should care. Direction: take Kanons' movement, typography, and confidence — smooth scroll, editorial layout, opinionated design. Hero: "Your AI loan officer co-pilot. Close more. Work less." Animated demo of the approval queue. Warm cream/midnight palette. Space Grotesk display. No generic SaaS look.
            </p>
          </FeatureBlock>

        </Section>

        {/* Onboarding Wizard */}
        <Section title="New Team Onboarding Wizard">
          <p className="text-[#0a0a0a]/70 leading-relaxed mb-6">
            How every new GHL-based team gets set up in LO Buddy — 5 steps, no engineering required.
          </p>
          <div className="space-y-3">
            {[
              ['Step 1 · Team Setup', 'Name, logo, location. Primary LO creates account, invites team members.'],
              ['Step 2 · GHL Connection', 'Enter Location ID. Wizard generates the 3 webhook payloads pre-filled. Step-by-step guide. Test button confirms connection is live.'],
              ['Step 3 · Contact Sync', 'Pull existing GHL contacts via API. LO assigns to team members. AI classifies each by status from pipeline stage.'],
              ['Step 4 · Configuration', 'AI model prefs, notification routing, pre-approval template, Twilio number.'],
              ['Step 5 · Go Live', 'Text the number, confirm queue populates, confirm approve flow. Done ✓'],
            ].map(([step, desc], i) => (
              <div key={step} className="flex gap-4 p-4 bg-white rounded-xl border border-[#e8e6e1]">
                <div className="w-7 h-7 rounded-full bg-[#0a0a0a] text-[#f8f7f4] flex items-center justify-center text-xs font-mono flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="font-medium text-[#0a0a0a] text-sm">{step}</p>
                  <p className="text-[#0a0a0a]/60 text-sm mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* GH Group Go-Live */}
        <Section title="GH Group — Go-Live Plan">
          <p className="text-[#0a0a0a]/70 leading-relaxed mb-4">
            Team is fully set up in Supabase. GHL workflows are configured. This is what happens next:
          </p>
          <div className="bg-white rounded-xl border border-[#e8e6e1] overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['1', 'Confirm Workflow 1 Execution Log green', 'Kyle', 'AM'],
                  ['2', 'Bulk import existing GHL contacts to LO Buddy', 'Jasper', 'AM'],
                  ['3', 'Assign contacts to Kyle / Jim / Anthony by LO email', 'Auto', 'AM'],
                  ['4', 'Run first live test: SMS → queue → approve → GHL', 'Kyle', 'AM'],
                  ['5', 'Jim + Anthony log in, verify their pipeline', 'Team', 'AM/PM'],
                  ['6', 'Enable notifications for all three LOs', 'Jasper', 'PM'],
                ].map(([num, task, who, when]) => (
                  <tr key={num} className="border-b border-[#e8e6e1] last:border-0">
                    <td className="px-4 py-3 text-[#0a0a0a]/40 font-mono text-xs w-8">{num}</td>
                    <td className="px-4 py-3 text-[#0a0a0a]/80">{task}</td>
                    <td className="px-4 py-3 text-[#7A8F9E] text-xs">{who}</td>
                    <td className="px-4 py-3 text-[#7A8F9E] text-xs font-mono">{when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-[#0a0a0a] rounded-xl text-[#f8f7f4]">
            <p className="text-sm font-medium mb-1">GH Group Supabase Team</p>
            <p className="text-[#7A8F9E] text-xs font-mono">team_id: c88f677b-ebdc-4421-be6c-2ac0345e7a7d</p>
            <p className="text-[#7A8F9E] text-xs font-mono">Kyle (admin) · Jim (member) · Anthony (member) · Chad (admin)</p>
            <p className="text-[#7A8F9E] text-xs font-mono mt-1">GHL Location: O5nJteJfLkWOfOpoEwX9 · Twilio: (619) 777-5700</p>
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[#e8e6e1] flex items-center justify-between text-xs text-[#7A8F9E] font-mono">
          <span>Prepared by Jasper · Feb 24, 2026</span>
          <span>Latest commit: 891a00d</span>
        </div>

      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-14">
      <h2 className="font-display text-2xl text-[#0a0a0a] mb-6 pb-3 border-b border-[#e8e6e1]">
        {title}
      </h2>
      {children}
    </div>
  );
}

function FeatureBlock({
  tag, title, color, children,
}: {
  tag: string;
  title: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  children: React.ReactNode;
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    purple: 'bg-violet-50 text-violet-700 border-violet-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };
  return (
    <div className="mb-6 p-5 bg-white rounded-2xl border border-[#e8e6e1]">
      <div className={`inline-block text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border mb-3 ${colors[color]}`}>
        {tag}
      </div>
      <h3 className="font-display text-lg text-[#0a0a0a] mb-3">{title}</h3>
      {children}
    </div>
  );
}

function ModeCard({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="p-3 bg-[#f8f7f4] rounded-lg border border-[#e8e6e1]">
      <p className="text-xs font-mono uppercase tracking-wider text-[#0066FF] mb-1">{label}</p>
      <p className="text-[#0a0a0a]/70 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
