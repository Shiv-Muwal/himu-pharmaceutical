import { searchProductsSmart } from "@/lib/product-search";
import { milkySunscreenProduct } from "@/data/milky-sunscreen";
import { porcelynNightCreamProduct } from "@/data/porcelyn-night-cream";
import { lumevaMelasmaCreamProduct } from "@/data/lumeva-melasma-cream";

export const products = [
  milkySunscreenProduct,
  porcelynNightCreamProduct,
  lumevaMelasmaCreamProduct,
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
  return searchProductsSmart(products, query);
}

export { searchProductsSmart };
