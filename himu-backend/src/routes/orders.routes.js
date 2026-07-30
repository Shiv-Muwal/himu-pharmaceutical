import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orders.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { orderValidation, orderStatusValidation } from "../validators/index.js";

const router = Router();

router.post("/", orderValidation, validate, createOrder);
router.get("/", protect, restrictTo("admin"), getOrders);
router.get("/:id", protect, restrictTo("admin"), getOrderById);
router.patch("/:id/status", protect, restrictTo("admin"), orderStatusValidation, validate, updateOrderStatus);

export default router;
