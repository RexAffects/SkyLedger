/**
 * Network Matching Layer — Public API.
 *
 * Cross-references FAA aircraft owner names against a knowledge graph
 * of weather modification companies, their investors, executives,
 * subsidiaries, and connected entities.
 *
 * Usage:
 *   import { matchOwnerName } from "@/lib/network";
 *   const result = matchOwnerName("LOWERCARBON CAPITAL LLC");
 */

import { buildNetworkIndex } from "./build-index";
import { matchOwnerName as _matchOwnerName } from "./match";
import type { NetworkMatchResult } from "./types";

// Build the index once at module load (in-memory, <1ms, ~100-300 entries)
const INDEX = buildNetworkIndex();

/**
 * Match an FAA-registered owner name against the weather modification
 * funding network. Returns matches with confidence levels.
 *
 * Fast: runs in <5ms against the in-memory index.
 */
export function matchOwnerName(ownerName: string): NetworkMatchResult {
  return _matchOwnerName(ownerName, INDEX);
}

/**
 * Get the number of indexed entities (for diagnostics).
 */
export function getIndexSize(): {
  entities: number;
  exactKeys: number;
  tokenKeys: number;
} {
  return {
    entities: INDEX.all.length,
    exactKeys: INDEX.exact.size,
    tokenKeys: INDEX.tokens.size,
  };
}

// Re-export types
export type {
  NetworkMatchResult,
  NetworkMatch,
  NetworkEntity,
  MatchConfidence,
  EntityType,
} from "./types";
