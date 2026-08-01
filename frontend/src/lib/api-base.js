/**
 * Resolve API base for local Vite, LAN, and production (nginx /api proxy).
 * Live servers usually expose API on the same origin (/api), not :5001.
 */
export function getApiBaseUrl() {
  const configured = String(import.meta.env.VITE_API_URL || "")
    .trim()
    .replace(/\/$/, "");
  if (configured) return configured;

  if (typeof window === "undefined") {
    return "http://localhost:5001/api";
  }

  const { protocol, hostname, port, origin } = window.location;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5001/api";
  }

  // Local Vite / preview → backend on port 5001
  if (["5173", "5174", "4173", "4174"].includes(port)) {
    return `${protocol}//${hostname}:5001/api`;
  }

  // Production / public IP behind nginx → same-origin /api
  return `${origin}/api`;
}

export function getApiOrigin() {
  return getApiBaseUrl().replace(/\/api\/?$/, "");
}
