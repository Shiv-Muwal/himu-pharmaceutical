import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLocation } from "react-router-dom";
import { BrandLogo } from "@/components/ui/brand-logo";

export function ScrollProgressBar() {
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });


  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald to-gold origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}

export function BackToTop() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  if (!visible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-[calc(var(--mobile-nav-offset)+5.5rem)] right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-110 transition-transform cursor-pointer md:bottom-24 md:right-24 md:h-12 md:w-12"
      aria-label="Back to top"
    >
      ↑
    </motion.button>
  );
}

export function CookieBanner() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("himu-cookies")) {
      const timer = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("himu-cookies", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-[var(--mobile-nav-offset)] left-0 right-0 z-[60] p-3 md:bottom-0 md:p-4"
    >
      <div className="container-custom">
        <div className="glass rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your browsing experience and analyze site traffic. By
            continuing, you agree to our use of cookies.
          </p>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={accept}
              className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Accept
            </button>
            <a
              href="/privacy"
              className="px-6 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function FloatingButtons() {
  // Call FAB removed — mobile uses bottom app nav; desktop doesn't need it.
  return null;
}

export function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setLeaving(true), 1600);
    const hide = setTimeout(() => setLoading(false), 2100);
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
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[#f8f3e6]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(187, 247, 208,0.12),transparent_45%),radial-gradient(ellipse_at_75%_80%,rgba(214,176,77,0.18),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(187, 247, 208,0.06)_1px,transparent_1px)] [background-size:22px_22px]" />

      <motion.div
        className="pointer-events-none absolute h-56 w-56 rounded-full border border-primary/15 sm:h-72 sm:w-72"
        animate={{ scale: [0.9, 1.12, 0.9], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute h-40 w-40 rounded-full border border-gold/25 sm:h-52 sm:w-52"
        animate={{ scale: [1.1, 0.92, 1.1], opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.75, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="mb-5"
        >
          <motion.div
            className="flex h-16 w-52 items-center justify-center sm:h-20 sm:w-64 md:h-24 md:w-72"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <BrandLogo className="h-full w-full" priority />
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-[family-name:var(--font-heading)] text-lg font-black tracking-tight text-emerald sm:text-xl"
        >
          HIMU Pharmacy
        </motion.p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-gold">
          Healthcare Innovation
        </p>

        <motion.div
          className="mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-primary/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary via-gold to-primary"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.15, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Preparing your care
        </p>
      </div>
    </motion.div>
  );
}
