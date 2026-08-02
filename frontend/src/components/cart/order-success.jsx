import { motion } from "framer-motion";
import { CalendarDays, Copy, Printer, TicketPercent, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";
import { useState } from "react";

export function OrderSuccessTick({ orderId }) {
  return (
    <div className="relative mx-auto mb-5 flex h-40 w-40 items-center justify-center sm:h-44 sm:w-44">
      <motion.span
        className="absolute inset-0 rounded-full bg-[#bbf1d2]/25"
        initial={{ scale: 0.6, opacity: 0.8 }}
        animate={{ scale: [0.85, 1.45], opacity: [0.55, 0] }}
        transition={{ duration: 1.35, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        className="absolute inset-3 rounded-full bg-[#bbf1d2]/18"
        initial={{ scale: 0.7, opacity: 0.6 }}
        animate={{ scale: [0.9, 1.3], opacity: [0.4, 0] }}
        transition={{ duration: 1.35, delay: 0.22, repeat: Infinity, ease: "easeOut" }}
      />

      <motion.div
        className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#bbf1d2] via-[#bbf1d2] to-[#ffc5aa] shadow-[0_16px_48px_rgba(255,197,170,0.45)] sm:h-36 sm:w-36"
        initial={{ scale: 0, rotate: -24 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.05 }}
      >
        <svg viewBox="0 0 52 52" className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]">
          <motion.path
            d="M14 27 L22 35 L38 17"
            fill="none"
            stroke="#3a2418"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
          />
        </svg>
      </motion.div>

      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#ffc5aa]"
          style={{
            left: `${50 + Math.cos((i / 8) * Math.PI * 2) * 48}%`,
            top: `${50 + Math.sin((i / 8) * Math.PI * 2) * 48}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.95, delay: 0.4 + i * 0.05 }}
        />
      ))}

      {orderId && <span className="sr-only">Order {orderId} confirmed</span>}
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
  couponCode,
  expectedDelivery,
  onContinue,
  fullscreen = true,
}) {
  const [copied, setCopied] = useState(false);

  const copyCoupon = async () => {
    if (!couponCode) return;
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-[80] overflow-y-auto bg-gradient-to-b from-[#bbf1d2] via-[#eef8cd] to-[#eef8cd]"
          : "col-span-12 max-h-[92vh] overflow-y-auto p-6 md:p-10"
      }
    >
      <div className="mx-auto flex min-h-full max-w-lg flex-col px-5 pb-10 pt-12 sm:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-center"
        >
          <OrderSuccessTick orderId={orderId} />
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="font-[family-name:var(--font-heading)] text-3xl font-black text-foreground"
          >
            Order Placed!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            Thank you · Your HIMU order is confirmed
          </motion.p>
          <motion.p
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#bbf1d2] px-4 py-1.5 text-xs font-bold text-ink-accent"
          >
            Order ID · {orderId}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mb-4 space-y-3"
        >
          <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-[var(--c-lime)] p-4 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-ink-accent">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-ink-accent">
                Expected delivery
              </p>
              <p className="mt-0.5 text-base font-bold text-foreground">
                {expectedDelivery || "Within 5–7 days"}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                Arriving by {expectedDelivery || "soon"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gold/40 bg-gradient-to-r from-[#ffc5aa] to-[var(--c-lime)] p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-ink-accent">
                  <TicketPercent className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-ink-accent">
                    Order coupon
                  </p>
                  <p className="mt-0.5 font-[family-name:var(--font-heading)] text-lg font-black tracking-wider text-foreground">
                    {couponCode || "HIMUCARE"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Save this code for your next order
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={copyCoupon}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-gold/40 bg-[var(--c-lime)] px-3 text-xs font-bold text-ink-accent"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="space-y-5 rounded-3xl border border-[#bbf1d2] bg-primary-foreground/95 p-5 shadow-sm"
        >
          <div className="flex items-start justify-between border-b border-[#bbf1d2] pb-3">
            <div>
              <h1 className="font-[family-name:var(--font-heading)] text-lg font-extrabold text-ink-accent">
                {COMPANY.name}
              </h1>
              <p className="mt-1 text-[10px] text-muted-foreground">Date: {orderDate}</p>
            </div>
            <span className="rounded-full bg-[#bbf1d2] px-3 py-1 text-[10px] font-bold uppercase text-ink-accent">
              Confirmed
            </span>
          </div>

          <div className="grid gap-3 text-xs sm:grid-cols-2">
            <div>
              <h4 className="mb-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Deliver to
              </h4>
              <p className="font-bold text-foreground">{formData.name}</p>
              <p className="text-muted-foreground">{formData.phone}</p>
              <p className="text-muted-foreground">
                {formData.address}, {formData.city} - {formData.pincode}
              </p>
            </div>
            <div>
              <h4 className="mb-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Payment
              </h4>
              <p className="capitalize text-foreground">
                {formData.paymentMethod === "cod" ? "Cash on Delivery" : "Card Payment"}
              </p>
              <p className="mt-1 font-bold text-ink-accent">₹{summaryTotal}</p>
            </div>
          </div>

          <div className="divide-y divide-[#bbf1d2] rounded-2xl border border-[#bbf1d2] text-xs">
            {summaryItems.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedVariant}`}
                className="flex items-center justify-between gap-3 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-foreground">{item.product.name}</p>
                  <p className="text-[10px] text-muted-foreground">Qty {item.quantity}</p>
                </div>
                <span className="shrink-0 font-bold text-ink-accent">
                  ₹{item.product.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₹{summaryOriginal}</span>
            </div>
            {summarySavings > 0 && (
              <div className="flex justify-between font-semibold text-ink-mint">
                <span>Savings</span>
                <span>- ₹{summarySavings}</span>
              </div>
            )}
            <div className="flex items-end justify-between border-t border-[#bbf1d2] pt-2 text-sm font-bold text-ink-accent">
              <span>Total paid</span>
              <span className="font-[family-name:var(--font-heading)] text-xl font-black">
                ₹{summaryTotal}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={onContinue}
            className="h-12 rounded-2xl bg-primary px-8 text-primary-foreground hover:bg-primary/95"
          >
            Continue Shopping
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="h-12 gap-2 rounded-2xl border-[#bbf1d2] text-ink-accent"
          >
            <Printer className="h-4 w-4" /> Print Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}
