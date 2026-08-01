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
        compact
        title="Shop Medicines & Care"
        description="Browse HIMU shelves — derma, wellness & pharmacy essentials."
        image="/banners/banner-shop-medicines.jpg"
        badge="HIMU Store"
      />
      <section className="section-padding pt-4 sm:pt-6">
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
