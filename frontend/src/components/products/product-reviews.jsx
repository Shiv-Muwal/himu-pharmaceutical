import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquarePlus, Send, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function StarPicker({ value, onChange, size = "md" }) {
  const [hover, setHover] = useState(0);
  const cls = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = (hover || value) >= star;
        return (
          <button
            key={star}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(star);
            }}
            onMouseEnter={() => setHover(star)}
            className="p-0.5"
            aria-label={`${star} star`}
          >
            <Star
              className={cn(
                cls,
                "transition-colors",
                active ? "fill-secondary text-secondary" : "text-muted-foreground/30",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

function SampleReviews({ product }) {
  const reviews = useMemo(() => {
    const names = ["Aarav S.", "Priya M.", "Rohan K.", "Neha G.", "Vikram D."];
    const comments = [
      "Good quality and packaging. Works as expected.",
      "Trusted HIMU formulation. Will order again.",
      "Delivery was quick and product authenticity looks solid.",
      "Effective for my prescribed use. Happy with the purchase.",
      "Clean composition details and reliable brand.",
    ];
    const base = Math.max(3, Math.floor(product.rating || 4));
    const count = Math.min(3, Math.max(2, Math.floor((product.reviewCount || 40) / 40)));
    return Array.from({ length: count }).map((_, i) => ({
      id: `${product.id}-rev-${i}`,
      name: names[i % names.length],
      rating: Math.min(5, base + (i % 2 === 0 ? 0 : 1)),
      comment: comments[i % comments.length],
      date: `Jul ${20 + i}, 2026`,
    }));
  }, [product]);

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-2xl border border-border/40 bg-muted/20 p-3.5"
        >
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-foreground">{review.name}</p>
            <p className="text-[10px] text-muted-foreground">{review.date}</p>
          </div>
          <div className="mb-2 flex text-secondary">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < review.rating
                    ? "fill-current text-secondary"
                    : "text-muted-foreground/25",
                )}
              />
            ))}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ProductReviews({ product, variant = "detail" }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Reviews only on product detail page — never on cards
  if (variant !== "detail") return null;

  const resetForm = () => {
    setRating(0);
    setComment("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!rating || !comment.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setOpen(false);
      resetForm();
    }, 1600);
  };

  return (
    <div className="rounded-2xl border border-border/40 bg-[var(--c-lime)] p-4 shadow-sm md:rounded-3xl md:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold md:text-2xl">
            Customer Reviews
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Rated {product.rating || 4.5} · {product.reviewCount || 0} reviews
          </p>
        </div>
        <Button type="button" onClick={() => setOpen((v) => !v)} className="h-10 gap-2 text-sm">
          <MessageSquarePlus className="h-4 w-4" />
          Write a Review
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-6 overflow-hidden rounded-2xl border border-primary/15 bg-primary/5 p-4"
          >
            {submitted ? (
              <div className="flex items-center gap-2 py-4 text-sm font-semibold text-emerald">
                <CheckCircle2 className="h-5 w-5" />
                Thanks! Your review has been submitted.
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
                    Your rating
                  </p>
                  <StarPicker value={rating} onChange={setRating} />
                </div>
                <Textarea
                  placeholder={`Share your experience with ${product.name}...`}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  required
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gap-2" disabled={!rating}>
                    <Send className="h-4 w-4" />
                    Submit Review
                  </Button>
                </div>
              </div>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      <SampleReviews product={product} />
    </div>
  );
}
