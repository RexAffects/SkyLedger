import { createServiceClient } from "./server";

// ============================================================
// TYPES
// ============================================================

export interface StreakReport {
  id: string;
  reporter_hash: string;
  latitude: number;
  longitude: number;
  observed_at: string;
  estimated_age: string;
  pattern_type: string;
  severity: string;
  trail_state: string;
  notes: string | null;
  photo_url: string | null;
  weather_data: Record<string, unknown> | null;
  correlation_status: string;
  matched_flight_count: number;
  dark_aircraft_estimate: number | null;
  created_at: string;
}

export interface StreakMatchedFlight {
  id: string;
  streak_report_id: string;
  icao_hex: string;
  tail_number: string | null;
  callsign: string | null;
  operator: string | null;
  aircraft_type: string | null;
  aircraft_description: string | null;
  latitude: number;
  longitude: number;
  altitude_ft: number | null;
  speed_kts: number | null;
  heading: number | null;
  altitude_tier: string;
  distance_nm: number | null;
  is_known_operator: boolean;
  operator_notes: string | null;
  data_source: string;
  contrail_possible: boolean | null;
  contrail_assessment: string | null;
  observed_at: string;
  created_at: string;
}

export interface InsertStreakReport {
  reporter_hash: string;
  latitude: number;
  longitude: number;
  observed_at: string;
  estimated_age: string;
  pattern_type: string;
  severity?: string;
  trail_state?: string;
  notes?: string | null;
  photo_url?: string | null;
  weather_data?: Record<string, unknown> | null;
  dark_aircraft_estimate?: number | null;
}

export interface InsertMatchedFlight {
  streak_report_id: string;
  icao_hex: string;
  tail_number?: string | null;
  callsign?: string | null;
  operator?: string | null;
  aircraft_type?: string | null;
  aircraft_description?: string | null;
  latitude: number;
  longitude: number;
  altitude_ft?: number | null;
  speed_kts?: number | null;
  heading?: number | null;
  altitude_tier: string;
  distance_nm?: number | null;
  is_known_operator?: boolean;
  operator_notes?: string | null;
  data_source: string;
  contrail_possible?: boolean | null;
  contrail_assessment?: string | null;
  observed_at: string;
}

// ============================================================
// STREAK REPORT OPERATIONS
// ============================================================

export async function insertStreakReport(
  report: InsertStreakReport
): Promise<StreakReport | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("streak_reports")
    .insert({
      reporter_hash: report.reporter_hash,
      latitude: report.latitude,
      longitude: report.longitude,
      observed_at: report.observed_at,
      estimated_age: report.estimated_age,
      pattern_type: report.pattern_type,
      severity: report.severity || "moderate",
      trail_state: report.trail_state || "sharp",
      notes: report.notes || null,
      photo_url: report.photo_url || null,
      weather_data: report.weather_data || null,
      dark_aircraft_estimate: report.dark_aircraft_estimate || null,
      correlation_status: "pending",
      matched_flight_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error inserting streak report:", error);
    return null;
  }
  return data as StreakReport;
}

export async function updateStreakReportCorrelation(
  reportId: string,
  status: string,
  matchedCount: number
): Promise<void> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("streak_reports")
    .update({
      correlation_status: status,
      matched_flight_count: matchedCount,
    })
    .eq("id", reportId);

  if (error) {
    console.error("Error updating streak report correlation:", error);
  }
}

export async function getStreakReport(id: string): Promise<StreakReport | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("streak_reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching streak report:", error);
    return null;
  }
  return data as StreakReport;
}

export async function getStreakReports(limit: number = 50): Promise<StreakReport[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("streak_reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching streak reports:", error);
    return [];
  }
  return data as StreakReport[];
}

// ============================================================
// MATCHED FLIGHT OPERATIONS
// ============================================================

export async function insertMatchedFlights(
  flights: InsertMatchedFlight[]
): Promise<number> {
  if (flights.length === 0) return 0;

  const supabase = createServiceClient();

  const { error } = await supabase
    .from("streak_matched_flights")
    .insert(flights);

  if (error) {
    console.error("Error inserting matched flights:", error);
    return 0;
  }
  return flights.length;
}

export async function getMatchedFlights(
  reportId: string
): Promise<StreakMatchedFlight[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("streak_matched_flights")
    .select("*")
    .eq("streak_report_id", reportId)
    .order("distance_nm", { ascending: true });

  if (error) {
    console.error("Error fetching matched flights:", error);
    return [];
  }
  return data as StreakMatchedFlight[];
}

// ============================================================
// HISTORICAL FLIGHT POSITIONS QUERY
// ============================================================

/**
 * Query our own flight_positions table for aircraft that were in the
 * area during the time window. This covers aircraft we were already
 * tracking (known operators, flagged aircraft, high suspicion).
 */
