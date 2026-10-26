# Roadmap — SkyLedger

> Last updated: 2026-10-26

---

## Operations — Rex's manual steps (dashboard-only, Claude can't do these)

Work top to bottom. Each one has step-by-step instructions in the "Walkthroughs" section at the end of this file. Check it off here when done and note the date.

- [ ] **1. Vercel env var audit** — Confirm no variable still shows the `<>` Config icon, especially `SUPABASE_SERVICE_ROLE_KEY`. If it does, rotate it in Supabase and re-enter in Vercel as a Secret. Open since the April 2026 Vercel breach.
- [ ] **2. Vercel Firewall → Bot Protection on** — Last item of the abuse-hardening checklist.
- [ ] **3. Test the alert email** — One curl with the CRON_SECRET; confirms the daily health alert can actually reach your inbox.
- [ ] **4. UptimeRobot on `/api/health`** — Free external monitor so a dead site pages you within minutes, not next morning.
- [ ] **5. Supabase Pro decision (~$25/mo)** — Removes the 7-day pause risk and raises limits. Not urgent now that keep-alive works.
- [ ] **6. Merge the OPS.md addenda on seat 2** — Two "For `private/OPS.md`" sections (radar incident doc, security doc) and the 2026-10-26 incident need copying into the gitignored ops bible on your main machine.

---

## P0 — Critical

- [~] **Abuse hardening (DDoS, bot floods, fake data)** — Code side complete and live 2026-10-25 (items 1–6). Migration 007 applied 2026-10-26. Remaining: Vercel Bot Protection (ops step 2 above). Checklist + work log with verify/undo notes per item: `docs/security/2026-10-25-abuse-hardening.md`.
- [ ] **Push Notification System (Contrail Phase 2)** — When a known weather mod operator enters a user's registered radius, fire a push notification so they can look up and photograph in real-time. Needs service workers, notification permissions, user location registration, backend position-watching. This is the "active tracking flip" that converts passive reports into gold-tier matches.
- [ ] **Arkansas Geoengineering Ban Bill** — Spearhead weather modification ban targeting January 2027 regular session. Bill drafting should start ~September 2026. Republican supermajority (House 81-19, Senate 29-6). Governor Sanders likely to sign. Game plan in `research/`. No prior bill = clean slate.

---

## P1 — High

- [ ] **Mobile App** — Native app for photo submissions, flight tracking, and push notifications. Matt sees this as a game changer for adoption — phones are already in hand when people see something in the sky. Current API routes can serve as backend.
- [ ] **Compass Calibration Prompt** — AR/compass mode gets unreliable without recalibration. Build a calibration modal (tilt forward/back, side to side, left/right) modeled on FlightRadar24's AR view. Detect degraded accuracy, offer step-by-step instructions, "Don't show again" option.
- [ ] **State Ban Playbook Expansion** — Enrich the Winning Playbook page with Tennessee and Louisiana case studies alongside existing Florida content.

---

## P2 — Medium

- [ ] **FOIA Request Builder** — Guided FOIA template generator targeting weather mod programs, sourced from streak detection patterns.
- [ ] **Legislative Testimony Data Export** — Pull statistical patterns from streak detection to generate data-backed testimony for state ban hearings.

---

## P3 — Low

- [ ] **Dark Aircraft Gap Analysis Dashboard** — Dedicated visualization for ADS-B gap data (reported trails vs. tracked aircraft) over time.

---

## Shipped

- [x] **Flight-history tables created on production + full schema health check** — Migration 003_flight_history had never been applied; flight history, streak source 1, and the weekly sightings count had silently failed since April. Tables created, `/api/health` now probes all 11 tables. `docs/incidents/2026-10-26-missing-flight-history-tables.md`. Shipped 2026-10-26.
- [x] **Build documentation** — `docs/BUILD.md` (full architecture: hosting, routes, crons, tables, security layers, env var names, scoring, evidence flow, timeline) and a real `README.md`. Shipped 2026-10-26.
- [x] **Abuse hardening, code side** — Edge rate limiting, DB-backed submission limits, server-only writes, validation on every POST, feed-verified flight history, schema check, alert-email headline fix. `docs/security/2026-10-25-abuse-hardening.md`. Shipped 2026-10-25.
- [x] **Radar outage fix + monitoring** — ADSB.lol 403 on default User-Agent root-caused; provider fallback (adsb.fi), `/api/health`, daily alert email, home page auto-starts the radar with Austin fallback. `docs/incidents/2026-10-25-flight-feed-403.md`. Shipped 2026-10-25.
- [x] **Contrail Context Badge (Phase 1A + 1B)** — Weather API integration + contrail likelihood badge on flight detail panel. Orange = unlikely (too warm/dry/low), Blue = expected. Shipped 2026-03-26.
- [x] **Streak Detection System** — Retroactive flight pattern recognition. 3-source correlation engine (internal positions, adsb.lol, OpenSky), altitude tiering, dark aircraft gap tracking, significance scoring. Admin-only intelligence. Shipped 2026-04-09.
- [x] **Admin Dashboard & Weekly Report** — `/admin` with cookie auth, weekly HTML email via Vercel Cron (Mon 9am CT), feedback widget on every page, Vercel Analytics, activity by state. Shipped 2026-04-07.
- [x] **Citizen Action Toolkit** — `/get-involved/toolkit` — phone scripts, email templates, testimony guide, social share kit, follow-up guide. Shipped 2026-03-27.
- [x] **Lobby Tracker** — `/learn/lobby-tracker` — lobbying firms, anti-ban activity, state lookup, Holland & Knight red flag. Shipped March 2026.
- [x] **Geoengineering Monitor Integration** — ETC Group / Heinrich Boell / Biofuelwatch resources across `/get-involved`, `/learn`, `/learn/facts`. World map, briefings, resistance timeline. Shipped 2026-03-31.
- [x] **Deep Dive Exposés (5)** — Degrees Initiative, ARIA, Open Philanthropy, marine geoengineering, BECCS/Drax. New operator profiles + Follow the Money entries. Shipped 2026-03-31.
- [x] **Route Data Upgrade** — adsb.lol routeset → ADSBDB → HexDB pipeline with dual geo verification.
- [x] **Corporate Entity Badge** — LLC piercing tooltip showing real owner on hover.
- [x] **GeoWatch & GeoFight Org Cards** — Organization profiles with assessments.
- [x] **Facts Page Updates** — LBJ quote, Brennan SAI, peer-reviewed environmental impact section.
- [x] **Admin Auth Upgrade** — Switched from URL query param to secure session cookie (7-day sessions).

