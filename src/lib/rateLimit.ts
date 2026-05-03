/**
 * Simple in-memory rate limiter for API routes.
 * Limits each IP to a maximum number of requests per time window.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Store request counts per IP (in-memory, resets on server restart)
const store = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  /** Maximum requests allowed per window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(ip: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  // Clean up expired entry
  if (entry && now > entry.resetAt) {
    store.delete(ip);
  }

  const current = store.get(ip);

  if (!current) {
    // First request from this IP
    store.set(ip, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.limit - 1, resetAt: now + options.windowMs };
  }

  if (current.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  return { allowed: true, remaining: options.limit - current.count, resetAt: current.resetAt };
}

/**
 * Periodically clean up expired entries to prevent memory leaks.
 * Runs every 10 minutes.
 */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}
