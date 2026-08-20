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
  ImageIcon,
  Newspaper,
  Tags,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SIDEBAR_TABS } from "@/admin/constants";
import { AdminLogo } from "@/admin/components/AdminLogo";
import { getStorefrontUrl } from "@/lib/api-base";

const ICONS = {
  overview: LayoutDashboard,
  products: Pill,
  categories: Tags,
  inventory: Warehouse,
  orders: ClipboardList,
  customers: Users,
  banners: ImageIcon,
  blogs: Newspaper,
  jobs: Briefcase,
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
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col justify-between border-r border-[#14532D]/15 bg-gradient-to-b from-[#BBF7D0] via-[#d8f8e2] to-[#f8f3e6] text-[#14532D] transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="border-b border-[#14532D]/10 p-5">
          <div className="mb-4 flex items-center justify-center">
            <AdminLogo
              size="md"
              className="mx-auto drop-shadow-[0_2px_10px_rgba(20,83,45,0.15)]"
            />
          </div>
          <div className="text-center text-[10px] font-black tracking-[0.25em] text-[#166534]">
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
                    ? "border-[#d6b04d]/50 bg-[#14532D] text-[#f8f3e6] shadow-lg shadow-[#14532D]/20"
                    : "border-transparent text-[#14532D]/75 hover:bg-white/60 hover:text-[#14532D]",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold">{tab.label}</span>
                  <span
                    className={cn(
                      "block text-[10px]",
                      active ? "text-[#BBF7D0]/90" : "text-[#14532D]/45",
                    )}
                  >
                    {tab.hint}
                  </span>
                </span>
                {badge > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-black",
                      active
                        ? "bg-[#d6b04d] text-[#14532D]"
                        : "bg-[#166534] text-white",
                    )}
                  >
                    {badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-[#14532D]/10 p-4">
          <a
            href={getStorefrontUrl()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#14532D]/15 bg-white/50 px-3 py-2.5 text-xs font-bold text-[#14532D] hover:bg-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Storefront
          </a>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="h-11 w-full gap-2 border-[#14532D]/15 bg-transparent text-xs text-[#14532D] hover:border-[#14532D]/30 hover:bg-white/70 hover:text-[#14532D]"
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
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#14532D]/10 bg-[#BBF7D0] px-4 text-[#14532D] lg:hidden">
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="rounded-lg p-1.5 hover:bg-white/50"
      >
        <Grid className="h-6 w-6" />
      </button>
      <AdminLogo size="sm" />
      <span className="w-6" aria-hidden />
    </header>
  );
}
