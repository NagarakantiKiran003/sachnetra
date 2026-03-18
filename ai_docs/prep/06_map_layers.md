# SachNetra — Map Layers
*Prep Document 06 | The Adapt Sprint*

---

## Map Philosophy For SachNetra

WorldMonitor is map-first. The globe is the hero.
SachNetra is feed-first. The map is secondary.

```
WorldMonitor: User opens → sees globe → browses map layers
SachNetra:    User opens → sees news feed → taps Map tab → sees map
```

The map tab exists. It is useful. But it is not the product.
This changes which layers matter and how they are configured.

---

## ⚠️ CRITICAL — Kashmir Boundary Compliance

**This is the most important technical decision in map implementation.**

India's IT Rules require that maps distributed in India display
the Survey of India (SoI) official boundary for Jammu & Kashmir
and Aksai Chin — showing them fully within India.

OpenFreeMap and OpenStreetMap use the "on the ground" rule
(actual territorial control) — which shows an incorrect boundary
for India's official position and potentially violates India's IT Act.

**Do NOT use OpenFreeMap as the default basemap for SachNetra.**

### Correct Solution — Two Parts

**Part 1: GeoJSON overlay from Datameet**

Source: https://github.com/datameet/maps
File: States.geojson or Districts.geojson
License: Open Data Commons ODbL (free to use)
This uses Survey of India official boundaries.

Upload to R2: `maps.sachnetra.com/india-states-official.geojson`

This GeoJSON sits ON TOP of the basemap and correctly shows:
- Jammu & Kashmir fully within India
- Aksai Chin within India
- Official SoI demarcation

**Part 2: Use PMTiles for basemap (preferred) or OpenFreeMap with overlay**

Option A (V1 — faster to implement):
  Use OpenFreeMap as basemap
  Place Datameet GeoJSON overlay on top
  The overlay visually corrects the basemap boundary for India

Option B (V1 proper — recommended):
  Self-host India-compliant PMTiles on R2
  URL: maps.sachnetra.com/india.pmtiles
  Full legal compliance, no overlay needed

**Implement Option A first. Plan Option B for V2.**

---

## Default Map View — India

When user taps the Map tab, the map centers on India.

```typescript
// Add to src/config/geo.ts or india.ts
export const INDIA_MAP_VIEW = {
  name: 'india',
  center: [78.9629, 20.5937],  // Geographic center of India
  zoom: 4,                      // Shows full India comfortably
  bearing: 0,
  pitch: 0,
};

// State-level views (add to regional presets)
export const INDIA_REGIONAL_VIEWS = {
  north:     { center: [77.1025, 28.7041],  zoom: 5 }, // Delhi area
  south:     { center: [80.2707, 13.0827],  zoom: 5 }, // Chennai area
  east:      { center: [88.3639, 22.5726],  zoom: 5 }, // Kolkata area
  west:      { center: [72.8777, 19.0760],  zoom: 5 }, // Mumbai area
  northeast: { center: [92.9376, 26.2006],  zoom: 5 }, // Guwahati area
  central:   { center: [77.4126, 23.2599],  zoom: 5 }, // Bhopal area
};
```

---

## V1 Layer Decisions — Keep / Remove / Add

### KEEP (works globally, India covered, zero new work)

```
earthquakes      → USGS M4.5+, India is seismically active
                   Himalayan zone, Andaman islands show frequently
                   Default: ON

fires            → NASA FIRMS VIIRS, covers India completely
                   Forest fires in northeast, industrial fires
                   Default: OFF (too much noise for news audience, user-toggled)

protests         → ACLED + GDELT filtered to India bbox
                   Major Indian cities covered
                   Default: OFF (enable when state is selected)

outages          → Cloudflare Radar, filters Indian ISPs
                   Jio, Airtel, BSNL, Vi coverage
                   Default: OFF
```

### TURN OFF (not relevant for SachNetra V1)

```
conflicts        → Global military conflict zones (not Indian context)
bases            → Global military bases (no India base database yet)
nuclear          → Global nuclear facilities
cables           → Undersea cables (not in V1 scope)
pipelines        → Oil/gas pipelines (not in V1 scope)
vessels          → AIS ship tracking (Indian Ocean, not V1)
flights          → Military flight tracking (not V1)
gpsJamming       → GPS interference (intelligence tool, not SachNetra)
cyberThreats     → IOC feeds (intelligence tool, not SachNetra)
oref             → Israel rocket sirens (not relevant)
ciiChoropleth    → Country instability heatmap (not SachNetra V1)
```

### ADD IN V1 (basic India state boundary layer)

