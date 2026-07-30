import { useState, useMemo } from "react";
import { PageHero } from "@/components/sections/page-hero";
import { AccordionItem } from "@/components/ui/accordion";
import { FadeIn } from "@/components/animations/motion-components";
import { faqs, faqCategories } from "@/data/faq";
export function FAQContent() {
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => {
    if (category === "All") return faqs;
    return faqs.filter((f) => f.category === category);
  }, [category]);
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        description="Find answers to common questions about HIMU Pharmacy, our products, and services."
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&h=600&fit=crop"
        badge="FAQ"
      />
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {faqCategories.map((cat) => (
              <button
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filtered.map((faq, i) => (
              <FadeIn delay={i * 0.03}>
                <AccordionItem title={faq.question}>{faq.answer}</AccordionItem>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
