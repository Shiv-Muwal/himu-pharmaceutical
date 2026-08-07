import { motion } from "framer-motion";
import { Lock, Mail, AlertCircle, Sparkles, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminLogo } from "@/admin/components/AdminLogo";
import { LoginScene3D } from "@/admin/components/LoginScene3D";

function getStorefrontUrl() {
  if (import.meta.env.VITE_STOREFRONT_URL) {
    return String(import.meta.env.VITE_STOREFRONT_URL).replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    const { protocol, hostname, port, origin } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5173";
    }
    if (["5173", "5174", "4173", "4174"].includes(port)) {
      return `${protocol}//${hostname}:5173`;
    }
    return origin;
  }
  return "http://localhost:5173";
}

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
  const storefrontUrl = getStorefrontUrl();

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-[#1e2422] text-white">
      <LoginScene3D />

      <div
        className="relative z-10 flex min-h-[100dvh] items-start justify-center px-4 py-10 sm:items-center sm:py-14"
        style={{
          paddingTop: "max(2.5rem, env(safe-area-inset-top))",
          paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="mb-7 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mb-4 flex justify-center"
            >
              <AdminLogo
                size="lg"
                className="drop-shadow-[0_0_50px_rgba(214, 176, 77,0.35)]"
              />
            </motion.div>
            <p className="text-sm text-white/60">
              Operations suite for catalog, orders & inventory
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-7 shadow-2xl backdrop-blur-xl sm:p-8">
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

            <form id="himu-admin-login-form" onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  type="email"
                  inputMode="email"
                  enterKeyHint="next"
                  placeholder="Admin email / ID"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="h-12 border-white/10 bg-white/5 pl-11 text-base text-white placeholder:text-white/35 sm:text-sm"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  type={showPassword ? "text" : "password"}
                  enterKeyHint="go"
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="h-12 border-white/10 bg-white/5 pl-11 pr-12 text-base text-white placeholder:text-white/35 sm:text-sm"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                type="submit"
                disabled={loginLoading}
                className="h-12 w-full touch-manipulation bg-primary text-base text-primary-foreground shadow-none hover:bg-primary-hover sm:text-sm"
              >
                {loginLoading ? "Authenticating..." : "Enter Dashboard"}
              </Button>
            </form>

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-white/40">
              <Sparkles className="h-3.5 w-3.5 text-[#d6b04d]" />
              Encrypted session · Admin only
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href={storefrontUrl}
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
