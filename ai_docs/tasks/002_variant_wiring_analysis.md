# Variant Wiring Analysis — How Tech Does It vs How India Needs To

## The Core Architecture

The app has **two central routing files** that control what each variant sees:

```
src/config/feeds.ts    → exports FEEDS (which RSS feeds to fetch)
src/config/panels.ts   → exports DEFAULT_PANELS, DEFAULT_MAP_LAYERS (which panels to show)
src/config/index.ts    → re-exports from both files ← data-loader.ts reads from here
```

Both files use **the same pattern**: a variant ternary that selects the right config.

---

## How Tech Variant Works (working example)

### Feeds
```
feeds.ts line 731:   const TECH_FEEDS = { tech: [...], ai: [...], ... }
feeds.ts line 1175:  FEEDS = SITE_VARIANT === 'tech' ? TECH_FEEDS : ...
```
TECH_FEEDS is defined **inline** in feeds.ts. The ternary selects it.

### Panels
```
panels.ts line 194:  const TECH_PANELS = { 'live-news': {...}, tech: {...}, ai: {...}, ... }
panels.ts line 920:  DEFAULT_PANELS = SITE_VARIANT === 'tech' ? TECH_PANELS : ...
```
TECH_PANELS is defined **inline** in panels.ts. Keys like `tech`, `ai`, `startups` match the FEEDS category keys.

### Data flow
```
1. panel-layout.ts reads DEFAULT_PANELS → creates NewsPanel for each key present
2. data-loader.ts reads FEEDS → iterates Object.entries(FEEDS) → fetches RSS for each
3. data-loader.ts renders into ctx.newsPanels[category] → panel shows articles
```

**Critical**: Panel keys in DEFAULT_PANELS MUST match FEEDS category keys.

---

## How India Is Currently Wired (broken)

### Feeds ✅ (fixed)
```
india.ts:          export const FEEDS = { politics: [...], disaster: [...], ... }
feeds.ts line 1174: import { FEEDS as INDIA_FEEDS } from './variants/india';
feeds.ts line 1186: FEEDS = SITE_VARIANT === 'india' ? INDIA_FEEDS : ...
```
→ Working. FEEDS correctly resolves to India's 20 feeds.

### Per-feed fallback ✅ (fixed)
```
data-loader.ts line 312: if (SITE_VARIANT === 'india') return true;
```
→ Working. RSS proxy requests are being made.

### Panels ❌ (THE PROBLEM)
```
india.ts line 54:   export const DEFAULT_PANELS = { 'live-news': {...}, 'politics': {...}, ... }
                    ↑ THIS IS DEAD CODE — never imported by anyone!

panels.ts line 807: const INDIA_PANELS = { 'live-news': {...} }  ← only live-news!
panels.ts line 928: DEFAULT_PANELS = SITE_VARIANT === 'india' ? INDIA_PANELS : ...

config/index.ts line 41: export { DEFAULT_PANELS } from './panels';
                         ↑ reads from panels.ts, NOT from india.ts!
```

**Result**: App uses `INDIA_PANELS` from `panels.ts` which only has `live-news`. The 5 feed category panels (politics, disaster, economy, technology, government) are never created. RSS data is fetched but has no panel to render into.

---

## What india.ts DEFAULT_PANELS Actually Does

**Nothing for the app's panel-layout system.** The `india.ts` export is only used by `VARIANT_CONFIG` (line 172-178), which is metadata — it doesn't control panel creation. Panel creation is controlled entirely by `panels.ts`.

---

## The Fix

### Option A: Add panels to `panels.ts` INDIA_PANELS (recommended)
Update `INDIA_PANELS` in `panels.ts` line 807-809 to include all feed category panels:

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

### Option B: Import india.ts panels into panels.ts
Make `panels.ts` import `DEFAULT_PANELS` from `india.ts` as `INDIA_PANELS`. More complex, potential circular import risk since `india.ts` also imports from `@/types`.

**Recommendation: Option A.** Same pattern as every other variant. Simple, zero risk.

---

## Summary of All Wiring Points for a New Variant

| What | File | Pattern |
|------|------|---------|
| FEEDS (RSS sources) | `feeds.ts` | Import from variant file + add to ternary |
| DEFAULT_PANELS | `panels.ts` | Define inline + add to ternary |
| DEFAULT_MAP_LAYERS | `panels.ts` | Define inline + add to ternary |  
| MOBILE_DEFAULT_MAP_LAYERS | `panels.ts` | Define inline + add to ternary |
| Per-feed fallback | `data-loader.ts` | Add SITE_VARIANT check (only if no server digest) |
| Domain allowlist | `shared/rss-allowed-domains.json` + `api/_rss-allowed-domains.js` | Add domains to both |

The variant `.ts` file (`india.ts`) is for **defining data** (feeds, config). The **routing** happens in `feeds.ts` and `panels.ts`.
