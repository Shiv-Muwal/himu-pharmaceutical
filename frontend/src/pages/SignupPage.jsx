import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Leaf,
  HeartPulse,
  AlertCircle,
  ArrowRight,
  LogIn,
  UserPlus,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/AuthProvider";
import { requestGoogleAccessToken } from "@/lib/google-auth";
import { GoogleMark } from "@/components/auth/google-mark";
import { gmailErrorMessage, isGmailAddress } from "@/lib/email-rules";

const benefits = [
  { icon: ShieldCheck, text: "WHO-GMP trusted formulations" },
  { icon: Leaf, text: "Personalized wellness catalog" },
  { icon: HeartPulse, text: "Faster reorder & order tracking" },
];

const inputClass =
  "h-12 border-[#14532d]/20 bg-white pl-11 text-base text-[#14532d] placeholder:text-[#14532d]/45 sm:text-sm";

export default function SignupPage() {
  const {
    register,
    login,
    loginWithGoogle,
    sendSignupOtp,
    verifySignupOtp,
    isAuthenticated,
  } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [emailToken, setEmailToken] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpHint, setOtpHint] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const update = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "email") {
      setEmailVerified(false);
      setEmailToken("");
      setOtpSent(false);
      setOtpHint("");
      setForm((f) => ({ ...f, otp: "" }));
    }
  };

  const handleGoogleContinue = async () => {
    setError("");
    setLoading(true);
    try {
      const accessToken = await requestGoogleAccessToken();
      await loginWithGoogle({ accessToken });
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to continue with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError("");
    if (!isGmailAddress(form.email)) {
      setError(gmailErrorMessage());
      return;
    }
    setOtpLoading(true);
    try {
      const result = await sendSignupOtp(form.email);
      setOtpSent(true);
      setEmailVerified(false);
      setEmailToken("");
      setCooldown(45);
      setOtpHint(
        result?.devOtp
          ? `Dev OTP: ${result.devOtp}`
          : "OTP sent to your Gmail. Check inbox / spam.",
      );
    } catch (err) {
      setError(err.message || "Unable to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!/^\d{6}$/.test(form.otp.trim())) {
      setError("Enter the 6-digit OTP from your Gmail.");
      return;
    }
    setOtpLoading(true);
    try {
      const result = await verifySignupOtp(form.email, form.otp);
      setEmailToken(result.emailToken);
      setEmailVerified(true);
      setOtpHint("Gmail verified successfully.");
    } catch (err) {
      setEmailVerified(false);
      setEmailToken("");
      setError(err.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!form.name.trim()) throw new Error("Full name is required.");
        if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) {
          throw new Error("Mobile number is required.");
        }
        if (!isGmailAddress(form.email)) throw new Error(gmailErrorMessage());
        if (!emailVerified || !emailToken) {
          throw new Error("Please verify your Gmail with OTP first.");
        }
        if (form.password.length < 10) {
          throw new Error("Password must be at least 10 characters.");
        }
        if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
          throw new Error("Password needs uppercase, lowercase, and a number.");
        }
        if (form.password !== form.confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        await register({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
          emailToken,
        });
      } else {
        await login(form.email.trim(), form.password);
      }
      navigate("/");
    } catch (err) {
      setError(
        err.message ||
          (mode === "signup" ? "Unable to create account" : "Unable to sign in"),
      );
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
            Log in or create your
            <span className="mt-1 block text-emerald">wellness account</span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#14532d]/75">
            Sign up with your Gmail only. We verify your email with OTP — no temporary
            mail IDs accepted.
          </p>
          <div className="mt-8 space-y-3">
            {benefits.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="flex items-center gap-3 rounded-2xl border border-[#14532d]/12 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#bbf7d0]/70 text-emerald">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#14532d]">{item.text}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative mx-auto w-full max-w-md overflow-hidden rounded-[28px] border border-[#14532d]/12 bg-white p-6 shadow-[0_20px_50px_rgba(20,83,45,0.1)] sm:p-8"
        >
          <Link
            to="/"
            aria-label="Close and go home"
            className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-[#14532d]/8 text-[#14532d]/75 transition hover:bg-[#14532d]/12 hover:text-[#14532d] sm:right-4 sm:top-4"
          >
            <X className="h-5 w-5" strokeWidth={2.25} />
          </Link>

          <div className="mb-5 pr-10">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black tracking-tight text-[#14532d] sm:text-[1.7rem]">
              Log in or sign up
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#14532d]/70">
              All fields are mandatory. Gmail OTP verification is required for signup.
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/25 bg-red-50 p-3 text-xs font-medium text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleContinue}
            className="flex h-12 w-full touch-manipulation items-center justify-center gap-3 rounded-full border border-[#14532d]/18 bg-white px-4 text-sm font-semibold text-[#14532d] transition hover:bg-[#f3f7f0] disabled:opacity-60"
          >
            <GoogleMark />
            {loading ? "Connecting..." : "Continue with Google"}
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#14532d]/12" />
            </div>
            <div className="relative flex justify-center text-[11px] font-bold uppercase tracking-[0.16em]">
              <span className="bg-white px-3 text-[#14532d]/55">OR</span>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-[#eef6ef] p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`rounded-full px-3 py-2.5 text-sm font-bold transition ${
                mode === "login"
                  ? "bg-white text-emerald shadow-sm"
                  : "text-[#14532d]/60 hover:text-[#14532d]"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className={`rounded-full px-3 py-2.5 text-sm font-bold transition ${
                mode === "signup"
                  ? "bg-white text-emerald shadow-sm"
                  : "text-[#14532d]/60 hover:text-[#14532d]"
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "signup" && (
              <>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14532d]/45" />
                  <Input
                    type="text"
                    placeholder="Full name *"
                    value={form.name}
                    onChange={update("name")}
                    className={inputClass}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14532d]/45" />
                  <Input
                    type="tel"
                    placeholder="Mobile number *"
                    value={form.phone}
                    onChange={update("phone")}
                    className={inputClass}
                    autoComplete="tel"
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14532d]/45" />
                  <Input
                    type="email"
                    placeholder={mode === "signup" ? "Gmail address *" : "Email address *"}
                    value={form.email}
                    onChange={update("email")}
                    className={inputClass}
                    autoComplete="email"
                    required
                  />
                </div>
                {mode === "signup" && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={otpLoading || loading || cooldown > 0}
                    onClick={handleSendOtp}
                    className="h-12 shrink-0 border-[#14532d]/20 px-3 text-xs font-bold text-emerald"
                  >
                    {cooldown > 0 ? `${cooldown}s` : otpSent ? "Resend OTP" : "Send OTP"}
                  </Button>
                )}
              </div>
              {mode === "signup" && (
                <p className="text-[11px] font-medium text-[#14532d]/60">
                  Only @gmail.com accepted. Temp mail IDs are blocked.
                </p>
              )}
            </div>

            {mode === "signup" && otpSent && (
              <div className="space-y-2 rounded-2xl border border-[#14532d]/12 bg-[#f7faf8] p-3">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 6-digit OTP *"
                    value={form.otp}
                    onChange={update("otp")}
                    className="h-11 border-[#14532d]/20 bg-white text-center text-base tracking-[0.3em] text-[#14532d]"
                    maxLength={6}
                    required
                  />
                  <Button
                    type="button"
                    disabled={otpLoading || emailVerified}
                    onClick={handleVerifyOtp}
                    className="h-11 shrink-0 px-3 text-xs font-bold"
                  >
                    {emailVerified ? (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Verified
                      </span>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
                {otpHint && (
                  <p className="text-[11px] font-medium text-emerald">{otpHint}</p>
                )}
              </div>
            )}

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14532d]/45" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={
                  mode === "signup" ? "Password * (min 10, A-z + number)" : "Password *"
                }
                value={form.password}
                onChange={update("password")}
                className={`${inputClass} pr-12`}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
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

            {mode === "signup" && (
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#14532d]/45" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password *"
                  value={form.confirmPassword}
                  onChange={update("confirmPassword")}
                  className={inputClass}
                  autoComplete="new-password"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || (mode === "signup" && !emailVerified)}
              className="mt-1 h-12 w-full gap-2 text-sm font-bold"
            >
              {mode === "signup" ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              {loading
                ? mode === "signup"
                  ? "Creating account..."
                  : "Signing in..."
                : mode === "signup"
                  ? "Create account"
                  : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#14532d]/70">
            <Link to="/" className="font-semibold text-emerald hover:underline">
              Back home
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
