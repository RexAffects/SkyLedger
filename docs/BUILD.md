# How SkyLedger Is Built

The "come back in six months and understand everything" document. It describes what
exists, how the pieces connect, and where each decision is recorded. It contains no
secrets: environment variables are named, never valued. The values live in Vercel and in
`private/OPS.md` on Rex's main machine (gitignored).

Last full review: 2026-10-26.

Related documents, read in this order when something is wrong:

| Question | Where |
|---|---|
| Is it up right now? | `https://skyledger.org/api/health` |
| What rules must every change follow? | `CLAUDE.md` (Reliability Rules, Security Rules) |
| What broke before and how was it fixed? | `docs/incidents/` |
| How is abuse prevented, and what are the limits? | `docs/security/2026-10-25-abuse-hardening.md` |
| What is built and what's next? | `PROJECT-STATUS.md`, `ROADMAP.md` |
| Why does the product work this way? | `VISION.md` ("Candidate Pools, Not Accusations") |

---

## 1. The one-paragraph version

SkyLedger is a Next.js site on Vercel with a Supabase Postgres database. Visitors see a
live radar of aircraft near them, pulled from free ADS-B feeds through our own API routes.
They can file observations (photos, trails, streaks) and flag aircraft. Every write goes
through a server route that validates, rate-limits by hashed IP, and inserts with the
service-role key. Three Vercel Cron jobs keep the database awake, email a weekly report, and
email Rex if anything is unhealthy.

---

## 2. Hosting and accounts

| Piece | Where | Notes |
|---|---|---|
| Code | `github.com/RexAffects/SkyLedger`, branch `main` | Public repo. Every push to `main` deploys to production. |
| Hosting | Vercel, team "rexaffects' projects", project **openskies** | Hobby plan. 4.5 MB request body limit, 10 s default function timeout (routes raise it with `maxDuration`). |
| Domain | `skyledger.org` → 307 → `www.skyledger.org` | Use `curl -L`; a bare check of the apex looks like a failure. |
| Database | Supabase, project "Open Skies" | Free plan. Pauses after ~7 days of inactivity; see keep-alive below. |
| Email | Gmail via nodemailer, app password | Sends weekly report, health alerts, evidence archive copies. |
| Analytics | Vercel Analytics | `@vercel/analytics` in the root layout. |

The codebase still says `openskies` in places. "SkyLedger" is the brand; the rename was
never done internally and doesn't need to be.

---

## 3. Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2 (App Router, `src/` directory). AGENTS.md says read `node_modules/next/dist/docs` before assuming older Next behavior; middleware is `src/proxy.ts`, not `middleware.ts`. |
| UI | React 19, Tailwind, shadcn/ui, lucide icons |
| Map | Leaflet + react-leaflet. `MapContainer` reads `center` only on mount, so the map remounts via a `key` when the center changes. |
| Data | `@supabase/supabase-js` + `@supabase/ssr`. Browser client reads only; server client uses the service role. |
| Photos | `exifreader` for EXIF, Web Crypto SHA-256 for evidence hashes, canvas downscale before upload. |
| Email | nodemailer (Gmail). |
| i18n | `src/lib/i18n/` with a translations table and a `useTranslation` hook. |

---

## 4. Pages (`src/app`)

| Route | What it is |
|---|---|
| `/` | Home. Opens on the live radar, already scanning (`<FlightsView autoStart embedded />`). Centers on the visitor's city from `/api/geo`; falls back to Austin, TX with a "tap to use your location" prompt. Rex explicitly does not want Fayetteville as the default. |
| `/flights` | Full radar page with tail-number lookup and "How it works". Waits for "Start Scanning". |
| `/map` | Map of citizen report pins. |
| `/reports`, `/reports/[id]`, `/reports/new` | Report list, detail, submission form. |
| `/streak` | Streak (retroactive trail pattern) observation form. |
| `/about` | Methodology, data sources, adsb.fi attribution. |
| `/learn/...` | Operators (with `[slug]` profiles), legislation, state bans, pending bills, facts, follow-the-money, lobby tracker, hearings, protect-yourself. Static content from `src/lib/data/*.ts`. |
| `/get-involved/...` | Toolkit, contact-legislator, FOIA, legal, state-ban, testing, donate. |
| `/admin`, `/admin/login` | Admin dashboard (cookie session). Streak pattern intelligence, weekly report button, feedback. |

