import { Image } from "@/components/ui/image";
import { Download } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import {
  FadeIn,
  SectionHeading,
} from "@/components/animations/motion-components";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { certifications } from "@/data/company";
import { COMPANY } from "@/lib/constants";
export default function CertificationsPage() {
  return (
    <>
      <PageHero
        title="Certifications & Licenses"
        description="Internationally recognized certifications demonstrating our commitment to quality and compliance."
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&h=600&fit=crop"
        badge="Compliance"
      />
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <FadeIn>
              <Card className="p-8 text-center">
                <h3 className="font-bold text-lg text-primary mb-2">
                  License Number
                </h3>
                <p className="text-2xl font-mono font-bold">
                  {COMPANY.licenseNumber}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  (Demo Value)
                </p>
              </Card>
            </FadeIn>
            <FadeIn delay={0.1}>
              <Card className="p-8 text-center">
                <h3 className="font-bold text-lg text-primary mb-2">
                  CIN Number
                </h3>
                <p className="text-2xl font-mono font-bold">
                  {COMPANY.cinNumber}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  (Demo Value)
                </p>
              </Card>
            </FadeIn>
          </div>
          <SectionHeading badge="Certificates" title="Certificate Gallery" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {certifications.map((cert, i) => (
              <FadeIn delay={i * 0.08}>
                <Card className="overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={cert.image}
                      alt={cert.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-1">{cert.name}</h3>
                    <p className="text-sm text-primary font-medium mb-2">
                      {cert.issuer} · {cert.year}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {cert.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4" /> Download Certificate
                    </Button>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
