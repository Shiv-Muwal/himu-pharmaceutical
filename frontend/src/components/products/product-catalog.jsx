import { useState, useMemo, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { FadeIn } from "@/components/animations/motion-components";
import { categories } from "@/data/categories";
import {
  BUDGET_RANGES,
  collectFilterFacets,
  filterProducts,
} from "@/lib/product-search";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : true,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

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
  const isMobile = useIsMobile();

  useEffect(() => {
    setLocalProducts(Array.isArray(products) ? products : []);
  }, [products]);

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
  // Mobile: load all products on one page (no page numbers)
  const visibleProducts = isMobile
    ? filtered
    : filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald">
          Filters
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-emerald hover:underline"
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
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-24 hidden h-fit rounded-2xl border border-border/40 bg-white p-4 shadow-sm lg:block dark:bg-card">
          {filterPanel}
        </aside>

        <div>
          {visibleProducts.length === 0 ? (
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
            <div className="grid grid-cols-2 gap-2.5 sm:gap-5 xl:grid-cols-3">
              {visibleProducts.map((product, i) => (
                <FadeIn key={product.id} delay={Math.min(i * 0.03, 0.2)}>
                  <ProductCard product={product} compact />
                </FadeIn>
              ))}
            </div>
          )}

          {!isMobile && totalPages > 1 && (
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
    </div>
  );
}
