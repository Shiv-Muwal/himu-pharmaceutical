import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHero } from "@/components/sections/page-hero";
import { ProductCatalog } from "@/components/products/product-catalog";
import { products as fallbackProducts } from "@/data/products";
import { fetchStoreProducts } from "@/lib/products-api";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [catalog, setCatalog] = useState(fallbackProducts);

  useEffect(() => {
    let active = true;
    fetchStoreProducts().then((items) => {
      if (active && items?.length) setCatalog(items);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHero
        compact
        title="Shop Medicines & Care"
        description="Browse HIMU shelves — derma, wellness & pharmacy essentials."
        image="/banners/banner-shop-medicines.jpg"
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
            products={catalog}
            initialSearch={searchParams.get("q") || ""}
            initialCategory={searchParams.get("category") || ""}
          />
        </div>
      </section>
    </>
  );
}
