import { Link } from "@/components/ui/link";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "@/components/ui/image";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Pill,
  Sparkles,
  Syringe,
  Layers,
  Activity,
  Droplet,
  ArrowRight,
  ShieldCheck,
  Heart,
  Sparkle,
  Info,
  Factory,
  BookOpen,
  Briefcase,
  ShoppingBag,
  LogIn,
  UserPlus,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NAV_LINKS } from "@/lib/constants";
import { products } from "@/data/products";
import { useCart } from "@/providers/cart-provider";
import { useAuth } from "@/providers/auth-provider";

const clinicalCategories = [
  { name: "Antibiotics", href: "/categories/antibiotics", icon: Pill },
  { name: "Dermatology", href: "/categories/dermatology", icon: Layers },
  { name: "Injectables", href: "/categories/injectables", icon: Syringe },
  { name: "Capsules", href: "/categories/capsules", icon: Pill },
  { name: "Tablets", href: "/categories/tablets", icon: Activity },
];

const wellnessCategories = [
  { name: "Skin Care", href: "/categories/skin-care", icon: Heart },
  { name: "Hair Care", href: "/categories/hair-care", icon: Sparkles },
  { name: "Cosmetics", href: "/categories/cosmetics", icon: Sparkle },
  { name: "Syrups", href: "/categories/syrups", icon: Droplet },
  { name: "Creams & Ointments", href: "/categories/creams", icon: ShieldCheck },
];

const aboutChildren = [
  { name: "About Us", href: "/about", icon: Info },
  { name: "Manufacturing", href: "/manufacturing", icon: Factory },
  { name: "Quality Assurance", href: "/quality", icon: ShieldCheck },
  { name: "News & Insights", href: "/news", icon: BookOpen },
  { name: "Careers", href: "/careers", icon: Briefcase },
];

