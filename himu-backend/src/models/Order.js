import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedVariant: String,
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    customer: { type: customerSchema, required: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cod", "whatsapp", "card"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    couponCode: { type: String, default: "" },
    expectedDelivery: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
