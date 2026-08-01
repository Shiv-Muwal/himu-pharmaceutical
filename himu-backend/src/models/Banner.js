import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    bannerId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    image: { type: String, required: true },
    link: { type: String, default: "/products" },
    ctaLabel: { type: String, default: "Shop now" },
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export const Banner = mongoose.model("Banner", bannerSchema);
