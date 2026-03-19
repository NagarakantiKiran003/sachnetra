# SachNetra — Indian Data Sources
*Prep Document 04 | The Adapt Sprint*

---

## V1 Data Strategy

V1 uses only Indian RSS feeds that work TODAY with zero new infrastructure.
WorldMonitor's existing RSS proxy handles everything.
James just puts Indian feed URLs into india.ts.

No RSSHub. No Firecrawl. No scrapers. Just URLs.

---

## V1 RSS Feeds — Complete List

These are the feeds that go into `FEEDS` array in `src/config/variants/india.ts`.
Format matches `Feed` interface in `src/types/index.ts`.

> **How feeds work in the codebase:**
> - `category` is NOT a field on Feed — it is the key in the `Record<string, Feed[]>` object (e.g., `politics: [...]`, `economy: [...]`)
> - `tier` is NOT a field on Feed — it is stored in the `SOURCE_TIERS` map in `src/config/feeds.ts` and looked up by source name
> - Feed fields available: `name`, `url`, `region`, `propagandaRisk` (`'low'|'medium'|'high'`), `stateAffiliated` (country name string), `lang`

### Tier 1 — Wire Services & Major Broadcasters (highest weight in AI)
// Record key: `politics`

```typescript
{ name: 'NDTV', url: 'https://feeds.feedburner.com/ndtvnews-top-stories', region: 'national' },
{ name: 'The Hindu', url: 'https://www.thehindu.com/news/feeder/default.rss', region: 'national' },
{ name: 'Indian Express', url: 'https://indianexpress.com/feed/', region: 'national' },
{ name: 'ANI', url: 'https://www.aninews.in/rss/india.xml', region: 'national' },
// PTI RSS is subscription-only — excluded from V1. Add in V2 if access obtained.
{ name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', region: 'national' },
```

### Tier 1 — Disaster & Weather

// Record key: `disaster`

```typescript
{ name: 'NDTV Disasters', url: 'https://feeds.feedburner.com/ndtvnews-india-news', region: 'national' },
{ name: 'The Hindu Science', url: 'https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss', region: 'national' },
```

### Tier 2 — Established Outlets

```typescript
// Record key: `economy`
{ name: 'LiveMint', url: 'https://www.livemint.com/rss/news', region: 'national' },
{ name: 'Economic Times', url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', region: 'national' },
{ name: 'Business Standard', url: 'https://www.business-standard.com/rss/home_page_top_stories.rss', region: 'national' },
// Record key: `politics`
{ name: 'Hindustan Times', url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml', region: 'national' },
{ name: 'India Today', url: 'https://www.indiatoday.in/rss/1206578', region: 'national' },
```

### Tier 2 — Quality Independent Journalism

// Record key: `politics`

```typescript
{ name: 'The Wire', url: 'https://thewire.in/feed', region: 'national', propagandaRisk: 'low' },
{ name: 'Scroll', url: 'https://scroll.in/feed', region: 'national' },
{ name: 'The Print', url: 'https://theprint.in/feed', region: 'national' },
```

### Tier 2 — Technology & Business

// Record key: `technology`

```typescript
{ name: 'YourStory', url: 'https://yourstory.com/feed', region: 'national' },
{ name: 'Inc42', url: 'https://inc42.com/feed/', region: 'national' },
```

### Tier 1 — State-Affiliated (tag with stateAffiliated flag)

// Record key: `government`

```typescript
{ name: 'DD News', url: 'https://ddnews.gov.in/feed', region: 'national', stateAffiliated: 'India' },
// ⚠️ Verify DD News URL before deploying — government RSS feeds are inconsistent
{ name: 'PIB', url: 'https://pib.gov.in/RssMain.aspx', region: 'national', stateAffiliated: 'India' },
// ⚠️ Verify PIB URL before deploying — may require RSSHub connector in V2
```

---

## RSS Proxy Allowlist — Domains to Add

The RSS proxy has a domain allowlist in two places:
- `api/rss-proxy.js` — Vercel edge proxy
- `scripts/ais-relay.cjs` — Railway relay proxy

Add these domains to both allowlists:

