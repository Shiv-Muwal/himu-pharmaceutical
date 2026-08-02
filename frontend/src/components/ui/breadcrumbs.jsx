import { Link } from "@/components/ui/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="flex items-center hover:text-ink-accent transition-colors">
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4" />
            {item.href ? (
              <Link href={item.href} className="hover:text-ink-accent transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={cn("font-medium text-foreground")}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
