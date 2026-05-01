# SkyLedger — Project Status

Citizen-powered transparency platform for weather modification accountability. Update this doc as the platform evolves.

## Tech Stack
Next.js 16 + Tailwind + shadcn/ui + TypeScript + Supabase. Free APIs: ADSB.lol (flight tracking), ADSBDB (route/airport lookup), FAA registry (ownership), HexDB.io (route fallback).

## Build State (as of 2026-03-20)

### Phase 1 + 2 + Partial Phase 3 — Complete
- Landing page, about/methodology page, get-involved page
- Interactive Leaflet map with citizen report pins
- Citizen report submission with photo upload, EXIF extraction, SHA-256 evidence hashing
- Live flight tracker (ADSB.lol) with 10-sec auto-refresh, suspicion scoring, community flagging system
- Click any aircraft → full detail panel (owner, departure/arrival airports, aircraft photo, altitude, speed)
- Color-coded altitude bands, known WX mod operator flagging, Watch/Interest/Flagged badges
- Community aircraft flagging with rate limiting, anomaly detection, threat badges in flight list
- "Flagged only" filter toggle
- FAA tail number lookup
- 9 operator profiles (`/learn/operators`) with founders, funding rounds, investors, connections, red flags
- Legislation tracker (`/learn/legislation`) — 3 enacted bans, 10+ pending, failed bills, federal action
- Facts page (`/learn/facts`) — 7 sections, 20+ cited facts, downloadable
- State bans, pending bills, Clear Skies Act, Congressional hearing pages
- **Follow the Money page (`/learn/follow-the-money`)** — 8 investor profiles (Sacca/Lowercarbon, AWZ Ventures, Lauder, Thiel, Cohler, Exor/Agnelli, SolarEdge, Gates/FICER), 15 cross-connections, funding acceleration timeline, pipeline visualization, 12 red flags. Data in `src/lib/data/network.ts`.
- Learn index page (`/learn`) with all topic cards organized
- All builds clean, runs on localhost:3000

### Phase 3 — Remaining Work
- **Enhanced Stardust operator profile** — add deep-dive content from research (governance failures, lobbying, April 2026 experiments, CIEL condemnation, Non-Use Agreement, full timeline). Research at `research/geoengineering-investors/2026-03-19-stardust-solutions-deep-dive.md`.
- **Research gaps** to fill for Follow the Money: Future Positive/Ventures/Never Lift/Starlight (Series A participants), SilverLining full donor list, Holland & Knight specifics, Sequoia details, David Keith / Ken Caldeira profiles.
- **Nav restructure** — Learn dropdown vs current single link approach.

## Roadmap (Not Yet Built)

### Phase 4
- Legal action hub
- FOIA generator
- Donation links
- Testing coordination

### Phase 5
- User accounts
- Flight history / pattern detection
- Historical ADS-B integration
- Push alerts for known operators

### Future Features
- **LLC piercing** — When FAA lookup returns an LLC, automatically search state corporate registries for registered agent, officers, parent company. Pierce the corporate veil on aircraft ownership. (Insight from tower controller contact — confirmed LLCs are standard practice for privacy.)
- **LADD detection** — Identify aircraft using FAA's Limiting Aircraft Data Displayed program to hide from public ADS-B feeds. Tower sees them, public doesn't. Potential blind spot for WX mod operators.
- Flight history tracking deferred — needs persistent storage

## Why
Connect concerned citizens with tools to document, track, and take action on weather modification. Individual data sources exist in silos but nothing brings them together. Design must be professional and data-driven — not conspiracy-coded — so it can't be dismissed.

## Branding
"SkyLedger" is the name. Codebase still uses `openskies/` internally.

## Coalition Strategy
SkyLedger is the dashboard layer. Geoengineering Watch = archive (600+ patents). GeoFight = legal arm. ICAN = FOIA. Full strategy in `Research/coalition-strategy.md`.

## Key Research Files
- `research/geoengineering-investors/00-overview.md` — Investor network analysis, cross-connections
- `research/geoengineering-investors/2026-03-19-stardust-solutions-deep-dive.md` — Business model, red flags, governance failures
- `research/geoengineering/awz-ventures-network/` — Full AWZ/intelligence network investigation
- `research/geoengineering/stardust-founders/` — Founders deep dive, career timelines, 50+ sources
- `Research/geoengineering-funding-network/funding-analysis.md` — Funding totals, speed comparison
- `Research/hard-facts.md` — Verifiable facts with sources

## How to Run
`npm run dev` — runs on localhost:3000.

## Operations
`private/OPS.md` — single source of truth for infrastructure (gitignored).
