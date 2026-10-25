import { NextResponse } from "next/server";
import { runHealthChecks, type HealthReport } from "@/lib/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

// Public endpoint, so cache the last result briefly per instance — otherwise
// anyone hammering it would get our server IP rate-limited by the ADS-B feeds.
const CACHE_MS = 30_000;
let cached: { at: number; report: HealthReport } | null = null;

/**
 * GET /api/health
 *
 * For uptime monitors (e.g. UptimeRobot). Returns 503 when the radar is
 * broken OR the primary flight feed (ADSB.lol) is failing — even if the
 * adsb.fi fallback is covering for it, because the fallback has tight rate
 * limits and shouldn't carry the site for long.
 */
export async function GET() {
  if (!cached || Date.now() - cached.at > CACHE_MS) {
    cached = { at: Date.now(), report: await runHealthChecks() };
  }
  const { report } = cached;

  const primaryOk = report.flight_feed.providers[0]?.ok ?? false;
  const httpStatus = report.status === "down" || !primaryOk ? 503 : 200;

  // Don't leak raw database error text publicly; the cron email has it.
  const publicReport = {
    ...report,
    database: { ok: report.database.ok, ms: report.database.ms },
    problems: report.problems.map((p) =>
      p.startsWith("Database") ? "Database check failed" : p
    ),
  };

  return NextResponse.json(publicReport, {
    status: httpStatus,
    headers: { "Cache-Control": "no-store" },
  });
}
