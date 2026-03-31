// Follow the Money — Geoengineering Funding Network Data
// Every claim sourced with primary documents.

export interface NetworkSource {
  label: string;
  url: string;
}

export interface NetworkPlayer {
  slug: string;
  name: string;
  shortName: string;
  type: "fund" | "individual" | "defense-vc" | "corporate" | "research";
  tagline: string;
  keyStats: string[];
  summary: string;
  sections: {
    title: string;
    content: string[];
    sources?: NetworkSource[];
  }[];
  redFlags?: string[];
  quotes?: {
    text: string;
    speaker?: string;
    source?: NetworkSource;
  }[];
  socialMedia?: { platform: string; handle: string; url: string }[];
  operatorSlug?: string;
  sources: NetworkSource[];
}

export interface NetworkConnection {
  from: string;
  to: string;
  relationship: string;
  type: "investor" | "donor" | "advisor" | "partner" | "founder";
  source: NetworkSource;
}

export interface FundingEntry {
  period: string;
  amount: string;
  amountNumeric: number;
  events: string[];
  source?: NetworkSource;
}

export interface PipelineStep {
  step: number;
  label: string;
  description: string;
  entities: string[];
  saccaRole?: string;
}

export interface AggregatedRedFlag {
  flag: string;
  detail: string;
  category: "secrecy" | "conflicts" | "defense" | "legal" | "governance";
  source: NetworkSource;
}

// ============================================================
// FUNDING SPEED COMPARISON
// ============================================================

export interface FundingSpeed {
  company: string;
  totalFunding: string;
  yearsActive: number;
  ratePerYear: string;
  rateNumeric: number;
  note?: string;
}

export const FUNDING_SPEED: FundingSpeed[] = [
  {
    company: "Stardust Solutions",
    totalFunding: "$75M",
    yearsActive: 2.5,
    ratePerYear: "$30M/year",
    rateNumeric: 30,
    note: "More than double any other geoengineering company. 3-4x the rate of the next fastest.",
  },
  {
    company: "Rainmaker",
    totalFunding: "$31M",
    yearsActive: 3,
    ratePerYear: "~$10M/year",
    rateNumeric: 10,
  },
  {
    company: "Reflect Orbital",
    totalFunding: "$35M",
    yearsActive: 5,
    ratePerYear: "~$7M/year",
    rateNumeric: 7,
  },
  {
    company: "Make Sunsets",
    totalFunding: "$1.2M",
    yearsActive: 4,
    ratePerYear: "~$0.3M/year",
    rateNumeric: 0.3,
  },
];

// ============================================================
// SILVERLINING COORDINATION TIMELINE
// ============================================================

export interface CoordinationEvent {
  year: string;
  event: string;
  actors: string[];
  significance: string;
}

export const SILVERLINING_TIMELINE: CoordinationEvent[] = [
  {
    year: "2020",
    event: "Sacca (Lowercarbon) and Cohler both fund SilverLining's $3M research initiative",
    actors: ["Chris Sacca", "Matt Cohler"],
    significance: "Step 1: Fund the research. SilverLining's donors also include Bill Trenchard, Dan Scales (Google), and foundations including Quadrature Climate Foundation and Pritzker Innovation Fund.",
  },
  {
    year: "2020-2024",
    event: "SilverLining lobbies Congress and State Department FOR geoengineering programs",
    actors: ["SilverLining", "Kelly Wanser"],
    significance: "Step 2: Lobby for government support. SilverLining receives $20.5M from leading climate foundations in May 2024.",
  },
  {
    year: "2024",
    event: "Stardust raises $15M seed from AWZ Ventures (Israeli defense-VC)",
    actors: ["AWZ Ventures", "Stardust Solutions"],
    significance: "Step 3: Invest in deployment. Defense-intelligence money seeds the company.",
  },
  {
    year: "October 2025",
    event: "Sacca leads $60M Series A in Stardust. Cohler invests personally.",
    actors: ["Chris Sacca", "Matt Cohler", "Stardust Solutions"],
    significance: "The same people who funded the research and lobbying now invest in the commercial deployment company. Research → Lobbying → Deployment → Profit.",
  },
];

// ============================================================
// FUNDING TIMELINE
// ============================================================

export const FUNDING_TIMELINE: FundingEntry[] = [
  {
    period: "2007 \u2013 2021",
    amount: "$8.5M+",
    amountNumeric: 8.5,
    events: [
      "Bill Gates funds FICER ($8.5M+ personal geoengineering fund)",
      "David Keith and Ken Caldeira manage the research",
      "Harvard Solar Geoengineering Research Program established",
    ],
    source: {
      label: "Harvard SGRP funding page",
      url: "https://geoengineering.environment.harvard.edu/funding",
    },
  },
  {
    period: "2022",
    amount: "$1.2M",
    amountNumeric: 1.2,
    events: [
      "Make Sunsets raises $1.2M seed round (Tim Draper, Boost VC)",
      "Launches sulfur dioxide balloons in Mexico \u2014 Mexico bans all geoengineering experiments",
    ],
    source: {
      label: "TIME: Mexico geoengineering ban",
      url: "https://time.com/6248654/mexico-geoengineering-ban-make-sunsets/",
    },
  },
  {
    period: "2023",
    amount: "\u2014",
    amountNumeric: 0,
    events: [
      "Stardust Solutions and Rainmaker both founded",
      "Both operate in stealth mode",
      "Nuclear weapons scientists pivot to atmospheric modification",
    ],
  },
  {
    period: "2024",
    amount: "$21.3M",
    amountNumeric: 21.3,
    events: [
      "Stardust raises $15M seed from AWZ Ventures (Israeli defense VC) + SolarEdge",
      "Rainmaker raises $6.3M seed",
      "Sacca and Cohler already co-funding SilverLining geoengineering lobbying since 2020",
    ],
    source: {
      label: "Heatmap News",
      url: "https://heatmap.news/climate-tech/stardust-geoengineering",
    },
  },
  {
    period: "2025",
    amount: "$105M+",
    amountNumeric: 105,
    events: [
      "Stardust $60M Series A \u2014 largest geoengineering investment in history",
      "Rainmaker $25M Series A (also led by Sacca/Lowercarbon)",
      "Reflect Orbital $20M round (Sequoia Capital)",
      "More invested in 2025 than the entire prior history combined",
    ],
    source: {
      label: "E&E News: Betting on climate failure",
      url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
    },
  },
];

// ============================================================
// THE PIPELINE
// ============================================================

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    step: 1,
    label: "Fund the Research",
    description:
      "Donate to university programs that produce models showing geoengineering 'could work.' Build the academic legitimacy.",
    entities: [
      "Harvard Solar Geoengineering Research Program",
      "Bill Gates / FICER ($8.5M+)",
      "Marine Cloud Brightening Project",
    ],
    saccaRole: "Donor to Harvard SGRP and Marine Cloud Brightening",
  },
  {
    step: 2,
    label: "Lobby for Policy",
    description:
      "Fund advocacy organizations that lobby Congress, the State Department, and international bodies to support geoengineering governance frameworks.",
    entities: [
      "SilverLining ($20.5M coalition)",
      "Holland & Knight (K Street lobbyists)",
    ],
    saccaRole: "Funder of SilverLining (co-funded with Cohler in 2020)",
  },
  {
    step: 3,
    label: "Invest in Deployment",
    description:
      "Lead the largest funding rounds in for-profit companies that will sell geoengineering services to governments.",
    entities: [
      "Stardust Solutions ($60M Series A)",
      "Rainmaker ($25M Series A)",
    ],
    saccaRole: "Led both Stardust ($60M) and Rainmaker ($25M) rounds",
  },
  {
    step: 4,
    label: "Collect the Contracts",
    description:
      "Once governments adopt geoengineering, deployment companies get perpetual contracts. Termination shock means they can never stop. Permanent revenue.",
    entities: [
      "Stardust targets 'more than $1B/year' from government customers",
      "Deployment planned by 2035",
    ],
    saccaRole:
      "Stands to profit from both Stardust and Rainmaker government contracts",
  },
];

// ============================================================
// 8 INVESTOR PROFILES
// ============================================================

