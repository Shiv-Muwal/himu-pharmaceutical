export const categories = [{
  slug: "dermatology",
  name: "Dermatology",
  description: "Specialized dermatological solutions for skin conditions, combining clinical efficacy with patient-friendly formulations for optimal skin health.",
  image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
  heroImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1600&h=600&fit=crop"
}, {
  slug: "skin-care",
  name: "Skin Care",
  description: "Comprehensive skin care range addressing hydration, protection, and rejuvenation with clinically validated active ingredients.",
  image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
  heroImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&h=600&fit=crop"
}, {
  slug: "antibiotics",
  name: "Antibiotics",
  description: "Broad-spectrum and targeted antibiotic formulations developed with advanced microbial resistance research, ensuring effective treatment across bacterial infections.",
  image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop",
  heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=600&fit=crop"
}, {
  slug: "cosmetics",
  name: "Cosmetics",
  description: "Premium cosmetic products blending pharmaceutical-grade ingredients with aesthetic science for radiant, healthy skin.",
  image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop",
  heroImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&h=600&fit=crop"
}, {
  slug: "hair-care",
  name: "Hair Care",
  description: "Advanced hair care formulations targeting scalp health, hair growth, and damage repair with proven botanical and pharmaceutical actives.",
  image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop",
  heroImage: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=1600&h=600&fit=crop"
}, {
  slug: "injectables",
  name: "Injectables",
  description: "Sterile injectable formulations manufactured under strict aseptic conditions for hospital and clinical use worldwide.",
  image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=600&h=600&fit=crop",
  heroImage: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=1600&h=600&fit=crop"
}, {
  slug: "capsules",
  name: "Capsules",
  description: "Hard and soft gelatin capsules with precise dosing and enhanced bioavailability for diverse therapeutic applications.",
  image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop",
  heroImage: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=1600&h=600&fit=crop"
}, {
  slug: "tablets",
  name: "Tablets",
  description: "Film-coated and uncoated tablets engineered for consistent release profiles and maximum patient compliance.",
  image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop",
  heroImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&h=600&fit=crop"
}, {
  slug: "syrups",
  name: "Syrups",
  description: "Palatable liquid formulations ideal for pediatric and geriatric patients, with accurate dosing mechanisms.",
  image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=600&fit=crop",
  heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=600&fit=crop"
}, {
  slug: "creams",
  name: "Creams",
  description: "Topical cream formulations with optimized penetration enhancers for localized therapeutic delivery.",
  image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
  heroImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1600&h=600&fit=crop"
}, {
  slug: "ointments",
  name: "Ointments",
  description: "Occlusive ointment bases providing sustained drug release for dermatological and wound care applications.",
  image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
  heroImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&h=600&fit=crop"
}];
export function getCategoryBySlug(slug) {
  return categories.find(c => c.slug === slug);
}
export function getAllCategorySlugs() {
  return categories.map(c => c.slug);
}
