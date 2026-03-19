import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Congressional Hearing: Playing God with the Weather",
  description:
    "September 16, 2025 — The House Oversight Subcommittee held a nearly two-hour hearing on weather modification and geoengineering.",
};

export default function CongressionalHearingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to home
      </Link>

      <h1 className="mt-6 text-3xl font-bold">
        &quot;Playing God with the Weather&quot;
      </h1>
      <p className="text-lg text-muted-foreground mt-2">
        Congressional Hearing — September 16, 2025
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Committee
          </p>
          <p className="text-sm mt-1">
            House Committee on Oversight and Accountability — Subcommittee on
            Delivering on Government Efficiency
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground">Chair</p>
          <p className="text-sm mt-1">Rep. Marjorie Taylor Greene (R-GA)</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground">Duration</p>
          <p className="text-sm mt-1">Approximately 2 hours</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Witnesses
          </p>
          <p className="text-sm mt-1">3 expert witnesses (sworn testimony)</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Witnesses &amp; Key Testimony</h2>
        <div className="mt-4 space-y-6">
          <div>
            <h3 className="font-medium">
              Dr. Roger Pielke Jr.
              <span className="text-sm text-muted-foreground font-normal ml-2">
                Senior Fellow, American Enterprise Institute
              </span>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              30 years studying atmospheric science and policy. Former scientist
              at the National Center for Atmospheric Research.
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
              <li>
                &quot;We&apos;ve been trying to modify the weather for 70 years,
                and we don&apos;t know if we&apos;re modifying the weather.&quot;
              </li>
              <li>
                Compared geoengineering to &quot;risky gain-of-function research
                on viruses with uncertain benefits and catastrophic risks&quot;
              </li>
              <li>
                Over 500 scientists worldwide have signed a solar engineering
                non-use agreement
              </li>
              <li>
                Recommended Congress request a National Academy of Sciences
                assessment on weather modification effectiveness
              </li>
              <li>
                Called for standardizing federal weather modification law across
                all states
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium">
              Christopher Marks
              <span className="text-sm text-muted-foreground font-normal ml-2">
                Meteorologist, Committee for a Constructive Tomorrow
              </span>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Meteorologist and policy analyst specializing in climate and
              weather.
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
              <li>
                Distinguished contrails (ice clouds above 20,000 ft) from cloud
                seeding (injecting agents into lower clouds) from geoengineering
                (planetary-scale climate intervention) — three separate things
              </li>
              <li>
                Cloud seeding may increase local precipitation by 0-15%, but
                &quot;not on a scale over 200km&quot;
              </li>
              <li>
                Raised concerns about silver iodide accumulating in soil and
                water tables — &quot;the long-term effects on marine life,
                aquatic life, and terrestrial plant life have not been studied
                definitively&quot;
              </li>
              <li>
                When asked if he&apos;d drink water with silver iodide:
                &quot;I probably would not want to do that&quot;
              </li>
              <li>
                Named Rainmaker Corporation specifically in connection with Texas
                flood concerns
              </li>
              <li>
                EPA has identified risks of SAI including: ozone depletion, acid
                rain, and reduced crop yields
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium">
              Dr. Michael McCracken
              <span className="text-sm text-muted-foreground font-normal ml-2">
                Chief Scientist, Climate Institute (retired Lawrence Livermore
                National Lab)
              </span>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              PhD, career at Lawrence Livermore National Lab, former senior
              climate change scientist with the US Global Change Program.
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
              <li>
                &quot;Changing a major specific event — a hurricane or a
                drenching rain or a drought — is just beyond human
                capabilities&quot;
              </li>
              <li>
                &quot;There&apos;s not scientifically convincing evidence that it
                works, but there&apos;s not scientifically convincing evidence
                that it doesn&apos;t work&quot;
              </li>
              <li>
                Confirmed no large-scale geoengineering is currently occurring
                globally
              </li>
              <li>
                Favored continued research (disagreed with other witnesses on
                non-use agreement)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">Notable Moments</h2>
        <div className="mt-4 space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">
              EPA Administrator Lee Zeldin (via video)
            </p>
            <p className="mt-1 italic">
              &quot;Americans have urgent and important questions about
              geoengineering and contrails. The American public deserves and
              expects honesty and transparency from their government. For years,
              people who asked questions in good faith were dismissed, even
              vilified by the media and their own government. That era is over.
              The Trump EPA is committed to total transparency.&quot;
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">
              China&apos;s weather modification program
            </p>
            <p className="mt-1">
              Rep. Gill raised that China spent $2 billion on weather
              modification over the past decade and asked about adversarial use.
              Dr. Pielke noted the importance of atmospheric monitoring to detect
              such activities.
            </p>
          </div>
          <div>
            <p className="font-medium text-foreground">
              Bipartisan areas of agreement
            </p>
            <p className="mt-1">
              Both parties agreed that weather modification is real, that more
              research and transparency is needed, and that citizens deserve
              answers. The disagreement was primarily over the framing of climate
              change and the role of the EPA.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6">
        <h3 className="font-semibold">Sources</h3>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <a
              href="https://oversight.house.gov/hearing/playing-god-with-the-weather-a-disastrous-forecast/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Official hearing page with witness testimony documents &rarr;
            </a>
          </li>
          <li>
            <a
              href="https://oversight.house.gov/release/hearing-wrap-up-subcommittee-demands-transparency-of-government-weather-and-climate-engineering/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Hearing wrap-up with video clips &rarr;
            </a>
          </li>
          <li>
            <a
              href="https://eos.org/research-and-developments/geoengineering-fears-on-display-at-congressional-hearing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              American Geophysical Union (Eos) — Coverage of the hearing &rarr;
            </a>
          </li>
          <li>
            <a
              href="https://abcnews.go.com/US/fact-checking-lawmakers-congressional-weather-modification-hearing/story?id=125627035"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              ABC News — Fact-checking the hearing &rarr;
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