---

## 5. API routes (`src/app/api`)

All routes pass through `src/proxy.ts` first (rate limiting, section 9).

### Live flights
| Route | Method | Does |
|---|---|---|
| `/api/flights/nearby?lat&lon&radius` | GET | Proxies the ADS-B provider list (`src/lib/api/adsb.ts`). Returns aircraft plus which provider served them. The radar polls this every 5–10 s. |
| `/api/flights/detail?hex&callsign&tail` | GET | One-stop aircraft detail: live position, route (adsb.lol routeset → ADSBDB → HexDB, gated on a position/heading check), aircraft type/owner/photo (ADSBDB), FAA registration (cached in `faa_cache`), LLC piercing (`llc_lookups`), contrail likelihood (weather). |
| `/api/flights/lookup?tail` | GET | FAA registry + current ADS-B position for a tail number. |
| `/api/geo` | GET | Visitor's approximate city from Vercel's `x-vercel-ip-*` headers. Nulls on localhost. |

### Citizen data (all writes are server-side, service role)
| Route | Method | Does |
|---|---|---|
| `/api/reports` | POST | Citizen observation. Validates every field (ranges, enums, lengths, photo size), hashes IP, `checkSubmissionLimits`, inserts into `citizen_reports` with `reporter_hash`. |
| `/api/reports/archive` | POST | Emails a copy of the evidence (photo + metadata) to the admin address so it exists outside the database. |
| `/api/flags` | POST / GET | Flag an aircraft (POST, rate-limited, anomaly detection) or read a tail's flag summary (GET). |
| `/api/flags/active` | GET | All aircraft at medium/high threat, for list badges. |
| `/api/flight-history` | POST / GET | POST: browser nominates qualifying aircraft (hex + reason); server re-fetches the live feed, records the feed's position only, rejects anything not within 10 nm. GET: history for a tail. |
| `/api/correlate` | POST | Live correlation: aircraft near a report's location and time (real-time only; the feeds have no history API). |
| `/api/streak/report` | POST | Streak observation. Validated, rate-limited, weather-enriched, then triggers correlation. |
| `/api/streak/correlate` | POST | Admin: re-run correlation for one streak report. |
| `/api/streak/patterns` | GET | Admin: pattern analysis for the dashboard. |
| `/api/feedback` | POST | Feedback widget on every page. Rate-limited. |

### Operations
| Route | Method | Does |
|---|---|---|
| `/api/health` | GET | Both flight feeds (probe near Fayetteville, AR), database, and schema (every table in `EXPECTED_SCHEMA`). 503 when the primary feed or DB is down. 30 s per-instance cache. Public; hides DB error text. |
| `/api/cron/health-check` | GET | Daily. Runs the same checks and emails Rex only if something is wrong. `?test=1` forces an email. Needs `Authorization: Bearer CRON_SECRET`. |
| `/api/cron/weekly-report` | GET / POST | Weekly HTML email (reports, flags, sightings, activity by state). GET from cron, POST from the admin button. |
| `/api/keep-alive` | GET | Touches several tables so Supabase doesn't pause the project. Accepts `CRON_SECRET` (Vercel) or `KEEP_ALIVE_SECRET` (GitHub Actions backup). |
| `/api/admin/auth` | POST | Password login → HMAC session cookie, 7 days. Constant-time compare, 5 attempts / 15 min per IP. |

---

## 6. Scheduled jobs (`vercel.json`)

