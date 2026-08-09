import { AnimatePresence, motion } from "framer-motion";
import { History, LogOut, Package, ShoppingBag, UserRound, X, Scale, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

const OPTIONS = [
  { id: "profile", label: "My Profile", icon: UserRound, tab: "profile" },
  { id: "orders", label: "My Orders", icon: Package, tab: "orders" },
  { id: "history", label: "Order History", icon: History, tab: "history" },
  { id: "terms", label: "Terms & Conditions", icon: Scale, href: "/terms" },
  { id: "privacy", label: "Privacy Policy", icon: FileText, href: "/privacy" },
];

export function AccountSheet({ open, onClose }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, openLogin } = useAuth();

  const go = (opt) => {
    onClose();
    if (opt.href) {
      navigate(opt.href);
      return;
    }
    if (!isAuthenticated) {
      openLogin();
      return;
    }
    navigate(`/account?tab=${opt.tab}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <motion.button
            type="button"
            aria-label="Close account menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="absolute inset-x-0 bottom-0 rounded-t-3xl border border-border/40 bg-[#f8f3e6] shadow-2xl"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-border" />
            <div className="flex items-center justify-between px-5 pb-2 pt-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald">
                  Account
                </p>
                <p className="text-base font-bold text-foreground">
                  {isAuthenticated ? user?.name || "My Account" : "Welcome to HIMU"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-muted-foreground hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 px-4 pb-4">
              {OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => go(opt)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-white px-4 py-3.5 text-left shadow-sm transition active:scale-[0.99]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-emerald">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-bold text-foreground">{opt.label}</span>
                  </button>
                );
              })}

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                    navigate("/");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-left"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <LogOut className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold text-red-700">Logout</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/products");
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-white px-4 py-3.5 text-left shadow-sm transition active:scale-[0.99]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-emerald">
                      <ShoppingBag className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-bold text-foreground">Browse products</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openLogin();
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3.5 text-left transition active:scale-[0.99]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <UserRound className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-bold text-emerald">Sign in</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
