import { Order } from "../models/Order.js";
import { ApiError } from "../utils/apiResponse.js";
import { success, paginated } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateOrderId, formatOrderDate } from "../utils/helpers.js";
import { Product } from "../models/Product.js";
import { logActivity } from "../utils/activity.js";

function makeCouponCode(orderId) {
  const tail = String(orderId || "").replace(/\W/g, "").slice(-4).toUpperCase() || "HIMU";
  return `HIMU${tail}`;
}

function makeExpectedDelivery(days = 5) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toClientOrder(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    id: obj.orderId,
    date: obj.date,
    customer: obj.customer,
    items: obj.items,
    total: obj.total,
    paymentMethod: obj.paymentMethod,
    status: obj.status,
    couponCode: obj.couponCode || makeCouponCode(obj.orderId),
    expectedDelivery: obj.expectedDelivery || "",
    createdAt: obj.createdAt,
  };
}

export const createOrder = asyncHandler(async (req, res) => {
  const requestedItems = req.body.items;
  const productIds = [...new Set(requestedItems.map((item) => item.productId))];
  const products = await Product.find({
    productId: { $in: productIds },
    active: { $ne: false },
  }).lean();
  const productsById = new Map(products.map((product) => [product.productId, product]));

  if (productsById.size !== productIds.length) {
    throw new ApiError(400, "One or more selected products are unavailable");
  }

  const items = requestedItems.map((item) => {
    const product = productsById.get(item.productId);
    const selectedVariant = product.variants?.some((variant) => variant.name === item.selectedVariant)
      ? item.selectedVariant
      : product.variants?.[0]?.name || product.name;
    return {
      productId: product.productId,
      productName: product.name,
      price: product.price,
      quantity: item.quantity,
      selectedVariant,
    };
  });

  for (const item of items) {
    const updated = await Product.findOneAndUpdate(
      {
        productId: item.productId,
        active: { $ne: false },
        stock: { $gte: item.quantity },
      },
      { $inc: { stock: -item.quantity } },
      { new: true },
    );
    if (!updated) {
      throw new ApiError(409, `Insufficient stock for “${item.productName}”`);
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = generateOrderId();
  const order = await Order.create({
    orderId,
    date: formatOrderDate(),
    customer: req.body.customer,
    items,
    total,
    paymentMethod: req.body.paymentMethod,
    status: "Pending",
    couponCode: makeCouponCode(orderId),
    expectedDelivery: makeExpectedDelivery(5),
  });

  await logActivity({
    type: "order_create",
    message: `New order ${order.orderId} from ${order.customer.name}`,
    meta: { orderId: order.orderId },
  });

  success(res, toClientOrder(order), "Order placed successfully", 201);
});

export const getOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  paginated(res, items.map(toClientOrder), {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit) || 1,
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.id });
  if (!order) throw new ApiError(404, "Order not found");
  success(res, toClientOrder(order));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { orderId: req.params.id },
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!order) throw new ApiError(404, "Order not found");
  await logActivity({
    type: "order_status",
    message: `Order ${order.orderId} marked ${order.status}`,
    meta: { orderId: order.orderId, status: order.status },
  });
  success(res, toClientOrder(order), "Order status updated");
});
