// Sliding-window in-memory rate limiter
// Keyed by identifier (IP, userId, or "IP:userId")

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > 5 * 60 * 1000) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now - entry.windowStart > windowMs) {
    store.set(identifier, { count: 1, windowStart: now });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.windowStart + windowMs };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.windowStart + windowMs };
}

// Preset rate limiters
export const rateLimiters = {
  auth: (ip: string) => rateLimit(`auth:${ip}`, 5, 60_000),
  signup: (ip: string) => rateLimit(`signup:${ip}`, 3, 60_000),
  forgotPassword: (ip: string) => rateLimit(`forgot:${ip}`, 3, 60_000),
  write: (userId: string) => rateLimit(`write:${userId}`, 30, 60_000),
  ai: (userId: string) => rateLimit(`ai:${userId}`, 10, 60_000),
  share: (userId: string) => rateLimit(`share:${userId}`, 10, 60_000),
  publicShared: (ip: string) => rateLimit(`public:${ip}`, 60, 60_000),
  explore: (userId: string) => rateLimit(`explore:${userId}`, 60, 60_000),
  profile: (userId: string) => rateLimit(`profile:${userId}`, 10, 60_000),
  global: (ip: string) => rateLimit(`global:${ip}`, 100, 60_000),
};
