import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetLocalCustomerPassword } from "@/lib/local-password-reset";

const inputClass =
  "h-12 border-[#14532d]/20 bg-white pl-11 text-base text-[#14532d] placeholder:text-[#14532d]/45 sm:text-sm";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = resetLocalCustomerPassword(email, password);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setSuccess(result.message);
      setPassword("");
      setConfirmPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100dvh-var(--site-header-height,4.5rem))] overflow-hidden bg-[#f3f7f0] pb-10 pt-8 sm:pb-14 sm:pt-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(187,247,208,0.55),transparent_42%),radial-gradient(circle_at_88%_12%,rgba(214,176,77,0.18),transparent_36%)]" />
      </div>

      <div className="container-custom relative z-10 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-emerald">
            HIMU Pharmacy
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-black leading-tight text-[#14532d] xl:text-5xl">
            Reset your
            <span className="mt-1 block text-emerald">account password</span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#14532d]/75">
            Enter the email you used to sign up, choose a strong new password, then
            log in again.
          </p>
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#14532d]/12 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#bbf7d0]/70 text-emerald">
              <KeyRound className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-[#14532d]">
              Min 8 characters with A-Z, a-z, number & special
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative mx-auto w-full max-w-md overflow-hidden rounded-[28px] border border-[#14532d]/12 bg-white p-6 shadow-[0_20px_50px_rgba(20,83,45,0.1)] sm:p-8"
        >
          <Link
            to="/signup"
            aria-label="Close"
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532d]/8 text-[#14532d]/75 transition hover:bg-[#14532d]/12 hover:text-[#14532d] sm:right-4 sm:top-4"
          >
            <X className="h-5 w-5" strokeWidth={2.25} />
          </Link>

          <div className="mb-5 pr-10">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black tracking-tight text-[#14532d] sm:text-[1.7rem]">
              Forgot password
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#14532d]/70">
              Set a new password for your HIMU account.
            </p>
          </div>

          {error ? (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/25 bg-red-50 p-3 text-xs font-medium text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mb-4 space-y-3 rounded-xl border border-emerald/25 bg-[#eef7f1] p-4">
              <div className="flex items-start gap-2 text-xs font-medium text-emerald">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {success}
              </div>
              <Button
                type="button"
                onClick={() => navigate("/signup")}
                className="h-11 w-full gap-2 text-sm font-bold"
              >
                Go to log in
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14532d]/45" />
                <Input
                  type="email"
                  placeholder="Email address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14532d]/45" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password *"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-[#14532d]/55 hover:text-[#14532d]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14532d]/45" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password *"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  autoComplete="new-password"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-1 h-12 w-full gap-2 text-sm font-bold"
              >
                {loading ? "Updating..." : "Reset password"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-[#14532d]/70">
            Remembered it?{" "}
            <Link to="/signup" className="font-semibold text-emerald hover:underline">
              Back to log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
