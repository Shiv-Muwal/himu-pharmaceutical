import { cn } from "@/lib/utils";

/** Original HIMU logo — no crop / fake scaling. */
export function BrandLogo({
  className,
  imgClassName,
  alt = "HIMU Pharmacy",
  priority = false,
}) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <img
        src="/logo.png"
        alt={alt}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        className={cn("h-full w-auto max-w-full object-contain", imgClassName)}
      />
    </div>
  );
}
