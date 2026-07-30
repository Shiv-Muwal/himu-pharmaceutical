import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left font-semibold hover:bg-muted/50 transition-colors"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-primary transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
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
