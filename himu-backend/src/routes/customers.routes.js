import { Router } from "express";
import { getCustomers } from "../controllers/customers.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, restrictTo("admin"), getCustomers);

export default router;
