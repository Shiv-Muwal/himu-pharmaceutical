import { motion } from "framer-motion";
import { Lock, Mail, AlertCircle, Sparkles, Eye, EyeOff, LayoutDashboard, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminLogo } from "@/admin/components/AdminLogo";
import { LoginScene3D } from "@/admin/components/LoginScene3D";

const HINT_EMAIL = import.meta.env.VITE_LOCAL_ADMIN_EMAIL || "admin@himu.local";
const HINT_PASSWORD = import.meta.env.VITE_LOCAL_ADMIN_PASSWORD || "HimuAdmin@2026";

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
  handleDemoLogin,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState("");
  const storefrontUrl = getStorefrontUrl();

  const fillDemo = () => {
    setEmailInput(HINT_EMAIL);
    setPasswordInput(HINT_PASSWORD);
  };

  const copyText = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-[#ffc5aa] text-[var(--c-lime)]">
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
            <p className="text-sm text-[var(--c-lime)]/60">
              Operations suite for catalog, orders & inventory
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--c-lime)]/10 bg-[var(--c-lime)]/[0.07] p-7 shadow-2xl backdrop-blur-xl sm:p-8">
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-center gap-2 rounded-xl border border-[var(--c-peach)]/30 bg-[var(--c-peach)]/25 p-3.5 text-xs text-[var(--c-lime)]"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <form id="himu-admin-login-form" onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--c-lime)]/40" />
                <Input
                  type="email"
                  inputMode="email"
                  enterKeyHint="next"
                  placeholder="Admin email / ID"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="h-12 border-[var(--c-lime)]/10 bg-[var(--c-lime)]/5 pl-11 text-base text-[var(--c-lime)] placeholder:text-[var(--c-lime)]/35 sm:text-sm"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--c-lime)]/40" />
                <Input
                  type={showPassword ? "text" : "password"}
                  enterKeyHint="go"
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="h-12 border-[var(--c-lime)]/10 bg-[var(--c-lime)]/5 pl-11 pr-12 text-base text-[var(--c-lime)] placeholder:text-[var(--c-lime)]/35 sm:text-sm"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-[var(--c-lime)]/40 hover:text-[var(--c-lime)]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                type="submit"
                disabled={loginLoading}
                className="h-12 w-full touch-manipulation bg-primary text-base text-[var(--c-lime)] shadow-none hover:bg-primary-hover sm:text-sm"
              >
                {loginLoading ? "Authenticating..." : "Enter Dashboard"}
              </Button>
            </form>

            <Button
              type="button"
              variant="outline"
              disabled={loginLoading}
              onClick={(e) => {
                e.preventDefault();
                handleDemoLogin();
              }}
              className="mt-3 h-11 w-full touch-manipulation gap-2 border-[var(--c-mint)]/40 bg-[var(--c-mint)]/25 text-[var(--c-lime)] hover:bg-[var(--c-mint)]/35 hover:text-[var(--c-lime)]"
            >
              <LayoutDashboard className="h-4 w-4" />
              Open admin panel (demo login)
            </Button>

            <div className="mt-5 rounded-2xl border border-[var(--c-lime)]/10 bg-[var(--c-mint)]/25 p-4">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-gold">
                Dummy credentials
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2 rounded-xl bg-[var(--c-lime)]/5 px-3 py-2">
                  <div>
                    <p className="text-[10px] text-[var(--c-lime)]/45">ID / Email</p>
                    <p className="font-semibold text-[var(--c-lime)]/90">{HINT_EMAIL}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText("email", HINT_EMAIL)}
                    className="rounded-lg p-2 text-[var(--c-lime)]/50 hover:bg-[var(--c-lime)]/10 hover:text-[var(--c-lime)]"
                    aria-label="Copy email"
                  >
                    {copied === "email" ? <Check className="h-3.5 w-3.5 text-[var(--c-mint)]" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-xl bg-[var(--c-lime)]/5 px-3 py-2">
                  <div>
                    <p className="text-[10px] text-[var(--c-lime)]/45">Password</p>
                    <p className="font-semibold text-[var(--c-lime)]/90">{HINT_PASSWORD}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText("password", HINT_PASSWORD)}
                    className="rounded-lg p-2 text-[var(--c-lime)]/50 hover:bg-[var(--c-lime)]/10 hover:text-[var(--c-lime)]"
                    aria-label="Copy password"
                  >
                    {copied === "password" ? <Check className="h-3.5 w-3.5 text-[var(--c-mint)]" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={fillDemo}
                className="mt-3 w-full text-center text-[11px] font-semibold text-gold hover:underline"
              >
                Autofill demo ID & password
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[var(--c-lime)]/40">
              <Sparkles className="h-3.5 w-3.5 text-[#ffc5aa]" />
              Encrypted session · Admin only
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href={storefrontUrl}
              className="text-xs font-semibold text-[var(--c-mint)] hover:text-[var(--c-lime)]"
            >
              ← Back to storefront
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
