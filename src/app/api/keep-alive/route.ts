import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 10;

// Supabase pauses a Free project after ~7 days without "sufficient user
// database activity" — their guidance is a few requests per day, so we touch
// several tables rather than one.
const TABLES = ["citizen_reports", "flight_flags", "faa_cache"] as const;

/**
 * Keep-alive endpoint that prevents Supabase from pausing due to inactivity.
 *
 * Called daily by Vercel Cron (primary, see vercel.json) and by the
 * GitHub Actions workflow (backup, see .github/workflows/supabase-keep-alive.yml).
 * Vercel Cron sends CRON_SECRET; GitHub Actions sends KEEP_ALIVE_SECRET.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const accepted = [process.env.CRON_SECRET, process.env.KEEP_ALIVE_SECRET]
    .filter(Boolean)
    .map((token) => `Bearer ${token}`);

  if (accepted.length > 0 && !accepted.includes(authHeader ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    // Count-only queries: real database activity, column-name agnostic, cheap.
    const results = await Promise.all(
      TABLES.map(async (table) => {
        const { error } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });
        return { table, ok: !error, error: error?.message };
      })
    );

    const failed = results.filter((r) => !r.ok);

    // Only fail if every query failed — that means the database is genuinely
    // unreachable. A single bad table shouldn't mask a successful ping.
    if (failed.length === results.length) {
      console.error("Keep-alive: all queries failed", failed);
      return NextResponse.json(
        { ok: false, error: failed[0]?.error ?? "All queries failed" },
        { status: 500 }
      );
    }

    if (failed.length > 0) {
      console.warn("Keep-alive: some queries failed", failed);
    }

    console.log(`Keep-alive ping successful (${results.length - failed.length}/${results.length} tables)`);
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      queried: results.length - failed.length,
      message: "Supabase connection active",
    });
  } catch (err) {
    console.error("Keep-alive error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
