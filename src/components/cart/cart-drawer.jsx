import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useCart } from "@/providers/cart-provider";
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
    setCheckoutOpen,
  } = useCart();

  // Close drawer on ESC key
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#fff8e7] dark:bg-[#0a1410] border-l border-border/40 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-lg text-foreground font-[family-name:var(--font-heading)]">
                  Your Cart ({cartItems.length})
                </h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ShoppingBag className="h-10 w-10 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      Your cart is empty
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 px-4">
                      Explore our products and add them to your cart to see them
                      here!
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCartOpen(false)}
                    className="mt-2"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedVariant}`}
                    className="flex gap-4 p-3 rounded-2xl glass border border-border/20 shadow-sm relative group overflow-hidden"
                  >
                    {/* Item Image */}
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-foreground line-clamp-1">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                          {item.selectedVariant} • {item.product.strength}
                        </p>
                      </div>
                      {/* Pricing and Qty Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.selectedVariant,
                              )
                            }
                            className="h-7 w-7 rounded-lg border border-border/30 bg-background/50 flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">
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
                            className="h-7 w-7 rounded-lg border border-border/30 bg-background/50 flex items-center justify-center text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        {/* Price display */}
                        <div className="text-right">
                          <span className="font-bold text-sm text-primary">
                            ₹{item.product.price * item.quantity}
                          </span>
                          {item.product.compareAtPrice && (
                            <p className="text-[10px] text-muted-foreground line-through">
                              ₹{item.product.compareAtPrice * item.quantity}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={() =>
                        removeFromCart(item.product.id, item.selectedVariant)
                      }
                      className="absolute top-2 right-2 p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-border/30 bg-background/55 backdrop-blur-md space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Original Price</span>
                    <span>₹{cartTotalOriginal}</span>
                  </div>
                  {cartSavings > 0 && (
                    <div className="flex justify-between text-xs text-emerald font-semibold">
                      <span>Total Savings</span>
                      <span>- ₹{cartSavings}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-emerald font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-border/30 pt-2 flex justify-between items-end">
                    <span className="font-bold text-sm">Grand Total</span>
                    <span className="font-black text-xl text-primary font-[family-name:var(--font-heading)]">
                      ₹{cartTotal}
                    </span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Button
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                    className="w-full h-12 text-sm justify-between shadow-lg shadow-primary/20 group/chk cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <span className="flex items-center gap-1.5 font-bold">
                      ₹{cartTotal}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/chk:translate-x-1" />
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCartOpen(false)}
                    className="w-full h-11 text-xs cursor-pointer"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
