# Roadmap — SkyLedger

> Last updated: 2026-04-10

---

## P0 — Critical

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
