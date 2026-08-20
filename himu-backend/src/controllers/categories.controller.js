import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/apiResponse.js";
import { success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  success(res, categories);
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) throw new ApiError(404, "Category not found");

  const products = await Product.find({ categorySlug: req.params.slug })
    .select("productId slug name shortDescription image price mrp compareAtPrice rating reviewCount category categorySlug")
    .limit(50);

  success(res, {
    category,
    products: products.map((p) => ({
      id: p.productId,
      slug: p.slug,
      name: p.name,
      shortDescription: p.shortDescription,
      image: p.image,
      price: p.price,
      mrp: p.mrp ?? p.compareAtPrice ?? p.price,
      compareAtPrice: p.compareAtPrice,
      rating: p.rating,
      reviewCount: p.reviewCount,
      category: p.category,
      categorySlug: p.categorySlug,
    })),
  });
});
