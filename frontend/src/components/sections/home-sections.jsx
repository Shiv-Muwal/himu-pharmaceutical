import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Search,
  Mic,
  MicOff,
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

const HERO_SUBLINES = [
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

export function HeroSection() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [catalog, setCatalog] = useState(products);
  const [sublineIndex, setSublineIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState(
    "Search medicines, categories, compositions...",
  );

  useEffect(() => {
    setCatalog(getMockProducts());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSublineIndex((prev) => (prev + 1) % HERO_SUBLINES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const goToProducts = (query = searchQuery, category = selectedCategory) => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    const qs = params.toString();
    navigate(qs ? `/products?${qs}` : "/products");
    setShowSuggestions(false);
  };

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 1) return [];
    return catalog
      .filter((p) => {
        const matchesQuery =
          p.name.toLowerCase().includes(q) ||
          p.composition?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q);
        const matchesCategory = !selectedCategory || p.categorySlug === selectedCategory;
        return matchesQuery && matchesCategory;
      })
      .slice(0, 6);
  }, [catalog, searchQuery, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    goToProducts();
  };

  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please try typing.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => {
      setIsListening(true);
      setPlaceholderText("Listening... Speak now");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
      setPlaceholderText("Search medicines, categories, compositions...");
      goToProducts(transcript, selectedCategory);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setPlaceholderText("Search medicines, categories, compositions...");
      alert("Speech recognition error. Please type or try speaking again.");
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=1080&fit=crop"
        alt="Pharmaceutical laboratory"
        fill
        className="object-cover object-[68%_center] sm:object-[72%_center]"
        priority
      />
      <div className="absolute inset-0 gradient-hero-mobile md:hidden" />
      <div className="absolute inset-0 hidden gradient-hero md:block" />
      <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-[#061610]/40 to-transparent md:block" />

      <div className="container-custom relative z-10 flex min-h-[100svh] items-start md:items-center">
        <div className="w-full max-w-xl pt-28 pb-16 sm:pt-32 sm:pb-20 lg:max-w-3xl lg:pt-36">
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="mb-6 font-[family-name:var(--font-heading)] text-[2.1rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
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
                key={HERO_SUBLINES[sublineIndex].id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute inset-x-0 top-0"
              >
                {HERO_SUBLINES[sublineIndex].title && (
                  <p className="mb-1.5 font-[family-name:var(--font-heading)] text-sm font-bold text-gold sm:text-base">
                    {HERO_SUBLINES[sublineIndex].title}
                  </p>
                )}
                <p className="text-sm leading-relaxed text-white/80 sm:text-base lg:text-lg">
                  {HERO_SUBLINES[sublineIndex].body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
            className="mb-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
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
                className="w-full border-2 border-gold/80 bg-white/5 text-gold backdrop-blur-sm hover:border-gold hover:bg-gold hover:text-[#1a2e1f] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(212,175,55,0.35)] sm:w-auto"
              >
                <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                Contact Us
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </motion.div>

          <motion.form
            ref={searchRef}
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.34, ease: "easeOut" }}
            className="relative w-full max-w-xl"
          >
            <div className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/95 p-2 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:gap-1.5 dark:bg-card/95">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full shrink-0 cursor-pointer rounded-xl bg-muted/50 px-3 py-2.5 text-xs font-bold text-foreground outline-none sm:w-auto sm:rounded-none sm:border-r sm:border-border sm:bg-transparent sm:py-2"
                aria-label="Category"
              >
                <option value="" className="text-foreground">
                  All Categories
                </option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug} className="text-foreground">
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="relative flex flex-1 items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={placeholderText}
                  className={`w-full border-0 bg-transparent px-3 py-2.5 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground sm:px-2 sm:py-2 ${isListening ? "animate-pulse text-primary" : ""}`}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={startListening}
                  className={`shrink-0 cursor-pointer rounded-full p-2 transition-colors hover:bg-muted ${isListening ? "animate-pulse bg-red-100 text-red-500 dark:bg-red-950/30" : "text-muted-foreground hover:text-primary"}`}
                  title="Voice Search"
                  aria-label="Voice search"
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
              </div>
              <Button
                type="submit"
                size="sm"
                className="h-11 w-full shrink-0 cursor-pointer rounded-xl px-5 sm:h-9 sm:w-auto"
              >
                <Search className="h-4 w-4" />
                <span className="ml-1 text-xs">Search</span>
              </Button>
            </div>

            <AnimatePresence>
              {showSuggestions && searchQuery.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-2xl dark:bg-card"
                >
                  {suggestions.length > 0 ? (
                    <div className="max-h-72 overflow-y-auto p-2">
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => navigate(`/products/${product.slug}`)}
                          className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-primary/10"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {product.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {product.composition} · {product.strength}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                            {product.category}
                          </span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => goToProducts()}
                        className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary/5 px-3 py-2.5 text-xs font-bold text-primary hover:bg-primary/10"
                      >
                        <Search className="h-3.5 w-3.5" />
                        View all results for “{searchQuery.trim()}”
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No medicines found. Try another keyword or category.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-4 z-10 hidden sm:left-6 sm:block md:left-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:left-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        aria-hidden
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/35 p-2">
          <div className="h-2 w-1 rounded-full bg-white/70" />
        </div>
      </motion.div>
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
                <p className="text-4xl md:text-5xl font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-white/70 text-sm md:text-base">
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(11,93,59,0.08),transparent_45%),radial-gradient(ellipse_at_90%_80%,rgba(212,175,55,0.1),transparent_40%)]" />
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#061610]/85 via-[#061610]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="font-[family-name:var(--font-heading)] text-3xl font-black tracking-tight text-gold sm:text-4xl">
                  20+
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  years elevating accessible, trusted care
                </p>
                <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/75">
                  From discovery-inspired formulation to last-mile pharmacy
                  shelves—quality you can prescribe and recommend.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right" className="lg:col-span-7">
            <h2 className="mb-5 max-w-xl font-[family-name:var(--font-heading)] text-3xl font-bold leading-[1.15] text-foreground md:text-4xl lg:text-[2.75rem]">
              Medicines engineered for trust.
              <span className="mt-2 block text-primary">
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
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-primary/10 text-primary">
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
                    <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">
                      {cat.name}
                    </h3>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {cat.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
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
    <section className="relative overflow-hidden section-padding bg-[#0b5d3b]">
      <div className="pointer-events-none absolute inset-0 opacity-30 molecular-bg" />
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
      <div className="container-custom relative">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold leading-tight text-white md:text-4xl">
            Why healthcare partners
            <span className="mt-2 block text-gold">choose HIMU Pharmacy</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
            From research labs to pharmacy counters, teams trust HIMU for
            dependable quality, progressive science, and patient-first delivery
            across every therapeutic line we manufacture.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <div className="group h-full border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm transition hover:border-gold/40 hover:bg-white/[0.1]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center bg-gold/15 text-gold transition group-hover:bg-gold group-hover:text-[#1a2e1f]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-[family-name:var(--font-heading)] text-lg font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/70">
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
    <section className="relative overflow-hidden section-padding bg-gradient-to-b from-[#fff8e7] via-[#f3f8f4] to-[#fff8e7]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="container-custom mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-bold text-primary">
              Add to cart · Buy now
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-white text-primary shadow-sm transition hover:bg-primary hover:text-white"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-white text-primary shadow-sm transition hover:bg-primary hover:text-white"
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
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#fff8e7] to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#fff8e7] to-transparent sm:w-16" />
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

      <div className="container-custom mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-white/70 px-5 py-4 text-center backdrop-blur sm:flex-row sm:text-left">
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
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
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
    <section className="py-16 overflow-hidden relative">
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
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
              Partner With HIMU Pharmacy
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
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
                <Button size="lg" variant="glass" className="text-white">
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
