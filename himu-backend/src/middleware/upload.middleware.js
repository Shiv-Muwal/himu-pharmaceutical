import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { ApiError } from "../utils/apiResponse.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsRoot = path.resolve(__dirname, "../../uploads");
export const bannersUploadDir = path.join(uploadsRoot, "banners");
export const productsUploadDir = path.join(uploadsRoot, "products");

fs.mkdirSync(bannersUploadDir, { recursive: true });
fs.mkdirSync(productsUploadDir, { recursive: true });

const bannerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, bannersUploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, "-")
      .replace(/-+/g, "-");
    const base = safe.endsWith(".webp") ? safe.slice(0, -5) : safe.replace(/\.[^.]+$/, "");
    cb(null, `banner-${Date.now()}-${base || "image"}.webp`);
  },
});

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
  storage: bannerStorage,
  fileFilter: webpFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

const productStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, productsUploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".png";
    const safe = path
      .basename(file.originalname || "product", ext)
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);
    cb(null, `product-${Date.now()}-${safe || "image"}${ext}`);
  },
});

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
  storage: productStorage,
  fileFilter: productImageFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
}).single("image");
