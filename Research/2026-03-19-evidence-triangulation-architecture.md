# Evidence Triangulation Architecture
**Date:** 2026-03-19
**Status:** Research / Pre-implementation

## The Problem

Citizens see things in the sky. They take photos. Those photos sit on their phones. No one connects the dots between what Person A saw in Fayetteville and what Person B saw in Fort Smith — even if they were looking at the same aircraft.

## The Solution: Four-Layer Triangulation

### Layer 1: Citizen Report (The Photo)

What the photo contains automatically:
- **GPS coordinates** — embedded by phone camera (EXIF)
- **Timestamp** — exact time to the second (EXIF)
- **Device ID** — camera make/model (EXIF)
- **SHA-256 hash** — generated at upload, proves no tampering

What the citizen adds:
- Observation type (persistent trail, spray pattern, grid pattern, etc.)
- Trail behavior (persisted, spread into haze, fell to ground, etc.)
- Duration of observation
- Aircraft count
- Notes

**Gaps to fill (not yet captured):**
- Compass bearing / direction observer was looking
- Estimated altitude (low / medium / high)
- Tail number if visible
- Multiple photos per report
- Observer elevation context

### Layer 2: ADS-B Flight Snapshot (The Aircraft)

At the exact moment of the report, capture ALL aircraft within radius:
- ICAO hex code, tail number, callsign
- Position (lat/lon), altitude, speed, heading
- Aircraft type and description
- Distance from observer
- Whether the aircraft is a known weather modification operator

**Critical gap:** Currently we only do LIVE correlation. If the plane has landed by the time we check, we miss it. **Need: Save ADS-B snapshots at report submission time.** This is the single most important technical improvement.

### Layer 3: FAA Registry (The Owner)

Tail number → FAA registered owner:
- Owner name and address
- Aircraft registration details
- Whether owner is a known weather modification operator
- Operator's contracts, funding sources, history

This data is **federal public record** — inherently admissible in court.

### Layer 4: Cross-Report Correlation (The Pattern)

When multiple citizens report independently:
- Same time window → same aircraft appears in multiple ADS-B snapshots
- Different GPS locations → reconstructed flight path from citizen evidence
- Repeated patterns → same aircraft, same route, same operator, same time of day

This is the most powerful layer. Independent witnesses who don't know each other, corroborating each other's observations through data.

## What Makes It Court-Admissible

| Legal Standard | How We Satisfy It |
|---|---|
| **FRE 901 — Authentication** | SHA-256 hash proves file integrity from upload to presentation |
| **Chain of custody** | Timestamped upload, original EXIF preserved, hash logged at entry point |
| **Metadata integrity** | EXIF data embedded by camera hardware, not user-editable |
| **Independent corroboration** | ADS-B data from independent receivers confirms aircraft position |
| **Public records** | FAA registration data is federal public record |
| **Multiple witnesses** | Cross-report correlation from independent observers |
| **ISO/IEC 27037** | Digital evidence collected without alteration, documented chain of custody |

## Matching Philosophy: Candidate Pools, Not Accusations

**Core principle: Undeniable through accumulation, not accusation from a single report.**

Sky Ledger NEVER pins a report to a specific aircraft unless confidence is absolute (gold-tier, real-time, single aircraft in range at matching altitude). Instead, every report generates a **candidate pool** — the set of aircraft that were near the observer at the time of the report.

### Why Candidate Pools

- **Protects against false accusations.** No single report ever names anyone. Only the accumulation of evidence across many independent reports builds the case.
- **Protects innocent aircraft.** A Delta flight that happened to pass overhead once shows up in one pool and never again. Its cumulative score stays at zero.
- **Protects against gaming.** One person filing 50 reports against an aircraft shows as 50 reports from 1 citizen. The system weights independent reporters — not volume from a single source.
- **Protects Sky Ledger legally.** We never say "this aircraft sprayed chemicals." We say "this aircraft appeared as a candidate in X citizen reports." The data speaks for itself.

### How Candidate Pools Work

**Per-Report:** Each report generates a pool of nearby aircraft with per-report scores:

| Factor | Score Boost | Why |
|---|---|---|
| Closest to observer | +0.10 | Proximity is the strongest signal |
| Cloud-seeding altitude (6-15K ft) | +0.15 | Commercial jets fly at 30-40K |
| Known weather mod operator | +0.20 | Already flagged in our database |
| Compass bearing match | +0.15 | Observer was looking in that direction |
| Only candidate in altitude band | +0.20 | No other explanation at that altitude |

**Across Reports (Cumulative Score):** Each aircraft accumulates a score across ALL reports where it appeared as a candidate.

Weighting factors:
- **Different citizens** count more than same citizen (independence)
- **Different locations** count more than same spot (geographic diversity)
- **Gold-tier matches** (real-time confirmed) weight much more than pool appearances
- **Recent reports** weight slightly more, but old reports never drop to zero
- **Cumulative records persist forever** — even after raw ADS-B data ages out past 90 days, the candidate pool associations remain in the database and keep compounding

### Confidence Tiers for Aircraft

| Level | Criteria | Display |
|---|---|---|
| **Candidate** | 1-5 pool appearances | Listed in individual report pools only |
| **Recurring** | 6-19 pool appearances | Appears on aircraft profile page |
| **Pattern Detected** | 20+ pools OR 3+ gold matches | Highlighted in pattern dashboard |
| **Confirmed Operator** | Multiple gold matches from multiple independent citizens | Full ledger page with all evidence |

The system GRADUATES aircraft through levels based on accumulated evidence. No human judgment. No editorial. Just data.

### The Accumulation Example

