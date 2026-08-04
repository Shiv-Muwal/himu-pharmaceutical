const PORCELYN_IMAGES = [
  "/product-media/porcelyn-night-cream/hero.png?v=2",
  "/product-media/porcelyn-night-cream/box.png",
  "/product-media/porcelyn-night-cream/angle.png",
  "/product-media/porcelyn-night-cream/open.png",
  "/product-media/porcelyn-night-cream/hand.png",
];

export const porcelynNightCreamProduct = {
  productId: "prod-002",
  id: "prod-002",
  slug: "porcelyn-night-cream",
  name: "Porcelyn Night Cream",
  brand: "Porcelyn",
  productType: "night cream",
  tags: ["Paraben free", "Sulphate free", "Cruelty free", "All skin types"],
  keywords: [
    "porcelyn",
    "night cream",
    "overnight renewal",
    "moisturizer",
    "skin care",
    "night moisturizer",
    "renewal cream",
  ],
  category: "Skin Care",
  categorySlug: "skin-care",
  shortDescription:
    "Overnight renewal night cream for all skin types — rich, restorative moisture that works while you sleep.",
  description:
    "Porcelyn Night Cream is formulated for overnight renewal. Its rich cream texture helps nourish and replenish skin while you rest, leaving skin feeling soft, smooth and refreshed by morning. Dermatologically recommended and suitable for all skin types. Pack size 50g (1.76 oz.).",
  composition: "Overnight renewal complex for nightly skin nourishment",
  strength: "50g (1.76 oz.)",
  manufacturer: "Porcelyn",
  image: PORCELYN_IMAGES[0],
  images: PORCELYN_IMAGES,
  highlights: [
    { label: "Overnight renewal" },
    { label: "Rich cream texture" },
    { label: "All skin types" },
    { label: "Night ritual" },
  ],
  ingredients: [
    { name: "Renewal Complex", blurb: "Supports overnight skin recovery" },
    { name: "Nourishing Emollients", blurb: "Locks in overnight moisture" },
    { name: "Soothing Botanicals", blurb: "Calms skin while you sleep" },
    { name: "Barrier Support", blurb: "Helps maintain soft, resilient skin" },
  ],
  benefits: [
    "The science of overnight renewal for softer-looking skin",
    "Rich cream texture that nourishes without heaviness",
    "Dermatologically recommended for nightly use",
    "Suitable for all skin types",
    "Helps skin feel refreshed and comfortable by morning",
  ],
  uses: [
    "Apply as the last step of your night skincare routine",
    "Massage gently onto clean face and neck",
    "Use nightly for best overnight renewal results",
  ],
  indications: [
    "Overnight moisturization and skin comfort",
    "Nightly renewal for dry or tired-looking skin",
  ],
  dosage:
    "Take a pea-sized amount and apply evenly on face and neck every night after cleansing.",
  administration:
    "Use on clean, dry skin. Avoid eye area. Follow with your preferred night routine as needed.",
  precautions: [
    "For external use only",
    "Avoid contact with eyes",
    "Discontinue if irritation occurs",
    "Keep out of reach of children",
  ],
  warnings: [
    "Patch test recommended for sensitive skin",
    "Store away from direct sunlight and heat",
  ],
  sideEffects: [
    "Mild temporary tingling may occur on very sensitive skin",
  ],
  storage: "Store in a cool, dry place away from direct sunlight.",
  packaging: "50g jar with protective outer case",
  shelfLife: "24 months from manufacture when stored as directed",
  variants: [{ name: "50g Jar", strength: "50g" }],
  faq: [
    {
      question: "What is Porcelyn Night Cream?",
      answer:
        "It is an overnight renewal night cream designed to nourish and comfort skin while you sleep.",
    },
    {
      question: "Is it suitable for all skin types?",
      answer: "Yes. It is dermatologically recommended and suitable for all skin types.",
    },
    {
      question: "When should I apply it?",
      answer: "Apply every night as the last step of your skincare routine on clean skin.",
    },
  ],
  relatedSlugs: ["milky-sunscreen-spf-50", "lumeva-melasma-cream"],
  price: 599,
  compareAtPrice: 799,
  stock: 120,
  featured: true,
  active: true,
  rating: 4.7,
  reviewCount: 28,
};
