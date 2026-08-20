import { getApiBaseUrl, getApiOrigin } from "@/lib/api-base";

// Legacy helper bindings keep the old local-only code inert while ensuring no
// mock backend is included in a production build.
const disabledMock = () => {
  throw new Error("Mock storage is disabled. Use the live API.");
};
const deleteMockProduct = disabledMock;
const getAdminActivity = disabledMock;
const getCustomersFromOrders = disabledMock;
const getMockOrders = disabledMock;
const getMockProducts = disabledMock;
const saveMockOrder = disabledMock;
const saveMockProduct = disabledMock;
const updateOrderStatus = disabledMock;
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
  const controller = new AbortController();
  const timeoutMs = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 15000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const fallback =
        response.status === 502 || response.status === 503 || response.status === 504
          ? "API server is down (502). Restart himu-backend with pm2 on the server."
          : response.status === 0
            ? "Network error — cannot reach API."
            : "Request failed";
      throw new ApiError(payload.message || fallback, response.status);
    }

    const data = payload.data;
    if (Array.isArray(data)) {
      return { items: data, pagination: payload.pagination };
    }
    return data;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new ApiError("Server took too long to respond. Check API / nginx proxy.", 408);
    }
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error?.message || "Network error — cannot reach API. Is /api proxied correctly?",
      0,
    );
  } finally {
    clearTimeout(timer);
  }
}

/** Multipart upload helper (do not set Content-Type — browser sets boundary). */
export async function uploadApi(path, formData, { token } = {}) {
  if (USE_LOCAL_ADMIN) {
    throw new ApiError("File upload requires the live API (disable VITE_USE_LOCAL_ADMIN)", 501);
  }

  const url = `${getApiBaseUrl()}${path}`;
  const controller = new AbortController();
  const timeoutMs = Number(import.meta.env.VITE_UPLOAD_TIMEOUT_MS) || 90000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const hint =
        response.status === 401 || response.status === 403
          ? "Please sign in again as admin."
          : response.status === 503
            ? "Cloudinary/API not configured on server."
            : response.status === 502 || response.status === 504
              ? "API/proxy error while uploading."
              : "Upload failed";
      throw new ApiError(payload.message || hint, response.status);
    }
    if (!payload?.data?.url) {
      throw new ApiError("Upload succeeded but no image URL was returned", 502);
    }
    return payload.data;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new ApiError("Upload timed out. Try a smaller image (under 2MB).", 408);
    }
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      `Cannot reach API at ${url}. Check backend / nginx /api proxy.`,
      0,
    );
  } finally {
    clearTimeout(timer);
  }
}

export function mediaUrl(src) {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  if (src.startsWith("/uploads/")) {
    return `${getApiOrigin()}${src}`;
  }
  if (src.startsWith("/") && import.meta.env.BASE_URL && import.meta.env.BASE_URL !== "/") {
    return `${import.meta.env.BASE_URL}${src.replace(/^\//, "")}`;
  }
  return src;
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
