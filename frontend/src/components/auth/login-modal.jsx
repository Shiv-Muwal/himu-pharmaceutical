import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "@/components/ui/brand-logo";
import { useAuth } from "@/providers/AuthProvider";

const DEMO_CUSTOMER_EMAIL =
  import.meta.env.VITE_DEMO_CUSTOMER_EMAIL || "customer@himu.local";
const DEMO_CUSTOMER_PASSWORD =
  import.meta.env.VITE_DEMO_CUSTOMER_PASSWORD || "HimuCustomer@2026";

export function LoginModal() {
  const { loginOpen, closeLogin, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loginOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [loginOpen]);

  const handleClose = () => {
    closeLogin();
    setError("");
    setPassword("");
  };

  const signInWith = async (loginEmail, loginPassword) => {
    setError("");
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await signInWith(email, password);
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEmail(DEMO_CUSTOMER_EMAIL);
    setPassword(DEMO_CUSTOMER_PASSWORD);
    await signInWith(DEMO_CUSTOMER_EMAIL, DEMO_CUSTOMER_PASSWORD);
  };

  return (
    <AnimatePresence>
      {loginOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-4">
          <motion.button
            type="button"
            aria-label="Close login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#bbf1d2]/60 backdrop-blur-md"
            onClick={handleClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="relative z-10 flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[28px] border border-[#ffc5aa]/15 bg-[#eef8cd] shadow-[0_30px_80px_rgba(255, 197, 170,0.35)] sm:rounded-[28px]"
            style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#ffc5aa] via-[#bbf1d2] to-[#bbf1d2] px-6 pb-6 pt-5 text-primary-foreground sm:px-7 sm:pb-8 sm:pt-7">
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-3 top-3 z-20 rounded-xl bg-primary-foreground/10 p-2.5 text-primary-foreground/80 transition hover:bg-primary-foreground/20 hover:text-primary-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative flex items-start gap-4">
                <div className="flex h-14 w-44 shrink-0 items-center sm:h-16 sm:w-52">
                  <BrandLogo className="h-full w-full" priority />
                </div>
                <div className="min-w-0 pt-0.5">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f5e6b8]">
                    <Sparkles className="h-3 w-3" />
                    Welcome back
                  </div>
                  <h2
                    id="login-title"
                    className="font-[family-name:var(--font-heading)] text-xl font-black sm:text-2xl"
                  >
                    Sign in to HIMU
                  </h2>
                  <p className="mt-1 text-xs text-primary-foreground/70 sm:text-sm">
                    Orders, wishlist & faster checkout
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-3.5 overflow-y-auto overscroll-contain px-6 py-5 sm:space-y-4 sm:px-7 sm:py-6"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-[var(--c-peach)]"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  inputMode="email"
                  enterKeyHint="next"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-11 text-base sm:text-sm"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  enterKeyHint="go"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-11 pr-12 text-base sm:text-sm"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full touch-manipulation gap-2 text-base sm:text-sm"
              >
                <LogIn className="h-4 w-4" />
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={handleDemoLogin}
                className="h-11 w-full touch-manipulation gap-2 border-primary/25 bg-primary/5 text-primary hover:bg-primary/10"
              >
                <UserRound className="h-4 w-4" />
                {loading ? "Signing in..." : "Demo customer login"}
              </Button>

              <div className="rounded-2xl border border-border/50 bg-muted/40 px-3 py-2.5 text-[11px] text-muted-foreground">
                <p className="mb-1 font-bold uppercase tracking-wide text-primary/80">
                  Dummy customer ID
                </p>
                <p>
                  <span className="font-semibold text-foreground">Email:</span>{" "}
                  {DEMO_CUSTOMER_EMAIL}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Password:</span>{" "}
                  {DEMO_CUSTOMER_PASSWORD}
                </p>
              </div>

              <p className="pb-2 text-center text-xs text-muted-foreground">
                New to HIMU?{" "}
                <Link
                  to="/signup"
                  onClick={handleClose}
                  className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                >
                  Create account <ArrowRight className="h-3 w-3" />
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
