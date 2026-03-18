# SachNetra — Wireframes
*Prep Document 08 | The Adapt Sprint*

ASCII wireframes for every screen James needs to build.
These are the source of truth for layout. 02_ui_design.md has the styling details.

---

## Screen Index

1. Loading Screen
2. Home Screen — State Bar Collapsed (default)
3. Home Screen — State Bar Expanded
4. Story Detail Screen
5. Map Tab
6. Navigation Flow

---

## 1. Loading Screen

Shown for 300–800ms while bootstrap data fetches from Redis.

```
================================================================================
LOADING SCREEN  (375px wide, full height, dark background #0a0812)
================================================================================

┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│            ┌─────────┐              │
│            │  [DIYA  │              │
│            │  +EYE   │              │
│            │  LOGO]  │              │
│            │  72px   │              │
│            └─────────┘              │
│                                     │
│           SachNetra                 │  ← solid white, 24px
│           सच्चनेत्र                │  ← muted warm grey, 13px
│                                     │
│           ────────────              │  ← thin divider
│                                     │
│        Saturday, 15 March           │  ← from new Date(), 13px
│                                     │
│    Here's India this morning.       │  ← time-aware, 21px bold
│                                     │
│         [████████░░░░░░░░]          │  ← gradient loading bar
│         purple → saffron            │    100px wide, 2px tall
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘

TIME-AWARE GREETING:
  5am–11am  → "Here's India this morning."
  11am–5pm  → "Here's India right now."
  5pm–10pm  → "Here's India this evening."
  10pm–5am  → "Here's India tonight."
```

---

## 2. Home Screen — State Bar Collapsed (Default)

```
================================================================================
HOME SCREEN — STATE BAR COLLAPSED  (375px wide)
================================================================================

┌─────────────────────────────────────┐
│ [LOGO] SachNetra     [🔍]  [🔔●]   │  ← header, #0d0a1f bg
│                                     │    bell has orange dot when alert
├─────────────────────────────────────┤
│ [★] All India          Change state▼│  ← state bar, always visible
│                            #13112a  │    tap anywhere to expand
├─────────────────────────────────────┤
│                                     │
│  ● TODAY'S BRIEF                    │  ← purple dot, uppercase label
│  ─────────────────────────────────  │    #13112a card with purple border
│  Heavy rains continue across        │
│  Assam and Bihar. Parliament's      │
│  budget session enters day 3.       │  ← 3 calm sentences, AI-generated
│  RBI keeps rates unchanged.         │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ─────── This morning ──────        │  ← time divider, muted text
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Disaster] [8 sources]          │ │  ← category + source count badges
│ │                          [IMG]  │ │
│ │ Floods in Assam affect   52px   │ │  ← title, 13px bold white
│ │ 40,000 across 3 districts       │ │
│ │ NDRF teams deployed, NH-15      │ │  ← 1-line summary, 12px muted
│ │ blocked near Guwahati.          │ │
│ │ Assam · 2 hours ago   [👁] [↗] │ │  ← location, time, eye+share icons
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Politics] [12 sources]         │ │
│ │                          [IMG]  │ │
│ │ Budget session: Farm loan       │ │
│ │ waiver bill tabled in Lok Sabha │ │
│ │ Opposition walks out. Vote      │ │
│ │ expected tomorrow.              │ │
│ │ Delhi · 4 hours ago   [👁] [↗] │ │
│ └─────────────────────────────────┘ │
│                                     │
│  ─────── Last night ────────        │  ← second time divider
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Economy] [8 sources]           │ │
│ │                          [IMG]  │ │
│ │ RBI holds repo rate at 6.5%     │ │
│ │ for sixth straight meeting      │ │
│ │ Governor cites stable           │ │
│ │ inflation. EMIs stay unchanged. │ │
│ │ Mumbai · Yesterday 11pm [👁][↗] │ │
│ └─────────────────────────────────┘ │
│                                     │
│           [more cards...]           │
│                                     │
├─────────────────────────────────────┤
│  [🏠 Home] [⏱ Timeline] [🗺 Map] [📍States]  │  ← bottom nav, 4 tabs
└─────────────────────────────────────┘

TIME DIVIDER LOGIC (what label appears):
  User opens morning (5am–11am)  → "Yesterday"
  User opens afternoon (11am–5pm) → "This morning"
  User opens evening (5pm–10pm)  → "This afternoon"
  User opens night (10pm–5am)    → "Today"
```

---

## 3. Home Screen — State Bar Expanded

