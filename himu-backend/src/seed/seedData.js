import { milkySunscreenProduct } from "./milky-sunscreen.js";
import { porcelynNightCreamProduct } from "./porcelyn-night-cream.js";
import { lumevaMelasmaCreamProduct } from "./lumeva-melasma-cream.js";

function toSeedProduct(product) {
  const {
    id: _clientId,
    brand: _brand,
    productType: _type,
    keywords: _keywords,
    ...seedReady
  } = product;
  return seedReady;
}

export const seedProducts = [
  toSeedProduct(milkySunscreenProduct),
  toSeedProduct(porcelynNightCreamProduct),
  toSeedProduct(lumevaMelasmaCreamProduct),
];

export const seedCategories = [
  { slug: "dermatology", name: "Dermatology", description: "Specialized dermatological solutions for skin conditions.", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop", heroImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1600&h=600&fit=crop" },
  { slug: "skin-care", name: "Skin Care", description: "Sun protection, overnight renewal, and pigmentation care — Milky Sunscreen, Porcelyn Night Cream, and Lumeva Melasma Cream.", image: "/products/milky-sunscreen/hero.png", heroImage: "/products/lumeva-melasma-cream/hero.png" },
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
  { blogId: "blog-001", slug: "breakthrough-antibiotic-research-2025", title: "HIMU Pharmacy Announces Breakthrough in Antibiotic Research", excerpt: "Our research team has developed a novel formulation targeting multi-drug resistant bacterial strains.", content: "HIMU Pharmacy's R&D division has achieved a significant breakthrough in antibiotic research, developing a novel formulation that demonstrates enhanced efficacy against multi-drug resistant bacterial strains.", category: "Research", author: "Dr. Priya Sharma", date: "2025-11-15", image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=600&fit=crop", readTime: "5 min read" },
  { blogId: "blog-002", slug: "dermatology-innovation-skin-health", title: "Innovations in Dermatology: The Future of Skin Health", excerpt: "Exploring how HIMU's dermatology division is pioneering next-generation topical formulations.", content: "The dermatology landscape is evolving rapidly, and HIMU Pharmacy is at the forefront with nano-emulsion technology and biomimetic formulations.", category: "Dermatology", author: "Dr. Ananya Patel", date: "2025-10-28", image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&h=600&fit=crop", readTime: "4 min read" },
  { blogId: "blog-003", slug: "gmp-certification-manufacturing-excellence", title: "HIMU Achieves WHO-GMP Certification for Third Manufacturing Unit", excerpt: "Our newest manufacturing facility in Hyderabad receives WHO-GMP certification.", content: "HIMU Pharmacy's third manufacturing unit in Hyderabad has received WHO-GMP certification following a comprehensive international audit.", category: "Corporate News", author: "Corporate Communications", date: "2025-09-12", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop", readTime: "3 min read" },
  { blogId: "blog-004", slug: "understanding-antibiotic-resistance", title: "Understanding Antibiotic Resistance: A Global Health Challenge", excerpt: "An educational overview of antibiotic resistance and HIMU's role in developing solutions.", content: "Antibiotic resistance is one of the most pressing public health challenges of our time. HIMU Pharmacy addresses it through responsible development and stewardship programs.", category: "Healthcare", author: "Dr. Vikram Singh", date: "2025-08-20", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=600&fit=crop", readTime: "6 min read" },
  { blogId: "blog-005", slug: "new-cosmetic-line-launch", title: "HIMU Launches Premium Cosmetic Line with Pharmaceutical-Grade Ingredients", excerpt: "Bridging cosmetics and pharmaceuticals with our new dermocosmetic range.", content: "HIMU Pharmacy unveiled its premium cosmetic line featuring pharmaceutical-grade active ingredients in elegant formulations for integrated skin health.", category: "Medicines", author: "Marketing Team", date: "2025-07-05", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=600&fit=crop", readTime: "4 min read" },
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
    bannerId: "bnr-milky-01",
    title: "Milky Sunscreen SPF 50",
    subtitle: "Lightweight broad-spectrum protection for face & body — no white cast.",
    image: "/banners/banner-milky-sunscreen.png?v=2",
    link: "/products/milky-sunscreen-spf-50",
    ctaLabel: "Shop sunscreen",
    order: 0,
    active: true,
  },
  {
    bannerId: "bnr-porcelyn-02",
    title: "Porcelyn Night Cream",
    subtitle: "The science of overnight renewal — soft, restored skin by morning.",
    image: "/banners/banner-porcelyn-night.png?v=2",
    link: "/products/porcelyn-night-cream",
    ctaLabel: "Shop night cream",
    order: 1,
    active: true,
  },
  {
    bannerId: "bnr-lumeva-03",
    title: "Lumeva Melasma Cream",
    subtitle: "For melasma & pigmentation control — dermatologically recommended.",
    image: "/banners/banner-lumeva-melasma.png?v=2",
    link: "/products/lumeva-melasma-cream",
    ctaLabel: "Shop melasma cream",
    order: 2,
    active: true,
  },
];

export const seedOrders = [
  {
    orderId: "HIMU-382910",
    date: "Jul 18, 2026, 4:30 pm",
    customer: { name: "Aarav Sharma", phone: "9876543210", email: "aarav.sharma@example.com", address: "Flat 402, Royal Residency, Sector 15", city: "Noida", pincode: "201301" },
    items: [{ productId: "prod-001", productName: "Milky Sunscreen SPF 50", price: 499, quantity: 2, selectedVariant: "50g Pump" }],
    total: 998,
    paymentMethod: "cod",
    status: "Delivered",
  },
  {
    orderId: "HIMU-194028",
    date: "Jul 19, 2026, 10:15 am",
    customer: { name: "Priya Patel", phone: "9123456789", email: "priya.patel@example.com", address: "12, Green Glen Layout", city: "Bengaluru", pincode: "560103" },
    items: [{ productId: "prod-001", productName: "Milky Sunscreen SPF 50", price: 499, quantity: 1, selectedVariant: "50g Pump" }],
    total: 499,
    paymentMethod: "card",
    status: "Shipped",
  },
];
