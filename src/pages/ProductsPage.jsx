import { useSearchParams } from "react-router-dom";
import { PageHero } from "@/components/sections/page-hero";
import { ProductCatalog } from "@/components/products/product-catalog";
import { products } from "@/data/products";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  return (
    <>
      <PageHero
        title="Product Catalogue"
        description="Explore our comprehensive portfolio of pharmaceutical products. Information only — no online purchasing."
        image="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&h=600&fit=crop"
        badge="500+ Medicines"
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
