/**
 * ADSBDB — Free route/aircraft lookup API.
 * No API key required. Handles 1.1M+ requests/day.
 * https://www.adsbdb.com
 */

export interface AirportInfo {
  icao: string;
  iata: string;
  name: string;
  country: string;
  municipality: string;
  latitude: number;
  longitude: number;
  elevation: number;
}

export interface RouteInfo {
  callsign: string;
  callsign_icao: string | null;
  callsign_iata: string | null;
  airline_name: string | null;
  airline_icao: string | null;
  airline_iata: string | null;
  origin: AirportInfo | null;
  destination: AirportInfo | null;
}

export interface AircraftInfo {
  type: string;
  icao_type: string;
  manufacturer: string;
  mode_s: string;
  registration: string;
  registered_owner_country_iso_name: string;
  registered_owner_country_name: string;
  registered_owner_operator_flag_code: string;
  registered_owner: string;
  url_photo: string | null;
  url_photo_thumbnail: string | null;
}

/**
 * Look up route info by callsign.
 * Returns origin and destination airports.
 */
export async function lookupRoute(
  callsign: string
): Promise<RouteInfo | null> {
  const cleaned = callsign.trim().toUpperCase();
  if (!cleaned) return null;

  try {
    const res = await fetch(
      `https://api.adsbdb.com/v0/callsign/${cleaned}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!res.ok) return null;

    const data = await res.json();

    if (data.response?.flightroute) {
      const route = data.response.flightroute;
      return {
        callsign: route.callsign || cleaned,
        callsign_icao: route.callsign_icao || null,
        callsign_iata: route.callsign_iata || null,
        airline_name: route.airline?.name || null,
        airline_icao: route.airline?.icao || null,
        airline_iata: route.airline?.iata || null,
        origin: route.origin
          ? {
              icao: route.origin.icao_code,
              iata: route.origin.iata_code,
              name: route.origin.name,
              country: route.origin.country,
              municipality: route.origin.municipality,
              latitude: route.origin.latitude,
              longitude: route.origin.longitude,
              elevation: route.origin.elevation,
            }
          : null,
        destination: route.destination
          ? {
              icao: route.destination.icao_code,
              iata: route.destination.iata_code,
              name: route.destination.name,
              country: route.destination.country,
              municipality: route.destination.municipality,
              latitude: route.destination.latitude,
              longitude: route.destination.longitude,
              elevation: route.destination.elevation,
            }
          : null,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Look up aircraft info by ICAO hex (mode_s) code.
 * Returns registration, owner, aircraft type, and photo.
 */
export async function lookupAircraftByHex(
  hex: string
): Promise<AircraftInfo | null> {
  const cleaned = hex.trim().toUpperCase();
  if (!cleaned) return null;

  try {
    const res = await fetch(
      `https://api.adsbdb.com/v0/aircraft/${cleaned}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) return null;

    const data = await res.json();

    if (data.response?.aircraft) {
      return data.response.aircraft as AircraftInfo;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Fallback: look up route via HexDB.io
 * Returns a simple "ORIGIN-DESTINATION" string like "KJFK-KLAX"
 */
export async function lookupRouteHexDB(
  callsign: string
): Promise<{ origin: string; destination: string } | null> {
  const cleaned = callsign.trim().toUpperCase();
  if (!cleaned) return null;

  try {
    const res = await fetch(
      `https://hexdb.io/api/v1/route/iata/${cleaned}`
    );

    if (!res.ok) return null;

    const text = await res.text();
    const parts = text.trim().split("-");

    if (parts.length === 2 && parts[0] && parts[1]) {
      return { origin: parts[0], destination: parts[1] };
    }

    return null;
  } catch {
    return null;
  }
}
