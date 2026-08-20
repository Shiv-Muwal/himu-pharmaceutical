// Offers are temporarily disabled. MRP is the final selling price everywhere.
export const BULK_OFFERS = [];

export function getCartItemCount(items = []) {
  return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

export function getBulkDiscountPercent(itemCount) {
  return 0;
}

export function getProductMrp(product) {
  const mrp = Number(product?.mrp ?? product?.compareAtPrice ?? product?.price ?? 0);
  return Number.isFinite(mrp) ? mrp : 0;
}

export function getDiscountedUnitPrice(product, itemCount) {
  const mrp = getProductMrp(product);
  return Math.round(mrp || 0);
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
  return "";
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
