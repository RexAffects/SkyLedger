# SkyWatch: A Buildable Public Transparency Tool for Weather Modification Accountability

**Date:** 2026-03-18
**Purpose:** Concrete build plan for a vibe-codeable web app that aggregates public data, citizen reports, and legal resources into one credible, legally defensible transparency platform.

---

## The Core Idea

One platform that answers: **"What is flying over me, who owns it, are they permitted, and what are they spraying?"**

No existing tool combines citizen observations + flight data + government permits + legal action in one place. ClimateViewer comes closest but is aging, advocacy-coded, and doesn't have a citizen reporting workflow. This fills the gap.

**Name options:** SkyWatch, ClearSky, OpenSkies, SkyLedger, AeroWatch

---

## Architecture: What Gets Built

### The Stack (Vibe-Codeable, Ship Fast)

```
Frontend:     Next.js 14+ (App Router) + Tailwind CSS + shadcn/ui
Maps:         Mapbox GL JS (free tier: 50k map loads/month) or Leaflet (fully free, open source)
Backend:      Next.js API routes + Supabase (free tier: 500MB DB, 50k auth users, 1GB storage)
Auth:         Supabase Auth (email, Google, anonymous)
Storage:      Supabase Storage (photos/videos) + Cloudflare R2 (overflow, $0 egress)
Hosting:      Vercel (free tier: 100GB bandwidth, serverless functions)
Search:       Supabase full-text search (built-in) or Meilisearch (self-hosted)
Cron/Jobs:    Vercel Cron or Supabase Edge Functions (data ingestion)
Hashing:      Web Crypto API (SHA-256, runs in browser at capture time)
```

**Why this stack:**
- Next.js + Supabase + Vercel = zero infrastructure cost at launch
- Supabase gives you Postgres, Auth, Storage, Realtime, Edge Functions in one free tier
- Tailwind + shadcn = professional UI without a designer
- All of these are well-supported by AI coding tools (Cursor, Claude, etc.)
- Can be built by one person in weeks, not months

**Total cost to launch: $0-20/month** (domain name is the only required cost)

---

## Module 1: The Map (Launch First)

### What It Shows
A full-screen interactive map with toggleable layers:

**Layer 1 — Citizen Reports (User-Generated)**
- Pins on map showing citizen observations with photos/videos
- Color-coded by type: aerial activity, ground-level air quality, test results
- Click to see full report: photo, timestamp, GPS, description, verification status
- Filter by date range, report type, verification level

**Layer 2 — Known Weather Modification Operations (Scraped/Manual)**
- Active cloud seeding programs by state (from NOAA reports + state permits)
- Target areas as polygons on the map
- Operator name, permit status, materials used, dates of operation
- Data source: NOAA Weather Modification Project Reports, state agencies (TX, ND, CO, ID, UT, etc.)

**Layer 3 — Air Quality (API-Fed)**
- EPA AQS stations (free API, JSON, requires email signup only)
- PurpleAir sensors (API available, shows citizen-deployed PM2.5 sensors)
- AirNow real-time AQI overlay
- Sensor.Community stations (open data, open API)

**Layer 4 — Live Flight Tracking (API-Fed)**
- Real-time aircraft positions from ADSB.lol (fully free, open data, ODbL licensed)
- Highlight known weather modification aircraft (cross-referenced with FAA registry)
- Click aircraft to see: tail number, owner (from FAA), flight history, permit status

**Layer 5 — Legal Landscape**
- States with geoengineering bans (TN, FL, MT, LA) highlighted
- States with pending legislation highlighted differently
- Click state for: current law text, reporting requirements, how to file complaints

### Data Sources for the Map

