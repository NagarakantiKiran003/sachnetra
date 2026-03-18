# SachNetra — UI Design & Brand

## Brand Identity

### Name & Tagline
- **Product name**: SachNetra
- **Hindi**: सच्चनेत्र
- **Tagline**: See clearly
- **Both shown on loading screen**: English name + Devanagari subtitle

### Logo Mark
- **Concept**: Diya (Indian oil lamp) + eye
- **Meaning**: Light of knowledge + vision/clarity
- **NOT**: Classic eye (feels creepy/surveillance), Globe, Generic icon

### Color Palette
- **Primary**: Purple (#7b7bff) + Saffron (#FF9933)
- **Direction**: Purple to saffron gradient on the logo mark
- **Background**: Deep dark (#0a0812) with radial glow
- **Wordmark**: Solid white — NOT gradient (gradient on wordmark hurts legibility)

### Why these colors
- Purple = modern, tech, calm — opposite of red panic energy of Indian news channels
- Saffron = Indian identity, warmth
- Dark background = premium feel, AMOLED battery-saving, works well on mid-range Android

---

## Loading Screen

### What it shows
```
[SachNetra logo mark — 72px]
SachNetra                    ← solid white, 24px
सच्चनेत्र                   ← muted warm grey, 13px
──────────                   ← thin divider
[Date: Saturday, 15 March]   ← pulled from browser, 13px
[Time-aware greeting]        ← 21px, bold
[Loading bar — purple to saffron gradient]
```

### Time-aware greeting (CRITICAL DECISION)
This changes based on when the user opens the app:

| User opens at | Greeting |
|---|---|
| 5am – 11am | "Here's India this morning." |
| 11am – 5pm | "Here's India right now." |
| 5pm – 10pm | "Here's India this evening." |
| 10pm – 5am | "Here's India tonight." |

**Implementation**: 10 lines of JavaScript, reads `new Date().getHours()`

### Loading screen behavior
While the quote shows (300–800ms), the bootstrap request fires in background fetching all cached data from Redis. When it disappears, content is ready.

---

## Home Screen

### Layout (top to bottom)
```
1. Header
   [Logo 26px] SachNetra        [Search icon] [Bell icon]

2. State selector bar (always visible, collapsible)
   [★] All India ▼   |   "Change state"

3. Today's Brief (AI summary card)
   Purple dot · TODAY'S BRIEF
   "Heavy rains continue across Assam..."
   3 calm sentences, plain language

4. Time divider
   ────── This morning ──────

5. Story cards (scrollable)
   [Category badge] [Source count] [Time ago · Location]
   [Story title — 13px bold]
   [Plain summary — 12px muted]
   [Eye icon] [Share icon]
   ─────────────────────────

6. Time divider
   ────── Last night ──────

7. More story cards...

8. Bottom tab bar
   Home · Timeline · Map · States
```

### Time dividers (CRITICAL DECISION)
Dividers change based on when user opens the app:

| User opens in | Dividers shown |
|---|---|
| Morning (5am–11am) | "Yesterday" |
| Afternoon (11am–5pm) | "This morning" |
| Evening (5pm–10pm) | "This afternoon" |
| Night (10pm–5am) | "Today" |

Always relative to when the user opens. Never stale-feeling.

### State selector
- Default: "All India" (collapsed, single bar)
- Tap to expand: grid of all 28 states + 8 UTs
- Each state shows main city below name
- Currently selected highlighted in purple
- Tap "Done" to collapse

### Story cards
- Category badge (Politics / Disaster / Economy / Social)
- Source count badge (green: "8 sources")
- Time + location below category
- Title (13px, bold, white)
- 1-line plain summary (12px, muted)
- Eye icon + Share icon in footer
- Small icon thumbnail on right (keep — decided)
- NO: red/orange colors, ALL CAPS labels, breaking news panic styling

### Bottom navigation — 4 tabs
1. **Home** — news feed (active tab)
2. **Timeline** — chronological view
3. **Map** — India map (secondary, not primary)
4. **States** — state selector / state-specific view

---

## Story Detail Screen

### Layout (top to bottom)
```
1. Header
   [← Back]                    [Share icon]

2. Metadata
   [Category badge] [Location · Time] [Source count badge]

3. Title (16px bold)

4. Divider

5. "What happened" card (purple border)
   Purple dot · WHAT HAPPENED
   2–3 sentences, plain factual summary

6. "What this means" card (green border)
   Green dot · WHAT THIS MEANS
   1–2 sentences, practical impact for the reader

7. Sources section (collapsible)
   "Sources" heading | "8 reporting"
   [Source name] [Tier badge] [Time ago]
   First 3 shown, "+ 5 more sources" expands rest

8. [Removed for V1: Related stories]
9. [Removed for V1: Mini map]

10. Pinned bottom bar
    [WhatsApp share button — green, always visible]
```

### Loading state (skeleton)
- Shimmer animation on all content areas
- Shows immediately from cache (< 200ms)
- Content slots in as data arrives

### Two summaries — AI output format
The Groq API must return JSON with two fields:
```json
{
  "summary": "Heavy rainfall since Tuesday caused the Brahmaputra river to overflow in Barpeta, Morigaon, and Nagaon districts. Around 40,000 people have been displaced. NDRF teams are on the ground and NH-15 near Guwahati remains blocked.",
  "meaning": "If you are travelling to or from Assam, check NH-15 status before departing. Rain is forecast to continue through the weekend. Relief camps are open in all three districts."
}
```

Both stored in same Redis cache key. One API call. Both summaries served to all users from cache.

### Source tier display
- Tier 1: purple badge
- Tier 2: blue badge
- Tier 3: grey badge
- Show: source name, tier, time ago
- Don't show: full URL, raw headline

---

## Design Principles

1. **No panic colors** — no red breaking banners, no ALL CAPS, no exclamation marks in UI
2. **Calm typography** — 16px body, generous line height (1.7), muted secondary text
3. **Dark first** — dark background primary, works on AMOLED, saves battery
4. **One tap to share** — WhatsApp button always visible, never buried
5. **Evidence not noise** — show source count + tier, not raw source list
6. **Time-aware** — app knows when you are, greets accordingly
7. **State-first** — India is diverse, state context always available

---

## Mobile Specifications

- **Target devices**: Redmi, Realme, Samsung M-series (mid-range Android)
- **Target connection**: 4G (Jio), fallback to 3G
- **Performance target**: Load under 3 seconds on 4G
- **Min font size**: 11px (never smaller)
- **Touch targets**: 44px minimum (finger-friendly)
- **No heavy WebGL on mobile first load**: Map is secondary tab, not primary
