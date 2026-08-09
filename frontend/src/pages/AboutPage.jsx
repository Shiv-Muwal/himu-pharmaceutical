import { Image } from "@/components/ui/image";
import {
  FadeIn,
  SectionHeading,
} from "@/components/animations/motion-components";
import { Card } from "@/components/ui/card";
import { teamMembers, coreValues, chairman } from "@/data/company";
import { Target, Eye, Heart } from "lucide-react";
import {
  BrandStoryHero,
  StatsSection,
  WhyChooseSection,
} from "@/components/sections/home-sections";

export default function AboutPage() {
  return (
    <>
      <BrandStoryHero />
      <StatsSection />
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
                  lives worldwide
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
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-emerald">
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
                  <h3 className="mb-2 text-lg font-bold text-emerald">
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

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading badge="Chairman" title="Message from the Chairman" />
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <FadeIn direction="left">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-3xl shadow-xl">
                <Image
                  src={chairman.image}
                  alt={chairman.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div className="space-y-5">
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald">
                    {chairman.role}
                  </p>
                  <h3 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-foreground md:text-4xl">
                    {chairman.name}
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                  {chairman.bio}
                </p>
                <ul className="space-y-3">
                  {chairman.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-muted-foreground md:text-base"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="border-l-2 border-emerald/40 pl-4 text-sm italic text-muted-foreground">
                  “At HIMU, every formulation begins with one promise — healthcare
                  that uplifts lives with integrity, science, and care.”
                </p>
              </div>
            </FadeIn>
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
                    <p className="mb-2 text-sm font-medium text-emerald">
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
          <SectionHeading badge="CSR" title="Corporate Responsibility" />
          <FadeIn>
            <Card className="p-8 md:p-12">
              <p className="mb-4 leading-relaxed text-muted-foreground">
                HIMU Pharmacy is deeply committed to corporate social
                responsibility. Our initiatives include free health camps in
                underserved communities, medicine donations during emergencies,
                environmental sustainability programs, and educational
                scholarships for pharmacy students
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
