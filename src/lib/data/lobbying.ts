// Lobby Tracker — Geoengineering Lobbying & Influence Data
// Every claim sourced with primary documents.
// Last updated: March 2026

// ============================================================
// INTERFACES
// ============================================================

export interface LobbySource {
  label: string;
  url: string;
}

export interface LobbyFiling {
  period: string;
  amount: string;
  amountNumeric: number;
  issues: string[];
  specificIssues?: string;
  filingUrl?: string;
}

export interface LobbyingFirm {
  slug: string;
  name: string;
  client: string;
  clientSlug?: string;
  totalSpending: string;
  totalSpendingNumeric: number;
  period: string;
  issues: string[];
  lobbyists: string[];
  targetAgencies: string[];
  filings: LobbyFiling[];
  details: string[];
  redFlags?: string[];
  sources: LobbySource[];
}

export interface CampaignContribution {
  donor: string;
  donorRole: string;
  donorConnection: string;
  recipient: string;
  recipientParty: "R" | "D" | "I";
  recipientState: string;
  recipientOffice: string;
  amount: string;
  amountNumeric: number;
  date: string;
  electionCycle: string;
  source: LobbySource;
}

export interface LobbyTarget {
  name: string;
  party: "R" | "D" | "I";
  state: string;
  office: string;
  totalReceived: string;
  totalReceivedNumeric: number;
  context: string;
  votingRecord?: string[];
  sources: LobbySource[];
}

export interface StateLobbyingSummary {
  state: string;
  stateName: string;
  banStatus: "enacted" | "pending" | "failed" | "none";
  banBill?: string;
  lobbyingActivity: "high" | "medium" | "low" | "none";
  highlights: string[];
  antiBanActivities: AntiBanActivity[];
  sources: LobbySource[];
}

export interface AntiBanActivity {
  company: string;
  companySlug?: string;
  targetBill: string;
  targetState: string;
  activity: string;
  lobbyistOrFirm: string;
  date: string;
  outcome?: string;
  source: LobbySource;
}

export interface LobbyRedFlag {
  flag: string;
  detail: string;
  category: "disclosure" | "conflicts" | "revolving-door" | "coordination";
  source: LobbySource;
}

export interface LobbyTimelineEvent {
  date: string;
  event: string;
  type: "lobbying" | "legislation" | "funding" | "testimony";
  source?: LobbySource;
}

// ============================================================
// TOP-LEVEL STATS
// ============================================================

export const LOBBY_STATS = {
  totalLobbyingSpend: "$870K+",
  totalLobbyingSpendNote:
    "Combined federal lobbying by Rainmaker ($450K) and SilverLining ($420K) in 2024–2025. Stardust/Holland & Knight spending undisclosed.",
  kStreetFirms: "5+",
  kStreetFirmsNote:
    "Lobbying firms hired: Holland & Knight, LSN Partners, Capitol Pillar, Crossroads Strategies, plus SilverLining's in-house operation.",
  statesWithActivity: "25+",
  statesWithActivityNote:
    "States where geoengineering ban bills have been introduced, many facing industry opposition.",
  fedBills: "2",
  fedBillsNote:
    "The Clear Skies Act (H.R. 4403) would criminalize weather modification. The Weather Act Reauthorization (H.R. 3816) enhances NOAA monitoring.",
};

// ============================================================
// LOBBYING FIRMS
// ============================================================

