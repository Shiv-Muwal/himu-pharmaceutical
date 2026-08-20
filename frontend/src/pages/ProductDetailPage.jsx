import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { generateProductSchema, generateBreadcrumbSchema, generateFaqSchema } from "@/lib/seo";
import { SeoJsonLd } from "@/components/seo/seo-json-ld";
import { ProductDetailClient } from "@/components/products/product-detail-client";
import { fetchStoreProductBySlug, fetchStoreProducts } from "@/lib/products-api";

export default function ProductDetailPage() {
  const { slug = "" } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      const apiProduct = await fetchStoreProductBySlug(slug);
      if (!active) return;
      setProduct(apiProduct);
      if (apiProduct) {
        const all = await fetchStoreProducts();
        const relatedItems = (apiProduct.relatedSlugs || [])
          .map((s) => all.find((p) => p.slug === s))
          .filter(Boolean)
          .slice(0, 4);
        setRelated(
          relatedItems.length
            ? relatedItems
            : all.filter((p) => p.slug !== apiProduct.slug).slice(0, 4),
        );
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container-custom py-24 text-center text-sm text-muted-foreground">
        Loading product...
      </div>
    );
  }

  if (!product) return <Navigate to="/404" replace />;

  const schemas = [
    generateProductSchema(product),
    generateBreadcrumbSchema([
      { name: "Products", url: "/products" },
      { name: product.category, url: `/categories/${product.categorySlug}` },
      { name: product.name, url: `/products/${slug}` },
    ]),
    ...(product.faq?.length ? [generateFaqSchema(product.faq)] : []),
  ];

  return (
    <>
      <SeoJsonLd id="product" data={schemas} />
      <ProductDetailClient
        initialProduct={product}
        initialRelatedProducts={related}
        slug={slug}
      />
    </>
  );
}
