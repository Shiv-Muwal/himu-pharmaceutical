import { faqs as localFaqs } from "@/data/faq";
import { COMPANY } from "@/lib/constants";

const QUICK_REPLIES = [
  { id: "products", label: "Our products" },
  { id: "order", label: "How to order" },
  { id: "quality", label: "Quality & GMP" },
  { id: "contact", label: "Contact us" },
  { id: "jobs", label: "Jobs / careers" },
];

const INTENT_ANSWERS = {
  products: {
    text: `You can browse our catalog on the Products page — antibiotics, dermatology, skin care, and more. Product pages include composition and usage information for reference.`,
    links: [{ label: "View products", href: "/products" }],
  },
  order: {
    text: `This website is for information. We do not sell prescription medicines for online checkout like a marketplace. For product enquiries or bulk/trade queries, please contact our team.`,
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Products", href: "/products" },
    ],
  },
  quality: {
    text: `HIMU follows WHO-GMP practices with quality checks across manufacturing. See certifications and quality pages for more detail.`,
    links: [
      { label: "Certifications", href: "/certifications" },
      { label: "Quality", href: "/quality" },
    ],
  },
  contact: {
    text: `You can reach HIMU at ${COMPANY.email} or ${COMPANY.phone}. Head office: ${COMPANY.address}.`,
    links: [{ label: "Contact page", href: "/contact" }],
  },
  jobs: {
    text: `Open roles and applications are listed on our Jobs page. You can also apply through the careers form there.`,
    links: [{ label: "View jobs", href: "/jobs" }],
  },
  hello: {
    text: `Hello! I'm the HIMU assistant. Ask about products, quality, jobs, or how to contact us. I don't give medical advice — always consult a qualified doctor.`,
    links: [],
  },
  medical: {
    text: `I can't provide medical advice, dosage decisions, or treatment recommendations. Please speak with a licensed healthcare professional. For product information only, try our Products or FAQ pages.`,
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Products", href: "/products" },
    ],
  },
};

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function scoreFaq(tokens, faq) {
  const hay = `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (hay.includes(t)) score += t.length > 5 ? 2 : 1;
  }
  const qTokens = tokenize(faq.question);
  for (const t of tokens) {
    if (qTokens.includes(t)) score += 3;
  }
  return score;
}

function detectIntent(text) {
  const v = String(text || "").toLowerCase();
  if (/\b(hi|hello|hey|namaste|good\s*(morning|evening|afternoon))\b/.test(v)) {
    return "hello";
  }
  if (
    /\b(dose|dosage|side\s*effect|diagnose|treatment|prescribe|pregnant|fever|pain|tablet\s*kaise|medicine\s*le)\b/.test(
      v,
    )
  ) {
    return "medical";
  }
  if (/\b(job|career|hiring|vacancy|recruit)\b/.test(v)) return "jobs";
  if (/\b(contact|phone|email|address|call|reach)\b/.test(v)) return "contact";
  if (/\b(gmp|who-gmp|quality|certif|iso|fda|license)\b/.test(v)) return "quality";
  if (/\b(order|buy|purchase|cart|checkout|price|sell)\b/.test(v)) return "order";
  if (/\b(product|medicine|catalog|sunscreen|cream|antibiotic)\b/.test(v)) {
    return "products";
  }
  return null;
}

/**
 * @param {string} userText
 * @param {{ faqs?: Array<{question:string,answer:string,category?:string}> }} [opts]
 */
export function getChatbotReply(userText, opts = {}) {
  const faqs = opts.faqs?.length ? opts.faqs : localFaqs;
  const intent = detectIntent(userText);

  if (intent && INTENT_ANSWERS[intent]) {
    const base = INTENT_ANSWERS[intent];
    return {
      text: base.text,
      links: base.links,
      suggestions: QUICK_REPLIES.filter((q) => q.id !== intent).slice(0, 3),
    };
  }

  const tokens = tokenize(userText);
  if (!tokens.length) {
    return {
      text: "Please type a short question — for example about products, quality, jobs, or contact.",
      links: [{ label: "FAQ", href: "/faq" }],
      suggestions: QUICK_REPLIES.slice(0, 4),
    };
  }

  const ranked = faqs
    .map((faq) => ({ faq, score: scoreFaq(tokens, faq) }))
    .filter((r) => r.score >= 3)
    .sort((a, b) => b.score - a.score);

  if (ranked.length) {
    const best = ranked[0].faq;
    return {
      text: best.answer,
      links: [
        { label: "More FAQs", href: "/faq" },
        { label: "Contact", href: "/contact" },
      ],
      suggestions: QUICK_REPLIES.slice(0, 3),
      matchedQuestion: best.question,
    };
  }

  return {
    text: `I couldn't find a close match. Try the FAQ page, browse products, or contact ${COMPANY.email} / ${COMPANY.phone}. Reminder: I don't give medical advice.`,
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Products", href: "/products" },
    ],
    suggestions: QUICK_REPLIES,
  };
}

export function getQuickReplies() {
  return QUICK_REPLIES;
}

export function getWelcomeMessage() {
  return {
    text: `Hi — I'm the HIMU assistant. Ask about products, quality, careers, or contact details. I don't provide medical advice.`,
    links: [
      { label: "Products", href: "/products" },
      { label: "FAQ", href: "/faq" },
    ],
    suggestions: QUICK_REPLIES,
  };
}
