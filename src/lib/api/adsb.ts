/**
 * ADSB.lol API wrapper — unfiltered, free flight tracking data.
 * Unlike FlightRadar24/FlightAware, this shows military, government,
 * and privacy-blocked aircraft.
 *
 * API docs: https://api.adsb.lol
 *
 * Provider fallback: if ADSB.lol fails (error status, timeout, bad JSON) we
 * retry the same query against adsb.fi, which serves the identical readsb
 * JSON format. See docs/incidents/2026-10-25-flight-feed-403.md for why.
 *
 * adsb.fi terms (github.com/adsbfi/opendata): 1 req/sec, non-commercial use
 * only, and the site must credit adsb.fi with a link (done on /flights and
 * /about).
 */

export interface ADSBFlight {
  hex: string; // ICAO 24-bit address
  type: string;
  flight: string; // Callsign (trimmed)
  r: string; // Registration / tail number
  t: string; // Aircraft type code
  desc: string; // Aircraft type description
  alt_baro: number | string; // Barometric altitude (ft) or "ground"
  alt_geom: number; // Geometric altitude (ft)
  gs: number; // Ground speed (knots)
  track: number; // Track/heading (degrees)
  lat: number;
  lon: number;
  seen: number; // Seconds since last message
  seen_pos: number; // Seconds since last position
  messages: number;
  category: string; // Emitter category
  nav_altitude_mcp: number;
  nav_heading: number;
  squawk: string;
}

export interface ADSBResponse {
  ac: ADSBFlight[] | null;
  msg: string;
  now: number;
  total: number;
  ctime: number;
  ptime: number;
}

/**
 * Every upstream request must send an explicit User-Agent. Node's built-in
 * fetch sends `User-Agent: node` by default, and ADSB.lol started answering
 * that with 403 Forbidden in Oct 2026 — which silently took down the radar.
 */
export const SKYLEDGER_USER_AGENT = "SkyLedger/1.0 (+https://skyledger.org)";

const HEADERS = {
  Accept: "application/json",
  "User-Agent": SKYLEDGER_USER_AGENT,
};

/** Give up on a provider after this long and move to the next one. */
const TIMEOUT_MS = 8000;

/** How long to wait before retrying a provider that answered 429. */
const RATE_LIMIT_RETRY_MS = 1100;

interface Provider {
  name: string;
  nearby: (lat: number, lon: number, radiusNm: number) => string;
  hex: (hex: string) => string;
  reg: (reg: string) => string;
}

/** Tried in order. First is primary; the rest are fallbacks. */
export const PROVIDERS: Provider[] = [
  {
    name: "adsb.lol",
    nearby: (lat, lon, r) => `https://api.adsb.lol/v2/lat/${lat}/lon/${lon}/dist/${r}`,
    hex: (hex) => `https://api.adsb.lol/v2/hex/${hex}`,
    reg: (reg) => `https://api.adsb.lol/v2/reg/${reg}`,
  },
  {
    name: "adsb.fi",
    nearby: (lat, lon, r) =>
      `https://opendata.adsb.fi/api/v3/lat/${lat}/lon/${lon}/dist/${r}`,
    hex: (hex) => `https://opendata.adsb.fi/api/v2/hex/${hex}`,
    reg: (reg) => `https://opendata.adsb.fi/api/v2/registration/${reg}`,
  },
];

export interface ProviderAttempt {
  provider: string;
  ok: boolean;
  status: number | null;
  ms: number;
  count?: number;
  error?: string;
}

export class FlightFeedError extends Error {
  constructor(public attempts: ProviderAttempt[]) {
    super(
      "All flight data providers failed: " +
        attempts.map((a) => `${a.provider} (${a.error})`).join(", ")
    );
    this.name = "FlightFeedError";
  }
}

/**
 * Query one provider. Never throws — failures come back as `ok: false` so
 * callers can decide whether to fall through to the next provider.
 */
