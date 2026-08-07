import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

let configured = false;

export function isCloudinaryConfigured() {
  return Boolean(
    env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret,
  );
}

export function getCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env",
    );
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: env.cloudinaryCloudName,
      api_key: env.cloudinaryApiKey,
      api_secret: env.cloudinaryApiSecret,
      secure: true,
    });
    configured = true;
  }

  return cloudinary;
}

/**
 * Upload a multer memory-file buffer to Cloudinary.
 * @returns {Promise<{ url: string, publicId: string, bytes: number, format: string }>}
 */
export function uploadImageBuffer(buffer, { folder, publicId } = {}) {
  const client = getCloudinary();

  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder: folder || env.cloudinaryFolder,
        resource_type: "image",
        overwrite: false,
        ...(publicId ? { public_id: publicId } : {}),
      },
      (error, result) => {
        if (error) {
          const message =
            error.message ||
            error.error?.message ||
            "Cloudinary upload failed";
          const err = new Error(message);
          err.statusCode = error.http_code && error.http_code < 500 ? 400 : 502;
          err.cloudinary = true;
          reject(err);
          return;
        }
        if (!result?.secure_url) {
          const err = new Error("Cloudinary did not return an image URL");
          err.statusCode = 502;
          reject(err);
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes,
          format: result.format,
        });
      },
    );
    stream.on("error", (error) => {
      const err = new Error(error.message || "Upload stream failed");
      err.statusCode = 502;
      reject(err);
    });
    stream.end(buffer);
  });
}
