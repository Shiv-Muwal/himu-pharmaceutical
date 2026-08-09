import { useState } from "react";
import { FolderPlus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function CategoriesPanel({
  categories,
  onAddCategory,
  onRemoveCategory,
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter a category name");
      return;
    }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setError("This category already exists");
      return;
    }
    onAddCategory(trimmed);
    setName("");
    setError("");
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-3xl border border-border/30 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border/20 p-5">
          <FolderPlus className="h-5 w-5 text-emerald" />
          <div>
            <h3 className="text-sm font-bold">Product categories</h3>
            <p className="text-[11px] text-muted-foreground">
              Add categories here, then choose them when creating products.
            </p>
          </div>
        </div>
        <CardContent className="space-y-4 p-5">
          <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Skin Care, Hair Care"
              className="flex-1"
            />
            <Button type="submit" className="gap-2">
              <Plus className="h-4 w-4" />
              Add category
            </Button>
          </form>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}

          <div className="space-y-2">
            {categories.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border/50 p-6 text-center text-xs text-muted-foreground">
                No categories yet. Add “Skin Care” to get started.
              </p>
            ) : (
              categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between rounded-2xl border border-border/40 bg-white/70 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-bold text-foreground">{category}</p>
                    <p className="text-[10px] text-muted-foreground">
                      /categories/{category.toLowerCase().replace(/\s+/g, "-")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveCategory(category)}
                    className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                    title="Remove category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
