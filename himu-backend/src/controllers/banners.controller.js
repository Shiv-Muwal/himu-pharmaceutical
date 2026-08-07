import { Banner } from "../models/Banner.js";
import { ApiError, success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logActivity } from "../utils/activity.js";
import {
  isCloudinaryConfigured,
  uploadImageBuffer,
} from "../config/cloudinary.js";
import { env } from "../config/env.js";

function toClientBanner(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    id: obj.bannerId,
    _id: undefined,
    __v: undefined,
  };
}

export const getBanners = asyncHandler(async (req, res) => {
  const includeInactive = req.query.all === "true" && req.user?.role === "admin";
  const filter = includeInactive ? {} : { active: true };
  const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 }).lean();
  return success(res, { items: banners.map(toClientBanner) });
});

export const createBanner = asyncHandler(async (req, res) => {
  const {
    title,
    subtitle = "",
    image,
    link = "/products",
    ctaLabel = "Shop now",
    order,
    active = true,
  } = req.body;

  if (!title?.trim() || !image?.trim()) {
    throw new ApiError(400, "Title and image are required");
  }

  const count = await Banner.countDocuments();
  const bannerId = `bnr_${Date.now().toString(36)}`;
  const banner = await Banner.create({
    bannerId,
    title: title.trim(),
    subtitle: String(subtitle || "").trim(),
    image: image.trim(),
    link: link?.trim() || "/products",
    ctaLabel: ctaLabel?.trim() || "Shop now",
    order: Number.isFinite(Number(order)) ? Number(order) : count,
    active: active !== false,
  });

  await logActivity({
    type: "banner",
    message: `Banner created: ${banner.title}`,
    meta: { bannerId },
  });

  return success(res, toClientBanner(banner), "Banner created", 201);
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findOne({ bannerId: req.params.id });
  if (!banner) throw new ApiError(404, "Banner not found");

  const fields = ["title", "subtitle", "image", "link", "ctaLabel", "order", "active"];
  for (const field of fields) {
    if (req.body[field] !== undefined) {
      banner[field] = field === "order" ? Number(req.body[field]) : req.body[field];
    }
  }
  await banner.save();

  await logActivity({
    type: "banner",
    message: `Banner updated: ${banner.title}`,
    meta: { bannerId: banner.bannerId },
  });

  return success(res, toClientBanner(banner), "Banner updated");
});

export const uploadBannerImage = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    throw new ApiError(400, "Please upload a JPG, PNG, or WebP image");
  }
  if (!isCloudinaryConfigured()) {
    throw new ApiError(
      503,
      "Cloudinary is not configured on the server. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in himu-backend/.env then restart PM2.",
    );
  }

  try {
    const uploaded = await uploadImageBuffer(req.file.buffer, {
      folder: `${env.cloudinaryFolder}/banners`,
    });

    return success(
      res,
      {
        url: uploaded.url,
        publicId: uploaded.publicId,
        size: uploaded.bytes,
        mimetype: req.file.mimetype,
        format: uploaded.format,
      },
      "Banner image uploaded",
      201,
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 502,
      error.message || "Image upload to Cloudinary failed",
    );
  }
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findOneAndDelete({ bannerId: req.params.id });
  if (!banner) throw new ApiError(404, "Banner not found");

  await logActivity({
    type: "banner",
    message: `Banner deleted: ${banner.title}`,
    meta: { bannerId: banner.bannerId },
  });

  return success(res, { ok: true }, "Banner deleted");
});
