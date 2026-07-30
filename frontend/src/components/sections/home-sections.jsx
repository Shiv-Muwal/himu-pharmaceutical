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

export function HeroSection() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [catalog, setCatalog] = useState(products);
  const [placeholderText, setPlaceholderText] = useState(
    "Search medicines, categories, compositions...",
  );

  useEffect(() => {
    setCatalog(getMockProducts());
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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=1080&fit=crop"
        alt="Pharmaceutical laboratory"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 molecular-bg" />
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="container-custom relative z-10 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <Badge
            variant="gold"
            className="mb-6 bg-white/20 text-white border-0"
          >
            {COMPANY.tagline}
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight font-[family-name:var(--font-heading)]">
            Healthcare Innovation for{" "}
            <span className="text-gold">Medical Upliftment</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-2xl">
            HIMU Pharmacy is a global pharmaceutical leader committed to
            advancing healthcare through scientific innovation, premium quality
            manufacturing, and compassionate patient care.
          </p>
          {/* Amazon-like Search Bar with Category and Voice Mic Search */}
          <form
            ref={searchRef}
            onSubmit={handleSearchSubmit}
            className="relative mb-8 w-full max-w-2xl"
          >
            <div className="flex items-center gap-1.5 rounded-2xl border-2 border-secondary bg-white p-1.5 shadow-2xl transition-all focus-within:border-primary dark:bg-card">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="shrink-0 cursor-pointer border-r border-border bg-transparent px-3 py-2 text-xs font-bold text-foreground outline-none"
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
                  className={`w-full border-0 bg-transparent px-2 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground ${isListening ? "animate-pulse text-primary" : ""}`}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={startListening}
                  className={`shrink-0 cursor-pointer rounded-full p-2 transition-colors hover:bg-muted ${isListening ? "animate-pulse bg-red-100 text-red-500 dark:bg-red-950/30" : "text-muted-foreground hover:text-primary"}`}
                  title="Voice Search"
                >
                  {isListening ? (
                    <MicOff className="h-4.5 w-4.5" />
                  ) : (
                    <Mic className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
              <Button
                type="submit"
                size="sm"
                className="h-9 shrink-0 cursor-pointer rounded-xl px-5"
              >
                <Search className="h-4 w-4" />
                <span className="ml-1 hidden text-xs sm:inline">Search</span>
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
          </form>
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <Button size="lg" variant="secondary">
                Explore Products
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="glass"
                className="text-white border-white/30"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
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

export function OverviewSection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <div className="relative h-80 md:h-[450px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
                alt="HIMU Pharmacy facility"
                fill
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn direction="right">
            <Badge className="mb-4">Company Overview</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-heading)]">
              Two Decades of Pharmaceutical Excellence
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded in 2004, HIMU Pharmacy has grown from a single
              manufacturing facility to a global pharmaceutical enterprise
              serving 50+ countries with over 500 medicines.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our commitment to Healthcare Innovation for Medical Upliftment
              drives everything we do—from research and development to
              manufacturing and community healthcare initiatives.
            </p>
            <Link href="/about">
              <Button>
                About HIMU <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
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
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          badge="Why HIMU"
          title="Why Choose HIMU Pharmacy"
          description="Trusted by healthcare professionals worldwide for quality, innovation, and reliability."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChoose.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <Card className="p-6 h-full hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedProductsSection() {
  const featured = products
    .filter(
      (p) => p.categorySlug === "dermatology" || p.categorySlug === "skin-care",
    )
    .slice(0, 4);
  return (
    <section className="section-padding bg-muted/50">
      <div className="container-custom">
        <SectionHeading
          badge="Featured"
          title="Popular Medicines"
          description="Discover our most trusted pharmaceutical products."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.08}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/products">
            <Button size="lg">View All Products</Button>
          </Link>
        </div>
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

export function NewsletterSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom max-w-2xl text-center">
        <SectionHeading
          badge="Newsletter"
          title="Stay Informed"
          description="Subscribe to receive the latest news, research updates, and product information."
        />
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 h-11 rounded-xl border border-border bg-background px-4 text-sm"
          />
          <Button type="button">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}
