# LO Buddy — Sprint 1: Audit, Triage & Core Fixes

**Created:** 2026-02-26 by Jasper (from Kyle hopper Q&A)
**For:** Chad (implementation) + Kyle (review/confirm)
**Branch:** `feature/jasper` → PR to `main` when complete
**Model:** Use `ANTHROPIC_MODEL=claude-opus-4-6 claude` for all Claude Code sessions
**Review:** Cross-model reviewed before delivery ✓

---

## Context: Why This Sprint Exists

Kyle's Q&A session surfaced the core problem: **nobody knows what actually works.**
Features are half-done, agents are opaque, and there's no test harness. The codebase
is far more built-out than it appears (40+ services, full agent module system, Pinecone
client, memory retrieval — all exist), but nothing has been verified end-to-end.

**Rule for this sprint:** Do not add new features. Fix, verify, and wire what exists.
The next sprint (scenarios, rate stack, GHL webhooks) depends on this one being clean.

---

## Part 1: Known Bugs — Fix These First (Plan 13)

These bugs were identified in smoke testing. They are critical and blocking MVP.

### Bug 1: Duplicate Lead Creation
**File:** `services/tool-calling-agent.service.ts`, `services/command-execution.service.ts`, `lib/llm/prompt-cache.ts`

Before calling `create_lead`, check if a contact with the same name exists in the
current conversation context. If found, switch to `manage_contact` with `action='update'`.

Add to system prompt: *"If the user has already created a lead in this session,
subsequent information about that person should UPDATE the existing lead, not create
a new one."*

**Acceptance:** Create "Mike Thompson" then say "His email is mike@test.com" — should
result in 1 contact with both fields, not 2 contacts.

---

### Bug 2: Realtor Fuzzy Match — CRITICAL
**File:** `services/user-search.service.ts`

Current scoring resolves "Chad Anderson" to "Chad Test" because first-name match
alone passes the threshold. Fix: when searching with a full name (2+ parts), require
**both** first AND last to match.

```typescript
if (nameParts.length >= 2) {
  const firstMatches = firstName.toLowerCase() === nameParts[0].toLowerCase();
  const lastMatches = lastName.toLowerCase() === nameParts.slice(1).join(' ').toLowerCase();
  if (firstMatches && lastMatches) score = 80;
  else if (firstMatches && !lastMatches) score = 0; // NOT a match
}
```

When realtor is `not_found`, agent should offer to create them — never silently skip.

**Add `create_realtor` tool:**
- Parameters: `first_name`, `last_name`, `email?`, `phone?`, `company?`, `link_to_opportunity_id?`
- After creation, AI asks: "Do you have their contact info?"
- Files: `services/command-execution.service.ts`, `services/tool-calling-agent.service.ts`, `lib/llm/prompt-cache.ts`

**Acceptance:** "New lead: Jane Doe, referred by realtor Chad Anderson" → realtor
"Chad Anderson" created, linked to opportunity, AI asks for their contact info.
"Chad Test" must NOT be matched.

---

### Bug 3: Realtor Referral Prompt Missing
**Files:** `services/command-execution.service.ts`, `lib/llm/prompt-cache.ts`

After creating a lead:
1. If `lead_source` is not set → ask "How were they referred?"
2. If user mentions a person → trigger realtor lookup/creation
3. If `referring_realtor_id` not set after realtor-type referral → ask for name

**Acceptance:** "New lead: Sarah Johnson, purchase" → AI asks about referral source.
Answer "realtor referral" → AI asks for realtor name.

---

### Bug 4: Post-Lead-Creation Navigation
**Files:** `app/api/voice/chat/route.ts`, `components/voice/voice-context.tsx`

Add debug logging to confirm `createdOpportunityId` and `navigateTo` are populated
and that `router.push` fires on the client. Per existing logs, navigation MAY be
working — confirm first before rewriting.

If confirmed broken: verify opportunity is actually being created (vs contact-only),
and that `navigateTo` is in the API response.

**Acceptance:** "New lead: Test User, purchase" → browser navigates to
`/opportunities/[new-id]` within 2 seconds of AI confirmation.