```
================================================================================
HOME SCREEN — STATE BAR EXPANDED  (375px wide)
================================================================================

┌─────────────────────────────────────┐
│ [LOGO] SachNetra                Done│  ← "Done" replaces icons
├─────────────────────────────────────┤
│ [★] All India               ▲       │  ← arrow points up = open
│                            #13112a  │    purple border = focused
├─────────────────────────────────────┤
│                                     │
│  Select your state                  │  ← 11px muted label
│                                     │
│ ┌───────────────┐ ┌───────────────┐ │
│ │ All India     │ │ Maharashtra   │ │  ← All India highlighted purple
│ │ National view │ │ Mumbai        │ │
│ └───────────────┘ └───────────────┘ │
│ ┌───────────────┐ ┌───────────────┐ │
│ │ Uttar Pradesh │ │ Delhi         │ │
│ │ Lucknow       │ │ NCR           │ │
│ └───────────────┘ └───────────────┘ │
│ ┌───────────────┐ ┌───────────────┐ │
│ │ Karnataka     │ │ Tamil Nadu    │ │
│ │ Bengaluru     │ │ Chennai       │ │
│ └───────────────┘ └───────────────┘ │
│ ┌───────────────┐ ┌───────────────┐ │
│ │ West Bengal   │ │ Gujarat       │ │
│ │ Kolkata       │ │ Ahmedabad     │ │
│ └───────────────┘ └───────────────┘ │
│ ┌───────────────┐ ┌───────────────┐ │
│ │ Rajasthan     │ │ Punjab        │ │
│ │ Jaipur        │ │ Chandigarh    │ │
│ └───────────────┘ └───────────────┘ │
│ ┌───────────────┐ ┌───────────────┐ │
│ │ Kerala        │ │ Assam         │ │
│ │ Thiruvananthu │ │ Guwahati      │ │
│ └───────────────┘ └───────────────┘ │
│                                     │
│      + 24 more states & UTs         │  ← scrollable
│                                     │
├─────────────────────────────────────┤
│  [🏠 Home] [⏱ Timeline] [🗺 Map] [📍States]  │
└─────────────────────────────────────┘

STATE SELECTED STATE (e.g. Maharashtra chosen):
  Bar shows: [MH flag] Maharashtra ▼
  Feed filters to Maharashtra stories only
  Persisted in localStorage as 'sn-selected-state'
  Tap bar again to change state
```

---

## 4. Story Detail Screen

```
================================================================================
STORY DETAIL — LOADED  (375px wide)
================================================================================

┌─────────────────────────────────────┐
│ ← Back                          [↗] │  ← back + share in header
├─────────────────────────────────────┤
│                                     │
│ [Disaster] Assam · 2 hours ago      │  ← metadata row
│ [8 sources ●]                       │    green source count badge
│                                     │
│ Floods in Assam affect 40,000       │  ← title, 16px bold white
│ people across 3 districts           │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ● WHAT HAPPENED                 │ │  ← purple dot + label
│ │ ─────────────────────────────── │ │    purple left border
│ │ Heavy rainfall since Tuesday    │ │
│ │ caused the Brahmaputra river    │ │  ← 2-3 sentences, factual
│ │ to overflow in Barpeta,         │ │    plain language
│ │ Morigaon, and Nagaon. Around    │ │
│ │ 40,000 people displaced. NDRF   │ │
│ │ teams on ground. NH-15 near     │ │
│ │ Guwahati blocked.               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ● WHAT THIS MEANS               │ │  ← green dot + label
│ │ ─────────────────────────────── │ │    green left border
│ │ If travelling to/from Assam,    │ │
│ │ check NH-15 status before       │ │  ← 1-2 sentences, practical
│ │ departing. Rain continues       │ │    actionable impact
│ │ through weekend. Relief camps   │ │
│ │ open in all three districts.    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Sources                    8 reporting│
│ ─────────────────────────────────── │
│ ● NDTV              [Tier 1]  2h ago│
│ ● The Hindu         [Tier 1]  3h ago│
│ ● ANI               [Tier 1]  3h ago│
│   + 5 more sources              ▼   │  ← expands on tap
│                                     │
│ [REMOVED FOR V1: Related stories]   │
│ [REMOVED FOR V1: Mini map]          │
│                                     │
├─────────────────────────────────────┤
│  [  🟢  Share on WhatsApp  ]        │  ← pinned, always visible
│     green button, full width        │    never buried by scroll
└─────────────────────────────────────┘


LOADING STATE (skeleton, shown < 200ms):
┌─────────────────────────────────────┐
│ ← Back                              │
├─────────────────────────────────────┤
│ [░░░░░░░] [░░░░░░░░░░░░]            │  ← shimmer on metadata
│ [░░░░░░░░]                          │
│                                     │
│ [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]    │  ← shimmer on title
│ [░░░░░░░░░░░░░░░░░░░]               │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [░░░░░░░░░░░░]                  │ │
│ │ [░░░░░░░░░░░░░░░░░░░░░░░░░░░░] │ │  ← shimmer on summaries
│ │ [░░░░░░░░░░░░░░░░░░░░░░]        │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│  [  🟢  Share on WhatsApp  ]        │  ← always visible even while loading
└─────────────────────────────────────┘
```

---

## 5. Map Tab

