import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title:
    "Stardust Solutions — Deep Dive | SkyLedger",
  description:
    "Investigation into Stardust Solutions: secret particles, nuclear weapons scientists, $75M in defense-connected funding, ignored governance recommendations, and experiments planned for April 2026. Every claim sourced.",
};

// ============================================================
// DATA
// ============================================================

interface Source {
  label: string;
  url: string;
}

interface InvestigationSection {
  id: string;
  title: string;
  urgent?: boolean;
  paragraphs: string[];
  quotes?: { text: string; attribution: string }[];
  bullets?: string[];
  sources: Source[];
}

const sections: InvestigationSection[] = [
  {
    id: "particles",
    title: "What Are They Spraying?",
    paragraphs: [
      "Stardust Solutions is developing a proprietary reflective particle for stratospheric aerosol injection — spraying particles into the stratosphere to reflect sunlight and cool the planet. They claim the particles are \"bio-safe,\" \"chemically inert,\" and made of \"components abundant in nature.\"",
      "The problem: nobody outside the company knows what the particles actually are. The chemical composition is secret and patent-pending. No peer-reviewed research has been published. No external scientists can evaluate their safety claims because the data doesn't exist publicly.",
      "Their 2023 pitch deck proposed \"annually dispersing ~1 million tons of sun-reflecting particles\" to create \"~1% extra cloud coverage\" and called it the \"only technologically feasible solution\" to climate change.",
    ],
    quotes: [
      {
        text: "They claim to have a \"magic aerosol particle\" but the assertion that it is \"perfectly safe and inert\" cannot be trusted without published findings.",
        attribution:
          "Douglas MacMartin, Associate Professor, Cornell University",
      },
      {
        text: "When it comes to governance principles like transparency and public engagement — they're not adhering to any of them.",
        attribution:
          "Shuchi Talati, Alliance for Just Deliberation on Solar Geoengineering",
      },
      {
        text: "Even diamonds would alter stratospheric chemistry. Calling anything \"chemically inert\" in the stratosphere is nonsense.",
        attribution:
          "David Keith, University of Chicago, founding director of Climate Systems Engineering Initiative (refused to consult for Stardust)",
      },
    ],
    sources: [
      {
        label: "Heatmap News: Stardust Raises $60M",
        url: "https://heatmap.news/climate-tech/stardust-geoengineering",
      },
      {
        label: "Undark: How One Company Wants to Make Geoengineering Profitable",
        url: "https://undark.org/2025/03/17/stardust-geoengineering-profitable/",
      },
      {
        label: "MIT Technology Review: Controversial startup hopes to cool the planet",
        url: "https://www.technologyreview.com/2025/12/10/1129079/how-one-controversial-startup-hopes-to-cool-the-planet/",
      },
    ],
  },
  {
    id: "business-model",
    title: "Business Model: Perpetual Government Contracts",
    paragraphs: [
      "Stardust expects nations to pay it more than a billion dollars a year to launch aircraft into the stratosphere and disperse their proprietary particles. Target customers: governments. Target deployment: as early as 2035. The revenue model is a perpetual government contract — once deployment starts, it can never stop.",
      "This is because of termination shock: if stratospheric aerosol injection begins at scale and then stops, temperatures would spike rapidly — potentially faster than the original warming. Deployment scenarios involve continuous particle injection for hundreds of years. Any government customer is locked in forever.",
      "A for-profit company is seeking patent protections on atmosphere-altering technology that, once deployed, creates permanent dependency on whoever holds the IP. The entire planet is affected. The question is not just scientific — it's about who gets to control the global thermostat.",
    ],
    quotes: [
      {
        text: "Adding business interests, profit motives, and rich investors into this situation just creates more cause for concern, complicating the ability of responsible scientists and engineers to carry out the work needed.",
        attribution:
          "David Keith & Daniele Visioni, leading geoengineering researchers (MIT Technology Review)",
      },
      {
        text: "There's a massive incentive to lobby countries to use it, and that's the whole danger of having for-profit companies here.",
        attribution:
          "Shuchi Talati, Alliance for Just Deliberation on Solar Geoengineering",
      },
    ],
    sources: [
      {
        label: "MIT Technology Review",
        url: "https://www.technologyreview.com/2025/12/10/1129079/how-one-controversial-startup-hopes-to-cool-the-planet/",
      },
      {
        label: "E&E News: Global cooling startup raises $60M",
        url: "https://www.eenews.net/articles/global-cooling-startup-raises-60m-to-test-sun-reflecting-technology/",
      },
      {
        label: "Washington Post: Companies that want to block the sun",
        url: "https://www.washingtonpost.com/climate-solutions/2025/12/03/stardust-make-sunsets-geoengineering-startups/",
      },
      {
        label: "CIEL: Reckless Geoengineering Gamble",
        url: "https://www.ciel.org/news/us-israeli-start-up-unveils-reckless-geoengineering-gamble/",
      },
    ],
  },
  {
    id: "experiments",
    title: "April 2026 Experiments",
    urgent: true,
    paragraphs: [
      "Stardust plans to begin \"outdoor contained experiments\" starting April 2026 — weeks from now. The tests would release their proprietary reflective particles inside a modified plane flying at approximately 11 miles (18 km) above sea level, in the stratosphere. They describe this as \"contained\" and \"non-dispersive.\"",
      "The tests are planned in Israel (headquarters near Tel Aviv, in Ness Ziona). The exact location has not been publicly disclosed.",
    ],
    bullets: [
      "Zero public consultation conducted",
      "Zero published safety data",
      "No environmental or health impact assessment made public",
      "No regulatory approval process reported",
      "No Israeli government statement permitting or opposing the tests",
      "Israel is party to the Convention on Biological Diversity, which has a moratorium on geoengineering (reaffirmed at COP16)",
    ],
    quotes: [
      {
        text: "US-Israeli start-up Stardust Solutions plans reckless outdoor experiments of highly controversial solar geoengineering from April 2026.",
        attribution: "Center for International Environmental Law (CIEL)",
      },
    ],
    sources: [
      {
        label: "CIEL: Stardust plans reckless outdoor experiments from April 2026",
        url: "https://www.ciel.org/news/us-israeli-start-up-announces-reckless-solar-geoengineering-experiments-from-april-2026/",
      },
      {
        label: "E&E News: Global cooling startup raises $60M",
        url: "https://www.eenews.net/articles/global-cooling-startup-raises-60m-to-test-sun-reflecting-technology/",
      },
      {
        label: "Bulletin of the Atomic Scientists",
        url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
      },
    ],
  },
  {
    id: "lobbying",
    title: "Secret Lobbying: The \"Clerical Error\"",
    paragraphs: [
      "In Q1 2025, Stardust hired Holland & Knight — a major K Street law and lobbying firm — to lobby Congress. Holland & Knight failed to publicly disclose the relationship as required by federal law.",
      "When E&E News/Politico broke the story in November 2025, Holland & Knight spokesperson Olivia Hoch called the non-disclosure a \"clerical error\" and \"inadvertent.\" The firm refused to say how much Stardust paid or what specific issues were lobbied on.",
      "CEO Yedvab claimed they were lobbying \"for oversight\" of their own industry. But the company simultaneously refused to publish its particle composition, refused public consultation, and ignored its own governance consultant's recommendations.",
    ],
    quotes: [
      {
        text: "We're not seeking funding or discussing specific laws or regulations — we're informing members of Congress about our work and the need for appropriate and robust oversight.",
        attribution: "Yanai Yedvab, CEO, Stardust Solutions",
      },
    ],
    sources: [
      {
        label: "E&E News/Politico: Geoengineering startup secretly lobbying Congress",
        url: "https://www.eenews.net/articles/geoengineering-startup-hires-powerhouse-lobby-shop/",
      },
      {
        label: "OpenSecrets: Holland & Knight Lobbying Profile",
        url: "https://www.opensecrets.org/federal-lobbying/firms/summary?cycle=2025&id=D000000330",
      },
    ],
  },
  {
    id: "governance",
    title: "The Governance Consultant They Hired and Ignored",
    paragraphs: [
      "In 2024, Stardust hired Janos Pasztor — a veteran climate diplomat, former UN Assistant Secretary-General on Climate Change, and founder of the Carnegie Climate Governance Initiative — as an independent governance consultant. Notably, Pasztor donated his entire consulting fee to UNRWA (UN Relief and Works Agency for Palestine Refugees) rather than keep it.",
    ],
    bullets: [
      "Pasztor recommended: publish a public website, develop a code of conduct, increase transparency, engage stakeholders, appoint an advisory group, reach out to scientific evaluators",
      "Stardust's website was hidden from search engines for months",
      "The agreed-upon code of conduct was never published — replaced with watered-down \"Guiding Principles\"",
      "No public consultation was conducted",
      "No research data was published",
      "No advisory group was appointed",
    ],
    quotes: [
      {
        text: "Come on guys, this is getting embarrassing.",
        attribution:
          "Janos Pasztor, former UN Assistant Secretary-General, on Stardust's delays in publishing governance documents",
      },
      {
        text: "They've ignored every recommendation from everyone and think they can turn a profit in this field.",
        attribution: "Douglas MacMartin, Associate Professor, Cornell University",
      },
      {
        text: "The company is in violation of virtually every norm that has driven the field so far: not open about research, not open about the particle, for-profit, and pursuing IP protections.",
        attribution: "Summary of scientific community criticism (Undark, MIT Technology Review)",
      },
    ],
    sources: [
      {
        label: "Undark: How One Company Wants to Make Geoengineering Profitable",
        url: "https://undark.org/2025/03/17/stardust-geoengineering-profitable/",
      },
      {
        label: "MIT Technology Review",
        url: "https://www.technologyreview.com/2025/12/10/1129079/how-one-controversial-startup-hopes-to-cool-the-planet/",
      },
      {
        label: "SRM360: Governance Recommendations for Stardust",
        url: "https://srm360.org/perspective/governance-recommendations-for-stardust/",
      },
    ],
  },
  {
    id: "ciel",
    title: "International Condemnation",
    paragraphs: [
      "The Center for International Environmental Law (CIEL) has published multiple statements condemning Stardust, calling their approach a \"reckless geoengineering gamble\" that \"threatens to put humanity on a path of no return to perpetual dependency on this extreme technology.\"",
      "CIEL points out that deployment is constrained by international customary law and prohibited under a longstanding moratorium at the Convention on Biological Diversity — which Israel is a party to. The moratorium was reaffirmed by consensus at CBD COP16 in Colombia.",
      "Over 600 scientists worldwide have signed the Solar Geoengineering Non-Use Agreement, calling for a halt to commercial solar geoengineering deployment. The academic community is broadly critical of for-profit SAI.",
    ],
    quotes: [
      {
        text: "Stardust Solutions and its investors are accelerating a reckless race that threatens to put humanity on a path of no return to perpetual dependency on this extreme technology.",
        attribution: "Center for International Environmental Law (CIEL)",
      },
      {
        text: "Who gets to control the global thermostat?",
        attribution: "CIEL, on the governance implications of commercial SAI",
      },
    ],
    sources: [
      {
        label: "CIEL: Reckless Geoengineering Gamble",
        url: "https://www.ciel.org/news/us-israeli-start-up-unveils-reckless-geoengineering-gamble/",
      },
      {
        label: "CIEL: Reckless outdoor experiments from April 2026",
        url: "https://www.ciel.org/news/us-israeli-start-up-announces-reckless-solar-geoengineering-experiments-from-april-2026/",
      },
      {
        label: "Solar Geoengineering Non-Use Agreement",
        url: "https://www.solargeoeng.org/non-use-agreement/",
      },
    ],
  },
  {
    id: "founders",
    title: "The Founders: From Nuclear Weapons to Geoengineering",
    paragraphs: [
      "All three Stardust co-founders come from Israel's nuclear weapons establishment — specifically the Negev Nuclear Research Center (Dimona), Israel's most classified nuclear facility, and the Israel Atomic Energy Commission (IAEC).",
      "The Negev Nuclear Research Center was built in 1958 with French assistance under secret agreements. While officially for \"general research purposes,\" its actual purpose is the production of nuclear materials for Israel's estimated 80-400 nuclear weapons. Israel maintains a policy of \"strategic ambiguity\" and has never signed the Non-Proliferation Treaty. When U.S. inspectors visited, Israel reportedly installed temporary false walls and other concealment devices — the inspectors told the U.S. government their inspections were \"useless.\"",
      "This institutional background is essential context. These are not people who come from a culture of open science — they come from a culture of extreme secrecy by design. The opacity of Stardust is not an accident.",
    ],
    sources: [
      {
        label: "Bulletin of the Atomic Scientists: Reach for the Stardust",
        url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
      },
      {
        label: "Arms Control Association: Israel Nuclear Weapons Overview",
        url: "https://www.armscontrol.org/factsheets/IsraelProfile",
      },
    ],
  },
  {
    id: "funding",
    title: "The Money Behind Stardust",
    paragraphs: [
      "Stardust has raised $75 million in under three years — more than double any other geoengineering company. Their $60M Series A (October 2025) is the largest geoengineering investment in history. They raise at roughly $30M/year compared to an industry average of $7-10M/year.",
      "The seed round ($15M, early 2024) came primarily from AWZ Ventures — a Canadian-Israeli VC with a unique partnership with MAFAT, the Israeli Ministry of Defense's R&D arm. AWZ's advisory board includes a former Mossad Chief of Intelligence, a former Unit 8200 commander, and former directors of the CIA, FBI, and MI5. Their first fund ($82.5M) was a joint fund with the Israeli Ministry of Defence.",
      "When confronted about defense connections, Stardust stated it \"receives no funding from the Israeli Defense Ministry\" and \"has no connection to the Israeli government.\" This is technically about direct government funding — AWZ's relationship with the Defense Ministry is acknowledged on AWZ's own website.",
    ],
    sources: [
      {
        label: "Heatmap News: $60M Series A",
        url: "https://heatmap.news/climate-tech/stardust-geoengineering",
      },
      {
        label: "AWZ Ventures: About (MAFAT partnership)",
        url: "https://www.awzventures.com/about",
      },
      {
        label: "E&E News: Betting on climate failure",
        url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
      },
      {
        label: "SkyLedger: Follow the Money",
        url: "/learn/follow-the-money",
      },
    ],
  },
];

