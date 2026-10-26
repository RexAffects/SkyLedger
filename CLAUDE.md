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

## UI Rule — Home Page Opens on the Live Radar

The home page (`src/app/page.tsx`) shows the live radar right under "What's flying over you?", already scanning on load: no click, no permission prompt. Rex's goal: visitors instantly see that this is a real-time scan.

**How it works:** `<FlightsView autoStart embedded />`. `autoStart` centers on the visitor's approximate city from `/api/geo` (Vercel IP geolocation headers, no GPS needed). `embedded` hides the tail lookup and "How it works". `/flights` doesn't use these props and still waits for "Start Scanning".

**Fallback when location can't be detected: Austin, TX** (`RADAR_FALLBACK_LOCATION` in `src/lib/constants.ts`), with the note "We couldn't detect your location, so we're showing Austin, TX. Tap here to see what's above you →" (the button requests GPS). **Rex explicitly does not want Fayetteville as the default.** Fayetteville only shows for visitors who are actually there.

**Don't break:**
- Leave the radar itself as it is. Rex asked that it not be redesigned.
- The map remounts when `mapCenter` changes (`key` on `MapContainer`), because Leaflet only reads `center` on mount. Without that, switching from the IP guess to GPS scans the new spot but leaves the map showing the old one.
- `handleUseMyLocation` must handle geolocation errors. Without that, a denied permission hangs on "Getting your location..." forever.

## How It's Built

`docs/BUILD.md` is the committed, secret-free description of the whole system: hosting, every page and API route, cron jobs, external feeds, all 11 database tables, security layers, env var names, scoring, evidence flow, and a build timeline. Read it before any "how does X work" question, and update it when you add a route, table, cron, env var, or data source. Rex's manual dashboard steps (with walkthroughs) are tracked in `ROADMAP.md` under "Operations".

## Operations Bible

`private/OPS.md` is the single source of truth for SkyLedger infrastructure (gitignored; only on Rex's main machine). Read it first for any audit, status check, or "how does X work" question. Update it whenever infrastructure changes (new tables, APIs, features, deployment, costs). On machines where it's missing, work from `docs/BUILD.md` and leave an "OPS.md addendum" section in the relevant doc for Rex to merge.

Covers: domain/hosting, tech stack, env vars, all Supabase tables (8 across 4 migrations), external APIs (ADSB.lol, ADSBDB, HexDB, FAA), internal API routes, page routes, LLC piercing system, FAA cache, flight history, community flagging, security/rate limiting, costs, decision log, audit checklist.

## Reliability Rules — Learned the Hard Way

Postmortems and runbooks live in `docs/incidents/`. Read the relevant one before debugging a repeat.

1. **Every server-side `fetch` to a third-party API must send an explicit `User-Agent`.** Node's default is `node`, and ADSB.lol started 403ing it in Oct 2026. That silently killed the radar, lookups, report correlation, and flight history recording. Use `SKYLEDGER_USER_AGENT` from `src/lib/api/adsb.ts`.
2. **Never depend on a single free data provider.** ADS-B goes through the `PROVIDERS` list in `src/lib/api/adsb.ts` (ADSB.lol primary, adsb.fi fallback). Add new feeds there; don't call providers directly. adsb.fi terms: 1 req/s, non-commercial, attribution link required (on `/flights` and `/about`).
3. **A failure must be loud.** Log every upstream failure, even when a fallback hides it from users, and make sure an alert reaches Rex. Silent failures cost us weeks twice in 2026: the radar 403s, and the Supabase keep-alive.
4. **Scheduled jobs go in Vercel Cron (`vercel.json`), not GitHub Actions.** GitHub silently disables scheduled workflows on repos with no activity for 60 days.
5. **Every table the code uses is listed in `EXPECTED_SCHEMA` in `src/lib/health.ts`.** A migration isn't finished until its table is in that list. In Oct 2026 we discovered `flight_positions` and `flight_summaries` had never been created on the live database; flight history had silently failed since launch. Migration numbers must be unique (two files share `003_`; the next one is `008_`). See `docs/incidents/2026-10-26-missing-flight-history-tables.md`.

**When Rex says "nothing's tracking" or "it's broken":** open `https://skyledger.org/api/health` first. It shows each flight feed's status and the database. Then follow the runbook in `docs/incidents/2026-10-25-flight-feed-403.md`.

**Monitoring in place:** `/api/health` (503 when the primary feed or the database is down, meant for UptimeRobot) and a daily alert email via `/api/cron/health-check` (`?test=1` with CRON_SECRET forces a test email).

## Security Rules — Abuse, Bots, Fake Data

Full checklist, limits table, and per-change verify/undo notes: `docs/security/2026-10-25-abuse-hardening.md`. Read it before touching anything below.

1. **The browser never writes to Supabase directly.** Every write goes through an API route that validates, rate-limits by hashed IP, and inserts with the service role. Never add an anon INSERT/UPDATE policy. New tables must `ENABLE ROW LEVEL SECURITY` (no RLS = the public anon key has full read/write).
2. **Every submission route gets `checkSubmissionLimits()`** (`src/lib/security/submission-limits.ts`) plus a bucket in `src/proxy.ts`. Per-IP, 5/hour, 20/day, same as flags.
3. **Flight history is evidence, so the server verifies it.** `/api/flight-history` records only positions the live ADS-B feed confirms. Never go back to trusting browser-supplied positions.
4. **Limits must never touch a real user.** See the tuning table in the security doc before changing a number. A limit that a person could hit on a normal day is a bug.
5. **Log abuse with the `[security]` marker** so it's searchable in Vercel logs.

## Project Status

Current state, build progress, and roadmap live in `PROJECT-STATUS.md`. Update as the platform evolves.

## Coalition Strategy

Sky Ledger is the dashboard layer. Geoengineering Watch = archive (600+ patents). GeoFight = legal arm. ICAN = FOIA. We fill the gap none of them cover. Full coalition strategy and ally org details in `Research/coalition-strategy.md`.

## Outreach

Public launch outreach list in `OUTREACH.md`. People/orgs to contact when ready.
