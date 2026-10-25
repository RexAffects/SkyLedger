import { NextResponse } from "next/server";

/**
 * In-memory per-IP rate limiting (sliding window).
 *
 * Used by src/proxy.ts for every /api/* request and by individual routes
 * that want a tighter bucket. See docs/security/2026-10-25-abuse-hardening.md.
 *
 * Known limitation, accepted on purpose: on Vercel each warm function
 * instance has its own memory, so a determined attacker spread across many
 * instances gets roughly N× the limit. That still turns "unlimited" into
 * "a few hundred a minute", which is enough to protect our ADS-B provider
 * quota and the Hobby-plan caps. Submissions that *matter* (reports, flags)
 * also have database-backed limits (see submission-limits.ts) that are
 * shared across instances. If traffic ever justifies it, swap the Map for
 * Upstash/Vercel KV behind the same `checkMemoryLimit` signature.
 */

export interface MemoryLimitResult {
  allowed: boolean;
  /** Seconds until the oldest request in the window expires (for Retry-After) */
  retryAfterSec: number;
  remaining: number;
}

// key → request timestamps (ms) inside the current window, oldest first
const windows = new Map<string, number[]>();
const MAX_TRACKED_KEYS = 20_000;

export function checkMemoryLimit(
  key: string,
  limit: number,
  windowMs: number
): MemoryLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  let hits = windows.get(key);
  if (hits) {
    // Drop timestamps that fell out of the window
    let i = 0;
    while (i < hits.length && hits[i] <= cutoff) i++;
    if (i > 0) hits = hits.slice(i);
  } else {
    hits = [];
  }

  if (hits.length >= limit) {
    windows.set(key, hits);
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((hits[0] + windowMs - now) / 1000)),
      remaining: 0,
    };
  }

  hits.push(now);
  windows.set(key, hits);

  // Keep memory bounded if something scans us with many IPs
  if (windows.size > MAX_TRACKED_KEYS) {
    for (const k of windows.keys()) {
      windows.delete(k);
      if (windows.size <= MAX_TRACKED_KEYS / 2) break;
    }
  }

  return { allowed: true, retryAfterSec: 0, remaining: limit - hits.length };
}

/**
 * Best-effort client IP. On Vercel the first x-forwarded-for entry is set by
 * Vercel's edge and can't be spoofed by the client.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "127.0.0.1";
}

export function rateLimitedResponse(
  retryAfterSec: number,
  message = "Too many requests. Please slow down and try again shortly."
): NextResponse {
  return NextResponse.json(
    { error: message, retry_after_seconds: retryAfterSec },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
  );
}