---

## Part 2: Chat UI Reconciliation — DIRECTION APPROVED ✅

> ✅ **Direction locked by Kyle (2026-02-26).** No more auditing — build to this spec.

**Decision:** Keep the floating voice overlay (`components/voice/`). Retire the `/chat` page (`app/(auth)/chat/`).

The overlay has working voice, context awareness, conversation persistence, and disambiguation.
The chat page has a dead mic button, no persistence, no context awareness. It loses.

---

### Build Scope (this sprint):

**Step 1 — Port these 5 things from the chat page into the overlay:**
1. Full scrollable conversation history
2. Module hint buttons (New Lead, Log Call, etc.)
3. Query param deep-links (`?q=`)
4. Inline suggestion chips
5. Tool action result badges

**Step 2 — Replace the orb with a character placeholder:**
- The pulsating orb is gone. Replace with a proper character placeholder.
- CSS/SVG element that reads as a character, not an abstract blob.
- **Design it to be swapped 1:1 for the LO Buddy 3D GLTF model later** — same component slot.
- Placeholder only. Clean and intentional, not a rough hack.

**Step 3 — Add suggested action chips (REQUIRED):**
- When the overlay opens, show a greeting + action chips immediately:
  > *"What are we working on?"*
  - **[New Lead]** **[Check Pipeline]** **[Build Scenario]** **[Log a Call]**
- Tapping a chip triggers the corresponding flow (same as typing/speaking it).
- Chips persist until conversation starts, then move to a bottom rail.
- This is the intake experience. It must feel immediate and obvious.

**Step 4 — Retire the chat page:**
- Once 5 features are ported and verified, delete `app/(auth)/chat/`.
- Remove all nav links pointing to it.
- Confirm nothing else references the old chat route.

---

### Overlay Layout (expanded state):
- **Character area:** LO Buddy placeholder (left or center, tap to speak)
- **Conversation:** Scrollable history above/beside character
- **Bottom:** Action chips / module hint buttons
- **Top right:** Close / minimize

---

