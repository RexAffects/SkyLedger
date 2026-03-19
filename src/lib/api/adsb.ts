/**
 * ADSB.lol API wrapper — unfiltered, free flight tracking data.
 * Unlike FlightRadar24/FlightAware, this shows military, government,
 * and privacy-blocked aircraft.
 *
 * API docs: https://api.adsb.lol
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
 * Fetch live flights within a radius of a point.
 * @param lat Center latitude
 * @param lon Center longitude
 * @param radiusNm Radius in nautical miles (max 250)
 */
export async function fetchNearbyFlights(
  lat: number,
  lon: number,
  radiusNm: number = 50
): Promise<ADSBFlight[]> {
  const url = `https://api.adsb.lol/v2/lat/${lat}/lon/${lon}/dist/${radiusNm}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 5 }, // Cache for 5 seconds
  });

  if (!res.ok) {
    throw new Error(`ADSB.lol API error: ${res.status} ${res.statusText}`);
  }

  const data: ADSBResponse = await res.json();
  return data.ac ?? [];
}

/**
 * Fetch a specific aircraft by ICAO hex code.
 */
export async function fetchAircraftByHex(
  hex: string
): Promise<ADSBFlight | null> {
  const url = `https://api.adsb.lol/v2/hex/${hex}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return null;

  const data: ADSBResponse = await res.json();
  return data.ac?.[0] ?? null;
}

/**
 * Fetch aircraft by registration/tail number.
 */
export async function fetchAircraftByRegistration(
  reg: string
): Promise<ADSBFlight | null> {
  const url = `https://api.adsb.lol/v2/reg/${reg}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return null;

  const data: ADSBResponse = await res.json();
  return data.ac?.[0] ?? null;
}
