export const blogPosts = [{
  id: "blog-001",
  slug: "breakthrough-antibiotic-research-2025",
  title: "HIMU Pharmacy Announces Breakthrough in Antibiotic Research",
  excerpt: "Our research team has developed a novel formulation targeting multi-drug resistant bacterial strains, marking a significant milestone in global healthcare.",
  content: `HIMU Pharmacy's Research & Development division has achieved a significant breakthrough in antibiotic research, developing a novel formulation that demonstrates enhanced efficacy against multi-drug resistant bacterial strains.\n\nThe research, conducted over three years at our state-of-the-art laboratories in Noida, involved collaboration with leading microbiologists and infectious disease specialists. Preliminary clinical data shows promising results in treating resistant infections that have limited therapeutic options.\n\n"This breakthrough represents our unwavering commitment to healthcare innovation," said Dr. Rajesh Kumar, Chief Scientific Officer at HIMU Pharmacy. "We believe this formulation could significantly impact patient outcomes globally."\n\nThe company plans to initiate Phase III clinical trials in Q3 2025, with regulatory submissions expected in key markets including India, the EU, and Southeast Asia.`,
  category: "Research",
  author: "Dr. Priya Sharma",
  date: "2025-11-15",
  image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=600&fit=crop",
  readTime: "5 min read"
}, {
  id: "blog-002",
  slug: "dermatology-innovation-skin-health",
  title: "Innovations in Dermatology: The Future of Skin Health",
  excerpt: "Exploring how HIMU's dermatology division is pioneering next-generation topical formulations for chronic skin conditions.",
  content: `The dermatology landscape is evolving rapidly, and HIMU Pharmacy is at the forefront of this transformation. Our dermatology research team has been developing advanced topical delivery systems that enhance drug penetration while minimizing systemic absorption.\n\nRecent innovations include nano-emulsion technology for improved bioavailability of active ingredients, and biomimetic formulations that mimic the skin's natural lipid barrier. These advances are particularly relevant for treating conditions like psoriasis, eczema, and acne.\n\nClinical studies conducted at partner dermatology centers have shown a 40% improvement in patient compliance compared to conventional formulations, primarily due to improved texture, reduced irritation, and faster visible results.`,
  category: "Dermatology",
  author: "Dr. Ananya Patel",
  date: "2025-10-28",
  image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&h=600&fit=crop",
  readTime: "4 min read"
}, {
  id: "blog-003",
  slug: "gmp-certification-manufacturing-excellence",
  title: "HIMU Achieves WHO-GMP Certification for Third Manufacturing Unit",
  excerpt: "Our newest manufacturing facility in Hyderabad receives WHO-GMP certification, expanding global production capacity.",
  content: `HIMU Pharmacy is proud to announce that its third manufacturing unit in Hyderabad has received WHO-GMP certification, following a comprehensive audit by international regulatory authorities.\n\nThe 150,000 sq. ft. facility features automated production lines, advanced quality control laboratories, and environmentally sustainable manufacturing processes. With this certification, HIMU's total production capacity increases by 35%, enabling us to serve more patients across 50+ countries.\n\nThe facility specializes in sterile injectables, oral solid dosages, and topical formulations, supporting our growing portfolio of over 500 medicines.`,
  category: "Corporate News",
  author: "Corporate Communications",
  date: "2025-09-12",
  image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop",
  readTime: "3 min read"
}, {
  id: "blog-004",
  slug: "understanding-antibiotic-resistance",
  title: "Understanding Antibiotic Resistance: A Global Health Challenge",
  excerpt: "An educational overview of antibiotic resistance and HIMU's role in developing solutions for this critical healthcare issue.",
  content: `Antibiotic resistance is one of the most pressing public health challenges of our time. The World Health Organization estimates that by 2050, drug-resistant infections could cause 10 million deaths annually if left unchecked.\n\nAt HIMU Pharmacy, we are actively addressing this challenge through responsible antibiotic development, stewardship programs, and educational initiatives. Our antibiotic portfolio is designed with resistance patterns in mind, and we invest heavily in surveillance research to track emerging resistance trends.\n\nHealthcare professionals and patients alike play a crucial role in combating resistance. Completing prescribed courses, avoiding unnecessary antibiotic use, and practicing good hygiene are essential steps everyone can take.`,
  category: "Healthcare",
  author: "Dr. Vikram Singh",
  date: "2025-08-20",
  image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=600&fit=crop",
  readTime: "6 min read"
}, {
  id: "blog-005",
  slug: "new-cosmetic-line-launch",
  title: "HIMU Launches Premium Cosmetic Line with Pharmaceutical-Grade Ingredients",
  excerpt: "Bridging the gap between cosmetics and pharmaceuticals with our new dermocosmetic range.",
  content: `HIMU Pharmacy today unveiled its premium cosmetic line, featuring pharmaceutical-grade active ingredients in aesthetically elegant formulations. The range includes anti-aging serums, sun protection products, and brightening treatments.\n\nEach product undergoes the same rigorous quality testing as our therapeutic medicines, ensuring safety, efficacy, and consistency. The line is dermatologically tested and free from parabens, sulfates, and artificial fragrances.\n\nAvailable through healthcare professionals and select retail partners, the HIMU cosmetic range represents our vision of integrated skin health solutions.`,
  category: "Medicines",
  author: "Marketing Team",
  date: "2025-07-05",
  image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=600&fit=crop",
  readTime: "4 min read"
}, {
  id: "blog-006",
  slug: "corporate-social-responsibility-2025",
  title: "HIMU's CSR Initiative: Healthcare Access for Underserved Communities",
  excerpt: "Our 2025 corporate social responsibility program brings essential medicines to remote communities across India.",
  content: `Healthcare Innovation for Medical Upliftment is not just our name—it's our mission. In 2025, HIMU Pharmacy launched its largest CSR initiative to date, providing free essential medicines and health camps to underserved communities across 15 states in India.\n\nThe program, in partnership with local NGOs and government health departments, has already reached over 200,000 beneficiaries. Mobile health units equipped with diagnostic tools and medicines travel to remote villages, providing consultations and treatments at no cost.\n\n"We believe quality healthcare is a fundamental right," said Mr. Arjun Mehta, CEO of HIMU Pharmacy. "Our CSR programs reflect our commitment to making healthcare accessible to all."`,
  category: "Corporate News",
  author: "CSR Department",
  date: "2025-06-18",
  image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=600&fit=crop",
  readTime: "5 min read"
}];
export function getBlogBySlug(slug) {
  return blogPosts.find(b => b.slug === slug);
}
export function getAllBlogSlugs() {
  return blogPosts.map(b => b.slug);
}
export const blogCategories = ["All", "Healthcare", "Research", "Medicines", "Dermatology", "Corporate News"];
