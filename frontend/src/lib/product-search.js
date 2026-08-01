/** Synonyms / related terms so casual searches still hit products. */
const SYNONYM_GROUPS = [
  ["face cleaner", "face cleanser", "cleanser", "cleaner", "face wash", "facial wash", "wash", "cleansing", "clenzer", "clensing", "clkinger", "facecleaner", "facewash"],
  ["moisturizer", "moisturiser", "moisturizing", "moisturising", "lotion", "cream", "hydrate", "hydration", "dry skin"],
  ["serum", "essence", "glow", "radiance", "brightening", "vitamin c"],
  ["acne", "pimple", "pimples", "spots", "breakout", "anti acne"],
  ["sunscreen", "sun shield", "spf", "sunblock", "uv"],
  ["shampoo", "scalp", "dandruff", "hair wash"],
  ["hair", "hairfall", "hair fall", "hair growth", "keratin"],
  ["antibiotic", "antibiotics", "infection", "bacterial"],
  ["fungal", "antifungal", "fungus", "ringworm"],
  ["eczema", "dermatitis", "itchy skin", "rash"],
  ["psoriasis", "psora", "plaque"],
  ["ointment", "topical", "cream gel"],
  ["syrup", "liquid", "pediatric"],
  ["injectable", "injection", "vial"],
  ["tablet", "tablets", "pill", "pills"],
  ["capsule", "capsules", "softgel"],
  ["vitamin", "multivitamin", "supplement", "wellness"],
  ["derma", "dermatology", "skin", "skincare", "skin care", "cosmetic", "cosmetics"],
  ["pain", "analgesic", "relief"],
  ["himu", "himu pharmacy", "brand himu"],
];

const BUDGET_RANGES = [
  { id: "0-199", label: "Under ₹200", min: 0, max: 199 },
  { id: "200-399", label: "₹200 – ₹399", min: 200, max: 399 },
  { id: "400-599", label: "₹400 – ₹599", min: 400, max: 599 },
  { id: "600-999", label: "₹600 – ₹999", min: 600, max: 999 },
  { id: "1000+", label: "₹1000 & above", min: 1000, max: Infinity },
];

export { BUDGET_RANGES };

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(query) {
  return normalize(query)
    .split(" ")
    .filter((t) => t.length > 1);
}

function addAliasParts(expanded, alias) {
  expanded.add(alias);
  normalize(alias)
    .split(" ")
    .filter((part) => part.length >= 4)
    .forEach((part) => expanded.add(part));
}

function expandTerms(terms) {
  const expanded = new Set(terms);
  for (const term of terms) {
    for (const group of SYNONYM_GROUPS) {
      const hit = group.some(
        (alias) =>
          alias === term ||
          (term.length >= 4 && alias.includes(term)) ||
          (alias.length >= 4 && term.includes(alias)) ||
          levenshteinClose(term, alias),
      );
      if (hit) group.forEach((alias) => addAliasParts(expanded, alias));
    }
  }

  // Also expand multi-word query as a whole phrase against synonym groups
  const phrase = terms.join(" ");
  if (phrase) {
    for (const group of SYNONYM_GROUPS) {
      if (
        group.some(
          (alias) =>
            phrase.includes(alias) ||
            alias.includes(phrase) ||
            levenshteinClose(phrase, alias),
        )
      ) {
        group.forEach((alias) => addAliasParts(expanded, alias));
      }
    }
  }

  return [...expanded];
}

/** Tiny fuzzy helper for typos like "clkinger" ≈ "cleanser". */
function levenshteinClose(a, b) {
  if (!a || !b) return false;
  if (Math.abs(a.length - b.length) > 3) return false;
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  const dist = dp[m][n];
  const maxLen = Math.max(m, n);
  return dist <= (maxLen <= 5 ? 2 : 3);
}

