/**
 * Resolve API base for local Vite, LAN, and production (nginx /api proxy).
 * Live servers usually expose API on the same origin (/api), not :5001.
 *
 * Important: never force a baked-in localhost VITE_API_URL when the admin UI
 * is opened on a real host (that breaks production image uploads).
 */
export function getApiBaseUrl() {
  const configured = String(import.meta.env.VITE_API_URL || "")
    .trim()
    .replace(/\/$/, "");

  if (typeof window === "undefined") {
    return configured || "http://localhost:5001/api";
  }

  const { protocol, hostname, port, origin } = window.location;
  const onLocalHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    /^192\.168\.\d+\.\d+$/.test(hostname) ||
    /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(hostname);

  // Only honor VITE_API_URL when it matches the environment we are in.
  if (configured) {
    const isLocalTarget = /localhost|127\.0\.0\.1/.test(configured);
    if (onLocalHost || !isLocalTarget) {
      return configured;
    }
    // Production page + localhost API URL = misconfigured build; fall through.
  }

  if (onLocalHost) {
    // Local Vite / preview → backend on port 5001
    if (["5173", "5174", "4173", "4174", ""].includes(port) || port === "5174") {
      return `${protocol}//${hostname}:5001/api`;
    }
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5001/api";
    }
    return `${protocol}//${hostname}:5001/api`;
  }

  // Production / public host behind nginx → same-origin /api
  return `${origin}/api`;
}

export function getApiOrigin() {
  return getApiBaseUrl().replace(/\/api\/?$/, "");
}
