import { useEffect, useState } from "react";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import { Download, ArrowRight, ArrowLeft, X } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AccordionItem } from "@/components/ui/accordion";
import { FadeIn } from "@/components/animations/motion-components";
import { ProductActions } from "@/components/products/product-actions";
import { getMockProducts } from "@/lib/mock-backend";
import { PRODUCT_DISCLAIMER } from "@/lib/constants";

export function ProductDetailClient({
  initialProduct,
  initialRelatedProducts,
  slug,
}) {
  const [product, setProduct] = useState(initialProduct);
  const [related, setRelated] = useState(initialRelatedProducts);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const allProducts = getMockProducts();
    const foundProduct = allProducts.find((p) => p.slug === slug);
    if (foundProduct) {
      setProduct(foundProduct);
      setNotFound(false);

      // Hydrate related products
      const relatedItems = foundProduct.relatedSlugs
        .map((s) => allProducts.find((p) => p.slug === s))
        .filter((p) => !!p)
        .slice(0, 4);
      setRelated(relatedItems);
    } else {
      setNotFound(true);
    }
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-16">
        <div className="h-16 w-16 bg-red-100 dark:bg-red-950/20 text-red-500 rounded-full flex items-center justify-center mb-4">
          <X className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-2">
          Product Not Found
        </h1>
        <p className="text-muted-foreground text-sm max-w-sm mb-6">
          The product you are looking for has been removed or is no longer
          available in our catalog.
        </p>
        <Link href="/products">
          <Button variant="default" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const infoSections = [
    { title: "Description", content: product.description },
    { title: "Benefits", items: product.benefits },
    { title: "Uses", items: product.uses },
    { title: "Indications", items: product.indications },
    { title: "Dosage", content: product.dosage },
    { title: "Administration", content: product.administration },
    { title: "Precautions", items: product.precautions },
    { title: "Warnings", items: product.warnings },
    { title: "Side Effects", items: product.sideEffects },
  ];

  const metaBlocks = [
    { label: "Storage", value: product.storage },
    { label: "Packaging", value: product.packaging },
    { label: "Shelf Life", value: product.shelfLife },
  ];

  return (
    <>
      <section className="pt-28 pb-8 bg-muted/30">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: "Products", href: "/products" },
              {
                label: product.category,
                href: `/categories/${product.categorySlug}`,
              },
              { label: product.name },
            ]}
          />
        </div>
      </section>
      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <FadeIn direction="left">
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-xl overflow-hidden border-2 border-border"
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <Badge className="mb-3">{product.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 font-[family-name:var(--font-heading)]">
                {product.name}
              </h1>
              <p className="text-muted-foreground mb-4">
                {product.shortDescription}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">Strength</p>
                  <p className="font-semibold">{product.strength}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    Manufacturer
                  </p>
                  <p className="font-semibold text-sm">
                    {product.manufacturer}
                  </p>
                </div>
                <div className="glass rounded-xl p-4 col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    Composition
                  </p>
                  <p className="font-semibold">{product.composition}</p>
                </div>
              </div>
              {/* Client action buttons (Cart, Qty, Variant, Buy Now) */}
              <div className="mb-6">
                <ProductActions product={product} />
              </div>
              <div className="flex flex-wrap gap-3 mb-6">
                <Button variant="outline">
                  <Download className="h-4 w-4" /> Product Brochure
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4" /> Datasheet
                </Button>
              </div>
              <Card className="p-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  {PRODUCT_DISCLAIMER}
                </p>
              </Card>
            </FadeIn>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-8">
            {infoSections.map((section) => (
              <FadeIn key={section.title}>
                <Card className="p-6 h-full">
                  <h2 className="font-bold text-lg mb-3 text-primary">
                    {section.title}
                  </h2>
                  {section.content && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  )}
                  {section.items && (
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </FadeIn>
            ))}
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-6">
            {metaBlocks.map((item) => (
              <Card key={item.label} className="p-5">
                <h3 className="font-bold text-sm text-primary mb-2">
                  {item.label}
                </h3>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </Card>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="font-bold text-2xl mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {product.faq.map((item, i) => (
                <AccordionItem key={i} title={item.question}>
                  {item.answer}
                </AccordionItem>
              ))}
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-2xl">Related Medicines</h2>
                <Link
                  href={`/categories/${product.categorySlug}`}
                  className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View Category <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(
                  (p) => p && <ProductCard key={p.id} product={p} />,
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
