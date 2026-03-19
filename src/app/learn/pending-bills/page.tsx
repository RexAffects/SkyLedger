import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "30+ States Have Introduced Geoengineering Bills",
  description:
    "Lawmakers in over 30 US states have proposed legislation to ban, restrict, or regulate weather modification and geoengineering.",
};

export default function PendingBillsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to home
      </Link>

      <h1 className="mt-6 text-3xl font-bold">
        30+ States Have Introduced Geoengineering Bills
      </h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        A wave of state legislation is sweeping across the United States.
        Lawmakers in over 30 states have introduced bills to ban, restrict, or
        require transparency around weather modification and geoengineering
        activities. Three states have already enacted bans (Tennessee, Florida,
        Louisiana), and many more have bills actively moving through their
        legislatures.
      </p>

      <div className="mt-8 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">The Big Picture</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-green-600 font-bold shrink-0">3</span>
            <span>
              states have <strong>enacted bans</strong>: Tennessee (April 2024),
              Florida (June 2025), Louisiana (August 2025)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-yellow-600 font-bold shrink-0">30+</span>
            <span>
              states have <strong>introduced bills</strong> addressing
              geoengineering, weather modification, or atmospheric spraying
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold shrink-0">1</span>
            <span>
              federal bill introduced: the{" "}
              <Link
                href="/learn/clear-skies-act"
                className="text-primary hover:underline"
              >
                Clear Skies Act (H.R. 4403)
              </Link>
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-600 font-bold shrink-0">1</span>
            <span>
              congressional hearing held:{" "}
              <Link
                href="/learn/congressional-hearing"
                className="text-primary hover:underline"
              >
                &quot;Playing God with the Weather&quot;
              </Link>{" "}
              (September 2025)
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-8 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Notable Pending Bills</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Several states have introduced bills with significant penalties:
        </p>
        <div className="mt-4 space-y-3">
          {[
            {
              state: "Pennsylvania",
              detail: "Proposed felony classification with fines exceeding $500,000",
            },
            {
              state: "Iowa",
              detail: "Proposed felony with up to 5 years imprisonment",
            },
            {
              state: "North Carolina",
              detail: "Proposed ban on weather modification activities",
            },
            {
              state: "New Jersey",
              detail: "Proposed restrictions on atmospheric modification",
            },
            {
              state: "Rhode Island",
              detail: "Proposed geoengineering ban legislation",
            },
            {
              state: "Wyoming",
              detail: "Proposed ban with expert testimony from atmospheric researchers",
            },
          ].map((bill) => (
            <div
              key={bill.state}
              className="flex items-start gap-3 text-sm"
            >
              <span className="font-medium w-32 shrink-0">{bill.state}</span>
              <span className="text-muted-foreground">{bill.detail}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Why This Is Happening</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          The wave of state legislation is driven by growing public awareness and
          concern. A February 2026 GAO report found that NOAA&apos;s weather
          modification oversight is severely inadequate — 78% of filed reports
          contained errors, 4 of 10 states had unreported activities, and NOAA
          has never issued a single fine despite being authorized to levy
          $10,000 penalties. Citizens and lawmakers are responding to this
          federal oversight gap by taking action at the state level.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6">
        <h3 className="font-semibold">Track All Bills</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The most comprehensive tracker of US geoengineering legislation:
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <a
              href="https://srm360.org/us-bans/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              SRM360 — US Proposals to Ban Solar Geoengineering (interactive
              map + data table) &rarr;
            </a>
          </li>
          <li>
            <a
              href="https://carnegieendowment.org/research/2025/11/united-states-geoengineering-carbon-removal-bipartisan-backlash"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Carnegie Endowment — Bipartisan Backlash Against Geoengineering
              &rarr;
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
