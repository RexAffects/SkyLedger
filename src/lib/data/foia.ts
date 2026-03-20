// Phase 4 — FOIA Generator Data
// Agency addresses, topic templates, and pre-built request language.

export interface FoiaAgency {
  id: string;
  name: string;
  shortName: string;
  level: "federal" | "state";
  state?: string;
  address: string;
  foiaEmail?: string;
  foiaUrl?: string;
  notes?: string;
}

export interface FoiaTemplate {
  id: string;
  topic: string;
  description: string;
  agencyIds: string[];
  documentRequests: string[];
  legalCitations: string[];
  tips?: string;
}

// ============================================================
// AGENCIES
// ============================================================

export const FOIA_AGENCIES: FoiaAgency[] = [
  // Federal
  {
    id: "epa",
    name: "Environmental Protection Agency",
    shortName: "EPA",
    level: "federal",
    address:
      "EPA FOIA Office\nU.S. Environmental Protection Agency\n1200 Pennsylvania Avenue, NW\nWashington, DC 20460",
    foiaEmail: "hq.foia@epa.gov",
    foiaUrl: "https://www.epa.gov/foia",
    notes:
      "EPA Administrator Zeldin publicly stated Americans deserve answers about geoengineering. EPA ordered to compile and publish everything they know about contrails and geoengineering.",
  },
  {
    id: "noaa",
    name: "National Oceanic and Atmospheric Administration",
    shortName: "NOAA",
    level: "federal",
    address:
      "NOAA FOIA Officer\n1315 East-West Highway\nSSMC3, Room 9719\nSilver Spring, MD 20910",
    foiaEmail: "FOIA@noaa.gov",
    foiaUrl: "https://www.noaa.gov/information-technology/foia",
    notes:
      "NOAA has overseen weather modification reporting for 50+ years. GAO found 78% error rate in their reports. They make no effort to seek out unreported activities.",
  },
  {
    id: "faa",
    name: "Federal Aviation Administration",
    shortName: "FAA",
    level: "federal",
    address:
      "Federal Aviation Administration\nFOIA Office, National Headquarters\n800 Independence Avenue, SW\nRoom 930\nWashington, DC 20591",
    foiaEmail: "9-AWA-ARC-FOIA@faa.gov",
    foiaUrl: "https://www.faa.gov/foia",
    notes:
      "FAA maintains aircraft registration records and flight data. Useful for requesting data on specific aircraft involved in suspected weather modification.",
  },
  {
    id: "nsf",
    name: "National Science Foundation",
    shortName: "NSF",
    level: "federal",
    address:
      "Office of the General Counsel\nNational Science Foundation\n2415 Eisenhower Avenue\nAlexandria, VA 22314",
    foiaEmail: "foia@nsf.gov",
    foiaUrl: "https://www.nsf.gov/policies/foia.jsp",
    notes:
      "NSF funded a $400K SAI research grant to Cornell and Indiana University \u2014 uncovered by ICAN through FOIA.",
  },
  {
    id: "doe",
    name: "Department of Energy",
    shortName: "DOE",
    level: "federal",
    address:
      "FOIA/Privacy Act Group\nMA-46, Room 1G-051\nU.S. Department of Energy\n1000 Independence Avenue, SW\nWashington, DC 20585",
    foiaEmail: "FOIA-Central@hq.doe.gov",
    foiaUrl: "https://www.energy.gov/management/freedom-information-act",
    notes:
      "DOE oversees national laboratories including Lawrence Livermore (where FICER manager Ken Caldeira was a Teller Fellow). ICAN currently filing DOE FOIA requests.",
  },
  {
    id: "dod",
    name: "Department of Defense",
    shortName: "DOD",
    level: "federal",
    address:
      "OSD/JS FOIA Requester Service Center\n1155 Defense Pentagon\nWashington, DC 20301-1155",
    foiaEmail: "osd.pentagon.ousd-intel-sec.mbx.dod-foia-service@mail.mil",
    foiaUrl: "https://open.defense.gov/Transparency/FOIA/",
    notes:
      "The 1996 Air Force paper 'Owning the Weather in 2025' explored weather modification as a military capability. The DOD has historical involvement.",
  },

  // State agencies (active cloud seeding states + ban states)
  {
    id: "tx-deq",
    name: "Texas Department of Licensing and Regulation",
    shortName: "Texas TDLR",
    level: "state",
    state: "Texas",
    address:
      "Texas Department of Licensing and Regulation\nP.O. Box 12157\nAustin, TX 78711",
    foiaUrl: "https://www.tdlr.texas.gov/weather/summary.htm",
    notes:
      "Texas has 5 active cloud seeding programs covering one-sixth of the state. TDLR regulates weather modification under the Texas Weather Modification Act (1967).",
  },
  {
    id: "co-cwcb",
    name: "Colorado Water Conservation Board",
    shortName: "Colorado CWCB",
    level: "state",
    state: "Colorado",
    address:
      "Colorado Water Conservation Board\n1313 Sherman Street, Room 718\nDenver, CO 80203",
    foiaUrl: "https://cwcb.colorado.gov/focus-areas/supply/weather-modification-program",
    notes:
      "Colorado operates a state-run Weather Modification Program through the CWCB.",
  },
  {
    id: "id-deq",
    name: "Idaho Department of Water Resources",
    shortName: "Idaho DWR",
    level: "state",
    state: "Idaho",
    address:
      "Idaho Department of Water Resources\n322 E. Front Street, Suite 648\nBoise, ID 83720",
    notes:
      "Idaho Power runs a $4M/year cloud seeding program. Idaho DWR issues weather modification permits.",
  },
  {
    id: "nd-wmc",
    name: "North Dakota Atmospheric Resource Board",
    shortName: "ND ARB",
    level: "state",
    state: "North Dakota",
    address:
      "North Dakota Atmospheric Resource Board\n900 E. Boulevard Ave., Dept. 770\nBismarck, ND 58505",
    notes:
      "North Dakota has one of the longest-running cloud seeding programs in the US.",
  },
  {
    id: "ar-deq",
    name: "Arkansas Department of Energy and Environment",
    shortName: "Arkansas DEE",
    level: "state",
    state: "Arkansas",
    address:
      "Arkansas Department of Energy and Environment\n5301 Northshore Drive\nNorth Little Rock, AR 72118",
    notes:
      "Arkansas FOIA law covers all state and local government records. No geoengineering bill yet. Use FOIA to request weather modification permits and activities.",
  },
  {
    id: "fl-dep",
    name: "Florida Department of Environmental Protection",
    shortName: "Florida DEP",
    level: "state",
    state: "Florida",
    address:
      "Florida Department of Environmental Protection\n3900 Commonwealth Boulevard\nTallahassee, FL 32399",
    foiaUrl: "https://floridadep.gov/ogc/ogc/content/public-records-requests",
    notes:
      "Florida banned geoengineering with felony penalties (SB 56). DEP handles enforcement. Citizens can file complaints.",
  },
];

