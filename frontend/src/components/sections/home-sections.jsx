import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/components/ui/link";
import { Image } from "@/components/ui/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  FlaskConical,
  Shield,
  Globe,
  Heart,
  Microscope,
  Factory,
  Award,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AnimatedCounter,
  FadeIn,
  SectionHeading,
} from "@/components/animations/motion-components";
import { STATS, COMPANY } from "@/lib/constants";
import { categories } from "@/data/categories";
import { testimonials, partnerLogos } from "@/data/company";
import { blogPosts } from "@/data/blogs";
import { ProductCard } from "@/components/products/product-card";
import { products } from "@/data/products";
import { getMockProducts } from "@/lib/mock-backend";

const whyChoose = [
  {
    icon: FlaskConical,
    title: "Research Excellence",
    description:
      "100+ scientists driving breakthrough formulations and drug delivery innovations.",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description:
      "WHO-GMP, ISO, and FDA certified manufacturing with rigorous batch testing.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Serving healthcare providers and patients across 50+ countries worldwide.",
  },
  {
    icon: Heart,
    title: "Patient Centric",
    description:
      "Every product designed with patient safety, compliance, and outcomes in mind.",
  },
  {
    icon: Microscope,
    title: "Innovation Hub",
    description:
      "State-of-the-art R&D facilities with cutting-edge analytical instrumentation.",
  },
  {
    icon: Factory,
    title: "Advanced Manufacturing",
    description:
      "Automated production lines with capacity exceeding 2 billion units annually.",
  },
];

const BRAND_SUBLINES = [
  {
    id: "innovating",
    title: "Innovating Today for a Healthier Tomorrow",
    body: "Experience world-class pharmaceutical excellence with premium healthcare products, advanced research, and a commitment to quality you can trust.",
  },
  {
    id: "partner",
    title: "Your Trusted Partner in Modern Healthcare",
    body: "Explore a comprehensive range of authentic medicines and wellness solutions, backed by innovation, uncompromising quality, and patient-first care.",
  },
];

