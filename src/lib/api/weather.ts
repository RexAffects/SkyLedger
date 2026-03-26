/**
 * Open-Meteo weather API client — 100% free, no API key needed.
 * Fetches pressure-level temperature and humidity to assess
 * contrail formation conditions at aircraft altitudes.
 */

// Pressure levels and their approximate altitudes in feet
const PRESSURE_LEVELS = [
  { hPa: 850, ft: 5000 },
  { hPa: 700, ft: 10000 },
  { hPa: 500, ft: 18000 },
  { hPa: 400, ft: 24000 },
  { hPa: 300, ft: 30000 },
  { hPa: 250, ft: 34000 },
  { hPa: 200, ft: 39000 },
] as const;

export interface AltitudeWeather {
  temperature_c: number;
  relative_humidity: number;
  pressure_hPa: number;
  approx_altitude_ft: number;
}

export interface WeatherAtPoint {
  surface: {
    temperature_c: number;
    relative_humidity: number;
    cloud_cover: number;
  };
  at_altitude: AltitudeWeather | null;
  contrail_assessment: {
    likely: boolean;
    reason: string;
  };
}

/**
 * Find the closest pressure level to the given altitude.
 */
function closestPressureLevel(altitude_ft: number): { hPa: number; ft: number } {
  let best: { hPa: number; ft: number } = PRESSURE_LEVELS[0];
  let bestDiff = Math.abs(altitude_ft - best.ft);
  for (const level of PRESSURE_LEVELS) {
    const diff = Math.abs(altitude_ft - level.ft);
    if (diff < bestDiff) {
      best = level;
      bestDiff = diff;
    }
  }
  return best;
}

/**
 * Fetch weather conditions at a point, including pressure-level data
 * for contrail assessment at a given aircraft altitude.
 */
export async function fetchWeatherAtPoint(
  lat: number,
  lon: number,
  altitude_ft?: number | null
): Promise<WeatherAtPoint> {
  // Build the hourly pressure-level variables
  const pressureVars = PRESSURE_LEVELS.flatMap((l) => [
    `temperature_${l.hPa}hPa`,
    `relative_humidity_${l.hPa}hPa`,
  ]);

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,cloud_cover&hourly=${pressureVars.join(",")}&forecast_hours=1&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API failed: ${res.status}`);
  const data = await res.json();

  const surface = {
    temperature_c: data.current.temperature_2m,
    relative_humidity: data.current.relative_humidity_2m,
    cloud_cover: data.current.cloud_cover,
  };

  let at_altitude: AltitudeWeather | null = null;

  if (altitude_ft && altitude_ft > 3000) {
    const level = closestPressureLevel(altitude_ft);
    const tempKey = `temperature_${level.hPa}hPa`;
    const rhKey = `relative_humidity_${level.hPa}hPa`;

    // Hourly arrays — take the first (current) hour
    const temp = data.hourly?.[tempKey]?.[0];
    const rh = data.hourly?.[rhKey]?.[0];

    if (typeof temp === "number" && typeof rh === "number") {
      at_altitude = {
        temperature_c: temp,
        relative_humidity: rh,
        pressure_hPa: level.hPa,
        approx_altitude_ft: level.ft,
      };
    }
  }

  // Assess contrail conditions
  const contrail_assessment = assessContrails(altitude_ft, at_altitude, surface);

  return { surface, at_altitude, contrail_assessment };
}

/**
 * Contrails (condensation trails) form when:
 * - Temperature is below approximately -40°C
 * - Relative humidity is above ~60%
 * - Altitude is typically above 25,000 ft
 *
 * Persistent contrails (that spread and linger) need humidity near or above
 * ice saturation (~60-70% RH at those temperatures).
 *
 * If conditions DON'T support contrails but a trail is visible,
 * that's a red flag worth investigating.
 */
function assessContrails(
  altitude_ft: number | null | undefined,
  atAltitude: AltitudeWeather | null,
  surface: { cloud_cover: number }
): { likely: boolean; reason: string } {
  if (!altitude_ft || altitude_ft < 3000) {
    return {
      likely: false,
      reason: "Aircraft is at low altitude where contrails do not form.",
    };
  }

  if (altitude_ft < 25000) {
    return {
      likely: false,
      reason: `At ${altitude_ft.toLocaleString()} ft, the air is typically too warm for contrails. Visible trails at this altitude warrant investigation.`,
    };
  }

  if (!atAltitude) {
    return {
      likely: false,
      reason: "Altitude weather data unavailable.",
    };
  }

  const temp = atAltitude.temperature_c;
  const rh = atAltitude.relative_humidity;

  // Classic contrail threshold
  if (temp <= -40 && rh >= 60) {
    return {
      likely: true,
      reason: `${temp}°C and ${rh}% humidity at ~${atAltitude.approx_altitude_ft.toLocaleString()} ft — conditions where contrails naturally form and can persist.`,
    };
  }

  if (temp <= -40 && rh < 60) {
    return {
      likely: false,
      reason: `${temp}°C but only ${rh}% humidity at ~${atAltitude.approx_altitude_ft.toLocaleString()} ft — cold enough but too dry for persistent contrails. Short-lived contrails possible, but trails that persist or spread are unusual.`,
    };
  }

  if (temp > -40 && rh >= 60) {
    return {
      likely: false,
      reason: `${temp}°C and ${rh}% humidity at ~${atAltitude.approx_altitude_ft.toLocaleString()} ft — too warm for contrails despite high humidity. Visible trails at this temperature are not condensation.`,
    };
  }

  return {
    likely: false,
    reason: `${temp}°C and ${rh}% humidity at ~${atAltitude.approx_altitude_ft.toLocaleString()} ft — conditions do not support contrail formation. Any visible trail warrants further investigation.`,
  };
}
