import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    image: String,
    heroImage: String,
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
