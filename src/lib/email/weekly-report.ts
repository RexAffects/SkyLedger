import nodemailer from "nodemailer";
import { createServiceClient } from "@/lib/supabase/server";
import { groupByState } from "@/lib/geo/state-lookup";

interface WeeklyStats {
  citizenReports: { total: number; thisWeek: number };
  evidencePhotos: { total: number; thisWeek: number };
  flightFlags: { total: number; thisWeek: number; highThreat: number };
  flagSubmissions: { total: number; thisWeek: number };
  flightSummaries: { totalAircraft: number; totalSightings: number };
  topFlaggedAircraft: Array<{ tail_number: string; flag_count: number; threat_level: string }>;
  recentReportTypes: Record<string, number>;
  activityByState: Array<{ state: string; count: number }>;
  archiveEmail: string;
}

export async function gatherWeeklyStats(): Promise<WeeklyStats> {
  const supabase = createServiceClient();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // All queries in parallel
  const [
    reportsTotal,
    reportsWeek,
    photosAll,
    photosWeekData,
    flagsTotal,
    flagsWeek,
    flagsHigh,
    submissionsTotal,
    submissionsWeek,
    summaries,
    topFlagged,
    recentReports,
    flagLocations,
    reportLocations,
  ] = await Promise.all([
    supabase.from("citizen_reports").select("id", { count: "exact", head: true }),
    supabase.from("citizen_reports").select("id", { count: "exact", head: true }).gte("created_at", oneWeekAgo),
    supabase.from("citizen_reports").select("photo_urls"),
    supabase.from("citizen_reports").select("photo_urls").gte("created_at", oneWeekAgo),
    supabase.from("flight_flags").select("id", { count: "exact", head: true }),
    supabase.from("flight_flags").select("id", { count: "exact", head: true }).gte("created_at", oneWeekAgo),
    supabase.from("flight_flags").select("id", { count: "exact", head: true }).eq("threat_level", "high"),
    supabase.from("flag_submissions").select("id", { count: "exact", head: true }),
    supabase.from("flag_submissions").select("id", { count: "exact", head: true }).gte("created_at", oneWeekAgo),
    supabase.from("flight_summaries").select("total_sightings"),
    supabase.from("flight_flags").select("tail_number, flag_count, threat_level").order("flag_count", { ascending: false }).limit(10),
    supabase.from("citizen_reports").select("observation_type").gte("created_at", oneWeekAgo),
    supabase.from("flag_submissions").select("latitude, longitude"),
    supabase.from("citizen_reports").select("latitude, longitude"),
  ]);

  // Count photos (each report can have multiple photos in the array)
  const countPhotos = (rows: { photo_urls: string[] | null }[]) =>
    rows.reduce((sum, row) => sum + (row.photo_urls?.length || 0), 0);
  const totalPhotos = countPhotos((photosAll.data || []) as { photo_urls: string[] | null }[]);
  const weekPhotos = countPhotos((photosWeekData.data || []) as { photo_urls: string[] | null }[]);

  // Aggregate sightings
  const totalSightings = (summaries.data || []).reduce(
    (sum: number, row: { total_sightings: number }) => sum + (row.total_sightings || 0),
    0
  );

  // Count report types from this week
  const reportTypes: Record<string, number> = {};
  for (const row of recentReports.data || []) {
    const type = (row as { observation_type: string }).observation_type || "unknown";
    reportTypes[type] = (reportTypes[type] || 0) + 1;
  }

  // Combine all location data (flags + reports) for geographic breakdown
  const allLocations = [
    ...((flagLocations.data || []) as Array<{ latitude: number | null; longitude: number | null }>),
    ...((reportLocations.data || []) as Array<{ latitude: number | null; longitude: number | null }>),
  ];
  const activityByState = groupByState(allLocations);

  return {
    citizenReports: { total: reportsTotal.count || 0, thisWeek: reportsWeek.count || 0 },
    evidencePhotos: { total: totalPhotos, thisWeek: weekPhotos },
    flightFlags: { total: flagsTotal.count || 0, thisWeek: flagsWeek.count || 0, highThreat: flagsHigh.count || 0 },
    flagSubmissions: { total: submissionsTotal.count || 0, thisWeek: submissionsWeek.count || 0 },
    flightSummaries: { totalAircraft: (summaries.data || []).length, totalSightings },
    topFlaggedAircraft: (topFlagged.data || []) as WeeklyStats["topFlaggedAircraft"],
    recentReportTypes: reportTypes,
    activityByState,
    archiveEmail: process.env.GMAIL_ADDRESS || "skyledgerproof@gmail.com",
  };
}

