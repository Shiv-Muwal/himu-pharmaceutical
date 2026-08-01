import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Quote, Sparkles } from "lucide-react";
import { Link } from "@/components/ui/link";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/animations/motion-components";
import { trustedBrands, shopBrands } from "@/data/brands";
import { blogPosts as fallbackBlogs } from "@/data/blogs";
import { api } from "@/lib/api";

export function TrustedBrandsSection() {
  const loop = [...trustedBrands, ...trustedBrands];

  return (
    <section className="relative overflow-hidden border-y border-primary/10 bg-[#0b6a46] py-10 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.08)_0_2px,transparent_2px_18px)]" />
      <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-gold/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

      <div className="container-custom relative mb-7 text-center">
        <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-gold">
          <Sparkles className="h-3.5 w-3.5" /> Trusted Brands
        </p>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold md:text-3xl">
          Chosen by hospitals & care networks
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/70">
          HIMU formulations move through leading clinical partners across India.
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0b6a46] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0b6a46] to-transparent sm:w-24" />
        <div className="animate-marquee flex w-max gap-4 px-4">
          {loop.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="group flex min-w-[210px] items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-gold/50 hover:bg-white/15"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-xs font-black tracking-wide text-white shadow-inner"
                style={{ background: brand.accent }}
              >
                {brand.mark}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{brand.name}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold/90">
                  Partner network
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShopWithBrandsSection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
              Shop with brands
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold md:text-3xl">
              Explore HIMU houses
            </h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Jump into curated brand shelves — derma, care, cosmo, and clinical lines.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Browse catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shopBrands.map((brand, i) => (
            <FadeIn key={brand.id} delay={i * 0.05}>
              <Link
                href={brand.href}
                className="group relative block overflow-hidden rounded-[1.5rem] border border-border/50 bg-white p-5 shadow-[0_10px_30px_rgba(11,106,70,0.06)] transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_40px_rgba(11,106,70,0.12)] dark:bg-card"
              >
                <div
                  className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl transition group-hover:opacity-40"
                  style={{ background: brand.accent }}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-black text-white shadow-lg"
                    style={{ background: brand.accent }}
                  >
                    {brand.mark}
                  </div>
                  <span className="rounded-full bg-[#f8f3e6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Shop
                  </span>
                </div>
                <h3 className="relative mt-4 font-[family-name:var(--font-heading)] text-xl font-bold text-foreground">
                  {brand.name}
                </h3>
                <p className="relative mt-1 text-sm text-muted-foreground">{brand.tagline}</p>
                <p className="relative mt-4 text-xs font-semibold text-primary/80">
                  {brand.productsLabel}
                </p>
                <span className="relative mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">
                  Open shelf
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
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
    <section className="section-padding bg-gradient-to-b from-[#f8f3e6] via-white to-[#f3f7f0]">
      <div className="container-custom">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-1 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
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
              className="group relative block overflow-hidden rounded-[1.75rem] border border-border/40 bg-[#0b6a46] text-white shadow-xl"
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#062819] via-[#0b6a46]/55 to-transparent" />
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
                      <div className="flex h-full items-center justify-center bg-primary/10 text-primary">
                        <Quote className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-4 sm:p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
                      {post.category}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug group-hover:text-primary">
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
