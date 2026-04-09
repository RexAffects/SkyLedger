import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getStreakReport } from "@/lib/supabase/streak";
import { correlateStreakReport } from "@/lib/streak/correlate";

/**
 * POST /api/streak/correlate
 * Re-run or manually trigger correlation for a streak report.
 * Admin only — used to retry failed correlations or re-run with updated data.
 *
 * Body: { report_id: string }
 */
export async function POST(request: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.report_id) {
      return NextResponse.json(
        { error: "report_id is required" },
        { status: 400 }
      );
    }

    const report = await getStreakReport(body.report_id);
    if (!report) {
      return NextResponse.json(
        { error: "Streak report not found" },
        { status: 404 }
      );
    }

    const result = await correlateStreakReport(
      report.id,
      report.latitude,
      report.longitude,
      report.observed_at,
      report.estimated_age
    );

    return NextResponse.json({
      success: true,
      report_id: report.id,
      status: result.status,
      matched_flights: result.matchedFlights.length,
      sources: {
        flight_positions: result.totalFromPositions,
        live_adsb: result.totalFromLive,
        opensky: result.totalFromOpenSky,
      },
    });
  } catch (err) {
    console.error("Manual correlation error:", err);
    return NextResponse.json(
      { error: "Correlation failed" },
      { status: 500 }
    );
  }
}
