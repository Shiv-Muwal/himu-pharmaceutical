import { BrandLogo } from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";

export function AdminLogo({
  className,
  markOnly = false,
  size = "md",
}) {
  const sizes = {
    sm: { box: "h-10 w-28", full: "h-11 w-40" },
    md: { box: "h-12 w-36", full: "h-14 w-52" },
    lg: { box: "h-16 w-48", full: "h-20 w-72" },
  };
  const dim = sizes[size] || sizes.md;

  return (
    <div className={cn(markOnly ? dim.box : dim.full, className)}>
      <BrandLogo className="h-full w-full" priority />
    </div>
  );
}
