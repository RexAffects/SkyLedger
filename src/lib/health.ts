import { PROVIDERS, queryProvider, type ProviderAttempt } from "@/lib/api/adsb";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Health checks for the things SkyLedger can't run without. Used by the
 * public /api/health endpoint (for uptime monitors) and the daily
 * /api/cron/health-check alert email.
 *
 * Why this exists: in Oct 2026 the radar was dead for an unknown stretch
 * because ADSB.lol started 403ing us, and nothing told anyone. See
 * docs/incidents/2026-10-25-flight-feed-403.md.
 */

// Fayetteville, AR — always has traffic, so a 0-aircraft answer is suspicious
// but not treated as failure (late-night lulls happen).
const PROBE = { lat: 36.06, lon: -94.16, radiusNm: 25 };

export type HealthStatus = "ok" | "degraded" | "down";

export interface HealthReport {
  /** ok = everything up; degraded = site works but on a fallback or a check failed; down = radar is broken */
  status: HealthStatus;
  checked_at: string;
  flight_feed: {
    /** Provider that would serve the radar right now, or null if none */
    serving: string | null;
    providers: ProviderAttempt[];
  };
  database: { ok: boolean; ms: number; error?: string };
  problems: string[];
}

async function checkDatabase(): Promise<HealthReport["database"]> {
  const started = Date.now();
  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from("citizen_reports")
      .select("*", { count: "exact", head: true });
    return error
      ? { ok: false, ms: Date.now() - started, error: error.message }
      : { ok: true, ms: Date.now() - started };
  } catch (err) {
    return {
      ok: false,
      ms: Date.now() - started,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function runHealthChecks(): Promise<HealthReport> {
  const [providers, database] = await Promise.all([
    // Every provider, not just until one works — we want to know if the
    // fallback is dead *before* the primary goes down.
    Promise.all(
      PROVIDERS.map(async (provider) => {
        const url = provider.nearby(PROBE.lat, PROBE.lon, PROBE.radiusNm);
        return (await queryProvider(provider, url, { cache: "no-store" })).attempt;
      })
    ),
    checkDatabase(),
  ]);

  const serving = providers.find((p) => p.ok)?.provider ?? null;
  const problems: string[] = [];

  for (const [i, p] of providers.entries()) {
    if (!p.ok) {
      problems.push(
        `${i === 0 ? "Primary" : "Fallback"} flight feed ${p.provider} failing: ${p.error}`
      );
    }
  }
  if (!database.ok) problems.push(`Database check failed: ${database.error}`);

  let status: HealthStatus = "ok";
  if (problems.length > 0) status = "degraded";
  if (!serving || !database.ok) status = "down";

  return {
    status,
    checked_at: new Date().toISOString(),
    flight_feed: { serving, providers },
    database,
    problems,
  };
}
