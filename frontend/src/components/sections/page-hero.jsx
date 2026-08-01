import { Link } from "@/components/ui/Link";
import { Image } from "@/components/ui/Image";
import { Button } from "@/components/ui/Button";

export function PageHero({ title, description, image, badge, cta }) {
  return (
    <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center overflow-hidden">
      {image ? (
        <>
          <Image src={image} alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 gradient-hero" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 gradient-primary molecular-bg" />
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald/10 rounded-full blur-3xl" />
          </div>
        </>
      )}
      <div className="container-custom relative z-10 pt-32 pb-16">
        {badge && (
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-white/20 text-white uppercase tracking-wider mb-4">
            {badge}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-3xl font-[family-name:var(--font-heading)]">
          {title}
        </h1>
        {description && (
          <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
        {cta && (
          <Link href={cta.href} className="inline-block mt-6">
            <Button variant="secondary" size="lg">
              {cta.label}
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
