/**
 * Network Index Builder.
 *
 * Extracts all matchable entity names from operators.ts and network.ts
 * into a searchable reverse index. Built once at module load time.
 */

import { OPERATORS } from "@/lib/data/operators";
import { PLAYERS, CONNECTIONS } from "@/lib/data/network";
import type { NetworkEntity, EntityType } from "./types";

export interface NetworkIndex {
  /** Exact match lookup: UPPERCASE name → NetworkEntity[] */
  exact: Map<string, NetworkEntity[]>;
  /** Token-based lookup: individual UPPERCASE words → NetworkEntity[] */
  tokens: Map<string, NetworkEntity[]>;
  /** All entities (for iteration) */
  all: NetworkEntity[];
}

/** Words too common to be meaningful as tokens */
const STOP_WORDS = new Set([
  "THE",
  "AND",
  "OF",
  "FOR",
  "IN",
  "AT",
  "BY",
  "LLC",
  "INC",
  "CORP",
  "LTD",
  "LP",
  "LLP",
  "CO",
  "GROUP",
  "HOLDINGS",
  "INTERNATIONAL",
  "TECHNOLOGIES",
  "SOLUTIONS",
  "PARTNERS",
  "ASSOCIATES",
  "TRUST",
  "FOUNDATION",
  "FUND",
  "VENTURES",
  "CAPITAL",
  "MANAGEMENT",
  "SERVICES",
  "COMPANY",
  "AVIATION",
  "AIR",
  "AIRLINES",
  "AIRWAYS",
  "FLIGHT",
  "FLYING",
  "AERO",
  "JET",
]);

/**
 * Parse compound names like "Chris Sacca / Lowercarbon Capital"
 * or "Boost VC (Adam Draper)" into separate name parts.
 */
function splitCompoundName(name: string): string[] {
  const parts: string[] = [name];

  // Split on " / "
  if (name.includes(" / ")) {
    parts.push(...name.split(" / ").map((p) => p.trim()));
  }

  // Extract parenthetical names: "Boost VC (Adam Draper)"
  const parenMatch = name.match(/^(.+?)\s*\((.+?)\)$/);
  if (parenMatch) {
    parts.push(parenMatch[1].trim());
    parts.push(parenMatch[2].trim());
  }

  return [...new Set(parts.filter((p) => p.length >= 3))];
}

/**
 * Generate name variations for matching.
 * Strips common suffixes, generates abbreviations.
 */
function generateAliases(name: string): string[] {
  const upper = name.toUpperCase().trim();
  const aliases: string[] = [upper];

  // Remove common suffixes
  const stripped = upper
    .replace(
      /\s+(LLC|INC|CORP|CORPORATION|LTD|LIMITED|LP|LLP|CO|COMPANY|HOLDINGS|TECHNOLOGIES|VENTURES|CAPITAL|PARTNERS|FUND)\s*\.?\s*$/g,
      ""
    )
    .trim();
  if (stripped !== upper && stripped.length >= 3) {
    aliases.push(stripped);
  }

  // Remove "THE " prefix
  if (upper.startsWith("THE ")) {
    aliases.push(upper.slice(4));
  }

  // Generate abbreviation from multi-word names (3+ words)
  const words = upper.split(/\s+/).filter((w) => !STOP_WORDS.has(w));
  if (words.length >= 2) {
    const abbr = words.map((w) => w[0]).join("");
    if (abbr.length >= 2 && abbr.length <= 5) {
      aliases.push(abbr);
    }
  }

  return [...new Set(aliases)];
}

/**
 * Create a NetworkEntity from extracted data.
 */
function makeEntity(
  name: string,
  type: EntityType,
  description: string,
  operatorSlugs: string[],
  playerSlugs: string[],
  connectionPath: string
): NetworkEntity {
  const upper = name.toUpperCase().trim();
  const allParts = splitCompoundName(upper);
  const allAliases: string[] = [];
  for (const part of allParts) {
    allAliases.push(...generateAliases(part));
  }

  return {
    name: upper,
    aliases: [...new Set(allAliases)],
    type,
    description,
    operatorSlugs: [...new Set(operatorSlugs)],
    playerSlugs: [...new Set(playerSlugs)],
    connectionPath,
  };
}

/**
 * Build the complete network index from operators and network data.
 */
