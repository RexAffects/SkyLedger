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

- [ ] **1. Close the direct-database hole for citizen reports.** New server route `POST /api/reports`
      with validation + rate limits; browser no longer inserts into Supabase directly.
      Migration 007 removes the anon INSERT/UPDATE policies and enables RLS on the four unprotected tables.
- [ ] **2. Rate-limit streak reports and citizen reports** the same way flags already are
      (per-IP hourly/daily, DB-backed, hashed IP).
- [ ] **3. Flight history: server verifies positions against the live ADS-B feed** before recording them.
      Fabricated positions are impossible, not just rate-limited.
- [ ] **4. One shared per-IP throttle on every `/api/*` route** (`src/proxy.ts`), with tighter
      buckets for feedback, admin login, and all submission endpoints.
- [ ] **5. Schema check in `/api/health`** so the daily email nags until migration 007 is applied.
- [ ] **6. Docs:** this file, `CLAUDE.md` security rules, OPS.md addendum, `PROJECT-STATUS.md`.

### Rex

- [R] **Run migration `supabase/migrations/007_security_hardening.sql`** in Supabase → SQL Editor.
      Until this runs, the direct-insert hole stays open (the new server route works either way).
- [R] **Vercel → Project `openskies` → Firewall tab.** Turn on the managed Bot Protection rule and
      know where "Attack Challenge Mode" is (one click, use it during an active attack).
      Claude can't see this dashboard.

### Later (not now)

- Cloudflare Turnstile (invisible captcha) on the report forms if bot submissions actually show up.
- Weight reports by reporter history instead of treating every anonymous report equally.
- Move rate-limit counters to a shared store (Upstash/Vercel KV) if traffic grows; see the
  "per-instance" caveat under item 4.

---

## Work log

<!-- Items are filled in below as they ship. Newest at the bottom. -->
