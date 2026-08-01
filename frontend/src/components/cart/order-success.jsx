import { motion } from "framer-motion";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { COMPANY } from "@/lib/constants";

export function OrderSuccessTick({ orderId }) {
  return (
    <div className="relative mx-auto mb-6 flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40">
      {/* Soft pulse rings — Messenger-style */}
      <motion.span
        className="absolute inset-0 rounded-full bg-[#00c853]/20"
        initial={{ scale: 0.6, opacity: 0.8 }}
        animate={{ scale: [0.85, 1.35], opacity: [0.55, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        className="absolute inset-2 rounded-full bg-[#00c853]/15"
        initial={{ scale: 0.7, opacity: 0.6 }}
        animate={{ scale: [0.9, 1.25], opacity: [0.4, 0] }}
        transition={{ duration: 1.4, delay: 0.25, repeat: Infinity, ease: "easeOut" }}
      />

      {/* Main circle */}
      <motion.div
        className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#00e676] via-[#00c853] to-[#00a844] shadow-[0_12px_40px_rgba(0,200,83,0.45)] sm:h-32 sm:w-32"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.05 }}
      >
        <svg viewBox="0 0 52 52" className="h-14 w-14 sm:h-16 sm:w-16">
          <motion.path
            d="M14 27 L22 35 L38 17"
            fill="none"
            stroke="white"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
          />
        </svg>
      </motion.div>

      {/* Tiny spark dots */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#d6b04d]"
          style={{
            left: `${50 + Math.cos((i / 6) * Math.PI * 2) * 46}%`,
            top: `${50 + Math.sin((i / 6) * Math.PI * 2) * 46}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.9, delay: 0.45 + i * 0.06 }}
        />
      ))}

      {orderId && (
        <span className="sr-only">Order {orderId} confirmed</span>
      )}
    </div>
  );
}

export function OrderSuccessView({
  orderId,
  orderDate,
  formData,
  summaryItems,
  summaryTotal,
  summaryOriginal,
  summarySavings,
  onContinue,
}) {
  return (
    <div className="col-span-12 max-h-[92vh] overflow-y-auto p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto mb-6 max-w-lg text-center"
      >
        <OrderSuccessTick orderId={orderId} />
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="font-[family-name:var(--font-heading)] text-3xl font-black text-[#1f3b2c]"
        >
          Order placed successfully
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-2 text-sm text-[#6f8679]"
        >
          Payment confirmed · Your HIMU order is on the way
        </motion.p>
        <motion.p
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#e7f3ec] px-4 py-1.5 text-xs font-bold text-[#0b6a46]"
        >
          Order ID · {orderId}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-[#dce8e0] bg-white/90 p-6 shadow-sm md:p-8"
      >
        <div className="flex items-start justify-between border-b border-[#e4eee7] pb-4">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-xl font-extrabold text-[#3d7a5a]">
              {COMPANY.name}
            </h1>
            <p className="mt-1 max-w-xs text-[10px] leading-relaxed text-[#7a9586]">
              {COMPANY.address}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block rounded-full bg-[#e7f3ec] px-3 py-1 text-[10px] font-bold uppercase text-[#3d7a5a]">
              Invoice
            </span>
            <p className="mt-2 text-[10px] text-[#7a9586]">Date: {orderDate}</p>
          </div>
        </div>

        <div className="grid gap-4 text-xs sm:grid-cols-2">
          <div>
            <h4 className="mb-1 text-[9px] font-bold uppercase tracking-wider text-[#7a9586]">
              Billed To
            </h4>
            <p className="font-bold text-[#1f3b2c]">{formData.name}</p>
            <p className="text-[#6f8679]">{formData.phone}</p>
            <p className="text-[#6f8679]">{formData.email}</p>
          </div>
          <div>
            <h4 className="mb-1 text-[9px] font-bold uppercase tracking-wider text-[#7a9586]">
              Shipping
            </h4>
            <p className="font-medium text-[#1f3b2c]">{formData.address}</p>
            <p className="text-[#6f8679]">
              {formData.city} - {formData.pincode}
            </p>
            <p className="capitalize text-[#6f8679]">
              Payment:{" "}
              {formData.paymentMethod === "cod" ? "Cash on Delivery" : "Card Payment"}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e4eee7] text-xs">
          <div className="grid grid-cols-12 bg-[#f4f9f5] p-2.5 text-[10px] font-bold uppercase text-[#7a9586]">
            <span className="col-span-6">Item</span>
            <span className="col-span-2 text-center">Price</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-2 text-right">Total</span>
          </div>
          <div className="divide-y divide-[#eef4f0]">
            {summaryItems.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedVariant}`}
                className="grid grid-cols-12 items-center p-3"
              >
                <div className="col-span-6 min-w-0 pr-2">
                  <p className="truncate font-bold text-[#1f3b2c]">{item.product.name}</p>
                  <p className="mt-0.5 truncate text-[9px] text-[#7a9586]">
                    {item.selectedVariant}
                  </p>
                </div>
                <span className="col-span-2 text-center">₹{item.product.price}</span>
                <span className="col-span-2 text-center font-semibold">{item.quantity}</span>
                <span className="col-span-2 text-right font-bold text-[#3d7a5a]">
                  ₹{item.product.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-[#6f8679]">
              <span>Subtotal</span>
              <span>₹{summaryOriginal}</span>
            </div>
            {summarySavings > 0 && (
              <div className="flex justify-between font-semibold text-[#5f9877]">
                <span>Savings</span>
                <span>- ₹{summarySavings}</span>
              </div>
            )}
            <div className="flex items-end justify-between border-t border-[#e4eee7] pt-2 text-sm font-bold text-[#3d7a5a]">
              <span>Total</span>
              <span className="font-[family-name:var(--font-heading)] text-lg font-black">
                ₹{summaryTotal}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button
          onClick={onContinue}
          className="rounded-2xl bg-[#6fa987] px-8 text-white hover:bg-[#5f9877]"
        >
          Continue Shopping
        </Button>
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="gap-2 rounded-2xl border-[#c9ddd1] text-[#3d7a5a]"
        >
          <Printer className="h-4 w-4" /> Print Invoice
        </Button>
      </div>
    </div>
  );
}
