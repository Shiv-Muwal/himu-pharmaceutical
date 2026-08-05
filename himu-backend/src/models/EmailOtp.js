import mongoose from "mongoose";

const emailOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verifiedAt: { type: Date, default: null },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true },
);

emailOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const EmailOtp = mongoose.model("EmailOtp", emailOtpSchema);
