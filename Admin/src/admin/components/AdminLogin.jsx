import { motion } from "framer-motion";
import { Lock, Mail, AlertCircle, Sparkles, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminLogo } from "@/admin/components/AdminLogo";

const SHOW_HINT = import.meta.env.VITE_USE_LOCAL_ADMIN === "true";
const HINT_EMAIL = import.meta.env.VITE_LOCAL_ADMIN_EMAIL || "admin@himu.local";
const HINT_PASSWORD = import.meta.env.VITE_LOCAL_ADMIN_PASSWORD || "HimuAdmin@2026";
const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL || "http://localhost:5173";

export function AdminLogin({
  emailInput,
  setEmailInput,
  passwordInput,
  setPasswordInput,
  loginError,
  loginLoading,
  handleLogin,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06150f] text-white">
      <div className="absolute inset-0">
        <div className="absolute -left-16 -top-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-[#d4af37]/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute inset-0 opacity-30 molecular-bg" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mb-5 flex justify-center"
            >
              <AdminLogo size="lg" className="shadow-[0_0_50px_rgba(212,175,55,0.25)]" />
            </motion.div>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl font-black tracking-tight">
              HIMU Admin
            </h1>
            <p className="mt-2 text-sm text-white/55">
              Operations suite for catalog, orders & inventory
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-xl">
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3.5 text-xs text-red-300"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  type="email"
                  placeholder="Admin email / ID"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="h-12 border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/35"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="h-12 border-white/10 bg-white/5 pl-11 pr-11 text-white placeholder:text-white/35"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                type="submit"
                disabled={loginLoading}
                className="h-12 w-full bg-[#d4af37] text-[#06150f] shadow-none hover:bg-[#e0c15a]"
              >
                {loginLoading ? "Authenticating..." : "Enter Dashboard"}
              </Button>
            </form>

            {SHOW_HINT && (
              <button
                type="button"
                onClick={() => {
                  setEmailInput(HINT_EMAIL);
                  setPasswordInput(HINT_PASSWORD);
                }}
                className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-[11px] text-white/55 transition hover:bg-white/10 hover:text-white/80"
              >
                <span className="font-bold text-[#d4af37]">Demo credentials</span>
                <br />
                {HINT_EMAIL} · click to autofill
              </button>
            )}

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-white/40">
              <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
              Encrypted session · Admin only
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href={STOREFRONT_URL}
              className="text-xs font-semibold text-emerald-300/80 hover:text-emerald-200"
            >
              ← Back to storefront
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
