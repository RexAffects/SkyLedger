# Security hardening: DDoS, bot floods, fake data (started 2026-10-25)

**Status legend:** `[ ]` not started · `[~]` in progress · `[x]` shipped and verified live · `[R]` needs Rex

This is both the **to-do list** and the **record of what was done**. Each shipped item has
"What changed / How to verify / How to undo", so if anything misbehaves you can find the cause
and roll back one piece without touching the rest. Each item is its own git commit.

## Why this exists

Rex asked (2026-10-25): *"Do we have any security set up to prevent DDoSing? ... do we have a way
to prevent fake reporting from a bunch of bots trying to sabotage the project?"*

Ground rule from Rex: **no change may make the user experience worse.** Limits are set so a
real person never hits them; only scripts do.

## What we found (before any changes)

| Attack | Protected? | Detail |
|---|---|---|
| Network-level DDoS (flooding the site) | ✅ Vercel | Vercel's edge absorbs this on every plan. Not our problem. |
| Hammering `/api/flights/nearby` to get our server IP rate-limited by ADSB.lol / adsb.fi | ❌ | No per-IP throttle on any read endpoint. Radar would break for everyone. |
| Burning Hobby-plan compute/bandwidth caps | ❌ | Same cause. |
| Flooding `/api/feedback` → Gmail inbox flood | ❌ | No limit. |
| Guessing the admin password (`/api/admin/auth`) | ❌ | Unlimited attempts. |
| **Flag an aircraft** (`/api/flags`) | ✅ Partial | 1 flag per aircraft per IP per day, 5/hour, 20/day. Anomaly log. Threat level counts *unique reporters*. Per-IP only, so VPN/hotspot rotation defeats it. |
| **Citizen report** (report form + photo evidence) | ❌ **Worst** | Browser writes **directly to Supabase** with the public anon key. RLS policy was `INSERT WITH CHECK (true)` = anyone can insert anything, unlimited, bypassing our server entirely. |
| **Streak report** (`/api/streak/report`) | ❌ | IP hashed and stored, but never checked. Unlimited. |
| **Flight history** (`/api/flight-history` POST) | ❌ **Credibility risk** | Radar posts aircraft positions from the browser every 60s. Server trusted them blindly. Anyone could fabricate "N12345 was over Fayetteville at 2,000 ft". That fake history then feeds correlation, which is the evidence the whole platform rests on. |
| Tables `flight_positions`, `flight_summaries`, `streak_reports`, `streak_matched_flights` | ❌ | Created **without RLS at all** (migrations 003 and 005). With RLS off, the public anon key can read *and write* them directly via the Supabase REST URL. |

Side note kept on purpose: `reporter_hash` rotates daily (`ip + salt + date`). Privacy win, but
limits reset at midnight UTC and the anomaly log can't connect the same abuser across days.

## Checklist

### Code (Claude)

- [x] **1. Close the direct-database hole for citizen reports.** New server route `POST /api/reports`
      with validation + rate limits; browser no longer inserts into Supabase directly.
      Migration 007 removes the anon INSERT/UPDATE policies and enables RLS on the four unprotected tables.
      *Live 2026-10-25 (commit `11511b9`). Code side done; the policy removal waits on Rex running 007.*
- [x] **2. Rate-limit streak reports and citizen reports** the same way flags already are
      (per-IP hourly/daily, DB-backed, hashed IP). *Live 2026-10-25 (`fed98b3`).*
- [x] **3. Flight history: server verifies positions against the live ADS-B feed** before recording them.
      Fabricated positions are impossible, not just rate-limited. *Live 2026-10-25 (`c44de87`).*
- [x] **4. One shared per-IP throttle on every `/api/*` route** (`src/proxy.ts`), with tighter
      buckets for feedback, admin login, and all submission endpoints. *Live 2026-10-25 (`1bc9122`).*
- [x] **5. Schema check in `/api/health`** so the daily email nags until migration 007 is applied.
      *Live 2026-10-25 (`2fa2f73`); currently reporting `schema.ok: false` as expected.*
- [x] **6. Docs:** this file, `CLAUDE.md` security rules, OPS.md addendum, `PROJECT-STATUS.md`. *(`cc78125`)*

