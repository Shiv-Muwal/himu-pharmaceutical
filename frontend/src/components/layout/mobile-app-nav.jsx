import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, ShoppingBag, ShoppingCart, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/CartProvider";
import { PagesDrawer } from "@/components/layout/pages-drawer";

const TABS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/products", label: "Shop", icon: ShoppingBag },
  { id: "search", label: "Search", icon: Search, isSearch: true },
  { id: "cart", label: "Cart", icon: ShoppingCart, isCart: true },
  { id: "more", label: "More", icon: Menu, isMore: true },
];

export function MobileAppNav() {
  const { cartCount, setCartOpen } = useCart();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/50 bg-[#f8f3e6]/95 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="App navigation"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 px-1 pt-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;

            if (tab.isSearch) {
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-search"))}
                  className="relative flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-semibold text-muted-foreground"
                >
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                    <Icon className="h-4 w-4" />
                  </span>
                  {tab.label}
                </button>
              );
            }

            if (tab.isMore) {
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMoreOpen(true)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-semibold",
                    moreOpen ? "text-emerald" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            }

            if (tab.isCart) {
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCartOpen(true)}
                  className="relative flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-semibold text-muted-foreground"
                >
                  <span className="relative">
                    <Icon className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-black text-[#1a2e1f]">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </span>
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
                    isActive ? "text-emerald" : "text-muted-foreground",
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

      <PagesDrawer open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
