import { NextRequest } from "next/server";
import { lookupRouteADSBLol, lookupRoute, lookupAircraftByHex } from "@/lib/api/adsbdb";
import { lookupTailNumber } from "@/lib/api/faa";
import { fetchAircraftByHex } from "@/lib/api/adsb";
import { fetchAircraftFlights } from "@/lib/api/opensky";
import { getFlag } from "@/lib/supabase/flags";
import { getLLCLookup, createPendingLLCLookup } from "@/lib/supabase/llc-lookups";
import {
  getRecentOpenSkyFlight,
  cacheOpenSkyFlight,
} from "@/lib/supabase/opensky-cache";
import { getStateRegistryUrl } from "@/lib/utils/llc-detect";
import { matchOwnerName } from "@/lib/network";
import { isPositionOnRoute } from "@/lib/utils/geo";

// OpenSky horizontal-distance threshold (meters) below which we treat the
// estimated airport as authoritative. Values >5km usually mean the trajectory
// ended over open ground without a clear airport candidate.
const OPENSKY_HORIZ_DISTANCE_MAX_M = 5_000;

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

  // Run all lookups in parallel — adsb.lol routeset is primary, ADSBDB is fallback,
  // OpenSky cache is checked alongside (post-landing authoritative source).
  const [
    liveData,
    routesetResult,
    adsbdbRoute,
    aircraftData,
    faaData,
    cachedOpenSky,
  ] = await Promise.all([
    hex ? fetchAircraftByHex(hex).catch(() => null) : Promise.resolve(null),
    callsign && hasPosition
      ? lookupRouteADSBLol(callsign, lat, lon).catch(() => null)
      : Promise.resolve(null),
    callsign ? lookupRoute(callsign).catch(() => null) : Promise.resolve(null),
    hex ? lookupAircraftByHex(hex).catch(() => null) : Promise.resolve(null),
    tail ? lookupTailNumber(tail).catch(() => null) : Promise.resolve(null),
    hex
      ? getRecentOpenSkyFlight(hex, 24).catch(() => null)
      : Promise.resolve(null),
  ]);

  // On cache miss, query OpenSky /flights/aircraft for the last 24h and
  // persist whatever it returns. OpenSky records appear 6–24h after landing,
  // so this only resolves recently-completed flights.
  let openSkyFlight = cachedOpenSky;
  if (!openSkyFlight && hex) {
    try {
      const nowSec = Math.floor(Date.now() / 1000);
      const flights = await fetchAircraftFlights(hex, nowSec - 86400, nowSec);
      // Persist all returned flights so cache is hot for subsequent legs too.
      for (const f of flights) {
        await cacheOpenSkyFlight(f);
      }
      // Pick the most recently landed flight — only if it has BOTH airports
      // estimated. An in-progress flight (estArrivalAirport=null) means
      // OpenSky hasn't recorded the landing yet; we'd rather fall back to
      // the gate-checked chain than guess from an older completed leg,
      // since older legs are stale relative to the plane's current state.
      const mostRecent = flights.reduce<typeof flights[number] | null>(
        (best, f) => (!best || f.lastSeen > best.lastSeen ? f : best),
        null
      );
      if (
        mostRecent &&
        mostRecent.estDepartureAirport &&
        mostRecent.estArrivalAirport
      ) {
        openSkyFlight = {
          icao_hex: mostRecent.icao24.toUpperCase(),
          callsign: mostRecent.callsign,
          first_seen_unix: mostRecent.firstSeen,
          last_seen_unix: mostRecent.lastSeen,
          est_departure_icao: mostRecent.estDepartureAirport,
          est_arrival_icao: mostRecent.estArrivalAirport,
          est_departure_horiz_distance_m:
            mostRecent.estDepartureAirportHorizDistance,
          est_arrival_horiz_distance_m:
            mostRecent.estArrivalAirportHorizDistance,
        };
      }
    } catch (err) {
      console.error("OpenSky route fetch failed:", err);
    }
  }

  // OpenSky takes priority when both airports are present and confidence is
  // high (horizontal distance within 5km of a real airport). When borrowing
  // OpenSky's airports, we try to enrich name/city from the routeset/ADSBDB
  // payloads if their ICAOs happen to match.
  const openSkyHighConfidence =
    openSkyFlight !== null &&
    openSkyFlight.est_departure_icao !== null &&
    openSkyFlight.est_arrival_icao !== null &&
    (openSkyFlight.est_departure_horiz_distance_m ?? Infinity) <
      OPENSKY_HORIZ_DISTANCE_MAX_M &&
    (openSkyFlight.est_arrival_horiz_distance_m ?? Infinity) <
      OPENSKY_HORIZ_DISTANCE_MAX_M;

  // Select best route: OpenSky (post-landing) → adsb.lol routeset → ADSBDB
  const routeData = routesetResult?.route ?? adsbdbRoute;
  const serverPlausible = routesetResult?.plausible ?? null;

  // Helper: pull airport metadata from routeData if its ICAO matches.
  const enrichAirport = (icao: string | null) => {
    if (!icao) return null;
    const match =
      routeData?.origin?.icao === icao
        ? routeData.origin
        : routeData?.destination?.icao === icao
          ? routeData.destination
          : null;
    if (match) {
      return {
        icao: match.icao,
        iata: match.iata || null,
        name: match.name || null,
        city: match.municipality || null,
        country: match.country || null,
      };
    }
    return { icao, iata: null, name: null, city: null, country: null };
  };

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

    // Route info — when the verification gate fails (and OpenSky has no
    // authoritative answer) we null out the airports. We never show
    // partial/uncertain airports.
    route: {
      origin: openSkyHighConfidence
        ? enrichAirport(openSkyFlight!.est_departure_icao)
        : routeData?.origin
          ? {
              icao: routeData.origin.icao,
              iata: routeData.origin.iata,
              name: routeData.origin.name,
              city: routeData.origin.municipality,
              country: routeData.origin.country,
            }
          : null,
      destination: openSkyHighConfidence
        ? enrichAirport(openSkyFlight!.est_arrival_icao)
        : routeData?.destination
          ? {
              icao: routeData.destination.icao,
              iata: routeData.destination.iata,
              name: routeData.destination.name,
              city: routeData.destination.municipality,
              country: routeData.destination.country,
            }
          : null,
      airline: routeData?.airline_name || null,
      verified: openSkyHighConfidence as boolean, // OpenSky-confirmed wins; geo gate may flip below
      // True when we received route data but rejected it on the verification gate.
      // Distinguishes "we don't know" (no data) from "we had data but it didn't match".
      unconfirmed: false as boolean,
      // Provenance: tells the UI / debugging how we got the route.
      source: openSkyHighConfidence
        ? ("opensky" as const)
        : routesetResult?.route
          ? ("adsbdb_routeset" as const)
          : adsbdbRoute
            ? ("adsbdb_callsign" as const)
            : ("none" as const),
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

  // Verification:
  //   - On the ground: OpenSky's most-recent-completed-flight applies to
  //     where the plane is now. Trust it absolutely (skip gate).
  //   - Airborne: OpenSky's record is for the PRIOR flight. The current
  //     flight may or may not be the same — run the geo gate to find out.
  //     If gate passes (current position/heading consistent with the
  //     candidate airports), the current flight matches OpenSky's record.
  //     If gate fails, the plane has moved on to a new flight; hide.
  // For ADSBDB-only candidates, the gate has always been the truth check.
  const onGround =
    result.position?.on_ground === true ||
    (result.position?.altitude_ft != null &&
      result.position.altitude_ft < 100);

  if (openSkyHighConfidence && onGround) {
    // OpenSky data + plane sitting at the airport → fully trust.
    // verified=true was already set when the route was assembled.
  } else if (
    result.route.origin &&
    result.route.destination &&
    result.position
  ) {
    // We have candidate airports (from OpenSky or ADSBDB) — gate them
    // against the live position/heading. We need real lat/lon for the
    // gate; when OpenSky-only (no ADSBDB metadata match) we won't have
    // them and the gate cannot run, so we conservatively reject.
    const originLatLon = openSkyHighConfidence
      ? routeData?.origin?.icao === openSkyFlight!.est_departure_icao
        ? {
            lat: routeData!.origin!.latitude,
            lon: routeData!.origin!.longitude,
          }
        : null
      : routeData?.origin
        ? {
            lat: routeData.origin.latitude,
            lon: routeData.origin.longitude,
          }
        : null;
    const destLatLon = openSkyHighConfidence
      ? routeData?.destination?.icao === openSkyFlight!.est_arrival_icao
        ? {
            lat: routeData!.destination!.latitude,
            lon: routeData!.destination!.longitude,
          }
        : null
      : routeData?.destination
        ? {
            lat: routeData.destination.latitude,
            lon: routeData.destination.longitude,
          }
        : null;

    let verified = false;
    if (originLatLon && destLatLon) {
      const geoCheck = isPositionOnRoute(
        originLatLon.lat,
        originLatLon.lon,
        destLatLon.lat,
        destLatLon.lon,
        result.position.latitude,
        result.position.longitude,
        result.position.heading
      );
      // For the ADSBDB chain the server plausible flag must also agree.
      // OpenSky candidates rely on the geo gate alone.
      verified = openSkyHighConfidence
        ? geoCheck
        : serverPlausible !== null
          ? serverPlausible && geoCheck
          : geoCheck;
    }

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

