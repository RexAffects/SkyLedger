-- OpenSkies Initial Schema
-- Citizen reports + community flight flagging

-- ============================================================
-- CITIZEN REPORTS
-- ============================================================

CREATE TABLE citizen_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL,
  observation_type TEXT NOT NULL,
  aircraft_count INT,
  duration_minutes INT,
  trail_behavior TEXT,
  notes TEXT CHECK (char_length(notes) <= 500),
  photo_urls TEXT[] DEFAULT '{}',
  evidence_hash TEXT NOT NULL,
  exif_data JSONB,
  weather_conditions JSONB,
  verification_level INT DEFAULT 1 CHECK (verification_level BETWEEN 1 AND 4),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'flagged', 'removed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for map queries by location
CREATE INDEX idx_reports_observed_at ON citizen_reports (observed_at DESC);
CREATE INDEX idx_reports_status ON citizen_reports (status) WHERE status = 'active';

-- RLS: anyone can read active reports, anyone can insert
ALTER TABLE citizen_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active reports"
  ON citizen_reports FOR SELECT
  USING (status = 'active');

CREATE POLICY "Anyone can submit reports"
  ON citizen_reports FOR INSERT
  WITH CHECK (true);


-- ============================================================
-- FLIGHT FLAGS (community-reported suspicious aircraft)
-- ============================================================

CREATE TABLE flight_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tail_number TEXT NOT NULL,
  icao_hex TEXT,
  reason TEXT NOT NULL CHECK (char_length(reason) <= 500),
  reporter_notes TEXT CHECK (char_length(reporter_notes) <= 500),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  altitude_ft INT,
  observation_type TEXT DEFAULT 'suspicious_activity',
  flag_count INT DEFAULT 1,
  first_flagged_at TIMESTAMPTZ DEFAULT NOW(),
  last_flagged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookup by tail number
CREATE INDEX idx_flags_tail ON flight_flags (tail_number);
CREATE INDEX idx_flags_icao ON flight_flags (icao_hex) WHERE icao_hex IS NOT NULL;
CREATE INDEX idx_flags_count ON flight_flags (flag_count DESC);

-- RLS: anyone can read flags, anyone can insert
ALTER TABLE flight_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read flight flags"
  ON flight_flags FOR SELECT
  USING (true);

CREATE POLICY "Anyone can submit flight flags"
  ON flight_flags FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Flags can be updated (increment count)"
  ON flight_flags FOR UPDATE
  USING (true)
  WITH CHECK (true);
