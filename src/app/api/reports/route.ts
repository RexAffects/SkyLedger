import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { hashReporter, getClientIp } from "@/lib/utils/ip-hash";
import { checkSubmissionLimits } from "@/lib/security/submission-limits";
import { OBSERVATION_TYPES, TRAIL_BEHAVIORS } from "@/lib/constants";
import type { CitizenReport } from "@/lib/types";

/**
 * POST /api/reports — submit a citizen observation.
 *
 * Until 2026-10-25 the browser inserted straight into Supabase with the
 * public anon key and an "anyone can insert" policy: no validation, no
 * limits, nothing our server could see. Every report now comes through
 * here. See docs/security/2026-10-25-abuse-hardening.md (item 1).
 */

// Photo data URLs can be ~1.5 MB; give the function room to parse and insert.
export const maxDuration = 30;

const validObservationTypes = OBSERVATION_TYPES.map((o) => o.value as string);
const validTrailBehaviors = TRAIL_BEHAVIORS.map((t) => t.value as string);

const MAX_PHOTO_CHARS = 3_000_000; // server-side ceiling; client aims for 1.5M
const MAX_NOTES = 500;
const MAX_EXIF_CHARS = 20_000;

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function bad(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request body");
  }

  // ---- Validation: shape, ranges, allowed values ----
  const latitude = body.latitude;
  const longitude = body.longitude;
  if (
    !isFiniteNumber(latitude) ||
    !isFiniteNumber(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return bad("A valid location is required");
  }

  const observedAt = typeof body.observed_at === "string" ? new Date(body.observed_at) : null;
  if (!observedAt || Number.isNaN(observedAt.getTime())) {
    return bad("A valid observation time is required");
  }
  if (observedAt.getTime() > Date.now() + 24 * 60 * 60 * 1000) {
    return bad("Observation time cannot be in the future");
  }

  const observationType = body.observation_type;
  if (typeof observationType !== "string" || !validObservationTypes.includes(observationType)) {
    return bad("Invalid observation type");
  }

  const trailBehavior = body.trail_behavior ?? null;
  if (trailBehavior !== null && (typeof trailBehavior !== "string" || !validTrailBehaviors.includes(trailBehavior))) {
    return bad("Invalid trail behavior");
  }

  const aircraftCount = body.aircraft_count ?? null;
  if (aircraftCount !== null && (!Number.isInteger(aircraftCount) || (aircraftCount as number) < 0 || (aircraftCount as number) > 1000)) {
    return bad("Invalid aircraft count");
  }

  const durationMinutes = body.duration_minutes ?? null;
  if (durationMinutes !== null && (!Number.isInteger(durationMinutes) || (durationMinutes as number) < 0 || (durationMinutes as number) > 1440)) {
    return bad("Invalid duration");
  }

  const notes = body.notes ?? null;
  if (notes !== null && (typeof notes !== "string" || notes.length > MAX_NOTES)) {
    return bad(`Notes must be ${MAX_NOTES} characters or fewer`);
  }

  const photoUrls = body.photo_urls ?? [];
  if (!Array.isArray(photoUrls) || photoUrls.length > 1) {
    return bad("At most one photo per report");
  }
  for (const p of photoUrls) {
    if (typeof p !== "string" || !p.startsWith("data:image/")) {
      return bad("Photo must be an image");
    }
    if (p.length > MAX_PHOTO_CHARS) {
      return bad("Photo is too large. Please choose a smaller image.");
    }
  }

  const evidenceHash = body.evidence_hash;
  if (typeof evidenceHash !== "string" || evidenceHash.length === 0 || evidenceHash.length > 128) {
    return bad("Invalid evidence hash");
  }

  const exifData = body.exif_data ?? null;
  if (exifData !== null) {
    if (typeof exifData !== "object" || Array.isArray(exifData)) return bad("Invalid EXIF data");
    if (JSON.stringify(exifData).length > MAX_EXIF_CHARS) return bad("EXIF data too large");
  }

  const tailNumber = body.tail_number ?? null;
  if (tailNumber !== null && (typeof tailNumber !== "string" || tailNumber.length > 12)) {
    return bad("Invalid tail number");
  }

  // ---- Rate limit (per hashed IP, shared across instances) ----
  const reporterHash = hashReporter(getClientIp(request));
  const limit = await checkSubmissionLimits("citizen_reports", reporterHash);
  if (!limit.allowed) {
    return NextResponse.json({ error: limit.reason }, { status: 429 });
  }

  // ---- Insert with the service role (RLS no longer allows anon inserts) ----
  const supabase = createServiceClient();
  const row: Record<string, unknown> = {
    latitude,
    longitude,
    observed_at: observedAt.toISOString(),
    observation_type: observationType,
    aircraft_count: aircraftCount,
    duration_minutes: durationMinutes,
    trail_behavior: trailBehavior,
    notes,
    photo_urls: photoUrls,
    evidence_hash: evidenceHash,
    exif_data: exifData,
    weather_conditions: null,
    tail_number: tailNumber ? (tailNumber as string).toUpperCase() : null,
    verification_level: 1,
    status: "active",
  };
  // Only set when the column exists (migration 007). `skipped` means the
  // limit query failed, which is how we detect the column is missing.
  if (!limit.skipped) row.reporter_hash = reporterHash;

  const { data, error } = await supabase
    .from("citizen_reports")
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error("[reports] insert failed:", error);
    return NextResponse.json({ error: "Failed to record report" }, { status: 500 });
  }

  return NextResponse.json({ report: data as CitizenReport });
}
