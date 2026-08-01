import { slugify } from "../utils/helpers.js";

const IMAGES = {
  capsule: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
  tablet: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
  cream: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
  syrup: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&h=800&fit=crop",
  injectable: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=800&fit=crop",
  cosmetic: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop",
  skincare: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop",
  haircare: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop",
};

const categoryBasePrices = {
  antibiotics: 249,
  "skin-care": 399,
  dermatology: 299,
  cosmetics: 599,
  "hair-care": 449,
  capsules: 199,
  tablets: 149,
  syrups: 129,
  injectables: 899,
  ointments: 179,
  creams: 179,
};

const seeds = [
  { name: "HIMU Amoxi 500", category: "Antibiotics", categorySlug: "antibiotics", composition: "Amoxicillin Trihydrate", strength: "500mg", imageKey: "capsule", shortDescription: "Broad-spectrum penicillin antibiotic for bacterial infections." },
  { name: "HIMU Cefix-200", category: "Antibiotics", categorySlug: "antibiotics", composition: "Cefixime", strength: "200mg", imageKey: "tablet", shortDescription: "Third-generation cephalosporin for respiratory tract infections." },
  { name: "HIMU Azithro 500", category: "Antibiotics", categorySlug: "antibiotics", composition: "Azithromycin Dihydrate", strength: "500mg", imageKey: "tablet", shortDescription: "Macrolide antibiotic with extended tissue penetration." },
  { name: "HIMU Cipro 500", category: "Antibiotics", categorySlug: "antibiotics", composition: "Ciprofloxacin Hydrochloride", strength: "500mg", imageKey: "tablet", shortDescription: "Fluoroquinolone for urinary and gastrointestinal infections." },
  { name: "HIMU Doxy 100", category: "Antibiotics", categorySlug: "antibiotics", composition: "Doxycycline Hyclate", strength: "100mg", imageKey: "capsule", shortDescription: "Tetracycline antibiotic for acne and tick-borne diseases." },
  { name: "HIMU Metro 400", category: "Antibiotics", categorySlug: "antibiotics", composition: "Metronidazole", strength: "400mg", imageKey: "tablet", shortDescription: "Antiprotozoal and antibacterial for anaerobic infections." },
  { name: "HIMU Levoflox 750", category: "Antibiotics", categorySlug: "antibiotics", composition: "Levofloxacin", strength: "750mg", imageKey: "tablet", shortDescription: "Respiratory fluoroquinolone for pneumonia and sinusitis." },
  { name: "HIMU Clav 625", category: "Antibiotics", categorySlug: "antibiotics", composition: "Amoxicillin + Clavulanic Acid", strength: "625mg", imageKey: "tablet", shortDescription: "Beta-lactamase inhibitor combination antibiotic." },
  { name: "HIMU SkinCare Cream", category: "Skin Care", categorySlug: "skin-care", composition: "Ceramide Complex + Hyaluronic Acid", strength: "50g", imageKey: "skincare", shortDescription: "Intensive moisturizing cream for dry and sensitive skin." },
  { name: "HIMU Derma Shield", category: "Dermatology", categorySlug: "dermatology", composition: "Zinc Oxide + Calamine", strength: "100g", imageKey: "cream", shortDescription: "Protective barrier cream for irritated and inflamed skin." },
  { name: "HIMU Acne Clear Gel", category: "Dermatology", categorySlug: "dermatology", composition: "Clindamycin + Nicotinamide", strength: "30g", imageKey: "cream", shortDescription: "Topical gel for moderate to severe acne vulgaris." },
  { name: "HIMU Radiance Serum", category: "Cosmetics", categorySlug: "cosmetics", composition: "Vitamin C + Niacinamide", strength: "30ml", imageKey: "cosmetic", shortDescription: "Brightening serum for even skin tone and luminosity." },
  { name: "HIMU Hair Revive Serum", category: "Hair Care", categorySlug: "hair-care", composition: "Minoxidil + Biotin + Caffeine", strength: "60ml", imageKey: "haircare", shortDescription: "Clinically formulated serum for hair regrowth stimulation." },
  { name: "HIMU Vitamin Plus", category: "Capsules", categorySlug: "capsules", composition: "Multivitamin + Minerals", strength: "30 capsules", imageKey: "capsule", shortDescription: "Complete daily multivitamin for overall wellness support." },
  { name: "HIMU Pain Relief 500", category: "Tablets", categorySlug: "tablets", composition: "Paracetamol", strength: "500mg", imageKey: "tablet", shortDescription: "Analgesic and antipyretic for pain and fever management." },
  { name: "HIMU Cough Syrup", category: "Syrups", categorySlug: "syrups", composition: "Dextromethorphan + Guaifenesin", strength: "100ml", imageKey: "syrup", shortDescription: "Expectorant cough syrup for productive and dry cough." },
  { name: "HIMU Ceftriaxone 1g", category: "Injectables", categorySlug: "injectables", composition: "Ceftriaxone Sodium", strength: "1g/vial", imageKey: "injectable", shortDescription: "Third-generation cephalosporin injection for severe infections." },
  { name: "HIMU Wound Ointment", category: "Ointments", categorySlug: "ointments", composition: "Povidone Iodine + Neomycin", strength: "20g", imageKey: "cream", shortDescription: "Antiseptic ointment for wound care and infection prevention." },
];

