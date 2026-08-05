import { Router } from "express";
import {
  submitApplication,
  getApplications,
} from "../controllers/careers.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { formRateLimit } from "../middleware/rate-limit.middleware.js";
import { careerValidation } from "../validators/index.js";

const router = Router();

router.post("/apply", formRateLimit, careerValidation, validate, submitApplication);
router.get("/applications", protect, restrictTo("admin"), getApplications);

export default router;
