import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Bring a Ban to Your State",
  description:
    "How Tennessee, Florida, and Louisiana passed geoengineering bans — and the step-by-step playbook for doing it in your state.",
};

const stateResults = [
  {
    state: "Tennessee",
    year: "2024",
    house: "70-22",
    senate: "25-6",
    weeks: "11 weeks",
    penalty: "$10K/day (misdemeanor)",
  },
  {
    state: "Florida",
    year: "2025",
    house: "82-28",
    senate: "28-9",
    weeks: "7 months",
    penalty: "$100K + 5 years (felony)",
  },
  {
    state: "Louisiana",
    year: "2025",
    house: "58-33",
    senate: "27-12",
    weeks: "10 weeks",
    penalty: "Environmental enforcement",
  },
];

const resources = [
  {
    name: "Zero Geoengineering",
    what: "Model legislation (the actual bill template) + state-by-state tracking",
    url: "https://zerogeoengineering.com",
    contact: "director@zerogeoengineering.com",
  },
  {
    name: "Stand for Health Freedom",
    what: "Constituent email platform — the tool that generated 100K emails in Florida",
    url: "https://standforhealthfreedom.com",
    contact: null,
  },
  {
    name: "The GeoFight",
    what: "Federal legal strategy — complements state legislation",
    url: "https://thegeofight.com",
    contact: null,
  },
  {
    name: "Children's Health Defense",
    what: "State chapters for media amplification and grassroots organizing",
    url: "https://childrenshealthdefense.org",
    contact: null,
  },
];

