import { cn } from "@/lib/utils";

const LOGO_SRC = `${import.meta.env.BASE_URL}logo.png`;

/** Original HIMU logo with Vite base path support (/admin/). */
export function BrandLogo({
  className,
  imgClassName,
  alt = "HIMU Pharmacy",
  priority = false,
}) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <img
        src={LOGO_SRC}
        alt={alt}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        className={cn("h-full w-auto max-w-full object-contain", imgClassName)}
      />
    </div>
  );
}
