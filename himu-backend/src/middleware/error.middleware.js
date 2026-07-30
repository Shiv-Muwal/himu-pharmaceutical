import { ApiError } from "../utils/apiResponse.js";
import { env } from "../config/env.js";

export function notFound(_req, _res, next) {
  next(new ApiError(404, "Route not found"));
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || (err.message === "Origin not allowed by CORS" ? 403 : 500);
  const message = err.message || "Internal server error";

  if (env.nodeEnv === "development") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.nodeEnv === "development" && err.stack ? { stack: err.stack } : {}),
  });
}
