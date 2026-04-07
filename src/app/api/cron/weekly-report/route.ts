import { NextResponse } from "next/server";
import { sendWeeklyReport } from "@/lib/email/weekly-report";

export const maxDuration = 30;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const adminKey = url.searchParams.get("key");
  const cronSecret = process.env.CRON_SECRET;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Allow access via: Vercel cron bearer token OR admin password query param
  const cronOk = cronSecret && authHeader === `Bearer ${cronSecret}`;
  const adminOk = adminPassword && adminKey === adminPassword;

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
