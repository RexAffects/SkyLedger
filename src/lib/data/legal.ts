// Phase 4 — Legal Action Hub & Donation Data

export interface FrontlineOrg {
  slug: string;
  name: string;
  shortName: string;
  mission: string;
  whatDonationsFund: string;
  taxDeductible: boolean;
  donateUrl: string;
  websiteUrl: string;
  tag: string;
  tagColor: string;
  impactExamples: string[];
  keyWins?: string[];
}

export interface StateLegalStatus {
  state: string;
  abbreviation: string;
  status: "enacted" | "pending" | "no-bill" | "failed";
  bill?: string;
  penalty?: string;
  enforcementAgency?: string;
  citizenActions: string[];
  complaintPortal?: string;
  notes?: string;
}

export interface LegalResource {
  title: string;
  description: string;
  url: string;
  type: "international-law" | "domestic-law" | "legal-analysis" | "petition";
}

// ============================================================
// FRONTLINE ORGANIZATIONS
// ============================================================

export const FRONTLINE_ORGS: FrontlineOrg[] = [
  {
    slug: "ican",
    name: "ICAN (Informed Consent Action Network)",
    shortName: "ICAN",
    mission:
      "Legal nonprofit using FOIA to force transparency on government geoengineering programs. Their legal team has uncovered critical documents that agencies tried to keep hidden.",
    whatDonationsFund:
      "FOIA filing fees, legal staff, document analysis, and ongoing litigation against agencies that refuse to comply with records requests.",
    taxDeductible: true,
    donateUrl: "https://icandecide.org/donate/",
    websiteUrl: "https://icandecide.org",
    tag: "FOIA & Legal",
    tagColor:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    impactExamples: [
      "$50 covers one FOIA filing fee",
      "$250 funds a day of legal research",
      "$1,000 funds a major FOIA lawsuit filing",
    ],
    keyWins: [
      "Forced disclosure of NSF $400K 'holy grail' SAI aerosol targeting grant to Cornell & Indiana University",
      "Exposed NOAA's SABRE program \u2014 a government stratospheric aerosol injection research program ramping up since 2021",
      "Currently filing DOE FOIA requests and challenging British government geoengineering experiments",
    ],
  },
  {
    slug: "geofight",
    name: "The GeoFight",
    shortName: "GeoFight",
    mission:
      "Coalition of attorneys building toward the first federal lawsuit against geoengineering. Nicole Pearson, Blake Horwitz, and Tom Renz are assembling the legal case.",
    whatDonationsFund:
      "Attorney fees, expert witness retainers, court filing fees, and evidence documentation for the federal lawsuit.",
    taxDeductible: false,
    donateUrl: "https://thegeofight.com",
    websiteUrl: "https://thegeofight.com",
    tag: "Federal Lawsuit",
    tagColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    impactExamples: [
      "$100 covers a court filing fee",
      "$500 funds expert witness preparation",
      "$5,000 funds a major legal brief",
    ],
    keyWins: [
      "Assembled a coalition of attorneys with expertise in environmental and constitutional law",
      "Currently collecting court-admissible evidence and seeking whistleblowers",
    ],
  },
  {
    slug: "stop-geo-mn",
    name: "Stop Geoengineering MN",
    shortName: "Stop Geo MN",
    mission:
      "State-level legal action in Minnesota. 100% of donations go directly to legal efforts. Full financial transparency.",
    whatDonationsFund:
      "Legal filings, attorney fees, and court costs \u2014 100% goes to legal efforts with full transparency.",
    taxDeductible: true,
    donateUrl: "https://stopgeoengineeringmn.squarespace.com/donate",
    websiteUrl: "https://stopgeoengineeringmn.squarespace.com",
    tag: "State Legal",
    tagColor:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    impactExamples: [
      "$25 covers printing and mailing legal documents",
      "$200 covers a state court filing",
      "Every dollar goes directly to legal work",
    ],
    keyWins: [
      "Sued the Air Force in federal court for information on weather modification programs",
      "Challenged government efforts to restrict public knowledge of weather modification",
    ],
  },
  {
    slug: "geoengineering-watch",
    name: "Geoengineering Watch",
    shortName: "GeoWatch",
    mission:
      "The archive. 20+ years documenting weather modification with the largest public collection of evidence. Lead researcher Dane Wigington has testified as expert witness for state ban bills.",
    whatDonationsFund:
      "Lab testing (soil, water, snow analysis), documentary production, educational outreach, website hosting, and ongoing research.",
    taxDeductible: false,
    donateUrl: "https://geoengineeringwatch.org",
    websiteUrl: "https://geoengineeringwatch.org",
    tag: "Research & Evidence",
    tagColor:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    impactExamples: [
      "$50 funds one lab sample analysis",
      "$200 funds a batch of environmental testing",
      "Research supports legislative testimony in multiple states",
    ],
    keyWins: [
      "'The Dimming' documentary \u2014 25M+ views",
      "175+ weather modification patents catalogued and made publicly searchable",
      "Expert witness testimony supporting Wyoming and other state ban bills",
      "Independent lab testing showing elevated aluminum, barium, and strontium in rainwater and soil",
    ],
  },
  {
    slug: "carnicom",
    name: "Carnicom Institute",
    shortName: "Carnicom",
    mission:
      "Independent research organization conducting scientific analysis of environmental samples related to aerosol operations.",
    whatDonationsFund:
      "Laboratory equipment, sample analysis, research publication, and ongoing environmental monitoring.",
    taxDeductible: false,
    donateUrl: "https://www.carnicominstitute.org",
    websiteUrl: "https://www.carnicominstitute.org",
    tag: "Independent Research",
    tagColor:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    impactExamples: [
      "Supports long-running environmental and biological research program",
    ],
  },
];

