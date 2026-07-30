import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "@/components/ui/link";
import { Image } from "@/components/ui/image";
import { motion } from "framer-motion";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [placeholderText, setPlaceholderText] = useState(
    "Search medicines, categories, compositions...",
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    let url = `/products?q=${encodeURIComponent(searchQuery)}`;
    if (selectedCategory) {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }
    navigate(url);
  };

  const startListening = () => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
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
          navigate(`/products?q=${encodeURIComponent(transcript)}`);
        };
        recognition.onerror = () => {
          setIsListening(false);
          setPlaceholderText("Search medicines, categories, compositions...");
          alert("Speech recognition error. Please type or try speaking again.");
        };
        recognition.onend = () => {
          setIsListening(false);
        };
        recognition.start();
      } else {
        alert(
          "Voice recognition is not supported in this browser. Please try typing.",
        );
      }
    }
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
            onSubmit={handleSearchSubmit}
            className="mb-8 w-full max-w-2xl bg-white dark:bg-card p-1.5 flex items-center rounded-2xl border-2 border-secondary focus-within:border-primary transition-all gap-1.5 shadow-2xl relative"
          >
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs font-bold text-foreground px-3 py-2 outline-none border-r border-border cursor-pointer shrink-0"
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
            <div className="flex-1 flex items-center relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholderText}
                className={`w-full bg-transparent border-0 text-sm px-2 text-foreground font-medium placeholder:text-muted-foreground outline-none ${isListening ? "text-primary animate-pulse" : ""}`}
              />
              <button
                type="button"
                onClick={startListening}
                className={`p-2 rounded-full hover:bg-muted transition-colors cursor-pointer shrink-0 ${isListening ? "text-red-500 bg-red-100 dark:bg-red-950/30 animate-pulse" : "text-muted-foreground hover:text-primary"}`}
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
              className="h-9 px-5 shrink-0 rounded-xl cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline ml-1 text-xs">Search</span>
            </Button>
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