**Live verification, 2026-10-25 21:33 UTC (after deploy):**
`POST /api/reports {}` → 400 "A valid location is required" · fabricated hex to `/api/flight-history`
→ `{"inserted":0,"rejected":1}` · bad streak severity → 400 · 7 empty feedback POSTs → 400 ×5 then
429 ×2 (no email sent) · radar `nearby` → 26 aircraft via adsb.lol · `/`, `/flights`, `/reports/new`
→ 200 · `/api/health` → `degraded`, `schema.missing` names migration 007.
Note: the very first `/api/health` call after the deploy reported the DB check failed; it was a cold
start (that check takes ~4.5 s and has done so since it was written). Three calls later: `db: true`.
If it ever stays false across several minutes, that's real; see the incident runbook.

### Rex

- [x] **Run migration `supabase/migrations/007_security_hardening.sql`** in Supabase → SQL Editor.
      *Done by Rex 2026-10-26 ~14:40 UTC.* It failed the first time because `flight_positions`
      never existed on the live DB (migration 003_flight_history was never run); see
      `docs/incidents/2026-10-26-missing-flight-history-tables.md`. Both 003 and 007 are now
      applied; `pg_tables` shows all 11 tables with `rowsecurity = true`; `/api/health` → `ok`.
- [R] **Vercel → Project `openskies` → Firewall tab.** Turn on the managed Bot Protection rule and
      know where "Attack Challenge Mode" is (one click, use it during an active attack).
      Claude can't see this dashboard.

### Later (not now)

- Cloudflare Turnstile (invisible captcha) on the report forms if bot submissions actually show up.
- Weight reports by reporter history instead of treating every anonymous report equally.
- Move rate-limit counters to a shared store (Upstash/Vercel KV) if traffic grows; see the
  "per-instance" caveat under item 4.

---

## How the limits are tuned (so nobody "fixes" them into a UX problem)

| Who | Normal usage | Limit | Headroom |
|---|---|---|---|
| Radar viewer | ~12 `nearby` requests/min (5s polls for 60s, then 10s) | 180/min per IP | 15 people behind one office NAT, all in their first minute |
| Reporter | 1–2 reports a day | 5/hour, 20/day per IP (DB) + 10/hour (memory) | A very busy citizen scientist |
| Radar history logger | 1 POST/min | 4/min per IP | 4 radar tabs open |
| Feedback widget | rare | 5 per 10 min per IP | — |
| Admin login | 1 | 5 per 15 min per IP | 4 typos |
| Anything else under `/api` | — | 600/min per IP | ~10 requests/second |

All limits return **HTTP 429** with a `Retry-After` header and a plain-English `error`. The report
forms show that message; the radar's history logger is fire-and-forget and ignores it.

To change a limit: `src/proxy.ts` (`ROUTE_BUCKETS`) for memory limits, env vars
`RATE_HOURLY_LIMIT` / `RATE_DAILY_LIMIT` for the DB-backed submission limits (shared with flags).

## Work log

<!-- Items are filled in below as they ship. Newest at the bottom. -->

### 1. Citizen reports through `POST /api/reports` — commit `11511b9`

**What changed**
- New `src/app/api/reports/route.ts`: validates every field (coordinate ranges, observation type and
  trail behavior against `constants.ts`, time not in the future, notes ≤ 500, one photo max and it
  must be `data:image/…`, EXIF ≤ 20 KB), hashes the IP, applies DB-backed limits, inserts with the
  service role, returns `{ report }`.
- `src/lib/supabase/reports.ts` → `submitReport()` now calls that route and returns
  `{ report, error }`. Both forms (`report-form.tsx`, `photo-evidence-dialog.tsx`) show the server's
  message when it refuses (e.g. rate limited) instead of the generic failure text.
- New `src/lib/utils/photo.ts` → `prepareUploadDataUrl()`. Photos over ~1.5 MB (as base64) are scaled
  to ≤ 2048 px JPEG in the browser. Needed because Vercel caps request bodies at 4.5 MB and phone
  photos are often bigger. The SHA-256 evidence hash is still computed from the **original** file.
  Side benefit: the evidence-archive email (`/api/reports/archive`) was already silently failing for
  big photos for the same reason; it now gets a photo that fits.
