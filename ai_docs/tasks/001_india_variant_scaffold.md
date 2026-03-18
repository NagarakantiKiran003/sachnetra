# Task 001 — India Variant Scaffold
*SachNetra Adapt Sprint*

**Depends on**: Task 000 must be complete (bootstrap rules + CLAUDE.md)
**Estimated time**: 2–3 hours
**Prep doc**: `ai_docs/prep/03_system_design.md`

---

## Context — Current State

`src/config/variants/india.ts` — **does not exist yet**. Must be created.

`src/App.ts` — does not detect `sachnetra.com` hostname or return `'india'`. The variant detection lives in `src/config/variant.ts` (runtime) and `src/App.ts` is where we add the hostname guard per the rules.

`src/config/variant.ts` — the `SITE_VARIANT` IIFE resolves the variant at runtime. The `buildVariant` path at line 3 reads `import.meta.env?.VITE_VARIANT`, so setting `VITE_VARIANT=india` in `.env.local` already works for local dev. The `localhost` branch (line 25–29) only whitelists `tech/full/finance/happy/commodity` — `india` is NOT in that list. However, because `VITE_VARIANT` is baked at build time, the `buildVariant` fallback covers local dev. The `sachnetra.com` hostname detection must be added so production works.

`CLAUDE.md` — already contains the SachNetra section (added in Task 000). No further changes needed.

`.env.local` — already contains `VITE_VARIANT=india`. App loads with india variant in dev.

**⚠️ Rules check finding (non-blocking)**:
The `india-variant.md` rule says to add hostname detection in `App.ts`, but detection actually happens in `src/config/variant.ts` (not `App.ts`). The rule's code snippet is correct in spirit but the wrong file. We add it to `variant.ts` where all the other hostname checks live. No rule update needed for this task — just follow codebase reality.

---

## What This Task Does

1. Creates `src/config/variants/india.ts` — empty FEEDS, minimal panels, all map layers `false` — enough for the app to load without crashing.
2. Modifies `src/config/variant.ts` — adds `sachnetra.com` hostname detection so production variant resolves to `'india'`.
3. Adds `'india'` to the `localhost` localStorage whitelist in `variant.ts` so `localStorage.setItem('worldmonitor-variant', 'india')` works in browser DevTools (useful for quick testing without rebuilding).

---

## Files To Open Before Starting

```
src/config/variants/tech.ts       — structure to copy exactly (FEEDS, DEFAULT_PANELS, DEFAULT_MAP_LAYERS, MOBILE_DEFAULT_MAP_LAYERS, VARIANT_CONFIG)
src/config/variants/base.ts       — VariantConfig interface, STORAGE_KEYS (read only)
src/config/variant.ts             — where SITE_VARIANT is resolved; where to add sachnetra.com detection
src/App.ts                        — verify no additional changes needed here (spoiler: they are not)
CLAUDE.md                         — confirm SachNetra section is present
```

---

## Pattern To Follow

From `src/config/variants/tech.ts`, the top-of-file structure:
```typescript
// Tech/AI variant - tech.worldmonitor.app
import type { PanelConfig, MapLayers } from '@/types';
import type { VariantConfig } from './base';

// Re-export base config
export * from './base';

// Variant-specific FEEDS configuration
import type { Feed } from '@/types';
import { rssProxyUrl } from '@/utils';

const rss = rssProxyUrl;

export const FEEDS: Record<string, Feed[]> = {
  tech: [
    { name: 'TechCrunch', url: rss('https://techcrunch.com/feed/') },
    ...
  ],
};
```

From `src/config/variants/tech.ts`, the `VARIANT_CONFIG` export:
```typescript
export const VARIANT_CONFIG: VariantConfig = {
  name: 'tech',
  description: 'Tech, AI & Startups intelligence dashboard',
  panels: DEFAULT_PANELS,
  mapLayers: DEFAULT_MAP_LAYERS,
  mobileMapLayers: MOBILE_DEFAULT_MAP_LAYERS,
};
```

From `src/config/variant.ts`, the existing hostname detection pattern:
```typescript
const h = location.hostname;
if (h.startsWith('tech.')) return 'tech';
if (h.startsWith('finance.')) return 'finance';
if (h.startsWith('happy.')) return 'happy';
if (h.startsWith('commodity.')) return 'commodity';
```

Follow this exact pattern. Do not invent new detection logic.

The `MapLayers` interface (`src/types`) has ~40+ boolean fields. For `india.ts`, copy all keys from `tech.ts`'s `DEFAULT_MAP_LAYERS` and set **all to `false`** except keep `weather: true` and `natural: true` as safe, non-political defaults.

---

## Implementation

### Phase 1: Create `src/config/variants/india.ts`

**Goal**: New file that gives the app a valid variant to load. No feeds yet. Console must log `variant = 'india'`.

