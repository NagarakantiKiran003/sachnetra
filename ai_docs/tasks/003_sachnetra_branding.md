# Task 003 — SachNetra Branding
*SachNetra Adapt Sprint*

**Depends on**: Task 002 must be complete (Indian RSS feeds wired)
**Estimated time**: 4–6 hours
**Prep doc**: `ai_docs/prep/02_ui_design.md`
**Reference designs**: `ai_docs/ui-docs-reference/` (SVG code, loading screen HTML, home screen mockup)

---

## Discussions — Key Decisions Made

1. **Logo SVG** — Extract from `sachnetra_logo_final.html` (production-ready diya+eye SVG at 4 sizes already exists). No hand-coding or image generation needed.

2. **Loading screen** — Option A: replace the skeleton shell in `index.html` with SachNetra splash, **conditional on `data-variant="india"`**. The existing WorldMonitor skeleton stays for other variants. The time-aware greeting uses a small inline `<script>` (runs before JS bundle loads).

3. **Branding scope** — India variant only. All changes are conditional:
   - CSS: `[data-variant="india"]` selectors
   - JS: `SITE_VARIANT === 'india'` guards in `panel-layout.ts`
   - Meta tags: new `india` entry in `variant-meta.ts`
   - Other variants (full, tech, finance, commodity, happy) remain **completely untouched**

4. **Favicons** — SVG favicon (`<link rel="icon" type="image/svg+xml">`). Modern browsers support this natively. No PNG conversion needed. Existing fallback ICO stays for non-india variants.

5. **Wordmark style** — Solid white text (Option B from `sachnetra_wordmark_comparison.html`). Gradient is on the logo mark only, not the text. Cleaner and more readable at small sizes.

---

## Context — Current State

`index.html` — Contains WorldMonitor branding: title tag (`World Monitor - Real-Time Global Intelligence Dashboard`), meta tags, OG tags, JSON-LD, and favicon links pointing to `/favico/`. Also contains the skeleton shell (lines 132–235) with WorldMonitor-style shimmer layout. The inline script at line 129 already sets `data-variant` on `<html>` based on hostname/env var — this is how CSS conditionals will work.

`src/styles/main.css` — Has `:root` CSS variables for backgrounds, text, borders, etc. No `--sn-*` brand variables exist yet. The `--sn-*` variables are defined in `.agents/rules/sachnetra-patterns.md` and confirmed by the home screen mockup.

`src/app/panel-layout.ts` — Contains all header branding (line 179: `MONITOR` / `World Monitor`), footer (line 332: `WORLD MONITOR`), mobile menu (line 228: `WORLD MONITOR`). All hardcoded — no variant-aware branching.

`src/config/variant-meta.ts` — Has entries for `full`, `tech`, `happy`, `finance`, `commodity`. No `india` entry exists.

`public/` — Has `favicon.ico` at root and full favicon set in `public/favico/`. No SachNetra logo or favicon exists.

`ai_docs/ui-docs-reference/sachnetra_logo_final.html` — Contains complete SVG code for the diya+eye logo at 96px, 64px, 48px, 32px sizes, plus the full loading screen implementation with time-aware greeting.

---

## What This Task Does

1. Creates `public/sachnetra-logo.svg` — standalone diya+eye logo SVG (extracted from reference doc)
2. Creates `public/sachnetra-favicon.svg` — 32px version for browser tab favicon
3. Adds `--sn-*` CSS variables to `:root` in `src/styles/main.css`
4. Adds SachNetra loading screen to `index.html` (conditional on `data-variant="india"`)
5. Updates `index.html` meta tags to be variant-aware for india
6. Adds `india` entry to `src/config/variant-meta.ts`
7. Updates `src/app/panel-layout.ts` header/footer/mobile-menu branding (conditional on `SITE_VARIANT === 'india'`)

---

## Files To Open Before Starting

```
ai_docs/ui-docs-reference/sachnetra_logo_final.html     — SVG code to extract
ai_docs/ui-docs-reference/sachnetra_wordmark_comparison.html — header logo (28px) SVG
ai_docs/ui-docs-reference/sachnetra_loading_screen.html  — loading screen reference
src/styles/main.css                                      — add --sn-* variables to :root
index.html                                               — add loading screen + meta tags
src/config/variant-meta.ts                               — add india entry
src/app/panel-layout.ts                                  — conditional branding in header/footer
```

