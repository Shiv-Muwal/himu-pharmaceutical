import { PageHero } from "@/components/sections/page-hero";
import {
  FadeIn,
  SectionHeading,
} from "@/components/animations/motion-components";
import { Card } from "@/components/ui/card";
import { Cog, Package, Warehouse, Globe, Truck } from "lucide-react";
const processes = [
  {
    icon: Cog,
    title: "Production Lines",
    description:
      "Automated tablet, capsule, and injectable production lines with real-time monitoring.",
  },
  {
    icon: Package,
    title: "Packaging",
    description:
      "Blister packing, bottle filling, and sterile vial packaging with serialization.",
  },
  {
    icon: Warehouse,
    title: "Warehouse",
    description:
      "Temperature-controlled warehousing with FIFO inventory management systems.",
  },
  {
    icon: Globe,
    title: "Export Capabilities",
    description:
      "Regulatory-compliant export to 50+ countries with complete documentation.",
  },
  {
    icon: Truck,
    title: "Supply Chain",
    description:
      "Integrated supply chain from raw material sourcing to final delivery.",
  },
];
export default function ManufacturingPage() {
  return (
    <>
      <PageHero
        title="Manufacturing Excellence"
        description="World-class pharmaceutical manufacturing with WHO-GMP certified facilities and advanced automation."
        image="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600&h=600&fit=crop"
        badge="Production"
      />
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            badge="Process"
            title="Manufacturing Process"
            description="From raw material to finished product, every step is meticulously controlled."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {processes.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.08}>
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-ink-accent mb-4">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {p.description}
                  </p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
