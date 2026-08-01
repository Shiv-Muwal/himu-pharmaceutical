import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const jwtSecret = process.env.JWT_SECRET;

if (nodeEnv === "production" && (!jwtSecret || jwtSecret.length < 32)) {
  throw new Error("JWT_SECRET must be at least 32 characters in production");
}

export const env = {
  port: Number(process.env.PORT) || 5001,
  nodeEnv,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/himu-pharmacy",
  useMemoryDb:
    process.env.USE_MEMORY_DB === "true" ||
    process.env.MONGODB_URI === "memory",
  autoSeed: process.env.AUTO_SEED !== "false",
  jwtSecret: jwtSecret || "development-only-secret-do-not-use-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  adminEmail: process.env.ADMIN_EMAIL || "admin@himupharmacy.com",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  customerEmail: process.env.CUSTOMER_EMAIL || "customer@himu.local",
  customerPassword: process.env.CUSTOMER_PASSWORD || "HimuCustomer@2026",
  customerName: process.env.CUSTOMER_NAME || "Demo Customer",
  customerPhone: process.env.CUSTOMER_PHONE || "9876543210",
  clientUrls: (
    process.env.CLIENT_URL ||
    "http://localhost:5173,http://localhost:5174"
  )
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
};
