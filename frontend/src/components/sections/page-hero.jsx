import { Link } from "@/components/ui/link";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHero({
  title,
  description,
  image,
  badge,
  cta,
  compact = false,
}) {
  return (
    <section
      className={cn(
        "relative flex items-end overflow-hidden sm:items-center",
        compact
          ? "min-h-[148px] sm:min-h-[180px] md:min-h-[220px]"
          : "min-h-[40vh] md:min-h-[50vh]",
      )}
    >
      {image ? (
        <>
          <Image src={image} alt="" fill className="object-cover" priority />
          <div
            className={cn(
              "absolute inset-0",
              compact
                ? "bg-gradient-to-r from-[#ffc5aa]/88 via-[#ffc5aa]/55 to-[#ffc5aa]/15"
                : "gradient-hero",
            )}
          />
          {compact && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#ffc5aa]/55 via-transparent to-transparent" />
          )}
        </>
      ) : (
        <>
          <div className="absolute inset-0 gradient-primary molecular-bg" />
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute bottom-10 left-10 h-96 w-96 rounded-full bg-emerald/10 blur-3xl" />
          </div>
        </>
      )}

      <div
        className={cn(
          "container-custom relative z-10",
          compact ? "pb-5 pt-8 sm:pb-7 sm:pt-10" : "pb-16 pt-32",
        )}
      >
        {badge && (
          <span
            className={cn(
              "mb-2 inline-block rounded-full bg-primary-foreground/15 font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-sm sm:mb-3",
              compact ? "px-2.5 py-1 text-[9px]" : "mb-4 px-4 py-1.5 text-xs",
            )}
          >
            {badge}
          </span>
        )}
        <h1
          className={cn(
            "max-w-3xl font-bold text-primary-foreground font-[family-name:var(--font-heading)]",
            compact
              ? "text-xl leading-tight sm:text-2xl md:text-3xl"
              : "mb-4 text-4xl md:text-5xl lg:text-6xl",
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "max-w-2xl leading-relaxed text-primary-foreground/80",
              compact
                ? "mt-1.5 text-xs sm:text-sm md:max-w-lg"
                : "text-lg md:text-xl",
            )}
          >
            {description}
          </p>
        )}
        {cta && (
          <Link href={cta.href} className="mt-4 inline-block sm:mt-6">
            <Button variant="secondary" size={compact ? "default" : "lg"}>
              {cta.label}
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
