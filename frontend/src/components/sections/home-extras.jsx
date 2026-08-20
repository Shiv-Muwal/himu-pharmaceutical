import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Quote, Sparkles, Sun, Moon, Droplets } from "lucide-react";
import { Link } from "@/components/ui/link";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/motion-components";
import { getProductMrp } from "@/lib/pricing";
import { fetchStoreProducts } from "@/lib/products-api";
import { blogPosts as fallbackBlogs } from "@/data/blogs";
import { api } from "@/lib/api";

const PRODUCT_TRUST = [
  {
    slug: "milky-sunscreen-spf-50",
    icon: Sun,
    accent: "#d6b04d",
    tint: "from-[#fff8e8] to-[#f3f7f0]",
    promise: "Day defense",
    detail: "SPF 50 · no white cast",
  },
  {
    slug: "porcelyn-night-cream",
    icon: Moon,
    accent: "#6b5b95",
    tint: "from-[#f5f0fa] to-[#f3f7f0]",
    promise: "Night renewal",
    detail: "Soft, restored morning skin",
  },
  {
    slug: "lumeva-melasma-cream",
    icon: Droplets,
    accent: "#7c6ba8",
    tint: "from-[#f3eef8] to-[#f8f3e6]",
    promise: "Tone care",
    detail: "Melasma & pigmentation control",
  },
];

export function TrustedBrandsSection() {
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    let active = true;
    fetchStoreProducts().then((items) => {
      if (active) setCatalog(items);
    });
    return () => {
      active = false;
    };
  }, []);

  const lineup = PRODUCT_TRUST.map((item) => {
    const product = catalog.find((p) => p.slug === item.slug);
    return product ? { ...item, product } : null;
  }).filter(Boolean);

  return (
    <section className="relative overflow-hidden border-y border-primary/10 bg-gradient-to-b from-[#f8f3e6] via-[#f3f7f0] to-[#e8f5ec] py-12 text-primary-foreground sm:py-14">
      <div className="pointer-events-none absolute -left-20 top-8 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-[#c4b5e0]/35 blur-3xl" />

      <div className="container-custom relative">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald">
            <Sparkles className="h-3.5 w-3.5" /> Dermatologist recommended
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground md:text-3xl">
            Built for real skin routines
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Day SPF, overnight renewal, and pigmentation care — three focused formulas for clearer, calmer skin.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {lineup.map(({ product, icon: Icon, accent, tint, promise, detail }, i) => (
            <FadeIn key={product.slug} delay={i * 0.06}>
              <Link
                href={`/products/${product.slug}`}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-gradient-to-br ${tint} p-4 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(20,83,45,0.1)] sm:p-5`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ background: accent }}
                  >
                    <Icon className="h-3 w-3" />
                    {promise}
                  </span>
                  <ArrowRight className="h-4 w-4 text-emerald opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </div>

                <div className="relative mx-auto mt-4 h-36 w-full max-w-[180px] sm:h-40">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain drop-shadow-md transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="mt-3 text-left">
                  <h3 className="font-[family-name:var(--font-heading)] text-base font-bold text-foreground sm:text-lg">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{detail}</p>
                  <p className="mt-2 text-sm font-bold text-emerald">
                    ₹{getProductMrp(product)}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeBlogsSection() {
  const [posts, setPosts] = useState(fallbackBlogs.slice(0, 3));

  useEffect(() => {
    let cancelled = false;
    api("/blogs")
      .then((data) => {
        const items = data?.items || [];
        if (!cancelled && items.length) {
          setPosts(items.slice(0, 3));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const [featured, ...rest] = posts;
  if (!featured) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-[#f8f3e6] via-white to-[#f8f3e6] pb-2 md:pb-3">
      <div className="container-custom">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-1 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald">
              <BookOpen className="h-3.5 w-3.5" /> From the journal
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold md:text-3xl">
              Insights that elevate care
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Research notes, derma science, and manufacturing stories from HIMU.
            </p>
          </div>
          <Link href="/news">
            <Button variant="outline" className="gap-1.5">
              View all blogs <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.95fr]">
          <FadeIn>
            <Link
              href={`/news/${featured.slug}`}
              className="group relative block overflow-hidden rounded-[1.75rem] border border-border/40 bg-[#BBF7D0] text-white shadow-xl"
            >
              <div className="relative min-h-[280px] sm:min-h-[340px]">
                {featured.image ? (
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover opacity-70 transition duration-700 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#14532D] via-[#BBF7D0]/55 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <span className="mb-3 inline-flex rounded-full bg-gold/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gold">
                    {featured.category || "Healthcare"}
                  </span>
                  <h3 className="max-w-xl font-[family-name:var(--font-heading)] text-2xl font-bold leading-tight sm:text-3xl">
                    {featured.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm text-white/75 line-clamp-2">
                    {featured.excerpt}
                  </p>
                  <p className="mt-4 text-xs font-semibold text-white/60">
                    {featured.author} · {featured.readTime || "3 min read"}
                  </p>
                </div>
              </div>
            </Link>
          </FadeIn>

          <div className="grid gap-4">
            {rest.slice(0, 2).map((post, i) => (
              <FadeIn key={post.id || post.slug} delay={0.08 * (i + 1)}>
                <Link
                  href={`/news/${post.slug}`}
                  className="group flex h-full overflow-hidden rounded-[1.5rem] border border-border/50 bg-white shadow-sm transition hover:border-primary/30 hover:shadow-lg dark:bg-card"
                >
                  <div className="relative w-[38%] min-w-[110px] overflow-hidden">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-primary/10 text-emerald">
                        <Quote className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-4 sm:p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald">
                      {post.category}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug group-hover:text-emerald">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
