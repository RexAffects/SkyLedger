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

export async function submitReport(
  report: Omit<CitizenReport, "id" | "created_at" | "status" | "verification_level">
): Promise<CitizenReport | null> {
  const { data, error } = await supabase
    .from("citizen_reports")
    .insert({
      ...report,
      verification_level: 1,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    console.error("Error submitting report:", error);
    return null;
  }

  return data as CitizenReport;
}
