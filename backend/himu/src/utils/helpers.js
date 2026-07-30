export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderId() {
  return `HIMU-${randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`;
}

export function formatOrderDate(date = new Date()) {
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}
import { randomUUID } from "node:crypto";
