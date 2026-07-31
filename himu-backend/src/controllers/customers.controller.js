import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCustomers = asyncHandler(async (_req, res) => {
  const [orders, registered] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).lean(),
    User.find({ role: "customer" }).lean(),
  ]);

  const map = new Map();

  orders.forEach((order) => {
    const email = order.customer?.email?.toLowerCase();
    if (!email) return;
    const existing = map.get(email) || {
      id: email,
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone || "",
      city: order.customer.city || "",
      ordersCount: 0,
      totalSpent: 0,
      lastOrder: order.date,
      status: "Active",
      source: "orders",
    };
    existing.ordersCount += 1;
    if (order.status === "Delivered") {
      existing.totalSpent += Number(order.total) || 0;
    }
    existing.lastOrder = order.date;
    existing.name = order.customer.name || existing.name;
    existing.phone = order.customer.phone || existing.phone;
    existing.city = order.customer.city || existing.city;
    map.set(email, existing);
  });

  registered.forEach((user) => {
    const email = user.email?.toLowerCase();
    if (!email) return;
    if (!map.has(email)) {
      map.set(email, {
        id: email,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        city: "",
        ordersCount: 0,
        totalSpent: 0,
        lastOrder: null,
        status: "Active",
        source: "registered",
      });
    } else {
      const existing = map.get(email);
      existing.name = existing.name || user.name;
      existing.phone = existing.phone || user.phone || "";
      existing.source = "both";
      map.set(email, existing);
    }
  });

  const items = [...map.values()].sort((a, b) => b.ordersCount - a.ordersCount);
  success(res, { items });
});
