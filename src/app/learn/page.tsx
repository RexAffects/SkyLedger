import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Learn — SkyLedger Knowledge Base",
  description:
    "Everything you need to know about weather modification in America. Facts, legislation, operators, congressional testimony, and how to take action — all cited with primary sources.",
};

interface TopicCard {
  href: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  highlight?: string;
}

const startHere: TopicCard[] = [
  {
    href: "/learn/facts",
    title: "The Facts",
    description:
      "Everything in one page. 7 sections, every claim cited. Downloadable and shareable. Start here if you're new.",
    tag: "Start here",
    tagColor:
      "bg-primary text-primary-foreground",
    highlight:
      "70 years of programs, 9 active states, sworn congressional testimony, GAO audit.",
  },
  {
    href: "/learn/congressional-hearing",
    title: "Congressional Hearing Summary",
    description:
      "\"Playing God with the Weather\" — September 2025. Three experts testified under oath. EPA Administrator Zeldin announced a shift to \"total transparency.\"",
    tag: "Sworn testimony",
    tagColor:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    highlight:
      "Dr. Pielke: \"We've been trying to modify the weather for 70 years, and we don't know if we're modifying the weather.\"",
  },
];

const legislation: TopicCard[] = [
  {
    href: "/learn/legislation",
    title: "Legislation Tracker",
    description:
      "Every state and federal bill in one place. 3 enacted bans, 9+ pending bills, 10 failed attempts, timeline, and penalty comparisons.",
    tag: "22 states",
    tagColor:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    highlight:
      "Tennessee started it. Florida made it a felony. Louisiana gets 400+ citizen reports. 30+ more states are pushing bills.",
  },
  {
    href: "/learn/clear-skies-act",
    title: "The Clear Skies Act (H.R. 4403)",
    description:
      "Federal bill to ban all weather modification nationwide. $100,000 fine and 5 years imprisonment. Introduced July 2025.",
    tag: "Federal bill",
    tagColor:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    href: "/learn/state-bans",
    title: "Enacted State Bans",
    description:
      "Deep dive into the three states that have signed bans into law — Tennessee, Florida, and Louisiana. Full bill text, penalties, and reporting portals.",
    tag: "3 states",
    tagColor:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    href: "/learn/pending-bills",
    title: "Pending Bills Overview",
    description:
      "The wave of 30+ state bills with notable proposals from Pennsylvania ($500K felony), Iowa (advancing), and more.",
    tag: "30+ states",
    tagColor:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
];

const operators: TopicCard[] = [
  {
    href: "/learn/operators",
    title: "Operator & Startup Profiles",
    description:
      "9 detailed profiles of companies and funders involved in weather modification and geoengineering. Founders, funding rounds, investors, connections, and sources.",
    tag: "9 profiles",
    tagColor:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    highlight:
      "$150M+ in geoengineering startup funding. One company raised $75M in under 3 years from defense-intelligence-connected investors.",
  },
];

const keyNumbers = [
  { value: "70+", label: "years of weather modification in the US" },
  { value: "9", label: "states actively running cloud seeding programs" },
  { value: "600+", label: "weather modification patents in the USPTO" },
  { value: "$150M+", label: "in geoengineering startup funding" },
  { value: "78%", label: "of NOAA reports contain errors (GAO, Feb 2026)" },
  { value: "0", label: "fines issued by NOAA in 50+ years of authority" },
  { value: "3", label: "states have enacted bans" },
  { value: "30+", label: "states have introduced bills" },
];

function TopicCardComponent({ card }: { card: TopicCard }) {
  return (
    <Link href={card.href} className="block group">
      <div className="rounded-lg border border-border p-5 h-full transition-all hover:border-primary/40 hover:shadow-sm">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
            {card.title}
          </h3>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${card.tagColor}`}
          >
            {card.tag}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          {card.description}
        </p>
        {card.highlight && (
          <p className="mt-2 text-xs font-medium text-foreground/80 leading-relaxed">
            {card.highlight}
          </p>
        )}
        <p className="mt-3 text-xs text-primary font-medium">
          Read &rarr;
        </p>
      </div>
    </Link>
  );
}

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to home
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Knowledge Base</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Everything SkyLedger has documented about weather modification in
        America. Government records, sworn congressional testimony, corporate
        filings, and state legislation. Every claim is cited with its primary
        source.
      </p>

      {/* ============================================================ */}
      {/* KEY NUMBERS */}
      {/* ============================================================ */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {keyNumbers.map((n) => (
          <div
            key={n.label}
            className="rounded-lg border border-border p-3 text-center"
          >
            <p className="text-xl font-bold">{n.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
              {n.label}
            </p>
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* START HERE */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Start Here</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          New to this? These two pages give you the full picture.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {startHere.map((card) => (
            <TopicCardComponent key={card.href} card={card} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* LEGISLATION */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Legislation</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          The legal fight &mdash; state bans, pending bills, and the federal
          response.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {legislation.map((card) => (
            <TopicCardComponent key={card.href} card={card} />
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* OPERATORS */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">
          Operators &amp; Money
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Who&apos;s doing it, who&apos;s funding it, and how much money is
          flowing in.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {operators.map((card) => (
            <TopicCardComponent key={card.href} card={card} />
          ))}
          <TopicCardComponent
            card={{
              href: "/learn/follow-the-money",
              title: "Follow the Money",
              description:
                "The funding network behind geoengineering \u2014 who funds the research, the lobbying, and the deployment companies. 8 investor profiles, 15 cross-connections, every claim sourced.",
              tag: "$150M+ tracked",
              tagColor:
                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
              highlight:
                "One fund sits at every seat from research to profit. Defense/intelligence seed money. Epstein connections. Direct White House access.",
            }}
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* EVIDENCE */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Evidence &amp; Records</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Government documents, scientific data, and historical records that
          can&apos;t be dismissed.
        </p>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold text-sm">GAO Oversight Report (February 2026)</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              The government&apos;s own auditor found NOAA&apos;s weather
              modification oversight is broken &mdash; 78% error rate, no written
              guidance, forms unchanged since 1974, zero fines ever issued.
            </p>
            <a
              href="https://www.gao.gov/products/gao-26-108013"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-primary hover:underline"
            >
              Read the GAO report &rarr;
            </a>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold text-sm">600+ Weather Modification Patents</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              The US Patent Office contains over 600 weather modification patents
              dating from 1891 to 2023. Every one is numbered, dated, and titled.
              Public records anyone can look up.
            </p>
            <a
              href="https://geoengineeringwatch.org/links-to-geoengineering-patents/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-primary hover:underline"
            >
              Browse the patent archive (Geoengineering Watch) &rarr;
            </a>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold text-sm">Government Document Library</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Senate reports, CIA weather warfare analysis, NASA weather
              modification programs, DOD &quot;Owning the Weather in 2025&quot;
              (1996), the 750-page 1978 Congressional Report on weather
              modification, and WMO statements.
            </p>
            <a
              href="https://geoengineeringwatch.org/documents-2/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-primary hover:underline"
            >
              Browse the document library (Geoengineering Watch) &rarr;
            </a>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold text-sm">NOAA Activity Reports (832+)</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              NOAA has collected 832+ weather modification activity reports from
              2000-2025. A structured dataset was published in{" "}
              <em>Scientific Data</em> (Nature) in 2025.
            </p>
            <a
              href="https://www.nature.com/articles/s41597-025-06273-1"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-primary hover:underline"
            >
              NOAA dataset in Nature &rarr;
            </a>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold text-sm">ICAN FOIA Discoveries</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              ICAN&apos;s legal team has forced disclosure of NSF&apos;s $400K
              &quot;holy grail&quot; SAI grant and NOAA&apos;s SABRE program.
              Currently filing DOE FOIA requests.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href="https://icandecide.org/press-release/ican-documents-show-us-government-funded-holy-grail-of-geoengineering-research/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                NSF &quot;Holy Grail&quot; discovery &rarr;
              </a>
              <a
                href="https://icandecide.org/press-release/ican-obtains-evidence-showing-the-government-is-ramping-up-geoengineering-research/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                NOAA SABRE exposed &rarr;
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold text-sm">
              Independent Lab Testing
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Soil, water, and snow lab results from across the country showing
              elevated aluminum, barium, and strontium. Testing guides available
              for citizens who want to test their own environment.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href="https://geoengineeringwatch.org/lab-tests-2/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Lab test results &rarr;
              </a>
              <a
                href="https://geoengineeringwatch.org/how-to-test-2/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                How to test your own water &amp; soil &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TOOLS */}
      {/* ============================================================ */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">SkyLedger Tools</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Use the platform to track, document, and take action.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Link href="/flights" className="block group">
            <div className="rounded-lg border border-border p-4 h-full transition-all hover:border-primary/40 hover:shadow-sm">
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                Flight Tracker
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Real-time aircraft tracking. See what&apos;s flying overhead,
                who owns it, and flag suspicious aircraft.
              </p>
            </div>
          </Link>
          <Link href="/get-involved" className="block group">
            <div className="rounded-lg border border-border p-4 h-full transition-all hover:border-primary/40 hover:shadow-sm">
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                Get Involved
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Contact representatives, support legal efforts, and connect with
                front-line organizations.
              </p>
            </div>
          </Link>
          <Link href="/learn/facts" className="block group">
            <div className="rounded-lg border border-border p-4 h-full transition-all hover:border-primary/40 hover:shadow-sm">
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                Download &amp; Share
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Download the Facts page as a text file or printable flyer.
                Share it with anyone who needs to see it.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* BOTTOM LINE */}
      {/* ============================================================ */}
      <section className="mt-10 mb-8">
        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <h3 className="font-semibold">The Bottom Line</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            We&apos;re not asking anyone to believe anything. We&apos;re asking:
            if it&apos;s not happening, why are 30+ states passing laws against
            it, why did Congress hold a hearing on it, why did the GAO find that
            oversight is broken, and why is $150M+ flowing into companies that do
            it?
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Every item in this knowledge base is independently verifiable through
            public records, government websites, and official documents.
            SkyLedger exists to make this information accessible in one place.
          </p>
        </div>
      </section>
    </div>
  );
}
