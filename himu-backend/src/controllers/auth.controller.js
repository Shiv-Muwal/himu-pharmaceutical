import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiResponse.js";
import { success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
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
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
    phone: phone.trim(),
    role: "customer",
  });

  const token = signToken(user);
  success(res, { token, user: publicUser(user) }, "Account created successfully", 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken(user);
  success(res, { token, user: publicUser(user) }, "Login successful");
});

export const getMe = asyncHandler(async (req, res) => {
  success(res, publicUser(req.user));
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
  if (existing) throw new ApiError(409, "Email address is already in use");
  req.user.name = name;
  req.user.email = email.toLowerCase();
  if (typeof phone === "string") req.user.phone = phone.trim();
  await req.user.save();
  success(res, publicUser(req.user), "Profile updated");
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(req.body.currentPassword))) throw new ApiError(401, "Current password is incorrect");
  user.password = req.body.newPassword;
  await user.save();
  success(res, null, "Password updated");
});
