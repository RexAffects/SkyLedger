/**
 * Map a lat/lon coordinate to a US state using bounding-box approximations.
 * Not pixel-perfect on borders, but accurate enough for analytics.
 */

interface StateBounds {
  name: string;
  abbr: string;
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

const US_STATES: StateBounds[] = [
  { name: "Alabama", abbr: "AL", minLat: 30.22, maxLat: 35.01, minLon: -88.47, maxLon: -84.89 },
  { name: "Alaska", abbr: "AK", minLat: 51.21, maxLat: 71.39, minLon: -179.15, maxLon: -129.98 },
  { name: "Arizona", abbr: "AZ", minLat: 31.33, maxLat: 37.00, minLon: -114.81, maxLon: -109.04 },
  { name: "Arkansas", abbr: "AR", minLat: 33.00, maxLat: 36.50, minLon: -94.62, maxLon: -89.64 },
  { name: "California", abbr: "CA", minLat: 32.53, maxLat: 42.01, minLon: -124.41, maxLon: -114.13 },
  { name: "Colorado", abbr: "CO", minLat: 36.99, maxLat: 41.00, minLon: -109.06, maxLon: -102.04 },
  { name: "Connecticut", abbr: "CT", minLat: 40.95, maxLat: 42.05, minLon: -73.73, maxLon: -71.79 },
  { name: "Delaware", abbr: "DE", minLat: 38.45, maxLat: 39.84, minLon: -75.79, maxLon: -75.05 },
  { name: "Florida", abbr: "FL", minLat: 24.40, maxLat: 31.00, minLon: -87.63, maxLon: -80.03 },
  { name: "Georgia", abbr: "GA", minLat: 30.36, maxLat: 35.00, minLon: -85.61, maxLon: -80.84 },
  { name: "Hawaii", abbr: "HI", minLat: 18.91, maxLat: 22.24, minLon: -160.24, maxLon: -154.81 },
  { name: "Idaho", abbr: "ID", minLat: 41.99, maxLat: 49.00, minLon: -117.24, maxLon: -111.04 },
  { name: "Illinois", abbr: "IL", minLat: 36.97, maxLat: 42.51, minLon: -91.51, maxLon: -87.02 },
  { name: "Indiana", abbr: "IN", minLat: 37.77, maxLat: 41.76, minLon: -88.10, maxLon: -84.78 },
  { name: "Iowa", abbr: "IA", minLat: 40.38, maxLat: 43.50, minLon: -96.64, maxLon: -90.14 },
  { name: "Kansas", abbr: "KS", minLat: 36.99, maxLat: 40.00, minLon: -102.05, maxLon: -94.59 },
  { name: "Kentucky", abbr: "KY", minLat: 36.50, maxLat: 39.15, minLon: -89.57, maxLon: -81.96 },
  { name: "Louisiana", abbr: "LA", minLat: 28.93, maxLat: 33.02, minLon: -94.04, maxLon: -88.82 },
  { name: "Maine", abbr: "ME", minLat: 43.06, maxLat: 47.46, minLon: -71.08, maxLon: -66.95 },
  { name: "Maryland", abbr: "MD", minLat: 37.91, maxLat: 39.72, minLon: -79.49, maxLon: -75.05 },
  { name: "Massachusetts", abbr: "MA", minLat: 41.24, maxLat: 42.89, minLon: -73.51, maxLon: -69.93 },
  { name: "Michigan", abbr: "MI", minLat: 41.70, maxLat: 48.31, minLon: -90.42, maxLon: -82.12 },
  { name: "Minnesota", abbr: "MN", minLat: 43.50, maxLat: 49.38, minLon: -97.24, maxLon: -89.49 },
  { name: "Mississippi", abbr: "MS", minLat: 30.17, maxLat: 34.99, minLon: -91.66, maxLon: -88.10 },
  { name: "Missouri", abbr: "MO", minLat: 35.99, maxLat: 40.61, minLon: -95.77, maxLon: -89.10 },
  { name: "Montana", abbr: "MT", minLat: 44.36, maxLat: 49.00, minLon: -116.05, maxLon: -104.04 },
  { name: "Nebraska", abbr: "NE", minLat: 40.00, maxLat: 43.00, minLon: -104.05, maxLon: -95.31 },
  { name: "Nevada", abbr: "NV", minLat: 35.00, maxLat: 42.00, minLon: -120.00, maxLon: -114.04 },
  { name: "New Hampshire", abbr: "NH", minLat: 42.70, maxLat: 45.31, minLon: -72.56, maxLon: -70.70 },
  { name: "New Jersey", abbr: "NJ", minLat: 38.93, maxLat: 41.36, minLon: -75.56, maxLon: -73.89 },
  { name: "New Mexico", abbr: "NM", minLat: 31.33, maxLat: 37.00, minLon: -109.05, maxLon: -103.00 },
  { name: "New York", abbr: "NY", minLat: 40.50, maxLat: 45.01, minLon: -79.76, maxLon: -71.86 },
  { name: "North Carolina", abbr: "NC", minLat: 33.84, maxLat: 36.59, minLon: -84.32, maxLon: -75.46 },
  { name: "North Dakota", abbr: "ND", minLat: 45.94, maxLat: 49.00, minLon: -104.05, maxLon: -96.55 },
  { name: "Ohio", abbr: "OH", minLat: 38.40, maxLat: 41.98, minLon: -84.82, maxLon: -80.52 },
  { name: "Oklahoma", abbr: "OK", minLat: 33.62, maxLat: 37.00, minLon: -103.00, maxLon: -94.43 },
  { name: "Oregon", abbr: "OR", minLat: 41.99, maxLat: 46.29, minLon: -124.57, maxLon: -116.46 },
  { name: "Pennsylvania", abbr: "PA", minLat: 39.72, maxLat: 42.27, minLon: -80.52, maxLon: -74.69 },
  { name: "Rhode Island", abbr: "RI", minLat: 41.15, maxLat: 42.02, minLon: -71.86, maxLon: -71.12 },
  { name: "South Carolina", abbr: "SC", minLat: 32.05, maxLat: 35.21, minLon: -83.35, maxLon: -78.54 },
  { name: "South Dakota", abbr: "SD", minLat: 42.48, maxLat: 45.94, minLon: -104.06, maxLon: -96.44 },
  { name: "Tennessee", abbr: "TN", minLat: 34.98, maxLat: 36.68, minLon: -90.31, maxLon: -81.65 },
  { name: "Texas", abbr: "TX", minLat: 25.84, maxLat: 36.50, minLon: -106.65, maxLon: -93.51 },
  { name: "Utah", abbr: "UT", minLat: 36.99, maxLat: 42.00, minLon: -114.05, maxLon: -109.04 },
  { name: "Vermont", abbr: "VT", minLat: 42.73, maxLat: 45.02, minLon: -73.44, maxLon: -71.46 },
  { name: "Virginia", abbr: "VA", minLat: 36.54, maxLat: 39.47, minLon: -83.68, maxLon: -75.24 },
  { name: "Washington", abbr: "WA", minLat: 45.54, maxLat: 49.00, minLon: -124.85, maxLon: -116.92 },
  { name: "West Virginia", abbr: "WV", minLat: 37.20, maxLat: 40.64, minLon: -82.64, maxLon: -77.72 },
  { name: "Wisconsin", abbr: "WI", minLat: 42.49, maxLat: 47.08, minLon: -92.89, maxLon: -86.25 },
  { name: "Wyoming", abbr: "WY", minLat: 40.99, maxLat: 45.01, minLon: -111.06, maxLon: -104.05 },
  { name: "District of Columbia", abbr: "DC", minLat: 38.79, maxLat: 38.99, minLon: -77.12, maxLon: -76.91 },
];

/**
 * Returns the US state abbreviation for a lat/lon, or null if outside the US.
 * Uses bounding boxes — may overlap at borders, returns the best (smallest-area) match.
 */
export function latLonToState(lat: number, lon: number): string | null {
  let best: StateBounds | null = null;
  let bestArea = Infinity;

  for (const state of US_STATES) {
    if (lat >= state.minLat && lat <= state.maxLat && lon >= state.minLon && lon <= state.maxLon) {
      const area = (state.maxLat - state.minLat) * (state.maxLon - state.minLon);
      if (area < bestArea) {
        best = state;
        bestArea = area;
      }
    }
  }

  return best ? best.abbr : null;
}

/**
 * Given an array of {latitude, longitude} rows, returns a map of state abbreviation → count,
 * sorted by count descending.
 */
export function groupByState(
  rows: Array<{ latitude: number | null; longitude: number | null }>
): Array<{ state: string; count: number }> {
  const counts: Record<string, number> = {};

  for (const row of rows) {
    if (row.latitude == null || row.longitude == null) continue;
    const state = latLonToState(row.latitude, row.longitude);
    if (state) {
      counts[state] = (counts[state] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count);
}