- [ ] **Step 1.1** — Create the file
  - File: `src/config/variants/india.ts`
  - What to do: Create from scratch, modelling the structure of `tech.ts` exactly.
  - Top-of-file comment: `// India variant - sachnetra.com`
  - Imports: same as `tech.ts` top section (`PanelConfig`, `MapLayers`, `VariantConfig`, `Feed`, `rssProxyUrl`)
  - `export * from './base';`

- [ ] **Step 1.2** — Add empty FEEDS
  - In `india.ts`, add:
    ```typescript
    // Feeds will be added in Task 002
    export const FEEDS: Record<string, Feed[]> = {};
    ```
  - Do not add any feed URLs here. That is Task 002.

- [ ] **Step 1.3** — Add DEFAULT_PANELS
  - In `india.ts`, add a minimal `DEFAULT_PANELS` with only `'live-news'` enabled:
    ```typescript
    export const DEFAULT_PANELS: Record<string, PanelConfig> = {
      'live-news': { name: 'India News', enabled: true, priority: 1 },
    };
    ```
  - All other panels disabled for now. More panels will be configured in later tasks.

- [ ] **Step 1.4** — Add DEFAULT_MAP_LAYERS and MOBILE_DEFAULT_MAP_LAYERS
  - Copy the full `DEFAULT_MAP_LAYERS` object key list from `tech.ts`.
  - Set **all keys to `false`** except `weather: true` and `natural: true`.
  - Do the same for `MOBILE_DEFAULT_MAP_LAYERS` — all `false`.
  - Do NOT add `startupHubs`, `cloudRegions`, `techHQs`, `techEvents` — copy the exact same keys as `tech.ts` (they are base `MapLayers` fields, just set them all `false`).

- [ ] **Step 1.5** — Add VARIANT_CONFIG
  - ```typescript
    export const VARIANT_CONFIG: VariantConfig = {
      name: 'india',
      description: 'SachNetra — Indian news clarity tool',
      panels: DEFAULT_PANELS,
      mapLayers: DEFAULT_MAP_LAYERS,
      mobileMapLayers: MOBILE_DEFAULT_MAP_LAYERS,
    };
    ```

### Phase 2: Wire `sachnetra.com` detection in `variant.ts`

**Goal**: Production hostname `sachnetra.com` (and subdomains) resolves to `'india'`. Local dev via `VITE_VARIANT=india` already works.

- [ ] **Step 2.1** — Add hostname check in `src/config/variant.ts`
  - File: `src/config/variant.ts`
  - Find the block (lines 20–23) that checks `h.startsWith(...)`:
    ```typescript
    if (h.startsWith('tech.')) return 'tech';
    if (h.startsWith('finance.')) return 'finance';
    if (h.startsWith('happy.')) return 'happy';
    if (h.startsWith('commodity.')) return 'commodity';
    ```
  - Add ONE line immediately after the `commodity` check:
    ```typescript
    if (h.includes('sachnetra')) return 'india';
    ```
  - This matches `sachnetra.com`, `www.sachnetra.com`, and any `sachnetra-*.vercel.app` preview URLs.
  - Do not change anything else in this file.

- [ ] **Step 2.2** — Add `'india'` to the `localhost` localStorage whitelist in `variant.ts`
  - Find line 27:
    ```typescript
    if (stored === 'tech' || stored === 'full' || stored === 'finance' || stored === 'happy' || stored === 'commodity') return stored;
    ```
  - Add `|| stored === 'india'` to the condition:
    ```typescript
    if (stored === 'tech' || stored === 'full' || stored === 'finance' || stored === 'happy' || stored === 'commodity' || stored === 'india') return stored;
    ```
  - This enables testing via `localStorage.setItem('worldmonitor-variant', 'india')` in DevTools on localhost without a rebuild.
  - Do not change anything else in this file.

### Phase 3: Wire `india` into `src/config/panels.ts`

**Goal**: `DEFAULT_PANELS`, `DEFAULT_MAP_LAYERS`, and `MOBILE_DEFAULT_MAP_LAYERS` resolve to india data when `SITE_VARIANT === 'india'`.

`panels.ts` uses a **chained ternary** (NOT a switch) starting at line 807. The pattern is:
```typescript
export const DEFAULT_PANELS = SITE_VARIANT === 'happy'
  ? HAPPY_PANELS
  : SITE_VARIANT === 'tech'
    ? TECH_PANELS
    : SITE_VARIANT === 'finance'
      ? FINANCE_PANELS
      : SITE_VARIANT === 'commodity'
        ? COMMODITY_PANELS
        : FULL_PANELS;
```

- [ ] **Step 3.1** — Add `INDIA_PANELS`, `INDIA_MAP_LAYERS`, `INDIA_MOBILE_MAP_LAYERS` constants in `panels.ts`
  - File: `src/config/panels.ts`
  - Add three new constants immediately after the `COMMODITY_MOBILE_MAP_LAYERS` block (around line 802), before the "VARIANT-AWARE EXPORTS" section.
  - Follow the same structure as `TECH_PANELS`/`TECH_MAP_LAYERS`/`TECH_MOBILE_MAP_LAYERS`.
  - `INDIA_PANELS`: only `'live-news': { name: 'India News', enabled: true, priority: 1 }` for now.
  - `INDIA_MAP_LAYERS` and `INDIA_MOBILE_MAP_LAYERS`: copy all keys from `TECH_MAP_LAYERS`; set **all to `false`** except `weather: true` and `natural: true`.

