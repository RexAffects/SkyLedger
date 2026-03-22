import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

const stats = [
  {
    label: "States with bans enacted",
    value: "3",
    href: "/learn/state-bans",
    detail: "Tennessee, Florida, Louisiana",
  },
  {
    label: "States with pending bills",
    value: "30+",
    href: "/learn/pending-bills",
    detail: "Bills introduced across the U.S.",
  },
  {
    label: "Federal bill introduced",
    value: "Clear Skies Act",
    href: "/learn/clear-skies-act",
    detail: "H.R. 4403 — 119th Congress",
  },
  {
    label: "Congressional hearing",
    value: "Sept 2025",
    href: "/learn/congressional-hearing",
    detail: "\"Playing God with the Weather\"",
  },
];

const learnTopics = [
  {
    title: "The Facts",
    description:
      "Every claim cited. 70 years of programs, 9 active states, sworn testimony, GAO audit. One page, downloadable, shareable.",
    href: "/learn/facts",
  },
  {
    title: "Follow the Money",
    description:
      "$150M+ from a small network of connected investors. Defense ties. Epstein connections. Political access. The funding pipeline mapped.",
    href: "/learn/follow-the-money",
  },
  {
    title: "Who's Doing It",
    description:
      "9 operator profiles with founders, funding rounds, investors, and red flags. Including Stardust Solutions — secret particles, nuclear scientists, $75M.",
    href: "/learn/operators",
  },
  {
    title: "Legislation Tracker",
    description:
      "3 states have enacted bans. 30+ have bills pending. A federal ban is on the table. Track every bill, every vote, every penalty.",
    href: "/learn/legislation",
  },
];

