# SachNetra — Boundaries & Scope Guard

---

## ⛔ SECTION 1 — SACRED (Permanent. Cannot be changed by anyone, ever.)

These files can **NEVER** be written to under any circumstances:

```
src/config/variants/full.ts        ← live worldmonitor.app variant — DO NOT TOUCH
src/config/variants/tech.ts        ← live tech.worldmonitor.app variant — DO NOT TOUCH
src/config/variants/finance.ts     ← live finance.worldmonitor.app variant — DO NOT TOUCH
```

If any task ever seems to require modifying these files — **STOP immediately** and tell James.  
Something is wrong with the task, not these rules.

---

## 📖 SECTION 2 — Read for Reference, Never Write

Study these for patterns, never modify:

- Any existing panel TypeScript files not explicitly listed in the current task
- `server/gateway.ts` — core domain gateway, do not touch
- `scripts/ais-relay.cjs` — Railway relay (exception: adding to domain allowlist only)
- Any existing `.proto` files — the proto system is locked
- `src/config/feeds.ts` — global feed config, read only (india feeds go in `india.ts`)

---

## 🚫 SECTION 3 — V1 Scope Boundary

These features must **never** be built in V1. If a task pulls toward any of these, stop and tell James:

```
❌ RSSHub, Firecrawl, Gemini scraping agent
❌ Graph database (Graphiti, Neo4j, FalkorDB)
❌ Knowledge graph / "all-seeing eye"
❌ State Instability Index (complex scoring system)
❌ LAC/LOC border layers (research + editorial policy needed first)
❌ LWE district layer (data sourcing needed)
❌ Indian military base database
❌ Election monitor
❌ Internet shutdown tracker
❌ Communal incident tracking
❌ Hindi / regional language support
❌ Government variant (tenders, schemes, auctions)
❌ WhatsApp brief delivery automation
❌ Push notifications
❌ User accounts / authentication
❌ Desktop (Tauri) variant
```

All of the above → V2/V3 backlog. Do not build now.

---

> **Note**: Rules in Section 2 and 3 can be updated with James's explicit permission if codebase reality differs.  
> **Section 1 is permanent and cannot be changed by anyone.**
