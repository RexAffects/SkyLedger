# Aircraft Tracking Tools & Data Sources for Weather Modification Transparency

**Date:** 2026-03-18
**Purpose:** Comprehensive inventory of publicly available tools, databases, APIs, and legal mechanisms for tracking aircraft involved in weather modification or atmospheric spraying operations.

---

## 1. ADS-B Tracking Platforms — What's Publicly Available

### What is ADS-B?
Automatic Dependent Surveillance-Broadcast (ADS-B) is a surveillance technology where aircraft broadcast their GPS position, altitude, speed, and identification. Citizens can receive these signals with inexpensive equipment (~$25 USB dongle + antenna) and contribute data to tracking networks.

### Tier 1: Unfiltered / Community-Driven (Best for This Purpose)

#### ADS-B Exchange
- **URL:** https://globe.adsbexchange.com/
- **Key advantage:** World's largest source of UNFILTERED flight data. Does NOT honor FAA's LADD (Limiting Aircraft Data Displayed) blocking requests. Shows military, government, and commercially-blocked aircraft that other platforms hide.
- **Data:** Real-time position, altitude, speed, heading, squawk code, aircraft type, registration
- **API:** Available via RapidAPI (low-cost for personal/enthusiast use). Enterprise API for commercial use.
- **Update rate:** Up to 2Hz (twice per second)
- **Format:** JSON
- **Cost:** Free to view on globe. API via RapidAPI for personal projects. Commercial use requires written authorization.
- **Historical data:** Available through API

#### ADSB.lol
- **URL:** https://adsb.lol/
- **Key advantage:** Completely open-source AND open-data (ODbL licensed). Free API. Free historical data.
- **API docs:** https://api.adsb.lol/docs
- **GitHub:** https://github.com/adsblol/api
- **Best for:** Building custom tracking tools — no licensing restrictions on the data

#### ADSB.fi
- **URL:** https://globe.adsb.fi/
- **Key advantage:** Community-driven, unfiltered, open access. Hundreds of feeders worldwide.
- **Unfiltered:** Yes — does not honor blocking requests

#### Airplanes.Live
- **URL:** https://airplanes.live
- **Key advantage:** Unfiltered ADS-B AND MLAT data. Explicitly states they will "never filter or obfuscate MLAT results."
- **MLAT note:** Multilateration can track aircraft that don't broadcast ADS-B by triangulating signals from multiple receivers — important for older aircraft or those with transponders in certain modes.

#### OpenSky Network
- **URL:** https://opensky-network.org/
- **Key advantage:** Non-profit, research-focused. Massive historical database (23+ trillion messages archived). Free for academic/government research.
- **API:** REST API with Python, R, and MATLAB libraries
- **Credits:** 4,000 API credits/day (free users), 8,000/day (active feeders)
- **Historical data:** Full archive accessible via Trino SQL shell
- **Best for:** Retroactive analysis of flight patterns over time

### Tier 2: Commercial / Filtered (Useful but Limited)

#### FlightRadar24
- **URL:** https://www.flightradar24.com/
- **Honors blocking:** Yes — complies with LADD/ASDI blocking requests
- **Free tier:** Real-time tracking with limited features
- **Paid tiers:** More history, more data fields, alerts
- **Limitation:** Filters out aircraft whose owners requested privacy

#### FlightAware
- **URL:** https://www.flightaware.com/
- **Honors blocking:** Yes
- **Good for:** Commercial flight tracking, registration lookups
- **API:** AeroAPI (paid) for programmatic access
- **Limitation:** Same LADD filtering as FR24

