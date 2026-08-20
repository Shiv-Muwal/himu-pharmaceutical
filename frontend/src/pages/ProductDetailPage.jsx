import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo";
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

  useEffect(() => {
    if (!product) return undefined;
    const productSchema = generateProductSchema(product);
    const breadcrumbSchema = generateBreadcrumbSchema([
      {
        name: "Products",
        url: "/products",
      },
      {
        name: product.category,
        url: `/categories/${product.categorySlug}`,
      },
      {
        name: product.name,
        url: `/products/${slug}`,
      },
    ]);
    const scripts = [productSchema, breadcrumbSchema].map((schema) => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.text = JSON.stringify(schema);
      el.dataset.seo = "product";
      document.head.appendChild(el);
      return el;
    });
    return () => {
      scripts.forEach((el) => el.remove());
    };
  }, [product, slug]);

  if (loading) {
    return (
      <div className="container-custom py-24 text-center text-sm text-muted-foreground">
        Loading product...
      </div>
    );
  }

  if (!product) return <Navigate to="/404" replace />;

  return (
    <ProductDetailClient
      initialProduct={product}
      initialRelatedProducts={related}
      slug={slug}
    />
  );
}
