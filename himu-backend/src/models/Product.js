import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  { name: String, strength: String },
  { _id: false }
);

const faqItemSchema = new mongoose.Schema(
  { question: String, answer: String },
  { _id: false }
);

const ingredientSchema = new mongoose.Schema(
  { name: String, blurb: String },
  { _id: false }
);

const highlightSchema = new mongoose.Schema(
  { label: String },
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
    ingredients: [ingredientSchema],
    highlights: [highlightSchema],
    tags: [String],
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
    // MRP is kept separately from the selling price. compareAtPrice remains for
    // older catalog entries and is mirrored by the controller for compatibility.
    mrp: Number,
    compareAtPrice: Number,
    stock: { type: Number, default: 100, min: 0 },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    rating: Number,
    reviewCount: Number,
  },
  { timestamps: true }
);

productSchema.index({ name: "text", shortDescription: "text", composition: "text" });

export const Product = mongoose.model("Product", productSchema);