```
================================================================================
MAP TAB  (375px wide)
================================================================================

┌─────────────────────────────────────┐
│ [LOGO] SachNetra     [🔍]  [🔔]    │
├─────────────────────────────────────┤
│ [★] Maharashtra ▼                   │  ← state bar (same as home)
├─────────────────────────────────────┤
│                                     │
│  ╔═════════════════════════════╗    │
│  ║                             ║    │
│  ║     [INDIA MAP HERE]        ║    │
│  ║     Centered: [78, 22]      ║    │
│  ║     Zoom: 4                 ║    │
│  ║                             ║    │  ← flat 2D map (NO 3D globe)
│  ║   States outlined in faint  ║    │    OpenFreeMap dark theme
│  ║   purple. States with news  ║    │    + Datameet GeoJSON overlay
│  ║   glow brighter (saffron).  ║    │    for correct Kashmir boundary
│  ║                             ║    │
│  ║   ★ = earthquake markers   ║    │
│  ║   • = protest markers       ║    │
│  ║                             ║    │
│  ╚═════════════════════════════╝    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Layers                   ▼  │   │  ← layer toggle panel
│  │ ✓ State outlines            │   │
│  │ ✓ Earthquakes               │   │
│  │ ✓ Protests                  │   │
│  │ ○ Internet outages          │   │
│  │ ○ Wildfires                 │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  [🏠 Home] [⏱ Timeline] [🗺 Map●] [📍States]  │
└─────────────────────────────────────┘

MAP RULES:
  - Never loads on app start — only when Map tab is tapped
  - No 3D globe ever — flat map only for india variant
  - Default layers ON: earthquakes, protests, state outlines
  - Default layers OFF: fires, outages, all military/intel
  - Kashmir shown with Datameet GeoJSON (SoI official boundary)
  - Tapping a state opens country brief for that state
```

---

## 6. Navigation Flow

```
================================================================================
NAVIGATION FLOW
================================================================================

                    ┌──────────────┐
                    │ LOADING      │
                    │ SCREEN       │
                    │ 300–800ms    │
                    └──────┬───────┘
                           │ auto
                           ▼
┌──────────────────────────────────────────────────────────┐
│                    HOME SCREEN                           │
│  [Today's Brief] + [Time-divided story feed]             │
└──────┬──────────────────┬──────────────┬────────────────┘
       │                  │              │
       │ tap story        │ tap state    │ tap Map tab
       │ card             │ bar          │
       ▼                  ▼              ▼
┌─────────────┐  ┌────────────────┐  ┌──────────────────┐
│   STORY     │  │ STATE SELECTOR │  │   MAP TAB        │
│   DETAIL    │  │ EXPANDED       │  │   India map      │
│             │  │                │  │                  │
│ ← Back      │  │ Select state   │  │ Tap state area   │
│ returns to  │  │ → filters feed │  │ → story detail   │
│ home feed   │  │ → grid closes  │  │   for that state │
└─────────────┘  └────────────────┘  └──────────────────┘
       │
       │ tap WhatsApp button
       ▼
┌─────────────┐
│  WHATSAPP   │
│  SHARE      │
│  (native)   │
└─────────────┘

BOTTOM NAV TABS:
  Home      → home screen (news feed)
  Timeline  → chronological view (V1: same as home, sorted by time)
  Map       → India map tab
  States    → same as tapping state bar on home

BACK NAVIGATION:
  Story detail → Back → home screen (same scroll position)
  Map → Back button in browser/OS → home screen
  State selector expanded → "Done" → home screen (filtered)
```

---

## Design Constants Reference

```
COLORS (CSS variables):
  --sn-purple:       #7b7bff   (primary, logo gradient start)
  --sn-saffron:      #FF9933   (secondary, logo gradient end)
  --sn-dark-bg:      #0a0812   (page background)
  --sn-deep-bg:      #0d0a1f   (header background)
  --sn-card-bg:      #100e24   (story card background)
  --sn-border:       #1e1c3a   (card borders, dividers)
  --sn-text-primary: #e8e0ff   (headlines, main text)
  --sn-text-secondary: #9090c0 (metadata, secondary text)
  --sn-text-muted:   #4a4870   (timestamps, very subtle text)
  --sn-green:        #22c55e   (What This Means card, WhatsApp button)

TYPOGRAPHY:
  Title:     13px, font-weight 500, --sn-text-primary
  Summary:   12px, font-weight 400, --sn-text-secondary
  Meta:      11px, font-weight 400, --sn-text-muted
  Min size:  11px (never smaller)

SPACING:
  Touch targets:  44px minimum height
  Card padding:   12px 14px
  Card gap:       8px between cards
  Section gap:    16px between sections

BADGES:
  Category:    #1e1c3a bg, --sn-text-secondary text, 4px radius
  Source count: green bg (#0f1a0f), green text (#22c55e)
  Tier 1:      #1a1840 bg, #7070b0 text
  Tier 2:      #1a2040 bg, #6080c0 text
  Tier 3:      #1e1c3a bg, #6b6090 text
```
