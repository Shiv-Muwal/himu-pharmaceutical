const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { token, ...options } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(payload.message || "Request failed", response.status);
  return payload.data;
}

export const adminSession = {
  get: () => sessionStorage.getItem("himu-admin-token"),
  set: (token) => sessionStorage.setItem("himu-admin-token", token),
  clear: () => sessionStorage.removeItem("himu-admin-token"),
};
