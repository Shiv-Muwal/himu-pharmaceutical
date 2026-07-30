import { Image } from "@/components/ui/image";
import { PageHero } from "@/components/sections/page-hero";
import {
  FadeIn,
  SectionHeading,
} from "@/components/animations/motion-components";
import { InteractiveTimeline } from "@/components/sections/timeline";
import { Card } from "@/components/ui/card";
import { teamMembers, companyTimeline, coreValues } from "@/data/company";
import { Target, Eye, Heart } from "lucide-react";
export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About HIMU Pharmacy"
        description="Healthcare Innovation for Medical Upliftment — advancing global healthcare since 2004."
        image="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600&h=600&fit=crop"
        badge="Our Story"
      />
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <SectionHeading
                badge="Company Story"
                title="Our Journey"
                centered={false}
              />
              <div className="prose-custom">
                <p>
                  Founded in 2004 in Noida, India, HIMU Pharmacy began with a
                  singular vision: to make quality healthcare accessible through
                  innovation and excellence. What started as a single
                  manufacturing facility has evolved into a global
                  pharmaceutical enterprise.
                </p>
                <p>
                  Today, we manufacture over 500 medicines, employ 100+ research
                  scientists, and serve healthcare providers across 50+
                  countries. Our name — Healthcare Innovation for Medical
                  Upliftment — encapsulates our enduring commitment to improving
                  lives worldwide.
                </p>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
                  alt="HIMU manufacturing"
                  fill
                  className="object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      <section className="section-padding bg-muted/30">
        <div className="container-custom grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Mission",
              text: "To advance global healthcare through innovative pharmaceutical solutions that improve patient outcomes and enhance quality of life.",
            },
            {
              icon: Eye,
              title: "Vision",
              text: "To be the most trusted pharmaceutical partner worldwide, recognized for scientific excellence, quality manufacturing, and compassionate healthcare.",
            },
            {
              icon: Heart,
              title: "Purpose",
              text: "Every medicine we create is a step toward medical upliftment — bridging the gap between scientific innovation and patient care.",
            },
          ].map((item, i) => (
            <FadeIn delay={i * 0.1}>
              <Card className="p-8 h-full text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading badge="Core Values" title="What We Stand For" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((v, i) => (
              <FadeIn delay={i * 0.08}>
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-lg text-primary mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {v.description}
                  </p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <SectionHeading badge="Leadership" title="Our Leadership Team" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <FadeIn delay={i * 0.08}>
                <Card className="overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-primary text-sm font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            badge="Infrastructure"
            title="Manufacturing & Research Facilities"
          />
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
                title: "Manufacturing Plant — Noida",
              },
              {
                src: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop",
                title: "R&D Laboratory — Noida",
              },
              {
                src: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=600&h=400&fit=crop",
                title: "Production Line — Hyderabad",
              },
              {
                src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
                title: "Quality Control Lab — Ahmedabad",
              },
            ].map((img, i) => (
              <FadeIn delay={i * 0.08}>
                <div className="relative h-56 rounded-2xl overflow-hidden shadow-lg group">
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                    <h3 className="text-white font-bold">{img.title}</h3>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <SectionHeading badge="Timeline" title="Company Milestones" />
          <InteractiveTimeline events={companyTimeline} />
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading badge="CSR" title="Corporate Responsibility" />
          <FadeIn>
            <Card className="p-8 md:p-12">
              <p className="text-muted-foreground leading-relaxed mb-4">
                HIMU Pharmacy is deeply committed to corporate social
                responsibility. Our initiatives include free health camps in
                underserved communities, medicine donations during emergencies,
                environmental sustainability programs, and educational
                scholarships for pharmacy students.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                In 2025 alone, our CSR programs reached over 200,000
                beneficiaries across 15 states in India, reinforcing our belief
                that quality healthcare is a fundamental human right.
              </p>
            </Card>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
