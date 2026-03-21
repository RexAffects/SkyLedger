/**
 * LLC Detection Utility
 *
 * Detects corporate entities (LLC, Corp, Trust, etc.) in FAA owner names
 * and provides state Secretary of State registry URLs for manual lookup.
 */

export interface LLCDetection {
  isLLC: boolean;
  entityType: string | null; // llc, corp, trust, lp, llp, inc, ltd, holdings
  registrationState: string | null;
}

// Entity type patterns — order matters (check longer patterns first)
const ENTITY_PATTERNS: [RegExp, string][] = [
  [/\bHOLDINGS\b/i, "holdings"],
  [/\bTRUST\b/i, "trust"],
  [/\bL\.?L\.?P\.?\b/i, "llp"],
  [/\bL\.?L\.?C\.?\b/i, "llc"],
  [/\bL\.?P\.?\b/i, "lp"],
  [/\bL\.?T\.?D\.?\b/i, "ltd"],
  [/\bINC\.?\b/i, "inc"],
  [/\bCORP\.?\b/i, "corp"],
  [/\bCORPORATION\b/i, "corp"],
  [/\bENTERPRISES\b/i, "corp"],
  [/\bGROUP\b/i, "corp"],
  [/\bPARTNERS\b/i, "lp"],
  [/\bAVIATION\s+(LLC|INC|CORP|LTD)\b/i, "llc"],
];

// Known airlines and major carriers — these are NOT suspicious LLCs
const KNOWN_AIRLINES = new Set([
  "DELTA AIR LINES",
  "SOUTHWEST AIRLINES",
  "AMERICAN AIRLINES",
  "UNITED AIRLINES",
  "UNITED PARCEL SERVICE",
  "FEDERAL EXPRESS",
  "FEDEX",
  "UPS",
  "ALASKA AIRLINES",
  "JETBLUE AIRWAYS",
  "SPIRIT AIRLINES",
  "FRONTIER AIRLINES",
  "ALLEGIANT AIR",
  "HAWAIIAN AIRLINES",
  "SUN COUNTRY",
  "REPUBLIC AIRWAYS",
  "SKYWEST AIRLINES",
  "ENVOY AIR",
  "PSA AIRLINES",
  "MESA AIRLINES",
  "ENDEAVOR AIR",
  "PIEDMONT AIRLINES",
  "COMMUTAIR",
  "ATLAS AIR",
  "KALITTA AIR",
  "ABX AIR",
  "BOEING",
  "AIRBUS",
  "LOCKHEED",
  "NORTHROP",
  "RAYTHEON",
  "TEXTRON",
  "GENERAL DYNAMICS",
  "US GOVERNMENT",
  "UNITED STATES",
  "DEPARTMENT OF",
  "US DEPT OF",
  "USDA",
  "BANK OF AMERICA",
  "WELLS FARGO",
  "JPMORGAN",
  "CITIBANK",
]);

/**
 * Detect if an FAA owner name is a corporate entity (LLC, Corp, Trust, etc.)
 */
export function detectLLC(
  ownerName: string,
  ownerState?: string
): LLCDetection {
  if (!ownerName) {
    return { isLLC: false, entityType: null, registrationState: null };
  }

  const upper = ownerName.toUpperCase().trim();

  // Skip known airlines and government entities
  for (const airline of KNOWN_AIRLINES) {
    if (upper.includes(airline)) {
      return { isLLC: false, entityType: null, registrationState: null };
    }
  }

  // Check entity patterns
  for (const [pattern, entityType] of ENTITY_PATTERNS) {
    if (pattern.test(upper)) {
      return {
        isLLC: true,
        entityType,
        registrationState: ownerState || null,
      };
    }
  }

  return { isLLC: false, entityType: null, registrationState: null };
}

/**
 * State Secretary of State business search URLs.
 * Returns the URL where you can search for a business entity in that state.
 */
