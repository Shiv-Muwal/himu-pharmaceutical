import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiResponse.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required");
  }

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] });
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;
  next();
});

export const restrictTo = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to perform this action");
    }
    next();
  });

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] });
    const user = await User.findById(decoded.id);
    if (user) req.user = user;
  } catch {
    // ignore invalid tokens for public routes
  }
  next();
});