```javascript
'feeds.feedburner.com',
'www.thehindu.com',
'indianexpress.com',
'www.aninews.in',
'www.ptinews.com',
'timesofindia.indiatimes.com',
'www.livemint.com',
'economictimes.indiatimes.com',
'www.business-standard.com',
'www.hindustantimes.com',
'www.indiatoday.in',
'thewire.in',
'scroll.in',
'theprint.in',
'yourstory.com',
'inc42.com',
'ddnews.gov.in',
'pib.gov.in',
'www.ndtv.com',
'www.ndtvnews.com',
```

---

## Source Credibility — Tier System

Tier ratings affect how much weight a source gets in the AI classification pipeline.
A Tier 1 breaking alert carries more weight than Tier 2 in convergence detection.

| Tier | Weight | Description | Examples |
|------|--------|-------------|---------|
| 1 | 1.0× | Wire services, major broadcasters with editorial standards | ANI, NDTV, The Hindu, Indian Express |
| 2 | 0.8× | Established outlets with known editorial processes | LiveMint, ET, India Today, The Wire, Scroll |
| 3 | 0.5× | Niche/regional outlets, aggregators | Regional English papers, blogs |

**State-affiliated sources** (DD News, PIB):
- Still Tier 1 for factual government announcements
- Tag with `stateAffiliated: true`
- Displayed with indicator in UI so users can factor in editorial bias
- Never used as sole source for breaking news classification

---

## India-Specific Keywords for Threat Classifier

The keyword classifier in `src/services/threat-classifier.ts` needs India-specific terms.
These replace or supplement the global conflict keywords.

### Critical Keywords (map to `critical` threat level)
```
terrorist attack, bomb blast, explosion, armed attack,
riot, communal violence, curfew imposed, firing on civilians,
insurgent attack, naxal attack, militant strike
```

### High Keywords (map to `high` threat level)
```
AFSPA, bandh, hartal, shutdown, blockade,
section 144, internet shutdown, mob violence,
anti-Hindu, anti-Muslim, temple attack, mosque attack,
farmers protest, rail roko, bharat bandh,
LOC violation, LAC standoff, border skirmish,
cyclone warning, flood alert, red alert,
earthquake, landslide
```

### Medium Keywords (map to `medium` threat level)
```
protest march, dharna, agitation, strike,
political violence, lathi charge, tear gas,
casualty, injured, arrested, detained,
drought, heat wave, heavy rainfall,
train derailment, road accident, fire
```

### Indian Entity Keywords (boost relevance)
```
BJP, Congress, AAP, Shiv Sena, TMC, NCP,
Modi, Rahul Gandhi, Kejriwal, Yogi,
Supreme Court, High Court, CAA, NRC,
Adani, Ambani, Tata, Infosys, Wipro,
ISRO, RBI, SEBI, NDMA, NDRF,
Kashmir, Manipur, Assam, Punjab,
LAC, LOC, PoK, Aksai Chin,
Naxal, Maoist, LWE, ULFA
```

---

## Indian States — Keyword Mapping for State Filter

Each state has keywords that match news to that state.
Used by the state selector filter.

