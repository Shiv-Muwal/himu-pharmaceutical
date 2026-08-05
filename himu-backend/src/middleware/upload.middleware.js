import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { ApiError } from "../utils/apiResponse.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsRoot = path.resolve(__dirname, "../../uploads");
export const bannersUploadDir = path.join(uploadsRoot, "banners");
export const productsUploadDir = path.join(uploadsRoot, "products");

/** Kept for serving any legacy local files already under /uploads */
fs.mkdirSync(bannersUploadDir, { recursive: true });
fs.mkdirSync(productsUploadDir, { recursive: true });

/** Memory storage — files are streamed to Cloudinary (not written to disk). */
const memoryStorage = multer.memoryStorage();

function webpFileFilter(_req, file, cb) {
  const isWebpMime = file.mimetype === "image/webp";
  const isWebpExt = path.extname(file.originalname || "").toLowerCase() === ".webp";
  if (isWebpMime && isWebpExt) {
    cb(null, true);
    return;
  }
  cb(new ApiError(400, "Only WebP images are allowed (.webp)"));
}

export const uploadBannerWebp = multer({
  storage: memoryStorage,
  fileFilter: webpFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

function productImageFilter(_req, file, cb) {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const ext = path.extname(file.originalname || "").toLowerCase();
  const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
  if (allowed.includes(file.mimetype) && allowedExt.includes(ext)) {
    cb(null, true);
    return;
  }
  cb(new ApiError(400, "Only JPG, PNG, or WebP images are allowed"));
}

export const uploadProductImage = multer({
  storage: memoryStorage,
  fileFilter: productImageFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
}).single("image");
