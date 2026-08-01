import { PageHero } from "@/components/sections/page-hero";
import { FadeIn } from "@/components/animations/motion-components";
import { Card } from "@/components/ui/card";
import { COMPANY } from "@/lib/constants";
export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        description="How we collect, use, and protect your information."
        badge="Legal"
      />
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <FadeIn>
            <Card className="p-8 md:p-12 prose-custom">
              <p>Last updated: January 2025</p>
              <h2>Introduction</h2>
              <p>
                {COMPANY.name} ("we," "our," or "us") is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our
                website.
              </p>
              <h2>Information We Collect</h2>
              <p>
                We may collect personal information that you voluntarily provide
                when filling out contact forms, subscribing to newsletters, or
                submitting job applications. This may include your name, email
                address, phone number, and message content.
              </p>
              <h2>How We Use Your Information</h2>
              <ul>
                <li>
                  To respond to your inquiries and provide customer support
                </li>
                <li>
                  To send newsletters and marketing communications (with your
                  consent)
                </li>
                <li>To process job applications</li>
                <li>To improve our website and services</li>
                <li>To comply with legal obligations</li>
              </ul>
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
              <h2>Cookies</h2>
              <p>
                Our website uses cookies to enhance your browsing experience.
                You can control cookie preferences through your browser settings
                or our cookie banner.
              </p>
              <h2>Contact Us</h2>
              <p>
                For privacy-related inquiries, contact us at {COMPANY.email}.
              </p>
            </Card>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
