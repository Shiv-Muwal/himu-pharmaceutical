import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { EmailOtp } from "../models/EmailOtp.js";
import { ApiError } from "../utils/apiResponse.js";
import { success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { assertGmailAddress, normalizeEmail } from "../utils/email-rules.js";
import { sendOtpEmail } from "../utils/mailer.js";

/** Dummy hash so missing-user logins take similar time (harder email enumeration timing). */
const DUMMY_HASH =
  "$2b$12$q3qHnFy2hoJjcyOkREQorOAWV03aZokv1xBepYMlWvNA.Y.NWhSOm";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_VERIFY_TTL_MS = 30 * 60 * 1000;

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
    algorithm: "HS256",
  });
}

function signEmailVerifyToken(email) {
  return jwt.sign({ purpose: "email_verify", email }, env.jwtSecret, {
    expiresIn: "30m",
    algorithm: "HS256",
  });
}

function hashOtp(code) {
  return crypto.createHash("sha256").update(String(code)).digest("hex");
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

function assertValidPhone(phone) {
  const value = String(phone || "").replace(/\s+/g, "");
  if (!/^\+?[0-9-]{10,16}$/.test(value) || value.replace(/\D/g, "").length < 10) {
    throw new ApiError(400, "A valid mobile number is required");
  }
  return value;
}

export const sendSignupOtp = asyncHandler(async (req, res) => {
  let email;
  try {
    email = assertGmailAddress(req.body.email);
  } catch (err) {
    throw new ApiError(400, err.message);
  }

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const otp = String(crypto.randomInt(100000, 999999));
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await EmailOtp.deleteMany({ email });
  await EmailOtp.create({
    email,
    codeHash: hashOtp(otp),
    expiresAt,
    verifiedAt: null,
    attempts: 0,
  });

  const delivery = await sendOtpEmail(email, otp);
  const payload = {
    email,
    expiresInSec: Math.floor(OTP_TTL_MS / 1000),
    delivered: delivery.delivered,
  };
  if (!env.isProd && delivery.devMode) {
    payload.devOtp = otp;
  }

  success(
    res,
    payload,
    delivery.delivered
      ? "OTP sent to your Gmail inbox"
      : "OTP generated (dev mode — check server logs / response)",
  );
});

export const verifySignupOtp = asyncHandler(async (req, res) => {
  let email;
  try {
    email = assertGmailAddress(req.body.email);
  } catch (err) {
    throw new ApiError(400, err.message);
  }
  const otp = String(req.body.otp || "").trim();
  if (!/^\d{6}$/.test(otp)) throw new ApiError(400, "Enter the 6-digit OTP sent to your email");

  const record = await EmailOtp.findOne({ email }).sort({ createdAt: -1 });
  if (!record || record.expiresAt.getTime() < Date.now()) {
    throw new ApiError(400, "OTP expired. Please request a new one.");
  }
  if (record.attempts >= 5) {
    throw new ApiError(429, "Too many invalid OTP attempts. Request a new code.");
  }

  if (record.codeHash !== hashOtp(otp)) {
    record.attempts += 1;
    await record.save();
    throw new ApiError(400, "Invalid OTP. Please try again.");
  }

  record.verifiedAt = new Date();
  record.expiresAt = new Date(Date.now() + OTP_VERIFY_TTL_MS);
  await record.save();

  const emailToken = signEmailVerifyToken(email);
  success(res, { email, emailToken, verified: true }, "Email verified successfully");
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, emailToken } = req.body;
  let normalizedEmail;
  try {
    normalizedEmail = assertGmailAddress(email);
  } catch (err) {
    throw new ApiError(400, err.message);
  }
  const normalizedPhone = assertValidPhone(phone);

  if (!emailToken) {
    throw new ApiError(400, "Please verify your Gmail with OTP before creating an account.");
  }

  let tokenPayload;
  try {
    tokenPayload = jwt.verify(emailToken, env.jwtSecret, { algorithms: ["HS256"] });
  } catch {
    throw new ApiError(400, "Email verification expired. Please request a new OTP.");
  }
  if (tokenPayload.purpose !== "email_verify" || tokenPayload.email !== normalizedEmail) {
    throw new ApiError(400, "Email verification does not match. Please verify again.");
  }

  const otpRecord = await EmailOtp.findOne({
    email: normalizedEmail,
    verifiedAt: { $ne: null },
  }).sort({ createdAt: -1 });
  if (!otpRecord || otpRecord.expiresAt.getTime() < Date.now()) {
    throw new ApiError(400, "Email verification expired. Please request a new OTP.");
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new ApiError(409, "An account with this email already exists");

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password,
    phone: normalizedPhone,
    role: "customer",
    active: true,
  });

  await EmailOtp.deleteMany({ email: normalizedEmail });

  const token = signToken(user);
  success(res, { token, user: publicUser(user) }, "Account created successfully", 201);
});

export const login = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
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
  const email = normalizeEmail(req.body.email);
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