- [ ] **Step 3.2** — Extend the three chained ternaries
  - File: `src/config/panels.ts`, lines 807–835.
  - For **each** of the three ternaries (`DEFAULT_PANELS`, `DEFAULT_MAP_LAYERS`, `MOBILE_DEFAULT_MAP_LAYERS`), add `india` between `commodity` and the final `FULL_*` fallback.
  - Pattern (same for all three):
    ```typescript
    // Before:
    : SITE_VARIANT === 'commodity'
      ? COMMODITY_PANELS
      : FULL_PANELS;

    // After:
    : SITE_VARIANT === 'commodity'
      ? COMMODITY_PANELS
      : SITE_VARIANT === 'india'
        ? INDIA_PANELS
        : FULL_PANELS;
    ```
  - Repeat for `DEFAULT_MAP_LAYERS` and `MOBILE_DEFAULT_MAP_LAYERS` using `INDIA_MAP_LAYERS` / `INDIA_MOBILE_MAP_LAYERS`.
  - Do not change any other line in this file.

---

## Before / After

**`src/config/variant.ts` — Before** (lines 20–29):
```typescript
if (h.startsWith('tech.')) return 'tech';
if (h.startsWith('finance.')) return 'finance';
if (h.startsWith('happy.')) return 'happy';
if (h.startsWith('commodity.')) return 'commodity';

if (h === 'localhost' || h === '127.0.0.1') {
  const stored = localStorage.getItem('worldmonitor-variant');
  if (stored === 'tech' || stored === 'full' || stored === 'finance' || stored === 'happy' || stored === 'commodity') return stored;
  return buildVariant;
}
```

**`src/config/variant.ts` — After**:
```typescript
if (h.startsWith('tech.')) return 'tech';
if (h.startsWith('finance.')) return 'finance';
if (h.startsWith('happy.')) return 'happy';
if (h.startsWith('commodity.')) return 'commodity';
if (h.includes('sachnetra')) return 'india';

if (h === 'localhost' || h === '127.0.0.1') {
  const stored = localStorage.getItem('worldmonitor-variant');
  if (stored === 'tech' || stored === 'full' || stored === 'finance' || stored === 'happy' || stored === 'commodity' || stored === 'india') return stored;
  return buildVariant;
}
```

---

**`src/config/panels.ts` — Before** (each of the three ternaries ends the same way):
```typescript
: SITE_VARIANT === 'commodity'
  ? COMMODITY_PANELS
  : FULL_PANELS;
```

**`src/config/panels.ts` — After**:
```typescript
: SITE_VARIANT === 'commodity'
  ? COMMODITY_PANELS
  : SITE_VARIANT === 'india'
    ? INDIA_PANELS
    : FULL_PANELS;
```
*(Repeat for `DEFAULT_MAP_LAYERS` and `MOBILE_DEFAULT_MAP_LAYERS` using their respective india constants.)*

---

## Read vs Write

**READ for reference (always allowed):**
- `src/config/variants/full.ts` — study MapLayers keys, never write
- `src/config/variants/tech.ts` — copy structure, never write
- `src/config/variants/base.ts` — study VariantConfig type, never write
- `src/App.ts` — verify no changes needed here

**WRITE only to files explicitly listed in this task:**
- `src/config/variants/india.ts` — NEW file (Phase 1)
- `src/config/variant.ts` — sachnetra.com detection + localhost whitelist (Phase 2)
- `src/config/panels.ts` — INDIA_PANELS/INDIA_MAP_LAYERS constants + ternary extension (Phase 3)

**Never write to:**
- `src/config/variants/full.ts` — sacred
- `src/config/variants/tech.ts` — sacred
- `src/config/variants/finance.ts` — sacred
- `src/App.ts` — no changes needed; detection is in `variant.ts`

---

## Verify

```bash
npm run typecheck   # Must show: 0 errors
```

In browser (`npm run dev` already running with `VITE_VARIANT=india` in `.env.local`):
- [ ] App loads at `localhost:5173` without crash or blank screen
- [ ] Browser DevTools Console shows: `[App] Variant check: stored="...", current="india"`
- [ ] No TypeScript errors in the editor

---

## Completion Log

- [x] Phase 1 complete — `india.ts` created — 2026-03-18T10:02:00
- [x] Phase 2 complete — `variant.ts` sachnetra detection added — 2026-03-18T10:10:00
- [x] Phase 3 complete — `panels.ts` india case wired — 2026-03-18T10:20:00
- [x] Typecheck: 0 errors — 2026-03-18T10:20:00
- [x] Browser verified — console shows `current="india"` — 2026-03-18T15:37:00
- [x] **TASK 001 COMPLETE** ✅
