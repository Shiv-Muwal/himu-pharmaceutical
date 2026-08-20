import { products as seedProducts } from "@/data/products";
import { slugify } from "@/lib/utils";

const PRODUCTS_KEY = "himu-products-v8";
const ORDERS_KEY = "himu-orders";
const ACTIVITY_KEY = "himu-admin-activity";
const isClient = typeof window !== "undefined";

const mockSeedOrders = [
  {
    id: "HIMU-382910",
    date: "2026-07-28, 04:30 PM",
    customer: {
      name: "Aarav Sharma",
      phone: "9876543210",
      email: "aarav.sharma@example.com",
      address: "Flat 402, Royal Residency, Sector 15",
      city: "Noida",
      pincode: "201301",
    },
    items: [
      {
        productId: "prod-001",
        productName: "HIMU Milky Sunscreen SPF 50",
        price: 499,
        quantity: 2,
        selectedVariant: "HIMU Milky Sunscreen SPF 50",
      },
      {
        productId: "prod-001",
        productName: "HIMU Milky Sunscreen SPF 50",
        price: 499,
        quantity: 1,
        selectedVariant: "HIMU Milky Sunscreen SPF 50",
      },
    ],
    total: 957,
    paymentMethod: "cod",
    status: "Delivered",
  },
  {
    id: "HIMU-194028",
    date: "2026-07-29, 10:15 AM",
    customer: {
      name: "Priya Patel",
      phone: "9123456789",
      email: "priya.patel@example.com",
      address: "12, Green Glen Layout, Outer Ring Road",
      city: "Bengaluru",
      pincode: "560103",
    },
    items: [
      {
        productId: "prod-001",
        productName: "HIMU Milky Sunscreen SPF 50",
        price: 499,
        quantity: 1,
        selectedVariant: "HIMU Milky Sunscreen SPF 50",
      },
    ],
    total: 779,
    paymentMethod: "card",
    status: "Shipped",
  },
  {
    id: "HIMU-827401",
    date: "2026-07-30, 09:45 AM",
    customer: {
      name: "Rohan Verma",
      phone: "9988776655",
      email: "rohan.v@example.com",
      address: "B-45, Shanti Kunj, Vasant Vihar",
      city: "New Delhi",
      pincode: "110057",
    },
    items: [
      {
        productId: "prod-001",
        productName: "HIMU Milky Sunscreen SPF 50",
        price: 499,
        quantity: 3,
        selectedVariant: "HIMU Milky Sunscreen SPF 50",
      },
    ],
    total: 477,
    paymentMethod: "whatsapp",
    status: "Pending",
  },
  {
    id: "HIMU-551203",
    date: "2026-07-27, 02:10 PM",
    customer: {
      name: "Neha Gupta",
      phone: "9811122233",
      email: "neha.g@example.com",
      address: "88, Palm Avenue, Bandra West",
      city: "Mumbai",
      pincode: "400050",
    },
    items: [
      {
        productId: "prod-001",
        productName: "HIMU Hair Revive Oil",
        price: 549,
        quantity: 2,
        selectedVariant: "HIMU Hair Revive Oil",
      },
    ],
    total: 1098,
    paymentMethod: "card",
    status: "Delivered",
  },
  {
    id: "HIMU-662891",
    date: "2026-07-26, 06:40 PM",
    customer: {
      name: "Vikram Singh",
      phone: "9900011122",
      email: "vikram.s@example.com",
      address: "C-19, Civil Lines",
      city: "Jaipur",
      pincode: "302006",
    },
    items: [
      {
        productId: "prod-003",
        productName: "HIMU Derma Soft",
        price: 399,
        quantity: 1,
        selectedVariant: "HIMU Derma Soft",
      },
      {
        productId: "prod-020",
        productName: "HIMU Vitamin Capsules",
        price: 299,
        quantity: 2,
        selectedVariant: "HIMU Vitamin Capsules",
      },
    ],
    total: 997,
    paymentMethod: "cod",
    status: "Cancelled",
  },
  {
    id: "HIMU-773044",
    date: "2026-07-30, 11:20 AM",
    customer: {
      name: "Ananya Reddy",
      phone: "9844433322",
      email: "ananya.r@example.com",
      address: "Plot 7, Jubilee Hills",
      city: "Hyderabad",
      pincode: "500033",
    },
    items: [
      {
        productId: "prod-018",
        productName: "HIMU Face Wash",
        price: 499,
        quantity: 4,
        selectedVariant: "HIMU Face Wash",
      },
    ],
    total: 996,
    paymentMethod: "card",
    status: "Pending",
  },
  {
    id: "HIMU-884155",
    date: "2026-07-25, 08:05 AM",
    customer: {
      name: "Kabir Mehta",
      phone: "9766655544",
      email: "kabir.m@example.com",
      address: "14, SG Highway",
      city: "Ahmedabad",
      pincode: "380015",
    },
    items: [
      {
        productId: "prod-007",
        productName: "HIMU Antibiotic Gel",
        price: 189,
        quantity: 5,
        selectedVariant: "HIMU Antibiotic Gel",
      },
    ],
    total: 945,
    paymentMethod: "whatsapp",
    status: "Shipped",
  },
  {
    id: "HIMU-995266",
    date: "2026-07-24, 03:55 PM",
    customer: {
      name: "Isha Kapoor",
      phone: "9655544433",
      email: "isha.k@example.com",
      address: "House 22, Model Town",
      city: "Chandigarh",
      pincode: "160022",
    },
    items: [
      {
        productId: "prod-030",
        productName: "HIMU Moisturizer",
        price: 429,
        quantity: 2,
        selectedVariant: "HIMU Moisturizer",
      },
    ],
    total: 858,
    paymentMethod: "cod",
    status: "Delivered",
  },
];

