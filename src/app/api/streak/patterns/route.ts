import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { analyzePatterns } from "@/lib/streak/patterns";
import { getStreakReports, getMatchedFlights } from "@/lib/supabase/streak";

/**
 * GET /api/streak/patterns
 * Admin-only endpoint returning pattern analysis data.
 * Powers the internal streak detection dashboard.
 */
export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [patterns, recentReports] = await Promise.all([
      analyzePatterns(),
      getStreakReports(20),
    ]);

    // Enrich recent reports with their matched flights
    const reportsWithMatches = await Promise.all(
      recentReports.map(async (report) => {
        const matches = await getMatchedFlights(report.id);
        return {
          ...report,
          matched_flights: matches,
        };
      })
    );

    return NextResponse.json({
      patterns,
      recent_reports: reportsWithMatches,
    });
  } catch (err) {
    console.error("Pattern analysis error:", err);
    return NextResponse.json(
      { error: "Failed to analyze patterns" },
      { status: 500 }
    );
  }
}