const founders = [
  {
    name: "Yanai Yedvab",
    role: "CEO & Co-Founder",
    background: [
      "PhD in Experimental Nuclear Physics (Ben-Gurion University of the Negev)",
      "MPA from Harvard Kennedy School",
      "30+ years in Israeli national labs and governmental R&D",
      "Head of the Physics Division at the Negev Nuclear Research Center (Dimona)",
      "Deputy Chief Research Scientist at IAEC (2011-2015)",
      "Previously CTO of Aleph8",
    ],
    geoPublications: "None. Zero peer-reviewed papers on geoengineering, aerosols, or atmospheric science.",
    notable:
      "Rejected Undark's \"many requests for an interview.\" Required NDAs from scientists reviewing Stardust's work. Daniele Visioni (Cornell) refused to sign and couldn't get answers.",
  },
  {
    name: "Amyad Spector",
    role: "CPO & Co-Founder",
    background: [
      "Advanced degree under Eli Waxman's supervision at the Weizmann Institute",
      "Physics researcher at the Negev Nuclear Research Center (Dimona)",
      "Nearly a decade on unspecified Israeli government R&D projects",
      "Worked on Israel's COVID-19 pandemic response",
    ],
    geoPublications: "None known.",
    notable:
      "By far the least visible co-founder — zero interviews, zero public quotes in any article. Consistent with a career in classified Israeli defense/nuclear R&D.",
  },
  {
    name: "Eli Waxman",
    role: "Lead Scientist & Co-Founder",
    background: [
      "Professor of Physics, Weizmann Institute of Science",
      "Research Physicist at the Negev Nuclear Research Center (Dimona) during graduate studies",
      "Former Chief Scientist of IAEC (2013-2015)",
      "Head of National Security Council Expert Committee on COVID-19 (2020)",
      "170 refereed papers, 23,538 citations, h-index 69",
      "Head researcher on ULTRASAT satellite mission (Israel's first space telescope, NASA launch 2026)",
    ],
    geoPublications:
      "None. Despite being the most prolific academic of the three, Waxman has published zero peer-reviewed papers on geoengineering, aerosols, or atmospheric science. Entire publication record is in astrophysics.",
    notable:
      "His academic credibility lends legitimacy to Stardust. Overlapped with Yedvab at IAEC from 2013-2015 — likely where they deepened their working relationship.",
  },
];

