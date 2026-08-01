import { cn } from "@/lib/utils";

/** Original HIMU logo — no crop / fake scaling. */
export function BrandLogo({
  className,
  imgClassName,
  alt = "HIMU Pharmacy",
  priority = false,
  variant = "default",
}) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <img
        src="/logo.png"
        alt={alt}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        className={cn(
          "h-full w-auto max-w-full object-contain",
          variant === "white" &&
            "brightness-0 invert drop-shadow-[0_2px_16px_rgba(255,255,255,0.35)]",
          imgClassName,
        )}
      />
    </div>
  );
}
