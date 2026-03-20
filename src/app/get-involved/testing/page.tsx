import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Testing Coordination — SkyLedger",
  description:
    "How to test your own soil, water, and air for elevated metals. Sample collection guides, lab recommendations, and chain of custody for legal admissibility.",
};

const testTargets = [
  {
    substance: "Aluminum",
    details:
      "Found in soil naturally but elevated levels in rainwater are abnormal. Normal rainwater: near 0 ppb.",
  },
  {
    substance: "Barium",
    details:
      "Should not be present in significant quantities in rainwater.",
  },
  {
    substance: "Strontium",
    details:
      "Another marker. Should be near-zero in clean rainwater.",
  },
  {
    substance: "Silver Iodide",
    details:
      "The primary cloud seeding agent. If found in rainwater, cloud seeding is occurring.",
  },
];

const collectionMethods = [
  {
    type: "Rainwater",
    steps:
      "Use a clean glass or stainless steel container (never plastic). Place outdoors away from trees and buildings. Collect immediately after rain begins. Label with date, time, location, and weather conditions.",
  },
  {
    type: "Snow",
    steps:
      "Collect fresh snow in a clean glass container. Note the same metadata: date, time, location, and weather conditions.",
  },
  {
    type: "Soil",
    steps:
      "Use a clean stainless steel trowel. Collect from 2\u20134 inches depth. Place in a labeled glass jar.",
  },
  {
    type: "Chain of Custody",
    steps:
      "For legal admissibility \u2014 photograph the collection, note GPS coordinates, keep a log, don\u2019t break the seal until at the lab.",
  },
];

export default function TestingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/get-involved"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Get Involved
      </Link>

      {/* Hero */}
      <h1 className="mt-6 text-3xl font-bold">Test Your Environment</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Independent verification matters. If geoengineering is happening, it
        leaves traces in rainwater, snow, and soil. You can test for this
        yourself.
      </p>

      {/* What to Test For */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">What to test for</h2>
        <div className="mt-4 rounded-lg border border-border p-6">
          <div className="space-y-4">
            {testTargets.map((target) => (
              <div key={target.substance} className="flex gap-4">
                <span className="shrink-0 font-semibold text-sm w-28">
                  {target.substance}
                </span>
                <p className="text-sm text-muted-foreground">
                  {target.details}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-md bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Note:</span>{" "}
              Having elevated levels doesn&apos;t prove geoengineering on its
              own, but combined with flight tracking data and visual
              observations, it builds a stronger evidence case.
            </p>
          </div>
        </div>
      </section>

      {/* How to Collect Samples */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">How to collect samples</h2>
        <div className="mt-4 space-y-4">
          {collectionMethods.map((method) => (
            <div
              key={method.type}
              className="rounded-lg border border-border p-5"
            >
              <h3 className="font-semibold text-sm">{method.type}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {method.steps}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Where to Send Samples */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Where to send samples</h2>
        <div className="mt-4 rounded-lg border border-border p-6">
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="shrink-0 text-foreground font-medium">
                University extension services
              </span>
              <span>&mdash; $15&ndash;40 for basic metals testing</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0 text-foreground font-medium">
                Private labs
              </span>
              <span>
                &mdash; Basic Metals Panel: ~$50&ndash;150
              </span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Request analysis for:{" "}
            <span className="font-medium text-foreground">
              aluminum, barium, strontium, silver
            </span>
          </p>
          <div className="mt-4">
            <a
              href="https://geoengineeringwatch.org/how-to-test-2/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline font-medium"
            >
              Geoengineering Watch testing guide &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Existing Results */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Existing results</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-5">
            <h3 className="font-semibold text-sm">
              Geoengineering Watch Lab Results
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Independent lab testing has shown elevated aluminum, barium, and
              strontium in rainwater and soil samples from across the country.
            </p>
            <a
              href="https://geoengineeringwatch.org/lab-tests-2/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs text-primary hover:underline font-medium"
            >
              View lab results &rarr;
            </a>
          </div>
          <div className="rounded-lg border border-border p-5">
            <h3 className="font-semibold text-sm">ICAN FOIA Findings</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Government&apos;s own sampling programs. FOIA-obtained documents
              revealing what agencies already know about atmospheric
              contamination.
            </p>
            <a
              href="https://icandecide.org"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs text-primary hover:underline font-medium"
            >
              View ICAN findings &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Share Your Results */}
      <section className="mt-12">
        <div className="rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold">Share your results</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Document your results and share them. Submit a citizen observation
            through SkyLedger with your testing data attached. Every data point
            strengthens the case for transparency.
          </p>
          <div className="mt-4">
            <Link
              href="/reports/new"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Submit an Observation &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Important Context */}
      <section className="mt-12 mb-8">
        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <p className="text-sm font-medium text-foreground">
            Important context
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Environmental testing is one piece of evidence. Elevated metals
            alone don&apos;t prove anything &mdash; but combined with flight
            data, visual observations, and official records, they contribute to
            a broader picture. We encourage scientific rigor: test controls,
            document methodology, use accredited labs.
          </p>
        </div>
      </section>
    </div>
  );
}
