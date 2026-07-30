import { CareerApplication } from "../models/CareerApplication.js";
import { success, paginated } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitApplication = asyncHandler(async (req, res) => {
  const { name, email, phone, position, experience, message } = req.body;
  const application = await CareerApplication.create({ name, email, phone, position, experience, message });
  success(res, { id: application._id }, "Application submitted successfully", 201);
});

export const getApplications = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    CareerApplication.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    CareerApplication.countDocuments(),
  ]);

  paginated(res, items, { page, limit, total, pages: Math.ceil(total / limit) });
});
