-- Flight History & Pattern Detection
-- Selective storage: only track aircraft that qualify
-- (known operators, community flagged, high suspicion, manually pinned)

-- Individual position snapshots (60-second intervals, 90-day retention)
CREATE TABLE flight_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icao_hex TEXT NOT NULL,
  tail_number TEXT,
  callsign TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  altitude_ft INT,
  speed_kts INT,
  heading INT,
  track_reason TEXT NOT NULL,  -- 'known_operator', 'community_flagged', 'high_suspicion', 'manual_pin'
  suspicion_score NUMERIC(4,1),
  observed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_positions_tail ON flight_positions (tail_number, observed_at DESC);
CREATE INDEX idx_positions_hex ON flight_positions (icao_hex, observed_at DESC);
CREATE INDEX idx_positions_time ON flight_positions (observed_at DESC);

-- Aggregated per-aircraft history (persists forever, no retention limit)
CREATE TABLE flight_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tail_number TEXT NOT NULL UNIQUE,
  icao_hex TEXT,
  total_sightings INT DEFAULT 0,
  total_days_seen INT DEFAULT 0,
  first_seen_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  primary_region TEXT,
  avg_altitude_ft INT,
  common_times JSONB DEFAULT '{}',
  track_reason TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_summaries_tail ON flight_summaries (tail_number);
CREATE INDEX idx_summaries_last_seen ON flight_summaries (last_seen_at DESC);

-- No RLS — service role inserts only, public reads via API
