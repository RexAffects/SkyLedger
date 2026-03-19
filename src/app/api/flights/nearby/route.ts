import { NextRequest } from "next/server";
import { fetchNearbyFlights } from "@/lib/api/adsb";

/**
 * GET /api/flights/nearby?lat=X&lon=Y&radius=Z
 * Proxies ADSB.lol to avoid exposing the API directly to clients
 * and to enable server-side caching.
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
    const flights = await fetchNearbyFlights(lat, lon, radius);

    return Response.json({
      flights,
      count: flights.length,
      center: { lat, lon },
      radius,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("ADSB.lol API error:", error);
    return Response.json(
      { error: "Failed to fetch flight data" },
      { status: 502 }
    );
  }
}
