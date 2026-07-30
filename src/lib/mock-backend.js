import { products as seedProducts } from "@/data/products";
import { slugify } from "@/lib/utils";
const PRODUCTS_KEY = "himu-products";
const ORDERS_KEY = "himu-orders";

// Helper to check if window is defined (client-side check)
const isClient = typeof window !== "undefined";

// Seed orders to populate the dashboard on first load
const mockSeedOrders = [{
  id: "HIMU-382910",
  date: "2026-07-18, 04:30 PM",
  customer: {
    name: "Aarav Sharma",
    phone: "9876543210",
    email: "aarav.sharma@example.com",
    address: "Flat 402, Royal Residency, Sector 15",
    city: "Noida",
    pincode: "201301"
  },
  items: [{
    productId: "prod-001",
    productName: "HIMU Amoxi 500",
    price: 249,
    quantity: 2,
    selectedVariant: "HIMU Amoxi 500"
  }, {
    productId: "prod-009",
    productName: "HIMU SkinCare Cream",
    price: 459,
    quantity: 1,
    selectedVariant: "HIMU SkinCare Cream"
  }],
  total: 957,
  paymentMethod: "cod",
  status: "Delivered"
}, {
  id: "HIMU-194028",
  date: "2026-07-19, 10:15 AM",
  customer: {
    name: "Priya Patel",
    phone: "9123456789",
    email: "priya.patel@example.com",
    address: "12, Green Glen Layout, Outer Ring Road",
    city: "Bengaluru",
    pincode: "560103"
  },
  items: [{
    productId: "prod-040",
    productName: "HIMU Radiance Serum",
    price: 779,
    quantity: 1,
    selectedVariant: "HIMU Radiance Serum"
  }],
  total: 779,
  paymentMethod: "card",
  status: "Shipped"
}, {
  id: "HIMU-827401",
  date: "2026-07-19, 09:45 PM",
  customer: {
    name: "Rohan Verma",
    phone: "9988776655",
    email: "rohan.v@example.com",
    address: "B-45, Shanti Kunj, Vasant Vihar",
    city: "New Delhi",
    pincode: "110057"
  },
  items: [{
    productId: "prod-064",
    productName: "HIMU Cough Syrup",
    price: 159,
    quantity: 3,
    selectedVariant: "HIMU Cough Syrup"
  }],
  total: 477,
  paymentMethod: "whatsapp",
  status: "Pending"
}];
export function getMockProducts() {
  if (!isClient) return seedProducts;
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Initialize with seed data
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seedProducts));
    return seedProducts;
  } catch (e) {
    console.error("Failed to read products from mock database", e);
    return seedProducts;
  }
}
export function saveMockProduct(productData) {
  const currentProducts = getMockProducts();
  let savedProduct;
  if (productData.id) {
    // Edit existing product
    const index = currentProducts.findIndex(p => p.id === productData.id);
    if (index === -1) throw new Error("Product not found");
    savedProduct = {
      ...currentProducts[index],
      ...productData,
      slug: slugify(productData.name)
    };
    currentProducts[index] = savedProduct;
  } else {
    // Add new product
    const nextId = `prod-${String(currentProducts.length + 1).padStart(3, "0")}`;
    const slug = slugify(productData.name);
    savedProduct = {
      id: nextId,
      slug,
      name: productData.name,
      category: productData.category || "General",
      categorySlug: slugify(productData.category || "general"),
      composition: productData.composition || "N/A",
      strength: productData.strength || "N/A",
      manufacturer: productData.manufacturer || "HIMU Pharmacy Pvt. Ltd.",
      image: productData.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
      images: productData.images || ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop"],
      benefits: productData.benefits || ["Quality formulation"],
      uses: productData.uses || ["As directed by a physician"],
      indications: productData.indications || ["For therapeutic management"],
      dosage: productData.dosage || "As directed by the physician",
      administration: productData.administration || "Take as directed by your physician.",
      precautions: productData.precautions || ["Keep out of reach of children"],
      warnings: productData.warnings || ["Not for self-medication"],
      sideEffects: productData.sideEffects || ["Mild discomfort in rare cases"],
      storage: productData.storage || "Store in a cool, dry place",
      packaging: productData.packaging || "Standard packaging",
      shelfLife: productData.shelfLife || "36 months",
      variants: productData.variants || [{
        name: productData.name,
        strength: productData.strength || "N/A"
      }],
      faq: productData.faq || [{
        question: `What is ${productData.name}?`,
        answer: `${productData.name} is a high-quality pharmaceutical product.`
      }],
      relatedSlugs: [],
      price: productData.price || 150,
      compareAtPrice: productData.compareAtPrice || Math.round((productData.price || 150) * 1.35 / 10) * 10 - 1,
      shortDescription: productData.shortDescription || "HIMU high-quality pharmaceutical formulation.",
      description: productData.description || "HIMU high-quality pharmaceutical formulation developed under GMP guidelines."
    };
    currentProducts.push(savedProduct);
  }

  // Recalculate related slugs
  currentProducts.forEach(product => {
    const related = currentProducts.filter(p => p.categorySlug === product.categorySlug && p.slug !== product.slug).slice(0, 4).map(p => p.slug);
    if (related.length < 4) {
      const extras = currentProducts.filter(p => p.slug !== product.slug && !related.includes(p.slug)).slice(0, 4 - related.length).map(p => p.slug);
      product.relatedSlugs = [...related, ...extras];
    } else {
      product.relatedSlugs = related;
    }
  });
  if (isClient) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(currentProducts));
  }
  return savedProduct;
}
export function deleteMockProduct(productId) {
  const currentProducts = getMockProducts();
  const updatedProducts = currentProducts.filter(p => p.id !== productId);
  if (isClient) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
  }
  return updatedProducts;
}
export function getMockOrders() {
  if (!isClient) return mockSeedOrders;
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // Initialize with seed orders
    localStorage.setItem(ORDERS_KEY, JSON.stringify(mockSeedOrders));
    return mockSeedOrders;
  } catch (e) {
    console.error("Failed to read orders from mock database", e);
    return mockSeedOrders;
  }
}
export function saveMockOrder(orderData) {
  const currentOrders = getMockOrders();
  const orderId = `HIMU-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short"
  });
  const newOrder = {
    ...orderData,
    id: orderId,
    date: currentDate,
    status: "Pending"
  };
  currentOrders.unshift(newOrder); // Add to the top of list

  if (isClient) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(currentOrders));
  }
  return newOrder;
}
export function updateOrderStatus(orderId, status) {
  const currentOrders = getMockOrders();
  const updatedOrders = currentOrders.map(o => o.id === orderId ? {
    ...o,
    status
  } : o);
  if (isClient) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
  }
  return updatedOrders;
}
