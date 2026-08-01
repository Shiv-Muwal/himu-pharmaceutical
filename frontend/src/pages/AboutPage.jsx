import { Image } from "@/components/ui/Image";
import {
  FadeIn,
  SectionHeading,
} from "@/components/animations/Motion-components";
import { InteractiveTimeline } from "@/components/sections/Timeline";
import { Card } from "@/components/ui/Card";
import { teamMembers, companyTimeline, coreValues } from "@/data/company";
import { Target, Eye, Heart } from "lucide-react";
import {
  BrandStoryHero,
  OverviewSection,
  StatsSection,
  WhyChooseSection,
} from "@/components/sections/Home-sections";

export default function AboutPage() {
  return (
    <>
      <BrandStoryHero />
      <StatsSection />
      <OverviewSection />
      <WhyChooseSection />

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2">
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
              <div className="relative h-80 overflow-hidden rounded-2xl shadow-xl">
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
        <div className="container-custom grid gap-8 md:grid-cols-3">
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
            <FadeIn key={item.title} delay={i * 0.1}>
              <Card className="h-full p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.08}>
                <Card className="p-6 transition-shadow hover:shadow-lg">
                  <h3 className="mb-2 text-lg font-bold text-primary">
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
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, i) => (
              <FadeIn key={member.name} delay={i * 0.08}>
                <Card className="group overflow-hidden transition-shadow hover:shadow-xl">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="mb-2 text-sm font-medium text-primary">
                      {member.role}
                    </p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
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
          <div className="mb-12 grid gap-6 md:grid-cols-2">
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
              <FadeIn key={img.title} delay={i * 0.08}>
                <div className="group relative h-56 overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/60 to-transparent p-5">
                    <h3 className="font-bold text-white">{img.title}</h3>
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
              <p className="mb-4 leading-relaxed text-muted-foreground">
                HIMU Pharmacy is deeply committed to corporate social
                responsibility. Our initiatives include free health camps in
                underserved communities, medicine donations during emergencies,
                environmental sustainability programs, and educational
                scholarships for pharmacy students.
              </p>
              <p className="leading-relaxed text-muted-foreground">
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
