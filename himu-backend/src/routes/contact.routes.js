import { Router } from "express";
import {
  submitContact,
  getContacts,
  updateContactStatus,
} from "../controllers/contact.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { formRateLimit } from "../middleware/rate-limit.middleware.js";
import { contactValidation } from "../validators/index.js";

const router = Router();

router.post("/", formRateLimit, contactValidation, validate, submitContact);
router.get("/", protect, restrictTo("admin"), getContacts);
router.patch("/:id/status", protect, restrictTo("admin"), updateContactStatus);

export default router;
