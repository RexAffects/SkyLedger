/**
 * Operator Profiles — structured data for all known weather modification
 * and geoengineering operators. Single source of truth used by:
 * - FAA lookup flagging (faa.ts)
 * - Operator profile pages (/learn/operators/[slug])
 * - Flight detail panel "Learn More" links
 */

export interface OperatorSource {
  label: string;
  url: string;
}

export interface Person {
  name: string;
  role: string;
  background: string;
  nationality?: string;
  connections?: string[];
  sources: OperatorSource[];
}

export interface Investor {
  name: string;
  type: "vc" | "individual" | "foundation" | "corporate" | "government";
  background: string;
  amountIfKnown?: string;
  geoConnections?: string[];
}

export interface FundingRound {
  date: string;
  amount: string;
  type: string;
  investors: Investor[];
  sources: OperatorSource[];
}

export interface Connection {
  entity: string;
  entitySlug?: string;
  relationship: string;
  confirmed: boolean;
  source: OperatorSource;
}

export type OperatorCategory =
  | "cloud-seeding"
  | "stratospheric-aerosol-injection"
  | "marine-cloud-brightening"
  | "space-mirrors"
  | "ice-thickening"
  | "research-advocacy"
  | "funding";

export const CATEGORY_LABELS: Record<OperatorCategory, string> = {
  "cloud-seeding": "Cloud Seeding",
  "stratospheric-aerosol-injection": "Stratospheric Aerosol Injection",
  "marine-cloud-brightening": "Marine Cloud Brightening",
  "space-mirrors": "Space Mirrors",
  "ice-thickening": "Ice Thickening",
  "research-advocacy": "Research & Advocacy",
  funding: "Funding / Investment",
};

export interface RedFlag {
  flag: string;
  detail: string;
  source?: OperatorSource;
}

export interface Operator {
  slug: string;
  name: string;
  shortName: string;
  category: OperatorCategory;
  description: string;
  founded: string;
  headquarters: string;
  website?: string;
  status: "active" | "disbanded" | "under-investigation";
  totalFunding?: string;
  keyFacts: string[];
  redFlags?: RedFlag[];
  listHighlights?: string[];
  people: Person[];
  funding: FundingRound[];
  connections: Connection[];
  sources: OperatorSource[];
  faaKeywords: string[];
}

// ---------------------------------------------------------------------------
// OPERATOR DATA
// ---------------------------------------------------------------------------

