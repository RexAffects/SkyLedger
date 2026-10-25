import { NextResponse } from "next/server";
import { runHealthChecks } from "@/lib/health";
import { sendHealthAlert } from "@/lib/email/ops-alert";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * GET /api/cron/health-check — daily Vercel Cron (see vercel.json).
 * Emails ADMIN_EMAIL if anything is degraded or down; silent when healthy.
 * Add ?test=1 to force an email so you can confirm alerts arrive.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report = await runHealthChecks();
  const forceEmail = new URL(request.url).searchParams.get("test") === "1";

  let emailed = false;
  if (report.status !== "ok" || forceEmail) {
    try {
      await sendHealthAlert(report);
      emailed = true;
    } catch (err) {
      console.error("Health alert email failed:", err);
    }
  }

  if (report.status !== "ok") {
    console.error("[health-check]", JSON.stringify(report));
  }

  return NextResponse.json({ ...report, emailed });
}
