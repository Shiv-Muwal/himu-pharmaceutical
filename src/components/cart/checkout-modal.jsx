import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  CreditCard,
  ShoppingCart,
  Send,
  PhoneCall,
  Printer,
} from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { COMPANY } from "@/lib/constants";
import { saveMockOrder } from "@/lib/mock-backend";

export function CheckoutModal() {
  const {
    cartItems,
    isCheckoutOpen,
    setCheckoutOpen,
    cartTotal,
    cartTotalOriginal,
    cartSavings,
    clearCart,
  } = useCart();
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

  // Lock body scroll
  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^\+?[0-9\s-]{10,14}$/.test(formData.phone.replace(/\s+/g, ""))
    ) {
      newErrors.phone = "Enter a valid phone number (10+ digits)";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.address.trim())
      newErrors.address = "Shipping address is required";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    // Simulate backend API request
    setTimeout(() => {
      const order = saveMockOrder({
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        },
        items: cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          selectedVariant: item.selectedVariant || item.product.name,
        })),
        total: cartTotal,
        paymentMethod: formData.paymentMethod,
      });
      setGeneratedOrderId(order.id);
      setOrderDate(order.date);
      setIsSubmitting(false);
      setOrderSuccess(true);

      // If user selected WhatsApp payment method, trigger WhatsApp open
      if (formData.paymentMethod === "whatsapp") {
        const orderSummaryText = cartItems
          .map(
            (item) =>
              `- ${item.product.name} (${item.selectedVariant}) x${item.quantity} = ₹${item.product.price * item.quantity}`,
          )
          .join("\n");
        const message = `Hello HIMU Pharmacy! I would like to place an order:\n\n*Order ID:* ${order.id}\n*Customer:* ${formData.name}\n*Phone:* ${formData.phone}\n*Address:* ${formData.address}, ${formData.city} - ${formData.pincode}\n\n*Items:*\n${orderSummaryText}\n\n*Total Amount:* ₹${cartTotal}\n\nPlease confirm my order. Thank you!`;
        const whatsappUrl = `https://wa.me/9118001234567?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
      }
    }, 1500);
  };

  const handleCloseSuccess = () => {
    clearCart();
    setOrderSuccess(false);
    setCheckoutOpen(false);
  };

  const paymentMethods = [
    { id: "cod", label: "Cash on Delivery", icon: CheckCircle2 },
    { id: "whatsapp", label: "Order on WhatsApp", icon: Send },
    { id: "card", label: "Demo Cards", icon: CreditCard },
  ];

  const handleResendOnWhatsapp = () => {
    const orderSummaryText = cartItems
      .map(
        (item) =>
          `- ${item.product.name} (${item.selectedVariant}) x${item.quantity} = ₹${item.product.price * item.quantity}`,
      )
      .join("\n");
    const message = `Hello HIMU Pharmacy! My Order details:\n\n*Order ID:* ${generatedOrderId}\n*Customer:* ${formData.name}\n*Phone:* ${formData.phone}\n*Address:* ${formData.address}, ${formData.city} - ${formData.pincode}\n\n*Items:*\n${orderSummaryText}\n\n*Total Amount:* ₹${cartTotal}\n\nPlease confirm my order. Thank you!`;
    window.open(
      `https://wa.me/9118001234567?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!orderSuccess) setCheckoutOpen(false);
          }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />
        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#fff8e7] dark:bg-[#0a1410] rounded-3xl shadow-2xl overflow-hidden border border-border/40 z-10 grid md:grid-cols-12 max-h-[90vh]"
        >
          {/* Close button */}
          <button
            onClick={() => {
              if (orderSuccess) handleCloseSuccess();
              else setCheckoutOpen(false);
            }}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          {!orderSuccess ? (
            <>
              {/* Form Section */}
              <div className="col-span-12 md:col-span-7 p-6 md:p-8 overflow-y-auto max-h-[90vh] md:max-h-[85vh]">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
                    Checkout Details
                  </h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                      Full Name *
                    </label>
                    <Input
                      name="name"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-[10px] mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                        Phone Number *
                      </label>
                      <Input
                        name="phone"
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-[10px] mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                        Email Address *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="e.g. john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-[10px] mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                      Delivery Address *
                    </label>
                    <Textarea
                      name="address"
                      placeholder="Complete address (house no, street, locality)"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={2}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-[10px] mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                        City *
                      </label>
                      <Input
                        name="city"
                        placeholder="e.g. Noida"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-[10px] mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                        Pincode *
                      </label>
                      <Input
                        name="pincode"
                        placeholder="e.g. 201301"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={errors.pincode ? "border-red-500" : ""}
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-[10px] mt-1">
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Payment Methods */}
                  <div className="pt-2">
                    <label className="block text-xs font-semibold mb-2 text-muted-foreground">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {paymentMethods.map((pm) => {
                        const Icon = pm.icon;
                        const active = formData.paymentMethod === pm.id;
                        return (
                          <button
                            key={pm.id}
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                paymentMethod: pm.id,
                              }));
                            }}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                              active
                                ? "border-primary bg-primary/10 text-primary font-bold shadow-md shadow-primary/5"
                                : "border-border/30 bg-background/30 text-muted-foreground hover:bg-muted/50"
                            }`}
                          >
                            <Icon className="h-5 w-5 mb-1 shrink-0" />
                            <span className="text-[10px] sm:text-xs">
                              {pm.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Demo Card Fields */}
                  {formData.paymentMethod === "card" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3"
                    >
                      <p className="text-[10px] text-primary/80 font-medium">
                        * Use any dummy 16-digit card for demonstration
                        purposes.
                      </p>
                      <div>
                        <Input
                          name="cardNumber"
                          placeholder="Card Number (e.g. 1111 2222 3333 4444)"
                          value={formData.cardNumber}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            val = val
                              .slice(0, 16)
                              .replace(/(.{4})/g, "$1 ")
                              .trim();
                            setFormData((prev) => ({
                              ...prev,
                              cardNumber: val,
                            }));
                          }}
                          className={errors.cardNumber ? "border-red-500" : ""}
                        />
                        {errors.cardNumber && (
                          <p className="text-red-500 text-[10px] mt-1">
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          name="cardExpiry"
                          placeholder="Expiry (MM/YY)"
                          value={formData.cardExpiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            if (val.length > 2) {
                              val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                            }
                            setFormData((prev) => ({
                              ...prev,
                              cardExpiry: val.slice(0, 5),
                            }));
                          }}
                          className={errors.cardExpiry ? "border-red-500" : ""}
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
                          className={errors.cardCvv ? "border-red-500" : ""}
                        />
                      </div>
                    </motion.div>
                  )}
                  {/* Submission */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 mt-6 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Processing Order...
                      </span>
                    ) : formData.paymentMethod === "whatsapp" ? (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" /> Place Order on WhatsApp
                      </span>
                    ) : (
                      "Confirm & Place Order"
                    )}
                  </Button>
                </form>
              </div>
              {/* Order Summary Side panel */}
              <div className="col-span-12 md:col-span-5 bg-primary/5 dark:bg-primary/2 p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border/30 overflow-y-auto max-h-[90vh] md:max-h-[85vh]">
                <div>
                  <h3 className="text-lg font-bold mb-4 font-[family-name:var(--font-heading)]">
                    Order Summary
                  </h3>
                  <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedVariant}`}
                        className="flex gap-3 text-xs justify-between"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Qty: {item.quantity} · {item.selectedVariant}
                          </p>
                        </div>
                        <span className="font-bold text-right shrink-0">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border/30 pt-4 mt-6 space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Items Total</span>
                    <span>₹{cartTotalOriginal}</span>
                  </div>
                  {cartSavings > 0 && (
                    <div className="flex justify-between text-emerald font-semibold">
                      <span>Discount Savings</span>
                      <span>- ₹{cartSavings}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-emerald font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-border/30 pt-3 flex justify-between items-end">
                    <span className="font-bold text-sm">Amount Payable</span>
                    <span className="text-xl font-black text-primary font-[family-name:var(--font-heading)]">
                      ₹{cartTotal}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Order Success Invoice Screen */
            <div className="col-span-12 p-8 md:p-12 overflow-y-auto max-h-[85vh]">
              <div className="text-center max-w-lg mx-auto mb-8">
                <div className="inline-flex h-16 w-16 bg-emerald/10 text-emerald rounded-full items-center justify-center mb-4">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                <h2 className="text-3xl font-black text-foreground font-[family-name:var(--font-heading)]">
                  Order Confirmed!
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Thank you for ordering from {COMPANY.name}. Your order has
                  been placed successfully and is currently being processed.
                </p>
              </div>
              {/* Invoice Layout */}
              <div className="border border-border/40 rounded-3xl p-6 md:p-8 bg-white dark:bg-card-foreground/5 shadow-xl max-w-2xl mx-auto space-y-6 print:border-0 print:shadow-none">
                <div className="flex justify-between items-start border-b border-border/30 pb-4">
                  <div>
                    <h1 className="text-xl font-extrabold text-primary font-[family-name:var(--font-heading)]">
                      {COMPANY.name}
                    </h1>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {COMPANY.fullForm}
                    </p>
                    <p className="text-[9px] text-muted-foreground max-w-xs leading-relaxed mt-1">
                      {COMPANY.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                      Invoice
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Order ID:{" "}
                      <b className="text-foreground">{generatedOrderId}</b>
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Date: {orderDate}
                    </p>
                  </div>
                </div>
                {/* Customer Details */}
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider mb-1">
                      Billed To:
                    </h4>
                    <p className="font-bold">{formData.name}</p>
                    <p className="text-muted-foreground mt-0.5">
                      {formData.phone}
                    </p>
                    <p className="text-muted-foreground">{formData.email}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider mb-1">
                      Shipping Address:
                    </h4>
                    <p className="font-medium">{formData.address}</p>
                    <p className="text-muted-foreground">
                      {formData.city} - {formData.pincode}
                    </p>
                    <p className="text-muted-foreground capitalize">
                      Payment:{" "}
                      {formData.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : formData.paymentMethod === "whatsapp"
                          ? "Order via WhatsApp"
                          : "Card Payment (Demo)"}
                    </p>
                  </div>
                </div>
                {/* Items Table */}
                <div className="border border-border/30 rounded-2xl overflow-hidden text-xs">
                  <div className="grid grid-cols-12 bg-muted/50 p-2.5 font-bold border-b border-border/30 text-muted-foreground text-[10px] uppercase">
                    <span className="col-span-6">Medicine / Variant</span>
                    <span className="col-span-2 text-center">Price</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-2 text-right">Total</span>
                  </div>
                  <div className="divide-y divide-border/20">
                    {cartItems.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedVariant}`}
                        className="grid grid-cols-12 p-3 items-center"
                      >
                        <div className="col-span-6 min-w-0 pr-2">
                          <p className="font-bold truncate text-foreground">
                            {item.product.name}
                          </p>
                          <p className="text-[9px] text-muted-foreground mt-0.5 truncate">
                            {item.selectedVariant} • {item.product.strength}
                          </p>
                        </div>
                        <span className="col-span-2 text-center">
                          ₹{item.product.price}
                        </span>
                        <span className="col-span-2 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <span className="col-span-2 text-right font-bold text-primary">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Subtotals */}
                <div className="flex justify-end pt-2">
                  <div className="w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{cartTotalOriginal}</span>
                    </div>
                    {cartSavings > 0 && (
                      <div className="flex justify-between text-emerald font-semibold">
                        <span>Savings Discount</span>
                        <span>- ₹{cartSavings}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground border-b border-border/30 pb-2">
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between items-end font-bold text-sm pt-1 text-primary">
                      <span>Total Amount Billed</span>
                      <span className="text-lg font-black font-[family-name:var(--font-heading)]">
                        ₹{cartTotal}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Bottom Notice */}
                <div className="border-t border-border/30 pt-4 text-center">
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-relaxed max-w-md mx-auto">
                    Note: This is a demo checkout invoice generated for
                    presentation purposes. Delivery will occur within 3-5
                    business days. For support, call {COMPANY.phone}.
                  </p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button
                  onClick={handleCloseSuccess}
                  className="px-8 cursor-pointer"
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="px-6 gap-2 cursor-pointer"
                >
                  <Printer className="h-4 w-4" /> Print Invoice
                </Button>
                {formData.paymentMethod === "whatsapp" && (
                  <Button
                    variant="secondary"
                    onClick={handleResendOnWhatsapp}
                    className="px-6 gap-2 border-2 border-[#25D366] text-[#25D366] bg-transparent hover:bg-[#25D366] hover:text-white cursor-pointer"
                  >
                    <PhoneCall className="h-4 w-4" /> Resend on WhatsApp
                  </Button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