export const OPERATORS: Operator[] = [
  // =========================================================================
  // WEATHER MODIFICATION INTERNATIONAL
  // =========================================================================
  {
    slug: "weather-modification-international",
    name: "Weather Modification International",
    shortName: "WMI",
    category: "cloud-seeding",
    description:
      "World's largest private aerial cloud seeding company. 35+ aircraft fleet operating in 35+ countries. Based in Fargo, North Dakota. Founded 1961.",
    founded: "1961",
    headquarters: "Fargo, North Dakota",
    website: "https://weathermodification.com",
    status: "active",
    keyFacts: [
      "World's largest private cloud seeding operator",
      "35+ aircraft fleet, operates in 35+ countries",
      "Partnerships with US Department of Commerce and Naval Surface Warfare Center",
      "Owned by Patrick & Jim Sweeney since the early 1990s",
      "Also operate Fargo Jet Center (aircraft supply and pilot training)",
    ],
    people: [
      {
        name: "Patrick Sweeney",
        role: "Chairman of the Board & Co-Owner",
        background:
          "Started at WMI as a college-age radar and electrical technician. Bought into the company over time, then purchased remaining stock after the original founder retired in the early 1990s.",
        nationality: "American",
        sources: [
          {
            label: "Emerging Prairie profile",
            url: "https://www.emergingprairie.com/meet-weatherman-neil-brackin-leading-worlds-largest-weather-modification-company-fargo/",
          },
        ],
      },
      {
        name: "Jim Sweeney",
        role: "Executive Vice President & Co-Owner",
        background:
          "Patrick's brother. Was convinced by Patrick to return to North Dakota to join the company.",
        nationality: "American",
        sources: [
          {
            label: "Aviation Pros article",
            url: "https://www.aviationpros.com/home/article/10386825/seeding-fargo-growth",
          },
        ],
      },
    ],
    funding: [],
    connections: [
      {
        entity: "US Department of Commerce",
        relationship: "Government partnership",
        confirmed: true,
        source: {
          label: "Company website",
          url: "https://weathermodification.com",
        },
      },
      {
        entity: "Naval Surface Warfare Center",
        relationship: "Government partnership",
        confirmed: true,
        source: {
          label: "Company website",
          url: "https://weathermodification.com",
        },
      },
    ],
    sources: [
      {
        label: "FAA Aircraft Registry",
        url: "https://registry.faa.gov/AircraftInquiry/",
      },
      {
        label: "Congressional hearing testimony",
        url: "https://oversight.house.gov/",
      },
    ],
    faaKeywords: ["WEATHER MODIFICATION", "WEATHER MOD"],
  },

  // =========================================================================
  // RAINMAKER
  // =========================================================================
  {
    slug: "rainmaker",
    name: "Rainmaker",
    shortName: "Rainmaker",
    category: "cloud-seeding",
    description:
      "Peter Thiel-backed drone-based cloud seeding startup. Operates in Utah, Colorado, Texas, and California. $31M+ raised. Actively lobbying against state bans.",
    founded: "2023",
    headquarters: "El Segundo, California",
    status: "active",
    totalFunding: "$31M+",
    keyFacts: [
      "Founded by Thiel Fellow Augustus Doricko after dropping out of UC Berkeley",
      "Uses drone-based cloud seeding with silver iodide",
      "Has state contracts with Utah and Colorado Departments of Natural Resources, Santa Barbara, San Luis Obispo",
      "Named in Congressional hearing in connection with Texas flood concerns",
      "Actively lobbying against state 'Clear Skies Act' legislation that would criminalize weather modification",
    ],
    people: [
      {
        name: "Augustus Doricko",
        role: "CEO & Founder",
        background:
          "25 years old. UC Berkeley dropout (physics). Thiel Fellow. Came up with the idea of a weather startup after joining the Thiel Fellowship.",
        nationality: "American",
        sources: [
          {
            label: "Fast Company profile",
            url: "https://www.fastcompany.com/91448561/this-is-the-hardest-startup-in-america",
          },
        ],
      },
    ],
    funding: [
      {
        date: "2024",
        amount: "$6.3M",
        type: "Seed",
        investors: [
          {
            name: "Peter Thiel",
            type: "individual",
            background:
              "German-American billionaire. Born in Frankfurt. PayPal co-founder, Palantir co-founder. Thiel Fellowship backed Doricko.",
          },
          {
            name: "Garry Tan",
            type: "individual",
            background:
              "Chinese-Burmese Canadian-American. CEO of Y Combinator. Born in Winnipeg to Chinese Singaporean father and Burmese-Chinese mother.",
          },
          {
            name: "Naval Ravikant",
            type: "individual",
            background:
              "Indian-American. Born in New Delhi, moved to NYC at age 9. Co-founder of AngelList. Early investor in Uber, Twitter.",
          },
        ],
        sources: [
          {
            label: "Fortune: Cloud seeding startup raises $6.3M",
            url: "https://fortune.com/2024/05/07/cloud-seeding-startup-rainmaker-raises-6-million/",
          },
        ],
      },
      {
        date: "2025",
        amount: "$25M",
        type: "Series A",
        investors: [
          {
            name: "Lowercarbon Capital",
            type: "vc",
            background:
              "Chris Sacca's $2.4B AUM climate fund. Italian-Irish American founder from Lockport, NY.",
            geoConnections: [
              "Harvard SGRP donor",
              "SilverLining funder",
              "Stardust Solutions lead investor",
              "Marine Cloud Brightening funder",
            ],
          },
          {
            name: "Starship Ventures",
            type: "vc",
            background: "American VC.",
          },
          {
            name: "Long Journey Ventures",
            type: "vc",
            background: "American VC.",
          },
          {
            name: "1517 Fund",
            type: "vc",
            background:
              "Founded by Michael Gibson (American, former VP at Thiel Foundation). Fund backed by Peter Thiel. Named after the year Martin Luther posted his 95 Theses.",
          },
        ],
        sources: [
          {
            label: "LA Business Journal",
            url: "https://labusinessjournal.com/technology/rainmaker-raises-a-25-million-series-a-round/",
          },
        ],
      },
    ],
    connections: [
      {
        entity: "Peter Thiel",
        relationship:
          "Early backer via Thiel Fellowship. Doricko is a Thiel Fellow.",
        confirmed: true,
        source: {
          label: "Fast Company",
          url: "https://www.fastcompany.com/91448561/this-is-the-hardest-startup-in-america",
        },
      },
      {
        entity: "Lowercarbon Capital",
        entitySlug: "lowercarbon-capital",
        relationship:
          "Series A lead investor. Also leads Stardust Solutions and funds geoengineering research.",
        confirmed: true,
        source: {
          label: "E&E News",
          url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
        },
      },
      {
        entity: "Clear Skies Act opposition",
        relationship:
          "Actively lobbying against H.R. 4403 and state-level bans on weather modification.",
        confirmed: true,
        source: {
          label: "E&E News lobbying report",
          url: "https://www.eenews.net/articles/geoengineering-startup-hires-powerhouse-lobby-shop/",
        },
      },
    ],
    sources: [
      {
        label: "Fast Company: Hardest startup in America",
        url: "https://www.fastcompany.com/91448561/this-is-the-hardest-startup-in-america",
      },
      {
        label: "Congressional hearing testimony",
        url: "https://oversight.house.gov/",
      },
    ],
    faaKeywords: ["RAINMAKER"],
  },

  // =========================================================================
  // STARDUST SOLUTIONS
  // =========================================================================
  {
    slug: "stardust-solutions",
    name: "Stardust Solutions",
    shortName: "Stardust",
    category: "stratospheric-aerosol-injection",
    description:
      "The most funded geoengineering startup in existence ($75M). Founded by three former Israeli nuclear establishment scientists. Developing proprietary secret particles for stratospheric aerosol injection. Aims to sell to governments at 'more than a billion dollars a year.'",
    founded: "2023",
    headquarters: "Outside Tel Aviv, Israel / Palo Alto, CA",
    website: "https://stardust-initiative.com",
    status: "active",
    totalFunding: "$75M (more than double any other geoengineering operator — raised in under 3 years)",
    keyFacts: [
      "Accounts for ~65% of ALL geoengineering startup funding ($75M of $115.8M total)",
      "All three cofounders come from Israel's nuclear weapons establishment (Dimona/IAEC)",
      "Seed money from Awz Ventures — founded by a Shin Bet veteran, advisory board includes former Mossad Chief of Intelligence, former CIA/FBI/MI5 directors, and Unit 8200 alumni. Partnered with MAFAT (Israeli MoD R&D). Former IDF Chief Aviv Kohavi joined the firm. Manages $500M+ across four funds. First fund ($82.5M) was a joint fund with the Israeli Ministry of Defence.",
      "Particle composition is secret (patent pending) — no independent analysis possible",
      "Hired Holland & Knight (K Street lobby firm) Q1 2025; disclosure initially hidden due to 'clerical error'",
      "Hired independent governance consultant who recommended transparency — then ignored every recommendation",
      "Planning in-aircraft stratospheric experiments April 2026 with no public consultation",
      "Business model: defense contractor for climate — governments pay 'more than a billion dollars a year'",
    ],
    listHighlights: [
      "Advisory board includes former Mossad Director, CIA Director, MI5 Director General",
      "Seed investor partnered with Israeli Ministry of Defense (MAFAT), Unit 8200, IDF Chief of Staff",
      "All three founders from Israel's nuclear weapons program — zero atmospheric science credentials",
      "10 documented red flags — secret particles, hidden lobbying, ignored governance recommendations",
    ],
    redFlags: [
      {
        flag: "Secret particle composition",
        detail:
          "Will not disclose what they plan to spray into the atmosphere. Patent pending. No external scientist can evaluate their safety claims because zero data has been published.",
        source: {
          label: "MIT Technology Review",
          url: "https://www.technologyreview.com/2025/12/10/1129079/how-one-controversial-startup-hopes-to-cool-the-planet/",
        },
      },
      {
        flag: "Zero published research",
        detail:
          "No peer-reviewed papers on their particle's safety, effectiveness, or environmental impact. Cornell researcher Douglas MacMartin: they claim a 'magic aerosol particle' that cannot be trusted without published findings.",
        source: {
          label: "Undark investigation",
          url: "https://undark.org/2025/03/17/stardust-geoengineering-profitable/",
        },
      },
      {
        flag: "Nuclear weapons program founders",
        detail:
          "All three co-founders come from Israel's nuclear weapons establishment (Negev Nuclear Research Center / Dimona and Israel Atomic Energy Commission). None have published a single paper on geoengineering, atmospheric science, or aerosols.",
        source: {
          label: "Bulletin of Atomic Scientists",
          url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
        },
      },
      {
        flag: "Defense/intelligence seed money",
        detail:
          "Seed round ($15M) came from AWZ Ventures — a VC whose advisory board includes a former Mossad Director, former CIA Director, former MI5 Director General, former Unit 8200 Commander, and former IDF Chief of Staff. AWZ is formally partnered with MAFAT (Israeli Ministry of Defense R&D).",
        source: {
          label: "AWZ Ventures team page",
          url: "https://www.awzventures.com/our-team",
        },
      },
      {
        flag: "Termination shock lock-in",
        detail:
          "Once stratospheric aerosol deployment starts, it cannot be stopped without catastrophic 'termination shock' — temperatures spike at 5-10x the rate of normal warming. Any government customer is locked into perpetual contracts. Perpetual dependency = perpetual revenue for whoever holds the patent.",
        source: {
          label: "Parker & Irvine, 2018 — Earth's Future (AGU)",
          url: "https://agupubs.onlinelibrary.wiley.com/doi/10.1002/2017EF000735",
        },
      },
      {
        flag: "Ignored every governance recommendation",
        detail:
          "Hired Janos Pasztor (former UN Asst. Secretary-General) as governance consultant. He recommended transparency, public engagement, and a code of conduct. The company ignored every key recommendation. Pasztor donated his entire fee to UNRWA. Cornell's MacMartin: 'They've ignored every recommendation from everyone.'",
        source: {
          label: "Undark investigation",
          url: "https://undark.org/2025/03/17/stardust-geoengineering-profitable/",
        },
      },
      {
        flag: "Secret lobbying of Congress",
        detail:
          "Hired Holland & Knight (K Street lobby firm) in Q1 2025. Failed to disclose the lobbying relationship for months as required by federal law. When caught by E&E News, Holland & Knight blamed a 'clerical error.' Refused to disclose payment amount or specific issues lobbied.",
        source: {
          label: "E&E News / Politico",
          url: "https://www.eenews.net/articles/geoengineering-startup-hires-powerhouse-lobby-shop/",
        },
      },
      {
        flag: "600+ scientists oppose this",
        detail:
          "The Solar Geoengineering Non-Use Agreement — signed by 600+ academics and ~2,000 civil society organizations — calls for banning outdoor experiments, prohibiting patents, and no public funding for deployment. Stardust is doing the exact opposite of every measure.",
        source: {
          label: "Solar Geoengineering Non-Use Agreement",
          url: "https://www.solargeoeng.org/non-use-agreement/open-letter/",
        },
      },
      {
        flag: "April 2026 experiments — no public consultation",
        detail:
          "Planning in-aircraft stratospheric experiments starting April 2026 in Israel. Zero public consultation. Zero published environmental or health impact assessments. Zero regulatory approval process. CIEL called the plans 'reckless.'",
        source: {
          label: "CIEL statement",
          url: "https://www.ciel.org/news/us-israeli-start-up-announces-reckless-solar-geoengineering-experiments-from-april-2026/",
        },
      },
      {
        flag: "Growing legal exposure",
        detail:
          "3 US states have banned geoengineering (Florida made it a felony — up to 5 years prison, $100K fine). 34 states have proposed bans. The market Stardust needs is actively criminalizing their product.",
        source: {
          label: "SRM360 US bans tracker",
          url: "https://srm360.org/us-bans/",
        },
      },
    ],
    people: [
      {
        name: "Yanai Yedvab",
        role: "CEO & Cofounder",
        background:
          "30 years in Israeli national labs. Head of the Physics Division at the Negev Nuclear Research Center (Dimona) — Israel's classified nuclear weapons facility. Deputy Chief Research Scientist at the Israel Atomic Energy Commission (IAEC), 2011-2015. Presented at NOAA's Chemical Sciences Laboratory in September 2024.",
        nationality: "Israeli",
        sources: [
          {
            label: "Bulletin of Atomic Scientists investigation",
            url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
          },
          {
            label: "NOAA seminar page",
            url: "https://csl.noaa.gov/seminars/2024/Yedvab.html",
          },
        ],
      },
      {
        name: "Amyad Spector",
        role: "Chief Product Officer & Cofounder",
        background:
          "Physicist. Physics researcher at the Negev Nuclear Research Center (Dimona). After Negev, worked on unspecified R&D projects for the Israeli government for nearly a decade. Also worked on Israel's COVID-19 response. Eli Waxman was his academic supervisor at Weizmann Institute.",
        nationality: "Israeli",
        sources: [
          {
            label: "Bulletin of Atomic Scientists",
            url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
          },
        ],
      },
      {
        name: "Eli Waxman",
        role: "Lead Scientist & Cofounder",
        background:
          "Astrophysicist at Weizmann Institute of Science. Head of Department of Particle Physics and Astrophysics. Former Chief Scientist of the Israel Atomic Energy Commission (IAEC), 2013-2015. During COVID-19, headed the National Security Council's Expert Advisers' Committee advising the Prime Minister on pandemic response.",
        nationality: "Israeli",
        connections: [
          "Academic supervisor of cofounder Amyad Spector",
          "Former Chief Scientist of the IAEC (same commission Yedvab served as Deputy)",
        ],
        sources: [
          {
            label: "Weizmann Institute profile",
            url: "https://www.weizmann.ac.il/physics/waxman/home",
          },
          {
            label: "Bulletin of Atomic Scientists",
            url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
          },
        ],
      },
    ],
    funding: [
      {
        date: "Early 2024",
        amount: "$15M",
        type: "Seed",
        investors: [
          {
            name: "Awz Ventures",
            type: "vc",
            background:
              "Canadian-Israeli VC. Founded by Yaron Ashkenazi (former Shin Bet officer). Advisory board includes former Mossad Chief of Intelligence, former CIA/FBI/MI5 directors, Unit 8200 alumni. Partnered with MAFAT (Israeli MoD R&D). Stephen Harper (22nd Canadian PM) is Advisory Committee President. Former IDF Chief Aviv Kohavi joined the firm. Manages $500M+ across four funds. First fund ($82.5M) was a joint fund with the Israeli Ministry of Defence.",
            geoConnections: [
              "Bridge between Israeli defense/intelligence establishment and geoengineering",
            ],
          },
          {
            name: "SolarEdge Technologies",
            type: "corporate",
            background:
              "Israeli NASDAQ-traded renewable energy company. Founded by Guy Sella (former IDF Sayeret Matkal, awarded Israel Defense Prize). Cofounders were four of his former soldiers.",
          },
        ],
        sources: [
          {
            label: "Heatmap News exclusive",
            url: "https://heatmap.news/climate-tech/stardust-geoengineering",
          },
          {
            label: "Awz Ventures about page",
            url: "https://www.awzventures.com/about",
          },
          {
            label: "The Breach: Harper / $350M military tech",
            url: "https://breachmedia.ca/stephen-harper-awz-ventures-surveillance-tech-israel/",
          },
        ],
      },
      {
        date: "October 2025",
        amount: "$60M",
        type: "Series A",
        investors: [
          {
            name: "Lowercarbon Capital (lead)",
            type: "vc",
            background:
              "Chris Sacca's $2.4B AUM climate fund. Sacca is Italian-Irish American from Lockport, NY.",
            geoConnections: [
              "Harvard SGRP donor (nonprofit research)",
              "SilverLining funder (advocacy/lobbying)",
              "Rainmaker investor (for-profit cloud seeding)",
              "Marine Cloud Brightening Project funder",
            ],
          },
          {
            name: "Exor (Agnelli family)",
            type: "corporate",
            background:
              "Dutch holding company controlled by the Agnelli family, an Italian industrial dynasty. Largest shareholder of Stellantis (Chrysler parent), Ferrari, Juventus. Current leadership is the Elkann branch — John Elkann's father Alain Elkann is Jewish.",
          },
          {
            name: "Matt Cohler",
            type: "individual",
            background:
              "American. One of first 5 employees at Facebook. Founding member of LinkedIn. Former General Partner at Benchmark. Forbes Midas List. Born in NYC, Yale grad.",
          },
          {
            name: "Lauder Partners",
            type: "vc",
            background:
              "Founded by Ronald S. Lauder, son of Estee Lauder. Ronald Lauder is President of the World Jewish Congress. Based in Atherton, CA. Early investor in Palantir, Zoom, Pure Storage.",
          },
          {
            name: "Nebular (Finn Murphy)",
            type: "vc",
            background:
              "Irish. $30M solo GP fund. Murphy studied engineering at Trinity College Dublin. Former partner at Frontline Ventures (Irish VC).",
            amountIfKnown: "$1M+",
          },
          {
            name: "Sequoia Capital",
            type: "vc",
            background:
              "Tier-1 Silicon Valley VC. Diverse partnership.",
          },
          {
            name: "Attestor",
            type: "vc",
            background: "British investment firm.",
          },
          {
            name: "Kindred Capital",
            type: "vc",
            background: "British VC.",
          },
          {
            name: "Orion Global Advisors",
            type: "vc",
            background: "British advisory firm.",
          },
          {
            name: "Earth.now",
            type: "vc",
            background: "Berlin-based climate VC.",
          },
        ],
        sources: [
          {
            label: "Heatmap News exclusive: $60M raise",
            url: "https://heatmap.news/climate-tech/stardust-geoengineering",
          },
          {
            label: "E&E News: Betting on climate failure",
            url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
          },
        ],
      },
    ],
    connections: [
      {
        entity: "Lowercarbon Capital",
        entitySlug: "lowercarbon-capital",
        relationship:
          "Lead Series A investor ($60M). Sacca also funds Harvard SGRP, SilverLining, Rainmaker, and Marine Cloud Brightening — occupying every seat from research to lobbying to profit.",
        confirmed: true,
        source: {
          label: "E&E News",
          url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
        },
      },
      {
        entity: "Awz Ventures / Israeli defense establishment",
        relationship:
          "Seed investor. Founded by Shin Bet veteran, partnered with MAFAT (Israeli MoD), advised by Mossad/CIA/FBI chiefs. Despite this, Stardust claims no connection to Israeli defense establishment.",
        confirmed: true,
        source: {
          label: "Awz Ventures website",
          url: "https://www.awzventures.com/about",
        },
      },
      {
        entity: "Negev Nuclear Research Center (Dimona)",
        relationship:
          "All three cofounders have direct ties. Two worked at the facility. Two held senior positions at the parent Israel Atomic Energy Commission.",
        confirmed: true,
        source: {
          label: "Bulletin of Atomic Scientists",
          url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
        },
      },
      {
        entity: "Holland & Knight (lobbyist)",
        relationship:
          "Hired Q1 2025 for Congressional outreach. Lobbying disclosure initially hidden due to 'clerical error.'",
        confirmed: true,
        source: {
          label: "E&E News: Lobbying",
          url: "https://www.eenews.net/articles/geoengineering-startup-hires-powerhouse-lobby-shop/",
        },
      },
      {
        entity: "Rainmaker",
        entitySlug: "rainmaker",
        relationship:
          "Shares lead investor Lowercarbon Capital (Chris Sacca). Both benefit from government adoption of atmospheric modification.",
        confirmed: true,
        source: {
          label: "E&E News",
          url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
        },
      },
      {
        entity: "Bill Gates / FICER",
        entitySlug: "bill-gates-ficer",
        relationship:
          "No direct Gates investment in Stardust. But Gates funds the research ecosystem (Harvard SGRP, FICER, Breakthrough Energy) that produces the science Stardust's business model depends on. Stardust's lead investor Chris Sacca also donates to Harvard SGRP — same pipeline.",
        confirmed: true,
        source: {
          label: "Harvard SGRP funding page",
          url: "https://geoengineering.environment.harvard.edu/funding",
        },
      },
    ],
    sources: [
      {
        label: "Bulletin of Atomic Scientists: Founders investigation",
        url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
      },
      {
        label: "Heatmap News: $60M exclusive",
        url: "https://heatmap.news/climate-tech/stardust-geoengineering",
      },
      {
        label: "MIT Technology Review",
        url: "https://www.technologyreview.com/2025/12/10/1129079/how-one-controversial-startup-hopes-to-cool-the-planet/",
      },
      {
        label: "CIEL: Reckless experiments",
        url: "https://www.ciel.org/news/us-israeli-start-up-announces-reckless-solar-geoengineering-experiments-from-april-2026/",
      },
      {
        label: "SRM360: Governance recommendations",
        url: "https://srm360.org/perspective/governance-recommendations-for-stardust/",
      },
      {
        label: "Undark: Profitability model",
        url: "https://undark.org/2025/03/17/stardust-geoengineering-profitable/",
      },
    ],
    faaKeywords: ["STARDUST SOLUTIONS", "STARDUST"],
  },

  // =========================================================================
  // MAKE SUNSETS
  // =========================================================================
  {
    slug: "make-sunsets",
    name: "Make Sunsets",
    shortName: "Make Sunsets",
    category: "stratospheric-aerosol-injection",
    description:
      "The only known private SAI deployer in the U.S. Releases sulfur dioxide into the stratosphere via weather balloons and sells 'cooling credits.' $1.2M raised from the Draper VC dynasty.",
    founded: "2022",
    headquarters: "United States",
    website: "https://makesunsets.com",
    status: "active",
    totalFunding: "$1.2M",
    keyFacts: [
      "Actively releasing sulfur dioxide into the stratosphere via weather balloons",
      "Sells 'cooling credits' — 1g SO2 claimed to offset 1 ton CO2 warming for one year",
      "First launched unauthorized balloons in Mexico, prompting Mexican government ban",
      "Now operating from Nevada",
      "Only known private SAI deployer in the U.S.",
      "Founded by former Y Combinator Director of Hardware",
    ],
    people: [
      {
        name: "Luke Iseman",
        role: "CEO & Cofounder",
        background:
          "American. 41 years old. Serial entrepreneur. Former Director of Hardware at Y Combinator. Known for building large art projects at Burning Man.",
        nationality: "American",
        sources: [
          {
            label: "Make Sunsets team page",
            url: "https://makesunsets.com/pages/who",
          },
        ],
      },
      {
        name: "Andrew Song",
        role: "Cofounder",
        background:
          "Former Outreach Manager at Indiegogo. Met Iseman in 2015 in San Francisco through shared passion for hardware companies.",
        nationality: "American",
        sources: [
          {
            label: "Make Sunsets team page",
            url: "https://makesunsets.com/pages/who",
          },
        ],
      },
    ],
    funding: [
      {
        date: "2022-2023",
        amount: "$1.2M",
        type: "Seed / Angel",
        investors: [
          {
            name: "Boost VC (Adam Draper)",
            type: "vc",
            background:
              "American. 4th-generation VC. Adam Draper is Tim Draper's son. Startup accelerator focused on emerging tech.",
          },
          {
            name: "Draper Associates (Tim Draper)",
            type: "vc",
            background:
              "American. Born East Chicago, Indiana. 3rd-generation VC dynasty. Grandfather William Henry Draper Jr. founded Draper, Gaither & Anderson (1958) and served as first US ambassador to NATO.",
          },
          {
            name: "Pioneer Fund",
            type: "vc",
            background: "American VC.",
          },
        ],
        sources: [
          {
            label: "CNBC: Make Sunsets balloons in Nevada",
            url: "https://www.cnbc.com/2023/02/22/solar-geoengineering-startup-make-sunsets-lets-off-balloons-in-nevada.html",
          },
        ],
      },
    ],
    connections: [
      {
        entity: "Draper Family VC Dynasty",
        relationship:
          "Backed by both Tim Draper (Draper Associates) and his son Adam Draper (Boost VC). The Draper dynasty is 4 generations of American VCs dating to post-WWII.",
        confirmed: true,
        source: {
          label: "Computer History Museum: Draper dynasty",
          url: "https://computerhistory.org/blog/venture-capital-in-the-blood-three-generations-of-drapers-in-silicon-valley/",
        },
      },
      {
        entity: "Mexico government ban",
        relationship:
          "First balloon launches were conducted in Mexico without authorization, prompting the Mexican government to ban SAI experiments on its territory.",
        confirmed: true,
        source: {
          label: "E&E News: Mexico halts operation",
          url: "https://www.eenews.net/articles/startup-halts-geoengineering-operation-in-mexico/",
        },
      },
    ],
    sources: [
      {
        label: "NPR: Solar geoengineering startups",
        url: "https://www.npr.org/2024/04/21/1244357506/earth-day-solar-geoengineering-climate-make-sunsets-stardust",
      },
      {
        label: "CNBC: Make Sunsets in Nevada",
        url: "https://www.cnbc.com/2023/02/22/solar-geoengineering-startup-make-sunsets-lets-off-balloons-in-nevada.html",
      },
    ],
    faaKeywords: ["MAKE SUNSETS"],
  },

  // =========================================================================
  // REFLECT ORBITAL
  // =========================================================================
  {
    slug: "reflect-orbital",
    name: "Reflect Orbital",
    shortName: "Reflect",
    category: "space-mirrors",
    description:
      "Space startup developing a constellation of satellite mirrors. Dual-use: directing sunlight to Earth at night for solar energy, OR reflecting sunlight away for geoengineering. $28-35M raised. Backed by Sequoia and Lux Capital.",
    founded: "2021",
    headquarters: "Los Angeles, California",
    website: "https://reflectorbital.com",
    status: "active",
    totalFunding: "$35M",
    keyFacts: [
      "Developing network of orbital satellite mirrors",
      "Dual-use technology: sell sunlight at night OR block sunlight for cooling",
      "Sequoia Capital's first space investment since SpaceX",
      "Founders are American engineers, not geoengineering specialists",
      "Had audience with Crown Prince of Dubai about the project",
    ],
    people: [
      {
        name: "Ben Nowack",
        role: "CEO & Cofounder",
        background:
          "American. 29 years old. Born on Cape Cod, Massachusetts. Wentworth Institute of Technology (BS Engineering). Former engineer at SpaceX, Zipline, and Tri-D Dynamics. Built fusion reactors in high school.",
        nationality: "American",
        sources: [
          {
            label: "Sequoia Capital founder profile",
            url: "https://sequoiacap.com/founder/ben-nowack/",
          },
          {
            label: "Monocle: Reflect Orbital profile",
            url: "https://monocle.com/business/aviation/reflect-orbital-aerospace-startup/",
          },
        ],
      },
      {
        name: "Tristan Semmelhack",
        role: "CTO & Cofounder",
        background:
          "American. Stanford dropout (took leave after first year). Built drones since middle school, started drone design business in 9th grade. Former intern at Zipline. Discovered Nowack via his YouTube channel.",
        nationality: "American",
        sources: [
          {
            label: "Stanford Review profile",
            url: "https://stanfordreview.org/reflect-orbital/",
          },
        ],
      },
    ],
    funding: [
      {
        date: "2025",
        amount: "$20M",
        type: "Series A",
        investors: [
          {
            name: "Lux Capital (lead)",
            type: "vc",
            background:
              "American deep-tech VC. Founded by Josh Wolfe (grew up in Coney Island, Brooklyn, raised by single mother/public school teacher, Cornell grad) and Peter Hebert (Syracuse grad).",
          },
          {
            name: "Sequoia Capital",
            type: "vc",
            background:
              "Tier-1 American VC. Their first space investment since SpaceX.",
          },
          {
            name: "Starship Ventures",
            type: "vc",
            background: "American VC.",
          },
        ],
        sources: [
          {
            label: "PR Newswire: $20M Series A",
            url: "https://www.prnewswire.com/news-releases/reflect-orbital-secures-20-million-in-series-a-funding-led-by-lux-capital-302454968.html",
          },
        ],
      },
    ],
    connections: [],
    sources: [
      {
        label: "Reflect Orbital team page",
        url: "https://www.reflectorbital.com/team",
      },
      {
        label: "E&E News: Betting on climate failure",
        url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
      },
    ],
    faaKeywords: [],
  },

  // =========================================================================
  // LOWERCARBON CAPITAL (CHRIS SACCA) — FUNDING NODE
  // =========================================================================
  {
    slug: "lowercarbon-capital",
    name: "Lowercarbon Capital",
    shortName: "Lowercarbon",
    category: "funding",
    description:
      "Chris Sacca's $2.4 billion climate investment fund. The single most connected entity in geoengineering: funds the research (Harvard SGRP), lobbies for policy (SilverLining), AND invests in deployment companies (Stardust Solutions lead, Rainmaker). Occupies every seat from science to profit.",
    founded: "2020",
    headquarters: "Wyoming",
    status: "active",
    totalFunding: "$2.4B AUM",
    keyFacts: [
      "Manages $2.4 billion in assets",
      "Led the largest geoengineering startup investment ever ($60M in Stardust Solutions)",
      "Also invested in Rainmaker (cloud seeding) and Marine Cloud Brightening Project",
      "Donates to Harvard Solar Geoengineering Research Program (nonprofit research)",
      "Funds SilverLining ($20.5M coalition) which lobbies Congress for SRM programs",
      "This is the full loop: fund research, lobby for government support, invest in the company that gets deployment contracts",
      "Chris Sacca is Italian-Irish American, not Israeli — but his fund is the bridge between geoengineering research and profit",
    ],
    people: [
      {
        name: "Chris Sacca",
        role: "Cofounder & Managing Partner",
        background:
          "Italian-Irish American. Born May 12, 1975 in Lockport, New York. Father Gerald Sacca (attorney, Italian descent from Calabria). Mother Katherine (Irish descent, SUNY professor). Georgetown Law grad. Early investor in Twitter, Uber, Instagram. Billionaire.",
        nationality: "American",
        sources: [
          {
            label: "Wikipedia",
            url: "https://en.wikipedia.org/wiki/Chris_Sacca",
          },
        ],
      },
    ],
    funding: [],
    connections: [
      {
        entity: "Stardust Solutions",
        entitySlug: "stardust-solutions",
        relationship: "Led $60M Series A (largest geoengineering investment ever).",
        confirmed: true,
        source: {
          label: "Heatmap News",
          url: "https://heatmap.news/climate-tech/stardust-geoengineering",
        },
      },
      {
        entity: "Rainmaker",
        entitySlug: "rainmaker",
        relationship: "Led $25M Series A.",
        confirmed: true,
        source: {
          label: "LA Business Journal",
          url: "https://labusinessjournal.com/technology/rainmaker-raises-a-25-million-series-a-round/",
        },
      },
      {
        entity: "Harvard Solar Geoengineering Research Program",
        relationship:
          "Donor to nonprofit research program that produces models showing SRM 'could work.'",
        confirmed: true,
        source: {
          label: "Harvard SGRP funding page",
          url: "https://geoengineering.environment.harvard.edu/funding",
        },
      },
      {
        entity: "SilverLining",
        relationship:
          "Funder of advocacy organization that lobbies Congress, State Department, and international bodies for SRM research and governance.",
        confirmed: true,
        source: {
          label: "SilverLining public disclosures",
          url: "https://www.silverlining.ngo",
        },
      },
      {
        entity: "Marine Cloud Brightening Project",
        relationship: "Funder of applied research.",
        confirmed: true,
        source: {
          label: "Inside Philanthropy: Sacca profile",
          url: "https://www.insidephilanthropy.com/find-a-grant/major-donors/chris-and-crystal-sacca",
        },
      },
      {
        entity: "Bill Gates / FICER",
        entitySlug: "bill-gates-ficer",
        relationship:
          "Both Sacca and Gates donate to Harvard SGRP. Gates funds the research through FICER ($8.5M+); Sacca funds the research AND invests in the companies that profit from deployment. Two sides of the same pipeline.",
        confirmed: true,
        source: {
          label: "Harvard SGRP funding page",
          url: "https://geoengineering.environment.harvard.edu/funding",
        },
      },
    ],
    sources: [
      {
        label: "E&E News: Betting on climate failure",
        url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
      },
      {
        label: "Inside Philanthropy: Chris and Crystal Sacca",
        url: "https://www.insidephilanthropy.com/find-a-grant/major-donors/chris-and-crystal-sacca",
      },
    ],
    faaKeywords: [],
  },

  // =========================================================================
  // BILL GATES / FICER / BREAKTHROUGH ENERGY — FUNDING NODE
  // =========================================================================
  {
    slug: "bill-gates-ficer",
    name: "Bill Gates / FICER / Breakthrough Energy",
    shortName: "Gates/FICER",
    category: "funding",
    description:
      "Bill Gates has personally funded geoengineering research with $8.5M+ since 2007 through FICER (Fund for Innovative Climate and Energy Research), managed by David Keith and Ken Caldeira. Gates also founded Breakthrough Energy, which employs Ken Caldeira as Senior Scientist. Gates funds the research ecosystem that the for-profit geoengineering startups build on.",
    founded: "2007",
    headquarters: "United States",
    status: "active",
    totalFunding: "$8.5M+ (FICER alone)",
    keyFacts: [
      "Gates has personally funded geoengineering research with $8.5M+ since 2007 through FICER",
      "FICER is managed by David Keith (world's leading SRM researcher) and Ken Caldeira — both top geoengineering scientists",
      "FICER is explicitly 'not a Gates Foundation project' — it's personal money, harder to track",
      "Gates founded Breakthrough Energy in 2015, assembling 28 billionaires including Jeff Bezos, Richard Branson, Mark Zuckerberg, Jack Ma",
      "Breakthrough Energy employs Ken Caldeira as Senior Scientist — the same person who co-manages FICER",
      "Gates is a donor to Harvard Solar Geoengineering Research Program (SGRP) — the central academic hub for SRM research",
      "David Keith ran Harvard SGRP, then moved to UChicago to lead the Climate Systems Engineering initiative (CSEi)",
      "Gates also co-founded CEPI (Coalition for Epidemic Preparedness Innovations) at Davos 2017 — one of few people who fund across both vaccine and geoengineering domains",
      "Cited in sworn Congressional testimony (Sept 2025) as a key geoengineering funder",
    ],
    people: [
      {
        name: "Bill Gates",
        role: "Funder",
        background:
          "American. Microsoft co-founder. Net worth ~$100B+. Personal geoengineering funding through FICER since 2007. Founded Breakthrough Energy (2015). Co-founded CEPI at Davos 2017. The single most influential individual funder of geoengineering research.",
        nationality: "American",
        sources: [
          {
            label: "Congressional hearing testimony, Sept 2025",
            url: "https://oversight.house.gov/",
          },
          {
            label: "Inside Philanthropy: Gates geoengineering",
            url: "https://www.insidephilanthropy.com",
          },
        ],
      },
      {
        name: "David Keith",
        role: "FICER Co-Manager / Leading SRM Researcher",
        background:
          "Canadian. World's leading solar geoengineering researcher. Ran Harvard Solar Geoengineering Research Program. Now founding director of UChicago Climate Systems Engineering initiative (CSEi). Co-managed Gates' FICER fund. Advised governments in US and Canada.",
        nationality: "Canadian",
        sources: [
          {
            label: "Harvard SGRP",
            url: "https://geoengineering.environment.harvard.edu",
          },
          {
            label: "UChicago CSEi",
            url: "https://climate.uchicago.edu",
          },
        ],
      },
      {
        name: "Ken Caldeira",
        role: "FICER Co-Manager / Breakthrough Energy Senior Scientist",
        background:
          "American. Former Edward Teller Fellow at Lawrence Livermore National Lab (DOE weapons lab), 1991-2005. Now Senior Scientist at Gates' Breakthrough Energy. Co-manages FICER. Stanford courtesy professor. One of the most cited geoengineering scientists.",
        nationality: "American",
        connections: [
          "Co-manages FICER (Gates' personal geoengineering fund)",
          "Senior Scientist at Breakthrough Energy (Gates' climate investment vehicle)",
          "Former Edward Teller Fellow at Lawrence Livermore (DOE weapons lab)",
        ],
        sources: [
          {
            label: "Breakthrough Energy",
            url: "https://www.breakthroughenergy.org",
          },
        ],
      },
    ],
    funding: [],
    connections: [
      {
        entity: "Harvard Solar Geoengineering Research Program",
        relationship:
          "Gates is a donor. David Keith (FICER co-manager) ran the program. This is the central academic hub that produces research saying SAI 'could work.'",
        confirmed: true,
        source: {
          label: "Harvard SGRP funding page",
          url: "https://geoengineering.environment.harvard.edu/funding",
        },
      },
      {
        entity: "UChicago Climate Systems Engineering Initiative",
        relationship:
          "David Keith (FICER co-manager) left Harvard to found CSEi at UChicago. Quadrature Climate Foundation gave $5M grant.",
        confirmed: true,
        source: {
          label: "UChicago CSEi",
          url: "https://climate.uchicago.edu",
        },
      },
      {
        entity: "Lowercarbon Capital",
        entitySlug: "lowercarbon-capital",
        relationship:
          "Chris Sacca also donates to Harvard SGRP. Gates funds the research; Sacca funds the research AND invests in the companies. They feed the same pipeline from opposite ends.",
        confirmed: true,
        source: {
          label: "Harvard SGRP funding page",
          url: "https://geoengineering.environment.harvard.edu/funding",
        },
      },
      {
        entity: "Stardust Solutions",
        entitySlug: "stardust-solutions",
        relationship:
          "No direct Gates investment in Stardust. But Gates funds the research (Harvard SGRP, FICER) that produces the scientific basis Stardust's business model depends on. Stardust's lead investor (Sacca) also funds Harvard SGRP.",
        confirmed: true,
        source: {
          label: "E&E News: Funding network",
          url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
        },
      },
      {
        entity: "Breakthrough Energy Coalition",
        relationship:
          "Gates assembled 28 billionaires in 2015: Jeff Bezos, Richard Branson, Michael Bloomberg, Mark Zuckerberg, Jack Ma, Masayoshi Son, among others. Ken Caldeira is Senior Scientist.",
        confirmed: true,
        source: {
          label: "Breakthrough Energy website",
          url: "https://www.breakthroughenergy.org",
        },
      },
      {
        entity: "SilverLining",
        relationship:
          "SilverLining lobbies Congress for SRM research funding. Gates funds the research that SilverLining advocates for. Kelly Wanser (SilverLining ED) has connections to government agencies.",
        confirmed: true,
        source: {
          label: "SilverLining public disclosures",
          url: "https://www.silverlining.ngo",
        },
      },
    ],
    sources: [
      {
        label: "Congressional hearing testimony, Sept 16, 2025",
        url: "https://oversight.house.gov/",
      },
      {
        label: "Harvard SGRP funding page",
        url: "https://geoengineering.environment.harvard.edu/funding",
      },
      {
        label: "Inside Philanthropy: Gates geoengineering funding",
        url: "https://www.insidephilanthropy.com",
      },
      {
        label: "Breakthrough Energy website",
        url: "https://www.breakthroughenergy.org",
      },
      {
        label: "FICER public disclosures",
        url: "https://keith.seas.harvard.edu/FICER",
      },
    ],
    faaKeywords: [],
  },

  // =========================================================================
  // NORTH AMERICAN WEATHER CONSULTANTS
  // =========================================================================
  {
    slug: "north-american-weather-consultants",
    name: "North American Weather Consultants",
    shortName: "NAWC",
    category: "cloud-seeding",
    description:
      "Cloud seeding operator based in Sandy, Utah. One of the longest-running weather modification firms in the U.S.",
    founded: "1950s",
    headquarters: "Sandy, Utah",
    status: "active",
    keyFacts: [
      "One of the oldest weather modification companies in the U.S.",
      "Conducts cloud seeding operations primarily in western states",
      "Government contractor for state-level cloud seeding programs",
    ],
    people: [],
    funding: [],
    connections: [],
    sources: [
      {
        label: "NOAA Weather Modification Activity Reports",
        url: "https://www.noaa.gov",
      },
    ],
    faaKeywords: ["NORTH AMERICAN WEATHER", "NAWC"],
  },

  // =========================================================================
  // IDAHO POWER
  // =========================================================================
  {
    slug: "idaho-power",
    name: "Idaho Power Company",
    shortName: "Idaho Power",
    category: "cloud-seeding",
    description:
      "Utility company operating a $4M/year cloud seeding program to increase snowpack for hydroelectric power generation.",
    founded: "1916",
    headquarters: "Boise, Idaho",
    website: "https://idahopower.com",
    status: "active",
    keyFacts: [
      "Operates a $4M/year cloud seeding program",
      "Goal: increase mountain snowpack to fill reservoirs for hydroelectric generation",
      "Program targets clouds over mountain ranges in Idaho",
    ],
    people: [],
    funding: [],
    connections: [],
    sources: [
      {
        label: "Idaho Power public program reports",
        url: "https://www.idahopower.com",
      },
    ],
    faaKeywords: ["IDAHO POWER"],
  },
];

