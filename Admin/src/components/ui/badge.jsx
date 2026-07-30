import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
        {
          "bg-primary/10 text-primary": variant === "default",
          "bg-secondary/20 text-secondary-foreground": variant === "secondary",
          "border border-border text-muted-foreground": variant === "outline",
          "bg-gold/20 text-gold": variant === "gold",
        },
        className
      )}
      {...props}
    />
  );
}
