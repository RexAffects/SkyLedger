import nodemailer from "nodemailer";
import { createServiceClient } from "@/lib/supabase/server";

interface WeeklyStats {
  citizenReports: { total: number; thisWeek: number };
  flightFlags: { total: number; thisWeek: number; highThreat: number };
  flagSubmissions: { total: number; thisWeek: number };
  flightSummaries: { totalAircraft: number; totalSightings: number };
  topFlaggedAircraft: Array<{ tail_number: string; flag_count: number; threat_level: string }>;
  recentReportTypes: Record<string, number>;
}

export async function gatherWeeklyStats(): Promise<WeeklyStats> {
  const supabase = createServiceClient();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // All queries in parallel
  const [
    reportsTotal,
    reportsWeek,
    flagsTotal,
    flagsWeek,
    flagsHigh,
    submissionsTotal,
    submissionsWeek,
    summaries,
    topFlagged,
    recentReports,
  ] = await Promise.all([
    supabase.from("citizen_reports").select("id", { count: "exact", head: true }),
    supabase.from("citizen_reports").select("id", { count: "exact", head: true }).gte("created_at", oneWeekAgo),
    supabase.from("flight_flags").select("id", { count: "exact", head: true }),
    supabase.from("flight_flags").select("id", { count: "exact", head: true }).gte("created_at", oneWeekAgo),
    supabase.from("flight_flags").select("id", { count: "exact", head: true }).eq("threat_level", "high"),
    supabase.from("flag_submissions").select("id", { count: "exact", head: true }),
    supabase.from("flag_submissions").select("id", { count: "exact", head: true }).gte("created_at", oneWeekAgo),
    supabase.from("flight_summaries").select("total_sightings"),
    supabase.from("flight_flags").select("tail_number, flag_count, threat_level").order("flag_count", { ascending: false }).limit(10),
    supabase.from("citizen_reports").select("observation_type").gte("created_at", oneWeekAgo),
  ]);

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

  return {
    citizenReports: { total: reportsTotal.count || 0, thisWeek: reportsWeek.count || 0 },
    flightFlags: { total: flagsTotal.count || 0, thisWeek: flagsWeek.count || 0, highThreat: flagsHigh.count || 0 },
    flagSubmissions: { total: submissionsTotal.count || 0, thisWeek: submissionsWeek.count || 0 },
    flightSummaries: { totalAircraft: (summaries.data || []).length, totalSightings },
    topFlaggedAircraft: (topFlagged.data || []) as WeeklyStats["topFlaggedAircraft"],
    recentReportTypes: reportTypes,
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

  // Format top flagged aircraft
  const topFlaggedLines = stats.topFlaggedAircraft.length > 0
    ? stats.topFlaggedAircraft
        .map((a, i) => `  ${i + 1}. ${a.tail_number} — ${a.flag_count} flags (${a.threat_level})`)
        .join("\n")
    : "  No flagged aircraft yet";

  // Format report types
  const reportTypeLines = Object.keys(stats.recentReportTypes).length > 0
    ? Object.entries(stats.recentReportTypes)
        .sort(([, a], [, b]) => b - a)
        .map(([type, count]) => `  ${type.replace(/_/g, " ")}: ${count}`)
        .join("\n")
    : "  No reports this week";

  const body = `
═══════════════════════════════════════════════
  SKYLEDGER WEEKLY REPORT
  ${fmt(weekStart)} — ${fmt(weekEnd)}
═══════════════════════════════════════════════

CITIZEN REPORTS
  Total all-time:    ${stats.citizenReports.total}
  New this week:     ${stats.citizenReports.thisWeek}

FLIGHT FLAGS (unique aircraft flagged)
  Total all-time:    ${stats.flightFlags.total}
  New this week:     ${stats.flightFlags.thisWeek}
  High threat:       ${stats.flightFlags.highThreat}

FLAG SUBMISSIONS (individual reports)
  Total all-time:    ${stats.flagSubmissions.total}
  New this week:     ${stats.flagSubmissions.thisWeek}

TRACKED AIRCRAFT
  Unique aircraft:   ${stats.flightSummaries.totalAircraft}
  Total sightings:   ${stats.flightSummaries.totalSightings.toLocaleString()}

───────────────────────────────────────────────
TOP FLAGGED AIRCRAFT
───────────────────────────────────────────────
${topFlaggedLines}

───────────────────────────────────────────────
THIS WEEK'S REPORT TYPES
───────────────────────────────────────────────
${reportTypeLines}

───────────────────────────────────────────────

View photos: Check ${address} inbox
Admin dashboard: https://skyledger.org/admin
Supabase: https://supabase.com/dashboard

— SkyLedger Automated Report
`.trim();

  const subject = `[SkyLedger] Weekly Report — ${fmt(weekStart)} to ${fmt(weekEnd)}`;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user: address, pass: password },
  });

  await transport.sendMail({
    from: address,
    to: adminEmail,
    subject,
    text: body,
  });
}