export const LOBBYING_FIRMS: LobbyingFirm[] = [
  {
    slug: "lsn-partners-rainmaker",
    name: "LSN Partners",
    client: "Rainmaker Technology Corporation",
    clientSlug: "rainmaker",
    totalSpending: "Part of $450K total",
    totalSpendingNumeric: 0,
    period: "Mid-2024 — present",
    issues: [
      "Drone waivers and certification",
      "Drought control",
      "Weather modification regulation",
    ],
    lobbyists: [],
    targetAgencies: ["Congress", "Federal Aviation Administration"],
    filings: [],
    details: [
      "One of the first firms hired by Rainmaker when it began federal lobbying in mid-2024.",
      "Lobbied Congress and the FAA on drone waivers, certification for Rainmaker's Elijah quadrotor drones, and drought control policy.",
    ],
    sources: [
      {
        label: "E&E News — Rainmaker lobbying Congress",
        url: "https://www.eenews.net/articles/a-startup-blamed-for-deadly-floods-is-pitching-cloud-seeding-to-lawmakers/",
      },
    ],
  },
  {
    slug: "capitol-pillar-rainmaker",
    name: "Capitol Pillar LLC",
    client: "Rainmaker Technology Corporation",
    clientSlug: "rainmaker",
    totalSpending: "Part of $450K total",
    totalSpendingNumeric: 0,
    period: "Mid-2024 — present",
    issues: [
      "Water resilience solutions",
      "Weather modification policy",
    ],
    lobbyists: ["Casey Hammond"],
    targetAgencies: [
      "Congress",
      "Department of the Interior",
    ],
    filings: [],
    details: [
      "Led by Casey Hammond, who served as acting Assistant Secretary of the Interior for Land and Minerals Management in the first Trump administration.",
      "Met with lawmakers and Interior Department officials on \"water resilience solutions and education.\"",
      "Classic revolving-door hire: former Interior official now lobbying Interior on behalf of a weather modification company.",
    ],
    redFlags: [
      "Casey Hammond moved directly from regulating land and mineral resources at Interior to lobbying the same agency for a weather modification company.",
    ],
    sources: [
      {
        label: "E&E News — Rainmaker lobbying Congress",
        url: "https://www.eenews.net/articles/a-startup-blamed-for-deadly-floods-is-pitching-cloud-seeding-to-lawmakers/",
      },
      {
        label: "LegiStorm — Casey Hammond biography",
        url: "https://www.legistorm.com/person/bio/19366/Casey_Hammond.html",
      },
    ],
  },
  {
    slug: "crossroads-rainmaker",
    name: "Crossroads Strategies",
    client: "Rainmaker Technology Corporation",
    clientSlug: "rainmaker",
    totalSpending: "Part of $450K total",
    totalSpendingNumeric: 0,
    period: "2025 — present",
    issues: [
      "Water resilience briefings",
      "Weather modification policy",
      "Natural resources",
    ],
    lobbyists: ["Salim A. Alameddin", "Mathew P. Lapinski"],
    targetAgencies: [
      "White House",
      "Pentagon",
      "Department of Commerce",
      "Department of State",
    ],
    filings: [],
    details: [
      "Hired in 2025 to provide \"water resilience\" briefings to the White House, Pentagon, and Departments of Commerce and State.",
      "Salim A. Alameddin is a former staffer for Rep. Will Hurd (R-TX) and Sen. John Cornyn (R-TX).",
      "Registered under the \"Natural Resources\" lobbying category.",
      "Rainmaker's lobbying escalation — bringing in a firm with White House and Pentagon access — signals the company is moving beyond Congress to the executive branch.",
    ],
    sources: [
      {
        label:
          "Legislative Insight — Rainmaker hires Crossroads Strategies",
        url: "https://legis1.com/news/rainmaker-technology-lobbying-weather-modification/",
      },
      {
        label: "E&E News — Rainmaker lobbying Congress",
        url: "https://www.eenews.net/articles/a-startup-blamed-for-deadly-floods-is-pitching-cloud-seeding-to-lawmakers/",
      },
    ],
  },
  {
    slug: "holland-knight-stardust",
    name: "Holland & Knight LLP",
    client: "Stardust Solutions",
    clientSlug: "stardust-solutions",
    totalSpending: "Undisclosed",
    totalSpendingNumeric: 0,
    period: "Q1 2025 — present",
    issues: [
      "Solar geoengineering policy",
      "Government oversight of atmospheric research",
    ],
    lobbyists: [],
    targetAgencies: ["Congress"],
    filings: [],
    details: [
      "Holland & Knight is one of the largest law and lobbying firms in the U.S. — a K Street powerhouse.",
      "Hired by Stardust Solutions in Q1 2025 but \"inadvertently\" failed to disclose the relationship as required by the Lobbying Disclosure Act.",
      "Holland & Knight spokesperson Olivia Hoch attributed the failure to a \"clerical error.\"",
      "Declined to say how much Stardust paid or the specific issues lobbied on.",
      "Stardust CEO Yanai Yedvab claimed the firm is \"informing members of Congress about its work and the need for appropriate oversight.\"",
      "Holland & Knight PAC raised $867,845 in the 2023–2024 election cycle and made $2.2M in total organizational contributions.",
    ],
    redFlags: [
      "Months of secret, undisclosed lobbying — a violation of the Lobbying Disclosure Act.",
      "A $75M geoengineering startup hiring one of K Street's biggest firms while claiming they're just \"informing\" Congress.",
    ],
    sources: [
      {
        label:
          "E&E News / POLITICO — Geoengineering startup secretly lobbying Congress",
        url: "https://www.eenews.net/articles/geoengineering-startup-hires-powerhouse-lobby-shop/",
      },
      {
        label: "OpenSecrets — Holland & Knight PAC profile",
        url: "https://www.opensecrets.org/political-action-committees-pacs/holland-knight/C00171330/summary/2024",
      },
    ],
  },
  {
    slug: "silverlining-inhouse",
    name: "SilverLining (in-house)",
    client: "SilverLining",
    totalSpending: "$420,000",
    totalSpendingNumeric: 420000,
    period: "2018 — present",
    issues: [
      "Solar radiation management research",
      "NOAA Earth's Radiation Budget program",
      "Stratospheric aerosol injection research funding",
      "Marine cloud brightening",
    ],
    lobbyists: ["Kelly Wanser"],
    targetAgencies: ["Congress", "NOAA", "White House OSTP"],
    filings: [
      {
        period: "2024 cycle",
        amount: "$420,000",
        amountNumeric: 420000,
        issues: [
          "Solar geoengineering research funding",
          "NOAA program support",
        ],
        specificIssues:
          "Lobbied for dedicated federal research programs into sunlight reflection and stratospheric aerosol injection.",
      },
    ],
    details: [
      "SilverLining spent $420,000 on lobbying in the 2024 cycle — nearly double the World Resources Institute ($220K) and more than the Wildlife Conservation Society in the same period.",
      "Founded in 2018 by Kelly Wanser, a former tech executive who led data networking startup Luminus Networks.",
      "Only the second organization in a decade to disclose lobbying on solar geoengineering (after Carnegie Mellon University in 2013).",
      "Successfully lobbied Congress to direct NOAA to develop the Earth's Radiation Budget program, which grew from $4M (FY2020) to $9.5M (FY2023).",
      "Helped persuade Congress to include SRM research directives in the FY2020 appropriations bill.",
      "Its advocacy contributed to the White House OSTP's June 2023 \"Congressionally-Mandated Report on Solar Radiation Modification.\"",
      "Funded by Lowercarbon Capital (Chris Sacca), Rachel Pritzker / Pritzker Innovation Fund, and Quadrature Climate Foundation.",
    ],
    redFlags: [
      "Spent more on lobbying than major established environmental organizations.",
      "The same investors who fund SilverLining's lobbying also fund the deployment companies that would profit from the research programs SilverLining lobbies for.",
    ],
    sources: [
      {
        label:
          "CleanTechnica — SilverLining's Geoengineering Techno-Optimism",
        url: "https://cleantechnica.com/2025/05/18/silverlinings-geoengineering-techno-optimism-is-distracting-from-real-climate-solutions/",
      },
      {
        label:
          "E&E News — Blocking sun rays finds support in the Senate",
        url: "https://www.eenews.net/articles/blocking-sun-rays-finds-support-in-the-senate/",
      },
      {
        label:
          "Grist — The climate policy milestone buried in the 2020 budget",
        url: "https://grist.org/climate/the-climate-policy-milestone-that-was-buried-in-the-2020-budget/",
      },
      {
        label:
          "White House OSTP — Solar Radiation Modification report (June 2023)",
        url: "https://bidenwhitehouse.archives.gov/ostp/news-updates/2023/06/30/congressionally-mandated-report-on-solar-radiation-modification/",
      },
    ],
  },
];

