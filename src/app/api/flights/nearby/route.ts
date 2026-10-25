import { NextRequest } from "next/server";
import { fetchNearbyFlightsWithSource, FlightFeedError } from "@/lib/api/adsb";

/**
 * GET /api/flights/nearby?lat=X&lon=Y&radius=Z
 * Proxies ADSB.lol (falling back to adsb.fi) to avoid exposing the API
 * directly to clients and to enable server-side caching.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lon = parseFloat(searchParams.get("lon") ?? "");
  const radius = parseFloat(searchParams.get("radius") ?? "50");

  if (isNaN(lat) || isNaN(lon)) {
    return Response.json(
      { error: "lat and lon are required" },
      { status: 400 }
    );
  }

  if (radius > 250) {
    return Response.json(
      { error: "radius cannot exceed 250 nautical miles" },
      { status: 400 }
    );
  }

  try {
    const { flights, provider } = await fetchNearbyFlightsWithSource(lat, lon, radius);

    return Response.json({
      flights,
      count: flights.length,
      source: provider,
      center: { lat, lon },
      radius,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Flight feed error:", error);
    return Response.json(
      {
        error: "Failed to fetch flight data",
        // Provider names + HTTP statuses only — makes outages diagnosable
        // from the browser's network tab without exposing anything sensitive.
        providers:
          error instanceof FlightFeedError
            ? error.attempts.map(({ provider, status, error }) => ({ provider, status, error }))
            : undefined,
      },
      { status: 502 }
    );
  }
}
