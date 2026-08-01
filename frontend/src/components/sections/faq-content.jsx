import { useMemo, useState } from "react";
import { PageHero } from "@/components/sections/page-hero";
import { AccordionItem } from "@/components/ui/accordion";
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
        compact
        title="Frequently Asked Questions"
        description="Quick answers about HIMU products, orders, and care."
        badge="FAQ"
      />
      <section className="section-padding pt-5 sm:pt-8">
        <div className="container-custom max-w-3xl">
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="space-y-2.5">
            {filtered.map((faq) => (
              <AccordionItem key={faq.id} title={faq.question}>
                {faq.answer}
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