// ============================================================
// RAINMAKER LOBBYING SUMMARY
// ============================================================

export const RAINMAKER_LOBBYING = {
  totalSpending2024: "~$130K",
  totalSpending2024Numeric: 130000,
  totalSpending2025: "$450K",
  totalSpending2025Numeric: 450000,
  totalSpendingAll: "$580K+",
  multiplier: "3x increase from 2024 to 2025",
  firmCount: 3,
  firms: ["LSN Partners", "Capitol Pillar LLC", "Crossroads Strategies"],
  topPriority:
    "Defeating the Clear Skies Act (H.R. 4403), which would criminalize weather modification.",
  sources: [
    {
      label: "E&E News — Rainmaker lobbying Congress",
      url: "https://www.eenews.net/articles/a-startup-blamed-for-deadly-floods-is-pitching-cloud-seeding-to-lawmakers/",
    },
    {
      label: "OpenSecrets — Rainmaker Technology lobbying profile",
      url: "https://www.opensecrets.org/federal-lobbying/clients/summary?cycle=2025&id=D000116498",
    },
  ],
};

// ============================================================
// ANTI-BAN ACTIVITIES
// ============================================================

export const ANTI_BAN_ACTIVITIES: AntiBanActivity[] = [
  {
    company: "Rainmaker Technology",
    companySlug: "rainmaker",
    targetBill: "SB 56 (Geoengineering and Weather Modification Activities Act)",
    targetState: "FL",
    activity:
      "CEO Augustus Doricko personally testified against the bill in committee, arguing that banning weather modification in Florida would \"set a precedent to deprive farmers in even more arid regions of the country from getting access to water from cloud seeding.\" Suggested regulation instead of a ban.",
    lobbyistOrFirm: "Augustus Doricko (CEO, age 24)",
    date: "March 2025",
    outcome:
      "Bill passed anyway — Senate 28-9, House 82-28. Signed by Gov. DeSantis. Took effect July 1, 2025 as a felony.",
    source: {
      label: "WLRN — Weather modification ban moves forward",
      url: "https://www.wlrn.org/government-politics/2025-03-24/weather-modification-ban-bill",
    },
  },
  {
    company: "Rainmaker Technology",
    companySlug: "rainmaker",
    targetBill: "Clear Skies Act (H.R. 4403)",
    targetState: "Federal",
    activity:
      "Hired three lobbying firms and spent $450K in 2025 with a top priority of \"chipping away at support\" for the Clear Skies Act, which would criminalize releasing chemicals into the atmosphere to change weather. Briefed the White House, Pentagon, and Departments of Commerce and State.",
    lobbyistOrFirm:
      "LSN Partners, Capitol Pillar (Casey Hammond), Crossroads Strategies",
    date: "2024–2025",
    outcome: "Bill still pending. Introduced by Rep. Marjorie Taylor Greene (R-GA), co-sponsored by Reps. Tony Wied (R-WI) and Tom Massie (R-KY).",
    source: {
      label: "E&E News — Rainmaker lobbying Congress",
      url: "https://www.eenews.net/articles/a-startup-blamed-for-deadly-floods-is-pitching-cloud-seeding-to-lawmakers/",
    },
  },
  {
    company: "Salt River Project",
    targetBill: "Geoengineering ban bill",
    targetState: "AZ",
    activity:
      "A lobbyist for Salt River Project testified against Arizona's ban bill, stating: \"We see great potential in cloud seeding as a viable way to generate more precipitation from clouds in the form of rain and snow.\"",
    lobbyistOrFirm: "Salt River Project lobbyist",
    date: "2025",
    source: {
      label:
        "Duane Morris — State-Level Geoengineering Bans",
      url: "https://statecapitallobbyist.com/environment/state-level-geoengineering-bans-florida-montana-and-beyond/",
    },
  },
  {
    company: "Wyoming Mining Association / Trona producers",
    targetBill: "Cloud seeding ban proposal",
    targetState: "WY",
    activity:
      "The Wyoming Mining Association and trona producers defended the state's cloud seeding program, testifying that cloud seeding is a critical tool for water supply. Wyoming's existing cloud seeding program has run for decades.",
    lobbyistOrFirm: "Wyoming Mining Association",
    date: "2025",
    source: {
      label:
        "Wyoming Public Media — Lawmakers contemplate nixing cloud seeding",
      url: "https://www.wyomingpublicmedia.org/politics-government/2025-09-10/wyoming-lawmakers-contemplate-nixing-cloud-seeding-in-light-of-chemtrail-conspiracy",
    },
  },
  {
    company: "SilverLining",
    targetBill: "N/A — proactive lobbying for federal research funding",
    targetState: "Federal",
    activity:
      "Spent $420K lobbying Congress to fund NOAA's Earth's Radiation Budget program and direct federal research into solar radiation management. Successfully got Congress to include SRM research directives in FY2020 appropriations. The NOAA program has grown to ~$10M/year.",
    lobbyistOrFirm: "Kelly Wanser (Executive Director)",
    date: "2018–present",
    outcome:
      "NOAA Earth's Radiation Budget program funded at ~$10M/year. White House OSTP published SRM report June 2023.",
    source: {
      label:
        "E&E News — Blocking sun rays finds support in the Senate",
      url: "https://www.eenews.net/articles/blocking-sun-rays-finds-support-in-the-senate/",
    },
  },
];