// ============================================================
// STATE LEGAL LANDSCAPE (key states)
// ============================================================

export const STATE_LEGAL: StateLegalStatus[] = [
  {
    state: "Tennessee",
    abbreviation: "TN",
    status: "enacted",
    bill: "SB 2691",
    penalty: "Class C misdemeanor, up to $10,000/day per violation",
    enforcementAgency: "State Attorney General",
    citizenActions: [
      "Report suspected weather modification to the AG's office",
      "Document observations with photos, times, and locations",
      "File complaints with local law enforcement citing SB 2691",
    ],
    notes: "First state to ban geoengineering. Signed April 11, 2024 by Gov. Bill Lee.",
  },
  {
    state: "Florida",
    abbreviation: "FL",
    status: "enacted",
    bill: "SB 56",
    penalty: "Felony \u2014 up to 5 years in prison, $100,000 fine",
    enforcementAgency: "Florida Department of Environmental Protection",
    citizenActions: [
      "Use Florida's official public complaint system to report violations",
      "Document with photos and flight tracking data from SkyLedger",
      "Contact your state representative to ensure enforcement funding",
    ],
    complaintPortal: "https://floridadep.gov/waste/waste-cleanup/content/complaint-information",
    notes: "Classified unauthorized geoengineering as a felony. Passed 82-28 in the House.",
  },
  {
    state: "Louisiana",
    abbreviation: "LA",
    status: "enacted",
    bill: "Act No. 95 (SB 46)",
    penalty: "Reporting requirements; violations subject to state enforcement",
    enforcementAgency: "Louisiana Department of Environmental Quality",
    citizenActions: [
      "Submit reports through Louisiana's state reporting portal",
      "Document any weather modification activity in your area",
      "Over 400 citizen reports already submitted \u2014 add yours",
    ],
    notes: "Created a state reporting portal for weather modification activities.",
  },
  {
    state: "Montana",
    abbreviation: "MT",
    status: "enacted",
    bill: "SB 473",
    penalty: "Bans SAI and SRM; permits cloud seeding for water resources",
    enforcementAgency: "Montana Department of Environmental Quality",
    citizenActions: [
      "Report suspected SAI or SRM activities",
      "Note: cloud seeding for water management is still permitted under this law",
    ],
    notes: "Passed March 6, 2025. Distinguishes between cloud seeding and SAI/SRM.",
  },
  {
    state: "Pennsylvania",
    abbreviation: "PA",
    status: "pending",
    bill: "HB 1565",
    citizenActions: [
      "Call your state rep and ask them to support HB 1565",
      "Attend committee hearings when scheduled",
      "Share the bill details with your community",
    ],
    notes: "Would create $500,000 felony penalties \u2014 among the strongest proposed.",
  },
  {
    state: "Iowa",
    abbreviation: "IA",
    status: "pending",
    bill: "HF 574",
    citizenActions: [
      "Contact your state legislators and urge a yes vote",
      "This bill is advancing \u2014 your voice makes a difference",
    ],
    notes: "Advancing through committee.",
  },
  {
    state: "Arkansas",
    abbreviation: "AR",
    status: "no-bill",
    citizenActions: [
      "Contact your state representative and senator",
      "Point them to Tennessee, Florida, and Louisiana as models",
      "Organize local awareness events",
      "Use the FOIA generator to request weather modification records from state agencies",
    ],
    notes: "No bill introduced yet. Rex's home state \u2014 a priority for outreach.",
  },
];

