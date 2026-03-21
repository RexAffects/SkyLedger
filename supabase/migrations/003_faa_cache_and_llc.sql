-- ============================================================
-- FAA Registration Cache
-- Caches FAA lookups so we only scrape registry.faa.gov once per aircraft.
-- Refreshes every 30 days.
-- ============================================================

CREATE TABLE IF NOT EXISTS faa_cache (
  tail_number TEXT PRIMARY KEY,
  registration_data JSONB NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days')
);

-- RLS: service-role only (API routes manage the cache)
ALTER TABLE faa_cache ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- LLC Lookups
-- Stores LLC piercing results. Keyed on owner NAME (not tail number)
-- since multiple aircraft can share the same LLC.
-- Refreshes every 90 days.
-- ============================================================

CREATE TABLE IF NOT EXISTS llc_lookups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name TEXT NOT NULL,
  owner_state TEXT,
  entity_type TEXT, -- llc, corp, trust, lp, lld, inc
  pierced_owner TEXT, -- real person/parent company, null if unknown
  pierced_source TEXT, -- manual, community, opencorporates, state_registry
  registered_agent TEXT,
  formation_state TEXT,
  state_registry_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, found, dead_end
  confidence TEXT DEFAULT 'low', -- low, medium, high, confirmed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '90 days')
);

-- Unique index on normalized (lowercase) owner name
CREATE UNIQUE INDEX idx_llc_lookups_owner_name ON llc_lookups (lower(owner_name));

-- RLS: service-role only
ALTER TABLE llc_lookups ENABLE ROW LEVEL SECURITY;
