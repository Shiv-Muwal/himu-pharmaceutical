import { ApiError } from "../utils/apiResponse.js";

function createRateLimit({ windowMs, max, keyPrefix }) {
  const entries = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = `${keyPrefix}:${req.ip}`;
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

export const apiRateLimit = createRateLimit({ windowMs: 15 * 60 * 1000, max: 300, keyPrefix: "api" });
export const authRateLimit = createRateLimit({ windowMs: 15 * 60 * 1000, max: 10, keyPrefix: "auth" });
