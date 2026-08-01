/** Resolve API base so mobile/LAN devices don't hit phone-localhost. */
export function getApiBaseUrl() {
  const fallback = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(
    /\/$/,
    "",
  );

  if (typeof window === "undefined") return fallback;

  const host = window.location.hostname;
  if (host && host !== "localhost" && host !== "127.0.0.1") {
    const protocol = window.location.protocol === "https:" ? "https:" : "http:";
    return `${protocol}//${host}:5001/api`;
  }

  return fallback;
}

export function getApiOrigin() {
  return getApiBaseUrl().replace(/\/api\/?$/, "");
}
