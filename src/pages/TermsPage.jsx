import { PageHero } from "@/components/sections/page-hero";
import { FadeIn } from "@/components/animations/motion-components";
import { Card } from "@/components/ui/card";
import { COMPANY } from "@/lib/constants";
export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms & Conditions"
        description="Please read these terms carefully before using our website."
        badge="Legal"
      />
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <FadeIn>
            <Card className="p-8 md:p-12 prose-custom">
              <p>Last updated: January 2025</p>
              <h2>Acceptance of Terms</h2>
              <p>
                By accessing and using the {COMPANY.name} website, you accept
                and agree to be bound by these Terms and Conditions. If you do
                not agree, please do not use this website.
              </p>
              <h2>Use of Website</h2>
              <p>
                This website is provided for informational purposes only. It
                does not constitute medical advice, and no medicines are sold
                through this website.
              </p>
              <h2>Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos,
                and images, is the property of {COMPANY.name} or its content
                suppliers and is protected by intellectual property laws.
              </p>
              <h2>Disclaimer of Warranties</h2>
              <p>
                This website and its content are provided "as is" without
                warranties of any kind. We do not warrant that the website will
                be uninterrupted or error-free.
              </p>
              <h2>Limitation of Liability</h2>
              <p>
                {COMPANY.name} shall not be liable for any direct, indirect,
                incidental, or consequential damages arising from your use of
                this website.
              </p>
              <h2>Governing Law</h2>
              <p>
                These terms shall be governed by the laws of India. Any disputes
                shall be subject to the exclusive jurisdiction of courts in
                Noida, Uttar Pradesh.
              </p>
            </Card>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
