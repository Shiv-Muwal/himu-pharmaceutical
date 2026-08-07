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

const memoryStorage = multer.memoryStorage();

const IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/pjpeg",
]);
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function isAllowedImage(file) {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const mime = String(file.mimetype || "").toLowerCase();
  const extOk = IMAGE_EXTS.has(ext);
  const mimeOk = !mime || mime === "application/octet-stream" || IMAGE_MIMES.has(mime);
  return extOk && mimeOk;
}

function imageFileFilter(_req, file, cb) {
  if (isAllowedImage(file)) {
    cb(null, true);
    return;
  }
  cb(new ApiError(400, "Only JPG, PNG, or WebP images are allowed"));
}

export const uploadBannerWebp = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
}).single("image");

export const uploadProductImage = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
}).single("image");
