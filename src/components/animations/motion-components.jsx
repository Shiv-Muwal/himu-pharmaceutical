import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function AnimatedCounter({ value, suffix = "", duration = 2, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {count}
      {suffix}
    </span>
  );
}

export function FadeIn({ children, className, delay = 0, direction = "up" }) {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Badge({ children, className }) {
  return (
    <span
      className={cn(
        "inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider",
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({ badge, title, description, centered = true, className }) {
  return (
    <FadeIn className={cn(centered && "text-center", "mb-12 md:mb-16", className)}>
      {badge && <Badge className="mb-4">{badge}</Badge>}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-heading)]">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </FadeIn>
  );
}
