import { PageHero } from "@/components/sections/page-hero";
import { FadeIn } from "@/components/animations/motion-components";
import { Card } from "@/components/ui/card";
import { PRODUCT_DISCLAIMER, COMPANY } from "@/lib/constants";
export default function DisclaimerPage() {
  return (
    <>
      <PageHero
        title="Disclaimer"
        description="Important information about this website and its content."
        badge="Legal"
      />
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <FadeIn>
            <Card className="p-8 md:p-12 prose-custom">
              <h2>General Disclaimer</h2>
              <p>{PRODUCT_DISCLAIMER}</p>
              <h2>Medical Information</h2>
              <p>
                The medical and pharmaceutical information provided on this
                website is for general educational purposes only. It should not
                be used for diagnosing or treating health problems or diseases.
                Always seek the advice of a qualified healthcare provider with
                any questions regarding a medical condition.
              </p>
              <h2>Demo Content</h2>
              <p>
                All product names, compositions, images, certificates, license
                numbers ({COMPANY.licenseNumber}), CIN numbers (
                {COMPANY.cinNumber}), and company details displayed on this
                website are dummy/demo content created for website demonstration
                purposes only.
              </p>
              <h2>No Online Sales</h2>
              <p>
                {COMPANY.name} does not sell medicines online through this
                website. Product listings are for informational purposes only.
                To obtain medicines, please visit a licensed pharmacy with a
                valid prescription from a healthcare professional.
              </p>
              <h2>External Links</h2>
              <p>
                This website may contain links to external websites. We are not
                responsible for the content or privacy practices of linked
                sites.
              </p>
            </Card>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
