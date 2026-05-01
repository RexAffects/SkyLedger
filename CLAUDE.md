@AGENTS.md

# SkyLedger — AI Assistant Rules

Sky Ledger is the citizen transparency platform for weather modification. Codebase still uses `openskies/` naming internally; "SkyLedger" is the brand.

## Universal Context (Rex)
- **Location:** Arkansas (Fayetteville)
- **Partner:** Maria — joint decision-maker on home/life projects
- **Always provide clickable product links** when recommending purchases (real URLs, never fabricated)

## Core Philosophy — Candidate Pools, Not Accusations

Never pin a citizen report to a specific aircraft unless evidence is airtight (gold-tier real-time match, single candidate at matching altitude). Every report generates a **candidate pool** of nearby aircraft ranked by likelihood. Confidence builds through **accumulation across independent reports**, not single data points.

**Why:** Credibility is everything. If SkyLedger falsely flags one aircraft, the entire platform's reputation is compromised. Better cautious — let the accumulation become undeniable. An aircraft that appears in 47 pools from 23 different citizens is convicted by the data, not by an accusation.

**How to apply:**
- Display candidate pools per report, never "matched to: X" unless gold-tier
- Cumulative scoring weights: independent reporters > same reporter, different locations > same location, gold matches > pool appearances
- Confidence tiers: Candidate → Recurring → Pattern Detected → Confirmed Operator
- Records persist beyond raw ADS-B data decay — candidate pool associations compound forever
- Vision-level framing in `VISION.md` ("Candidate Pools, Not Accusations" section)
- Technical architecture in `Research/2026-03-19-evidence-triangulation-architecture.md`

## UI Rule — Hide Suspicion Score Numbers

Don't show "Interest (2.0)" or "Watch (4.2)" labels in the flight tracker. Suspicion score runs **behind the scenes** for sort order only.

**Why:** First-time visitors don't know what "2.0" means. Numbers feel accusatory and create cockpit-dashboard overload. Altitude color bands (orange/purple) and WX MOD badge already communicate what matters visually. Aligns with "candidate pools, not accusations."

**How to apply:**
- Keep `suspicion_score` running for sort order and internal logic
- Remove "Interest" and "Watch" labels from flight list UI
- Keep WX MOD badge — that's factual (registered to known operator), not a score
- Show `suspicion_reasons` (the human-readable WHY list) in the detail panel when someone clicks an aircraft
- Score can inform map marker color subtly, but never show the number

## Operations Bible

`private/OPS.md` is the single source of truth for SkyLedger infrastructure (gitignored). Read it first for any audit, status check, or "how does X work" question. Update it whenever infrastructure changes (new tables, APIs, features, deployment, costs).

Covers: domain/hosting, tech stack, env vars, all Supabase tables (8 across 4 migrations), external APIs (ADSB.lol, ADSBDB, HexDB, FAA), internal API routes, page routes, LLC piercing system, FAA cache, flight history, community flagging, security/rate limiting, costs, decision log, audit checklist.

## Project Status

Current state, build progress, and roadmap live in `PROJECT-STATUS.md`. Update as the platform evolves.

## Coalition Strategy

Sky Ledger is the dashboard layer. Geoengineering Watch = archive (600+ patents). GeoFight = legal arm. ICAN = FOIA. We fill the gap none of them cover. Full coalition strategy and ally org details in `Research/coalition-strategy.md`.

## Outreach

Public launch outreach list in `OUTREACH.md`. People/orgs to contact when ready.
