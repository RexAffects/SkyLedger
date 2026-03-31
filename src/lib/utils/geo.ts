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
 */
export function isPositionOnRoute(
  originLat: number,
  originLon: number,
  destLat: number,
  destLon: number,
  aircraftLat: number,
  aircraftLon: number
): boolean {
  const routeDist = distanceNm(originLat, originLon, destLat, destLon);

  // For very short routes (<100 nm), skip validation — aircraft could be anywhere nearby
  if (routeDist < 100) return true;

  // Cross-track distance: how far off the great circle path
  const crossTrack = crossTrackDistanceNm(
    originLat, originLon, destLat, destLon,
    aircraftLat, aircraftLon
  );

  // Threshold: max(250 nm, 20% of route distance)
  // This accounts for ATC routing, weather avoidance, and airway deviations
  const maxCrossTrack = Math.max(250, routeDist * 0.2);
  if (crossTrack > maxCrossTrack) return false;

  // Detour ratio: (d_origin_aircraft + d_aircraft_dest) / d_origin_dest
  // If the aircraft is way off-route, this ratio will be high
  const dToOrigin = distanceNm(originLat, originLon, aircraftLat, aircraftLon);
  const dToDest = distanceNm(destLat, destLon, aircraftLat, aircraftLon);
  const detourRatio = (dToOrigin + dToDest) / routeDist;

  // A ratio > 1.5 means 50% longer path — very unlikely for a real route
  if (detourRatio > 1.5) return false;

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
