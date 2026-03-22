import type { Metadata } from "next";
import { ReportFeed } from "./report-feed";

export const metadata: Metadata = {
  title: "Evidence Ledger",
  description:
    "Browse citizen-submitted evidence of weather modification activity. Each entry includes location, photos, and SHA-256 evidence hashes.",
};

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Evidence Ledger</h1>
        <p className="mt-2 text-muted-foreground">
          Citizen-submitted evidence with GPS-tagged photos and SHA-256
          evidence hashing. Each entry documents what was seen, not what is
          concluded.
        </p>
        <p className="mt-2 text-xs text-muted-foreground/70">
          Photos and observations are submitted by community members and have
          not been independently verified. SkyLedger is a platform, not a
          publisher &mdash; users are responsible for the content they submit.
        </p>
      </div>
      <ReportFeed />
    </div>
  );
}