export async function queryHistoricalPositions(
  lat: number,
  lon: number,
  radiusNm: number,
  startTime: string,
  endTime: string,
  minAltitudeFt: number = 10000
): Promise<Array<{
  icao_hex: string;
  tail_number: string | null;
  callsign: string | null;
  latitude: number;
  longitude: number;
  altitude_ft: number | null;
  speed_kts: number | null;
  heading: number | null;
  track_reason: string;
  observed_at: string;
}>> {
  const supabase = createServiceClient();

  // Convert radius to approximate lat/lon bounds
  const latDelta = radiusNm / 60;
  const lonDelta = radiusNm / (60 * Math.cos((lat * Math.PI) / 180));

  const { data, error } = await supabase
    .from("flight_positions")
    .select("icao_hex, tail_number, callsign, latitude, longitude, altitude_ft, speed_kts, heading, track_reason, observed_at")
    .gte("observed_at", startTime)
    .lte("observed_at", endTime)
    .gte("latitude", lat - latDelta)
    .lte("latitude", lat + latDelta)
    .gte("longitude", lon - lonDelta)
    .lte("longitude", lon + lonDelta)
    .gte("altitude_ft", minAltitudeFt)
    .order("observed_at", { ascending: false });

  if (error) {
    console.error("Error querying historical positions:", error);
    return [];
  }

  return data || [];
}

// ============================================================
// PATTERN ANALYSIS QUERIES (Admin)
// ============================================================

/**
 * Get operators ranked by streak correlation frequency.
 * Returns operators who appear in streak-correlated flights,
 * ordered by how many unique streak reports they appear in.
 */
export async function getOperatorCorrelations(): Promise<Array<{
  operator: string;
  tail_number: string | null;
  icao_hex: string;
  streak_appearances: number;
  is_known_operator: boolean;
  avg_altitude_ft: number;
  last_correlated: string;
  first_correlated: string;
}>> {
  const supabase = createServiceClient();

  // Get all matched flights grouped by operator/hex
  const { data, error } = await supabase
    .from("streak_matched_flights")
    .select("icao_hex, tail_number, operator, is_known_operator, altitude_ft, streak_report_id, created_at");

  if (error) {
    console.error("Error fetching operator correlations:", error);
    return [];
  }

  if (!data || data.length === 0) return [];

  // Aggregate: group by icao_hex, count unique streak_report_ids
  const byHex = new Map<string, {
    operator: string;
    tail_number: string | null;
    icao_hex: string;
    report_ids: Set<string>;
    is_known_operator: boolean;
    altitudes: number[];
    first_correlated: string;
    last_correlated: string;
  }>();

  for (const row of data) {
    const key = row.icao_hex;
    const existing = byHex.get(key);

    if (existing) {
      existing.report_ids.add(row.streak_report_id);
      if (row.altitude_ft) existing.altitudes.push(row.altitude_ft);
      if (row.created_at < existing.first_correlated) existing.first_correlated = row.created_at;
      if (row.created_at > existing.last_correlated) existing.last_correlated = row.created_at;
      if (row.operator) existing.operator = row.operator;
      if (row.tail_number) existing.tail_number = row.tail_number;
      if (row.is_known_operator) existing.is_known_operator = true;
    } else {
      byHex.set(key, {
        operator: row.operator || "Unknown",
        tail_number: row.tail_number,
        icao_hex: key,
        report_ids: new Set([row.streak_report_id]),
        is_known_operator: row.is_known_operator || false,
        altitudes: row.altitude_ft ? [row.altitude_ft] : [],
        first_correlated: row.created_at,
        last_correlated: row.created_at,
      });
    }
  }

  // Convert to array, sort by streak appearances descending
  return Array.from(byHex.values())
    .map((entry) => ({
      operator: entry.operator,
      tail_number: entry.tail_number,
      icao_hex: entry.icao_hex,
      streak_appearances: entry.report_ids.size,
      is_known_operator: entry.is_known_operator,
      avg_altitude_ft: entry.altitudes.length > 0
        ? Math.round(entry.altitudes.reduce((a, b) => a + b, 0) / entry.altitudes.length)
        : 0,
      last_correlated: entry.last_correlated,
      first_correlated: entry.first_correlated,
    }))
    .sort((a, b) => b.streak_appearances - a.streak_appearances);
}

/**
 * Get streak report summary stats for admin dashboard.
 */
export async function getStreakStats(): Promise<{
  totalReports: number;
  thisWeek: number;
  totalMatchedFlights: number;
  avgMatchesPerReport: number;
  topPatternTypes: Record<string, number>;
  correlationStatuses: Record<string, number>;
}> {
  const supabase = createServiceClient();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [totalRes, weekRes, matchedRes, reportsData] = await Promise.all([
    supabase.from("streak_reports").select("id", { count: "exact", head: true }),
    supabase.from("streak_reports").select("id", { count: "exact", head: true }).gte("created_at", oneWeekAgo),
    supabase.from("streak_matched_flights").select("id", { count: "exact", head: true }),
    supabase.from("streak_reports").select("pattern_type, correlation_status, matched_flight_count"),
  ]);

  const total = totalRes.count ?? 0;
  const thisWeek = weekRes.count ?? 0;
  const totalMatched = matchedRes.count ?? 0;

  const reports = reportsData.data || [];
  const topPatternTypes: Record<string, number> = {};
  const correlationStatuses: Record<string, number> = {};
  let totalMatchCount = 0;

  for (const r of reports) {
    topPatternTypes[r.pattern_type] = (topPatternTypes[r.pattern_type] || 0) + 1;
    correlationStatuses[r.correlation_status] = (correlationStatuses[r.correlation_status] || 0) + 1;
    totalMatchCount += r.matched_flight_count || 0;
  }

  return {
    totalReports: total,
    thisWeek,
    totalMatchedFlights: totalMatched,
    avgMatchesPerReport: total > 0 ? Math.round(totalMatchCount / total) : 0,
    topPatternTypes,
    correlationStatuses,
  };
}
