import { companyData } from "../seed/companyData.js";
import { success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCompanyInfo = asyncHandler(async (_req, res) => {
  success(res, companyData);
});