export async function queryProvider(
  provider: Provider,
  url: string,
  init: RequestInit = {}
): Promise<{ attempt: ProviderAttempt; flights: ADSBFlight[] | null }> {
  const started = Date.now();
  const attempt = (
    fields: Omit<ProviderAttempt, "provider" | "ms">
  ): ProviderAttempt => ({
    provider: provider.name,
    ms: Date.now() - started,
    ...fields,
  });

  try {
    const res = await fetch(url, {
      ...init,
      headers: HEADERS,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      return {
        attempt: attempt({ ok: false, status: res.status, error: `HTTP ${res.status}` }),
        flights: null,
      };
    }

    const data: ADSBResponse = await res.json();
    const flights = data.ac;
    if (flights !== null && flights !== undefined && !Array.isArray(flights)) {
      return {
        attempt: attempt({ ok: false, status: res.status, error: "Unexpected response shape" }),
        flights: null,
      };
    }

    const list = flights ?? [];
    return {
      attempt: attempt({ ok: true, status: res.status, count: list.length }),
      flights: list,
    };
  } catch (err) {
    const error =
      err instanceof Error && err.name === "TimeoutError"
        ? `Timed out after ${TIMEOUT_MS}ms`
        : err instanceof Error
          ? err.message
          : String(err);
    return { attempt: attempt({ ok: false, status: null, error }), flights: null };
  }
}

/**
 * Try each provider in order until one answers. Logs every failure so an
 * outage shows up in Vercel logs even when the fallback hides it from users.
 */
async function queryWithFallback(
  buildUrl: (provider: Provider) => string,
  init?: RequestInit
): Promise<{ flights: ADSBFlight[]; provider: string }> {
  const attempts: ProviderAttempt[] = [];

  for (const provider of PROVIDERS) {
    let { attempt, flights } = await queryProvider(provider, buildUrl(provider), init);

    // adsb.fi allows ~1 req/sec; a rate-limited provider usually recovers
    // within a second, so wait once before moving on.
    if (attempt.status === 429) {
      attempts.push(attempt);
      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_RETRY_MS));
      ({ attempt, flights } = await queryProvider(provider, buildUrl(provider), init));
    }
    attempts.push(attempt);

    if (flights) {
      if (attempts.length > 1) {
        console.warn(
          `[flight-feed] Served by fallback ${provider.name} after failures:`,
          JSON.stringify(attempts.slice(0, -1))
        );
      }
      return { flights, provider: provider.name };
    }
  }

  console.error("[flight-feed] All providers failed:", JSON.stringify(attempts));
  throw new FlightFeedError(attempts);
}

/**
 * Fetch live flights within a radius of a point, plus which provider served them.
 */
export async function fetchNearbyFlightsWithSource(
  lat: number,
  lon: number,
  radiusNm: number = 50
): Promise<{ flights: ADSBFlight[]; provider: string }> {
  return queryWithFallback((p) => p.nearby(lat, lon, radiusNm), {
    next: { revalidate: 5 }, // Cache for 5 seconds
  });
}

/**
 * Fetch live flights within a radius of a point.
 * @param lat Center latitude
 * @param lon Center longitude
 * @param radiusNm Radius in nautical miles (max 250)
 * @throws FlightFeedError if every provider fails
 */
export async function fetchNearbyFlights(
  lat: number,
  lon: number,
  radiusNm: number = 50
): Promise<ADSBFlight[]> {
  return (await fetchNearbyFlightsWithSource(lat, lon, radiusNm)).flights;
}

/**
 * Fetch a specific aircraft by ICAO hex code.
 * Returns null if the aircraft isn't airborne or every provider failed.
 */
export async function fetchAircraftByHex(
  hex: string
): Promise<ADSBFlight | null> {
  try {
    const { flights } = await queryWithFallback((p) => p.hex(hex));
    return flights[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch aircraft by registration/tail number.
 * Returns null if the aircraft isn't airborne or every provider failed.
 */
export async function fetchAircraftByRegistration(
  reg: string
): Promise<ADSBFlight | null> {
  try {
    const { flights } = await queryWithFallback((p) => p.reg(reg));
    return flights[0] ?? null;
  } catch {
    return null;
  }
}
