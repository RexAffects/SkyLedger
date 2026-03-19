"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ReportCard } from "@/components/reports/report-card";
import { getReports } from "@/lib/supabase/reports";
import type { CitizenReport } from "@/lib/types";

export function ReportFeed() {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports().then((data) => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-muted-foreground">Loading reports...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="mx-auto h-12 w-12 text-muted-foreground/50"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold">No observations yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Be the first to document what you see in your skies.
        </p>
        <Link href="/reports/new" className={`${buttonVariants()} mt-6`}>
          Submit First Observation
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}
