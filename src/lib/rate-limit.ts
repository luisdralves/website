/**
 * In-memory sliding-window rate limiter, keyed by IP.
 * Sufficient for a single-instance Next.js server. If you scale horizontally,
 * swap this out for a shared store (Redis, Upstash, etc.).
 */

const buckets = new Map<string, number[]>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
};

export const checkRateLimit = (key: string, limit: number, windowMs: number): RateLimitResult => {
  const now = Date.now();
  const windowStart = now - windowMs;
  const existing = buckets.get(key) ?? [];
  const recent = existing.filter((t) => t > windowStart);

  if (recent.length >= limit) {
    const oldest = recent[0];
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, oldest + windowMs - now),
    };
  }

  recent.push(now);
  buckets.set(key, recent);
  return {
    allowed: true,
    remaining: limit - recent.length,
    retryAfterMs: 0,
  };
};

/** Best-effort IP extraction from common proxy headers, falling back to a sentinel. */
export const getClientIp = (headers: Headers): string => {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
};
