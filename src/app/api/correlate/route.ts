import { NextRequest } from "next/server";
import { fetchNearbyFlights, type ADSBFlight } from "@/lib/api/adsb";
import { checkWeatherModOperator } from "@/lib/api/faa";
import { distanceNm } from "@/lib/utils/geo";

/**
 * POST /api/correlate
 * Given a report's location and time, find aircraft that were nearby.
 *
 * Note: ADSB.lol provides real-time data, not historical. For historical
 * correlation, we'd need to store flight positions over time. This endpoint
 * currently works for LIVE correlation (submit a report while the aircraft
 * is still visible on ADS-B).
 *
 * Future: integrate with ADS-B historical data archives.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { latitude, longitude, radius_nm = 25 } = body;

  if (!latitude || !longitude) {
    return Response.json(
      { error: "latitude and longitude are required" },
      { status: 400 }
    );
  }

  try {
    const flights = await fetchNearbyFlights(latitude, longitude, radius_nm);

    // Score and rank flights by proximity
    const correlations = flights
      .filter((f): f is ADSBFlight & { lat: number; lon: number } =>
        f.lat != null && f.lon != null
      )
      .map((flight) => {
        const distance = distanceNm(
          latitude,
          longitude,
          flight.lat,
          flight.lon
        );

        // Check if this is a known weather modification operator
        const wxModCheck = flight.r
          ? checkWeatherModOperator(flight.r)
          : { isMatch: false, notes: "" };

        // Confidence score: closer = higher score
        const confidence = Math.max(0, 1 - distance / radius_nm);

        return {
          icao_hex: flight.hex,
          tail_number: flight.r || null,
          callsign: flight.flight?.trim() || null,
          aircraft_type: flight.t || null,
          aircraft_description: flight.desc || null,
          latitude: flight.lat,
          longitude: flight.lon,
          altitude_ft:
            typeof flight.alt_baro === "number" ? flight.alt_baro : 0,
          speed_kts: flight.gs || 0,
          heading: flight.track || 0,
          distance_nm: Math.round(distance * 100) / 100,
          confidence_score: Math.round(confidence * 100) / 100,
          is_known_wx_mod: wxModCheck.isMatch,
          operator_notes: wxModCheck.notes,
          squawk: flight.squawk || null,
        };
      })
      .sort((a, b) => a.distance_nm - b.distance_nm);

    return Response.json({
      correlations,
      count: correlations.length,
      search_center: { latitude, longitude },
      search_radius_nm: radius_nm,
      timestamp: Date.now(),
      note: "ADSB.lol provides real-time data. For historical correlation, aircraft must be currently airborne.",
    });
  } catch (error) {
    console.error("Correlation error:", error);
    return Response.json(
      { error: "Failed to correlate flights" },
      { status: 502 }
    );
  }
}