| Data | Source | API? | Cost | Update Frequency |
|------|--------|------|------|-----------------|
| Flight positions | ADSB.lol | Yes (free, open) | Free | Real-time |
| Aircraft ownership | FAA N-Number Registry | Bulk download (daily) | Free | Daily |
| Weather mod permits | NOAA Reports Database | Scrape/manual | Free | Quarterly |
| State permits | TX TDLR, ND NDCMP, CO CWCB, etc. | Varies (some scrapable) | Free | Varies |
| Air quality (official) | EPA AQS API | Yes (free, JSON) | Free | Hourly |
| Air quality (citizen) | PurpleAir API | Yes (API key required) | Free tier available | Every 80 seconds |
| Air quality (open) | Sensor.Community | Yes (open) | Free | Real-time |
| Real-time AQI | AirNow API | Yes (free) | Free | Hourly |

### Map Tech Decision

**Option A: Leaflet (Recommended for MVP)**
- Fully free and open source, no API key needed
- Lighter weight, works great on mobile
- Massive plugin ecosystem
- Use OpenStreetMap tiles (free)
- No usage limits ever

**Option B: Mapbox GL JS**
- Better 3D, smoother interactions
- Free tier: 50,000 map loads/month (plenty for launch)
- Requires API key
- Better for "wow factor" but adds vendor dependency

**Recommendation:** Start with Leaflet + OpenStreetMap. Migrate to Mapbox later if needed for 3D flight path visualization.

---

## Module 2: Citizen Reporting (The Core Loop)

### The Report Flow

```
1. User opens app on phone
2. Taps "Report Observation"
3. Camera opens — user photographs/records what they see
4. App automatically captures:
   - GPS coordinates (from phone)
   - Timestamp (UTC)
   - Compass heading / camera angle
   - Device info
   - Current weather conditions (from NWS API — free)
   - Current AQI at location (from AirNow API — free)
5. SHA-256 hash generated in browser BEFORE upload (Web Crypto API)
6. User adds description: structured form, NOT free text
   - "I observed: [dropdown: persistent trail / spray pattern / unusual aerial pattern / low-altitude aircraft / other]"
   - "Number of aircraft: [1-10+]"
   - "Duration observed: [minutes]"
   - "Trail behavior: [dissipated quickly / persisted / spread into haze / other]"
   - "Optional notes: [free text, max 500 chars]"
7. Upload to Supabase Storage (photo) + Supabase DB (metadata)
8. Hash stored alongside record — proves photo hasn't been modified since capture
9. Report appears on map immediately (marked "Unverified")
```

### Verification System (iNaturalist Model)

**Tier 1 — Unverified (just submitted)**
- Single observation, no corroboration
- Shown on map with hollow/grey pin
- Still valuable as data point

**Tier 2 — Corroborated (multiple observers)**
- 2+ independent observers report similar activity in same area/timeframe
- Algorithm checks: different user accounts, different devices, overlapping GPS/time windows
- Shown on map with solid/yellow pin

**Tier 3 — Flight-Matched (correlated with ADS-B)**
- Citizen report GPS/time matches an aircraft tracked on ADS-B
- Aircraft identified by tail number, owner looked up in FAA registry
- Shown on map with orange pin + aircraft info card

**Tier 4 — Verified (expert reviewed or lab-confirmed)**
- Reviewed by an atmospheric scientist, pilot, or environmental expert on the platform
- Or: accompanied by independent lab test results (soil/water/air)
- Shown on map with green/verified pin

### Why Structured Reporting Matters

The existing platforms fail because they mix observations with conclusions. This platform captures ONLY observations:
- "I saw X at Y time in Z location" = observation (legally defensible)
- "They're spraying us with chemicals" = conclusion (legally actionable, damages credibility)

The structured form makes it almost impossible to submit an accusation. The data speaks for itself.

---

## Module 3: Flight Correlation Engine

### How It Works

```
Citizen submits report with GPS + timestamp + compass heading
                    ↓
System queries ADSB.lol API for aircraft in that area at that time
                    ↓
Returns list of aircraft within reasonable radius (e.g., 25nm)
                    ↓
Cross-references tail numbers against FAA registration database
                    ↓
Checks if owner matches known weather modification operators
                    ↓
Checks NOAA database for active permits in that area
                    ↓
Generates "correlation card":
  - Aircraft: N12345, Beechcraft King Air 200
  - Owner: Weather Modification LLC, Fargo, ND
  - NOAA Permit: Yes/No/Unknown
  - State Permit: Yes/No/Unknown
  - Flight pattern: [map showing track]
```

