import {
  deleteMockProduct,
  getAdminActivity,
  getCustomersFromOrders,
  getMockOrders,
  getMockProducts,
  saveMockOrder,
  saveMockProduct,
  updateOrderStatus,
} from "@/lib/mock-backend";
import { getApiBaseUrl } from "@/lib/api-base";

const USE_LOCAL_ADMIN = import.meta.env.VITE_USE_LOCAL_ADMIN === "true";
const LOCAL_ADMIN_KEY = "himu-local-admin-profile";
const LOCAL_ADMIN_TOKEN = "himu-local-admin-token";
const LOCAL_CUSTOMERS_KEY = "himu-local-customers";
const LOCAL_CUSTOMER_TOKEN_PREFIX = "himu-local-customer:";

const localAdminDefaults = {
  name: "HIMU Local Admin",
  email: import.meta.env.VITE_LOCAL_ADMIN_EMAIL || "admin@himu.local",
  password: import.meta.env.VITE_LOCAL_ADMIN_PASSWORD || "HimuAdmin@2026",
  role: "admin",
  phone: "",
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function getLocalAdmin() {
  const stored = localStorage.getItem(LOCAL_ADMIN_KEY);
  if (!stored) return localAdminDefaults;
  return { ...localAdminDefaults, ...JSON.parse(stored) };
}

function saveLocalAdmin(admin) {
  localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(admin));
}

function getLocalCustomers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CUSTOMERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalCustomers(customers) {
  localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(customers));
}

function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

function requireLocalAuth(token) {
  if (token === LOCAL_ADMIN_TOKEN) return { type: "admin", user: getLocalAdmin() };

  if (typeof token === "string" && token.startsWith(LOCAL_CUSTOMER_TOKEN_PREFIX)) {
    const email = token.slice(LOCAL_CUSTOMER_TOKEN_PREFIX.length).toLowerCase();
    const customer = getLocalCustomers().find((c) => c.email === email);
    if (customer) return { type: "customer", user: customer };
  }

  throw new ApiError("Session expired. Please sign in again.", 401);
}

function getJsonBody(options) {
  if (!options.body) return {};
  return typeof options.body === "string" ? JSON.parse(options.body) : options.body;
}

