import { Router } from "express";
import {
  register,
  login,
  googleAuth,
  sendSignupOtp,
  verifySignupOtp,
  getMe,
  updateMe,
  changePassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  loginRateLimit,
  registerRateLimit,
  otpRateLimit,
} from "../middleware/rate-limit.middleware.js";
import {
  registerValidation,
  loginValidation,
  googleAuthValidation,
  sendOtpValidation,
  verifyOtpValidation,
  profileValidation,
  passwordChangeValidation,
} from "../validators/index.js";

const router = Router();

router.post("/send-otp", otpRateLimit, sendOtpValidation, validate, sendSignupOtp);
router.post("/verify-otp", otpRateLimit, verifyOtpValidation, validate, verifySignupOtp);
router.post("/register", registerRateLimit, registerValidation, validate, register);
router.post("/login", loginRateLimit, loginValidation, validate, login);
router.post("/google", loginRateLimit, googleAuthValidation, validate, googleAuth);
router.get("/me", protect, getMe);
router.patch("/me", protect, profileValidation, validate, updateMe);
router.patch("/password", protect, passwordChangeValidation, validate, changePassword);

export default router;
