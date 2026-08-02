import { Download, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ORDER_STATUSES } from "@/admin/constants";
import { cn } from "@/lib/utils";

export function OrdersPanel({
  filteredOrders,
  orderSearch,
  setOrderSearch,
  orderStatusFilter,
  setOrderStatusFilter,
  handleUpdateStatus,
  setSelectedOrder,
  selectedOrders,
  toggleOrderSelection,
  toggleSelectAllOrders,
  handleBulkStatus,
  exportOrders,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search order ID, customer, phone..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-input bg-transparent px-3 text-sm"
          >
            <option value="all">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedOrders.length > 0 && (
            <>
              <Button size="sm" variant="outline" onClick={() => handleBulkStatus("Shipped")}>
                Mark Shipped ({selectedOrders.length})
              </Button>
              <Button size="sm" onClick={() => handleBulkStatus("Delivered")}>
                Mark Delivered
              </Button>
            </>
          )}
          <Button variant="outline" onClick={exportOrders} className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-sm text-muted-foreground">
                No orders match your filters.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border/20 bg-muted/30 font-semibold text-muted-foreground">
                    <th className="p-4">
                      <input
                        type="checkbox"
                        checked={
                          filteredOrders.length > 0 &&
                          selectedOrders.length === filteredOrders.length
                        }
                        onChange={toggleSelectAllOrders}
                      />
                    </th>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-center">Qty</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/10">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                        />
                      </td>
                      <td className="p-4 font-bold">{order.id}</td>
                      <td className="p-4">
                        <div className="font-semibold">{order.customer.name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {order.customer.phone}
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{order.date}</td>
                      <td className="p-4 text-center font-bold">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </td>
                      <td className="p-4 font-bold text-primary">₹{order.total}</td>
                      <td className="p-4 text-[10px] font-black uppercase text-muted-foreground">
                        {order.paymentMethod}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className={cn(
                            "cursor-pointer rounded-lg border px-2.5 py-1.5 text-[10px] font-black uppercase",
                            order.status === "Delivered"
                              ? "border-emerald/45 bg-emerald/5 text-emerald"
                              : order.status === "Shipped"
                                ? "border-primary/45 bg-primary/5 text-primary"
                                : order.status === "Cancelled"
                                  ? "border-[var(--c-peach)]/50 bg-[var(--c-peach)]/15 text-[var(--c-peach)]"
                                  : "border-[var(--c-peach)]/40 bg-[var(--c-lime)]/40 text-[var(--c-peach)]",
                          )}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-lg bg-primary/10 p-1.5 text-primary hover:bg-primary hover:text-[var(--c-lime)]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
