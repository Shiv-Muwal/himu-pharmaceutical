import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CATEGORIES_LIST } from "@/admin/constants";

export function ProductModal({
  isOpen,
  onClose,
  editingProduct,
  productForm,
  setProductForm,
  formErrors,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <button type="button" className="fixed inset-0 bg-[var(--c-peach)]/55 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border/40 bg-[#eef8cd] text-xs shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/30 p-6">
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold">
            {editingProduct ? "Modify Product Details" : "Add New Product"}
          </h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-primary/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Product Name *
              </label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                className={formErrors.name ? "border-[var(--c-peach)]" : ""}
              />
              {formErrors.name && <p className="mt-1 text-[10px] text-ink-accent">{formErrors.name}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Category *
              </label>
              <select
                value={productForm.category}
                onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))}
                className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm"
              >
                {CATEGORIES_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Composition *
              </label>
              <Input
                value={productForm.composition}
                onChange={(e) => setProductForm((p) => ({ ...p, composition: e.target.value }))}
                className={formErrors.composition ? "border-[var(--c-peach)]" : ""}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Strength / Volume *
              </label>
              <Input
                value={productForm.strength}
                onChange={(e) => setProductForm((p) => ({ ...p, strength: e.target.value }))}
                className={formErrors.strength ? "border-[var(--c-peach)]" : ""}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Price (₹) *
              </label>
              <Input
                type="number"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm((p) => ({ ...p, price: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Compare-At Price
              </label>
              <Input
                type="number"
                value={productForm.compareAtPrice}
                onChange={(e) =>
                  setProductForm((p) => ({ ...p, compareAtPrice: Number(e.target.value) }))
                }
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Stock Quantity *
            </label>
            <Input
              type="number"
              value={productForm.stock}
              onChange={(e) =>
                setProductForm((p) => ({ ...p, stock: Number(e.target.value) }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Image Preset
              </label>
              <select
                value={productForm.imageKey}
                onChange={(e) => setProductForm((p) => ({ ...p, imageKey: e.target.value }))}
                className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="cream">Cream / Ointment</option>
                <option value="skincare">Skincare</option>
                <option value="cosmetic">Cosmetics</option>
                <option value="haircare">Haircare</option>
                <option value="capsule">Capsules</option>
                <option value="tablet">Tablets</option>
                <option value="syrup">Syrup</option>
                <option value="injectable">Injectable</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Packaging
              </label>
              <Input
                value={productForm.packaging}
                onChange={(e) => setProductForm((p) => ({ ...p, packaging: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Short Description *
            </label>
            <Input
              value={productForm.shortDescription}
              onChange={(e) =>
                setProductForm((p) => ({ ...p, shortDescription: e.target.value }))
              }
              className={formErrors.shortDescription ? "border-[var(--c-peach)]" : ""}
            />
            {formErrors.submit && (
              <p className="mt-2 text-xs text-ink-accent" role="alert">
                {formErrors.submit}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Detailed Description
            </label>
            <Textarea
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Storage
              </label>
              <Input
                value={productForm.storage}
                onChange={(e) => setProductForm((p) => ({ ...p, storage: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Shelf Life
              </label>
              <Input
                value={productForm.shelfLife}
                onChange={(e) => setProductForm((p) => ({ ...p, shelfLife: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-border/30 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{editingProduct ? "Save Changes" : "Create Product"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export function OrderDetailModal({ order, onClose, handleUpdateStatus }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <button type="button" className="fixed inset-0 bg-[var(--c-peach)]/55 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border/40 bg-[#eef8cd] text-xs shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/30 p-5">
          <h3 className="font-[family-name:var(--font-heading)] text-base font-bold">
            Order: {order.id}
          </h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-primary/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-muted-foreground">Date & Time</p>
              <p className="mt-0.5 text-sm font-bold">{order.date}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Status</p>
              <select
                value={order.status}
                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                className="mt-1 flex h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-xs"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="space-y-2 rounded-2xl border border-border/10 bg-muted/40 p-4">
            <h4 className="mb-2 text-[9px] font-bold uppercase tracking-wider text-ink-accent">
              Customer
            </h4>
            <p className="font-bold">{order.customer.name}</p>
            <p className="text-muted-foreground">{order.customer.phone}</p>
            <p>{order.customer.email}</p>
            <p>
              {order.customer.address}, {order.customer.city} - {order.customer.pincode}
            </p>
          </div>
          <div>
            <h4 className="mb-2 text-[9px] font-bold uppercase tracking-wider text-ink-accent">
              Items
            </h4>
            <div className="divide-y divide-border/20 overflow-hidden rounded-2xl border border-border/30">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-bold">{item.productName}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.selectedVariant} · Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-ink-accent">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-end justify-between border-t border-border/20 pt-4">
            <div>
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">Payment</p>
              <p className="mt-0.5 font-bold uppercase">{order.paymentMethod}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase text-muted-foreground">Total</p>
              <p className="font-[family-name:var(--font-heading)] text-lg font-black text-ink-accent">
                ₹{order.total}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-border/20 bg-muted/10 p-4">
          <Button onClick={onClose}>Done</Button>
        </div>
      </Card>
    </div>
  );
}