---

## Pattern To Follow

From `src/config/variant-meta.ts`, the existing variant entry pattern:
```typescript
tech: {
  title: 'Tech Monitor - Real-Time AI & Tech Industry Dashboard',
  description: 'Real-time AI and tech industry dashboard...',
  keywords: 'tech dashboard, AI industry...',
  url: 'https://tech.worldmonitor.app/',
  siteName: 'Tech Monitor',
  shortName: 'TechMonitor',
  subject: 'AI, Tech Industry...',
  classification: 'Tech Dashboard...',
  categories: ['news', 'business'],
  features: [...],
},
```

From `index.html` line 129, the existing variant detection inline script:
```javascript
var h=location.hostname;
if(h.startsWith('happy.'))v='happy';
else if(h.startsWith('tech.'))v='tech';
else if(h.startsWith('finance.'))v='finance';
```
This already sets `document.documentElement.dataset.variant` before first paint. We add `sachnetra` detection here.

From `src/app/panel-layout.ts` line 179, the existing header branding:
```typescript
<span class="logo">MONITOR</span>
<span class="logo-mobile">World Monitor</span>
```
We wrap this in a `SITE_VARIANT === 'india'` ternary.

---

## Implementation

### Phase 1: Logo & Favicon SVG files
**Goal**: SachNetra logo SVG exists in `public/` — no code changes yet.

- [x] **Step 1.1** — Create `public/sachnetra-logo.svg` — 2026-03-21T14:24:00
  - Extracted 72px SVG from `sachnetra_logo_final.html` (lines 201–226)
  - Standalone SVG with proper `xmlns` attribute
  - Gradient IDs prefixed `sn-` (sn-bg, sn-eye, sn-pupil, sn-stem)

- [x] **Step 1.2** — Create `public/sachnetra-favicon.svg` — 2026-03-21T14:24:00
  - Extracted 32px SVG from `sachnetra_logo_final.html` (lines 99–119)
  - Gradient IDs prefixed `snf-` to avoid conflicts with logo version
  - Stem uses flat `#FF9933` instead of gradient for clarity at favicon size

### Phase 2: CSS variables
**Goal**: `--sn-*` brand tokens available in CSS.

- [x] **Step 2.1** — Add SachNetra brand variables to `:root` in `src/styles/main.css` — 2026-03-21T14:41:00
  - Added 10 `--sn-*` variables in new `:root` block (lines 64–75)
  - Placed between font stack block and semantic colors block
  - No existing variables changed

### Phase 3: Loading screen in `index.html`
**Goal**: India variant shows SachNetra branded splash; other variants see existing skeleton.

- [x] **Step 3.1** — Add `sachnetra` hostname detection to inline variant script — 2026-03-21T14:46:00
  - Added `else if(h.includes('sachnetra'))v='india';` after the finance check
  - Matches sachnetra.com, www.sachnetra.com, sachnetra-*.vercel.app

- [x] **Step 3.2** — Add SachNetra splash screen HTML — 2026-03-21T14:46:00
  - Inline 72px logo SVG with `snl-` prefixed gradient IDs (avoids conflicts with standalone SVG)
  - Wordmark "SachNetra" (24px white) + subtitle "सच्चनेत्र" (13px muted)
  - Divider, date placeholder, greeting placeholder, loading bar

- [x] **Step 3.3** — Add SachNetra splash CSS — 2026-03-21T14:46:00
  - `.sn-splash` hidden by default (`display:none`), shown for india (`display:flex`)
  - `[data-variant="india"] .skeleton-shell{display:none}` hides WorldMonitor skeleton
  - Fixed position overlay with radial glow background
  - `@keyframes sn-loadbar` animation (purple→saffron gradient)

- [x] **Step 3.4** — Add time-aware greeting inline script — 2026-03-21T14:46:00
  - Morning (5–11): "Here's India this morning."
  - Afternoon (11–17): "Here's India right now."
  - Evening (17–22): "Here's India this evening."
  - Night (22–5): "Here's India tonight."
  - Date: `toLocaleDateString('en-IN', {weekday:'long',day:'numeric',month:'long'})`

