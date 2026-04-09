/**
 * Streak Correlation Engine
 *
 * Given a streak report (location + time window), finds aircraft that were
 * in the area during that window. Uses three data sources:
 *
 * 1. Internal flight_positions table (already-tracked aircraft — 90 days)
 * 2. Live ADS-B snapshot (aircraft still airborne after recent streaking)
 * 3. OpenSky Network historical data (all aircraft in area at time)
 *
 * Each matched flight is scored and stored for pattern analysis over time.
 */

import { fetchNearbyFlights, type ADSBFlight } from "@/lib/api/adsb";
import { fetchHistoricalWindow } from "@/lib/api/opensky";
import { fetchWeatherAtPoint } from "@/lib/api/weather";
import { checkWeatherModOperator } from "@/lib/api/faa";
import { distanceNm } from "@/lib/utils/geo";
import {
  queryHistoricalPositions,
  insertMatchedFlights,
  updateStreakReportCorrelation,
  type InsertMatchedFlight,
} from "@/lib/supabase/streak";
import {
  STREAK_ESTIMATED_AGES,
  ALTITUDE_TIERS,
  STREAK_SEARCH_RADIUS_NM,
} from "@/lib/constants";

export interface CorrelationResult {
  reportId: string;
  matchedFlights: InsertMatchedFlight[];
  totalFromPositions: number;
  totalFromLive: number;
  totalFromOpenSky: number;
  status: "complete" | "partial" | "failed";
}

/**
 * Classify altitude into tier for analysis.
 */
function getAltitudeTier(altFt: number | null): string {
  if (!altFt) return "unknown";
  if (altFt >= ALTITUDE_TIERS.CONTRAIL_ZONE) return "contrail_zone";
  if (altFt >= ALTITUDE_TIERS.SUB_CONTRAIL) return "sub_contrail";
  return "low";
}

/**
 * Calculate the time window from a streak report's observed_at and estimated_age.
 */
function getTimeWindow(
  observedAt: string,
  estimatedAge: string
): { start: Date; end: Date } {
  const end = new Date(observedAt);
  const ageDef = STREAK_ESTIMATED_AGES.find((a) => a.value === estimatedAge);
  const minutes = ageDef?.minutes ?? 60;

  const start = new Date(end.getTime() - minutes * 60 * 1000);
  return { start, end };
}

/**
 * Run full correlation for a streak report.
 * Queries all three data sources and deduplicates by ICAO hex.
 */
