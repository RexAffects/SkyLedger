"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { MapContainer } from "@/components/map/map-container";
import { formatCoords } from "@/lib/utils/geo";
import { VERIFICATION_LEVELS } from "@/lib/constants";
import { getReport } from "@/lib/supabase/reports";
import type { CitizenReport } from "@/lib/types";

interface ReportDetailProps {
  id: string;
}

export function ReportDetail({ id }: ReportDetailProps) {
  const [report, setReport] = useState<CitizenReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReport(id).then((data) => {
      setReport(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-muted-foreground">Loading report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold">Report not found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This observation may have been removed or the ID is invalid.
        </p>
        <Link href="/reports" className={`${buttonVariants({ variant: "outline" })} mt-4`}>
          View all reports
        </Link>
      </div>
    );
  }

  const verification =
    VERIFICATION_LEVELS[
      report.verification_level as keyof typeof VERIFICATION_LEVELS
    ];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/reports"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to reports
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">
          {report.observation_type.replace(/_/g, " ")}
        </h1>
        <Badge variant="secondary">{verification.label}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Observation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow
              label="Date & Time"
              value={new Date(report.observed_at).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              })}
            />
            <DetailRow
              label="Location"
              value={formatCoords(report.latitude, report.longitude)}
            />
            {report.aircraft_count !== null && (
              <DetailRow
                label="Aircraft Count"
                value={String(report.aircraft_count)}
              />
            )}
            {report.duration_minutes !== null && (
              <DetailRow
                label="Duration"
                value={`${report.duration_minutes} minutes`}
              />
            )}
            {report.trail_behavior && (
              <DetailRow
                label="Trail Behavior"
                value={report.trail_behavior.replace(/_/g, " ")}
              />
            )}
            {report.notes && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Notes
                </p>
                <p className="mt-1 text-sm">{report.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <MapContainer
              reports={[report]}
              center={[report.latitude, report.longitude]}
              zoom={12}
              className="h-[300px] w-full"
            />
          </CardContent>
        </Card>
      </div>

      {report.photo_urls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Photo Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={report.photo_urls[0]}
              alt="Observation photo"
              className="max-h-96 rounded-md"
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Evidence Integrity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              SHA-256 Hash
            </p>
            <p className="mt-1 font-mono text-xs break-all bg-muted p-2 rounded">
              {report.evidence_hash || "No photo attached"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            This hash was generated from the original photo file before upload.
            To verify: download the photo, generate a SHA-256 hash, and compare.
          </p>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Submitted
            </p>
            <p className="mt-1 text-sm">
              {new Date(report.created_at).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm capitalize">{value}</p>
    </div>
  );
}
