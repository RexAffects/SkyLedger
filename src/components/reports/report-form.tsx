"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { submitReport } from "@/lib/supabase/reports";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapContainer } from "@/components/map/map-container";
import { hashFile } from "@/lib/utils/hash";
import { extractExif } from "@/lib/utils/exif";
import { formatCoords } from "@/lib/utils/geo";
import { OBSERVATION_TYPES, TRAIL_BEHAVIORS } from "@/lib/constants";
import {
  dateTimeLocalToISO,
  exifTimestampToDateTimeLocal,
  localTimezoneName,
  toDateTimeLocalValue,
} from "@/lib/utils/datetime";
import type { ReportFormData } from "@/lib/types";

function emptyForm(observedAt = ""): ReportFormData {
  return {
    latitude: 0,
    longitude: 0,
    observed_at: observedAt,
    observation_type: "",
    aircraft_count: null,
    duration_minutes: null,
    trail_behavior: null,
    notes: "",
    photo: null,
    evidence_hash: "",
    exif_data: null,
  };
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ReportForm() {
  const [formData, setFormData] = useState<ReportFormData>(() => emptyForm());
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [tzLabel, setTzLabel] = useState("");
  const submittingRef = useRef(false);

  // Both of these are client-only on purpose. The server renders in UTC, so
  // resolving either during SSR would hydrate a value 5 hours off in Central.
  useEffect(() => {
    setFormData((prev) =>
      prev.observed_at
        ? prev
        : { ...prev, observed_at: toDateTimeLocalValue() }
    );
    setTzLabel(localTimezoneName());
  }, []);

  const handlePhotoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setProcessing(true);
      setError(null);

      try {
        // Await the preview too — submitting before the reader fired would
        // attach a report with no photo at all.
        const [dataUrl, exifData, hash] = await Promise.all([
          readAsDataUrl(file),
          extractExif(file),
          hashFile(file),
        ]);

        setPhotoPreview(dataUrl);

        // EXIF dates need normalizing before they can go in the input.
        const exifObservedAt = exifTimestampToDateTimeLocal(exifData.timestamp);

        setFormData((prev) => ({
          ...prev,
          photo: file,
          evidence_hash: hash,
          exif_data: exifData as unknown as Record<string, unknown>,
          // Use EXIF GPS if available
          ...(exifData.latitude && exifData.longitude
            ? {
                latitude: exifData.latitude,
                longitude: exifData.longitude,
              }
            : {}),
          // Use EXIF timestamp if available
          ...(exifObservedAt ? { observed_at: exifObservedAt } : {}),
        }));
      } catch {
        setPhotoPreview(null);
        setError(
          "That photo could not be read. Try a different file, or submit without a photo."
        );
      } finally {
        setProcessing(false);
      }
    },
    []
  );

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setUseCurrentLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      () => {
        setUseCurrentLocation(false);
      }
    );
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard against the double-tap that produced duplicate rows when the form
    // gave no feedback.
    if (submittingRef.current) return;

    if (!formData.observation_type || !formData.latitude || !formData.longitude) {
      setError(
        "Choose what you observed and set a location before submitting."
      );
      return;
    }

    // The input gives local wall time; the column is TIMESTAMPTZ. Convert
    // explicitly so the stored instant matches when the reporter actually saw it.
    const observedAtIso = dateTimeLocalToISO(formData.observed_at);
    if (!observedAtIso) {
      setError("Enter a valid date and time for the observation.");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setError(null);

    try {
      const result = await submitReport({
        latitude: formData.latitude,
        longitude: formData.longitude,
        observed_at: observedAtIso,
        observation_type: formData.observation_type,
        aircraft_count: formData.aircraft_count,
        duration_minutes: formData.duration_minutes,
        trail_behavior: formData.trail_behavior,
        notes: formData.notes || null,
        photo_urls: photoPreview ? [photoPreview] : [],
        evidence_hash: formData.evidence_hash || "no-photo",
        exif_data: formData.exif_data,
        weather_conditions: null,
        tail_number: null,
      });

      if (!result) {
        setError(
          "We could not record your observation. Check your connection and try again — your photo and details are still here."
        );
        return;
      }

      // Archive photo to email (non-blocking)
      if (photoPreview) {
        fetch("/api/reports/archive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photo_data_url: photoPreview,
            tail_number: null,
            observation_type: formData.observation_type,
            latitude: formData.latitude,
            longitude: formData.longitude,
            observed_at: observedAtIso,
            trail_behavior: formData.trail_behavior,
            notes: formData.notes || null,
            evidence_hash: formData.evidence_hash,
            exif_data: formData.exif_data,
            report_id: result.id,
          }),
        }).catch(() => {});
      }

      setSubmitted(true);
    } catch {
      setError(
        "Something went wrong submitting your observation. Your details are still here — please try again."
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold">Observation Submitted</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your observation has been recorded with evidence hash:
          </p>
          <p className="mt-2 font-mono text-xs break-all bg-muted p-2 rounded">
            {formData.evidence_hash || "No photo attached"}
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={() => { setSubmitted(false); setFormData(emptyForm(toDateTimeLocalValue())); setPhotoPreview(null); setError(null); }}>
              Submit Another
            </Button>
            <Link
              href="/reports"
              className={buttonVariants({ variant: "outline" })}
            >
              View Evidence Ledger
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {/* Photo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Photo Evidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          {processing && (
            <p className="text-sm text-muted-foreground">
              Processing photo... extracting EXIF data and generating hash...
            </p>
          )}
          {photoPreview && (
            <div className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt="Preview"
                className="max-h-64 rounded-md"
              />
              {formData.evidence_hash && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">SHA-256</Badge>
                  <span className="font-mono text-xs break-all">
                    {formData.evidence_hash}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleGetLocation}>
              {useCurrentLocation ? "Location acquired" : "Use my current location"}
            </Button>
            {formData.latitude !== 0 && (
              <Badge variant="secondary">
                {formatCoords(formData.latitude, formData.longitude)}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Or click the map to set the observation location:
          </p>
          <MapContainer
            center={
              formData.latitude !== 0
                ? [formData.latitude, formData.longitude]
                : undefined
            }
            zoom={formData.latitude !== 0 ? 12 : undefined}
            onMapClick={handleMapClick}
            className="h-[300px] w-full"
            reports={
              formData.latitude !== 0
                ? [
                    {
                      id: "preview",
                      latitude: formData.latitude,
                      longitude: formData.longitude,
                      observed_at: formData.observed_at,
                      observation_type: formData.observation_type || "preview",
                      aircraft_count: null,
                      duration_minutes: null,
                      trail_behavior: null,
                      notes: "Your observation location",
                      photo_urls: [],
                      evidence_hash: "",
                      exif_data: null,
                      weather_conditions: null,
                      verification_level: 1,
                      status: "active",
                      created_at: new Date().toISOString(),
                      tail_number: null,
                    },
                  ]
                : []
            }
          />
        </CardContent>
      </Card>

      {/* Observation Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Observation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="observed_at">
              Date & Time of Observation
            </label>
            <Input
              id="observed_at"
              type="datetime-local"
              value={formData.observed_at}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  observed_at: e.target.value,
                }))
              }
              required
            />
            {tzLabel && (
              <p className="mt-1 text-xs text-muted-foreground">
                Your local time ({tzLabel}).
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="observation_type">
              What did you observe?
            </label>
            <select
              id="observation_type"
              value={formData.observation_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  observation_type: e.target.value,
                }))
              }
              required
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select observation type...</option>
              {OBSERVATION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium" htmlFor="aircraft_count">
                Number of aircraft
              </label>
              <Input
                id="aircraft_count"
                type="number"
                min={0}
                max={50}
                placeholder="0"
                value={formData.aircraft_count ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    aircraft_count: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  }))
                }
              />
            </div>
            <div>
              <label
                className="text-sm font-medium"
                htmlFor="duration_minutes"
              >
                Duration (minutes)
              </label>
              <Input
                id="duration_minutes"
                type="number"
                min={0}
                placeholder="0"
                value={formData.duration_minutes ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration_minutes: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="trail_behavior">
              Trail behavior
            </label>
            <select
              id="trail_behavior"
              value={formData.trail_behavior ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  trail_behavior: e.target.value || null,
                }))
              }
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select trail behavior...</option>
              {TRAIL_BEHAVIORS.map((behavior) => (
                <option key={behavior.value} value={behavior.value}>
                  {behavior.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="notes">
              Additional notes
            </label>
            <Textarea
              id="notes"
              placeholder="Describe what you observed in factual terms. What did you see? What direction were the aircraft traveling?"
              maxLength={500}
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {formData.notes.length}/500 characters. Stick to observations, not
              conclusions.
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30"
        >
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {error}
          </p>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={
          !formData.observation_type ||
          !formData.latitude ||
          !formData.longitude ||
          processing ||
          submitting
        }
      >
        {submitting
          ? "Submitting observation..."
          : processing
            ? "Processing photo..."
            : "Submit Observation"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Your observation will be publicly visible. We do not collect personal
        information. All evidence is SHA-256 hashed for integrity verification.
      </p>
    </form>
  );
}
