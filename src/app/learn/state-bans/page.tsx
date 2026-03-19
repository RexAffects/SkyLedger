import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "3 States Have Banned Weather Modification",
  description:
    "Tennessee, Florida, and Louisiana have enacted laws banning or restricting geoengineering and weather modification activities.",
};

const states = [
  {
    name: "Tennessee",
    bill: "SB 2691 / HB 2063",
    signed: "April 2024",
    effective: "July 1, 2024",
    penalty: "Class C misdemeanor, up to $10,000/day",
    summary:
      "First state in the nation to ban geoengineering. Prohibits the intentional injection, release, or dispersal of chemicals, chemical compounds, substances, or apparatus into the atmosphere with the express purpose of affecting temperature, weather, or the intensity of sunlight.",
    sourceUrl: "https://wapp.capitol.tn.gov/apps/BillInfo/default.aspx?BillNumber=SB2691&GA=113",
    sourceLabel: "Tennessee Legislature — SB 2691",
  },
  {
    name: "Florida",
    bill: "SB 56",
    signed: "June 20, 2025",
    effective: "July 1, 2025",
    penalty: "Third-degree felony — up to 5 years in prison, up to $100,000 fine",
    summary:
      "First state to criminalize weather modification as a felony. Prohibits any person from conducting weather modification or climate engineering operations in the state. Requires airports to report any suspected weather modification activity. Establishes a public complaint system for citizens to report violations. Governor DeSantis signed it into law calling it protection for Floridians from chemical experimentation.",
    sourceUrl: "https://www.flsenate.gov/Session/Bill/2025/56",
    sourceLabel: "Florida Senate — SB 56",
  },
  {
    name: "Louisiana",
    bill: "Act No. 95",
    signed: "2025",
    effective: "August 1, 2025",
    penalty: "Up to $200,000 per violation",
    summary:
      "Bans weather modification activities and requires reporting of suspected operations. The Louisiana Department of Environmental Quality established a public reporting portal where citizens can file reports of suspected weather modification activity. Over 400 citizen reports were filed in the first months after enactment.",
    sourceUrl: "https://internet.deq.louisiana.gov/portal/ONLINESERVICES/FORMS/ACT-NO-95-WEATHER-MODIFICATION-REPORTING",
    sourceLabel: "Louisiana DEQ — Act No. 95 Reporting Portal",
  },
];

export default function StateBansPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to home
      </Link>

      <h1 className="mt-6 text-3xl font-bold">
        3 States Have Banned Weather Modification
      </h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Tennessee, Florida, and Louisiana have enacted laws banning or
        restricting geoengineering and weather modification activities within
        their borders. These laws represent a growing movement of state-level
        action on atmospheric transparency — driven by citizen demand for
        accountability over what is being released into the air they breathe.
      </p>

      <div className="mt-8 space-y-8">
        {states.map((state) => (
          <div
            key={state.name}
            className="rounded-lg border border-border p-6"
          >
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold">{state.name}</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-medium">
                Enacted
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Bill
                </p>
                <p>{state.bill}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Signed
                </p>
                <p>{state.signed}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Effective
                </p>
                <p>{state.effective}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-medium text-muted-foreground">
                Penalty
              </p>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                {state.penalty}
              </p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {state.summary}
            </p>
            <a
              href={state.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-xs text-primary hover:underline"
            >
              Source: {state.sourceLabel} &rarr;
            </a>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6">
        <h3 className="font-semibold">Note on Montana</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Montana&apos;s SB 473 passed the state Senate in March 2025 but was
          killed on the House floor on April 10, 2025 by a vote of 45-55. It is
          not currently enacted.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6">
        <h3 className="font-semibold">Additional Sources</h3>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <a
              href="https://srm360.org/us-bans/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              SRM360 — Interactive map of US geoengineering legislation
            </a>
          </li>
          <li>
            <a
              href="https://oversight.house.gov/hearing/playing-god-with-the-weather-a-disastrous-forecast/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Congressional hearing: &quot;Playing God with the Weather&quot;
              (Sept 16, 2025)
            </a>
          </li>
        </ul>
      </div>

      {/* Get Involved CTA */}
      <div className="mt-8 rounded-lg border-2 border-primary/20 bg-primary/5 p-6 text-center">
        <h3 className="text-lg font-bold">Ready to take action?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Learn how you can support legal efforts, contact your
          representatives, and help bring transparency to your community.
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
