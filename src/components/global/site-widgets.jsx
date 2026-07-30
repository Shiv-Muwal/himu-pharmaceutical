import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLocation } from "react-router-dom";

const COMPANY_PHONE = "+9118001234567";

export function ScrollProgressBar() {
  const { pathname } = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  if (pathname && pathname.startsWith("/admin")) return null;

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

  if (pathname && pathname.startsWith("/admin")) return null;
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

  if (pathname && pathname.startsWith("/admin")) return null;
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
  if (pathname && pathname.startsWith("/admin")) return null;

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
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (pathname && pathname.startsWith("/admin")) return null;
  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 mx-auto mb-4 rounded-full border-4 border-primary/20 border-t-primary"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-bold text-primary font-[family-name:var(--font-heading)]"
        >
          HIMU Pharmacy
        </motion.p>
        <p className="text-xs text-muted-foreground mt-1">Loading excellence...</p>
      </div>
    </motion.div>
  );
}
