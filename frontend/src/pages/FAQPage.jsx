import { FAQContent } from "@/components/sections/faq-content";
import { faqs } from "@/data/faq";
import { generateFaqSchema } from "@/lib/seo";
import { SeoJsonLd } from "@/components/seo/seo-json-ld";

export default function FAQPage() {
  return (
    <>
      <SeoJsonLd id="faq" data={generateFaqSchema(faqs)} />
      <FAQContent />
    </>
  );
}