/** Brand story hero — lives on About Us (shopping home uses banner carousel). */
export function BrandStoryHero() {
  const [sublineIndex, setSublineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSublineIndex((prev) => (prev + 1) % BRAND_SUBLINES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[88svh] overflow-hidden md:min-h-[92svh]">
      <Image
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=1080&fit=crop"
        alt="HIMU healthcare professionals"
        fill
        className="object-cover object-[68%_center] sm:object-[72%_center]"
        priority
      />
      <div className="absolute inset-0 gradient-hero-mobile md:hidden" />
      <div className="absolute inset-0 hidden gradient-hero md:block" />
      <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-[#ffc5aa]/45 to-transparent md:block" />

      <div className="container-custom relative z-10 flex min-h-[88svh] items-start md:min-h-[92svh] md:items-center">
        <div className="w-full max-w-xl pt-28 pb-16 sm:pt-32 sm:pb-20 lg:max-w-3xl lg:pt-36">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-primary-foreground/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-gold backdrop-blur-sm"
          >
            About HIMU Pharmacy
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="mb-6 font-[family-name:var(--font-heading)] text-[2.1rem] font-bold leading-[1.1] tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="block">
              <span className="text-gold">H</span>ealthcare{" "}
              <span className="text-gold">I</span>nnovation
            </span>
            <span className="mt-1 block sm:mt-2">
              for <span className="text-gold">M</span>edical{" "}
              <span className="text-gold">U</span>pliftment
            </span>
          </motion.h1>

          <div className="relative mb-8 min-h-[7.5rem] max-w-lg sm:min-h-[6.75rem] lg:min-h-[7.25rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={BRAND_SUBLINES[sublineIndex].id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute inset-x-0 top-0"
              >
                <p className="mb-1.5 font-[family-name:var(--font-heading)] text-sm font-bold text-gold sm:text-base">
                  {BRAND_SUBLINES[sublineIndex].title}
                </p>
                <p className="text-sm leading-relaxed text-primary-foreground/80 sm:text-base lg:text-lg">
                  {BRAND_SUBLINES[sublineIndex].body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore Products
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact" className="group w-full sm:w-auto">
              <Button
                size="lg"
                variant="ghost"
                className="w-full border-2 border-gold/80 bg-primary-foreground/5 text-gold backdrop-blur-sm hover:border-gold hover:bg-gold hover:text-ink-accent hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255, 197, 170,0.35)] sm:w-auto"
              >
                <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                Contact Us
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 molecular-bg" />
      <div className="container-custom relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.1}>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2 font-[family-name:var(--font-heading)]">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-primary-foreground/70 text-sm md:text-base">
                  {stat.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

const OVERVIEW_PILLARS = [
  {
    icon: FlaskConical,
    title: "Clinically crafted portfolio",
    text: "Antibiotics, dermatology, skin & hair care, injectables, and wellness essentials—built for real patient outcomes.",
  },
  {
    icon: Shield,
    title: "GMP-led quality promise",
    text: "Every batch is manufactured under rigorous quality systems so pharmacies and clinicians can dispense with confidence.",
  },
  {
    icon: Microscope,
    title: "Research that compounds value",
    text: "Formulation science and continuous improvement keep our medicines effective, stable, and market-ready.",
  },
];

export function OverviewSection() {
  return (
    <section className="relative overflow-hidden section-padding">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(255, 197, 170,0.08),transparent_45%),radial-gradient(ellipse_at_90%_80%,rgba(255, 197, 170,0.1),transparent_40%)]" />
      <div className="container-custom relative">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
          <FadeIn direction="left" className="lg:col-span-5">
            <div className="relative h-72 overflow-hidden sm:h-96 lg:h-full lg:min-h-[520px]">
              <Image
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&h=1100&fit=crop"
                alt="HIMU research and manufacturing excellence"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#ffc5aa]/85 via-[#ffc5aa]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="font-[family-name:var(--font-heading)] text-3xl font-black tracking-tight text-gold sm:text-4xl">
                  20+
                </p>
                <p className="mt-1 text-sm font-semibold text-primary-foreground">
                  years elevating accessible, trusted care
                </p>
                <p className="mt-3 max-w-xs text-xs leading-relaxed text-primary-foreground/75">
                  From discovery-inspired formulation to last-mile pharmacy
                  shelves—quality you can prescribe and recommend.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right" className="lg:col-span-7">
            <h2 className="mb-5 max-w-xl font-[family-name:var(--font-heading)] text-3xl font-bold leading-[1.15] text-foreground md:text-4xl lg:text-[2.75rem]">
              Medicines engineered for trust.
              <span className="mt-2 block text-ink-accent">
                Care designed for everyday excellence.
              </span>
            </h2>
            <p className="mb-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              HIMU Pharmacy unites{" "}
              <span className="font-semibold text-foreground">
                {COMPANY.fullForm}
              </span>{" "}
              with a performance-ready catalog—helping individuals, pharmacies,
              and healthcare professionals choose authentic therapeutics without
              compromise.
            </p>
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Whether you need precision antibiotics, dermatology care,
              injectables, or daily wellness support, our portfolio is built to
              move faster from shelf to patient—with clarity, consistency, and
              clinical integrity.
            </p>

            <div className="mb-9 space-y-5 border-l-2 border-gold/50 pl-5">
              {OVERVIEW_PILLARS.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: 0.08 * i }}
                    className="flex gap-3"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-primary/10 text-ink-accent">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold text-foreground sm:text-base">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {pillar.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Our Medicines
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-primary/30 sm:w-auto"
                >
                  Partner With HIMU
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function CategoriesSection() {
  const featured = categories.slice(0, 6);
  return (
    <section className="section-padding molecular-bg">
      <div className="container-custom">
        <SectionHeading
          badge="Our Portfolio"
          title="Featured Product Categories"
          description="Explore our comprehensive range of pharmaceutical products across diverse therapeutic areas."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((cat, i) => (
            <FadeIn key={cat.slug} delay={i * 0.08}>
              <Link href={`/categories/${cat.slug}`}>
                <Card className="group overflow-hidden h-full hover:shadow-2xl hover:shadow-primary/10">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                    <h3 className="absolute bottom-4 left-4 text-xl font-bold text-primary-foreground">
                      {cat.name}
                    </h3>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {cat.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-ink-accent text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseSection() {
  return (
    <section className="relative overflow-hidden section-padding bg-[#ffc5aa]">
      <div className="pointer-events-none absolute inset-0 opacity-30 molecular-bg" />
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
      <div className="container-custom relative">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-primary-foreground md:text-4xl">
            Why healthcare partners
            <span className="mt-2 block text-gold">choose HIMU Pharmacy</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/75 md:text-base">
            From research labs to pharmacy counters, teams trust HIMU for
            dependable quality, progressive science, and patient-first delivery
            across every therapeutic line we manufacture.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div className="group h-full border border-primary-foreground/10 bg-primary-foreground/[0.06] p-6 backdrop-blur-sm transition hover:border-gold/40 hover:bg-primary-foreground/[0.1]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center bg-gold/15 text-gold transition group-hover:bg-gold group-hover:text-ink-accent">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-[family-name:var(--font-heading)] text-lg font-bold text-primary-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-primary-foreground/70">
                  {item.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedProductsSection() {
  const scrollerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [catalog, setCatalog] = useState(products);

  useEffect(() => {
    const list = getMockProducts();
    const ranked = [...list].sort(
      (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0),
    );
    setCatalog(ranked.slice(0, 14));
  }, []);

  const loopItems = useMemo(() => [...catalog, ...catalog], [catalog]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || catalog.length === 0) return;

    let frame = 0;
    let last = performance.now();
    const speed = 0.45;

    const tick = (now) => {
      const dt = now - last;
      last = now;
      if (!paused) {
        el.scrollLeft += speed * (dt / 16.67);
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, catalog.length]);

  const scrollByCard = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden section-padding bg-gradient-to-b from-[#eef8cd] via-[#eef8cd] to-[#eef8cd]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="container-custom mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-ink-accent">
            <ShoppingBag className="h-3.5 w-3.5" />
            Best sellers
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Shop popular medicines
          </h2>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Top-rated formulations with clear pricing. Add to cart or buy now —
            fast checkout for pharmacies and personal care.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald/25 bg-emerald/10 px-3 py-1 text-[11px] font-bold text-emerald">
              <Tag className="h-3 w-3" />
              Deal prices live
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-bold text-ink-accent">
              Add to cart · Buy now
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-[var(--c-lime)] text-ink-accent shadow-sm transition hover:bg-primary hover:text-primary-foreground"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-[var(--c-lime)] text-ink-accent shadow-sm transition hover:bg-primary hover:text-primary-foreground"
            aria-label="Next products"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <Link href="/products" className="ml-1">
            <Button size="sm" className="gap-1.5">
              Shop all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#eef8cd] to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#eef8cd] to-transparent sm:w-16" />
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:px-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loopItems.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="w-[260px] shrink-0 sm:w-[280px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div className="container-custom mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-primary-foreground/70 px-5 py-4 text-center backdrop-blur sm:flex-row sm:text-left">
        <p className="text-sm font-semibold text-foreground">
          Need bulk or pharmacy supply? Browse the full catalog and checkout in
          minutes.
        </p>
        <Link href="/products">
          <Button variant="secondary" className="gap-1.5">
            Continue shopping
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

export function ResearchSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <Badge className="mb-4">Research & Innovation</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-heading)]">
              Pioneering the Future of Healthcare
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our R&D division employs over 100 research scientists working on
              novel drug delivery systems, bioequivalence studies, and
              next-generation therapeutic formulations.
            </p>
            <Link href="/research">
              <Button>
                Explore Research <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </FadeIn>
          <FadeIn direction="right">
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop"
                alt="Research laboratory"
                fill
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-primary/5 molecular-bg">
      <div className="container-custom">
        <SectionHeading badge="Testimonials" title="What Our Partners Say" />
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <FadeIn key={t.id} delay={i * 0.1}>
              <Card className="p-6 h-full">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Award key={j} className="h-4 w-4 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsSection() {
  const latest = blogPosts.slice(0, 3);
  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          badge="Latest News"
          title="News & Insights"
          description="Stay updated with the latest from HIMU Pharmacy."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {latest.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.08}>
              <Link href={`/news/${post.slug}`}>
                <Card className="group overflow-hidden h-full hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-5">
                    <Badge variant="outline" className="mb-2">
                      {post.category}
                    </Badge>
                    <h3 className="font-bold mb-2 group-hover:text-ink-accent transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/news">
            <Button variant="outline">View All News</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

const partnerIcons = {
  "Apollo Hospitals": Heart,
  "Fortis Healthcare": Heart,
  "Max Healthcare": Heart,
  AIIMS: Shield,
  "MedSupply Global": Globe,
  PharmaCorp: Factory,
  HealthFirst: FlaskConical,
  "BioMed International": Microscope,
};

export function PartnersSection() {
  const duplicatedLogos = [...partnerLogos, ...partnerLogos];
  return (
    <section className="relative overflow-hidden py-10">
      <div className="container-custom mb-10 text-center">
        <SectionHeading
          badge="Partners"
          title="Trusted By Leading Organizations"
        />
      </div>
      <div className="relative w-full flex overflow-x-hidden pointer-events-none">
        {/* Blur gradients to fade the edges of the marquee */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="animate-marquee flex gap-6 md:gap-8 items-center pointer-events-auto py-2">
          {duplicatedLogos.map((name, i) => {
            const Icon = partnerIcons[name] || Shield;
            return (
              <div
                key={`${name}-${i}`}
                className="px-6 py-4 rounded-2xl bg-card border border-primary/10 shadow-md shadow-primary/5 flex items-center gap-3 whitespace-nowrap hover:border-primary hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
              >
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-ink-accent flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-ink-accent transition-colors">
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="relative rounded-3xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&h=400&fit=crop"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 gradient-hero" />
          <div className="relative z-10 p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 font-[family-name:var(--font-heading)]">
              Partner With HIMU Pharmacy
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Join our global network of healthcare partners and distributors.
              Together, we can advance healthcare innovation worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  Get In Touch
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="glass" className="text-primary-foreground">
                  Learn About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