const timeline = [
  { date: "2023", event: "Stardust Solutions founded. Operates in stealth mode." },
  { date: "Early 2024", event: "$15M seed round from AWZ Ventures (Israeli defense-VC) + SolarEdge." },
  { date: "April 2024", event: "First public mention (NPR report). Seed round disclosed." },
  { date: "Sept 2024", event: "CEO Yedvab presents at NOAA Chemical Sciences Laboratory, Boulder, CO." },
  { date: "Q1 2025", event: "Holland & Knight hired to lobby Congress. Fails to disclose as required by law." },
  { date: "Feb 2025", event: "Bare-bones website launched — previously hidden from search engines." },
  { date: "March 2025", event: "Bulletin of the Atomic Scientists publishes founder investigation." },
  { date: "Oct 2025", event: "$60M Series A announced — largest geoengineering investment in history. Lowercarbon Capital (Sacca) leads." },
  { date: "Nov 2025", event: "E&E News/Politico exposes secret lobbying. Holland & Knight blames \"clerical error.\"" },
  { date: "Dec 2025", event: "First major interviews (MIT Technology Review, Washington Post)." },
  { date: "April 2026", event: "Planned outdoor experiments — release of secret particles at 18km altitude. No public consultation." },
];

// ============================================================
// PAGE
// ============================================================

