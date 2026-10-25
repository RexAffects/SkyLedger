import { NextResponse, type NextRequest } from "next/server";
import {
  checkMemoryLimit,
  clientIp,
  rateLimitedResponse,
} from "@/lib/security/rate-limit";

/**
 * Per-IP rate limiting for every /api/* route.
 *
 * Why: a script hammering /api/flights/nearby gets our one Vercel IP
 * rate-limited by ADSB.lol / adsb.fi, which breaks the radar for everyone,
 * and burns the Hobby-plan caps. Submission routes also get a tight bucket
 * here as a first line; the database-backed per-reporter limits inside those
 * routes are the real ceiling. See docs/security/2026-10-25-abuse-hardening.md.
 *
 * Limits are deliberately generous: a real person on the radar makes ~12
 * nearby requests a minute. Only scripts get near these numbers.
 *
 * Counters live in function memory (per instance). Good enough for now; the
 * caveat and the upgrade path are in src/lib/security/rate-limit.ts.
 */

interface Bucket {
  limit: number;
  windowMs: number;
}

const MIN = 60_000;
const HOUR = 60 * MIN;

// Everything under /api, per IP, on top of the per-route bucket below
const GLOBAL: Bucket = { limit: 600, windowMs: MIN };

// "METHOD /path" → bucket. Unlisted routes get only the global limit.
const ROUTE_BUCKETS: Record<string, Bucket> = {
  // Abuse magnets
  "POST /api/feedback": { limit: 5, windowMs: 10 * MIN },
  "POST /api/admin/auth": { limit: 5, windowMs: 15 * MIN },

  // Submissions (DB-backed per-reporter limits apply inside too)
  "POST /api/reports": { limit: 10, windowMs: HOUR },
  "POST /api/reports/archive": { limit: 10, windowMs: HOUR },
  "POST /api/streak/report": { limit: 10, windowMs: HOUR },
  "POST /api/flags": { limit: 30, windowMs: HOUR },
  "POST /api/flight-history": { limit: 4, windowMs: MIN }, // radar posts 1/min

  // Reads that cost us upstream quota
  "GET /api/flights/nearby": { limit: 180, windowMs: MIN }, // radar: ~12/min
  "GET /api/flights/detail": { limit: 60, windowMs: MIN },
  "GET /api/flights/lookup": { limit: 30, windowMs: MIN },
  "GET /api/flight-history": { limit: 60, windowMs: MIN },
  "GET /api/streak/patterns": { limit: 30, windowMs: MIN },
  "GET /api/health": { limit: 30, windowMs: MIN },
  "GET /api/geo": { limit: 60, windowMs: MIN },
};

// Vercel Cron calls these with a secret; never throttle them.
const EXEMPT_PREFIXES = ["/api/cron/", "/api/keep-alive"];

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (EXEMPT_PREFIXES.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  const ip = clientIp(request);

  const global = checkMemoryLimit(`g:${ip}`, GLOBAL.limit, GLOBAL.windowMs);
  if (!global.allowed) {
    console.warn(`[security] global rate limit hit: ${ip} ${request.method} ${path}`);
    return rateLimitedResponse(global.retryAfterSec);
  }

  const routeKey = `${request.method} ${path}`;
  const bucket = ROUTE_BUCKETS[routeKey];
  if (bucket) {
    const r = checkMemoryLimit(`r:${routeKey}:${ip}`, bucket.limit, bucket.windowMs);
    if (!r.allowed) {
      console.warn(`[security] route rate limit hit: ${ip} ${routeKey}`);
      return rateLimitedResponse(r.retryAfterSec);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
