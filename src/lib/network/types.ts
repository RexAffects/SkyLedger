/**
 * Network Matching Layer — Type definitions.
 *
 * Cross-references FAA aircraft owner names against a knowledge graph
 * of weather modification companies, their investors, executives,
 * subsidiaries, and connected entities.
 */

export type EntityType =
  | "operator" // Direct weather mod operator (WMI, Rainmaker, etc.)
  | "investor-fund" // VC fund (Lowercarbon Capital, AWZ Ventures, etc.)
  | "investor-individual" // Individual investor (Peter Thiel, Chris Sacca)
  | "executive" // Named person at an operator
  | "corporate-investor" // Corporate investor (SolarEdge, Exor)
  | "connected-entity"; // Government bodies, lobbying orgs, research orgs

export type MatchConfidence =
  | "confirmed-operator" // Direct faaKeywords match — IS a WxMod operator
  | "connected-entity" // Known investor, executive, or fund in the network
  | "possible-connection"; // Fuzzy/partial match, needs investigation

export interface NetworkEntity {
  /** The primary searchable name (uppercased) */
  name: string;
  /** Alternative names / abbreviations */
  aliases: string[];
  /** What type of entity this is */
  type: EntityType;
  /** Human-readable description of the connection */
  description: string;
  /** Which operator(s) this connects to (slug references) */
  operatorSlugs: string[];
  /** Which network player(s) this connects to (slug references) */
  playerSlugs: string[];
  /** How this entity connects to weather modification */
  connectionPath: string;
}

export interface NetworkMatch {
  /** The entity that matched */
  entity: NetworkEntity;
  /** How confident the match is */
  confidence: MatchConfidence;
  /** What text in the owner name triggered the match */
  matchedText: string;
  /** Score for ranking (0-1) */
  score: number;
}

export interface NetworkMatchResult {
  /** The owner name that was searched */
  ownerName: string;
  /** Whether this is a confirmed weather modification operator */
  isConfirmedOperator: boolean;
  /** All network matches found, sorted by score */
  matches: NetworkMatch[];
  /** Summary text for the UI */
  summary: string | null;
  /** Whether additional investigation is recommended */
  needsInvestigation: boolean;
}
