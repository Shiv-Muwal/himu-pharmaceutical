import { validationResult } from "express-validator";
import { ApiError } from "../utils/apiResponse.js";

export function validate(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map((e) => e.msg).join(", ");
    throw new ApiError(400, message);
  }
  next();
}
