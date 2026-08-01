import { Link } from "@/components/ui/link";
import { Image } from "@/components/ui/image";
import { ShoppingCart, Zap, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/CartProvider";
import { cn } from "@/lib/utils";
import { ProductReviews } from "@/components/products/product-reviews";

export function ProductCard({ product, showReviews = true, compact = false }) {
  const { addToCart, buyNow } = useCart();
  const isAvailable =
    product.categorySlug === "dermatology" ||
    product.categorySlug === "skin-care";

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
        "group relative flex h-full flex-col justify-between overflow-hidden bg-card hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1",
        compact && "shadow-sm",
      )}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-110",
              !isAvailable && "opacity-80 blur-[1px]",
            )}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className={cn("absolute z-10", compact ? "left-2 top-2" : "left-3 top-3")}>
            <Badge variant="gold" className={compact ? "px-1.5 py-0 text-[8px]" : undefined}>
              {product.category}
            </Badge>
          </div>
          {!isAvailable && (
            <div className={cn("absolute z-10", compact ? "right-2 top-2" : "right-3 top-3")}>
              <Badge className="rounded-full border-0 bg-gradient-to-r from-secondary to-amber-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#1a2e1f] animate-pulse shadow-sm hover:from-secondary hover:to-amber-600">
                Soon
              </Badge>
            </div>
          )}
        </div>
      </Link>
      <CardContent
        className={cn(
          "flex flex-1 flex-col justify-between",
          compact ? "p-2.5 sm:p-5" : "p-5",
        )}
      >
        <div>
          <Link href={`/products/${product.slug}`} className="block">
            <p
              className={cn(
                "mb-0.5 font-bold uppercase tracking-wider text-primary/80",
                compact ? "text-[8px] sm:text-[10px]" : "text-[10px]",
              )}
            >
              {product.brand || "HIMU"}
              {product.productType ? ` · ${product.productType}` : ""}
            </p>
            <h3
              className={cn(
                "mb-1 font-bold transition-colors line-clamp-2 group-hover:text-primary sm:line-clamp-1",
                compact ? "text-[13px] leading-snug sm:text-lg" : "text-lg",
              )}
            >
              {product.name}
            </h3>
          </Link>
          <p
            className={cn(
              "mb-2 text-muted-foreground",
              compact ? "hidden text-xs sm:block" : "text-xs",
            )}
          >
            {product.composition} · {product.strength}
          </p>
          {product.rating && !compact && (
            <div className="mb-2 flex items-center gap-1">
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
              <span className="text-[10px] font-bold text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          )}
          <p
            className={cn(
              "mb-3 line-clamp-2 text-muted-foreground",
              compact ? "hidden text-sm sm:block" : "text-sm",
            )}
          >
            {product.shortDescription}
          </p>
        </div>
        <div>
          <div className={cn("flex items-baseline gap-1 mb-3 sm:mb-4", compact && "gap-1")}>
            <span
              className={cn(
                "font-black text-primary font-[family-name:var(--font-heading)]",
                compact ? "text-base sm:text-lg" : "text-lg",
              )}
            >
              ₹{product.price}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-[10px] text-muted-foreground line-through sm:text-xs">
                  ₹{product.compareAtPrice}
                </span>
                <span className="ml-0.5 shrink-0 rounded bg-emerald/10 px-1 py-0.5 text-[8px] font-black text-emerald dark:bg-emerald/20 sm:text-[9px] sm:px-1.5">
                  {Math.round(
                    ((product.compareAtPrice - product.price) /
                      product.compareAtPrice) *
                      100,
                  )}
                  %
                </span>
              </>
            )}
          </div>
          {isAvailable ? (
            <div className={cn("mt-auto grid grid-cols-2", compact ? "gap-1.5" : "gap-2")}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToCart}
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-1 rounded-lg hover:border-primary hover:bg-primary hover:text-primary-foreground",
                  compact ? "h-8 px-1.5 text-[10px] sm:h-9 sm:px-3 sm:text-xs" : "h-9 px-3 text-xs",
                )}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleBuyNow}
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95",
                  compact ? "h-8 px-1.5 text-[10px] sm:h-9 sm:px-3 sm:text-xs" : "h-9 px-3 text-xs",
                )}
              >
                <Zap className="h-3.5 w-3.5 fill-current" />
                Buy
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
              className="h-9 w-full cursor-pointer rounded-lg border-2 border-dashed border-secondary/60 text-xs font-bold text-secondary hover:bg-secondary/10"
            >
              Notify Me
            </Button>
          )}
          {showReviews && <ProductReviews product={product} variant="card" />}
        </div>
      </CardContent>
    </Card>
  );
}
