# SachNetra — System Design
*Prep Document 03 | The Adapt Sprint*

---

## Core Approach: WorldMonitor Variant

SachNetra is NOT a new application. It is a new **variant** inside the existing WorldMonitor codebase. This is the most important technical decision made. Do not deviate from it.

WorldMonitor already ships four variants from one codebase:
```
worldmonitor.app         → full variant
tech.worldmonitor.app    → tech variant
finance.worldmonitor.app → finance variant
happy.worldmonitor.app   → happy variant
```

SachNetra adds one more:
```
sachnetra.com → india variant
```

**One file controls everything for a variant:**
```
src/config/variants/india.ts
```

This file exports:
- `FEEDS` — which RSS feeds to show
- `DEFAULT_MAP_LAYERS` — which map layers are on by default
- `DEFAULT_PANELS` — which panels appear
- Variant-specific constants

**Pattern to follow:** `src/config/variants/tech.ts`
This is the model. Study it before touching anything.

---

## What Stays Identical (James Does Not Touch)

```
INFRASTRUCTURE — DO NOT TOUCH:
  Vercel edge functions (60+)
  Railway relay server
  Redis/Upstash caching (3-tier)
  AI summarization pipeline
  RSS proxy infrastructure
  Bootstrap hydration system
  Circuit breakers and resilience
  TypeScript codebase structure
  Panel system and base classes
  deck.gl + MapLibre map engine
  sebuf proto API system
  All existing variant files (full.ts, tech.ts, finance.ts)
  All existing .proto files
  CLAUDE.md (update only, never delete existing content)
```

---

## What Changes (Exact File List)

```
FILE                                    ACTION          PRIORITY
──────────────────────────────────────────────────────────────
src/config/variants/india.ts            CREATE NEW      P1
src/App.ts                              MODIFY          P1
api/_cors.js                            MODIFY          P1
server/cors.ts                          MODIFY          P1
api/groq-summarize.js                   MODIFY          P3
api/openrouter-summarize.js             MODIFY          P3
public/sachnetra-logo.svg               CREATE NEW      P2
public/sachnetra-favicon.ico            CREATE NEW      P2
src/styles/main.css                     MODIFY          P2
src/config/countries.ts                 MODIFY          P4
CLAUDE.md                               MODIFY (append) P1
```

---

## The india.ts Variant File — What It Contains

Copy `src/config/variants/tech.ts` as the starting point.
Replace its contents with SachNetra-specific config.

### FEEDS array
Indian RSS sources replacing global ones.
See `04_data_sources.md` for the complete feed list.

### DEFAULT_MAP_LAYERS
```typescript
export const DEFAULT_MAP_LAYERS = {
  // KEEP — works globally, India covered
  earthquakes: true,   // India is seismically active — useful signal
  protests: true,      // ACLED/GDELT India data — relevant for SachNetra
  outages: false,      // Useful but off by default to reduce noise

  // OFF — too much noise for news clarity audience
  fires: false,        // NASA FIRMS produces hundreds of hotspots daily in India
                       // Overwhelming for average user — let them toggle on

  // TURN OFF — not relevant for SachNetra V1
  conflicts: false,
  bases: false,
  nuclear: false,
  cables: false,
  pipelines: false,
  vessels: false,
  flights: false,
  gpsJamming: false,
  cyberThreats: false,

  // India-specific (add when layers are built in Task 006)
  // indiaStates: true,
}
```

### DEFAULT_PANELS
Remove intelligence-heavy panels. Keep news and map.
```typescript
export const DEFAULT_PANELS = [
  'liveNews',        // Primary — Indian RSS feed
  'insights',        // AI two-summary brief
  'map',             // India map view
  // Remove: strategicRisk, militaryPosture, cii, theaterPosture
]
```

---

## Hostname Detection — How to Register India Variant

In `src/App.ts`, find where variant detection happens.
It currently looks like:
```typescript
if (hostname.includes('tech.worldmonitor')) return 'tech';
if (hostname.includes('finance.worldmonitor')) return 'finance';
```

Add:
```typescript
if (hostname.includes('sachnetra')) return 'india';
```

Also add localhost development override:
```typescript
// For local dev: set VITE_VARIANT=india in .env.local
if (import.meta.env.VITE_VARIANT === 'india') return 'india';
```

---

## CORS Update

Both files must be updated. Miss either one and requests fail.

**`api/_cors.js`** — add to ALLOWED_ORIGIN_PATTERNS:
```javascript
/^https?:\/\/(.*\.)?sachnetra\.com$/,
/^https?:\/\/sachnetra-.*\.vercel\.app$/,
```

**`server/cors.ts`** — add same patterns.

---

## Vercel Deployment

SachNetra runs as a separate Vercel project pointing to the same codebase, OR as a new domain on the existing WorldMonitor Vercel deployment.

**Recommended for V1**: Separate Vercel project
- Fork the WorldMonitor repo to `sachnetra` repo
- Deploy from that fork
- Set environment variables independently

**Environment variables needed:**
```bash
VITE_VARIANT=india
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
GROQ_API_KEY=
OPENROUTER_API_KEY=
ACLED_API_KEY=
VITE_WS_RELAY_URL=wss://your-railway-relay.railway.app
```

---

## Architecture — How Data Flows In SachNetra

