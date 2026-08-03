import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductMedia,
} from "../controllers/products.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { productValidation, productUpdateValidation } from "../validators/index.js";
import { uploadProductImage } from "../middleware/upload.middleware.js";

const router = Router();

function runProductUpload(req, res, next) {
  uploadProductImage(req, res, (err) => {
    if (!err) return next();
    if (err.code === "LIMIT_FILE_SIZE") {
      err.statusCode = 400;
      err.message = "Image must be 8MB or smaller";
    }
    next(err);
  });
}

router.get("/", getProducts);
router.post("/upload", protect, restrictTo("admin"), runProductUpload, uploadProductMedia);
router.get("/:slug", getProductBySlug);
router.post("/", protect, restrictTo("admin"), productValidation, validate, createProduct);
router.put("/:id", protect, restrictTo("admin"), productUpdateValidation, validate, updateProduct);
router.delete("/:id", protect, restrictTo("admin"), deleteProduct);

export default router;
