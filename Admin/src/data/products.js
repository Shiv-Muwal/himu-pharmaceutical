import { slugify } from "@/lib/utils";
const IMAGES = {
  capsule: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
  tablet: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
  cream: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
  syrup: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&h=800&fit=crop",
  injectable: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=800&fit=crop",
  cosmetic: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop",
  skincare: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop",
  haircare: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop"
};
const seeds = [{
  name: "HIMU Amoxi 500",
  category: "Antibiotics",
  categorySlug: "antibiotics",
  composition: "Amoxicillin Trihydrate",
  strength: "500mg",
  imageKey: "capsule",
  shortDescription: "Broad-spectrum penicillin antibiotic for bacterial infections."
}, {
  name: "HIMU Cefix-200",
  category: "Antibiotics",
  categorySlug: "antibiotics",
  composition: "Cefixime",
  strength: "200mg",
  imageKey: "tablet",
  shortDescription: "Third-generation cephalosporin for respiratory tract infections."
}, {
  name: "HIMU Azithro 500",
  category: "Antibiotics",
  categorySlug: "antibiotics",
  composition: "Azithromycin Dihydrate",
  strength: "500mg",
  imageKey: "tablet",
  shortDescription: "Macrolide antibiotic with extended tissue penetration."
}, {
  name: "HIMU Cipro 500",
  category: "Antibiotics",
  categorySlug: "antibiotics",
  composition: "Ciprofloxacin Hydrochloride",
  strength: "500mg",
  imageKey: "tablet",
  shortDescription: "Fluoroquinolone for urinary and gastrointestinal infections."
}, {
  name: "HIMU Doxy 100",
  category: "Antibiotics",
  categorySlug: "antibiotics",
  composition: "Doxycycline Hyclate",
  strength: "100mg",
  imageKey: "capsule",
  shortDescription: "Tetracycline antibiotic for acne and tick-borne diseases."
}, {
  name: "HIMU Metro 400",
  category: "Antibiotics",
  categorySlug: "antibiotics",
  composition: "Metronidazole",
  strength: "400mg",
  imageKey: "tablet",
  shortDescription: "Antiprotozoal and antibacterial for anaerobic infections."
}, {
  name: "HIMU Levoflox 750",
  category: "Antibiotics",
  categorySlug: "antibiotics",
  composition: "Levofloxacin",
  strength: "750mg",
  imageKey: "tablet",
  shortDescription: "Respiratory fluoroquinolone for pneumonia and sinusitis."
}, {
  name: "HIMU Clav 625",
  category: "Antibiotics",
  categorySlug: "antibiotics",
  composition: "Amoxicillin + Clavulanic Acid",
  strength: "625mg",
  imageKey: "tablet",
  shortDescription: "Beta-lactamase inhibitor combination antibiotic."
}, {
  name: "HIMU SkinCare Cream",
  category: "Skin Care",
  categorySlug: "skin-care",
  composition: "Ceramide Complex + Hyaluronic Acid",
  strength: "50g",
  imageKey: "skincare",
  shortDescription: "Intensive moisturizing cream for dry and sensitive skin."
}, {
  name: "HIMU Derma Shield",
  category: "Dermatology",
  categorySlug: "dermatology",
  composition: "Zinc Oxide + Calamine",
  strength: "100g",
  imageKey: "cream",
  shortDescription: "Protective barrier cream for irritated and inflamed skin."
}, {
  name: "HIMU Acne Clear Gel",
  category: "Dermatology",
  categorySlug: "dermatology",
  composition: "Clindamycin + Nicotinamide",
  strength: "30g",
  imageKey: "cream",
  shortDescription: "Topical gel for moderate to severe acne vulgaris."
}, {
  name: "HIMU Psora Relief",
  category: "Dermatology",
  categorySlug: "dermatology",
  composition: "Calcipotriol + Betamethasone",
  strength: "50g",
  imageKey: "cream",
  shortDescription: "Combination therapy for plaque psoriasis management."
}, {
  name: "HIMU Eczema Care",
  category: "Dermatology",
  categorySlug: "dermatology",
  composition: "Hydrocortisone + Emollient Base",
  strength: "30g",
  imageKey: "cream",
  shortDescription: "Anti-inflammatory cream for atopic dermatitis relief."
}, {
  name: "HIMU Fungal Guard",
  category: "Dermatology",
  categorySlug: "dermatology",
  composition: "Terbinafine Hydrochloride",
  strength: "15g",
  imageKey: "cream",
  shortDescription: "Antifungal cream for tinea and candidal infections."
}, {
  name: "HIMU Radiance Serum",
  category: "Cosmetics",
  categorySlug: "cosmetics",
  composition: "Vitamin C + Niacinamide",
  strength: "30ml",
  imageKey: "cosmetic",
  shortDescription: "Brightening serum for even skin tone and luminosity."
}, {
  name: "HIMU Anti-Age Cream",
  category: "Cosmetics",
  categorySlug: "cosmetics",
  composition: "Retinol + Peptide Complex",
  strength: "50g",
  imageKey: "cosmetic",
  shortDescription: "Advanced anti-aging cream reducing fine lines and wrinkles."
}, {
  name: "HIMU Sun Shield SPF 50",
  category: "Cosmetics",
  categorySlug: "cosmetics",
  composition: "Zinc Oxide + Titanium Dioxide",
  strength: "75ml",
  imageKey: "cosmetic",
  shortDescription: "Broad-spectrum mineral sunscreen for daily protection."
}, {
  name: "HIMU Glow Foundation",
  category: "Cosmetics",
  categorySlug: "cosmetics",
  composition: "Hyaluronic Acid + Light Reflectors",
  strength: "30ml",
  imageKey: "cosmetic",
  shortDescription: "Dermatologically tested foundation with skincare benefits."
}, {
  name: "HIMU Lip Balm Pro",
  category: "Cosmetics",
  categorySlug: "cosmetics",
  composition: "Shea Butter + Vitamin E",
  strength: "4.5g",
  imageKey: "cosmetic",
  shortDescription: "Nourishing lip balm with SPF 15 protection."
}, {
  name: "HIMU Hair Revive Serum",
  category: "Hair Care",
  categorySlug: "hair-care",
  composition: "Minoxidil + Biotin + Caffeine",
  strength: "60ml",
  imageKey: "haircare",
  shortDescription: "Clinically formulated serum for hair regrowth stimulation."
}, {
  name: "HIMU Scalp Therapy",
  category: "Hair Care",
  categorySlug: "hair-care",
  composition: "Ketoconazole + Zinc Pyrithione",
  strength: "100ml",
  imageKey: "haircare",
  shortDescription: "Medicated shampoo for dandruff and seborrheic dermatitis."
}, {
  name: "HIMU Keratin Repair",
  category: "Hair Care",
  categorySlug: "hair-care",
  composition: "Keratin + Argan Oil",
  strength: "200ml",
  imageKey: "haircare",
  shortDescription: "Deep conditioning treatment for damaged hair restoration."
}, {
  name: "HIMU Hair Growth Tonic",
  category: "Hair Care",
  categorySlug: "hair-care",
  composition: "Saw Palmetto + Rosemary Extract",
  strength: "120ml",
  imageKey: "haircare",
  shortDescription: "Natural hair tonic promoting follicle health and density."
}, {
  name: "HIMU Vitamin Plus",
  category: "Capsules",
  categorySlug: "capsules",
  composition: "Multivitamin + Minerals",
  strength: "30 capsules",
  imageKey: "capsule",
  shortDescription: "Complete daily multivitamin for overall wellness support."
}, {
  name: "HIMU Liver Care",
  category: "Capsules",
  categorySlug: "capsules",
  composition: "Silymarin + L-Ornithine L-Aspartate",
  strength: "60 capsules",
  imageKey: "capsule",
  shortDescription: "Hepatoprotective supplement for liver function support."
}, {
  name: "HIMU Omega 3-6-9",
  category: "Capsules",
  categorySlug: "capsules",
  composition: "Fish Oil + Flaxseed + Borage Oil",
  strength: "90 capsules",
  imageKey: "capsule",
  shortDescription: "Essential fatty acids for cardiovascular and brain health."
}, {
  name: "HIMU Immuno Boost",
  category: "Capsules",
  categorySlug: "capsules",
  composition: "Vitamin C + Zinc + Elderberry",
  strength: "60 capsules",
  imageKey: "capsule",
  shortDescription: "Immune system support formula with antioxidant protection."
}, {
  name: "HIMU Joint Flex",
  category: "Capsules",
  categorySlug: "capsules",
  composition: "Glucosamine + Chondroitin + MSM",
  strength: "90 capsules",
  imageKey: "capsule",
  shortDescription: "Joint health supplement for mobility and cartilage support."
}, {
  name: "HIMU Cold Relief",
  category: "Tablets",
  categorySlug: "tablets",
  composition: "Paracetamol + Phenylephrine + Chlorpheniramine",
  strength: "10 tablets",
  imageKey: "tablet",
  shortDescription: "Multi-symptom relief for common cold and flu."
}, {
  name: "HIMU Pain Gel",
  category: "Creams",
  categorySlug: "creams",
  composition: "Diclofenac Diethylamine",
  strength: "30g",
  imageKey: "cream",
  shortDescription: "Topical NSAID gel for musculoskeletal pain relief."
}, {
  name: "HIMU Pain Relief 500",
  category: "Tablets",
  categorySlug: "tablets",
  composition: "Paracetamol",
  strength: "500mg",
  imageKey: "tablet",
  shortDescription: "Analgesic and antipyretic for pain and fever management."
}, {
  name: "HIMU Ibuprofen 400",
  category: "Tablets",
  categorySlug: "tablets",
  composition: "Ibuprofen",
  strength: "400mg",
  imageKey: "tablet",
  shortDescription: "NSAID for inflammation, pain, and fever reduction."
}, {
  name: "HIMU Aspirin 75",
  category: "Tablets",
  categorySlug: "tablets",
  composition: "Acetylsalicylic Acid",
  strength: "75mg",
  imageKey: "tablet",
  shortDescription: "Low-dose antiplatelet for cardiovascular protection."
}, {
  name: "HIMU Metformin 500",
  category: "Tablets",
  categorySlug: "tablets",
  composition: "Metformin Hydrochloride",
  strength: "500mg",
  imageKey: "tablet",
  shortDescription: "First-line oral antidiabetic for type 2 diabetes management."
}, {
  name: "HIMU Atorva 20",
  category: "Tablets",
  categorySlug: "tablets",
  composition: "Atorvastatin Calcium",
  strength: "20mg",
  imageKey: "tablet",
  shortDescription: "Statin for cholesterol management and cardiovascular risk reduction."
}, {
  name: "HIMU Amlodipine 5",
  category: "Tablets",
  categorySlug: "tablets",
  composition: "Amlodipine Besylate",
  strength: "5mg",
  imageKey: "tablet",
  shortDescription: "Calcium channel blocker for hypertension management."
}, {
  name: "HIMU Omeprazole 20",
  category: "Capsules",
  categorySlug: "capsules",
  composition: "Omeprazole",
  strength: "20mg",
  imageKey: "capsule",
  shortDescription: "Proton pump inhibitor for acid reflux and GERD."
}, {
  name: "HIMU Cetirizine 10",
  category: "Tablets",
  categorySlug: "tablets",
  composition: "Cetirizine Hydrochloride",
  strength: "10mg",
  imageKey: "tablet",
  shortDescription: "Non-sedating antihistamine for allergic rhinitis and urticaria."
}, {
  name: "HIMU Cough Syrup",
  category: "Syrups",
  categorySlug: "syrups",
  composition: "Dextromethorphan + Guaifenesin",
  strength: "100ml",
  imageKey: "syrup",
  shortDescription: "Expectorant cough syrup for productive and dry cough."
}, {
  name: "HIMU Pediatric Syrup",
  category: "Syrups",
  categorySlug: "syrups",
  composition: "Paracetamol",
  strength: "60ml",
  imageKey: "syrup",
  shortDescription: "Palatable pediatric formulation for fever and pain in children."
}, {
  name: "HIMU Iron Tonic",
  category: "Syrups",
  categorySlug: "syrups",
  composition: "Ferrous Ascorbate + Folic Acid",
  strength: "200ml",
  imageKey: "syrup",
  shortDescription: "Iron supplement syrup for anemia prevention and treatment."
}, {
  name: "HIMU Antacid Syrup",
  category: "Syrups",
  categorySlug: "syrups",
  composition: "Magaldrate + Simethicone",
  strength: "170ml",
  imageKey: "syrup",
  shortDescription: "Fast-acting antacid for acidity and gas relief."
}, {
  name: "HIMU Ceftriaxone 1g",
  category: "Injectables",
  categorySlug: "injectables",
  composition: "Ceftriaxone Sodium",
  strength: "1g/vial",
  imageKey: "injectable",
  shortDescription: "Third-generation cephalosporin injection for severe infections."
}, {
  name: "HIMU Dexamethasone Inj",
  category: "Injectables",
  categorySlug: "injectables",
  composition: "Dexamethasone Sodium Phosphate",
  strength: "4mg/ml",
  imageKey: "injectable",
  shortDescription: "Corticosteroid injection for inflammatory conditions."
}, {
  name: "HIMU Vitamin B12 Inj",
  category: "Injectables",
  categorySlug: "injectables",
  composition: "Methylcobalamin",
  strength: "1500mcg/ml",
  imageKey: "injectable",
  shortDescription: "Vitamin B12 injection for deficiency and neuropathy."
}, {
  name: "HIMU Insulin Glargine",
  category: "Injectables",
  categorySlug: "injectables",
  composition: "Insulin Glargine",
  strength: "100 IU/ml",
  imageKey: "injectable",
  shortDescription: "Long-acting basal insulin for diabetes mellitus."
}, {
  name: "HIMU Wound Ointment",
  category: "Ointments",
  categorySlug: "ointments",
  composition: "Povidone Iodine + Neomycin",
  strength: "20g",
  imageKey: "cream",
  shortDescription: "Antiseptic ointment for wound care and infection prevention."
}, {
  name: "HIMU Burn Relief",
  category: "Ointments",
  categorySlug: "ointments",
  composition: "Silver Sulfadiazine",
  strength: "25g",
  imageKey: "cream",
  shortDescription: "Topical antimicrobial for burn wound management."
}, {
  name: "HIMU Hemorrhoid Oint",
  category: "Ointments",
  categorySlug: "ointments",
  composition: "Hydrocortisone + Lidocaine",
  strength: "30g",
  imageKey: "cream",
  shortDescription: "Soothing ointment for hemorrhoidal discomfort relief."
}, {
  name: "HIMU Moisturizing Lotion",
  category: "Skin Care",
  categorySlug: "skin-care",
  composition: "Glycerin + Urea + Allantoin",
  strength: "200ml",
  imageKey: "skincare",
  shortDescription: "Daily body lotion for long-lasting skin hydration."
}, {
  name: "HIMU Night Repair",
  category: "Skin Care",
  categorySlug: "skin-care",
  composition: "Retinol + Peptides + Squalane",
  strength: "50ml",
  imageKey: "skincare",
  shortDescription: "Overnight repair serum for skin regeneration and renewal."
}];
const categoryBasePrices = {
  "antibiotics": 249,
  "skin-care": 399,
  "dermatology": 299,
  "cosmetics": 599,
  "hair-care": 449,
  "capsules": 199,
  "tablets": 149,
  "syrups": 129,
  "injectables": 899,
  "ointments": 179
};
function buildProduct(seed, index) {
  const slug = slugify(seed.name);
  const image = IMAGES[seed.imageKey];
  const gallery = [image, IMAGES.capsule, IMAGES.tablet, IMAGES.cream].filter((img, i, arr) => arr.indexOf(img) === i);
  const basePrice = categoryBasePrices[seed.categorySlug] || 250;
  const priceOffset = seed.name.length % 7 * 30 + index % 5 * 15;
  const price = basePrice + priceOffset;
  const compareAtPrice = Math.round(price * 1.35 / 10) * 10 - 1;
  const rating = Number((4.1 + index % 9 * 0.1).toFixed(1));
  const reviewCount = 35 + index % 12 * 17 + index % 5 * 3;
  return {
    id: `prod-${String(index + 1).padStart(3, "0")}`,
    slug,
    name: seed.name,
    category: seed.category,
    categorySlug: seed.categorySlug,
    shortDescription: seed.shortDescription,
    description: `${seed.name} is a premium pharmaceutical product manufactured by HIMU Pharmacy under strict GMP guidelines. ${seed.shortDescription} This formulation combines ${seed.composition} at ${seed.strength} to deliver optimal therapeutic outcomes. Developed through extensive clinical research and quality testing, it represents HIMU's commitment to healthcare innovation and medical upliftment.`,
    composition: seed.composition,
    strength: seed.strength,
    manufacturer: "HIMU Pharmacy Pvt. Ltd.",
    image,
    images: gallery.slice(0, 3),
    benefits: ["Clinically validated formulation", "Manufactured under WHO-GMP standards", "Consistent bioavailability", "Patient-friendly dosing", "Quality assured at every stage"],
    uses: ["As prescribed by a qualified healthcare professional", "Follow recommended dosage guidelines", "Store in appropriate conditions", "Complete the full course when advised"],
    indications: [seed.shortDescription.replace(/\.$/, ""), "Therapeutic management as per clinical guidelines", "Supportive care in combination therapy when indicated"],
    dosage: "Dosage should be determined by a qualified healthcare professional based on patient condition, age, weight, and medical history. Refer to the product information leaflet for general guidance.",
    administration: "Take as directed by your physician. May be taken with or without food unless otherwise specified. Do not crush or chew unless the formulation allows.",
    precautions: ["Inform your doctor about all current medications", "Disclose any known allergies before use", "Use with caution in pregnant or breastfeeding women", "Monitor for adverse reactions during treatment", "Keep out of reach of children"],
    warnings: ["Not for self-medication without medical consultation", "Do not exceed the prescribed dose", "Seek immediate medical attention for severe reactions", "This is demo content for website presentation only"],
    sideEffects: ["Mild gastrointestinal discomfort", "Headache or dizziness (uncommon)", "Skin rash or allergic reaction (rare)", "Consult your physician if symptoms persist"],
    storage: "Store in a cool, dry place below 25°C. Protect from light and moisture. Do not freeze unless specified.",
    packaging: `Available in ${seed.strength} packaging with child-resistant closure`,
    shelfLife: "36 months from date of manufacture when stored as directed",
    variants: [{
      name: seed.name,
      strength: seed.strength
    }, {
      name: `${seed.name} (Economy Pack)`,
      strength: seed.strength
    }],
    faq: [{
      question: `What is ${seed.name} used for?`,
      answer: `${seed.name} is indicated for ${seed.shortDescription.toLowerCase()} Always consult a healthcare professional before use.`
    }, {
      question: "What is the composition?",
      answer: `Each unit contains ${seed.composition} at a strength of ${seed.strength}.`
    }, {
      question: "Are there any side effects?",
      answer: "Like all medicines, side effects may occur. Common effects are generally mild. Consult your doctor if you experience persistent symptoms."
    }, {
      question: "How should I store this product?",
      answer: "Store in a cool, dry place below 25°C, away from direct sunlight and moisture."
    }],
    relatedSlugs: [],
    price,
    compareAtPrice,
    rating,
    reviewCount
  };
}
export const products = seeds.map((seed, index) => buildProduct(seed, index));
products.forEach((product, index) => {
  const related = products.filter(p => p.categorySlug === product.categorySlug && p.slug !== product.slug).slice(0, 4).map(p => p.slug);
  if (related.length < 4) {
    const extras = products.filter(p => p.slug !== product.slug && !related.includes(p.slug)).slice(0, 4 - related.length).map(p => p.slug);
    product.relatedSlugs = [...related, ...extras];
  } else {
    product.relatedSlugs = related;
  }
  void index;
});
export function getProductBySlug(slug) {
  return products.find(p => p.slug === slug);
}
export function getProductsByCategory(categorySlug) {
  return products.filter(p => p.categorySlug === categorySlug);
}
export function getAllProductSlugs() {
  return products.map(p => p.slug);
}
export function searchProducts(query) {
  const q = query.toLowerCase();
  return products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.composition.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
}
