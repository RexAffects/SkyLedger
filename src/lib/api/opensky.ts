/**
 * OpenSky Network API — free historical flight data.
 *
 * Two endpoints in use:
 *   /states/all       — state vectors (position/velocity) at a point in time.
 *                       Used for retroactive streak correlation.
 *   /flights/aircraft — completed-flight records with estimated departure
 *                       and arrival airports, derived by OpenSky's trajectory
 *                       analyzer. Records appear 6–24h after landing.
 *
 * API docs: https://openskynetwork.github.io/opensky-api/
 *
 * Authentication:
 *   - Modern: OAuth2 client-credentials. Set OPENSKY_CLIENT_ID +
 *     OPENSKY_CLIENT_SECRET. Token endpoint:
 *     https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token
 *   - Legacy: OPENSKY_USERNAME / OPENSKY_PASSWORD basic auth (still
 *     accepted for /states; /flights/aircraft requires OAuth2).
 *   - Anonymous: limited to ~1hr historical states, no flight records.
 */

export interface OpenSkyStateVector {
  icao24: string;        // ICAO 24-bit hex address
  callsign: string | null;
  origin_country: string;
  time_position: number | null;  // Unix timestamp of last position update
  last_contact: number;          // Unix timestamp of last contact
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;  // Barometric altitude in METERS
  on_ground: boolean;
  velocity: number | null;       // m/s
  true_track: number | null;     // degrees clockwise from north
  vertical_rate: number | null;  // m/s
  sensors: number[] | null;
  geo_altitude: number | null;   // Geometric altitude in METERS
  squawk: string | null;
  spi: boolean;
  position_source: number;
}

export interface OpenSkyFlight {
  icao_hex: string;
  callsign: string | null;
  origin_country: string;
  latitude: number;
  longitude: number;
  altitude_ft: number;
  speed_kts: number;
  heading: number;
  on_ground: boolean;
  observed_at: number;  // Unix timestamp
}

/**
 * Shape returned by /flights/aircraft. Airports are ICAO codes (or null)
 * that OpenSky's trajectory analyzer estimated from the flight track.
 * Horizontal/vertical distances quantify how confident the estimate is —
 * smaller is better (e.g. <5km horiz means the trajectory clearly ended
 * at that airport).
 */
export interface OpenSkyAircraftFlight {
  icao24: string;
  callsign: string | null;
  firstSeen: number;
  lastSeen: number;
  estDepartureAirport: string | null;
  estArrivalAirport: string | null;
  estDepartureAirportHorizDistance: number | null;
  estArrivalAirportHorizDistance: number | null;
  estDepartureAirportVertDistance: number | null;
  estArrivalAirportVertDistance: number | null;
  departureAirportCandidatesCount: number;
  arrivalAirportCandidatesCount: number;
}

const METERS_TO_FEET = 3.28084;
const MPS_TO_KNOTS = 1.94384;

const OPENSKY_TOKEN_URL =
  "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token";

// Module-scoped token cache. Tokens last 1800s; we refresh when within 60s
// of expiry to avoid edge-of-window failures.
let tokenCache: { token: string; expiresAtMs: number } | null = null;

/**
 * Fetch (or reuse) an OAuth2 access token via client-credentials.
 * Returns null if credentials aren't configured.
 */
async function getOpenSkyToken(): Promise<string | null> {
  const clientId = process.env.OPENSKY_CLIENT_ID;
  const clientSecret = process.env.OPENSKY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const now = Date.now();
  if (tokenCache && tokenCache.expiresAtMs - 60_000 > now) {
    return tokenCache.token;
  }

  try {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    });
    const res = await fetch(OPENSKY_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      console.error(`OpenSky token error: ${res.status} ${res.statusText}`);
      return null;
    }
    const data = (await res.json()) as {
      access_token: string;
      expires_in: number;
    };
    tokenCache = {
      token: data.access_token,
      expiresAtMs: now + data.expires_in * 1000,
    };
    return tokenCache.token;
  } catch (err) {
    console.error("OpenSky token fetch failed:", err);
    return null;
  }
}

/**
 * Build auth headers for /states/all. Prefers OAuth2 bearer when a token
 * is available; falls back to legacy basic auth; returns empty headers
 * (anonymous tier) if neither is configured.
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const bearer = await getOpenSkyToken();
  if (bearer) return { Authorization: `Bearer ${bearer}` };

  const username = process.env.OPENSKY_USERNAME;
  const password = process.env.OPENSKY_PASSWORD;
  if (username && password) {
    const encoded = Buffer.from(`${username}:${password}`).toString("base64");
    return { Authorization: `Basic ${encoded}` };
  }

  return {};
}

/**
 * Convert a bounding box to the lat/lon min/max format OpenSky expects.
 */
