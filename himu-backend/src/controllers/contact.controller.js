import { Contact } from "../models/Contact.js";
import { success, paginated } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiResponse.js";

export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, department, subject, message } = req.body;
  const contact = await Contact.create({ name, email, phone, department, subject, message });
  success(res, { id: contact._id }, "Message sent successfully", 201);
});

export const getContacts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Contact.countDocuments(),
  ]);

  paginated(res, items, { page, limit, total, pages: Math.ceil(total / limit) });
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!contact) throw new ApiError(404, "Contact message not found");
  success(res, contact, "Contact status updated");
});
