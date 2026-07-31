import { Product } from "../models/Product.js";
import { ApiError } from "../utils/apiResponse.js";
import { success, paginated } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { slugify } from "../utils/helpers.js";
import { logActivity } from "../utils/activity.js";

const editableFields = [
  "name",
  "category",
  "composition",
  "strength",
  "price",
  "compareAtPrice",
  "stock",
  "featured",
  "active",
  "image",
  "images",
  "shortDescription",
  "description",
  "storage",
  "packaging",
  "shelfLife",
  "variants",
  "benefits",
  "uses",
  "indications",
  "dosage",
  "administration",
  "precautions",
  "warnings",
  "sideEffects",
  "faq",
];

function pickEditableProductFields(source) {
  return Object.fromEntries(
    editableFields
      .filter((field) => source[field] !== undefined)
      .map((field) => [field, source[field]]),
  );
}

function toClientProduct(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    id: obj.productId,
    stock: Number(obj.stock ?? 0),
    featured: Boolean(obj.featured),
    active: obj.active !== false,
    _id: undefined,
    __v: undefined,
  };
}

async function updateRelatedSlugs() {
  const products = await Product.find().lean();
  const bulkOps = products.map((product) => {
    let related = products
      .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
      .slice(0, 4)
      .map((p) => p.slug);

    if (related.length < 4) {
      const extras = products
        .filter((p) => p.slug !== product.slug && !related.includes(p.slug))
        .slice(0, 4 - related.length)
        .map((p) => p.slug);
      related = [...related, ...extras];
    }

    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $set: { relatedSlugs: related } },
      },
    };
  });

  if (bulkOps.length) {
    await Product.bulkWrite(bulkOps);
  }
}

export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) filter.categorySlug = req.query.category;
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }
  if (req.query.active === "true") filter.active = true;
  if (req.query.active === "false") filter.active = false;

  const sort = req.query.search
    ? { score: { $meta: "textScore" } }
    : { createdAt: -1 };

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  paginated(res, items.map(toClientProduct), {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit) || 1,
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) throw new ApiError(404, "Product not found");
  success(res, toClientProduct(product));
});

export const createProduct = asyncHandler(async (req, res) => {
  const input = pickEditableProductFields(req.body);
  const count = await Product.countDocuments();
  const productId = `prod-${String(count + 1).padStart(3, "0")}`;
  const slug = slugify(input.name);

  const existing = await Product.findOne({ slug });
  if (existing) throw new ApiError(409, "Product with this name already exists");

  const product = await Product.create({
    productId,
    slug,
    manufacturer: "HIMU Pharmacy Pvt. Ltd.",
    image:
      input.image ||
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
    images: input.images || [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
    ],
    benefits: ["Quality formulation"],
    uses: ["As directed by a physician"],
    indications: ["For therapeutic management"],
    dosage: "As directed by the physician",
    administration: "Take as directed by your physician.",
    precautions: ["Keep out of reach of children"],
    warnings: ["Not for self-medication"],
    sideEffects: ["Mild discomfort in rare cases"],
    storage: "Store in a cool, dry place",
    packaging: "Standard packaging",
    shelfLife: "36 months",
    variants: [{ name: input.name, strength: input.strength || "N/A" }],
    faq: [
      {
        question: `What is ${input.name}?`,
        answer: `${input.name} is a high-quality pharmaceutical product.`,
      },
    ],
    relatedSlugs: [],
    compareAtPrice: Math.round(((input.price || 150) * 1.35) / 10) * 10 - 1,
    shortDescription:
      input.shortDescription || "HIMU high-quality pharmaceutical formulation.",
    description:
      input.description ||
      "HIMU high-quality pharmaceutical formulation developed under GMP guidelines.",
    categorySlug: slugify(input.category || "general"),
    stock: Number(input.stock ?? 100),
    featured: Boolean(input.featured),
    active: input.active !== false,
    ...input,
  });

  await updateRelatedSlugs();
  await logActivity({
    type: "product_create",
    message: `Created product “${product.name}”`,
    meta: { productId: product.productId },
  });
  const updated = await Product.findById(product._id);
  success(res, toClientProduct(updated), "Product created", 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ productId: req.params.id });
  if (!product) throw new ApiError(404, "Product not found");

  const input = pickEditableProductFields(req.body);
  if (input.name) {
    input.slug = slugify(input.name);
  }
  if (input.category) {
    input.categorySlug = slugify(input.category);
  }
  if (input.stock !== undefined) {
    input.stock = Number(input.stock);
  }

  Object.assign(product, input);
  await product.save();
  await updateRelatedSlugs();
  await logActivity({
    type: "product_update",
    message: `Updated product “${product.name}”`,
    meta: { productId: product.productId },
  });

  const updated = await Product.findById(product._id);
  success(res, toClientProduct(updated), "Product updated");
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({ productId: req.params.id });
  if (!product) throw new ApiError(404, "Product not found");
  await updateRelatedSlugs();
  await logActivity({
    type: "product_delete",
    message: `Deleted product “${product.name}”`,
    meta: { productId: product.productId },
  });
  success(res, null, "Product deleted");
});