function boundingBox(
  centerLat: number,
  centerLon: number,
  radiusNm: number
): { lamin: number; lamax: number; lomin: number; lomax: number } {
  // 1 degree latitude ≈ 60 nautical miles
  const latDelta = radiusNm / 60;
  // Longitude degrees per nm varies with latitude
  const lonDelta = radiusNm / (60 * Math.cos((centerLat * Math.PI) / 180));

  return {
    lamin: centerLat - latDelta,
    lamax: centerLat + latDelta,
    lomin: centerLon - lonDelta,
    lomax: centerLon + lonDelta,
  };
}

/**
 * Parse the raw OpenSky state vector array into a typed object.
 * OpenSky returns arrays, not objects.
 */
function parseStateVector(raw: unknown[]): OpenSkyStateVector {
  return {
    icao24: raw[0] as string,
    callsign: (raw[1] as string)?.trim() || null,
    origin_country: raw[2] as string,
    time_position: raw[3] as number | null,
    last_contact: raw[4] as number,
    longitude: raw[5] as number | null,
    latitude: raw[6] as number | null,
    baro_altitude: raw[7] as number | null,
    on_ground: raw[8] as boolean,
    velocity: raw[9] as number | null,
    true_track: raw[10] as number | null,
    vertical_rate: raw[11] as number | null,
    sensors: raw[12] as number[] | null,
    geo_altitude: raw[13] as number | null,
    squawk: raw[14] as string | null,
    spi: raw[15] as boolean,
    position_source: raw[16] as number,
  };
}

/**
 * Fetch aircraft state vectors at a specific time within a bounding box.
 *
 * @param centerLat Center latitude of search area
 * @param centerLon Center longitude of search area
 * @param radiusNm Search radius in nautical miles
 * @param time Unix timestamp to query (seconds since epoch)
 * @param minAltitudeFt Minimum altitude filter (feet)
 */
