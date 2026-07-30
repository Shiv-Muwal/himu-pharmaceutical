import { PageHero } from "@/components/sections/page-hero";
import { BlogListing } from "@/components/sections/blog-listing";
export default function NewsPage() {
  return (
    <>
      <PageHero
        title="News & Insights"
        description="Stay updated with the latest from HIMU Pharmacy — research breakthroughs, corporate news, and healthcare insights."
        image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&h=600&fit=crop"
        badge="Newsroom"
      />
      <section className="section-padding">
        <div className="container-custom">
          <BlogListing />
        </div>
      </section>
    </>
  );
}
