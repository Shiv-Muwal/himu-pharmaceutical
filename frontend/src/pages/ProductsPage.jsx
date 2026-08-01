import { useSearchParams } from "react-router-dom";
import { PageHero } from "@/components/sections/Page-hero";
import { ProductCatalog } from "@/components/products/Product-catalog";
import { products } from "@/data/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  return (
    <>
      <PageHero
        title="Shop Medicines & Care"
        description="Search anything — face cleaner, acne gel, antibiotics — then filter by brand, type, and budget."
        image="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&h=600&fit=crop"
        badge="HIMU Store"
      />
      <section className="section-padding">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              {
                label: "Products",
              },
            ]}
          />
          <ProductCatalog
            products={products}
            initialSearch={searchParams.get("q") || ""}
            initialCategory={searchParams.get("category") || ""}
          />
        </div>
      </section>
    </>
  );
}