export default function StardustDeepDivePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/learn/operators"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; All operators
      </Link>

      {/* Header */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Stardust Solutions</h1>
          <Badge variant="destructive">Stratospheric Aerosol Injection</Badge>
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Active
          </Badge>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Founded 2023 &middot; Ness Ziona, Israel &middot; US-incorporated
          (Delaware) &middot; $75M raised &middot; ~25 employees
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          A for-profit startup founded by three scientists from Israel&apos;s
          nuclear weapons establishment, funded by defense-intelligence-connected
          investors, developing secret patented particles to spray into the
          stratosphere. They have published zero peer-reviewed research, ignored
          their own governance consultant, secretly lobbied Congress, and plan to
          begin outdoor experiments in April 2026 with no public consultation.
        </p>
      </div>

      {/* Urgent Banner */}
      <div className="mt-6 rounded-lg border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 p-5">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-red-600 text-white animate-pulse">
            APRIL 2026
          </span>
          <h2 className="font-bold text-red-800 dark:text-red-200">
            Experiments Starting Now
          </h2>
        </div>
        <p className="mt-3 text-sm text-red-800 dark:text-red-200 font-medium">
          An Israeli company is preparing to release secret, patented particles
          into the stratosphere — and they won&apos;t tell anyone what&apos;s in
          them.
        </p>
        <ul className="mt-3 space-y-2 text-sm text-red-700 dark:text-red-300">
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 font-bold">&bull;</span>
            <span>
              <span className="font-semibold">Zero published data.</span> No
              peer-reviewed research. No public safety assessment. No public
              consultation.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 font-bold">&bull;</span>
            <span>
              <span className="font-semibold">Suspiciously funded.</span> $75M
              raised in under two years — more than double every other
              geoengineering company combined. The largest investment in this
              industry&apos;s history.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 font-bold">&bull;</span>
            <span>
              <span className="font-semibold">
                Intelligence and defense ties.
              </span>{" "}
              Their lead investor&apos;s advisory board includes a former Mossad
              Chief of Intelligence, a former IDF Unit 8200 commander, and
              former directors of the CIA, FBI, and MI5.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 font-bold">&bull;</span>
            <span>
              A Cornell scientist says their safety claims{" "}
              <span className="font-semibold">
                &quot;cannot be trusted.&quot;
              </span>{" "}
              The Center for International Environmental Law calls their plans{" "}
              <span className="font-semibold">&quot;reckless.&quot;</span>
            </span>
          </li>
        </ul>
        <div className="mt-4">
          <a
            href="#particles"
            className="inline-flex items-center gap-1 text-sm font-bold text-red-800 dark:text-red-200 hover:underline"
          >
            Read the full investigation &darr;
          </a>
        </div>
      </div>

      {/* Table of Contents */}
      <nav className="mt-8 rounded-lg border border-border bg-muted/30 p-5">
        <h2 className="text-sm font-semibold">Investigation Sections</h2>
        <div className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {sections.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs text-primary hover:underline py-0.5"
            >
              {i + 1}. {s.title}
              {s.urgent && (
                <span className="ml-1 text-red-600 font-bold">!</span>
              )}
            </a>
          ))}
          <a
            href="#founder-profiles"
            className="text-xs text-primary hover:underline py-0.5"
          >
            9. Founder Profiles
          </a>
          <a
            href="#timeline"
            className="text-xs text-primary hover:underline py-0.5"
          >
            10. Timeline
          </a>
        </div>
      </nav>

      {/* Investigation Sections */}
      {sections.map((section, idx) => (
        <section key={section.id} id={section.id} className="mt-10">
          <h2 className="text-xl font-bold border-b border-border pb-2 flex items-center gap-2">
            <span className="text-muted-foreground font-mono text-sm">
              {idx + 1}.
            </span>
            {section.title}
            {section.urgent && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-red-600 text-white">
                URGENT
              </span>
            )}
          </h2>

          <div className="mt-4 space-y-4">
            {section.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-sm text-muted-foreground leading-relaxed"
              >
                {p}
              </p>
            ))}

            {section.bullets && (
              <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                {section.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}

            {section.quotes && section.quotes.length > 0 && (
              <div className="space-y-3 mt-4">
                {section.quotes.map((q, i) => (
                  <blockquote
                    key={i}
                    className="border-l-2 border-primary/40 pl-4 py-1"
                  >
                    <p className="text-sm italic">&ldquo;{q.text}&rdquo;</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      &mdash; {q.attribution}
                    </p>
                  </blockquote>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
              {section.sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target={s.url.startsWith("/") ? undefined : "_blank"}
                  rel={
                    s.url.startsWith("/")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="text-[11px] text-primary hover:underline"
                >
                  {s.label} &rarr;
                </a>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Founder Profiles */}
      <section id="founder-profiles" className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          <span className="text-muted-foreground font-mono text-sm">9.</span>{" "}
          Founder Profiles
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          All three co-founders come from the Negev Nuclear Research Center
          (Dimona) and/or the Israel Atomic Energy Commission. None have
          published peer-reviewed research on geoengineering.
        </p>

        <div className="mt-4 space-y-6">
          {founders.map((f) => (
            <div
              key={f.name}
              className="rounded-lg border border-border p-5"
            >
              <div className="flex items-center gap-2">
                <h3 className="font-bold">{f.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                  {f.role}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Background
                </p>
                <ul className="mt-1.5 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                  {f.background.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Geoengineering Publications
                </p>
                <p className="mt-1 text-sm text-red-700 dark:text-red-400 font-medium">
                  {f.geoPublications}
                </p>
              </div>

              {f.notable && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Notable
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {f.notable}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="mt-10">
        <h2 className="text-xl font-bold border-b border-border pb-2">
          <span className="text-muted-foreground font-mono text-sm">10.</span>{" "}
          Timeline
        </h2>
        <div className="mt-4 space-y-0">
          {timeline.map((event, i) => {
            const isUrgent = event.date === "April 2026";
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                      isUrgent ? "bg-red-500" : "bg-primary"
                    }`}
                  />
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-border" />
                  )}
                </div>
                <div className="pb-5">
                  <p
                    className={`text-xs font-medium ${
                      isUrgent
                        ? "text-red-600 dark:text-red-400 font-bold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {event.date}
                  </p>
                  <p className="text-sm mt-0.5">{event.event}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Line */}
      <section className="mt-10">
        <div className="rounded-lg border border-border bg-muted/30 p-6">
          <h3 className="font-semibold">The Bottom Line</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            A for-profit company founded by nuclear weapons scientists, funded
            by defense-intelligence-connected investors, wants to spray a secret
            patented substance into the stratosphere — affecting every person on
            the planet — and won&apos;t tell anyone what it is. They&apos;ve
            published zero research, ignored their own governance consultant,
            secretly lobbied Congress, and plan to begin experiments in weeks
            with no public consultation. Over 600 scientists have called for a
            halt to commercial solar geoengineering. International law prohibits
            it. They&apos;re doing it anyway.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-8 mb-8 rounded-lg border-2 border-primary/20 bg-primary/5 p-6 text-center">
        <h3 className="text-lg font-bold">What you can do</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Share this page. Contact your representatives. Support the legal fight.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/get-involved"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Involved &rarr;
          </Link>
          <Link
            href="/learn/follow-the-money"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Follow the Money &rarr;
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mb-8 rounded-lg border border-border bg-muted/30 p-5">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Note:</span> Every
          claim on this page is cited with its primary source. SkyLedger does
          not make accusations — we present documented facts from public
          records, government databases, court filings, and reputable
          journalism. We encourage readers to verify every claim independently.
        </p>
      </div>
    </div>
  );
}
