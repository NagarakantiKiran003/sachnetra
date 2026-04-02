# Task 008 — Vercel Deployment
*SachNetra Adapt Sprint*

**Depends on**: Task 007 must be complete (V1 roadmap finished)
**Estimated time**: 2–3 hours (code changes) + James configures Vercel dashboard
**Prep doc**: `ai_docs/prep/07_roadmap.md` (V1 Launch Criteria)

---

## Context — Current State

The V1 roadmap (Tasks 001–007) is complete. The app runs correctly in local dev with `VITE_VARIANT=india`.

However, the WorldMonitor codebase was designed to serve `worldmonitor.app` only. Three security layers actively reject requests from any other origin:

1. **CORS** (`api/_cors.js` lines 1–10, `server/cors.ts` lines 8–15): `ALLOWED_ORIGIN_PATTERNS` only matches `worldmonitor.app`, Vercel previews, localhost, and Tauri desktop. `sachnetra.com` is not present. Every API call from `sachnetra.com` will get **403 Forbidden**.

2. **API key validation** (`api/_api-key.js` lines 8–15): `BROWSER_ORIGIN_PATTERNS` only trusts `worldmonitor.app`. Requests from `sachnetra.com` fall through to "no origin, no key" → **401 "API key required"**.

3. **Middleware** (`middleware.ts` lines 42–46): `ALLOWED_HOSTS` only includes `worldmonitor.app` and its subdomains. Social preview bots for `sachnetra.com` won't get the OG metadata response.

Additionally:
- `vercel.json` CSP headers (line 35) list only `worldmonitor.app` in `frame-src` and `frame-ancestors`
- `index.html` CSP meta tag (line 6) has the same issue
- No `sachnetra.com` entry exists in `middleware.ts` `VARIANT_OG` for social sharing

## What This Task Does

1. Adds `sachnetra.com` to CORS allowlists in `api/_cors.js` and `server/cors.ts`
2. Adds `sachnetra.com` to trusted browser origins in `api/_api-key.js`
3. Adds `sachnetra.com` to middleware host allowlist and OG metadata in `middleware.ts`
4. Adds `sachnetra.com` to CSP `frame-src` / `frame-ancestors` in `vercel.json`
5. Adds `sachnetra.com` to CSP `frame-src` in `index.html`

---

## Files To Open Before Starting

```
api/_cors.js            — Add sachnetra.com to CORS origin patterns
api/_api-key.js         — Add sachnetra.com to trusted browser origins
server/cors.ts          — Add sachnetra.com to server CORS patterns
middleware.ts           — Add sachnetra.com to allowed hosts + OG metadata
vercel.json             — Add sachnetra.com to CSP frame-src/frame-ancestors
index.html              — Add sachnetra.com to inline CSP frame-src
```

---

## Pattern To Follow

From `api/_cors.js`, existing patterns look like:
```javascript
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(.*\.)?worldmonitor\.app$/,
  /^https:\/\/worldmonitor-[a-z0-9-]+-elie-[a-z0-9]+\.vercel\.app$/,
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  ...
];
```

Follow the same regex pattern for `sachnetra.com`:
```javascript
/^https:\/\/(.*\.)?sachnetra\.com$/,
```
This matches `https://sachnetra.com` and `https://www.sachnetra.com` (or any subdomain).

From `middleware.ts`, the `VARIANT_HOST_MAP` and `VARIANT_OG` pattern:
```typescript
const VARIANT_HOST_MAP: Record<string, string> = {
  'tech.worldmonitor.app': 'tech',
  'finance.worldmonitor.app': 'finance',
  'happy.worldmonitor.app': 'happy',
};
```
Add `sachnetra.com` → `india` mapping.

---

## Implementation

### Phase 1: CORS + API Key — Unblock API Requests
**Goal**: Requests from `sachnetra.com` are accepted by all edge functions

- [x] **Step 1.1** — Add `sachnetra.com` to edge function CORS ✅ 2026-04-02T13:17
  - File: `api/_cors.js`
  - What to do: Add `/^https:\/\/(.*\.)?sachnetra\.com$/,` to the `ALLOWED_ORIGIN_PATTERNS` array, after the `worldmonitor.app` pattern (line 2).
  - Do not change anything else in this file.

- [x] **Step 1.2** — Add `sachnetra.com` to server CORS ✅ 2026-04-02T13:17
  - File: `server/cors.ts`
  - What to do: Add `/^https:\/\/(.*\.)?sachnetra\.com$/,` to the `PRODUCTION_PATTERNS` array, after the `worldmonitor.app` pattern (line 9).
  - Do not change anything else in this file.

