import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import { ArrowLeft, Star, X } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { AccordionItem } from "@/components/ui/accordion";
import { ProductActions } from "@/components/products/product-actions";
import { ProductReviews } from "@/components/products/product-reviews";
import { getMockProducts } from "@/lib/mock-backend";
import { cn } from "@/lib/utils";

export function ProductDetailClient({
  initialProduct,
  initialRelatedProducts,
  slug,
}) {
  const [product, setProduct] = useState(initialProduct);
  const [related, setRelated] = useState(initialRelatedProducts);
  const [notFound, setNotFound] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef(null);

  useEffect(() => {
    const allProducts = getMockProducts();
    const foundProduct = allProducts.find((p) => p.slug === slug);
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveIndex(0);
      setNotFound(false);

      const fromRelated = (foundProduct.relatedSlugs || [])
        .map((s) => allProducts.find((p) => p.slug === s))
        .filter(Boolean);
      const similar = allProducts.filter(
        (p) =>
          p.id !== foundProduct.id &&
          p.categorySlug === foundProduct.categorySlug &&
          !fromRelated.some((r) => r.id === p.id),
      );
      const merged = [...fromRelated, ...similar].slice(0, 8);
      setRelated(merged);
    } else {
      setNotFound(true);
    }
  }, [slug]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const list = [product.image, ...(product.images || [])].filter(Boolean);
    return [...new Set(list)];
  }, [product]);

  const goToImage = useCallback(
    (index, { smooth = true } = {}) => {
      if (!gallery.length) return;
      const next = Math.max(0, Math.min(gallery.length - 1, index));
      setActiveIndex(next);
      const el = scrollerRef.current;
      if (!el) return;
      const width = el.clientWidth;
      el.scrollTo({ left: next * width, behavior: smooth ? "smooth" : "auto" });
    },
    [gallery.length],
  );

  const onGalleryScroll = () => {
    const el = scrollerRef.current;
    if (!el || !el.clientWidth) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== activeIndex && index >= 0 && index < gallery.length) {
      setActiveIndex(index);
    }
  };

  // Reset carousel when product changes
  useEffect(() => {
    goToImage(0, { smooth: false });
  }, [slug, goToImage]);

  // Keep active slide aligned after rotate / resize
  useEffect(() => {
    const onResize = () => goToImage(activeIndex, { smooth: false });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex, goToImage]);

  const infoSections = useMemo(() => {
    if (!product) return [];
    return [
      { title: "About this product", content: product.description },
      { title: "Uses", items: product.uses },
      { title: "Benefits", items: product.benefits },
      { title: "Dosage", content: product.dosage },
      {
        title: "Product details",
        content: [
          product.composition && `Composition: ${product.composition}`,
          product.strength && `Strength: ${product.strength}`,
          product.packaging && `Packaging: ${product.packaging}`,
          product.shelfLife && `Shelf life: ${product.shelfLife}`,
          product.manufacturer && `Manufacturer: ${product.manufacturer}`,
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ].filter((s) => s.content || (s.items && s.items.length));
  }, [product]);

  if (notFound) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
          <X className="h-7 w-7" />
        </div>
        <h1 className="mb-2 font-[family-name:var(--font-heading)] text-2xl font-bold">
          Product Not Found
        </h1>
        <Link href="/products">
          <Button className="mt-4 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const offPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : 0;

  return (
    <div className="bg-[#f8f3e6] pb-4 md:bg-transparent md:pb-10">
      {/* Gallery — edge-to-edge on mobile */}
      <section className="bg-white md:bg-transparent">
        <div className="md:container-custom md:pt-4">
          <div className="grid gap-0 lg:grid-cols-2 lg:gap-10 lg:pt-2">
            <div className="bg-white">
              <div className="relative aspect-square w-full overflow-hidden bg-[#f3f1ea] md:rounded-2xl md:shadow-lg">
                <div
                  ref={scrollerRef}
                  onScroll={onGalleryScroll}
                  className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {gallery.map((img, i) => (
                    <div
                      key={`${img}-${i}`}
                      className="relative h-full w-full shrink-0 snap-center"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        fill
                        className="object-cover"
                        priority={i === 0}
                      />
                    </div>
                  ))}
                </div>

                {offPercent > 0 && (
                  <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-md bg-[#cc0c39] px-2 py-1 text-[11px] font-black text-white">
                    -{offPercent}%
                  </span>
                )}

                {gallery.length > 1 && (
                  <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-2 py-1 backdrop-blur-sm">
                    {gallery.map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50",
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>

              {gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto px-3 py-3 md:px-0 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {gallery.map((img, i) => {
                    const selected = i === activeIndex;
                    return (
                      <button
                        key={`${img}-thumb-${i}`}
                        type="button"
                        onClick={() => goToImage(i)}
                        className={cn(
                          "relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-lg border-2 transition",
                          selected
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border/50 opacity-80",
                        )}
                        aria-label={`View image ${i + 1}`}
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Buy box */}
            <div className="space-y-3 px-4 pb-4 pt-3 md:px-0 md:pt-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                {product.brand || "HIMU"} · {product.category}
              </p>
              <h1 className="font-[family-name:var(--font-heading)] text-[1.35rem] font-bold leading-snug text-foreground sm:text-2xl md:text-3xl">
                {product.name}
              </h1>

              {product.rating && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#0b6a46] px-2 py-0.5 text-xs font-bold text-white">
                    {product.rating}
                    <Star className="h-3 w-3 fill-current" />
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    {product.reviewCount || 0} ratings
                  </span>
                </div>
              )}

              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.shortDescription}
              </p>

              <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-foreground/80">
                {product.strength && (
                  <span className="rounded-full bg-primary/8 px-2.5 py-1">
                    {product.strength}
                  </span>
                )}
                {product.productType && (
                  <span className="rounded-full bg-primary/8 px-2.5 py-1">
                    {product.productType}
                  </span>
                )}
                {product.composition && (
                  <span className="rounded-full bg-primary/8 px-2.5 py-1">
                    {product.composition}
                  </span>
                )}
              </div>

              <div className="rounded-2xl border border-border/40 bg-white p-3 shadow-sm md:p-4">
                <ProductActions product={product} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Essential info — accordion only */}
      <section className="mt-2 bg-white px-4 py-4 md:mt-8 md:bg-transparent md:px-0">
        <div className="container-custom max-w-3xl px-0 md:px-4">
          <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-bold md:text-xl">
            Product information
          </h2>
          <div className="space-y-2">
            {infoSections.map((section) => (
              <AccordionItem key={section.title} title={section.title}>
                {section.content && (
                  <p className="whitespace-pre-line">{section.content}</p>
                )}
                {section.items && (
                  <ul className="space-y-1.5">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionItem>
            ))}
            {(product.faq || []).slice(0, 3).map((item, i) => (
              <AccordionItem key={`faq-${i}`} title={item.question}>
                {item.answer}
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-2 bg-white px-4 py-4 md:mt-6 md:bg-transparent md:px-0">
        <div className="container-custom px-0 md:px-4">
          <ProductReviews product={product} variant="detail" />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-2 bg-white px-4 py-5 md:mt-8 md:bg-transparent md:px-0">
          <div className="container-custom px-0 md:px-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold md:text-xl">
                Related & similar
              </h2>
              <Link
                href={`/products?category=${product.categorySlug}`}
                className="text-xs font-bold text-primary"
              >
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
