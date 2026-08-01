import { Link } from "@/components/ui/Link";
import { Image } from "@/components/ui/Image";
import { ShoppingCart, Zap, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/providers/CartProvider";
import { cn } from "@/lib/utils";
import { ProductReviews } from "@/components/products/Product-reviews";

export function ProductCard({ product, showReviews = true }) {
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
    <Card className="group overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col justify-between h-full bg-card relative">
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="gold">{product.category}</Badge>
          </div>
          {!isAvailable && (
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-gradient-to-r from-secondary to-amber-600 hover:from-secondary hover:to-amber-600 text-[#1a2e1f] font-black border-0 text-[9px] uppercase tracking-wider animate-pulse px-2 py-0.5 rounded-full shadow-sm">
                Coming Soon
              </Badge>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/products/${product.slug}`} className="block">
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-primary/80">
              {product.brand || "HIMU"}
              {product.productType ? ` · ${product.productType}` : ""}
            </p>
            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mb-2">
            {product.composition} · {product.strength}
          </p>
          {/* Ratings row */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
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
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.shortDescription}
          </p>
        </div>
        <div>
          {/* Pricing Row */}
          <div className="flex items-baseline gap-1.5 mb-4">
            <span className="text-lg font-black text-primary font-[family-name:var(--font-heading)]">
              ₹{product.price}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.compareAtPrice}
                </span>
                <span className="text-[9px] text-emerald font-black bg-emerald/10 dark:bg-emerald/20 px-1.5 py-0.5 rounded ml-1 shrink-0">
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
          {/* Action Buttons */}
          {isAvailable ? (
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-1 h-9 px-3 rounded-lg text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-1 h-9 px-3 rounded-lg text-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95"
              >
                <Zap className="h-3.5 w-3.5 fill-current" />
                Buy Now
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
              className="w-full h-9 rounded-lg text-xs cursor-pointer border-2 border-dashed border-secondary/60 text-secondary hover:bg-secondary/10 font-bold"
            >
              Coming Soon - Notify Me
            </Button>
          )}
          {showReviews && <ProductReviews product={product} variant="card" />}
        </div>
      </CardContent>
    </Card>
  );
}
