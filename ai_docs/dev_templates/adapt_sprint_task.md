# Adapt Sprint Task Generator
*Use this to generate a task file for ONE specific roadmap phase.*

---

## How To Use This

James tells the agent which task he wants:

```
"Generate the task file for Task 002 — Indian RSS Feeds"
```

The agent reads only what is needed for that task,
studies the relevant codebase files,
and generates a detailed task file.
James reviews and approves it.
Then James executes it.

---

## Step 1 — Identify The Task

Read `ai_docs/prep/07_roadmap.md`.
Find the specific task James requested.
Note:
- Task number and name
- Files to touch (listed in roadmap)
- Prep docs relevant to this task
- Depends on (which previous task must be done first)
- Estimated time

---

## Step 2 — Read Only What This Task Needs

Each task only needs specific prep docs and codebase files.
Do not read everything — only what is listed below for the requested task.

### Task 001 — India Variant Scaffold
```
Prep docs:    03_system_design.md
Codebase:     src/config/variants/tech.ts
              src/config/variants/full.ts
              src/App.ts
              CLAUDE.md
```

### Task 002 — Indian RSS Feeds
```
Prep docs:    04_data_sources.md
              03_system_design.md (CORS section)
Codebase:     src/config/variants/tech.ts (FEEDS array pattern)
              src/config/feeds.ts (Feed interface — NOT "FeedConfig", that doesn't exist)
              shared/rss-allowed-domains.json (source of truth for allowlist)
              api/_rss-allowed-domains.js (ESM copy of allowlist for Vercel edge)
```
⚠️ Allowlist architecture: `rss-proxy.js` and `ais-relay.cjs` do NOT contain inline allowlists.
They import from the files above. Only modify `shared/rss-allowed-domains.json` and `api/_rss-allowed-domains.js`.

### Task 003 — SachNetra Branding
```
Prep docs:    02_ui_design.md
Codebase:     src/styles/main.css
              index.html
              public/ (existing favicon/logo structure)
```

### Task 004 — Mobile CSS
```
Prep docs:    02_ui_design.md (home screen, story detail, state selector)
Codebase:     src/styles/main.css
              src/components/Panel.ts (base panel class)
              src/config/variants/tech.ts (DEFAULT_PANELS pattern)
```

### Task 005 — Two-Summary AI Prompt
```
Prep docs:    05_ai_prompt_spec.md
Codebase:     api/groq-summarize.js
              api/openrouter-summarize.js
              src/components/ (find where summary is displayed)
```

### Task 006 — India Map Layers
```
Prep docs:    06_map_layers.md  ← READ THE KASHMIR SECTION FIRST
              03_system_design.md (MAP_CONFIG section)
Codebase:     src/config/map-layer-definitions.ts
              src/config/variants/tech.ts (DEFAULT_MAP_LAYERS pattern)
              src/config/variants/full.ts (reference for regional views)
              src/config/geo.ts
```
⚠️ Kashmir compliance is mandatory for this task.
Read 06_map_layers.md "CRITICAL — Kashmir Boundary Compliance" section before writing any code.

### Task 007 — State Filtering
```
Prep docs:    04_data_sources.md (INDIA_STATE_KEYWORDS section)
              02_ui_design.md (state selector UI)
Codebase:     src/app/app-context.ts
              src/services/rss.ts
              src/config/variants/india.ts (current state after Task 006)
```

---

## Step 2.5 — Rules Check

Read all 4 files in `.agents/rules/`.
Compare each rule against what you actually see in the codebase for this task.

**If everything matches reality:**
Continue to Step 3 silently. No action needed.

**If you find anything wrong, missing, or outdated:**
STOP. Do not change anything yet.

Show James this exact format:

```
Rules check found [N] issue(s):

Issue 1:
  Rule file: .agents/rules/[filename].md
  Current rule says: "[quote the current rule]"
  Reality in codebase: "[what you actually found]"
  Proposed change: "[what you want to update it to]"
  Reason: "[why this matters for this task]"

Issue 2: [if any]
  ...

Do you want me to update these rules before proceeding?
Reply "yes update rules" or "skip, proceed as is".
```

Wait for James to reply before touching any rule file.

**If James says "yes update rules":**
Make only the specific changes listed above.
Then continue to Step 3.

**If James says "skip":**
Note the discrepancy in the completion log.
Continue to Step 3 using the codebase reality, not the outdated rule.

---

### The Sacred Rule — Cannot Be Changed Under Any Circumstances

This rule in `sachnetra-boundaries.md` is permanent.
Do not propose changing it. Do not ask permission to change it.
It does not matter what the codebase shows.

```
SACRED — Never write to these files:
  src/config/variants/full.ts
  src/config/variants/tech.ts
  src/config/variants/finance.ts
```

If a task ever seems to require modifying these files — stop immediately and tell James.
Something is wrong with the task, not the rule.

---

## Step 3 — Study The Codebase Pattern

Before writing the task file, answer these by reading the codebase:

1. What does the file look like RIGHT NOW that this task will modify?
2. What is the EXACT pattern to follow? Quote the relevant lines.
3. What is the interface/type definition being used?
4. Are there any dependencies or imports that need updating?

Write down what you found. This becomes the Context and Pattern sections.

---

## Step 3.5 — Variant Wiring Check

If this task adds data to a variant file (feeds, panels, map layers), verify
that the data is actually **wired** into the central routing files.
Defining data in `india.ts` is NOT enough — it must also be imported and
routed through the variant ternary in the central config files.

Check each row that applies to this task:

| What | Routing file | What to verify |
|------|-------------|----------------|
| FEEDS | `src/config/feeds.ts` | Import from variant file + ternary case added |
| DEFAULT_PANELS | `src/config/panels.ts` | Inline `INDIA_PANELS` definition + ternary case |
| DEFAULT_MAP_LAYERS | `src/config/panels.ts` | Inline definition + ternary case |
| Per-feed fallback | `src/app/data-loader.ts` | `isPerFeedFallbackEnabled()` returns `true` for this variant (no server digest) |
| Domain allowlist | `shared/rss-allowed-domains.json` + `api/_rss-allowed-domains.js` | Both files updated in sync |
| Variant detection | `src/config/variant.ts` | Hostname → variant mapping exists |

**The import chain to remember:**
```
data-loader.ts → FEEDS from @/config → config/index.ts → feeds.ts → variant ternary
panel-layout.ts → DEFAULT_PANELS from @/config → config/index.ts → panels.ts → variant ternary
```

**Dead code trap:** `india.ts` may export `DEFAULT_PANELS` but nobody imports it
for panel creation. `panels.ts` is the actual source of truth. Always trace the
import chain to confirm data reaches the consumer.

If any wiring is missing, add it to the Implementation phases.

---

## Step 4 — Generate The Task File

Save to: `ai_docs/tasks/00[N]_[task_name].md`

Use this exact structure:

---

```markdown
# Task [N] — [Task Name]
*SachNetra Adapt Sprint*

**Depends on**: Task [previous] must be complete
**Estimated time**: [from roadmap]
**Prep doc**: [which prep doc has the decisions]

---

## Context — Current State

[What does the codebase look like RIGHT NOW?
Be specific. Name files. Describe what they contain.
Example: "src/config/variants/india.ts exists with empty FEEDS array.
         api/rss-proxy.js has 150 allowed domains, no Indian sites yet."]

## What This Task Does

[One sentence per change.
Example:
  "Adds 20 Indian RSS feeds to india.ts FEEDS array."
  "Adds 19 Indian domains to api/rss-proxy.js allowlist."]

---

## Files To Open Before Starting

\`\`\`
exact/path/file1.ts   — reason
exact/path/file2.js   — reason
\`\`\`

---

## Pattern To Follow

[Quote exact existing code to model after.]

From `src/config/variants/tech.ts`, FEEDS array looks like:
\`\`\`typescript
{ name: 'TechCrunch', url: 'https://techcrunch.com/feed/',
  category: 'Tech', tier: 2, region: 'global' },
\`\`\`
Follow this exact structure. Do not invent new fields.

---

## Implementation

### Phase 1: [First group of changes]
**Goal**: [What this phase achieves]

- [ ] **Step 1.1** — [Action]
  - File: `exact/path/file.ts`
  - What to do: [Precise instruction]
  - Do not change anything else in this file.

- [ ] **Step 1.2** — [Action]
  - File: `exact/path/file.ts`
  - What to do: [Precise instruction]

### Phase 2: [Second group of changes]
**Goal**: [What this phase achieves]

- [ ] **Step 2.1** — [Action]
  - File: `exact/path/file.ts`
  - What to do: [Precise instruction]

---

## Before / After

**Before** (`[file]`):
\`\`\`typescript
[current code]
\`\`\`

**After**:
\`\`\`typescript
[code after this task]
\`\`\`

---

## Read vs Write

**READ for reference (always allowed):**
- `src/config/variants/full.ts` — study pattern, quote from it, never write
- `src/config/variants/tech.ts` — study pattern, quote from it, never write
- Any other file not listed in "Files To Open"

**WRITE only to files explicitly listed in this task:**
- [exact files this task modifies — filled in by agent]

**Never write to:**
- `src/config/variants/full.ts` — sacred, existing live variant
- `src/config/variants/tech.ts` — sacred, existing live variant
- `src/config/variants/finance.ts` — sacred, existing live variant
- [other out-of-scope files for this specific task]

---

## Verify

\`\`\`bash
npm run typecheck   # Must show: 0 errors
\`\`\`

In browser (npm run dev with VITE_VARIANT=india):
- [ ] [What to look for]
- [ ] [What to look for]
- [ ] [What to look for]

### Debugging Checklist (if something looks wrong)

Follow this sequence — it catches 90% of variant bugs:

1. **Console: `[App] Variant check:`** — confirms variant name is set
2. **Console: `[News] Digest missing for "X"`** — if categories match your FEEDS keys, routing works
3. **Console: `using per-feed fallback` vs `fallback disabled`** — confirms RSS fetching is on
4. **Network tab: filter `rss-proxy`** — zero requests = fallback disabled. Check 200 vs 403
5. **Panels visible?** — data arriving but no panels = check `panels.ts` INDIA_PANELS
6. **Clear localStorage** — `localStorage.clear(); location.reload();`

**Red herrings to ignore:**
- `[feeds] 103 unique sources / 200 total` — always shows FULL_FEEDS count, not variant
- LIVE NEWS ticker (Bloomberg/CNN) — separate live TV system, not RSS
- `india.ts` `DEFAULT_PANELS` export — dead code, not wired to panel-layout

⚠️ **After ANY change to panel definitions in `panels.ts`:**
Always tell James to run `localStorage.clear()` + hard refresh.
Panel settings are cached in localStorage and won't update without clearing.

Do not move to the next task until all checks pass.

---

## Completion Log

- [ ] Phase 1 complete — [timestamp]
- [ ] Phase 2 complete — [timestamp]
- [ ] Typecheck: 0 errors — [timestamp]
- [ ] Browser verified — [timestamp]
- [ ] **TASK [N] COMPLETE** ✅
```