### What this is NOT:
- ❌ Not voice calling or voice dictation (separate future feature)
- ❌ Not the final 3D character (that's Blender — separate project)
- ❌ Not a full redesign — improve the overlay, retire the dead page

**Files:**
- `components/voice/` — primary build target
- `app/(auth)/chat/` — retire after porting
- `app/api/voice/chat/route.ts` — stays as-is

**Acceptance:** One overlay UI, character placeholder visible, action chips on open, 5 features ported, chat page deleted.

---

> **Note on voice features:**
> - **Voice dictation** → Separate future feature, not this sprint
> - **Call transcription** → Post-MVP per Kyle. See Part 5 — do not build this sprint.

---

## Part 3: System Audit — What's Actually Live

For each item below, verify it works end-to-end. Mark status, note what's broken.
Do NOT fix anything outside Part 1 this sprint — just audit and document.

### 3A. Memory System (Pinecone + Supabase)

The files exist:
- `lib/memory/pinecone-client.ts` — Pinecone client, `lo-buddy-memory` index
- `lib/memory/embeddings.ts` — OpenAI embedding wrapper
- `services/memory-retrieval.service.ts` — Tier 2 (Supabase) + Tier 3 (Pinecone)
- `services/memory-write.service.ts` — Write path

**Audit checklist:**
- [ ] Is `PINECONE_API_KEY` set in Vercel environment? (check Vercel dashboard)
- [ ] Does the `lo-buddy-memory` Pinecone index actually exist? (Pinecone console)
- [ ] Is `memory-retrieval.service.ts` called anywhere in the chat API route?
- [ ] Is `memory-write.service.ts` called anywhere after chat completion?
- [ ] Run: create a test conversation, check if any vectors appear in Pinecone
- [ ] If nothing is wired: memory system is built but not connected — flag for Sprint 2

**Note:** Do NOT build new memory infrastructure this sprint. Just verify if what
exists is connected. The full Pinecone port plan is at:
`/data/shared/projects/lo-buddy/02-25-26/JASPER-PINECONE-PORT.md`

---

### 3B. Agent Module System

Files exist under `services/agent-modules/`:
- `module-selector.service.ts`
- `prompt-composer.ts`
- `modules/` (individual modules)
- `capture-pipeline.ts`
- `proactive-engine.ts`

**Audit checklist:**
- [ ] Is `module-selector.service.ts` actually called in `tool-calling-agent.service.ts`?
- [ ] Is `prompt-composer.ts` wired into the LLM call path?
- [ ] Which modules exist in `modules/`? List them.
- [ ] Does the agent actually switch behavior based on context (lead capture vs follow-up coach)?
- [ ] Test: "New lead: John Smith" — does it route to the Capture module?
- [ ] Test: "What should I do with my stale leads?" — does it route to Follow-Up Coach?

---

### 3C. GHL (LO Ninja) Integration

Files:
- `services/ghl-conversation-sync.service.ts`
- `services/ghl-draft.service.ts`
- `lib/integrations/lo-ninja/`
- `app/api/integrations/` (check if GHL webhook route exists)

**Audit checklist:**
- [ ] Is `LO_NINJA_API_KEY` set in Vercel environment?
- [ ] Does a GHL webhook endpoint exist? (e.g., `app/api/integrations/ghl/webhook/route.ts`)
- [ ] Does `ghl-conversation-sync.service.ts` pull conversations from GHL?
- [ ] Can it access call recordings from LO Ninja? (needed for call transcription)
- [ ] Is any GHL data flowing into the app in production?

**Note:** GHL webhook integration is Sprint 1 top priority per Kyle (Q1). If the
webhook endpoint doesn't exist, that's the primary build item for this sprint.

---

### 3D. Voice Transcription

Files:
- `app/api/voice/transcribe/route.ts`
- `lib/utils/voice-transcription-normalizer.ts`
- `types/voice.types.ts`

**Audit checklist:**
- [ ] Does the transcription endpoint accept audio and return text?
- [ ] Is it wired to the voice chat UI?
- [ ] Is Whisper being used? What model?
- [ ] Does it handle mortgage-domain corrections (rate names, loan types, etc.)?
- [ ] Test with a real voice recording if possible

---

### 3E. Scenario Service

File: `services/scenario.service.ts`, `app/api/scenarios/`

**Audit checklist:**
- [ ] Can the LLM create scenarios via voice? ("Give me a conventional purchase scenario for $500k")
- [ ] Does scenario overwrite work? (Per Plan 13 logs: YES — this appears to work)
- [ ] Are scenarios viewable in the UI?
- [ ] Is there a scenario detail/comparison view?

**Note:** Scenario builder from Kanons (DSCR/Purchase/Refi) is a Sprint 2 feature —
do not merge this sprint. Just verify what's already in LO Buddy.

---

### 3F. Rate Quote Service

File: `services/rate-quote.service.ts`, `app/api/rate-quotes/`

**Audit checklist:**
- [ ] What does this service do currently?
- [ ] Is it connected to any live rate source or is it placeholder?
- [ ] Rate Stack Parser (PDF/screenshot → rate mechanism) is a Sprint 2 MVP feature — just audit what exists now

---

### 3G. Auto-Task System

Files: `services/auto-task.service.ts`, `services/auto-task.rules.ts`, `services/auto-task.rule-set.ts`

**Audit checklist:**
- [ ] Are tasks being auto-created after lead creation?
- [ ] Do follow-up tasks appear after status transitions?
- [ ] Is the task list visible in the UI?

---

## Part 4: Audit Output Document

When the audit is complete, Chad should produce a document:
`AUDIT-RESULTS-02-26.md` (place in `/data/shared/projects/lo-buddy/02-26-26/`)

Format:
```markdown
# LO Buddy Audit Results — [Date]

## Working ✅
- [feature]: confirmed working, [brief note on how verified]

## Partially Working ⚠️
- [feature]: [what works, what doesn't, what's unwired]

## Not Working / Broken ❌
- [feature]: [what's wrong]

## Not Connected (built but not wired) 🔌
- [feature]: [exists but not called anywhere]

## Missing Entirely 🚫
- [feature]: [not built at all]
```

This document becomes the source of truth for Sprint 2 prioritization.

---

## Part 5: Call Transcription from LO Ninja (Architecture Reference — Post-MVP)

> ⚠️ **Updated 2026-02-26:** Kyle confirmed call transcription from recorded conversations
> is **post-MVP**. Do NOT build this sprint. This section is kept as architecture
> reference for when GHL API is confirmed working and the team is ready.
> Also has a hard dependency on Part 3C (GHL audit) being complete first.

This is a new feature Kyle confirmed in the hopper. Not currently in any plan.

**Goal:** Pull call recordings stored in LO Ninja → transcribe → add to client context.

**Architecture:**
1. GHL stores call recordings as audio file URLs in contact activity
2. LO Buddy fetches the recording URL via GHL API
3. Passes audio to Whisper for transcription
4. Stores transcription as a note on the opportunity + as a Pinecone memory vector

**New files needed:**
- `services/call-transcription.service.ts`
  - `fetchCallRecordings(contactId: string, teamId: string): Promise<CallRecording[]>`
  - `transcribeAndStore(recording: CallRecording, opportunityId: string): Promise<void>`

**GHL endpoint for call recordings:**
```
GET /contacts/{contactId}/activities
```
Filter for `type: 'call'` entries that have `recording_url`.

**Transcription flow:**
```typescript
const recordings = await ghl.getContactActivities(ghlContactId, { type: 'call' });
for (const call of recordings.filter(r => r.recording_url)) {
  const transcript = await whisper.transcribe(call.recording_url);
  await opportunityService.addNote(opportunityId, {
    content: `Call transcript (${call.date}): ${transcript}`,
    type: 'call_transcript',
    source: 'lo_ninja_auto'
  });
  await memoryWriteService.store(transcript, teamId, { opportunityId, type: 'call_log' });
}
```

**Trigger:** When an LO opens an opportunity detail page, check for new unsynced
call recordings and auto-transcribe them in the background.

**Dependencies:** GHL API access must be confirmed working (Part 3C) before this is built.

---

## What Is NOT In This Sprint

- Scenario builder from Kanons → Sprint 2
- Rate Stack Parser (PDF/screenshot → rates) → Sprint 2
- Pinecone memory full build (if not already wired) → Sprint 2, use JASPER-PINECONE-PORT.md
- Onboarding wizard → Sprint 3
- Multi-team rollout → Sprint 3
- Any UI redesign beyond voice reconciliation → Sprint 2+

---

## Acceptance Criteria for Sprint 1 Complete

- [ ] Bug 1 fixed: no more duplicate leads
- [ ] Bug 2 fixed: realtor fuzzy match requires both first + last name
- [ ] Bug 3 fixed: AI prompts for realtor referral after lead creation
- [ ] Bug 4 confirmed/fixed: navigation works after lead creation
- [ ] One unified chat UI (two competing UIs reconciled — direction approved by Kyle before build)
- [ ] Audit document produced with definitive status of all major systems
- [ ] GHL webhook endpoint exists and receiving events (or confirmed not yet built)
- [ ] ~~Call transcription service~~ → Post-MVP, removed from Sprint 1 scope
- [ ] No regressions on confirmed-working features (scenarios, context retention, DTI)

---

## Test Protocol (Run After Each Fix)

1. **Lead creation:** "New lead: Sarah Johnson, purchase" → 1 contact created, AI asks for referral
2. **Duplicate prevention:** Add info about Sarah in 3 follow-up messages → still 1 contact
3. **Realtor:** "Referred by realtor Chad Anderson" → Chad Anderson created (not Chad Test)
4. **Navigation:** Confirm browser navigates to opportunity detail after creation
5. **Voice:** Record a 10-second voice message → confirm it transcribes and processes correctly
6. **Scenario:** "Give me a conventional purchase scenario, $600k, 20% down, 740 FICO" → scenario appears
7. **Context:** Ask about something unrelated, then ask about Sarah → Sarah's context is retained

---

_Sprint 1 target: 1-2 focused sessions. Audit first, then fix. Post audit doc before starting Sprint 2._
