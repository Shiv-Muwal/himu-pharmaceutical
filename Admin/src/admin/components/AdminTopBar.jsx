import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { AdminLogo } from "@/admin/components/AdminLogo";
import { cn } from "@/lib/utils";

export function AdminTopBar({
  globalQuery,
  setGlobalQuery,
  globalResults,
  setActiveTab,
  setSelectedOrder,
  notifications,
  notificationsOpen,
  setNotificationsOpen,
  handleRefresh,
  refreshing,
}) {
  return (
    <div className="sticky top-0 z-20 border-b border-border/30 bg-[#f8f3e6]/90 px-4 py-3 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <div className="hidden xl:block">
          <AdminLogo size="md" />
        </div>

        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalQuery}
            onChange={(e) => setGlobalQuery(e.target.value)}
            placeholder="Search products, orders, customers..."
            className="h-11 rounded-2xl border-border/40 bg-white/80 pl-10"
          />
          <AnimatePresence>
            {globalQuery.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-2xl border border-border/40 bg-white shadow-2xl"
              >
                {globalResults.length === 0 ? (
                  <p className="p-4 text-xs text-muted-foreground">No matches found</p>
                ) : (
                  globalResults.map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.tab);
                        if (item.order) setSelectedOrder(item.order);
                        setGlobalQuery("");
                      }}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-xs hover:bg-primary/5"
                    >
                      <span className="font-semibold text-foreground">{item.label}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold uppercase text-muted-foreground">
                        {item.type}
                      </span>
                    </button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="rounded-xl border border-border/40 bg-white p-2.5 text-muted-foreground transition hover:text-primary"
          title="Refresh data"
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded-xl border border-border/40 bg-white p-2.5 text-muted-foreground transition hover:text-primary"
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
                {notifications.length}
              </span>
            )}
          </button>
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-12 z-30 w-80 overflow-hidden rounded-2xl border border-border/40 bg-white shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wide">Notifications</p>
                  <button type="button" onClick={() => setNotificationsOpen(false)}>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-xs text-muted-foreground">All clear for now</p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          n.action?.();
                          setNotificationsOpen(false);
                        }}
                        className="block w-full border-b border-border/20 px-4 py-3 text-left hover:bg-muted/40"
                      >
                        <p className="text-xs font-bold text-foreground">{n.title}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">{n.body}</p>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
