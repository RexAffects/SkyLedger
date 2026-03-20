import type { Metadata } from "next";
import Link from "next/link";
import { FRONTLINE_ORGS } from "@/lib/data/legal";

export const metadata: Metadata = {
  title: "Support the Fight — Donate | SkyLedger",
  description:
    "Support the organizations on the front lines of the fight against unauthorized geoengineering. Legal funds, FOIA campaigns, independent research.",
};

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/get-involved"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Get Involved
      </Link>

      {/* Hero */}
      <h1 className="mt-6 text-3xl font-bold">Support the Fight</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Legal battles cost money. FOIA requests cost money. Independent lab
        testing costs money. These organizations are doing the work &mdash; they
        need your support.
      </p>

      {/* Organization Cards */}
      <section className="mt-10 space-y-6">
        {FRONTLINE_ORGS.map((org) => (
          <div
            key={org.slug}
            className="rounded-lg border border-border p-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{org.name}</h2>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${org.tagColor}`}
              >
                {org.tag}
              </span>
              {org.taxDeductible && (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Tax-deductible
                </span>
              )}
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              {org.mission}
            </p>

            <div className="mt-4">
              <p className="text-sm font-medium">
                What your donation funds:
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {org.whatDonationsFund}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium">Impact examples:</p>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                {org.impactExamples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </div>

            {org.keyWins && org.keyWins.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium">Key wins:</p>
                <ul className="mt-1 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  {org.keyWins.map((win) => (
                    <li key={win}>{win}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-5">
              <a
                href={org.donateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                Donate to {org.shortName} &rarr;
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* Other Ways to Help */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Other ways to help</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-5">
            <h3 className="font-semibold text-sm">Volunteer Your Time</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Attend state legislative hearings. Help with outreach campaigns.
              Organize local awareness events. Your presence at public meetings
              makes a real difference &mdash; legislators respond to
              constituents who show up.
            </p>
          </div>
          <div className="rounded-lg border border-border p-5">
            <h3 className="font-semibold text-sm">Share the Platform</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Send SkyLedger to someone who needs to see it. The more eyes on
              the data, the harder it is to ignore. One link can change
              someone&apos;s understanding of what&apos;s happening in our
              skies.
            </p>
          </div>
          <Link
            href="/get-involved/foia"
            className="rounded-lg border border-border p-5 transition-shadow hover:shadow-md"
          >
            <h3 className="font-semibold text-sm">File a FOIA</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Use our FOIA request generator to demand records from government
              agencies. Every FOIA request forces a response. Agencies must
              comply within 20 business days.
            </p>
            <p className="mt-2 text-xs text-primary font-medium">
              Go to FOIA generator &rarr;
            </p>
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mt-12 mb-8">
        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Disclaimer:</span>{" "}
            SkyLedger is not affiliated with any of the organizations listed
            above. We provide these links as a resource for citizens who want
            to take action. We encourage you to research any organization
            before donating. SkyLedger does not currently collect donations
            &mdash; all donation links go directly to the organizations listed.
          </p>
        </div>
      </section>
    </div>
  );
}
