import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Package,
  RefreshCw,
  ChevronRight,
  Eye,
  Users,
  TrendingUp,
  AlertTriangle,
  Truck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TIMEFRAME_FILTERS } from "@/admin/constants";

const statusTone = (status) =>
  status === "Delivered"
    ? "bg-emerald/10 text-emerald"
    : status === "Shipped"
      ? "bg-primary/10 text-primary"
      : status === "Cancelled"
        ? "bg-red-500/10 text-red-500"
        : "bg-amber-500/10 text-amber-500";

export function OverviewPanel({
  timeFilter,
  setTimeFilter,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  stats,
  monthlyStats,
  filteredOrders,
  topProducts,
  lowStockProducts,
  activity,
  setActiveTab,
  setSelectedOrder,
  handleOpenAddModal,
}) {
  const cards = [
    {
      label: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      desc: "Delivered orders",
      icon: DollarSign,
      accent: "from-emerald-500/20 to-emerald-500/5 text-emerald-700",
    },
    {
      label: "Orders",
      value: stats.totalOrders,
      desc: `${stats.pendingOrders} pending`,
      icon: ShoppingBag,
      accent: "from-primary/20 to-primary/5 text-primary",
    },
    {
      label: "AOV",
      value: `₹${stats.avgOrderValue}`,
      desc: `${stats.conversionRate}% delivered`,
      icon: TrendingUp,
      accent: "from-[#d4af37]/25 to-[#d4af37]/5 text-[#9a7d1a]",
    },
    {
      label: "Customers",
      value: stats.customersCount,
      desc: `${stats.totalProductsCount} products`,
      icon: Users,
      accent: "from-teal-500/20 to-teal-500/5 text-teal-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border/30 bg-white/80 p-4 shadow-sm backdrop-blur md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2">
          {TIMEFRAME_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setTimeFilter(filter.id)}
              className={cn(
                "rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all",
                timeFilter === filter.id
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border/30 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
        {timeFilter === "custom" && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="h-8 w-32 px-2 py-1 text-xs"
            />
            <Input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="h-8 w-32 px-2 py-1 text-xs"
            />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setActiveTab("orders")}>
            <Truck className="h-3.5 w-3.5" /> Dispatch
          </Button>
          <Button size="sm" onClick={handleOpenAddModal}>
            <Package className="h-3.5 w-3.5" /> Add Product
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card
                className={cn(
                  "overflow-hidden rounded-3xl border-0 bg-gradient-to-br shadow-md",
                  stat.accent,
                )}
              >
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider opacity-70">
                      {stat.label}
                    </p>
                    <h3 className="mt-1.5 font-[family-name:var(--font-heading)] text-2xl font-black text-foreground">
                      {stat.value}
                    </h3>
                    <p className="mt-1 text-[10px] opacity-70">{stat.desc}</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm xl:col-span-4">
          <div className="border-b border-border/20 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wide">Revenue Pulse</h3>
            <p className="mt-0.5 text-[10px] text-muted-foreground">5-month trend</p>
          </div>
          <CardContent className="space-y-4 p-5">
            {monthlyStats.map((ms, i) => (
              <div key={ms.month} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{ms.month}</span>
                  <span className="font-bold text-primary">
                    ₹{ms.revenue.toLocaleString("en-IN")} · {ms.orders}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-[#d4af37]"
                    initial={{ width: 0 }}
                    animate={{ width: `${ms.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.08 * i }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm xl:col-span-5">
          <div className="flex items-center justify-between border-b border-border/20 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wide">Recent Orders</h3>
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className="flex items-center gap-0.5 text-xs font-bold text-primary hover:underline"
            >
              All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <CardContent className="p-0">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No orders in this window.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/20 bg-muted/30 font-semibold text-muted-foreground">
                      <th className="p-4">Order</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {filteredOrders.slice(0, 6).map((order) => (
                      <tr key={order.id} className="hover:bg-muted/10">
                        <td className="p-4 font-bold">{order.id}</td>
                        <td className="p-4 font-semibold">{order.customer.name}</td>
                        <td className="p-4 font-bold text-primary">₹{order.total}</td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase",
                              statusTone(order.status),
                            )}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="rounded-lg bg-primary/10 p-1.5 text-primary hover:bg-primary hover:text-white"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6 xl:col-span-3">
          <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm">
            <div className="border-b border-border/20 p-4">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                Low Stock
              </h3>
            </div>
            <CardContent className="space-y-2 p-3">
              {lowStockProducts.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveTab("inventory")}
                  className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left hover:bg-muted/40"
                >
                  <span className="truncate text-xs font-semibold">{p.name}</span>
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-black text-red-500">
                    {p.stock}
                  </span>
                </button>
              ))}
              {lowStockProducts.length === 0 && (
                <p className="p-2 text-xs text-muted-foreground">Inventory healthy</p>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm">
            <div className="border-b border-border/20 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wide">Top Sellers</h3>
            </div>
            <CardContent className="space-y-2 p-3">
              {topProducts.slice(0, 4).map((p, i) => (
                <div key={p.name} className="flex items-center gap-2 rounded-xl px-2 py-1.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-black text-primary">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {p.qty} sold · ₹{p.revenue}
                    </p>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p className="p-2 text-xs text-muted-foreground">No sales yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/20 p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <RefreshCw className="h-4 w-4 text-primary" />
            Activity Feed
          </h3>
        </div>
        <CardContent className="p-0">
          {activity.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              Actions you take will appear here.
            </p>
          ) : (
            <div className="divide-y divide-border/20">
              {activity.slice(0, 8).map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                  <p className="text-xs font-semibold text-foreground">{item.message}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(item.at).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
