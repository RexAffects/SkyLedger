/**
 * FAA Aircraft Registry lookup.
 *
 * The FAA publishes the entire registry as downloadable CSVs at:
 * https://registry.faa.gov/database/ReleasableAircraft.zip
 *
 * For real-time lookups without a local database, we use the
 * FAA registry web search and parse the results.
 *
 * Known weather modification operators to flag:
 */

import { getCachedRegistration, cacheRegistration } from "@/lib/supabase/faa-cache";
import { detectLLC, getStateRegistryUrl, type LLCDetection } from "@/lib/utils/llc-detect";
import { matchOwnerName, type NetworkMatchResult } from "@/lib/network";

export interface FAARegistration {
  tailNumber: string;
  serialNumber: string;
  make: string;
  model: string;
  year: string;
  ownerName: string;
  ownerStreet: string;
  ownerCity: string;
  ownerState: string;
  ownerZip: string;
  ownerCountry: string;
  registrationType: string;
  status: string;
  isKnownWeatherMod: boolean;
  operatorNotes: string;
  llcDetection?: LLCDetection & { stateRegistryUrl: string | null };
  networkMatch?: NetworkMatchResult;
}

// Known weather modification operators — built from canonical data in operators.ts
import { buildWxModLookup } from "@/lib/data/operators";
const KNOWN_WX_MOD_OPERATORS: Record<string, string> = buildWxModLookup();

/**
 * Look up aircraft registration by tail number.
 * Cache-first: checks Supabase faa_cache before scraping FAA.
 * Also runs LLC detection on the owner name.
 */
export async function lookupTailNumber(
  tailNumber: string
): Promise<FAARegistration | null> {
  const cleaned = tailNumber.toUpperCase().replace(/^N/, "");
  const normalizedTail = `N${cleaned}`;

  // 1. Check cache first
  try {
    const cached = await getCachedRegistration(normalizedTail);
    if (cached) {
      // Re-run LLC detection on cached data (cheap, ensures fresh patterns)
      return attachLLCDetection(cached);
    }
  } catch {
    // Cache miss or error — continue to FAA scrape
  }

  // 2. Cache miss — scrape FAA
  try {
    const url = `https://registry.faa.gov/AircraftInquiry/Search/NNumberResult?nNumberTxt=${normalizedTail}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "SkyLedger/1.0 (citizen transparency platform)",
      },
    });

    if (!res.ok) return null;

    const html = await res.text();
    const registration = parseRegistrationHTML(html, normalizedTail);

    if (!registration) return null;

    // 3. Store in cache (fire-and-forget)
    cacheRegistration(normalizedTail, registration).catch(() => {});

    // 4. Attach LLC detection
    return attachLLCDetection(registration);
  } catch {
    return null;
  }
}

/**
 * Attach LLC detection info to an FAA registration.
 */
function attachLLCDetection(reg: FAARegistration): FAARegistration {
  const detection = detectLLC(reg.ownerName, reg.ownerState);
  const stateRegistryUrl = detection.registrationState
    ? getStateRegistryUrl(detection.registrationState)
    : null;

  // Run network matching against the owner name
  const networkMatch = reg.ownerName
    ? matchOwnerName(reg.ownerName)
    : undefined;

  return {
    ...reg,
    llcDetection: { ...detection, stateRegistryUrl },
    networkMatch: networkMatch?.matches.length ? networkMatch : undefined,
  };
}

function parseRegistrationHTML(
  html: string,
  tailNumber: string
): FAARegistration | null {
  // Extract data from the FAA HTML tables
  const extract = (label: string): string => {
    // Look for table cells with the label followed by the value
    const patterns = [
      new RegExp(`${label}[^<]*</td>\\s*<td[^>]*>([^<]+)</td>`, "i"),
      new RegExp(`${label}[^<]*</label>\\s*<span[^>]*>([^<]+)</span>`, "i"),
      new RegExp(`"${label}"[^>]*>([^<]+)<`, "i"),
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) return match[1].trim();
    }
    return "";
  };

  const ownerName = extract("Name") || extract("name");

  // If we couldn't parse any data, return basic info
  if (!ownerName && !html.includes("NNumberResult")) {
    return null;
  }

  // Check if this is a known weather modification operator
  let isKnownWeatherMod = false;
  let operatorNotes = "";
  const upperOwner = ownerName.toUpperCase();

  for (const [keyword, notes] of Object.entries(KNOWN_WX_MOD_OPERATORS)) {
    if (upperOwner.includes(keyword)) {
      isKnownWeatherMod = true;
      operatorNotes = notes;
      break;
    }
  }

  return {
    tailNumber,
    serialNumber: extract("Serial Number"),
    make: extract("Manufacturer"),
    model: extract("Model"),
    year: extract("Year"),
    ownerName,
    ownerStreet: extract("Street"),
    ownerCity: extract("City"),
    ownerState: extract("State"),
    ownerZip: extract("Zip"),
    ownerCountry: extract("Country") || "US",
    registrationType: extract("Type Registration"),
    status: extract("Status"),
    isKnownWeatherMod,
    operatorNotes,
  };
}

/**
 * Check if an owner name matches known weather modification operators.
 */
export function checkWeatherModOperator(ownerName: string): {
  isMatch: boolean;
  notes: string;
} {
  const upper = ownerName.toUpperCase();
  for (const [keyword, notes] of Object.entries(KNOWN_WX_MOD_OPERATORS)) {
    if (upper.includes(keyword)) {
      return { isMatch: true, notes };
    }
  }
  return { isMatch: false, notes: "" };
}