- New `src/lib/security/submission-limits.ts` → `checkSubmissionLimits(table, hash)`: hourly/daily
  counts per `reporter_hash`, same numbers as flags. If the query errors (column missing because
  migration 007 isn't applied) it logs `[security] submission limit check skipped` and allows.
- New `supabase/migrations/007_security_hardening.sql` (Rex runs it; see checklist).

**How to verify**
- `curl -s -X POST https://www.skyledger.org/api/reports -H 'content-type: application/json' -d '{}'`
  → `{"error":"A valid location is required"}`.
- Submit a real report on `/reports/new`; it should appear on `/reports` as before.
- After migration 007: Supabase → Table Editor → `citizen_reports` has a `reporter_hash` column on
  new rows. `/api/health` → `schema.ok: true`.

**How to undo** — `git revert 11511b9`. The forms go back to direct inserts. If migration 007 has
already run, direct inserts will then fail (the INSERT policy is gone), so re-create the policy
from migration 001 first. Don't undo this one lightly; it's the main fix.

**Gotchas**
- Until migration 007 runs, `reporter_hash` isn't stored, so the DB limit can't count. The
  in-memory 10/hour per IP limit still applies. `/api/health` reports this as `schema.missing`.
- Photos that the browser can't decode (some HEIC) are sent unshrunk; the server answers
  "Photo is too large" if they exceed 3 MB rather than failing silently.

### 2. Streak reports rate-limited and validated — commit `fed98b3`

**What changed** — `src/app/api/streak/report/route.ts`: `checkSubmissionLimits("streak_reports", …)`
(5/hour, 20/day), plus validation of coordinate ranges, `severity`, `trail_state`,
`dark_aircraft_estimate` (integer 0–1000). `streak_reports.reporter_hash` already existed.

**How to verify** — POST with `"severity":"nope"` → 400 `Invalid severity`. The 6th report from one
IP within an hour → 429 with the "several reports in the last hour" message, shown by the streak form.
The quick-report widget inside the radar ignores non-200s (it always did), so a limited user there
just sees the button return to normal.

**How to undo** — `git revert fed98b3`.

### 3. Flight history verified against the live feed — commit `c44de87`

**What changed** — `src/app/api/flight-history/route.ts` POST. The browser payload is now treated
as a list of **nominations** (hex + why). The server:
1. Validates hex format (`[0-9a-f]{6}`, optional `~` for TIS-B), coordinates, `track_reason`.
2. Queries the live feed once around the centroid of the claimed positions (radius = spread + 15 nm,
   min 25, max 100; centroid rounded to 0.01° so a stationary radar reuses the 5-second data cache).
3. Keeps only nominations whose hex is in the feed **and** whose claimed position is within 10 nm of
   the feed's position; then records the **feed's** lat/lon/altitude/speed/heading/tail/callsign,
   not the browser's. `track_reason` and `suspicion_score` still come from the browser (they are
   "why we're tracking", not evidence).
4. If both feed providers are down → 503 and nothing recorded (fail closed). Logged as
   `[security] flight-history: feed unavailable`.
Response is `{ inserted, rejected }`; rejections are logged as `[security] flight-history: rejected N of M`.

**How to verify** — tested locally 2026-10-25: 3 real airborne aircraft at their feed positions →
`rejected: 0`; one hex swapped to `abcdef` → `rejected: 1`; a real hex 90 nm from its true
position → rejected; garbage `track_reason` → rejected. Live:
`curl -s -X POST https://www.skyledger.org/api/flight-history -H 'content-type: application/json' -d '[{"icao_hex":"abcdef","latitude":36.06,"longitude":-94.16,"track_reason":"known_operator"}]'`
→ `{"inserted":0,"rejected":1}`.

**How to undo** — `git revert c44de87`. Flight history then trusts the browser again.

**Gotchas**
- An aircraft that drops off the feed (lands, leaves coverage) in the ≤ 60 s between the radar tick
  and the history post is rejected. That loses at most its final position. Seen during testing.
- Each POST costs one feed request. The 4/min per-IP bucket in the proxy bounds that.
- Vercel logs: search `[security] flight-history` to see rejection volume. A steady stream of
  rejections from one IP = someone probing.

### 4. Per-IP throttle on every `/api` route — commit `1bc9122`

