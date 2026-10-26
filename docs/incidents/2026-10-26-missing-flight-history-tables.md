# 2026-10-26 — Flight history tables never existed on the live database

**Status:** resolved 2026-10-26 14:46 UTC. `/api/health` → `ok`, `schema.ok: true`.

## What happened

While running migration 007 (security hardening) in the Supabase SQL Editor, the
statement `ALTER TABLE flight_positions ENABLE ROW LEVEL SECURITY` failed with:

```
ERROR: 42P01: relation "flight_positions" does not exist
```

A listing of `pg_tables` showed nine tables. `flight_positions` and `flight_summaries`
(both from `supabase/migrations/003_flight_history.sql`) were missing. That migration was
never run on the production project, most likely because there are two files numbered
`003_` and only one of them got pasted into the editor when the database was set up.

## Impact

Every code path that touches those two tables has been failing quietly since the feature
was built:

- `src/lib/supabase/flight-history.ts` — recording positions and per-aircraft summaries
  (the `/api/flight-history` route). Inserts errored; the client never saw it.
- `src/lib/streak/correlate.ts` — "source 1" of streak correlation queried an absent table
  and logged an error, then carried on with the other sources.
- `src/lib/email/weekly-report.ts` — the sightings total came from `flight_summaries`.

Nothing user-facing broke, which is exactly why nobody noticed. There is no historical
flight data to recover; it was never stored.

## Why the health check missed it

`EXPECTED_SCHEMA` in `src/lib/health.ts` only probed `citizen_reports.reporter_hash`, the one
column migration 007 adds. It was written to nag about 007, not to verify the whole schema.

## Fix

1. Migration 007 was rewritten on the fly to skip tables that don't exist (a `DO $$` loop with
   `to_regclass`). The committed file still names all four tables, which is correct once 003
   is applied.
2. `003_flight_history.sql` was pasted into the SQL Editor with `IF NOT EXISTS` added and two
   extra lines enabling row level security on both tables. Result: "Success. No rows returned."
3. `/api/health` now probes **all eleven tables** the code depends on (one column each, in
   parallel) plus `citizen_reports.reporter_hash`. A missing table names the migration that
   creates it, status goes `degraded`, and the daily email says so.

## How to verify

- `https://www.skyledger.org/api/health` → `"schema": {"ok": true, "missing": []}`.
- Supabase → SQL Editor:
  ```sql
  SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
  ```
  Eleven rows, all `rowsecurity = true`.
- Within a day of normal radar use, Supabase → Table Editor → `flight_positions` has rows.

## Lessons (added to CLAUDE.md Reliability Rules)

- **Every table the code uses goes in `EXPECTED_SCHEMA`.** A new migration is not done until
  its table is in that list. The health check is the only thing that would have caught this.
- **Migration numbers must be unique.** Two files share `003_`. Don't renumber them now (it
  would confuse the history), but never do it again: next migration is `008_`.
- **Supabase errors from the service role deserve an alert, not just a `console.error`.** A
  "relation does not exist" error on every insert for months should have paged someone.

## Runbook: "schema out of date" in the health email

1. Open the email. The problem line names the migration file, e.g.
   `flight_positions.id (run supabase/migrations/003_flight_history.sql)`.
2. Supabase → project → SQL Editor → paste **only the SQL** from that file (not the surrounding
   explanation) → Run. Expect "Success. No rows returned."
3. If a statement fails on a table that doesn't exist, run the migration that creates it first
   (the `CREATE TABLE` grep: `grep -n "CREATE TABLE" supabase/migrations/*.sql`).
4. Re-open `/api/health`. `schema.ok` should be `true` within 30 seconds (per-instance cache).
