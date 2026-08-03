const MILKY_IMAGES = [
  "/products/milky-sunscreen/hero.png?v=2",
  "/products/milky-sunscreen/lifestyle.png",
  "/products/milky-sunscreen/studio.png",
  "/products/milky-sunscreen/beach.png",
  "/products/milky-sunscreen/texture.png",
];

export const milkySunscreenProduct = {
  productId: "prod-001",
  id: "prod-001",
  slug: "milky-sunscreen-spf-50",
  name: "Milky Sunscreen SPF 50",
  brand: "",
  productType: "sunscreen",
  tags: ["Paraben free", "Sulphate free", "Cruelty free", "All skin types"],
  keywords: [
    "sunscreen",
    "spf 50",
    "pa+++",
    "milky sunscreen",
    "niacinamide",
    "rice water",
    "hyaluronic acid",
    "vitamin c",
    "skin care",
    "uv shield",
  ],
  category: "Skin Care",
  categorySlug: "skin-care",
  shortDescription:
    "Lightweight, non-greasy broad-spectrum SPF 50 PA+++ milky sunscreen for face & body with Niacinamide, Rice Water, Hyaluronic Acid and Vitamin C.",
  description:
    "Milky Sunscreen SPF 50 is a daily broad-spectrum sunscreen for face and body. Its lightweight milky texture absorbs quickly, leaves no white cast, and helps protect skin from UVA and UVB rays. Enriched with Niacinamide, Rice Water, Hyaluronic Acid and Vitamin C for hydration, brighter-looking skin and barrier support. Dermatologically recommended. Paraben free, sulphate free, cruelty free and suitable for all skin types.",
  composition:
    "Niacinamide + Rice Water, Hyaluronic Acid + Vitamin C (Broad Spectrum SPF 50 PA+++)",
  strength: "50g (1.76 oz.)",
  manufacturer: "",
  image: MILKY_IMAGES[0],
  images: MILKY_IMAGES,
  highlights: [
    { label: "SPF 50 PA+++" },
    { label: "Non-greasy" },
    { label: "UV Shield" },
    { label: "No white cast" },
  ],
  ingredients: [
    { name: "Niacinamide", blurb: "Evens tone & barrier support" },
    { name: "Rice Water", blurb: "Brightens skin texture" },
    { name: "Hyaluronic Acid", blurb: "Deep hydration" },
    { name: "Vitamin C", blurb: "Antioxidant glow" },
  ],
  benefits: [
    "Broad-spectrum SPF 50 PA+++ UV protection",
    "Lightweight milky texture that absorbs quickly",
    "Non-greasy finish with no white cast",
    "Hydrates and brightens with Hyaluronic Acid & Vitamin C",
    "Helps even skin tone with Niacinamide & Rice Water",
  ],
  uses: [
    "Apply as the last step of morning skincare before sun exposure",
    "Suitable for face and body",
    "Reapply every 2–3 hours during prolonged outdoor activity",
    "Use daily for healthy, glowing protected skin",
  ],
  indications: [
    "Daily sun protection for face and body",
    "Helps defend against UVA and UVB rays",
    "Supports hydration and brighter-looking skin",
  ],
  dosage:
    "Apply a generous amount evenly on face and exposed body areas 15 minutes before sun exposure. Reapply after swimming, sweating or towel drying.",
  administration:
    "Shake gently if needed. Dispense with the pump and massage until fully absorbed. For best results, use after moisturizer and before makeup.",
  precautions: [
    "For external use only",
    "Avoid contact with eyes; rinse thoroughly if contact occurs",
    "Discontinue use if irritation develops",
    "Keep out of reach of children",
  ],
  warnings: [
    "Not a substitute for protective clothing in extreme sun",
    "Patch test recommended for sensitive skin",
    "Store away from direct sunlight and heat",
  ],
  sideEffects: [
    "Mild temporary tingling may occur on very sensitive skin",
    "Stop use and consult a dermatologist if irritation persists",
  ],
  storage: "Store in a cool, dry place away from direct sunlight. Do not freeze.",
  packaging: "50g pump bottle with protective clear cap",
  shelfLife: "24 months from manufacture when stored as directed",
  variants: [{ name: "50g Pump", strength: "50g" }],
  faq: [
    {
      question: "What is Milky Sunscreen SPF 50?",
      answer:
        "It is a lightweight, non-greasy broad-spectrum sunscreen for face and body with SPF 50 PA+++, enriched with Niacinamide, Rice Water, Hyaluronic Acid and Vitamin C.",
    },
    {
      question: "Does it leave a white cast?",
      answer:
        "No. The milky texture is designed to absorb quickly and leave a fresh, non-greasy finish without a white cast.",
    },
    {
      question: "Is it suitable for all skin types?",
      answer:
        "Yes. It is dermatologically recommended and formulated to be suitable for all skin types.",
    },
    {
      question: "What are the key ingredients?",
      answer:
        "Niacinamide and Rice Water help brighten and support the skin barrier, while Hyaluronic Acid hydrates and Vitamin C provides antioxidant brightening support.",
    },
  ],
  relatedSlugs: ["porcelyn-night-cream", "lumeva-melasma-cream"],
  price: 499,
  compareAtPrice: 699,
  stock: 150,
  featured: true,
  active: true,
  rating: 4.8,
  reviewCount: 42,
};

export const MILKY_SUNSCREEN_IMAGE_PRESETS = {
  "milky-hero": MILKY_IMAGES[0],
  "milky-lifestyle": MILKY_IMAGES[1],
  "milky-studio": MILKY_IMAGES[2],
  "milky-beach": MILKY_IMAGES[3],
  "milky-texture": MILKY_IMAGES[4],
};
