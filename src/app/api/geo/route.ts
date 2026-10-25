import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/geo — the visitor's approximate (city-level) location from
 * Vercel's IP geolocation headers. Lets the home-page radar start scanning
 * immediately without a browser location-permission prompt. Returns nulls
 * when the headers are missing (local dev, unknown IP).
 */
export function GET(request: NextRequest) {
  const lat = parseFloat(request.headers.get("x-vercel-ip-latitude") ?? "");
  const lon = parseFloat(request.headers.get("x-vercel-ip-longitude") ?? "");
  const rawCity = request.headers.get("x-vercel-ip-city");

  let city: string | null = null;
  if (rawCity) {
    try {
      city = decodeURIComponent(rawCity);
    } catch {
      city = rawCity;
    }
  }

  const valid = !isNaN(lat) && !isNaN(lon);

  return NextResponse.json(
    valid ? { lat, lon, city } : { lat: null, lon: null, city: null },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
