# SachNetra — Master Idea Document

## Product Vision

SachNetra is a **news clarity tool for urban Indians**. Not an OSINT dashboard. Not a corporate risk platform. A product that replaces the anxiety of watching 5 news channels all screaming different things with one calm, clear summary.

> "Instead of watching news that makes you anxious — open this, see what's actually happening, understand it in 2 minutes."

---

## The Problem

Every Indian with a smartphone:
- Gets WhatsApp forwards they can't verify
- Watches news channels that contradict each other
- Feels anxious because they can't tell what's real
- Has no single place to get a calm, clear picture

Nobody solves this well. Indian news is either panic-driven (TV channels) or scattered (multiple apps).

---

## Primary User (V1)

**Urban India, English + Hindi, 18–35**

Three types:
1. **College students** — news aware, low attention span, want quick clarity
2. **Young professionals** — busy, want to understand what's happening without spending 30 minutes
3. **WhatsApp forward verifiers** — receive panic news, want to check if it's real

What they share: they want to understand what's happening without being manipulated by it.

**Excluded from V1**: Small town Hindi speakers, regional language users (added in V2)

---

## Product Name

**SachNetra**
- Sach = Truth (Hindi, universally understood)
- Netra = Eye (Sanskrit, universally understood)
- Meaning: The Eye of Truth / True Vision

**Domain**: sachnetra.com (purchased)

**Tagline**: "See clearly" / सच्चनेत्र

---

## What SachNetra Does (V1)

1. **Aggregates** Indian news from 10–15 trusted sources
2. **Clusters** duplicate stories (8 sources reporting same flood = 1 card)
3. **Summarises** each story in two parts:
   - "What happened" — factual, 2–3 plain sentences
   - "What this means" — practical impact, 1–2 sentences
4. **Organises** by time relative to when user opens the app
5. **Filters** by state when user wants local news
6. **Shares** to WhatsApp in one tap

---

## What SachNetra Does NOT Do (V1)

- No military tracking
- No instability scores / CII
- No intelligence dashboard
- No OSINT features
- No regional language content
- No graph database or "all-seeing eye"
- No related stories section (backlogged)
- No mini map on story detail (backlogged)

---

## How It Grows

```
V1 (build now):
  Indian RSS feeds + AI two-summary + state filter
  WhatsApp sharing + calm UI

V2 (after launch):
  Regional language support (Hindi first)
  More Indian sources (PIB, NDMA via RSSHub)
  Related stories on story detail
  
V3 (after users):
  Government opportunity variant (tenders, schemes, auctions)
  Firecrawl scraping agent for government sources
  Gemini extraction pipeline
  
North star (someday):
  Knowledge graph / all-seeing eye intelligence layer
```

---

## Distribution Strategy

**Primary**: WhatsApp morning brief
- Every morning at 7am: 5-point brief of India
- People forward to family WhatsApp groups
- That is organic distribution to millions

**Secondary**: Organic search, social media, word of mouth

**Not**: Paid ads (no budget), TV/radio (wrong audience)

---

## Business Model

**V1**: Free, open source
**After product-market fit**: Freemium
- Free: national news, basic state filter
- Paid: custom alerts, WhatsApp brief delivery, API access

**V1**: Free only. No paid features in V1.

**V2 paying users**: Small businesses (tender alerts), researchers, journalists
**V2 price point**: ₹199–499/month

**Not counting on**: Government funding, donations, ads (not enough traffic in V1)

---

## Technical Approach

**Codebase**: Fork of WorldMonitor (github.com/koala73/worldmonitor)
**Approach**: Add `india` variant to existing codebase — NOT a new frontend
**One config file controls everything**: `src/config/variants/india.ts`

This means:
- All existing infrastructure reused (Vercel, Redis, Railway, AI pipeline)
- Only the India-specific configuration is new
- James edits existing files + creates the variant config

---

## Success Metrics (V1)

- 1,000 daily active users within 3 months of launch
- 500+ WhatsApp shares per week
- Average session time > 3 minutes
- User opens app again within 24 hours (retention)
