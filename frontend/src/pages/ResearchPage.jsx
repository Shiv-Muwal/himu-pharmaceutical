import { Image } from "@/components/ui/image";
import { PageHero } from "@/components/sections/page-hero";
import {
  FadeIn,
  SectionHeading,
  AnimatedCounter,
} from "@/components/animations/motion-components";
import { InteractiveTimeline } from "@/components/sections/timeline";
import { Card } from "@/components/ui/card";
import { Microscope, FlaskConical, Brain, TestTube } from "lucide-react";
const researchStats = [
  {
    label: "Research Scientists",
    value: 100,
    suffix: "+",
  },
  {
    label: "Active Projects",
    value: 45,
    suffix: "+",
  },
  {
    label: "Patents Filed",
    value: 20,
    suffix: "+",
  },
  {
    label: "Publications",
    value: 150,
    suffix: "+",
  },
];
const researchTimeline = [
  {
    year: "2016",
    title: "R&D Center Inauguration",
    description:
      "Opened 50,000 sq. ft. research facility with advanced analytical instrumentation.",
  },
  {
    year: "2018",
    title: "Bioequivalence Lab",
    description:
      "Established dedicated BE/BA study center for generic drug development.",
  },
  {
    year: "2020",
    title: "Nano-Delivery Research",
    description:
      "Launched nano-emulsion and liposomal delivery system research program.",
  },
  {
    year: "2023",
    title: "AI-Driven Formulation",
    description:
      "Integrated AI and machine learning for predictive formulation development.",
  },
  {
    year: "2025",
    title: "Innovation Hub",
    description:
      "Launched integrated innovation hub combining R&D, clinical trials, and digital health.",
  },
];
const workflow = [
  {
    icon: Brain,
    title: "Discovery",
    description:
      "Identifying therapeutic targets and novel compound screening.",
  },
  {
    icon: FlaskConical,
    title: "Formulation",
    description:
      "Developing optimized dosage forms with enhanced bioavailability.",
  },
  {
    icon: TestTube,
    title: "Preclinical",
    description:
      "Rigorous testing for safety, efficacy, and stability profiles.",
  },
  {
    icon: Microscope,
    title: "Clinical",
    description:
      "Phase I-III trials ensuring regulatory compliance and patient safety.",
  },
];
export default function ResearchPage() {
  return (
    <>
      <PageHero
        title="Research & Development"
        description="Pioneering pharmaceutical innovation through cutting-edge science and collaborative research."
        image="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600&h=600&fit=crop"
        badge="Innovation"
      />
      <section className="section-padding bg-primary">
        <div className="container-custom grid grid-cols-2 lg:grid-cols-4 gap-8">
          {researchStats.map((stat, i) => (
            <FadeIn delay={i * 0.1}>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary-foreground">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-primary-foreground/70 text-sm mt-1">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            badge="Research Workflow"
            title="From Discovery to Delivery"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflow.map((step, i) => (
              <FadeIn delay={i * 0.1}>
                <Card className="p-6 text-center h-full relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-4 mt-2">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <SectionHeading
            badge="Laboratories"
            title="State-of-the-Art Research Facilities"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop",
              "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
            ].map((src, i) => (
              <FadeIn delay={i * 0.1}>
                <div className="relative h-56 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={src}
                    alt={`Research laboratory ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading badge="Timeline" title="Research Milestones" />
          <InteractiveTimeline events={researchTimeline} />
        </div>
      </section>
    </>
  );
}