### Tier 3: Additional Community Platforms
- **ADSBHub** (https://www.adsbhub.org/) — Free ADS-B data exchange
- **TheAirTraffic** — Community-driven, unfiltered
- **adsb.cool** — Curated list of ADS-B resources and tools (https://github.com/rickstaa/awesome-adsb)

### How to Become a Feeder
Anyone can contribute ADS-B data with:
- A Raspberry Pi (~$35-75)
- An RTL-SDR USB dongle (~$25)
- A 1090MHz antenna (~$15-30)
- Free software (dump1090, readsb)
- **Total cost:** ~$75-130

The balena-ads-b project (https://github.com/ketilmo/balena-ads-b) makes it easy to feed data to multiple networks simultaneously.

---

## 2. FAA Aircraft Registration — Identifying Ownership by Tail Number

### FAA N-Number Registry (Primary Source)
- **URL:** https://registry.faa.gov/aircraftinquiry/search/nnumberinquiry
- **What you get:** Registered owner name and address, aircraft make/model/year, serial number, engine type, registration status, airworthiness certificate info
- **Updated:** Every federal working day at midnight
- **Cost:** Free
- **Bulk download:** The ENTIRE FAA registration database is downloadable as comma-delimited text files, refreshed daily at 11:30 PM Central: https://www.faa.gov/licenses_certificates/aircraft_certification/aircraft_registry/releasable_aircraft_download

### Third-Party Registration Tools
- **AviationDB** (https://www.aviationdb.com/) — All current, deregistered, and reserved US aircraft. Shows historical ownership changes.
- **FlightAware Registration** (https://www.flightaware.com/resources/registration/) — Clean interface for N-number lookups
- **AeroBase Group** (https://aerobasegroup.com/tail-number-lookup/) — Another N-number lookup tool

### What to Search For
- Search the FAA registry by owner name: "Weather Modification" returns aircraft owned by Weather Modification, Inc. (now Weather Modification LLC), based at Hector International Airport, Fargo, ND
- Download the full database and search for known weather modification companies
- Cross-reference tail numbers spotted on ADS-B trackers with the registration database

### Known Weather Modification Aircraft Operators
- **Weather Modification, Inc. / Weather Modification LLC** — Fargo, ND. Fleet of 35+ twin-engine aircraft (primarily Beechcraft King Air 90, 200, 300 series). Operating since 1961.
- **Fargo Jet Center** — Holds Supplemental Type Certificates for King Air cloud seeding modifications
- **Ice Crystal Engineering** — Cloud seeding operations
- State-contracted operators (varies by state and year)

---

## 3. FAA Flight Plan Data & FOIA

### Publicly Available Flight Data

#### FAA Data Portal
- **URL:** https://www.faa.gov/data
- **Contains:** Various aviation datasets, some via APIs

#### ASDI (Aircraft Situation Display to Industry)
- **URL:** https://www.fly.faa.gov/ASDI/asdi.html
- **Data:** Location, altitude, airspeed, destination, ETA, tail number for IFR aircraft
- **Limitation:** Filtered — excludes military, sensitive ops, and aircraft that are "ASDI-blocked" by owner request
- **Note:** The unfiltered ADS-B platforms above are better for this purpose

#### SWIM (System Wide Information Management)
- **URL:** https://www.faa.gov/air_traffic/technology/swim
- **Purpose:** Single point of access for near-real-time aeronautical, flight, weather, and surveillance data
- **Access:** Requires application/agreement with FAA

### FOIA Requests for Flight Plans

#### How to File
- **Online:** https://www.faa.gov/foia/foia_request
- **What to request:** Flight plans filed by specific aircraft (by N-number), flights departing/arriving at specific airports, air traffic records for specific dates/regions
- **Response time:** FAA must respond within 20 working days (can extend 10 additional days in "unusual circumstances")
- **Fees:** Vary by category — commercial requesters pay search + review + duplication. Media/educational pay only duplication. Others pay search + duplication. Paper copies $0.10/page. CD-ROM $10/disc.

#### What You Can Get Through FOIA
- Filed flight plans (IFR and VFR when filed)
- Air traffic communications recordings
- Aircraft records and certification documents
- Radar/surveillance data for specific flights
- **Key point:** Weather modification flights operating under IFR MUST file flight plans. These are federal records subject to FOIA.

#### Aircraft Records (Non-FOIA)
- **URL:** https://aircraft.faa.gov/e.gov/nd/
- Paper copies or electronic copies of aircraft records can be ordered directly

---

## 4. Weather Modification Flight Plan Requirements & Regulations

### Federal Requirements

#### Weather Modification Reporting Act of 1972 (Public Law 92-205)
- **All** non-federal weather modification activities must be reported to the Secretary of Commerce (via NOAA)
- Reports must be filed at least **10 days before** starting activities

#### 15 CFR Part 908 — Maintaining Records and Submitting Reports
- **Who must report:** Any person (individual, corporation, state/local government) engaged in weather modification activities in the US
- **Initial Report (NOAA Form 17-4):** Must be filed before operations begin. Requires: purpose, methods, materials used, equipment, target area maps, dates of operation
- **Interim/Final Reports (NOAA Form 17-4A):** Filed during and after operations. Requires: actual materials dispensed, flight tracks, dates/times of operations, results
- **Public access:** All reports "shall be made available to the public to the fullest practicable extent"
- **Penalties:** Fines up to $10,000 authorized (though GAO found NOAA has NEVER imposed penalties)
- **Email for submissions:** weather.modification@noaa.gov

#### Exemptions
- Activities of "purely local nature" (lightning rods, frost prevention)
- Religious ceremonies intended to modify weather (yes, really)
- Federal government operations (military, etc.)

### FAA Flight Plan Requirements
- Weather modification aircraft operating under Instrument Flight Rules (IFR) MUST file flight plans
- VFR operations technically don't require flight plans, but cloud seeding often involves operations in/near clouds requiring instrument capability
- No special "weather modification" flight plan category exists — they file standard flight plans

### GAO Findings (February 2026 — GAO-26-108013)
The GAO report "Weather Modification: NOAA Should Strengthen Oversight to Ensure Reliable Information" found massive gaps:
- **78% of initial reports had one or more errors**
- **32% lacked required maps** showing target areas
- **4 of 10 states** had documented weather modification activities absent from federal records
- Operators submitted reports that never appeared in NOAA's database
- NOAA has **no written guidance** for reviewing reports
- Forms designed in 1974 are inadequate for modern activities including solar geoengineering
- Only **1,084 reports** in the database going back to 1999 (records before that were lost/never digitized)
- NOAA **never imposed penalties** despite being authorized to fine up to $10,000

---

## 5. State-Level Weather Modification Reporting & Permits

### States with Weather Modification Laws (23 states + US Virgin Islands)

States with documented regulatory frameworks:

| State | Key Requirements | Public Records Access |
|-------|-----------------|----------------------|
| **Texas** | License AND permit required from TDLR. Annual reporting. Advisory board oversight. | Active license search: https://www.tdlr.texas.gov/LicenseSearch/ — Map of rain enhancement projects published. Public records center available. |
| **Colorado** | Permit required from Colorado Water Conservation Board (CWCB). Grant program funding. | CWCB publishes program information: https://cwcb.colorado.gov/focus-areas/supply/weather-modification-program |
| **North Dakota** | Licensing required. North Dakota Cloud Modification Project (state-run). Annual reports published. | https://www.swc.nd.gov/arb/ndcmp/ — Detailed final reports published |
| **Idaho** | Cloud Seeding Program through Idaho Water Resource Board. Weather Modification Districts (Title 22, Ch. 43). | State publishes program reports |
| **California** | Multiple water code sections. Historical operation reports (1952-2011). | Historical data available |
| **Nevada** | Chapter 544 regulations | State records |
| **Montana** | Senate Bill 72 (1993) — Requires environmental impact statement, public meeting, $10M proof of financial responsibility | Public meeting requirement = local notice |
| **Washington** | Title 43, Chapter 43.37. Exempts small-scale research from licensing. | State records |
| **Pennsylvania** | Title 3, Chapter 16 | State records |
| **Delaware** | Chapter 68 legislation | State records |

### States That Have BANNED Weather Modification
- **Tennessee** (2024) — Banned intentional modification of sunlight, weather, or temperature
- **Florida** (June 2025) — Prohibited certain acts intended to affect weather

### Best States for Public Records
1. **Texas** — Strongest public-facing system. Searchable license database, published maps of active projects, advisory board, complaint procedures.
2. **North Dakota** — Detailed annual reports on the Cloud Modification Project with aircraft info, materials used, flight hours.
3. **Colorado** — CWCB publishes permit information and program details.
4. **Montana** — Requires public meetings before permits are issued.

---

## 6. NOAA & Government Weather Modification Reports

### NOAA Weather Modification Project Reports Database
- **URL:** https://library.noaa.gov/weather-climate/weather-modification-project-reports
- **What's there:** Reports filed under the Weather Modification Reporting Act
- **Searchable by:** Date range, purpose of activity, project number/designator (includes state code + year)
- **Updated:** Quarterly
- **Format:** Downloadable files
- **Naming convention:** Year + state abbreviation + first four letters of project name + report number (e.g., "2021MDROCK-1")
- **Third-party mirror:** https://www.weathermodreports.com/

### GAO Reports
- **GAO-26-108013 (Feb 2026):** "Weather Modification: NOAA Should Strengthen Oversight to Ensure Reliable Information" — The most current and damning assessment. Free at https://www.gao.gov/products/gao-26-108013
- Historical GAO reports on weather modification also available

### Congressional Oversight
- House Oversight Subcommittee has held hearings demanding transparency on government weather and climate engineering
- The Weather Modification Regulation Act (S.3028, 93rd Congress) established the federal reporting framework

### EPA Resources
- **Geoengineering FAQ:** https://www.epa.gov/geoengineering/frequent-questions
- EPA tracks geoengineering but does not directly regulate weather modification

---

## 7. Existing Citizen Tracking Tools & Projects

### Aircraft Spotting Communities
- **Planespotters.net** — 1 million photos, 50,000 aircraft database. Community uploads with aircraft identification.
- **JetPhotos** — 6+ million screened aviation photos. Spotting groups by region.
- **PlaneSpot App** — Mobile app for identifying aircraft, logging sightings, community leaderboards
- **PlaneLogger** — Searchable registration database + personal sighting logs with image uploads
- **SpottingLog.com** — Plane spotting database for recording observations

### DIY ADS-B Receiver Networks
- Anyone can set up a receiver and contribute data (see Section 1)
- Multiple feeder images exist to simplify setup (https://adsb.im/home)
- **adsb.cool** curated resource list: https://adsb.cool/

### Climate/Geoengineering Tracking
- **ClimateViewer** (https://climateviewer.com/) — Maps and tracks weather modification activities, maintains database of weather modification laws and patents
- **Stop Chemtrails** (https://stopchemtrails.com/) — Citizen advocacy site (note: mixes documented weather modification with unverified claims)

### What's Missing
No single tool currently combines:
1. Real-time ADS-B tracking filtered for weather modification aircraft
2. Cross-referenced FAA registration data
3. NOAA/state permit databases
4. Citizen observation reports with GPS/timestamps

**This is the gap a purpose-built tool could fill.**

---

## 8. What Could Realistically Be Crowd-Sourced

### High-Value Citizen Contributions

#### Photos with Metadata
- **What:** Photos of aircraft with visible trails, unusual patterns, low-altitude operations
- **Critical data:** GPS coordinates (embedded in smartphone EXIF data), timestamp, compass heading
- **Tools:** Any smartphone camera with location services enabled
- **Validation:** GPS + timestamp makes observations verifiable and cross-referenceable with ADS-B data

#### Visual Observations
- Aircraft tail number (if visible — binoculars help, spotting scopes better)
- Aircraft type/model identification
- Direction of flight
- Type of trail (persistent, spreading, dissipating quickly)
- Altitude estimate
- Duration of observation
- Weather conditions at time of observation

#### ADS-B Receiver Data
- Citizens operating their own ADS-B receivers provide the raw data that powers all the unfiltered tracking platforms
- More receivers = better coverage, especially in rural areas where weather modification often occurs
- Receiver data includes: aircraft hex code, call sign, position, altitude, speed, heading, vertical rate

#### Ground-Level Environmental Observations
- Air quality readings (particulate matter sensors — ~$30-200 for consumer devices)
- Soil/water sample collection (needs lab analysis)
- Weather condition changes correlated with observed aircraft activity

### Cross-Referencing Workflow (What a Citizen Could Do Today)
1. **Observe** aircraft activity — note time, location, direction, characteristics
2. **Photograph** with smartphone (GPS + timestamp auto-embedded)
3. **Check ADS-B Exchange** (globe.adsbexchange.com) — find the aircraft in real-time, note tail number/hex code
4. **Look up tail number** on FAA Registry (registry.faa.gov) — identify owner
5. **Check NOAA database** — is this operator reporting as required?
6. **Check state permits** — does this operator have required state permits?
7. **Document and report** — file everything with timestamps

### Data Quality Standards for Credibility
For crowd-sourced data to be taken seriously (by media, regulators, courts):
- GPS-stamped photos/videos (tamper-evident metadata)
- Consistent observation protocols (standardized forms)
- Multiple independent observers corroborating same events
- Cross-referencing with ADS-B data (proves aircraft identity)
- Chain of custody for any physical samples
- No speculation in reports — just documented facts

---

## Key Takeaways

1. **ADS-B Exchange, ADSB.lol, ADSB.fi, and Airplanes.Live** are the best tracking platforms because they're unfiltered — they show aircraft that FlightRadar24 and FlightAware hide.

2. **The FAA registration database is fully public and downloadable** — you can identify any US aircraft owner by tail number, for free, updated daily.

3. **Federal law requires weather modification operators to report to NOAA**, but the GAO found the system is badly broken — 78% of reports have errors, many activities go unreported, and NOAA has never fined anyone.

4. **23 states have weather modification laws** with varying permit/reporting requirements. Texas has the most transparent public-facing system.

5. **No single tool exists** that combines ADS-B tracking + FAA registration + NOAA/state permit data + citizen observations. This is the gap.

6. **Citizens can legally and practically contribute** GPS-stamped photos, ADS-B receiver data, visual observations, and FOIA requests. The technology is cheap and accessible.

7. **FOIA is a powerful tool** — flight plans filed with the FAA are federal records. Weather modification reports filed with NOAA are explicitly required to be public.

---

## Sources

- [ADS-B Exchange](https://www.adsbexchange.com/)
- [ADS-B Exchange Globe Tracker](https://globe.adsbexchange.com/)
- [ADSB.lol](https://adsb.lol/)
- [ADSB.fi](https://globe.adsb.fi/)
- [Airplanes.Live](https://airplanes.live)
- [OpenSky Network](https://opensky-network.org/)
- [FlightAware ADS-B](https://www.flightaware.com/adsb/)
- [FAA Aircraft Registration Inquiry](https://registry.faa.gov/aircraftinquiry/search/nnumberinquiry)
- [FAA Registration Database Download](https://www.faa.gov/licenses_certificates/aircraft_certification/aircraft_registry/releasable_aircraft_download)
- [FAA FOIA Request](https://www.faa.gov/foia/foia_request)
- [FAA SWIM](https://www.faa.gov/air_traffic/technology/swim)
- [FAA Data Portal](https://www.faa.gov/data)
- [15 CFR Part 908 — Weather Modification Reporting](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-IX/subchapter-A/part-908)
- [NOAA Weather Modification Project Reports](https://library.noaa.gov/weather-climate/weather-modification-project-reports)
- [GAO-26-108013 — Weather Modification: NOAA Should Strengthen Oversight](https://www.gao.gov/products/gao-26-108013)
- [Grist — "The US barely bothers to track geoengineering"](https://grist.org/regulation/geoengineering-noaa-cloud-seeding-gao-oversight/)
- [Texas TDLR Weather Modification](https://www.tdlr.texas.gov/weather/)
- [Texas TDLR Active License Search](https://www.tdlr.texas.gov/LicenseSearch/)
- [Colorado CWCB Weather Modification Program](https://cwcb.colorado.gov/focus-areas/supply/weather-modification-program)
- [North Dakota Cloud Modification Project](https://www.swc.nd.gov/arb/ndcmp/)
- [North American Weather Modification Council — Policy & Regulations](https://nawmc.org/policy-and-regulations/)
- [EPA Geoengineering FAQ](https://www.epa.gov/geoengineering/frequent-questions)
- [Weather Modification, Inc.](http://www.weathermodification.com/)
- [ClimateViewer Weather Modification Laws](https://climateviewer.com/2016/05/14/weather-modification-laws-in-the-united-states-of-america/)
- [AviationDB](https://www.aviationdb.com/)
- [Planespotters.net](https://www.planespotters.net/)
- [Awesome ADS-B Resource List](https://github.com/rickstaa/awesome-adsb)
- [Balena ADS-B Multi-Feeder](https://github.com/ketilmo/balena-ads-b)
- [ADSB Feeder Image](https://adsb.im/home)
