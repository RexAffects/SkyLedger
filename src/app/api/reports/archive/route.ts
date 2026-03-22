import { NextResponse } from "next/server";
import { archiveEvidence } from "@/lib/email/archive-evidence";

// Allow larger request bodies for base64 photo data
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      photo_data_url,
      tail_number,
      observation_type,
      latitude,
      longitude,
      observed_at,
      trail_behavior,
      notes,
      evidence_hash,
      exif_data,
      report_id,
    } = body;

    if (!photo_data_url || !observation_type || !evidence_hash || !report_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Must await — serverless functions terminate after response is sent
    await archiveEvidence({
      photoDataUrl: photo_data_url,
      tailNumber: tail_number || null,
      observationType: observation_type,
      latitude: latitude || 0,
      longitude: longitude || 0,
      observedAt: observed_at || new Date().toISOString(),
      trailBehavior: trail_behavior || null,
      notes: notes || null,
      evidenceHash: evidence_hash,
      exifData: exif_data || null,
      reportId: report_id,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Archive evidence error:", err);
    return NextResponse.json(
      { error: "Failed to archive" },
      { status: 500 }
    );
  }
}
