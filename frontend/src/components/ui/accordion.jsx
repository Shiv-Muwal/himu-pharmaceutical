import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold transition-colors hover:bg-muted/50 sm:p-5 sm:text-base"
        aria-expanded={isOpen}
      >
        <span className="pr-3">{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-primary transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground sm:px-5 sm:pb-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Accordion({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <AccordionItem key={i} title={item.title}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