- [x] **Step 1.3** — Add `sachnetra.com` to trusted browser origins ✅ 2026-04-02T13:18
  - File: `api/_api-key.js`
  - What to do: Add `/^https:\/\/(.*\.)?sachnetra\.com$/,` to the `BROWSER_ORIGIN_PATTERNS` array, after the `worldmonitor.app` pattern (line 9).
  - Do not change anything else in this file.

### Phase 2: Middleware — Social Previews + Host Allowlist
**Goal**: Social bots (WhatsApp, Twitter, etc.) get correct OG metadata when sharing sachnetra.com links

- [x] **Step 2.1** — Add `sachnetra.com` to allowed hosts ✅ 2026-04-02T13:20
  - File: `middleware.ts`
  - What to do:
    1. Add `'sachnetra.com'` to the `ALLOWED_HOSTS` Set (line 42–45)
    2. Add `'sachnetra.com': 'india'` to `VARIANT_HOST_MAP` (line 14–18)
    3. Add an `india` entry to `VARIANT_OG` (line 21–40) with:
       ```typescript
       india: {
         title: 'SachNetra — See India Clearly',
         description: 'Calm, clear Indian news intelligence. AI-powered summaries from 20+ sources. No panic, no noise — just what happened and what it means.',
         image: 'https://sachnetra.com/sachnetra-favicon.svg',
         url: 'https://sachnetra.com/',
       },
       ```
  - Do not change any other logic in this file.

### Phase 3: CSP Headers — Frame Security
**Goal**: Content Security Policy allows sachnetra.com in frame directives

- [x] **Step 3.1** — Add `sachnetra.com` to `vercel.json` CSP ✅ 2026-04-02T13:21
  - File: `vercel.json`
  - What to do: In the CSP header (line 35), add `https://sachnetra.com` to:
    - `frame-src` (after the worldmonitor.app entries)
    - `frame-ancestors` (after the worldmonitor.app entries)
  - Do not change any other headers.

- [x] **Step 3.2** — Add `sachnetra.com` to `index.html` inline CSP ✅ 2026-04-02T13:22
  - File: `index.html`
  - What to do: In the CSP meta tag (line 6), add `https://sachnetra.com` to `frame-src` after the existing worldmonitor entries.
  - Do not change any other meta tags or HTML.

---

## Before / After

**Before** (`api/_cors.js` lines 1–3):
```javascript
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(.*\.)?worldmonitor\.app$/,
  /^https:\/\/worldmonitor-[a-z0-9-]+-elie-[a-z0-9]+\.vercel\.app$/,
```

**After**:
```javascript
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(.*\.)?worldmonitor\.app$/,
  /^https:\/\/(.*\.)?sachnetra\.com$/,
  /^https:\/\/worldmonitor-[a-z0-9-]+-elie-[a-z0-9]+\.vercel\.app$/,
```

---

**Before** (`server/cors.ts` lines 8–10):
```typescript
const PRODUCTION_PATTERNS: RegExp[] = [
  /^https:\/\/(.*\.)?worldmonitor\.app$/,
  /^https:\/\/worldmonitor-[a-z0-9-]+-elie-[a-z0-9]+\.vercel\.app$/,
```

**After**:
```typescript
const PRODUCTION_PATTERNS: RegExp[] = [
  /^https:\/\/(.*\.)?worldmonitor\.app$/,
  /^https:\/\/(.*\.)?sachnetra\.com$/,
  /^https:\/\/worldmonitor-[a-z0-9-]+-elie-[a-z0-9]+\.vercel\.app$/,
```

---

**Before** (`api/_api-key.js` lines 8–10):
```javascript
const BROWSER_ORIGIN_PATTERNS = [
  /^https:\/\/(.*\.)?worldmonitor\.app$/,
  /^https:\/\/worldmonitor-[a-z0-9-]+-elie-[a-z0-9]+\.vercel\.app$/,
```

**After**:
```javascript
const BROWSER_ORIGIN_PATTERNS = [
  /^https:\/\/(.*\.)?worldmonitor\.app$/,
  /^https:\/\/(.*\.)?sachnetra\.com$/,
  /^https:\/\/worldmonitor-[a-z0-9-]+-elie-[a-z0-9]+\.vercel\.app$/,
```

---

**Before** (`middleware.ts` lines 14–18):
```typescript
const VARIANT_HOST_MAP: Record<string, string> = {
  'tech.worldmonitor.app': 'tech',
  'finance.worldmonitor.app': 'finance',
  'happy.worldmonitor.app': 'happy',
};
```

**After**:
```typescript
const VARIANT_HOST_MAP: Record<string, string> = {
  'tech.worldmonitor.app': 'tech',
  'finance.worldmonitor.app': 'finance',
  'happy.worldmonitor.app': 'happy',
  'sachnetra.com': 'india',
};
```

