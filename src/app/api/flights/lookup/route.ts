import { NextRequest } from "next/server";
import { lookupTailNumber } from "@/lib/api/faa";
import { fetchAircraftByRegistration } from "@/lib/api/adsb";

/**
 * GET /api/flights/lookup?tail=N12345
 * Looks up aircraft in FAA registry and checks current ADS-B position.
 */
export async function GET(request: NextRequest) {
  const tail = request.nextUrl.searchParams.get("tail");

  if (!tail) {
    return Response.json(
      { error: "tail parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch FAA registration and live ADS-B data in parallel
    const [registration, liveData] = await Promise.all([
      lookupTailNumber(tail),
      fetchAircraftByRegistration(tail),
    ]);

    return Response.json({
      tailNumber: tail.toUpperCase(),
      registration,
      livePosition: liveData
        ? {
            lat: liveData.lat,
            lon: liveData.lon,
            altitude: liveData.alt_baro,
            speed: liveData.gs,
            heading: liveData.track,
            squawk: liveData.squawk,
            lastSeen: liveData.seen,
          }
        : null,
      isCurrentlyTracked: !!liveData,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Lookup error:", error);
    return Response.json(
      { error: "Failed to look up aircraft" },
      { status: 502 }
    );
  }
}
