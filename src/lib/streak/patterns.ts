/**
 * Streak Pattern Analysis
 *
 * Computes statistical patterns from streak correlation data over time.
 * Used by the admin dashboard to surface operators/aircraft that appear
 * disproportionately in streak reports relative to their traffic share.
 *
 * Key metric: correlation ratio
 *   = (appearances in streak reports) / (total flights through area)
 *
 * An operator with a high ratio relative to their traffic share is
 * statistically anomalous and worth watching.
 */

import { getOperatorCorrelations, getStreakStats } from "@/lib/supabase/streak";

export interface OperatorPattern {
  operator: string;
  tail_number: string | null;
  icao_hex: string;
  streak_appearances: number;
  is_known_operator: boolean;
  avg_altitude_ft: number;
  altitude_tier: string;
  first_correlated: string;
  last_correlated: string;
  days_active: number;
  significance: "low" | "medium" | "high";
}

export interface PatternSummary {
  totalReports: number;
  thisWeek: number;
  totalMatchedFlights: number;
  avgMatchesPerReport: number;
  topPatternTypes: Record<string, number>;
  correlationStatuses: Record<string, number>;
  operatorPatterns: OperatorPattern[];
  anomalies: AnomalyFlag[];
}

export interface AnomalyFlag {
  type: string;
  description: string;
  icao_hex: string;
  operator: string;
  tail_number: string | null;
  streak_appearances: number;
}

/**
 * Determine significance level based on appearance count.
 * More reports = higher confidence in the pattern.
 */
function assessSignificance(
  appearances: number,
  totalReports: number
): "low" | "medium" | "high" {
  if (totalReports < 5) return "low"; // Not enough data

  const ratio = appearances / totalReports;

  // High: appears in 20%+ of all reports AND at least 5 appearances
  if (ratio >= 0.2 && appearances >= 5) return "high";

  // Medium: appears in 10%+ of reports AND at least 3 appearances
  if (ratio >= 0.1 && appearances >= 3) return "medium";

  return "low";
}

/**
 * Classify altitude tier from average altitude.
 */
function classifyAltitude(avgAlt: number): string {
  if (avgAlt >= 25000) return "Contrail zone (>25,000 ft)";
  if (avgAlt >= 10000) return "Sub-contrail (10,000–25,000 ft)";
  return "Low altitude";
}

/**
 * Detect anomalous patterns worth flagging to admin.
 */
function detectAnomalies(
  patterns: OperatorPattern[],
  totalReports: number
): AnomalyFlag[] {
  const anomalies: AnomalyFlag[] = [];

  for (const p of patterns) {
    // Anomaly: high-frequency non-known operator
    if (p.streak_appearances >= 3 && !p.is_known_operator && p.significance !== "low") {
      anomalies.push({
        type: "repeat_unknown",
        description: `Unknown operator appears in ${p.streak_appearances} of ${totalReports} streak reports`,
        icao_hex: p.icao_hex,
        operator: p.operator,
        tail_number: p.tail_number,
        streak_appearances: p.streak_appearances,
      });
    }

    // Anomaly: sub-contrail altitude with high frequency
    if (p.avg_altitude_ft > 0 && p.avg_altitude_ft < 25000 && p.streak_appearances >= 2) {
      anomalies.push({
        type: "sub_contrail_repeat",
        description: `Aircraft at ${p.avg_altitude_ft.toLocaleString()} ft (below contrail zone) appears in ${p.streak_appearances} streak reports`,
        icao_hex: p.icao_hex,
        operator: p.operator,
        tail_number: p.tail_number,
        streak_appearances: p.streak_appearances,
      });
    }

    // Anomaly: known operator appearing frequently
    if (p.is_known_operator && p.streak_appearances >= 2) {
      anomalies.push({
        type: "known_operator_active",
        description: `Known weather mod operator correlated with ${p.streak_appearances} streak reports`,
        icao_hex: p.icao_hex,
        operator: p.operator,
        tail_number: p.tail_number,
        streak_appearances: p.streak_appearances,
      });
    }
  }

  // Sort by streak appearances descending
  return anomalies.sort((a, b) => b.streak_appearances - a.streak_appearances);
}

/**
 * Build the full pattern analysis for the admin dashboard.
 */
export async function analyzePatterns(): Promise<PatternSummary> {
  const [stats, correlations] = await Promise.all([
    getStreakStats(),
    getOperatorCorrelations(),
  ]);

  const operatorPatterns: OperatorPattern[] = correlations.map((c) => {
    const daysDiff = Math.max(
      1,
      Math.ceil(
        (new Date(c.last_correlated).getTime() - new Date(c.first_correlated).getTime()) /
          (24 * 60 * 60 * 1000)
      )
    );

    return {
      operator: c.operator,
      tail_number: c.tail_number,
      icao_hex: c.icao_hex,
      streak_appearances: c.streak_appearances,
      is_known_operator: c.is_known_operator,
      avg_altitude_ft: c.avg_altitude_ft,
      altitude_tier: classifyAltitude(c.avg_altitude_ft),
      first_correlated: c.first_correlated,
      last_correlated: c.last_correlated,
      days_active: daysDiff,
      significance: assessSignificance(c.streak_appearances, stats.totalReports),
    };
  });

  const anomalies = detectAnomalies(operatorPatterns, stats.totalReports);

  return {
    ...stats,
    operatorPatterns,
    anomalies,
  };
}
