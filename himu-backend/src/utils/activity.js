import { Activity } from "../models/Activity.js";
import { generateId } from "./helpers.js";

export async function logActivity({ type, message, meta = {} }) {
  try {
    await Activity.create({
      activityId: generateId("act"),
      type,
      message,
      at: new Date(),
      meta,
    });
  } catch (error) {
    console.error("Failed to log activity:", error.message);
  }
}