export const PLAYERS: NetworkPlayer[] = [
  // ──────────────────────────────────────────────────────────
  // 1. BILL GATES / FICER
  // ──────────────────────────────────────────────────────────
  {
    slug: "gates-ficer",
    name: "Bill Gates / FICER",
    shortName: "Gates",
    type: "research",
    tagline:
      "$8.5M+ in personal geoengineering research funding. Managed by a former weapons lab researcher. Explicitly 'not a Gates Foundation project.'",
    keyStats: [
      "$8.5M+ since 2007",
      "Personal fund, not Foundation",
      "Harvard SGRP + Breakthrough Energy",
    ],
    summary:
      "Bill Gates has funded geoengineering research since 2007 through FICER (Fund for Innovative Climate and Energy Research), his personal geoengineering fund. FICER is explicitly 'not a Gates Foundation project' \u2014 it's personal money, harder to track. It has been managed by David Keith and Ken Caldeira (former Edward Teller Fellow at Lawrence Livermore weapons lab, now Breakthrough Energy Senior Scientist).",
    sections: [
      {
        title: "FICER",
        content: [
          "$8.5M+ since 2007 \u2014 the longest-running source of private geoengineering funding.",
          "Managed by David Keith (world's leading SRM researcher) and Ken Caldeira.",
          "Ken Caldeira: former Edward Teller Fellow at Lawrence Livermore National Laboratory (nuclear weapons lab). Now Senior Scientist at Breakthrough Energy.",
          "FICER is explicitly 'not a Gates Foundation project' \u2014 it's personal money, harder to track and less accountable.",
        ],
        sources: [
          {
            label: "Harvard SGRP funding page",
            url: "https://geoengineering.environment.harvard.edu/funding",
          },
        ],
      },
      {
        title: "Breakthrough Energy",
        content: [
          "Gates' climate investment vehicle. 28 billionaires participate.",
          "Caldeira serves as Senior Scientist.",
          "Both Sacca and Gates donate to Harvard SGRP \u2014 two sides of the same pipeline.",
        ],
      },
    ],
    operatorSlug: "bill-gates-ficer",
    sources: [
      {
        label: "Harvard SGRP funding page",
        url: "https://geoengineering.environment.harvard.edu/funding",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 2. PETER THIEL
  // ──────────────────────────────────────────────────────────
  {
    slug: "thiel",
    name: "Peter Thiel",
    shortName: "Thiel",
    type: "individual",
    tagline:
      "Epstein invested $40M in his fund. Co-founded Palantir (Israeli defense partner). 'My bias is to defer to Israel.'",
    keyStats: [
      "$11B+ net worth",
      "$40M from Epstein",
      "Palantir \u2192 Israeli defense",
    ],
    summary:
      "Peter Thiel is connected to geoengineering through the Thiel Fellowship and 1517 Fund, which funded Rainmaker's founder. He is not a direct Stardust investor, but he connects to the network through Palantir (co-founded with Lauder as early investor), Epstein ($40M in Thiel's fund), and the Israeli defense establishment.",
    sections: [
      {
        title: "Geoengineering Connection",
        content: [
          "Augustus Doricko, Rainmaker's founder, received a Thiel Fellowship ($100K grant) in 2024.",
          "1517 Fund (founded by former Thiel Fellowship team members, backed by Thiel money) invested in Rainmaker's $25M Series A.",
          "Rainmaker: cloud-seeding drone company accused of contributing to catastrophic Texas flooding (July 2025).",
          "Thiel-backed Rainmaker has lobbied to block state legislation restricting weather modification.",
        ],
        sources: [
          {
            label: "Zero Geoengineering: Thiel-backed firm blocks legislation",
            url: "https://zerogeoengineering.com/2025/thiel-backed-cloud-seeding-firm-moves-to-block-state-legislation/",
          },
        ],
      },
      {
        title: "Epstein Connections",
        content: [
          "Epstein invested $40M in Valar Ventures (co-founded by Thiel) in 2015-2016, now worth ~$170M.",
          "Thiel personally solicited and maintained a business partnership with Epstein from 2014-2019.",
          "Epstein spent years connecting Thiel with former Israeli PM/defense minister Ehud Barak, arranging at least 6 meetings.",
          "Epstein steered Thiel toward two Israeli cybersecurity startups with roots in Unit 8200.",
          "Carbyne (co-founded by Ehud Barak) became the first Israeli investment for Thiel's Founders Fund ($15M Series B, 2018) \u2014 deal arranged through Epstein.",
          "Introduced to Epstein by Reid Hoffman (LinkedIn co-founder).",
        ],
        sources: [
          {
            label: "SF Standard: Epstein-Thiel-Israeli officials",
            url: "https://sfstandard.com/2025/11/23/extended-courtship-linking-jeffrey-epstein-peter-thiel-israeli-officials/",
          },
          {
            label: "Byline Times: Epstein co-owned fund with Thiel",
            url: "https://bylinetimes.com/2026/02/04/jeffrey-epstein-and-peter-thiel-co-owned-venture-fund-as-thiels-palantir-entered-uk-government/",
          },
        ],
      },
      {
        title: "Israeli Defense Ties",
        content: [
          "Co-founded Palantir Technologies \u2014 provides AI to US, UK, and Israeli defense/intelligence.",
          "Palantir signed a strategic partnership with the Israeli Defense Ministry (January 2024) to supply war technology.",
          "When asked about ethical concerns: 'My bias is to defer to Israel.'",
          "Ronald Lauder is also an early Palantir investor \u2014 this is the strongest direct financial link between two key network nodes.",
          "Palantir's AI reportedly used in Israeli operations in Gaza, including 'kill lists.'",
        ],
        sources: [
          {
            label: "Bloomberg: Palantir-Israel partnership",
            url: "https://www.bloomberg.com/news/articles/2024-01-12/palantir-israel-agree-to-strategic-partnership-for-battle-tech",
          },
          {
            label: "Responsible Statecraft: Thiel defers to Israel",
            url: "https://responsiblestatecraft.org/peter-thiel-israel-palantir/",
          },
        ],
      },
      {
        title: "Climate Views",
        content: [
          "Called climate science a 'fake field.'",
          "Funds publications that question climate change and evolution.",
          "Supports expanded fossil fuel use.",
          "Yet backs geoengineering through the Thiel Fellowship/1517 Fund ecosystem.",
        ],
        sources: [
          {
            label: "DeSmog: Peter Thiel",
            url: "https://www.desmog.com/peter-thiel/",
          },
        ],
      },
    ],
    socialMedia: [
      {
        platform: "X",
        handle: "@peterthiel",
        url: "https://x.com/peterthiel",
      },
    ],
    sources: [
      {
        label: "Boing Boing: Palantir's Israel partnership began with Epstein",
        url: "https://boingboing.net/2026/03/10/palantirs-israel-partnership-began-with-epstein-introductions.html",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 3. CHRIS SACCA / LOWERCARBON CAPITAL
  // ──────────────────────────────────────────────────────────
  {
    slug: "sacca-lowercarbon",
    name: "Chris Sacca / Lowercarbon Capital",
    shortName: "Sacca",
    type: "fund",
    tagline:
      "Said he had 'zero financial interests' in geoengineering. Then led the largest geoengineering investment in history.",
    keyStats: [
      "$2.4B AUM",
      "$85M+ into geoengineering startups",
      "Every pipeline seat occupied",
    ],
    summary:
      "Chris Sacca's Lowercarbon Capital is the single most connected entity in geoengineering. The fund simultaneously donates to the research (Harvard SGRP), funds the lobbying (SilverLining), and leads investment in the deployment companies (Stardust $60M, Rainmaker $25M). One fund at every seat from science to profit.",
    sections: [
      {
        title: "Background",
        content: [
          "Born May 12, 1975 in Lockport, New York. Italian-Irish American. Georgetown Law grad.",
          "At Google: oversaw billions in global energy projects, led $4.7B FCC spectrum bid, managed global data center siting. Among the first to receive the Google Founders' Award.",
          "Co-founded Lowercase Capital \u2014 early investor in Twitter, Uber, Instagram, Twilio, Docker, Stripe. #2 on Forbes Midas List. Billionaire.",
          "Founded Lowercarbon Capital (2018) with wife Crystal. $2.4B AUM, 207+ portfolio companies.",
        ],
        sources: [
          {
            label: "Lowercarbon Capital: Chris Sacca",
            url: "https://lowercarbon.com/team/chris-sacca/",
          },
        ],
      },
      {
        title: "The Contradiction",
        content: [
          "Sacca publicly stated he had 'zero financial interests beyond philanthropy' in geoengineering and didn't believe in private business models for it.",
          "Then he led a $60M for-profit Series A in Stardust Solutions \u2014 the largest geoengineering investment in history.",
          "He also led Rainmaker's $25M Series A \u2014 making $85M+ in direct geoengineering startup investments.",
        ],
        sources: [
          {
            label: "Axios: Sacca on geoengineering",
            url: "https://www.axios.com/pro/climate-deals/2023/09/21/chris-sacca-lowercarbon-al-gore-geoengineering",
          },
          {
            label: "E&E News: Betting on climate failure",
            url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
          },
        ],
      },
      {
        title: "The Full Pipeline",
        content: [
          "Donor to Harvard Solar Geoengineering Research Program (the research)",
          "Funder of SilverLining \u2014 $20.5M lobbying coalition targeting Congress, State Dept, and international bodies (the lobbying)",
          "Co-funded SilverLining's $3M research initiative alongside Matt Cohler in 2020 \u2014 then both invested in Stardust's $60M round (the coordination)",
          "Led Stardust Solutions $60M Series A (the investment)",
          "Led Rainmaker $25M Series A (the investment)",
          "Funds Marine Cloud Brightening Project (applied research)",
          "This is the full loop: fund research \u2192 lobby for government support \u2192 invest in deployment companies \u2192 those companies get government contracts \u2192 Sacca profits.",
        ],
        sources: [
          {
            label: "Harvard SGRP funding page",
            url: "https://geoengineering.environment.harvard.edu/funding",
          },
          {
            label: "Inside Philanthropy: Sacca profile",
            url: "https://www.insidephilanthropy.com/find-a-grant/major-donors/chris-and-crystal-sacca",
          },
        ],
      },
      {
        title: "2017 Sexual Harassment",
        content: [
          "Named in the 2017 Silicon Valley sexual harassment wave.",
          "Susan Wu accused him of touching her face without consent at a 2009 tech event (Sacca disputes).",
          "NYT called out his behavior as sexist and inappropriate with women.",
          "Published public apology admitting he contributed to tech's sexist culture: 'I undoubtedly caused some women to question themselves, retreat, feel alone.'",
          "Initially said he was retiring from investing; later returned via Lowercarbon Capital.",
        ],
        sources: [
          {
            label: "CNN: Sacca apologizes",
            url: "https://money.cnn.com/2017/06/30/technology/culture/chris-sacca-tech-harassment/index.html",
          },
        ],
      },
    ],
    quotes: [
      {
        text: "We have no opportunity for survival on this planet unless you reflect back sunlight.",
        speaker: "Chris Sacca",
        source: {
          label: "Axios",
          url: "https://www.axios.com/pro/climate-deals/2023/09/21/chris-sacca-lowercarbon-al-gore-geoengineering",
        },
      },
      {
        text: "Bless Al Gore... but he has for years shamed anyone paying attention to that space because he's considered it a moral hazard.",
        speaker: "Chris Sacca",
        source: {
          label: "Axios",
          url: "https://www.axios.com/pro/climate-deals/2023/09/21/chris-sacca-lowercarbon-al-gore-geoengineering",
        },
      },
    ],
    socialMedia: [
      { platform: "X", handle: "@sacca", url: "https://x.com/chrissacca" },
    ],
    operatorSlug: "lowercarbon-capital",
    sources: [
      {
        label: "E&E News: Betting on climate failure",
        url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
      },
      {
        label: "Fortune: Sacca's climate fund",
        url: "https://fortune.com/2021/09/27/chris-sacca-800-million-fund-climate-change/",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 4. AWZ VENTURES
  // ──────────────────────────────────────────────────────────
  {
    slug: "awz-ventures",
    name: "AWZ Ventures",
    shortName: "AWZ",
    type: "defense-vc",
    tagline:
      "Former Mossad, CIA, MI5, FBI, Unit 8200 directors on the advisory board. Formally partnered with the Israeli Ministry of Defense.",
    keyStats: [
      "$500M+ AUM",
      "$15M seed into Stardust",
      "First fund was joint with Israeli MoD",
    ],
    summary:
      "AWZ is not a typical venture capital fund. It is a formalized bridge between Israeli military/intelligence agencies and private capital. Former heads of Mossad, CIA, MI5, CSIS, FBI, Unit 8200, Shin Bet, and the IDF are embedded in its leadership. It partners directly with MAFAT (Israeli Ministry of Defense R&D). This is the fund that seed-funded Stardust Solutions.",
    sections: [
      {
        title: "Founder: Yaron Ashkenazi",
        content: [
          "30-year business, technology, security & intelligence veteran.",
          "Former Israeli Shin Bet (ISA) officer in the personal security unit.",
          "Led security details for Israeli Prime Ministers Yitzhak Shamir, Shimon Peres, and especially Yitzhak Rabin \u2014 for nearly seven years.",
          "Founded AWZ Ventures in 2016 in Toronto, Canada.",
        ],
        sources: [
          {
            label: "AWZ Story",
            url: "https://www.awzventures.com/awz-story",
          },
          {
            label: "INSS Profile",
            url: "https://www.inss.org.il/yaron-ashkenazi/",
          },
        ],
      },
      {
        title: "Intelligence & Defense Advisory Board",
        content: [
          "Tamir Pardo \u2014 Former Director of Mossad (2011-2016), Venture Partner",
          "Haim Tomer \u2014 30+ years Mossad; Head of Intelligence, Counter-Terrorism & International Divisions",
          "Gary Barnea \u2014 Former Deputy Director of Mossad Special Operations; Former Director of ISA Protection & Security Division",
          "Ehud Schneorson \u2014 Former Commander of Unit 8200 (Israel's NSA equivalent). Also co-founded Paragon Solutions ($900M spyware company)",
          "Roni Alsheich \u2014 Former Deputy Director of Shin Bet; Former Chief Commissioner of Israeli Police",
          "James Woolsey \u2014 Former Director of the CIA (1993-1995)",
          "Stella Rimington \u2014 Former Director General of MI5 (UK)",
          "Richard Fadden \u2014 Former Director of CSIS (Canadian intelligence); Former National Security Advisor to Canadian PM",
          "Former Associate Deputy Director of the FBI (name not publicly confirmed)",
          "Aviv Kohavi \u2014 22nd Chief of General Staff of the IDF, joined December 2024",
        ],
        sources: [
          {
            label: "AWZ Team Page",
            url: "https://www.awzventures.com/our-team",
          },
          {
            label: "CBC: Harper joined ex-spymasters",
            url: "https://www.cbc.ca/news/politics/stephen-harper-fadden-israel-awz-cybersecurity-1.5989054",
          },
        ],
      },
      {
        title: "Stephen Harper (22nd Canadian PM)",
        content: [
          "Partner and President of the Advisory Committee (joined 2019).",
          "Said AWZ is a chance to 'continue what I did in government.'",
          "The Breach reported AWZ has poured $350M+ into Israeli military tech with Harper as a leading partner.",
          "Three out of five Corsight AI board members are Harper's AWZ partners \u2014 meaning the former PM's firm effectively controls Corsight. The Israeli military used Corsight's facial recognition to identify and detain a Palestinian poet.",
          "AWZ facilitated the sale of surveillance technology to the UAE.",
          "Spy tech backed by Harper's fund deployed in Greek refugee camps as part of a $55M EU-funded surveillance system.",
        ],
        sources: [
          {
            label: "The Breach: $350M military tech",
            url: "https://breachmedia.ca/stephen-harper-awz-ventures-surveillance-tech-israel/",
          },
          {
            label: "CBC: UAE surveillance sales",
            url: "https://www.cbc.ca/news/politics/harper-united-arab-emirates-surveillance-technology-1.6192281",
          },
          {
            label: "The Breach: Greek refugee camps",
            url: "https://breachmedia.ca/stephen-harper-firm-tech-greek-refugee-camps/",
          },
        ],
      },
      {
        title: "MAFAT Partnership",
        content: [
          "MAFAT is the Israeli equivalent of DARPA \u2014 the Directorate of Defense Research and Development within the Ministry of Defense.",
          "In 2021, AWZ signed a strategic partnership with MAFAT to launch AWZ X-Seed.",
          "First fund ($82.5M) was a joint fund with the Israeli Ministry of Defence.",
          "Co-led by Ashkenazi and Brig. Gen. Danny Gold \u2014 head of MAFAT and creator of the Iron Dome missile defense system.",
          "The partnership provides: deal flow from military needs, dual-use technology pipeline, access to Mossad/Shin Bet/Unit 8200, and a physical hub in Tel Aviv.",
          "This means the Israeli Defense Ministry is effectively co-creating a venture fund. MAFAT identifies military needs, AWZ funds Israeli startups, tech gets 'battle-tested' in Israeli operations, then sold globally.",
        ],
        sources: [
          {
            label: "PR Newswire: AWZ X-Seed launch",
            url: "https://www.prnewswire.com/news-releases/awz-ventures-to-invest-hundreds-of-millions-in-multi-use-tech-via-new-awz-x-seed-hub-launched-in-partnership-with-mafat-301353574.html",
          },
          {
            label: "Calcalist: $82.5M fund",
            url: "https://www.calcalistech.com/ctech/articles/0,7340,L-3914844,00.html",
          },
        ],
      },
      {
        title: "Portfolio Pattern",
        content: [
          "29+ portfolio companies \u2014 ALL Israeli.",
          "Pentera (cybersecurity, unicorn), Classiq (quantum computing), Corsight AI (facial recognition \u2014 used in Gaza), viisights (behavioral surveillance), NanoLock (IoT security), NanoPass (vaccine microneedles).",
          "Pattern: surveillance, cybersecurity, defense tech, deep tech \u2014 and now geoengineering.",
          "Planning a $1.5 billion chip factory in Ashkelon \u2014 III-V semiconductors for defense + civilian use.",
          "Stardust fits the pattern perfectly: dual-use technology, Israeli founders from classified programs, no transparency, for-profit with government customers.",
        ],
        sources: [
          {
            label: "AWZ Portfolio",
            url: "https://www.awzventures.com/our-portfolio",
          },
          {
            label: "Times of Israel: Chip plant",
            url: "https://www.timesofisrael.com/specialized-chip-plant-to-be-built-in-ashkelon-israeli-canadian-fund-announces/",
          },
        ],
      },
    ],
    redFlags: [
      "Formalized partnership with a foreign defense ministry (MAFAT)",
      "Advisory board reads like a who's-who of Western intelligence agencies",
      "Portfolio company Corsight's facial recognition used on civilians in Gaza",
      "Sold surveillance tech to UAE (authoritarian regime)",
      "MAFAT partnership never reported in Canadian media until investigative journalists broke the story",
    ],
    sources: [
      {
        label: "AWZ Ventures website",
        url: "https://www.awzventures.com/",
      },
      {
        label: "Business and Human Rights Centre: AWZ profile",
        url: "https://www.business-humanrights.org/en/companies/awz-ventures/?companies=5654768",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 5. RONALD LAUDER
  // ──────────────────────────────────────────────────────────
  {
    slug: "lauder",
    name: "Ronald Lauder / Lauder Partners",
    shortName: "Lauder",
    type: "individual",
    tagline:
      "Estee Lauder heir. President of the World Jewish Congress. Named 900+ times in DOJ-released Epstein files.",
    keyStats: [
      "$4.7B net worth",
      "900+ Epstein DOJ mentions",
      "Trump's unofficial Israel advisor",
    ],
    summary:
      "Ronald Lauder is the son of Estee Lauder, President of the World Jewish Congress, and a lifelong friend and college classmate of Donald Trump. He donated $5M to MAGA Inc., acts as Trump's unofficial advisor on Israel, and his son-in-law Kevin Warsh is the new Fed chair. Lauder Partners invested in Stardust's $60M round. He is also an early Palantir investor (connecting him to Peter Thiel).",
    sections: [
      {
        title: "Political Power",
        content: [
          "College classmate and lifelong friend of Donald Trump (both Wharton, UPenn).",
          "US Ambassador to Austria under Reagan (1986-1987). Deputy Assistant Secretary of Defense for European and NATO Policy.",
          "Donated $5M to MAGA Inc. super PAC (2025). Spent millions supporting Trump's 2016 and 2020 campaigns.",
          "Acts as unofficial White House advisor on Israel under Trump's second term.",
          "Son-in-law Kevin Warsh is the new Fed chair.",
          "Questioned by Israeli police over gifts to Netanyahu (2018).",
        ],
        sources: [
          {
            label: "Revolving Door Project: Lauder & Trump",
            url: "https://therevolvingdoorproject.org/ronald-lauder-trump-billionaires-and-the-admin/",
          },
        ],
      },
      {
        title: "Jeffrey Epstein Connections",
        content: [
          "Named 900+ times in DOJ-released Epstein files (January 2026).",
          "Kept in touch with Epstein as recently as 2017 \u2014 9 years after Epstein's first arrest.",
          "Scheduled to visit Epstein's home Feb 24, 2017.",
          "Epstein coordinated an LLC in 2014 for Lauder and Leon Black to share ownership of a $25M painting.",
          "Their assistants emailed frequently to arrange meetings and phone calls.",
          "As US Ambassador to Austria (1986-87), Lauder was serving when Epstein obtained an Austrian passport with a fake name. No official finding links Lauder to the passport, but the timing is noted in investigative commentary.",
          "Not accused of wrongdoing in connection with Epstein's crimes.",
        ],
        sources: [
          {
            label: "Daily Pennsylvanian: Lauder-Epstein",
            url: "https://www.thedp.com/article/2026/02/penn-ronald-lauder-jeffrey-epstein-relationship-wharton",
          },
          {
            label: "ArtNews: Epstein Files",
            url: "https://www.artnews.com/art-news/news/ronald-lauder-jeffrey-epstein-files-1234772151/",
          },
          {
            label: "Bloomberg: Epstein LLC for $25M artwork",
            url: "https://www.bloomberg.com/news/articles/2026-02-06/epstein-set-up-llc-for-lauder-black-to-hold-25-million-artwork",
          },
        ],
      },
      {
        title: "Mega Group Membership",
        content: [
          "Confirmed member of the Mega Group (aka 'Study Group').",
          "Founded 1991 by Les Wexner and Charles Bronfman.",
          "~20-50 of the wealthiest Jewish businessmen in America.",
          "Both past WJC president Edgar Bronfman and current president Lauder are members.",
          "Described as a pro-Israel lobby group. Employed Republican consultant Frank Luntz in 2003.",
          "Alleged contacts with Israeli intelligence (Mossad).",
        ],
        sources: [
          {
            label: "Wikipedia: Study Group",
            url: "https://en.wikipedia.org/wiki/Study_Group_(Jewish_group)",
          },
        ],
      },
      {
        title: "The Greenland Angle",
        content: [
          "Credited with planting the Greenland purchase idea in Trump's mind (2019).",
          "Invested in Greenlandic freshwater bottling company.",
          "Member of Greenland Development Partners investment group.",
          "Partners include husband of Greenland's foreign minister.",
          "Obvious conflict of interest: suggesting a president buy territory where you have commercial interests.",
        ],
        sources: [
          {
            label: "ArcticToday: Trump ally invests in Greenland",
            url: "https://www.arctictoday.com/trump-ally-who-inspired-greenland-purchase-idea-quietly-invests-in-greenlandic-companies/",
          },
          {
            label: "Daily Pennsylvanian: Lauder pushed Trump to buy Greenland",
            url: "https://www.thedp.com/article/2026/01/penn-trump-greenland-ronald-lauder-donor-financial-ties",
          },
        ],
      },
    ],
    socialMedia: [
      {
        platform: "X",
        handle: "@lauder_ronald",
        url: "https://x.com/lauder_ronald",
      },
    ],
    sources: [
      {
        label: "Wikipedia: Ronald Lauder",
        url: "https://en.wikipedia.org/wiki/Ronald_Lauder",
      },
      {
        label: "Lauder Partners: Tracxn",
        url: "https://tracxn.com/d/venture-capital/lauder-partners/__tnCJvZlJp_J0FOfXudjdHxWisK0gn62mwI0Zwt2c1fw",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 6. MATT COHLER
  // ──────────────────────────────────────────────────────────
  {
    slug: "cohler",
    name: "Matt Cohler",
    shortName: "Cohler",
    type: "individual",
    tagline:
      "One of the first 5 Facebook employees. Co-funded geoengineering lobbying with Sacca in 2020, then both invested in Stardust.",
    keyStats: [
      "~$700M-$1.1B net worth",
      "Facebook employee #5",
      "SilverLining \u2192 Stardust pipeline",
    ],
    summary:
      "Matt Cohler has been systematically investing in geoengineering for years \u2014 philanthropically through SilverLining and university programs, now commercially through Stardust. He co-funded SilverLining's $3M research initiative with Chris Sacca in 2020, then both invested in Stardust's $60M round in 2025. This is a coordinated pipeline from nonprofit research to for-profit deployment.",
    sections: [
      {
        title: "Background",
        content: [
          "One of the first 5 employees at Facebook (VP of Product Management until 2008).",
          "Early LinkedIn employee.",
          "Former General Partner at Benchmark \u2014 led investment in Instagram ($7M \u2192 $1B acquisition).",
          "Also backed Dropbox, Asana, Quora, Tinder, Zendesk, Duo Security, DeepL.",
          "Recently purchased a $30M London mansion (April 2025).",
          "Not affiliated with any political party.",
        ],
        sources: [
          {
            label: "Wikipedia: Matt Cohler",
            url: "https://en.wikipedia.org/wiki/Matt_Cohler",
          },
        ],
      },
      {
        title: "Geoengineering Involvement",
        content: [
          "Personal investor in Stardust Solutions $60M round.",
          "Runs the Cohler Charitable Fund which funds SilverLining (geoengineering lobbying).",
          "Co-funded SilverLining's $3M university research initiative alongside Lowercarbon Capital (Sacca) in 2020.",
          "Backs the University of Washington's marine cloud brightening program.",
          "One of two Facebook-derived billionaires in geoengineering (the other is Dustin Moskovitz).",
        ],
        sources: [
          {
            label: "Inside Philanthropy: Billionaires dimming the sun",
            url: "https://www.insidephilanthropy.com/home/2023-2-28-billionaire-philanthropists-want-us-to-really-consider-dimming-the-sun",
          },
          {
            label: "E&E News: Rich donors altering the sky",
            url: "https://www.eenews.net/articles/flubbed-climate-test-wont-deter-rich-donors-from-altering-the-sky/",
          },
        ],
      },
    ],
    socialMedia: [
      {
        platform: "X",
        handle: "@mattcohler",
        url: "https://x.com/mattcohler",
      },
    ],
    sources: [
      {
        label: "Inside Philanthropy: Geoengineering funders",
        url: "https://www.insidephilanthropy.com/home/2020-2-4-is-funding-for-geoengineering-at-a-tipping-point-controversial-method-may-be-gaining-support",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 7. EXOR / AGNELLI-ELKANN FAMILY
  // ──────────────────────────────────────────────────────────
  {
    slug: "exor-agnelli",
    name: "Exor / Agnelli-Elkann Family",
    shortName: "Exor",
    type: "corporate",
    tagline:
      "Italian industrial dynasty. Largest shareholder of Stellantis, Ferrari, Juventus. Invested in Stardust's $60M round.",
    keyStats: [
      "\u20ac500M+ in startups since 2018",
      "Stellantis / Ferrari / Juventus",
      "25-year investment horizon",
    ],
    summary:
      "Exor NV is the Dutch-listed holding company of the Italian Agnelli family, one of Europe's most powerful industrial dynasties. CEO John Elkann's branch has Jewish heritage through his father's side (French-Jewish, Italian-Jewish). Exor Ventures has invested over \u20ac500M in startups since 2018.",
    sections: [
      {
        title: "The Dynasty",
        content: [
          "Largest shareholder of Stellantis (Chrysler parent), Ferrari, Juventus FC.",
          "CEO: John Elkann (grandson of Gianni Agnelli).",
          "Elkann stated that with a 25-year investment view, the two most important things are 'decarbonised energy at scale and cheap; and reducing the cost of healthcare.'",
          "Launched VENTO (Italian seed fund) in 2022.",
        ],
        sources: [
          {
            label: "Wikipedia: Exor",
            url: "https://en.wikipedia.org/wiki/Exor_(company)",
          },
          {
            label: "Sifted: Elkann betting on Italian tech",
            url: "https://sifted.eu/articles/agnelli-john-elkann-exor-italy-tech-investment",
          },
        ],
      },
      {
        title: "Heritage & Connections",
        content: [
          "John Elkann's father Alain Elkann is of French-Jewish and Italian-Jewish origin.",
          "Grandfather Jean-Paul Elkann was a French Jewish industrialist and president of the Israelite Central Consistory of France.",
          "Descended from the Ovazza family (influential Jewish-Italian bankers).",
          "Brother Lapo Elkann publicly identifies as Jewish, wears Star of David tattoo, has visited Israel.",
        ],
        sources: [
          {
            label: "Jewish Business News: Elkann heritage",
            url: "https://jewishbusinessnews.com/2013/02/01/lapo-elkann-jewish-catholic-nobility/",
          },
          {
            label: "Calcalist: Fiat's Jewish heirs",
            url: "https://www.calcalistech.com/ctechnews/article/t5ji34ljd",
          },
        ],
      },
    ],
    sources: [
      {
        label: "Wikipedia: Exor",
        url: "https://en.wikipedia.org/wiki/Exor_(company)",
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 8. SOLAREDGE TECHNOLOGIES
  // ──────────────────────────────────────────────────────────
  {
    slug: "solaredge",
    name: "SolarEdge Technologies",
    shortName: "SolarEdge",
    type: "corporate",
    tagline:
      "Israeli NASDAQ company. Founded by a Sayeret Matkal commander and 4 of his former soldiers.",
    keyStats: [
      "NASDAQ: SEDG",
      "Sayeret Matkal founder",
      "Co-invested $15M seed with AWZ",
    ],
    summary:
      "SolarEdge co-invested alongside AWZ Ventures in Stardust's $15M seed round. The company was founded by Guy Sella, who commanded Sayeret Matkal (Israel's most elite military/intelligence unit) and later served as Director of Technology for the Israeli National Security Council and Secretary for the National Committee for Cyber Protection. He co-founded SolarEdge with four of his former army subordinates.",
    sections: [
      {
        title: "Founder: Guy Sella (deceased 2019)",
        content: [
          "Served in and commanded Sayeret Matkal \u2014 Israel's most elite military/intelligence unit.",
          "Awarded the Israel Defense Prize \u2014 one of Israel's highest military honors.",
          "After military: Director of Technology, Israeli National Security Council.",
          "Then: Secretary for the National Committee for Cyber Protection.",
          "Co-founded SolarEdge with four of his former army subordinates (Lior Handelsman, Yoav Galin, Meir Adest, Amir Fishelov).",
        ],
        sources: [
          {
            label: "Calcalist: SolarEdge founder profile",
            url: "https://www.calcalistech.com/ctech/articles/0,7340,L-3894732,00.html",
          },
        ],
      },
      {
        title: "Significance",
        content: [
          "The Stardust seed round ($15M) came entirely from Israeli defense/intelligence-connected sources.",
          "AWZ Ventures: Shin Bet founder, Mossad/CIA advisory, MAFAT partner, IDF Chief.",
          "SolarEdge: Sayeret Matkal, National Security Council, Cyber Protection.",
          "Both co-investors in the same seed round that launched the world's most-funded geoengineering company.",
        ],
      },
    ],
    sources: [
      {
        label: "Calcalist: SolarEdge founder",
        url: "https://www.calcalistech.com/ctech/articles/0,7340,L-3894732,00.html",
      },
    ],
  },
  // ============================================================
  // SECONDARY SERIES A INVESTORS
  // ============================================================
  {
    slug: "nebular-murphy",
    name: "Nebular (Finn Murphy)",
    shortName: "Nebular",
    type: "fund",
    tagline: "Said the quiet part out loud: Stardust 'can be worth tens of billions of dollars.'",
    keyStats: ["$30M+ Fund I", "$32.3M Fund II", "$1M+ into Stardust"],
    summary: "Irish solo GP. Generalist fund betting on AI, data centers, fossil startups, and geoengineering. Told E&E News that with global temperatures soaring and political will waning, Stardust 'can be worth tens of billions of dollars.' The explicit bet on climate failure being profitable.",
    sections: [
      {
        title: "Background",
        content: [
          "Finn Murphy founded Nebular as a solo GP fund. Fund I ($30M+) deployed across 24 positions (US and Europe). Fund II first close at $32.3M in October 2025.",
          "Studied engineering at Trinity College Dublin. Former partner at Frontline Ventures (Irish VC).",
        ],
      },
    ],
    socialMedia: [
      { platform: "LinkedIn", handle: "finn-murphy", url: "https://www.linkedin.com/in/finn-murphy-16160465/" },
    ],
    sources: [
      { label: "E&E News: Betting on climate failure", url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/" },
      { label: "Venture Capital Journal: Nebular Fund II", url: "https://www.venturecapitaljournal.com/tech-investor-nebular-holds-first-close-on-32-3m-for-fund-ii/" },
    ],
  },
  {
    slug: "future-ventures",
    name: "Future Ventures (Steve Jurvetson)",
    shortName: "Future Ventures",
    type: "fund",
    tagline: "Silicon Valley's most prominent deep-tech VC, now betting on geoengineering.",
    keyStats: ["15-year fund structure", "SpaceX, Tesla early investor"],
    summary: "Co-founded by Steve Jurvetson and Maryanna Saenko in 2018. Patient capital fund focused on deep-tech, mission-driven companies. Jurvetson is one of Silicon Valley's most prominent VCs — early investor in SpaceX, Tesla, Planet Labs.",
    sections: [
      {
        title: "Background",
        content: [
          "Jurvetson: Stanford engineering and MBA. Formerly of Draper Fisher Jurvetson (DFJ).",
          "Left DFJ in 2017 amid workplace misconduct allegations during the Silicon Valley harassment wave. Founded Future Ventures months later.",
          "Intentionally small two-partner firm with a 15-year fund structure for patient capital.",
        ],
      },
    ],
    socialMedia: [
      { platform: "X", handle: "@FutureJurvetson", url: "https://x.com/FutureJurvetson" },
    ],
    sources: [
      { label: "Future Ventures", url: "https://future.ventures/" },
      { label: "Heatmap: Stardust raises $60M", url: "https://heatmap.news/climate-tech/stardust-geoengineering" },
    ],
  },
  {
    slug: "future-positive",
    name: "Future Positive Capital",
    shortName: "Future Positive",
    type: "fund",
    tagline: "Paris-based deep-tech VC investing in SAI deployment.",
    keyStats: ["Founded 2016", "Paris, France"],
    summary: "Founded in 2016 by Michael Rosen, Alexandre Terrien, and Sofia Hmich. Paris-based VC backing companies using AI, synthetic biology, and deep technology to address climate, food, and aging challenges.",
    sections: [],
    sources: [
      { label: "Future Positive Capital", url: "https://www.futurepositivecapital.com/" },
    ],
  },
  {
    slug: "starlight-ventures",
    name: "Starlight Ventures (Matias Mosse)",
    shortName: "Starlight",
    type: "fund",
    tagline: "Deep-tech climate VC specializing in government-funded capital stacks.",
    keyStats: ["Founded 2017", "Miami, FL", "Fusion, geothermal, SAI"],
    summary: "Miami-based VC founded by Matias Mosse, an Argentine-born deep-tech investor. Focus: fusion, geothermal, advanced materials, climate tech. Expertise in structuring multi-layered capital stacks combining venture funding with government programs — exactly the model Stardust needs for its billion-dollar government contracts.",
    sections: [],
    sources: [
      { label: "Starlight Ventures", url: "https://starlight.vc/" },
    ],
  },
  {
    slug: "attestor",
    name: "Attestor Capital",
    shortName: "Attestor",
    type: "fund",
    tagline: "London hedge fund in Stardust's $60M round.",
    keyStats: ["Founded 2012", "London, UK"],
    summary: "London-based value investment firm founded in 2012. British hedge fund using long/short equity strategy. One of three British groups in Stardust's $60M round.",
    sections: [],
    sources: [
      { label: "Attestor", url: "https://www.attestor.com/" },
      { label: "E&E News: Stardust $60M", url: "https://www.eenews.net/articles/global-cooling-startup-raises-60m-to-test-sun-reflecting-technology/" },
    ],
  },
  {
    slug: "kindred-capital",
    name: "Kindred Capital",
    shortName: "Kindred",
    type: "fund",
    tagline: "London VC in Stardust's $60M round.",
    keyStats: ["Founded 2015", "London, UK"],
    summary: "London-based VC founded in 2015. Invests in B2B, infrastructure, and technology sectors. One of three British groups in Stardust's $60M Series A.",
    sections: [],
    sources: [
      { label: "Kindred Capital", url: "https://kindredcapital.vc/" },
    ],
  },
  {
    slug: "never-lift",
    name: "Never Lift Ventures",
    shortName: "Never Lift",
    type: "fund",
    tagline: "NYC VC in Stardust's $60M round.",
    keyStats: ["New York, NY", "Logistics/mobility focus"],
    summary: "New York-based VC focused on logistics, mobility, and infrastructure. General partner: Charlie March. Participated in Stardust's $60M Series A.",
    sections: [],
    sources: [
      { label: "Never Lift", url: "https://www.neverlift.vc/" },
    ],
  },
  {
    slug: "orion-global",
    name: "Orion Global Advisors",
    shortName: "Orion",
    type: "fund",
    tagline: "British advisory firm in Stardust's $60M round.",
    keyStats: ["UK-based"],
    summary: "British advisory and investment firm. Participated in Stardust's $60M Series A alongside Attestor and Kindred Capital.",
    sections: [],
    sources: [
      { label: "E&E News: Stardust $60M", url: "https://www.eenews.net/articles/global-cooling-startup-raises-60m-to-test-sun-reflecting-technology/" },
    ],
  },
  {
    slug: "earth-now",
    name: "Earth.now",
    shortName: "Earth.now",
    type: "fund",
    tagline: "Climate-focused fund in Stardust's $60M round.",
    keyStats: ["Climate focus"],
    summary: "Climate-focused investment fund. Participated in Stardust's $60M Series A.",
    sections: [],
    sources: [
      { label: "Heatmap: Stardust raises $60M", url: "https://heatmap.news/climate-tech/stardust-geoengineering" },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // OPEN PHILANTHROPY / DUSTIN MOSKOVITZ
  // ──────────────────────────────────────────────────────────
  {
    slug: "open-philanthropy",
    name: "Open Philanthropy / Dustin Moskovitz",
    shortName: "Open Phil",
    type: "research",
    tagline:
      "Facebook co-founder's foundation. $8M+ to the Degrees Initiative since 2015. Funds the 'Global Southwashing' pipeline that normalizes SAI as a viable option.",
    keyStats: [
      "$18B+ Moskovitz net worth",
      "$8M+ to Degrees Initiative",
      "SRM normalization pipeline",
    ],
    summary:
      "Open Philanthropy, founded by Dustin Moskovitz (Facebook co-founder, $18B+ net worth) and Cari Tuna, is the primary funder of the Degrees Initiative \u2014 the organization Geoengineering Monitor exposed as 'Global Southwashing.' By funding research that overwhelmingly focuses on SAI (26 of 28 papers) framed against worst-case climate scenarios, Open Philanthropy bankrolls the normalization pipeline that makes geoengineering deployment appear reasonable.",
    sections: [
      {
        title: "Who They Are",
        content: [
          "Founded by Dustin Moskovitz (Facebook co-founder #3, billionaire) and Cari Tuna.",
          "Part of the effective altruism (EA) movement \u2014 which argues for maximizing 'impact per dollar.' In practice, this philosophy makes geoengineering \u2014 with its promise of planetary-scale impact \u2014 an attractive funding target.",
          "One of the largest private foundations in the world. Billions in total grantmaking.",
        ],
        sources: [
          {
            label: "Open Philanthropy grants database",
            url: "https://www.openphilanthropy.org/grants/",
          },
        ],
      },
      {
        title: "Geoengineering Funding",
        content: [
          "$8M+ to the Degrees Initiative since 2015 \u2014 making Open Philanthropy the primary funder of the organization Geoengineering Monitor calls a 'Global Southwashing' operation.",
          "The Degrees Initiative funds 35 research teams across developing countries, but staff and decision-makers are dominated by Global North actors.",
          "93% of funded papers (26 of 28) focus exclusively on SAI \u2014 normalizing a single technology as a 'viable' option.",
          "Other funders with geoengineering deployment ties also contribute to the Degrees Initiative, creating a pipeline from 'objective research' to commercial deployment.",
        ],
        sources: [
          {
            label: "Geoengineering Monitor: Global Southwashing",
            url: "https://www.geoengineeringmonitor.org/the-degrees-initiative",
          },
        ],
      },
      {
        title: "The Normalization Strategy",
        content: [
          "Unlike Sacca (who funds research, lobbying, AND deployment), Open Philanthropy operates at the 'research legitimization' layer.",
          "By funding research that frames SAI against extreme worst-case IPCC scenarios, the results predictably show geoengineering as 'not as bad' as runaway warming.",
          "This creates the academic justification that deployment companies like Stardust then cite to argue their experiments are necessary.",
          "The pipeline: Open Phil funds Degrees \u2192 Degrees produces SAI research showing it's 'viable' \u2192 deployment companies use this to justify experiments \u2192 investors profit.",
        ],
      },
    ],
    sources: [
      {
        label: "Geoengineering Monitor: Global Southwashing investigation",
        url: "https://www.geoengineeringmonitor.org/the-degrees-initiative",
      },
      {
        label: "Open Philanthropy grants database",
        url: "https://www.openphilanthropy.org/grants/",
      },
    ],
  },
];

// ============================================================
// CROSS-CONNECTIONS
// ============================================================

export const CONNECTIONS: NetworkConnection[] = [
  {
    from: "Lauder",
    to: "Thiel",
    relationship:
      "Both early Palantir investors. Palantir now has a strategic defense partnership with the Israeli Defense Ministry.",
    type: "partner",
    source: {
      label: "Bloomberg: Palantir-Israel partnership",
      url: "https://www.bloomberg.com/news/articles/2024-01-12/palantir-israel-agree-to-strategic-partnership-for-battle-tech",
    },
  },
  {
    from: "Sacca",
    to: "Cohler",
    relationship:
      "Co-funded SilverLining geoengineering research/lobbying in 2020. Both then invested in Stardust's $60M round in 2025.",
    type: "partner",
    source: {
      label: "Inside Philanthropy",
      url: "https://www.insidephilanthropy.com/home/2023-2-28-billionaire-philanthropists-want-us-to-really-consider-dimming-the-sun",
    },
  },
  {
    from: "Lauder",
    to: "Epstein",
    relationship:
      "Named 900+ times in DOJ-released Epstein files. Ongoing contact through 2017. Epstein coordinated art LLC for Lauder and Leon Black.",
    type: "partner",
    source: {
      label: "Daily Pennsylvanian",
      url: "https://www.thedp.com/article/2026/02/penn-ronald-lauder-jeffrey-epstein-relationship-wharton",
    },
  },
  {
    from: "Thiel",
    to: "Epstein",
    relationship:
      "Epstein invested $40M in Thiel's Valar Ventures fund. Business partnership 2014-2019. Epstein connected Thiel to Israeli PM Barak.",
    type: "partner",
    source: {
      label: "SF Standard",
      url: "https://sfstandard.com/2025/11/23/extended-courtship-linking-jeffrey-epstein-peter-thiel-israeli-officials/",
    },
  },
  {
    from: "AWZ",
    to: "MAFAT",
    relationship:
      "Formal strategic partnership. First fund ($82.5M) was a joint fund with the Israeli Ministry of Defence. Co-led by AWZ founder and Iron Dome creator.",
    type: "partner",
    source: {
      label: "Calcalist: $82.5M fund",
      url: "https://www.calcalistech.com/ctech/articles/0,7340,L-3914844,00.html",
    },
  },
  {
    from: "Lauder",
    to: "Trump",
    relationship:
      "College classmates (Wharton). Lifelong friends. $5M MAGA Inc. donor. Unofficial White House advisor on Israel. Son-in-law is Fed chair.",
    type: "advisor",
    source: {
      label: "Revolving Door Project",
      url: "https://therevolvingdoorproject.org/ronald-lauder-trump-billionaires-and-the-admin/",
    },
  },
  {
    from: "Thiel",
    to: "Trump",
    relationship:
      "Major backer. Backed JD Vance. Palantir has massive government contracts. Deep political influence.",
    type: "advisor",
    source: {
      label: "Middle East Eye",
      url: "https://www.middleeasteye.net/news/us-jd-vance-peter-thiel-founded-company-helps-israel-kill-lists-palestinians-gaza",
    },
  },
  {
    from: "Sacca",
    to: "Stardust",
    relationship:
      "Led $60M Series A \u2014 largest geoengineering investment in history.",
    type: "investor",
    source: {
      label: "Heatmap News",
      url: "https://heatmap.news/climate-tech/stardust-geoengineering",
    },
  },
  {
    from: "Sacca",
    to: "Rainmaker",
    relationship: "Led $25M Series A. Also connected via Thiel Fellowship.",
    type: "investor",
    source: {
      label: "LA Business Journal",
      url: "https://labusinessjournal.com/technology/rainmaker-raises-a-25-million-series-a-round/",
    },
  },
  {
    from: "AWZ",
    to: "Stardust",
    relationship:
      "Seed investor ($15M). Despite AWZ's documented Israeli defense/intelligence partnerships, Stardust claims 'no connection to Israeli defense establishment.'",
    type: "investor",
    source: {
      label: "AWZ Ventures",
      url: "https://www.awzventures.com/about",
    },
  },
  {
    from: "SolarEdge",
    to: "Stardust",
    relationship:
      "Co-invested seed round ($15M) alongside AWZ. Founded by Sayeret Matkal commander.",
    type: "investor",
    source: {
      label: "Heatmap News",
      url: "https://heatmap.news/climate-tech/stardust-geoengineering",
    },
  },
  {
    from: "Thiel",
    to: "Rainmaker",
    relationship:
      "Thiel Fellowship funded CEO Augustus Doricko. 1517 Fund invested in $25M Series A. Rainmaker lobbied to block state geoengineering bans.",
    type: "founder",
    source: {
      label: "Zero Geoengineering",
      url: "https://zerogeoengineering.com/2025/thiel-backed-cloud-seeding-firm-moves-to-block-state-legislation/",
    },
  },
  {
    from: "Sacca",
    to: "Gates",
    relationship:
      "Both donate to Harvard SGRP. Gates funds research through FICER; Sacca funds research AND invests in deployment companies. Two sides of the same pipeline.",
    type: "donor",
    source: {
      label: "Harvard SGRP funding page",
      url: "https://geoengineering.environment.harvard.edu/funding",
    },
  },
  {
    from: "Lauder",
    to: "Mega Group",
    relationship:
      "Confirmed member. Founded by Les Wexner and Charles Bronfman. ~20-50 wealthiest Jewish businessmen. Alleged Mossad contacts.",
    type: "partner",
    source: {
      label: "Wikipedia: Study Group",
      url: "https://en.wikipedia.org/wiki/Study_Group_(Jewish_group)",
    },
  },
  {
    from: "Open Phil",
    to: "Degrees Initiative",
    relationship:
      "Primary funder ($8M+ since 2015). Funds the 'Global Southwashing' operation that normalizes SAI through developing-country research programs dominated by Global North actors.",
    type: "donor",
    source: {
      label: "Geoengineering Monitor: Global Southwashing",
      url: "https://www.geoengineeringmonitor.org/the-degrees-initiative",
    },
  },
  {
    from: "Open Phil",
    to: "Gates",
    relationship:
      "Both fund geoengineering research through different channels. Gates funds FICER (direct research). Open Phil funds Degrees Initiative (normalization through Global South framing). Complementary strategies in the same pipeline.",
    type: "partner",
    source: {
      label: "Open Philanthropy grants database",
      url: "https://www.openphilanthropy.org/grants/",
    },
  },
  {
    from: "Stardust founders",
    to: "Israeli nuclear establishment",
    relationship:
      "CEO Yedvab: Head of Physics at Dimona, Deputy Chief Research Scientist at IAEC. CPO Spector: researcher at Dimona. Lead Scientist Waxman: Chief Scientist of IAEC. Two overlapped at IAEC 2013-2015.",
    type: "founder",
    source: {
      label: "Bulletin of Atomic Scientists",
      url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
    },
  },
];

// ============================================================
// AGGREGATED RED FLAGS
// ============================================================

export const RED_FLAGS: AggregatedRedFlag[] = [
  {
    flag: "Secret particle composition",
    detail:
      "Stardust will not disclose what they plan to spray into the stratosphere. Patent pending. No external scientist can evaluate their safety claims because zero data has been published.",
    category: "secrecy",
    source: {
      label: "MIT Technology Review",
      url: "https://www.technologyreview.com/2025/12/10/1129079/how-one-controversial-startup-hopes-to-cool-the-planet/",
    },
  },
  {
    flag: "Zero published research",
    detail:
      "No peer-reviewed papers from any of the three founders on geoengineering, atmospheric science, or aerosols. Lead scientist has 170 astrophysics papers and 23K citations \u2014 but zero atmospheric science publications.",
    category: "secrecy",
    source: {
      label: "Bulletin of Atomic Scientists",
      url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
    },
  },
  {
    flag: "Defense/intelligence seed money",
    detail:
      "The entire $15M seed round came from Israeli defense/intelligence-connected sources: AWZ Ventures (Mossad, Unit 8200, MAFAT) and SolarEdge (Sayeret Matkal, National Security Council).",
    category: "defense",
    source: {
      label: "AWZ Ventures team page",
      url: "https://www.awzventures.com/our-team",
    },
  },
  {
    flag: "Sacca's public contradiction",
    detail:
      "Chris Sacca publicly stated he had 'zero financial interests' in geoengineering and didn't believe in private business models for it. Then he led a $60M for-profit round in Stardust Solutions.",
    category: "conflicts",
    source: {
      label: "Axios: Sacca on geoengineering",
      url: "https://www.axios.com/pro/climate-deals/2023/09/21/chris-sacca-lowercarbon-al-gore-geoengineering",
    },
  },
  {
    flag: "One fund at every pipeline seat",
    detail:
      "Lowercarbon Capital simultaneously funds the research (Harvard SGRP), the lobbying (SilverLining), and the deployment companies (Stardust, Rainmaker). This is a coordinated pipeline from science to profit.",
    category: "conflicts",
    source: {
      label: "E&E News: Betting on climate failure",
      url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
    },
  },
  {
    flag: "Epstein connections in the investor network",
    detail:
      "Ronald Lauder: 900+ mentions in DOJ Epstein files, ongoing contact through 2017. Peter Thiel: Epstein invested $40M in his fund, business partnership 2014-2019. Epstein brokered Thiel's connections to Israeli defense/intelligence.",
    category: "conflicts",
    source: {
      label: "Daily Pennsylvanian / SF Standard",
      url: "https://www.thedp.com/article/2026/02/penn-ronald-lauder-jeffrey-epstein-relationship-wharton",
    },
  },
  {
    flag: "Secret lobbying of Congress",
    detail:
      "Stardust hired Holland & Knight (K Street lobby firm) in Q1 2025. Failed to disclose the relationship for months as required by federal law. Blamed a 'clerical error.'",
    category: "governance",
    source: {
      label: "E&E News / Politico",
      url: "https://www.eenews.net/articles/geoengineering-startup-hires-powerhouse-lobby-shop/",
    },
  },
  {
    flag: "Ignored every governance recommendation",
    detail:
      "Hired Janos Pasztor (former UN Asst. Secretary-General) as governance consultant. He recommended transparency, public engagement, and a code of conduct. Stardust ignored every key recommendation. Cornell's MacMartin: 'They've ignored every recommendation from everyone.'",
    category: "governance",
    source: {
      label: "Undark investigation",
      url: "https://undark.org/2025/03/17/stardust-geoengineering-profitable/",
    },
  },
  {
    flag: "Termination shock lock-in",
    detail:
      "Once stratospheric aerosol deployment starts, it cannot be stopped without catastrophic warming. Any government customer is locked into perpetual contracts. Permanent revenue for whoever holds the patent.",
    category: "conflicts",
    source: {
      label: "Parker & Irvine, 2018 \u2014 Earth's Future",
      url: "https://agupubs.onlinelibrary.wiley.com/doi/10.1002/2017EF000735",
    },
  },
  {
    flag: "Nuclear weapons scientists founding a 'climate' startup",
    detail:
      "CEO: 30 years at Dimona (Israel's nuclear weapons facility), Deputy Chief Research Scientist at IAEC. CPO: researcher at Dimona, then 'nearly a decade of unspecified government R&D.' Lead Scientist: former Chief Scientist of the IAEC.",
    category: "defense",
    source: {
      label: "Bulletin of Atomic Scientists",
      url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
    },
  },
  {
    flag: "Direct access to the Trump administration",
    detail:
      "Both Lauder and Thiel are major Trump donors with direct White House access. Lauder is an unofficial Israel advisor; his son-in-law is the Fed chair. Thiel backed JD Vance. Geoengineering regulation is a government decision.",
    category: "conflicts",
    source: {
      label: "Revolving Door Project",
      url: "https://therevolvingdoorproject.org/ronald-lauder-trump-billionaires-and-the-admin/",
    },
  },
  {
    flag: "Growing legal exposure ignored",
    detail:
      "3 US states have banned geoengineering (Florida made it a felony \u2014 5 years, $100K). 34 states have proposed bans. 600+ scientists signed a Non-Use Agreement. CIEL calls Stardust's plans 'reckless.' Yet the company presses forward with April 2026 experiments.",
    category: "legal",
    source: {
      label: "SRM360 US bans tracker",
      url: "https://srm360.org/us-bans/",
    },
  },
];

// ============================================================
// SOURCE COLLECTION (for "Verify It Yourself" section)
// ============================================================

export const SOURCE_CATEGORIES: {
  title: string;
  sources: NetworkSource[];
}[] = [
  {
    title: "News Investigations",
    sources: [
      {
        label:
          "Bulletin of Atomic Scientists: Former Israel AEC official leads geoengineering startup",
        url: "https://thebulletin.org/2025/03/reach-for-the-stardust-former-israel-atomic-energy-commission-official-leads-controversial-geoengineering-start-up/",
      },
      {
        label: "MIT Technology Review: How one controversial startup hopes to cool the planet",
        url: "https://www.technologyreview.com/2025/12/10/1129079/how-one-controversial-startup-hopes-to-cool-the-planet/",
      },
      {
        label: "Heatmap News: Stardust raises $60M",
        url: "https://heatmap.news/climate-tech/stardust-geoengineering",
      },
      {
        label: "E&E News: Betting on climate failure, investors could earn billions",
        url: "https://www.eenews.net/articles/betting-on-climate-failure-these-investors-could-earn-billions/",
      },
      {
        label: "Undark: How one company wants to make geoengineering profitable",
        url: "https://undark.org/2025/03/17/stardust-geoengineering-profitable/",
      },
      {
        label: "Washington Post: These companies want to block the sun",
        url: "https://www.washingtonpost.com/climate-solutions/2025/12/03/stardust-make-sunsets-geoengineering-startups/",
      },
      {
        label: "E&E News: Geoengineering startup secretly lobbying Congress",
        url: "https://www.eenews.net/articles/geoengineering-startup-hires-powerhouse-lobby-shop/",
      },
      {
        label: "The Breach: Harper's firm pours $350M into Israeli military tech",
        url: "https://breachmedia.ca/stephen-harper-awz-ventures-surveillance-tech-israel/",
      },
      {
        label: "CBC: Harper joined ex-spymasters in security tech company",
        url: "https://www.cbc.ca/news/politics/stephen-harper-fadden-israel-awz-cybersecurity-1.5989054",
      },
    ],
  },
  {
    title: "Governance & Legal",
    sources: [
      {
        label: "CIEL: US-Israeli start-up plans reckless outdoor experiments",
        url: "https://www.ciel.org/news/us-israeli-start-up-announces-reckless-solar-geoengineering-experiments-from-april-2026/",
      },
      {
        label: "CIEL: Reckless geoengineering gamble",
        url: "https://www.ciel.org/news/us-israeli-start-up-unveils-reckless-geoengineering-gamble/",
      },
      {
        label: "SRM360: Governance recommendations for Stardust",
        url: "https://srm360.org/perspective/governance-recommendations-for-stardust/",
      },
      {
        label: "Solar Geoengineering Non-Use Agreement (600+ scientists)",
        url: "https://www.solargeoeng.org/non-use-agreement/open-letter/",
      },
      {
        label: "GAO Report: NOAA oversight failures",
        url: "https://www.gao.gov/products/gao-26-108013",
      },
    ],
  },
  {
    title: "Company & VC Websites",
    sources: [
      {
        label: "AWZ Ventures \u2014 Team page (intelligence advisory board)",
        url: "https://www.awzventures.com/our-team",
      },
      {
        label: "AWZ Ventures \u2014 About page (MAFAT partnership)",
        url: "https://www.awzventures.com/about",
      },
      {
        label: "Lowercarbon Capital \u2014 Chris Sacca profile",
        url: "https://lowercarbon.com/team/chris-sacca/",
      },
      {
        label: "Stardust Solutions \u2014 Guiding Principles",
        url: "https://www.stardustsolutions.com/guiding-principles",
      },
      {
        label: "Holland & Knight lobbying profile \u2014 OpenSecrets",
        url: "https://www.opensecrets.org/federal-lobbying/firms/summary?cycle=2025&id=D000000330",
      },
    ],
  },
  {
    title: "Epstein Documentation",
    sources: [
      {
        label: "Daily Pennsylvanian: Lauder-Epstein relationship (900+ mentions)",
        url: "https://www.thedp.com/article/2026/02/penn-ronald-lauder-jeffrey-epstein-relationship-wharton",
      },
      {
        label: "Bloomberg: Epstein LLC for Lauder-Black $25M artwork",
        url: "https://www.bloomberg.com/news/articles/2026-02-06/epstein-set-up-llc-for-lauder-black-to-hold-25-million-artwork",
      },
      {
        label: "SF Standard: Epstein-Thiel-Israeli officials courtship",
        url: "https://sfstandard.com/2025/11/23/extended-courtship-linking-jeffrey-epstein-peter-thiel-israeli-officials/",
      },
      {
        label: "Byline Times: Epstein co-owned venture fund with Thiel",
        url: "https://bylinetimes.com/2026/02/04/jeffrey-epstein-and-peter-thiel-co-owned-venture-fund-as-thiels-palantir-entered-uk-government/",
      },
    ],
  },
  {
    title: "Carbon Markets & Ocean Geoengineering",
    sources: [
      {
        label: "Geoengineering Monitor: BECCS carbon credits hit record levels",
        url: "https://www.geoengineeringmonitor.org/geo-map-beccs-nov24",
      },
      {
        label: "Geoengineering Monitor: Carbon markets driving geoengineering",
        url: "https://www.geoengineeringmonitor.org/geoengineering-map-update-carbon-markets-are-a-major-driver-for-geoengineering",
      },
      {
        label: "Geoengineering Monitor: Marine geoengineering explosion",
        url: "https://www.geoengineeringmonitor.org/venture-capital-and-carbon-credits-fuel-an-explosion-of-marine-geoengineering-projects",
      },
      {
        label: "Geoengineering Monitor: Global Southwashing (Degrees Initiative)",
        url: "https://www.geoengineeringmonitor.org/the-degrees-initiative",
      },
      {
        label: "CIEL: UK ARIA funds controversial geoengineering experiments",
        url: "https://www.ciel.org/news/uk-agency-to-fund-controversial-solar-geoengineering-experiments-despite-risks/",
      },
    ],
  },
  {
    title: "Israeli Defense & Intelligence",
    sources: [
      {
        label: "Bloomberg: Palantir signs strategic partnership with Israeli Defense Ministry",
        url: "https://www.bloomberg.com/news/articles/2024-01-12/palantir-israel-agree-to-strategic-partnership-for-battle-tech",
      },
      {
        label: "Responsible Statecraft: Peter Thiel \u2014 'I defer to Israel'",
        url: "https://responsiblestatecraft.org/peter-thiel-israel-palantir/",
      },
      {
        label: "Calcalist: AWZ raises $82.5M joint fund with Israeli MoD",
        url: "https://www.calcalistech.com/ctech/articles/0,7340,L-3914844,00.html",
      },
      {
        label: "Jerusalem Post: Former IDF Chief Aviv Kohavi joins AWZ",
        url: "https://www.jpost.com/business-and-innovation/article-831703",
      },
    ],
  },
];

// ============================================================
// HELPERS
// ============================================================

export function getPlayerBySlug(slug: string): NetworkPlayer | undefined {
  return PLAYERS.find((p) => p.slug === slug);
}

export function getConnectionsForPlayer(
  shortName: string
): NetworkConnection[] {
  return CONNECTIONS.filter(
    (c) => c.from === shortName || c.to === shortName
  );
}
