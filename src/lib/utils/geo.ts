/**
 * Calculate distance between two points in nautical miles using the Haversine formula.
 */
export function distanceNm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3440.065; // Earth's radius in nautical miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Calculate the initial bearing (forward azimuth) from point 1 to point 2.
 * Returns bearing in radians.
 */
function bearingRad(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return Math.atan2(y, x);
}

/**
 * Initial bearing from point 1 to point 2 in degrees, normalized to [0, 360).
 */
export function bearingDeg(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const rad = bearingRad(lat1, lon1, lat2, lon2);
  const deg = (rad * 180) / Math.PI;
  return (deg + 360) % 360;
}

/**
 * Smallest absolute difference between two compass headings, in degrees [0, 180].
 */
export function headingDelta(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Calculate the cross-track distance in nautical miles —
 * how far a point is from the great circle arc between two other points.
 */
function crossTrackDistanceNm(
  originLat: number,
  originLon: number,
  destLat: number,
  destLon: number,
  pointLat: number,
  pointLon: number
): number {
  const R = 3440.065; // Earth's radius in nm
  const d13 = distanceNm(originLat, originLon, pointLat, pointLon) / R; // angular distance origin→point
  const θ13 = bearingRad(originLat, originLon, pointLat, pointLon);
  const θ12 = bearingRad(originLat, originLon, destLat, destLon);
  return Math.abs(Math.asin(Math.sin(d13) * Math.sin(θ13 - θ12)) * R);
}

/**
 * Validate whether an aircraft's position is plausibly on the route
 * between two airports. Returns true if the position is consistent
 * with the route, false if the route data is likely stale/wrong.
 *
 * Tight thresholds: a wrong route that happens to pass overhead must NOT
 * pass this gate. We'd rather hide a route than show a wrong one.
 *
 * If `aircraftTrack` (current heading in degrees) is provided, we also
 * require the heading to point roughly toward the destination (within 60°).
 * Aircraft within 50nm of either endpoint skip the heading check —
 * climbout/descent vectors don't always align with the destination bearing.
 */
export function isPositionOnRoute(
  originLat: number,
  originLon: number,
  destLat: number,
  destLon: number,
  aircraftLat: number,
  aircraftLon: number,
  aircraftTrack?: number | null
): boolean {
  const routeDist = distanceNm(originLat, originLon, destLat, destLon);

  // For very short routes (<100 nm), skip validation — aircraft could be anywhere nearby
  if (routeDist < 100) return true;

  // Cross-track distance: how far off the great circle path
  const crossTrack = crossTrackDistanceNm(
    originLat, originLon, destLat, destLon,
    aircraftLat, aircraftLon
  );

  // Threshold: max(50 nm, 12% of route distance) — tight enough to reject
  // routes that merely happen to pass overhead by coincidence.
  const maxCrossTrack = Math.max(50, routeDist * 0.12);
  if (crossTrack > maxCrossTrack) return false;

  // Detour ratio: (d_origin_aircraft + d_aircraft_dest) / d_origin_dest
  const dToOrigin = distanceNm(originLat, originLon, aircraftLat, aircraftLon);
  const dToDest = distanceNm(destLat, destLon, aircraftLat, aircraftLon);
  const detourRatio = (dToOrigin + dToDest) / routeDist;

  // A ratio > 1.25 means 25% longer path — unlikely for a real route in cruise
  if (detourRatio > 1.25) return false;

  // Heading vs bearing-to-destination check (when track is available).
  // Skip near endpoints: climb/descent maneuvers can deviate significantly.
  if (
    aircraftTrack != null &&
    Number.isFinite(aircraftTrack) &&
    dToDest > 50 &&
    dToOrigin > 50
  ) {
    const bearingToDest = bearingDeg(
      aircraftLat,
      aircraftLon,
      destLat,
      destLon
    );
    // 60° tolerance — winds aloft can push true track 30°+ off course,
    // and en-route ATC vectors add more. Tighter would generate false rejects.
    if (headingDelta(aircraftTrack, bearingToDest) > 60) return false;
  }

  return true;
}

/**
 * Format coordinates for display.
 */
export function formatCoords(lat: number, lon: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}${latDir}, ${Math.abs(lon).toFixed(4)}${lonDir}`;
}
