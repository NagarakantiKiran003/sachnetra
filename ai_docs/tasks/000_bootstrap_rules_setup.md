# Task 000 — Bootstrap & Rules Setup
*SachNetra Adapt Sprint*

**Depends on**: Nothing — run this ONCE before any other task
**Estimated time**: 30 minutes
**Prep doc**: All `ai_docs/prep/` files + `adapt_sprint_bootstrap.md` template

---

## Context — Current State

This codebase is a fork of WorldMonitor (world-monitor v2.6.5). As of Task 000:

- `src/config/variants/india.ts` — **does not exist yet** (created in Task 001)
- `CLAUDE.md` — **created in this task** (did not exist before)
- `.agents/rules/` — **created in this task** (did not exist before)
- `src/App.ts` — exists, has variant detection for `full`, `tech`, `finance`, `happy` — no `india` yet
- `src/config/variants/tech.ts` — exists, is the pattern template for india variant
- `api/rss-proxy.js` — exists, has domain allowlist (no Indian domains yet)

## What This Task Does

- Creates `.agents/rules/` with 4 permanent rule files so Antigravity permanently knows the project.
- Creates `CLAUDE.md` with SachNetra section (file did not previously exist).
- Creates this task file for the record.

---

## Files Created in This Task

```
.agents/rules/sachnetra-context.md     — What SachNetra is, who it's for, technical approach
.agents/rules/sachnetra-boundaries.md  — Sacred files, read-only refs, V1 scope boundary
.agents/rules/sachnetra-patterns.md    — Variant config structure, Feed pattern, CSS vars, verify commands
.agents/rules/india-variant.md         — Brand colors, map center, AI JSON format, cache version, Kashmir compliance
CLAUDE.md                              — SachNetra section (created fresh — did not exist)
ai_docs/tasks/000_bootstrap_rules_setup.md — This file
```

---

## Pattern To Follow

`src/config/variants/tech.ts` is the model for india.ts. Top-level structure:

```typescript
// Tech/AI variant - tech.worldmonitor.app
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
  name: 'tech',               // ← change to 'india'
  description: '...',
  panels: DEFAULT_PANELS,
  mapLayers: DEFAULT_MAP_LAYERS,
  mobileMapLayers: MOBILE_DEFAULT_MAP_LAYERS,
};
```

---

## Read vs Write

**READ for reference (always allowed):**
- `src/config/variants/full.ts` — study pattern, never write
- `src/config/variants/tech.ts` — study pattern, never write
- `src/config/feeds.ts` — study Feed type interface, never write
- `src/App.ts` — study variant detection, used in Task 001

**WRITE in this task (already done):**
- `.agents/rules/sachnetra-context.md`
- `.agents/rules/sachnetra-boundaries.md`
- `.agents/rules/sachnetra-patterns.md`
- `.agents/rules/india-variant.md`
- `CLAUDE.md`

**NEVER write to:**
- `src/config/variants/full.ts` — sacred
- `src/config/variants/tech.ts` — sacred
- `src/config/variants/finance.ts` — sacred

---

## Verify

James reviews all 4 rule files and confirms:

- [ ] `sachnetra-context.md` — accurately describes the product and approach
- [ ] `sachnetra-boundaries.md` — lists every file that must never be touched
- [ ] `sachnetra-patterns.md` — correct pattern for Feed, variant config, CSS vars
- [ ] `india-variant.md` — correct brand colors, map center, AI format, Kashmir note

No typecheck needed — no code was written.

---

## Completion Log

- [x] Rules created — 2026-03-16T15:40
- [x] CLAUDE.md created — 2026-03-16T15:40
- [x] James confirmed rules are accurate — 2026-03-16T16:00
- [x] **TASK 000 COMPLETE** ✅
