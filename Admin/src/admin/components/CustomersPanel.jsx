import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function CustomersPanel({
  filteredCustomers,
  customerSearch,
  setCustomerSearch,
  exportCustomers,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={exportCustomers} className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-3xl border border-border/30 shadow-sm">
          <CardContent className="p-5">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Total Buyers</p>
            <p className="mt-2 text-2xl font-black">{filteredCustomers.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border border-border/30 shadow-sm">
          <CardContent className="p-5">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Repeat Buyers</p>
            <p className="mt-2 text-2xl font-black">
              {filteredCustomers.filter((c) => c.ordersCount > 1).length}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border border-border/30 shadow-sm">
          <CardContent className="p-5">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Lifetime Value</p>
            <p className="mt-2 text-2xl font-black text-ink-accent">
              ₹
              {filteredCustomers
                .reduce((sum, c) => sum + (c.totalSpent || 0), 0)
                .toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm">
        <CardContent className="p-0">
          {filteredCustomers.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No customers found yet.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/20 bg-muted/30 text-muted-foreground">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Orders</th>
                  <th className="p-4">Spent</th>
                  <th className="p-4">Last Order</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/10">
                    <td className="p-4">
                      <p className="font-bold">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground">{c.email}</p>
                    </td>
                    <td className="p-4">{c.phone}</td>
                    <td className="p-4">{c.city}</td>
                    <td className="p-4 font-bold">{c.ordersCount}</td>
                    <td className="p-4 font-bold text-ink-accent">
                      ₹{(c.totalSpent || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="p-4 text-muted-foreground">{c.lastOrder}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-emerald/10 px-2 py-0.5 text-[9px] font-black uppercase text-emerald">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