---

## Walkthroughs for the operations steps

Written 2026-10-26. Claude cannot see the Vercel or Supabase dashboards, so these are done by Rex. Each ends with a way to confirm it worked. Report back what you see and the step gets checked off above.

### 1. Vercel env var audit

1. vercel.com → team **rexaffects' projects** → project **openskies** → **Settings** → **Environment Variables**.
2. Look at the icon to the left of each variable name. A `<>` icon means "Config" (plain text, included in the April 2026 breach). A lock or "Sensitive" badge means Secret.
3. For every variable still showing `<>`:
   - If it's `SUPABASE_SERVICE_ROLE_KEY`: Supabase → project → **Settings → API** → under "Project API keys", **Reset** the service_role key. Copy the new one. Back in Vercel, edit the variable, paste the new value, tick **Sensitive**, save. Then **Deployments → Redeploy** the latest so the running site picks it up.
   - If it's `GMAIL_APP_PASSWORD`: Google Account → Security → App passwords → delete the SkyLedger one, create a new one, update in Vercel as Sensitive.
   - `ADMIN_PASSWORD`, `FLAG_SALT`, `KEEP_ALIVE_SECRET`, `OPENSKY_*`: change to a new random value, mark Sensitive. (Changing `FLAG_SALT` resets everyone's daily limit counters; harmless.) `KEEP_ALIVE_SECRET` must also be updated in GitHub → repo → Settings → Secrets → Actions.
   - `NEXT_PUBLIC_*` variables are public by design; leave them.
4. **Confirm:** no `<>` icons remain, and after the redeploy `skyledger.org/api/health` is `ok` and submitting a test flag still works.

### 2. Vercel Firewall Bot Protection

1. vercel.com → project **openskies** → **Firewall** tab (top nav of the project).
2. Find **Bot Protection** (under "Managed Rulesets" or at the top of the Firewall page depending on layout). Set it to **Challenge** or **Deny**. Challenge is the safer choice for UX: real browsers pass silently.
3. While there, note where **Attack Challenge Mode** is (a toggle at the top of the Firewall page). Don't turn it on now. It's the one-click button for an active DDoS.
4. **Confirm:** load `skyledger.org` in a normal browser; it should behave exactly as before. Check `/api/health` still says `ok`. If the radar stops updating, Bot Protection is challenging our own fetches: switch it from Deny to Challenge, or add a bypass rule for `/api/flights/nearby`.

### 3. Test the alert email

1. Get `CRON_SECRET` from Vercel → openskies → Settings → Environment Variables (click the eye icon to reveal).
2. In any terminal:
   ```
   curl -H "Authorization: Bearer PASTE_CRON_SECRET_HERE" "https://www.skyledger.org/api/cron/health-check?test=1"
   ```
3. **Confirm:** within a minute, an email with subject `[SkyLedger] ...` arrives at the admin address. If nothing arrives, check Vercel → openskies → Logs for the health-check function and paste the error here.

### 4. UptimeRobot

1. uptimerobot.com → free account.
2. **Add New Monitor** → type **HTTP(s)** → URL `https://www.skyledger.org/api/health` → interval 5 minutes → alert contact: your email (and SMS if you want).
3. Our endpoint returns HTTP 503 when the radar or database is down, so the default "non-2xx = down" setting is correct.
4. **Confirm:** the monitor shows green. Optionally pause it and un-pause to see a test alert.

### 5. Supabase Pro decision

- What you get for ~$25/mo: no inactivity pause, daily backups (7 days), 8 GB database (vs 500 MB), 100 GB bandwidth, email support.
- What we have now: keep-alive cron prevents the pause; database is far below 500 MB; no backups beyond the evidence emails.
- Recommendation: stay on Free until either (a) citizen reports with photos approach ~300 MB (check Supabase → Settings → Usage), or (b) you want backups. Reassess at launch.

### 6. Merge the OPS.md addenda (seat 2)

1. On the main machine, open `private/OPS.md`.
2. Copy in the "For `private/OPS.md`" sections from `docs/incidents/2026-10-25-flight-feed-403.md` and `docs/security/2026-10-25-abuse-hardening.md`, and the summary from `docs/incidents/2026-10-26-missing-flight-history-tables.md`.
3. Update the tables list to say all 11 tables exist with RLS on, and that migrations 003_flight_history and 007 were applied 2026-10-26.
4. Or: tell Claude on seat 2 "merge the OPS addenda from the docs folder" and it will do it.
