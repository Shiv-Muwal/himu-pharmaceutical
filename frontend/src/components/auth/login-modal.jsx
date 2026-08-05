import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  UserRound,
  Phone,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/AuthProvider";
import { requestGoogleAccessToken } from "@/lib/google-auth";
import { GoogleMark } from "@/components/auth/google-mark";
import { gmailErrorMessage, isGmailAddress } from "@/lib/email-rules";

const DEMO_CUSTOMER_EMAIL =
  import.meta.env.VITE_DEMO_CUSTOMER_EMAIL || "customer@himu.local";
const DEMO_CUSTOMER_PASSWORD =
  import.meta.env.VITE_DEMO_CUSTOMER_PASSWORD || "HimuCustomer@2026";

export function LoginModal() {
  const {
    loginOpen,
    closeLogin,
    login,
    register,
    loginWithGoogle,
    sendSignupOtp,
    verifySignupOtp,
  } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
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
    if (!loginOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [loginOpen]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const resetFields = () => {
    setError("");
    setPassword("");
    setName("");
    setPhone("");
    setOtp("");
    setEmailToken("");
    setEmailVerified(false);
    setOtpSent(false);
    setOtpHint("");
    setCooldown(0);
  };

  const handleClose = () => {
    closeLogin();
    resetFields();
    setMode("login");
  };

  const onEmailChange = (value) => {
    setEmail(value);
    setEmailVerified(false);
    setEmailToken("");
    setOtpSent(false);
    setOtp("");
    setOtpHint("");
  };

  const signInWith = async (loginEmail, loginPassword) => {
    setError("");
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      setEmail("");
      resetFields();
    } catch (err) {
      setError(err.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError("");
    if (!isGmailAddress(email)) {
      setError(gmailErrorMessage());
      return;
    }
    setOtpLoading(true);
    try {
      const result = await sendSignupOtp(email);
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
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Enter the 6-digit OTP from your Gmail.");
      return;
    }
    setOtpLoading(true);
    try {
      const result = await verifySignupOtp(email, otp);
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
    e.stopPropagation();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) throw new Error("Full name is required.");
        if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
          throw new Error("Mobile number is required.");
        }
        if (!isGmailAddress(email)) throw new Error(gmailErrorMessage());
        if (!emailVerified || !emailToken) {
          throw new Error("Please verify your Gmail with OTP first.");
        }
        if (password.length < 10) {
          throw new Error("Password must be at least 10 characters.");
        }
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
          throw new Error("Password needs uppercase, lowercase, and a number.");
        }
        await register({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          emailToken,
        });
        setEmail("");
        resetFields();
        setMode("login");
      } else {
        await login(email, password);
        setEmail("");
        resetFields();
      }
    } catch (err) {
      setError(err.message || (mode === "signup" ? "Unable to create account" : "Unable to sign in"));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEmail(DEMO_CUSTOMER_EMAIL);
    setPassword(DEMO_CUSTOMER_PASSWORD);
    await signInWith(DEMO_CUSTOMER_EMAIL, DEMO_CUSTOMER_PASSWORD);
  };

  const handleGoogleContinue = async () => {
    setError("");
    setLoading(true);
    try {
      const accessToken = await requestGoogleAccessToken();
      await loginWithGoogle({ accessToken });
      resetFields();
    } catch (err) {
      setError(err.message || "Unable to continue with Google");
    } finally {
      setLoading(false);
    }
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
            className="absolute inset-0 bg-[#1e2422]/60 backdrop-blur-md"
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
            className="relative z-10 flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[28px] border border-[#BBF7D0]/15 bg-[#f8f3e6] shadow-[0_30px_80px_rgba(6,21,15,0.35)] sm:rounded-[28px]"
            style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative shrink-0 px-6 pb-2 pt-5 sm:px-7 sm:pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-3 top-3 z-20 rounded-xl bg-emerald/10 p-2.5 text-emerald/80 transition hover:bg-emerald/15 hover:text-emerald"
              >
                <X className="h-4 w-4" />
              </button>
              <h2
                id="login-title"
                className="pr-10 font-[family-name:var(--font-heading)] text-2xl font-black tracking-tight text-foreground sm:text-[1.7rem]"
              >
                Log in or sign up
              </h2>
              <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                Signup requires Gmail OTP. All fields are mandatory.
              </p>
            </div>

            <div className="space-y-3.5 overflow-y-auto overscroll-contain px-6 py-4 sm:space-y-4 sm:px-7 sm:pb-6">
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

              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleContinue}
                className="flex h-12 w-full touch-manipulation items-center justify-center gap-3 rounded-full border border-border/70 bg-white px-4 text-sm font-semibold text-foreground transition hover:bg-muted/40 disabled:opacity-60"
              >
                <GoogleMark />
                {loading ? "Connecting..." : "Continue with Google"}
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-[11px] font-bold uppercase tracking-[0.18em]">
                  <span className="bg-[#f8f3e6] px-3 text-muted-foreground">OR</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-full bg-muted/50 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                    mode === "login"
                      ? "bg-white text-emerald shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
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
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                    mode === "signup"
                      ? "bg-white text-emerald shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                {mode === "signup" && (
                  <>
                    <div className="relative">
                      <UserPlus className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Full name *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 pl-11 text-base sm:text-sm"
                        autoComplete="name"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="Mobile number *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-12 pl-11 text-base sm:text-sm"
                        autoComplete="tel"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative min-w-0 flex-1">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        inputMode="email"
                        placeholder={mode === "signup" ? "Gmail address *" : "Email address *"}
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        className="h-12 pl-11 text-base sm:text-sm"
                        autoComplete="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        required
                      />
                    </div>
                    {mode === "signup" && (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={otpLoading || loading || cooldown > 0}
                        onClick={handleSendOtp}
                        className="h-12 shrink-0 border-primary/25 px-3 text-xs font-bold text-emerald"
                      >
                        {cooldown > 0 ? `${cooldown}s` : otpSent ? "Resend OTP" : "Send OTP"}
                      </Button>
                    )}
                  </div>
                  {mode === "signup" && (
                    <p className="text-[11px] text-muted-foreground">
                      Only @gmail.com — temporary emails are blocked.
                    </p>
                  )}
                </div>

                {mode === "signup" && otpSent && (
                  <div className="space-y-2 rounded-2xl border border-border/50 bg-white/70 p-3">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="6-digit OTP *"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="h-11 text-center tracking-[0.3em]"
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
                    {otpHint && <p className="text-[11px] font-medium text-emerald">{otpHint}</p>}
                  </div>
                )}

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    enterKeyHint="go"
                    placeholder={mode === "signup" ? "Password * (min 10)" : "Password *"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-11 pr-12 text-base sm:text-sm"
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
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
                  disabled={loading || (mode === "signup" && !emailVerified)}
                  className="h-12 w-full touch-manipulation gap-2 text-base sm:text-sm"
                >
                  {mode === "signup" ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                  {loading
                    ? mode === "signup"
                      ? "Creating account..."
                      : "Signing in..."
                    : mode === "signup"
                      ? "Create account"
                      : "Continue"}
                </Button>
              </form>

              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={handleDemoLogin}
                className="h-11 w-full touch-manipulation gap-2 border-primary/25 bg-primary/5 text-emerald hover:bg-primary/10"
              >
                <UserRound className="h-4 w-4" />
                {loading ? "Signing in..." : "Demo customer login"}
              </Button>

              <div className="rounded-2xl border border-border/50 bg-muted/40 px-3 py-2.5 text-[11px] text-muted-foreground">
                <p className="mb-1 font-bold uppercase tracking-wide text-emerald/80">
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