function withStock(products) {
  return products.map((product, index) => ({
    ...product,
    stock:
      typeof product.stock === "number"
        ? product.stock
        : [8, 15, 42, 120, 5, 67, 33, 90, 12, 200][index % 10],
    featured: Boolean(product.featured),
    active: product.active !== false,
  }));
}

function pushActivity(entry) {
  if (!isClient) return;
  try {
    const current = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]");
    const next = [
      {
        id: `act_${Date.now()}`,
        at: new Date().toISOString(),
        ...entry,
      },
      ...current,
    ].slice(0, 40);
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function getAdminActivity() {
  if (!isClient) return [];
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getMockProducts() {
  if (!isClient) return withStock(seedProducts);
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (data) return withStock(JSON.parse(data));
    const seeded = withStock(seedProducts);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seeded));
    return seeded;
  } catch (e) {
    console.error("Failed to read products from mock database", e);
    return withStock(seedProducts);
  }
}

export function saveMockProduct(productData) {
  const currentProducts = getMockProducts();
  let savedProduct;
  if (productData.id) {
    const index = currentProducts.findIndex((p) => p.id === productData.id);
    if (index === -1) throw new Error("Product not found");
    savedProduct = {
      ...currentProducts[index],
      ...productData,
      // Keep all legacy price keys in sync when editing in local-admin mode.
      price: productData.mrp ?? productData.price ?? currentProducts[index].price,
      mrp: productData.mrp ?? productData.price ?? currentProducts[index].mrp ?? currentProducts[index].compareAtPrice,
      compareAtPrice: productData.mrp ?? productData.price ?? currentProducts[index].mrp ?? currentProducts[index].compareAtPrice,
      slug: slugify(productData.name),
      stock: Number(productData.stock ?? currentProducts[index].stock ?? 0),
      active: productData.active !== false,
    };
    currentProducts[index] = savedProduct;
    pushActivity({
      type: "product_update",
      message: `Updated product “${savedProduct.name}”`,
    });
  } else {
    const nextId = `prod-${String(currentProducts.length + 1).padStart(3, "0")}`;
    const slug = slugify(productData.name);
    savedProduct = {
      id: nextId,
      slug,
      name: productData.name,
      brand: productData.brand || "",
      productType: productData.productType || productData.category || "General",
      tags: productData.tags || [],
      keywords: productData.keywords || productData.tags || [],
      category: productData.category || "General",
      categorySlug: slugify(productData.category || "general"),
      composition: productData.composition || "N/A",
      strength: productData.strength || "N/A",
      manufacturer: productData.manufacturer || "",
      image:
        productData.image ||
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
      images: productData.images || [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
      ],
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
      variants: productData.variants || [
        { name: productData.name, strength: productData.strength || "N/A" },
      ],
      faq: productData.faq || [
        {
          question: `What is ${productData.name}?`,
          answer: `${productData.name} is a high-quality pharmaceutical product.`,
        },
      ],
      relatedSlugs: [],
      price: productData.mrp ?? productData.price ?? 150,
      mrp: productData.mrp ?? productData.price ?? 150,
      compareAtPrice: productData.mrp ?? productData.price ?? 150,
      shortDescription:
        productData.shortDescription || "Premium care formulation.",
      description:
        productData.description ||
        "Premium care formulation developed for everyday use.",
      stock: Number(productData.stock ?? 100),
      featured: Boolean(productData.featured),
      active: productData.active !== false,
    };
    currentProducts.unshift(savedProduct);
    pushActivity({
      type: "product_create",
      message: `Added product “${savedProduct.name}”`,
    });
  }

  currentProducts.forEach((product) => {
    const related = currentProducts
      .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
      .slice(0, 4)
      .map((p) => p.slug);
    if (related.length < 4) {
      const extras = currentProducts
        .filter((p) => p.slug !== product.slug && !related.includes(p.slug))
        .slice(0, 4 - related.length)
        .map((p) => p.slug);
      product.relatedSlugs = [...related, ...extras];
    } else {
      product.relatedSlugs = related;
    }
  });

  if (isClient) localStorage.setItem(PRODUCTS_KEY, JSON.stringify(currentProducts));
  return savedProduct;
}