```
indiaStates      → State/UT boundaries of India
                   Choropleth showing which state news stories
                   are from (color by story count, not instability)
                   Data source: geojson India states boundary file
                   Default: ON
```

### ADD IN V2 (research and data required — backlog)

```
lacBorder        → Line of Actual Control (disputed)
                   Requires: editorial policy decision on which
                   version to display (India claims vs China claims)
                   
locBorder        → Line of Control (J&K)
                   More established, OSM has reasonable data
                   
lweDistricts     → Left Wing Extremism affected districts
                   Source: MHA annual report (manual curation)
                   
indianBases      → Indian Army/Air Force/Navy installations
                   Source: manual curation from public data
                   No structured database exists — research needed
                   
floodZones       → Active flood alerts from IMD
                   Source: IMD API (partially documented)
                   
cycloneAlerts    → Bay of Bengal / Arabian Sea cyclone tracks
                   Source: IMD cyclone tracker
```

---

## India States Layer — V1 Implementation

This is the one new layer to build in V1.

**Purpose**: When a story mentions Maharashtra, that state lights up on the map.
Gives geographic context to news without being an intelligence tool.

**Data source**: 
```
India states GeoJSON with ISO 3166-2 state codes
Upload to R2 CDN at maps.sachnetra.com/india-states.geojson
Use same R2 pattern as WorldMonitor's countries.geojson
```

**Color logic** (NOT instability score — just story count):
```typescript
// Number of stories mentioning this state in last 24h
function getStateColor(storyCount: number): string {
  if (storyCount === 0) return 'rgba(255,255,255,0.05)'; // Almost invisible
  if (storyCount <= 2)  return 'rgba(123,123,255,0.2)';  // Faint purple
  if (storyCount <= 5)  return 'rgba(123,123,255,0.4)';  // Medium purple
  if (storyCount <= 10) return 'rgba(255,153,51,0.4)';   // Saffron
  return 'rgba(255,153,51,0.7)';                          // Bright saffron
}
```

This is purely visual context. Not a risk score. Not an instability index.
SachNetra shows where news is coming from, not how dangerous a state is.

**Layer definition** in `map-layer-definitions.ts`:
```typescript
{
  id: 'indiaStates',
  labelKey: 'mapLayers.indiaStates',
  fallbackLabel: 'India States',
  renderers: ['flat'],   // Flat map only for V1, not globe
  variants: ['india'],   // Only appears in india variant
}
```

---

## Map Engine Notes

WorldMonitor has two renderers: 3D globe and flat map.

**For SachNetra V1:**
- Flat map only on mobile (default)
- 3D globe disabled for india variant (too heavy for mid-range Android)
- Set `VITE_MAP_INTERACTION_MODE=flat` as default for india variant

```typescript
// In india.ts
export const MAP_CONFIG = {
  defaultMode: 'flat',          // Never globe on mobile
  defaultView: INDIA_MAP_VIEW,
  mobileOptimized: true,
};
```

---

## Tile Provider for India Variant

**Do NOT use OpenFreeMap alone** — it shows incorrect Kashmir boundary (see Kashmir section above).

**V1 Solution (Option A):**
- Use OpenFreeMap as basemap (dark theme)
- Place `india-states-official.geojson` from Datameet as overlay
- The overlay corrects the boundary visually

```typescript
// In india.ts
export const DEFAULT_TILE_PROVIDER = 'openfreemap';
export const DEFAULT_MAP_THEME = 'dark';
export const INDIA_BOUNDARY_OVERLAY = 'https://maps.sachnetra.com/india-states-official.geojson';
// This overlay must always be loaded for the india variant — it corrects Kashmir boundary
```

---

## Map Tab Behavior on Mobile

When user taps Map tab:
1. Map initializes centered on India at zoom 4
2. India states layer is visible (story count choropleth)
3. Earthquakes layer visible if any M4.5+ in India last 24h
4. All other layers off by default
5. Layer toggle available in map controls

Map does NOT auto-navigate to user's state.
User explicitly taps state selector on home screen.
Map is exploration, not personalization.

---

## What The Map Is NOT In SachNetra

Explicitly, for clarity:
```
NOT a military intelligence tool
NOT a conflict tracking dashboard
NOT an infrastructure monitoring system
NOT a real-time vessel/flight tracker
NOT a risk assessment platform

IS a simple geographic context layer
IS a "where is this news coming from" visual
IS a secondary tab, not the hero feature
```

This is critical for James to understand.
Do not add complexity to the map beyond what is listed here.
The news feed is the product. The map is a bonus.