// ============================================================
// LEGAL RESOURCES
// ============================================================

export const LEGAL_RESOURCES: LegalResource[] = [
  {
    title: "Solar Geoengineering Non-Use Agreement",
    description:
      "Signed by 600+ scientists and ~2,000 civil society organizations. Calls for prohibiting funding, banning outdoor experiments, denying patents, and no public funding for deployment.",
    url: "https://www.solargeoeng.org/non-use-agreement/open-letter/",
    type: "petition",
  },
  {
    title: "Convention on Biological Diversity \u2014 Geoengineering Moratorium",
    description:
      "De facto moratorium on geoengineering activities. Reaffirmed at CBD COP16 in Colombia (November 2024). Israel is a party.",
    url: "https://www.cbd.int/climate/geoengineering/",
    type: "international-law",
  },
  {
    title: "CIEL: Legal Analysis of Geoengineering",
    description:
      "Center for International Environmental Law's comprehensive analysis of the legal frameworks constraining geoengineering, including the CBD moratorium, ENMOD convention, and customary international law.",
    url: "https://www.ciel.org/issue/geoengineering/",
    type: "legal-analysis",
  },
  {
    title: "ENMOD Convention (Environmental Modification Convention)",
    description:
      "UN convention prohibiting military or hostile use of environmental modification techniques. Entered into force 1978.",
    url: "https://treaties.unoda.org/t/enmod",
    type: "international-law",
  },
  {
    title: "Clean Air Act (42 USC \u00a7 7401)",
    description:
      "Federal law regulating air emissions. Citizens can file complaints with the EPA for unpermitted releases of substances into the atmosphere.",
    url: "https://www.epa.gov/clean-air-act-overview",
    type: "domestic-law",
  },
  {
    title: "Freedom of Information Act (5 USC \u00a7 552)",
    description:
      "Your legal right to request records from federal agencies. Agencies must respond within 20 business days. Fee waivers available for public interest requests.",
    url: "https://www.foia.gov/",
    type: "domestic-law",
  },
  {
    title: "GAO Report: NOAA Oversight Failures (Feb 2026)",
    description:
      "Government Accountability Office found NOAA's weather modification oversight is broken: 78% error rate, no written guidance, forms unchanged since 1974, zero fines in 50+ years.",
    url: "https://www.gao.gov/products/gao-26-108013",
    type: "legal-analysis",
  },
  {
    title: "SRM360: US State Bans Tracker",
    description:
      "Comprehensive tracker of state-level geoengineering legislation across all 50 states.",
    url: "https://srm360.org/us-bans/",
    type: "legal-analysis",
  },
];
