import { NextRequest } from "next/server";
import { lookupRouteADSBLol, lookupRoute, lookupAircraftByHex } from "@/lib/api/adsbdb";
import { lookupTailNumber } from "@/lib/api/faa";
import { fetchAircraftByHex } from "@/lib/api/adsb";
import { getFlag } from "@/lib/supabase/flags";
import { getLLCLookup, createPendingLLCLookup } from "@/lib/supabase/llc-lookups";
import { getStateRegistryUrl } from "@/lib/utils/llc-detect";
import { matchOwnerName } from "@/lib/network";
import { isPositionOnRoute } from "@/lib/utils/geo";

/**
 * GET /api/flights/detail?hex=A1B2C3&callsign=UAL123&tail=N12345
 *
 * One-stop endpoint that gathers ALL available info for an aircraft:
 * - Live position from ADSB.lol
 * - Route (origin/destination airports) from adsb.lol routeset → ADSBDB
 * - Aircraft details (owner, type, photo) from ADSBDB
 * - FAA registration from registry.faa.gov
 *
 * Routes are gated on a strict position/heading check; when the gate fails
 * we return route.origin/destination as null rather than show a wrong route.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const hex = searchParams.get("hex") || "";
  const callsign = searchParams.get("callsign") || "";
  const tail = searchParams.get("tail") || "";
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lon = parseFloat(searchParams.get("lon") ?? "");
  const hasPosition = !isNaN(lat) && !isNaN(lon);

  if (!hex && !callsign && !tail) {
    return Response.json(
      { error: "At least one of hex, callsign, or tail is required" },
      { status: 400 }
    );
  }

  // Run all lookups in parallel — adsb.lol routeset is primary, ADSBDB is fallback
  const [liveData, routesetResult, adsbdbRoute, aircraftData, faaData] =
    await Promise.all([
      hex ? fetchAircraftByHex(hex).catch(() => null) : Promise.resolve(null),
      callsign && hasPosition
        ? lookupRouteADSBLol(callsign, lat, lon).catch(() => null)
        : Promise.resolve(null),
      callsign ? lookupRoute(callsign).catch(() => null) : Promise.resolve(null),
      hex ? lookupAircraftByHex(hex).catch(() => null) : Promise.resolve(null),
      tail ? lookupTailNumber(tail).catch(() => null) : Promise.resolve(null),
    ]);

  // Select best route: adsb.lol routeset → ADSBDB
  const routeData = routesetResult?.route ?? adsbdbRoute;
  const serverPlausible = routesetResult?.plausible ?? null;

  // Build the complete response
  const result = {
    // Identity
    icao_hex: hex || liveData?.hex || null,
    tail_number:
      tail || liveData?.r || aircraftData?.registration || null,
    callsign: callsign || liveData?.flight?.trim() || null,

    // Aircraft details
    aircraft_type: liveData?.t || aircraftData?.icao_type || null,
    aircraft_description:
      liveData?.desc ||
      (aircraftData
        ? `${aircraftData.manufacturer} ${aircraftData.type}`
        : null),
    aircraft_photo: aircraftData?.url_photo || null,
    aircraft_photo_thumbnail: aircraftData?.url_photo_thumbnail || null,

    // Owner info (prefer FAA, fall back to ADSBDB)
    owner: {
      name:
        faaData?.ownerName || aircraftData?.registered_owner || null,
      city: faaData?.ownerCity || null,
      state: faaData?.ownerState || null,
      country:
        faaData?.ownerCountry ||
        aircraftData?.registered_owner_country_name ||
        null,
      is_known_wx_mod: faaData?.isKnownWeatherMod || false,
      operator_notes: faaData?.operatorNotes || "",
      is_llc: faaData?.llcDetection?.isLLC || false,
      llc_info: null as {
        entity_type: string | null;
        pierced_owner: string | null;
        pierced_source: string | null;
        confidence: string | null;
        formation_state: string | null;
        state_registry_url: string | null;
        status: string;
      } | null,
    },

    // FAA registration details
    registration: faaData
      ? {
          make: faaData.make,
          model: faaData.model,
          year: faaData.year,
          serial_number: faaData.serialNumber,
          status: faaData.status,
          type: faaData.registrationType,
        }
      : null,

    // Route info — origin/destination are nulled out below if the verification
    // gate fails. We never show partial/uncertain airports.
    route: {
      origin: routeData?.origin
        ? {
            icao: routeData.origin.icao,
            iata: routeData.origin.iata,
            name: routeData.origin.name,
            city: routeData.origin.municipality,
            country: routeData.origin.country,
          }
        : null,
      destination: routeData?.destination
        ? {
            icao: routeData.destination.icao,
            iata: routeData.destination.iata,
            name: routeData.destination.name,
            city: routeData.destination.municipality,
            country: routeData.destination.country,
          }
        : null,
      airline: routeData?.airline_name || null,
      verified: false as boolean, // computed below after position is known
      // True when we received route data but rejected it on the verification gate.
      // Distinguishes "we don't know" (no data) from "we had data but it didn't match".
      unconfirmed: false as boolean,
    },

    // Live position
    position: liveData
      ? {
          latitude: liveData.lat,
          longitude: liveData.lon,
          altitude_ft:
            typeof liveData.alt_baro === "number"
              ? liveData.alt_baro
              : liveData.alt_baro === "ground"
                ? 0
                : null,
          altitude_geom_ft: liveData.alt_geom || null,
          speed_kts: liveData.gs || null,
          heading: liveData.track || null,
          squawk: liveData.squawk || null,
          on_ground: liveData.alt_baro === "ground",
          last_seen_seconds: liveData.seen,
        }
      : null,

    // Community flags
    community_flags: null as {
      flag_count: number;
      unique_reporters: number;
      threat_level: string;
      first_flagged_at: string | null;
      last_flagged_at: string | null;
    } | null,

    // Network connections (investors, executives, funds linked to WxMod network)
    network_connections: null as {
      is_confirmed_operator: boolean;
      matches: {
        entity_name: string;
        entity_type: string;
        confidence: string;
        description: string;
        connection_path: string;
        operator_slugs: string[];
        player_slugs: string[];
        score: number;
      }[];
      summary: string | null;
      needs_investigation: boolean;
      pierced_match: {
        pierced_name: string;
        matches: {
          entity_name: string;
          entity_type: string;
          confidence: string;
          description: string;
          connection_path: string;
          operator_slugs: string[];
          player_slugs: string[];
          score: number;
        }[];
      } | null;
    } | null,

    timestamp: Date.now(),
  };

  // Verify route against aircraft position using dual checks:
  // 1. adsb.lol server-side plausible flag (when available)
  // 2. Our own strict cross-track + detour + heading check
  // If the gate fails, we DROP the airports — wrong is worse than missing.
  if (
    result.route.origin &&
    result.route.destination &&
    result.position &&
    routeData?.origin &&
    routeData?.destination
  ) {
    const geoCheck = isPositionOnRoute(
      routeData.origin.latitude,
      routeData.origin.longitude,
      routeData.destination.latitude,
      routeData.destination.longitude,
      result.position.latitude,
      result.position.longitude,
      result.position.heading
    );

    // If server plausible check is available, both must agree.
    // If not available (ADSBDB fallback), rely on our own geo check.
    const verified =
      serverPlausible !== null ? serverPlausible && geoCheck : geoCheck;

    result.route.verified = verified;
    if (!verified) {
      result.route.origin = null;
      result.route.destination = null;
      result.route.unconfirmed = true;
    }
  } else if (
    (result.route.origin || result.route.destination) &&
    !result.position
  ) {
    // No position to verify against — refuse to show the route.
    result.route.origin = null;
    result.route.destination = null;
    result.route.unconfirmed = true;
  }

  // Look up community flags (don't block if it fails)
  const effectiveTail =
    result.tail_number || tail || liveData?.r || null;
  if (effectiveTail) {
    try {
      const flag = await getFlag(effectiveTail);
      if (flag && flag.threat_level !== "none") {
        result.community_flags = {
          flag_count: flag.flag_count,
          unique_reporters: flag.unique_reporters,
          threat_level: flag.threat_level,
          first_flagged_at: flag.first_flagged_at,
          last_flagged_at: flag.last_flagged_at,
        };
      }
    } catch (err) {
      console.error("Error fetching community flags:", err);
    }
  }

  // LLC piercing lookup
  if (result.owner.is_llc && result.owner.name) {
    try {
      // Check if we already have LLC data
      let llcData = await getLLCLookup(result.owner.name);

      // If not, create a pending entry
      if (!llcData) {
        const registryUrl =
          faaData?.llcDetection?.stateRegistryUrl ||
          getStateRegistryUrl(result.owner.state || "");
        llcData = await createPendingLLCLookup(
          result.owner.name,
          result.owner.state,
          faaData?.llcDetection?.entityType || null,
          registryUrl
        );
      }

      if (llcData) {
        result.owner.llc_info = {
          entity_type: llcData.entity_type,
          pierced_owner: llcData.pierced_owner,
          pierced_source: llcData.pierced_source,
          confidence: llcData.confidence,
          formation_state: llcData.formation_state,
          state_registry_url: llcData.state_registry_url,
          status: llcData.status,
        };
      }
    } catch (err) {
      console.error("Error fetching LLC lookup:", err);
    }
  }

  // Network matching — cross-reference owner against funding network
  if (result.owner.name) {
    try {
      const networkResult = faaData?.networkMatch || matchOwnerName(result.owner.name);

      // Also check pierced owner if available
      let piercedMatch = null;
      if (result.owner.llc_info?.pierced_owner) {
        const piercedResult = matchOwnerName(result.owner.llc_info.pierced_owner);
        if (piercedResult.matches.length > 0) {
          piercedMatch = {
            pierced_name: result.owner.llc_info.pierced_owner,
            matches: piercedResult.matches.map((m) => ({
              entity_name: m.entity.name,
              entity_type: m.entity.type,
              confidence: m.confidence,
              description: m.entity.description,
              connection_path: m.entity.connectionPath,
              operator_slugs: m.entity.operatorSlugs,
              player_slugs: m.entity.playerSlugs,
              score: m.score,
            })),
          };
        }
      }

      if (networkResult && (networkResult.matches.length > 0 || piercedMatch)) {
        result.network_connections = {
          is_confirmed_operator: networkResult.isConfirmedOperator,
          matches: networkResult.matches.map((m) => ({
            entity_name: m.entity.name,
            entity_type: m.entity.type,
            confidence: m.confidence,
            description: m.entity.description,
            connection_path: m.entity.connectionPath,
            operator_slugs: m.entity.operatorSlugs,
            player_slugs: m.entity.playerSlugs,
            score: m.score,
          })),
          summary: networkResult.summary,
          needs_investigation: networkResult.needsInvestigation,
          pierced_match: piercedMatch,
        };
      }
    } catch (err) {
      console.error("Error running network match:", err);
    }
  }

  return Response.json(result);
}

