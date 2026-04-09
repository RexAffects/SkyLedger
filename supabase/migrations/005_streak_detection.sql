-- Retroactive Streak Detection System
-- Correlates user-reported sky observations with historical flight data
-- to identify patterns over time. Internal intelligence — not public-facing.

-- ============================================================
-- STREAK REPORTS — user observations of recent aerial activity
-- ============================================================
CREATE TABLE streak_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_hash TEXT NOT NULL,            -- anonymized IP (same as flag system)
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL,       -- when the user looked up
  estimated_age TEXT NOT NULL,            -- 'within_30min', 'within_1hr', 'within_2hr', 'within_3hr'
  pattern_type TEXT NOT NULL,             -- 'parallel', 'grid', 'cluster', 'single_heavy', 'dispersing_haze'
  severity TEXT DEFAULT 'moderate',       -- 'light', 'moderate', 'heavy'
  trail_state TEXT DEFAULT 'sharp',       -- 'sharp' (very fresh), 'softening', 'spreading', 'haze'
  notes TEXT,
  photo_url TEXT,

  -- Auto-populated weather context at report location + contrail altitudes
  weather_data JSONB,

  -- Correlation status
  correlation_status TEXT DEFAULT 'pending',  -- 'pending', 'complete', 'partial', 'failed'
  matched_flight_count INT DEFAULT 0,
  dark_aircraft_estimate INT,             -- if user sees more trails than ADS-B shows

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_streak_reports_location ON streak_reports (latitude, longitude);
CREATE INDEX idx_streak_reports_time ON streak_reports (observed_at DESC);
CREATE INDEX idx_streak_reports_status ON streak_reports (correlation_status);
CREATE INDEX idx_streak_reports_reporter ON streak_reports (reporter_hash, created_at DESC);

-- ============================================================
-- STREAK MATCHED FLIGHTS — aircraft found in the time/area window
-- ============================================================
CREATE TABLE streak_matched_flights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  streak_report_id UUID NOT NULL REFERENCES streak_reports(id) ON DELETE CASCADE,

  -- Aircraft identification
  icao_hex TEXT NOT NULL,
  tail_number TEXT,
  callsign TEXT,
  operator TEXT,                          -- resolved operator name (from FAA or known operators)
  aircraft_type TEXT,
  aircraft_description TEXT,

  -- Position when correlated
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  altitude_ft INT,
  speed_kts INT,
  heading INT,

  -- Analysis fields
  altitude_tier TEXT NOT NULL,            -- 'contrail_zone' (>25k), 'sub_contrail' (10k-25k), 'low' (<10k)
  distance_nm NUMERIC(6,2),              -- distance from reporter
  is_known_operator BOOLEAN DEFAULT FALSE,
  operator_notes TEXT,                    -- from weather mod operator check
  data_source TEXT NOT NULL,              -- 'flight_positions', 'live_adsb', 'opensky'

  -- Contrail weather assessment at this aircraft's altitude
  contrail_possible BOOLEAN,
  contrail_assessment TEXT,

  observed_at TIMESTAMPTZ NOT NULL,       -- when the aircraft was at this position
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_streak_matched_report ON streak_matched_flights (streak_report_id);
CREATE INDEX idx_streak_matched_tail ON streak_matched_flights (tail_number);
CREATE INDEX idx_streak_matched_hex ON streak_matched_flights (icao_hex);
CREATE INDEX idx_streak_matched_operator ON streak_matched_flights (operator);
CREATE INDEX idx_streak_matched_time ON streak_matched_flights (observed_at DESC);

-- No RLS — service role inserts only, reads via admin API