export function deleteMockProduct(productId) {
  const currentProducts = getMockProducts();
  const target = currentProducts.find((p) => p.id === productId);
  const updatedProducts = currentProducts.filter((p) => p.id !== productId);
  if (isClient) localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
  if (target) {
    pushActivity({
      type: "product_delete",
      message: `Deleted product “${target.name}”`,
    });
  }
  return updatedProducts;
}

export function getMockOrders() {
  if (!isClient) return mockSeedOrders;
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Refresh seed if older/smaller dataset
      if (!Array.isArray(parsed) || parsed.length < mockSeedOrders.length) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(mockSeedOrders));
        return mockSeedOrders;
      }
      return parsed;
    }
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
    timeStyle: "short",
  });
  const newOrder = {
    ...orderData,
    id: orderId,
    date: currentDate,
    createdAt: new Date().toISOString(),
    status: "Pending",
  };
  currentOrders.unshift(newOrder);
  if (isClient) localStorage.setItem(ORDERS_KEY, JSON.stringify(currentOrders));
  pushActivity({
    type: "order_create",
    message: `New order ${orderId} from ${orderData.customer?.name || "customer"}`,
  });
  return newOrder;
}

export function updateOrderStatus(orderId, status) {
  const currentOrders = getMockOrders();
  const updatedOrders = currentOrders.map((o) =>
    o.id === orderId ? { ...o, status } : o,
  );
  if (isClient) localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
  pushActivity({
    type: "order_status",
    message: `Order ${orderId} marked ${status}`,
  });
  return updatedOrders;
}

export function getCustomersFromOrders(orders = getMockOrders()) {
  const map = new Map();
  orders.forEach((order) => {
    const email = order.customer?.email?.toLowerCase();
    if (!email) return;
    const existing = map.get(email) || {
      id: email,
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
      city: order.customer.city,
      address: order.customer.address || "",
      pincode: order.customer.pincode || "",
      ordersCount: 0,
      totalSpent: 0,
      lastOrder: order.date,
      status: "Active",
    };
    existing.ordersCount += 1;
    if (order.status === "Delivered") existing.totalSpent += Number(order.total) || 0;
    existing.lastOrder = order.date;
    existing.address = order.customer.address || existing.address;
    existing.pincode = order.customer.pincode || existing.pincode;
    existing.city = order.customer.city || existing.city;
    map.set(email, existing);
  });

  if (isClient) {
    try {
      const localCustomers = JSON.parse(localStorage.getItem("himu-local-customers") || "[]");
      localCustomers.forEach((c) => {
        const email = c.email?.toLowerCase();
        if (!email) return;
        if (!map.has(email)) {
          map.set(email, {
            id: email,
            name: c.name,
            email: c.email,
            phone: c.phone || "—",
            city: "—",
            ordersCount: 0,
            totalSpent: 0,
            lastOrder: "Never",
            status: "Registered",
          });
        }
      });
    } catch {
      /* ignore */
    }
  }

  return Array.from(map.values()).sort((a, b) => b.ordersCount - a.ordersCount);
}
