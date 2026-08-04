import express from "express";
import cors from "cors";
import helmet from 'helmet';
import morgan from "morgan";
import path from "node:path";
import { env, isAllowedOrigin } from "./config/env.js";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";
import { apiRateLimit, authRateLimit } from "./middleware/rate-limit.middleware.js";
import { uploadsRoot } from "./middleware/upload.middleware.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
function isDevLanOrigin(origin) {
  if (env.nodeEnv === "production") return false;
  try {
    const { hostname } = new URL(origin);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      /^192\.168\.\d+\.\d+$/.test(hostname) ||
      /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(hostname)
    );
  } catch {
    return false;
  }
}

app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin) || isDevLanOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: false,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
}));
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use("/uploads", express.static(path.resolve(uploadsRoot)));

app.use("/api", apiRateLimit);
app.use("/api/auth", authRateLimit);
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
