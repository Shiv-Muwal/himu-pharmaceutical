import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const jwtSecret = process.env.JWT_SECRET;
const isProd = nodeEnv === "production";

const DEFAULT_ADMIN_PASSWORD = "HimuAdmin@2026";
const DEFAULT_CUSTOMER_PASSWORD = "HimuCustomer@2026";
const DEV_JWT_FALLBACK =
  "development-only-secret-do-not-use-in-production-please-set-jwt-secret";

if (isProd) {
  if (!jwtSecret || jwtSecret.length < 32) {
    console.error(
      "[himu-backend] FATAL: Set JWT_SECRET to a random string of at least 32 characters in production.",
    );
    process.exit(1);
  }
  if (jwtSecret === DEV_JWT_FALLBACK) {
    console.error("[himu-backend] FATAL: Refusing to use the development JWT secret in production.");
    process.exit(1);
  }
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === DEFAULT_ADMIN_PASSWORD) {
    console.error(
      "[himu-backend] FATAL: Set a unique ADMIN_PASSWORD in production (do not use the demo default).",
    );
    process.exit(1);
  }
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI === "memory") {
    console.error(
      "[himu-backend] FATAL: Set a real MONGODB_URI in production (Atlas or managed MongoDB).",
    );
    process.exit(1);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5001,
  nodeEnv,
  isProd,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/himu-pharmacy",
  useMemoryDb:
    process.env.USE_MEMORY_DB === "true" ||
    process.env.MONGODB_URI === "memory",
  /** Production: opt-in only. Dev: on unless AUTO_SEED=false */
  autoSeed: isProd
    ? process.env.AUTO_SEED === "true"
    : process.env.AUTO_SEED !== "false",
  jwtSecret:
    jwtSecret && jwtSecret.length >= 32 ? jwtSecret : DEV_JWT_FALLBACK,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  adminEmail: process.env.ADMIN_EMAIL || "admin@himu.local",
  adminPassword: process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
  customerEmail: process.env.CUSTOMER_EMAIL || "customer@himu.local",
  customerPassword: process.env.CUSTOMER_PASSWORD || DEFAULT_CUSTOMER_PASSWORD,
  customerName: process.env.CUSTOMER_NAME || "Demo Customer",
  customerPhone: process.env.CUSTOMER_PHONE || "9876543210",
  clientUrls: (
    process.env.CLIENT_URL ||
    "http://localhost:5173,http://localhost:5174,https://sitetest.himupharmaceutical.com,https://himupharmaceutical.com,https://www.himupharmaceutical.com"
  )
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  cloudinaryFolder: process.env.CLOUDINARY_FOLDER || "himu-pharmaceutical",
};

/** Allow configured URLs + any himupharmaceutical.com host (http/https). */
export function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (env.clientUrls.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    if (
      hostname === "himupharmaceutical.com" ||
      hostname.endsWith(".himupharmaceutical.com")
    ) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
