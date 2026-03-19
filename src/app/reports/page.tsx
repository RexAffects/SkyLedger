import type { Metadata } from "next";
import { ReportFeed } from "./report-feed";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Browse citizen observations of weather modification activity. Each report includes location, photos, and evidence hashes.",
};

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Observations</h1>
        <p className="mt-2 text-muted-foreground">
          Citizen-submitted observations with GPS-tagged photos and SHA-256
          evidence hashing. Each report documents what was seen, not what is
          concluded.
        </p>
      </div>
      <ReportFeed />
    </div>
  );
}