// ============================================================
// FOIA TEMPLATES
// ============================================================

export const FOIA_TEMPLATES: FoiaTemplate[] = [
  {
    id: "weather-mod-permits",
    topic: "Weather Modification Permits & Activities",
    description:
      "Request all weather modification permits, applications, and activity reports filed in your state or region.",
    agencyIds: [
      "noaa",
      "tx-deq",
      "co-cwcb",
      "id-deq",
      "nd-wmc",
      "ar-deq",
      "fl-dep",
    ],
    documentRequests: [
      "All weather modification activity reports filed pursuant to the Weather Modification Reporting Act of 1972 (Public Law 92-205) for the period of January 1, 2020 to the present",
      "All weather modification permits, applications, and renewal applications for the same period",
      "All correspondence between the agency and weather modification operators, including but not limited to Weather Modification International, North American Weather Consultants, and any other permitted operators",
      "All complaints received regarding weather modification activities for the same period",
      "All enforcement actions taken regarding weather modification activities for the same period",
    ],
    legalCitations: [
      "Freedom of Information Act, 5 U.S.C. \u00a7 552",
      "Weather Modification Reporting Act of 1972, Public Law 92-205",
    ],
    tips: "NOAA is required to collect these reports but the GAO found a 78% error rate. Your FOIA may uncover reports that were filed but never properly reviewed.",
  },
  {
    id: "cloud-seeding-flights",
    topic: "Cloud Seeding Flight Data",
    description:
      "Request flight logs, routes, and dispersal records for cloud seeding aircraft operating in your area.",
    agencyIds: ["faa", "noaa", "tx-deq", "co-cwcb", "id-deq", "nd-wmc"],
    documentRequests: [
      "All flight plans, flight logs, and ADS-B data for aircraft operated by or on behalf of weather modification companies operating in [STATE/REGION] from January 1, 2023 to the present",
      "All records identifying the tail numbers, registration numbers, and operators of aircraft used for weather modification purposes in [STATE/REGION]",
      "All dispersal logs, seeding agent records, and chemical manifests for cloud seeding operations in [STATE/REGION] for the same period",
      "All contracts between government agencies and weather modification operators for operations in [STATE/REGION]",
    ],
    legalCitations: [
      "Freedom of Information Act, 5 U.S.C. \u00a7 552",
      "Federal Aviation Regulations, 14 CFR",
    ],
    tips: "Cross-reference the tail numbers you receive with the FAA registry (which SkyLedger already does) to identify the operators. This is how you connect flights to companies.",
  },
  {
    id: "geoengineering-research-funding",
    topic: "Geoengineering Research Grants & Funding",
    description:
      "Request records of government-funded geoengineering and stratospheric aerosol injection research.",
    agencyIds: ["nsf", "doe", "noaa", "epa"],
    documentRequests: [
      "All grant applications, awards, and funding records related to solar radiation management, stratospheric aerosol injection, solar geoengineering, or cloud brightening from January 1, 2018 to the present",
      "All research proposals and reports funded by the agency relating to the injection, dispersal, or deployment of reflective particles, aerosols, or other substances into the stratosphere or troposphere for climate modification purposes",
      "All internal memoranda, briefings, and communications regarding geoengineering, solar radiation management, or weather modification research and policy",
      "All records of the NOAA SABRE (Stratospheric Aerosol processes, Budget and Radiative Effects) program, including funding, research outputs, and participating institutions",
    ],
    legalCitations: [
      "Freedom of Information Act, 5 U.S.C. \u00a7 552",
    ],
    tips: "ICAN's FOIA already uncovered a $400K NSF grant for SAI research. There may be more. Cast a wide net with 'solar radiation management' and 'stratospheric aerosol' as search terms.",
  },
  {
    id: "noaa-activity-reports",
    topic: "NOAA Weather Modification Activity Reports Database",
    description:
      "Request the complete NOAA weather modification activity reports database for your state.",
    agencyIds: ["noaa"],
    documentRequests: [
      "The complete set of weather modification activity reports filed with NOAA for activities conducted in [STATE] from January 1, 2000 to the present, including both initial notification reports and final activity reports",
      "All records of weather modification activities reported to NOAA that were found to contain errors or missing information, as referenced in GAO Report GAO-26-108013",
      "All records of weather modification activities that NOAA is aware of but for which no reports were filed",
      "All correspondence between NOAA and weather modification operators regarding reporting compliance",
    ],
    legalCitations: [
      "Freedom of Information Act, 5 U.S.C. \u00a7 552",
      "Weather Modification Reporting Act of 1972",
      "GAO Report GAO-26-108013",
    ],
    tips: "The GAO found NOAA makes 'no effort to seek out unreported weather modification experiments.' Your FOIA may reveal activities that were never properly reported.",
  },
  {
    id: "atmospheric-sampling",
    topic: "Atmospheric Sampling & Monitoring Data",
    description:
      "Request government atmospheric monitoring data, particularly for metals and aerosols.",
    agencyIds: ["epa", "noaa"],
    documentRequests: [
      "All atmospheric particulate matter sampling data, including PM2.5 and PM10 measurements, from monitoring stations in [STATE/REGION] from January 1, 2020 to the present",
      "All records of atmospheric sampling that tested for or detected aluminum, barium, strontium, or silver iodide in air, rain, snow, or soil samples",
      "All correspondence or reports regarding unusual or unexplained elevated levels of metallic compounds in atmospheric or precipitation samples",
      "All records related to the EPA's review of contrails and geoengineering as ordered by Administrator Zeldin",
    ],
    legalCitations: [
      "Freedom of Information Act, 5 U.S.C. \u00a7 552",
      "Clean Air Act, 42 U.S.C. \u00a7 7401 et seq.",
    ],
    tips: "EPA Administrator Zeldin ordered the agency to compile everything they know about contrails and geoengineering. FOIA the results.",
  },
  {
    id: "military-weather-mod",
    topic: "Military Weather Modification Programs",
    description:
      "Request records of DOD/Air Force weather modification research, operations, and capabilities.",
    agencyIds: ["dod"],
    documentRequests: [
      "All records, reports, and assessments regarding weather modification capabilities, research, or programs from January 1, 2015 to the present",
      "All records related to follow-up or implementation of concepts described in the 1996 Air Force report 'Weather as a Force Multiplier: Owning the Weather in 2025'",
      "All contracts, grants, or cooperative agreements with private companies for weather modification, atmospheric modification, or related research from January 1, 2018 to the present",
      "All records of coordination between DOD and civilian agencies (NOAA, EPA, NSF) regarding weather modification activities",
    ],
    legalCitations: [
      "Freedom of Information Act, 5 U.S.C. \u00a7 552",
    ],
    tips: "DOD requests take longer and may invoke national security exemptions. Be specific. Expect partial redactions but request everything \u2014 the redactions themselves are informative.",
  },
  {
    id: "state-permits",
    topic: "State Weather Modification Permits",
    description:
      "Request state-level permits and approvals for weather modification operations.",
    agencyIds: ["tx-deq", "co-cwcb", "id-deq", "nd-wmc", "ar-deq", "fl-dep"],
    documentRequests: [
      "All weather modification permits issued by the state from January 1, 2020 to the present",
      "All applications for weather modification permits, whether approved or denied, for the same period",
      "All environmental impact assessments or environmental reviews conducted in connection with weather modification permits",
      "All public comments received regarding weather modification permits or activities",
      "All records of payments, contracts, or agreements between the state and weather modification operators",
    ],
    legalCitations: [
      "State open records / public records law (varies by state)",
    ],
    tips: "State FOIA laws vary. Most require a response within 5-10 business days. If denied, you have the right to appeal.",
  },
];

