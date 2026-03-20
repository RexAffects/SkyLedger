import type { Metadata } from "next";
import Link from "next/link";
import { LinkButton } from "@/components/ui/link-button";
import { CopyButton } from "@/components/ui/copy-button";

export const metadata: Metadata = {
  title: "Contact Your Legislator — SkyLedger",
  description:
    "Send a letter to your state representative asking them to introduce a geoengineering ban bill. Ready-to-use template based on the strategy that passed bans in Florida, Tennessee, and Montana.",
};

const letterTemplate = `Dear [REPRESENTATIVE/SENATOR LAST NAME],

I'm writing to request that you introduce legislation in our state banning geoengineering and intentional weather modification — modeled after laws already signed in Tennessee (SB 2691, April 2024) and Florida (SB 56, 2025).

These laws prohibit the intentional injection, release, or dispersion of chemicals or substances into the atmosphere with the purpose of affecting temperature, weather, or the intensity of sunlight. This isn't a fringe issue — over 22 states introduced similar bills in 2025, and at the federal level, H.R. 4403 (the Clear Skies Act) has been introduced to ban weather modification nationwide.

[STATE NAME] deserves the same protections that Tennessee and Florida already have. Our families, our children, and our communities deserve to know exactly what is happening in the skies above our homes. No amount of personal health-conscious decisions can address what's being dispersed into the air we all breathe.

We're not asking for anything extreme. We're asking for what multiple states have already passed into law. We believe this will be the direction every state moves toward, and we'd like [STATE NAME] to be among those leading the way.

For reference, a citizen-built transparency platform at skyledger.org aggregates real-time flight tracking, FAA aircraft ownership data, weather modification operator identification, and citizen reports into one open-source tool. The information is based entirely on public records and verifiable data — over 600 documented weather modification patents, congressional reports, and federal agency documents.

I would welcome the opportunity to discuss this further. Thank you for your time and your service to our state.

Respectfully,
[YOUR NAME]
[YOUR CITY], [YOUR STATE]`;

const floridaTimeline = [
  {
    date: "November 2024",
    event: "Sen. Ileana Garcia (R-Miami) files SB 56",
  },
  {
    date: "February 2025",
    event:
      "First committee passes 10-2 — Appropriations Committee on Agriculture/Environment",
  },
  {
    date: "March 2025",
    event: "Senate Rules Committee advances the bill",
  },
  {
    date: "April 2, 2025",
    event:
      'Gov. DeSantis posts video on X endorsing SB 56: "We don\'t want to indulge this nonsense in Florida, where we are proud of our sunshine"',
  },
  {
    date: "April 3, 2025",
    event: "Full Senate passes SB 56",
  },
  {
    date: "April 2025",
    event: "Full House passes 82-28 — strong bipartisan margin",
  },
  {
    date: "June 20, 2025",
    event: "Gov. DeSantis signs into law",
  },
  {
    date: "July 1, 2025",
    event: "Law takes effect — felony penalties active",
  },
];

const strategyPoints = [
  {
    title: "Frame it as a regulatory gap — not conspiracy",
    detail:
      'Sen. Garcia\'s key line: "There is a lot of unauthorized activity that is currently not regulated both at a federal and a state level, and this is where we wanted to start." This gave moderate legislators cover to vote yes.',
    source: "Florida Phoenix",
  },
  {
    title: "Get the governor on board early",
    detail:
      "DeSantis publicly endorsed on social media BEFORE the vote. His framing: \"The Free State of Florida means freedom from governments or private actors unilaterally applying chemicals or geoengineering to people or public spaces.\"",
    source: "Florida Governor's Office",
  },
  {
    title: "Reference other states",
    detail:
      "Garcia cited 32 other states with similar legislation. Tennessee being first made Florida's vote easier. Each state that passes makes the next one easier.",
    source: "Florida Senate records",
  },
  {
    title: "Citizen testimony creates urgency",
    detail:
      "The volume of public testimony from concerned citizens showed legislators their constituents cared. Multiple people referenced \"The Dimming\" documentary (25M+ views). Your observations matter.",
    source: "Florida House records",
  },
  {
    title: "Make it bipartisan",
    detail:
      "82-28 in the House. 28-9 in the Senate. Both Republicans and Democrats voted yes. This is a clean air issue, not a partisan issue.",
    source: "Florida Legislature voting records",
  },
  {
    title: "Include enforcement teeth",
    detail:
      "Florida didn't just ban it — they created airport reporting requirements, a citizen complaint system through the DEP, and felony-level penalties. Laws without enforcement mechanisms get ignored.",
    source: "SB 56 enrolled text",
  },
  {
    title: "Expect industry opposition — use it",
    detail:
      "Rainmaker's CEO personally testified against SB 56. Having the weather modification industry show up to fight the bill actually proved the point that this is real and worth regulating.",
    source: "Florida Politics",
  },
];

