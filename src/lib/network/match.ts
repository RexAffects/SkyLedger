/**
 * Network Matching Engine.
 *
 * Takes an FAA owner name and runs it through exact, containment,
 * token-overlap, and fuzzy matching against the network index.
 */

import type { NetworkIndex } from "./build-index";
import type {
  NetworkMatch,
  NetworkMatchResult,
  MatchConfidence,
} from "./types";
import { OPERATORS } from "@/lib/data/operators";

/** Known airlines — skip network matching entirely for these */
const AIRLINE_KEYWORDS = [
  "SOUTHWEST",
  "DELTA",
  "UNITED",
  "AMERICAN AIRLINES",
  "JETBLUE",
  "SPIRIT",
  "FRONTIER",
  "ALASKA AIR",
  "HAWAIIAN",
  "ALLEGIANT",
  "FEDEX",
  "UPS",
  "DHL",
  "ATLAS AIR",
  "REPUBLIC AIRWAYS",
  "SKYWEST",
  "MESA AIR",
  "ENVOY AIR",
  "PSA AIRLINES",
  "ENDEAVOR AIR",
  "HORIZON AIR",
  "AIR CANADA",
  "WESTJET",
  "LUFTHANSA",
  "BRITISH AIRWAYS",
  "RYANAIR",
  "EASYJET",
];

/**
 * Simple Levenshtein distance for fuzzy matching.
 */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Normalize an owner name for matching.
 */
