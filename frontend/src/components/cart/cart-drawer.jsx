import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Leaf,
  Sparkles,
} from "lucide-react";
import { Image } from "@/components/ui/image";
import { useCart } from "@/providers/CartProvider";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartTotalOriginal,
    cartSavings,
    openCheckoutFromCart,
  } = useCart();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    if (isCartOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen, setCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-[#1a2e1f]/25 backdrop-blur-[6px]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-md flex-col overflow-hidden border-l border-[#d7e5db] bg-gradient-to-b from-[#f8fbf8] via-[#fbf9f3] to-[#f3f7f2] shadow-[ -20px_0_60px_rgba(26,46,31,0.12)]"
          >
            {/* Soft decorative glow */}
            <div className="pointer-events-none absolute -right-16 top-10 h-40 w-40 rounded-full bg-[#cfe8d6]/50 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-40 h-32 w-32 rounded-full bg-[#efe3b8]/40 blur-3xl" />

            {/* Header */}
            <div className="relative border-b border-[#dce8e0] bg-white/70 px-5 py-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7f3ec] text-[#3d7a5a]">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7a9586]">
                      HIMU Pharmacy
                    </p>
                    <h2 className="font-[family-name:var(--font-heading)] text-lg font-black text-[#1f3b2c]">
                      Your Cart
                      <span className="ml-2 rounded-full bg-[#e7f3ec] px-2 py-0.5 text-xs font-bold text-[#3d7a5a]">
                        {cartItems.length}
                      </span>
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="rounded-xl bg-[#eef4f0] p-2 text-[#6b8576] transition hover:bg-[#e2eee7] hover:text-[#1f3b2c]"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="relative flex-1 space-y-3 overflow-y-auto px-4 py-5">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-[28px] bg-white shadow-[0_10px_40px_rgba(61,122,90,0.08)]">
                    <Leaf className="h-10 w-10 text-[#8fb89d]" />
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#1f3b2c]">
                    Your cart is empty
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6f8679]">
                    Soft care starts here — explore formulations and add them to
                    your bag.
                  </p>
                  <Button
                    onClick={() => setCartOpen(false)}
                    className="mt-6 h-11 rounded-2xl bg-[#6fa987] px-6 text-white shadow-none hover:bg-[#5f9877]"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedVariant}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/90 p-3.5 shadow-[0_8px_30px_rgba(61,122,90,0.06)]"
                  >
                    <div className="flex gap-3.5">
                      <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-2xl bg-[#eef4f0]">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="88px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-bold text-[#1f3b2c]">
                              {item.product.name}
                            </h4>
                            <p className="mt-0.5 truncate text-[11px] text-[#7a9586]">
                              {item.selectedVariant} · {item.product.strength}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              removeFromCart(item.product.id, item.selectedVariant)
                            }
                            className="rounded-xl bg-[#f8ecec] p-1.5 text-[#c07a7a] transition hover:bg-[#f3dede] hover:text-[#b45c5c]"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-end justify-between">
                          <div className="inline-flex items-center gap-1 rounded-full bg-[#eef4f0] p-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                  item.selectedVariant,
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#3d7a5a] shadow-sm transition hover:bg-[#e7f3ec]"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-sm font-bold text-[#1f3b2c]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.selectedVariant,
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#3d7a5a] shadow-sm transition hover:bg-[#e7f3ec]"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-black text-[#3d7a5a]">
                              ₹{item.product.price * item.quantity}
                            </p>
                            {item.product.compareAtPrice && (
                              <p className="text-[10px] text-[#9aada2] line-through">
                                ₹{item.product.compareAtPrice * item.quantity}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="relative border-t border-[#dce8e0] bg-white/80 px-5 py-5 backdrop-blur-xl">
                <div className="mb-4 overflow-hidden rounded-3xl border border-[#e4eee7] bg-gradient-to-br from-[#f4f9f5] to-[#faf7ee] p-4">
                  <div className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8aa394]">
                    <Sparkles className="h-3 w-3 text-[#c4b26a]" />
                    Order summary
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-[#6f8679]">
                      <span>Original Price</span>
                      <span>₹{cartTotalOriginal}</span>
                    </div>
                    {cartSavings > 0 && (
                      <div className="flex justify-between font-semibold text-[#5f9877]">
                        <span>Total Savings</span>
                        <span>- ₹{cartSavings}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#6f8679]">
                      <span>Shipping</span>
                      <span className="font-semibold text-[#5f9877]">FREE</span>
                    </div>
                    <div className="flex items-end justify-between border-t border-[#e4eee7] pt-3">
                      <span className="text-sm font-bold text-[#1f3b2c]">
                        Grand Total
                      </span>
                      <span className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#3d7a5a]">
                        ₹{cartTotal}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      openCheckoutFromCart();
                    }}
                    className="group flex h-12 w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[#6fa987] to-[#5f9877] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(111,169,135,0.35)] transition hover:brightness-105"
                  >
                    <span>Proceed to Checkout</span>
                    <span className="flex items-center gap-1.5">
                      ₹{cartTotal}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="h-11 w-full rounded-2xl border border-[#c9ddd1] bg-white/70 text-xs font-bold text-[#3d7a5a] transition hover:bg-[#eef4f0]"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
