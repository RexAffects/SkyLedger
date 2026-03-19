import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VERIFICATION_LEVELS } from "@/lib/constants";
import { formatCoords } from "@/lib/utils/geo";
import type { CitizenReport } from "@/lib/types";

interface ReportCardProps {
  report: CitizenReport;
}

export function ReportCard({ report }: ReportCardProps) {
  const verification =
    VERIFICATION_LEVELS[report.verification_level as keyof typeof VERIFICATION_LEVELS];

  return (
    <Link href={`/reports/${report.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">
                  {report.observation_type.replace(/_/g, " ")}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {verification.label}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(report.observed_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="mt-1 text-xs text-muted-foreground font-mono">
                {formatCoords(report.latitude, report.longitude)}
              </p>
              {report.notes && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {report.notes}
                </p>
              )}
            </div>
            {report.photo_urls.length > 0 && (
              <div className="ml-4 h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={report.photo_urls[0]}
                  alt="Observation"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            {report.aircraft_count !== null && (
              <span>Aircraft: {report.aircraft_count}</span>
            )}
            {report.duration_minutes !== null && (
              <span>Duration: {report.duration_minutes} min</span>
            )}
            {report.trail_behavior && (
              <span>{report.trail_behavior.replace(/_/g, " ")}</span>
            )}
          </div>
          <div className="mt-2">
            <span className="text-xs font-mono text-muted-foreground">
              Hash: {report.evidence_hash.slice(0, 16)}...
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
