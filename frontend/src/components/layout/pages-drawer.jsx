import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Factory,
  HelpCircle,
  Info,
  LogOut,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
  X,
  Award,
  FileText,
  Scale,
  AlertTriangle,
} from "lucide-react";
import { Link } from "@/components/ui/link";
import { useAuth } from "@/providers/AuthProvider";

const PAGE_SECTIONS = [
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about", icon: Info },
      { name: "Manufacturing", href: "/manufacturing", icon: Factory },
      { name: "Quality Assurance", href: "/quality", icon: ShieldCheck },
      { name: "Certifications", href: "/certifications", icon: Award },
      { name: "Careers", href: "/careers", icon: Briefcase },
    ],
  },
  {
    title: "More",
    links: [
      { name: "Contact", href: "/contact", icon: Mail },
      { name: "FAQ", href: "/faq", icon: HelpCircle },
      { name: "Privacy Policy", href: "/privacy", icon: FileText },
      { name: "Terms of Use", href: "/terms", icon: Scale },
      { name: "Disclaimer", href: "/disclaimer", icon: AlertTriangle },
    ],
  },
];

export function PagesDrawer({ open, onClose }) {
  const { user, isAuthenticated, logout, openLogin } = useAuth();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute right-0 top-0 flex h-full w-[min(20rem,88vw)] flex-col border-l border-border/40 bg-[#f8f3e6] shadow-2xl"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex items-center justify-between border-b border-border/40 px-4 py-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald">
                  Menu
                </p>
                <p className="text-base font-bold text-foreground">Explore HIMU</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-muted-foreground hover:bg-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2 border-b border-border/40 px-4 py-4">
                {isAuthenticated ? (
                  <>
                    <p className="truncate text-sm font-bold text-foreground">
                      {user?.name || "My Account"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                    <Link
                      href="/account"
                      onClick={onClose}
                      className="mt-2 flex w-full items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-bold text-emerald"
                    >
                      <User className="h-4 w-4" />
                      My account
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Sign in or create an account to manage orders faster.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        openLogin();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
                    >
                      <User className="h-4 w-4" />
                      Login
                    </button>
                    <Link
                      href="/signup"
                      onClick={onClose}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 px-4 py-3 text-sm font-bold text-emerald"
                    >
                      <UserPlus className="h-4 w-4" />
                      Signup
                    </Link>
                  </>
                )}
              </div>

              {PAGE_SECTIONS.map((section) => (
                <div key={section.title} className="px-3 py-3">
                  <p className="px-2 pb-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                    {section.title}
                  </p>
                  <div className="space-y-0.5">
                    {section.links.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={onClose}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition hover:bg-primary/10 hover:text-emerald"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-emerald" />
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
