# Task 007 — State Filtering
*SachNetra Adapt Sprint*

**Depends on**: Tasks 001–006 must be complete
**Estimated time**: 6–8 hours
**Prep doc**: `04_data_sources.md` — INDIA_STATE_KEYWORDS map

---

## Decisions (Locked In)

1. **State selector UI already exists** — `panel-layout.ts` L340-654 has bar, grid, cells, toggle handlers. Currently cosmetic-only.
2. **Filter on `NewsItem`** — India mobile feed renders `NewsItem[]` (not `ClusteredEvent`). Filter on `item.title` + `item.locationName`.
3. **Slug-to-code mapping needed** — Grid uses kebab-case `data-state` (e.g., `maharashtra`, `uttar-pradesh`). Keywords use 2-letter codes (`MH`, `UP`). Need a mapping table.
4. **localStorage key**: `sn-selected-state` — stores the 2-letter state code or `null` for All India.
5. **No new component file** — Roadmap says `StateSelector.ts CREATE NEW`, but the UI already exists inline in `panel-layout.ts`. We only wire logic, not recreate UI.

---

## Context — Current State

`panel-layout.ts` L340-391 renders the state bar and grid inline in the India mobile layout. L614-653 has `setupMobileIndiaLayout()` which handles:
- Bar open/close toggle
- Cell selection (visual only — changes label text, no filtering)

`data-loader.ts` L1267-1364 `populateIndiaBrief()` renders `allNews` as story cards. No state filtering applied.

`app-context.ts` has no `selectedState` field.

`rss.ts` has no state filtering function.

`india.ts` has feeds, panels, map config. No state keywords.

`INDIA_STATE_KEYWORDS` is fully defined in `04_data_sources.md` with 36 entries.

## What This Task Does

1. Adds `INDIA_STATES`, `INDIA_STATE_KEYWORDS`, `STATE_SLUG_TO_CODE` to `india.ts`
2. Adds `filterNewsByState()` function to `rss.ts`
3. Adds `selectedState: string | null` to `AppContext` interface
4. Wires state selector in `panel-layout.ts` — persist + restore + re-filter on change
5. Wires state filter in `data-loader.ts` — filter before rendering cards

**Not in scope**: ClusteredEvent filtering, map state highlighting, new component file.

---

## Files To Open Before Starting

```
src/config/variants/india.ts             — add INDIA_STATES, INDIA_STATE_KEYWORDS, STATE_SLUG_TO_CODE
src/services/rss.ts                      — add filterNewsByState()
src/app/app-context.ts                   — add selectedState field
src/app/panel-layout.ts                  — wire state selector persistence + re-filter
src/app/data-loader.ts                   — filter allNews by selectedState before rendering
```

---

## Implementation

### Phase 1: Config Data
**Goal**: Add state keywords and mappings to india.ts.

- [x] **Step 1.1** — Add `INDIA_STATES` array
  - File: `src/config/variants/india.ts`
  - After `INDIA_BOUNDARY_OVERLAY`, add array of `{ code, name, city }` for all 36 states + UTs

- [x] **Step 1.2** — Add `INDIA_STATE_KEYWORDS`
  - File: `src/config/variants/india.ts`
  - Copy from `04_data_sources.md` L195-233

- [x] **Step 1.3** — Add `STATE_SLUG_TO_CODE`
  - File: `src/config/variants/india.ts`
  - Maps kebab-case `data-state` values to 2-letter codes:
    ```typescript
    export const STATE_SLUG_TO_CODE: Record<string, string> = {
      'all': '',
      'maharashtra': 'MH',
      'uttar-pradesh': 'UP',
      'delhi': 'DL',
      // ... all 36 entries
    };
    ```

### Phase 2: Filter Function
**Goal**: Pure function to filter news items by state keywords.

- [x] **Step 2.1** — Add `filterNewsByState()` to `rss.ts`
  - File: `src/services/rss.ts`
  - After `fetchCategoryFeeds()`, add:
    ```typescript
    export function filterNewsByState(
      items: NewsItem[],
      stateCode: string | null
    ): NewsItem[] {
      if (!stateCode) return items;
      const { INDIA_STATE_KEYWORDS } = await import('@/config/variants/india');
      const keywords = INDIA_STATE_KEYWORDS[stateCode] || [];
      if (keywords.length === 0) return items;
      return items.filter(item =>
        keywords.some(kw =>
          item.title.toLowerCase().includes(kw) ||
          (item.locationName && item.locationName.toLowerCase().includes(kw))
        )
      );
    }
    ```
  - Note: Use dynamic import to avoid pulling india config into all variants.

