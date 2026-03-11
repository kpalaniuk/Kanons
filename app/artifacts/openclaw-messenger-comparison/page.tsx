'use client'

const PLATFORMS = [
  {
    name: 'Telegram',
    emoji: '✈️',
    status: 'production-ready',
    statusColor: 'bg-green-100 text-green-800',
    used: true,
    setup: {
      score: 5,
      summary: 'Fastest setup of any platform. Create a bot via @BotFather (2 min), paste token into config, done. No app registration, no review, no business account needed.',
    },
    security: {
      score: 3,
      summary: 'MTProto encryption in transit. Bot tokens grant full message access — protect them. No E2E for bot messages (cloud-stored). For a personal agent this is fine; not HIPAA/SOC2 territory.',
    },
    robustness: {
      score: 5,
      summary: 'Exceptionally stable. Long polling is resilient; webhook mode optional. Telegram infrastructure rarely goes down. OpenClaw has auto-retry and IPv4/IPv6 fallback built in.',
    },
    speed: {
      score: 5,
      summary: 'Near-instant delivery. Long polling delivers messages within ~500ms. Webhook mode is faster still. Best latency of any platform tested.',
    },
    openclawFeatures: {
      score: 5,
      summary: 'Full feature set: inline buttons, reactions, reply threading, live stream preview (native draft streaming since Mar 2026), voice notes, stickers, forum topics, file/media, native commands menu, per-group/per-topic sessions, multi-account.',
    },
    privacy: {
      score: 3,
      summary: 'Cloud-based by default. Messages stored on Telegram servers (not E2E). Bot messages are not covered by Secret Chats. Acceptable for personal/business use, not for highly sensitive data.',
    },
    cost: { score: 5, summary: 'Free. Bot API is free with no rate limit for personal use.' },
    groupSupport: { score: 5, summary: 'Excellent. Groups, supergroups, forum topics, per-topic sessions. Fine-grained mention + policy controls.' },
    phoneRequired: false,
    pros: [
      'Fastest setup (2 min bot token)',
      'Best OpenClaw feature coverage',
      'Live stream preview (native Telegram drafts)',
      'Forum topics → isolated agent sessions per topic',
      'Stable, rarely has outages',
      'Free with no practical limits',
      'No phone number required for bot',
      'Inline buttons, reactions, stickers, voice notes',
    ],
    cons: [
      'Not E2E encrypted for bot messages',
      'Smaller user base than WhatsApp in some regions',
      'Bot messages stored in Telegram cloud',
    ],
    verdict: 'Best all-around for OpenClaw. Use this as your primary personal agent channel.',
    verdictColor: 'border-green-400 bg-green-50',
  },
  {
    name: 'Discord',
    emoji: '🎮',
    status: 'production-ready',
    statusColor: 'bg-green-100 text-green-800',
    used: true,
    setup: {
      score: 3,
      summary: 'More steps than Telegram: Developer Portal app creation, privileged intents toggle, OAuth invite URL, Server ID + User ID collection, pairing flow. ~15–20 min. Well documented.',
    },
    security: {
      score: 3,
      summary: 'TLS in transit. Bot tokens are powerful — guard them. Messages stored on Discord servers. Discord is SOC2 certified for business plans. Not E2E encrypted.',
    },
    robustness: {
      score: 4,
      summary: 'Generally stable. Discord has occasional gateway disconnects (rare). OpenClaw reconnects automatically. Slightly more surface area (WebSocket gateway vs. HTTP polling).',
    },
    speed: {
      score: 4,
      summary: 'Fast. WebSocket gateway delivers events quickly. Slightly higher overhead than Telegram long-poll but imperceptible in practice.',
    },
    openclawFeatures: {
      score: 5,
      summary: 'Richest feature set overall: threads, voice channels (real-time conversation), components v2 UI (buttons, selects, modals), slash commands, server/channel/topic isolation, role-based routing, PluralKit, exec approvals, streaming preview, ACP thread-bound sessions.',
    },
    privacy: {
      score: 3,
      summary: 'Similar to Telegram — cloud stored, not E2E. Discord has data retention policies. Acceptable for professional/personal use.',
    },
    cost: { score: 5, summary: 'Free. Bot API free. Nitro/boosts not needed for OpenClaw integration.' },
    groupSupport: { score: 5, summary: 'Best-in-class server/channel/thread model. Each channel = isolated agent session. Perfect for multi-context workspaces.' },
    phoneRequired: false,
    pros: [
      'Best multi-context workspace (channel per topic)',
      'Voice channel support (real-time agent conversation)',
      'Rich UI: buttons, dropdowns, modals (components v2)',
      'Slash commands with auto-complete',
      'Thread-bound ACP sessions',
      'Role-based agent routing',
      'Free, no practical limits',
    ],
    cons: [
      'More complex setup than Telegram',
      'Gaming stigma — less natural for professional mortgage/business use',
      'Slightly more moving parts (intents, permissions, OAuth)',
      'Not mobile-first in the same way as WhatsApp/Telegram',
    ],
    verdict: 'Best for team workspaces and power users. Ideal for Jasper team builds, LO Buddy dev collaboration, multi-context agent setups.',
    verdictColor: 'border-indigo-400 bg-indigo-50',
  },
  {
    name: 'WhatsApp',
    emoji: '💬',
    status: 'production-ready',
    statusColor: 'bg-green-100 text-green-800',
    used: false,
    setup: {
      score: 2,
      summary: 'Requires QR code linking via WhatsApp Web (Baileys library). Needs a dedicated phone number or personal number. QR scan to link device. No official bot API — relies on WhatsApp Web protocol reverse engineering.',
    },
    security: {
      score: 4,
      summary: 'E2E encrypted in transit (Signal protocol). However, Baileys is an unofficial client — technically violates WhatsApp ToS. Account ban risk exists (low in practice for personal use, higher if used commercially at scale). Messages are E2E but Baileys decrypts them locally.',
    },
    robustness: {
      score: 3,
      summary: 'Less stable than Telegram/Discord. WhatsApp periodically updates its Web protocol, which can break Baileys until updates ship. Reconnection loops are more common. Not recommended as a primary channel for production reliability.',
    },
    speed: {
      score: 4,
      summary: 'Fast message delivery — WhatsApp infrastructure is excellent. The bottleneck is Baileys WebSocket stability, not WhatsApp\'s servers.',
    },
    openclawFeatures: {
      score: 3,
      summary: 'Good but not full parity: reactions, polls, read receipts, media (image/video/audio/docs), ack reactions. No inline buttons, no slash commands, no streaming preview, limited action tooling.',
    },
    privacy: {
      score: 5,
      summary: 'Best privacy story: E2E Signal protocol encryption. Meta can\'t read messages in transit. However, Meta stores metadata (who messaged whom, when). Using Baileys means a third-party app decrypts messages locally.',
    },
    cost: { score: 5, summary: 'Free. WhatsApp has no API costs for personal use via Baileys.' },
    groupSupport: { score: 3, summary: 'Group support works but is more limited. Group JID-based sessions. No per-topic threading.' },
    phoneRequired: true,
    pros: [
      'E2E encrypted (Signal protocol)',
      'Massive user base — everyone has it',
      'Works on your personal number',
      'Good media support (images, video, voice, docs)',
      'Read receipts, typing indicators',
      'No separate account needed',
    ],
    cons: [
      'Unofficial API (Baileys) — ToS gray area, ban risk',
      'Less stable than Telegram/Discord',
      'WhatsApp can break Baileys on protocol updates',
      'No inline buttons or slash commands in OpenClaw',
      'No streaming preview',
      'Requires phone number to be linked',
      'Dedicated number strongly recommended',
    ],
    verdict: 'Best for reaching people who only use WhatsApp. Not recommended as a primary OpenClaw channel — reliability concerns. Good secondary/family channel.',
    verdictColor: 'border-amber-400 bg-amber-50',
  },
  {
    name: 'Slack',
    emoji: '🔧',
    status: 'production-ready',
    statusColor: 'bg-green-100 text-green-800',
    used: false,
    setup: {
      score: 2,
      summary: 'Most complex setup: Slack app creation, OAuth scopes (10+ required), Socket Mode + App Token + Bot Token, event subscriptions, interactivity URL, slash command registration, workspace install. 30–45 min for first-timers. Socket Mode simplifies vs. HTTP Events API.',
    },
    security: {
      score: 4,
      summary: 'TLS in transit. Slack is SOC2 Type II / HIPAA BAA available (paid plans). Enterprise-grade access controls, audit logging, DLP integrations on higher tiers. Bot tokens are workspace-scoped. Not E2E encrypted.',
    },
    robustness: {
      score: 4,
      summary: 'Very stable in production. Slack infrastructure is enterprise-grade. Socket Mode is resilient. HTTP Events mode requires a public endpoint. OpenClaw supports both. Slack status page is reliable.',
    },
    speed: {
      score: 4,
      summary: 'Fast delivery. Socket Mode WebSocket is low latency. Slack\'s native streaming API (Agents & AI Apps) lets OpenClaw stream partial replies live in threads.',
    },
    openclawFeatures: {
      score: 4,
      summary: 'Strong: slash commands, reactions, pins, polls, thread-based sessions, live native streaming (Agents & AI Apps API), block actions, modal forms, per-channel sessions, DM + channel support. Missing: no inline buttons equivalent (uses block kit instead), native voice.',
    },
    privacy: {
      score: 3,
      summary: 'Cloud stored, not E2E. Slack admins can access messages. Enterprise Grid has data residency. Compliance-friendly with right tier.',
    },
    cost: { score: 2, summary: 'Slack is expensive for teams ($7.25–$12.50/user/month). Free tier has 90-day message history limit. For personal single-user use, free tier works but is limited.' },
    groupSupport: { score: 5, summary: 'Excellent channel/thread model. Each channel = isolated session. Threads = nested sessions. Very powerful for team workflows.' },
    phoneRequired: false,
    pros: [
      'Enterprise-grade security (SOC2, HIPAA BAA)',
      'Native AI streaming (Agents & AI Apps API)',
      'Excellent team workflow — channels + threads',
      'Block kit for rich UIs (modals, dropdowns)',
      'Slash commands with native dispatch',
      'Stable, enterprise-grade infrastructure',
      'Audit logging on paid tiers',
    ],
    cons: [
      'Most complex OpenClaw setup (10+ OAuth scopes)',
      'Expensive for team use ($7–12/user/mo)',
      'Overkill for personal agent use',
      'Not E2E encrypted',
      'Free tier: 90-day message history cap',
      'Requires Slack workspace (not personal-number based)',
    ],
    verdict: 'Best for business teams already on Slack. Overkill for personal use. Ideal if your team/clients live in Slack.',
    verdictColor: 'border-purple-400 bg-purple-50',
  },
  {
    name: 'Signal',
    emoji: '🔒',
    status: 'external CLI required',
    statusColor: 'bg-amber-100 text-amber-800',
    used: false,
    setup: {
      score: 1,
      summary: 'Hardest setup: requires installing signal-cli (Java or native binary), registering/linking a phone number, captcha challenge for registration, daemon management. On VPS: 45–90 min. Ongoing maintenance burden when signal-cli needs updates.',
    },
    security: {
      score: 5,
      summary: 'Best-in-class security. E2E Signal protocol encryption (same as WhatsApp but open source). signal-cli is open source. No central server has message access. Perfect Forward Secrecy. Widely audited. The gold standard for private communication.',
    },
    robustness: {
      score: 2,
      summary: 'Least robust. signal-cli is a third-party CLI tool that must be kept in sync with Signal protocol changes. Breakage on Signal server updates is real. Requires manual maintenance. Not suitable for 24/7 production without active monitoring.',
    },
    speed: {
      score: 3,
      summary: 'Decent latency over JSON-RPC + SSE. Not as fast as Telegram/Discord. signal-cli adds processing overhead. Acceptable for personal use.',
    },
    openclawFeatures: {
      score: 3,
      summary: 'Basic: reactions, read receipts, typing indicators, media, DM + group support, per-group sessions. No buttons, no slash commands, no streaming. Limited compared to Telegram/Discord.',
    },
    privacy: {
      score: 5,
      summary: 'Maximum privacy. E2E Signal protocol, open-source client (signal-cli), no metadata sold, non-profit Signal Foundation. Best choice for truly sensitive communications.',
    },
    cost: { score: 5, summary: 'Free (Signal is a non-profit). signal-cli is open source.' },
    groupSupport: { score: 3, summary: 'Group support works but basic. No threading. Per-group sessions.' },
    phoneRequired: true,
    pros: [
      'Maximum security and privacy (E2E, open source)',
      'No ads, no data monetization (non-profit)',
      'Perfect for sensitive communications',
      'Reactions, read receipts, typing indicators',
      'Runs on a separate bot number',
    ],
    cons: [
      'Hardest setup by far (signal-cli + phone number + captcha)',
      'Brittle — breaks when Signal updates protocol',
      'Requires ongoing maintenance of signal-cli',
      'Fewest OpenClaw features',
      'Not suitable as primary channel for reliability',
      'Requires dedicated phone number',
    ],
    verdict: 'Use only if privacy/security is paramount and you accept maintenance overhead. Not recommended as primary channel.',
    verdictColor: 'border-slate-400 bg-slate-50',
  },
]

