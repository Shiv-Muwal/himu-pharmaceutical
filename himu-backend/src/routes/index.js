import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productsRoutes from "./products.routes.js";
import ordersRoutes from "./orders.routes.js";
import categoriesRoutes from "./categories.routes.js";
import blogsRoutes from "./blogs.routes.js";
import faqRoutes from "./faq.routes.js";
import contactRoutes from "./contact.routes.js";
import careersRoutes from "./careers.routes.js";
import companyRoutes from "./company.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "HIMU Pharmacy API is running",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/orders", ordersRoutes);
router.use("/categories", categoriesRoutes);
router.use("/blogs", blogsRoutes);
router.use("/faq", faqRoutes);
router.use("/contact", contactRoutes);
router.use("/careers", careersRoutes);
router.use("/company", companyRoutes);

export default router;
