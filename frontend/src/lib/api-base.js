/**
 * Resolve API base for local Vite, LAN, and production (nginx /api proxy).
 * Live servers expose API on the same origin (/api), not :5001.
 *
 * Never honor a baked-in remote VITE_API_URL on a public host — staging
 * hosts like sitetest.* often lack DNS and break login with
 * net::ERR_NAME_NOT_RESOLVED.
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

  // Production / public host behind nginx → always same-origin /api
  if (!onLocalHost) {
    return `${origin}/api`;
  }

  if (configured) {
    return configured;
  }

  if (["5173", "5174", "4173", "4174"].includes(port)) {
    return `${protocol}//${hostname}:5001/api`;
  }
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5001/api";
  }
  return `${protocol}//${hostname}:5001/api`;
}

export function getApiOrigin() {
  return getApiBaseUrl().replace(/\/api\/?$/, "");
}
