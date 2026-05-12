import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 10;

/**
 * Simple keep-alive endpoint to prevent Supabase from pausing due to inactivity.
 * Called daily by GitHub Actions.
 */
export async function GET(request: Request) {
  // Optional: verify request is from GitHub Actions or has correct token
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.KEEP_ALIVE_SECRET;

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    // Simple query to generate database activity
    const { data, error } = await supabase
      .from("citizen_reports")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Keep-alive query failed:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    console.log("Keep-alive ping successful");
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      message: "Supabase connection active",
    });
  } catch (err) {
    console.error("Keep-alive error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
