import { Activity } from "../models/Activity.js";
import { success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getActivity = asyncHandler(async (req, res) => {
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 40));
  const items = await Activity.find()
    .sort({ at: -1 })
    .limit(limit)
    .lean();

  success(
    res,
    {
      items: items.map((item) => ({
        id: item.activityId,
        type: item.type,
        message: item.message,
        at: item.at,
        meta: item.meta || {},
      })),
    },
  );
});