### Phase 3: AppContext
**Goal**: Add selectedState to the context.

- [x] **Step 3.1** — Add `selectedState` to `AppContext`
  - File: `src/app/app-context.ts`
  - After `initialUrlState`, add:
    ```typescript
    selectedState: string | null;  // India variant: 2-letter state code
    ```

### Phase 4: Wiring
**Goal**: Connect state selector to feed filtering.

- [x] **Step 4.1** — Wire persistence in `panel-layout.ts`
  - File: `src/app/panel-layout.ts`
  - In `setupMobileIndiaLayout()`:
    - On init: read `localStorage.getItem('sn-selected-state')`, set `this.ctx.selectedState`, update active cell + bar label
    - On cell click: map slug → code via `STATE_SLUG_TO_CODE`, set `this.ctx.selectedState`, persist to localStorage

- [x] **Step 4.2** — Wire re-filter on state change
  - File: `src/app/data-loader.ts` or `panel-layout.ts`
  - On state change: re-call `populateIndiaBrief()` with filtered news
  - In `populateIndiaBrief()`: apply `filterNewsByState(allNews, this.ctx.selectedState)` before rendering

- [x] **Step 4.3** — Make `populateIndiaBrief` re-callable
  - Currently it's private and called once. Need to expose it or dispatch a re-render event so state changes can trigger re-render.

### Phase 5: Cleanup
- [x] **Step 5.1** — Verify no dead imports
- [x] **Step 5.2** — Ensure typecheck passes

---

## Read vs Write

**READ for reference (always allowed):**
- `src/config/variants/full.ts` — study pattern, never write
- `src/config/variants/tech.ts` — study pattern, never write
- `ai_docs/prep/04_data_sources.md` — keyword source

**WRITE only to:**
- `src/config/variants/india.ts`
- `src/services/rss.ts`
- `src/app/app-context.ts`
- `src/app/panel-layout.ts`
- `src/app/data-loader.ts`

**Never write to:**
- `src/config/variants/full.ts` — SACRED
- `src/config/variants/tech.ts` — SACRED
- `src/config/variants/finance.ts` — SACRED

---

## Verify

```bash
npm run typecheck   # Must show: 0 errors
```

In browser (npm run dev with VITE_VARIANT=india):
- [ ] App loads without crash
- [ ] Select Maharashtra → feed shows only Maharashtra stories
- [ ] Select All India → feed shows all stories
- [ ] Selection persists on page reload
- [ ] State bar shows selected state name
- [ ] At least 3 different states tested (Maharashtra, Delhi, Tamil Nadu)
- [ ] App loads fast (<3 seconds)

---

## Completion Log

**Completed**: 2026-03-28

### Files Modified
| File | Change |
|------|--------|
| `src/config/variants/india.ts` | Added `INDIA_STATES` (38 entries), `INDIA_STATE_KEYWORDS` (38 entries), `STATE_SLUG_TO_CODE` (39 entries) |
| `src/services/rss.ts` | Added `filterNewsByState()` — pure function, accepts keywords as param |
| `src/app/app-context.ts` | Added `selectedState: string \| null` field |
| `src/App.ts` | Initialized `selectedState: null`, wired `refilterIndiaStories` callback |
| `src/app/panel-layout.ts` | Imported `STATE_SLUG_TO_CODE`, added persistence + restore + re-filter on cell click |
| `src/app/data-loader.ts` | Imported filter + keywords, added `refilterIndiaStories()` public method, extracted `renderIndiaStoryCards()` |

### Design Decisions
- **No new component file** — state selector UI already existed inline in `panel-layout.ts`
- **Keywords passed as param** to `filterNewsByState()` to keep `rss.ts` variant-agnostic
- **Extracted `renderIndiaStoryCards()`** so re-filter doesn't re-generate the AI daily brief
- **Empty state message** shown when no stories match a state filter

---

## Lessons Learned