export default function StateBanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/get-involved"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Get Involved
      </Link>

      {/* Hero */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Bring a Ban to Your State
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Three states have already banned geoengineering and weather
          modification. They followed the same pattern. Here&apos;s exactly how
          they did it &mdash; and how you can do it in yours.
        </p>
      </div>

      {/* Social proof: vote margins */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stateResults.map((s) => (
          <div
            key={s.state}
            className="rounded-lg border border-border bg-muted/30 p-4 text-center"
          >
            <p className="text-sm font-semibold">{s.state}</p>
            <p className="text-[10px] text-muted-foreground">{s.year}</p>
            <div className="mt-2 flex items-center justify-center gap-3">
              <div>
                <p className="text-xl font-bold text-green-600">{s.house}</p>
                <p className="text-[10px] text-muted-foreground">House</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xl font-bold text-green-600">{s.senate}</p>
                <p className="text-[10px] text-muted-foreground">Senate</p>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {s.penalty}
            </p>
            <p className="text-[11px] text-muted-foreground">{s.weeks}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        30+ additional states have bills pending.{" "}
        <a
          href="https://srm360.org/us-bans/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          See the full tracker &rarr;
        </a>
      </p>

      {/* The Pattern */}
      <div className="mt-12 rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
        <h2 className="text-lg font-bold">The Pattern</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every successful ban followed the same five-phase sequence. The
          details varied state to state, but the structure didn&apos;t. This is
          the playbook.
        </p>
      </div>

      {/* Phase 1 */}
      <section className="mt-10">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            1
          </span>
          <h2 className="text-xl font-bold">Frame It Right</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          This is the single most important decision. Every bill that passed
          kept &ldquo;chemtrails&rdquo; out of the bill text. Every bill that
          got mocked led with conspiracy language.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 p-4">
            <p className="text-xs font-semibold text-green-700 dark:text-green-300">
              What worked
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-green-800 dark:text-green-200">
              <li>&ldquo;Protecting our air, water, and soil&rdquo;</li>
              <li>&ldquo;State sovereignty / Tenth Amendment&rdquo;</li>
              <li>
                &ldquo;Precautionary &mdash; drive a stake in the ground&rdquo;
              </li>
              <li>
                &ldquo;The government&apos;s own documents say they&apos;re
                planning this&rdquo;
              </li>
              <li>&ldquo;Informed consent &mdash; no one asked us&rdquo;</li>
            </ul>
          </div>
          <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4">
            <p className="text-xs font-semibold text-red-700 dark:text-red-300">
              What didn&apos;t
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-red-800 dark:text-red-200">
              <li>&ldquo;Chemtrails are real&rdquo;</li>
              <li>&ldquo;They&apos;re spraying us&rdquo;</li>
              <li>Leading with photos of contrails</li>
              <li>Unverifiable personal claims</li>
              <li>Angry accusations without citations</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold text-foreground">
            The kill shot: The White House&apos;s own document
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            In June 2023, the White House Office of Science and Technology
            Policy published a{" "}
            <a
              href="https://bidenwhitehouse.archives.gov/ostp/news-updates/2023/06/30/congressionally-mandated-report-on-solar-radiation-modification/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              congressionally mandated research plan for Solar Radiation
              Modification
            </a>
            . This was cited in every successful state. It forces opponents into
            a corner &mdash; they can&apos;t dismiss the premise when the
            federal government itself published a plan.
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-4">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
            Your one-sentence pitch (use this everywhere)
          </p>
          <p className="mt-2 text-sm font-medium text-blue-900 dark:text-blue-100 italic">
            &ldquo;The federal government published a plan to modify our
            atmosphere. Three states have already banned it. [Your state] has
            zero protections. This bill fixes that.&rdquo;
          </p>
        </div>
      </section>

      {/* Phase 2 */}
      <section className="mt-12">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            2
          </span>
          <h2 className="text-xl font-bold">Find Your Sponsor</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          The sponsor&apos;s background matters enormously. All three successful
          bills had sponsors with science, military, or business credentials
          &mdash; not culture warriors.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 text-left font-semibold">State</th>
                <th className="py-2 pr-4 text-left font-semibold">Sponsor</th>
                <th className="py-2 text-left font-semibold">
                  Why they worked
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Tennessee</td>
                <td className="py-2 pr-4 font-medium text-foreground">
                  Rep. Monty Fritts
                </td>
                <td className="py-2">
                  Chemistry degree + nuclear industry. Could speak credibly
                  about chemical exposure.
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Florida</td>
                <td className="py-2 pr-4 font-medium text-foreground">
                  Sen. Ileana Garcia
                </td>
                <td className="py-2">
                  Former DHS deputy press secretary. Framed it as protecting
                  freedom, not conspiracy.
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Louisiana</td>
                <td className="py-2 pr-4 font-medium text-foreground">
                  Sen. &ldquo;Big Mike&rdquo; Fesi
                </td>
                <td className="py-2">
                  Oil &amp; gas businessman. Understood regulatory gaps.
                  No-nonsense credibility.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-lg border border-border p-4">
          <p className="text-xs font-semibold">What to look for</p>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
            <li>
              Science, military, agriculture, or business background
            </li>
            <li>
              Already has credibility with the caucus on other issues
            </li>
            <li>
              Sits on or chairs the committee the bill will go through
              (Agriculture or Environment)
            </li>
            <li>
              Willing to stay disciplined on framing &mdash; no freelancing into
              conspiracy territory
            </li>
          </ul>
        </div>

        <div className="mt-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-4">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
            How to approach a legislator
          </p>
          <p className="mt-2 text-xs text-blue-900 dark:text-blue-100 italic leading-relaxed">
            &ldquo;Senator/Representative, I&apos;ve been studying what
            Tennessee, Florida, and Louisiana have done. The federal government
            published a research plan for atmospheric modification. Three states
            have already banned it. [Your state] has zero protections. I&apos;d
            like to show you what a bill looks like.&rdquo;
          </p>
          <p className="mt-3 text-xs text-blue-800 dark:text-blue-200">
            Bring: a printed copy of the White House OSTP report, a one-page
            summary of TN/FL/LA laws, and the{" "}
            <a
              href="https://zerogeoengineering.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              model legislation from Zero Geoengineering
            </a>
            .
          </p>
        </div>
      </section>

      {/* Phase 3 */}
      <section className="mt-12">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            3
          </span>
          <h2 className="text-xl font-bold">Build the Pressure Campaign</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          This is where bills live or die. Every successful ban had massive
          constituent contact campaigns that made it politically impossible to
          vote no.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">11K+</p>
              <p className="text-xs text-muted-foreground mt-1">
                Emails to committee members
              </p>
              <p className="text-xs font-medium mt-2">Tennessee</p>
              <p className="text-[11px] text-muted-foreground">
                Via Tennessee Stands
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">100K</p>
              <p className="text-xs text-muted-foreground mt-1">
                Emails over 3 months
              </p>
              <p className="text-xs font-medium mt-2">Florida</p>
              <p className="text-[11px] text-muted-foreground">
                Via Stand for Health Freedom
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">400+</p>
              <p className="text-xs text-muted-foreground mt-1">
                Reports filed day one
              </p>
              <p className="text-xs font-medium mt-2">Louisiana</p>
              <p className="text-[11px] text-muted-foreground">
                Organic constituent interest
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">
              Step 1: Get the infrastructure
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Contact{" "}
              <a
                href="https://standforhealthfreedom.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Stand for Health Freedom
              </a>{" "}
              and ask them to set up an action alert for your state. Their
              platform auto-routes emails and calls to the correct legislators.
              This is the tool that powered Florida&apos;s 100,000 emails. You
              don&apos;t have to build this yourself.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">
              Step 2: Tap existing networks
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Tennessee&apos;s organizers explicitly said they repurposed their
              COVID-era medical freedom networks. Same people, same
              relationships, same tactics, new issue. Look for: health
              freedom groups, liberty groups, farm organizations, church
              networks, conservative grassroots orgs in your state.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">
              Step 3: Bring credentialed witnesses
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Committee testimony wins votes. All three states brought
              physicians, licensed healthcare providers, or scientists. Dr.
              Denise Sibley (internal medicine) testified in both Tennessee
              chambers. Marla Maples testified in Florida. Find a doctor,
              scientist, or veteran in your state willing to testify.
            </p>
          </div>
        </div>
      </section>

      {/* Phase 4 */}
      <section className="mt-12">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            4
          </span>
          <h2 className="text-xl font-bold">Navigate the Legislature</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Speed matters. Tennessee went from filing to the governor&apos;s
          signature in 11 weeks. The faster the bill moves, the less time
          opposition has to organize.
        </p>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">
              The asymmetric political cost
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              In a red state, voting YES costs nothing &mdash; it bans
              something that &ldquo;isn&apos;t happening anyway.&rdquo; Voting
              NO means appearing to support the federal government&apos;s right
              to spray chemicals on your constituents. No legislator wants that
              attack ad. Tennessee&apos;s own Fiscal Review Committee said the
              bill had &ldquo;no significant impact&rdquo; &mdash; and it still
              passed 70-22.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">
              Handling mockery on the floor
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Expect it. In Tennessee, a Democrat attached a satirical
              &ldquo;Sasquatch protection&rdquo; amendment. It failed 18-71 and
              the bill passed immediately after. In Florida, a legislator said
              &ldquo;go outside and touch some grass.&rdquo; The bill passed
              82-28. Mockery energizes your supporters and makes opponents look
              dismissive. Don&apos;t engage with it.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold">Sponsor&apos;s talking points</p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
              <li>
                &ldquo;If this isn&apos;t happening, the bill costs nothing. If
                it is, we&apos;re protected.&rdquo;
              </li>
              <li>
                &ldquo;Three states have already done this. We&apos;re not the
                first, and we won&apos;t be the last.&rdquo;
              </li>
              <li>
                &ldquo;The federal government&apos;s own report says
                they&apos;re researching this. We&apos;re saying not here.&rdquo;
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold">Pro move: The two-bill strategy</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Louisiana filed two bills &mdash; a broad one with a $200K fine (HB
            608) and a narrower one (SB 46). The aggressive bill absorbed all
            the criticism and failed 21-72, making the narrower bill look
            moderate by comparison. It passed 58-33. If you think your bill
            might face resistance, file a bigger version alongside it.
          </p>
        </div>
      </section>

      {/* Phase 5 */}
      <section className="mt-12">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            5
          </span>
          <h2 className="text-xl font-bold">Win the Media Game</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Mainstream media will ridicule your bill. This is counterintuitive,
          but it actually helps.
        </p>

        <div className="mt-4 rounded-lg border border-border p-4">
          <p className="text-xs font-semibold">Why ridicule helps</p>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
            <li>
              Gives the bill enormous visibility &mdash; free publicity
            </li>
            <li>
              Activates the conservative base (distrust of mainstream media)
            </li>
            <li>
              Creates a culture-war dynamic where voting no means siding with
              the media
            </li>
            <li>
              NBC, Washington Post, and PolitiFact all ran critical stories
              about Tennessee&apos;s bill. It passed 70-22.
            </li>
          </ul>
        </div>

        <div className="mt-4 rounded-lg border border-border p-4">
          <p className="text-xs font-semibold">What to do</p>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
            <li>
              Don&apos;t seek mainstream media approval. You won&apos;t get it.
            </li>
            <li>
              Cultivate conservative media, local talk radio, and alternative
              outlets
            </li>
            <li>
              Have the sponsor give clean, quotable statements focused on
              environmental protection and sovereignty
            </li>
            <li>
              Share ALL coverage on social media &mdash; even critical coverage
              drives engagement
            </li>
          </ul>
        </div>
      </section>

      {/* Comparison table */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">
          What the laws actually do
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Key decisions each state made differently. Use this to decide
          what&apos;s right for your bill.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-3 text-left font-semibold" />
                <th className="py-2 pr-3 text-left font-semibold">
                  Tennessee
                </th>
                <th className="py-2 pr-3 text-left font-semibold">
                  Florida
                </th>
                <th className="py-2 text-left font-semibold">Louisiana</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="py-2 pr-3 font-medium text-foreground">
                  Penalty
                </td>
                <td className="py-2 pr-3">$10K/day misdemeanor</td>
                <td className="py-2 pr-3">$100K + 5 yrs felony</td>
                <td className="py-2">Env. enforcement</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-3 font-medium text-foreground">
                  Cloud seeding exempted?
                </td>
                <td className="py-2 pr-3">No</td>
                <td className="py-2 pr-3">
                  No (repealed permits)
                </td>
                <td className="py-2">
                  Yes (ag under 1,000 ft)
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-3 font-medium text-foreground">
                  Citizen reporting
                </td>
                <td className="py-2 pr-3">No</td>
                <td className="py-2 pr-3">
                  Yes (DEP + airports)
                </td>
                <td className="py-2">Yes (DEQ &rarr; Air Guard)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-3 font-medium text-foreground">
                  Constitutional basis
                </td>
                <td className="py-2 pr-3">10th Amendment</td>
                <td className="py-2 pr-3">State sovereignty</td>
                <td className="py-2">Environmental protection</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 font-medium text-foreground">
                  Filing to signing
                </td>
                <td className="py-2 pr-3">~11 weeks</td>
                <td className="py-2 pr-3">~7 months</td>
                <td className="py-2">~10 weeks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Checklist */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">Your Checklist</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Work through this in order. Each step builds on the last.
        </p>

        <div className="mt-6 space-y-6">
          <div>
            <p className="text-sm font-semibold">
              6-9 months before session
            </p>
            <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Get model legislation from Zero Geoengineering
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Identify your sponsor &mdash; science/military/ag/business
                credentials
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Map your committee pathway (Agriculture or Public Health)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Contact Stand for Health Freedom to set up an action alert
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Build your coalition &mdash; medical freedom groups, farm orgs,
                liberty groups, church networks
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Research your state&apos;s regulatory vacuum (&ldquo;there&apos;s
                nothing protecting us&rdquo; is powerful)
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">
              3-6 months before session
            </p>
            <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Draft the bill with your sponsor&apos;s legislative counsel
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Decide scope: ban everything or carve out ag exemptions?
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Build your witness list for committee testimony
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Pre-file the bill if your state allows it
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Begin the email/contact campaign to committee members
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">During session</p>
            <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Flood committee members with constituent emails (target:
                thousands)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Pack the committee hearing with supporters
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Coordinate testimony &mdash; White House OSTP report, NOAA
                data, regulatory gap, informed consent
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Don&apos;t engage with mockery &mdash; let it energize your
                supporters
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border" />
                Move fast &mdash; speed prevents opposition from organizing
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">Your Resources</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These organizations have helped pass every successful ban. Reach out
          to them.
        </p>
        <div className="mt-4 space-y-3">
          {resources.map((r) => (
            <div
              key={r.name}
              className="rounded-lg border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.what}</p>
                {r.contact && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Contact: {r.contact}
                  </p>
                )}
              </div>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline font-medium shrink-0"
              >
                Visit &rarr;
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Key citations */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">Key Citations</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These are the documents that moved legislators in every successful
          state. Print them. Bring them to meetings.
        </p>
        <div className="mt-4 space-y-3">
          <a
            href="https://bidenwhitehouse.archives.gov/ostp/news-updates/2023/06/30/congressionally-mandated-report-on-solar-radiation-modification/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-border p-4 hover:border-primary/40 transition-colors"
          >
            <p className="text-sm font-semibold">
              White House OSTP Report on Solar Radiation Modification
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              June 2023. The federal government&apos;s own research plan for
              atmospheric intervention. Cited in every successful state.
            </p>
            <p className="text-xs text-primary font-medium mt-2">
              View document &rarr;
            </p>
          </a>
          <a
            href="https://library.noaa.gov/weather-climate/weather-modification-project-reports"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-border p-4 hover:border-primary/40 transition-colors"
          >
            <p className="text-sm font-semibold">
              NOAA Weather Modification Project Reports
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Official government records of weather modification projects
              across the U.S. Proves this isn&apos;t theoretical.
            </p>
            <p className="text-xs text-primary font-medium mt-2">
              View reports &rarr;
            </p>
          </a>
          <a
            href="https://srm360.org/us-bans/"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-border p-4 hover:border-primary/40 transition-colors"
          >
            <p className="text-sm font-semibold">
              SRM360 State Legislation Tracker
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Real-time tracker of every state that has enacted or introduced
              geoengineering legislation.
            </p>
            <p className="text-xs text-primary font-medium mt-2">
              View tracker &rarr;
            </p>
          </a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-12 mb-8">
        <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 text-center">
          <h2 className="text-xl font-bold">Ready to start?</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
            Your first step is getting the model legislation. Contact Zero
            Geoengineering, find your sponsor, and set up the constituent
            pressure infrastructure. Three states have already proven this
            works.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton href="/get-involved/toolkit" size="lg">
              Open the Citizen Toolkit
            </LinkButton>
            <a
              href="https://zerogeoengineering.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Get Model Legislation &rarr;
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
