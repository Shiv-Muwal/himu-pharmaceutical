import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiResponse.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function extractBearer(header) {
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  return token || null;
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] });
  } catch {
    throw new ApiError(401, "Invalid or expired session. Please sign in again.");
  }
}

function assertSessionValid(user, decoded) {
  if (!user) {
    throw new ApiError(401, "Invalid or expired session. Please sign in again.");
  }
  if (user.active === false) {
    throw new ApiError(403, "This account has been disabled.");
  }
  if (user.passwordChangedAt && decoded.iat) {
    const changedMs = new Date(user.passwordChangedAt).getTime();
    if (decoded.iat * 1000 < changedMs) {
      throw new ApiError(401, "Session expired after password change. Please sign in again.");
    }
  }
}

export const protect = asyncHandler(async (req, _res, next) => {
  const token = extractBearer(req.headers.authorization);
  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  const decoded = verifyAccessToken(token);
  if (!decoded?.id) {
    throw new ApiError(401, "Invalid or expired session. Please sign in again.");
  }

  const user = await User.findById(decoded.id);
  assertSessionValid(user, decoded);

  req.user = user;
  next();
});

export const restrictTo = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to perform this action");
    }
    next();
  });

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = extractBearer(req.headers.authorization);
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] });
    if (!decoded?.id) return next();
    const user = await User.findById(decoded.id);
    if (user && user.active !== false) {
      if (user.passwordChangedAt && decoded.iat) {
        const changedMs = new Date(user.passwordChangedAt).getTime();
        if (decoded.iat * 1000 < changedMs) return next();
      }
      req.user = user;
    }
  } catch {
    // ignore invalid tokens on public routes
  }
  next();
});
