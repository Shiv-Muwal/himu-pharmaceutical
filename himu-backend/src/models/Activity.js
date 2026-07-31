import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    activityId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    at: { type: Date, default: Date.now },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

activitySchema.index({ at: -1 });

export const Activity = mongoose.model("Activity", activitySchema);
