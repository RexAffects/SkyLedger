import { createServiceClient } from "./server";

// ============================================================
// TYPES
// ============================================================

export interface FlightPosition {
  icao_hex: string;
  tail_number?: string | null;
  callsign?: string | null;
  latitude: number;
  longitude: number;
  altitude_ft?: number | null;
  speed_kts?: number | null;
  heading?: number | null;
  track_reason: string;
  suspicion_score?: number | null;
}

export interface FlightSummary {
  id: string;
  tail_number: string;
  icao_hex: string | null;
  total_sightings: number;
  total_days_seen: number;
  first_seen_at: string;
  last_seen_at: string;
  primary_region: string | null;
  avg_altitude_ft: number | null;
  common_times: Record<string, number>;
  track_reason: string | null;
  updated_at: string;
}

export interface FlightHistoryResult {
  summary: FlightSummary | null;
  positions: Array<{
    latitude: number;
    longitude: number;
    altitude_ft: number | null;
    speed_kts: number | null;
    heading: number | null;
    observed_at: string;
  }>;
}

// ============================================================
// BATCH INSERT POSITIONS
// ============================================================

export async function insertPositions(
  positions: FlightPosition[]
): Promise<number> {
  if (positions.length === 0) return 0;

  const supabase = createServiceClient();

  // Deduplicate: check which hex codes were recorded in last 55 seconds
  const hexCodes = [...new Set(positions.map((p) => p.icao_hex))];
  const cutoff = new Date(Date.now() - 55 * 1000).toISOString();

  const { data: recent } = await supabase
    .from("flight_positions")
    .select("icao_hex")
    .in("icao_hex", hexCodes)
    .gte("observed_at", cutoff);

  const recentHexes = new Set((recent || []).map((r: { icao_hex: string }) => r.icao_hex));
  const newPositions = positions.filter((p) => !recentHexes.has(p.icao_hex));

  if (newPositions.length === 0) return 0;

  const rows = newPositions.map((p) => ({
    icao_hex: p.icao_hex,
    tail_number: p.tail_number || null,
    callsign: p.callsign || null,
    latitude: p.latitude,
    longitude: p.longitude,
    altitude_ft: p.altitude_ft ?? null,
    speed_kts: p.speed_kts ?? null,
    heading: p.heading ?? null,
    track_reason: p.track_reason,
    suspicion_score: p.suspicion_score ?? null,
  }));

  const { error } = await supabase.from("flight_positions").insert(rows);

  if (error) {
    console.error("Error inserting flight positions:", error);
    return 0;
  }

  return newPositions.length;
}

// ============================================================
// UPDATE SUMMARIES
// ============================================================

export async function updateSummaries(
  positions: FlightPosition[]
): Promise<void> {
  if (positions.length === 0) return;

  const supabase = createServiceClient();

  // Group by tail_number (skip positions without one)
  const byTail = new Map<string, FlightPosition[]>();
  for (const p of positions) {
    const tail = p.tail_number?.toUpperCase();
    if (!tail) continue;
    const existing = byTail.get(tail) || [];
    existing.push(p);
    byTail.set(tail, existing);
  }

  for (const [tail, tailPositions] of byTail) {
    const firstPos = tailPositions[0];
    const avgAlt = Math.round(
      tailPositions.reduce((sum, p) => sum + (p.altitude_ft || 0), 0) /
        tailPositions.length
    );

    // Determine time-of-day bucket
    const hour = new Date().getUTCHours();
    let timeBucket: string;
    if (hour >= 5 && hour < 12) timeBucket = "morning";
    else if (hour >= 12 && hour < 17) timeBucket = "afternoon";
    else if (hour >= 17 && hour < 21) timeBucket = "evening";
    else timeBucket = "night";

    // Check if summary exists
    const { data: existing } = await supabase
      .from("flight_summaries")
      .select("*")
      .eq("tail_number", tail)
      .maybeSingle();

    if (existing) {
      // Update existing summary
      const commonTimes = (existing.common_times as Record<string, number>) || {};
      commonTimes[timeBucket] = (commonTimes[timeBucket] || 0) + 1;

      // Count distinct days: check if we already recorded today
      const today = new Date().toISOString().split("T")[0];
      const lastSeenDate = existing.last_seen_at
        ? new Date(existing.last_seen_at).toISOString().split("T")[0]
        : null;
      const newDay = lastSeenDate !== today ? 1 : 0;

      // Running average altitude
      const newAvgAlt = existing.avg_altitude_ft
        ? Math.round(
            (existing.avg_altitude_ft * existing.total_sightings + avgAlt) /
              (existing.total_sightings + tailPositions.length)
          )
        : avgAlt;

      const { error } = await supabase
        .from("flight_summaries")
        .update({
          icao_hex: firstPos.icao_hex || existing.icao_hex,
          total_sightings: existing.total_sightings + tailPositions.length,
          total_days_seen: existing.total_days_seen + newDay,
          last_seen_at: new Date().toISOString(),
          avg_altitude_ft: newAvgAlt,
          common_times: commonTimes,
          track_reason: firstPos.track_reason || existing.track_reason,
          updated_at: new Date().toISOString(),
        })
        .eq("tail_number", tail);

      if (error) {
        console.error(`Error updating summary for ${tail}:`, error);
      }
    } else {
      // Create new summary
      const commonTimes: Record<string, number> = { [timeBucket]: 1 };

      const { error } = await supabase.from("flight_summaries").insert({
        tail_number: tail,
        icao_hex: firstPos.icao_hex,
        total_sightings: tailPositions.length,
        total_days_seen: 1,
        first_seen_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        avg_altitude_ft: avgAlt,
        common_times: commonTimes,
        track_reason: firstPos.track_reason,
      });

      if (error) {
        console.error(`Error creating summary for ${tail}:`, error);
      }
    }
  }
}

// ============================================================
// GET HISTORY FOR ONE AIRCRAFT
// ============================================================

export async function getFlightHistory(
  tailNumber: string
): Promise<FlightHistoryResult> {
  const supabase = createServiceClient();
  const tail = tailNumber.toUpperCase();

  // Get summary
  const { data: summary } = await supabase
    .from("flight_summaries")
    .select("*")
    .eq("tail_number", tail)
    .maybeSingle();

  // Get positions from last 90 days
  const ninetyDaysAgo = new Date(
    Date.now() - 90 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: positions } = await supabase
    .from("flight_positions")
    .select("latitude, longitude, altitude_ft, speed_kts, heading, observed_at")
    .eq("tail_number", tail)
    .gte("observed_at", ninetyDaysAgo)
    .order("observed_at", { ascending: false })
    .limit(5000);

  return {
    summary: summary as FlightSummary | null,
    positions: (positions || []) as FlightHistoryResult["positions"],
  };
}

// ============================================================
// CLEANUP: purge positions older than 90 days
// ============================================================

export async function purgeOldPositions(): Promise<number> {
  const supabase = createServiceClient();
  const cutoff = new Date(
    Date.now() - 90 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { error } = await supabase
    .from("flight_positions")
    .delete()
    .lt("observed_at", cutoff);

  if (error) {
    console.error("Error purging old positions:", error);
    return 0;
  }
  return 1; // Success (exact count not needed for cleanup)
}
