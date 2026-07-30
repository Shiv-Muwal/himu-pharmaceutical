import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    faqId: { type: String, required: true, unique: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const FAQ = mongoose.model("FAQ", faqSchema);