export async function fetchHistoricalStates(
  centerLat: number,
  centerLon: number,
  radiusNm: number,
  time: number,
  minAltitudeFt: number = 10000
): Promise<OpenSkyFlight[]> {
  const bbox = boundingBox(centerLat, centerLon, radiusNm);

  const params = new URLSearchParams({
    time: Math.floor(time).toString(),
    lamin: bbox.lamin.toFixed(4),
    lamax: bbox.lamax.toFixed(4),
    lomin: bbox.lomin.toFixed(4),
    lomax: bbox.lomax.toFixed(4),
  });

  const url = `https://opensky-network.org/api/states/all?${params}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(await getAuthHeaders()),
    },
  });

  if (!res.ok) {
    if (res.status === 429) {
      console.warn("OpenSky rate limit hit — will retry on next correlation pass");
      return [];
    }
    console.error(`OpenSky API error: ${res.status} ${res.statusText}`);
    return [];
  }

  const data = await res.json();

  if (!data.states || !Array.isArray(data.states)) {
    return [];
  }

  const flights: OpenSkyFlight[] = [];

  for (const raw of data.states) {
    const sv = parseStateVector(raw);

    // Skip if no position data
    if (sv.latitude == null || sv.longitude == null) continue;
    // Skip ground aircraft
    if (sv.on_ground) continue;

    const altFt = sv.baro_altitude != null
      ? sv.baro_altitude * METERS_TO_FEET
      : sv.geo_altitude != null
        ? sv.geo_altitude * METERS_TO_FEET
        : 0;

    // Filter by minimum altitude
    if (altFt < minAltitudeFt) continue;

    flights.push({
      icao_hex: sv.icao24.toUpperCase(),
      callsign: sv.callsign,
      origin_country: sv.origin_country,
      latitude: sv.latitude,
      longitude: sv.longitude,
      altitude_ft: Math.round(altFt),
      speed_kts: sv.velocity ? Math.round(sv.velocity * MPS_TO_KNOTS) : 0,
      heading: sv.true_track ? Math.round(sv.true_track) : 0,
      on_ground: false,
      observed_at: sv.time_position || sv.last_contact,
    });
  }

  return flights;
}

/**
 * Fetch state vectors at multiple time points to cover a time window.
 * OpenSky returns a snapshot at one instant, so we sample at intervals.
 *
 * @param centerLat Center latitude
 * @param centerLon Center longitude
 * @param radiusNm Search radius in nautical miles
 * @param startTime Unix timestamp (seconds) — start of window
 * @param endTime Unix timestamp (seconds) — end of window
 * @param intervalMin Minutes between samples (default 15)
 * @param minAltitudeFt Minimum altitude filter
 */
export async function fetchHistoricalWindow(
  centerLat: number,
  centerLon: number,
  radiusNm: number,
  startTime: number,
  endTime: number,
  intervalMin: number = 15,
  minAltitudeFt: number = 10000
): Promise<OpenSkyFlight[]> {
  const intervalSec = intervalMin * 60;
  const timestamps: number[] = [];

  for (let t = startTime; t <= endTime; t += intervalSec) {
    timestamps.push(t);
  }

  // Always include the end time
  if (timestamps[timestamps.length - 1] !== endTime) {
    timestamps.push(endTime);
  }

  // Deduplicate flights across time samples (same hex = same aircraft)
  const seenHex = new Map<string, OpenSkyFlight>();

  // Rate-limit: OpenSky allows ~1 req / 10 sec
  // Process sequentially with delay
  for (const ts of timestamps) {
    const flights = await fetchHistoricalStates(
      centerLat, centerLon, radiusNm, ts, minAltitudeFt
    );

    for (const flight of flights) {
      const existing = seenHex.get(flight.icao_hex);
      // Keep the most recent position for each aircraft
      if (!existing || flight.observed_at > existing.observed_at) {
        seenHex.set(flight.icao_hex, flight);
      }
    }

    // Respect rate limits between requests
    if (timestamps.indexOf(ts) < timestamps.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 11000));
    }
  }

  return Array.from(seenHex.values());
}

/**
 * Fetch completed-flight records for a single aircraft over a time window.
 * Each record carries OpenSky's estimated departure/arrival airports —
 * derived from the actual track, not crowdsourced schedules.
 *
 * Note: records appear ~6–24h after landing. For flights still in the air
 * or recently landed, this endpoint returns nothing — callers must fall
 * back to the geo-gated route chain.
 *
 * The `begin`/`end` window must bracket the flight's landing time.
 * The endpoint enforces a max 30-day window.
 *
 * @param hex ICAO 24-bit hex (case-insensitive)
 * @param beginUnix Window start (Unix seconds)
 * @param endUnix   Window end (Unix seconds)
 */
export async function fetchAircraftFlights(
  hex: string,
  beginUnix: number,
  endUnix: number
): Promise<OpenSkyAircraftFlight[]> {
  const cleaned = hex.trim().toLowerCase();
  if (!cleaned) return [];

  const token = await getOpenSkyToken();
  if (!token) {
    // /flights/aircraft requires OAuth2; legacy basic auth doesn't get
    // free credit allocations on this endpoint. Skip silently.
    return [];
  }

  const params = new URLSearchParams({
    icao24: cleaned,
    begin: Math.floor(beginUnix).toString(),
    end: Math.floor(endUnix).toString(),
  });
  const url = `https://opensky-network.org/api/flights/aircraft?${params}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 404) {
      // OpenSky returns 404 when no flights match the window
      return [];
    }
    if (!res.ok) {
      if (res.status === 429) {
        console.warn("OpenSky /flights/aircraft rate limit hit");
      } else {
        console.error(
          `OpenSky /flights/aircraft error: ${res.status} ${res.statusText}`
        );
      }
      return [];
    }
    const data = (await res.json()) as Array<{
      icao24: string;
      callsign?: string | null;
      firstSeen: number;
      lastSeen: number;
      estDepartureAirport?: string | null;
      estArrivalAirport?: string | null;
      estDepartureAirportHorizDistance?: number | null;
      estArrivalAirportHorizDistance?: number | null;
      estDepartureAirportVertDistance?: number | null;
      estArrivalAirportVertDistance?: number | null;
      departureAirportCandidatesCount?: number;
      arrivalAirportCandidatesCount?: number;
    }>;
    if (!Array.isArray(data)) return [];

    return data.map((d) => ({
      icao24: d.icao24,
      callsign: (d.callsign ?? null)?.trim() || null,
      firstSeen: d.firstSeen,
      lastSeen: d.lastSeen,
      estDepartureAirport: d.estDepartureAirport ?? null,
      estArrivalAirport: d.estArrivalAirport ?? null,
      estDepartureAirportHorizDistance:
        d.estDepartureAirportHorizDistance ?? null,
      estArrivalAirportHorizDistance:
        d.estArrivalAirportHorizDistance ?? null,
      estDepartureAirportVertDistance:
        d.estDepartureAirportVertDistance ?? null,
      estArrivalAirportVertDistance:
        d.estArrivalAirportVertDistance ?? null,
      departureAirportCandidatesCount: d.departureAirportCandidatesCount ?? 0,
      arrivalAirportCandidatesCount: d.arrivalAirportCandidatesCount ?? 0,
    }));
  } catch (err) {
    console.error("OpenSky /flights/aircraft fetch failed:", err);
    return [];
  }
}
