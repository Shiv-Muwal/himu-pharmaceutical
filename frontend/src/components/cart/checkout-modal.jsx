import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Package,
  Leaf,
} from "lucide-react";
import { Image } from "@/components/ui/image";
import { useCart } from "@/providers/cart-provider";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { OrderSuccessView } from "@/components/cart/order-success";

export function CheckoutModal() {
  const {
    checkoutItems,
    isDirectCheckout,
    isCheckoutOpen,
    closeCheckout,
    checkoutTotal,
    checkoutTotalOriginal,
    checkoutSavings,
    clearCart,
  } = useCart();
  const { user, isAuthenticated, openLogin } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [placedItems, setPlacedItems] = useState([]);
  const [placedTotals, setPlacedTotals] = useState({
    total: 0,
    original: 0,
    savings: 0,
  });

  useEffect(() => {
    if (isCheckoutOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCheckoutOpen]);

  useEffect(() => {
    if (!isCheckoutOpen || !user) return;
    setFormData((prev) => ({
      ...prev,
      name: prev.name || user.name || "",
      email: prev.email || user.email || "",
      phone: prev.phone || user.phone || "",
    }));
  }, [isCheckoutOpen, user]);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{10,14}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Enter a valid phone number (10+ digits)";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.address.trim()) newErrors.address = "Shipping address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pin code is required";
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit PIN code";
    }
    if (formData.paymentMethod === "card") {
      if (
        !formData.cardNumber?.trim() ||
        formData.cardNumber.replace(/\s+/g, "").length < 16
      ) {
        newErrors.cardNumber = "Valid 16-digit card number is required";
      }
      if (
        !formData.cardExpiry?.trim() ||
        !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.cardExpiry)
      ) {
        newErrors.cardExpiry = "Expiry (MM/YY) is required";
      }
      if (!formData.cardCvv?.trim() || formData.cardCvv.length < 3) {
        newErrors.cardCvv = "CVV is required (3 digits)";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkoutItems.length) {
      setErrors({ submit: "No items to checkout." });
      return;
    }
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const order = await api("/orders", {
        method: "POST",
        body: JSON.stringify({
          customer: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode,
          },
          items: checkoutItems.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            selectedVariant: item.selectedVariant || item.product.name,
          })),
          paymentMethod: formData.paymentMethod,
        }),
      });
      setPlacedItems(checkoutItems);
      setPlacedTotals({
        total: checkoutTotal,
        original: checkoutTotalOriginal,
        savings: checkoutSavings,
      });
      setGeneratedOrderId(order.id);
      setOrderDate(order.date);
      setOrderSuccess(true);
      if (!isDirectCheckout) clearCart();
    } catch (error) {
      setErrors({
        submit: error.message || "Unable to place your order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setOrderSuccess(false);
    setPlacedItems([]);
    closeCheckout();
  };

  const paymentMethods = [
    { id: "cod", label: "Cash on Delivery", hint: "Pay at doorstep", icon: Package },
    { id: "card", label: "Card Payment", hint: "Demo cards only", icon: CreditCard },
  ];

  const summaryItems = orderSuccess ? placedItems : checkoutItems;
  const summaryTotal = orderSuccess ? placedTotals.total : checkoutTotal;
  const summaryOriginal = orderSuccess ? placedTotals.original : checkoutTotalOriginal;
  const summarySavings = orderSuccess ? placedTotals.savings : checkoutSavings;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!orderSuccess) closeCheckout();
          }}
          className="fixed inset-0 bg-[#1a2e1f]/30 backdrop-blur-[6px]"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 18 }}
          className="relative z-10 grid max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[32px] border border-[#dce8e0] bg-gradient-to-br from-[#f8fbf8] via-[#fbf9f3] to-[#f3f7f2] shadow-[0_30px_80px_rgba(26,46,31,0.18)] md:grid-cols-12"
        >
          <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-[#cfe8d6]/45 blur-3xl" />
          <div className="pointer-events-none absolute -left-8 bottom-10 h-32 w-32 rounded-full bg-[#efe3b8]/35 blur-3xl" />

          <button
            type="button"
            onClick={() => {
              if (orderSuccess) handleCloseSuccess();
              else closeCheckout();
            }}
            className="absolute right-4 top-4 z-20 rounded-xl bg-white/80 p-2 text-[#6b8576] shadow-sm transition hover:bg-[#eef4f0] hover:text-[#1f3b2c]"
          >
            <X className="h-5 w-5" />
          </button>

          {!orderSuccess ? (
            <>
              <div className="col-span-12 max-h-[92vh] overflow-y-auto p-6 md:col-span-7 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7f3ec] text-[#3d7a5a]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a9586]">
                      {isDirectCheckout ? "Express Checkout" : "Secure Checkout"}
                    </p>
                    <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#1f3b2c]">
                      Place Your Order
                    </h2>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isAuthenticated && (
                    <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-xs text-amber-900">
                      Tip:{" "}
                      <button
                        type="button"
                        onClick={openLogin}
                        className="font-bold text-primary underline"
                      >
                        Sign in
                      </button>{" "}
                      with demo customer to autofill checkout details.
                    </div>
                  )}
                  <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[0_8px_30px_rgba(61,122,90,0.05)]">
                    <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#7a9586]">
                      <User className="h-3.5 w-3.5" /> Contact details
                    </p>
                    <div className="space-y-3">
                      <div>
                        <Input
                          name="name"
                          placeholder="Full name *"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`h-11 rounded-xl border-[#dce8e0] bg-[#f8fbf8] ${errors.name ? "border-red-400" : ""}`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-[10px] text-red-500">{errors.name}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa394]" />
                          <Input
                            name="phone"
                            placeholder="Phone *"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`h-11 rounded-xl border-[#dce8e0] bg-[#f8fbf8] pl-10 ${errors.phone ? "border-red-400" : ""}`}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-[10px] text-red-500">{errors.phone}</p>
                          )}
                        </div>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa394]" />
                          <Input
                            name="email"
                            type="email"
                            placeholder="Email *"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`h-11 rounded-xl border-[#dce8e0] bg-[#f8fbf8] pl-10 ${errors.email ? "border-red-400" : ""}`}
                          />
                          {errors.email && (
                            <p className="mt-1 text-[10px] text-red-500">{errors.email}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[0_8px_30px_rgba(61,122,90,0.05)]">
                    <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#7a9586]">
                      <MapPin className="h-3.5 w-3.5" /> Delivery address
                    </p>
                    <div className="space-y-3">
                      <Textarea
                        name="address"
                        placeholder="House no, street, locality *"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={2}
                        className={`rounded-xl border-[#dce8e0] bg-[#f8fbf8] ${errors.address ? "border-red-400" : ""}`}
                      />
                      {errors.address && (
                        <p className="text-[10px] text-red-500">{errors.address}</p>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Input
                            name="city"
                            placeholder="City *"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`h-11 rounded-xl border-[#dce8e0] bg-[#f8fbf8] ${errors.city ? "border-red-400" : ""}`}
                          />
                          {errors.city && (
                            <p className="mt-1 text-[10px] text-red-500">{errors.city}</p>
                          )}
                        </div>
                        <div>
                          <Input
                            name="pincode"
                            placeholder="Pincode *"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            className={`h-11 rounded-xl border-[#dce8e0] bg-[#f8fbf8] ${errors.pincode ? "border-red-400" : ""}`}
                          />
                          {errors.pincode && (
                            <p className="mt-1 text-[10px] text-red-500">{errors.pincode}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[0_8px_30px_rgba(61,122,90,0.05)]">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#7a9586]">
                      Payment method
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {paymentMethods.map((pm) => {
                        const Icon = pm.icon;
                        const active = formData.paymentMethod === pm.id;
                        return (
                          <button
                            key={pm.id}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                paymentMethod: pm.id,
                              }))
                            }
                            className={`rounded-2xl border p-3.5 text-left transition ${
                              active
                                ? "border-[#6fa987] bg-[#e7f3ec] shadow-sm"
                                : "border-[#e4eee7] bg-[#f8fbf8] hover:bg-white"
                            }`}
                          >
                            <Icon
                              className={`mb-2 h-5 w-5 ${active ? "text-[#3d7a5a]" : "text-[#8aa394]"}`}
                            />
                            <p className="text-xs font-bold text-[#1f3b2c]">{pm.label}</p>
                            <p className="mt-0.5 text-[10px] text-[#7a9586]">{pm.hint}</p>
                          </button>
                        );
                      })}
                    </div>

                    {formData.paymentMethod === "card" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 space-y-3 overflow-hidden rounded-2xl border border-[#dce8e0] bg-[#f4f9f5] p-3"
                      >
                        <p className="text-[10px] font-medium text-[#5f9877]">
                          Demo mode — use any 16-digit dummy card.
                        </p>
                        <Input
                          name="cardNumber"
                          placeholder="Card Number"
                          value={formData.cardNumber}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            val = val.slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
                            setFormData((prev) => ({ ...prev, cardNumber: val }));
                          }}
                          className="h-11 rounded-xl border-[#dce8e0] bg-white"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            name="cardExpiry"
                            placeholder="MM/YY"
                            value={formData.cardExpiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, "");
                              if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                              setFormData((prev) => ({
                                ...prev,
                                cardExpiry: val.slice(0, 5),
                              }));
                            }}
                            className="h-11 rounded-xl border-[#dce8e0] bg-white"
                          />
                          <Input
                            name="cardCvv"
                            type="password"
                            placeholder="CVV"
                            value={formData.cardCvv}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setFormData((prev) => ({
                                ...prev,
                                cardCvv: val.slice(0, 3),
                              }));
                            }}
                            className="h-11 rounded-xl border-[#dce8e0] bg-white"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {errors.submit && (
                    <p className="text-sm text-red-600" role="alert">
                      {errors.submit}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || !checkoutItems.length}
                    className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#6fa987] to-[#5f9877] text-sm font-bold text-white shadow-[0_10px_24px_rgba(111,169,135,0.35)] hover:brightness-105"
                  >
                    {isSubmitting ? "Placing order..." : `Confirm Order · ₹${checkoutTotal}`}
                  </Button>
                </form>
              </div>

              <div className="col-span-12 flex max-h-[92vh] flex-col border-t border-[#dce8e0] bg-white/70 p-6 backdrop-blur md:col-span-5 md:border-l md:border-t-0 md:p-8">
                <div className="mb-4 flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-[#6fa987]" />
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#1f3b2c]">
                    Order Summary
                  </h3>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {checkoutItems.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedVariant}`}
                      className="flex gap-3 rounded-2xl border border-[#e4eee7] bg-[#f8fbf8] p-3"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#eef4f0]">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-[#1f3b2c]">
                          {item.product.name}
                        </p>
                        <p className="mt-0.5 text-[10px] text-[#7a9586]">
                          Qty {item.quantity} · {item.selectedVariant}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-black text-[#3d7a5a]">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-2 rounded-3xl border border-[#e4eee7] bg-gradient-to-br from-[#f4f9f5] to-[#faf7ee] p-4 text-sm">
                  <div className="flex justify-between text-[#6f8679]">
                    <span>Items Total</span>
                    <span>₹{checkoutTotalOriginal}</span>
                  </div>
                  {checkoutSavings > 0 && (
                    <div className="flex justify-between font-semibold text-[#5f9877]">
                      <span>Savings</span>
                      <span>- ₹{checkoutSavings}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#6f8679]">
                    <span>Shipping</span>
                    <span className="font-semibold text-[#5f9877]">FREE</span>
                  </div>
                  <div className="flex items-end justify-between border-t border-[#e4eee7] pt-3">
                    <span className="font-bold text-[#1f3b2c]">Amount Payable</span>
                    <span className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#3d7a5a]">
                      ₹{checkoutTotal}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <OrderSuccessView
              orderId={generatedOrderId}
              orderDate={orderDate}
              formData={formData}
              summaryItems={summaryItems}
              summaryTotal={summaryTotal}
              summaryOriginal={summaryOriginal}
              summarySavings={summarySavings}
              onContinue={handleCloseSuccess}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
