import { PageHero } from "@/components/sections/Page-hero";
import {
  FadeIn,
  SectionHeading,
} from "@/components/animations/Motion-components";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CareerApplicationForm } from "@/components/forms/Contact-form";
import { jobOpenings } from "@/data/company";
import { Heart, GraduationCap, Users, TrendingUp } from "lucide-react";
const benefits = [
  {
    icon: Heart,
    title: "Health Insurance",
    description: "Comprehensive medical coverage for employees and dependents.",
  },
  {
    icon: GraduationCap,
    title: "Learning & Development",
    description:
      "Continuous training, conferences, and higher education support.",
  },
  {
    icon: Users,
    title: "Collaborative Culture",
    description:
      "Cross-functional teams fostering innovation and mutual growth.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Clear progression paths with mentorship and leadership programs.",
  },
];
export default function CareersPage() {
  return (
    <>
      <PageHero
        title="Build Your Career at HIMU"
        description="Join a team of passionate professionals advancing healthcare innovation worldwide."
        image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1600&h=600&fit=crop"
        badge="Careers"
      />
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            badge="Why Join"
            title="Why Work at HIMU Pharmacy"
            description="Be part of a company that values innovation, quality, and people."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <FadeIn delay={i * 0.08}>
                <Card className="p-6 text-center h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-4">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {b.description}
                  </p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <SectionHeading badge="Open Positions" title="Current Openings" />
          <div className="space-y-4 mb-12">
            {jobOpenings.map((job, i) => (
              <FadeIn delay={i * 0.05}>
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{job.department}</Badge>
                      <Badge variant="outline">{job.location}</Badge>
                      <Badge variant="gold">{job.type}</Badge>
                    </div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-custom max-w-2xl">
          <SectionHeading badge="Apply" title="Submit Your Application" />
          <FadeIn>
            <Card className="p-8">
              <CareerApplicationForm
                positions={jobOpenings.map((j) => j.title)}
              />
            </Card>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
