"use client";

import { useEffect, useState } from "react";
import { MapContainer } from "@/components/map/map-container";
import { getReports } from "@/lib/supabase/reports";
import type { CitizenReport } from "@/lib/types";

export function MapView() {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [loading, setLoading] = useState(true);

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
      <MapContainer
        reports={reports}
        className="h-[calc(100vh-220px)] w-full rounded-lg"
      />
    </div>
  );
}
