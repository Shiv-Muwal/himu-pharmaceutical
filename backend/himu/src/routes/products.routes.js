import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { productValidation, productUpdateValidation } from "../validators/index.js";

const router = Router();

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.post("/", protect, productValidation, validate, createProduct);
router.put("/:id", protect, productUpdateValidation, validate, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
