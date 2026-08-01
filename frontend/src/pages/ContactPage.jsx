import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/sections/Page-hero";
import {
  FadeIn,
  SectionHeading,
} from "@/components/animations/Motion-components";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/forms/Contact-form";
import { COMPANY } from "@/lib/constants";
const departments = [
  {
    name: "General Inquiry",
    email: "info@himupharmacy.com",
  },
  {
    name: "Sales & Distribution",
    email: "sales@himupharmacy.com",
  },
  {
    name: "Research & Development",
    email: "research@himupharmacy.com",
  },
  {
    name: "Quality Assurance",
    email: "quality@himupharmacy.com",
  },
  {
    name: "Human Resources",
    email: "careers@himupharmacy.com",
  },
  {
    name: "Pharmacovigilance",
    email: "pv@himupharmacy.com",
  },
];
export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        description="We'd love to hear from you. Reach out for inquiries, partnerships, or support."
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&h=600&fit=crop"
        badge="Get In Touch"
      />
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: MapPin,
                title: "Address",
                value: COMPANY.address,
              },
              {
                icon: Phone,
                title: "Phone",
                value: COMPANY.phone,
              },
              {
                icon: Mail,
                title: "Email",
                value: COMPANY.email,
              },
              {
                icon: Clock,
                title: "Office Hours",
                value: COMPANY.officeHours,
              },
            ].map((item, i) => (
              <FadeIn delay={i * 0.08}>
                <Card className="p-6 text-center h-full">
                  <item.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <FadeIn direction="left">
              <SectionHeading
                badge="Message"
                title="Send Us a Message"
                centered={false}
              />
              <Card className="p-8">
                <ContactForm />
              </Card>
            </FadeIn>
            <FadeIn direction="right">
              <SectionHeading
                badge="Departments"
                title="Department Contacts"
                centered={false}
              />
              <div className="space-y-3 mb-8">
                {departments.map((dept) => (
                  <Card className="p-4 flex justify-between items-center">
                    <span className="font-medium text-sm">{dept.name}</span>
                    <a
                      href={`mailto:${dept.email}`}
                      className="text-primary text-sm hover:underline"
                    >
                      {dept.email}
                    </a>
                  </Card>
                ))}
              </div>
              <SectionHeading
                badge="Location"
                title="Find Us"
                centered={false}
                className="mb-4"
              />
              <Card className="overflow-hidden">
                <div className="h-64 bg-muted flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className="font-semibold mb-1">
                      Google Maps Placeholder
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {COMPANY.address}
                    </p>
                  </div>
                </div>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
