import { FAQ } from "../models/FAQ.js";
import { success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getFaqs = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category && req.query.category !== "All") {
    filter.category = req.query.category;
  }

  const faqs = await FAQ.find(filter).sort({ faqId: 1 });
  const categories = await FAQ.distinct("category");

  success(res, {
    faqs: faqs.map((f) => ({
      id: f.faqId,
      question: f.question,
      answer: f.answer,
      category: f.category,
    })),
    categories: ["All", ...categories],
  });
});