// ============================================================
// TIMELINE
// ============================================================

export const LOBBY_TIMELINE: LobbyTimelineEvent[] = [
  {
    date: "2018",
    event: "Kelly Wanser founds SilverLining to advocate for solar geoengineering research.",
    type: "lobbying",
    source: {
      label: "CleanTechnica — SilverLining profile",
      url: "https://cleantechnica.com/2025/05/18/silverlinings-geoengineering-techno-optimism-is-distracting-from-real-climate-solutions/",
    },
  },
  {
    date: "2019",
    event:
      "House appropriators direct NOAA to begin \"observations, monitoring, and forecasting of stratospheric conditions and Earth's radiation budget\" — language shaped by SilverLining's lobbying.",
    type: "legislation",
    source: {
      label:
        "Grist — Climate policy milestone buried in the 2020 budget",
      url: "https://grist.org/climate/the-climate-policy-milestone-that-was-buried-in-the-2020-budget/",
    },
  },
  {
    date: "June 2023",
    event:
      "White House OSTP releases \"Congressionally-Mandated Report on Solar Radiation Modification\" — the first federal report scoping SRM research. SilverLining praised it.",
    type: "legislation",
    source: {
      label: "White House OSTP — SRM report",
      url: "https://bidenwhitehouse.archives.gov/ostp/news-updates/2023/06/30/congressionally-mandated-report-on-solar-radiation-modification/",
    },
  },
  {
    date: "Mid-2024",
    event:
      "Rainmaker Technology begins federal lobbying, hiring LSN Partners and Capitol Pillar LLC.",
    type: "lobbying",
    source: {
      label: "E&E News — Rainmaker lobbying Congress",
      url: "https://www.eenews.net/articles/a-startup-blamed-for-deadly-floods-is-pitching-cloud-seeding-to-lawmakers/",
    },
  },
  {
    date: "April 2024",
    event:
      "Tennessee becomes the first state to sign a geoengineering ban (SB 2691).",
    type: "legislation",
    source: {
      label: "SRM360 — US State Bans Tracker",
      url: "https://srm360.org/us-bans/",
    },
  },
  {
    date: "Q1 2025",
    event:
      "Stardust Solutions hires Holland & Knight to lobby Congress. H&K fails to disclose due to a \"clerical error.\"",
    type: "lobbying",
    source: {
      label:
        "E&E News / POLITICO — Geoengineering startup secretly lobbying Congress",
      url: "https://www.eenews.net/articles/geoengineering-startup-hires-powerhouse-lobby-shop/",
    },
  },
  {
    date: "March 2025",
    event:
      "Rainmaker CEO Augustus Doricko testifies against Florida SB 56 in committee. The bill passes anyway.",
    type: "testimony",
    source: {
      label: "WLRN — Weather modification ban moves forward",
      url: "https://www.wlrn.org/government-politics/2025-03-24/weather-modification-ban-bill",
    },
  },
  {
    date: "March 2025",
    event:
      "Montana SB 473 passes Senate but is killed on House floor (45-55 vote). Closest any failed ban bill has come to enactment.",
    type: "legislation",
    source: {
      label: "Duane Morris — State-Level Geoengineering Bans",
      url: "https://statecapitallobbyist.com/environment/state-level-geoengineering-bans-florida-montana-and-beyond/",
    },
  },
  {
    date: "June 2025",
    event:
      "Gov. DeSantis signs Florida SB 56 — geoengineering is now a felony in Florida. Rainmaker's opposition failed.",
    type: "legislation",
    source: {
      label: "Daily Caller — Weather Control Latest MAHA Battleground",
      url: "https://dailycaller.com/2025/05/19/sb-senate-bill-56-geoengineering-weather-modification-activities-act-florida-ron-desantis-ileana-garcia/",
    },
  },
  {
    date: "July 2025",
    event:
      "Rep. Marjorie Taylor Greene introduces the Clear Skies Act (H.R. 4403) — would criminalize weather modification nationwide. Co-sponsored by Reps. Tony Wied (R-WI) and Tom Massie (R-KY).",
    type: "legislation",
    source: {
      label: "Congress.gov — H.R. 4403 Clear Skies Act text",
      url: "https://www.congress.gov/bill/119th-congress/house-bill/4403/text",
    },
  },
  {
    date: "July 2025",
    event:
      "Central Texas floods kill at least 137 people. Conspiracy theories blame Rainmaker, though experts and government officials say cloud seeding cannot cause floods at that scale.",
    type: "funding",
    source: {
      label: "Al Jazeera — Texas flooding death toll",
      url: "https://www.aljazeera.com/news/2025/7/7/texas-flooding-what-happened-what-went-wrong-and-whats-the-death-toll",
    },
  },
  {
    date: "2025",
    event:
      "Rainmaker hires Crossroads Strategies for White House and Pentagon briefings. Total 2025 lobbying: $450K (3x its 2024 spending).",
    type: "lobbying",
    source: {
      label: "Legislative Insight — Rainmaker hires Crossroads",
      url: "https://legis1.com/news/rainmaker-technology-lobbying-weather-modification/",
    },
  },
  {
    date: "November 2025",
    event:
      "E&E News / POLITICO reveals Holland & Knight had been secretly lobbying for Stardust Solutions for months without disclosure.",
    type: "lobbying",
    source: {
      label:
        "E&E News / POLITICO — Geoengineering startup secretly lobbying Congress",
      url: "https://www.eenews.net/articles/geoengineering-startup-hires-powerhouse-lobby-shop/",
    },
  },
  {
    date: "January 2026",
    event:
      "Iowa senators advance a ban on geoengineering and weather-altering activities.",
    type: "legislation",
    source: {
      label: "Iowa Capital Dispatch — Iowa senators advance geo ban",
      url: "https://iowacapitaldispatch.com/2026/01/26/iowa-senators-advance-ban-on-geoengineering-weather-altering-activities/",
    },
  },
];

