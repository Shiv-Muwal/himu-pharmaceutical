const LUMEVA_IMAGES = [
  "/product-media/lumeva-melasma-cream/hero.png?v=2",
  "/product-media/lumeva-melasma-cream/box.png",
  "/product-media/lumeva-melasma-cream/angle.png",
  "/product-media/lumeva-melasma-cream/texture.png",
  "/product-media/lumeva-melasma-cream/hand.png",
];

export const lumevaMelasmaCreamProduct = {
  productId: "prod-003",
  id: "prod-003",
  slug: "lumeva-melasma-cream",
  name: "Lumeva Melasma Cream",
  brand: "Lumeva",
  productType: "melasma cream",
  tags: ["Paraben free", "Sulphate free", "Cruelty free", "All skin types"],
  keywords: [
    "lumeva",
    "melasma",
    "pigmentation",
    "dark spots",
    "skin brightening",
    "melasma cream",
    "pigmentation control",
  ],
  category: "Skin Care",
  categorySlug: "skin-care",
  shortDescription:
    "Targeted cream for melasma and pigmentation control — dermatologically recommended, 50g.",
  description:
    "Lumeva Melasma Cream is formulated for melasma and pigmentation control. Its lightweight cream texture helps support a more even-looking complexion with consistent use. Dermatologically recommended and suitable for all skin types. Pack size 50g (1.76 oz.).",
  composition: "Melasma & pigmentation control complex",
  strength: "50g (1.76 oz.)",
  manufacturer: "Lumeva",
  image: LUMEVA_IMAGES[0],
  images: LUMEVA_IMAGES,
  highlights: [
    { label: "Melasma care" },
    { label: "Pigmentation control" },
    { label: "Even tone" },
    { label: "Daily use" },
  ],
  ingredients: [
    { name: "Brightening Actives", blurb: "Helps fade dull, uneven patches" },
    { name: "Tone Correctors", blurb: "Supports clearer-looking skin" },
    { name: "Soothing Base", blurb: "Comforts skin during daily use" },
    { name: "Barrier Care", blurb: "Helps maintain soft, balanced skin" },
  ],
  benefits: [
    "Helps control melasma and visible pigmentation",
    "Supports a more even-looking skin tone",
    "Lightweight cream texture for everyday use",
    "Dermatologically recommended",
    "Suitable for all skin types",
  ],
  uses: [
    "Apply a thin layer on clean affected areas",
    "Use as directed in your morning or night routine",
    "Follow with sunscreen during daytime",
  ],
  indications: [
    "Melasma and pigmentation concerns",
    "Uneven skin tone appearance",
  ],
  dosage:
    "Apply a pea-sized amount to clean skin on pigmented areas once or twice daily, or as advised.",
  administration:
    "Use on clean, dry skin. Avoid eye area. Always pair daytime use with sunscreen.",
  precautions: [
    "For external use only",
    "Avoid contact with eyes",
    "Patch test recommended for sensitive skin",
    "Keep out of reach of children",
  ],
  warnings: [
    "Discontinue if irritation develops",
    "Store away from direct sunlight and heat",
  ],
  sideEffects: [
    "Mild temporary dryness or tingling may occur on sensitive skin",
  ],
  storage: "Store in a cool, dry place away from direct sunlight.",
  packaging: "50g airless pump bottle with outer carton",
  shelfLife: "24 months from manufacture when stored as directed",
  variants: [{ name: "50g Pump", strength: "50g" }],
  faq: [
    {
      question: "What is Lumeva Melasma Cream?",
      answer:
        "It is a cream formulated to help with melasma and pigmentation control for a more even-looking complexion.",
    },
    {
      question: "Can I use it during the day?",
      answer:
        "Yes, but always follow with a broad-spectrum sunscreen when used in the daytime.",
    },
    {
      question: "Is it suitable for all skin types?",
      answer: "Yes. It is dermatologically recommended and suitable for all skin types.",
    },
  ],
  relatedSlugs: ["milky-sunscreen-spf-50", "porcelyn-night-cream"],
  price: 549,
  compareAtPrice: 749,
  stock: 100,
  featured: true,
  active: true,
  rating: 4.6,
  reviewCount: 19,
};
