"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OperatorPattern {
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

interface AnomalyFlag {
  type: string;
  description: string;
  icao_hex: string;
  operator: string;
  tail_number: string | null;
  streak_appearances: number;
}

interface PatternData {
  patterns: {
    totalReports: number;
    thisWeek: number;
    totalMatchedFlights: number;
    avgMatchesPerReport: number;
    topPatternTypes: Record<string, number>;
    correlationStatuses: Record<string, number>;
    operatorPatterns: OperatorPattern[];
    anomalies: AnomalyFlag[];
  };
  recent_reports: Array<{
    id: string;
    latitude: number;
    longitude: number;
    observed_at: string;
    estimated_age: string;
    pattern_type: string;
    severity: string;
    correlation_status: string;
    matched_flight_count: number;
    dark_aircraft_estimate: number | null;
    created_at: string;
  }>;
}

const significanceColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  low: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const anomalyIcons: Record<string, string> = {
  repeat_unknown: "?",
  sub_contrail_repeat: "!",
  known_operator_active: "!!",
};

export function StreakPatterns() {
  const [data, setData] = useState<PatternData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPatterns = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/streak/patterns");
      if (!res.ok) {
        setError("Failed to load pattern data");
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      setError("Network error loading patterns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatterns();
  }, []);

  if (loading && !data) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Streak Detection Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading pattern data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && !data) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Streak Detection Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error}</p>
          <Button onClick={loadPatterns} variant="outline" size="sm" className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { patterns, recent_reports } = data;
  const patternTypeEntries = Object.entries(patterns.topPatternTypes).sort(([, a], [, b]) => b - a);

  return (
    <div className="mt-10 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Streak Detection Intelligence</h2>
        <Button onClick={loadPatterns} variant="outline" size="sm" disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Streak Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patterns.totalReports}</div>
            {patterns.thisWeek > 0 && (
              <p className="text-xs text-green-600 dark:text-green-400">+{patterns.thisWeek} this week</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Matched Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patterns.totalMatchedFlights}</div>
            <p className="text-xs text-muted-foreground">
              ~{patterns.avgMatchesPerReport} per report avg
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Aircraft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patterns.operatorPatterns.length}</div>
            <p className="text-xs text-muted-foreground">correlated with streak reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Anomalies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patterns.anomalies.length}</div>
            <p className="text-xs text-muted-foreground">flagged patterns</p>
          </CardContent>
        </Card>
      </div>

      {/* Anomalies — most important section */}
      {patterns.anomalies.length > 0 && (
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400">Anomaly Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patterns.anomalies.map((anomaly, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50/50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700 dark:bg-red-900 dark:text-red-300">
                    {anomalyIcons[anomaly.type] || "!"}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{anomaly.description}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {anomaly.icao_hex}
                      </Badge>
                      {anomaly.tail_number && (
                        <Badge variant="outline" className="font-mono text-xs">
                          {anomaly.tail_number}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {anomaly.operator}
                      </Badge>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-red-700 dark:text-red-400">
                    {anomaly.streak_appearances}x
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top correlated operators */}
      <Card>
        <CardHeader>
          <CardTitle>Top Correlated Aircraft</CardTitle>
        </CardHeader>
        <CardContent>
          {patterns.operatorPatterns.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No correlations yet. Data accumulates as streak reports are submitted.
            </p>
          ) : (
            <div className="space-y-2">
              {patterns.operatorPatterns.slice(0, 15).map((op) => (
                <div
                  key={op.icao_hex}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">
                          {op.tail_number || op.icao_hex}
                        </span>
                        {op.is_known_operator && (
                          <Badge variant="destructive" className="text-xs">Known Operator</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {op.operator} &middot; {op.altitude_tier} &middot; {op.days_active}d span
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {op.streak_appearances} report{op.streak_appearances !== 1 ? "s" : ""}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${significanceColors[op.significance]}`}>
                      {op.significance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pattern types breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Reported Pattern Types</CardTitle>
          </CardHeader>
          <CardContent>
            {patternTypeEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reports yet.</p>
            ) : (
              <div className="space-y-2">
                {patternTypeEntries.map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <span className="text-sm capitalize">{type.replace(/_/g, " ")}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {recent_reports.length === 0 ? (
              <p className="text-sm text-muted-foreground">No streak reports yet.</p>
            ) : (
              <div className="space-y-2">
                {recent_reports.slice(0, 10).map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <div>
                      <span className="text-sm capitalize">{r.pattern_type.replace(/_/g, " ")}</span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()} &middot; {r.estimated_age.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {r.matched_flight_count} flight{r.matched_flight_count !== 1 ? "s" : ""}
                      </span>
                      {r.dark_aircraft_estimate != null && r.dark_aircraft_estimate > r.matched_flight_count && (
                        <Badge variant="outline" className="text-xs text-yellow-700 dark:text-yellow-400">
                          {r.dark_aircraft_estimate - r.matched_flight_count} dark
                        </Badge>
                      )}
                      <Badge
                        variant={r.correlation_status === "complete" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {r.correlation_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
