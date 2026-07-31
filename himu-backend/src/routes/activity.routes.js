import { Router } from "express";
import { getActivity } from "../controllers/activity.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, restrictTo("admin"), getActivity);

export default router;
