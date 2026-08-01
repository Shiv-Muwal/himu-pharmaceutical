import { useState, useMemo, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  X,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "./product-card";
import { FadeIn } from "@/components/animations/Motion-components";
import { categories } from "@/data/categories";
import { getMockProducts } from "@/lib/mock-backend";
import {
  BUDGET_RANGES,
  collectFilterFacets,
  filterProducts,
} from "@/lib/product-search";

const ITEMS_PER_PAGE = 12;

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/50 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-bold text-foreground">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function CheckRow({ checked, onChange, label, count }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 text-sm transition hover:bg-muted/50">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-border accent-primary"
      />
      <span className="flex-1 text-foreground/90">{label}</span>
      {typeof count === "number" && (
        <span className="text-[11px] font-semibold text-muted-foreground">{count}</span>
      )}
    </label>
  );
}

export function ProductCatalog({
  products,
  initialCategory = "",
  initialSearch = "",
}) {
  const [localProducts, setLocalProducts] = useState(products);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [sort, setSort] = useState(initialSearch ? "relevance" : "name-asc");
  const [page, setPage] = useState(1);
  const [gridCols, setGridCols] = useState(3);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setLocalProducts(getMockProducts());
  }, []);

  useEffect(() => {
    setSearch(initialSearch);
    setCategory(initialCategory);
    setSort(initialSearch ? "relevance" : "name-asc");
    setPage(1);
  }, [initialSearch, initialCategory]);

  const facets = useMemo(() => collectFilterFacets(localProducts), [localProducts]);

  const filtered = useMemo(
    () =>
      filterProducts(localProducts, {
        search,
        category,
        brands,
        types,
        budgets,
        sort,
      }),
    [localProducts, search, category, brands, types, budgets, sort],
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const toggle = (list, value, setter) => {
    setter(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
    setPage(1);
  };

  const clearFilters = () => {
    setBrands([]);
    setTypes([]);
    setBudgets([]);
    setCategory("");
    setSearch("");
    setSort("name-asc");
    setPage(1);
  };

  const activeCount =
    brands.length +
    types.length +
    budgets.length +
    (category ? 1 : 0) +
    (search ? 1 : 0);

  const filterPanel = (
    <div className="space-y-1">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
          Filters
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Budget">
        {BUDGET_RANGES.map((range) => (
          <CheckRow
            key={range.id}
            label={range.label}
            checked={budgets.includes(range.id)}
            onChange={() => toggle(budgets, range.id, setBudgets)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Brand">
        {facets.brands.map((brand) => (
          <CheckRow
            key={brand.name}
            label={brand.name}
            count={brand.count}
            checked={brands.includes(brand.name)}
            onChange={() => toggle(brands, brand.name, setBrands)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Product type">
        {facets.types.map((type) => (
          <CheckRow
            key={type.name}
            label={type.name}
            count={type.count}
            checked={types.includes(type.name)}
            onChange={() => toggle(types, type.name, setTypes)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Category" defaultOpen={false}>
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 text-sm transition hover:bg-muted/50">
          <input
            type="radio"
            name="category"
            checked={!category}
            onChange={() => {
              setCategory("");
              setPage(1);
            }}
            className="h-4 w-4 accent-primary"
          />
          <span>All categories</span>
        </label>
        {categories.map((c) => (
          <label
            key={c.slug}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 text-sm transition hover:bg-muted/50"
          >
            <input
              type="radio"
              name="category"
              checked={category === c.slug}
              onChange={() => {
                setCategory(c.slug);
                setPage(1);
              }}
              className="h-4 w-4 accent-primary"
            />
            <span>{c.name}</span>
          </label>
        ))}
      </FilterSection>
    </div>
  );

  return (
    <div>
      <div className="mb-6 space-y-4 rounded-2xl border border-border/40 bg-white/80 p-4 shadow-sm md:p-5 dark:bg-card/80">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search anything — face cleaner, acne, serum, amoxi..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSort("relevance");
                setPage(1);
              }}
              className="h-11 pl-10"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 gap-2 lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeCount > 0 && (
                <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
                  {activeCount}
                </span>
              )}
            </Button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 rounded-xl border border-border bg-background/50 px-4 text-sm"
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="rating">Top rated</option>
              <option value="category">Category</option>
            </select>
            <Button
              variant="outline"
              size="icon"
              className="hidden h-11 w-11 sm:inline-flex"
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

        {(search || activeCount > 0) && (
          <div className="flex flex-wrap items-center gap-2">
            {search && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                “{search}”
                <button type="button" onClick={() => setSearch("")} aria-label="Remove search">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {brands.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold"
              >
                {b}
                <button type="button" onClick={() => toggle(brands, b, setBrands)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {types.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold"
              >
                {t}
                <button type="button" onClick={() => toggle(types, t, setTypes)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {budgets.map((id) => {
              const range = BUDGET_RANGES.find((r) => r.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold"
                >
                  {range?.label || id}
                  <button type="button" onClick={() => toggle(budgets, id, setBudgets)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          {filtered.length} products found
          {search ? ` for “${search}”` : ""}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-24 hidden h-fit rounded-2xl border border-border/40 bg-white p-4 shadow-sm lg:block dark:bg-card">
          {filterPanel}
        </aside>

        <div>
          {paginated.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 py-20 text-center">
              <p className="text-lg text-muted-foreground">
                No products found matching your criteria.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try “face cleaner”, “acne”, “serum”, or clear filters.
              </p>
              <Button className="mt-5" variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${
                gridCols === 3 ? "xl:grid-cols-3" : "xl:grid-cols-4"
              }`}
            >
              {paginated.map((product, i) => (
                <FadeIn key={product.id} delay={Math.min(i * 0.04, 0.24)}>
                  <ProductCard product={product} />
                </FadeIn>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
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
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-card">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold">
                Filters
              </h3>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="rounded-full p-2 hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterPanel}
            <Button className="mt-4 h-11 w-full" onClick={() => setFiltersOpen(false)}>
              Show {filtered.length} products
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
