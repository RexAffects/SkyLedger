"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { submitReport } from "@/lib/supabase/reports";
import { hashFile } from "@/lib/utils/hash";
import { extractExif } from "@/lib/utils/exif";
import { OBSERVATION_TYPES, TRAIL_BEHAVIORS } from "@/lib/constants";

interface PhotoEvidenceDialogProps {
  tailNumber: string;
  icaoHex?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  altitudeFt?: number | null;
}

export function PhotoEvidenceDialog({
  tailNumber,
  latitude,
  longitude,
}: PhotoEvidenceDialogProps) {
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [evidenceHash, setEvidenceHash] = useState("");
  const [exifData, setExifData] = useState<Record<string, unknown> | null>(
    null
  );
  const [observationType, setObservationType] = useState("spray_pattern");
  const [trailBehavior, setTrailBehavior] = useState("");
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    hash?: string;
  } | null>(null);

  const handlePhotoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setProcessing(true);

      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);

      const [exif, hash] = await Promise.all([
        extractExif(file),
        hashFile(file),
      ]);

      setPhoto(file);
      setEvidenceHash(hash);
      setExifData(exif as unknown as Record<string, unknown>);
      setProcessing(false);
    },
    []
  );

  async function handleSubmit() {
    if (!photo || !photoPreview) return;

    setSubmitting(true);
    setResult(null);

    try {
      const reportData = {
        latitude: latitude || 0,
        longitude: longitude || 0,
        observed_at: new Date().toISOString(),
        observation_type: observationType,
        aircraft_count: 1,
        duration_minutes: null,
        trail_behavior: trailBehavior || null,
        notes: notes || null,
        photo_urls: [photoPreview],
        evidence_hash: evidenceHash,
        exif_data: exifData,
        weather_conditions: null,
        tail_number: tailNumber,
      };

      const report = await submitReport(reportData);

      if (report) {
        // Archive photo to email (non-blocking)
        fetch("/api/reports/archive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photo_data_url: photoPreview,
            tail_number: tailNumber,
            observation_type: observationType,
            latitude: latitude || 0,
            longitude: longitude || 0,
            observed_at: new Date().toISOString(),
            trail_behavior: trailBehavior || null,
            notes: notes || null,
            evidence_hash: evidenceHash,
            exif_data: exifData,
            report_id: report.id,
          }),
        }).catch(() => {});

        setResult({
          success: true,
          message: "Photo evidence submitted and pinned to this aircraft.",
          hash: evidenceHash,
        });
      } else {
        setResult({
          success: false,
          message: "Failed to submit. Please try again.",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setPhoto(null);
      setPhotoPreview(null);
      setEvidenceHash("");
      setExifData(null);
      setObservationType("spray_pattern");
      setTrailBehavior("");
      setNotes("");
      setResult(null);
    }, 200);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="w-full" />
        }
      >
        Submit Photo Evidence
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Photo Evidence</DialogTitle>
          <DialogDescription>
            Attach a photo to{" "}
            <Badge variant="outline" className="font-mono mx-1">
              {tailNumber}
            </Badge>
            &apos;s record. Your photo is SHA-256 hashed for integrity.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="py-4">
            <div
              className={`rounded-lg p-4 ${
                result.success
                  ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  result.success
                    ? "text-green-800 dark:text-green-200"
                    : "text-red-800 dark:text-red-200"
                }`}
              >
                {result.message}
              </p>
              {result.success && result.hash && (
                <p className="font-mono text-[11px] text-green-700 dark:text-green-300 mt-2 break-all">
                  {result.hash}
                </p>
              )}
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-2">
              {/* Photo Upload */}
              <div>
                <label className="text-xs font-medium text-foreground">
                  Photo *
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="mt-1"
                />
                {processing && (
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Processing photo...
                  </p>
                )}
                {photoPreview && (
                  <div className="mt-2 space-y-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoPreview}
                      alt="Evidence preview"
                      className="max-h-40 rounded-md w-full object-cover"
                    />
                    {evidenceHash && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">
                          SHA-256
                        </Badge>
                        <span className="font-mono text-[10px] text-muted-foreground truncate">
                          {evidenceHash.slice(0, 24)}...
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* What did you see? */}
              <div>
                <label
                  htmlFor="photo-observation-type"
                  className="text-xs font-medium text-foreground"
                >
                  What did you see?
                </label>
                <select
                  id="photo-observation-type"
                  value={observationType}
                  onChange={(e) => setObservationType(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {OBSERVATION_TYPES.filter((t) => t.value !== "null_report").map(
                    (type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Trail behavior */}
              <div>
                <label
                  htmlFor="photo-trail-behavior"
                  className="text-xs font-medium text-foreground"
                >
                  Trail behavior (optional)
                </label>
                <select
                  id="photo-trail-behavior"
                  value={trailBehavior}
                  onChange={(e) => setTrailBehavior(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select...</option>
                  {TRAIL_BEHAVIORS.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="photo-notes"
                  className="text-xs font-medium text-foreground"
                >
                  Notes (optional)
                </label>
                <Textarea
                  id="photo-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What did you see this aircraft doing?"
                  maxLength={500}
                  className="mt-1"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  {notes.length}/500
                </p>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Photo evidence is public. No personal information is collected.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!photo || processing || submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Submitting..." : "Submit Evidence"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
