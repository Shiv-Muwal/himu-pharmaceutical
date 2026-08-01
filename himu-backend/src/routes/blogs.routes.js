import { Router } from "express";
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogs.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);
router.post("/", protect, restrictTo("admin"), createBlog);
router.put("/:id", protect, restrictTo("admin"), updateBlog);
router.delete("/:id", protect, restrictTo("admin"), deleteBlog);

export default router;
