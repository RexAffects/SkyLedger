import { NextRequest, NextResponse } from "next/server";
import {
  insertPositions,
  updateSummaries,
  getFlightHistory,
  purgeOldPositions,
  type FlightPosition,
} from "@/lib/supabase/flight-history";

/**
 * POST /api/flight-history
 * Called by the flight layer every 60 seconds with qualifying flight positions.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: "Body must be a non-empty array of positions" },
        { status: 400 }
      );
    }

    // Validate and sanitize
    const VALID_REASONS = [
      "known_operator",
      "community_flagged",
      "high_suspicion",
      "manual_pin",
    ];

    const positions: FlightPosition[] = body
      .filter(
        (p: Record<string, unknown>) =>
          p.icao_hex &&
          typeof p.latitude === "number" &&
          typeof p.longitude === "number" &&
          typeof p.track_reason === "string" &&
          VALID_REASONS.includes(p.track_reason as string)
      )
      .slice(0, 50) // Cap at 50 per request
      .map((p: Record<string, unknown>) => ({
        icao_hex: String(p.icao_hex),
        tail_number: p.tail_number ? String(p.tail_number) : null,
        callsign: p.callsign ? String(p.callsign) : null,
        latitude: Number(p.latitude),
        longitude: Number(p.longitude),
        altitude_ft: typeof p.altitude_ft === "number" ? p.altitude_ft : null,
        speed_kts: typeof p.speed_kts === "number" ? p.speed_kts : null,
        heading: typeof p.heading === "number" ? p.heading : null,
        track_reason: String(p.track_reason),
        suspicion_score:
          typeof p.suspicion_score === "number" ? p.suspicion_score : null,
      }));

    if (positions.length === 0) {
      return NextResponse.json({ inserted: 0 });
    }

    // Insert positions + update summaries in parallel
    const [inserted] = await Promise.all([
      insertPositions(positions),
      updateSummaries(positions),
    ]);

    // Lazy cleanup: ~1% chance per request, purge old positions
    if (Math.random() < 0.01) {
      purgeOldPositions().catch(console.error);
    }

    return NextResponse.json({ inserted });
  } catch (err) {
    console.error("Flight history POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/flight-history?tail=N12345
 * Returns summary + last 90 days of positions for one aircraft.
 */
export async function GET(request: NextRequest) {
  const tail = request.nextUrl.searchParams.get("tail");

  if (!tail) {
    return NextResponse.json(
      { error: "Missing ?tail= parameter" },
      { status: 400 }
    );
  }

  try {
    const result = await getFlightHistory(tail);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Flight history GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
