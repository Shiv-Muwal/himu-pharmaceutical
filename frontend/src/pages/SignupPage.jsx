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
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/AuthProvider";

const benefits = [
  { icon: ShieldCheck, text: "WHO-GMP trusted formulations" },
  { icon: Leaf, text: "Personalized wellness catalog" },
  { icon: HeartPulse, text: "Faster reorder & order tracking" },
];

const fieldMotion = {
  hidden: { opacity: 0, y: 18 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function SignupPage() {
  const { register, openLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden pt-28 pb-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255, 197, 170,0.12),transparent_40%),radial-gradient(circle_at_85%_10%,rgba(255, 197, 170,0.16),transparent_35%),linear-gradient(180deg,#eef8cd_0%,#eef8cd_55%,#e8f0ea_100%)]" />
        <motion.div
          className="absolute left-[8%] top-[22%] h-40 w-40 rounded-full border border-primary/15"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-[18%] right-[12%] h-28 w-28 rounded-full bg-[#ffc5aa]/15 blur-xl"
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container-custom relative z-10 grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary/70">
            HIMU Pharmacy
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-black leading-tight text-foreground xl:text-5xl">
            Create your
            <span className="block text-gradient"> wellness account</span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Join HIMU to save favorites, track deliveries, and checkout with your
            profile details already ready.
          </p>
          <div className="mt-8 space-y-3">
            {benefits.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.1 }}
                  className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary-foreground/60 px-4 py-3 backdrop-blur"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{item.text}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[32px] border border-primary/10 bg-primary-foreground/80 p-7 shadow-[0_25px_60px_rgba(255, 197, 170,0.12)] backdrop-blur-xl sm:p-9"
        >
          <motion.div
            className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-primary/20 to-[#ffc5aa]/20"
            animate={{ rotate: [0, 40, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative mb-7">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              <CheckCircle2 className="h-3 w-3" />
              Free account
            </div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-black text-foreground sm:text-3xl">
              Sign up
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Takes under a minute — no clinic paperwork.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-3.5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-[var(--c-peach)]"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {[
              {
                key: "name",
                icon: User,
                type: "text",
                placeholder: "Full name",
                autoComplete: "name",
              },
              {
                key: "email",
                icon: Mail,
                type: "email",
                placeholder: "Email address",
                autoComplete: "email",
              },
              {
                key: "phone",
                icon: Phone,
                type: "tel",
                placeholder: "Phone (optional)",
                autoComplete: "tel",
                required: false,
              },
            ].map((field, i) => {
              const Icon = field.icon;
              return (
                <motion.div
                  key={field.key}
                  custom={i}
                  variants={fieldMotion}
                  initial="hidden"
                  animate="show"
                  className="relative"
                >
                  <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={update(field.key)}
                    className="h-12 pl-11"
                    autoComplete={field.autoComplete}
                    required={field.required !== false}
                  />
                </motion.div>
              );
            })}

            <motion.div
              custom={3}
              variants={fieldMotion}
              initial="hidden"
              animate="show"
              className="relative"
            >
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 8 characters)"
                value={form.password}
                onChange={update("password")}
                className="h-12 pl-11 pr-11"
                autoComplete="new-password"
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
            </motion.div>

            <motion.div
              custom={4}
              variants={fieldMotion}
              initial="hidden"
              animate="show"
              className="relative"
            >
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
                className="h-12 pl-11"
                autoComplete="new-password"
                required
              />
            </motion.div>

            <motion.div custom={5} variants={fieldMotion} initial="hidden" animate="show">
              <Button type="submit" disabled={loading} className="mt-2 h-12 w-full gap-2 text-sm">
                {loading ? "Creating account..." : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </form>

          <p className="relative mt-6 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                openLogin();
                navigate("/");
              }}
              className="font-bold text-primary hover:underline"
            >
              Sign in
            </button>
            {" · "}
            <Link to="/" className="font-semibold text-foreground/70 hover:text-primary">
              Back home
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
