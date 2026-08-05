import { ApiError } from "../utils/apiResponse.js";

/**
 * In-memory rate limiter (per-process).
 * Good for single-instance deploys; for multi-instance use Redis later.
 */
function createRateLimit({ windowMs, max, keyPrefix, keyFn }) {
  const entries = new Map();
  let lastCleanup = Date.now();

  function cleanup(now) {
    if (now - lastCleanup < windowMs) return;
    lastCleanup = now;
    for (const [key, entry] of entries) {
      if (entry.resetAt <= now) entries.delete(key);
    }
  }

  return (req, res, next) => {
    const now = Date.now();
    cleanup(now);

    const identity = keyFn ? keyFn(req) : req.ip || "unknown";
    const key = `${keyPrefix}:${identity}`;
    const entry = entries.get(key);
    const active = entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + windowMs };
    active.count += 1;
    entries.set(key, active);

    res.set("RateLimit-Limit", String(max));
    res.set("RateLimit-Remaining", String(Math.max(0, max - active.count)));
    res.set("RateLimit-Reset", String(Math.ceil(active.resetAt / 1000)));
    if (active.count > max) {
      res.set("Retry-After", String(Math.ceil((active.resetAt - now) / 1000)));
      return next(new ApiError(429, "Too many requests. Please try again later."));
    }
    next();
  };
}

/** General API: 300 req / 15 min per IP */
export const apiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  keyPrefix: "api",
});

/** Auth routes overall: 40 / 15 min per IP */
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  keyPrefix: "auth",
});

/** Login brute-force: 8 attempts / 15 min per IP+email */
export const loginRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  keyPrefix: "login",
  keyFn: (req) => {
    const email = String(req.body?.email || "")
      .toLowerCase()
      .trim()
      .slice(0, 120);
    return `${req.ip || "unknown"}:${email || "none"}`;
  },
});

/** Register spam: 5 / hour per IP */
export const registerRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyPrefix: "register",
});

/** Public order placement: 20 / 15 min per IP */
export const orderCreateRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  keyPrefix: "order",
});

/** Contact / careers forms: 8 / hour per IP */
export const formRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  keyPrefix: "form",
});
