import { Navigate, useParams } from "react-router-dom";
import { PageHero } from "@/components/sections/page-hero";
import { ProductCatalog } from "@/components/products/product-catalog";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FadeIn } from "@/components/animations/motion-components";
import { Card } from "@/components/ui/card";
import { getCategoryBySlug } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
export default function CategoryPage() {
  const { slug = "" } = useParams();
  const category = getCategoryBySlug(slug);
  if (!category) return <Navigate to="/404" replace />;
  const categoryProducts = getProductsByCategory(slug);
  return (
    <>
      <PageHero
        title={category.name}
        description={category.description}
        image={category.heroImage}
        badge="Product Category"
      />
      <section className="section-padding">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              {
                label: "Products",
                href: "/products",
              },
              {
                label: category.name,
              },
            ]}
          />
          <ProductCatalog products={categoryProducts} initialCategory={slug} />
        </div>
      </section>
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <FadeIn>
            <h2 className="font-bold text-2xl mb-6">Related Research</h2>
            <Card className="p-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                HIMU Pharmacy's {category.name.toLowerCase()} division is backed
                by dedicated research teams working on next-generation
                formulations, bioequivalence studies, and novel delivery
                systems.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our commitment to scientific excellence ensures that every
                product in the {category.name.toLowerCase()} category meets
                international quality standards and delivers optimal therapeutic
                outcomes.
              </p>
            </Card>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