| Job | Schedule (UTC) | Local (Central) | Why |
|---|---|---|---|
| `/api/keep-alive` | `0 11 * * *` | 6 am daily | Supabase Free pauses idle projects. This cost us weeks once (silent pause). |
| `/api/cron/health-check` | `0 13 * * *` | 8 am daily | Alert email if any feed, DB, or schema check fails. |
| `/api/cron/weekly-report` | `0 14 * * 1` | 9 am Monday | Weekly stats to the admin address. |

Backup: `.github/workflows/supabase-keep-alive.yml` runs at 12:00 UTC. GitHub disables
scheduled workflows on repos idle for 60 days, which is why Vercel Cron is primary. Rule 4 in
`CLAUDE.md`.

Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` automatically. The proxy exempts
`/api/cron/*` and `/api/keep-alive` from rate limiting.

---

## 7. External data sources

| Source | Used for | Terms / gotchas |
|---|---|---|
| ADSB.lol (`api.adsb.lol`) | Primary live aircraft feed, routeset | Started rejecting Node's default `User-Agent: node` in Oct 2026. Every fetch sends `SKYLEDGER_USER_AGENT`. |
| adsb.fi (v3 API) | Automatic fallback feed | 1 request/second, non-commercial, attribution link required (on `/flights` and `/about`). Tight limits: `/api/health` returns 503 if the primary is failing even while this covers. |
| airplanes.live | Not used | 403s us. |
| ADSBDB | Aircraft details, route fallback | Free, unauthenticated. |
| HexDB.io | Route fallback | Free. |
| FAA registry (`registry.faa.gov`) | Ownership by tail number | Scraped; results cached in `faa_cache`. |
| OpenSky | Historical trajectories for streak correlation | Needs `OPENSKY_*` credentials; responses cached in `opensky_route_cache`. |
| Weather (`src/lib/api/weather.ts`) | Contrail likelihood badge, streak enrichment | Free API, no key. |
| Vercel IP geolocation | Home-page radar center | Headers only exist in production. |

The provider list and fallback order live in one place: `PROVIDERS` in `src/lib/api/adsb.ts`.
Never call a feed directly from elsewhere. Rule 2 in `CLAUDE.md`.

---

## 8. Database (Supabase, schema `public`)

Migrations are in `supabase/migrations/` and are applied **by hand** in the Supabase SQL
Editor. Nothing applies them automatically, which is how `003_flight_history.sql` went
unapplied for six months (incident 2026-10-26). `/api/health` now probes every table.

| Table | Migration | Purpose | RLS |
|---|---|---|---|
| `citizen_reports` | 001 (+004 tail_number, +007 reporter_hash) | Observations: location, time, type, trail behavior, photo data URL, EXIF, evidence hash. | On. Anon can SELECT active rows. Writes: service role only. |
| `flight_flags` | 001 | Per-aircraft aggregate: flag count, unique reporters, threat level. | On. Anon SELECT. |
| `flag_submissions` | 002 | Individual flag submissions with `reporter_hash`; drives rate limits and anomaly detection. | On. Service role only. |
| `flag_anomalies` | 002 | Detected abuse patterns: burst, scatter_bomb, low_score_target, ip_cluster. | On. Service role only. |
| `faa_cache` | 003_faa | FAA registration JSON by tail number. | On. |
| `llc_lookups` | 003_faa | LLC piercing results (registered agent, officers). | On. |
| `flight_positions` | 003_flight_history | 60-second position snapshots of qualifying aircraft, 90-day intent. **Created on prod 2026-10-26.** | On. Service role only. |
| `flight_summaries` | 003_flight_history | Per-tail aggregate: sightings, days seen, first/last seen. **Created on prod 2026-10-26.** | On. Service role only. |
| `streak_reports` | 005 | Streak observations with weather and correlation status. | On. |
| `streak_matched_flights` | 005 | Aircraft matched to a streak report, with data source and altitude tier. | On. |
| `opensky_route_cache` | 006 | Cached OpenSky trajectory lookups. | On. |

"On" with no policy means only the service role can touch the table, which is the intent.
In Supabase, a table **without** RLS is fully readable and writable with the public anon key
that ships in the site's JavaScript. Rule 1 in the Security Rules.

Verify the schema at any time:

```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

Eleven rows, all `true`. Next migration number is `008_` (two files share `003_`; leave them).

---

## 9. Security layers (details in `docs/security/2026-10-25-abuse-hardening.md`)

1. **Edge throttle** (`src/proxy.ts`): per-IP sliding windows, global 600/min plus a bucket per
   route (radar 180/min, submissions 10/h, admin login 5/15 min, etc.). In-memory per Vercel
   instance; upgrade path is Upstash/Vercel KV if it ever matters.
2. **Submission limits** (`src/lib/security/submission-limits.ts`): database-counted, per
   `reporter_hash`, 5/hour and 20/day, shared across instances. Hash =
   `sha256(ip : FLAG_SALT : date)`, so it rotates daily and can't be reversed.
3. **Validation**: every POST route checks types, ranges, enum membership, and lengths before
   touching the database.
4. **No browser writes**: the anon key can only SELECT. Every insert uses the service role from a
   route.
5. **Verified evidence**: flight history is recorded from the live feed, never from what the
   browser claims.
6. **Anomaly detection** on flags: burst, scatter-bomb, low-score targeting, IP clustering,
   tunable with `ANOMALY_*` env vars.
7. **Admin**: HMAC cookie, constant-time compare, login throttle.

Still manual: Vercel Firewall Bot Protection (Rex, dashboard only). Possible later: Turnstile
on forms, reporter-weighting, shared rate-limit store.

The one rule above all: **limits must never touch a real user.** The tuning table in the
security doc shows each limit next to expected real usage.

---

## 10. Monitoring and alerts

- `/api/health`: for humans and uptime monitors. `status` is `ok`, `degraded`, or `down`.
  `problems[]` says what, in plain language, including which migration file to run.
- Daily email from `/api/cron/health-check` when not `ok`. Subject: "radar is DOWN", "running
  on a fallback" (primary feed failing), or "needs attention (site is up)".
- Weekly report email, Mondays.
- Every upstream failure is logged even when a fallback hides it. Abuse events log with the
  `[security]` marker. Rule 3 in `CLAUDE.md`.
- Not yet set up: an external uptime monitor (UptimeRobot) pinging `/api/health`. On the Rex
  list in `ROADMAP.md`.

---

## 11. Environment variables (names only)

| Name | Used by |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser and server Supabase clients. Public by design; RLS is what protects the data. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only writes. **Bypasses RLS.** Must be a Vercel "Secret"-type variable. If it was ever a plain Config variable (the `<>` icon), rotate it in Supabase. |
| `CRON_SECRET` | Vercel Cron auth; rotated after the April 2026 Vercel breach. |
| `KEEP_ALIVE_SECRET` | GitHub Actions backup keep-alive. |
| `FLAG_SALT` | Reporter IP hashing. Changing it resets everyone's daily limit counters. |
| `ADMIN_PASSWORD`, `ADMIN_EMAIL` | Admin login; alert and report recipient. |
| `GMAIL_ADDRESS`, `GMAIL_APP_PASSWORD` | Outbound email. |
| `OPENSKY_CLIENT_ID`, `OPENSKY_CLIENT_SECRET`, `OPENSKY_USERNAME`, `OPENSKY_PASSWORD` | OpenSky historical lookups. |
| `RATE_HOURLY_LIMIT`, `RATE_DAILY_LIMIT`, `RATE_PER_AIRCRAFT_HOURS` | Submission limit overrides (defaults 5 / 20). |
| `THREAT_HIGH_REPORTERS`, `THREAT_MEDIUM_REPORTERS` | Unique reporters needed for threat badges (defaults 5 / 3). |
| `ANOMALY_BURST_THRESHOLD`, `ANOMALY_SCATTER_THRESHOLD`, `ANOMALY_LOW_SCORE_FLAGS`, `ANOMALY_LOW_SCORE_CEILING` | Flag anomaly detection tuning. |

Local builds need placeholder values for the three Supabase variables or `next build` fails.

---

## 12. How the radar decides what's interesting

Scoring runs in the browser (`src/components/map/flight-layer.tsx`) and is used for sort
order and marker emphasis only. The number is never shown (UI rule in `CLAUDE.md`).

| Signal | Points |
|---|---|
| Altitude in the cloud-seeding band (3,000–20,000 ft) | +2 |
| Small prop / turboprop type | +2 |
| Non-commercial (no airline callsign) | +1.5 |
| Non-commercial at high altitude | +1 |
| Low speed at seeding altitude | +1 |
| Tail number used as callsign | +0.5 |

Separate from the score: a **WX MOD** badge when the registration matches a known weather
modification operator (`src/lib/data/operators.ts`), and community threat badges from
`flight_flags`. Aircraft that are known operators, community flagged, high-scoring, or
manually pinned are nominated to `/api/flight-history` every 60 s.

---

## 13. Evidence flow for a citizen report

1. Visitor picks a photo. Browser reads EXIF (`src/lib/utils/exif.ts`), hashes the **original**
   file with SHA-256 (`src/lib/utils/hash.ts`), then downsizes to ≤2048 px JPEG so the upload
   fits Vercel's body limit (`src/lib/utils/photo.ts`).
2. POST `/api/reports` validates, rate-limits, inserts with `reporter_hash`.
3. POST `/api/reports/archive` emails the evidence to the admin address as an off-site copy.
4. The report appears on `/map` and `/reports`. Live correlation (`/api/correlate`) proposes a
   candidate pool of nearby aircraft; the product never asserts a single match unless the
   evidence is gold-tier (see `VISION.md`).

---

## 14. Working on it

```bash
git pull --ff-only
npm install
npm run dev          # http://localhost:3000
npx tsc --noEmit -p .   # typecheck before pushing; pushes to main go live
```

- Locally, `/api/geo` returns nulls (no Vercel headers) so the home radar shows Austin.
- Rate limits can be tested locally by sending `x-forwarded-for: 10.0.0.9` (ignored in
  production, where Vercel sets the real one).
- Adding a table: write `supabase/migrations/008_*.sql` with `ENABLE ROW LEVEL SECURITY`,
  add it to `EXPECTED_SCHEMA` in `src/lib/health.ts`, run it in the SQL Editor, confirm
  `/api/health` is `ok`, add a row to the table list above.
- Adding a submission route: validate, hash IP, `checkSubmissionLimits`, service-role insert,
  bucket in `src/proxy.ts`, row in the security doc's limits table.
- Adding a third-party fetch: send `SKYLEDGER_USER_AGENT`, log failures, consider a fallback.

---

## 15. Timeline of the build

| When | What |
|---|---|
| Mar 2026 | Phases 1–2: landing, map, reports with EXIF + hashing, live radar, flagging, operator profiles, legislation, facts, follow-the-money. |
| Late Mar 2026 | Contrail badge, toolkit, lobby tracker, exposés, route pipeline upgrade, LLC piercing. |
| Apr 2026 | Admin dashboard + weekly email, streak detection (3-source correlation), cookie auth. |
| Apr 19 2026 | Vercel breach: Config-type env vars considered exposed; CRON_SECRET rotated. |
| Oct 2026 | Supabase keep-alive fix after a silent pause. |
| Oct 25 2026 | Radar outage root-caused (ADSB.lol 403 on default User-Agent). Provider fallback, health endpoint, alert email, incident runbook. Home page auto-starts the radar with Austin fallback. Abuse hardening (items 1–6). |
| Oct 26 2026 | Migration 007 applied. Discovered and created the missing flight-history tables. Health check now probes all tables. This document written. |
