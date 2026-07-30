import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

export function AdminLogo({
  variant = "dark",
  className,
  markOnly = false,
  size = "md",
}) {
  const sizes = {
    sm: { box: "h-9 w-28", mark: "h-9 w-9" },
    md: { box: "h-12 w-40", mark: "h-11 w-11" },
    lg: { box: "h-16 w-56", mark: "h-16 w-16" },
  };
  const dim = sizes[size] || sizes.md;

  if (markOnly) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border bg-white shadow-sm",
          variant === "light" ? "border-white/20" : "border-primary/15",
          dim.mark,
          className,
        )}
      >
        <Image src="/logo.png" alt="HIMU Pharmacy" fill className="object-contain p-1" priority />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        variant === "light" ? "bg-white/95" : "bg-white",
        dim.box,
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt="HIMU Pharmacy"
        fill
        className="object-contain scale-[2.8]"
        priority
      />
    </div>
  );
}
