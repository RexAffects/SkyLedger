import { createServiceClient } from "./server";

export interface LLCLookup {
  id: string;
  owner_name: string;
  owner_state: string | null;
  entity_type: string | null;
  pierced_owner: string | null;
  pierced_source: string | null;
  registered_agent: string | null;
  formation_state: string | null;
  state_registry_url: string | null;
  status: "pending" | "found" | "dead_end";
  confidence: "low" | "medium" | "high" | "confirmed" | null;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

/**
 * Look up an LLC entry by normalized (lowercase) owner name.
 * Returns null if not found or expired.
 */
export async function getLLCLookup(
  ownerName: string
): Promise<LLCLookup | null> {
  const supabase = createServiceClient();
  const normalized = ownerName.toLowerCase().trim();

  const { data, error } = await supabase
    .from("llc_lookups")
    .select("*")
    .ilike("owner_name", normalized)
    .maybeSingle();

  if (error || !data) return null;

  // Check if expired
  if (new Date(data.expires_at) < new Date()) return null;

  return data as LLCLookup;
}

/**
 * Create a pending LLC lookup entry.
 * If one already exists for this owner name, returns the existing one.
 */
export async function createPendingLLCLookup(
  ownerName: string,
  ownerState: string | null,
  entityType: string | null,
  stateRegistryUrl: string | null
): Promise<LLCLookup | null> {
  const supabase = createServiceClient();
  const normalized = ownerName.toLowerCase().trim();

  // Check if one already exists
  const existing = await getLLCLookup(ownerName);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("llc_lookups")
    .insert({
      owner_name: normalized,
      owner_state: ownerState,
      entity_type: entityType,
      state_registry_url: stateRegistryUrl,
      status: "pending",
      confidence: "low",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating LLC lookup:", error);
    return null;
  }

  return data as LLCLookup;
}

/**
 * Update an LLC lookup with pierced ownership info.
 */
export async function updateLLCLookup(
  ownerName: string,
  updates: {
    pierced_owner?: string;
    pierced_source?: string;
    registered_agent?: string;
    formation_state?: string;
    status?: "pending" | "found" | "dead_end";
    confidence?: "low" | "medium" | "high" | "confirmed";
  }
): Promise<LLCLookup | null> {
  const supabase = createServiceClient();
  const normalized = ownerName.toLowerCase().trim();

  const { data, error } = await supabase
    .from("llc_lookups")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .ilike("owner_name", normalized)
    .select()
    .single();

  if (error) {
    console.error("Error updating LLC lookup:", error);
    return null;
  }

  return data as LLCLookup;
}