export async function correlateStreakReport(
  reportId: string,
  latitude: number,
  longitude: number,
  observedAt: string,
  estimatedAge: string
): Promise<CorrelationResult> {
  const { start, end } = getTimeWindow(observedAt, estimatedAge);
  const radiusNm = STREAK_SEARCH_RADIUS_NM;

  // Track unique aircraft by ICAO hex to avoid duplicates across sources
  const matchedByHex = new Map<string, InsertMatchedFlight>();

  let totalFromPositions = 0;
  let totalFromLive = 0;
  let totalFromOpenSky = 0;
  let anySourceSucceeded = false;

  // ----- Source 1: Internal flight_positions (our historical data) -----
  try {
    const positions = await queryHistoricalPositions(
      latitude,
      longitude,
      radiusNm,
      start.toISOString(),
      end.toISOString(),
      ALTITUDE_TIERS.SUB_CONTRAIL // 10,000 ft minimum
    );

    // Deduplicate: keep the position closest to the report location per hex
    const bestByHex = new Map<string, typeof positions[number]>();
    for (const pos of positions) {
      const dist = distanceNm(latitude, longitude, pos.latitude, pos.longitude);
      const existing = bestByHex.get(pos.icao_hex);
      if (!existing) {
        bestByHex.set(pos.icao_hex, pos);
      } else {
        const existingDist = distanceNm(latitude, longitude, existing.latitude, existing.longitude);
        if (dist < existingDist) {
          bestByHex.set(pos.icao_hex, pos);
        }
      }
    }

    for (const [hex, pos] of bestByHex) {
      const dist = distanceNm(latitude, longitude, pos.latitude, pos.longitude);
      const wxCheck = pos.tail_number
        ? checkWeatherModOperator(pos.tail_number)
        : { isMatch: false, notes: "" };

      matchedByHex.set(hex, {
        streak_report_id: reportId,
        icao_hex: hex,
        tail_number: pos.tail_number,
        callsign: pos.callsign,
        operator: null, // Will be enriched later via FAA if needed
        aircraft_type: null,
        latitude: pos.latitude,
        longitude: pos.longitude,
        altitude_ft: pos.altitude_ft,
        speed_kts: pos.speed_kts,
        heading: pos.heading,
        altitude_tier: getAltitudeTier(pos.altitude_ft),
        distance_nm: Math.round(dist * 100) / 100,
        is_known_operator: wxCheck.isMatch,
        operator_notes: wxCheck.notes || null,
        data_source: "flight_positions",
        observed_at: pos.observed_at,
      });
    }

    totalFromPositions = bestByHex.size;
    anySourceSucceeded = true;
  } catch (err) {
    console.error("Streak correlation — flight_positions query failed:", err);
  }

  // ----- Source 2: Live ADS-B snapshot (aircraft still airborne) -----
  try {
    const liveFlights = await fetchNearbyFlights(latitude, longitude, radiusNm);

    for (const flight of liveFlights) {
      if (!flight.lat || !flight.lon) continue;

      const altFt = typeof flight.alt_baro === "number" ? flight.alt_baro : 0;
      if (altFt < ALTITUDE_TIERS.SUB_CONTRAIL) continue;

      const hex = flight.hex.toUpperCase();
      // Don't overwrite if we already have this aircraft from historical data
      if (matchedByHex.has(hex)) continue;

      const dist = distanceNm(latitude, longitude, flight.lat, flight.lon);
      const wxCheck = flight.r
        ? checkWeatherModOperator(flight.r)
        : { isMatch: false, notes: "" };

      matchedByHex.set(hex, {
        streak_report_id: reportId,
        icao_hex: hex,
        tail_number: flight.r || null,
        callsign: flight.flight?.trim() || null,
        operator: null,
        aircraft_type: flight.t || null,
        aircraft_description: flight.desc || null,
        latitude: flight.lat,
        longitude: flight.lon,
        altitude_ft: altFt,
        speed_kts: flight.gs || null,
        heading: flight.track || null,
        altitude_tier: getAltitudeTier(altFt),
        distance_nm: Math.round(dist * 100) / 100,
        is_known_operator: wxCheck.isMatch,
        operator_notes: wxCheck.notes || null,
        data_source: "live_adsb",
        observed_at: new Date().toISOString(),
      });

      totalFromLive++;
    }

    anySourceSucceeded = true;
  } catch (err) {
    console.error("Streak correlation — live ADS-B query failed:", err);
  }

  // ----- Source 3: OpenSky Network historical data -----
  try {
    const startUnix = Math.floor(start.getTime() / 1000);
    const endUnix = Math.floor(end.getTime() / 1000);

    // Only query OpenSky if the time window is recent enough
    // Anonymous: ~1 hour. Authenticated: ~30 days.
    const hourAgo = Math.floor(Date.now() / 1000) - 3600;
    const hasAuth = !!(process.env.OPENSKY_USERNAME && process.env.OPENSKY_PASSWORD);
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 3600;

    const openskyAvailable = hasAuth ? startUnix > thirtyDaysAgo : startUnix > hourAgo;

    if (openskyAvailable) {
      // Use 15-minute intervals, but cap at 4 requests to avoid rate limiting
      const windowMinutes = (endUnix - startUnix) / 60;
      const interval = Math.max(15, Math.ceil(windowMinutes / 4));

      const osFlights = await fetchHistoricalWindow(
        latitude,
        longitude,
        radiusNm,
        startUnix,
        endUnix,
        interval,
        ALTITUDE_TIERS.SUB_CONTRAIL
      );

      for (const flight of osFlights) {
        const hex = flight.icao_hex.toUpperCase();
        if (matchedByHex.has(hex)) continue;

        const dist = distanceNm(latitude, longitude, flight.latitude, flight.longitude);

        matchedByHex.set(hex, {
          streak_report_id: reportId,
          icao_hex: hex,
          tail_number: null, // OpenSky doesn't provide registration
          callsign: flight.callsign,
          operator: null,
          aircraft_type: null,
          latitude: flight.latitude,
          longitude: flight.longitude,
          altitude_ft: flight.altitude_ft,
          speed_kts: flight.speed_kts,
          heading: flight.heading,
          altitude_tier: getAltitudeTier(flight.altitude_ft),
          distance_nm: Math.round(dist * 100) / 100,
          is_known_operator: false,
          data_source: "opensky",
          observed_at: new Date(flight.observed_at * 1000).toISOString(),
        });

        totalFromOpenSky++;
      }

      anySourceSucceeded = true;
    }
  } catch (err) {
    console.error("Streak correlation — OpenSky query failed:", err);
  }

  // ----- Enrich with contrail weather assessment -----
  try {
    // Get weather at the report location for contrail assessment
    for (const [, match] of matchedByHex) {
      if (match.altitude_ft && match.altitude_ft >= ALTITUDE_TIERS.CONTRAIL_ZONE) {
        const weather = await fetchWeatherAtPoint(
          latitude,
          longitude,
          match.altitude_ft
        );
        match.contrail_possible = weather.contrail_assessment.likely;
        match.contrail_assessment = weather.contrail_assessment.reason;
        // Only assess weather once — same location, similar altitude conditions
        break;
      }
    }

    // Apply the same weather assessment to all contrail-zone flights
    // (they're in roughly the same area, same altitude band)
    let sharedAssessment: { possible: boolean; reason: string } | null = null;
    for (const [, match] of matchedByHex) {
      if (match.contrail_possible !== undefined && match.contrail_possible !== null) {
        sharedAssessment = {
          possible: match.contrail_possible,
          reason: match.contrail_assessment || "",
        };
        break;
      }
    }

    if (sharedAssessment) {
      for (const [, match] of matchedByHex) {
        if (match.altitude_tier === "contrail_zone" && match.contrail_possible === undefined) {
          match.contrail_possible = sharedAssessment.possible;
          match.contrail_assessment = sharedAssessment.reason;
        }
      }
    }
  } catch (err) {
    console.error("Streak correlation — weather assessment failed:", err);
  }

  // ----- Store results -----
  const allMatches = Array.from(matchedByHex.values());

  if (allMatches.length > 0) {
    await insertMatchedFlights(allMatches);
  }

  const status = !anySourceSucceeded
    ? "failed"
    : totalFromPositions > 0 || totalFromOpenSky > 0
      ? "complete"
      : "partial"; // Only live data, no historical

  await updateStreakReportCorrelation(reportId, status, allMatches.length);

  return {
    reportId,
    matchedFlights: allMatches,
    totalFromPositions,
    totalFromLive,
    totalFromOpenSky,
    status,
  };
}
