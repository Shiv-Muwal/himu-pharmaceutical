import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function AnalyticsPanel({
  stats,
  monthlyStats,
  categoryBreakdown,
  paymentBreakdown,
  topProducts,
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Gross Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}` },
          { label: "Avg Order Value", value: `₹${stats.avgOrderValue}` },
          { label: "Delivery Rate", value: `${stats.conversionRate}%` },
          { label: "Cancelled", value: stats.cancelledOrders },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Card className="rounded-3xl border border-border/30 bg-white/90 shadow-sm">
              <CardContent className="p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-black text-primary">
                  {item.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border border-border/30 shadow-sm">
          <div className="border-b border-border/20 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wide">Monthly Revenue</h3>
          </div>
          <CardContent className="space-y-4 p-5">
            {monthlyStats.map((ms, i) => (
              <div key={ms.month} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{ms.month}</span>
                  <span className="text-primary">
                    ₹{ms.revenue.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#0b5d3b] via-emerald-500 to-[#d4af37]"
                    initial={{ width: 0 }}
                    animate={{ width: `${ms.percentage}%` }}
                    transition={{ duration: 0.7, delay: 0.05 * i }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border/30 shadow-sm">
          <div className="border-b border-border/20 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wide">Catalog Mix</h3>
          </div>
          <CardContent className="space-y-3 p-5">
            {categoryBreakdown.map((cat, i) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{cat.name}</span>
                  <span>
                    {cat.count} · {cat.percentage}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ delay: 0.04 * i }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border/30 shadow-sm">
          <div className="border-b border-border/20 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wide">Payment Methods</h3>
          </div>
          <CardContent className="grid gap-3 p-5 sm:grid-cols-3">
            {paymentBreakdown.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-border/30 bg-muted/30 p-4 text-center"
              >
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  {p.name}
                </p>
                <p className="mt-2 text-xl font-black text-foreground">{p.count}</p>
                <p className="text-[10px] text-primary">{p.percentage}%</p>
              </div>
            ))}
            {paymentBreakdown.length === 0 && (
              <p className="col-span-3 text-xs text-muted-foreground">No payment data yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-border/30 shadow-sm">
          <div className="border-b border-border/20 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wide">Best Sellers</h3>
          </div>
          <CardContent className="p-0">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/20 bg-muted/30 text-muted-foreground">
                  <th className="p-4">Product</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {topProducts.map((p) => (
                  <tr key={p.name}>
                    <td className="p-4 font-semibold">{p.name}</td>
                    <td className="p-4">{p.qty}</td>
                    <td className="p-4 font-bold text-primary">₹{p.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