// ============================================================
// RED FLAGS
// ============================================================

export const LOBBY_RED_FLAGS: LobbyRedFlag[] = [
  {
    flag: "Secret lobbying for months",
    detail:
      "Holland & Knight lobbied Congress on behalf of Stardust Solutions — a $75M geoengineering startup — for months without filing the required disclosure. They blamed a \"clerical error.\" The Lobbying Disclosure Act requires registration within 45 days.",
    category: "disclosure",
    source: {
      label:
        "E&E News / POLITICO — Geoengineering startup secretly lobbying Congress",
      url: "https://www.eenews.net/articles/geoengineering-startup-hires-powerhouse-lobby-shop/",
    },
  },
  {
    flag: "Spending $450K to fight the bill that would ban what they do",
    detail:
      "Rainmaker Technology's top lobbying priority is defeating the Clear Skies Act — the bill that would criminalize releasing chemicals into the atmosphere to modify weather. That is literally Rainmaker's business model. They spent 3x more on lobbying in 2025 than all of 2024.",
    category: "conflicts",
    source: {
      label: "E&E News — Rainmaker lobbying Congress",
      url: "https://www.eenews.net/articles/a-startup-blamed-for-deadly-floods-is-pitching-cloud-seeding-to-lawmakers/",
    },
  },
  {
    flag: "Revolving-door hire at Capitol Pillar",
    detail:
      "Rainmaker hired Capitol Pillar, led by Casey Hammond — who served as acting Assistant Secretary of the Interior for Land and Minerals Management in the first Trump administration. Hammond now lobbies the same Interior Department he used to run, on behalf of a weather modification company.",
    category: "revolving-door",
    source: {
      label: "LegiStorm — Casey Hammond biography",
      url: "https://www.legistorm.com/person/bio/19366/Casey_Hammond.html",
    },
  },
  {
    flag: "Same investors fund the lobbying AND the profit",
    detail:
      "Lowercarbon Capital (Chris Sacca) funds SilverLining's lobbying for federal geoengineering research programs AND invests in Stardust Solutions and Rainmaker — the companies that would profit from those programs. The lobbying creates the market; the investments capture it.",
    category: "coordination",
    source: {
      label:
        "CleanTechnica — SilverLining's Geoengineering Techno-Optimism",
      url: "https://cleantechnica.com/2025/05/18/silverlinings-geoengineering-techno-optimism-is-distracting-from-real-climate-solutions/",
    },
  },
  {
    flag: "SilverLining outspends major environmental groups",
    detail:
      "SilverLining spent $420K on lobbying in the 2024 cycle — nearly double the World Resources Institute ($220K) and more than the Wildlife Conservation Society. A small nonprofit with a focused geoengineering agenda spending more on lobbying than established environmental organizations.",
    category: "conflicts",
    source: {
      label:
        "CleanTechnica — SilverLining's Geoengineering Techno-Optimism",
      url: "https://cleantechnica.com/2025/05/18/silverlinings-geoengineering-techno-optimism-is-distracting-from-real-climate-solutions/",
    },
  },
  {
    flag: "CEO personally testified against a felony ban — and lost",
    detail:
      "Rainmaker's 24-year-old CEO Augustus Doricko testified against Florida's SB 56, arguing the ban would hurt farmers. The bill passed the Senate 28-9 and the House 82-28 — overwhelming bipartisan margins. Having the weather modification industry show up to fight the bill proved the point that this is real and worth regulating.",
    category: "conflicts",
    source: {
      label: "WLRN — Weather modification ban moves forward",
      url: "https://www.wlrn.org/government-politics/2025-03-24/weather-modification-ban-bill",
    },
  },
  {
    flag: "Pentagon and White House briefings for a cloud seeding startup",
    detail:
      "Rainmaker hired Crossroads Strategies to brief the White House, Pentagon, and Departments of Commerce and State on \"water resilience.\" A cloud seeding startup briefing the Pentagon raises questions about the military applications of weather modification technology.",
    category: "conflicts",
    source: {
      label: "E&E News — Rainmaker lobbying Congress",
      url: "https://www.eenews.net/articles/a-startup-blamed-for-deadly-floods-is-pitching-cloud-seeding-to-lawmakers/",
    },
  },
  {
    flag: "Holland & Knight PAC: $2.2M in political money",
    detail:
      "Holland & Knight — the firm secretly lobbying for Stardust Solutions — has a PAC that raised $867K and the organization contributed $2.2M in political contributions in the 2024 cycle. When your lobbyist also funds political campaigns, the line between \"informing\" and \"influencing\" disappears.",
    category: "coordination",
    source: {
      label: "OpenSecrets — Holland & Knight organizational profile",
      url: "https://www.opensecrets.org/orgs/holland-knight/summary?id=D000000330",
    },
  },
  {
    flag: "Holland & Knight: lobbying for a company that won't say what it's spraying",
    detail:
      "Holland & Knight LLP — one of the largest lobbying firms in the U.S. — is representing Stardust Solutions, an Israeli-American company whose founders come from Israel's Dimona nuclear facility. Stardust refuses to publicly disclose the composition of the particles it plans to release into the stratosphere, calling them proprietary \"magic\" particles. Holland & Knight secretly lobbied Congress for months without disclosure, and still won't say how much Stardust paid or what specific issues they lobbied on.",
    category: "disclosure",
    source: {
      label:
        "E&E News / POLITICO — Geoengineering startup secretly lobbying Congress",
      url: "https://www.eenews.net/articles/geoengineering-startup-hires-powerhouse-lobby-shop/",
    },
  },
];

