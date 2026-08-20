import { COMPANY } from "@/lib/constants";

export function absUrl(path = "") {
  if (!path) return COMPANY.url;
  if (/^https?:\/\//i.test(path)) return path.replace(/\?.*$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${COMPANY.url}${clean.replace(/\?.*$/, "")}`;
}

function imageList(product) {
  const raw = product.images?.length ? product.images : [product.image];
  return raw.filter(Boolean).map((src) => absUrl(src));
}

export function generateOrganizationSchema() {
  return {
    "@type": ["Organization", "MedicalOrganization"],
    "@id": `${COMPANY.url}/#organization`,
    name: COMPANY.name,
    legalName: "HIMU Pharmaceutical",
    alternateName: COMPANY.shortName,
    description: COMPANY.fullForm,
    url: COMPANY.url,
    logo: {
      "@type": "ImageObject",
      url: absUrl("/logo.png"),
      width: 512,
      height: 512,
    },
    image: absUrl("/logo.png"),
    email: COMPANY.email,
    telephone: COMPANY.phone,
    taxID: COMPANY.cinNumber,
    foundingLocation: "Chirawa, Rajasthan, India",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY.phone,
      email: COMPANY.email,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "38 Ambikanagar, Mandrela Road",
      addressLocality: "Chirawa",
      addressRegion: "Rajasthan",
      postalCode: "333026",
      addressCountry: "IN",
    },
  };
}

export function generateWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${COMPANY.url}/#website`,
    url: COMPANY.url,
    name: COMPANY.name,
    description: COMPANY.tagline,
    inLanguage: "en-IN",
    publisher: { "@id": `${COMPANY.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${COMPANY.url}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateSiteGraphSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [generateOrganizationSchema(), generateWebSiteSchema()],
  };
}

export function generateProductSchema(product) {
  const images = imageList(product);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    image: images,
    sku: product.productId || product.id || product.slug,
    url: absUrl(`/products/${product.slug}`),
    brand: {
      "@type": "Brand",
      name: product.brand || COMPANY.name,
    },
    category: product.category,
    manufacturer: {
      "@type": "Organization",
      name: product.manufacturer || COMPANY.name,
    },
  };

  if (product.price != null) {
    schema.offers = {
      "@type": "Offer",
      url: absUrl(`/products/${product.slug}`),
      priceCurrency: "INR",
      price: String(product.price),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${COMPANY.url}/#organization` },
    };
  }

  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(product.rating),
      reviewCount: String(product.reviewCount),
      bestRating: "5",
      worstRating: "1",
    };
  }

  return schema;
}

export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absUrl(item.url),
    })),
  };
}

export function generateFaqSchema(faqs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateJobPostingSchemas(jobs = []) {
  return jobs.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.jd || job.summary || job.description || job.title,
    datePosted: job.createdAt || new Date().toISOString(),
    employmentType: /intern/i.test(job.type || "")
      ? "INTERN"
      : "FULL_TIME",
    hiringOrganization: {
      "@id": `${COMPANY.url}/#organization`,
      name: COMPANY.name,
      sameAs: COMPANY.url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || "Chirawa",
        addressCountry: "IN",
      },
    },
    identifier: {
      "@type": "PropertyValue",
      name: COMPANY.name,
      value: job.id,
    },
  }));
}

export function generateCollectionSchema(category, products = []) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: absUrl(`/categories/${category.slug}`),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absUrl(`/products/${product.slug}`),
        name: product.name,
      })),
    },
  };
}