// ============================================================
// FOIA LETTER GENERATOR
// ============================================================

export function generateFoiaLetter(params: {
  agency: FoiaAgency;
  template: FoiaTemplate;
  name: string;
  address: string;
  stateOrRegion?: string;
}): string {
  const { agency, template, name, address, stateOrRegion } = params;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stateText = stateOrRegion || agency.state || "the United States";

  const requests = template.documentRequests
    .map(
      (r, i) =>
        `${i + 1}. ${r.replace("[STATE/REGION]", stateText).replace("[STATE]", stateText)}`
    )
    .join("\n\n");

  const citations = template.legalCitations
    .map((c) => `- ${c}`)
    .join("\n");

  const isFederal = agency.level === "federal";
  const foiaLaw = isFederal
    ? "the Freedom of Information Act, 5 U.S.C. \u00a7 552"
    : "the applicable state public records law";

  return `${date}

${agency.address}
${agency.foiaEmail ? `Email: ${agency.foiaEmail}` : ""}

RE: ${isFederal ? "Freedom of Information Act" : "Public Records"} Request

Dear FOIA Officer:

Pursuant to ${foiaLaw}, I am requesting access to and copies of the following records:

${requests}

LEGAL BASIS:
${citations}

FEE WAIVER REQUEST:
I request a waiver of all fees associated with this request. Disclosure of the requested information is in the public interest because it will contribute significantly to public understanding of government operations and activities related to weather modification and atmospheric intervention programs. This information is not primarily in my commercial interest.

RESPONSE TIMELINE:
${isFederal ? "I expect a response within 20 business days as required by FOIA." : "I expect a response within the timeframe required by state law."}

If any portion of this request is denied, please provide a detailed justification for the denial, including the specific exemption(s) claimed, and release all reasonably segregable non-exempt portions.

FORMAT:
I prefer to receive documents in electronic format (PDF) via email if possible.

Thank you for your prompt attention to this request.

Sincerely,

${name}
${address}`;
}
