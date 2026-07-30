import { Image } from "@/components/ui/image";
import { PageHero } from "@/components/sections/page-hero";
import {
  FadeIn,
  SectionHeading,
} from "@/components/animations/motion-components";
import { InteractiveTimeline } from "@/components/sections/timeline";
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
const mfgTimeline = [
  {
    year: "2008",
    title: "First GMP Plant",
    description: "Commissioned WHO-GMP certified facility in Noida.",
  },
  {
    year: "2014",
    title: "Hyderabad Expansion",
    description:
      "Second plant with injectable and liquid formulation capabilities.",
  },
  {
    year: "2019",
    title: "Automation Upgrade",
    description:
      "Implemented Industry 4.0 automation across all production lines.",
  },
  {
    year: "2022",
    title: "Third Facility",
    description: "Ahmedabad plant for dermatology and cosmetic manufacturing.",
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
              <FadeIn delay={i * 0.08}>
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
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
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <SectionHeading badge="Gallery" title="Plant Gallery" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
                title: "Tablet Production Line",
              },
              {
                src: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&h=400&fit=crop",
                title: "Capsule Filling Unit",
              },
              {
                src: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=600&h=400&fit=crop",
                title: "Sterile Injectable Area",
              },
              {
                src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
                title: "Quality Control Lab",
              },
              {
                src: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop",
                title: "Packaging Department",
              },
              {
                src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
                title: "Warehouse & Logistics",
              },
            ].map((img, i) => (
              <FadeIn delay={i * 0.08}>
                <div className="relative h-52 rounded-2xl overflow-hidden shadow-lg group">
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <h3 className="text-white font-semibold text-sm">
                      {img.title}
                    </h3>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading badge="Timeline" title="Manufacturing Milestones" />
          <InteractiveTimeline events={mfgTimeline} />
        </div>
      </section>
    </>
  );
}
