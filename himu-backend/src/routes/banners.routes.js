import { Router } from "express";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadBannerImage,
} from "../controllers/banners.controller.js";
import { protect, restrictTo, optionalAuth } from "../middleware/auth.middleware.js";
import { uploadBannerWebp } from "../middleware/upload.middleware.js";

const router = Router();

function runBannerUpload(req, res, next) {
  uploadBannerWebp(req, res, (err) => {
    if (!err) return next();
    if (err.code === "LIMIT_FILE_SIZE") {
      err.statusCode = 400;
      err.message = "WebP image must be 5MB or smaller";
    }
    next(err);
  });
}

router.get("/", optionalAuth, getBanners);
router.post("/upload", protect, restrictTo("admin"), runBannerUpload, uploadBannerImage);
router.post("/", protect, restrictTo("admin"), createBanner);
router.put("/:id", protect, restrictTo("admin"), updateBanner);
router.delete("/:id", protect, restrictTo("admin"), deleteBanner);

export default router;