function localApi(path, { token, method = "GET", ...options } = {}) {
  const body = getJsonBody(options);

  if (path === "/auth/register" && method === "POST") {
    const email = body.email?.toLowerCase()?.trim();
    const customers = getLocalCustomers();
    const admin = getLocalAdmin();
    if (!email || !body.password || !body.name) {
      throw new ApiError("Name, email and password are required", 400);
    }
    if (body.password.length < 8) {
      throw new ApiError("Password must be at least 8 characters", 400);
    }
    if (email === admin.email.toLowerCase() || customers.some((c) => c.email === email)) {
      throw new ApiError("An account with this email already exists", 409);
    }
    const customer = {
      id: `cust_${Date.now()}`,
      name: body.name.trim(),
      email,
      password: body.password,
      phone: body.phone?.trim() || "",
      role: "customer",
    };
    saveLocalCustomers([customer, ...customers]);
    return {
      token: `${LOCAL_CUSTOMER_TOKEN_PREFIX}${email}`,
      user: publicUser(customer),
    };
  }

  if (path === "/auth/login" && method === "POST") {
    const email = body.email?.toLowerCase()?.trim();
    const admin = getLocalAdmin();
    if (email === admin.email.toLowerCase() && body.password === admin.password) {
      return { token: LOCAL_ADMIN_TOKEN, user: publicUser(admin) };
    }
    const customer = getLocalCustomers().find((c) => c.email === email);
    if (customer && customer.password === body.password) {
      return {
        token: `${LOCAL_CUSTOMER_TOKEN_PREFIX}${email}`,
        user: publicUser(customer),
      };
    }
    throw new ApiError("Invalid email or password", 401);
  }

  // Public checkout — no auth required
  if (path === "/orders" && method === "POST") {
    const products = getMockProducts();
    const items = (body.items || []).map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const price = product?.price || 0;
      return {
        productId: item.productId,
        productName: item.productName || product?.name || "Product",
        price,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant || product?.name || "",
      };
    });
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return saveMockOrder({
      customer: body.customer,
      items,
      total,
      paymentMethod: body.paymentMethod || "cod",
    });
  }

  if (path === "/contact" && method === "POST") {
    return { id: `contact_${Date.now()}`, ok: true };
  }

  if (path === "/careers/apply" && method === "POST") {
    return { id: `career_${Date.now()}`, ok: true };
  }

  const session = requireLocalAuth(token);

  if (path === "/auth/me" && method === "GET") {
    return publicUser(session.user);
  }

  if (path === "/auth/me" && method === "PATCH") {
    if (session.type === "admin") {
      const current = getLocalAdmin();
      const updated = { ...current, name: body.name, email: body.email, phone: body.phone ?? current.phone };
      saveLocalAdmin(updated);
      return publicUser(updated);
    }
    const customers = getLocalCustomers();
    const updatedList = customers.map((c) =>
      c.email === session.user.email
        ? { ...c, name: body.name, email: body.email.toLowerCase(), phone: body.phone ?? c.phone }
        : c,
    );
    saveLocalCustomers(updatedList);
    const updated = updatedList.find((c) => c.email === body.email.toLowerCase());
    return publicUser(updated);
  }

  if (path === "/auth/password" && method === "PATCH") {
    if (session.type === "admin") {
      const admin = getLocalAdmin();
      if (body.currentPassword !== admin.password) {
        throw new ApiError("Current password is incorrect", 401);
      }
      saveLocalAdmin({ ...admin, password: body.newPassword });
      return { ok: true };
    }
    const customers = getLocalCustomers();
    const customer = customers.find((c) => c.email === session.user.email);
    if (!customer || body.currentPassword !== customer.password) {
      throw new ApiError("Current password is incorrect", 401);
    }
    saveLocalCustomers(
      customers.map((c) =>
        c.email === customer.email ? { ...c, password: body.newPassword } : c,
      ),
    );
    return { ok: true };
  }

  if (session.type !== "admin") {
    throw new ApiError("You do not have permission to perform this action", 403);
  }

  if (path.startsWith("/products") && method === "GET") {
    return { items: getMockProducts() };
  }

  if (path === "/products" && method === "POST") {
    return saveMockProduct(body);
  }

  if (path.startsWith("/products/") && method === "PUT") {
    const id = path.split("/").pop();
    return saveMockProduct({ ...body, id });
  }

  if (path.startsWith("/products/") && method === "DELETE") {
    const id = path.split("/").pop();
    deleteMockProduct(id);
    return { ok: true };
  }

  if (path.startsWith("/orders") && method === "GET") {
    return { items: getMockOrders() };
  }

  if (path.startsWith("/orders/") && path.endsWith("/status") && method === "PATCH") {
    const id = path.split("/")[2];
    return updateOrderStatus(id, body.status).find((order) => order.id === id);
  }

  if (path.startsWith("/customers") && method === "GET") {
    return { items: getCustomersFromOrders() };
  }

  if (path.startsWith("/activity") && method === "GET") {
    return { items: getAdminActivity() };
  }

  throw new ApiError("Local admin endpoint is not configured", 404);
}

export async function api(path, { token, ...options } = {}) {
  if (USE_LOCAL_ADMIN) {
    return localApi(path, { token, ...options });
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(payload.message || "Request failed", response.status);

  const data = payload.data;
  if (Array.isArray(data)) {
    return { items: data, pagination: payload.pagination };
  }
  return data;
}

export const adminSession = {
  get: () => sessionStorage.getItem("himu-admin-token"),
  set: (token) => sessionStorage.setItem("himu-admin-token", token),
  clear: () => sessionStorage.removeItem("himu-admin-token"),
};

export const customerSession = {
  get: () => localStorage.getItem("himu-customer-token"),
  set: (token) => localStorage.setItem("himu-customer-token", token),
  clear: () => localStorage.removeItem("himu-customer-token"),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem("himu-customer-user") || "null");
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem("himu-customer-user", JSON.stringify(user)),
  clearUser: () => localStorage.removeItem("himu-customer-user"),
};
