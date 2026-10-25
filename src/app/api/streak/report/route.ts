import { NextRequest, NextResponse } from "next/server";
import { hashReporter, getClientIp } from "@/lib/utils/ip-hash";
import { insertStreakReport } from "@/lib/supabase/streak";
import { correlateStreakReport } from "@/lib/streak/correlate";
import { fetchWeatherAtPoint } from "@/lib/api/weather";
import { checkSubmissionLimits } from "@/lib/security/submission-limits";
import {
  STREAK_ESTIMATED_AGES,
  STREAK_PATTERN_TYPES,
  STREAK_SEVERITIES,
  STREAK_TRAIL_STATES,
} from "@/lib/constants";

const validAges = STREAK_ESTIMATED_AGES.map((a) => a.value);
const validPatterns = STREAK_PATTERN_TYPES.map((p) => p.value);
const validSeverities = STREAK_SEVERITIES.map((s) => s.value);
const validTrailStates = STREAK_TRAIL_STATES.map((t) => t.value);

function isValidCoordinate(lat: unknown, lon: unknown): boolean {
  return (
    typeof lat === "number" &&
    typeof lon === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180
  );
}

/**
 * POST /api/streak/report
 * Submit a streak observation and trigger retroactive correlation.
 *
 * Body: { latitude, longitude, estimated_age, pattern_type, severity?, trail_state?, notes?, dark_aircraft_estimate? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.latitude || !body.longitude || !isValidCoordinate(body.latitude, body.longitude)) {
      return NextResponse.json(
        { error: "latitude and longitude are required" },
        { status: 400 }
      );
    }

    if (!body.estimated_age || !validAges.includes(body.estimated_age)) {
      return NextResponse.json(
        { error: "Invalid estimated_age. Must be one of: " + validAges.join(", ") },
        { status: 400 }
      );
    }

    if (!body.pattern_type || !validPatterns.includes(body.pattern_type)) {
      return NextResponse.json(
        { error: "Invalid pattern_type. Must be one of: " + validPatterns.join(", ") },
        { status: 400 }
      );
    }

    if (body.notes && (typeof body.notes !== "string" || body.notes.length > 500)) {
      return NextResponse.json(
        { error: "Notes must be 500 characters or fewer" },
        { status: 400 }
      );
    }

    if (body.severity && !validSeverities.includes(body.severity)) {
      return NextResponse.json({ error: "Invalid severity" }, { status: 400 });
    }

    if (body.trail_state && !validTrailStates.includes(body.trail_state)) {
      return NextResponse.json({ error: "Invalid trail_state" }, { status: 400 });
    }

    if (
      body.dark_aircraft_estimate != null &&
      (!Number.isInteger(body.dark_aircraft_estimate) ||
        body.dark_aircraft_estimate < 0 ||
        body.dark_aircraft_estimate > 1000)
    ) {
      return NextResponse.json({ error: "Invalid dark_aircraft_estimate" }, { status: 400 });
    }

    // Hash reporter IP
    const ip = getClientIp(request);
    const reporterHash = hashReporter(ip);

    // Per-reporter hourly/daily limits (same as flags and citizen reports).
    // Added 2026-10-25; see docs/security/2026-10-25-abuse-hardening.md.
    const limit = await checkSubmissionLimits("streak_reports", reporterHash);
    if (!limit.allowed) {
      return NextResponse.json({ error: limit.reason }, { status: 429 });
    }

    // Fetch weather data for the location (non-blocking enrichment)
    let weatherData: Record<string, unknown> | null = null;
    try {
      const weather = await fetchWeatherAtPoint(body.latitude, body.longitude, 30000);
      weatherData = weather as unknown as Record<string, unknown>;
    } catch {
      // Weather enrichment is optional
    }

    // Insert the streak report
    const observedAt = new Date().toISOString();
    const report = await insertStreakReport({
      reporter_hash: reporterHash,
      latitude: body.latitude,
      longitude: body.longitude,
      observed_at: observedAt,
      estimated_age: body.estimated_age,
      pattern_type: body.pattern_type,
      severity: body.severity || "moderate",
      trail_state: body.trail_state || "sharp",
      notes: body.notes || null,
      weather_data: weatherData,
      dark_aircraft_estimate: body.dark_aircraft_estimate || null,
    });

    if (!report) {
      return NextResponse.json(
        { error: "Failed to record streak report" },
        { status: 500 }
      );
    }

    // Trigger correlation asynchronously — don't block the response
    correlateStreakReport(
      report.id,
      body.latitude,
      body.longitude,
      observedAt,
      body.estimated_age
    ).catch((err) => {
      console.error("Background correlation failed for report", report.id, err);
    });

    return NextResponse.json({
      success: true,
      report_id: report.id,
      message: "Streak report recorded. Correlation is running in the background.",
      correlation_status: "pending",
    });
  } catch (err) {
    console.error("Streak report submission error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