// ---------------------------------------------------------------------------
// LOOKUP HELPERS
// ---------------------------------------------------------------------------

export function getOperatorBySlug(slug: string): Operator | undefined {
  return OPERATORS.find((op) => op.slug === slug);
}

export function getAllOperatorSlugs(): string[] {
  return OPERATORS.map((op) => op.slug);
}

/**
 * Given an FAA owner name, return the slug of the matching operator (if any).
 * Used by flight detail panel to create "See operator profile" links.
 */
export function getOperatorSlugFromOwnerName(
  ownerName: string
): string | null {
  const upper = ownerName.toUpperCase();
  for (const op of OPERATORS) {
    for (const keyword of op.faaKeywords) {
      if (upper.includes(keyword)) {
        return op.slug;
      }
    }
  }
  return null;
}

/**
 * Build the KNOWN_WX_MOD_OPERATORS lookup map from the canonical data.
 * Used by faa.ts to flag aircraft.
 */
export function buildWxModLookup(): Record<string, string> {
  const lookup: Record<string, string> = {};
  for (const op of OPERATORS) {
    for (const keyword of op.faaKeywords) {
      lookup[keyword] = `${op.name} — ${op.description.split(".")[0]}`;
    }
  }
  // Also keep the generic keywords
  lookup["SEEDING SOLUTIONS"] = "Cloud seeding operator";
  lookup["CLOUD SEEDING"] = "Cloud seeding operator";
  return lookup;
}
