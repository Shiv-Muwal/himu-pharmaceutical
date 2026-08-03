import { getApiBaseUrl } from "@/lib/api-base";
import {
  products as fallbackProducts,
  getProductBySlug as getFallbackBySlug,
  getProductsByCategory as getFallbackByCategory,
} from "@/data/products";

async function fetchJson(path) {
  const response = await fetch(`${getApiBaseUrl()}${path}`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Failed to load products");
  }
  return payload.data;
}

export async function fetchStoreProducts({ category, search, limit = 200 } = {}) {
  try {
    const params = new URLSearchParams({ limit: String(limit), active: "true" });
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const data = await fetchJson(`/products?${params.toString()}`);
    const items = Array.isArray(data) ? data : [];
    if (items.length) return items;
  } catch {
    // Fall back to local catalog when API is offline
  }

  if (category) return getFallbackByCategory(category);
  if (search) {
    const q = search.toLowerCase();
    return fallbackProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.composition?.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q),
    );
  }
  return fallbackProducts;
}

export async function fetchStoreProductBySlug(slug) {
  try {
    const product = await fetchJson(`/products/${encodeURIComponent(slug)}`);
    if (product) return product;
  } catch {
    // Fall back to local catalog when API is offline
  }
  return getFallbackBySlug(slug) || null;
}
