import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminDashboard } from "./dashboard";
import { gatherWeeklyStats } from "@/lib/email/weekly-report";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const key = typeof params.key === "string" ? params.key : "";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || key !== adminPassword) {
    redirect("/admin/login");
  }

  const stats = await gatherWeeklyStats();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <span className="text-xs text-muted-foreground">
          Last refreshed: {new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
        </span>
      </div>

      <AdminDashboard stats={stats} adminKey={key} />
    </div>
  );
}
