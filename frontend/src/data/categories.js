export const categories = [
  {
    slug: "skin-care",
    name: "Skin Care",
    description:
      "Sun protection, overnight renewal, and pigmentation care — Milky Sunscreen, Porcelyn Night Cream, and Lumeva Melasma Cream.",
    image: "/product-media/milky-sunscreen/hero.png?v=2",
    heroImage: null,
  },
];

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug);
}

export function getAllCategorySlugs() {
  return categories.map((c) => c.slug);
}
