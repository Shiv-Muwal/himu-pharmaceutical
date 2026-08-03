import { milkySunscreenProduct } from "@/data/milky-sunscreen";
import { porcelynNightCreamProduct } from "@/data/porcelyn-night-cream";
import { lumevaMelasmaCreamProduct } from "@/data/lumeva-melasma-cream";

export const products = [
  {
    ...milkySunscreenProduct,
    id: milkySunscreenProduct.productId || milkySunscreenProduct.id,
  },
  {
    ...porcelynNightCreamProduct,
    id: porcelynNightCreamProduct.productId || porcelynNightCreamProduct.id,
  },
  {
    ...lumevaMelasmaCreamProduct,
    id: lumevaMelasmaCreamProduct.productId || lumevaMelasmaCreamProduct.id,
  },
];

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getAllProductSlugs() {
  return products.map((p) => p.slug);
}

export function searchProducts(query) {
  const q = String(query || "").toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.composition.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q),
  );
}
