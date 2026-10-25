import { createServiceClient } from "@/lib/supabase/server";

/**
 * Database-backed per-reporter submission limits.
 *
 * Counts rows in `table` for this reporter_hash in the last hour / day.
 * Shared across all Vercel instances (unlike the in-memory limiter), so it is
 * the real ceiling on how much one IP can put into the database. Mirrors the
 * limits the flag system has had since launch (src/lib/supabase/flags.ts).
 *
 * The reporter hash rotates daily (ip + salt + date), so "daily" effectively
 * means "since midnight UTC". Accepted trade-off for not storing IPs.
 */

export interface SubmissionLimits {
  hourly: number;
  daily: number;
}

export interface SubmissionLimitResult {
  allowed: boolean;
  reason?: string;
  /** True when the check could not run (e.g. column missing). Caller decides. */
  skipped?: boolean;
}

// Same defaults as flags; override per-table via env if ever needed
export const DEFAULT_SUBMISSION_LIMITS: SubmissionLimits = {
  hourly: parseInt(process.env.RATE_HOURLY_LIMIT || "5"),
  daily: parseInt(process.env.RATE_DAILY_LIMIT || "20"),
};

export async function checkSubmissionLimits(
  table: "citizen_reports" | "streak_reports",
  reporterHash: string,
  limits: SubmissionLimits = DEFAULT_SUBMISSION_LIMITS
): Promise<SubmissionLimitResult> {
  const supabase = createServiceClient();
  const now = Date.now();
  const hourAgo = new Date(now - 60 * 60 * 1000).toISOString();
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();

  const [hourly, daily] = await Promise.all([
    supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("reporter_hash", reporterHash)
      .gte("created_at", hourAgo),
    supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("reporter_hash", reporterHash)
      .gte("created_at", dayAgo),
  ]);

  const error = hourly.error ?? daily.error;
  if (error) {
    // Most likely cause: migration 007 not applied yet (reporter_hash column
    // missing on citizen_reports). Loud log; the in-memory limit still applies.
    console.error(
      `[security] submission limit check skipped for ${table}: ${error.message}`
    );
    return { allowed: true, skipped: true };
  }

  if ((hourly.count ?? 0) >= limits.hourly) {
    return {
      allowed: false,
      reason:
        "You've submitted several reports in the last hour. Please wait a bit and try again.",
    };
  }
  if ((daily.count ?? 0) >= limits.daily) {
    return {
      allowed: false,
      reason: "Daily report limit reached. Please try again tomorrow.",
    };
  }
  return { allowed: true };
}
