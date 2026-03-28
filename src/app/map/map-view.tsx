"use client";

import { useEffect, useState } from "react";
import { MapContainer } from "@/components/map/map-container";
import { getReports } from "@/lib/supabase/reports";
import type { CitizenReport } from "@/lib/types";

export function MapView() {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSatellite, setShowSatellite] = useState(false);

  useEffect(() => {
    getReports().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading
            ? "Loading observations..."
            : `${reports.length} observation${reports.length !== 1 ? "s" : ""} recorded`}
        </p>
      </div>
      <div className="relative">
        <MapContainer
          reports={reports}
          className="h-[calc(100vh-220px)] w-full rounded-lg"
          showSatellite={showSatellite}
        />
        <button
          onClick={() => setShowSatellite(s => !s)}
          className={`absolute top-2 right-2 z-[1001] w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-md transition-colors ${
            showSatellite
              ? "bg-primary border-primary text-primary-foreground"
              : "bg-background/90 border-border text-muted-foreground hover:bg-muted"
          }`}
          title={showSatellite ? "Hide satellite clouds" : "Show satellite clouds"}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 .75-7.425 4.5 4.5 0 0 0-8.654-2.197A4.504 4.504 0 0 0 2.25 15Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