- [x] **Step 3.5** — Add SachNetra favicon link — 2026-03-21T14:46:00
  - Added `<link rel="icon" type="image/svg+xml" href="/sachnetra-favicon.svg" />` after existing favicon links

### Phase 4: Variant metadata
**Goal**: `variant-meta.ts` has an `india` entry for SachNetra SEO.

- [x] **Step 4.1** — Add `india` entry to `VARIANT_META` object — 2026-03-21T15:21:00
  - Added after `commodity` entry with SachNetra title, description, keywords, URL
  - `siteName: 'SachNetra'`, `shortName: 'SachNetra'`
  - 6 features listed
  ```typescript
  india: {
    title: 'SachNetra — See India Clearly',
    description: 'Calm, clear Indian news intelligence. AI-powered summaries from 20+ sources. No panic, no noise — just what happened and what it means.',
    keywords: 'India news, Indian news dashboard, NDTV, The Hindu, Indian Express, news aggregator, AI news summary, India intelligence',
    url: 'https://sachnetra.com/',
    siteName: 'SachNetra',
    shortName: 'SachNetra',
    subject: 'Indian News Intelligence and Clarity',
    classification: 'News Dashboard, India News Aggregator',
    categories: ['news', 'productivity'],
    features: [
      'Indian news aggregation from 20+ sources',
      'AI-powered two-part summaries',
      'State-level news filtering',
      'Time-aware greetings',
      'Calm, anti-panic design',
      'WhatsApp sharing',
    ],
  },
  ```

### Phase 5: Header, footer, mobile menu branding
**Goal**: App header shows "SachNetra" when india variant is active; all other variants unchanged.

- [ ] **Step 5.1** — Update header logo in `panel-layout.ts`
  - File: `src/app/panel-layout.ts`, line 179
  - Replace the hardcoded logo span with a variant-aware ternary:
  ```typescript
  // Before:
  <span class="logo">MONITOR</span><span class="logo-mobile">World Monitor</span>

  // After:
  ${SITE_VARIANT === 'india'
    ? '<span class="logo sn-logo"><img src="/sachnetra-logo.svg" alt="SachNetra" width="26" height="26" class="sn-header-icon" /> SachNetra</span>'
    : '<span class="logo">MONITOR</span><span class="logo-mobile">World Monitor</span>'}
  ```
  - The `.sn-header-icon` class and `.sn-logo` styles go in `main.css` (see Step 5.4).

- [ ] **Step 5.2** — Update footer branding in `panel-layout.ts`
  - File: `src/app/panel-layout.ts`, lines 329–345
  - Wrap the footer brand section in a variant check:
  ```typescript
  // Footer brand name
  ${SITE_VARIANT === 'india' ? 'SACHNETRA' : 'WORLD MONITOR'}
  // Footer copyright
  © ${new Date().getFullYear()} ${SITE_VARIANT === 'india' ? 'SachNetra' : 'World Monitor'}
  ```
  - Conditionally hide WorldMonitor-specific footer links (Pro, Blog, Docs, Status, GitHub, X) for india variant.

- [ ] **Step 5.3** — Update mobile menu title in `panel-layout.ts`
  - File: `src/app/panel-layout.ts`, line 228
  ```typescript
  // Before:
  <span class="mobile-menu-title">WORLD MONITOR</span>
  // After:
  <span class="mobile-menu-title">${SITE_VARIANT === 'india' ? 'SACHNETRA' : 'WORLD MONITOR'}</span>
  ```
  - Also conditionally hide variant switcher links (full/tech/finance/commodity/happy) for india variant since they point to worldmonitor.app domains.

- [ ] **Step 5.4** — Add `.sn-logo` and `.sn-header-icon` styles to `main.css`
  - File: `src/styles/main.css`
  - Add after the existing `.logo` styles (~line 398):
  ```css
  /* SachNetra header branding */
  .sn-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    font-size: 15px;
    letter-spacing: 0.03em;
    color: #fff;
  }
  .sn-header-icon {
    border-radius: 7px;
  }
  ```

---

## Before / After

**`src/config/variant-meta.ts` — Before** (ends with `commodity`):
```typescript
  commodity: {
    ...
  },
};
```

