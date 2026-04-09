import type { Metadata } from "next";
import { StreakReportForm } from "@/components/streak/streak-report-form";

export const metadata: Metadata = {
  title: "Report Recent Activity",
  description:
    "Log recent aerial activity you've observed. Your report helps the system correlate recent flight data to identify patterns over time.",
};

export default function StreakReportPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Report Recent Activity</h1>
        <p className="mt-2 text-muted-foreground">
          Notice recent streaking, grid patterns, or persistent trails in the sky?
          Log what you see and the system will retroactively identify aircraft that
          were in your area during the time window.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          This data feeds an internal pattern recognition system. Over time, repeat
          operators and statistical anomalies surface automatically. Nothing is
          publicly attributed &mdash; the patterns speak for themselves.
        </p>
      </div>
      <StreakReportForm />
    </div>
  );
}
