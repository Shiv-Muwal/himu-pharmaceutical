import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Pill,
  ClipboardList,
  Settings,
  LogOut,
  Grid,
  Warehouse,
  Users,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SIDEBAR_TABS } from "@/admin/constants";
import { AdminLogo } from "@/admin/components/AdminLogo";

const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL || "http://localhost:5173";

const ICONS = {
  overview: LayoutDashboard,
  products: Pill,
  inventory: Warehouse,
  orders: ClipboardList,
  customers: Users,
  settings: Settings,
};

export function AdminSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  handleLogout,
  stats,
}) {
  const badges = {
    orders: stats?.pendingOrders || 0,
    inventory: stats?.lowStockCount || 0,
  };

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col justify-between border-r border-white/10 bg-gradient-to-b from-[#072016] via-[#0b5d3b] to-[#053527] text-white transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="border-b border-white/10 p-5">
          <div className="mb-4 flex items-center justify-center rounded-2xl bg-white/95 p-2">
            <AdminLogo size="md" className="mx-auto" />
          </div>
          <div className="text-center text-[10px] font-black tracking-[0.25em] text-[#d4af37]">
            ADMIN CONTROL
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {SIDEBAR_TABS.map((tab, index) => {
            const Icon = ICONS[tab.id];
            const active = activeTab === tab.id;
            const badge = badges[tab.id];
            return (
              <motion.button
                key={tab.id}
                type="button"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * index }}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left transition-all",
                  active
                    ? "border-[#d4af37]/40 bg-[#fff8e7] text-[#0b5d3b] shadow-lg shadow-black/20"
                    : "border-transparent text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold">{tab.label}</span>
                  <span
                    className={cn(
                      "block text-[10px]",
                      active ? "text-[#0b5d3b]/70" : "text-white/40",
                    )}
                  >
                    {tab.hint}
                  </span>
                </span>
                {badge > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-black",
                      active ? "bg-primary text-white" : "bg-[#d4af37] text-[#06150f]",
                    )}
                  >
                    {badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-white/10 p-4">
          <a
            href={STOREFRONT_URL}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-xs font-bold text-white/80 hover:bg-white/10"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Storefront
          </a>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="h-11 w-full gap-2 border-white/15 bg-transparent text-xs text-white hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}

export function AdminMobileHeader({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-[#072016] px-4 text-white lg:hidden">
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="rounded-lg p-1.5 hover:bg-white/10"
      >
        <Grid className="h-6 w-6" />
      </button>
      <AdminLogo size="sm" className="bg-white" />
      <AdminLogo markOnly size="sm" />
    </header>
  );
}