```typescript
export const INDIA_STATE_KEYWORDS: Record<string, string[]> = {
  'AN': ['andaman', 'nicobar', 'port blair'],
  'AP': ['andhra', 'amaravati', 'visakhapatnam', 'vijayawada', 'tirupati'],
  'AR': ['arunachal', 'itanagar', 'tawang'],
  'AS': ['assam', 'guwahati', 'dispur', 'brahmaputra', 'barpeta', 'silchar'],
  'BR': ['bihar', 'patna', 'gaya', 'muzaffarpur'],
  'CH': ['chandigarh'],
  'CT': ['chhattisgarh', 'raipur', 'bilaspur', 'bastar', 'naxal'],
  'DD': ['daman', 'diu'],
  'DL': ['delhi', 'new delhi', 'ncr', 'lutyen', 'parliament', 'rashtrapati'],
  'DN': ['dadra', 'nagar haveli'],
  'GA': ['goa', 'panaji', 'margao'],
  'GJ': ['gujarat', 'ahmedabad', 'surat', 'vadodara', 'gandhinagar', 'kutch'],
  'HP': ['himachal', 'shimla', 'manali', 'dharamsala'],
  'HR': ['haryana', 'chandigarh', 'gurugram', 'faridabad', 'ambala'],
  'JH': ['jharkhand', 'ranchi', 'jamshedpur', 'dhanbad'],
  'JK': ['kashmir', 'jammu', 'srinagar', 'leh', 'ladakh', 'loc', 'pulwama', 'afspa'],
  'KA': ['karnataka', 'bengaluru', 'bangalore', 'mysuru', 'hubli'],
  'KL': ['kerala', 'thiruvananthapuram', 'kochi', 'kozhikode', 'wayanad'],
  'LA': ['ladakh', 'leh', 'kargil', 'lac', 'galwan'],
  'LD': ['lakshadweep'],
  'MH': ['maharashtra', 'mumbai', 'pune', 'nagpur', 'nashik', 'thane', 'aurangabad'],
  'ML': ['meghalaya', 'shillong'],
  'MN': ['manipur', 'imphal', 'meitei', 'kuki', 'ethnic violence'],
  'MP': ['madhya pradesh', 'bhopal', 'indore', 'gwalior', 'jabalpur'],
  'MZ': ['mizoram', 'aizawl'],
  'NL': ['nagaland', 'kohima', 'dimapur'],
  'OR': ['odisha', 'bhubaneswar', 'cuttack', 'puri', 'cyclone odisha'],
  'PB': ['punjab', 'amritsar', 'ludhiana', 'chandigarh', 'farmer'],
  'PY': ['puducherry', 'pondicherry'],
  'RJ': ['rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'kota'],
  'SK': ['sikkim', 'gangtok'],
  'TG': ['telangana', 'hyderabad', 'warangal', 'nizamabad'],
  'TN': ['tamil nadu', 'chennai', 'madurai', 'coimbatore', 'trichy', 'salem'],
  'TR': ['tripura', 'agartala'],
  'UP': ['uttar pradesh', 'lucknow', 'noida', 'agra', 'varanasi', 'kanpur', 'prayagraj', 'ayodhya'],
  'UT': ['uttarakhand', 'dehradun', 'haridwar', 'rishikesh', 'nainital'],
  'WB': ['west bengal', 'kolkata', 'calcutta', 'siliguri', 'darjeeling', 'howrah'],
}
```

---

## V2 Data Sources (Do Not Build Now — Backlog Only)

These are sources that require new infrastructure.
Reference only. Do not build in V1.

### RSSHub Connectors (V2)
Deploy RSSHub on Railway. Write connectors for:
```
PIB press releases        → pib.gov.in
MEA statements            → mea.gov.in
MHA press releases        → mha.gov.in
NDMA situation reports    → ndma.gov.in
ISRO news                 → isro.gov.in
Supreme Court orders      → main.sci.gov.in
ECI election updates      → eci.gov.in
Parliament bills          → loksabha.nic.in
Rajya Sabha updates       → rajyasabha.nic.in
```

### Firecrawl + Gemini Agent (V2/V3)
For sources with no RSS and complex HTML:
```
SATP (South Asia Terrorism Portal) — incident data
NCRB annual reports — crime statistics (PDF)
State government orders — varies by state
District collector updates — varies by district
```

### Structured APIs (V2)
```
TCPD (Trivedi Centre) — election data API
DataMeet — Indian open datasets
USGS — already works (global, covers India)
NASA FIRMS — already works (global, covers India)
ACLED — already works (filter country=India)
```

---

## Data Freshness Tracking

SachNetra inherits WorldMonitor's data freshness tracker.
The `DataFreshnessTracker` singleton monitors source health.

For V1, track these sources:
```
rss_india           → status: fresh/stale/error
acled_india         → status: fresh/stale/error
usgs_earthquakes    → status: fresh/stale/error (global)
nasa_firms          → status: fresh/stale/error (global)
groq_summarization  → status: fresh/stale/error
```

Mark `rss_india` as `requiredForRisk: true` — if RSS fails, the feed is empty.

The Intelligence Gap Badge surfaces these failures to users.
SachNetra shows "Source unavailable" instead of silently omitting data.
This is the feature that makes SachNetra trustworthy.
