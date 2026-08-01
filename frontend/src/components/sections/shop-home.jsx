import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  BadgePercent,
  ShoppingBag,
} from "lucide-react";
import { Link } from "@/components/ui/link";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { categories } from "@/data/categories";
import { DEFAULT_BANNERS } from "@/data/banners";
import { products } from "@/data/products";
import { getMockProducts } from "@/lib/mock-backend";
import { api } from "@/lib/api";
import { FadeIn } from "@/components/animations/motion-components";
import { searchProductsSmart } from "@/lib/product-search";
import { getApiOrigin } from "@/lib/api-base";

function resolveBannerSrc(src) {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  if (src.startsWith("/uploads/")) return `${getApiOrigin()}${src}`;
  return src;
}

const DERMA_SLUGS = new Set(["dermatology", "skin-care", "creams", "ointments"]);

function rankForShop(list) {
  return [...list].sort((a, b) => {
    const aDerma = DERMA_SLUGS.has(a.categorySlug) ? 1 : 0;
    const bDerma = DERMA_SLUGS.has(b.categorySlug) ? 1 : 0;
    if (bDerma !== aDerma) return bDerma - aDerma;
    return (Number(b.rating) || 0) - (Number(a.rating) || 0);
  });
}

export function ShopPromoStrip() {
  return (
    <div className="relative overflow-hidden bg-[#0b6a46] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(214, 176, 77,0.18),transparent_40%,rgba(214, 176, 77,0.12))]" />
      <div className="container-custom relative flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2.5 text-[11px] font-semibold tracking-wide sm:justify-between sm:text-xs">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          HIMU Dermatology week — priority shelf live
        </span>
        <span className="hidden items-center gap-1.5 sm:inline-flex">
          <Truck className="h-3.5 w-3.5 text-gold" />
          Pan-India pharmacy supply ready
        </span>
        <Link
          href="/products?category=dermatology"
          className="inline-flex items-center gap-1 text-gold transition hover:text-white"
        >
          Shop derma now <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function BannerCarousel() {
  const [banners, setBanners] = useState(DEFAULT_BANNERS);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    let cancelled = false;
    api("/banners")
      .then((data) => {
        const items = (data?.items || []).filter((b) => b.active !== false);
        if (!cancelled && items.length) {
          setBanners(
            items.map((b) => ({
              ...b,
              id: b.id || b.bannerId,
            })),
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const active = banners[index] || banners[0];
  if (!active) return null;

  const go = (dir) => {
    setIndex((prev) => (prev + dir + banners.length) % banners.length);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current == null || banners.length < 2) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    go(delta > 0 ? -1 : 1);
  };

  return (
    <section
      className="relative overflow-hidden bg-[#061610]"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="HIMU homepage banners"
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative aspect-[4/3] w-full min-h-[280px] sm:aspect-[21/9] sm:min-h-0 lg:aspect-[2.6/1]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id || active.image}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={resolveBannerSrc(active.image)}
              alt={active.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1e2422]/88 via-[#1e2422]/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e2422]/70 via-transparent to-[#1e2422]/25" />
          </motion.div>
        </AnimatePresence>

        <div className="container-custom relative z-10 flex h-full items-end pb-8 pt-8 sm:items-center sm:pb-10 sm:pt-6">
          <motion.div
            key={`copy-${active.id || index}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-xl"
          >
            <p className="mb-2 font-[family-name:var(--font-heading)] text-[10px] font-bold uppercase tracking-[0.2em] text-gold sm:text-sm">
              HIMU Pharmacy
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {active.title}
            </h1>
            {active.subtitle && (
              <p className="mt-2 max-w-md text-xs leading-relaxed text-white/80 sm:mt-3 sm:text-base">
                {active.subtitle}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-5 sm:gap-3">
              <Link href={active.link || "/products"}>
                <Button size="lg" variant="secondary" className="h-10 gap-2 px-4 text-sm sm:h-11">
                  {active.ctaLabel || "Shop now"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products?category=dermatology">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-10 border border-white/30 bg-white/5 px-4 text-sm text-white hover:bg-white hover:text-[#0b6a46] sm:h-11"
                >
                  Dermatology picks
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur transition hover:bg-black/65 active:scale-95 sm:left-5 sm:h-11 sm:w-11"
              aria-label="Previous banner"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur transition hover:bg-black/65 active:scale-95 sm:right-5 sm:h-11 sm:w-11"
              aria-label="Next banner"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-4">
              {banners.map((banner, i) => (
                <button
                  key={banner.id || banner.image}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-7 bg-gold" : "w-2.5 bg-white/45 hover:bg-white/70"
                  }`}
                  aria-label={`Go to banner ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export function ShopSearchBar() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("dermatology");
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [catalog, setCatalog] = useState(products);
  const [placeholderText, setPlaceholderText] = useState(
    "Search derma creams, serums, medicines...",
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
    const q = searchQuery.trim();
    if (q.length < 1) return [];
    const pool = selectedCategory
      ? catalog.filter((p) => p.categorySlug === selectedCategory)
      : catalog;
    return searchProductsSmart(pool, q, { limit: 8 });
  }, [catalog, searchQuery, selectedCategory]);

  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.onstart = () => {
      setIsListening(true);
      setPlaceholderText("Listening...");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
      setPlaceholderText("Search derma creams, serums, medicines...");
      goToProducts(transcript, selectedCategory);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setPlaceholderText("Search derma creams, serums, medicines...");
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <section
      className="sticky z-40 border-b border-border/40 bg-[#f8f3e6] px-4 py-3 sm:px-6"
      style={{
        top: "var(--site-header-height, 4.5rem)",
        backgroundColor: "#f8f3e6",
      }}
    >
      <form
        ref={searchRef}
        onSubmit={(e) => {
          e.preventDefault();
          goToProducts();
        }}
        className="container-custom relative"
      >
        <div className="flex flex-col gap-2 rounded-2xl border border-border/50 bg-white p-2 shadow-[0_10px_28px_rgba(6,22,16,0.12)] sm:flex-row sm:items-center dark:bg-card">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full cursor-pointer rounded-xl bg-[#f4f0e5] px-3 py-2.5 text-xs font-bold outline-none sm:w-44 dark:bg-muted"
            aria-label="Category"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="relative flex flex-1 items-center">
            <Search className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder={placeholderText}
              className={`w-full border-0 bg-transparent px-2 py-2.5 text-sm font-medium outline-none placeholder:text-muted-foreground ${
                isListening ? "animate-pulse text-primary" : ""
              }`}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={startListening}
              className={`mr-1 rounded-full p-2 transition ${
                isListening
                  ? "bg-red-100 text-red-500"
                  : "text-muted-foreground hover:bg-muted hover:text-primary"
              }`}
              aria-label="Voice search"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>
          <Button type="submit" className="h-11 w-full sm:w-auto sm:px-6">
            Search
          </Button>
        </div>

        <AnimatePresence>
          {showSuggestions && searchQuery.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-4 right-4 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-2xl sm:left-6 sm:right-6 dark:bg-card"
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
                        <p className="truncate text-sm font-semibold">{product.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {product.composition} · {product.strength}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                        {product.category}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No products found. Try dermatology or skin care.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </section>
  );
}

export function QuickCategoryRail() {
  const scrollerRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const ordered = useMemo(() => {
    const priority = ["dermatology", "skin-care", "creams", "ointments", "cosmetics", "hair-care"];
    const rest = categories.filter((c) => !priority.includes(c.slug));
    const top = priority
      .map((slug) => categories.find((c) => c.slug === slug))
      .filter(Boolean);
    return [...top, ...rest].slice(0, 10);
  }, []);

  const getCardStep = () => {
    const el = scrollerRef.current;
    if (!el) return 160;
    const card = el.querySelector("[data-category-slide]");
    if (!card) return Math.min(160, el.clientWidth * 0.4);
    const styles = window.getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "12") || 12;
    return card.getBoundingClientRect().width + gap;
  };

  const scrollByCard = (dir = 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;
    if (dir > 0 && el.scrollLeft >= max - 4) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (dir < 0 && el.scrollLeft <= 4) {
      el.scrollTo({ left: max, behavior: "smooth" });
      return;
    }
    el.scrollBy({ left: dir * getCardStep(), behavior: "smooth" });
  };

  useEffect(() => {
    if (paused || ordered.length < 3) return undefined;
    const timer = setInterval(() => scrollByCard(1), 3200);
    return () => clearInterval(timer);
  }, [paused, ordered.length]);

  return (
    <section className="section-padding pb-4 pt-6 sm:pt-8">
      <div className="container-custom">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
              Shop by category
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground md:text-3xl">
              Find care faster
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-white text-primary shadow-sm transition hover:bg-primary hover:text-white sm:inline-flex"
              aria-label="Previous categories"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-white text-primary shadow-sm transition hover:bg-primary hover:text-white sm:inline-flex"
              aria-label="Next categories"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <Link
              href="/products"
              className="hidden text-sm font-semibold text-primary hover:underline sm:inline-flex sm:items-center sm:gap-1"
            >
              All products <ArrowRight className="h-4 w-4" />
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
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden scroll-smooth pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {ordered.map((cat, i) => {
              const highlight = DERMA_SLUGS.has(cat.slug);
              return (
                <FadeIn key={cat.slug} delay={i * 0.04}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    data-category-slide
                    className={`group relative flex w-[132px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border transition sm:w-[148px] ${
                      highlight
                        ? "border-gold/50 bg-gradient-to-b from-[#f8f3e6] to-white shadow-[0_10px_30px_rgba(214,176,77,0.18)]"
                        : "border-border/50 bg-white hover:border-primary/30 hover:shadow-lg dark:bg-card"
                    }`}
                  >
                    <div className="relative h-24 overflow-hidden sm:h-28">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                      {highlight && (
                        <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                          Focus
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-foreground">{cat.name}</p>
                      <p className="mt-0.5 text-[10px] font-semibold text-primary">Shop now →</p>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-7 bg-gradient-to-r from-[#f8f3e6] to-transparent sm:w-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-7 bg-gradient-to-l from-[#f8f3e6] to-transparent sm:w-10" />
        </div>
      </div>
    </section>
  );
}

function ProductScroller({ title, subtitle, badge, items, href, showReviews = true }) {
  const scrollerRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const getCardStep = () => {
    const el = scrollerRef.current;
    if (!el) return 280;
    const card = el.querySelector("[data-product-slide]");
    if (!card) return Math.min(280, el.clientWidth * 0.85);
    const styles = window.getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "16") || 16;
    return card.getBoundingClientRect().width + gap;
  };

  const scrollByCard = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) return;

    if (dir > 0 && el.scrollLeft >= max - 4) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (dir < 0 && el.scrollLeft <= 4) {
      el.scrollTo({ left: max, behavior: "smooth" });
      return;
    }
    el.scrollBy({ left: dir * getCardStep(), behavior: "smooth" });
  };

  useEffect(() => {
    if (paused || items.length < 2) return undefined;
    const timer = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      if (el.scrollLeft >= max - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      const card = el.querySelector("[data-product-slide]");
      const styles = window.getComputedStyle(el);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "16") || 16;
      const step = card
        ? card.getBoundingClientRect().width + gap
        : Math.min(280, el.clientWidth * 0.85);
      el.scrollBy({ left: step, behavior: "smooth" });
    }, 5000);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCard(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCard(1);
    }
  };

  if (!items.length) return null;

  return (
    <section className="relative overflow-x-clip py-6 sm:py-8">
      <div className="container-custom mb-4 flex flex-col gap-3 sm:mb-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
            <ShoppingBag className="h-3.5 w-3.5" />
            {badge}
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Link href={href}>
          <Button size="sm" className="gap-1.5">
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          className="absolute left-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-white/95 text-primary shadow-md backdrop-blur transition hover:bg-primary hover:text-white sm:left-2 sm:h-11 sm:w-11 md:left-3"
          aria-label="Previous products"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          className="absolute right-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-white/95 text-primary shadow-md backdrop-blur transition hover:bg-primary hover:text-white sm:right-2 sm:h-11 sm:w-11 md:right-3"
          aria-label="Next products"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          ref={scrollerRef}
          tabIndex={0}
          role="region"
          aria-label={title}
          onKeyDown={onKeyDown}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-3 pt-1 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:gap-4 sm:px-10 md:px-14 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((product) => (
            <div
              key={product.id}
              data-product-slide
              className="w-[72vw] max-w-[260px] shrink-0 snap-start sm:w-[260px] sm:max-w-none md:w-[280px]"
            >
              <ProductCard product={product} showReviews={showReviews} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DermaSpotlightSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const list = rankForShop(getMockProducts()).filter((p) =>
      DERMA_SLUGS.has(p.categorySlug),
    );
    setItems(list.slice(0, 12));
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#f8f3e6] via-[#f3f7f0] to-white">
      <ProductScroller
        badge="Priority shelf"
        title="Dermatology & skin essentials"
        subtitle="Starting focus: derma formulations first — clear prices, cart-ready packs."
        items={items}
        href="/products?category=dermatology"
        showReviews={false}
      />
    </div>
  );
}

export function PopularShopSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(rankForShop(getMockProducts()).slice(0, 14));
  }, []);

  return (
    <div className="bg-white dark:bg-background">
      <ProductScroller
        badge="Bestsellers"
        title="People are shopping these"
        subtitle="High-demand HIMU medicines with deal pricing — add to cart or buy now."
        items={items}
        href="/products"
        showReviews={false}
      />
    </div>
  );
}

export function ShopTrustStrip() {
  const items = [
    { icon: ShieldCheck, title: "Quality assured", text: "WHO-GMP minded manufacturing" },
    { icon: BadgePercent, title: "Clear pricing", text: "Transparent MRP & deal tags" },
    { icon: Truck, title: "Pharmacy ready", text: "Packs built for quick fulfillment" },
    { icon: Sparkles, title: "Derma first", text: "Skin therapeutics prioritized" },
  ];

  return (
    <section className="border-y border-border/40 bg-[#f7faf8] py-5 dark:bg-muted/20">
      <div className="container-custom grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {items.map((item, i) => (
          <FadeIn key={item.title} delay={i * 0.05}>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.text}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

export function ShopCTASection() {
  return (
    <section className="section-padding pt-2">
      <div className="container-custom overflow-hidden rounded-[1.75rem] bg-[#0b6a46] px-5 py-7 sm:px-8 sm:py-9">
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative z-10">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-gold">
              Keep shopping
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold text-white md:text-4xl">
              Your cart starts with better skin care
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 md:text-base">
              Explore the full HIMU catalog — dermatology, wellness, and clinical
              essentials with smooth checkout.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products?category=dermatology">
                <Button size="lg" variant="secondary" className="gap-2">
                  Shop dermatology <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  size="lg"
                  variant="ghost"
                  className="border border-white/25 text-white hover:bg-white hover:text-[#0b6a46]"
                >
                  View all products
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden h-56 overflow-hidden rounded-2xl lg:block">
            <Image
              src="/banners/banner-skin-specialists.png"
              alt="HIMU skin care products"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0b6a46]/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