**After** (india entry added):
```typescript
  commodity: {
    ...
  },
  india: {
    title: 'SachNetra — See India Clearly',
    ...
  },
};
```

---

**`src/app/panel-layout.ts` line 179 — Before**:
```typescript
<span class="logo">MONITOR</span><span class="logo-mobile">World Monitor</span>
```

**After**:
```typescript
${SITE_VARIANT === 'india'
  ? '<span class="logo sn-logo"><img src="/sachnetra-logo.svg" ... /> SachNetra</span>'
  : '<span class="logo">MONITOR</span><span class="logo-mobile">World Monitor</span>'}
```

---

## Read vs Write

**READ for reference (always allowed):**
- `src/config/variants/full.ts` — study pattern, never write
- `src/config/variants/tech.ts` — study pattern, never write
- `ai_docs/ui-docs-reference/*.html` — extract SVG/CSS, these are reference docs
- `ai_docs/prep/02_ui_design.md` — brand decisions

**WRITE only to files explicitly listed in this task:**
- `public/sachnetra-logo.svg` — NEW (Phase 1)
- `public/sachnetra-favicon.svg` — NEW (Phase 1)
- `src/styles/main.css` — add `--sn-*` variables + `.sn-logo` styles (Phase 2 + 5)
- `index.html` — add loading screen + hostname detection + favicon link (Phase 3)
- `src/config/variant-meta.ts` — add india entry (Phase 4)
- `src/app/panel-layout.ts` — conditional branding in header/footer/menu (Phase 5)

**Never write to:**
- `src/config/variants/full.ts` — sacred
- `src/config/variants/tech.ts` — sacred
- `src/config/variants/finance.ts` — sacred
- `src/config/variants/india.ts` — not in scope for this task (branding, not feeds/panels)
- Map components — Task 006
- AI pipeline files — Task 005
- Panel layout structure — Task 004

---

## Verify

```bash
npm run typecheck   # Must show: 0 errors
```

In browser (`npm run dev` with `VITE_VARIANT=india`):
- [ ] Loading screen shows SachNetra logo + "सच्चनेत्र" + time-aware greeting
- [ ] Loading screen shows correct greeting for current time of day
- [ ] Loading screen shows today's date in Indian English format
- [ ] Loading bar animates with purple→saffron gradient
- [ ] App header shows SachNetra logo (26px) + "SachNetra" text
- [ ] Browser tab shows SachNetra SVG favicon
- [ ] Footer shows "SACHNETRA" not "WORLD MONITOR"
- [ ] Mobile menu title shows "SACHNETRA"
- [ ] `--sn-purple` resolves to `#7b7bff` in DevTools computed styles

Verify other variants are NOT affected:
- [ ] Set `VITE_VARIANT=tech`, reload — header shows "MONITOR", skeleton is WorldMonitor-style
- [ ] Set `VITE_VARIANT=full`, reload — same, no SachNetra branding visible

---

## Completion Log

- [x] Phase 1 complete — SVG files created — 2026-03-21T14:24:00
- [x] Phase 2 complete — CSS variables added — 2026-03-21T14:41:00
- [x] Phase 3 complete — Loading screen + meta tags — 2026-03-21T14:46:00
- [x] Phase 4 complete — variant-meta.ts updated — 2026-03-21T15:21:00
- [x] Phase 5 complete — Header/footer/menu branding — 2026-03-21T15:30:00
- [x] Typecheck: 0 errors — 2026-03-21T15:30:00
- [x] Browser verified (india variant) — 2026-03-21T15:51:00
- [x] Browser verified (other variant — no leakage) — 2026-03-21T15:51:00
- [x] **TASK 003 COMPLETE** ✅ — 2026-03-21T15:51:00

---

## Session Notes — Lessons Learned for Future Agents

### Lesson 1 — SVG gradient ID conflicts are real

**Problem**: When the same SVG is used in multiple places (standalone file, inline in `index.html`, header `<img>`), identical gradient `id` attributes cause rendering bugs — only the first definition wins.

**Solution**: Prefix gradient IDs per context:
- `sn-` for the standalone `public/sachnetra-logo.svg`
- `snf-` for the favicon `public/sachnetra-favicon.svg`
- `snl-` for the inline loading screen SVG in `index.html`