export async function sendWeeklyReport(): Promise<void> {
  const address = process.env.GMAIL_ADDRESS;
  const password = process.env.GMAIL_APP_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL || address;

  if (!address || !password) {
    throw new Error("GMAIL_ADDRESS or GMAIL_APP_PASSWORD not configured");
  }

  const stats = await gatherWeeklyStats();

  const weekEnd = new Date();
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const threatBadge = (level: string) => {
    const colors: Record<string, string> = {
      high: "background:#fee2e2;color:#991b1b;",
      medium: "background:#fef9c3;color:#854d0e;",
      low: "background:#f3f4f6;color:#4b5563;",
    };
    return `<span style="display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;${colors[level] || colors.low}">${level}</span>`;
  };

  // Top flagged rows
  const topFlaggedRows = stats.topFlaggedAircraft.length > 0
    ? stats.topFlaggedAircraft
        .map((a) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-family:monospace;font-weight:600;">${a.tail_number}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${a.flag_count}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${threatBadge(a.threat_level)}</td></tr>`)
        .join("")
    : `<tr><td colspan="3" style="padding:12px;color:#9ca3af;">No flagged aircraft yet</td></tr>`;

  // State activity pills
  const statePills = stats.activityByState.length > 0
    ? stats.activityByState
        .map((s) => `<span style="display:inline-block;padding:4px 10px;margin:3px;border-radius:8px;background:#f3f4f6;font-size:13px;"><strong>${s.state}</strong> <span style="color:#6b7280;">${s.count}</span></span>`)
        .join("")
    : `<span style="color:#9ca3af;">No location data yet</span>`;

  // Report type rows
  const reportTypeRows = Object.keys(stats.recentReportTypes).length > 0
    ? Object.entries(stats.recentReportTypes)
        .sort(([, a], [, b]) => b - a)
        .map(([type, count]) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-transform:capitalize;">${type.replace(/_/g, " ")}</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;">${count}</td></tr>`)
        .join("")
    : `<tr><td colspan="2" style="padding:12px;color:#9ca3af;">No reports this week</td></tr>`;

  const statRow = (label: string, total: number, week: number) =>
    `<tr>
      <td style="padding:8px 0;color:#6b7280;font-size:14px;">${label}</td>
      <td style="padding:8px 12px;text-align:right;font-size:20px;font-weight:700;">${total.toLocaleString()}</td>
      <td style="padding:8px 0;text-align:right;font-size:13px;${week > 0 ? "color:#16a34a;" : "color:#9ca3af;"}">${week > 0 ? `+${week} this week` : "—"}</td>
    </tr>`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:20px 16px;">

    <!-- Header -->
    <div style="background:#0f172a;color:white;padding:24px 20px;border-radius:12px 12px 0 0;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">SkyLedger</div>
      <div style="font-size:22px;font-weight:700;margin-top:4px;">Weekly Report</div>
      <div style="font-size:14px;color:#94a3b8;margin-top:6px;">${fmt(weekStart)} &mdash; ${fmt(weekEnd)}</div>
    </div>

    <!-- Stats -->
    <div style="background:white;padding:20px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
      <table style="width:100%;border-collapse:collapse;">
        ${statRow("Citizen Reports", stats.citizenReports.total, stats.citizenReports.thisWeek)}
        ${statRow("Evidence Photos", stats.evidencePhotos.total, stats.evidencePhotos.thisWeek)}
        ${statRow("Aircraft Flagged", stats.flightFlags.total, stats.flightFlags.thisWeek)}
        ${statRow("Flag Submissions", stats.flagSubmissions.total, stats.flagSubmissions.thisWeek)}
        ${statRow("Tracked Aircraft", stats.flightSummaries.totalAircraft, 0)}
        ${statRow("Total Sightings", stats.flightSummaries.totalSightings, 0)}
      </table>
      ${stats.flightFlags.highThreat > 0 ? `<div style="margin-top:8px;padding:8px 12px;background:#fef2f2;border-radius:8px;font-size:13px;color:#991b1b;"><strong>${stats.flightFlags.highThreat}</strong> aircraft at high threat level</div>` : ""}
    </div>

    <!-- Activity by State -->
    <div style="background:white;padding:20px;border:1px solid #e5e7eb;border-top:none;">
      <div style="font-size:15px;font-weight:700;margin-bottom:12px;">Activity by State</div>
      <div>${statePills}</div>
      ${stats.activityByState.length > 0 ? `<div style="margin-top:8px;font-size:12px;color:#9ca3af;">${stats.activityByState.length} state${stats.activityByState.length !== 1 ? "s" : ""} with activity</div>` : ""}
    </div>

    <!-- Top Flagged Aircraft -->
    <div style="background:white;padding:20px;border:1px solid #e5e7eb;border-top:none;">
      <div style="font-size:15px;font-weight:700;margin-bottom:12px;">Top Flagged Aircraft</div>
      <table style="width:100%;border-collapse:collapse;">
        <tr style="font-size:11px;text-transform:uppercase;color:#9ca3af;letter-spacing:0.5px;">
          <th style="padding:4px 12px;text-align:left;">Tail</th>
          <th style="padding:4px 12px;text-align:center;">Flags</th>
          <th style="padding:4px 12px;text-align:center;">Threat</th>
        </tr>
        ${topFlaggedRows}
      </table>
    </div>

    <!-- Report Types -->
    <div style="background:white;padding:20px;border:1px solid #e5e7eb;border-top:none;">
      <div style="font-size:15px;font-weight:700;margin-bottom:12px;">This Week's Report Types</div>
      <table style="width:100%;border-collapse:collapse;">
        ${reportTypeRows}
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#f3f4f6;padding:16px 20px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">
      <div style="font-size:13px;color:#6b7280;">
        <a href="https://mail.google.com/mail/u/?authuser=${stats.archiveEmail}" style="color:#2563eb;text-decoration:none;">View photos in ${stats.archiveEmail}</a>
      </div>
      <div style="font-size:13px;color:#6b7280;margin-top:6px;">
        <a href="https://skyledger.org/admin" style="color:#2563eb;text-decoration:none;">Open Admin Dashboard</a>
      </div>
      <div style="margin-top:12px;font-size:11px;color:#9ca3af;">SkyLedger Automated Report</div>
    </div>

  </div>
</body>
</html>`.trim();

  const subject = `[SkyLedger] Weekly Report — ${fmt(weekStart)} to ${fmt(weekEnd)}`;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user: address, pass: password },
  });

  await transport.sendMail({
    from: address,
    to: adminEmail,
    subject,
    html,
  });
}
