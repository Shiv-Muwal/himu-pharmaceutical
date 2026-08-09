import { COMPANY } from "@/lib/constants";
export function generateProductSchema(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: `${COMPANY.url}/products/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: COMPANY.name
    },
    category: product.category,
    manufacturer: {
      "@type": "Organization",
      name: COMPANY.name
    }
  };
}
export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${COMPANY.url}${item.url}`
    }))
  };
}
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.name,
    description: COMPANY.fullForm,
    url: COMPANY.url,
    logo: `${COMPANY.url}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY.phone,
      email: COMPANY.email,
      contactType: "customer service"
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "38 Ambikanagar, Mandrela Road",
      addressLocality: "Chirawa",
      addressRegion: "Rajasthan",
      postalCode: "333026",
      addressCountry: "IN"
    }
  };
}
