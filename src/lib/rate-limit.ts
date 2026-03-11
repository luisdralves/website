import ipaddr from "ipaddr.js";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}

function isPrivateIp(ip: string): boolean {
  try {
    const addr = ipaddr.process(ip);
    const range = addr.range();
    return range === "private" || range === "loopback" || range === "linkLocal";
  } catch {
    return false;
  }
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

export function rateLimit(
  request: Request,
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const ip = getClientIp(request);

  if (isPrivateIp(ip)) {
    return { allowed: true, remaining: limit };
  }

  cleanup();

  const fullKey = `${key}:${ip}`;
  const now = Date.now();
  const entry = store.get(fullKey);

  if (!entry || entry.resetAt < now) {
    store.set(fullKey, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}
