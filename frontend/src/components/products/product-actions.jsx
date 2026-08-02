import { useState } from "react";
import { ShoppingCart, Zap, Plus, Minus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/providers/CartProvider";

export function ProductActions({ product }) {
  const { addToCart, buyNow } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.name || product.name,
  );
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const isAvailable =
    product.categorySlug === "dermatology" ||
    product.categorySlug === "skin-care";

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    if (!isAvailable) return;
    buyNow(product, quantity, selectedVariant);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    alert(
      `Thank you! We will email you at ${emailInput} once ${product.name} becomes available.`,
    );
    setEmailInput("");
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-heading)] text-2xl font-black text-primary sm:text-3xl">
            ₹{product.price}
          </span>
          {product.compareAtPrice && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.compareAtPrice}
              </span>
              <span className="rounded bg-emerald/10 px-1.5 py-0.5 text-[11px] font-bold text-emerald">
                {Math.round(
                  ((product.compareAtPrice - product.price) /
                    product.compareAtPrice) *
                    100,
                )}
                % OFF
              </span>
            </>
          )}
        </div>
        {product.compareAtPrice && isAvailable && (
          <p className="mt-1 text-[11px] font-semibold text-emerald">
            You save ₹{product.compareAtPrice - product.price}
          </p>
        )}
      </div>

      {isAvailable ? (
        <>
          {product.variants?.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Pack size
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => setSelectedVariant(v.name)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      selectedVariant === v.name
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/40 text-muted-foreground"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-[7.5rem] items-center justify-between rounded-xl border border-border/40 bg-[#f8f3e6] px-2">
              <button
                type="button"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
                className="rounded-lg p-1.5 disabled:opacity-30"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm font-bold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-lg p-1.5"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              variant="outline"
              onClick={handleAddToCart}
              className="h-11 flex-1 gap-1.5 rounded-xl text-xs font-bold sm:text-sm"
            >
              <ShoppingCart className="h-4 w-4" />
              Add
            </Button>
            <Button
              onClick={handleBuyNow}
              className="h-11 flex-1 gap-1.5 rounded-xl text-xs font-bold sm:text-sm"
            >
              <Zap className="h-4 w-4 fill-current" />
              Buy
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
            <Sparkles className="h-3.5 w-3.5" /> Launching soon
          </p>
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Email for launch alert"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="h-11 flex-1 rounded-xl"
                required
              />
              <Button type="submit" className="h-11 shrink-0 rounded-xl px-4">
                Notify
              </Button>
            </form>
          ) : (
            <p className="rounded-xl bg-emerald/10 px-3 py-2.5 text-center text-xs font-bold text-emerald">
              ✓ You will be notified on launch
            </p>
          )}
        </div>
      )}
    </div>
  );
}