```
Report #1 (March 3): Citizen A, Fayetteville
  Candidate pool: N12345, N67890, N11111
  → N12345 score: 0.65 (closest, wx mod operator, cloud-seeding alt)
  → N67890 score: 0.15 (Delta, 34K ft, passing through)
  → N11111 score: 0.20 (private, 29K ft)

Report #7 (March 8): Citizen B, Fort Smith (different person, different city)
  Candidate pool: N12345, N22222, N33333
  → N12345 score: 0.70 (again closest, same altitude band)

Report #15 (March 12): Citizen C, Little Rock
  Candidate pool: N12345, N44444
  → N12345 score: 0.80 (1 of 2 candidates, known operator)

...

Report #47 (March 19): Citizen Q, Jonesboro (gold-tier — real-time match)
  → N12345 CONFIRMED airborne at observation time
  → Real-time ADS-B snapshot captured
  → Gold-tier match — full chain: photo → aircraft → owner

CUMULATIVE PROFILE — Aircraft N12345 (Weather Modification Inc):
  Pool appearances: 47 reports
  Gold-tier confirmed: 8 reports
  Independent reporters: 23 different citizens
  Geographic spread: 12 locations across Arkansas
  Date range: March 3 — March 19, 2026
  Common time: Tues/Thurs, 1-4pm
  Common altitude: 10,000-14,000ft
  Confidence level: CONFIRMED OPERATOR
```

Nobody accused that aircraft. Twenty-three independent citizens in twelve different cities reported it. The data accused it. That's the ledger.

### Database Structure (Future Implementation)

```
candidate_pools table:
  report_id, aircraft_hex, tail_number, owner_name,
  distance_nm, altitude_ft, per_report_score, is_gold_match

aircraft_cumulative view:
  aircraft_hex, tail_number, owner_name,
  total_pool_appearances, total_gold_matches,
  unique_reporters, unique_locations,
  date_first_seen, date_last_seen,
  cumulative_score, confidence_tier
```

## Report Form — Proposed Fields

### Keep (already built):
- Photo upload with EXIF extraction
- SHA-256 evidence hash
- GPS coordinates (auto from EXIF or manual)
- Date/time (auto from EXIF or manual)
- Observation type (dropdown)
- Trail behavior (dropdown)
- Duration in minutes
- Aircraft count
- Notes (500 char max)

### Add:
- **Compass bearing** — "Which direction were you looking?" (N/NE/E/SE/S/SW/W/NW or degree input)
- **Estimated altitude** — Low (below clouds), Medium (cloud level), High (well above clouds)
- **Tail number** — "Could you read a tail number? (optional)"
- **Multiple photos** — Allow 2-5 photos per report
- **Auto weather data** — Fetch temperature, humidity, wind, visibility from weather API using report location + time
- **ADS-B snapshot** — Automatically save all aircraft positions within 25nm at submission time

### Future:
- Auto-suggest matching aircraft based on observer location + bearing + altitude estimate
- Let reporter confirm "I was looking at THIS aircraft" from a list
- Generate a correlation confidence score
- Link report to specific aircraft's ledger entry

## Why the Ledger Matters — Even Without Perfect Matching

The ledger serves five different end goals. Aircraft matching is only one of them:

| End Goal | What It Needs | Match Required? |
|---|---|---|
| **Accountability (WHO)** | Real-time or historical ADS-B match → tail number → owner | Yes |
| **Legal evidence (THAT IT'S HAPPENING)** | Volume of timestamped, geolocated, hashed photos | No |
| **Public awareness (LOOK AT THIS)** | Map filled with citizen report pins | No |
| **Legislative pressure (YOUR CONSTITUENTS CARE)** | Reports from specific legislative districts | No |
| **Pattern discovery (WHEN AND WHERE)** | Time/location/behavior clustering analysis | No — patterns reveal operators indirectly |

Only one of five goals requires an aircraft match. The other four are served by volume, geographic clustering, and temporal patterns. Even if only 10% of reports achieve a real-time match, the other 90% are still building the pattern database, filling the map, and giving legislators constituent evidence.

## Three Tiers of Evidence Quality

| Tier | Scenario | Strength | How to Maximize |
|---|---|---|---|
| **Gold** | Real-time submission while aircraft is airborne | Full chain: photo → ADS-B → FAA → owner | Push alerts when known operators are nearby |
| **Silver** | Delayed submission, but EXIF has good timestamp + GPS | Retroactively matchable via historical ADS-B | Integrate historical flight data source |
| **Bronze** | No match possible | Documents the phenomenon; feeds pattern detection | Still valuable for volume, legislative pressure, community building |

## The Flywheel

More users → more reports → more real-time catches → more patterns identified → more operators exposed → more media attention → more users. The system gets stronger over time. Early reports are mostly bronze. As adoption grows, the gold rate climbs.

## The Active Tracking Flip (Game-Changer)

Instead of hoping people report in real-time:
- User registers their location
- When a known weather mod operator enters their radius, push notification fires
- "N12345 (WeatherMod Inc) is near your location at 12,000ft. See anything?"
- User looks up, photographs, submits — while the aircraft is live
- Guaranteed gold-tier match

This flips passive reporting into active surveillance. Dramatically increases match rate.

## Implementation Priority

1. **Save ADS-B snapshots at report time** — most critical gap, turns real-time submissions into guaranteed matches
2. **Historical ADS-B integration** — unlocks silver-tier matching for all delayed reports
3. **Push alerts for known operators** — flips passive to active, increases gold-tier rate
4. **Add compass bearing field** — enables directional matching to specific aircraft
5. **Pattern detection engine** — time/location/behavior clustering across reports
6. **Aircraft ledger view** — per-aircraft history page showing all reports and patterns
7. **Auto-fetch weather conditions** — strengthens evidence context
8. **Multiple photo upload** — more evidence per incident