### APIs Used

**ADSB.lol API (Primary — Free, Open Data)**
- Base URL: `https://api.adsb.lol/v2/`
- Endpoints:
  - `/point/{lat}/{lon}/{radius}` — aircraft near a point
  - `/hex/{hex}` — specific aircraft by ICAO hex
  - `/callsign/{callsign}` — by callsign
  - `/reg/{registration}` — by registration/tail number
- License: ODbL (can use freely, must attribute)
- Rate limits: Reasonable for a civic project
- GitHub: github.com/adsblol/api

**FAA Registration Database (Bulk Download)**
- Full database downloadable as CSV, updated daily
- URL: https://www.faa.gov/licenses_certificates/aircraft_certification/aircraft_registry/releasable_aircraft_download
- Load into Supabase as a table, refresh via daily cron job
- Fields: N-number, owner name, owner address, aircraft make/model, serial number, engine type

**Pre-Built Known Operators Table**
- Seed the database with known weather modification operators from the directory research
- Weather Modification LLC (Fargo, ND) — fleet of 35+ aircraft
- North American Weather Consultants (Sandy, UT)
- Rainmaker (El Segundo, CA) — drones
- Idaho Power Company — 3 aircraft, 57 ground generators
- DRI (Nevada)
- State operators (STWMA in Texas, NDCMP in North Dakota, etc.)
- When a citizen report correlates with one of these operators, flag it prominently

### Historical Flight Pattern Analysis

Using ADSB.lol or OpenSky Network historical data:
- Build flight path heatmaps for known weather modification aircraft
- Show patterns: "This aircraft has flown this corridor 47 times in the last 6 months"
- Compare flight patterns against permitted target areas
- Flag flights OUTSIDE permitted areas

---

## Module 4: Public Records Aggregator

### What Gets Aggregated

**Federal Level:**
- NOAA Weather Modification Project Reports (scrape quarterly)
- USASpending.gov contracts (API: `/api/v2/search/spending_by_transaction/` — search "weather modification", "cloud seeding", "atmospheric", "geoengineering")
- FOIA.gov annual reports by agency (API available)
- GAO reports on weather modification (manual, link library)
- Congressional bills and hearing records (Congress.gov)

**State Level (Priority States):**
- Texas TDLR active licenses (scrapable)
- North Dakota NDCMP annual reports (PDF download)
- Colorado CWCB permits (scrapable)
- Idaho cloud seeding program reports
- Utah Division of Water Resources reports
- Florida DEP citizen reports (FOIA-able)
- Louisiana DEQ citizen reports (400+ already filed)

**Scraped/Monitored:**
- State legislature bill tracking for geoengineering bills (~30 states)
- Court docket monitoring for relevant lawsuits
- Company press releases and SEC filings (for public companies)

### Database Schema (Simplified)