function buildProduct(seed, index) {
  const slug = slugify(seed.name);
  const image = IMAGES[seed.imageKey];
  const basePrice = categoryBasePrices[seed.categorySlug] || 250;
  const priceOffset = (seed.name.length % 7) * 30 + (index % 5) * 15;
  const price = basePrice + priceOffset;
  const compareAtPrice = Math.round((price * 1.35) / 10) * 10 - 1;
  const rating = Number((4.1 + (index % 9) * 0.1).toFixed(1));
  const reviewCount = 35 + (index % 12) * 17 + (index % 5) * 3;

  return {
    productId: `prod-${String(index + 1).padStart(3, "0")}`,
    slug,
    name: seed.name,
    category: seed.category,
    categorySlug: seed.categorySlug,
    shortDescription: seed.shortDescription,
    description: `${seed.name} is a premium pharmaceutical product manufactured by HIMU Pharmacy under strict GMP guidelines. ${seed.shortDescription}`,
    composition: seed.composition,
    strength: seed.strength,
    manufacturer: "HIMU Pharmacy Pvt. Ltd.",
    image,
    images: [image],
    benefits: ["Clinically validated formulation", "GMP certified manufacturing", "Trusted by healthcare professionals"],
    uses: ["As directed by a physician"],
    indications: ["For therapeutic management"],
    dosage: "As directed by the physician",
    administration: "Take as directed by your physician.",
    precautions: ["Keep out of reach of children"],
    warnings: ["Not for self-medication"],
    sideEffects: ["Mild discomfort in rare cases"],
    storage: "Store in a cool, dry place",
    packaging: "Standard packaging",
    shelfLife: "36 months",
    variants: [{ name: seed.name, strength: seed.strength }],
    faq: [{ question: `What is ${seed.name}?`, answer: `${seed.name} is a high-quality pharmaceutical product by HIMU Pharmacy.` }],
    relatedSlugs: [],
    price,
    compareAtPrice,
    stock: [8, 15, 42, 120, 5, 67, 33, 90, 12, 200][index % 10],
    featured: index % 4 === 0,
    active: true,
    rating,
    reviewCount,
  };
}

export const seedProducts = seeds.map(buildProduct);

export const seedCategories = [
  { slug: "dermatology", name: "Dermatology", description: "Specialized dermatological solutions for skin conditions.", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop", heroImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1600&h=600&fit=crop" },
  { slug: "skin-care", name: "Skin Care", description: "Comprehensive skin care range addressing hydration and protection.", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop", heroImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&h=600&fit=crop" },
  { slug: "antibiotics", name: "Antibiotics", description: "Broad-spectrum antibiotic formulations for bacterial infections.", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop", heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=600&fit=crop" },
  { slug: "cosmetics", name: "Cosmetics", description: "Premium cosmetic products with pharmaceutical-grade ingredients.", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop", heroImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&h=600&fit=crop" },
  { slug: "hair-care", name: "Hair Care", description: "Advanced hair care formulations for scalp health and growth.", image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop", heroImage: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=1600&h=600&fit=crop" },
  { slug: "injectables", name: "Injectables", description: "Sterile injectable formulations for clinical use.", image: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=600&h=600&fit=crop", heroImage: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=1600&h=600&fit=crop" },
  { slug: "capsules", name: "Capsules", description: "Hard and soft gelatin capsules with precise dosing.", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop", heroImage: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=1600&h=600&fit=crop" },
  { slug: "tablets", name: "Tablets", description: "Film-coated tablets for consistent release profiles.", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop", heroImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&h=600&fit=crop" },
  { slug: "syrups", name: "Syrups", description: "Palatable liquid formulations for pediatric patients.", image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=600&fit=crop", heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=600&fit=crop" },
  { slug: "creams", name: "Creams", description: "Topical cream formulations for localized delivery.", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop", heroImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1600&h=600&fit=crop" },
  { slug: "ointments", name: "Ointments", description: "Occlusive ointment bases for dermatological applications.", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop", heroImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&h=600&fit=crop" },
];

