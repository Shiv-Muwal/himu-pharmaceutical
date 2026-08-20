import { getApiBaseUrl } from "@/lib/api-base";

async function fetchJson(path) {
  const response = await fetch(`${getApiBaseUrl()}${path}`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Failed to load products");
  }
  return payload.data;
}

function extractProductList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export async function fetchStoreProducts({ category, search, limit = 200 } = {}) {
  try {
    const params = new URLSearchParams({ limit: String(limit), active: "true" });
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const data = await fetchJson(`/products?${params.toString()}`);
    const items = extractProductList(data);
    return items;
  } catch {
    // A production storefront must not display stale, hard-coded prices.
    return [];
  }
}

export async function fetchStoreProductBySlug(slug) {
  try {
    const product = await fetchJson(`/products/${encodeURIComponent(slug)}`);
    return product || null;
  } catch {
    return null;
  }
}
