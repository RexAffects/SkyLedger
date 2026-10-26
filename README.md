# SkyLedger

Citizen-powered transparency platform for weather modification accountability.
Live at [skyledger.org](https://www.skyledger.org).

A live radar of what's flying over you, citizen observations with tamper-evident photo
evidence, community aircraft flagging, and research on the operators, investors, and
legislation behind weather modification. Built on candidate pools, not accusations: the
data convicts through accumulation, never through a single report.

## Start here

| Want to… | Read |
|---|---|
| Understand how the whole thing is built | [`docs/BUILD.md`](docs/BUILD.md) |
| Know what's live and what's next | [`PROJECT-STATUS.md`](PROJECT-STATUS.md), [`ROADMAP.md`](ROADMAP.md) |
| Follow the rules every change must respect | [`CLAUDE.md`](CLAUDE.md) |
| Check whether the site is healthy | [skyledger.org/api/health](https://www.skyledger.org/api/health) |
| Fix something that broke before | [`docs/incidents/`](docs/incidents/) |
| See how abuse and fake data are prevented | [`docs/security/2026-10-25-abuse-hardening.md`](docs/security/2026-10-25-abuse-hardening.md) |
| Understand the mission | [`VISION.md`](VISION.md) |

## Run it locally

```bash
git clone https://github.com/RexAffects/SkyLedger.git
cd SkyLedger
npm install
npm run dev
```

Open http://localhost:3000. You need `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (placeholders
are enough to build; real values are needed for reports and flags). The full variable list is in
`docs/BUILD.md`, section 11.

## Stack

Next.js 16 · React 19 · Tailwind · shadcn/ui · Leaflet · Supabase · Vercel (hosting + cron)
· ADS-B data from [ADSB.lol](https://adsb.lol) with [adsb.fi](https://adsb.fi) as fallback.

## Deploying

Every push to `main` deploys to production. Typecheck first:

```bash
npx tsc --noEmit -p .
```

Database migrations in `supabase/migrations/` are applied by hand in the Supabase SQL Editor.
After running one, confirm `/api/health` reports `"schema": {"ok": true}`.
