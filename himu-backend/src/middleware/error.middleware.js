import { ApiError } from "../utils/apiResponse.js";
import { env } from "../config/env.js";

export function notFound(_req, _res, next) {
  next(new ApiError(404, "Route not found"));
}

export function errorHandler(err, _req, res, _next) {
  let statusCode =
    err.statusCode ||
    (err.message === "Origin not allowed by CORS" ? 403 : 500);
  let message = err.message || "Internal server error";

  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "Image must be 8MB or smaller";
  } else if (err.name === "MulterError") {
    statusCode = 400;
    message = err.message || "Invalid upload";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Invalid data submitted";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid identifier";
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value — this record already exists";
  } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired session. Please sign in again.";
  } else if (err.cloudinary) {
    statusCode = err.statusCode || 502;
    message = err.message || "Image upload failed";
  } else if (statusCode >= 500 && env.isProd && !err.cloudinary) {
    message = "Internal server error";
  }

  if (!env.isProd) {
    console.error(err);
  } else if (statusCode >= 500) {
    console.error(`[error] ${err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(!env.isProd && err.stack ? { stack: err.stack } : {}),
  });
}
