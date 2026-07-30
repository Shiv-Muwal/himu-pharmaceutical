import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { productValidation, productUpdateValidation } from "../validators/index.js";

const router = Router();

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.post("/", protect, restrictTo("admin"), productValidation, validate, createProduct);
router.put("/:id", protect, restrictTo("admin"), productUpdateValidation, validate, updateProduct);
router.delete("/:id", protect, restrictTo("admin"), deleteProduct);

export default router;