export function buildNetworkIndex(): NetworkIndex {
  const entityMap = new Map<string, NetworkEntity>();

  // Helper: merge into existing entity or create new
  function addEntity(entity: NetworkEntity) {
    const key = entity.name;
    const existing = entityMap.get(key);
    if (existing) {
      // Merge slugs
      existing.operatorSlugs.push(...entity.operatorSlugs);
      existing.operatorSlugs = [...new Set(existing.operatorSlugs)];
      existing.playerSlugs.push(...entity.playerSlugs);
      existing.playerSlugs = [...new Set(existing.playerSlugs)];
      // Keep the more specific type
      if (entity.type === "operator") existing.type = "operator";
      // Merge aliases
      existing.aliases = [...new Set([...existing.aliases, ...entity.aliases])];
    } else {
      entityMap.set(key, entity);
    }
  }

  // ── Extract from OPERATORS ──

  for (const op of OPERATORS) {
    // 1. Operator name + faaKeywords
    addEntity(
      makeEntity(
        op.name,
        "operator",
        `${op.name} — ${op.description.split(".")[0]}`,
        [op.slug],
        [],
        `Direct operator: ${op.name}`
      )
    );

    // Also index faaKeywords as separate entries pointing to same operator
    for (const keyword of op.faaKeywords) {
      if (keyword.length >= 3) {
        addEntity(
          makeEntity(
            keyword,
            "operator",
            `${op.name} — ${op.description.split(".")[0]}`,
            [op.slug],
            [],
            `Direct operator: ${op.name}`
          )
        );
      }
    }

    // 2. People (executives, founders, scientists)
    for (const person of op.people) {
      if (person.name.length < 4) continue;
      addEntity(
        makeEntity(
          person.name,
          "executive",
          `${person.role} at ${op.name}`,
          [op.slug],
          [],
          `${person.role} at ${op.name}`
        )
      );
    }

    // 3. Investors from funding rounds
    for (const round of op.funding) {
      for (const investor of round.investors) {
        const nameParts = splitCompoundName(investor.name);
        for (const part of nameParts) {
          if (part.length < 4) continue;
          const investorType: EntityType =
            investor.type === "vc" || investor.type === "foundation"
              ? "investor-fund"
              : investor.type === "individual"
                ? "investor-individual"
                : investor.type === "corporate"
                  ? "corporate-investor"
                  : "connected-entity";

          addEntity(
            makeEntity(
              part,
              investorType,
              `${investor.name} — invested in ${op.name} (${round.type}, ${round.date})`,
              [op.slug],
              [],
              `Investor in ${op.name} (${round.type})`
            )
          );
        }
      }
    }

    // 4. Connections (government partners, advisors, etc.)
    for (const conn of op.connections) {
      if (conn.entity.length < 4) continue;
      addEntity(
        makeEntity(
          conn.entity,
          "connected-entity",
          `${conn.entity} — ${conn.relationship}`,
          [op.slug],
          [],
          `${conn.relationship}`
        )
      );
    }
  }

  // ── Extract from NETWORK PLAYERS ──

  for (const player of PLAYERS) {
    const nameParts = splitCompoundName(player.name);
    const pType: EntityType =
      player.type === "fund" || player.type === "defense-vc"
        ? "investor-fund"
        : player.type === "individual"
          ? "investor-individual"
          : player.type === "corporate"
            ? "corporate-investor"
            : "connected-entity";

    for (const part of nameParts) {
      if (part.length < 3) continue;
      addEntity(
        makeEntity(
          part,
          pType,
          player.tagline,
          player.operatorSlug ? [player.operatorSlug] : [],
          [player.slug],
          `Network player: ${player.name}`
        )
      );
    }

    // Also add shortName if different
    if (
      player.shortName &&
      player.shortName.length >= 3 &&
      player.shortName.toUpperCase() !== player.name.toUpperCase()
    ) {
      addEntity(
        makeEntity(
          player.shortName,
          pType,
          player.tagline,
          player.operatorSlug ? [player.operatorSlug] : [],
          [player.slug],
          `Network player: ${player.name}`
        )
      );
    }
  }

  // ── Extract from NETWORK CONNECTIONS ──
  // These capture relationship edges that may reference entities
  // not already indexed (e.g., "MAFAT", "Mega Group", "Epstein")

  for (const conn of CONNECTIONS) {
    // "from" and "to" are shortNames — usually already indexed via PLAYERS
    // But some targets aren't players (e.g., "Stardust", "Trump", "Epstein")
    // We don't index those as matchable entities — they're contextual.
  }

  // ── Build lookup structures ──

  const exact = new Map<string, NetworkEntity[]>();
  const tokens = new Map<string, NetworkEntity[]>();
  const all = Array.from(entityMap.values());

  for (const entity of all) {
    // Index every alias in the exact map
    for (const alias of entity.aliases) {
      const existing = exact.get(alias) || [];
      existing.push(entity);
      exact.set(alias, existing);
    }

    // Index significant tokens
    for (const alias of entity.aliases) {
      const words = alias.split(/\s+/);
      for (const word of words) {
        if (word.length < 3 || STOP_WORDS.has(word)) continue;
        const existing = tokens.get(word) || [];
        existing.push(entity);
        tokens.set(word, existing);
      }
    }
  }

  return { exact, tokens, all };
}