// ============================================================
// STATE LOBBYING SUMMARIES
// ============================================================

export const STATE_LOBBYING: StateLobbyingSummary[] = [
  {
    state: "FL",
    stateName: "Florida",
    banStatus: "enacted",
    banBill: "SB 56",
    lobbyingActivity: "high",
    highlights: [
      "Rainmaker CEO personally testified against SB 56 in committee.",
      "Bill passed Senate 28-9, House 82-28 — overwhelming bipartisan margins.",
      "Signed by Gov. DeSantis June 2025. Felony penalties active July 1, 2025.",
      "Despite industry opposition, the bill had the strongest vote margins of any state ban.",
    ],
    antiBanActivities: [
      {
        company: "Rainmaker Technology",
        companySlug: "rainmaker",
        targetBill: "SB 56",
        targetState: "FL",
        activity:
          "CEO Augustus Doricko testified in committee against the bill.",
        lobbyistOrFirm: "Augustus Doricko (CEO)",
        date: "March 2025",
        outcome: "Bill passed with strong bipartisan majorities.",
        source: {
          label: "WLRN — Weather modification ban moves forward",
          url: "https://www.wlrn.org/government-politics/2025-03-24/weather-modification-ban-bill",
        },
      },
    ],
    sources: [
      {
        label: "Florida Senate — SB 56 full text and history",
        url: "https://www.flsenate.gov/Session/Bill/2025/56",
      },
      {
        label: "Florida Phoenix — Senate approves ban",
        url: "https://floridaphoenix.com/2025/04/03/florida-senate-approves-ban-on-geoengineering-and-weather-modification/",
      },
    ],
  },
  {
    state: "TN",
    stateName: "Tennessee",
    banStatus: "enacted",
    banBill: "SB 2691",
    lobbyingActivity: "low",
    highlights: [
      "First state to sign a geoengineering ban into law (April 2024).",
      "No significant industry lobbying opposition was publicly reported.",
      "Set the precedent that made subsequent state bans easier to pass.",
    ],
    antiBanActivities: [],
    sources: [
      {
        label: "SRM360 — US State Bans Tracker",
        url: "https://srm360.org/us-bans/",
      },
    ],
  },
  {
    state: "MT",
    stateName: "Montana",
    banStatus: "enacted",
    banBill: "SB 473",
    lobbyingActivity: "low",
    highlights: [
      "Passed March 2025. Bans geoengineering (SAI, SRM) but permits cloud seeding for water management.",
      "The cloud seeding exemption reflects the influence of agricultural water interests.",
    ],
    antiBanActivities: [],
    sources: [
      {
        label:
          "Duane Morris — State-Level Geoengineering Bans",
        url: "https://statecapitallobbyist.com/environment/state-level-geoengineering-bans-florida-montana-and-beyond/",
      },
    ],
  },
  {
    state: "LA",
    stateName: "Louisiana",
    banStatus: "enacted",
    lobbyingActivity: "low",
    highlights: [
      "Enacted a geoengineering ban with citizen reporting provisions.",
      "Has received 400+ citizen reports since enactment.",
    ],
    antiBanActivities: [],
    sources: [
      {
        label: "SRM360 — US State Bans Tracker",
        url: "https://srm360.org/us-bans/",
      },
    ],
  },
  {
    state: "AZ",
    stateName: "Arizona",
    banStatus: "pending",
    lobbyingActivity: "medium",
    highlights: [
      "Salt River Project lobbyist testified against the ban, defending cloud seeding for water supply.",
      "Arizona's arid climate makes cloud seeding politically popular with water managers.",
    ],
    antiBanActivities: [
      {
        company: "Salt River Project",
        targetBill: "Geoengineering ban bill",
        targetState: "AZ",
        activity:
          "Lobbyist testified: \"We see great potential in cloud seeding as a viable way to generate more precipitation.\"",
        lobbyistOrFirm: "Salt River Project lobbyist",
        date: "2025",
        source: {
          label:
            "Duane Morris — State-Level Geoengineering Bans",
          url: "https://statecapitallobbyist.com/environment/state-level-geoengineering-bans-florida-montana-and-beyond/",
        },
      },
    ],
    sources: [
      {
        label:
          "Duane Morris — State-Level Geoengineering Bans",
        url: "https://statecapitallobbyist.com/environment/state-level-geoengineering-bans-florida-montana-and-beyond/",
      },
    ],
  },
  {
    state: "WY",
    stateName: "Wyoming",
    banStatus: "pending",
    lobbyingActivity: "medium",
    highlights: [
      "Wyoming Mining Association and trona producers defended the state's decades-old cloud seeding program.",
      "Wyoming runs one of the largest state-funded cloud seeding programs in the U.S.",
      "Industry opposition frames the ban as a threat to water supply and mining operations.",
    ],
    antiBanActivities: [
      {
        company: "Wyoming Mining Association",
        targetBill: "Cloud seeding ban proposal",
        targetState: "WY",
        activity:
          "Testified in defense of Wyoming's cloud seeding program as critical for water supply.",
        lobbyistOrFirm: "Wyoming Mining Association",
        date: "2025",
        source: {
          label:
            "Wyoming Public Media — Lawmakers contemplate nixing cloud seeding",
          url: "https://www.wyomingpublicmedia.org/politics-government/2025-09-10/wyoming-lawmakers-contemplate-nixing-cloud-seeding-in-light-of-chemtrail-conspiracy",
        },
      },
    ],
    sources: [
      {
        label:
          "Wyoming Public Media — Lawmakers contemplate nixing cloud seeding",
        url: "https://www.wyomingpublicmedia.org/politics-government/2025-09-10/wyoming-lawmakers-contemplate-nixing-cloud-seeding-in-light-of-chemtrail-conspiracy",
      },
    ],
  },
  {
    state: "IA",
    stateName: "Iowa",
    banStatus: "pending",
    lobbyingActivity: "low",
    highlights: [
      "Iowa senators advanced a ban on geoengineering and weather-altering activities in January 2026.",
      "One of the more recent states to move forward with a ban.",
    ],
    antiBanActivities: [],
    sources: [
      {
        label:
          "Iowa Capital Dispatch — Iowa senators advance geo ban",
        url: "https://iowacapitaldispatch.com/2026/01/26/iowa-senators-advance-ban-on-geoengineering-weather-altering-activities/",
      },
    ],
  },
  {
    state: "AR",
    stateName: "Arkansas",
    banStatus: "none",
    lobbyingActivity: "none",
    highlights: [
      "No geoengineering ban bill has been introduced yet.",
      "SkyLedger is working to spearhead a bill for the January 2027 legislative session.",
    ],
    antiBanActivities: [],
    sources: [],
  },
];

