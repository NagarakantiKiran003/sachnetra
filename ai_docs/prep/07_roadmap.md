# SachNetra — Roadmap
*Prep Document 07 | The Adapt Sprint*

---

## The Adapt Sprint Methodology

SachNetra uses "The Adapt Sprint" — a structured workflow for adapting an existing open source codebase into a new product.

Three phases:

```
Phase 1: UNDERSTAND (complete)
  Deep-read WorldMonitor codebase docs
  Made all product decisions
  Created prep documents (this folder)

Phase 2: BOOTSTRAP (James runs Task 000)
  James's AI reads prep docs + WorldMonitor codebase
  Generates workspace rules automatically
  Updates CLAUDE.md
  Project is now configured for James's IDE

Phase 3: EXECUTE (Tasks 001–007)
  Each task runs with permanent context from rules
  Each task is one focused unit of work
  Verification required before next task starts
  Tasks never combined
```

---

## Task Overview

```
Task 000 — Bootstrap & Rules Setup
Task 001 — India Variant Scaffold
Task 002 — Indian RSS Feeds
Task 003 — SachNetra Branding
Task 004 — Mobile CSS
Task 005 — Two-Summary AI Prompt
Task 006 — India Map Layers
Task 007 — State Filtering
```

**V1 ships after Task 007 is complete and verified.**

---

## Task 000 — Bootstrap & Rules Setup

**Purpose**: Configure James's IDE for SachNetra. Run this ONCE before any other task.
**[Goal: Antigravity permanently knows what SachNetra is, what to never touch, and which patterns to follow — so James never has to re-explain the project context]**

**Input documents James's AI reads**:
```
All files in ai_docs/prep/
CLAUDE.md (existing)
src/config/variants/tech.ts
src/config/variants/full.ts
src/App.ts
src/config/feeds.ts
package.json
```

**Output James's AI creates**:
```
.agents/rules/sachnetra-context.md
.agents/rules/sachnetra-boundaries.md
.agents/rules/sachnetra-patterns.md
.agents/rules/india-variant.md
CLAUDE.md (updated with SachNetra section from 03_system_design.md)
```

**Verify**: James reviews all 4 rule files.
Confirms they accurately reflect prep doc decisions.
Gets architect approval before proceeding to Task 001.

**Time estimate**: 30 minutes

---

## Task 001 — India Variant Scaffold

**Purpose**: Create the india variant and make it load.
**[Goal: The codebase recognises sachnetra.com and loads the india variant without crashing]**

**Files touched**:
```
src/config/variants/india.ts   CREATE (TypeScript) — copy tech.ts structure, empty feeds
src/App.ts                     MODIFY (TypeScript) — add sachnetra.com hostname detection
CLAUDE.md                      MODIFY (Markdown)   — append SachNetra section if not done in Task 000
```

**What "done" looks like**:
```
npm run dev
Open localhost:5173
VITE_VARIANT=india in .env.local
App loads without crash
No TypeScript errors (npm run typecheck)
Console shows: variant = 'india'
```

