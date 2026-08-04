export const categories = [
  {
    slug: "dermatology",
    name: "Dermatology",
    description:
      "Specialized dermatological solutions for skin conditions, combining clinical efficacy with patient-friendly formulations for optimal skin health.",
    image: "/categories/dermatology.webp",
    heroImage: "/categories/dermatology.webp",
  },
  {
    slug: "skin-care",
    name: "Skin Care",
    description:
      "Sun protection, overnight renewal, and pigmentation care — Milky Sunscreen, Porcelyn Night Cream, and Lumeva Melasma Cream.",
    image: "/product-media/milky-sunscreen/hero.png?v=2",
    heroImage: "/product-media/lumeva-melasma-cream/hero.png?v=2",
  },
  {
    slug: "antibiotics",
    name: "Antibiotics",
    description:
      "Broad-spectrum and targeted antibiotic formulations developed with advanced microbial resistance research, ensuring effective treatment across bacterial infections.",
    image: "/categories/antibiotics.webp",
    heroImage: "/categories/antibiotics.webp",
  },
  {
    slug: "cosmetics",
    name: "Cosmetics",
    description:
      "Premium cosmetic products blending pharmaceutical-grade ingredients with aesthetic science for radiant, healthy skin.",
    image: "/categories/cosmetics.webp",
    heroImage: "/categories/cosmetics.webp",
  },
  {
    slug: "hair-care",
    name: "Hair Care",
    description:
      "Advanced hair care formulations targeting scalp health, hair growth, and damage repair with proven botanical and pharmaceutical actives.",
    image: "/categories/hair-care.webp",
    heroImage: "/categories/hair-care.webp",
  },
  {
    slug: "injectables",
    name: "Injectables",
    description:
      "Sterile injectable formulations manufactured under strict aseptic conditions for hospital and clinical use worldwide.",
    image: "/categories/injectables.webp",
    heroImage: "/categories/injectables.webp",
  },
  {
    slug: "capsules",
    name: "Capsules",
    description:
      "Hard and soft gelatin capsules with precise dosing and enhanced bioavailability for diverse therapeutic applications.",
    image: "/categories/capsules.webp",
    heroImage: "/categories/capsules.webp",
  },
  {
    slug: "tablets",
    name: "Tablets",
    description:
      "Film-coated and uncoated tablets engineered for consistent release profiles and maximum patient compliance.",
    image: "/categories/tablets.webp",
    heroImage: "/categories/tablets.webp",
  },
  {
    slug: "syrups",
    name: "Syrups",
    description:
      "Palatable liquid formulations ideal for pediatric and geriatric patients, with accurate dosing mechanisms.",
    image: "/categories/syrups.webp",
    heroImage: "/categories/syrups.webp",
  },
  {
    slug: "creams",
    name: "Creams",
    description:
      "Topical cream formulations with optimized penetration enhancers for localized therapeutic delivery.",
    image: "/categories/creams.webp",
    heroImage: "/categories/creams.webp",
  },
  {
    slug: "ointments",
    name: "Ointments",
    description:
      "Occlusive ointment bases providing sustained drug release for dermatological and wound care applications.",
    image: "/categories/ointments.webp",
    heroImage: "/categories/ointments.webp",
  },
];

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug);
}

export function getAllCategorySlugs() {
  return categories.map((c) => c.slug);
}
