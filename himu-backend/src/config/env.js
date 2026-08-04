import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const jwtSecret = process.env.JWT_SECRET;

if (nodeEnv === "production" && (!jwtSecret || jwtSecret.length < 32)) {
  console.error(
    "[himu-backend] WARNING: JWT_SECRET missing or shorter than 32 chars. Set a strong JWT_SECRET in .env",
  );
}

export const env = {
  port: Number(process.env.PORT) || 5001,
  nodeEnv,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/himu-pharmacy",
  useMemoryDb:
    process.env.USE_MEMORY_DB === "true" ||
    process.env.MONGODB_URI === "memory",
  autoSeed: process.env.AUTO_SEED !== "false",
  jwtSecret:
    jwtSecret && jwtSecret.length >= 32
      ? jwtSecret
      : "development-only-secret-do-not-use-in-production-please-set-jwt-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  adminEmail: process.env.ADMIN_EMAIL || "admin@himu.local",
  adminPassword: process.env.ADMIN_PASSWORD || "HimuAdmin@2026",
  customerEmail: process.env.CUSTOMER_EMAIL || "customer@himu.local",
  customerPassword: process.env.CUSTOMER_PASSWORD || "HimuCustomer@2026",
  customerName: process.env.CUSTOMER_NAME || "Demo Customer",
  customerPhone: process.env.CUSTOMER_PHONE || "9876543210",
  clientUrls: (
    process.env.CLIENT_URL ||
    "http://localhost:5173,http://localhost:5174,https://sitetest.himupharmaceutical.com,https://himupharmaceutical.com,https://www.himupharmaceutical.com"
  )
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
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
