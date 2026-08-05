/**
 * Strip MongoDB operator injection from query/body objects
 * (keys starting with $ or containing .)
 */
function sanitizeInPlace(value, depth = 0) {
  if (depth > 8 || value == null) return;
  if (Array.isArray(value)) {
    for (const item of value) sanitizeInPlace(item, depth + 1);
    return;
  }
  if (typeof value === "object" && !(value instanceof Date) && !Buffer.isBuffer(value)) {
    for (const key of Object.keys(value)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete value[key];
        continue;
      }
      sanitizeInPlace(value[key], depth + 1);
    }
  }
}

export function mongoSanitize(req, _res, next) {
  try {
    if (req.body && typeof req.body === "object") sanitizeInPlace(req.body);
    if (req.params && typeof req.params === "object") sanitizeInPlace(req.params);
    if (req.query && typeof req.query === "object") sanitizeInPlace(req.query);
  } catch {
    // ignore non-writable query bags on some Express versions
  }
  next();
}

/** Force string query params used in filters (prevents operator objects). */
export function asString(value, maxLen = 200) {
  if (value == null) return "";
  if (typeof value === "object") return "";
  return String(value).trim().slice(0, maxLen);
}
