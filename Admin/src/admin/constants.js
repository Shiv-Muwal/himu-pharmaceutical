export const CATEGORIES_LIST = [
  "Dermatology",
  "Skin Care",
  "Antibiotics",
  "Cosmetics",
  "Hair Care",
  "Capsules",
  "Tablets",
  "Syrups",
  "Injectables",
  "Ointments",
];

export const IMAGE_PRESETS = {
  capsule:
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
  tablet:
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
  cream:
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
  syrup:
    "https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&h=800&fit=crop",
  injectable:
    "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=800&fit=crop",
  cosmetic:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop",
  skincare:
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop",
  haircare:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop",
};

export const EMPTY_PRODUCT_FORM = {
  name: "",
  category: "Dermatology",
  composition: "",
  strength: "",
  price: 150,
  compareAtPrice: 199,
  stock: 100,
  imageKey: "cream",
  shortDescription: "",
  description: "",
  storage: "Store in a cool, dry place below 25°C.",
  packaging: "30g Tube",
  shelfLife: "36 Months",
};

export const SIDEBAR_TABS = [
  { id: "overview", label: "Overview", hint: "Live store pulse" },
  { id: "products", label: "Products", hint: "Catalog control" },
  { id: "inventory", label: "Inventory", hint: "Stock & alerts" },
  { id: "orders", label: "Orders", hint: "Fulfillment desk" },
  { id: "customers", label: "Customers", hint: "Buyer directory" },
  { id: "banners", label: "Banners", hint: "Homepage slides" },
  { id: "settings", label: "Settings", hint: "Account & security" },
];

export const EMPTY_BANNER_FORM = {
  title: "",
  subtitle: "",
  image: "",
  link: "/products?category=dermatology",
  ctaLabel: "Shop now",
  order: "0",
};

export const ORDER_STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"];

export const LOW_STOCK_THRESHOLD = 20;

export function downloadCsv(filename, rows) {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
