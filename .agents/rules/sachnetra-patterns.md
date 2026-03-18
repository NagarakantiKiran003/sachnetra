# SachNetra — Coding Patterns

## Variant Config Pattern

**Model after**: `src/config/variants/tech.ts` — **for its FILE STRUCTURE only**
**Reference for content inspiration**: `src/config/variants/full.ts` (read only, never write)

### Why tech.ts and NOT full.ts?

`full.ts` re-exports the entire WorldMonitor global data infrastructure:
```typescript
export * from '../feeds';       // all global feeds
export * from '../military';    // military bases
export * from '../irradiators'; // nuclear irradiators
export * from '../pipelines';   // oil/gas pipelines
export * from '../ports';       // maritime ports
export * from '../airports';
export * from '../entities';
```
India variant needs none of this. `full.ts` is too coupled to WorldMonitor's geopolitical layer.

`tech.ts` is **self-contained** — it defines its own `FEEDS` inline, wraps URLs with `rssProxyUrl`, and only imports what a standalone variant needs. That clean structure is what india.ts copies.

**The word "tech" is just a variant name.** Every piece of content (feed URLs, panel names, map layers) gets completely replaced with SachNetra-specific values. Only the file architecture is reused.

The india variant file structure:
```typescript
// src/config/variants/india.ts
import type { PanelConfig, MapLayers } from '@/types';
import type { VariantConfig } from './base';
export * from './base';

import type { Feed } from '@/types';
import { rssProxyUrl } from '@/utils';
const rss = rssProxyUrl;

export const FEEDS: Record<string, Feed[]> = { ... };
export const DEFAULT_PANELS: Record<string, PanelConfig> = { ... };
export const DEFAULT_MAP_LAYERS: MapLayers = { ... };
export const MOBILE_DEFAULT_MAP_LAYERS: MapLayers = { ... };
export const VARIANT_CONFIG: VariantConfig = {
  name: 'india',
  description: 'SachNetra — Indian news clarity tool',
  panels: DEFAULT_PANELS,
  mapLayers: DEFAULT_MAP_LAYERS,
  mobileMapLayers: MOBILE_DEFAULT_MAP_LAYERS,
};
```

## Feed Config Pattern

**Interface location**: `src/config/feeds.ts` — `Feed` type imported from `@/types`

Feed objects use `rssProxyUrl()` wrapper (aliased as `rss`):
```typescript
{ name: 'NDTV', url: rss('https://feeds.feedburner.com/ndtvnews-top-stories') }
```

**Note**: The prep doc `04_data_sources.md` shows a `FeedConfig` interface with `tier`, `category`, `region` fields. These are for SachNetra's internal classification — they may extend the base `Feed` type. Study `feeds.ts` Feed type before writing.

## CSS Variable Naming Convention

Always use `--sn-*` prefix for SachNetra brand variables. Never hardcode hex values:

```css
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

## Verification Commands (Run After Every Change)

```bash
npm run typecheck   # Must show: 0 errors ✅
```

**Forbidden (James runs these himself)**:
```bash
npm run build   ❌
npm run dev     ❌
```

## One-Task-At-A-Time Rule

Never combine two tasks into one session. Complete Phase 1 fully before Phase 2. Mark each `[x]` with timestamp. Do not move to the next task until all verification checks pass.

## TypeScript Code Quality

- Strict TypeScript — no `any` unless the existing codebase uses it in that context
- Early returns over nested if/else
- `async/await` not `.then()` chains
- Comments explain WHY not WHAT
- No commented-out code — delete completely
- Mobile-first CSS — 375px base width
- Touch targets minimum 44px height
