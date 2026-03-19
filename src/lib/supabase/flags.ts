import { createClient } from "./client";

export interface FlightFlag {
  id: string;
  tail_number: string;
  icao_hex: string | null;
  reason: string;
  reporter_notes: string | null;
  latitude: number | null;
  longitude: number | null;
  altitude_ft: number | null;
  observation_type: string;
  flag_count: number;
  first_flagged_at: string;
  last_flagged_at: string;
  created_at: string;
}

const supabase = createClient();

/**
 * Check if a tail number or ICAO hex has been flagged before.
 */
export async function getFlag(
  tailNumber?: string,
  icaoHex?: string
): Promise<FlightFlag | null> {
  if (!tailNumber && !icaoHex) return null;

  let query = supabase.from("flight_flags").select("*");

  if (tailNumber) {
    query = query.eq("tail_number", tailNumber.toUpperCase());
  } else if (icaoHex) {
    query = query.eq("icao_hex", icaoHex.toUpperCase());
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error) {
    console.error("Error checking flag:", error);
    return null;
  }

  return data as FlightFlag | null;
}

/**
 * Get all flagged aircraft, sorted by most flagged.
 */
export async function getAllFlags(): Promise<FlightFlag[]> {
  const { data, error } = await supabase
    .from("flight_flags")
    .select("*")
    .order("flag_count", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Error fetching flags:", error);
    return [];
  }

  return data as FlightFlag[];
}

/**
 * Flag an aircraft. If already flagged, increment the count.
 */
export async function flagAircraft(params: {
  tail_number: string;
  icao_hex?: string;
  reason: string;
  reporter_notes?: string;
  latitude?: number;
  longitude?: number;
  altitude_ft?: number;
}): Promise<FlightFlag | null> {
  const tailUpper = params.tail_number.toUpperCase();

  // Check if already flagged
  const existing = await getFlag(tailUpper);

  if (existing) {
    // Increment flag count
    const { data, error } = await supabase
      .from("flight_flags")
      .update({
        flag_count: existing.flag_count + 1,
        last_flagged_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating flag:", error);
      return null;
    }
    return data as FlightFlag;
  }

  // Create new flag
  const { data, error } = await supabase
    .from("flight_flags")
    .insert({
      tail_number: tailUpper,
      icao_hex: params.icao_hex?.toUpperCase() || null,
      reason: params.reason,
      reporter_notes: params.reporter_notes || null,
      latitude: params.latitude || null,
      longitude: params.longitude || null,
      altitude_ft: params.altitude_ft || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating flag:", error);
    return null;
  }

  return data as FlightFlag;
}