---

## Step 5 — Present For Approval

Show James:

```
Task [N] — [Name]
Saved: ai_docs/tasks/00[N]_[name].md

Files changing:
  • [file1] — [what changes]
  • [file2] — [what changes]

Phases:
  Phase 1: [one line]
  Phase 2: [one line]

Time estimate: [X hours]

Say "proceed" to execute.
```

Wait for "proceed" before touching any code.

---

## Step 6 — Execute

Work phase by phase. Complete Phase 1 fully before Phase 2.
Mark each checkbox [x] with timestamp as you go.

After each phase:
```
✅ Phase [N] complete
  • [file] (+X lines) — [description]
Proceeding to Phase [N+1]...
```

After all phases:
```
✅ Task [N] — [Name] complete

Modified:
  • [file1] (+X lines): [description]
  • [file2] (+Y lines): [description]

Typecheck: ✅ 0 errors
Browser: ✅ [check passed]

Ready for Task [N+1].
```

---

## Code Quality

- TypeScript strict — no `any` unless codebase uses it
- Early returns over nested if/else
- async/await not .then() chains
- Comments explain WHY not WHAT
- No commented-out code — delete completely
- Mobile-first CSS — 375px base
- Touch targets minimum 44px
- Use --sn-* CSS variables, never hardcoded hex
- Conditional branding via `[data-variant="india"]` CSS selectors, not JS class toggling
- Hide irrelevant navigation for variant-specific brands — don't adapt, hide
- SVG favicon preferred over PNG renders (modern browser target)
- Branding is additive — new files + conditional code, never modify existing variant files

**Forbidden:**
```
npm run build   ❌
npm run dev     ❌  (James runs this himself)
```

**Allowed:**
```
npm run typecheck   ✅
Reading files       ✅
```

---

## Known Gotchas

These traps have been hit in previous tasks. Check before each task:

1. **403 from Indian RSS feeds** — Some sites block cloud server IPs. Use Google News RSS proxy:
   `news.google.com/rss/search?q=site:domain.com&hl=en&gl=IN&ceid=IN:en`
   Always try direct URL first, fall back to proxy only when blocked.

2. **SVG gradient ID conflicts** — Same SVG in multiple DOM locations = broken gradients.
   Prefix gradient IDs per context (e.g. `sn-`, `snf-`, `snl-`).

3. **Allowlist is 3 files, not 1** — Source of truth: `shared/rss-allowed-domains.json`.
   ESM copy: `api/_rss-allowed-domains.js`. CJS wrapper (don't touch): `shared/rss-allowed-domains.cjs`.
   Never edit `rss-proxy.js` or `ais-relay.cjs` for allowlist changes.

4. **`india.ts` exports can be dead code** — `DEFAULT_PANELS` in `india.ts` is metadata only.
   `panels.ts` is the actual source of truth for panel creation. Always verify the import chain.

5. **Branding lives in layout, not variant config** — Header/footer/favicon: `panel-layout.ts`,
   `main.css`, `variant-meta.ts`, `index.html`. Not in `india.ts`.

6. **Loading screen content must be inline** — Anything visible before the JS bundle loads must
   be inline HTML/CSS/JS in `index.html`, not imported from modules.

7. **localStorage caches panel settings** — After changing `panels.ts`, always clear localStorage
   and hard refresh. Stale cached settings will hide new panels.

---

## V1 Scope Guard

If any step pulls toward these — stop and tell James:

```
❌ RSSHub, Firecrawl, scraping
❌ Graph database, knowledge graph
❌ State scoring / liveability index
❌ LAC/LOC or LWE map layers
❌ Indian military bases
❌ Election monitor
❌ Hindi / regional language
❌ User accounts or auth
❌ Push notifications
```

These are V2/V3. Not now.
