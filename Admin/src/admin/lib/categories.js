const CATEGORIES_KEY = "himu-admin-categories";

export const DEFAULT_CATEGORIES = ["Skin Care"];

export function getAdminCategories() {
  if (typeof window === "undefined") return [...DEFAULT_CATEGORIES];
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return [...DEFAULT_CATEGORIES];
    }
    const list = JSON.parse(raw);
    if (!Array.isArray(list) || !list.length) return [...DEFAULT_CATEGORIES];
    return list.map((c) => String(c).trim()).filter(Boolean);
  } catch {
    return [...DEFAULT_CATEGORIES];
  }
}

export function saveAdminCategories(list) {
  const cleaned = [...new Set((list || []).map((c) => String(c).trim()).filter(Boolean))];
  const next = cleaned.length ? cleaned : [...DEFAULT_CATEGORIES];
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(next));
  return next;
}

export function addAdminCategory(name) {
  const trimmed = String(name || "").trim();
  if (!trimmed) return getAdminCategories();
  const current = getAdminCategories();
  if (current.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
    return current;
  }
  return saveAdminCategories([...current, trimmed]);
}

export function removeAdminCategory(name) {
  const current = getAdminCategories().filter(
    (c) => c.toLowerCase() !== String(name || "").toLowerCase(),
  );
  return saveAdminCategories(current);
}

export function slugifyCategory(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
