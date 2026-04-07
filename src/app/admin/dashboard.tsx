"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklyStats {
  citizenReports: { total: number; thisWeek: number };
  evidencePhotos: { total: number; thisWeek: number };
  flightFlags: { total: number; thisWeek: number; highThreat: number };
  flagSubmissions: { total: number; thisWeek: number };
  flightSummaries: { totalAircraft: number; totalSightings: number };
  topFlaggedAircraft: Array<{ tail_number: string; flag_count: number; threat_level: string }>;
  recentReportTypes: Record<string, number>;
  archiveEmail: string;
}

function StatCard({
  title,
  total,
  thisWeek,
  extra,
}: {
  title: string;
  total: number;
  thisWeek: number;
  extra?: { label: string; value: number | string };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{total.toLocaleString()}</div>
        <div className="mt-1 text-sm text-muted-foreground">
          {thisWeek > 0 ? (
            <span className="text-green-600 dark:text-green-400">+{thisWeek} this week</span>
          ) : (
            <span>No new this week</span>
          )}
        </div>
        {extra && (
          <div className="mt-2 text-sm text-muted-foreground">
            {extra.label}: <span className="font-medium text-foreground">{extra.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const threatColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  low: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  none: "bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-500",
};

export function AdminDashboard({ stats, adminKey }: { stats: WeeklyStats; adminKey: string }) {
  const reportTypeEntries = Object.entries(stats.recentReportTypes).sort(([, a], [, b]) => b - a);

  async function triggerReport() {
    try {
      const res = await fetch("/api/cron/weekly-report");
      if (res.ok) {
        alert("Weekly report sent! Check your email.");
      } else {
        alert("Failed to send report. Check server logs.");
      }
    } catch {
      alert("Network error sending report.");
    }
  }

  return (
    <>
      {/* Stats grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Citizen Reports"
          total={stats.citizenReports.total}
          thisWeek={stats.citizenReports.thisWeek}
        />
        <StatCard
          title="Evidence Photos"
          total={stats.evidencePhotos.total}
          thisWeek={stats.evidencePhotos.thisWeek}
        />
        <StatCard
          title="Aircraft Flagged"
          total={stats.flightFlags.total}
          thisWeek={stats.flightFlags.thisWeek}
          extra={{ label: "High threat", value: stats.flightFlags.highThreat }}
        />
        <StatCard
          title="Flag Submissions"
          total={stats.flagSubmissions.total}
          thisWeek={stats.flagSubmissions.thisWeek}
        />
        <StatCard
          title="Tracked Aircraft"
          total={stats.flightSummaries.totalAircraft}
          thisWeek={0}
          extra={{ label: "Total sightings", value: stats.flightSummaries.totalSightings.toLocaleString() }}
        />
      </div>

      {/* Photo archive link */}
      <div className="mt-4 rounded-lg border border-border bg-muted/30 px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">Evidence photos are archived to </span>
          <a
            href={`https://mail.google.com/mail/u/?authuser=${stats.archiveEmail}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            {stats.archiveEmail}
          </a>
        </div>
        <a
          href={`https://mail.google.com/mail/u/?authuser=${stats.archiveEmail}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Open Inbox
        </a>
      </div>

      {/* Top flagged aircraft */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Flagged Aircraft</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topFlaggedAircraft.length === 0 ? (
              <p className="text-sm text-muted-foreground">No flagged aircraft yet.</p>
            ) : (
              <div className="space-y-2">
                {stats.topFlaggedAircraft.map((a) => (
                  <div key={a.tail_number} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <span className="font-mono text-sm font-medium">{a.tail_number}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{a.flag_count} flags</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${threatColors[a.threat_level] || threatColors.none}`}>
                        {a.threat_level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Week&apos;s Report Types</CardTitle>
          </CardHeader>
          <CardContent>
            {reportTypeEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reports submitted this week.</p>
            ) : (
              <div className="space-y-2">
                {reportTypeEntries.map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <span className="text-sm capitalize">{type.replace(/_/g, " ")}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={triggerReport}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          Send Weekly Report Now
        </button>
        <a
          href={`/admin?key=${encodeURIComponent(adminKey)}`}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          Refresh Data
        </a>
      </div>
    </>
  );
}