// ============================================================
// THE PIPELINE (how lobbying connects to funding)
// ============================================================

export const LOBBY_PIPELINE = [
  {
    step: 1,
    label: "Fund the Research",
    description:
      "Philanthropists and VCs fund academic research on solar geoengineering.",
    entities: [
      "Bill Gates / FICER → Harvard SGRP",
      "Quadrature Climate Foundation ($40M)",
      "Simons Foundation ($50M)",
    ],
    lobbyConnection: "Creates the scientific foundation that lobbying cites.",
  },
  {
    step: 2,
    label: "Lobby for Government Programs",
    description:
      "SilverLining spends $420K lobbying Congress and NOAA to create publicly funded research programs.",
    entities: [
      "SilverLining → NOAA Earth's Radiation Budget (~$10M/yr)",
      "SilverLining → White House OSTP SRM report",
      "SilverLining → Congressional appropriations",
    ],
    lobbyConnection:
      "Government funding validates the field and creates a market for deployment.",
  },
  {
    step: 3,
    label: "Invest in Deployment Companies",
    description:
      "The same investors fund startups that would profit from the research programs.",
    entities: [
      "Lowercarbon Capital → Stardust Solutions ($60M Series A, Oct 2025)",
      "Lowercarbon Capital → Rainmaker",
      "Awz Ventures → Stardust Solutions ($15M seed, defense/intel-connected VC)",
    ],
    lobbyConnection:
      "Sacca funds both the lobbying (SilverLining) and the deployment companies.",
  },
  {
    step: 4,
    label: "Fight the Bans",
    description:
      "Deployment companies spend $450K+ lobbying to block legislation that would ban their operations.",
    entities: [
      "Rainmaker → 3 K Street firms fighting Clear Skies Act",
      "Stardust → Holland & Knight lobbying Congress",
      "Rainmaker CEO → Testified against Florida felony ban",
    ],
    lobbyConnection:
      "The companies use lobbying to protect the market that was created by lobbying.",
  },
];

// ============================================================
// SOURCE CATEGORIES
// ============================================================

