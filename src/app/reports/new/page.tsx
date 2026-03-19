import type { Metadata } from "next";
import { ReportForm } from "@/components/reports/report-form";

export const metadata: Metadata = {
  title: "Submit Observation",
  description:
    "Document what you observe in your skies. Upload photos with GPS data and contribute to the citizen observation network.",
};

export default function NewReportPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Submit Observation</h1>
        <p className="mt-2 text-muted-foreground">
          Document what you see. Stick to facts &mdash; what you observed, when,
          and where. The data speaks for itself.
        </p>
      </div>
      <ReportForm />
    </div>
  );
}
