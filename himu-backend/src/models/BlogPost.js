import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    blogId: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: String,
    content: String,
    category: String,
    author: String,
    date: String,
    image: String,
    readTime: String,
  },
  { timestamps: true }
);

export const BlogPost = mongoose.model("BlogPost", blogSchema);
