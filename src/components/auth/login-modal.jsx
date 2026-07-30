import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";

export function LoginModal() {
  const { loginOpen, closeLogin, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    closeLogin();
    setError("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {loginOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#06150f]/55 backdrop-blur-md"
            onClick={handleClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-[#0b5d3b]/15 bg-[#fffaf0] shadow-[0_30px_80px_rgba(6,21,15,0.35)]"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0b5d3b] via-[#0d6b44] to-[#1a4d35] px-7 pb-8 pt-7 text-white">
              <motion.div
                className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#d4af37]/20"
                animate={{ scale: [1, 1.15, 1], rotate: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-10 left-10 h-24 w-24 rounded-full bg-white/10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-xl bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f5e6b8]">
                  <Sparkles className="h-3 w-3" />
                  Welcome back
                </div>
                <h2 id="login-title" className="font-[family-name:var(--font-heading)] text-2xl font-black">
                  Sign in to HIMU
                </h2>
                <p className="mt-1.5 text-sm text-white/70">
                  Access your orders, wishlist & faster checkout
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-7 py-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-11"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-11 pr-11"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <Button type="submit" disabled={loading} className="h-12 w-full gap-2">
                <LogIn className="h-4 w-4" />
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
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
