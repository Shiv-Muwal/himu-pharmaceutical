import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, Grid3X3, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { FadeIn } from "@/components/animations/motion-components";
import { categories } from "@/data/categories";
import { getMockProducts } from "@/lib/mock-backend";

const ITEMS_PER_PAGE = 12;

export function ProductCatalog({
  products,
  initialCategory = "",
  initialSearch = "",
}) {
  const [localProducts, setLocalProducts] = useState(products);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("name-asc");
  const [page, setPage] = useState(1);
  const [gridCols, setGridCols] = useState(3);

  useEffect(() => {
    setLocalProducts(getMockProducts());
  }, []);

  useEffect(() => {
    setSearch(initialSearch);
    setCategory(initialCategory);
    setPage(1);
  }, [initialSearch, initialCategory]);

  const filtered = useMemo(() => {
    let result = [...localProducts];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.composition.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    if (category) {
      result = result.filter((p) => p.categorySlug === category);
    }
    switch (sort) {
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "category":
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [localProducts, search, category, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div>
      <div className="glass rounded-2xl p-4 md:p-6 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-border bg-background/50 px-4 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 rounded-xl border border-border bg-background/50 px-4 text-sm"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="category">Category</option>
            </select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setGridCols(gridCols === 3 ? 4 : 3)}
            >
              {gridCols === 3 ? (
                <LayoutGrid className="h-4 w-4" />
              ) : (
                <Grid3X3 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            {filtered.length} products found
          </span>
        </div>
      </div>
      {paginated.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">
            No products found matching your criteria.
          </p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-6`}
        >
          {paginated.map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.05}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
