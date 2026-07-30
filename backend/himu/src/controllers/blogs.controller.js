import { BlogPost } from "../models/BlogPost.js";
import { ApiError } from "../utils/apiResponse.js";
import { success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function toClientBlog(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj.blogId, _id: undefined, __v: undefined };
}

export const getBlogs = asyncHandler(async (_req, res) => {
  const blogs = await BlogPost.find().sort({ date: -1 });
  success(res, blogs.map(toClientBlog));
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await BlogPost.findOne({ slug: req.params.slug });
  if (!blog) throw new ApiError(404, "Blog post not found");
  success(res, toClientBlog(blog));
});