**Future agents**: Always use unique prefixed gradient IDs when the same SVG appears in multiple DOM contexts.

---

### Lesson 2 — Conditional branding via `data-variant` attribute is powerful

**Pattern**: The inline script in `index.html` (line 131) sets `data-variant` on `<html>` **before first paint**. This enables pure CSS conditionals like:
```css
[data-variant="india"] .sn-splash { display: flex }
[data-variant="india"] .skeleton-shell { display: none }
```
No JS needed for show/hide logic. The browser handles it in the first paint cycle.

**Why this matters**: The loading screen appears **instantly** because it's pure HTML+CSS, not waiting for any JS bundle. The greeting script runs inline immediately after the DOM elements are parsed.

**Future agents**: Use `data-variant` CSS selectors for any india-specific visual changes. Don't add JS-driven class toggling when CSS `[data-variant]` selectors will do.

---

### Lesson 3 — Variant switcher should be hidden for india, not modified

**Original plan**: Add `india` option to the variant switcher alongside 🌍💻📈⛏️☀️.

**Better approach**: Hide the switcher entirely when `SITE_VARIANT === 'india'`. The switcher links point to `worldmonitor.app` domains which have nothing to do with SachNetra. Showing them would confuse users.

**Pattern used**: `${SITE_VARIANT === 'india' ? '' : \`<div class="variant-switcher">...\`}` — the entire switcher block is conditionally omitted rather than modified.

**Future agents**: When a variant is fundamentally different (different brand, different audience), don't try to integrate it into the existing navigation — just hide irrelevant navigation entirely.

---

### Lesson 4 — Time-aware greetings must use inline script, not module JS

**Why inline**: The greeting text must be visible during the loading screen, which appears **before** the Vite JS bundle loads (the bundle can take 300-800ms on Jio 4G). If we put the greeting logic in `App.ts` or any module, users would see placeholder text for those 300-800ms.

**Implementation**: A 7-line IIFE immediately after the splash HTML:
```javascript
var h = new Date().getHours();
var g = h>=5&&h<11 ? "this morning." : h>=11&&h<17 ? "right now." : ...
document.getElementById('sn-greeting').innerHTML = g;
```

**Future agents**: Anything that needs to be visible during the loading screen **must** be inline HTML/CSS/JS, not imported from modules. The module system isn't available until after `<script type="module" src="/src/main.ts">` loads.

---

### Lesson 5 — SVG favicons avoid the PNG tooling problem

**Problem**: Traditional favicon workflows require generating 6+ PNG files at different sizes (16, 32, 180, 192, 512) from a source image. This requires ImageMagick, Sharp, or similar tooling.

**Solution**: `<link rel="icon" type="image/svg+xml" href="/sachnetra-favicon.svg" />` — one SVG file, browsers scale it to any size. Browser support: Chrome 80+, Firefox 41+, Safari 15+, Edge 80+.

**Trade-off**: Older browsers and some social media crawlers won't use the SVG. The existing `/favico/favicon.ico` remains as a fallback for those cases.

**Future agents**: If the target audience is modern browsers (Chrome on Android, which is ~95% of Indian mobile users), SVG favicon is the right default. Only generate PNG renders if you specifically need iOS home screen icons or Windows tile icons.

---

### Lesson 6 — Keep Sacred files untouched — branding is purely additive

**Files NOT modified** (and shouldn't be):
- `src/config/variants/full.ts` (sacred)
- `src/config/variants/tech.ts` (sacred)
- `src/config/variants/finance.ts` (sacred)
- `src/config/variants/india.ts` (not needed — branding is in layout, not variant config)
- `src/config/panels.ts` (no panel changes in this task)

All branding changes were either:
1. **New files**: `sachnetra-logo.svg`, `sachnetra-favicon.svg`
2. **Additive**: new CSS variables, new `variant-meta.ts` entry, new splash screen HTML
3. **Conditional**: `SITE_VARIANT === 'india'` ternaries that leave existing code paths completely untouched

**Future agents**: Branding should never modify the variant config file. Branding lives in `panel-layout.ts` (UI), `main.css` (styles), `variant-meta.ts` (SEO), and `index.html` (loading screen).
