/** Bulk offer tiers on MRP (frontend-only). */
export const BULK_OFFERS = [
  { minQty: 1, percent: 20, label: "Buy 1 · 20% OFF" },
  { minQty: 2, percent: 35, label: "Buy 2 · 35% OFF" },
  { minQty: 3, percent: 40, label: "Buy 3+ · 40% OFF" },
];

export function getCartItemCount(items = []) {
  return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

export function getBulkDiscountPercent(itemCount) {
  const count = Number(itemCount) || 0;
  if (count >= 3) return 40;
  if (count === 2) return 35;
  if (count === 1) return 20;
  return 0;
}

export function getProductMrp(product) {
  const mrp = Number(product?.compareAtPrice || product?.price || 0);
  return Number.isFinite(mrp) ? mrp : 0;
}

export function getDiscountedUnitPrice(product, itemCount) {
  const mrp = getProductMrp(product);
  const percent = getBulkDiscountPercent(itemCount);
  if (!mrp) return 0;
  if (!percent) return Math.round(Number(product?.price) || mrp);
  return Math.round(mrp * (1 - percent / 100));
}

export function getItemLineTotal(item, itemCount) {
  return getDiscountedUnitPrice(item.product, itemCount) * (Number(item.quantity) || 0);
}

export function getItemLineMrp(item) {
  return getProductMrp(item.product) * (Number(item.quantity) || 0);
}

export function summarizeCartPricing(items = []) {
  const itemCount = getCartItemCount(items);
  const discountPercent = getBulkDiscountPercent(itemCount);
  const original = items.reduce((sum, item) => sum + getItemLineMrp(item), 0);
  const total = items.reduce(
    (sum, item) => sum + getItemLineTotal(item, itemCount),
    0,
  );
  const savings = Math.max(0, original - total);
  return { itemCount, discountPercent, original, total, savings };
}

export function getNextOfferHint(itemCount) {
  const count = Number(itemCount) || 0;
  if (count <= 0) {
    return "Add 1 product for 20% OFF on MRP";
  }
  if (count === 1) {
    return "Add 1 more for 35% OFF on every product";
  }
  if (count === 2) {
    return "Add 1 more for 40% OFF on every product";
  }
  return "Max offer unlocked · 40% OFF on every product";
}

export function getSuggestedProducts(checkoutItems = [], catalog = [], limit = 4) {
  const inCheckout = new Set(checkoutItems.map((item) => item.product?.id));
  return catalog
    .filter((product) => {
      if (!product || inCheckout.has(product.id)) return false;
      if (product.active === false) return false;
      const slug = product.categorySlug;
      return slug === "dermatology" || slug === "skin-care";
    })
    .slice(0, limit);
}
