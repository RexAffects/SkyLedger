import nodemailer from "nodemailer";
import type { HealthReport } from "@/lib/health";

/**
 * Email the admin when a health check finds a problem.
 * Same Gmail transport as the weekly report.
 */
export async function sendHealthAlert(report: HealthReport): Promise<void> {
  const address = process.env.GMAIL_ADDRESS;
  const password = process.env.GMAIL_APP_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL || address;

  if (!address || !password) {
    throw new Error("GMAIL_ADDRESS or GMAIL_APP_PASSWORD not configured");
  }

  // "fallback" only when the primary feed is actually failing; a schema or
  // secondary problem is "needs attention" so the subject isn't alarming.
  const primaryFeedFailing = report.flight_feed.providers[0]?.ok === false;
  const headline =
    report.status === "down"
      ? "SkyLedger radar is DOWN"
      : primaryFeedFailing
        ? "SkyLedger is running on a fallback"
        : "SkyLedger needs attention (site is up)";

  const text = [
    headline,
    "",
    "Problems:",
    ...report.problems.map((p) => `  - ${p}`),
    "",
    `Serving radar right now: ${report.flight_feed.serving ?? "NOTHING — /flights shows 'Failed to fetch flights'"}`,
    "",
    "Provider checks:",
    ...report.flight_feed.providers.map(
      (p) =>
        `  ${p.ok ? "OK  " : "FAIL"} ${p.provider} — ${p.ok ? `${p.count} aircraft` : p.error} (${p.ms}ms)`
    ),
    `  ${report.database.ok ? "OK  " : "FAIL"} database (${report.database.ms}ms)${report.database.error ? ` — ${report.database.error}` : ""}`,
    "",
    `Checked at ${report.checked_at}`,
    "Live status: https://skyledger.org/api/health",
    "Runbook: docs/incidents/2026-10-25-flight-feed-403.md in the SkyLedger repo",
  ].join("\n");

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user: address, pass: password },
  });

  await transport.sendMail({
    from: address,
    to: adminEmail,
    subject: `[SkyLedger] ${headline}`,
    text,
  });
}
