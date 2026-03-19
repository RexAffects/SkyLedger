import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Clear Skies Act (H.R. 4403)",
  description:
    "The Clear Skies Act would ban weather modification and geoengineering at the federal level, with felony penalties.",
};

export default function ClearSkiesActPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to home
      </Link>

      <h1 className="mt-6 text-3xl font-bold">The Clear Skies Act</h1>
      <p className="text-lg text-muted-foreground mt-2">H.R. 4403 — 119th Congress</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Status
          </h3>
          <p className="mt-2 text-sm">
            Introduced July 15, 2025. Referred to House Committee on Energy and
            Commerce. Not yet voted on.
          </p>
        </div>
        <div className="rounded-lg border border-border p-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Sponsor
          </h3>
          <p className="mt-2 text-sm">
            Rep. Marjorie Taylor Greene (R-GA), with 3 cosponsors. Greene also
            chaired the September 2025 congressional hearing on weather
            modification.
          </p>
        </div>
        <div className="rounded-lg border border-border p-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Penalties
          </h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-400 font-medium">
            Up to $100,000 fine and up to 5 years imprisonment
          </p>
        </div>
        <div className="rounded-lg border border-border p-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Scope
          </h3>
          <p className="mt-2 text-sm">
            Would ban all weather modification and geoengineering activities at
            the federal level and create a public reporting system.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">What the Bill Would Do</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="shrink-0">1.</span>
            <span>
              <strong>Ban weather modification</strong> — Prohibit any person or
              entity from conducting weather modification or geoengineering
              activities in the United States
            </span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">2.</span>
            <span>
              <strong>Felony penalties</strong> — Violations would be punishable
              by up to $100,000 in fines and up to 5 years in federal prison
            </span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">3.</span>
            <span>
              <strong>Public reporting system</strong> — Establish a mechanism
              for citizens to report suspected weather modification activities
            </span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">4.</span>
            <span>
              <strong>Federal oversight</strong> — Address the gap identified by
              the GAO in federal monitoring and enforcement of existing weather
              modification regulations
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-8 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Context</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          The Clear Skies Act was introduced in the context of growing public
          concern about weather modification and geoengineering. At the{" "}
          <Link
            href="/learn/congressional-hearing"
            className="text-primary hover:underline"
          >
            September 2025 congressional hearing
          </Link>
          , Rep. Greene stated: &quot;I don&apos;t think it&apos;s the job of
          the federal government to help these people play God with the weather.
          I think it&apos;s the job of Congress to protect our people and make
          sure that weather and climate control experiments do not create
          adverse, unintended consequences for the rest of us.&quot;
        </p>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          EPA Administrator Lee Zeldin also addressed the issue, stating:
          &quot;Americans have urgent and important questions about
          geoengineering and contrails. The American public deserves and expects
          honesty and transparency from their government. For years, people who
          asked questions in good faith were dismissed, even vilified. That era
          is over.&quot;
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6">
        <h3 className="font-semibold">Sources</h3>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <a
              href="https://www.govtrack.us/congress/bills/119/hr4403"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GovTrack — H.R. 4403 Clear Skies Act (bill text, status,
              cosponsors) &rarr;
            </a>
          </li>
          <li>
            <a
              href="https://www.eenews.net/articles/marjorie-taylor-greene-introduces-weather-modification-ban-2/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              E&amp;E News / Politico — &quot;Marjorie Taylor Greene introduces
              weather modification ban&quot; &rarr;
            </a>
          </li>
          <li>
            <a
              href="https://www.govinfo.gov/app/details/BILLS-119hr4403ih"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GovInfo — Official bill text (PDF) &rarr;
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-8 rounded-lg border-2 border-primary/20 bg-primary/5 p-6 text-center">
        <h3 className="text-lg font-bold">Ready to take action?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Support legal efforts, contact your representatives, and help bring
          transparency to your community.
        </p>
        <Link
          href="/get-involved"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Get Involved &rarr;
        </Link>
      </div>
    </div>
  );
}
