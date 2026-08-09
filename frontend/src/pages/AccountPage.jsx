import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  History,
  LogOut,
  MapPin,
  Package,
  TicketPercent,
  Truck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { getStoredOrders } from "@/lib/customer-orders";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "history", label: "History", icon: History },
];

function formatOrderTime(order) {
  if (order?.createdAt) {
    try {
      return new Date(order.createdAt).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      /* fall through */
    }
  }
  return order?.date || "—";
}

function formatAddress(customer = {}) {
  return [customer.address, customer.city, customer.pincode]
    .filter(Boolean)
    .join(", ");
}

export default function AccountPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();
  const [orders, setOrders] = useState([]);

  const tab = params.get("tab") || "profile";

  useEffect(() => {
    const all = getStoredOrders();
    const email = user?.email?.toLowerCase();
    if (!email) {
      setOrders(all);
      return;
    }
    setOrders(
      all.filter((o) => o.customer?.email?.toLowerCase() === email),
    );
  }, [tab, user?.email]);

  const list = useMemo(() => {
    if (tab === "orders") {
      return orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled");
    }
    if (tab === "history") return orders;
    return [];
  }, [orders, tab]);

  return (
    <div className="section-padding">
      <div className="container-custom max-w-3xl">
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald">
            My Account
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold md:text-3xl">
            Hello{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-border/50 bg-white p-1.5 dark:bg-card">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setParams({ tab: item.id })}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-[11px] font-bold transition sm:flex-row sm:justify-center sm:text-sm",
                  active ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {tab === "profile" && (
          <div className="space-y-4 rounded-3xl border border-border/50 bg-white p-5 shadow-sm dark:bg-card">
            {!isAuthenticated ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Sign in from a product's Buy button to view your profile and orders.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-lg font-black text-emerald">
                    {(user.name || "H").slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-bold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#f8f3e6] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald">
                      Phone
                    </p>
                    <p className="mt-1 font-semibold">{user.phone || "Not added"}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f8f3e6] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald">
                      Orders
                    </p>
                    <p className="mt-1 font-semibold">{orders.length} placed</p>
                  </div>
                </div>
                {orders[0]?.customer && formatAddress(orders[0].customer) && (
                  <div className="rounded-2xl bg-[#f3f7f0] p-3 text-sm">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald">
                      Last delivery address
                    </p>
                    <p className="mt-1 font-semibold leading-relaxed">
                      {formatAddress(orders[0].customer)}
                    </p>
                  </div>
                )}
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </div>
        )}

        {(tab === "orders" || tab === "history") && (
          <div className="space-y-3">
            {!list.length ? (
              <div className="rounded-3xl border border-dashed border-border/60 bg-white py-14 text-center dark:bg-card">
                <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="font-semibold text-foreground">
                  {tab === "orders" ? "No active orders" : "No order history yet"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Shop HIMU products and your orders will show here.
                </p>
                <Button className="mt-4" onClick={() => navigate("/products")}>
                  Purchase now
                </Button>
              </div>
            ) : (
              list.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl border border-border/50 bg-white p-4 shadow-sm dark:bg-card"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-foreground">Order {order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatOrderTime(order)}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald">
                      {order.status || "Pending"}
                    </span>
                  </div>

                  <div className="mb-3 space-y-1.5">
                    {(order.items || []).slice(0, 3).map((item, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        {item.name} × {item.quantity}
                      </p>
                    ))}
                  </div>

                  {formatAddress(order.customer) && (
                    <div className="mb-3 flex gap-2 rounded-xl bg-[#f3f7f0] px-3 py-2.5 text-xs">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                      <div>
                        <p className="font-bold text-emerald">Delivery address</p>
                        <p className="mt-0.5 leading-relaxed text-foreground">
                          {formatAddress(order.customer)}
                        </p>
                        {order.customer?.phone && (
                          <p className="mt-1 text-muted-foreground">
                            Phone: {order.customer.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-xl bg-[#f3f7f0] px-3 py-2 text-xs">
                      <Truck className="h-4 w-4 text-emerald" />
                      <div>
                        <p className="font-bold text-emerald">Expected</p>
                        <p className="text-foreground">
                          {order.expectedDelivery || "5–7 days"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-[#fff8e8] px-3 py-2 text-xs">
                      <TicketPercent className="h-4 w-4 text-[#8a7020]" />
                      <div>
                        <p className="font-bold text-[#8a7020]">
                          {order.paymentMethod
                            ? `Pay · ${String(order.paymentMethod).toUpperCase()}`
                            : "Coupon"}
                        </p>
                        <p className="font-black tracking-wide text-foreground">
                          {order.couponCode || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-right text-sm font-black text-emerald">
                    ₹{order.total}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
