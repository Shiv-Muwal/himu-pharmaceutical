const KEY = "himu-customer-orders";

export function getStoredOrders() {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveCustomerOrder(order) {
  if (!order?.id) return;
  const prev = getStoredOrders().filter((o) => o.id !== order.id);
  const next = [order, ...prev].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