function ScoreDots({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <div className="flex gap-1 mt-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i < score ? 'bg-ocean' : 'bg-midnight/15'}`}
        />
      ))}
    </div>
  )
}

const CRITERIA = [
  { key: 'setup', label: 'Setup Ease' },
  { key: 'security', label: 'Security' },
  { key: 'robustness', label: 'Robustness' },
  { key: 'speed', label: 'Speed' },
  { key: 'openclawFeatures', label: 'OpenClaw Features' },
  { key: 'privacy', label: 'Privacy' },
  { key: 'cost', label: 'Cost' },
  { key: 'groupSupport', label: 'Group Support' },
] as const

export default function MessengerComparisonPage() {
  return (
    <div className="min-h-screen bg-sand py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <div className="text-xs font-semibold text-midnight/40 uppercase tracking-widest mb-2">OpenClaw KB · Technology</div>
          <h1 className="font-display text-4xl text-midnight mb-3">Messenger Services for OpenClaw</h1>
          <p className="text-midnight/60 text-base max-w-2xl">
            Pros, cons, and scores for connecting OpenClaw to Telegram, Discord, WhatsApp, Slack, and Signal.
            Based on OpenClaw docs + real-world setup experience. Updated March 2026.
          </p>
        </div>

        {/* TL;DR Summary Table */}
        <div className="bg-cream rounded-2xl border border-midnight/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-midnight/10">
            <h2 className="font-display text-xl text-midnight">At a Glance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-midnight/10 bg-midnight/2">
                  <th className="text-left px-4 py-3 font-semibold text-midnight/60 text-xs uppercase tracking-wide">Platform</th>
                  {CRITERIA.map(c => (
                    <th key={c.key} className="text-center px-3 py-3 font-semibold text-midnight/60 text-xs uppercase tracking-wide">{c.label}</th>
                  ))}
                  <th className="text-left px-4 py-3 font-semibold text-midnight/60 text-xs uppercase tracking-wide">Phone#</th>
                </tr>
              </thead>
              <tbody>
                {PLATFORMS.map((p, i) => (
                  <tr key={p.name} className={`border-b border-midnight/5 ${i % 2 === 0 ? '' : 'bg-midnight/2'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>{p.emoji}</span>
                        <span className="font-semibold text-midnight">{p.name}</span>
                        {p.used && <span className="text-[10px] bg-ocean/10 text-ocean px-1.5 py-0.5 rounded-full font-medium">In use</span>}
                      </div>
                    </td>
                    {CRITERIA.map(c => (
                      <td key={c.key} className="px-3 py-3 text-center">
                        <span className={`inline-block w-7 h-7 rounded-full text-sm font-bold leading-7 ${
                          (p as any)[c.key].score >= 4 ? 'bg-green-100 text-green-700' :
                          (p as any)[c.key].score === 3 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {(p as any)[c.key].score}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-3 text-midnight/50 text-xs">{p.phoneRequired ? '✅ Required' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2 text-xs text-midnight/40 border-t border-midnight/5">Scores out of 5 · 🟢 4–5 · 🟡 3 · 🔴 1–2</div>
          </div>
        </div>

        {/* Platform Deep Dives */}
        <div className="space-y-8">
          {PLATFORMS.map(p => (
            <div key={p.name} className={`bg-cream rounded-2xl border-2 ${p.verdictColor} overflow-hidden`}>
              {/* Platform Header */}
              <div className="px-6 py-5 border-b border-midnight/10">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl">{p.emoji}</span>
                      <h2 className="font-display text-2xl text-midnight">{p.name}</h2>
                      {p.used && (
                        <span className="text-xs bg-ocean/10 text-ocean px-2 py-0.5 rounded-full font-semibold">Currently using</span>
                      )}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.statusColor}`}>
                      OpenClaw: {p.status}
                    </span>
                  </div>
                  <div className={`text-sm font-medium text-midnight/70 max-w-sm px-4 py-2 rounded-xl border ${p.verdictColor}`}>
                    <span className="font-bold text-midnight">Verdict: </span>{p.verdict}
                  </div>
                </div>
              </div>

              {/* Criteria Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-midnight/5">
                {CRITERIA.map(c => (
                  <div key={c.key} className="px-5 py-4">
                    <div className="text-[10px] font-semibold text-midnight/40 uppercase tracking-wider mb-1">{c.label}</div>
                    <ScoreDots score={(p as any)[c.key].score} />
                    <p className="text-xs text-midnight/60 mt-2 leading-relaxed">{(p as any)[c.key].summary}</p>
                  </div>
                ))}
              </div>

              {/* Pros / Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-midnight/10 border-t border-midnight/10">
                <div className="px-6 py-4">
                  <div className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">✅ Pros</div>
                  <ul className="space-y-1">
                    {p.pros.map((pro, i) => (
                      <li key={i} className="text-xs text-midnight/70 flex gap-2">
                        <span className="text-green-500 shrink-0">+</span>{pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 py-4">
                  <div className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">⚠️ Cons</div>
                  <ul className="space-y-1">
                    {p.cons.map((con, i) => (
                      <li key={i} className="text-xs text-midnight/70 flex gap-2">
                        <span className="text-red-400 shrink-0">−</span>{con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation */}
        <div className="bg-midnight text-cream rounded-2xl p-8">
          <h2 className="font-display text-2xl mb-4">Recommendation for Kyle's Setup</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-ocean font-semibold mb-2">🥇 Primary (personal)</div>
              <div className="font-bold text-lg mb-1">Telegram</div>
              <p className="text-cream/60 text-xs">Best balance of features, stability, and zero setup friction. 5/5 on OpenClaw features. Use for all personal Jasper interactions.</p>
            </div>
            <div>
              <div className="text-ocean font-semibold mb-2">🥈 Secondary (team/dev)</div>
              <div className="font-bold text-lg mb-1">Discord</div>
              <p className="text-cream/60 text-xs">Best for LO Buddy/PPH team workspace, multi-agent builds, and Chord Bot. Channel-per-topic isolation is unmatched.</p>
            </div>
            <div>
              <div className="text-ocean font-semibold mb-2">🥉 Optional (outreach)</div>
              <div className="font-bold text-lg mb-1">WhatsApp</div>
              <p className="text-cream/60 text-xs">Only if you need to reach contacts who aren't on Telegram. Use a dedicated number. Don't rely on it for 24/7 uptime.</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-cream/10 text-xs text-cream/40">
            <strong className="text-cream/60">Skip for now:</strong> Slack (overkill + expensive unless team is already there), Signal (too much maintenance for the reliability tradeoff).
          </div>
        </div>

        {/* Other Channels */}
        <div className="bg-cream rounded-2xl border border-midnight/10 p-6">
          <h2 className="font-display text-xl text-midnight mb-4">Other OpenClaw Channels (not evaluated)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {[
              { name: 'iMessage / BlueBubbles', note: 'Mac-only, requires jailbreak proxy or BlueBubbles server. Not practical on VPS.' },
              { name: 'Matrix', note: 'Federated, open source. Good privacy. Complex setup. Niche user base.' },
              { name: 'IRC', note: 'Legacy. Production-ready in OpenClaw but no modern UX.' },
              { name: 'Microsoft Teams', note: 'Enterprise only. Significant overhead. Skip unless clients demand it.' },
              { name: 'Google Chat', note: 'Production-ready. Google Workspace only. Good if team uses Google.' },
              { name: 'Mattermost', note: 'Self-hosted Slack alternative. Good for privacy-focused teams.' },
            ].map(c => (
              <div key={c.name} className="bg-midnight/5 rounded-xl p-3">
                <div className="font-semibold text-midnight text-xs mb-1">{c.name}</div>
                <div className="text-xs text-midnight/50">{c.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-midnight/30 text-center pb-4">
          Sources: OpenClaw channel docs (March 2026) · Personal setup experience · OpenClaw community
        </div>
      </div>
    </div>
  )
}
