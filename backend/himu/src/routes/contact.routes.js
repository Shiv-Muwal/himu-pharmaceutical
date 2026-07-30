import { Router } from "express";
import {
  submitContact,
  getContacts,
  updateContactStatus,
} from "../controllers/contact.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { contactValidation } from "../validators/index.js";

const router = Router();

router.post("/", contactValidation, validate, submitContact);
router.get("/", protect, getContacts);
router.patch("/:id/status", protect, updateContactStatus);

export default router;
