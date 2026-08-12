import { Image } from "@/components/ui/image";
import {
  FadeIn,
  SectionHeading,
} from "@/components/animations/motion-components";
import { Card } from "@/components/ui/card";
import { coreValues, chairman } from "@/data/company";
import { Target, Eye, Heart } from "lucide-react";
import {
  BrandStoryHero,
  WhyChooseSection,
} from "@/components/sections/home-sections";

export default function AboutPage() {
  return (
    <>
      <BrandStoryHero />
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
          <SectionHeading
            badge="Chairperson"
            title="Message from the Chairperson"
          />
          <div className="grid items-start gap-8 md:gap-10 lg:grid-cols-12 lg:gap-12">
            <FadeIn direction="left" className="lg:col-span-5">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[600px] xl:h-[640px] overflow-hidden rounded-3xl shadow-2xl border border-emerald/20 lg:sticky lg:top-28">
                <Image
                  src={chairman.image}
                  alt={chairman.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
                  <p className="font-[family-name:var(--font-heading)] text-xl font-bold">
                    {chairman.name}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    {chairman.role}, Himu Pharmaceutical
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" className="lg:col-span-7">
              <div className="space-y-6">
                <div>
                  <span className="inline-block rounded-full bg-emerald/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald">
                    {chairman.role}
                  </span>
                  <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                    {chairman.name}
                  </h3>
                  <p className="mt-2 text-base font-semibold leading-snug text-[#14532D] md:text-lg">
                    {chairman.headline}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {chairman.intro}
                </p>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground md:text-base">
                    {chairman.pillarsIntro}
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
                    {chairman.pillars.map((pillar) => (
                      <div
                        key={pillar.title}
                        className="rounded-2xl border border-emerald/15 bg-emerald/[0.03] p-4 transition-colors hover:border-emerald/35 hover:bg-emerald/[0.06]"
                      >
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald" />
                          <p className="text-sm font-bold text-[#14532D]">
                            {pillar.title}
                          </p>
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                          {pillar.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border-l-4 border-emerald bg-muted/40 p-4 sm:p-5">
                  <p className="text-sm italic leading-relaxed text-foreground sm:text-base">
                    “{chairman.quote}”
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {chairman.closing}
                </p>

                <div className="border-t border-border/60 pt-4">
                  <p className="text-xs text-muted-foreground">{chairman.signOff}</p>
                  <p className="mt-1 font-[family-name:var(--font-heading)] text-lg font-bold text-[#14532D]">
                    {chairman.name}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald">
                    {chairman.role}, Himu Pharmaceutical
                  </p>
                </div>
              </div>
            </FadeIn>
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