```sql
-- Public records
CREATE TABLE public_records (
  id UUID PRIMARY KEY,
  record_type TEXT, -- 'noaa_report', 'contract', 'permit', 'legislation', 'court_filing'
  title TEXT,
  source_url TEXT,
  source_agency TEXT,
  state TEXT,
  date_published DATE,
  date_effective DATE,
  operator_name TEXT,
  amount_dollars DECIMAL,
  target_area_geojson JSONB,
  materials_used TEXT[],
  raw_document_url TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Citizen reports
CREATE TABLE citizen_reports (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  report_type TEXT, -- 'aerial_activity', 'air_quality', 'test_result', 'other'
  latitude DECIMAL,
  longitude DECIMAL,
  compass_heading DECIMAL,
  observed_at TIMESTAMPTZ,
  device_info JSONB,
  weather_at_observation JSONB,
  aqi_at_observation JSONB,
  observation_type TEXT, -- dropdown value
  aircraft_count INT,
  duration_minutes INT,
  trail_behavior TEXT,
  notes TEXT,
  photo_urls TEXT[],
  video_urls TEXT[],
  photo_hash TEXT, -- SHA-256
  verification_level INT DEFAULT 1, -- 1-4
  corroborating_report_ids UUID[],
  matched_aircraft JSONB, -- from flight correlation
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aircraft registry (synced from FAA)
CREATE TABLE aircraft_registry (
  n_number TEXT PRIMARY KEY,
  owner_name TEXT,
  owner_address TEXT,
  aircraft_make TEXT,
  aircraft_model TEXT,
  serial_number TEXT,
  engine_type TEXT,
  registration_status TEXT,
  is_known_wx_mod BOOLEAN DEFAULT FALSE,
  operator_notes TEXT,
  last_synced TIMESTAMPTZ
);

-- Known operators
CREATE TABLE known_operators (
  id UUID PRIMARY KEY,
  name TEXT,
  headquarters TEXT,
  type TEXT, -- 'cloud_seeding', 'geoengineering', 'research'
  website TEXT,
  known_aircraft TEXT[], -- N-numbers
  active_states TEXT[],
  noaa_reports_filed INT,
  notes TEXT
);

-- Test results
CREATE TABLE test_results (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  test_type TEXT, -- 'soil', 'water', 'air'
  lab_name TEXT,
  lab_certified BOOLEAN,
  sample_date DATE,
  latitude DECIMAL,
  longitude DECIMAL,
  results JSONB, -- structured lab results
  document_url TEXT,
  document_hash TEXT,
  chain_of_custody_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Module 5: Legal Action Hub

### What It Contains

**Active Lawsuit Tracker**
- The GeoFight coalition status and updates
- ICAN FOIA actions and results
- Geoengineering Watch legal actions
- State-level enforcement actions
- Each entry: parties, status, next hearing date, how to support, donation link

**Legislation Tracker**
- All 30+ state bills with status (introduced, committee, passed, signed, vetoed)
- Federal bills (Clear Skies Act H.R. 4403, Weather Act Reauthorization H.R. 3816)
- Visual timeline of legislative progress
- Auto-updated from state legislature APIs where available (LegiScan API — free tier: 30 requests/day)

**FOIA Template Generator**
- Pre-built FOIA request templates for:
  - FAA flight plans for specific N-numbers/dates
  - NOAA weather modification reports for specific regions
  - State permit applications and approvals
  - EPA air quality data for specific monitoring stations
  - Military/DOD weather modification programs (expect Glomar response)
- User fills in: dates, locations, aircraft, agency
- Generates ready-to-send FOIA letter with correct agency addresses and legal citations

**Letter-to-Representative Generator**
- Templates for:
  - Supporting state geoengineering ban bills
  - Supporting federal Clear Skies Act
  - Requesting state investigation of unpermitted activity
  - Requesting county/municipal resolutions
- Auto-detects user's representatives from address (Google Civic Information API — free)

**Testing Guide**
- How to collect soil/water/air samples properly
- List of certified labs that accept mail-in samples
- What to test for and expected costs
- Chain of custody procedures
- How to submit results to the platform

---

## Module 6: People/Company Database

### Structure

A searchable, filterable directory built from the existing research (the "who is involved" document). Each entry links to:

**Companies:**
- Name, HQ, founding date
- Key personnel (CEO, board, etc.)
- Known aircraft fleet (N-numbers, linked to FAA registry)
- Active contracts (linked to public records)
- NOAA reports filed (linked to NOAA database)
- States where they operate
- Revenue/funding (where public)

**Individuals:**
- Name, title, institutional affiliation
- Role in weather modification/geoengineering
- Published research
- Congressional testimony
- Board positions
- Linked to companies and funding sources

**Funders:**
- Name, organization
- Total documented funding
- Recipient organizations/programs
- Public statements on geoengineering

**All entries sourced ONLY from:**
- Government databases (FAA, NOAA, USASpending, SEC)
- Published academic papers
- Congressional records
- Company websites and press releases
- News reporting from named publications
- Court filings

**Every entry must have a source citation.** No speculation, no accusations, no editorial. Just documented facts with links.

### Legal Protection for the Directory

- Frame as a "public records aggregator" not an "exposure database"
- Every fact links to its source
- Fair reporting privilege protects reporting on government records
- No commentary on motivations — just who, what, where, how much
- Section 230 protects the platform for user-generated additions
- Terms of service prohibit defamatory additions
- Content moderation for unsourced claims

---

## Module 7: Testing Coordination

### Coordinated Testing Campaigns

The platform facilitates organized testing events (like Flint):

1. **Campaign creation:** A user or local group creates a testing campaign for their area
2. **Sample kit coordination:** Links to recommended labs, provides sample collection instructions
3. **Standardized collection:** All participants follow the same protocol (timestamped, GPS-tagged, chain of custody documented)
4. **Results aggregation:** Lab results uploaded with documentation, displayed on the map
5. **Statistical analysis:** Automatic visualization of results — baseline vs. anomaly, patterns across geography

### Why This Matters

Individual tests are noise. Coordinated campaigns with consistent methodology are signal. The Flint model proved this — hundreds of citizen-collected samples with one lab analyzing them all created undeniable evidence.

### Lab Partners to Approach
- Tap Score (mytapwater.com) — mail-in water testing
- University extension services (most states offer soil testing for $15-40)
- Fight For Zero model (Florida nonprofit) — community testing coordination
- Certified environmental labs (varies by region)

---

## MVP: What Ships First

### Phase 1 — The Map + Reports (Week 1-3)

Build and ship:
1. Interactive map with Leaflet + OpenStreetMap
2. Citizen report submission (structured form + photo upload + GPS + hash)
3. Reports displayed on map as pins
4. Basic filtering (date, type, state)
5. Anonymous reporting with verified location
6. Known weather modification programs as a static data layer (manually entered from research)

**Tech:** Next.js + Supabase + Leaflet + Vercel
**Cost:** $0 (free tiers)
**One person can build this.**

### Phase 2 — Flight Correlation (Week 4-6)

Add:
1. ADSB.lol real-time flight layer on the map
2. FAA registry database loaded into Supabase (daily sync)
3. Known weather modification aircraft flagged/highlighted
4. Basic correlation: "An aircraft matching [N-number] was in this area at the time of your report"
5. Aircraft detail cards (owner, type, fleet history)

### Phase 3 — Public Records + Legal Hub (Week 7-10)

Add:
1. NOAA weather modification reports ingested (scraper)
2. USASpending.gov contract search results for weather modification
3. State legislation tracker (manual + LegiScan API where available)
4. FOIA template generator
5. Letter-to-representative generator
6. Active lawsuit directory

### Phase 4 — Directory + Testing (Week 11-14)

Add:
1. Searchable people/company/funder database
2. Testing coordination module
3. Lab result upload and display
4. Testing campaign creation
5. Statistical analysis of test results

### Phase 5 — Credibility + Scale (Ongoing)

1. Partner with a university (approach Virginia Tech — Flint precedent, environmental engineering dept)
2. Establish advisory board (atmospheric scientists, environmental lawyers, data scientists)
3. Apply for 501(c)(3) status or fiscal sponsorship
4. Open the API for researchers and journalists
5. Publish methodology for peer review
6. Build mobile app (React Native or Expo — share code with web app)
7. Recruit ADS-B feeder network (help citizens set up $100 receivers in underserved areas)

---

## How to Make It Credible (Not Dismissed)

### Design Principles

1. **Data-first, conclusions-follow.** The platform presents facts. Users draw their own conclusions. No editorial, no "chemtrails," no conspiracy language anywhere on the platform.

2. **Professional design.** Clean, modern UI (shadcn/ui). Not a 2005-era HTML site with red text and skull graphics. Think PurpleAir's map, not GeoengineeringWatch.org.

3. **Source everything.** Every data point links to its source. Government database, academic paper, news article, or timestamped citizen observation with hash.

4. **Structured observations, not accusations.** "Aircraft N12345, owned by Weather Modification LLC, was tracked over Boise, ID on 2026-03-18. No NOAA permit was found for this area/date." That's a fact. The reader connects the dots.

5. **Include null results.** Show days/areas where monitoring happened and nothing unusual was found. This proves systematic observation, not cherry-picking. It's scientifically essential and legally powerful.

6. **Separate verified from unverified.** Clear visual distinction between tiers. Never mix a single unverified citizen photo with a lab-tested soil sample.

7. **Invite falsification.** Publish methodology openly. If someone can prove the data wrong, that strengthens the platform. Science isn't afraid of challenge.

### Institutional Partnerships to Pursue

| Institution | Why | How to Approach |
|------------|-----|----------------|
| Virginia Tech (Marc Edwards' group) | Set the precedent with Flint citizen science | Pitch as next citizen science platform, water/soil testing methodology |
| Harvard Emmett Environmental Law Clinic | Leading group on citizen science + law | Methodology review, legal architecture |
| Environmental Defense Fund | Mainstream credibility, policy expertise | Advisory board seat |
| Electronic Frontier Foundation | Digital rights, Section 230 expertise | Legal review of platform architecture |
| Local university atmospheric science depts | Expert reviewers for citizen reports | Per-state recruitment for verification pipeline |

---

## How to Prevent Takedown / Suppression

### Technical Resilience

1. **Open source the entire codebase.** MIT or AGPL license. If the main instance goes down, anyone can spin up a copy. Host on GitHub/GitLab.

2. **Decentralized data backups.** Regular database exports to IPFS or Arweave (permanent, censorship-resistant storage). Even if Supabase or Vercel deplatforms, the data survives.

3. **Multiple domain names.** Register 3-4 domains pointing to the same app. If one is seized, redirect.

4. **CDN with DDoS protection.** Cloudflare free tier provides basic protection. Upgrade if attacked.

5. **Static export capability.** Next.js can export static HTML. Even without a server, the map and data can be served from any web host, GitHub Pages, or IPFS.

### Legal Resilience

1. **Incorporate as a 501(c)(3) nonprofit.** Tax-exempt status, institutional credibility, harder to dismiss as a "conspiracy site."

2. **Terms of service reviewed by attorney.** Specifically addressing defamation risk, user content responsibility, and platform liability.

3. **Content moderation.** Remove unsourced accusations, defamatory claims, and content that could create legal liability. This protects both the platform (Section 230) and users.

4. **Board of advisors with institutional affiliations.** A platform with a Virginia Tech professor and a Harvard Law clinic advisor is much harder to dismiss than one run by an anonymous person.

5. **FOIA everything.** Base the platform on government's own data. It's very hard to argue with the government's own records.

### Social Resilience

1. **No single point of failure.** Multiple admins, open source, decentralized backups. No single person whose silencing kills the project.

2. **Mainstream framing.** "Government accountability tool" not "chemtrails tracker." "Citizen science platform" not "conspiracy database." Language matters enormously.

3. **Media partnerships.** Proactively share data with journalists. A platform that ProPublica or the AP references is much harder to take down.

4. **International mirrors.** Host copies outside US jurisdiction. The data is public records — there's no legal basis to prevent hosting it.

---

## What Already Exists (Don't Reinvent)

| Tool | Use It For | Don't Rebuild |
|------|-----------|--------------|
| ADSB.lol | Flight data API | The ADS-B receiver network |
| FAA Registry | Aircraft ownership | The registration system |
| EPA AQS API | Official air quality data | The monitoring stations |
| PurpleAir | Citizen air quality sensors | The sensor hardware/network |
| USASpending API | Government contracts | The procurement database |
| FOIA.gov API | FOIA metadata | The FOIA process |
| LegiScan | State legislation tracking | Bill status monitoring |
| Supabase | Database + auth + storage | Backend infrastructure |
| Leaflet/Mapbox | Maps | The mapping engine |
| NWS API | Weather conditions | Weather data collection |

**The value add is INTEGRATION.** These tools exist in silos. Nobody has connected them. That's the product.

---

## Rough Timeline for a Solo Builder

| Week | Deliverable | Hours |
|------|------------|-------|
| 1 | Next.js scaffold + Supabase setup + auth + basic map | 15-20 |
| 2 | Citizen report form + photo upload + SHA-256 hashing | 15-20 |
| 3 | Reports on map + filtering + mobile responsive | 15-20 |
| 4 | ADSB.lol integration + live flights on map | 10-15 |
| 5 | FAA registry import + aircraft lookup | 10-15 |
| 6 | Flight correlation engine (match reports to aircraft) | 15-20 |
| 7 | NOAA data scraper + public records display | 10-15 |
| 8 | USASpending API integration | 10-15 |
| 9 | FOIA template generator + letter generator | 8-12 |
| 10 | Legal action hub + legislation tracker | 10-15 |
| 11 | People/company directory | 10-15 |
| 12 | Testing coordination module | 10-15 |
| 13 | Polish, security review, documentation | 10-15 |
| 14 | Launch | 5-10 |

**Total: ~150-220 hours over 14 weeks.** With AI coding tools (Cursor, Claude), this could compress significantly. Phases 1-3 are the MVP — shippable in 6 weeks.

---

## The One-Sentence Pitch

**"Like PurpleAir meets FlightRadar24 meets PACER — a citizen-powered, data-driven accountability platform that maps what's flying over America, who owns it, whether they're permitted, and what independent testing shows."**

---

## What Makes This Different From Everything Else

1. **It uses the government's own data against their inaction.** NOAA reports, FAA registry, EPA air quality, USASpending contracts — all public record, all undeniable.

2. **It's designed for courtrooms, not comment sections.** SHA-256 hashed evidence, chain of custody, structured observations, certified lab results. Built for litigation from day one.

3. **It's credible by design.** Professional UI, institutional partnerships, open methodology, no conspiracy language, source citations on every claim.

4. **It connects the dots no one else connects.** Citizen sees spray trail → app identifies aircraft → FAA shows owner → NOAA shows no permit → USASpending shows contract → legal hub shows how to act.

5. **It scales without central funding.** Open source, free tier infrastructure, citizen-contributed data, volunteer verification. Like Wikipedia for weather modification accountability.

---

## Sources & APIs Referenced

### Free APIs (No Cost)
- ADSB.lol: https://api.adsb.lol/docs — Open flight data
- EPA AQS: https://aqs.epa.gov/aqsweb/documents/data_api.html — Air quality (email signup only)
- AirNow: https://docs.airnowapi.org/ — Real-time AQI
- NWS: https://api.weather.gov/ — Weather conditions
- FAA Registry: https://www.faa.gov/licenses_certificates/aircraft_certification/aircraft_registry/releasable_aircraft_download — Bulk aircraft data
- USASpending: https://api.usaspending.gov/ — Federal contracts
- FOIA.gov: https://www.foia.gov/developer/ — FOIA metadata
- Google Civic Information API: Free — Representative lookup
- Sensor.Community: https://sensor.community/ — Open air quality data

### Low-Cost APIs
- ADS-B Exchange via RapidAPI: ~$10-30/month for enthusiast tier
- PurpleAir: API key required, free tier available
- LegiScan: 30 requests/day free tier
- OpenSky Network: 4,000 credits/day free (8,000 if you feed data)

### Free Infrastructure
- Supabase: 500MB DB, 50k auth users, 1GB storage, 2M edge function invocations
- Vercel: 100GB bandwidth, serverless functions, analytics
- Cloudflare: CDN, DDoS protection, DNS
- GitHub/GitLab: Code hosting, CI/CD
