import { NextResponse } from "next/server";
import { sendWeeklyReport } from "@/lib/email/weekly-report";

export const maxDuration = 30;

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
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
