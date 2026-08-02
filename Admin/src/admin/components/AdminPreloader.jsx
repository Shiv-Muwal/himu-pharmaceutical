import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function AdminPreloader() {
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setLeaving(true), 1400);
    const hide = setTimeout(() => setLoading(false), 1850);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#f8f3e6]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_40%_25%,rgba(11,106,70,0.12),transparent_45%),radial-gradient(ellipse_at_70%_75%,rgba(214,176,77,0.16),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(11,106,70,0.06)_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="mb-4 flex h-16 w-52 items-center justify-center sm:h-20 sm:w-64"
        >
          <BrandLogo className="h-full w-full" priority />
        </motion.div>
        <p className="font-[family-name:var(--font-heading)] text-lg font-black text-primary">
          HIMU Control
        </p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-gold">
          Admin suite
        </p>
        <div className="mt-4 h-1.5 w-32 overflow-hidden rounded-full bg-primary/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary via-[#d6b04d] to-primary"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
