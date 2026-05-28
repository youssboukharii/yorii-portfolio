/**
 * In-memory sliding window rate limiter.
 *
 * No Redis needed — works perfectly for a single-server portfolio.
 * Uses a sliding window algorithm with automatic stale-entry cleanup.
 *
 * Usage:
 *   const result = rateLimiter.check(ip, { limit: 5, windowMs: 60_000 });
 *   if (!result.allowed) return 429;
 */

interface WindowEntry {
  timestamps: number[];
  blocked?: boolean;
  blockedUntil?: number;
}

const store = new Map<string, WindowEntry>();

// Auto-cleanup stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      // Remove entries with no recent timestamps and no active block
      const isBlocked = entry.blocked && entry.blockedUntil && entry.blockedUntil > now;
      if (!isBlocked && entry.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

interface RateLimitOptions {
  /** Max requests allowed within the window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
  /** Optional: block the IP for this many ms after exceeding limit (default: windowMs) */
  blockDurationMs?: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp (ms) when the window resets
  retryAfter?: number; // Seconds until unblocked (only set when blocked)
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const { limit, windowMs, blockDurationMs = windowMs } = options;
  const now = Date.now();
  const windowStart = now - windowMs;

  let entry = store.get(identifier);

  // Check if currently hard-blocked
  if (entry?.blocked && entry.blockedUntil && entry.blockedUntil > now) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil,
      retryAfter,
    };
  }

  // Initialize or reset entry
  if (!entry) {
    entry = { timestamps: [] };
    store.set(identifier, entry);
  }

  // Slide the window: drop timestamps older than windowStart
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  // Count requests in the current window
  const count = entry.timestamps.length;

  if (count >= limit) {
    // Activate block
    entry.blocked = true;
    entry.blockedUntil = now + blockDurationMs;
    const retryAfter = Math.ceil(blockDurationMs / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil,
      retryAfter,
    };
  }

  // Allow the request — record this timestamp
  entry.timestamps.push(now);
  entry.blocked = false;
  entry.blockedUntil = undefined;

  const oldest = entry.timestamps[0] ?? now;
  return {
    allowed: true,
    remaining: limit - entry.timestamps.length,
    resetAt: oldest + windowMs,
  };
}

/**
 * Extract the real client IP from Next.js request headers.
 * Handles proxies (Vercel, Cloudflare, Nginx, etc.)
 */
export function getClientIP(req: Request): string {
  // Standard forwarded headers (ordered by trustworthiness)
  const cfIp = req.headers.get("cf-connecting-ip"); // Cloudflare
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");

  if (cfIp) return cfIp.trim();
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  if (realIp) return realIp.trim();

  return "unknown";
}
