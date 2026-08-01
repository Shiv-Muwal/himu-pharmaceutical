import { NavLink, useNavigate } from "react-router-dom";
import { Home, ShoppingBag, ShoppingCart, UserRound, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";

const TABS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/products", label: "Shop", icon: ShoppingBag },
  { id: "cart", label: "Cart", icon: ShoppingCart, isCart: true },
  { to: "/news", label: "Blogs", icon: Newspaper },
  { id: "account", label: "Account", icon: UserRound, isAccount: true },
];

export function MobileAppNav() {
  const navigate = useNavigate();
  const { cartCount, setCartOpen } = useCart();
  const { isAuthenticated, openLogin } = useAuth();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/50 bg-[#f8f3e6]/95 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="App navigation"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 px-1 pt-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;

          if (tab.isCart) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-semibold text-muted-foreground"
              >
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/25">
                  <Icon className="h-4 w-4" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-black text-[#1a2e1f]">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </span>
                {tab.label}
              </button>
            );
          }

          if (tab.isAccount) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (isAuthenticated) navigate("/signup");
                  else openLogin();
                }}
                className="flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-semibold text-muted-foreground"
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          }

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-semibold transition",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
