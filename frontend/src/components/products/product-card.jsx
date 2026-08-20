import { Link } from "@/components/ui/link";
import { Image } from "@/components/ui/image";
import { ShoppingCart, Zap, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/CartProvider";
import { cn } from "@/lib/utils";
import { getProductMrp } from "@/lib/pricing";

export function ProductCard({ product, compact = false }) {
  const { addToCart, buyNow } = useCart();
  const isAvailable =
    product.categorySlug === "dermatology" ||
    product.categorySlug === "skin-care";

  const mrp = getProductMrp(product);

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;
    buyNow(product, 1);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) return;
    addToCart(product, 1);
  };

  return (
    <Card
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden border-border/50 bg-card shadow-md shadow-primary/5 transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10",
        compact && "rounded-2xl",
      )}
    >
      <Link href={`/products/${product.slug}`} className="block min-w-0">
        <div
          className={cn(
            "relative overflow-hidden bg-gradient-to-br from-[#f3f7f0] to-[#efe8d8]",
            compact ? "aspect-[4/5]" : "aspect-square",
          )}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={cn(
              "object-contain p-2 transition-transform duration-500 group-hover:scale-105",
              !isAvailable && "opacity-80 blur-[1px]",
            )}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 280px"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/90 to-transparent" />

          <div className={cn("absolute z-10", compact ? "left-2 top-2" : "left-3 top-3")}>
            <Badge
              variant="gold"
              className={cn(
                "max-w-[7.5rem] truncate shadow-sm",
                compact ? "px-1.5 py-0 text-[8px]" : "text-[10px]",
              )}
            >
              {product.category}
            </Badge>
          </div>

          {!isAvailable && (
            <div className={cn("absolute z-10", compact ? "right-2 top-2" : "right-3 top-3")}>
              <Badge className="rounded-full border-0 bg-gradient-to-r from-secondary to-amber-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#1a2e1f] shadow-sm">
                Soon
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent
        className={cn(
          "flex min-w-0 flex-1 flex-col overflow-hidden",
          compact ? "gap-2 p-3" : "gap-3 p-5",
        )}
      >
        <div className="min-w-0 space-y-1">
          <p
            className={cn(
              "truncate font-bold uppercase tracking-[0.14em] text-emerald/80",
              compact ? "text-[8px]" : "text-[10px]",
            )}
          >
            {product.category}
          </p>

          <Link href={`/products/${product.slug}`} className="block min-w-0">
            <h3
              className={cn(
                "font-bold leading-snug text-foreground transition-colors group-hover:text-emerald",
                compact
                  ? "line-clamp-2 text-[12px] sm:text-sm"
                  : "line-clamp-2 text-base sm:text-lg",
              )}
            >
              {product.name}
            </h3>
          </Link>

          <p
            className={cn(
              "truncate text-muted-foreground",
              compact ? "text-[10px]" : "text-xs",
            )}
          >
            {product.strength}
          </p>

          {product.rating && !compact && (
            <div className="flex min-w-0 items-center gap-1 pt-0.5">
              <div className="flex shrink-0 text-amber-400">
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
              <span className="truncate text-[10px] font-bold text-muted-foreground">
                {product.rating} ({product.reviewCount})
              </span>
            </div>
          )}

          {!compact && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {product.shortDescription}
            </p>
          )}
        </div>

        <div className="mt-auto min-w-0 space-y-2.5">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span
              className={cn(
                "font-[family-name:var(--font-heading)] font-black text-emerald",
                compact ? "text-base" : "text-xl",
              )}
            >
              ₹{mrp}
            </span>
          </div>

          {isAvailable ? (
            <div className={cn("grid grid-cols-2", compact ? "gap-1.5" : "gap-2")}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToCart}
                className={cn(
                  "min-w-0 cursor-pointer items-center justify-center gap-1 rounded-xl border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground",
                  compact ? "h-8 px-1.5 text-[10px]" : "h-10 px-3 text-xs",
                )}
              >
                <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Add</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleBuyNow}
                className={cn(
                  "min-w-0 cursor-pointer items-center justify-center gap-1 rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/95",
                  compact ? "h-8 px-1.5 text-[10px]" : "h-10 px-3 text-xs",
                )}
              >
                <Zap className="h-3.5 w-3.5 shrink-0 fill-current" />
                <span className="truncate">Buy</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                alert(
                  `Thank you for your interest! ${product.name} is launching soon. We'll notify you once it's available!`,
                );
              }}
              className="h-9 w-full cursor-pointer rounded-xl border-2 border-dashed border-secondary/60 text-xs font-bold text-secondary hover:bg-secondary/10"
            >
              Notify Me
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
