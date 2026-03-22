import nodemailer from "nodemailer";

interface ArchiveData {
  photoDataUrl: string;
  tailNumber: string | null;
  observationType: string;
  latitude: number;
  longitude: number;
  observedAt: string;
  trailBehavior: string | null;
  notes: string | null;
  evidenceHash: string;
  exifData: Record<string, unknown> | null;
  reportId: string;
}

/**
 * Email a photo + metadata to the SkyLedger archive Gmail account.
 * Preserves the original photo as an attachment and all metadata in the body.
 */
export async function archiveEvidence(data: ArchiveData): Promise<void> {
  const address = process.env.GMAIL_ADDRESS;
  const password = process.env.GMAIL_APP_PASSWORD;

  if (!address || !password) {
    console.warn("GMAIL_ADDRESS or GMAIL_APP_PASSWORD not set — skipping archive");
    return;
  }

  // Parse base64 data URL → Buffer
  const matches = data.photoDataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    console.warn("Invalid photo data URL — skipping archive");
    return;
  }

  const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
  const buffer = Buffer.from(matches[2], "base64");

  // Build filename
  const dateStr = new Date(data.observedAt).toISOString().slice(0, 10);
  const tail = data.tailNumber || "general";
  const filename = `evidence_${tail}_${dateStr}.${ext}`;

  // Build readable observation type
  const obsLabel = data.observationType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Format EXIF for email body
  const exif = data.exifData || {};
  const exifLines = [
    exif.make || exif.model
      ? `EXIF Device: ${[exif.make, exif.model].filter(Boolean).join(" ")}`
      : null,
    exif.latitude && exif.longitude
      ? `EXIF GPS: ${exif.latitude}, ${exif.longitude}`
      : null,
    exif.timestamp ? `EXIF Timestamp: ${exif.timestamp}` : null,
    exif.altitude ? `EXIF Altitude: ${exif.altitude}m` : null,
  ].filter(Boolean);

  // Build email body
  const body = [
    `Tail Number: ${data.tailNumber || "Not specified"}`,
    `Observation: ${obsLabel}`,
    `Coordinates: ${data.latitude.toFixed(4)}°, ${data.longitude.toFixed(4)}°`,
    `Observed: ${new Date(data.observedAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}`,
    data.trailBehavior
      ? `Trail: ${data.trailBehavior.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`
      : null,
    data.notes ? `Notes: ${data.notes}` : null,
    `SHA-256: ${data.evidenceHash}`,
    ...exifLines,
    `Report ID: ${data.reportId}`,
    `File Size: ${(buffer.length / 1024).toFixed(0)} KB`,
  ]
    .filter(Boolean)
    .join("\n");

  const subject = `[SkyLedger Evidence] ${data.tailNumber || "General"} — ${obsLabel} — ${dateStr}`;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: address,
      pass: password,
    },
  });

  await transport.sendMail({
    from: address,
    to: address,
    subject,
    text: body,
    attachments: [
      {
        filename,
        content: buffer,
        contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
      },
    ],
  });
}
