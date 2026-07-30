import { Router } from "express";
import { login, getMe, updateMe, changePassword } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginValidation, profileValidation, passwordChangeValidation } from "../validators/index.js";

const router = Router();

router.post("/login", loginValidation, validate, login);
router.get("/me", protect, getMe);
router.patch("/me", protect, profileValidation, validate, updateMe);
router.patch("/password", protect, passwordChangeValidation, validate, changePassword);

export default router;