export default function ContactLegislatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/get-involved"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Get Involved
      </Link>

      <h1 className="mt-6 text-3xl font-bold">Contact Your Legislator</h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Every state that has banned geoengineering started with one citizen
        reaching out to one legislator. Florida went from filing to law in 7
        months. Here&apos;s everything you need to do the same in your state.
      </p>

      {/* Step 1: Find Your Legislator */}
      <section className="mt-10">
        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-6">
          <h2 className="text-xl font-bold">
            Step 1: Find Your State Legislator
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You need your <strong>state</strong> representative and senator (not
            federal). Enter your address to find them.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://openstates.org/find_your_legislator/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Find Your State Legislator &rarr;
            </a>
            <a
              href="https://www.house.gov/representatives/find-your-representative"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              Find Federal Representative
            </a>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Send the letter to <strong>both</strong> your state House
            representative and your state Senator for maximum impact.
          </p>
        </div>
      </section>

      {/* Step 2: Letter Template */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">
          Step 2: Copy, Customize, and Send
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill in the [BRACKETED] sections with your info. Everything else is
          ready to go. Takes about 2 minutes.
        </p>
        <div className="mt-4 relative">
          <div className="rounded-lg border border-border bg-muted/30 p-6">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
              {letterTemplate}
            </pre>
          </div>
          <div className="mt-3 flex gap-3">
            <CopyButton text={letterTemplate} />
            <p className="text-xs text-muted-foreground self-center">
              Fill in [YOUR NAME], [STATE NAME], and [LEGISLATOR NAME] — the
              rest is ready.
            </p>
          </div>
        </div>
      </section>

      {/* Step 3: How Florida Did It */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">
          How Florida Passed a Felony Ban in 7 Months
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Florida&apos;s SB 56 made unauthorized geoengineering a{" "}
          <strong>third-degree felony</strong> — up to 5 years in prison and
          $100,000 fine. Here&apos;s the exact path they took.
        </p>

        {/* Timeline */}
        <div className="mt-6 space-y-0">
          {floridaTimeline.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold">
                  {i + 1}
                </div>
                {i < floridaTimeline.length - 1 && (
                  <div className="w-0.5 flex-1 bg-green-200 dark:bg-green-800 my-1" />
                )}
              </div>
              <div className="pb-6">
                <p className="text-xs font-medium text-green-700 dark:text-green-400">
                  {item.date}
                </p>
                <p className="text-sm mt-0.5">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strategy That Worked */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">
          The Strategy That Worked
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These are the specific angles that got Florida&apos;s bill passed
          82-28. Use them when talking to your legislator.
        </p>
        <div className="mt-6 space-y-4">
          {strategyPoints.map((point, i) => (
            <div
              key={i}
              className="rounded-lg border border-border p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-sm">{point.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {point.detail}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Source: {point.source}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Quotes */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Quotes That Move Legislators</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Use these in your letter or conversation. They come from elected
          officials who already voted yes.
        </p>
        <div className="mt-4 space-y-4">
          <blockquote className="border-l-4 border-primary pl-4">
            <p className="text-sm italic">
              &ldquo;There is a lot of unauthorized activity that is currently
              not regulated both at a federal and a state level, and this is
              where we wanted to start.&rdquo;
            </p>
            <cite className="mt-1 block text-xs text-muted-foreground">
              — Sen. Ileana Garcia (R-FL), SB 56 sponsor
            </cite>
          </blockquote>
          <blockquote className="border-l-4 border-primary pl-4">
            <p className="text-sm italic">
              &ldquo;I have heard the conspiracy theories out there, but the
              fact is we should not be shutting down legitimate concerns.
              Healthy skepticism is important.&rdquo;
            </p>
            <cite className="mt-1 block text-xs text-muted-foreground">
              — Senate President Ben Albritton (R-FL)
            </cite>
          </blockquote>
          <blockquote className="border-l-4 border-primary pl-4">
            <p className="text-sm italic">
              &ldquo;The Free State of Florida means freedom from governments or
              private actors unilaterally applying chemicals or geoengineering to
              people or public spaces.&rdquo;
            </p>
            <cite className="mt-1 block text-xs text-muted-foreground">
              — Gov. Ron DeSantis, upon signing SB 56
            </cite>
          </blockquote>
          <blockquote className="border-l-4 border-primary pl-4">
            <p className="text-sm italic">
              &ldquo;Banning geoengineering is a movement every MAHA needs to
              support.&rdquo;
            </p>
            <cite className="mt-1 block text-xs text-muted-foreground">
              — HHS Secretary Robert F. Kennedy Jr.
            </cite>
          </blockquote>
        </div>
      </section>

      {/* 600+ Scientists */}
      <section className="mt-10">
        <div className="rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 p-6">
          <h2 className="text-lg font-bold text-blue-900 dark:text-blue-200">
            600+ Scientists Agree: Ban It
          </h2>
          <p className="mt-2 text-sm text-blue-800 dark:text-blue-300">
            The Solar Geoengineering Non-Use Agreement has been signed by over
            600 academics and nearly 2,000 civil society organizations
            worldwide. They call for banning outdoor experiments, prohibiting
            patents, and stopping public funding for deployment. Published as a
            peer-reviewed paper in <em>WIREs Climate Change</em>.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://www.solargeoeng.org/non-use-agreement/signatories/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 dark:text-blue-300 hover:underline"
            >
              See every signatory (name, institution, field) &rarr;
            </a>
            <a
              href="https://www.solargeoeng.org/non-use-agreement/open-letter/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 dark:text-blue-300 hover:underline"
            >
              Read the open letter &rarr;
            </a>
          </div>
          <p className="mt-3 text-xs text-blue-700 dark:text-blue-400">
            When someone says &ldquo;this is just a conspiracy theory,&rdquo;
            point them here. 600 credentialed scientists from institutions
            worldwide say it&apos;s real enough to ban.
          </p>
        </div>
      </section>

      {/* Sources */}
      <section className="mt-10 mb-8">
        <h2 className="text-lg font-bold">Sources</h2>
        <ol className="mt-3 space-y-1 list-decimal list-inside text-xs text-muted-foreground">
          <li>
            <a href="https://www.flgov.com/eog/news/press/2025/governor-ron-desantis-celebrates-action-protect-floridians-chemical-and" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Florida Governor&apos;s Office — DeSantis signs SB 56
            </a>
          </li>
          <li>
            <a href="https://www.flsenate.gov/Session/Bill/2025/56" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Florida Senate — SB 56 full text and history
            </a>
          </li>
          <li>
            <a href="https://floridaphoenix.com/2025/04/03/florida-senate-approves-ban-on-geoengineering-and-weather-modification/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Florida Phoenix — Senate approves ban
            </a>
          </li>
          <li>
            <a href="https://floridapolitics.com/archives/735756-this-bill-is-crazy-legislature-approves-ban-on-geoengineering-weather-modification/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Florida Politics — Legislature approves ban
            </a>
          </li>
          <li>
            <a href="https://www.solargeoeng.org/non-use-agreement/signatories/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Solar Geoengineering Non-Use Agreement — Signatories
            </a>
          </li>
          <li>
            <a href="https://srm360.org/us-bans/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              SRM360 — US State Bans Tracker
            </a>
          </li>
        </ol>
      </section>
    </div>
  );
}

