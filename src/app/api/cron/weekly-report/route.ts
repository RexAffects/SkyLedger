import { NextResponse } from "next/server";
import { sendWeeklyReport } from "@/lib/email/weekly-report";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const maxDuration = 30;

async function handleReport(request: Request) {
  // Allow access via: Vercel cron bearer token OR admin session cookie
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  const cronOk = cronSecret && authHeader === `Bearer ${cronSecret}`;
  const adminOk = await isAdminAuthenticated();

  if (!cronOk && !adminOk) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await sendWeeklyReport();
    return NextResponse.json({ success: true, sent_at: new Date().toISOString() });
  } catch (err) {
    console.error("Weekly report error:", err);
    return NextResponse.json(
      { error: "Failed to send weekly report" },
      { status: 500 }
    );
  }
}

// GET for Vercel Cron, POST for dashboard button
export const GET = handleReport;
export const POST = handleReport;
