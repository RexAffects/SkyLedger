import { createServiceClient } from "./server";
import type { OpenSkyAircraftFlight } from "@/lib/api/opensky";

export interface CachedOpenSkyFlight {
  icao_hex: string;
  callsign: string | null;
  first_seen_unix: number;
  last_seen_unix: number;
  est_departure_icao: string | null;
  est_arrival_icao: string | null;
  est_departure_horiz_distance_m: number | null;
  est_arrival_horiz_distance_m: number | null;
}

/**
 * Most recent cached OpenSky flight for a hex with BOTH airports estimated.
 * Returns null if no record, if the most recent record's landing is older
 * than `maxAgeHours`, or if the most recent record only has a departure
 * airport (in-progress flight that hasn't landed yet).
 *
 * We deliberately do NOT fall back to an older completed leg: if OpenSky
 * hasn't recorded the most recent landing, the plane has moved on to a
 * new flight and an older leg's airports are stale.
 */
export async function getRecentOpenSkyFlight(
  hex: string,
  maxAgeHours: number = 24
): Promise<CachedOpenSkyFlight | null> {
  const cleaned = hex.trim().toUpperCase();
  if (!cleaned) return null;

  const supabase = createServiceClient();
  const cutoffUnix = Math.floor(Date.now() / 1000) - maxAgeHours * 3600;

  const { data, error } = await supabase
    .from("opensky_route_cache")
    .select(
      "icao_hex, callsign, first_seen_unix, last_seen_unix, est_departure_icao, est_arrival_icao, est_departure_horiz_distance_m, est_arrival_horiz_distance_m"
    )
    .eq("icao_hex", cleaned)
    .gte("last_seen_unix", cutoffUnix)
    .order("last_seen_unix", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  if (!data.est_departure_icao || !data.est_arrival_icao) return null;
  return data as CachedOpenSkyFlight;
}

/**
 * Persist an OpenSky flight record. Upserts on (hex, last_seen_unix) so
 * repeated lookups don't duplicate. Hex is stored uppercase.
 */
export async function cacheOpenSkyFlight(
  flight: OpenSkyAircraftFlight
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("opensky_route_cache").upsert(
    {
      icao_hex: flight.icao24.toUpperCase(),
      callsign: flight.callsign,
      first_seen_unix: flight.firstSeen,
      last_seen_unix: flight.lastSeen,
      est_departure_icao: flight.estDepartureAirport,
      est_arrival_icao: flight.estArrivalAirport,
      est_departure_horiz_distance_m: flight.estDepartureAirportHorizDistance,
      est_arrival_horiz_distance_m: flight.estArrivalAirportHorizDistance,
      est_departure_vert_distance_m: flight.estDepartureAirportVertDistance,
      est_arrival_vert_distance_m: flight.estArrivalAirportVertDistance,
      fetched_at: new Date().toISOString(),
    },
    { onConflict: "icao_hex,last_seen_unix" }
  );
  if (error) {
    console.error("Error caching OpenSky flight:", error);
  }
}
