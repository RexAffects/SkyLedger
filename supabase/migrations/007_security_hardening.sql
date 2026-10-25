-- Security hardening (2026-10-25)
-- See docs/security/2026-10-25-abuse-hardening.md for the full story.
--
-- Safe to run more than once. Run in Supabase -> SQL Editor.
--
-- Before this migration:
--   * citizen_reports and flight_flags had "anyone can INSERT/UPDATE" policies,
--     so the public anon key (visible in the site's JavaScript) could write
--     unlimited rows directly, bypassing every check in our API routes.
--   * flight_positions, flight_summaries, streak_reports and
--     streak_matched_flights had NO row level security at all. In Supabase,
--     no RLS means the anon key has FULL read/write access to the table.
--     (The comment in migration 003 saying "No RLS — service role inserts
--     only" was a misunderstanding.)
--
-- After this migration, every write goes through our API routes using the
-- service role key, which bypasses RLS on purpose. The browser can still
-- READ citizen_reports (active ones) and flight_flags, which it does today.

-- ------------------------------------------------------------
-- 1. citizen_reports: hashed reporter for rate limiting
-- ------------------------------------------------------------
ALTER TABLE citizen_reports ADD COLUMN IF NOT EXISTS reporter_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_reports_reporter_created
  ON citizen_reports (reporter_hash, created_at DESC);

-- ------------------------------------------------------------
-- 2. Remove direct-from-browser write policies
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can submit reports" ON citizen_reports;
DROP POLICY IF EXISTS "Anyone can submit flight flags" ON flight_flags;
DROP POLICY IF EXISTS "Flags can be updated (increment count)" ON flight_flags;

-- ------------------------------------------------------------
-- 3. Turn on RLS where it was missing (no policies = service role only)
-- ------------------------------------------------------------
ALTER TABLE flight_positions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_summaries       ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_reports         ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_matched_flights ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- Verify (optional): should list only SELECT policies for the two public
-- tables and nothing for the four above.
-- ------------------------------------------------------------
-- SELECT tablename, policyname, cmd FROM pg_policies
--  WHERE schemaname = 'public' ORDER BY tablename, policyname;
-- SELECT relname, relrowsecurity FROM pg_class
--  WHERE relname IN ('citizen_reports','flight_flags','flight_positions',
--                    'flight_summaries','streak_reports','streak_matched_flights');