**What changed**
- New `src/proxy.ts` (Next 16's name for middleware; matcher `/api/:path*`). Global 600/min per IP,
  plus the per-route buckets in the tuning table above. `/api/cron/*` and `/api/keep-alive` exempt.
- New `src/lib/security/rate-limit.ts`: sliding-window counter in a `Map`, capped at 20k keys.
  `clientIp()` reads `x-forwarded-for` (Vercel sets it; not spoofable in production).
- `src/app/api/admin/auth/route.ts`: constant-time password compare (`crypto.timingSafeEqual`).

**How to verify** — 6 quick POSTs to `/api/feedback` with `{"message":""}`: first five → 400, sixth
→ 429 with `retry-after: 600`. Server logs show `[security] route rate limit hit: <ip> POST /api/feedback`.
Cron: Vercel → Logs → the daily `health-check` and `keep-alive` runs still return 200.

**How to undo** — delete `src/proxy.ts` (or `git revert 1bc9122`). Everything else keeps working;
the submission routes keep their own DB-backed limits.

**Gotchas / known limits**
- **Counters are per warm instance.** Vercel may run several instances; each has its own Map. An
  attacker who lands on 5 instances gets ~5× the limit. Real people never notice. If this ever
  matters, replace the Map in `rate-limit.ts` with Upstash Redis / Vercel KV; keep the signature.
- A cold start resets counters. Also fine.
- The proxy runs on every `/api` request, so it adds one function execution per API call to the
  Hobby-plan usage. At current traffic this is negligible; watch Vercel → Usage if traffic jumps.
- Localhost: `x-forwarded-for` *is* spoofable, which is handy for testing buckets
  (`-H "x-forwarded-for: 10.0.0.9"`).

### 5. `/api/health` schema check — commit `2fa2f73`

**What changed** — `src/lib/health.ts` gains `schema: { ok, missing[] }` driven by an
`EXPECTED_SCHEMA` list (currently `citizen_reports.reporter_hash` → migration 007). A missing column
→ status `degraded` → the daily cron email names the migration file. Public `/api/health` shows it
too (HTTP stays 200; it's degraded, not down).

**How to verify** — `https://www.skyledger.org/api/health` → `"schema"` key present. Before migration
007: `ok:false` with the file named. After: `ok:true`.

**How to undo** — `git revert 2fa2f73`. Add future migrations to `EXPECTED_SCHEMA` the same way.

**Update 2026-10-26** — `EXPECTED_SCHEMA` now probes every table the code uses (11 tables, one
column each, in parallel), not just the 007 column. Reason: the 007 run exposed that the
flight-history tables had never been created on production. Incident note:
`docs/incidents/2026-10-26-missing-flight-history-tables.md`.

### 6. Docs — this file, `CLAUDE.md`, `PROJECT-STATUS.md`, `ROADMAP.md`

See the "For `private/OPS.md`" section below for the addendum to merge on seat 2.

## For `private/OPS.md` (merge on the machine that has it)

- **Security / rate limiting:** every `/api/*` route is per-IP throttled in `src/proxy.ts` (global
  600/min; buckets per route in that file). Submissions (`/api/reports`, `/api/streak/report`,
  `/api/flags`) also have DB-backed per-`reporter_hash` limits: 5/hour, 20/day
  (`RATE_HOURLY_LIMIT` / `RATE_DAILY_LIMIT`). `FLAG_SALT` is required for all of them.
- **Internal API routes:** `POST /api/reports` (citizen reports; replaces the browser's direct
  insert). `POST /api/flight-history` now verifies nominations against the live feed and records
  feed positions only.
- **Supabase RLS (after migration 007):** anon key can SELECT `citizen_reports` (active) and
  `flight_flags` only. No anon INSERT/UPDATE anywhere. `flight_positions`, `flight_summaries`,
  `streak_reports`, `streak_matched_flights` have RLS enabled with no policies = service role only.
- **Log markers:** `[security]` (rate limits hit, rejected flight-history nominations, skipped limit
  checks), `[reports]` (citizen report insert failures), `[flight-feed]` (provider failures).
- **Decision log, 2026-10-25:** closed direct-to-Supabase writes; added per-IP throttling and
  feed-verified flight history. Chose in-memory counters over Upstash to avoid a new dependency at
  current traffic. Chose client-side photo downscaling (hash still of original) over Supabase
  Storage to keep the change small.
