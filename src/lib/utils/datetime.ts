/**
 * Helpers for bridging the `datetime-local` input and the database.
 *
 * The input speaks naive LOCAL wall-clock time with no offset. The
 * `observed_at` column is TIMESTAMPTZ, and Postgres reads an offset-less
 * timestamp as UTC. Anything that crosses that boundary without an explicit
 * conversion silently shifts by the reporter's UTC offset.
 */

/** Format a Date as `YYYY-MM-DDTHH:mm` in the viewer's LOCAL time. */
export function toDateTimeLocalValue(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/**
 * Convert a `datetime-local` value to an absolute UTC ISO string.
 *
 * `new Date("2026-10-05T19:10")` is parsed as local time per spec, so the
 * resulting instant carries the reporter's real offset. Returns null when the
 * value is missing or unparseable, so callers can reject instead of storing a
 * wrong time.
 */
export function dateTimeLocalToISO(value: string): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

/**
 * Normalize an EXIF DateTimeOriginal into a `datetime-local` value.
 *
 * EXIF writes `YYYY:MM:DD HH:MM:SS` — colons in the date part. That is not a
 * valid input value, so assigning it straight to the field blanks the control
 * and trips `required` validation. Camera clocks record local wall time, which
 * is exactly what the input wants.
 */
export function exifTimestampToDateTimeLocal(
  raw: string | null
): string | null {
  if (!raw) return null;

  const match = raw
    .trim()
    .match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2})/);
  if (!match) return null;

  const [, year, month, day, hour, minute] = match;
  const value = `${year}-${month}-${day}T${hour}:${minute}`;

  // Cameras with a dead battery emit placeholders like `0000:00:00 00:00:00`.
  return Number.isNaN(new Date(value).getTime()) ? null : value;
}

/** Human-readable local timezone label, e.g. "America/Chicago". */
export function localTimezoneName(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "local time";
  } catch {
    return "local time";
  }
}