**DO NOT in this task**:
- Add feeds (that's Task 002)
- Change any CSS (that's Task 004)
- Modify any existing variant files

**Time estimate**: 2–3 hours

---

## Task 002 — Indian RSS Feeds

**Purpose**: Populate india.ts with Indian news sources.
**[Goal: Open the app and see Indian headlines — NDTV, The Hindu, Indian Express — not global news]**

**Prep doc to follow**: `04_data_sources.md` (complete feed list with URLs)

**Files touched**:
```
src/config/variants/india.ts    MODIFY (TypeScript)  — add FEEDS array
api/rss-proxy.js                MODIFY (JavaScript)  — add Indian domains to Vercel allowlist
scripts/ais-relay.cjs           MODIFY (JavaScript)  — add Indian domains to Railway allowlist
```

**What "done" looks like**:
```
npm run dev with VITE_VARIANT=india
Open app
News feed shows Indian headlines (NDTV, The Hindu, etc.)
No "domain not allowed" errors in console
At least 10 stories visible
npm run typecheck — zero errors
```

**DO NOT in this task**:
- Change feed display styling (Task 004)
- Modify any AI processing
- Touch any global feeds in full.ts or tech.ts

**Time estimate**: 3–4 hours

---

## Task 003 — SachNetra Branding

**Purpose**: Replace WorldMonitor branding with SachNetra visual identity.
**[Goal: Every visual touchpoint — tab, header, loading screen — says SachNetra, not WorldMonitor]**

**Brand decisions** (from `02_ui_design.md`):
```
Logo: Diya + eye mark (SVG)
Colors: Purple #7b7bff + Saffron #FF9933
Background: Deep dark #0a0812
Wordmark: SachNetra solid white
Subtitle: सच्चनेत्र (shown on loading screen only)
Tagline: See clearly
```

**Files touched**:
```
public/sachnetra-logo.svg      CREATE (SVG)        — diya + eye mark
public/favicon.ico             REPLACE (ICO)       — SachNetra favicon
src/styles/main.css            MODIFY (CSS)        — add --sn-* CSS variables
index.html                     MODIFY (HTML)       — title, meta tags, favicon link
```

**CSS variables to add**:
```css
/* SachNetra brand — add to :root */
--sn-purple: #7b7bff;
--sn-saffron: #FF9933;
--sn-dark-bg: #0a0812;
--sn-deep-bg: #0d0a1f;
--sn-card-bg: #100e24;
--sn-border: #1e1c3a;
--sn-text-primary: #e8e0ff;
--sn-text-secondary: #9090c0;
--sn-text-muted: #4a4870;
--sn-green: #22c55e;
```

**Loading screen changes**:
```
SachNetra logo (72px SVG)
"SachNetra" wordmark (24px, solid white)
"सच्चनेत्र" subtitle (13px, muted warm grey)
Date: pulled from new Date() (13px)
Time-aware greeting (21px, bold):
  5am–11am:  "Here's India this morning."
  11am–5pm:  "Here's India right now."
  5pm–10pm:  "Here's India this evening."
  10pm–5am:  "Here's India tonight."
Loading bar (purple to saffron gradient, 100px wide, 2px tall)
```

**What "done" looks like**:
```
App header shows SachNetra logo + name
Loading screen shows brand correctly
Browser tab shows SachNetra favicon
All CSS variables work in both light and dark mode
npm run typecheck — zero errors
```

**DO NOT in this task**:
- Rebuild panel layouts (Task 004)
- Change map components
- Modify AI pipeline

**Time estimate**: 4–6 hours

---

## Task 004 — Mobile CSS

**Purpose**: Make SachNetra look and feel right on mobile.
**[Goal: A user on a Redmi phone sees a clean, readable, finger-friendly news feed — not a desktop app squished onto a small screen]**

**Screen designs** (from `02_ui_design.md`):
```
Home screen:    Header → State selector → Today's Brief → Time-divided feed → Bottom nav
Story detail:   Back → Metadata → Title → What Happened → What This Means → Sources → WhatsApp button
State selector: Grid of 36 states + UTs, 2 columns
```

**Files touched**:
```
src/styles/main.css            MODIFY (CSS)        — mobile-first layout, story cards, state selector
src/app/app-context.ts         MODIFY (TypeScript) — isMobile detection if not already present
```

**Key mobile rules**:
```
Touch targets: minimum 44px height
Font: 16px body, 13px secondary, 12px meta — never below 11px
Bottom nav: 4 tabs — Home · Timeline · Map · States
Map tab: loads only when tapped, not on initial load
State selector: collapsible bar at top, expands to grid
```

**Time dividers logic**:
```typescript
function getTimeDividerLabel(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11)  return 'Yesterday';
  if (hour >= 11 && hour < 17) return 'This morning';
  if (hour >= 17 && hour < 22) return 'This afternoon';
  return 'Today';
}
```

**Story card structure**:
```
[Category badge]  [Source count badge]
[Story title — 13px bold]
[1-line plain summary — 12px muted]
[Location · Time ago]          [Thumbnail 52px]
───────────────────────────────
```

**What "done" looks like**:
```
App looks correct on 375px wide screen (iPhone SE size)
News feed scrolls smoothly
State selector opens and closes correctly
Bottom nav switches tabs correctly
Story cards readable on small screen
Map loads only when Map tab is tapped
No horizontal scroll at 375px width
```

**Time estimate**: 6–8 hours

---

## Task 005 — Two-Summary AI Prompt

**Purpose**: Modify Groq/OpenRouter to return two summaries per story.
**[Goal: Every story shows two cards — "What happened" (factual) and "What this means" (practical) — in plain calm English]**

**Prep doc to follow**: `05_ai_prompt_spec.md` (complete prompt, parsing logic, cache key)

**Files touched**:
```
api/groq-summarize.js           MODIFY (JavaScript) — new prompt, JSON output, bump cache to v4
api/openrouter-summarize.js     MODIFY (JavaScript) — same changes as groq file
src/components/StoryDetail.ts   MODIFY (TypeScript) — display both summary fields
```

**Critical**: Bump Redis cache key from v3 to v4. Old single-summary values must not be served.

**What "done" looks like**:
```
Open a story detail
See "WHAT HAPPENED" card (purple) with 2-3 sentences
See "WHAT THIS MEANS" card (green) with 1-2 sentences
Both in plain, calm English
No JSON visible in UI (properly parsed)
Redis shows v4 cache keys (not v3)
T5 fallback: shows only summary card, meaning card hidden
npm run typecheck — zero errors
```

**Time estimate**: 4–5 hours

---

## Task 006 — India Map Layers

**Purpose**: Configure map for India context.
**[Goal: Map tab opens centered on India, shows state outlines and earthquakes — no military or intelligence layers visible]**
**[⚠️ CRITICAL: Must implement Datameet GeoJSON overlay — see 06_map_layers.md Kashmir section]**

**Prep doc to follow**: `06_map_layers.md` (complete layer decisions + Kashmir compliance)

**Files touched**:
```
src/config/variants/india.ts         MODIFY (TypeScript) — DEFAULT_MAP_LAYERS, MAP_CONFIG, INDIA_BOUNDARY_OVERLAY
src/config/map-layer-definitions.ts  MODIFY (TypeScript) — add indiaStates layer entry
src/config/geo.ts                    MODIFY (TypeScript) — add INDIA_MAP_VIEW, INDIA_REGIONAL_VIEWS
public/data/india-states-official.geojson  UPLOAD to R2  — Datameet India boundaries (SoI compliant)
```

**India states GeoJSON — correct source**:
```
Source: https://github.com/datameet/maps (NOT india-states-geojson)
File: States.geojson
License: Open Data Commons ODbL (free to use)
Uses Survey of India official boundary — Kashmir shown correctly
Upload to R2: maps.sachnetra.com/india-states-official.geojson
```

**What "done" looks like**:
```
Map tab centers on India (zoom 4) when opened
India state outlines visible on map
States light up subtly when news stories mention them
Earthquake layer works (shows M4.5+ in India)
Military layers all off
No WebGL globe on mobile (flat map only)
npm run typecheck — zero errors
```

**Time estimate**: 5–6 hours

---

## Task 007 — State Filtering

**Purpose**: State selector filters news feed by selected state.
**[Goal: Tap Maharashtra — see only Maharashtra stories. Tap All India — see everything. Selection remembered across sessions.]**

**Prep doc to follow**: `04_data_sources.md` — INDIA_STATE_KEYWORDS map

**Files touched**:
```
src/config/variants/india.ts    MODIFY (TypeScript) — add INDIA_STATES list and INDIA_STATE_KEYWORDS
src/services/rss.ts             MODIFY (TypeScript) — add filterStoriesByState() function
src/components/StateSelector.ts CREATE NEW (TypeScript + CSS) — collapsible state picker UI component
src/app/app-context.ts          MODIFY (TypeScript) — add selectedState: string | null field
```

**State filter logic**:
```typescript
function filterStoriesByState(
  stories: ClusteredEvent[],
  stateCode: string | null
): ClusteredEvent[] {
  if (!stateCode) return stories; // null = All India, show everything

  const keywords = INDIA_STATE_KEYWORDS[stateCode] || [];
  return stories.filter(story =>
    keywords.some(keyword =>
      story.primaryTitle.toLowerCase().includes(keyword) ||
      story.subtext?.toLowerCase().includes(keyword)
    )
  );
}
```

**State selector UI**:
```
Default state: null (All India)
Persisted in localStorage as 'sn-selected-state'
Collapsed bar shows: [★] All India ▼ / [flag] Maharashtra ▼
Expanded: 2-column grid of all 36 states + UTs
Each shows: state name + main city
Currently selected: highlighted purple border
```

**What "done" looks like**:
```
Select Maharashtra → feed shows only Maharashtra stories
Select All India → feed shows all stories
Selection persists on page reload
State bar shows selected state name
At least 3 different states tested
npm run typecheck — zero errors
App still loads fast (<3 seconds)
```

**Time estimate**: 6–8 hours

---

## V1 Complete — Launch Criteria

V1 is ready to launch when ALL of the following are true:

```
FUNCTIONAL:
  ✓ Task 001–007 all complete and verified
  ✓ sachnetra.com loads without crash
  ✓ Indian news headlines visible on home screen
  ✓ AI summaries generating (What Happened + What This Means)
  ✓ State selector filters news correctly
  ✓ WhatsApp share button works
  ✓ Map tab loads India map correctly

PERFORMANCE:
  ✓ Page loads in < 3 seconds on 4G
  ✓ npm run typecheck — zero errors
  ✓ No console errors in production

BRAND:
  ✓ SachNetra logo visible
  ✓ Loading screen shows correctly
  ✓ No WorldMonitor branding visible to users

OPEN SOURCE:
  ✓ MIT license file present
  ✓ README credits WorldMonitor by Elie Habib
  ✓ GitHub repo is public
```

---

## V2 Backlog (After Launch)

Build these after V1 has real users and feedback:

```
RSSHub on Railway
  → PIB, MEA, MHA, NDMA press releases
  → Government sources as RSS feeds
  → James deploys Docker container, writes connectors

Related stories on story detail
  → Currently removed for V1

Mini map on story detail
  → Show where story is happening

WhatsApp brief delivery
  → Automated morning brief at 7am
  → Users opt-in via phone number

Hindi language support
  → Add hi.json locale file
  → Hindi UI labels

LAC/LOC border layers
  → Research editorial policy first
  → Source authoritative GeoJSON

State Liveability Score
  → Positive framing — higher score = better place to live
  → 4 components: Safety, Governance, Infrastructure, Economy
  → Data: NCRB annual, Cloudflare outages, startup activity signals
  → UI: 4 bars per state, no single reductive number
  → Architect must define weights before James builds

Tender & Scheme Alerts (paid feature)
  → Small businesses: GeM tenders filtered by sector/state
  → Researchers: Government scheme tracking
  → Journalists: Policy change monitoring
  → Delivery: Email digest or in-app alerts
  → Price point: ₹199–499/month
  → Requires: GeM API access, MyScheme API, notification system
```

---

## V3 Backlog (After V2 Has Users)

```
Government variant (BharatBuild or similar)
  → Schemes, tenders, auctions, good news
  → Separate brand, same codebase

Firecrawl + Gemini extraction agent
  → Scrape unstructured government sources
  → LLM extracts structured events

Knowledge graph / all-seeing eye
  → Graphiti for temporal entity relationships
  → Pattern detection across 6 months of data
  → Natural language queries

Communal incident tracker
  → Requires human review pipeline
  → Legal review before building

Internet shutdown monitor
  → SFLC.in data source
  → Significant in India context
```

---

## Time Estimates Summary

```
Task 000: Bootstrap          30 min
Task 001: Variant scaffold    2–3 hours
Task 002: RSS feeds           3–4 hours
Task 003: Branding            4–6 hours
Task 004: Mobile CSS          6–8 hours
Task 005: Two-summary AI      4–5 hours
Task 006: Map layers          5–6 hours
Task 007: State filtering     6–8 hours
─────────────────────────────────────
Total V1:                    31–41 hours
Realistic with debugging:    6–8 weeks part-time
```
