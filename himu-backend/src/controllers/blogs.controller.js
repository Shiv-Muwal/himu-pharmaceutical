import { BlogPost } from "../models/BlogPost.js";
import { ApiError, success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { slugify } from "../utils/helpers.js";
import { logActivity } from "../utils/activity.js";

function toClientBlog(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    id: obj.blogId,
    _id: undefined,
    __v: undefined,
  };
}

export const getBlogs = asyncHandler(async (_req, res) => {
  const blogs = await BlogPost.find().sort({ date: -1, createdAt: -1 }).lean();
  return success(res, { items: blogs.map(toClientBlog) });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await BlogPost.findOne({ slug: req.params.slug });
  if (!blog) throw new ApiError(404, "Blog post not found");
  return success(res, toClientBlog(blog));
});

export const createBlog = asyncHandler(async (req, res) => {
  const {
    title,
    excerpt = "",
    content = "",
    category = "Healthcare",
    author = "HIMU Editorial",
    date,
    image = "",
    readTime = "3 min read",
    slug,
  } = req.body;

  if (!title?.trim()) throw new ApiError(400, "Title is required");

  const blogId = `blog_${Date.now().toString(36)}`;
  const finalSlug = slugify(slug || title);
  const exists = await BlogPost.findOne({ slug: finalSlug });
  if (exists) throw new ApiError(409, "A blog with this slug already exists");

  const blog = await BlogPost.create({
    blogId,
    slug: finalSlug,
    title: title.trim(),
    excerpt: String(excerpt || "").trim(),
    content: String(content || "").trim(),
    category: String(category || "Healthcare").trim(),
    author: String(author || "HIMU Editorial").trim(),
    date: date || new Date().toISOString().slice(0, 10),
    image: String(image || "").trim(),
    readTime: String(readTime || "3 min read").trim(),
  });

  await logActivity({
    type: "blog",
    message: `Blog created: ${blog.title}`,
    meta: { blogId },
  });

  return success(res, toClientBlog(blog), "Blog created", 201);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await BlogPost.findOne({ blogId: req.params.id });
  if (!blog) throw new ApiError(404, "Blog post not found");

  const fields = [
    "title",
    "excerpt",
    "content",
    "category",
    "author",
    "date",
    "image",
    "readTime",
  ];
  for (const field of fields) {
    if (req.body[field] !== undefined) blog[field] = req.body[field];
  }
  if (req.body.slug !== undefined) {
    const nextSlug = slugify(req.body.slug || blog.title);
    const clash = await BlogPost.findOne({ slug: nextSlug, blogId: { $ne: blog.blogId } });
    if (clash) throw new ApiError(409, "A blog with this slug already exists");
    blog.slug = nextSlug;
  } else if (req.body.title !== undefined) {
    // keep existing slug unless explicitly changed
  }

  await blog.save();
  await logActivity({
    type: "blog",
    message: `Blog updated: ${blog.title}`,
    meta: { blogId: blog.blogId },
  });
  return success(res, toClientBlog(blog), "Blog updated");
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await BlogPost.findOneAndDelete({ blogId: req.params.id });
  if (!blog) throw new ApiError(404, "Blog post not found");
  await logActivity({
    type: "blog",
    message: `Blog deleted: ${blog.title}`,
    meta: { blogId: blog.blogId },
  });
  return success(res, { id: blog.blogId }, "Blog deleted");
});
