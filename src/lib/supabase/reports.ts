import { createClient } from "./client";
import type { CitizenReport } from "@/lib/types";

const supabase = createClient();

export async function getReports(): Promise<CitizenReport[]> {
  const { data, error } = await supabase
    .from("citizen_reports")
    .select("*")
    .order("observed_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching reports:", error);
    return [];
  }

  return data as CitizenReport[];
}

export async function getReport(id: string): Promise<CitizenReport | null> {
  const { data, error } = await supabase
    .from("citizen_reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching report:", error);
    return null;
  }

  return data as CitizenReport;
}

export interface SubmitReportResult {
  report: CitizenReport | null;
  /** User-facing message when the server refused the report (validation or rate limit) */
  error?: string;
}

/**
 * Submits through POST /api/reports (server validates, rate-limits, and
 * inserts with the service role). Direct inserts with the anon key were
 * closed in migration 007 — see docs/security/2026-10-25-abuse-hardening.md.
 */
export async function submitReport(
  report: Omit<CitizenReport, "id" | "created_at" | "status" | "verification_level">
): Promise<SubmitReportResult> {
  try {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Error submitting report:", res.status, data?.error);
      // 400/429 carry a message worth showing; 5xx gets the generic UI text
      return { report: null, error: res.status < 500 ? data?.error : undefined };
    }
    return { report: data.report as CitizenReport };
  } catch (err) {
    console.error("Error submitting report:", err);
    return { report: null };
  }
}
