import { NextRequest, NextResponse } from "next/server";
import {
  insertPositions,
  updateSummaries,
  getFlightHistory,
  purgeOldPositions,
  type FlightPosition,
} from "@/lib/supabase/flight-history";
import { fetchNearbyFlights, FlightFeedError } from "@/lib/api/adsb";
import { distanceNm } from "@/lib/utils/geo";

/**
 * POST /api/flight-history
 * Called by the flight layer every 60 seconds with qualifying flight positions.
 *
 * Trust model (since 2026-10-25, see docs/security/2026-10-25-abuse-hardening.md):
 * the browser only NOMINATES aircraft (hex + why it qualifies). The server
 * looks each one up in the live ADS-B feed and records the feed's position,
 * not the browser's. Anything the feed can't see right now is dropped. That
 * makes fabricated flight history impossible rather than merely rate-limited.
 */

const VALID_REASONS = [
  "known_operator",
  "community_flagged",
  "high_suspicion",
  "manual_pin",
];

// A radar tick is 5–10s and the history post is every 60s, so a claimed
// position can lag the feed by ~a minute: 10 nm covers ~600 kts of drift.
const MAX_DRIFT_NM = 10;
// Radar radius options are 5–50 nm. Cap the verification query so one POST
// can't make us ask the feed for half the country.
const MAX_QUERY_RADIUS_NM = 100;
const QUERY_MARGIN_NM = 15;

interface Nomination {
  icao_hex: string;
  latitude: number;
  longitude: number;
  track_reason: string;
  suspicion_score: number | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: "Body must be a non-empty array of positions" },
        { status: 400 }
      );
    }

    // Validate and sanitize what the browser is allowed to tell us
    const nominations: Nomination[] = body
      .filter(
        (p: Record<string, unknown>) =>
          typeof p.icao_hex === "string" &&
          /^~?[0-9a-f]{6}$/i.test(p.icao_hex) && // "~" prefix = TIS-B/MLAT non-ICAO id
          typeof p.latitude === "number" &&
          typeof p.longitude === "number" &&
          Number.isFinite(p.latitude) &&
          Number.isFinite(p.longitude) &&
          Math.abs(p.latitude) <= 90 &&
          Math.abs(p.longitude) <= 180 &&
          typeof p.track_reason === "string" &&
          VALID_REASONS.includes(p.track_reason)
      )
      .slice(0, 50) // Cap at 50 per request
      .map((p: Record<string, unknown>) => ({
        icao_hex: (p.icao_hex as string).toLowerCase(),
        latitude: p.latitude as number,
        longitude: p.longitude as number,
        track_reason: p.track_reason as string,
        suspicion_score:
          typeof p.suspicion_score === "number" ? p.suspicion_score : null,
      }));

    if (nominations.length === 0) {
      return NextResponse.json({ inserted: 0, rejected: body.length });
    }

    // One feed query around the centroid of the claimed positions. Rounded
    // so a stationary radar reuses the 5s data cache across its posts.
    const centerLat =
      Math.round((nominations.reduce((s, n) => s + n.latitude, 0) / nominations.length) * 100) / 100;
    const centerLon =
      Math.round((nominations.reduce((s, n) => s + n.longitude, 0) / nominations.length) * 100) / 100;
    const spread = Math.max(
      ...nominations.map((n) => distanceNm(centerLat, centerLon, n.latitude, n.longitude))
    );
    const radius = Math.min(MAX_QUERY_RADIUS_NM, Math.max(25, Math.ceil(spread + QUERY_MARGIN_NM)));

    let live;
    try {
      live = await fetchNearbyFlights(centerLat, centerLon, radius);
    } catch (err) {
      // Fail closed: no feed, no history. Logged loudly; the browser treats
      // this call as fire-and-forget so nothing visible breaks.
      const detail = err instanceof FlightFeedError ? err.message : String(err);
      console.error("[security] flight-history: feed unavailable, recorded nothing:", detail);
      return NextResponse.json({ error: "Flight feed unavailable" }, { status: 503 });
    }

    const liveByHex = new Map(live.map((f) => [f.hex.toLowerCase(), f]));

    const positions: FlightPosition[] = [];
    let rejected = 0;
    for (const n of nominations) {
      const f = liveByHex.get(n.icao_hex);
      if (
        !f ||
        typeof f.lat !== "number" ||
        typeof f.lon !== "number" ||
        distanceNm(n.latitude, n.longitude, f.lat, f.lon) > MAX_DRIFT_NM
      ) {
        rejected++;
        continue;
      }
      // Record what the feed says, not what the browser said
      positions.push({
        icao_hex: f.hex.toLowerCase(),
        tail_number: f.r || null,
        callsign: f.flight?.trim() || null,
        latitude: f.lat,
        longitude: f.lon,
        altitude_ft: typeof f.alt_baro === "number" ? f.alt_baro : null,
        speed_kts: typeof f.gs === "number" ? Math.round(f.gs) : null,
        heading: typeof f.track === "number" ? Math.round(f.track) : null,
        track_reason: n.track_reason,
        suspicion_score: n.suspicion_score,
      });
    }

    if (rejected > 0) {
      console.warn(
        `[security] flight-history: rejected ${rejected} of ${nominations.length} positions not matching the live feed`
      );
    }

    if (positions.length === 0) {
      return NextResponse.json({ inserted: 0, rejected });
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

    return NextResponse.json({ inserted, rejected });
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