---

## Read vs Write

**READ for reference (always allowed):**
- `src/config/variants/full.ts` — study pattern, quote from it, never write
- `src/config/variants/tech.ts` — study pattern, quote from it, never write
- `src/config/variant-meta.ts` — reference OG metadata values
- `src/config/variant.ts` — confirm hostname detection exists
- `api/rss-proxy.js` — verify relay behavior
- `api/bootstrap.js` — verify Redis usage

**WRITE only to files explicitly listed in this task:**
- `api/_cors.js` — add sachnetra.com CORS pattern
- `server/cors.ts` — add sachnetra.com CORS pattern
- `api/_api-key.js` — add sachnetra.com trusted origin
- `middleware.ts` — add sachnetra.com host/OG metadata
- `vercel.json` — add sachnetra.com to CSP headers
- `index.html` — add sachnetra.com to CSP meta tag

**Never write to:**
- `src/config/variants/full.ts` — sacred, existing live variant
- `src/config/variants/tech.ts` — sacred, existing live variant
- `src/config/variants/finance.ts` — sacred, existing live variant

---

## Verify

```bash
npm run typecheck   # Must show: 0 errors
```

In browser (`npm run dev` with `VITE_VARIANT=india`):
- [ ] App loads without crash at localhost
- [ ] SachNetra splash screen displays correctly
- [ ] Indian news headlines appear in feed
- [ ] AI summaries generate when clicking a story
- [ ] No CORS errors in browser console
- [ ] No 401 errors in Network tab

### Post-Deploy Verification (James does this after Vercel deploy)

- [ ] `sachnetra.com` loads without crash
- [ ] SachNetra splash screen shows correctly (diya logo, greeting, date)
- [ ] Indian news headlines appear in feed (at least 10 stories)
- [ ] AI summaries generate (What Happened + What This Means)
- [ ] State selector toggles correctly
- [ ] Map tab loads India-centered map
- [ ] No CORS errors in browser console (check Network tab for 403s)
- [ ] No 401 "API key required" errors in Network tab
- [ ] WhatsApp/Twitter link preview shows SachNetra OG metadata

### Debugging Checklist (if something looks wrong after deploy)

1. **Network tab → filter `/api/`** — Look for 403 (CORS) or 401 (API key). If either appears, the CORS/API-key fix didn't deploy
2. **Console: `[App] Variant check:`** — should show `current="india"`. If it shows `"full"`, hostname detection isn't matching
3. **Console: `[rss-proxy]` errors** — 502/504 = feed publisher blocking Vercel edge. Expected for some feeds. Not a bug
4. **Network tab → filter `bootstrap`** — 200 with empty `data: {}` = Redis cache is empty. Normal on first deploy, fills after ~5 min
5. **AI summaries missing** — Check `GROQ_API_KEY` env var is set in Vercel dashboard
6. **Blank page** — Check build logs in Vercel dashboard for TypeScript errors

---

## Vercel Dashboard Configuration (James — Manual Steps)

These are NOT code changes. James does these in the Vercel web dashboard:

### Environment Variables to Set

| Variable | Value | Environments |
|---|---|---|
| `VITE_VARIANT` | `india` | Production, Preview, Development |
| `UPSTASH_REDIS_REST_URL` | *(from Upstash console)* | Production, Preview |
| `UPSTASH_REDIS_REST_TOKEN` | *(from Upstash console)* | Production, Preview |
| `GROQ_API_KEY` | *(from console.groq.com)* | Production, Preview |
| `OPENROUTER_API_KEY` | *(from openrouter.ai)* | Production, Preview |

### Domain Setup

1. **Vercel Dashboard → Project Settings → Domains**
2. Add `sachnetra.com` and `www.sachnetra.com`
3. **DNS registrar**: point `sachnetra.com` → CNAME `cname.vercel-dns.com`
4. Vercel auto-provisions SSL

### Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 22 (matches `.nvmrc`)

---

## Completion Log

- [x] Phase 1 complete (CORS + API key) — 2026-04-02T13:18 IST
- [x] Phase 2 complete (Middleware) — 2026-04-02T13:21 IST
- [x] Phase 3 complete (CSP headers) — 2026-04-02T13:22 IST
- [x] Typecheck: 0 errors — 2026-04-02T13:24 IST
- [ ] Browser verified (local dev) — [timestamp]
- [ ] Vercel env vars configured (James) — [timestamp]
- [ ] Custom domain configured (James) — [timestamp]
- [ ] Post-deploy verification pass — [timestamp]
- [ ] **TASK 008 COMPLETE** ✅

---

## Lessons Learned

*(Fill in after task completion)*