export function Navbar() {
  const { cartCount, setCartOpen } = useCart();
  const { user, isAuthenticated, openLogin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const { pathname } = useLocation();
  const [mounted, setMounted] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const filteredProducts =
    searchQuery.trim() !== ""
      ? products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.composition.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 5)
      : [];

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setProductsOpen(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#fff8e7]/95 backdrop-blur-md border-b border-border/60 py-5 shadow-lg shadow-black/5">
        <nav
          className="container-custom flex items-center justify-between gap-2 xl:gap-4"
          aria-label="Main navigation"
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-16 w-56 xl:w-72 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
              <Image
                src="/logo.png"
                alt="HIMU Pharmacy Logo"
                fill
                className="object-contain scale-[4.8]"
                priority
              />
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-0 xl:gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                link.name === "Products" ? (
                  <div
                    key={link.name}
                    className="relative group/mega"
                    onMouseEnter={() => setProductsOpen(true)}
                    onMouseLeave={() => setProductsOpen(false)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-0.5 px-1.5 xl:px-3.5 py-2 rounded-lg text-xs xl:text-sm font-medium transition-colors whitespace-nowrap",
                        pathname.startsWith("/products") ||
                          pathname.startsWith("/categories")
                          ? "text-primary"
                          : "text-foreground hover:text-primary",
                      )}
                    >
                      {link.name}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          productsOpen && "rotate-180",
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {productsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          className="absolute left-1/2 -translate-x-1/2 mt-3 w-[760px] max-w-[90vw] bg-[#d2f2d4] rounded-3xl shadow-2xl p-5 grid grid-cols-12 gap-5 z-50 border border-[#b8dfba]"
                        >
                          {/* Featured Column (Left) */}
                          <div className="col-span-4 bg-primary text-primary-foreground p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-lg shadow-primary/20">
                            <div className="absolute inset-0 opacity-10 molecular-bg" />
                            <div className="relative z-10">
                              <span className="text-[9px] tracking-widest uppercase bg-white/20 text-white px-2.5 py-1 rounded-full font-bold">
                                Featured Portfolio
                              </span>
                              <h4 className="text-lg font-bold mt-4 font-[family-name:var(--font-heading)] leading-snug">
                                Quality Assured Medicines
                              </h4>
                              <p className="text-[11px] text-white/80 mt-2 leading-relaxed">
                                Over 500 WHO-GMP and ISO certified formulations
                                designed for global health.
                              </p>
                            </div>
                            <Link
                              href="/products"
                              onClick={() => setProductsOpen(false)}
                              className="relative z-10 mt-6 inline-flex items-center justify-between bg-secondary text-secondary-foreground px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all shadow-[0_3px_0_0_#9a7d1a] hover:shadow-[0_4px_0_0_#9a7d1a] hover:-translate-y-[0.5px] active:translate-y-[2px] active:shadow-[0_1px_0_0_#9a7d1a]"
                            >
                              Explore All Products
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                          {/* Column 2: Clinical Categories */}
                          <div className="col-span-4 flex flex-col gap-3">
                            <h5 className="font-bold text-[10px] text-primary uppercase tracking-wider pl-1.5">
                              Clinical Divisions
                            </h5>
                            <div className="grid gap-0.5">
                              {clinicalCategories.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setProductsOpen(false)}
                                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-primary/5 hover:translate-x-1 transition-all duration-200 group text-left"
                                  >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                      <Icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {item.name}
                                      </p>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                          {/* Column 3: Wellness & Care Categories */}
                          <div className="col-span-4 flex flex-col gap-3">
                            <h5 className="font-bold text-[10px] text-primary uppercase tracking-wider pl-1.5">
                              Wellness & Care
                            </h5>
                            <div className="grid gap-0.5">
                              {wellnessCategories.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setProductsOpen(false)}
                                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-primary/5 hover:translate-x-1 transition-all duration-200 group text-left"
                                  >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                      <Icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {item.name}
                                      </p>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setAboutOpen(true)}
                    onMouseLeave={() => setAboutOpen(false)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-0.5 px-2.5 xl:px-3.5 py-2 rounded-lg text-xs xl:text-sm font-medium transition-colors whitespace-nowrap",
                        pathname.startsWith("/about") ||
                          pathname.startsWith("/manufacturing") ||
                          pathname.startsWith("/quality") ||
                          pathname.startsWith("/news") ||
                          pathname.startsWith("/careers")
                          ? "text-primary"
                          : "text-foreground hover:text-primary",
                      )}
                    >
                      {link.name}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          aboutOpen && "rotate-180",
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {aboutOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 mt-3 w-64 bg-[#fff8e7] border border-border/60 rounded-2xl shadow-2xl p-2 grid gap-1 z-50"
                        >
                          {aboutChildren.map((child) => {
                            const Icon = child.icon;
                            return (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={() => setAboutOpen(false)}
                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-primary/10 transition-all duration-200 group text-left"
                              >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors whitespace-nowrap">
                                    {child.name}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-1.5 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-colors whitespace-nowrap",
                    pathname === link.href
                      ? "text-primary"
                      : "text-foreground hover:text-primary",
                  )}
                >
                  {link.name}
                </Link>
              ),
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg transition-colors hover:bg-muted text-foreground cursor-pointer"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 rounded-lg transition-colors hover:bg-muted text-foreground relative cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center border-2 border-[#fff8e7] dark:border-[#0a1410] animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div
                className="relative hidden md:block"
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary/10"
                >
                  <User className="h-4 w-4" />
                  <span className="max-w-[90px] truncate">{user?.name?.split(" ")[0]}</span>
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-border/60 bg-[#fff8e7] p-2 shadow-xl"
                    >
                      <p className="truncate px-3 py-2 text-[11px] text-muted-foreground">
                        {user?.email}
                      </p>
                      <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-500/10"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden items-center gap-1.5 md:flex">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={openLogin}
                  className="gap-1.5 px-3"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Login
                </Button>
                <Link href="/signup">
                  <Button size="sm" variant="outline" className="gap-1.5 px-3">
                    <UserPlus className="h-3.5 w-3.5" />
                    Signup
                  </Button>
                </Link>
              </div>
            )}

            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="container-custom pb-4 relative"
            >
              <div className="relative">
                <form action="/products" method="get" className="flex gap-2">
                  <Input
                    name="q"
                    placeholder="Search medicines, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="glass h-12 text-base px-4"
                    autoComplete="off"
                  />
                  <Button type="submit" className="h-12">
                    Search
                  </Button>
                </form>
                {/* Suggestions Dropdown */}
                {searchQuery.trim().length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 z-50 glass border border-border/80 rounded-2xl shadow-2xl overflow-hidden p-2">
                    {filteredProducts.length > 0 ? (
                      <div className="grid gap-1">
                        {filteredProducts.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/10 transition-colors group"
                          >
                            <div className="text-left">
                              <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                {product.composition} • {product.strength}
                              </p>
                            </div>
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                              {product.category}
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No medicines found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-80 max-w-full glass shadow-2xl p-6 pt-20 overflow-y-auto">
              <div className="mb-4 space-y-2 border-b border-border/40 pb-4">
                {isAuthenticated ? (
                  <>
                    <p className="px-2 text-sm font-bold text-foreground">{user?.name}</p>
                    <p className="px-2 text-xs text-muted-foreground">{user?.email}</p>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        openLogin();
                        setMobileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </button>
                    <Link
                      href="/signup"
                      className="flex w-full items-center gap-2 rounded-xl border border-primary/30 px-4 py-3 text-sm font-bold text-primary"
                    >
                      <UserPlus className="h-4 w-4" />
                      Signup
                    </Link>
                  </>
                )}
              </div>
              <div className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.name}>
                    <Link
                      href={link.href}
                      className="block px-4 py-3 rounded-xl text-base font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                    {link.children && (
                      <div className="ml-4 space-y-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
