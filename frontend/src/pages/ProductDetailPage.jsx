import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getProductBySlug, products } from "@/data/products";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { ProductDetailClient } from "@/components/products/product-detail-client";
export default function ProductDetailPage() {
  const { slug = "" } = useParams();
  const product = getProductBySlug(slug);
  useEffect(() => {
    if (!product) return;
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
  if (!product) return <Navigate to="/404" replace />;
  const related = product.relatedSlugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p) => !!p)
    .slice(0, 4);
  return (
    <ProductDetailClient
      initialProduct={product}
      initialRelatedProducts={related}
      slug={slug}
    />
  );
}