function productSearchText(product) {
  return normalize(
    [
      product.name,
      product.brand,
      product.productType,
      product.category,
      product.categorySlug,
      product.composition,
      product.shortDescription,
      product.description,
      product.strength,
      product.manufacturer,
      ...(product.tags || []),
      ...(product.keywords || []),
    ].join(" "),
  );
}

export function scoreProductMatch(product, query) {
  const q = normalize(query);
  if (!q) return 1;

  const terms = tokenize(q);
  const expanded = expandTerms(terms);
  const haystack = productSearchText(product);
  let score = 0;

  if (haystack.includes(q)) score += 120;

  for (const term of terms) {
    if (haystack.includes(term)) score += 40;
    else if (expanded.some((alias) => alias !== term && haystack.includes(alias))) {
      score += 28;
    } else if (
      haystack.split(" ").some((word) => levenshteinClose(word, term))
    ) {
      score += 18;
    }
  }

  for (const alias of expanded) {
    if (alias.length < 3) continue;
    if (haystack.includes(alias)) score += 8;
  }

  // Soft category boost for skin-related casual searches
  const skinish = expanded.some((t) =>
    ["cleanser", "face", "skin", "serum", "moisturizer", "acne", "derma"].includes(t),
  );
  if (
    skinish &&
    ["dermatology", "skin-care", "cosmetics", "creams", "ointments"].includes(
      product.categorySlug,
    )
  ) {
    score += 12;
  }

  return score;
}

export function searchProductsSmart(products, query, { limit } = {}) {
  const q = normalize(query);
  if (!q) return [...products];

  const ranked = products
    .map((product) => ({ product, score: scoreProductMatch(product, q) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .map((row) => row.product);

  // If nothing matched (typo / random term), still surface related shop picks
  const resolved =
    ranked.length > 0
      ? ranked
      : [...products]
          .sort(
            (a, b) =>
              Number(DERMA_BOOST[b.categorySlug] || 0) -
                Number(DERMA_BOOST[a.categorySlug] || 0) ||
              (Number(b.rating) || 0) - (Number(a.rating) || 0),
          );

  return typeof limit === "number" ? resolved.slice(0, limit) : resolved;
}

const DERMA_BOOST = {
  dermatology: 3,
  "skin-care": 3,
  cosmetics: 2,
  creams: 2,
  ointments: 2,
  "hair-care": 1,
};

export function filterProducts(products, filters = {}) {
  const {
    search = "",
    category = "",
    brands = [],
    types = [],
    budgets = [],
    sort = "relevance",
  } = filters;

  let result = search
    ? searchProductsSmart(products, search)
    : [...products];

  if (category) {
    result = result.filter((p) => p.categorySlug === category);
  }

  if (brands.length) {
    const set = new Set(brands.map((b) => b.toLowerCase()));
    result = result.filter((p) => set.has(String(p.brand || "").toLowerCase()));
  }

  if (types.length) {
    const set = new Set(types.map((t) => t.toLowerCase()));
    result = result.filter((p) => set.has(String(p.productType || "").toLowerCase()));
  }

  if (budgets.length) {
    result = result.filter((p) => {
      const price = Number(p.price) || 0;
      return budgets.some((id) => {
        const range = BUDGET_RANGES.find((r) => r.id === id);
        if (!range) return false;
        return price >= range.min && price <= range.max;
      });
    });
  }

  switch (sort) {
    case "price-asc":
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case "price-desc":
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case "name-asc":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "rating":
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "category":
      result.sort((a, b) => a.category.localeCompare(b.category));
      break;
    default:
      // relevance: keep search ranking; otherwise name
      if (!search) result.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return result;
}

export function collectFilterFacets(products) {
  const brands = new Map();
  const types = new Map();

  products.forEach((p) => {
    const brand = p.brand || "HIMU";
    brands.set(brand, (brands.get(brand) || 0) + 1);
    const type = p.productType || "General";
    types.set(type, (types.get(type) || 0) + 1);
  });

  return {
    brands: [...brands.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    types: [...types.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
  };
}
