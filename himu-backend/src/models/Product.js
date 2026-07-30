import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  { name: String, strength: String },
  { _id: false }
);

const faqItemSchema = new mongoose.Schema(
  { question: String, answer: String },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    categorySlug: { type: String, required: true, index: true },
    shortDescription: String,
    description: String,
    composition: String,
    strength: String,
    manufacturer: { type: String, default: "HIMU Pharmacy Pvt. Ltd." },
    image: String,
    images: [String],
    benefits: [String],
    uses: [String],
    indications: [String],
    dosage: String,
    administration: String,
    precautions: [String],
    warnings: [String],
    sideEffects: [String],
    storage: String,
    packaging: String,
    shelfLife: String,
    variants: [variantSchema],
    faq: [faqItemSchema],
    relatedSlugs: [String],
    price: { type: Number, required: true },
    compareAtPrice: Number,
    rating: Number,
    reviewCount: Number,
  },
  { timestamps: true }
);

productSchema.index({ name: "text", shortDescription: "text", composition: "text" });

export const Product = mongoose.model("Product", productSchema);
