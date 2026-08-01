import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLocation } from "react-router-dom";

const COMPANY_PHONE = "+9118001234567";

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
      className="fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-110 transition-transform cursor-pointer"
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
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
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
  const { pathname } = useLocation();

  return (
    <>
      <a
        href={`tel:${COMPANY_PHONE}`}
        className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform md:hidden"
        aria-label="Call us"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      </a>
    </>
  );
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
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[#1e2422]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(214, 176, 77,0.22),transparent_45%),radial-gradient(ellipse_at_70%_80%,rgba(16,185,129,0.2),transparent_50%)]" />
      <motion.div
        className="pointer-events-none absolute h-64 w-64 rounded-full border border-gold/20"
        animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="relative mb-5 flex h-20 w-64 items-center justify-center sm:h-24 sm:w-80"
        >
          <motion.img
            src="/logo.png"
            alt="HIMU Pharmacy"
            className="h-full w-full object-contain drop-shadow-[0_12px_40px_rgba(214, 176, 77,0.35)]"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-[family-name:var(--font-heading)] text-xl font-black tracking-tight text-white"
        >
          HIMU Pharmacy
        </motion.p>
        <motion.div
          className="mt-4 h-1 w-36 overflow-hidden rounded-full bg-white/15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-gold to-emerald-300"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
          Preparing your care
        </p>
      </div>
    </motion.div>
  );
}