const STATE_REGISTRY_URLS: Record<string, string> = {
  AL: "https://arc-sos.state.al.us/cgi/corpname.mbr/output",
  AK: "https://www.commerce.alaska.gov/cbp/main/Search/Entities",
  AZ: "https://ecorp.azcc.gov/EntitySearch/Index",
  AR: "https://www.sos.arkansas.gov/corps/search_all.php",
  CA: "https://bizfileonline.sos.ca.gov/search/business",
  CO: "https://www.sos.state.co.us/biz/BusinessEntityCriteriaExt.do",
  CT: "https://service.ct.gov/business/s/onlinebusinesssearch",
  DE: "https://icis.corp.delaware.gov/ecorp/entitysearch/namesearch.aspx",
  FL: "https://search.sunbiz.org/Inquiry/CorporationSearch/ByName",
  GA: "https://ecorp.sos.ga.gov/BusinessSearch",
  HI: "https://hbe.ehawaii.gov/documents/search.html",
  ID: "https://sosbiz.idaho.gov/search/business",
  IL: "https://www.ilsos.gov/corporatellc/CorporateLlcController",
  IN: "https://bsd.sos.in.gov/PublicBusinessSearch",
  IA: "https://sos.iowa.gov/search/business/(S(0))/search.aspx",
  KS: "https://www.kansas.gov/bess/flow/main?execution=e1s1",
  KY: "https://web.sos.ky.gov/bussearchnprofile/search",
  LA: "https://coraweb.sos.la.gov/CommercialSearch/CommercialSearch.aspx",
  ME: "https://icrs.informe.org/nei-sos-icrs/ICRS",
  MD: "https://egov.maryland.gov/BusinessExpress/EntitySearch",
  MA: "https://corp.sec.state.ma.us/corpweb/CorpSearch/CorpSearch.aspx",
  MI: "https://cofs.lara.state.mi.us/SearchApi/Search/Search",
  MN: "https://mblsportal.sos.state.mn.us/Business/Search",
  MS: "https://corp.sos.ms.gov/corp/portal/c/page/corpBusinessIdSearch/portal.aspx",
  MO: "https://bsd.sos.mo.gov/BusinessEntity/BESearch.aspx",
  MT: "https://biz.sosmt.gov/search",
  NE: "https://www.nebraska.gov/sos/corp/corpsearch.cgi",
  NV: "https://esos.nv.gov/EntitySearch/OnlineEntitySearch",
  NH: "https://quickstart.sos.nh.gov/online/BusinessInquire",
  NJ: "https://www.njportal.com/DOR/BusinessNameSearch",
  NM: "https://portal.sos.state.nm.us/BFS/online/CorporationBusinessSearch",
  NY: "https://appext20.dos.ny.gov/corp_public/CORPSEARCH.ENTITY_SEARCH_ENTRY",
  NC: "https://www.sosnc.gov/online_services/search/by_title/_Business_Registration",
  ND: "https://firststop.sos.nd.gov/search/business",
  OH: "https://businesssearch.ohiosos.gov",
  OK: "https://www.sos.ok.gov/corp/corpInquiryFind.aspx",
  OR: "https://sos.oregon.gov/business/pages/find.aspx",
  PA: "https://www.corporations.pa.gov/search/corpsearch",
  RI: "https://business.sos.ri.gov/CorpWeb/CorpSearch/CorpSearch.aspx",
  SC: "https://businessfilings.sc.gov/BusinessFiling/Entity/Search",
  SD: "https://sosenterprise.sd.gov/BusinessServices/Business/FilingSearch.aspx",
  TN: "https://tnbear.tn.gov/Ecommerce/FilingSearch.aspx",
  TX: "https://mycpa.cpa.state.tx.us/coa/",
  UT: "https://secure.utah.gov/bes/index.html",
  VT: "https://bizfilings.vermont.gov/online/BusinessInquire",
  VA: "https://cis.scc.virginia.gov/EntitySearch/Index",
  WA: "https://ccfs.sos.wa.gov/#/AdvancedSearch",
  WV: "https://apps.wv.gov/SOS/BusinessEntitySearch",
  WI: "https://www.wdfi.org/apps/CorpSearch/Search.aspx",
  WY: "https://wyobiz.wyo.gov/Business/FilingSearch.aspx",
  DC: "https://corponline.dcra.dc.gov/Home.aspx/Search",
};

/**
 * Get the Secretary of State business search URL for a given state.
 */
export function getStateRegistryUrl(state: string): string | null {
  if (!state) return null;
  return STATE_REGISTRY_URLS[state.toUpperCase().trim()] || null;
}