const dataSources = [
  "ADS-B Exchange (unfiltered flight tracking)",
  "FAA Aircraft Registry (ownership records)",
  "NOAA Weather Modification Reports",
  "USASpending.gov (federal contracts)",
  "EPA Air Quality System",
  "State weather modification permits",
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              What&apos;s flying over you?
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              SkyLedger gives everyday citizens a real way to do something
              about it &mdash; track flights, build evidence, follow the money,
              and join the movement passing laws across America.
            </p>
          </div>

          {/* Three Pillars */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
            <Link
              href="/flights"
              className="group rounded-xl border-2 border-primary bg-background p-6 text-center transition-all hover:shadow-lg hover:scale-[1.02]"
            >
              <p className="text-2xl font-bold group-hover:text-primary transition-colors">
                Track &amp; Tag
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                See something overhead? Track it live. Identify the operator.
                Tag known cloud seeders. Submit photo evidence &mdash; we
                cross-reference your photo&apos;s time and location with live
                flight data automatically.
              </p>
              <p className="mt-4 text-sm text-primary font-medium">
                Track it now &rarr;
              </p>
            </Link>

            <Link
              href="/get-involved"
              className="group rounded-xl border border-border bg-background p-6 text-center transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/40"
            >
              <p className="text-2xl font-bold group-hover:text-primary transition-colors">
                Take Action
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Ready-to-send legislator letters. Printable flyers. Request
                government records. Support the federal lawsuit. Donate to the
                organizations on the front lines.
              </p>
              <p className="mt-4 text-sm text-primary font-medium">
                Get involved &rarr;
              </p>
            </Link>

            <Link
              href="/learn"
              className="group rounded-xl border border-border bg-background p-6 text-center transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/40"
            >
              <p className="text-2xl font-bold group-hover:text-primary transition-colors">
                Learn the Facts
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Follow the money. Read the congressional testimony. See who&apos;s
                funding this. Every claim cited with government records and
                primary sources.
              </p>
              <p className="mt-4 text-sm text-primary font-medium">
                Look at the whole picture &rarr;
              </p>
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            We don&apos;t make accusations. We present data from public
            government sources.{" "}
            <Link href="/learn/facts" className="underline hover:text-primary transition-colors">
              The facts speak for themselves.
            </Link>
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="text-center group transition-colors hover:bg-muted/50 rounded-lg p-2 -m-2"
              >
                <p className="text-2xl font-bold group-hover:text-primary transition-colors underline decoration-transparent group-hover:decoration-primary underline-offset-4">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5 hidden sm:block">
                  {stat.detail}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What the flight tracker shows you */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              One click. Full transparency.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Click any aircraft in the live tracker and instantly see
              everything public data can tell you about it.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Who owns it",
                detail: "FAA-registered owner name, city, state. Corporate entity piercing — see who's behind the LLC.",
              },
              {
                label: "Where it's going",
                detail: "Departure & arrival airports when available",
              },
              {
                label: "What type it is",
                detail: "Aircraft make, model, year, photo",
              },
              {
                label: "Live tracking",
                detail: "Real-time position, speed, heading + flight trail drawn on the map",
              },
              {
                label: "Tagged & logged",
                detail: "Known cloud seeding operators are tagged and logged in the public ledger. Orange = seeding-range aircraft, purple = high altitude, red = known weather modification operator.",
              },
              {
                label: "Tamper-proof record",
                detail: "Every data point from government sources. SHA-256 hashed — the same integrity standard used in federal court.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border p-4"
              >
                <p className="font-medium text-sm">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <LinkButton href="/flights" size="lg">
              Open Flight Tracker
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Submit a Photo CTA */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              See something? Photograph it.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Your phone is a documentation tool. Every photo submitted to
              SkyLedger is automatically GPS-tagged, timestamped, and{" "}
              <span className="group relative inline-block">
                <span className="border-b border-dotted border-muted-foreground/50 cursor-help">
                  SHA-256 hashed
                </span>
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg opacity-0 transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto z-50">
                  <span className="font-semibold block mb-1">
                    What does this mean?
                  </span>
                  Every photo gets a unique digital fingerprint (SHA-256 hash) at
                  the moment of upload. If anyone changes even one pixel, the hash
                  changes — proving the image is unaltered. This is the same
                  integrity standard used in federal digital evidence proceedings
                  (FRE 902(13)/(14)).
                  <span className="absolute left-1/2 top-full -translate-x-1/2 -mt-px border-4 border-transparent border-t-border" />
                </span>
              </span>{" "}
              &mdash; creating a tamper-proof record that can&apos;t be altered
              after the fact.
            </p>
          </div>
          <div className="mt-12 mx-auto max-w-4xl">
            <div className="rounded-xl overflow-hidden border border-border shadow-sm">
              <Image
                src="/images/trail-examples.jpg"
                alt="Examples of citizen-submitted sky observations showing various trail patterns and atmospheric phenomena"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority={false}
              />
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Real observations from citizens across the country. Photos like
              these help build the public record.
            </p>
          </div>
          <div className="mt-8 text-center">
            <LinkButton href="/reports/new" size="lg">
              Submit an Observation
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Knowledge Bank — for skeptics and believers alike */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              The facts, cited and sourced
            </h2>
            <p className="mt-4 text-muted-foreground">
              Whether you&apos;re skeptical or concerned, start here. Every
              claim links to its source &mdash; congressional records, state
              legislation, government databases, peer-reviewed science.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {learnTopics.map((topic) => (
              <Link key={topic.title} href={topic.href}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold">{topic.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {topic.description}
                    </p>
                    <p className="mt-3 text-xs text-primary font-medium">
                      Read more &rarr;
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Support the Cause */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              How you can help
            </h2>
            <p className="mt-4 text-muted-foreground">
              This fight is being won by everyday people showing up. Here&apos;s
              how to get involved.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold">Track &amp; Document</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use the flight tracker. Submit observations with photos.
                  Every data point builds the picture.
                </p>
                <LinkButton href="/flights" variant="outline" size="sm" className="mt-4">
                  Start Tracking
                </LinkButton>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold">Learn &amp; Share</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Read the facts. Share them. Send someone the congressional
                  hearing page. Knowledge is the first step.
                </p>
                <LinkButton href="/learn" variant="outline" size="sm" className="mt-4">
                  Read the Facts
                </LinkButton>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold">Support Legal Action</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Organizations like The GeoFight are building federal lawsuits.
                  Your state may have a bill pending right now.
                </p>
                <LinkButton href="/learn/legislation" variant="outline" size="sm" className="mt-4">
                  See Your State
                </LinkButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Our data sources
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every data point comes from a verifiable public source. We
              aggregate &mdash; the government already collected it.
            </p>
          </div>
          <div className="mt-12 mx-auto max-w-xl">
            <ul className="space-y-3">
              {dataSources.map((source) => (
                <li
                  key={source}
                  className="flex items-center gap-3 text-sm"
                >
                  <svg
                    className="h-5 w-5 shrink-0 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  {source}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">
            The data exists. The people aren&apos;t connected. Let&apos;s fix that.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Flight records, FAA registrations, funding disclosures, congressional
            testimony &mdash; it&apos;s all public. SkyLedger brings it together
            so citizens can see, prove, and act.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <LinkButton href="/flights" size="lg">
              Track &amp; Tag Now
            </LinkButton>
            <LinkButton href="/get-involved" variant="outline" size="lg">
              Take Action
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
