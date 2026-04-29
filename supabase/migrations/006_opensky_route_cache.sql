-- ============================================================
-- OpenSky Route Cache
-- Stores per-flight origin/destination resolved by OpenSky's
-- /flights/aircraft trajectory analyzer. OpenSky records appear
-- 6–24h after landing, so each row represents a completed flight.
--
-- Cache key is (icao_hex, last_seen_unix). Each distinct flight
-- gets its own row; the next leg by the same aircraft naturally
-- adds a new row rather than invalidating the prior one.
-- ============================================================

CREATE TABLE IF NOT EXISTS opensky_route_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icao_hex TEXT NOT NULL,
  callsign TEXT,
  first_seen_unix BIGINT NOT NULL,
  last_seen_unix BIGINT NOT NULL,
  est_departure_icao TEXT,
  est_arrival_icao TEXT,
  est_departure_horiz_distance_m INT,
  est_arrival_horiz_distance_m INT,
  est_departure_vert_distance_m INT,
  est_arrival_vert_distance_m INT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per completed flight. Same (hex, last_seen) is idempotent.
CREATE UNIQUE INDEX IF NOT EXISTS idx_opensky_route_cache_hex_landing
  ON opensky_route_cache (icao_hex, last_seen_unix);

-- Hot path: "give me the most recent record for this hex"
CREATE INDEX IF NOT EXISTS idx_opensky_route_cache_hex_recent
  ON opensky_route_cache (icao_hex, last_seen_unix DESC);

-- RLS: service-role only (the detail API route reads/writes via service client)
ALTER TABLE opensky_route_cache ENABLE ROW LEVEL SECURITY;