export const seedBlogs = [
  { blogId: "blog-001", slug: "breakthrough-antibiotic-research-2025", title: "HIMU Pharmacy Announces Breakthrough in Antibiotic Research", excerpt: "Our research team has developed a novel formulation targeting multi-drug resistant bacterial strains.", content: "HIMU Pharmacy's R&D division has achieved a significant breakthrough in antibiotic research.", category: "Research", author: "Dr. Priya Sharma", date: "2025-11-15", image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=600&fit=crop", readTime: "5 min read" },
  { blogId: "blog-002", slug: "dermatology-innovation-skin-health", title: "Innovations in Dermatology: The Future of Skin Health", excerpt: "Exploring how HIMU's dermatology division is pioneering next-generation topical formulations.", content: "The dermatology landscape is evolving rapidly, and HIMU Pharmacy is at the forefront.", category: "Dermatology", author: "Dr. Ananya Patel", date: "2025-10-28", image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&h=600&fit=crop", readTime: "4 min read" },
  { blogId: "blog-003", slug: "gmp-certification-manufacturing-excellence", title: "HIMU Achieves WHO-GMP Certification for Third Manufacturing Unit", excerpt: "Our newest manufacturing facility in Hyderabad receives WHO-GMP certification.", content: "HIMU Pharmacy is proud to announce WHO-GMP certification for its third manufacturing unit.", category: "Corporate News", author: "Corporate Communications", date: "2025-09-12", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop", readTime: "3 min read" },
];

export const seedFaqs = [
  { faqId: "faq-01", category: "General", question: "What does HIMU stand for?", answer: "HIMU stands for Healthcare Innovation for Medical Upliftment." },
  { faqId: "faq-02", category: "General", question: "Where is HIMU Pharmacy headquartered?", answer: "HIMU Pharmacy is headquartered in Noida, Uttar Pradesh, India." },
  { faqId: "faq-03", category: "Products", question: "How can I find information about a specific medicine?", answer: "Visit our Products page and use the search or category filters." },
  { faqId: "faq-04", category: "Quality", question: "What quality certifications does HIMU hold?", answer: "HIMU Pharmacy holds ISO 9001:2015, WHO-GMP, and FDA certifications." },
  { faqId: "faq-05", category: "Contact", question: "How can I contact HIMU Pharmacy?", answer: "Reach us at info@himupharmacy.com or call +91 1800-123-4567." },
];

export const seedBanners = [
  {
    bannerId: "bnr-derma-01",
    title: "Dermatology care, delivered",
    subtitle: "Clinically trusted creams & topicals — shop HIMU derma first.",
    image: "/banners/banner-derma-care.png",
    link: "/products?category=dermatology",
    ctaLabel: "Shop derma",
    order: 0,
    active: true,
  },
  {
    bannerId: "bnr-wellness-02",
    title: "Everyday wellness deals",
    subtitle: "Stock up on essentials with clear pricing and fast checkout.",
    image: "/banners/banner-wellness-deals.png",
    link: "/products",
    ctaLabel: "Browse deals",
    order: 1,
    active: true,
  },
  {
    bannerId: "bnr-skin-03",
    title: "Skin specialists’ shelf",
    subtitle: "Serums, ointments & skin-care formulated for visible results.",
    image: "/banners/banner-skin-specialists.png",
    link: "/products?category=skin-care",
    ctaLabel: "Shop skin care",
    order: 2,
    active: true,
  },
  {
    bannerId: "bnr-fast-04",
    title: "Care that moves with you",
    subtitle: "Add to cart in seconds — pharmacy-ready packaging, trusted quality.",
    image: "/banners/banner-fast-care.png",
    link: "/products?category=dermatology",
    ctaLabel: "Start shopping",
    order: 3,
    active: true,
  },
];

export const seedOrders = [
  {
    orderId: "HIMU-382910",
    date: "Jul 18, 2026, 4:30 pm",
    customer: { name: "Aarav Sharma", phone: "9876543210", email: "aarav.sharma@example.com", address: "Flat 402, Royal Residency, Sector 15", city: "Noida", pincode: "201301" },
    items: [{ productId: "prod-001", productName: "HIMU Amoxi 500", price: 249, quantity: 2, selectedVariant: "HIMU Amoxi 500" }],
    total: 498,
    paymentMethod: "cod",
    status: "Delivered",
  },
  {
    orderId: "HIMU-194028",
    date: "Jul 19, 2026, 10:15 am",
    customer: { name: "Priya Patel", phone: "9123456789", email: "priya.patel@example.com", address: "12, Green Glen Layout", city: "Bengaluru", pincode: "560103" },
    items: [{ productId: "prod-012", productName: "HIMU Radiance Serum", price: 779, quantity: 1, selectedVariant: "HIMU Radiance Serum" }],
    total: 779,
    paymentMethod: "card",
    status: "Shipped",
  },
];