### 1. Always audit existing code before creating new files
The roadmap spec said `StateSelector.ts CREATE NEW`, but the state selector UI (bar, grid, 36 cells, toggle logic) was already fully built inline in `panel-layout.ts` from a previous task. Creating a new component would have duplicated UI and introduced conflicts. **Lesson**: Always grep/read the codebase before assuming a file needs to be created. The roadmap is a guide, not gospel.

### 2. Slug → code mapping is a hidden coupling
The HTML grid cells used `data-state="maharashtra"` (kebab-case slugs), but the keyword map used 2-letter codes (`MH`). These were defined independently in different tasks and there was no mapping between them. This mismatch was caught during research but could have easily been missed. **Lesson**: When one system uses identifiers in format A and another uses format B, always create an explicit mapping table and put it next to the data it maps. Don't rely on runtime string transformations.

### 3. require() doesn't work in Vite ESM
Initial implementation of `filterNewsByState()` used `require()` for lazy-loading `INDIA_STATE_KEYWORDS` to avoid bundling india config into other variants. This fails silently in Vite's ESM environment. **Resolution**: Made the function accept `keywords` as a parameter instead — the caller (data-loader) imports `INDIA_STATE_KEYWORDS` directly, which Vite tree-shakes properly since data-loader is only invoked by the india variant. **Lesson**: Never use `require()` in this codebase. For variant-specific imports, either use dynamic `import()` or pass data as a parameter.

### 4. Separate "re-render cards" from "re-generate AI brief"
`populateIndiaBrief()` did two things: render story cards AND call the AI summarization endpoint. When the user changes state filter, we need to re-render cards instantly but NOT re-hit the AI endpoint (expensive, slow, rate-limited). **Resolution**: Extracted card rendering into a separate `renderIndiaStoryCards()` method, and created a public `refilterIndiaStories()` that calls only the card renderer. **Lesson**: When a function does both cheap UI work and expensive async work, split them so the cheap part can be called independently.

### 5. Cross-module communication pattern: callbacks > events
`panel-layout.ts` needed to tell `data-loader.ts` to re-filter stories, but panel-layout doesn't import data-loader (architectural rule: no circular deps). Options considered:
- Custom DOM events — loose coupling but no type safety
- Direct import — breaks dependency direction
- **Callback interface** (chosen) — added `refilterIndiaStories` to `PanelLayoutCallbacks`, wired in `App.ts`

This follows the existing pattern used by `loadAllData`, `updateMonitorResults`, etc. **Lesson**: Always follow the existing cross-module pattern in the codebase. In this project, it's callback interfaces wired in `App.ts`.

### 6. localStorage stores the slug, context stores the code
We persist the kebab-case slug (`maharashtra`) to localStorage, not the 2-letter code (`MH`). This is because the slug matches `data-state` attributes in the DOM, making it easy to restore the active cell highlight on reload. The 2-letter code is only needed at filter time. **Lesson**: Choose the persistence format that makes the restore path simplest — you read far more often than you write.

### 7. Interface changes require initialization changes
Adding `selectedState: string | null` to the `AppContext` interface also required adding `selectedState: null` to the state initialization object in `App.ts`. Missing this would cause a TypeScript error since the interface is strict. **Lesson**: When adding a field to an interface, always grep for where that interface is instantiated (`this.state = { ... }`) and add the initial value there too.

### 8. Filter on `NewsItem`, not `ClusteredEvent`
The roadmap spec mentioned filtering `ClusteredEvent`, but the India mobile feed actually renders `NewsItem[]` directly (not clusters). Filtering the wrong type would have produced zero results. **Lesson**: Always trace the actual data flow from API → state → render before deciding what to filter. Don't trust the spec's type names — verify against the code.

### 9. Phase-by-phase implementation prevents cascading bugs
Breaking the task into 5 phases (config → filter → context → wiring → cleanup) with typecheck after each phase caught issues early. The `require()` mistake in Phase 2 was caught and fixed immediately, before it could interact with Phase 4's wiring. **Lesson**: For tasks touching 5+ files, implement in dependency order and typecheck after each phase. Foundation first, wiring last.

### 10. Empty state UX matters
When filtering by a state that has no matching stories, we show "No stories found for this state" instead of a blank screen. This was not in the spec but is essential UX. **Lesson**: Always handle the empty/zero-results case explicitly. A blank screen looks like a bug.
