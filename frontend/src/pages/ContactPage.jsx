import { Mail, Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { Link } from "@/components/ui/link";
import { PageHero } from "@/components/sections/page-hero";
import { FadeIn } from "@/components/animations/motion-components";
import { ContactForm } from "@/components/forms/contact-form";
import { COMPANY } from "@/lib/constants";

const MAP_QUERY = encodeURIComponent(
  "38 Ambikanagar, Mandrela Road, Chirawa, Dist. Jhunjhunu, Rajasthan 333026",
);
const MAP_EMBED = `https://maps.google.com/maps?q=${MAP_QUERY}&z=15&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;

const contactCards = [
  {
    icon: MapPin,
    title: "Visit us",
    value: COMPANY.address,
    href: MAP_LINK,
    external: true,
  },
  {
    icon: Phone,
    title: "Call us",
    value: COMPANY.phone,
    href: `tel:${COMPANY.phone.replace(/\s+/g, "")}`,
  },
  {
    icon: Mail,
    title: "Email us",
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
  },
  {
    icon: Clock,
    title: "Support hours",
    value: COMPANY.officeHours,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        description="Questions, partnerships, or order help — we are here 24/7."
        image="/banners/contact-hero.png"
        badge="Get In Touch"
      />

      <section className="section-padding bg-gradient-to-b from-[#f8f3e6] via-white to-[#f3f7f0]">
        <div className="container-custom">
          <div className="mb-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {contactCards.map((item, i) => {
              const Icon = item.icon;
              const inner = (
                <>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#BBF7D0] text-emerald">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald/70">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-foreground">
                    {item.value}
                  </p>
                  {item.href ? (
                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-emerald opacity-0 transition group-hover:opacity-100">
                      Open <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  ) : null}
                </>
              );

              return (
                <FadeIn key={item.title} delay={i * 0.06}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                      className="group block h-full rounded-[1.5rem] border border-border/40 bg-white/90 p-5 shadow-[0_12px_40px_rgba(20,83,45,0.06)] transition hover:-translate-y-1 hover:border-emerald/25 hover:shadow-[0_18px_44px_rgba(20,83,45,0.1)]"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="h-full rounded-[1.5rem] border border-border/40 bg-white/90 p-5 shadow-[0_12px_40px_rgba(20,83,45,0.06)]">
                      {inner}
                    </div>
                  )}
                </FadeIn>
              );
            })}
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
            <FadeIn direction="left" className="lg:col-span-5">
              <div className="overflow-hidden rounded-[1.75rem] border border-border/40 bg-white shadow-[0_20px_50px_rgba(20,83,45,0.08)]">
                <div className="border-b border-border/30 bg-[#f3f7f0] px-6 py-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald">
                    Location
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground">
                    Find us on the map
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {COMPANY.address}
                  </p>
                </div>
                <div className="relative h-[280px] bg-[#eef4f0] sm:h-[360px] lg:h-[420px]">
                  <iframe
                    title="HIMU Pharmacy location map"
                    src={MAP_EMBED}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                  <p className="text-xs text-muted-foreground">
                    Open directions in Google Maps
                  </p>
                  <a
                    href={MAP_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#14532D]"
                  >
                    Get directions <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" className="lg:col-span-7">
              <div className="rounded-[1.75rem] border border-border/40 bg-white p-6 shadow-[0_20px_50px_rgba(20,83,45,0.08)] sm:p-8 md:p-10">
                <div className="mb-8 max-w-xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald">
                    Message
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-heading)] text-3xl font-bold text-foreground md:text-4xl">
                    Send us a message
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    Share your inquiry and our team will get back to you. For
                    faster help, call{" "}
                    <a
                      href={`tel:${COMPANY.phone.replace(/\s+/g, "")}`}
                      className="font-semibold text-emerald hover:underline"
                    >
                      {COMPANY.phone}
                    </a>
                    .
                  </p>
                </div>
                <ContactForm />
                <p className="mt-6 text-center text-[11px] text-muted-foreground sm:text-left">
                  By sending this form you agree to our{" "}
                  <Link href="/terms" className="font-semibold text-emerald hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-semibold text-emerald hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
