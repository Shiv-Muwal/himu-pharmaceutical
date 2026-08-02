import { PageHero } from "@/components/sections/page-hero";
import {
  FadeIn,
  SectionHeading,
} from "@/components/animations/motion-components";
import { Card } from "@/components/ui/card";
import { Shield, CheckCircle, Award } from "lucide-react";
const standards = [
  {
    name: "WHO-GMP",
    description:
      "World Health Organization Good Manufacturing Practice guidelines.",
  },
  {
    name: "ISO 9001:2015",
    description: "International Quality Management System certification.",
  },
  {
    name: "ISO 14001:2015",
    description: "Environmental Management System for sustainable operations.",
  },
  {
    name: "FDA",
    description:
      "U.S. Food and Drug Administration facility registration and compliance.",
  },
];
const qaWorkflow = [
  {
    step: "01",
    title: "Raw Material Testing",
    description:
      "Identity, purity, and potency verification of all incoming materials.",
  },
  {
    step: "02",
    title: "In-Process Controls",
    description:
      "Real-time monitoring of critical process parameters during manufacturing.",
  },
  {
    step: "03",
    title: "Finished Product Testing",
    description:
      "Comprehensive analysis including dissolution, stability, and microbial limits.",
  },
  {
    step: "04",
    title: "Batch Release",
    description:
      "QA review and authorized person batch certification before market release.",
  },
  {
    step: "05",
    title: "Stability Monitoring",
    description:
      "Ongoing stability studies to ensure product quality throughout shelf life.",
  },
  {
    step: "06",
    title: "Pharmacovigilance",
    description:
      "Continuous post-market safety monitoring and adverse event reporting.",
  },
];
export default function QualityPage() {
  return (
    <>
      <PageHero
        title="Quality Assurance"
        description="Uncompromising quality standards at every stage of pharmaceutical manufacturing."
        image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&h=600&fit=crop"
        badge="Quality"
      />
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            badge="Standards"
            title="Quality Standards & Certifications"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((s, i) => (
              <FadeIn delay={i * 0.1}>
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <Award className="h-10 w-10 text-ink-accent mx-auto mb-3" />
                  <h3 className="font-bold text-lg mb-2">{s.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {s.description}
                  </p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <SectionHeading badge="Workflow" title="Quality Control Process" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qaWorkflow.map((item, i) => (
              <FadeIn delay={i * 0.08}>
                <Card className="p-6 relative overflow-hidden">
                  <span className="absolute top-4 right-4 text-4xl font-bold text-ink-accent/10">
                    {item.step}
                  </span>
                  <CheckCircle className="h-8 w-8 text-ink-accent mb-3" />
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <FadeIn>
            <Card className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <Shield className="h-20 w-20 text-ink-accent shrink-0" />
              <div>
                <h2 className="font-bold text-2xl mb-4">
                  Our Quality Commitment
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At HIMU Pharmacy, quality is not just a department — it is
                  embedded in our culture. Every employee, from research
                  scientists to production operators, is trained in quality
                  principles and empowered to maintain the highest standards.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our dedicated Quality Assurance team conducts over 10,000
                  tests annually, ensuring that every product reaching patients
                  meets or exceeds international pharmacopoeial standards.
                </p>
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