```
User opens sachnetra.com
        ↓
Variant detection → 'india'
        ↓
Bootstrap hydration fires
  → 2 parallel Redis pipeline calls
  → Returns 38 cached datasets instantly
  → Panels render with cached data
        ↓
india.ts FEEDS array loaded
  → Indian RSS URLs fetched via RSS proxy
  → Clustered (Jaccard similarity > 50%)
  → Classified (keyword → LLM)
        ↓
For each story cluster:
  → groq-summarize.js called
  → Returns { summary, meaning } JSON
  → Both cached in Redis 24h
  → ALL users see cached summaries
        ↓
User sees:
  Today's Brief (3-sentence AI summary)
  Time-divided story feed
  State selector
```

---

## Performance Architecture for 500,000 Users

```
THE KEY INSIGHT:
  500,000 users reading same morning brief
  = 1 Groq API call (cached for everyone)

  Without caching: 500,000 calls = instant bankruptcy
  With Redis cache: 1 call per unique story = sustainable

WHAT SCALES AUTOMATICALLY:
  Vercel edge functions → auto-scale
  Upstash Redis → auto-scale
  Cloudflare CDN → unlimited
  Static assets → cached 1 year

WHAT NEEDS MONITORING AT SCALE:
  Railway relay → upgrade plan if needed
  Upstash Redis → monitor request count
  Groq API → monitor rate limits

PEAK LOAD ESTIMATE:
  500K users × 15% concurrent = 75K simultaneous
  75K × 3 page loads/hour = 225K requests/hour
  = ~62 requests/second peak
  Vercel handles this without configuration
```

---

## Mobile Performance Requirements

SachNetra targets mid-range Android devices (Redmi, Realme, Samsung M-series).

```
TARGET DEVICE:
  Processor: Snapdragon 6xx series equivalent
  RAM: 4GB
  Connection: 4G Jio (average 15 Mbps)
  Browser: Chrome for Android

PERFORMANCE BUDGET:
  First contentful paint: < 1.5 seconds
  Time to interactive: < 3 seconds
  Loading screen visible: 300–800ms (while data fetches)
  Story feed renders: < 1 second from cache

HOW WE ACHIEVE THIS:
  Bootstrap hydration: data ready before DOM paints
  Redis cache: no upstream API calls on most requests
  No 3D globe on initial load
  Map loads only when user taps Map tab
  Images lazy-loaded
  No heavy WebGL until user navigates to map
```

---

## V1 Scope Boundary — What Is Explicitly Excluded

```
EXCLUDED FROM V1 (do not build, do not reference):
  ✗ RSSHub deployment
  ✗ Firecrawl integration
  ✗ Gemini scraping agent
  ✗ Graph database (Graphiti, Neo4j, FalkorDB)
  ✗ Knowledge graph / "all-seeing eye"
  ✗ State Instability Index (complex scoring)
  ✗ LAC/LOC border layer (research needed)
  ✗ LWE district layer (data sourcing needed)
  ✗ Indian military base database
  ✗ Election monitor
  ✗ Internet shutdown tracker
  ✗ Communal incident tracking
  ✗ Regional language support (Hindi, Tamil, etc.)
  ✗ Government variant (tenders, schemes, auctions)
  ✗ WhatsApp brief delivery automation
  ✗ Push notifications
  ✗ User accounts / authentication
  ✗ Desktop (Tauri) variant

ALL OF THE ABOVE → Backlog. Do not touch in V1.
```

---

## Fork Strategy

**Hard fork** — fork once, never pull from upstream WorldMonitor.

```
Reason:
  SachNetra and WorldMonitor will diverge significantly
  Merge conflicts would be complex and frequent
  V1 needs to ship fast — no upstream sync overhead

What this means:
  WorldMonitor improvements don't auto-apply to SachNetra
  We miss bug fixes from upstream
  We own our version completely

Revisit after V1:
  After launch, decide if periodic manual cherry-picks
  are worth the effort
```

**Open source commitment:**
- Keep MIT license file
- Add to README: "Built on WorldMonitor by Elie Habib (github.com/koala73/worldmonitor)"
- This is legally required and strategically smart

---

## CLAUDE.md Update

Add this section to the existing CLAUDE.md file. Do not replace existing content.

```markdown
## SachNetra Adaptation — Read This First

This codebase is being adapted into SachNetra (sachnetra.com).
SachNetra is an Indian news clarity tool for urban Indians 18-35.

We are adding ONE new variant: `india`
The only new file that controls everything: src/config/variants/india.ts
Pattern to follow: src/config/variants/tech.ts

## What we are building
- New file: src/config/variants/india.ts
- Hostname: sachnetra.com → india variant
- Indian RSS feeds replacing global feeds
- SachNetra branding (logo, colors, loading screen)
- Mobile-first CSS
- Two-summary AI prompt ({ summary, meaning } JSON)
- India state boundary map layer (basic)
- State keyword filtering

## What you must NEVER touch
- src/config/variants/full.ts
- src/config/variants/tech.ts
- src/config/variants/finance.ts
- Any existing .proto files
- server/gateway.ts
- Railway relay scripts (scripts/ais-relay.cjs)
- Redis configuration
- Any existing panel TypeScript files not in your task

## Pattern rules
- When adding variant config: model after tech.ts exactly
- When modifying edge function: follow existing pattern in that file
- Run npm run typecheck after every change — must pass zero errors
- One task at a time. Never combine two tasks into one session.
```
