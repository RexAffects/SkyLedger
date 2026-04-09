"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCoords } from "@/lib/utils/geo";
import {
  STREAK_ESTIMATED_AGES,
  STREAK_PATTERN_TYPES,
  STREAK_SEVERITIES,
  STREAK_TRAIL_STATES,
} from "@/lib/constants";

interface StreakFormData {
  latitude: number;
  longitude: number;
  estimated_age: string;
  pattern_type: string;
  severity: string;
  trail_state: string;
  notes: string;
  dark_aircraft_estimate: number | null;
}

export function StreakReportForm() {
  const [formData, setFormData] = useState<StreakFormData>({
    latitude: 0,
    longitude: 0,
    estimated_age: "",
    pattern_type: "",
    severity: "moderate",
    trail_state: "sharp",
    notes: "",
    dark_aircraft_estimate: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ report_id: string } | null>(null);
  const [locationAcquired, setLocationAcquired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLocationAcquired(true);
        setError(null);
      },
      () => {
        setError("Could not get your location. Please enable location access.");
      }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.latitude || !formData.longitude) {
      setError("Location is required. Tap the button above to share your location.");
      return;
    }

    if (!formData.estimated_age || !formData.pattern_type) {
      setError("Please select how recent the activity is and the pattern type.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/streak/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit report.");
        setSubmitting(false);
        return;
      }

      setResult(data);
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && result) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold">Report Logged</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your observation has been recorded. The system is now correlating
            recent flight data in your area to identify aircraft that were
            overhead during the time window you reported.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            This data is used internally for pattern analysis and is not publicly displayed.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => {
                setSubmitted(false);
                setResult(null);
                setFormData({
                  latitude: formData.latitude,
                  longitude: formData.longitude,
                  estimated_age: "",
                  pattern_type: "",
                  severity: "moderate",
                  trail_state: "sharp",
                  notes: "",
                  dark_aircraft_estimate: null,
                });
              }}
            >
              Submit Another Report
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button type="button" variant="outline" onClick={handleGetLocation} className="w-full">
            {locationAcquired ? "Location Acquired" : "Share My Location"}
          </Button>
          {locationAcquired && (
            <div className="flex justify-center">
              <Badge variant="secondary">
                {formatCoords(formData.latitude, formData.longitude)}
              </Badge>
            </div>
          )}
          <p className="text-xs text-muted-foreground text-center">
            We need your approximate location to search for recent flights in your area.
            Your exact coordinates are never displayed publicly.
          </p>
        </CardContent>
      </Card>

      {/* How Recent */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How Recent?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Estimate how long ago the activity occurred based on the trail appearance.
          </p>
          <select
            value={formData.estimated_age}
            onChange={(e) => setFormData((prev) => ({ ...prev, estimated_age: e.target.value }))}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select time window...</option>
            {STREAK_ESTIMATED_AGES.map((age) => (
              <option key={age.value} value={age.value}>{age.label}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Pattern Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What Do You See?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Pattern type</label>
            <select
              value={formData.pattern_type}
              onChange={(e) => setFormData((prev) => ({ ...prev, pattern_type: e.target.value }))}
              required
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select pattern...</option>
              {STREAK_PATTERN_TYPES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData((prev) => ({ ...prev, severity: e.target.value }))}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {STREAK_SEVERITIES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Trail state</label>
              <select
                value={formData.trail_state}
                onChange={(e) => setFormData((prev) => ({ ...prev, trail_state: e.target.value }))}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {STREAK_TRAIL_STATES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Visible trails you can count (optional)
            </label>
            <p className="text-xs text-muted-foreground mb-1">
              If you see more trails than the system finds aircraft for, the gap may indicate
              aircraft not broadcasting ADS-B.
            </p>
            <Input
              type="number"
              min={0}
              max={50}
              placeholder="How many distinct trails can you see?"
              value={formData.dark_aircraft_estimate ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dark_aircraft_estimate: e.target.value ? parseInt(e.target.value) : null,
                }))
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Additional notes</label>
            <Textarea
              placeholder="Direction of trails, spacing, anything notable. Stick to what you observe."
              maxLength={500}
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {formData.notes.length}/500 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={submitting || !formData.estimated_age || !formData.pattern_type || !formData.latitude}
      >
        {submitting ? "Submitting..." : "Log Streak Report"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        This report is used for internal pattern analysis only. It is not publicly
        displayed and does not identify or accuse any specific aircraft or operator.
      </p>
    </form>
  );
}
