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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1e2422]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_40%_30%,rgba(214, 176, 77,0.2),transparent_45%),radial-gradient(ellipse_at_70%_75%,rgba(16,185,129,0.18),transparent_50%)]" />
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="mb-4 flex h-20 w-64 items-center justify-center sm:h-24 sm:w-80"
        >
          <BrandLogo
            className="h-full w-full drop-shadow-[0_12px_40px_rgba(214, 176, 77,0.3)]"
            priority
          />
        </motion.div>
        <p className="font-[family-name:var(--font-heading)] text-lg font-black text-white">
          HIMU Control
        </p>
        <div className="mt-4 h-1 w-32 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-[#d6b04d] to-emerald-300"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
