import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiResponse.js";
import { success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/** Dummy hash so missing-user logins take similar time (harder email enumeration timing). */
const DUMMY_HASH =
  "$2b$12$q3qHnFy2hoJjcyOkREQorOAWV03aZokv1xBepYMlWvNA.Y.NWhSOm";

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
    algorithm: "HS256",
  });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
  };
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone = "" } = req.body;
  const normalizedEmail = String(email).toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password,
    phone: String(phone || "").trim(),
    role: "customer",
    active: true,
  });

  const token = signToken(user);
  success(res, { token, user: publicUser(user) }, "Account created successfully", 201);
});

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "")
    .toLowerCase()
    .trim();
  const password = String(req.body.password || "");

  const user = await User.findOne({ email }).select("+password");

  const hash = user?.password || DUMMY_HASH;
  const passwordOk = await bcrypt.compare(password, hash);

  if (!user || !passwordOk) {
    throw new ApiError(401, "Invalid email or password");
  }
  if (user.active === false) {
    throw new ApiError(403, "This account has been disabled.");
  }

  const token = signToken(user);
  success(res, { token, user: publicUser(user) }, "Login successful");
});

export const getMe = asyncHandler(async (req, res) => {
  success(res, publicUser(req.user));
});

export const updateMe = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "")
    .toLowerCase()
    .trim();
  const phone = typeof req.body.phone === "string" ? req.body.phone.trim() : undefined;

  const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
  if (existing) throw new ApiError(409, "Email address is already in use");

  req.user.name = name;
  req.user.email = email;
  if (phone !== undefined) req.user.phone = phone;
  await req.user.save();
  success(res, publicUser(req.user), "Profile updated");
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(req.body.currentPassword))) {
    throw new ApiError(401, "Current password is incorrect");
  }
  user.password = req.body.newPassword;
  await user.save();
  success(res, null, "Password updated. Please sign in again.");
});