export const LOBBY_SOURCE_CATEGORIES = [
  {
    title: "Federal Lobbying Filings",
    sources: [
      {
        label: "Senate Lobbying Disclosure (LDA.gov) — Search filings",
        url: "https://lda.senate.gov/filings/public/filing/search/",
      },
      {
        label: "OpenSecrets — Rainmaker Technology lobbying profile",
        url: "https://www.opensecrets.org/federal-lobbying/clients/summary?cycle=2025&id=D000116498",
      },
      {
        label: "OpenSecrets — Holland & Knight organizational profile",
        url: "https://www.opensecrets.org/orgs/holland-knight/summary?id=D000000330",
      },
      {
        label: "OpenSecrets — Federal Lobbying Data",
        url: "https://www.opensecrets.org/federal-lobbying",
      },
    ],
  },
  {
    title: "Campaign Finance Data",
    sources: [
      {
        label: "FEC — Individual Contribution Search",
        url: "https://www.fec.gov/data/receipts/individual-contributions/",
      },
      {
        label: "OpenSecrets — Holland & Knight PAC",
        url: "https://www.opensecrets.org/political-action-committees-pacs/holland-knight/C00171330/summary/2024",
      },
      {
        label: "OpenSecrets — Donor Lookup",
        url: "https://www.opensecrets.org/donor-lookup",
      },
    ],
  },
  {
    title: "State-Level Disclosure",
    sources: [
      {
        label: "FollowTheMoney.org — State campaign finance data (all 50 states)",
        url: "https://www.followthemoney.org/",
      },
      {
        label:
          "OpenSecrets — State Lobbying Disclosure Scorecard",
        url: "https://www.opensecrets.org/news/reports/layers-of-lobbying/lobbying-scorecard",
      },
    ],
  },
  {
    title: "Investigative Reporting",
    sources: [
      {
        label:
          "E&E News / POLITICO — Geoengineering startup secretly lobbying Congress",
        url: "https://www.eenews.net/articles/geoengineering-startup-hires-powerhouse-lobby-shop/",
      },
      {
        label: "E&E News — Rainmaker lobbying Congress",
        url: "https://www.eenews.net/articles/a-startup-blamed-for-deadly-floods-is-pitching-cloud-seeding-to-lawmakers/",
      },
      {
        label:
          "CleanTechnica — SilverLining's Geoengineering Techno-Optimism",
        url: "https://cleantechnica.com/2025/05/18/silverlinings-geoengineering-techno-optimism-is-distracting-from-real-climate-solutions/",
      },
      {
        label:
          "E&E News — Blocking sun rays finds support in the Senate",
        url: "https://www.eenews.net/articles/blocking-sun-rays-finds-support-in-the-senate/",
      },
      {
        label:
          "BM Outdoor — Rainmaker \"We Build Rain\" Metro ad campaign",
        url: "https://bmoutdoor.com/info/rainmaker-haymaker-we-build-rain",
      },
    ],
  },
  {
    title: "Company Funding & Filings",
    sources: [
      {
        label: "Heatmap News — Stardust Solutions raises $60M",
        url: "https://heatmap.news/climate-tech/stardust-geoengineering",
      },
      {
        label: "SRM360 — Stardust Solutions $60M funding analysis",
        url: "https://srm360.org/news-reaction/for-profit-startup-secures-60-million/",
      },
      {
        label: "Sacra — Rainmaker funding, news & analysis",
        url: "https://sacra.com/c/rainmaker/",
      },
    ],
  },
  {
    title: "Government Documents",
    sources: [
      {
        label:
          "White House OSTP — Congressionally-Mandated Report on Solar Radiation Modification (June 2023)",
        url: "https://bidenwhitehouse.archives.gov/ostp/news-updates/2023/06/30/congressionally-mandated-report-on-solar-radiation-modification/",
      },
      {
        label:
          "NOAA Climate Program Office — Earth's Radiation Budget program",
        url: "https://cpo.noaa.gov/divisions-programs/earth-system-science-and-modeling-division/earths-radiation-budget/",
      },
      {
        label:
          "NOAA CSL — U.S. building early warning system to detect geoengineering",
        url: "https://csl.noaa.gov/news/2024/420_1202.html",
      },
      {
        label: "Congress.gov — H.R. 4403 Clear Skies Act full text",
        url: "https://www.congress.gov/bill/119th-congress/house-bill/4403/text",
      },
      {
        label: "House Oversight — Hearing wrap-up on weather engineering transparency",
        url: "https://oversight.house.gov/release/hearing-wrap-up-subcommittee-demands-transparency-of-government-weather-and-climate-engineering/",
      },
    ],
  },
];

// ============================================================
// WHAT YOU WON'T SEE HERE
// ============================================================

export const DARK_MONEY_LIMITATIONS = [
  {
    title: "501(c)(4) dark money",
    detail:
      "Organizations classified as 501(c)(4) \"social welfare\" groups are not required to disclose their donors. If geoengineering interests funnel money through these entities, it won't appear in any public database.",
  },
  {
    title: "Venture capital and philanthropic funding",
    detail:
      "The $150M+ in VC funding (Lowercarbon, Awz Ventures) and philanthropic money (Quadrature $40M, Simons $50M, Gates/FICER $8.5M) does not appear in lobbying disclosures. This is the bulk of the money shaping geoengineering policy, and it's technically not \"lobbying.\"",
  },
  {
    title: "State-level data gaps",
    detail:
      "State lobbying disclosure quality varies wildly. Some states have excellent electronic filing systems; others are paper-based or have no expenditure reporting at all. We show what's publicly available, but the real picture is likely bigger.",
  },
  {
    title: "Academic influence",
    detail:
      "Funding university research that shapes policy narratives is not classified as lobbying. Bill Gates' FICER funded Harvard's Solar Geoengineering Research Program with $8.5M+ — that research is cited by policymakers but never appears in lobbying disclosures.",
  },
  {
    title: "\"Strategic communications\"",
    detail:
      "PR campaigns, media placements, and grassroots organizing designed to shift public opinion are largely unregulated and unreported. Rainmaker ran gold-framed Metro ads at the Capitol South station in January 2026 targeting lawmakers with \"We Build Rain\" messaging, but this spending doesn't appear in lobbying filings.",
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getStateSummary(
  state: string
): StateLobbyingSummary | undefined {
  return STATE_LOBBYING.find(
    (s) => s.state.toUpperCase() === state.toUpperCase()
  );
}

export function getAntiBanByState(state: string): AntiBanActivity[] {
  return ANTI_BAN_ACTIVITIES.filter(
    (a) => a.targetState.toUpperCase() === state.toUpperCase()
  );
}

export function getAllStatesWithData(): string[] {
  return STATE_LOBBYING.map((s) => s.state).sort();
}

export function getStatesWithActivity(): StateLobbyingSummary[] {
  return STATE_LOBBYING.filter((s) => s.lobbyingActivity !== "none");
}
