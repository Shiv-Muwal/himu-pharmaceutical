import { Download, Plus, Search, Edit, Trash2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LOW_STOCK_THRESHOLD } from "@/admin/constants";
import { cn } from "@/lib/utils";

export function ProductsPanel({
  searchProduct,
  setSearchProduct,
  productCategoryFilter,
  setProductCategoryFilter,
  filteredProducts,
  handleOpenAddModal,
  handleOpenEditModal,
  handleDeleteProduct,
  exportProducts,
  categoriesList = ["Skin Care"],
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={productCategoryFilter}
            onChange={(e) => setProductCategoryFilter(e.target.value)}
            className="h-11 rounded-xl border border-input bg-transparent px-3 text-sm"
          >
            <option value="all">All categories</option>
            {categoriesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportProducts} className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button onClick={handleOpenAddModal} className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-sm text-muted-foreground">
                No products match your criteria.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-border/20 bg-muted/30 font-semibold text-muted-foreground">
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-muted/10">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border/20 bg-muted">
                            <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-xs truncate font-bold">{prod.name}</p>
                            <p className="truncate text-[10px] text-muted-foreground">
                              {prod.composition}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="gold" className="px-2 py-0.5 text-[9px]">
                          {prod.category}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-black",
                            Number(prod.stock) <= LOW_STOCK_THRESHOLD
                              ? "bg-[var(--c-peach)]/25 text-ink-accent"
                              : "bg-emerald/10 text-emerald",
                          )}
                        >
                          {prod.stock ?? 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-ink-accent">₹{prod.price}</div>
                        {prod.compareAtPrice && (
                          <div className="text-[10px] text-muted-foreground line-through">
                            ₹{prod.compareAtPrice}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(prod)}
                            className="rounded-lg bg-primary/10 p-1.5 text-ink-accent hover:bg-primary hover:text-foreground"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="rounded-lg bg-[var(--c-peach)]/25 p-1.5 text-ink-accent hover:bg-[var(--c-peach)] hover:text-foreground"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
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

export function InventoryPanel({ lowStockProducts, products, handleUpdateStock, handleOpenEditModal }) {
  const sorted = [...products].sort((a, b) => Number(a.stock) - Number(b.stock));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-3xl border border-border/30 bg-[var(--c-lime)] shadow-sm">
          <CardContent className="p-5">
            <p className="text-[10px] font-black uppercase text-muted-foreground">SKU Count</p>
            <p className="mt-2 text-2xl font-black">{products.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border border-[var(--c-peach)]/30 bg-[var(--c-peach)]/15 shadow-sm">
          <CardContent className="p-5">
            <p className="text-[10px] font-black uppercase text-ink-accent">Low Stock</p>
            <p className="mt-2 text-2xl font-black text-ink-accent">{lowStockProducts.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border border-emerald/20 bg-emerald/5 shadow-sm">
          <CardContent className="p-5">
            <p className="text-[10px] font-black uppercase text-emerald">Healthy</p>
            <p className="mt-2 text-2xl font-black text-emerald">
              {products.length - lowStockProducts.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm">
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/20 bg-muted/30 text-muted-foreground">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stock Qty</th>
                <th className="p-4">Add Stock</th>
                <th className="p-4">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {sorted.map((prod) => (
                <tr key={prod.id} className="hover:bg-muted/10">
                  <td className="p-4 font-bold">{prod.name}</td>
                  <td className="p-4">{prod.category}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-black",
                        Number(prod.stock) <= LOW_STOCK_THRESHOLD
                          ? "bg-[var(--c-peach)]/25 text-ink-accent"
                          : "bg-emerald/10 text-emerald",
                      )}
                    >
                      {prod.stock ?? 0} units
                    </span>
                  </td>
                  <td className="p-4">
                    <Button
                      size="sm"
                      className="gap-1.5"
                      onClick={() => {
                        const raw = window.prompt(
                          `Add stock for “${prod.name}”\nCurrent: ${prod.stock ?? 0} units\nEnter quantity to add:`,
                          "50",
                        );
                        if (raw == null) return;
                        const qty = Number.parseInt(String(raw).trim(), 10);
                        if (!Number.isFinite(qty) || qty <= 0) {
                          window.alert("Enter a valid positive number.");
                          return;
                        }
                        handleUpdateStock(prod, Number(prod.stock || 0) + qty);
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add stock
                    </Button>
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(prod)}
                      className="rounded-lg bg-primary/10 p-1.5 text-ink-accent"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
