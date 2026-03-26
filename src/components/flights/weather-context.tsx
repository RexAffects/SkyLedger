"use client";

import { useEffect, useState } from "react";
import { fetchWeatherAtPoint, type WeatherAtPoint } from "@/lib/api/weather";

interface WeatherContextProps {
  latitude: number;
  longitude: number;
  altitude_ft: number | null;
}

export function WeatherContext({
  latitude,
  longitude,
  altitude_ft,
}: WeatherContextProps) {
  const [weather, setWeather] = useState<WeatherAtPoint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchWeatherAtPoint(latitude, longitude, altitude_ft)
      .then((data) => {
        if (!cancelled) setWeather(data);
      })
      .catch(() => {
        // Silent fail — weather is supplementary
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, altitude_ft]);

  if (loading) {
    return (
      <div className="text-[11px] text-muted-foreground animate-pulse">
        Checking atmospheric conditions...
      </div>
    );
  }

  if (!weather) return null;

  const { contrail_assessment, at_altitude, surface } = weather;

  return (
    <div
      className={`rounded-md border p-2.5 text-xs ${
        contrail_assessment.likely
          ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
          : "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
      }`}
    >
      <div className="flex items-start gap-2">
        <div
          className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
            contrail_assessment.likely
              ? "bg-blue-500"
              : "bg-orange-500"
          }`}
        />
        <div className="space-y-1">
          <p
            className={`font-medium ${
              contrail_assessment.likely
                ? "text-blue-800 dark:text-blue-200"
                : "text-orange-800 dark:text-orange-200"
            }`}
          >
            {contrail_assessment.likely
              ? "Contrails expected at this altitude"
              : "Contrails unlikely at this altitude"}
          </p>
          <p
            className={`${
              contrail_assessment.likely
                ? "text-blue-700 dark:text-blue-300"
                : "text-orange-700 dark:text-orange-300"
            }`}
          >
            {contrail_assessment.reason}
          </p>
          {at_altitude && (
            <div className="flex gap-3 pt-0.5 text-muted-foreground">
              <span>{at_altitude.temperature_c}°C</span>
              <span>{at_altitude.relative_humidity}% RH</span>
              <span>~{at_altitude.approx_altitude_ft.toLocaleString()} ft</span>
            </div>
          )}
          <div className="flex gap-3 text-muted-foreground">
            <span>Surface: {surface.temperature_c}°C</span>
            <span>Cloud cover: {surface.cloud_cover}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
