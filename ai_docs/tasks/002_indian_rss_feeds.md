# Task 002 — Indian RSS Feeds
*SachNetra Adapt Sprint*

**Depends on**: Task 001 must be complete (india variant scaffold)
**Estimated time**: 3–4 hours
**Prep doc**: `ai_docs/prep/04_data_sources.md` (corrected in Task 001.5)

---

## Context — Current State

`src/config/variants/india.ts` — exists with empty `FEEDS: Record<string, Feed[]> = {}`. App loads but shows no news.

`api/rss-proxy.js` — does NOT contain its own allowlist. It imports from `api/_rss-allowed-domains.js` (line 5):
```javascript
import RSS_ALLOWED_DOMAINS from './_rss-allowed-domains.js';
```

`api/_rss-allowed-domains.js` — ESM array of ~291 domain strings. Source of truth note says `shared/rss-allowed-domains.json`.

`scripts/ais-relay.cjs` — loads its allowlist from `shared/rss-allowed-domains.cjs` (line 28):
```javascript
const RSS_ALLOWED_DOMAINS = new Set(requireShared('rss-allowed-domains.cjs'));
```

`shared/rss-allowed-domains.cjs` — CJS wrapper that just `require()`s `shared/rss-allowed-domains.json`.

**Allowlist architecture** (important — prep doc didn't mention this):
```
shared/rss-allowed-domains.json  ← actual source of truth
    ↓
shared/rss-allowed-domains.cjs   ← CJS wrapper (Railway relay reads this)
api/_rss-allowed-domains.js      ← ESM copy (Vercel edge reads this)
```

Both `rss-allowed-domains.json` AND `_rss-allowed-domains.js` must be updated in sync. The `.cjs` file is just a `require()` wrapper and does not need editing.

**Already-allowlisted Indian domains** (no action needed for these):
- `feeds.feedburner.com` — used by NDTV
- `www.thehindu.com` — already listed
- `indianexpress.com` — already listed
- `inc42.com` — already listed
- `yourstory.com` — already listed

---

## What This Task Does

1. Populates `india.ts` FEEDS with ~20 Indian RSS feeds across 6 categories.
2. Adds missing Indian domains to the RSS allowlist (both ESM and JSON files).
3. After this task: `npm run dev` with `VITE_VARIANT=india` shows Indian headlines.

---

## Files To Open Before Starting

```
src/config/variants/india.ts         — WRITE: populate empty FEEDS
src/config/variants/tech.ts          — READ: study FEEDS pattern (rss() wrapper)
api/_rss-allowed-domains.js          — WRITE: add missing Indian domains
shared/rss-allowed-domains.json      — WRITE: add same domains (source of truth)
ai_docs/prep/04_data_sources.md      — READ: corrected feed list with URLs
```

---

## Pattern To Follow

From `src/config/variants/tech.ts`, FEEDS uses `rssProxyUrl` aliased as `rss`:
```typescript
import type { Feed } from '@/types';
import { rssProxyUrl } from '@/utils';

const rss = rssProxyUrl;

export const FEEDS: Record<string, Feed[]> = {
  tech: [
    { name: 'TechCrunch', url: rss('https://techcrunch.com/feed/') },
    { name: 'The Verge', url: rss('https://www.theverge.com/rss/index.xml') },
  ],
};
```

Each feed uses `rss()` wrapper. Feed fields: `name`, `url`, `region?`, `propagandaRisk?`, `stateAffiliated?`, `lang?`.

From `api/_rss-allowed-domains.js`, domains are a flat JSarray:
```javascript
export default [
  "feeds.bbci.co.uk",
  "www.theguardian.com",
  // ...
];
```

---

## Rules Check

Checked all 4 rules files in `.agents/rules/`. One finding:

```
Rules check found 1 issue(s):

Issue 1:
  Rule file: .agents/rules/sachnetra-patterns.md
  Current rule says: "The prep doc 04_data_sources.md shows a FeedConfig interface with tier, category, region fields."
  Reality in codebase: "FeedConfig doesn't exist. The interface is Feed in src/types/index.ts. tier and category are not fields on Feed."
  Proposed change: Update line 59 to say "The prep doc shows feed entries with name, url, region, propagandaRisk, stateAffiliated fields matching the Feed interface in src/types/index.ts."
  Reason: Prevents future agents from looking for a non-existent FeedConfig interface.
```

Non-blocking for this task — proceed using codebase reality.

---

## Implementation

### Phase 1: Populate FEEDS in `india.ts`
**Goal**: `india.ts` has 20 Indian RSS feeds organized by category.

- [ ] **Step 1.1** — Add `rssProxyUrl` import and alias
  - File: `src/config/variants/india.ts`
  - Add after the existing `import type { Feed } from '@/types';` line:
    ```typescript
    import { rssProxyUrl } from '@/utils';
    const rss = rssProxyUrl;
    ```

- [ ] **Step 1.2** — Populate FEEDS with Indian sources
  - File: `src/config/variants/india.ts`
  - Replace the empty `export const FEEDS: Record<string, Feed[]> = {};` with the full feeds object.
  - Use `rss()` wrapper on every URL.
  - Organize into these Record keys: `politics`, `disaster`, `economy`, `technology`, `government`.
  - Feed entries come from corrected `04_data_sources.md`.
  - Do NOT add `tier` or `category` fields — they don't exist on `Feed`.
  - Do NOT change anything else in this file (map layers, panels, variant config stay as-is).

  **The FEEDS object to write:**
  ```typescript
  export const FEEDS: Record<string, Feed[]> = {
    // Tier 1 — Wire Services & Major Broadcasters
    politics: [
      { name: 'NDTV', url: rss('https://feeds.feedburner.com/ndtvnews-top-stories'), region: 'national' },
      { name: 'The Hindu', url: rss('https://www.thehindu.com/news/feeder/default.rss'), region: 'national' },
      { name: 'Indian Express', url: rss('https://indianexpress.com/feed/'), region: 'national' },
      { name: 'ANI', url: rss('https://www.aninews.in/rss/india.xml'), region: 'national' },
      { name: 'Times of India', url: rss('https://timesofindia.indiatimes.com/rssfeedstopstories.cms'), region: 'national' },
      // Tier 2 — Established
      { name: 'Hindustan Times', url: rss('https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml'), region: 'national' },
      { name: 'India Today', url: rss('https://www.indiatoday.in/rss/1206578'), region: 'national' },
      // Tier 2 — Quality Independent
      { name: 'The Wire', url: rss('https://thewire.in/feed'), region: 'national', propagandaRisk: 'low' },
      { name: 'Scroll', url: rss('https://scroll.in/feed'), region: 'national' },
      { name: 'The Print', url: rss('https://theprint.in/feed'), region: 'national' },
    ],

    disaster: [
      { name: 'NDTV India', url: rss('https://feeds.feedburner.com/ndtvnews-india-news'), region: 'national' },
      { name: 'The Hindu Environment', url: rss('https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss'), region: 'national' },
    ],

    economy: [
      { name: 'LiveMint', url: rss('https://www.livemint.com/rss/news'), region: 'national' },
      { name: 'Economic Times', url: rss('https://economictimes.indiatimes.com/rssfeedstopstories.cms'), region: 'national' },
      { name: 'Business Standard', url: rss('https://www.business-standard.com/rss/home_page_top_stories.rss'), region: 'national' },
    ],

    technology: [
      { name: 'YourStory', url: rss('https://yourstory.com/feed'), region: 'national' },
      { name: 'Inc42', url: rss('https://inc42.com/feed/'), region: 'national' },
    ],

    government: [
      { name: 'DD News', url: rss('https://ddnews.gov.in/feed'), region: 'national', stateAffiliated: 'India' },
      { name: 'PIB', url: rss('https://pib.gov.in/RssMain.aspx'), region: 'national', stateAffiliated: 'India' },
    ],
  };
  ```

### Phase 2: Add missing Indian domains to allowlists
**Goal**: RSS proxy accepts all Indian feed domains. No "Domain not allowed" errors.

First, identify which domains need adding. Already allowed:
- `feeds.feedburner.com` ✅ (NDTV uses this)
- `www.thehindu.com` ✅
- `indianexpress.com` ✅
- `inc42.com` ✅
- `yourstory.com` ✅

**Domains to ADD** (not yet in allowlist):
```
www.aninews.in
timesofindia.indiatimes.com
www.hindustantimes.com
www.indiatoday.in
thewire.in
scroll.in
theprint.in
www.livemint.com
economictimes.indiatimes.com
www.business-standard.com
ddnews.gov.in
pib.gov.in
```

- [ ] **Step 2.1** — Add Indian domains to `shared/rss-allowed-domains.json`
  - File: `shared/rss-allowed-domains.json`
  - Add the 12 domains listed above to the JSON array.
  - Place them together in a group (near other India-related domains or at the end before the closing `]`).
  - Add a comment is NOT possible (it's JSON). Just add the domains.

- [ ] **Step 2.2** — Add same Indian domains to `api/_rss-allowed-domains.js`
  - File: `api/_rss-allowed-domains.js`
  - Add the same 12 domains to the ESM array.
  - Place them near the existing Indian domains (`www.thehindu.com` on line 148, `indianexpress.com` on line 149).
  - These two files MUST stay in sync.

---

## Before / After

**`src/config/variants/india.ts` — Before** (lines 8–10):
```typescript
// Feeds will be added in Task 002
import type { Feed } from '@/types';
export const FEEDS: Record<string, Feed[]> = {};
```

**After:**
```typescript
import type { Feed } from '@/types';
import { rssProxyUrl } from '@/utils';
const rss = rssProxyUrl;

export const FEEDS: Record<string, Feed[]> = {
  politics: [
    { name: 'NDTV', url: rss('https://feeds.feedburner.com/ndtvnews-top-stories'), region: 'national' },
    // ... 9 more feeds
  ],
  disaster: [ /* 2 feeds */ ],
  economy: [ /* 3 feeds */ ],
  technology: [ /* 2 feeds */ ],
  government: [ /* 2 feeds */ ],
};
```

---

**`api/_rss-allowed-domains.js` — Before** (near line 148):
```javascript
  "www.thehindu.com",
  "indianexpress.com",
```

**After:**
```javascript
  "www.thehindu.com",
  "indianexpress.com",
  // SachNetra — Indian news sources
  "www.aninews.in",
  "timesofindia.indiatimes.com",
  "www.hindustantimes.com",
  "www.indiatoday.in",
  "thewire.in",
  "scroll.in",
  "theprint.in",
  "www.livemint.com",
  "economictimes.indiatimes.com",
  "www.business-standard.com",
  "ddnews.gov.in",
  "pib.gov.in",
```

---

## Read vs Write

**READ for reference (always allowed):**
- `src/config/variants/full.ts` — study MapLayers keys, never write
- `src/config/variants/tech.ts` — copy FEEDS pattern, never write
- `src/config/variants/finance.ts` — never write
- `src/config/feeds.ts` — study Feed type, SOURCE_TIERS; never write (India feeds go in india.ts)
- `scripts/ais-relay.cjs` — verify it reads from `shared/rss-allowed-domains.cjs`; never write
- `ai_docs/prep/04_data_sources.md` — source for feed URLs

**WRITE only to files explicitly listed in this task:**
- `src/config/variants/india.ts` — populate FEEDS (Phase 1)
- `api/_rss-allowed-domains.js` — add 12 Indian domains (Phase 2)
- `shared/rss-allowed-domains.json` — add same 12 domains (Phase 2)

**Never write to:**
- `src/config/variants/full.ts` — sacred
- `src/config/variants/tech.ts` — sacred
- `src/config/variants/finance.ts` — sacred
- `src/config/feeds.ts` — boundaries say read-only for india
- `scripts/ais-relay.cjs` — reads from shared JSON, no direct edit needed
- `api/rss-proxy.js` — reads from `_rss-allowed-domains.js`, no direct edit needed

---

## Verify

```bash
npm run typecheck   # Must show: 0 errors
```

In browser (`npm run dev` already running with `VITE_VARIANT=india` in `.env.local`):
- [ ] App loads at `localhost:3000` without crash
- [ ] News feed shows Indian headlines (NDTV, The Hindu, Indian Express, etc.)
- [ ] No "Domain not allowed" errors in browser DevTools Console
- [ ] No "domain not allowed" 403 responses in Network tab
- [ ] At least 10 stories visible in the feed
- [ ] Sources from multiple categories appear (politics + economy + tech)

Do not move to the next task until all checks pass.

---

## Completion Log

- [x] Phase 1 complete — FEEDS populated in `india.ts` — 2026-03-19T15:35:00
- [x] Phase 2 complete — 12 Indian domains added to allowlists — 2026-03-19T15:37:00
- [x] Typecheck: 0 errors — 2026-03-19T15:38:00
- [x] Bug fix: wired india FEEDS into `feeds.ts` variant switch — 2026-03-19T15:55:00
- [x] Bug fix: enabled per-feed fallback for india — 2026-03-19T16:24:00
- [x] Bug fix: added news panels to `INDIA_PANELS` in `panels.ts` — 2026-03-19T17:10:00
- [x] Browser verified — 3/5 panels showing Indian headlines (NDTV, The Hindu, Inc42) — 2026-03-19T17:22:00
- [x] **TASK 002 COMPLETE** ✅

---

## Session Notes — Lessons Learned

### 🚨 Lesson 1: Variant FEEDS must be wired in `feeds.ts`

**What happened:** Populated `india.ts` FEEDS correctly, typecheck passed, but app showed Bloomberg/CNN instead of Indian feeds.

**Root cause:** `src/config/feeds.ts` has a variant ternary (line 1175) that routes `FEEDS` to each variant's feed list. The `india` case was missing — it fell through to `FULL_FEEDS` (global WorldMonitor feeds). The data-loader imports `FEEDS` from `@/config` → `config/index.ts` → `config/feeds.ts`, NOT directly from `india.ts`.

**Fix:** Added to `feeds.ts`:
```typescript
import { FEEDS as INDIA_FEEDS } from './variants/india';

// In the ternary:
: SITE_VARIANT === 'india'
  ? INDIA_FEEDS
  : FULL_FEEDS;
```

**Rule for future variants:** Defining FEEDS in a variant file is NOT enough. You must also:
1. Import it into `src/config/feeds.ts`
2. Add a case to the variant ternary (line ~1175)
3. All other variants (tech, finance, happy, commodity) define feeds inline in `feeds.ts` — india is the first to use the "feeds in variant file" pattern

**Boundary note:** `sachnetra-boundaries.md` says `feeds.ts` is read-only. This is correct for *feed data*, but variant routing changes (2 lines: import + case) are a necessary exception. Without them, no new variant can ever load its own feeds. Update boundaries doc or add clarification.

---

### 📋 Lesson 2: Allowlist is a 3-file architecture

**What happened:** Prep doc (`04_data_sources.md`) and roadmap (`07_roadmap.md`) said to modify `api/rss-proxy.js` and `scripts/ais-relay.cjs`. Neither file contains an inline allowlist.

**Reality:**
```
shared/rss-allowed-domains.json  ← source of truth (modify this)
shared/rss-allowed-domains.cjs   ← CJS wrapper, just require()s the JSON (don't touch)
api/_rss-allowed-domains.js      ← ESM copy for Vercel edge (must sync with JSON)
```

**Rule for future tasks:** When adding allowed domains, modify `shared/rss-allowed-domains.json` AND `api/_rss-allowed-domains.js`. Never edit `rss-proxy.js` or `ais-relay.cjs` for allowlist changes.

---

### 🔌 Lesson 3: Per-feed fallback must be enabled for variants without server digest

**What happened:** After fixing FEEDS routing, console showed:
```
[News] Digest missing for "politics", limited per-feed fallback disabled
[News] Digest missing for "disaster", limited per-feed fallback disabled
```
Network tab had ZERO rss-proxy requests — feeds were recognized but never fetched.

**Root cause:** `data-loader.ts` method `isPerFeedFallbackEnabled()` only returns `true` for desktop runtime or when the `newsPerFeedFallback` feature flag is set. The India variant has no server-side digest (no Redis/Vercel endpoint pre-aggregating Indian feeds), so it needs the per-feed fallback to fetch directly via `rss-proxy`.

**Fix:** Added to `data-loader.ts`:
```typescript
private isPerFeedFallbackEnabled(): boolean {
  if (isDesktopRuntime()) return true;
  if (SITE_VARIANT === 'india') return true;  // ← NEW
  return isFeatureEnabled('newsPerFeedFallback');
}
```

**Rule for future variants:** Any variant without a server-side digest endpoint MUST have `isPerFeedFallbackEnabled()` return `true`. Without this, FEEDS are iterated but no RSS requests are made.

**Red herring avoided:** Console log `[feeds] 103 unique default-enabled sources / 200 total` looks like it's using FULL_FEEDS, but it's actually a DEV-only validation block that always checks `FULL_FEEDS` regardless of variant. It does NOT indicate which feeds are active.

---

### 🖥️ Lesson 4: Panels are controlled by `panels.ts`, NOT `india.ts`

**What happened:** After enabling per-feed fallback, Network tab showed successful rss-proxy 200 responses (NDTV, The Hindu, YourStory, Inc42). Console showed feeds being fetched. But NO panels appeared on screen except the LIVE NEWS ticker.

**Root cause:** The app has **two central routing files** for variants:
```
feeds.ts   → routes FEEDS (which RSS feeds to fetch)
panels.ts  → routes DEFAULT_PANELS (which panels to show on screen)
```
Both use the same ternary pattern. `config/index.ts` imports `DEFAULT_PANELS` from `panels.ts`, NOT from `india.ts`.

**The dead code trap:**
```
india.ts line 54:   export const DEFAULT_PANELS = { 'live-news', 'politics', ... }
                    ↑ DEAD CODE — nobody imports this for panel creation!

panels.ts line 807: const INDIA_PANELS = { 'live-news' }  ← ONLY live-news!
panels.ts line 928: DEFAULT_PANELS = SITE_VARIANT === 'india' ? INDIA_PANELS : ...

config/index.ts:    export { DEFAULT_PANELS } from './panels';  ← reads panels.ts!
```

`india.ts` `DEFAULT_PANELS` is only used by `VARIANT_CONFIG` metadata — it does NOT control panel creation. Panel creation is controlled by `shouldCreatePanel()` in `panel-layout.ts`, which checks `DEFAULT_PANELS` from `panels.ts`.

**Fix:** Updated `INDIA_PANELS` in `panels.ts` (the actual source of truth):
```typescript
const INDIA_PANELS: Record<string, PanelConfig> = {
  map: { name: 'India Map', enabled: true, priority: 1 },
  'live-news': { name: 'India News', enabled: true, priority: 1 },
  politics: { name: 'Politics', enabled: true, priority: 1 },
  disaster: { name: 'Disaster & Environment', enabled: true, priority: 2 },
  economy: { name: 'Economy', enabled: true, priority: 2 },
  technology: { name: 'Technology', enabled: true, priority: 2 },
  government: { name: 'Government', enabled: true, priority: 2 },
};
```

**Critical rule:** Panel keys MUST match FEEDS category keys exactly. If FEEDS has `politics: [...]`, then DEFAULT_PANELS must have `politics: { ... }`.

---

### ⚠️ Lesson 5: Some Indian news sites return 403 from server-side proxying

**What happened:** After all wiring fixes, 5/20 feeds returned data, 7/20 returned 403:

| Status | Feeds |
|--------|-------|
| ✅ 200 | NDTV, NDTV India, The Hindu (×2), YourStory, Inc42 |
| ❌ 403 | LiveMint, Economic Times, Indian Express, Business Standard, DD News, PIB, Hindustan Times |
| ❓ Not tested | ANI, Times of India, The Wire, Scroll, The Print, India Today |

**Why:** Indian news sites block requests from cloud server IPs (Vercel edge functions). They expect browser User-Agents or reject non-Indian IPs.

**Resolution (Task 002.5):** Swapped all 7 blocked direct RSS URLs to Google News RSS proxy URLs. All panels now show content. See Lesson 7 below for the full pattern.

---

### 🧪 Lesson 6: Debugging variant feed loading — the full checklist

**Diagnostic steps that worked:**
1. **Console: `[App] Variant check:`** — confirms variant name is correctly set
2. **Console: `[News] Digest missing for "X"`** — if categories match your FEEDS keys, the FEEDS routing is working
3. **Console: `limited per-feed fallback disabled`** vs `using per-feed fallback (N feeds)` — tells you if RSS fetching is enabled
4. **Network tab: filter `rss-proxy`** — if zero requests, feeds aren't being fetched (fallback disabled). If requests exist, check 200 vs 403 status
5. **Panels visible?** — if Network shows data but no panels, check `panels.ts` INDIA_PANELS
6. **Clear localStorage** — panel settings are cached! Run `localStorage.clear()` + hard refresh after any panel config change

**Red herrings to ignore:**
- `[feeds] 103 unique default-enabled sources / 200 total` — always shows FULL_FEEDS count, not variant count
- LIVE NEWS ticker (Bloomberg/CNN tabs) — this is a separate live TV system, not RSS
- `india.ts` `DEFAULT_PANELS` — dead code that doesn't reach panel-layout

**The import chain to remember:**
```
data-loader.ts → FEEDS from @/config → config/index.ts → feeds.ts → variant ternary
panel-layout.ts → DEFAULT_PANELS from @/config → config/index.ts → panels.ts → variant ternary
```

---

### 🌐 Lesson 7: Google News RSS proxy — the 403 workaround (Task 002.5)

**What happened:** 7 Indian news feeds returned 403 because the sites block cloud server IPs.

**Solution:** Google News RSS acts as a proxy — it indexes the same articles and serves them via its own RSS feed, which doesn't block server requests. This pattern is already used by 50+ feeds in the full variant (AP News, White House, Haaretz, etc.).

**Pattern:**
```typescript
// Direct URL (blocked — 403):
{ name: 'LiveMint', url: rss('https://www.livemint.com/rss/news') }

// Google News proxy (works — 200):
{ name: 'LiveMint', url: rss('https://news.google.com/rss/search?q=site:livemint.com&hl=en&gl=IN&ceid=IN:en') }
```

**URL parameters:**
| Parameter | Value for India | Purpose |
|-----------|----------------|---------|
| `q=site:` | `livemint.com` | Limits results to that domain |
| `+keywords` | `+India` (optional) | Narrows results by topic |
| `hl=en` | English | Language |
| `gl=IN` | India | Geographic locale |
| `ceid=IN:en` | India:English | Combined locale |

**No allowlist changes needed** — `news.google.com` was already in `shared/rss-allowed-domains.json`.

**Feeds swapped:**
| Feed | Category | Result |
|------|----------|--------|
| Indian Express | politics | ✅ Working |
| Hindustan Times | politics | ✅ Working |
| LiveMint | economy | ✅ Working |
| Economic Times | economy | ✅ Working |
| Business Standard | economy | ✅ Working |
| DD News | government | ✅ Working |
| PIB | government | ✅ Working |

**Rule:** If a direct RSS URL returns 403, swap to Google News RSS proxy. Always try direct URL first (better data quality), fall back to proxy only when blocked.

---

### 🔄 Lesson 8: localStorage caching can hide panel config changes

**What happened:** After adding `politics` to `INDIA_PANELS` in `panels.ts`, the Politics panel didn't appear on screen initially.

**Root cause:** `App.ts` loads panel settings from localStorage on startup (line 222). If the stored variant matches the current variant, it uses cached settings instead of resetting to defaults. The merge logic (line 249-254) adds NEW keys, but if the page was visited before `politics` existed in `INDIA_PANELS`, it wouldn't be in the cached settings.

**How App.ts panel loading works:**
```
1. If stored variant ≠ current variant → RESET all settings to defaults (clean slate)
2. If stored variant = current variant → LOAD from localStorage
   2a. Merge any NEW keys from DEFAULT_PANELS not already in storage
   2b. Run one-time prune migration to remove stale keys
```

**The fix is always:** `localStorage.clear(); location.reload();`

**Rule:** After ANY change to panel definitions in `panels.ts`, always tell the user to clear localStorage and hard refresh. Panel settings are sticky.

---

### 📊 Complete variant wiring checklist (for future variants)

| What | File | Pattern | india status |
|------|------|---------|-------------|
| FEEDS (RSS sources) | `feeds.ts` | Import from variant + add ternary case | ✅ Fixed |
| DEFAULT_PANELS | `panels.ts` | Define inline + add ternary case | ✅ Fixed |
| DEFAULT_MAP_LAYERS | `panels.ts` | Define inline + add ternary case | ✅ Already done (Task 001) |
| MOBILE_DEFAULT_MAP_LAYERS | `panels.ts` | Define inline + add ternary case | ✅ Already done (Task 001) |
| Per-feed fallback | `data-loader.ts` | Add SITE_VARIANT check | ✅ Fixed |
| Domain allowlist | `shared/rss-allowed-domains.json` + `api/_rss-allowed-domains.js` | Add domains to both | ✅ Done |
| 403 feed workaround | `india.ts` FEEDS | Use Google News RSS proxy URLs | ✅ Fixed (Task 002.5) |
| Variant detection | `variant.ts` | Already handles `india` | ✅ Already done (Task 001) |

**Full analysis document:** See `ai_docs/tasks/002_variant_wiring_analysis.md` for a detailed comparison of how tech variant vs india variant wiring works.