function normalize(name: string): string {
  return name
    .toUpperCase()
    .replace(/[.,'"()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Build the set of faaKeywords for quick confirmed-operator check.
 */
function buildFaaKeywordSet(): Map<string, string> {
  const map = new Map<string, string>();
  for (const op of OPERATORS) {
    for (const kw of op.faaKeywords) {
      map.set(kw.toUpperCase(), op.slug);
    }
  }
  // Extra generic keywords
  map.set("SEEDING SOLUTIONS", "__generic_seeding");
  map.set("CLOUD SEEDING", "__generic_seeding");
  return map;
}

const FAA_KEYWORDS = buildFaaKeywordSet();

/**
 * Check if owner name is a known airline (skip matching).
 */
function isAirline(ownerName: string): boolean {
  const upper = ownerName.toUpperCase();
  return AIRLINE_KEYWORDS.some((kw) => upper.includes(kw));
}

/**
 * Match an FAA owner name against the network index.
 */
export function matchOwnerName(
  ownerName: string,
  index: NetworkIndex
): NetworkMatchResult {
  const empty: NetworkMatchResult = {
    ownerName,
    isConfirmedOperator: false,
    matches: [],
    summary: null,
    needsInvestigation: false,
  };

  if (!ownerName || ownerName.length < 2) return empty;

  // Skip airlines
  if (isAirline(ownerName)) return empty;

  const normalized = normalize(ownerName);
  const matches: NetworkMatch[] = [];
  const seen = new Set<string>(); // Dedupe by entity name

  // ── Step 1: Confirmed operator check (faaKeywords) ──

  for (const [keyword, slug] of FAA_KEYWORDS) {
    if (normalized.includes(keyword)) {
      // Find the matching entity in the index
      const entities = index.exact.get(keyword);
      if (entities) {
        for (const entity of entities) {
          if (entity.type === "operator" && !seen.has(entity.name)) {
            seen.add(entity.name);
            matches.push({
              entity,
              confidence: "confirmed-operator",
              matchedText: keyword,
              score: 1.0,
            });
          }
        }
      }
      // Even if no entity found, flag it
      if (matches.length === 0 && slug) {
        return {
          ownerName,
          isConfirmedOperator: true,
          matches: [],
          summary: `Confirmed weather modification operator (matched keyword: ${keyword})`,
          needsInvestigation: false,
        };
      }
    }
  }

  if (matches.some((m) => m.confidence === "confirmed-operator")) {
    return {
      ownerName,
      isConfirmedOperator: true,
      matches,
      summary: `Confirmed weather modification operator: ${matches[0].entity.description}`,
      needsInvestigation: false,
    };
  }

  // ── Step 2: Exact entity match ──

  const exactEntities = index.exact.get(normalized);
  if (exactEntities) {
    for (const entity of exactEntities) {
      if (!seen.has(entity.name)) {
        seen.add(entity.name);
        matches.push({
          entity,
          confidence: "connected-entity",
          matchedText: normalized,
          score: 0.95,
        });
      }
    }
  }

  // ── Step 3: Containment match ──
  // Check if owner name contains an entity name, or vice versa.
  // Only for entity names with 5+ characters to avoid false positives.

  for (const entity of index.all) {
    if (seen.has(entity.name)) continue;

    for (const alias of entity.aliases) {
      if (alias.length < 5) continue;

      if (normalized.includes(alias) || alias.includes(normalized)) {
        seen.add(entity.name);
        const score =
          Math.min(alias.length, normalized.length) /
          Math.max(alias.length, normalized.length);
        matches.push({
          entity,
          confidence: score > 0.7 ? "connected-entity" : "possible-connection",
          matchedText: alias,
          score: Math.min(0.9, score),
        });
        break;
      }
    }
  }

  // ── Step 4: Token overlap match ──
  // Tokenize owner name and look up each token.
  // Require 2+ matching tokens AND >50% overlap.

  const ownerTokens = normalized
    .split(/\s+/)
    .filter((t) => t.length >= 3);
  const tokenEntityScores = new Map<string, { entity: typeof index.all[0]; count: number; matchedTokens: string[] }>();

  for (const token of ownerTokens) {
    const tokenEntities = index.tokens.get(token);
    if (!tokenEntities) continue;

    for (const entity of tokenEntities) {
      if (seen.has(entity.name)) continue;
      const key = entity.name;
      const existing = tokenEntityScores.get(key);
      if (existing) {
        existing.count++;
        existing.matchedTokens.push(token);
      } else {
        tokenEntityScores.set(key, {
          entity,
          count: 1,
          matchedTokens: [token],
        });
      }
    }
  }

  for (const [, { entity, count, matchedTokens }] of tokenEntityScores) {
    if (count < 2) continue;
    // Calculate entity token count from its aliases
    const entityTokenCount = entity.name.split(/\s+/).length;
    const overlap = count / Math.max(ownerTokens.length, entityTokenCount);
    if (overlap < 0.4) continue;

    seen.add(entity.name);
    const confidence: MatchConfidence =
      overlap >= 0.6 ? "connected-entity" : "possible-connection";
    matches.push({
      entity,
      confidence,
      matchedText: matchedTokens.join(" "),
      score: Math.min(0.8, overlap),
    });
  }

  // ── Step 5: Fuzzy match (Levenshtein) ──
  // Only for longer, distinctive names. Very conservative.

  if (normalized.length >= 10 && matches.length === 0) {
    for (const entity of index.all) {
      if (seen.has(entity.name)) continue;
      // Only fuzzy-match entity names of similar length
      for (const alias of entity.aliases) {
        if (alias.length < 8) continue;
        if (Math.abs(alias.length - normalized.length) > 5) continue;

        const dist = levenshtein(normalized, alias);
        const maxAllowed = alias.length > 12 ? 2 : 1;

        if (dist <= maxAllowed) {
          seen.add(entity.name);
          matches.push({
            entity,
            confidence: "possible-connection",
            matchedText: alias,
            score: Math.max(0.3, 1 - dist / alias.length),
          });
          break;
        }
      }
    }
  }

  // ── Sort by score ──
  matches.sort((a, b) => b.score - a.score);

  // ── Build result ──
  const hasConnections = matches.some(
    (m) => m.confidence === "connected-entity"
  );
  const hasPossible = matches.some(
    (m) => m.confidence === "possible-connection"
  );

  let summary: string | null = null;
  if (hasConnections) {
    const topMatch = matches[0];
    summary = `Connected to weather modification network via ${topMatch.entity.connectionPath}`;
  } else if (hasPossible) {
    summary = "Possible connection detected — needs verification";
  }

  return {
    ownerName,
    isConfirmedOperator: false,
    matches,
    summary,
    needsInvestigation: hasPossible && !hasConnections,
  };
}
