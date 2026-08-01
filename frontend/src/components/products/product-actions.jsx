import { useState } from "react";
import { ShoppingCart, Zap, Plus, Minus, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useCart } from "@/providers/CartProvider";
import { cn } from "@/lib/utils";

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

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

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
    <div className="space-y-6">
      {/* Price block */}
      <div className="glass rounded-2xl p-5 border border-border/20 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground">Price</p>
          {/* Ratings row */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < Math.floor(product.rating || 0)
                        ? "fill-current text-secondary"
                        : "text-muted-foreground/30",
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground font-bold">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl font-black text-primary font-[family-name:var(--font-heading)]">
            ₹{product.price}
          </span>
          {product.compareAtPrice && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.compareAtPrice}
              </span>
              <span className="text-xs font-bold text-emerald bg-emerald/10 dark:bg-emerald/20 px-2 py-0.5 rounded">
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
          <p className="text-[11px] text-emerald font-semibold mt-1">
            You save ₹{product.compareAtPrice - product.price} on this item!
          </p>
        )}
      </div>
      {isAvailable ? (
        <>
          {/* Variants Selector */}
          {product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Choose Pack Size:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => setSelectedVariant(v.name)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      selectedVariant === v.name
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border/30 bg-background/20 text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {v.name} ({v.strength})
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Quantity & CTAs Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Quantity control */}
            <div className="flex items-center justify-between border border-border/30 rounded-xl px-3 py-1 bg-background/40 h-12 w-full sm:w-32">
              <button
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30 cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-bold text-sm w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {/* Action CTAs */}
            <div className="flex flex-1 gap-3">
              <Button
                variant="outline"
                onClick={handleAddToCart}
                className="flex-1 h-12 gap-2 text-xs sm:text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                variant="default"
                onClick={handleBuyNow}
                className="flex-1 h-12 gap-2 text-xs sm:text-sm cursor-pointer shadow-lg shadow-primary/20"
              >
                <Zap className="h-4 w-4 fill-current" />
                Buy Now
              </Button>
            </div>
          </div>
        </>
      ) : (
        /* Coming Soon State */
        <div className="space-y-4">
          <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 rounded-2xl">
            <p className="text-xs text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500 animate-spin" />{" "}
              Launching Soon!
            </p>
            <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
              This product is currently undergoing final clinical reviews and
              quality assurance checks. Submitting your email below helps us
              prioritize launches in your area.
            </p>
          </Card>
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email for launch alerts"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 h-12 rounded-xl"
                required
              />
              <Button
                type="submit"
                className="h-12 px-6 shrink-0 cursor-pointer"
              >
                Notify Me
              </Button>
            </form>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald/10 border border-emerald/20 text-emerald text-xs font-bold text-center">
              ✓ Successfully subscribed! We will alert you on release.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
