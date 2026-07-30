import { Router } from "express";
import {
  submitApplication,
  getApplications,
} from "../controllers/careers.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { careerValidation } from "../validators/index.js";

const router = Router();

router.post("/apply", careerValidation, validate, submitApplication);
router.get("/applications", protect, getApplications);

export default router;
