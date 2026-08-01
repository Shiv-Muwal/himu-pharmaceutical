import { PageHero } from "@/components/sections/page-hero";
import { FadeIn } from "@/components/animations/Motion-components";
import { Card } from "@/components/ui/Card";
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
              <p>Last updated: July 2026</p>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the {COMPANY.name} website (
                {COMPANY.url}), you agree to be bound by these Terms &amp;
                Conditions and our Privacy Policy. If you do not agree with any
                part of these terms, please do not use this website.
              </p>

              <h2>2. About This Website</h2>
              <p>
                {COMPANY.name} ({COMPANY.fullForm}) is a{" "}
                {COMPANY.type.toLowerCase()}. This website is provided for
                general information about our company, products, manufacturing,
                quality practices, research, careers, and related services. It is
                not an online pharmacy and does not sell medicines directly to
                consumers.
              </p>

              <h2>3. Eligibility</h2>
              <p>
                You must be at least 18 years of age, or the age of legal
                majority in your jurisdiction, to use this website or submit
                inquiries, applications, or other information through it. By
                using the site, you confirm that you meet this requirement.
              </p>

              <h2>4. Informational Use Only</h2>
              <p>
                Content on this website — including product descriptions,
                compositions, dosages, and health-related information — is for
                educational and informational purposes only. It does not
                constitute medical advice, diagnosis, or treatment, and should
                not replace consultation with a qualified healthcare
                professional. Always seek professional medical advice before
                using any medication.
              </p>

              <h2>5. No Online Sales</h2>
              <p>
                {COMPANY.name} does not sell medicines or pharmaceutical
                products through this website. Product listings are
                informational only. Medicines must be obtained through licensed
                pharmacies or authorised channels with a valid prescription where
                required by law.
              </p>

              <h2>6. User Submissions</h2>
              <p>
                When you submit information through contact forms, career
                applications, newsletter sign-ups, or similar features, you
                agree to provide accurate and complete details. You grant{" "}
                {COMPANY.name} permission to use that information to respond to
                your request and as described in our Privacy Policy. You must
                not submit unlawful, misleading, or harmful content.
              </p>

              <h2>7. Intellectual Property</h2>
              <p>
                All content on this website — including text, graphics, logos,
                images, product names, layout, and design — is owned by{" "}
                {COMPANY.name} or its licensors and is protected by applicable
                intellectual property laws. You may view and print pages for
                personal, non-commercial use only. You may not copy, modify,
                distribute, republish, or commercially exploit any content
                without our prior written consent.
              </p>

              <h2>8. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>
                  Use the website for any unlawful purpose or in violation of
                  applicable laws
                </li>
                <li>
                  Attempt to gain unauthorised access to our systems, accounts,
                  or data
                </li>
                <li>
                  Interfere with the security, integrity, or performance of the
                  website
                </li>
                <li>
                  Scrape, harvest, or systematically extract content without
                  permission
                </li>
                <li>
                  Transmit malware, spam, or other harmful material through the
                  site
                </li>
                <li>
                  Misrepresent your identity or affiliation when contacting us
                </li>
              </ul>

              <h2>9. Accuracy of Information</h2>
              <p>
                We strive to keep website content accurate and up to date.
                However, product details, certificates, license numbers, and
                other information may change without notice. Some content on this
                site may be demonstrative or illustrative. We do not warrant that
                all information is complete, current, or error-free. Always
                verify critical details through official channels before relying
                on them.
              </p>

              <h2>10. Third-Party Links</h2>
              <p>
                This website may include links to third-party websites or
                resources. These links are provided for convenience only.{" "}
                {COMPANY.name} does not control, endorse, or assume
                responsibility for the content, privacy practices, or
                availability of any third-party sites.
              </p>

              <h2>11. Disclaimer of Warranties</h2>
              <p>
                This website and its content are provided on an &quot;as
                is&quot; and &quot;as available&quot; basis without warranties
                of any kind, whether express or implied, including but not
                limited to merchantability, fitness for a particular purpose,
                and non-infringement. We do not warrant that the website will be
                uninterrupted, secure, or free from errors or viruses.
              </p>

              <h2>12. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, {COMPANY.name} and its
                directors, employees, and agents shall not be liable for any
                direct, indirect, incidental, special, consequential, or
                punitive damages arising from your access to or use of (or
                inability to use) this website or any content on it, including
                reliance on any product or medical information presented here.
              </p>

              <h2>13. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless {COMPANY.name} and its
                officers, employees, and agents from any claims, losses,
                damages, liabilities, and expenses (including reasonable legal
                fees) arising out of your use of the website, your violation of
                these terms, or your infringement of any third-party rights.
              </p>

              <h2>14. Changes to These Terms</h2>
              <p>
                We may update these Terms &amp; Conditions at any time. Changes
                will be posted on this page with an updated &quot;Last
                updated&quot; date. Continued use of the website after changes
                are posted constitutes acceptance of the revised terms. We
                encourage you to review this page periodically.
              </p>

              <h2>15. Governing Law</h2>
              <p>
                These terms are governed by the laws of India. Any disputes
                arising from these terms or your use of the website shall be
                subject to the exclusive jurisdiction of the courts in Noida,
                Uttar Pradesh, India.
              </p>

              <h2>16. Contact Us</h2>
              <p>
                For questions about these Terms &amp; Conditions, contact us at:
              </p>
              <ul>
                <li>Email: {COMPANY.email}</li>
                <li>Phone: {COMPANY.phone}</li>
                <li>Address: {COMPANY.address}</li>
              </ul>
            </Card>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
