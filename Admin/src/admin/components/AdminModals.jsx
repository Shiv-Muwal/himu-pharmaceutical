import { useRef, useState } from "react";
import { Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { adminSession, mediaUrl, uploadApi } from "@/lib/api";

export function ProductModal({
  isOpen,
  onClose,
  editingProduct,
  productForm,
  setProductForm,
  formErrors,
  onSubmit,
  categoriesList = ["Skin Care"],
}) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  if (!isOpen) return null;

  const gallery = Array.isArray(productForm.images) ? productForm.images.filter(Boolean) : [];

  const updateIngredient = (index, field, value) => {
    setProductForm((prev) => {
      const ingredients = [...(prev.ingredients || [])];
      ingredients[index] = { ...ingredients[index], [field]: value };
      return { ...prev, ingredients };
    });
  };

  const addIngredient = () => {
    setProductForm((prev) => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), { name: "", blurb: "" }],
    }));
  };

  const removeIngredient = (index) => {
    setProductForm((prev) => ({
      ...prev,
      ingredients: (prev.ingredients || []).filter((_, i) => i !== index),
    }));
  };

  const removeImage = (index) => {
    setProductForm((prev) => {
      const images = (prev.images || []).filter((_, i) => i !== index);
      return {
        ...prev,
        images,
        image: images[0] || "",
      };
    });
  };

  const setPrimaryImage = (index) => {
    setProductForm((prev) => {
      const images = [...(prev.images || [])];
      const [picked] = images.splice(index, 1);
      const next = [picked, ...images].filter(Boolean);
      return { ...prev, images: next, image: next[0] || "" };
    });
  };

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    setUploadError("");
    if (!files.length) return;

    const token = adminSession.get();
    if (!token) {
      setUploadError("Please sign in again to upload");
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const okExt = /\.(jpe?g|png|webp)$/i.test(file.name);
        const okType =
          !file.type ||
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type);
        if (!okExt || !okType) {
          throw new Error(
            "Only JPG, PNG, or WebP allowed. iPhone Live/HEIC photos: export as JPG first.",
          );
        }
        if (file.size > 8 * 1024 * 1024) {
          throw new Error("Each image must be 8MB or smaller");
        }
        const formData = new FormData();
        formData.append("image", file);
        const result = await uploadApi("/products/upload", formData, { token });
        if (result?.url) uploaded.push(result.url);
      }
      setProductForm((prev) => {
        const images = [...(prev.images || []), ...uploaded].filter(Boolean);
        return {
          ...prev,
          images,
          image: prev.image || images[0] || "",
        };
      });
    } catch (error) {
      setUploadError(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <button type="button" className="fixed inset-0 bg-[var(--c-peach)]/55 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border/40 bg-[#eef8cd] text-xs shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/30 p-5">
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold">
            {editingProduct ? "Modify Product Details" : "Add New Product"}
          </h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-primary/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex-1 space-y-5 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Product Name *</label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))}
                className={formErrors.name ? "border-[var(--c-peach)]" : ""}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Category *</label>
              <select
                value={productForm.category}
                onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))}
                className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm"
              >
                {categoriesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Composition *</label>
              <Input
                value={productForm.composition}
                onChange={(e) => setProductForm((p) => ({ ...p, composition: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Strength / Volume *</label>
              <Input
                value={productForm.strength}
                onChange={(e) => setProductForm((p) => ({ ...p, strength: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="hidden">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Price (₹) *</label>
              <Input
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm((p) => ({ ...p, price: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">MRP / Selling Price (₹) *</label>
              <Input
                type="number"
                value={productForm.compareAtPrice}
                onChange={(e) => setProductForm((p) => ({ ...p, compareAtPrice: Number(e.target.value) }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Stock *</label>
              <Input
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm((p) => ({ ...p, stock: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border/40 bg-white/60 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-foreground">Product images</p>
                <p className="text-[10px] text-muted-foreground">Upload JPG/PNG/WebP. First image is the main photo.</p>
              </div>
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  {uploading ? "Uploading..." : "Upload images"}
                </Button>
              </div>
            </div>

            {uploadError && <p className="mb-2 text-[11px] text-ink-accent">{uploadError}</p>}
            {formErrors.images && (
              <p className="mb-2 text-[11px] text-ink-accent">{formErrors.images}</p>
            )}

            {gallery.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {gallery.map((src, index) => (
                  <div key={`${src}-${index}`} className="relative overflow-hidden rounded-xl border border-border/40 bg-[#f7faf8]">
                    <img src={mediaUrl(src)} alt="" className="h-24 w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/45 p-1">
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className="flex-1 rounded bg-white/90 px-1 py-0.5 text-[9px] font-bold text-emerald"
                      >
                        {index === 0 ? "Main" : "Set main"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="rounded bg-red-500/90 px-1.5 py-0.5 text-white"
                        aria-label="Remove image"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 px-4 py-8 text-center text-[11px] text-muted-foreground">
                No images yet — upload product photos here.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Packaging</label>
              <Input
                value={productForm.packaging}
                onChange={(e) => setProductForm((p) => ({ ...p, packaging: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Variant / Pack name</label>
              <Input
                value={productForm.variantName}
                onChange={(e) => setProductForm((p) => ({ ...p, variantName: e.target.value }))}
                placeholder="50g Pump"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Short Description *</label>
            <Input
              value={productForm.shortDescription}
              onChange={(e) => setProductForm((p) => ({ ...p, shortDescription: e.target.value }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Detailed Description</label>
            <Textarea
              rows={3}
              value={productForm.description}
              onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="rounded-2xl border border-border/40 bg-white/60 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide">Key ingredients</p>
                <p className="text-[10px] text-muted-foreground">Name + short benefit line shown on product page</p>
              </div>
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addIngredient}>
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {(productForm.ingredients || []).map((item, index) => (
                <div key={index} className="grid grid-cols-[1fr_1.4fr_auto] gap-2">
                  <Input
                    placeholder="Niacinamide"
                    value={item.name || ""}
                    onChange={(e) => updateIngredient(index, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Evens tone & barrier support"
                    value={item.blurb || ""}
                    onChange={(e) => updateIngredient(index, "blurb", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    aria-label="Remove ingredient"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Why you&apos;ll love it (one benefit per line)
            </label>
            <Textarea
              rows={5}
              value={productForm.benefitsText}
              onChange={(e) => setProductForm((p) => ({ ...p, benefitsText: e.target.value }))}
              placeholder={"Broad-spectrum SPF 50 PA+++ UV protection\nLightweight milky texture..."}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Highlight chips (one per line)
            </label>
            <Textarea
              rows={3}
              value={productForm.highlightsText}
              onChange={(e) => setProductForm((p) => ({ ...p, highlightsText: e.target.value }))}
              placeholder={"SPF 50 PA+++\nNon-greasy\nUV Shield\nNo white cast"}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Trust tags (one per line)
            </label>
            <Textarea
              rows={3}
              value={productForm.tagsText}
              onChange={(e) => setProductForm((p) => ({ ...p, tagsText: e.target.value }))}
              placeholder={"Paraben free\nSulphate free\nCruelty free\nAll skin types"}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">
              Uses (one per line)
            </label>
            <Textarea
              rows={3}
              value={productForm.usesText}
              onChange={(e) => setProductForm((p) => ({ ...p, usesText: e.target.value }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Dosage / How to use</label>
            <Textarea
              rows={2}
              value={productForm.dosage}
              onChange={(e) => setProductForm((p) => ({ ...p, dosage: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Storage</label>
              <Input
                value={productForm.storage}
                onChange={(e) => setProductForm((p) => ({ ...p, storage: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Shelf Life</label>
              <Input
                value={productForm.shelfLife}
                onChange={(e) => setProductForm((p) => ({ ...p, shelfLife: e.target.value }))}
              />
            </div>
          </div>

          {formErrors.submit && (
            <p className="text-xs text-ink-accent" role="alert">{formErrors.submit}</p>
          )}

          <div className="flex justify-end gap-3 border-t border-border/30 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{editingProduct ? "Save Changes" : "Create Product"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export function OrderDetailModal({ order, onClose, handleUpdateStatus }) {
  if (!order) return null;

  const customer = order.customer || {};
  const fullAddress = [customer.address, customer.city, customer.pincode]
    .filter(Boolean)
    .join(", ");

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
        <div className="space-y-3 overflow-y-auto p-5">
          <div className="rounded-xl border border-border/40 bg-white/70 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Order time
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {order.date || "—"}
            </p>
            {order.createdAt && (
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {new Date(order.createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border/40 bg-white/70 p-3 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Customer details
            </p>
            <p className="text-sm font-bold">{customer.name || "—"}</p>
            <p className="text-xs text-muted-foreground">{customer.email || "—"}</p>
            <p className="text-xs text-muted-foreground">{customer.phone || "—"}</p>
            <div className="mt-2 rounded-lg bg-[#f8f3e6] p-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald">
                Delivery address
              </p>
              <p className="mt-1 text-xs leading-relaxed text-foreground">
                {fullAddress || "Address not provided"}
              </p>
            </div>
          </div>

          <div className="space-y-1 rounded-xl border border-border/40 bg-white/70 p-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Items
            </p>
            {(order.items || []).map((item, i) => (
              <div key={i} className="flex justify-between gap-2 text-xs">
                <span>
                  {item.productName} × {item.quantity}
                  {item.selectedVariant ? (
                    <span className="text-muted-foreground"> · {item.selectedVariant}</span>
                  ) : null}
                </span>
                <span>₹{(item.price || 0) * (item.quantity || 0)}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/40 bg-white/70 px-3 py-2.5">
            <span className="text-xs text-muted-foreground">Payment</span>
            <span className="text-xs font-black uppercase">{order.paymentMethod || "—"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold">Total</span>
            <span className="font-black text-emerald">₹{order.total}</span>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Status</label>
            <select
              value={order.status}
              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
              className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
            >
              {["Pending", "Shipped", "Delivered", "Cancelled"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}
