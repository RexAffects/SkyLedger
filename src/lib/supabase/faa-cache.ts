import { createServiceClient } from "./server";
import type { FAARegistration } from "@/lib/api/faa";

/**
 * Check the faa_cache table for a cached registration lookup.
 * Returns null if not found or expired.
 */
export async function getCachedRegistration(
  tailNumber: string
): Promise<FAARegistration | null> {
  const supabase = createServiceClient();
  const tail = tailNumber.toUpperCase().replace(/^N/, "N"); // normalize

  const { data, error } = await supabase
    .from("faa_cache")
    .select("registration_data, expires_at")
    .eq("tail_number", tail)
    .maybeSingle();

  if (error || !data) return null;

  // Check if expired
  if (new Date(data.expires_at) < new Date()) return null;

  return data.registration_data as FAARegistration;
}

/**
 * Store an FAA registration lookup in the cache.
 * Upserts — updates if already present.
 */
export async function cacheRegistration(
  tailNumber: string,
  data: FAARegistration
): Promise<void> {
  const supabase = createServiceClient();
  const tail = tailNumber.toUpperCase();

  const { error } = await supabase.from("faa_cache").upsert(
    {
      tail_number: tail,
      registration_data: data,
      fetched_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    { onConflict: "tail_number" }
  );

  if (error) {
    console.error("Error caching FAA registration:", error);
  }
}
