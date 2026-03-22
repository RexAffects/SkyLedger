"use client";

import { useState, useCallback } from "react";
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
import type { ReportFormData } from "@/lib/types";

export function ReportForm() {
  const [formData, setFormData] = useState<ReportFormData>({
    latitude: 0,
    longitude: 0,
    observed_at: new Date().toISOString().slice(0, 16),
    observation_type: "",
    aircraft_count: null,
    duration_minutes: null,
    trail_behavior: null,
    notes: "",
    photo: null,
    evidence_hash: "",
    exif_data: null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const handlePhotoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setProcessing(true);

      // Generate preview
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);

      // Extract EXIF and hash in parallel
      const [exifData, hash] = await Promise.all([
        extractExif(file),
        hashFile(file),
      ]);

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
        ...(exifData.timestamp
          ? { observed_at: exifData.timestamp }
          : {}),
      }));

      setProcessing(false);
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

    if (!formData.observation_type || !formData.latitude || !formData.longitude) {
      return;
    }

    const result = await submitReport({
      latitude: formData.latitude,
      longitude: formData.longitude,
      observed_at: formData.observed_at,
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

    if (result) {
      setSubmitted(true);
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
            <Button onClick={() => { setSubmitted(false); setFormData({ latitude: 0, longitude: 0, observed_at: new Date().toISOString().slice(0, 16), observation_type: "", aircraft_count: null, duration_minutes: null, trail_behavior: null, notes: "", photo: null, evidence_hash: "", exif_data: null }); setPhotoPreview(null); }}>
              Submit Another
            </Button>
            <a href="/reports" className={buttonVariants({ variant: "outline" })}>
              View All Reports
            </a>
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
            capture="environment"
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

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={
          !formData.observation_type ||
          !formData.latitude ||
          !formData.longitude
        }
      >
        Submit Observation
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Your observation will be publicly visible. We do not collect personal
        information. All evidence is SHA-256 hashed for integrity verification.
      </p>
    </form>
  );
}
