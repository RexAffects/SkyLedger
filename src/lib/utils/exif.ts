import ExifReader from "exifreader";

export interface ExifData {
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  timestamp: string | null;
  make: string | null;
  model: string | null;
  orientation: number | null;
}

/**
 * Extract GPS coordinates, timestamp, and device info from a photo's EXIF data.
 */
export async function extractExif(file: File): Promise<ExifData> {
  try {
    const buffer = await file.arrayBuffer();
    const tags = ExifReader.load(buffer, { expanded: true });

    const gps = tags.gps;
    const exif = tags.exif;

    return {
      latitude: gps?.Latitude ?? null,
      longitude: gps?.Longitude ?? null,
      altitude: gps?.Altitude ?? null,
      timestamp: exif?.DateTimeOriginal?.description ?? null,
      make: exif?.Make?.description ?? null,
      model: exif?.Model?.description ?? null,
      orientation: exif?.Orientation?.value as number ?? null,
    };
  } catch {
    return {
      latitude: null,
      longitude: null,
      altitude: null,
      timestamp: null,
      make: null,
      model: null,
      orientation: null,
    };
  }
}
